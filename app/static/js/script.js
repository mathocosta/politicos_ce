

var backgroundColor = "#fafafa"; 
var lightFillColor = "#ffffff";
var darkFillColor = "#9aed57";
var textColor = "#333333";

var graphsLoaded = false


//Ajustar o svg estrutura do senado



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

	
	$(window).scroll(function() {
    if($(window).scrollTop() >= $(document).height() / 12) {
    	if(!graphsLoaded){
    	   //carregar os gráficos

    	   $(".box_prop").animate({opacity: 1},500);

    	   /*$(".propositions_donut_chart").animate({opacity: 1},600);
    	   $(".graph_prop_type").animate({opacity: 1},600);*/
           


           	var windowWidth = $(window).width();

            if(windowWidth <= 410){

           		showDonutChart(windowWidth / 1.8, windowWidth / 1.8);

           		showBarChart(windowWidth,200);
            }else{
            	showDonutChart(210,210);
            	showBarChart(370,230);
            }	


           graphsLoaded = true;

           /*if($(window).width() <= 410 ){
           		$(".propositions_donut_chart").empty();
           }*/
    	}
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

	// $(".prop_desc").trunk8({
	// 	lines: 3
	// });


	//slideProps();
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



	/*$( window ).resize(function() { 		
  		responsiveChanges();
	});*/

	
	/*var myPrefetchedPage;
	$.ajax({
	  url: "../politic.html",
	  cache: false,
	  success: function(html){
	    myPrefetchedPage = html;
	  }
	})*/

	
});






