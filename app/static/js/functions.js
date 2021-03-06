var finishRequest = false;

function filterStatusByYear(width,height){


	$(".select_year_prop_status").off();
	$(".select_year_prop_status").on('change', function() {
		$(".loading_status").css("display","block");
		var year_selected = $(this).val();
		var politician_id = window.location.pathname.split("/").pop();
		showDonutChart(width, height,year_selected,politician_id);
	});
}

function showDonutChart(width, height,yearSel,p_id){

		console.log("graficos carregados");
		$(".select_year_prop_status").prop("disabled",true).css("opacity", 0.6);
		
		$(".p_donut_chart_outer").empty()
								 .append("<div class='propositions_donut_chart'> <svg width='"+width+"' height='"+height+"'></svg> </div> <div id='rect_hover_props' class='rect_hover'>10</div>");
		// var year_selected = $(this).val();
		// var politician_id = window.location.pathname.split("/").pop();
		var year_selected = yearSel;
		var politician_id = p_id;

		if(year_selected == "Todos"){
			var d18;
			var d17;
			var d16;
			var d15;
			$.when(
			  	$.ajax({
			        type:'GET',
			        url:'/politician/api/',
			        async: true,
			        data: {id : politician_id, graph : 1, year: 2018},

			        dataType:'json',

			        success: function(d) {
			        	console.log("carregou status das proposições de 2018");
			        	d18 = d;
			        },
			        error: function(request, status, error) {
			        	//console.log(request , status , error);
			        }

			    }),

		  		$.ajax({
		  	      type:'GET',
		  	      url:'/politician/api/',
		  	      async: true,
		  	      data: {id : politician_id, graph : 1, year: 2017},

		  	      dataType:'json',

		  	      success: function(d2) {
		  	      	console.log("carregou status das proposições de 2017");
		  	      	d17 = d2;
		  	      },
		  	      error: function(request, status, error) {
		  	      	//console.log(request , status , error);
		  	      }

		  	  	}),

	  			$.ajax({
	  		      type:'GET',
	  		      url:'/politician/api/',
	  		      async: true,
	  		      data: {id : politician_id, graph : 1, year: 2016},

	  		      dataType:'json',

	  		      success: function(d3) {
	  		      	console.log("carregou status das proposições de 2016");
	  		      	d16 = d3;
	  		      },
	  		      error: function(request, status, error) {
	  		      	//console.log(request , status , error);
	  		      }

	  		  	}),

  				$.ajax({
  			      type:'GET',
  			      url:'/politician/api/',
  			      async: true,
  			      data: {id : politician_id, graph : 1, year: 2015},

  			      dataType:'json',

  			      success: function(d4) {
  			      	console.log("carregou status das proposições de 2015");
  			      	d15 = d4;
  			      },
  			      error: function(request, status, error) {
  			      	//console.log(request , status , error);
  			      }

  			  	})

			).then(function() {
				console.log("carregou status de TUDO");
				var dAll = [d18, d17, d16, d15];
				var flattenObj = flattenObject(dAll);
				drawDonutChart(flattenObj, width, height);
			});
		
		}else{

		$.ajax({
	      type:'GET',
	      url:'/politician/api/',
	      async: true,
	      data: {id : politician_id, graph : 1, year: year_selected},

	      dataType:'json',

	    success: function(d) {
	      	drawDonutChart(d, width,height);
		},
	    error: function(request, status, error) {
	    	//console.log(request , status , error);
	    	$(".loading_status").css("display","none");

	    }

	   });

	}

}
function flattenObject(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

function drawDonutChart(d, width, height){
		      	$(".loading_status").css("display","none");
		      	//console.log("success");
		      	$(".propositions_donut_chart").empty();
		      	$(".select_year_prop_status").prop("disabled",false).css("opacity", 1);
				var radius = Math.min(width, height) / 2.2;  
				var color = d3.scale.ordinal()
				    .range(["#B0F28C", "#8ECDED", "#F28C91", "#F4E58C","#B2B2B2"]);
				var arc = d3.svg.arc()
				    .outerRadius(radius)
				    .innerRadius(radius - (radius*0.5));

				var qtd_aproved = 0;
				var qtd_published = 0;
				var qtd_refused = 0;
				var qtd_processing = 0;
				var no_propositions;
				//var statusSimple;
				Object.keys(d).forEach(function(dt){
					var status = dt;
					var statusSimple = status.replace(/ .*/,'');
		
					statusSimple = statusSimple.replace(/[0-9]/g,'');
					statusSimple = statusSimple.replace('.','');

					if( $("#cargo").text() == "Deputado Federal"){ 

						if(statusSimple == "Aguardando"){
			   	   			qtd_aproved += d[dt];
						}
						else if(statusSimple == "Arquivada" || statusSimple == "Devolvida" || statusSimple == "Perdeu" || statusSimple == "Retirado" || statusSimple == "Vetado"){
			   				qtd_refused += d[dt];
						}
						else if(statusSimple == "Enviada"){
							qtd_published += d[dt];	      
						}
						else{
							qtd_processing += d[dt];	    
						}

					}else if( $("#cargo").text() == "Senador"){ 

						color = d3.scale.ordinal().range(["#F4E58C", "#F28C91", "#B2B2B2"]);

						$("#legend_status_prop_inner").empty().append("<div class='circle_status' id='circle_processing'></div><span>Tramitando</span> \
	                                								   <div class='circle_status' id='circle_refused'></div><span>Não tramitando</span>");

						if(statusSimple == "Sim"){
			   	   			qtd_aproved += d[dt];
						}
						else if(statusSimple == "Não"){
			   	   			qtd_refused += d[dt];
						}

					}




				});

				var total_propositions = qtd_aproved + qtd_refused + qtd_published + qtd_processing;

				if(total_propositions == 0){
					no_propositions = 1;
				}else{
					no_propositions = 0;
				}
				
				//console.log("Ap: ", qtd_aproved, "Pub: ", qtd_published,"Tram: ", qtd_processing, "Ref: ", qtd_refused);

				var data = [{ status: "Aprovado", qtd: qtd_aproved},
				            { status: "Publicado", qtd: qtd_published},
				            { status: "Recusado", qtd: qtd_refused},
				            { status: "Tramitando", qtd: qtd_processing},
				            { status: "Sem proposições", qtd: no_propositions}];

				if( $("#cargo").text() == "Senador"){  
					data = [{ status: "Tramitando", qtd: qtd_aproved},
				            { status: "Não Tramitando", qtd: qtd_refused},			           
				            { status: "Sem proposições", qtd: no_propositions}];

				}			            
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
								 		if( $("#cargo").text() == "Deputado Federal"){ 
									 		switch(parseInt(arcId)){
									 			case 0:
									 				qtd = qtd_aproved;
									 				statusText = "Aprovado";
									 				break;
									 			case 1:
									 				qtd = qtd_published;
									 				statusText = "Publicado";
									 				break;
									 			case 2:
									 				qtd = qtd_refused;
									 				statusText = "Recusado";
									 				break;
									 			case 3:
									 				qtd = qtd_processing;
									 				statusText = "Tramitando";
									 				break;		
									 			case 4:
									 				qtd = qtd_processing;
									 				statusText = "Total";
									 				break;		
									 		}
								 		}else if( $("#cargo").text() == "Senador"){
								 			switch(parseInt(arcId)){
								 				case 0:
								 					qtd = qtd_aproved;
								 					statusText = "Tramitando";
								 					break;
								 				case 1:
								 					qtd = qtd_refused;
								 					statusText = "Não tramitando";
								 					break;
								 			}
								 		}

								 		$("#rect_hover_props").css("display","block")
								 				  .css("transform", "translate("+arc.centroid(arcs[arcId])[0]+"px ,"+arc.centroid(arcs[arcId])[1]+"px )")
								 				  .text(statusText + ": " + qtd);

								 		
								 		if(arcs[arcId].endAngle <= Math.PI){
								 			$("#rect_hover_props").css("left","10%");
								 		}else{
								 			$("#rect_hover_props").css("left","50%");
								 		}		  
								 		
								 	});

								 	$(".slices").on("mouseleave",function(){
								 		animateSlicesMouseEnterLeave($(this).attr("id"),radius, arc, false);					 		
								 		$("#rect_hover_props").css("display","none");
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
					  .text(total_propositions)
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

function filterTypeByYear(width,height){
	$(".select_year_prop_type").off();
	$(".select_year_prop_type").on('change', function() {
		$(".loading_type").css("display","block");
		var year_selected = $(this).val();
		var politician_id = window.location.pathname.split("/").pop();
		showBarChart(width, height,year_selected,politician_id);
	});
}

function showBarChart(w, h, year_selected,politician_id){

	$(".select_year_prop_type").prop("disabled",true).css("opacity", 0.6);
	$(".graph_prop_type_outer").empty()
								.append("<div class='graph_prop_type'> <svg width='"+w+"' height='"+h+"'></svg> </div> <div id='rect_hover_type' class='rect_hover'>10</div>");


	if(year_selected == "Todos"){
		var d18;
		var d17;
		var d16;
		var d15;
		$.when(

		  	$.ajax({
		        type:'GET',
		        url:'/politician/api/',
		        async: true,
		        data: {id : politician_id, graph : 2, year: 2018},

		        dataType:'json',

		        success: function(d) {
		        	console.log("carregou proposições de 2018");
		        	d18 = d;
		        },
		        error: function(request, status, error) {
		        	//console.log(request , status , error);
		        }

		    }),

	  		$.ajax({
	  	      type:'GET',
	  	      url:'/politician/api/',
	  	      async: true,
	  	      data: {id : politician_id, graph : 2, year: 2017},

	  	      dataType:'json',

	  	      success: function(d2) {
	  	      	console.log("carregou tipos de proposições de 2017");
	  	      	d17 = d2;
	  	      },
	  	      error: function(request, status, error) {
	  	      	//console.log(request , status , error);
	  	      }

	  	  	}),

  			$.ajax({
  		      type:'GET',
  		      url:'/politician/api/',
  		      async: true,
  		      data: {id : politician_id, graph : 2, year: 2016},

  		      dataType:'json',

  		      success: function(d3) {
  		      	console.log("carregou tipos de proposições de 2016");
  		      	d16 = d3;
  		      },
  		      error: function(request, status, error) {
  		      	//console.log(request , status , error);
  		      }

  		  	}),

				$.ajax({
			      type:'GET',
			      url:'/politician/api/',
			      async: true,
			      data: {id : politician_id, graph : 2, year: 2015},

			      dataType:'json',

			      success: function(d4) {
			      	console.log("carregou tipos de proposições de 2015");
			      	d15 = d4;
			      },
			      error: function(request, status, error) {
			      	//console.log(request , status , error);
			      }

			  	})

		).then(function() {

			var dAll = [d18, d17, d16, d15];
			var flattenObj = flattenObject(dAll);
			drawBarChart(flattenObj,w,h);
		});
	
	}else{	

		$.ajax({
			type:'GET',
			url:'/politician/api/',
			async: true,
			data: {id : politician_id, graph : 2, year: year_selected},

			dataType:'json',

			success: function(d) {
				console.log("carregou tipos de proposições de ", year_selected);
				drawBarChart(d,w,h);

				
				
			},
			error: function(request, status, error) {
				//console.log(request , status , error);
				$(".loading_type").css("display","none");
			}

		});

	}
}
function drawBarChart(d,w,h){
	$(".loading_type").css("display","none");
	$(".graph_prop_type").empty();
	$(".select_year_prop_type").prop("disabled",false).css("opacity", 1);

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


	var qtd_pec = 0;
	var qtd_pl = 0;
	var qtd_rcp = 0;
	var qtd_rem = 0;

	Object.keys(d).forEach(function(dt){
		 var status = dt;
		 status = status.replace(/[0-9]/g,'');
		 status = status.replace('.','');

		if(status == "PEC"){
	   			qtd_pec += d[dt];
		}
		else if(status == "PL"){
	   			qtd_pl += d[dt];
		}
		else if(status == "RCP"){
	   			qtd_rcp += d[dt];
		}
		else if(status == "REM"){
	   			qtd_rem += d[dt];
		}
	});

	var total_propositions = qtd_pec + qtd_pl + qtd_rcp + qtd_rem;



	var data = [{ year: "PEC", qtd: qtd_pec},
	          { year: "PL", qtd: qtd_pl},
	          { year: "RCP", qtd: qtd_rcp},
	          { year: "REM", qtd: qtd_rem}];


	x.domain(data.map(function(d) { return d.year; }));

	if(total_propositions > 0){
		y0.domain([0, d3.max(data, function(d) { return d.qtd + d.qtd*0.3; })]);
	}else{
		y0.domain([0, 5]);
	}

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
	  .text("Total: " + total_propositions)
	  .style("font","18px AsapMedium")
	  .style("fill","#B58CEA");

	d3.selectAll(".graph .y .tick line")
	.attr("x2", width );
	d3.selectAll(".graph .y .tick text")
	.attr("x", -4).attr("class","tick_y");



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
			  			var barId = d3.select(this).attr("id").replace("bar_","");

			  			var qtd = 0;
			  			var typeText = "";

			  			
				  			switch(parseInt(barId)){
				  				case 0:
				  					qtd = data[0].qtd;
				  					typeText = "PEC";
				  					break;
				  				case 1:
				  					qtd = data[1].qtd;
				  					typeText = "PL";
				  					break;
				  				case 2:
				  					qtd = data[2].qtd;
				  					typeText = "RCP";
				  					break;
				  				case 3:
				  					qtd = data[3].qtd;
				  					typeText = "REM";
				  					break;			
				  			}

			  			
			  			var rectX = d3.select(this)[0][0].getBBox().x;
			  			var rectY = d3.select(this)[0][0].getBBox().y;
			  			var rectWidth = d3.select(this)[0][0].getBBox().width;
			  			var rectHeight = d3.select(this)[0][0].getBBox().height;
			  			var r = rectWidth - ($("#rect_hover_type").width() / 2);

		  				$("#rect_hover_type").css("display","block")	
		  					   .css("left", rectX)
		  					   .css("top", rectY)
		  					   .text(qtd)	  					  
		  					   .css("transform", "translate("+ r +"px, 100%)");
		  					  


			  		});

			  		$(".bars").on("mouseleave", function(){
			  			animateBarMouseEnterLeave($(this).attr("id"), x, height, y0, false);
			  			$("#rect_hover_type").css("display","none");
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

function ajustPropositionsStatus(){

	$(".prop_status").each(function(){
		var status = $(this).text();

		var statusSimple = status.replace(/ .*/,'');

		$(this).text(statusSimple);

		if( $("#cargo").text() == "Deputado Federal"){ 

		if(statusSimple == "Aguardando"){
			$(this).css("color","#48E237")
				   .css("border-color","#48E237")
				   .text("Aprovado");
  	   
		}
		else if(statusSimple == "Arquivada" || statusSimple == "Devolvida" || statusSimple == "Perdeu" || statusSimple == "Retirado" || statusSimple == "Vetado"){
			$(this).css("color","#F28C91")
				   .css("border-color","#F28C91")
				   .text("Recusado");
		   
		}
		else if(statusSimple == "Enviada"){
			$(this).css("color","#8ECDED")
				   .css("border-color","#8ECDED")
				   .text("Publicado");
	   
		}
		else{
			$(this).css("color","#F4E58C")
				   .css("border-color","#F4E58C")
				   .text("Tramitando");
	   
		}

		}else if( $("#cargo").text() == "Senador"){ 

			if(statusSimple == "Sim"){
				$(this).css("color","#F4E58C")
					   .css("border-color","#F4E58C")
					   .text("Tramitando");  	   
			}else if(statusSimple == "Não"){
				$(this).css("color","#F28C91")
				   	   .css("border-color","#F28C91")
					   .text("Não tramitando");  	   
			}
		}



	});
}

function showHistoryChart(w,h,m1,m2,m3){


	$('.graph_history_candidature').empty();
	$('.time_line_content_inner').empty();
	var margin = {top: 0, right: m1, bottom: m3, left: m2},
	    width = w - margin.left - margin.right ,
	    height = h - margin.top - margin.bottom;

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
	var years = ["2002","2004","2006","2008","2010","2012","2014","2016","2018"];
	//var color = d3.scale.ordinal().range(["#B0F28C", "#F28C91"]);


	try{


	var json = $("#candidacies").text();

	json = json.replace(/'/g, '"');
	json = json.replace(/True/g, 'true');
	json = json.replace(/False/g, 'false');
	
 
	var candidacies = $.parseJSON( json );
	


	var candidaciesFiltered;
	
	var data = [{year: "2002", qtd: -1, elected: false},
				{year: "2004", qtd: -1, elected: false},
				{year: "2006", qtd: -1, elected: false},
			    { year: "2008", qtd: -1, elected: false},
		        { year: "2010", qtd: -1, elected: false},
		        { year: "2012", qtd: -1, elected: false},
		        { year: "2014", qtd: -1, elected: false},
		        { year: "2016", qtd: -1, elected: false},
		        {year: "2018", qtd: -1 ,elected: false}];

    var data_filter = [];


    var position = $('#cargo').text();

    if(position == "Senador"){
    	candidaciesFiltered = candidacies[0].candidacies;
    }else{
    	candidaciesFiltered = candidacies.candidacies;
    }

    candidaciesFiltered.forEach(function(d){
    	var year_date =  d.date.replace(/-.*/,'');
    	
    	data.forEach(function(data){
    		if(data.year == year_date){

    			if(d.position == "Presidente"){
    				data.qtd = 0;
    			}else if(d.position == "Senador"){
    				data.qtd = 1;
    			}
    			else if(d.position == "Deputado Federal"){
    				data.qtd = 2;	
    			}
    			else if(d.position == "Governador"){
    				data.qtd = 3;	
    				
    			}else if(d.position == "Deputado Estadual"){
    				data.qtd = 4;
    				
    			}else if(d.position == "Prefeito"){
    				data.qtd = 5;
    				
    			}else if(d.position == "Vereador"){
    				data.qtd = 6;
    				
    			}

    			if(d.elected){
    				data.elected = true;
    			}
    		}
    	});
    });
    data.forEach(function(d){
    	if(d.qtd != -1){
    		data_filter.push(d);
    	}
    });

    var dateHash = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var electionRoundHash = ["1° turno", "2° turno"];

    var historyArray = [];
    var datesArray = [];
    var countCandidacies = 0;
    candidaciesFiltered.forEach(function(d){

    	var dateMonth = dateHash[parseInt(d.date.substring(5,7)) - 1];
    	var dateYear = d.date.substring(0,4);
    	var date = [dateYear , dateMonth, d.date.substring(8,10)];
    	var election_round = electionRoundHash[d.election_round - 1];
    	var showElectionRound; 
    	var electedColorClass;

 		// data_filter.forEach(function(data){
 		// 	if(data.year == dateYear){
 		// 		console.log(dateYear);
 		// 	}
 		// });
 		datesArray[countCandidacies] = dateYear;


 		if(d.position == "Presidente" || d.position == "Governador" || d.position == "Prefeito"){
 			showElectionRound = " no " + election_round;
 		}else{
 			showElectionRound = "";
 		}



 		if(parseInt(dateYear) >= 2002 ){
	 		if(d.elected){
	 			electedColorClass = 'circle_time_line_positive';

		 		historyArray[countCandidacies] = '<div class="time_line_container"> <div class="time_line_circles">\
			                                    <div class="circle_status circle_time_line '+ electedColorClass +'" ></div> \
			                                    <span class="breaker">|</span> \
			                                </div> \
			                                <div class="time_line_info"> \
			                                    <h4>Foi eleito <b>'+ d.position + '</b> em</h4> \
			                                    <span>'+date[2] +' de '+ date[1]+' de '+ date[0] + showElectionRound +'</span> \
			                                </div> </div>';

	 		}else{
	 			electedColorClass = 'circle_time_line_negative';

		 		historyArray[countCandidacies] = '<div class="time_line_container"> <div class="time_line_circles">\
			                                    <div class="circle_status circle_time_line '+ electedColorClass +'" ></div> \
			                                    <span class="breaker">|</span> \
			                                </div> \
			                                <div class="time_line_info"> \
			                                    <h4>Tentou eleição para <b>'+ d.position + '</b> em</h4> \
			                                    <span>'+date[2] +' de '+ date[1]+' de '+ date[0] +' mas não se elegeu </span> \
			                                </div> </div>';
	 		}

	 		if(countCandidacies > 0){
		 		if(datesArray[countCandidacies] == datesArray[countCandidacies - 1]){

		 			if(d.elected){
		 			
			 			historyArray[countCandidacies - 1] = '<div class="time_line_container"> <div class="time_line_circles">\
			                                    <div class="circle_status circle_time_line '+ electedColorClass +'" ></div> \
			                                    <span class="breaker">|</span> \
			                                </div> \
			                                <div class="time_line_info"> \
			                                    <h4>Avançou no 1° turno para <b>'+ d.position + '</b> em</h4> \
			                                    <span>'+date[2] +' de '+ date[1]+' de '+ date[0] +' e se elegeu no 2° turno</span> \
			                                </div></div> ';
		               

		            }else{
	    				historyArray[countCandidacies - 1] = '<div class="time_line_container"> <div class="time_line_circles">\
	    	                                   <div class="circle_status circle_time_line '+ electedColorClass +'" ></div> \
	    	                                   <span class="breaker">|</span> \
	    	                               </div> \
	    	                               <div class="time_line_info"> \
	    	                                   <h4>Avançou no 1° turno para <b>'+ d.position + '</b> em</h4> \
	    	                                   <span>'+date[2] +' de '+ date[1]+' de '+ date[0] +' mas não se elegeu no 2° turno</span> \
	    	                               </div></div> ';
		            }  

		            historyArray.splice(countCandidacies,1);               
		 		}	
	 		}

	 		countCandidacies++;

 		}

    	
    });


    for (var i = 0; i <= historyArray.length; i++) {
    	$(".time_line_content_inner").append(historyArray[i]);

    }
    $(".time_line_container").last().find('.time_line_circles').find('.breaker').remove();



    // $(".time_line_content_inner").each(function(){
    // 	console.log($(this));
    // })

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

		 			posX = x(years[i]) + width/20; 

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
		     		}
		     	});
		     	
		     	j++;
		     	return  y(offices[posY]) + width/28 ;


		     })
		     //'#b0f28c'
		     .attr('r', width/45 +'px')
		     .style('fill', function(d){

		     		var color;
		     		data_filter.forEach(function(data){
		     			if(d == data.year){
		     				if(data.elected){
		     					color = '#b0f28c';
		     					return
		     				}else{
		     					color = '#F28C91';
		     					return
		     				}
		     			}
		     			//console.log(data.elected);
		     			// if(data.elected){
		     			// 	color = '#b0f28c';
		     			// 	return
		     			// }else{
		     			// 	color = '#F28C91';
		     			// 	return
		     			// }
		     			//console.log(data);
		     			//color = '#b0f28c';
		     		});
		     		//console.log(d);
		     		//console.log(color(2));
		     		return color;
		     		
		     } )
		     .attr("filter", "url(#drop-shadow)");

	}catch(error){
		$("#history_candidature_container").css("display","none");
		console.log(error);
	}

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
    	svg.attr("viewBox", "0, 0, 360, 185" );
    	svg.removeAttr("width");
    	svg.removeAttr("height");	
    	
    	$(id).append(svg);


    	if(id == '#senator_structure'){
	    	$("#senator_structure svg g").attr("class","senator_graph")
	    	
	    	$('.senator_graph g').each(function(){

	    		var siglum = $(this).attr("id");
	    		var color = $(this).css('fill');

	    		var cadeiras = $("#"+ siglum).find("circle").length;
	    		console.log(siglum,  $("#"+ siglum).find("circle").length);

	    		if(siglum == "SemPartido"){
	    			siglum = "Indep";
	    		}

	    		$('.structure_graph_2_senator').append('<div class="political_party"> \
								                <div id="circle_'+ siglum +'" class="circle_status circle_political_party"></div> \
								                <h3 class="siglum_political_party" >'+ siglum + " - " + cadeiras + '</h3> \
								                </div>');

	    		$("#circle_" + siglum).css("border-color", color);
	    	});

    	}else if(id == '#federal_deputies_structure'){
	    	$("#federal_deputies_structure svg g").attr("class","federal_deputies_graph")
	    	
	    	$('.federal_deputies_graph g').each(function(){
	    		//var parties = ["PCdoB","PRB","PSOL","PV","REDE","PT","AVANTE","PEN","PODE","PPL","PROS","PHS","PSL","PEN","PROS","PHS","PSC",""]
	    		//var siglum_num = $(this).attr("id").replace('Party','');
	    		var siglum = $(this).attr("id");
	    		var color = $(this).css('fill');
	    		var cadeiras = $("#"+ siglum).find("circle").length;
	    		$('.structure_graph_2_federal_deputies').append('<div class="political_party political_party_federal"> \
								                <div id="circle_'+ siglum +'_federal" class="circle_status circle_political_party"></div> \
								                <h3 class="siglum_political_party" >'+ siglum + " - " + cadeiras + '</h3> \
								                </div>');

	    		$("#circle_" + siglum + "_federal").css("border-color", color);
	    	});
    	}else{
	    	$("#state_deputies_structure svg g").attr("class","state_deputies_graph")
	    	
	    	$('.state_deputies_graph g').each(function(){

	    		var siglum = $(this).attr("id");
	    		var color = $(this).css('fill');
	    		var cadeiras = $("#"+ siglum).find("circle").length;
	    		$('.structure_graph_2_state_deputies').append('<div class="political_party"> \
								                <div id="circle_'+ siglum +'_state" class="circle_status circle_political_party"></div> \
								                <h3 class="siglum_political_party" >'+ siglum + " - " + cadeiras + '</h3> \
								                </div>');

	    		$("#circle_" + siglum + "_state").css("border-color", color);
	    	});
    	}

    	$('.political_party').off();
    	$('.political_party').on('mouseenter',function(){

    		hoverStructure(this,4);
		
    	});

    	$('.political_party').on('mouseleave',function(){
    		hoverStructure(this,0);
    	});
    });



}

function hoverStructure(id,r){

	var selectedParty = $(id).find('.circle_political_party').attr("id");
	var politicalParty = selectedParty.replace("circle_","").replace("_federal","").replace("_state","");
	if(politicalParty == "Indep"){
		politicalParty = "SemPartido";
	}
	//console.log($(id).parent().attr("id"));
	if( $(id).parent().attr("id") == "graph_2_senator"){
		var circle = $(".senator_graph").find("#"+politicalParty).find("circle");
		console.log(circle);
		circle.css("stroke-width", r)
			  .css("stroke", circle.css("fill"));
		//console.log($(".senator_graph").find("#"+politicalParty).attr("r","10"));
	}else if( $(id).parent().attr("id") == "graph_2_state_deputies"){
		var circle = $(".state_deputies_graph").find("#"+politicalParty).find("circle");
		console.log(circle);
		circle.css("stroke-width", r)
			  .css("stroke", circle.css("fill"));
		//console.log($(".senator_graph").find("#"+politicalParty).attr("r","10"));
	}else {
		var circle = $(".federal_deputies_graph").find("#"+politicalParty).find("circle");
		console.log(circle);
		circle.css("stroke-width", r/1.5)
			  .css("stroke", circle.css("fill"));

		//console.log($(".senator_graph").find("#"+politicalParty).attr("r","10"));
	}   
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

       	var year_selected = "Todos";
		var politician_id = window.location.pathname.split("/").pop();

		$(".select_year_prop_status").val("Todos");
		$(".select_year_prop_type").val("Todos");

        if(windowWidth <= 410){

        	filterStatusByYear(windowWidth / 1.8,windowWidth / 1.8);
       		showDonutChart(windowWidth / 1.8, windowWidth / 1.8, year_selected, politician_id);

       		filterTypeByYear(windowWidth,200);
       		showBarChart(windowWidth,200, year_selected, politician_id);
        }else{
        	filterStatusByYear(210,210);
        	showDonutChart(210,210, year_selected, politician_id);

        	filterTypeByYear(370,230);
        	showBarChart(370,230, year_selected, politician_id);
        }	

       graphsLoaded = true;

	}
}

function responsiveChanges(){

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	


	$(".menu_container").css("height","100vh");	
	$(".loading_politician_anim").css("height","100vh");	
  	if(windowWidth <= 490){
  		$(".especific_project_prop").width($(this).width() - 37);
  		$(".prop_desc").width($(this).width() - 60);  	

  	}else if(windowWidth > 490 && windowWidth <= 682) {

  		$(".especific_project_prop").width(450);
  		$(".prop_desc").width(420);

  	}else if(windowWidth > 682 && windowWidth <= 880){

  		$(".especific_project_prop").width(300);
  		$(".prop_desc").width(270);

  	}
  	else{

  		$(".especific_project_prop").width(335);
  		$(".prop_desc").width(300);
  	}

  	if(windowWidth <= 1050){
  		$("#info2").removeClass('full_width');
  	}else{
  		$("#info2").attr('class','full_width');
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


  	if(windowWidth <= 580){
  		$("#search_submit").val("");

  	}else{
  		$("#search_submit").val("Buscar");
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


	var page = window.location.pathname.split("/").pop();
	if ( page == "know-more" ) {

		var offsetTop = $("#middle_content").offset().top;
		$.when().then( { offT : offsetTop, w: windowWidth  }, redefineTabFixed);

		$(window).off('scroll', redefineTabFixed);

		$(window).on('scroll',{ offT : offsetTop, w: windowWidth  }, redefineTabFixed);	
	}
	
}

function redefineTabFixed(event){
		
	if($(window).scrollTop() >= event.data.offT && event.data.w <= 880 && !isFixed ) {

		$(".tab_know_more").css("position","fixed").css("top",0 );	
		var hgh = $(".tab_know_more").height() + parseInt($(".tab_know_more").css("padding-top")) + parseInt($(".tab_know_more").css("padding-bottom"));

		$(".box_shadow_know_more1").css("position","fixed").css("top",0 ).css("left", 0).height(hgh);
		$(".line_know_more").css("position","fixed").css("top", hgh );
		$("#tab_know_more1").css("left", 0);

		var l1 = $("#tab_know_more1").width() + parseInt($(".tab_know_more").css("padding-left") + 1);
		
		$("#tab_know_more2").css("left", l1);	
		var l2 = parseInt($("#tab_know_more2").css("left")) * 2 + 1;
		$("#tab_know_more3").css("left", l2);

		isFixed = true;

	}else if($(window).scrollTop() < event.data.offT  || event.data.w > 880){


		$(".tab_know_more").css("position","relative").css("top", "" );
		$(".box_shadow_know_more1").css("position","absolute").css("top","" ).css("left", "").css("height","100%");
		$(".line_know_more").css("position","absolute").css("top", "" );

		$("#tab_know_more2").css("left", "");
		$("#tab_know_more3").css("left", "");

		isFixed = false;	

	}
}

function responsiveReload(){
	var windowWidth = $(window).width();
  	graphsLoadedResponsive = false;

	if(!graphsLoadedResponsive && window.location.pathname.split("/")[1] == "politician"){
		$(".loading_status").css("display","block");
		$(".loading_type").css("display","block");

		var year_selected = "Todos";
		var politician_id = window.location.pathname.split("/").pop();

	  	if(windowWidth <= 410){

	  		$(".p_donut_chart_outer").empty().append("<div class='propositions_donut_chart'> </div> <div id='rect_hover_props' class='rect_hover'>10</div>");
	  		filterStatusByYear(windowWidth/1.8, windowWidth/1.8);
	  		showDonutChart(windowWidth/1.8,windowWidth/1.8, year_selected, politician_id);

	  		$(".graph_prop_type_outer").empty().append("<div class='graph_prop_type'> </div> <div id='rect_hover_type' class='rect_hover'>10</div>");

	  		filterTypeByYear(windowWidth,200);
       		showBarChart(windowWidth,200, year_selected, politician_id);
	  	} 

	  	if(windowWidth > 410){
	  		$(".p_donut_chart_outer").empty();
	  		$(".p_donut_chart_outer").append("<div class='propositions_donut_chart'> </div> </div> <div id='rect_hover_props' class='rect_hover'>10</div>");
	  		filterStatusByYear(210, 210);
	  		showDonutChart(210,210, year_selected, politician_id);

	  		$(".graph_prop_type_outer").empty().append("<div class='graph_prop_type'> </div> <div id='rect_hover_type' class='rect_hover'>10</div>");	  		
	  		filterTypeByYear(370,230);
	  		showBarChart(370,230, year_selected, politician_id);
	  	}


	  	

		  	if(windowWidth <= 1050){
		  		showHistoryChart(windowWidth/1.5, windowWidth/3.75,30,100,30);
		  		//showHistoryChart(windowWidth/1.75, windowWidth/4.375);
		  	}

		  	if(windowWidth > 1050){
		  		showHistoryChart(600,240,30,100,30);
		  	}


		  	if(windowWidth <= 880){
		  		showHistoryChart(windowWidth/1.1, windowWidth/2.5,30,100,30);
		  	}

		  	if(windowWidth <= 682){
		  		showHistoryChart(windowWidth, windowWidth/2.5,15,90,30);
		  	}


	  	
	  	//showHistoryChart(windowWidth/1.2, windowWidth/3);

	  	$(".time_line_content_inner").mCustomScrollbar({
	  		theme:"dark",
	  		mouseWheelPixels: 80,
	  		scrollInertia: 300
	  	});

	  	graphsLoadedResponsive = true;
	}
}

function filterPropsByYear(){
	
	$(".select_year_project_voted").on('change', function() {
		var year_selected = $(this).val();
		loadFilteredPolls(year_selected);	
	});
}



function loadFilteredPolls(yearSel){
		var politician_id = window.location.pathname.split("/").pop();
		$(".loading_polls_bkground").css("display","flex");
		$(".loading_polls_polls").css("display","flex");
		$(".loading_polls_polls .loading_polls_inner h3").text("Carregando votações de " + yearSel);
		$.ajax({
	      type:'GET',
	      url:'/politician/api/',
	      async: true,
	      data: {id : politician_id, graph : 3, year: yearSel},

	      dataType:'json',

	      success: function(data) {

	      	console.log("VOTAÇÕES DE ", yearSel, " CARREGADAS");
	      	$(".loading_polls_polls").css("display","none");
	      	$(".loading_polls_bkground").css("display","none");
	      	var lenAll =  data.length;
	      	var lenYes = 0;
	      	$(".voted_inner").empty();

	      	for (var i = 0; i < lenAll; i++) {

	      		if(data[i].result == "-"){
	      			data[i].result = "Aguardando aprovação"
	      		}


	      		switch (data[i].vote){
	      			case "Sim":	 	      			     					      				
	      				$(".voted_yes").append(
	      					'<div class="especific_project_prop"> \
                            	<div class="prop_status">'+ data[i].result +'</div> \
                            	<h3 class="prop_type_n"> \
                                	<span class="prop_type">'+ data[i].siglum +'</span> n° <span class="prop_n">'+ data[i].number +'</span> \
                            	</h3> \
                            	<div class="prop_desc">'+ data[i].description +'</div> \
                            	<a target="_blank" href='+ data[i].url +' class="prop_details">mais detalhes</a> \
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
                            	<a target="_blank" href='+ data[i].url +' class="prop_details">mais detalhes</a> \
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
                            	<a target="_blank" href='+ data[i].url +' class="prop_details">mais detalhes</a> \
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
                            	<a target="_blank" href='+ data[i].url +' class="prop_details">mais detalhes</a> \
                        	</div>');
	      				break;		
	      		}

	      	}
	      	definePageProps();
	      	responsiveChanges();
	      	
	      	


	      },
	      error: function(request, status, error) {
	      	$(".loading_polls").css("display","none");
	        //console.log(request , status , error);
	      }
	   });
	
}

function toggleNoScroll(){
	// if($(window).height() <= $("body").height()){
	// 	$("body").height($(window).height());
	// 	$("body").toggleClass("noScroll");
	// }

	var pos = $(window).scrollTop();
	$(window).scroll(function() {
		$(window).scrollTop(pos);
	});

	$(document.body).on('touchmove', function() {
		$(window).scrollTop(pos);
	});

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
