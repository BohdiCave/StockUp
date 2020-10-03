  var settings = {
	"async": true, 
	"crossDomain": true,
	"url": "https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?region=US&q=tesla",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
		"x-rapidapi-key": "dc4dec46cdmshbe33f33e8f04383p1540fbjsnd5fecd94ffc8"
	}
}

$.ajax(settings).then(function (response) {
	
	console.log(response.news);

	for (var i=0; i < response.news.length; i++){
		var articleRow = $(".news-item"+i);
		var aRow = $("<tr>");
		var publisherTd = $("<td>").text(response.news[i].publisher);
		var titleTd = $("<td>").text(response.news[i].title);
		var linkTd = $("<td>").text(response.news[i].link);
		// var articleLink = '<a href="' + response.news[i].link + '"></a>'
		// var linkTd = $("<td>").text(articleLink);
		aRow.append(publisherTd, titleTd, linkTd);
		articleRow.append(aRow);
	}
	articleRow.append(aRow);
});