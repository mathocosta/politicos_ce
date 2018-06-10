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


    $(window).scrollLeft(0);

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


		/*testando*/
		// (function( win ){
		// 	console.log("ééééé");
		// 	var doc = win.document;
			
		// 	// If there's a hash, or addEventListener is undefined, stop here
		// 	if( !location.hash && win.addEventListener ){
				
		// 		//scroll to 1
		// 		window.scrollTo( 0, 1 );
		// 		var scrollTop = 1,
		// 			getScrollTop = function(){
		// 				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
		// 			},
				
		// 			//reset to 0 on bodyready, if needed
		// 			bodycheck = setInterval(function(){
		// 				if( doc.body ){
		// 					clearInterval( bodycheck );
		// 					scrollTop = getScrollTop();
		// 					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
		// 				}	
		// 			}, 15 );
				
		// 		win.addEventListener( "load", function(){
		// 			setTimeout(function(){
		// 				//at load, if user hasn't scrolled more than 20 or so...
		// 				if( getScrollTop() < 20 ){
		// 					//reset to hide addr bar at onload
		// 					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
		// 				}
		// 			}, 0);
		// 		} );
		// 	}
		// })( this );

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
			console.log("é doido");
			$(window).scrollLeft(0);
		}
	});


	loadGraphs();


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
		if ($(window).width()==w) return; 


		$.ajaxQ.abortAll();
		  w = $(window).width();	
		 isFixed = false;
		 responsiveChanges();
		 responsiveReload();
		 
		 
	});

	//correção para a altura da página saiba mais	
	$(".tab_know_more").on("click", function(){
		$(window).scrollLeft(0);

		var selected = $(this).attr("id");
			console.log(selected);

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

});








