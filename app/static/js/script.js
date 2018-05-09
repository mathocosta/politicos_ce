

var backgroundColor = "#fafafa"; 
var lightFillColor = "#ffffff";
var darkFillColor = "#9aed57";
var textColor = "#333333";


$( document ).ready(function() {
    

	$(".hamburger").on("click", function(){
		$(".hamburger").toggleClass("change");
	})

	listAllPolitics();

	//View graph for Status Propositions------------
	for (var i = 0; i < 3; i++) {
		var year = "2018"
		$(".select_year_prop_status").append("<option>"+year+" </option>");
	}
	showStatusProps(200,60,40,30,70); // showStatusProps(allPropositions, aprovedPropositions, publishedPropositions, refusedPropositions, processingPropositions)
	
	//----------------------------------------------


	//View graph for propositions type--------------
	showPropType(200,40,60,55,45); // showPropType(allPropositions, PEC, PL, RCP, REM)

	//----------------------------------------------*/

	autoAjustWidthInnerProps(".all_project_prop");
	autoAjustWidthInnerProps(".voted_yes");
	autoAjustWidthInnerProps(".voted_no");
	autoAjustWidthInnerProps(".voted_abstain");
	autoAjustWidthInnerProps(".voted_secret");
});






