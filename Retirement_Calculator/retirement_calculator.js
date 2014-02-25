//Assignment 3
//Retirement Calculator
$(document).ready(function() {

	scenario.all = []; 
});


var createScenario = function() {
	
	var name_val = $("input[name=scenarioName]").val();
	var rorWorking_val = $("input[name=rorWorking]").val();
	var rorRetired_val = $("input[name=rorRetired]").val();
	var desiredIncome_val = $("input[name=desiredIncome]").val();
	
	//  detect and display error message(with alert())
	if ( name_val.trim()=="" ){
	
		alert("The scenario name cannot be empty!");
	}	
	else if (rorWorking_val <= 0 || !$.isNumeric(rorWorking_val) ){
	
		alert("Rate of investment return while working should be a positive number!");
	}
	
	else if (rorRetired_val <= 0 || !$.isNumeric(rorRetired_val)){
		alert("Rate of investment return while retired should be a positive number!");
	}
	
	else if (desiredIncome_val <= 0 || !$.isNumeric(desiredIncome_val)){
	
		alert("Desired income should be a positive number!");
	}
	
	else {
	
		scenario.all.push(new scenario(name_val, rorWorking_val, rorRetired_val, desiredIncome_val));
		showScenario();
	}
	
}

//store scenario in arrary
var scenario = function(name, rorWorking, rorRetired, desiredIncome) {

	this.name = name;
	this.rorWorking = rorWorking;
	this.rorRetired = rorRetired;
	this.desiredIncome = desiredIncome;
}

// show scenario in #showScenario
var showScenario = function() {

	$("#showScenario").show();
	$(".allScenario").empty();
	$(".allScenario").append("<thead><tr><th>Scenario Name</th><th>Rate of Return(Working)</th><th>Rate of Return(Retired)</th><th>Desired Income</th></tr></thead>");
	
	var tbody = $("<tbody></tbody>");
	
	for (var i = 0; i < scenario.all.length; i++) {
		
		var tr = $("<tr></tr>");
		tr.append("<td>" + scenario.all[i].name + "</td><td>" + scenario.all[i].rorWorking + "</td><td>" + scenario.all[i].rorRetired + "</td><td>" + scenario.all[i].desiredIncome + "</td>");
		
		//delete scenario button
		var delButton = $("<td><button>Delete</button></td>");
		delButton.attr('type','button');
		delButton.attr('onclick','delScenario("'+ i + '")' );
		tr.append(delButton);
	
		tbody.append(tr);
	}
	
	$(".allScenario").append(tbody);

}

// delete scenario
var delScenario = function (i){

	scenario.all.splice(i,1);
	showScenario();
}

var n, m, r, g, I, T;

var calculateScenario = function() {
	
	var year_of_birth = $("input[name=yoBirth]").val();
	var currentSavings = $("input[name=currentSavings]").val();
	var retireAge = $("input[name=retireAge]").val();
	var lifeExpectancy = $("input[name=lifeExpectancy]").val();
	
	
	$("#error").empty();
	$("#result").empty();

	//  detect and display error message(withnot alert())
	if ( year_of_birth > 2013 || !$.isNumeric(year_of_birth) || year_of_birth <= 0 ) {
	
		$("#error").append("<p class='error'>The year of birth must be a positive number and should be in the past!</p>");
	}
	
	else if (! $.isNumeric(currentSavings)) {
	
		$("#error").append("<p class='error'>The current savings must be a number</p>");		
	}
	
	else if (! $.isNumeric(retireAge) || retireAge <= (2013-year_of_birth) ) {
	
		$("#error").append("<p class='error'>The expected retirement age must be a number and should be in the future</p>");		
	}
	
	else if (! $.isNumeric(lifeExpectancy) || lifeExpectancy < retireAge) {
	
		$("#error").append("<p class='error'>Life expectancy must be a number and should be in the future beyond the expected retirement age.</p>");		
	}	
	
	else if (scenario.all.length == 0) {
	
		$("#result").append("<p class='error'>Your scenario needs to be specified!</p>");		
	}

	//calculate each scenario 
	else {
		
		n = retireAge - (2013 - year_of_birth);
		m = lifeExpectancy - retireAge;
		I = parseFloat(currentSavings);
		var savingBalance = I;
		
		for(var i = 0; i < scenario.all.length; i++) {
			
			r = 1 + parseFloat(scenario.all[i].rorWorking); 
			g = 1 + parseFloat(scenario.all[i].rorRetired);
			T = parseFloat(scenario.all[i].desiredIncome);
			
			//Get Saving Amount
			S = scenario.all[i].S = ((T/Math.pow(g,m-1) * (1-Math.pow(g,m)) / (1-g)) - (I * Math.pow(r,n))) * (1-r) / (1-Math.pow(r,n));
			
			$("#result").append("<h3 class='center'>Scenario Name:</h3><div class='center'> " + scenario.all[i].name + "</div>" );
			$("#result").append("<h3 class='center'>Each year you need to save: </h3><div class='center'>" + S.toFixed(2) + "</div>");
			$("#result").append("<h3 class='center'>Table: </h3>");
			
			var table = $("<table></table>");
			var thead = $("<thead></thead>");
			thead.append("<tr><th>Year</th><th>Saving amount</th><th>Saving Balance</th></tr>");
			table.append(thead);
		
			// display each scenario in table
			for (var y = 2014; y <= (2013+n+m); y++) {
				
				var tbody = $("<tbody></tbody>");
				var tr = $("<tr></tr>");
				var tdy = $("<td></td>");
				var td_sa = $("<td></td>");
				var td_sb = $("<td></td>");
				
				tdy.append(y);
				tr.append(tdy);
			
				if (y <= 2013 + n)
					td_sa.append(S.toFixed(2));
				else
					td_sa.append(0);			
					tr.append(td_sa);
			
				if (y <= 2013 + n)
					savingBalance = savingBalance * r + S;
				else
					savingBalance = (savingBalance-T) * g ;
			
				td_sb.append(savingBalance.toFixed(2));
				tr.append(td_sb);
				tbody.append(tr);
				table.append(tbody);
			}
			
			$("#result").append(table);
		}
	}
}

