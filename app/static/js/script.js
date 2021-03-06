

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
  .then(function(){
    console.log('SW Registered');
  })
  // $.get('/sw.js')
  //     .done(function() { 
  //         console.log("EXISTE"); 
  //     }).fail(function() { 
  //         console.log("NÃO EXISTE"); 
  //     })
}

try{
	$('.politic_box').each(function(){
		var loc = $(this).find('.politic_img_src').text()
		if (loc.indexOf('http://')==0){
		    loc = loc.replace('http://','https://');
		    $(this).find('.photo_politic').attr("src", loc);
		}
	});
}catch(error){
	console.log("erro");
}

try{
	var loc = $('.politic_img_src_especific').text();
	if (loc.indexOf('http://')==0){
		    loc = loc.replace('http://','https://');
		    $(".photo_especific").attr("src", loc);
		}
}catch(error){
	console.log("erro");
}






$.ajaxQ = (function(){
  var id = 0, Q = {};

  $(document).ajaxSend(function(e, jqx){
    jqx._id = ++id;
    Q[jqx._id] = jqx;
  });
  $(document).ajaxComplete(function(e, jqx){
    delete Q[jqx._id];
  });

  return {
    abortAll: function(){
      var r = [];
      $.each(Q, function(i, jqx){
        r.push(jqx._id);
        jqx.abort();
      });
      return r;
    }
  };

})();




var graphsLoaded = false;
var graphsLoadedResponsive = true;
var isFixed = false;

$( window ).on('load', function() {


	// var str = "[{'id':1,'name':'Test1'},{'id':2,'name':'Test2'}]";
	// var jsonObj = $.parseJSON( str );
	// console.log(jsonObj);
 //    $(window).scrollLeft(0);

	$("#content").css("display", "block");
    $("#line").width($("body").width() * 2);
    $("#line").css("left", - $("body").width() / 2);
    
    $(".menu_container").css("display","none");


    var menu_open = false;

	$(".hamburger").on("click", function(){
		var opacity = menu_open ? 0.0 : 1.0;

		$(".hamburger").toggleClass("change");

		

		if($(window).height() <= $("body").height()){
			$("body").toggleClass("noScroll");
		}
		$(".menu_container").css("height","100vh");	
		//$(window).scrollTop(0);


		/*------*/
		//se a pagina for de um politico especifio não alternar classe para trocar a cor do menu hamburger
		if(window.location.pathname.split("/")[1] != "politician"){
			$(".bar1, .bar2, .bar3 ").toggleClass("bar_p_especific");
		}
		$(".menu_container").fadeTo("fast", opacity, function(){
			if($(this).css("opacity") == 0){
				$(this).css("display","none");				
			}

			menu_open = !menu_open;
		});

		
	})
	
	//Ajuste para correção do scroll no mobile
	$(window).scroll(function() {

		if($(window).scrollTop() >= 0 && $(window).scrollLeft() != 0 ){

			$(window).scrollLeft(0);
		}
	});


	if(window.location.pathname.split("/")[1] == "politician"){
		loadGraphs();
		showHistoryChart(600,240,30,100,30);
	}

	//se for uma pagina de politico específico fazer o request das votação
	if(window.location.pathname.split("/")[1] == "politician"){
		$(".select_year_project_voted").val("2018");
		loadFilteredPolls($(".select_year_project_voted").val());
	}

	

	
	//----------------------------------------------*/

	autoAjustWidthInnerProps("prop");
	autoAjustWidthInnerProps("voted_yes");
	autoAjustWidthInnerProps("voted_no");
	autoAjustWidthInnerProps("voted_abstain");
	autoAjustWidthInnerProps("voted_secret");

	ajustPartyTrendGraphWidth();

	slideProps(0,"prop");
	slideProps(1,"voted_yes");
	slideProps(2,"voted_no");
	slideProps(3,"voted_abstain");
	slideProps(4,"voted_secret");


	filterPropsByYear();

	definePageProps();

	showPoliticanDetails();
	
	var path = window.location.pathname;
	var page = path.split("/").pop();

	if ( page == "know-more" ) {
    	getSVGStructure("https://upload.wikimedia.org/wikipedia/commons/c/c9/Senado_Federal_%28Brasil%29_-_atual.svg" , "#senator_structure");
    	getSVGStructure("https://upload.wikimedia.org/wikipedia/commons/archive/5/5f/20170904010939%21C%C3%A2mara_dos_Deputados_%28Brasil%29_-_atual.svg", "#federal_deputies_structure")
    	getSVGStructure("https://upload.wikimedia.org/wikipedia/commons/1/14/Assembleia_Legislativa_do_Estado_do_CE_-_atual.svg" , "#state_deputies_structure");
	}
	

	changeColorChechedPropVoted();

	/*Responsive script*/
	responsiveChanges();
	responsiveReload();
	var w = $(window).width();
	$(window).resize(function(){
		if ($(window).width()==w) return; 

		 // $.ajaxQ.abortAll();
		  w = $(window).width();	
		 // isFixed = false;
		 // responsiveChanges();
		 // responsiveReload();
		 console.log(w);
		 if(w <= 580){
		 	$("#search_submit").val("");

		 }else{
		 	$("#search_submit").val("Buscar");
		 }
		 
	});

	//correção para a altura da página saiba mais	
	$(".tab_know_more").on("click", function(){
		$(window).scrollLeft(0);

		var selected = $(this).attr("id");

			if(selected != "tab_know_more1"){
				setTimeout(function(){ 
					$('.content_know_more_1').css("display","none");
				}, 300);
				
			}else{
				$('.content_know_more_1').css("display","block");	
			}
	});

	//------------------------

	//feedback de loading para quando o usuário clicar em um político		
	$(".politician_link").on("click",function(e){
		showLoadingFeedback();

	});
	$(".btn_cancelar").on("click",function(e){
		document.location.reload();
		hideLoadingFeedback();
	});
	//----------------------------------------------------------------


	ajustPropositionsStatus();


	$(".time_line_content_inner").mCustomScrollbar({
		theme:"dark",
		mouseWheelPixels: 80,
		scrollInertia: 300
	});


	//Prevenir de o usuário digitar menos de 3 caracteres na busca



	$("#search_bar form").submit(function(e){	    
	    var userInput = $("#search_input").val();
	    if(userInput.length < 3){
	    	$("#alert").removeClass("dsp_none");
	    	e.preventDefault();
	    }

	  });


	//colocando searchbar também no resultado da busca

	if(window.location.pathname.split("/")[1] == 'search'){
		$("#top_content_1 p").attr("class","dsp_none");
		$("#btn_saiba_mais").attr("class","dsp_none");
		btn_saiba_mais
		$("#top_content_1").append('<div id= "search_bar" class="search_bar_specific">\
                <form method="GET" action="search">\
                    <select id="select_item" name="position_field">\
                     <option value="senator">Senador</option>\
                     <option value="federal-deputy">Deputado Federal</option>\
                     <option value="state-deputy">Deputado Estadual</option>\
                 </select>\
                 <input id= "search_input" type="text" name="name_field" placeholder="Nome"> \
                 <input type="submit" value="Buscar" class="btn fill" id="search_submit"> \
                 <div id="alert" class="dsp_none">*Precisa ter ao menos 3 caracteres</div> \
             </form> \
            </div>').css("padding-bottom","30px");
	}
});








