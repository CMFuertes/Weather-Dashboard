var city = $("#searchvalue").val();
let apiKey = "&appid=85c8916b3b56ebd5ed290d4b8a6bc531";

var date = new Date();
$("#searchValue").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#searchBtn").click(); 
	} 
});

$("#searchBtn").on("click", function() {

  $('#forecastDay').addClass('show');

  city = $("#searchValue").val(); //user inputs city name
  
  $("#searchValue").val(""); //clear input

  let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: queryUrl,
    method: "GET"
  })
  .then(function (response){

    console.log(response)

    console.log(response.name)
    console.log(response.weather[0].icon)

    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    console.log(Math.floor(tempF))

    console.log(response.main.humidity)

    console.log(response.wind.speed)

    console.log(response.value)

    getCurrentConditions(response);
    getCurrentForecast(response);
    makeList();

    })
  });

  function makeList() {
    var listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
  }

  function getCurrentConditions (response) {

    var tempF = (response.main.temp - 273.15) * 1.80 + 32; //temp conversion
    tempF = Math.floor(tempF);

    $('#selectedCity').empty();

    let card = $("<div>").addClass("card");
    let cardBody = $("<div>").addClass("card-body");
    let city = $("<h4>").addClass("card-title").text(response.name);
    let cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    let temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    let humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    let wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    let image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
  
      var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=85c8916b3b56ebd5ed290d4b8a6bc531&units=imperial&lat=" + response.coord.lat + "&lon=" + response.coord.lat;
      $.ajax({
          url: uvURL,
          method: "GET"
      })
      .then(function (uvresponse) {
          var uvIndex = uvresponse.value;
          var bgColor;
          if (uvIndex <= 3) {
              bgColor = "green";
          }
          else if ((uvIndex >=4) && (uvIndex <= 8)) {
              bgColor = "yellow";
          }
         
          else 
              bgColor = "orange";
          
        var uvdisp = $("<p>").attr("class", "card-text").text("UV Index: ");
        uvdisp.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgColor)).text(uvIndex));
        cardBody.append(uvdisp);
    });
      
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#selectedCity").append(card)
  }

function getCurrentForecast () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){

    console.log(response)
    console.log(response.dt)
    $('#forecast').empty();

    var results = response.list;
    console.log(results)
    
    for (var i = 0; i < results.length; i++) {

      var day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      var hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      console.log(day);
      console.log(hour);

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
        var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        var tempF = Math.floor(temp);

        let card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        let cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        let cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        let temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
        let humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

        let image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);
      }
    }
  });
}
