
var graphsLoaded = false;


$( window ).on('load', function() {
    $(window).scrollLeft(0);

	$("#content").css("display", "block");

    $("#line").width($("body").width() * 2);
    $("#line").css("left", - $("body").width() / 2);
    
	$(".hamburger").on("click", function(){
		$(".hamburger").toggleClass("change");
	})
	

	$(window).scroll(function() {
		if($(window).scrollTop() >= 0 && $(window).scrollLeft() != 0 ){
			
			$(window).scrollLeft(0);
		}
	});



	//Se a pagina for de um deputado estadual, não mostrar o título de Projetos Propostos;
	//Também carrega os gráficos on load sem precisar do scroll;
	try{
		if( politician_position == "Deputado Estadual"){              
	        $("#project_prop_head").css("display", "none");   
	        loadGraphs();
	    }
    }catch{
    	console.log("não é pagina de politico especifico");
    } 

	
	$(window).scroll(function() {
	    if($(window).scrollTop() >= $(document).height() / 12) {
	    	loadGraphs();
	    }
	});
	
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
	
});






