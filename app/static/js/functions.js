function showDonutChart(width, height){
	/*var width = 210,
	    height = 210,*/
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



	 /* g.append("text")
	      .attr("transform", function(d) { 
	        return "translate(" + arc.centroid(d) + ")"; 
	      })
	      .attr("dy", ".35em")
	      .text(function(d) { return d.data.qtd; })
	      .style("font","14px AsapRegular")
		  .style("fill","#424242")*/

		  // svg.append("path")
		  //     // .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
		  //     .attr("d", d3.svg.symbol().type("triangle-up"));


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

	

//var key = function(d){ return d.data.status; };

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

	//$("#show_total_props").text("");	

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


	var offices = ["Presidente","Senador", "Dep. Federal", "Governador", "Dep. Estadual", "Prefeito", "Vereador"];	          
	var years = ["2006","2008","2010","2012","2014","2016","2018"]
	

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
	/*.append("text")
	  .attr("x", 50)
	  .attr("y", 6)
	  .attr("dy", "-1em")
	  .style("text-anchor", "end")
	  .style("text-anchor", "end")
	  //.text("Total: "+ $("#show_total_props").text())
	  .style("font","18px AsapMedium")
	  .style("fill","#B58CEA");

	d3.selectAll(".graph .y .tick line")
	.attr("x2", width );
	d3.selectAll(".graph .y .tick text")
	.attr("x", -4);*/

	d3.selectAll(".graph_history .y .tick line")
	.attr("x2", width );
	d3.selectAll(".graph_history .y .tick text")
		.attr("x", - 5);
		

	//bars = svg.selectAll(".bar").data(data).enter();

	/*
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
		  	});*/
	  
}

	var count = [0,0,0,0,0];
	var pages = [0,0,0,0,0];
	var actualPage = [0,0,0,0,0];

	$(".prop .especific_project_prop").each(function(){
		count[0] ++;
	});
	$(".voted_yes .especific_project_prop").each(function(){
		count[1]++;
	});
	$(".voted_no .especific_project_prop").each(function(){
		count[2]++;
	});
	$(".voted_abstain .especific_project_prop").each(function(){
		count[3]++;
	});
	$(".voted_secret .especific_project_prop").each(function(){
		count[4]++;
	});

	for (var i = 0; i < pages.length; i++) {
		pages[i] = Math.ceil(count[i]/3);
	}
	

	
function slideProps(i, container){

	$("#btn_"+container+"_prev").prop("disabled",true)
				  				.css("filter","opacity(30%)");

	if(pages[i] == 1){
		$("#btn_"+container+"_next").prop("disabled",true)
				  					.css("filter","opacity(30%)");
	}
	$(".project_"+container).stop().animate({scrollLeft: 0 }, 500, 'swing');


	$("#btn_"+container+"_prev").on("click", { goNext: false, index: i, type: container }, buttonClicked);
	$("#btn_"+container+"_next").on("click", { goNext: true, index: i, type: container }, buttonClicked);
}

function slidePropsAdaptResponsive(i, container){
	$("#btn_"+container+"_prev").prop("disabled",true)
				  				.css("filter","opacity(30%)");
				  				
	if(pages[i] == 1 || pages[i] == 0){
		$("#btn_"+container+"_next").prop("disabled",true)
				  					.css("filter","opacity(30%)");
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
		btn1.css("filter","opacity(30%)");
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

			scrollLeft: $("#"+type+"_"+(actualPage[index]*multiplier)).position().left + leftPos - 10

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

	$("."+container + " .especific_project_prop").each(function(){	
		$(this).attr("id", container+"_"+(count - 2));
		count++;
	});

	$("."+container).width(387*count);

	return $(container).width();
}

function ajustPartyTrendGraphWidth(){

	var OuterWidth = $("#party_trend_graph_outer").width();
	var val1 = $("#val1").text();
	var val2 = $("#val2").text();

	var InnerWidth = (OuterWidth * val1) / val2
	$("#party_trend_graph_inner").width(InnerWidth);
}


function getSVGSenatorStructure(){
	
    var svgUrl = "https://upload.wikimedia.org/wikipedia/commons/c/c9/Senado_Federal_%28Brasil%29_-_atual.svg";

    $.get(svgUrl)
    .then(function(xmlDoc){
    	var svg = $(xmlDoc).find("svg");
    	$("#senator_structure").append(svg);
    });

}

function changeColorChechedPropVoted(){
	//seta o SIM para ser o checked default quando a página carregar
	$("input.tabs").first().prop("checked", true);

	//troca as cores do checkbox checked
	$(".labels").on("click", function(){
		$(".labels").each(function(){
			$(this).css("background","transparent");
		});
		switch($(this).attr("id")){
			case "label_yes":
				$(this).css("background","#B0F28C");
				$("#line").css("background", "#B0F28C");
				break;
			case "label_no":
				$(this).css("background","#F28C91");
				$("#line").css("background", "#F28C91");
				break;
			case "label_abstain":
				$(this).css("background","#F4E58C");
				$("#line").css("background", "#F4E58C");
				break;
			case "label_secret":
				$(this).css("background","#948BE8");
				$("#line").css("background", "#948BE8");	
				break;	
				
		}
	});
}

function responsiveChanges(){

	var windowWidth = $(window).width();


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

		$(".prop_desc").trunk8({
			lines: 4
		});

		$(".choice_detailed_yes").text("Propostas concordadas");
		$(".choice_detailed_no").text("Propostas discordadas");
		$(".choice_detailed_abstain").text("Propostas não votadas");
		$(".choice_detailed_secret").text("Sem detalhes divulgados");
  	}else{
  		$(".prop_desc").trunk8({
			lines: 3
		});

		$(".choice_detailed_yes").text("Propostas que o político concordou");
		$(".choice_detailed_no").text("Propostas que o político foi contra");
		$(".choice_detailed_abstain").text("Propostas que o político não votou");
		$(".choice_detailed_secret").text("Votações sem detalhes divulgados");
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


	actualPage = [0,0,0,0,0];
	slidePropsAdaptResponsive(0,"prop");
	slidePropsAdaptResponsive(1,"voted_yes");
	slidePropsAdaptResponsive(2,"voted_no");
	slidePropsAdaptResponsive(3,"voted_abstain");
	slidePropsAdaptResponsive(4,"voted_secret");


	ajustPartyTrendGraphWidth();

}
