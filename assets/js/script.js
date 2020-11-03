let searchFormEl = document.querySelector("#searchForm");

const cityWeatherPopulate = (data) => {
    console.log(data);
}

const cityWeatherFetch = (city) => {

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?APPID=43457cfab621bccace2506c23d4ef384&q=${city}`
    
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
            cityWeatherPopulate(response);
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
    cityWeatherFetch(cityInput);
    // cityWeatherForcast(cityInput);
}

// listens for user to submit data
searchFormEl.addEventListener("submit", collectUserCity);