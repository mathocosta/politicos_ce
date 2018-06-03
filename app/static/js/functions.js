function showDonutChart(width, height){

	var radius = Math.min(width, height) / 2.2;  
	var color = d3.scale.ordinal()
	    .range(["#B0F28C", "#8ECDED", "#F28C91", "#F4E58C"]);
	var arc = d3.svg.arc()
	    .outerRadius(radius)
	    .innerRadius(radius - (radius*0.5));

	
	var qtd_aproved = $("#aproved").text();
	var qtd_published = $("#published").text();
	var qtd_refused = $("#refused").text();
	var qtd_processing = $("#processing").text();

	var data = [{ status: "Aprovado", qtd: qtd_aproved},
	            { status: "Publicado", qtd: qtd_published},
	            { status: "Recusado", qtd: qtd_refused},
	            { status: "Tramitando", qtd: qtd_processing}];

	var pie = d3.layout.pie()
	    .sort(null)
	    .startAngle(0)
    	.endAngle(2*Math.PI)
	    .value(function(d) { 
	      return d.qtd; 
	    });
    
	var svg = d3.select(".propositions_donut_chart").append("svg")
	    .attr("width", width)
	    .attr("height", height)

	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


	  var g = svg.selectAll(".arc")

	      .data(pie(data))
	      .enter().append("g")
	      .attr("class", "arc");

	    var n = 0;
	      g.append("path")
		      .style("fill", function(d) { return color(d.data.status); })
		      .transition()
			      .ease("sin")
				  .duration(800)
				  .attrTween("d", function(b){
				  	var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  					return function(t) { 
  						return arc(i(t)); 
  					};
				  })
				.each(function(){
					n++;
				})
				.each("end", function(){
					 if(!--n){
				
					 	$(".slices").on("mouseenter",function(){

					 		animateSlicesMouseEnterLeave($(this).attr("id"),radius, arc, true);

					 		var centers = [];

					 		var arcs = pie(data); 
					 		var arcId = d3.select(this.parentNode).attr("id").replace("arc_","");

					 		var qtd = 0;
					 		var statusText = "";
					 		switch(parseInt(arcId)){
					 			case 0:
					 				qtd = parseInt($("#aproved").text());
					 				statusText = "Aprovado";
					 				break;
					 			case 1:
					 				qtd = parseInt($("#published").text());
					 				statusText = "Publicado";
					 				break;
					 			case 2:
					 				qtd = parseInt($("#refused").text());
					 				statusText = "Recusado";
					 				break;
					 			case 3:
					 				qtd = parseInt($("#processing").text());
					 				statusText = "Tramitando";
					 				break;		

					 		}


					 		$(".rect_hover").css("display","block")
					 				  .css("transform", "translate("+arc.centroid(arcs[arcId])[0]+"px ,"+arc.centroid(arcs[arcId])[1]+"px )")
					 				  .text(statusText + ": " + qtd);

					 		
					 		if(arcs[arcId].endAngle <= Math.PI){
					 			$(".rect_hover").css("left","10%");
					 		}else{
					 			$(".rect_hover").css("left","50%");
					 		}		  
					 		
					 	});

					 	$(".slices").on("mouseleave",function(){
					 		animateSlicesMouseEnterLeave($(this).attr("id"),radius, arc, false);

					 		
					 		$(".rect_hover").css("display","none");

					 	});

					 }
				}) ;


	  svg.append("text")
		  .attr("x", 0)
		  .attr("y", 0)
		  .attr("dy", "-0.3em")
		  .style("text-anchor", "middle")
		  .append('svg:tspan')
		  .style("font","13px AsapRegular")
		  .style("fill","#424242")
		  .attr('x', 0)
		  .text($("#show_total_props").text())
		  .append('svg:tspan')
		  .attr('x', 0)
		  .attr('dy', 15)
		  .text("proposições")
	var g = svg.selectAll(".arc path").attr("class", "slices");



	var countArcId = 0;
	var countSliceId = 0;

	$(".arc").each(function(){
		$(this).attr("id","arc_"+countArcId);
		countArcId ++;
	});

	$(".slices").each(function(){
		$(this).attr("id","slice_"+countSliceId);
		countSliceId ++;
	});

}

function animateSlicesMouseEnterLeave(id,radius,arc,isEntering){
	var rOutter = radius;
	var rInner = radius - (radius*0.5);
	if(isEntering){
		rOutter = radius + radius * 0.03;
    	rInner = radius - (radius*0.52);
	}
	arc.outerRadius(rOutter)
	   .innerRadius(rInner);

	var anim = d3.select("#" + id);
	anim.transition()
	  .duration(200)
	  .attr("d", arc)
}

function showBarChart(w, h){

	var margin = {top: 50, right: 30, bottom: 30, left: 30},
	    width = w - margin.left - margin.right ,
	    height = h - margin.top - margin.bottom;
	    	//370,230
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]),
	y1 = d3.scale.linear().domain([20, 80]).range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	// create left yAxis
	var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");
	// create right yAxis
	var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");

	var svg = d3.select(".graph_prop_type").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("class", "graph")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var qtd_pec = $("#qtd_pec").text();

	var qtd_pl = $("#qtd_pl").text();

	var qtd_rcp = $("#qtd_rcp").text();

	var qtd_rem = $("#qtd_rem").text();

	var qtd_222 = $("#qtd_222").text();    

	var data = [{ year: "PEC", qtd: parseInt(qtd_pec)},
	          { year: "PL", qtd: parseInt(qtd_pl)},
	          { year: "RCP", qtd: parseInt(qtd_rcp)},
	          { year: "REM", qtd: parseInt(qtd_rem)},
	          { year: "222", qtd: parseInt(qtd_222)}];


	x.domain(data.map(function(d) { return d.year; }));
	y0.domain([0, d3.max(data, function(d) { return d.qtd + d.qtd*0.2; })]);


	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "y axis axisLeft")
	  .attr("transform", "translate(0,0)")
	  .call(yAxisLeft)
	.append("text")
	  .attr("x", 50)
	  .attr("y", 6)
	  .attr("dy", "-1em")
	  .style("text-anchor", "end")
	  .style("text-anchor", "end")
	  .text("Total: "+ $("#show_total_props").text())
	  .style("font","18px AsapMedium")
	  .style("fill","#B58CEA");

	d3.selectAll(".graph .y .tick line")
	.attr("x2", width );
	d3.selectAll(".graph .y .tick text")
	.attr("x", -4);



	bars = svg.selectAll(".bar").data(data).enter();
	var countIdBars = 0;
	var rectY = function(d) { return y0(d.qtd); };
	var rectH = function(d,i,j) { return height - y0(d.qtd); };
	bars.append("rect")
      .attr("class", "bars")
      .attr("x", function(d) { return x(d.year) + 5; })
      .attr("width", x.rangeBand()/1.2)
      //.attr("y", rectY)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("height", 0)
      .attr("y",  height)
      	.transition()
      	.ease("sin")
      	.duration(800)
      		.attr("y", rectY)
		  	.attr("height", rectH)
		  	.each(function(){
		  		d3.select(this).attr("id","bar_"+countIdBars)
		  		countIdBars ++;
		 	 })
		  	.each("end", function(){
		  		if(!--countIdBars){
			  		$(".bars").on("mouseenter", function(){
			  			animateBarMouseEnterLeave($(this).attr("id"), x ,height, y0, true);
			  		});

			  		$(".bars").on("mouseleave", function(){
			  			animateBarMouseEnterLeave($(this).attr("id"), x, height, y0, false);
			  		});
		  		}
		  	});
	  
}
	

function animateBarMouseEnterLeave(id, x, height, y0, isEntering){

	var anim = d3.select("#"+ id);

	var w = x.rangeBand()/1.2;
	var h = function(d,i,j) { return height - y0(d.qtd); };

	var tw = 0;
	var th = 0;

	if(isEntering){
	  	 w = anim.node().getBBox().width * 1.1;
	  	 h = anim.node().getBBox().height + x.rangeBand()/18;
	  	tw = -(w*0.05);
	  	th = -(x.rangeBand()/36);
  	}

  	anim.transition()
		.duration(200)
		.attr("transform", "translate("+tw +"," + th + ")")
		.attr("width", w)
		.attr("height", h );
}

function showHistoryChart(){

	var margin = {top: 0, right: 30, bottom: 30, left: 100},
	    width = 640 - margin.left - margin.right ,
	    height = 270 - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

	var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]);
	var y = d3.scale.ordinal().rangeRoundBands([0, height]);


	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxisLeft = d3.svg.axis().scale(y).ticks(8).orient("left");

	var svg = d3.select(".graph_history_candidature").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("class", "graph_history")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	// filters go in defs element
	var defs = svg.append("defs");

	// create filter with id #drop-shadow
	// height=130% so that the shadow is not clipped
	var filter = defs.append("filter")
	    .attr("id", "drop-shadow")
	    .attr("width", "1000%")
	    .attr("height", "1000%");
	       
    filter.append("feDropShadow")
    	.attr("dx", 1)
    	.attr("dy", 1)
    	.attr("stdDeviation", 1)
    	.attr("flood-color", "#000")
    	.attr("flood-opacity", 0.15);


	var offices = ["Presidente","Senador", "Dep. Federal", "Governador", "Dep. Estadual", "Prefeito", "Vereador"];	          
	var years = ["2006","2008","2010","2012","2014","2016","2018"];
	

	var data = [{ year: "2006", qtd: -1},
			    {year: "2008", qtd: 2},
		        { year: "2010", qtd: 1},
		        { year: "2012", qtd: -1},
		        { year: "2014", qtd: 1},
		        { year: "2016", qtd: -1},
		         {year: "2018", qtd: 1}];

    var data_filter = [];



    data.forEach(function(d){
    	if(d.qtd != -1){
    		data_filter.push(d);
    	}
    });

	x.domain(years);
	y.domain(offices);

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);


	svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(0,0)")
	  .call(yAxisLeft)

	d3.selectAll(".graph_history .y .tick line")
	.attr("x2", width );
	d3.selectAll(".graph_history .y .tick text")
		.attr("x", - 5);


	bars = svg.selectAll(".bar").data(years).enter();

	var countIdBars = 0;
	//var rectY = function(d) { return y(d.qtd); };
	//var rectH = function(d,i,j) { return height - y(d.qtd); };
	var i = 0;
	var j = 0;
	bars.append("circle")
		 .attr('cx', function(){ 

		 	var posX = -400;
		 	data_filter.forEach(function(d){

		 		if(d.year == years[i]){

		 			posX = x(years[i]) + width/16; 

		 		}
		 	});	

		 	i++;
		 	return posX;
		 })
		     .attr('cy', function(){ 

		     	var posY = 0 ;
		     	data_filter.forEach(function(d){
		     		if(d.year == years[j]){
		     			posY = d.qtd;
		     			console.log(d.qtd);
		     		}
		     	});
		     	
		     	j++;
		     	return  y(offices[posY]) + width/28 ;


		     })
		     .attr('r','11px')
		     .style('fill', '#b0f28c')
		     .attr("filter", "url(#drop-shadow)");
     //  .attr("class", "circles")
     //  .attr("x", function(d) { return x(d.year) + 5; })
     //  .attr("width", x.rangeBand()/1.2)
     //  //.attr("y", rectY)
     //  .attr("rx", 2)
     //  .attr("ry", 2)
     //  .attr("height", 0)
     //  .attr("y",  height)
     //  	.transition()
     //  	.ease("sin")
     //  	.duration(800)
     //  		.attr("y", 50)
		  	// .attr("height", 50);
		  	
	  
}

	var count = [0,0,0,0,0];
	var pages = [0,0,0,0,0];
	var actualPage = [0,0,0,0,0];


function definePageProps(){
	count = [0,0,0,0,0];
	pages = [0,0,0,0,0];
	actualPage = [0,0,0,0,0];
	$(".prop .especific_project_prop").each(function(){
		if($(this).css("display") == "inline-table"){
		count[0] ++;
		}
	});
	$(".voted_yes .especific_project_prop").each(function(){
		if($(this).css("display") == "inline-table"){
			count[1]++;
		}
	});
	$(".voted_no .especific_project_prop").each(function(){
		if($(this).css("display") == "inline-table"){
			count[2]++;
		}
	});
	$(".voted_abstain .especific_project_prop").each(function(){
		if($(this).css("display") == "inline-table"){
			count[3]++;
		}
	});
	$(".voted_secret .especific_project_prop").each(function(){
		if($(this).css("display") == "inline-table"){
			count[4]++;
		}
	});
	for (var i = 0; i < pages.length; i++) {
		pages[i] = Math.ceil(count[i]/3);
	}
}	

	
function slideProps(i, container){

	$("#btn_"+container+"_prev").prop("disabled",true)
				  				.css("filter","opacity(60%)");

	if(pages[i] == 1){
		$("#btn_"+container+"_next").prop("disabled",true)
				  					.css("filter","opacity(60%)");
	}
	$(".project_"+container).stop().animate({scrollLeft: 0 }, 500, 'swing');


	$("#btn_"+container+"_prev").on("click", { goNext: false, index: i, type: container }, buttonClicked);
	$("#btn_"+container+"_next").on("click", { goNext: true, index: i, type: container }, buttonClicked);
}

function slidePropsAdaptResponsive(i, container){
	$("#btn_"+container+"_prev").prop("disabled",true)
				  				.css("filter","opacity(60%)");
				  				
	if(pages[i] == 1 || pages[i] == 0){
		$("#btn_"+container+"_next").prop("disabled",true)
				  					.css("filter","opacity(60%)");
	}else{
		$("#btn_"+container+"_next").prop("disabled",false)
				  					.css("filter","opacity(100%)");
	}
	$(".project_"+container).stop().scrollLeft(0);
}

function buttonClicked(event){
	
	var btn1;
	var btn2;
	var limit;
	var index = event.data.index
	var type = event.data.type
	if(event.data.goNext == true){

		actualPage[index] ++; 
		limit = pages[index] -1;

		btn1 = $("#btn_"+type+"_next");
		btn2 = $("#btn_"+type+"_prev");

	}else{
		actualPage[index] --;
		btn1 = $("#btn_"+type+"_prev");
		btn2 = $("#btn_"+type+"_next");
		limit = 0;
	}		

	btn1.unbind("click");
	btn2.unbind("click");

	if(actualPage[index] == limit){
		btn1.prop("disabled",true);
		btn1.css("filter","opacity(60%)");
	}else{
		btn1.prop("disabled",false);
		btn1.css("filter","opacity(100%)");
		
	}


	if(btn2.prop("disabled")){
		btn2.prop("disabled",false);
		btn2.css("filter","opacity(100%)");
	}

	var leftPos = $(".project_"+type).scrollLeft();


	var windowWidth = $(window).width();
	var multiplier;

	if(windowWidth <= 1360 && windowWidth > 682){
		multiplier = 2
	}else if(windowWidth <= 682){
		multiplier = 1
	}else{
		multiplier = 3
	}

	for (var i = 0; i < pages.length; i++) {
		pages[i] = Math.ceil(count[i]/multiplier);
	}


	var containerProps = $("#"+type+"_"+(actualPage[index]*multiplier));

	if(containerProps.length > 0){

		$(".project_"+type).stop().animate({

			scrollLeft: $("#"+type+"_"+(actualPage[index]*multiplier)).position().left + leftPos -5

		}, 500, 'swing',function(){

			btn1.bind("click", { goNext: event.data.goNext, index: index, type: type }, buttonClicked);
			btn2.bind("click", { goNext: !event.data.goNext, index: index, type: type }, buttonClicked);
		});

	}

}

function showPoliticanDetails(){

	$("#details").on("click", function(){
		$("#info_detail").slideToggle( 400 , function(){

		} );

		$("#info_detail").toggleClass( "info_detail_opacity");

		$("#details img").toggleClass( "rotate_img");

		var text = $('#details span').text();

	    $('#details span').text(
	        text == "Menos detalhes" ? "Mais detalhes" : "Menos detalhes");
		});
}


function autoAjustWidthInnerProps(container){
	var count = 2;
	var width;
	$("."+container + " .especific_project_prop").each(function(){	
		width = parseInt($(this).width()) + 50;
		$(this).attr("id", container+"_"+(count - 2));
		count++;
	});
	
	$("."+container).width(width*count);

	return $(container).width();
}

function ajustPartyTrendGraphWidth(){

	var OuterWidth = $("#party_trend_graph_outer").width();
	var val1 = $("#val1").text();
	var val2 = $("#val2").text();

	var InnerWidth = (OuterWidth * val1) / val2
	$("#party_trend_graph_inner").width(InnerWidth);
}


function getSVGStructure(url, id){
	
    var svgUrl = url;

    $.get(svgUrl)
    .then(function(xmlDoc){
    	var svg = $(xmlDoc).find("svg");
    	$(id).append(svg);
    });

}

function changeColorChechedPropVoted(){
	//seta o SIM para ser o checked default quando a página carregar
	$("input.tabs").first().prop("checked", true);

	//troca as cores do checkbox checked
	$(".labels").on("click", function(){

		var selected = $(this).attr("id");
		
		

		resetChoiceIconsColors();


		$(".labels").each(function(){
			$(this).css("background","transparent");			
		});
		switch($(this).attr("id")){
			case "label_yes":
				$(this).css("background","#B0F28C");
				$("#line").css("background", "#B0F28C");
				$("#label_yes img").attr("src", "/static/res/icons/white_yes_icon.svg");
				break;
			case "label_no":
				$(this).css("background","#F28C91");
				$("#line").css("background", "#F28C91");
				$("#label_no img").attr("src", "/static/res/icons/white_no_icon.svg");
				break;
			case "label_abstain":
				$(this).css("background","#F4E58C");
				$("#line").css("background", "#F4E58C");
				$("#label_abstain img").attr("src", "/static/res/icons/white_abstain_icon.svg");
				break;
			case "label_secret":
				$(this).css("background","#948BE8");
				$("#line").css("background", "#948BE8");
				$("#label_secret img").attr("src", "/static/res/icons/white_secret_icon.svg");	
				break;	
				
		}
	});
}

function resetChoiceIconsColors(){
	$("#label_yes img").attr("src", "/static/res/icons/color_yes_icon.svg");
	$("#label_no img").attr("src", "/static/res/icons/color_no_icon.svg");
	$("#label_abstain img").attr("src", "/static/res/icons/color_abstain_icon.svg");
	$("#label_secret img").attr("src", "/static/res/icons/color_secret_icon.svg");	
}



function loadGraphs(){
    if(!graphsLoaded){
	   //carregar os gráficos

	   $(".box_prop").animate({opacity: 1},500);

       	var windowWidth = $(window).width();

        if(windowWidth <= 410){
       		showDonutChart(windowWidth / 1.8, windowWidth / 1.8);
       		showBarChart(windowWidth,200);
        }else{
        	showDonutChart(210,210);
        	showBarChart(370,230);
        }	

       graphsLoaded = true;

	}
}

function responsiveChanges(){

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	$(".menu_container").height(windowHeight);

  	if(windowWidth <= 490){
  		$(".especific_project_prop").width($(this).width() - 37);
  		$(".prop_desc").width($(this).width() - 60);  	

  	}else if(windowWidth > 490 && windowWidth <= 682) {

  		$(".especific_project_prop").width(450);
  		$(".prop_desc").width(420);

  	}else if(windowWidth > 682 && windowWidth <= 880){

  		$(".especific_project_prop").width(300);
  		$(".prop_desc").width(270);

  	}else{

  		$(".especific_project_prop").width(335);
  		$(".prop_desc").width(300);
  	}

  	if(windowWidth <= 682){

		// $(".prop_desc").dotdotdot({
		// 	height: 55
		// });

		$(".choice_detailed_yes").html("Propostas <br> concordadas");
		$(".choice_detailed_no").html("Propostas <br> discordadas");
		$(".choice_detailed_abstain").html("Propostas <br> não votadas");
		$(".choice_detailed_secret").html("Sem detalhes <br> divulgados");
  	}else{
  //  		$(".prop_desc").dotdotdot({
		// 	height: 55
		// });

		$(".choice_detailed_yes").html("Propostas que o político concordou");
		$(".choice_detailed_no").html("Propostas que o político foi contra");
		$(".choice_detailed_abstain").html("Propostas que o político não votou");
		$(".choice_detailed_secret").html("Votações sem detalhes divulgados");
  	}




	if(graphsLoaded){
	  	if(windowWidth <= 410){
	  		$(".p_donut_chart_outer").empty().append("<div class='propositions_donut_chart'> </div>");
	  		showDonutChart(windowWidth/1.8,windowWidth/1.8);

	  		$(".graph_prop_type_outer").empty().append("<div class='graph_prop_type'> </div>");

	   		showBarChart(windowWidth,200);
	  	} 

	  	if(windowWidth > 410){
	  		$(".p_donut_chart_outer").empty();
	  		$(".p_donut_chart_outer").append("<div class='propositions_donut_chart'> </div>");
	  		showDonutChart(210,210);

	  		$(".graph_prop_type_outer").empty().append("<div class='graph_prop_type'> </div>");	  		
	  		showBarChart(370,230);
	  	}
	}


	autoAjustWidthInnerProps("prop");
	autoAjustWidthInnerProps("voted_yes");
	autoAjustWidthInnerProps("voted_no");
	autoAjustWidthInnerProps("voted_abstain");
	autoAjustWidthInnerProps("voted_secret");

	actualPage = [0,0,0,0,0];
	slidePropsAdaptResponsive(0,"prop");
	slidePropsAdaptResponsive(1,"voted_yes");
	slidePropsAdaptResponsive(2,"voted_no");
	slidePropsAdaptResponsive(3,"voted_abstain");
	slidePropsAdaptResponsive(4,"voted_secret");


	ajustPartyTrendGraphWidth();
}


function filterPropsByYear(){
	
	$(".select_year_project_voted").on('change', function() {
		var year_selected = $(this).val();
		loadFilteredPolls(year_selected);	
	});
}


function loadFilteredPolls(yearSel){
		var politician_id = window.location.pathname.split("/").pop();
		$(".loading_polls").css("display","flex");
		$(".loading_polls_inner h3").text("Carregando votações de " + yearSel);
		$.ajax({
	      type:'GET',
	      url:'/politician/api',
	      async: true,
	      data: {id : politician_id, graph : 3, year: yearSel},

	      dataType:'json',

	      success: function(data) {
	      	$(".loading_polls").css("display","none");
	      	var lenAll =  data.length;
	      	var lenYes = 0;
	      	$(".voted_inner").empty();

	      	for (var i = 0; i < lenAll; i++) {

	      		switch (data[i].vote){
	      			case "Sim":	      					      				
	      				$(".voted_yes").append(
	      					'<div class="especific_project_prop"> \
                            	<div class="prop_status">'+ data[i].result +'</div> \
                            	<h3 class="prop_type_n"> \
                                	<span class="prop_type">'+ data[i].siglum +'</span> n° <span class="prop_n">'+ data[i].number +'</span> \
                            	</h3> \
                            	<div class="prop_desc">'+ data[i].description +'</div> \
                            	<a href='+ data[i].url +' class="prop_details">mais detalhes</a> \
                        	</div>');
	      		      				
	      				break;
	      			case "Não":
	      				$(".voted_no").append(
	      					'<div class="especific_project_prop"> \
                            	<div class="prop_status">'+ data[i].result +'</div> \
                            	<h3 class="prop_type_n"> \
                                	<span class="prop_type">'+ data[i].siglum +'</span> n° <span class="prop_n">'+ data[i].number +'</span> \
                            	</h3> \
                            	<div class="prop_desc">'+ data[i].description +'</div> \
                            	<a href='+ data[i].url +' class="prop_details">mais detalhes</a> \
                        	</div>');
	      				break;	
	      			case "Obstrução":
	      				$(".voted_abstain").append(
	      					'<div class="especific_project_prop"> \
                            	<div class="prop_status">'+ data[i].result +'</div> \
                            	<h3 class="prop_type_n"> \
                                	<span class="prop_type">'+ data[i].siglum +'</span> n° <span class="prop_n">'+ data[i].number +'</span> \
                            	</h3> \
                            	<div class="prop_desc">'+ data[i].description +'</div> \
                            	<a href='+ data[i].url +' class="prop_details">mais detalhes</a> \
                        	</div>');
	      				break;
	      			default:
	      				$(".voted_secret").append(
	      					'<div class="especific_project_prop"> \
                            	<div class="prop_status">'+ data[i].result +'</div> \
                            	<h3 class="prop_type_n"> \
                                	<span class="prop_type">'+ data[i].siglum +'</span> n° <span class="prop_n">'+ data[i].number +'</span> \
                            	</h3> \
                            	<div class="prop_desc">'+ data[i].description +'</div> \
                            	<a href='+ data[i].url +' class="prop_details">mais detalhes</a> \
                        	</div>');
	      				break;		
	      		}

	      	}
	      	definePageProps();
	      	responsiveChanges();
	      	
	      	

	      },
	      error: function(request, status, error) {
	      	$("#loading_polls").css("display","none");
	        console.log(request , status , error);
	      }
	   });
	
}

function toggleNoScroll(){
	if($(window).height() <= $("body").height()){
		$("body").height($(window).height());
		$("body").toggleClass("noScroll");
	}
}

function showLoadingFeedback(){

	toggleNoScroll();
	$(".loading_politician_anim").css("display","flex")
								 .css("opacity", 0)
								 .fadeTo("fast", 1.0);
	
	
	$(window).bind('unload', function(){
		toggleNoScroll();
		$(".loading_politician_anim").fadeTo("fast", 0, function(){
			$(this).css("display","none");
		});
	});

}

function hideLoadingFeedback(){
    
	//toggleNoScroll();
	$(".loading_politician_anim").fadeTo("fast", 0, function(){
		$(this).css("display","none");

	});

}




