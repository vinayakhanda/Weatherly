document.onload(document.getElementById("mainWeather").style.display = "none");

function GetWeather(city, state, country, lat, lon) {
  document.getElementById("mainWeather").style.display = "block";
  // document.getElementById("cityButtons").style.display="none";
  document.location = ("#mainWeather");
  const apiKey = 'a2627557f804e7ecb9d92e88d8107c99';
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&appid=${apiKey}&units=metric`;
  const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const iconUrl = `https://openweathermap.org/img/wn/`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      document.getElementById("current_date").innerHTML = new Date();

      document.getElementById("temp_main").innerHTML = Math.round(data.main.temp) + "°C";
      document.getElementById("desc_main").innerHTML = data.weather[0].main;
      document.getElementById("temp_min").innerHTML = Math.round(data.main.temp_min) + "°C";
      document.getElementById("temp_max").innerHTML = Math.round(data.main.temp_max) + "°C";
      document.getElementById("wind").innerHTML = Math.round(data.wind.speed) + "m/s";
      document.getElementById("humidity").innerHTML = Math.round(data.main.humidity);
      document.getElementById("mainImage").src = iconUrl+data.weather[0].icon+"@2x.png";

      



    })
    .catch(error => {
      console.error('Error fetching current weather data:', error.message);
    });

    fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
        // Start from the 7th element and take every 3rd element for the next 5 days
        for (let i = 0; i < 5; i++) {
            const currentIndex = 7 + i * 7;
            const rawDate = data.list[currentIndex].dt_txt;
            const dateObject = new Date(rawDate);

            const day = dateObject.getDate();
            const month = dateObject.getMonth() + 1;
            const year = dateObject.getFullYear();

            const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

            // Updating HTML elements with the formatted date for each day
            document.getElementById(`day${i + 1}.date`).innerHTML = formattedDate;
            document.getElementById(`day${i + 1}.temp`).innerHTML = data.list[currentIndex].main.temp + "°C";
            document.getElementById(`day${i + 1}.cond`).innerHTML = data.list[currentIndex].weather[0].main;
        }
    })
    .catch(error => {
        console.error('Error fetching weather forecast data:', error.message);
    });


    fetch(aqiUrl)
    .then(response => response.json())
    .then(data => {
        const aqiValue = data.list[0].main.aqi;
        const pm25Value = data.list[0].components.pm2_5;
        const pm10Value = data.list[0].components.pm10;
        aqiCond = "";

      if (aqiValue == 1) {
        aqiCond = "Good";
      } else {
        if (aqiValue == 2) {
        aqiCond = "Fair";
      } else {
        if (aqiValue == 3) {
          aqiCond = "Moderate";
        } else {
          if (aqiValue == 4) {
            aqiCond = "Poor";
          } else {
            aqiCond = "Very Poor";
          } 
        }
      }
      }

        document.getElementById('aqi_main').innerText = `AQI: ${aqiCond}`;
        document.getElementById('aqi_pm25').innerText = pm25Value;
        document.getElementById('aqi_pm10').innerText = `${pm10Value} µg/m³`;
        document.getElementById('aqi_so2').innerText = `${data.list[0].components.so2} µg/m³`;
        document.getElementById('aqi_no2').innerText = `${data.list[0].components.no2} µg/m³`;

     
    })
    .catch(error => {
        console.error('Error fetching AQI data:', error);
        document.getElementById('aqi-value').innerText = 'Error fetching AQI data';
    });
}