// Declaration and assignment code 
var collapse = document.querySelector(".collapse");
var toggleBtn = document.querySelector("#toggleBtn");
var nl1 = document.querySelector("#nl1");
var nl2 = document.querySelector("#nl2");
var nl3 = document.querySelector("#nl3");
var nl4 = document.querySelector("#nl4");
var stockSymbol = "";
var companyName = "";

// Event listeners - dropdown menu functionality
function toggleMenu(e) {
	e.stopPropagation();
	collapse.style.display = "flex";
	toggleBtn.style.display = "none";
}
toggleBtn.addEventListener("click", toggleMenu);

function closeDropdown() {
	collapse.style.display = "none";
	toggleBtn.style.display = "block";
}
nl1.addEventListener("click", closeDropdown);
nl2.addEventListener("click", closeDropdown);
nl3.addEventListener("click", closeDropdown);
nl4.addEventListener("click", closeDropdown);

// // Adding more filters to the search criteria (optional)

// var moreFields = document.querySelector("#moreFields");
// var addFieldBtn = document.querySelector("#addFieldBtn");
// var searchBtn = document.querySelector("#searchBtn");
// function addSearchFilter(e) {
//     e.preventDefault();
//     var newFilter = document.createElement("input");
//     newFilter.setAttribute("type", "text");
//     newFilter.setAttribute("placeholder", "additional filter");
//     newFilter.setAttribute("class", "newFilter");
//     moreFields.append(newFilter);
// }
// addFieldBtn.addEventListener("click", addSearchFilter); -->

// Financial Modeling Prep API - Basic stock quotes //
function basicStockQuote() {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://cors-anywhere.herokuapp.com/https://financialmodelingprep.com/api/v3/quote/" + stockSymbol +"?apikey=65b0722564360219ab8da0bd56970abb",
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
			"x-rapidapi-key": "c67d1328d5msh462674a5c86d08cp1003bbjsn6dd13bf28832"
		}
	}
	$.ajax(settings).done(function (response) {
		console.log(response);
		var info = response[0];
		companyName = info.name;
		$("#companyName").text(info.name);
		stockNews();
		$("th:first").html(info.name + " (" + info.symbol + ")<br>" + info.exchange);
		$("td:first").html("Volume: <br>" + (info.volume / 1e+6).toPrecision(4) + " M"); 
		$("#row1").children("td").html(info.price + "<br>" + info.change + " / " + info.changesPercentage + "%"); 
		$("#row2").children("td").html(info.previousClose + "<br>" + info.open);
		$("#row3").children("td").html(info.dayHigh + "<br>" + info.dayLow);
		$("#row4").children("td").html(info.yearHigh + "<br>" + info.yearLow);
		$("#row5").children("td").html((info.sharesOutstanding / 1e+6).toPrecision(5) + " M <br>" + info.eps);
		$("#row6").children("td").html(info.pe + "<br>" + (info.marketCap / 1e+9).toPrecision(6) + " B");
	});
}

// Yahoo News API - stock news //
async function stockNews() {
	var settings = {
		"async": true, 
		"crossDomain": true,
		"url": "https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=" + companyName,
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
			"x-rapidapi-key": "dc4dec46cdmshbe33f33e8f04383p1540fbjsnd5fecd94ffc8"
		}
	}
	
	$.ajax(settings).then(function (response) {
		
		console.log(response.news);
	
		for (var i=0; i < response.news.length; i++){
			var articleRow = $("#item0"+i);   
			var aRow = $("<tr>");
			var publisherTd = $("<td>").text(response.news[i].publisher);
			var titleLink = '<a href="' + response.news[i].link + '">' + response.news[i].title + '</a>';
			aRow.append(publisherTd, titleLink);
			articleRow.append(aRow);
		}
	});
}

$("#searchBtn").on("click", function(event) {
	event.preventDefault();
	$("article").empty();
	stockSymbol = $("#nameField").val().toUpperCase();
	basicStockQuote();
	$("#nameField").val("");
});


//historical ratings//
/*var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://cors-anywhere.herokuapp.com/https://financialmodelingprep.com/api/v3/historical-rating/AAPL?limit=100&apikey=8ea7feeec43d71792485f0610786aab7",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
		"x-rapidapi-key": "c67d1328d5msh462674a5c86d08cp1003bbjsn6dd13bf28832"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});


//income statement//
var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://cors-anywhere.herokuapp.com/https://financialmodelingprep.com/api/v3/income-statement/AAPL?limit=120&apikey=8ea7feeec43d71792485f0610786aab7",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
		"x-rapidapi-key": "c67d1328d5msh462674a5c86d08cp1003bbjsn6dd13bf28832"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});

//income growth//
var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://cors-anywhere.herokuapp.com/https://financialmodelingprep.com/api/v3/income-statement-growth/AAPL?limit=40&apikey=8ea7feeec43d71792485f0610786aab7",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
		"x-rapidapi-key": "c67d1328d5msh462674a5c86d08cp1003bbjsn6dd13bf28832"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});*/
