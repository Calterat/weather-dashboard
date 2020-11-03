let searchFormEl = document.querySelector("#searchForm");
let uvCheckEl = document.querySelector("#uvCheck");
let forcastCardsEl = document.querySelector("#forcastCards");

const fConversion = (K) => {
    // converts Kelvin to Fahrenheit and rounds to one decimal place
    let F = Math.round((((K-273.15)*1.8)+32)*10.0)/10.0;
    return F;
}

const uviCheck = (uvi) => {
    // checks UV Index and changes backgorund color according to value
    if (uvi > 0) {
        uvCheckEl.classList = '';
        uvCheckEl.classList = 'bg-success rounded-lg p-1';
    } 
    if (uvi > 2) {
        uvCheckEl.classList = '';
        uvCheckEl.classList = 'bg-warning rounded-lg p-1';
    }
    if (uvi > 5) {
        uvCheckEl.classList = '';
        uvCheckEl.classList = 'bg-warning rounded-lg p-1';
    }
    if (uvi > 7) {
        uvCheckEl.classList = '';
        uvCheckEl.classList = 'btn-danger rounded-lg p-1';
    }
}

const createForcastCards = (temp, humidity, date, icon) => {
    // create card
    let forcastCard = document.createElement("div");
    forcastCard.classList = 'card p-3 bg-primary';
    // create and append card header
    let forcastCardHeader = document.createElement("h6");
    forcastCardHeader.textContent = date.format("MM/DD/YYYY");
    forcastCard.appendChild(forcastCardHeader);
    // create and apppend card icon
    let forcastCardIcon = document.createElement("img");
    forcastCardIcon.setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
    forcastCard.appendChild(forcastCardIcon);
    // create and append card temp
    let forcastCardTemp = document.createElement("p");
    forcastCardTemp.textContent = `Temp: ${temp} °F`;
    forcastCard.appendChild(forcastCardTemp);
    // create and append card humidity
    let forcastCardHumidity = document.createElement("p");
    forcastCardHumidity.textContent = `Humid: ${humidity} %`;
    forcastCard.appendChild(forcastCardHumidity);
    forcastCardsEl.appendChild(forcastCard);
}

const cityForcastPopulate = (data) => {
    // empty card container
    forcastCardsEl.textContent = '';
    // variables of time
    let forcastDate = moment();

    console.log(data);

    for (let i = 1; i < 6; ++i) {
        forcastDate = forcastDate.add( 1, 'days');        
        let forcastTemp = fConversion(data.daily[i].temp.day);
        let forcastHumidity = data.daily[i].humidity;
        let forcastIcon = data.daily[i].weather[0].icon;
        // loop through each additional day and create a weather card
        createForcastCards(forcastTemp, forcastHumidity, forcastDate, forcastIcon);
    }
}

const cityWeatherPopulate = (data, cityName) => {
    // Variables we need from fetch
    let tempK = data.current.temp; 
    let tempF = fConversion(tempK)
    let humidity = data.current.humidity;
    let wind = data.current.wind_speed;
    let uvIndex = data.current.uvi;
    let icon = data.current.weather[0].icon;
    let currentDate = moment();
    
    // Variables from the DOM
    let citySpan = document.querySelector("#city");
    let dateSpan = document.querySelector("#date");
    let tempSpan = document.querySelector("#temp");
    let humiditySpan = document.querySelector("#humidity");
    let windSpan = document.querySelector("#windSpeed");
    let uviSpan = document.querySelector("#uvIndex");
    let cityWeatherIconImg = document.querySelector("#currentWeatherIcon");
    cityWeatherIconImg.setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);

    // place values in DOM/HTML
    citySpan.textContent = cityName;
    dateSpan.textContent = currentDate.format(" (MM/DD/YYYY) ");
    tempSpan.textContent = tempF;
    humiditySpan.textContent = humidity;
    windSpan.textContent = wind;
    uviSpan.textContent = uvIndex;

    uviCheck(uvIndex);
}

const cityOneCallFetch = (cityLat, cityLon, cityName) => {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&appid=43457cfab621bccace2506c23d4ef384`
    
    // Open Weather Fetching
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                return response.json();                
            } else {
                alert(`Error: ${response.statusText}`);
            }            
        })
        .then(function(response) {
            cityWeatherPopulate(response, cityName);
            cityForcastPopulate(response);
        })
}

const cityLatLonFetch = (city) => {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?APPID=43457cfab621bccace2506c23d4ef384&q=${city}`
    // fetch lat and lon of city from standard call
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                return response.json().then(function(response) {
                    let cityLat = response.coord.lat;
                    let cityLon = response.coord.lon;
                    let cityName = response.name;
                    cityOneCallFetch(cityLat, cityLon, cityName);
                });
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
}

const collectUserCity = (event) => {
    // prevents page from reloading
    event.preventDefault();

    // check if user left text input black
    if (!event.target[0].value) {
        alert("Input a city into the field!");
        return;
    };

    // grab user input's value
    let cityInputEl = document.querySelector("#citySearch");
    let cityInput = cityInputEl.value
    // wipe text field after obtaining value
    cityInputEl.value = '';

    // send city into api fetch function
    cityLatLonFetch(cityInput);
    // cityWeatherForcast(cityInput);
}

// listens for user to submit data
searchFormEl.addEventListener("submit", collectUserCity);