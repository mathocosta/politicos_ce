
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


		console.log($(window).height() , $("body").height() );

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
	


	$(window).scroll(function() {
		if($(window).scrollTop() >= 0 && $(window).scrollLeft() != 0 ){
			
			$(window).scrollLeft(0);
		}
	});



	//Se a pagina for de um deputado estadual, não mostrar o título de Projetos Propostos;
	//Também carrega os gráficos on load sem precisar do scroll;
	
	if( $("#cargo").text() == "Deputado Estadual"){              
        $("#project_prop_head").css("display", "none");   
        loadGraphs();
    }
    

	
	$(window).scroll(function() {
	    if($(window).scrollTop() >= $(document).height() / 12) {
	    	loadGraphs();
	    }
	});
	

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
		if ($(window).width()==w) return; 
		w = $(window).width();
		
		responsiveChanges();

	});

			
	$(".politician_link").on("click",function(e){
		showLoadingFeedback();

	});


	
	$(".btn_cancelar").on("click",function(e){
		hideLoadingFeedback();
	});

});








