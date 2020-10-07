// qoutes//
var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://cors-anywhere.herokuapp.com/https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=8ea7feeec43d71792485f0610786aab7",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
		"x-rapidapi-key": "c67d1328d5msh462674a5c86d08cp1003bbjsn6dd13bf28832"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
	var stockinfo =  $("#stock-info");
	stockinfo.html("<h4>" + response[0].name + "</h4>");
	stockinfo.append("<p>Price:" +  response[0].price + "</p>");
	stockinfo.append("<p>High: " + response[0].dayHigh + "<br> Low: " + response[0].dayLow + "</p>");
	stockinfo.append("<p>Volume: " + response[0].volume + "</p>");
	stockinfo.append("<p>Open: " + response[0].open + "<br> Change " + response[0].change + "</p>");



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
