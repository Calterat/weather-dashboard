let searchFormEl = document.querySelector("#searchForm");

const collectUserCity = (event) => {
    //prevents page from reloading
    event.preventDefault();

    if (!event.target[0].value) {
        alert("Input a city into the field!");
    };

    let cityInputEl = document.querySelector("#citySearch");
    let cityInput = cityInputEl.value
    // cityInputEl.value = '';

    console.log(cityInput);
}

// listens for user to submit data
searchFormEl.addEventListener("submit", collectUserCity);