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

//Financial Modeling Prep API - Basic stock quotes //
function basicStockQuote() {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + stockSymbol + "&apikey=DQAYETJTA1SPRVIF",
		"method": "GET",
	}
	$.ajax(settings).done(function (response) {
		console.log(response);
		companyName = response.Name;
		$("#companyName").text(response.Name);
		stockNews();
		$("th:first").html(response.Name + " (" + response.Symbol + ")<br>" + response.Exchange);
		$("td:first").html("Gross Profit: <br>" + (response.GrossProfitTTM / 1e+9).toPrecision(5) + " B"); 
		$("#row1").children("td").html(response["50DayMovingAverage"] + "<br>" + response["200DayMovingAverage"]); 		
		$("#row4").children("td").html(response["52WeekHigh"] + "<br>" + response["52WeekLow"]);
		$("#row5").children("td").html((response.SharesOutstanding / 1e+6).toPrecision(5) + " M <br>" + response.EPS);
		$("#row6").children("td").html(response.PERatio + "<br>" + (response.MarketCapitalization / 1e+9).toPrecision(6) + " B");
	});
}

// Daily prices//
function dailyPrices() {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stockSymbol + "&apikey=DQAYETJTA1SPRVIF",
		"method": "GET",
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
		var lastDate = response["Meta Data"];
		console.log(lastDate);
		var lastRefreshed = lastDate["3. Last Refreshed"];
		console.log(lastRefreshed);
		var dailyData = response["Time Series (Daily)"];
		var todayData = dailyData[lastRefreshed];
		$("#row2").children("td").html(todayData["4. close"] + "<br>" + todayData["1. open"]);
		$("#row3").children("td").html(todayData["2. high"] + "<br>" + todayData["3. low"]);
	});
}
		
//Historical data//
var historyData = [];
var historyPrices = [];
var historyDatesFull = [];
var historyDatesYear = [];
var historyMonthDate = [];
function historicalPrices() {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + stockSymbol + "&apikey=DQAYETJTA1SPRVIF",
		"method": "GET",
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
		var weeklyData = response["Weekly Time Series"];
		for (var key in weeklyData) {
			historyDatesFull.unshift(key);
			if (weeklyData.hasOwnProperty(key)) {
				var data = weeklyData[key];
				historyData.unshift(data);
			}
		}
		for (i = 385; i < historyData.length; i++) {
			var obj = historyData[i];
			var openPrice = obj["1. open"];
			historyPrices.push(openPrice);
			historyDatesYear.push(historyDatesFull[i]);
		}
		for (j = 0; j < historyDatesYear.length; j++) {
			var element = historyDatesYear[j];
			var newEl = element.slice(5, 10);
			historyMonthDate.push(newEl);
		}
		console.log(historyPrices);
		console.log(historyMonthDate);
		chartDraw();
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
			var newsDiv = $("#news-items");
			var articleRow = $("<article>");
			articleRow.attr("class", "row news-item");   
			var publisher = $("<div>");
			publisher.attr("class", "column column-25 source");
			publisher.text(response.news[i].publisher);
			var titleLink = $("<div>");
			titleLink.attr("class", "column column-50 news-link");
			titleLink.html('<a id="news-item0'+(i+1)+'" href="' + response.news[i].link + '">' + response.news[i].title + '</a>');
			articleRow.append(publisher, titleLink);
			newsDiv.append(articleRow);	
		}
	});
}

$("#searchBtn").on("click", function(event) {
	event.preventDefault();
	$("article").empty();
	stockSymbol = $("#nameField").val().toUpperCase();
	basicStockQuote();
	dailyPrices();
	historicalPrices();
	$("#nameField").val("");
});

function chartDraw() {
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: historyMonthDate,
			datasets: [{
				data: historyPrices,
				backgroundColor: ['rgba(256, 256, 256, 1)'],
				borderColor: ['rgba(0, 0, 0, 1)'],
				borderWidth: 1
			}]
		},
		options: {
			title: {
				display: true,
				text: "One Year's Weekly Close Prices",
				fontColor: "#fff",
				fontSize: "20"
			},
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					ticks: {
						fontColor: "#000"
					}
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: "#000"
					}
				}],
			},
			responsive: true,
			aspectRatio: 1.5,
			maintainAspectRatio: true,
		}
	});
}