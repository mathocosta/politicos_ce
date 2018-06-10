
var graphsLoaded = false;


$( window ).on('load', function() {


    $(window).scrollLeft(0);

	$("#content").css("display", "block");
    $("#line").width($("body").width() * 2);
    $("#line").css("left", - $("body").width() / 2);
    
    $(".menu_container").css("display","none")
    					.height($(window).height());

    var menu_open = false;

	$(".hamburger").on("click", function(){
		var opacity = menu_open ? 0.0 : 1.0;

		$(".hamburger").toggleClass("change");


		if($(window).height() <= $("body").height()){
			$("body").toggleClass("noScroll");
		}

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



	//Se a pagina for de um deputado estadual, não mostrar o título de Projetos Propostos;
	//Também carrega os gráficos on load sem precisar do scroll;
	


	// if( $("#cargo").text() == "Deputado Estadual"){              
 //        $("#project_prop_head").css("display", "none");   
 //        loadGraphs();
 //    }
    
	//carrega os gráficos de acordo com um certo valor do scroll	
	loadGraphs();
	// $(window).scroll(function() {
	//     if($(window).scrollTop() >= $(document).height() / 12) {
	//     	loadGraphs();
	//     }
	// });

	
	//se for uma pagina de politico específico fazer o request das votação
	if(window.location.pathname.split("/")[1] == "politician"){
		$(".select_year_project_voted").val("2018");
		loadFilteredPolls($(".select_year_project_voted").val());
	}

	filterPropsByYear();

	definePageProps();
	showHistoryChart();
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

	showPoliticanDetails();
	
	var path = window.location.pathname;
	var page = path.split("/").pop();

	if ( page == "know-more" ) {
    	getSVGStructure("https://upload.wikimedia.org/wikipedia/commons/c/c9/Senado_Federal_%28Brasil%29_-_atual.svg" , "#senator_structure");
    	getSVGStructure("https://upload.wikimedia.org/wikipedia/commons/5/5f/C%C3%A2mara_dos_Deputados_%28Brasil%29_-_atual.svg", "#federal_deputies_structure")
    	getSVGStructure("https://upload.wikimedia.org/wikipedia/commons/1/14/Assembleia_Legislativa_do_Estado_do_CE_-_atual.svg" , "#state_deputies_structure");
	}
	

	changeColorChechedPropVoted();

	/*Responsive script*/
	responsiveChanges();

	var w = $(window).width();
	$(window).resize(function(){
		 // if ($(window).width()==w) return; 
		 // w = $(window).width();		
		 //responsiveChanges();
		 // var wSvg = w*0.05;
		 
	});

	// $(window).bind('resize', function(e)
	// {
	//   if (window.RT) clearTimeout(window.RT);
	//   window.RT = setTimeout(function()
	//   {
	//     document.location.reload(); /* false to get page from cache */
	//   }, 100);
	// });


	if(w <= 800){
		$(".holder_know_more").height($(".content_know_more_1").height() + 400);
		
	}else{
		$(".holder_know_more").height($(".content_know_more_1").height() + 100);
	}
	

	$(window).scroll(function() {
		
	    if($(window).scrollTop() >= offsetTop && w <= 880) {
	    	$(".tab_know_more").css("position","fixed").css("top",0 );	
	    	var hgh = $(".tab_know_more").height() + parseInt($(".tab_know_more").css("padding-top")) + parseInt($(".tab_know_more").css("padding-bottom"));

	    	$("#box_shadow_know_more").css("position","fixed").css("top",0 ).css("left", 0).height(hgh);
	    	$(".line_know_more").css("position","fixed").css("top", hgh );
	    	$("#tab_know_more1").css("left", 0);

	    	var l1 = $("#tab_know_more1").width() + parseInt($(".tab_know_more").css("padding-left") + 1);
	    	
	    	$("#tab_know_more2").css("left", l1);	
	    	var l2 = parseInt($("#tab_know_more2").css("left")) * 2 + 1;
	    	$("#tab_know_more3").css("left", l2);

	    	

	    }else {

	    	$(".tab_know_more").css("position","relative").css("top", "" );
	    	$("#box_shadow_know_more").css("position","absolute").css("top","" ).css("left", "").css("height","100%");
	    	$(".line_know_more").css("position","absolute").css("top", "" );

	    	$("#tab_know_more2").css("left", "");
	    	$("#tab_know_more3").css("left", "");



	    }
	});


	//console.log($(".holder_know_more").height(), $(".content_know_more_1").height() );
	$(".tab_know_more").on("click",function(){
		var selected = $(this).attr("id");
		console.log(selected);

		if(selected == "tab_know_more1"){
			$(".content_know_more_1").css("display","block");
			$(".content_know_more_1").fadeTo(0.3, 1);
			$(".holder_know_more").height($(".content_know_more_1").height() + 200);

		}else if(selected == "tab_know_more2"){
			$(".content_know_more_1").fadeTo(0.3, 0,function(){
				$(this).css("display","none");
			});

			$(".holder_know_more").height($(".content_know_more_2").height() + 220);
		}else{
			$(".content_know_more_1").fadeTo(0.3, 0,function(){
				$(this).css("display","none");
			});
			$(".holder_know_more").height($(".content_know_more_3").height() + 220);	
		}
	});

	var offsetTop = $("#tab_know_more1").offset().top;




	// $(".tab_know_more").css("position","fixed").css("top",0 );	
	// var hgh = $(".tab_know_more").height() + parseInt($(".tab_know_more").css("padding-top")) + parseInt($(".tab_know_more").css("padding-bottom"));
	// console.log($(".tab_know_more").height());
	// $("#box_shadow_know_more").css("position","fixed").css("top",0 ).css("left", 0).height(hgh);
	// $(".line_know_more").css("position","fixed").css("top", hgh );
	// $("#tab_know_more1").css("left", 0);

	// var l1 = $("#tab_know_more1").width() + parseInt($(".tab_know_more").css("padding-left"));
	// console.log(l1);
	
	// $("#tab_know_more2").css("left", l1);	
	// var l2 = parseInt($("#tab_know_more2").css("left")) * 2;
	// $("#tab_know_more3").css("left", l2);		

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
});








