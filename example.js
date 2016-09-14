class SelectBox
{
  constructor(contBox$,template,title,is_priem,maxSel,titleSel,existBox$,selItem=null,classDiv=null,mapFun=[])
  {
    this.is_priem=is_priem;
    this.title=title;
    this.value=selItem;
    this.mapValues=null;
    this.maxSel=maxSel;
    this.typeTemp=template;
    this.titleSel=titleSel || title;
    this.mapFun=mapFun;
    this.loadData();
    if (existBox$!=undefined)
    {
      contBox$=existBox$;
    }
    let boxSel$=$("<div class='"+(classDiv ? classDiv : 'selBox')+"'></div>");
    contBox$.append(boxSel$);
    var spanTit$=this.title ? $(`<span class='titleSel'>${this.title}: </span>`) : '';
    var spanSel$=$(`<span></span>`);
    boxSel$.append(spanTit$);
    boxSel$.append(spanSel$);
    this.boxSel$=boxSel$;
  }
  create_selectBox(selBox)
  {
      this.boxSel$.append(selBox);
      selBox.chosen({
	disable_search_threshold:2,
	placeholder_text_single:`Выберите ${this.titleSel.toLowerCase()}`,
	placeholder_text_multiple: `Выберите ${this.titleSel.toLowerCase()}`,
	max_selected_options:this.maxSel,
	width:"400px"
      }).change(()=>{
	 
	  this.value=selBox.val() || null;this.change_fun();
      });
  }
  change_fun()
  {
    for (let listFun of this.mapFun)
    {
      listFun();
    }
  }
  loadData()
  {
    var formdata = new FormData();
    formdata.append('typeTmpl',this.typeTemp);
    formdata.append('is_priem',this.is_priem);
    formdata.append('selVal',this.value);
    fetch('/dev-bin/priem_mainsystem', {				
		    method: 'post',
		    credentials: 'same-origin',
		    header:{
			      "Accept":"text/html;charset='UTF-8'", 
			      "Content-Type":"multipart/formdata"
			  },
		    body: formdata,	
    }).then((response)=>
    {
      return response.json();
    }).then((data)=>
    {
	this.mapValues=data.values || null;
	this.create_selectBox($(data.selElmt));
    })
  }
}

function pr_strPriem(contBox$,object)////проект структура приема
{
    class CreateNumberBox
    {
      constructor(finForm=null)
      {
	let input$=$("<input type='number' value=0 min=0 />");
	this.value=0;
	this.finForm=finForm;
	this.input$=input$;
	input$.change((e)=> this.change_fun(e.target.value));
      }
      change_fun(updatedVal)
      {
	if (this.finForm!=15)
	{
	    let firstWave=(this.value*80)/100;
	    let secondWave=parseFloat(`0.${updatedVal-firstWave}`);
	   
	    if (this.objWaves!=undefined) this.objWaves.val((firstWave+secondWave)); 
	    else { 
	      this.value=JSON.stringify([firstWave,secondWave])
	    }
	}
	else if this.finForm==15
	{  
	    if (this.objWaves!=undefined) this.objWaves.val(updatedVal); 
	    else { 
	      this.value=JSON.stringify([updatedVal,0]);
	    }
	}
	else 
	{
	  this.value=updatedVal;
	}
      }
      getCountWaves()
      {
	
      }
    }
    var masExam=[];
    let setKrim=0;
    let listExams=function() ////проверка существования экзаменов
    {
       if (Dir.value==null || Prof.value==null || Fil.value==null)
       {
	  return false;
       }
	var formdata = new FormData();
	formdata.append('chExamFils',JSON.stringify(Fil.value));
	formdata.append('chExamDirs',JSON.stringify(Dir.value));
	formdata.append('chExamProfs',JSON.stringify(Prof.value));
	formdata.append("chExamKrim",setKrim);
	fetch('/dev-bin/priem_mainsystem', {				
			method: 'post',
			credentials: 'same-origin',
			header:{
				  "Accept":"text/html;charset='UTF-8'", 
				  "Content-Type":"multipart/formdata"
			      },
			body: formdata,	
	}).then((response)=>
	{
	  return response.json();
	}).then((data)=>
	{
	  
	  examTable$.find(".rowCol").remove();
	  for (let key=0;key<data.length;key++)
	  {
	  
	    examTable$.append("<div class='rowCol cell1'><div class='posCenter'>"+Fil.mapValues[data[key].filial]+"</div></div>");
	    examTable$.append("<div class='rowCol cell3'><div class='posCenter'>"+Dir.mapValues[data[key].dir]+"</div></div>");
	    examTable$.append("<div class='rowCol cell3'><div class='posCenter'>"+Prof.mapValues[data[key].prof]+"</div></div>");
	    
	    let SelBox=new SelectBox(examTable$,"listExam",'',0,0,"набор экзаменов",examTable$,data[key].examSet,'rowCol cell4')
	    let infoExam={ 
	      dir:parseInt(data[key].dir),
	      examSet:data[key].examSet,
	      filial:parseInt(data[key].filial),
	      prof:parseInt(data[key].prof),
	      krim:data[key].krim,
	      selBox:SelBox
	    }  
	    masExam.push(infoExam);
	    
	  }
	})
    }
    let addPriemInfo=function()
    {
	infoAdd$.find(".rowCol").remove();
	if (EduForm.value!=null && FinForm.value!=null && Dir.value !=null && Fil.value !=null)
	{
	    for (let kFil=0;kFil<Fil.value.length;kFil++)
	    {
	      for (let kDir=0;kDir<Dir.value.length;kDir++)
	      {
		  for (let kEdu=0;kEdu<EduForm.value.length;kEdu++)
		  {
		      for (let kFin=0;kFin<FinForm.value.length;kFin++)
		      {
			  
			  let addRowPriem=function(textDiv,className,is_input=0,FormFin=null)
			  {
			    let outDiv$=$("<div class='rowCol "+className+"'></div>");
			    infoAdd$.append(outDiv$);
			    let inDiv$=$("<div class='posCenter'>"+(is_input > 0 ?  '': textDiv)+"</div>");
			    outDiv$.append(inDiv$);
			    if (is_input>0)
			    {
				let InputNum=new CreateNumberBox(FormFin);
				outDiv$.append(InputNum.input$);
				return InputNum;
			    }
			  }
			  let newBox={};
			  
			  addRowPriem(Fil.mapValues[Fil.value[kFil]],"cellSmall",0);
			  addRowPriem(Dir.mapValues[Dir.value[kDir]],"cell1",0);
			  addRowPriem(EduForm.mapValues[EduForm.value[kEdu]],"cellSmall",0);	
			  addRowPriem(FinForm.mapValues[FinForm.value[kFin]],"cell1",0);
			  
			  newBox.count=addRowPriem("Кол-во мест(чел.)",'cellSmall',1,FinForm.value[kFin]);
			 
			  newBox.cost=addRowPriem("Стоимость обучения (руб./сем.)",'cell1',1);
			  newBox.edutime= addRowPriem("Длительность обучения (сем.)",'cellSmall',1);
			  newBox.waves=addRowPriem("Кол-во волн(разбиение)",'cellSmall',1,FinForm.value[kFin]);
			 
			  newBox.count.objWaves=newBox.waves.input$;
			  
			  
			  priemInfo.push(newBox);
		      }
		  }
	      } 
	    } 
	}
      
    }
    let addNewGroup=function(filVal,instVal,dirVal,profVal,eduFVal,finFVal,setKrim,needDoc,examList,priemInfo) ///добавление новой конкурсной групп
    {
	  let checkInput=true;
          for (let key=0;key<examList.length;key++)
	  {
	     if (examList[key].selBox.value==null || examList[key].selBox.value<0)
	     {
	       checkInput=false;
	       break;
	     }
	  }

	  if (checkInput==false)
	  {
	   return false;
	  }
	  
	  var formdata = new FormData();
	  let sendData=
	  {
	    setKrim,needDoc,instVal
	  }
	  
	  console.log(JSON.stringify(priemInfo));
	   console.log(JSON.stringify(examList));
	  formdata.append('addNewGroup',JSON.stringify(sendData));
	  formdata.append('jsonFil',JSON.stringify(filVal));
	  formdata.append('jsonDir',JSON.stringify(dirVal));
	  formdata.append('jsonProf',JSON.stringify(profVal));
	  formdata.append('jsonEduF',JSON.stringify(eduFVal));
	  formdata.append('jsonFinF',JSON.stringify(finFVal));
	  formdata.append('jsonExamList',examList);
	  formdata.append('jsonPriemInfo',JSON.stringify(priemInfo));
	  fetch('/dev-bin/priem_mainsystem', {				
			  method: 'post',
			  credentials: 'same-origin',
			  header:{
				    "Accept":"text/html;charset='UTF-8'", 
				    "Content-Type":"multipart/formdata"
				},
			  body: formdata,	
	  }).then((response)=>
	  {
	    
	  })
    }
    
    
    let Fil=new SelectBox(contBox$,"Filial","Филиал",0,5,null,null,null,null,[listExams,addPriemInfo]);
    let Inst=new SelectBox(contBox$,"Inst","Институт",0,0);
    let Dir=new SelectBox(contBox$,"Dir","Направление подготовки",0,5,null,null,null,null,[listExams,addPriemInfo]);
    let boxDoc$=$("<div class='radioBox'></div>");
    contBox$.append(boxDoc$);
    let Prof=new SelectBox(contBox$,"Prof","Профиль",0,5,null,null,null,null,[listExams]);
    let boxKrim$=$("<div class='radioBox'></div>");
   
    let examTable$=$("<div class='divTable'></div>");
    let examRow$=$("<div class='rowHead cell1'><div class='posCenter'>Филиал</div></div><div class='rowHead cell3'><div class='posCenter'>Направление подготовки</div></div>\
    <div class='rowHead cell3'><div class='posCenter'>Профиль</div></div>\
    <div class='rowHead cell4'><div class='posCenter'>Набор экзаменов</div></div>");
    let spanDoc$=$("<span class='titleSel'>Необходима справка №086 для поступления: </span>");
    let spanKrim$=$("<span class='titleSel'>Конкурсные группы для Крыма: </span>");
    boxKrim$.append(spanKrim$);
    contBox$.append(boxKrim$);
    
    let needDoc=0;
    boxDoc$.append(spanDoc$);
    boxDoc$.append("<span><input  class='radio' name='needDoc' type='radio'  value='1'  id='yes_applkr' /> <label class='yes_answer' for='yes_applkr'>Да</label><input name='needDoc'  class='radio' type='radio'  value='0'   id='no_applkr' checked='true' /> <label class='no_answer' for='no_applkr'>Нет</label></span>");
    boxDoc$.change(function(e){
      needDoc=e.target.value;
    })
      
    contBox$.append(examTable$);
    examTable$.append(examRow$);
    
    boxKrim$.append("<span><input  class='radio' name='KrimStucPriem' type='radio'  value='1'  id='yes_applkr' /> <label class='yes_answer' for='yes_applkr'>Да</label><input name='KrimStucPriem'  class='radio' type='radio'  value='0'   id='no_applkr' checked='true' /> <label class='no_answer' for='no_applkr'>Нет</label></span>");
    boxKrim$.change(function(e){
      setKrim=e.target.value;
      listExams();
    })
    let EduForm=new SelectBox(contBox$,"EduForm","Форма обучения",0,3,"Форму обучения",null,null,null,[addPriemInfo]);
    let FinForm=new SelectBox(contBox$,"FinForm","Форма финансирования",0,3,"Форму финансирования",null,null,null,[addPriemInfo]);
    
    let infoAdd$=$("<div class='divTable'></div>");
    contBox$.append(infoAdd$);
    let priemInfo=[];
    let enrollHead=$("<div class='rowHead cellSmall'><div class='posCenter'>Филиал</div></div>\
    <div class='rowHead cell1'><div class='posCenter'>Направление подготовки</div></div>\
    <div class='rowHead cellSmall'><div class='posCenter'>Форма обучения</div></div>\
    <div class='rowHead cell1'><div class='posCenter'>Форма финансирования</div></div>\
    <div class='rowHead cellSmall'><div class='posCenter'>Кол-во мест (чел.)</div></div>\
    <div class='rowHead cell1'><div class='posCenter'>Стоимость обучения (руб./сем.)</div></div>\
    <div class='rowHead cellSmall'><div class='posCenter'>Длительность обучения (сем.)</div></div>\
    <div class='rowHead cellSmall'><div class='posCenter'>Зачисление по волнам</div></div>");

    infoAdd$.append(enrollHead);
    let sendButton=$("<div hidden class='myButtonBlue'>Добавить прием абитуриентов в ПК-"+(new Date().getFullYear())+"</div>");
    contBox$.append(sendButton);
    sendButton.click(()=>addNewGroup(Fil.value,Inst.value,Dir.value,Prof.value,EduForm.value,FinForm.value,setKrim,needDoc,masExam,priemInfo));
}







/////////// добавление новой вкладки или переключение на существующую
function addTab(title, url){
		var storeBox={};
		if ($('#menu_tabs').tabs('exists', title)){
			$('#menu_tabs').tabs('select', title);
		} else {
			let content$=$(`<div class='projectBox'></div>`);
			$('#menu_tabs').tabs('add',{
				title:title,
				content:content$,
				closable:true
			});	
			return content$;
		}
		
}




///////////////////Выбор пункта главного меню
function set_active_tabs(nameTab,object)
{
  var conteiner$=addTab(nameTab);
  var mapObj=JSON.parse(object);
  if (typeof window[mapObj.project]=="function")
  {
    window[mapObj.project](conteiner$,mapObj);
  }
}


//////////Главное меню/////////////
function loadNav(userName,userId)
{
	  
	FooNav.init({
		classes: 'fon-shadow',
		title:userName,
		smart:false,
		anchors:false,
		items: {
			container: '#content',
			selector: 'h1,h2,h3,h4,h5,h6'
		},
		position: 'fon-top-right',
		theme: 'fon-blue'
	}).ready(function(nav){
			$('#content').empty();
			nav.buttons.append("<a class='fon-button' href='/dev-bin/priem_operator'><span class='fa fa-user' title='Личное дело абитуриента'></span>")
			nav.buttons.append("<a class='fon-button' href='/dev-bin/priem_operator'><span class='fa fa-mainpage' title='Главная страница'></span>")
			nav.buttons.append("<a class='fon-button' href='/dev-bin/priem_operator?exit=1'><span class='fa fa-sign-out' title='Выход'></span>")
		});
		
}


		 
		