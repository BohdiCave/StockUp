// Declaration and assignment code
// For dropdown menu event handling
var collapse = document.querySelector(".collapse");
var toggleBtn = document.querySelector("#toggleBtn");
var nl1 = document.querySelector("#nl1");
var nl2 = document.querySelector("#nl2");
var nl3 = document.querySelector("#nl3");
var nl4 = document.querySelector("#nl4");
// For stock data call
var stockSymbol = "";
// For financial news call
var companyName = "";
// For historical data call
var historyData = [];
var historyPrices = [];
var historyDatesFull = [];
var historyDatesYear = [];
var historyMonthDate = [];

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

// Function code

// Alpha Vantage Stock API - Basic stock quotes 
function basicStockQuote() {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + stockSymbol + "&apikey=DQAYETJTA1SPRVIF",
		"method": "GET",
	}
	$.ajax(settings).done(function (response) {
		// Getting the basic company profile data
		companyName = response.Name;
		// Getting and loading the financial news
		$("#companyName").text(response.Name);
		stockNews();
		// Loading the basic stock data
		$("th:first").html(response.Name + " (" + response.Symbol + ")<br>" + response.Exchange);
		$("td:first").html("Gross Profit: <br>" + (response.GrossProfitTTM / 1e+9).toPrecision(5) + " B"); 
		$("#row1").children("td").html(response["50DayMovingAverage"] + "<br>" + response["200DayMovingAverage"]); 		
		$("#row4").children("td").html(response["52WeekHigh"] + "<br>" + response["52WeekLow"]);
		$("#row5").children("td").html((response.SharesOutstanding / 1e+6).toPrecision(5) + " M <br>" + response.EPS);
		$("#row6").children("td").html(response.PERatio + "<br>" + (response.MarketCapitalization / 1e+9).toPrecision(6) + " B");
	});
}

// Alpha Vantage Stock API - Daily prices 
function dailyPrices() {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stockSymbol + "&apikey=DQAYETJTA1SPRVIF",
		"method": "GET",
	}

	$.ajax(settings).done(function (response) {
		// Getting and loading the latest daily price data
		var lastDate = response["Meta Data"];
		var lastRefreshed = lastDate["3. Last Refreshed"];
		var dailyData = response["Time Series (Daily)"];
		var todayData = dailyData[lastRefreshed];
		$("#row2").children("td").html(todayData["4. close"] + "<br>" + todayData["1. open"]);
		$("#row3").children("td").html(todayData["2. high"] + "<br>" + todayData["3. low"]);
	});
}
		
// Alpha Vantage Stock API - Weekly historical data
function historicalPrices() {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + stockSymbol + "&apikey=DQAYETJTA1SPRVIF",
		"method": "GET",
	}

	$.ajax(settings).done(function (response) {
		var weeklyData = response["Weekly Time Series"];
		// Iterating through objects and pulling the needed data into an array
		for (var key in weeklyData) {
			historyDatesFull.unshift(key);
			if (weeklyData.hasOwnProperty(key)) {
				var data = weeklyData[key];
				historyData.unshift(data);
			}
		}
		// Limiting the array data to the prior year (52 weeks) + current week (total - 53 wks)
		for (i = historyData.length-53; i < historyData.length; i++) {
			var obj = historyData[i];
			var openPrice = obj["1. open"];
			historyPrices.push(openPrice);
			historyDatesYear.push(historyDatesFull[i]);
		}
		// Truncating the year information for better display of the date along the x-axis
		for (j = 0; j < historyDatesYear.length; j++) {
			var element = historyDatesYear[j];
			var newEl = element.slice(5, 10);
			historyMonthDate.push(newEl);
		}
		// Calling the chart drawing function, once the data is loaded and parsed
		chartDraw();
	});
}	

// Yahoo Finance API - Financial news 
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
			
		for (var i=0; i < response.news.length; i++){
			// Getting the correct HTML element
			var newsDiv = $("#news-items");
			// Creating new elements to load the data and setting attributes
			var publisher = $("<div>");
			publisher.attr("class", "column column-25 source");
			publisher.text(response.news[i].publisher);
			var titleLink = $("<div>");
			titleLink.attr("class", "column column-50 news-link");
			titleLink.html('<a id="news-item0'+(i+1)+'" href="' + response.news[i].link + '">' + response.news[i].title + '</a>');
			var articleRow = $("<article>");
			articleRow.attr("class", "row news-item");
			// Appending the created elements to the parent element   
			articleRow.append(publisher, titleLink);			
			newsDiv.append(articleRow);	
		}
	});
}

// Chart.js API - Drawing the chart 
function chartDraw() {
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			// loading one array of historical dates as "labels"
			labels: historyMonthDate,
			datasets: [{
				// loading another array of historical prices as "data"
				data: historyPrices,
				backgroundColor: ['rgba(256, 256, 256, 1)'],
				borderColor: ['rgba(0, 0, 0, 1)'],
				borderWidth: 1
			}]
		},
		options: {
			// Chart title and legend settings
			title: {
				display: true,
				text: "One Year's Weekly Close Prices",
				fontColor: "#fff",
				fontSize: "20"
			},
			legend: {
				display: false
			},
			// Axes settings
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
			// Display settings
			responsive: true,
			aspectRatio: 1.5,
			maintainAspectRatio: true,
		}
	});
}

// Event handling - Search form submission, calling all the above functions
$("#searchBtn").on("click", function(event) {
	event.preventDefault();
	// Emptying the news results of the previous search
	$("article").empty();
	// Ensuring the input is valid for making the API calls
	stockSymbol = $("#nameField").val().toUpperCase();
	// Call all the stock data functions above 
	// Exceptions: 
	// - chart drawing, called from within historicalPrices();
	// - news results, called from within basicStockQuote();
	basicStockQuote();
	dailyPrices();
	historicalPrices();
	// Clearing the search input field
	$("#nameField").val("");
});