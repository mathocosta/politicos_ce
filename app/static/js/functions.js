//Add a progress circle to the $element
function showStatusProps(allProps, aprovedProps, publishedProps, refusedProps, processingProps )
{

	$('.pie_chart').addClass("active");
	$('.pie_chart').text('');

	var progressId = "progress";

	$('.pie_chart').append("<div id='" + progressId + "'></div>");

	var target = progressId;

	var canvasSize = 200;

	//Create the circle
	var archtype = Raphael(target, canvasSize, canvasSize);
	setCustomAttributes(archtype);
	drawCircles(archtype, canvasSize, allProps, aprovedProps, publishedProps, refusedProps, processingProps);
};

//Draw a progress circle at the size of the canvas variable
function drawCircles(arc, canvas, allProps, aprovedProps, publishedProps, refusedProps, processingProps)
{
	var minCanvasSizeWithText = 95;

	var outer_circle = arc.circle((canvas/2), (canvas/2), (canvas/2.1));
		outer_circle.attr("fill", lightFillColor);
		outer_circle.attr("stroke", lightFillColor);


	var inner_circle = arc.circle((canvas/2), (canvas/2), (canvas/3.1));
		inner_circle.attr("fill", backgroundColor);
		inner_circle.attr("stroke", backgroundColor);

	var strokeWidth = (canvas/10) + 1;
	var fontSize = "18px";

	if(canvas >= 150)
		strokeWidth = (canvas/6) + 1;

	if(canvas >= 150)
		fontSize = (canvas/6);


	var aprovedP = (aprovedProps/allProps)*100 - 0.5
	var publishedP = (publishedProps/allProps)*100 - 0.5
	var refusedP = (refusedProps/allProps)*100 - 0.5
	var processingP = (processingProps/allProps)*100 - 0.5

	console.log(aprovedP, publishedP, refusedP, processingP)

	var publishedRotate = ((aprovedP+0.5) * 360)/100 + 1;
	var refusedRotate = publishedRotate + (((publishedP+0.5) * 360)/100) ;
	var processingRotate =  (refusedP *360 /100) + refusedRotate +2  ;

	console.log(publishedRotate, refusedRotate, processingRotate)
	// 25% -- 100%
	// x --- 360°
	//console.log(((24.5+0.5) * 360)/100);
	//x = (25 * 360/100)

		var arc_aproved = arc.path();
		arc_aproved.attr("stroke", "#B0F28C");
	 	arc_aproved.attr("stroke-width", strokeWidth);
	 	arc_aproved.attr("arc",[(canvas/2), (canvas/2), aprovedP, 100, (canvas/2.5)]);
	 	arc_aproved.attr("transform" , arc_aproved.attr("transform") + "R"+1+",100,100")

		var arc_published = arc.path();
	 	arc_published.attr("stroke", "#8ECDED");
	 	arc_published.attr("stroke-width", strokeWidth);
	 	arc_published.attr("arc",[((canvas/2)), (canvas/2), publishedP, 100, (canvas/2.5)]);
	 	arc_published.attr("transform" , arc_published.attr("transform") + "R"+publishedRotate+",100,100")

	 	var arc_refused = arc.path();
	 	arc_refused.attr("stroke", "#F28C91");
	 	arc_refused.attr("stroke-width", strokeWidth);
	 	arc_refused.attr("arc",[((canvas/2)), (canvas/2), refusedP, 100, (canvas/2.5)]);
	 	arc_refused.attr("transform" , arc_refused.attr("transform") + "R"+refusedRotate+",100,100")

	 	var arc_processing = arc.path();
	 	arc_processing.attr("stroke", "#F4E58C");
	 	arc_processing.attr("stroke-width", strokeWidth);
	 	arc_processing.attr("arc",[((canvas/2)), (canvas/2), processingP, 100, (canvas/2.5)]);
	 	arc_processing.attr("transform" , arc_processing.attr("transform") + "R"+processingRotate+",100,100")


	 	// calculate rotation point (bottom middle)
		//my_arc2.animate({transform: my_arc2.attr("transform") + "R360,100,100"}, 2000);



	/*my_arc.animate({
		arc: [(canvas/2), (canvas/2), percentage, 100, (canvas/2.5)]
	}, 500, "ease");*/

	  /*my_arc2.animate({

	  	"transform": "r360"
	  }, 2000);*/

	if(canvas > minCanvasSizeWithText)
	{
		var text = arc.text((canvas/2), (canvas/2) + 1, allProps+"\n proposições");
			text.attr("font", "14px AsapRegular");
			text.attr("font-size", 14);
			// text.attr("font-weight", "normal");
			text.attr("fill", textColor);
	}
}

//Set attributes for the archtype
function setCustomAttributes(theArchtype)
{
	theArchtype.customAttributes.arc = function (xloc, yloc, value, total, R) {
		var alpha = 360 / total * value,
			a = (90 - alpha) * Math.PI / 180,
			x = xloc + R * Math.cos(a),
			y = yloc - R * Math.sin(a),
			path;
		if (total == value) {
			path = [
				["M", xloc, yloc - R],
				["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
			];
		} else {
			path = [
				["M", xloc, yloc - R],
				["A", R, R, 0, +(alpha > 180), 1, x, y]
			];
		}
		return {
			path: path
		};
	};
}


function autoAjustWidthInnerProps(container){
	var count = 0;
	$(container + " .especific_project_prop").each(function(){
		count++;
	});

	console.log(count);
	$(container).width(387*count);




}

// function listAllPolitics(){
// 	$(".politic_box").remove();
// 	for (var i = 0; i < 10; i++) {
// 		var id_politic = 1;
// 		var name_politic = "Eunício"
// 		var photo_politic = "./res/icons/brasil3.png"
// 		$("#all_boxes").append('<div class="politic_box"> \
// 									<img class="photo_politic" src="./res/icons/brasil3.png"> \
// 									<div> \
// 										<h2 class="name_politic">Eunício Oliveira</h2> \
// 										<h4 class="p_siglum">PMDB</h4> \
// 									</div> \
// 								</div>');
// 	}
// }


function showPropType(allP, pec, pl, rcp, rem){
	//60 ---> 170px
	//25 ----- y

	$("#total_prop").text(allP);
	$("#pec").height ((170 * pec) / 60 );
	$("#pl").height ((170 * pl) / 60 );
	$("#rcp").height ((170 * rcp) / 60 );
	$("#rem").height ((170 * rem) / 60 );
}

