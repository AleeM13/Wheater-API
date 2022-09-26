const form = document.getElementById('form');
const input = document.getElementById('name');
const card = document.getElementById('card-container');
const msg = document.getElementById('msg');
const deleteAll = document.getElementById('deleteAll');

let cities = JSON.parse(localStorage.getItem('cities')) || [];

const saveLocalStorage = (citiesList) => {
    localStorage.setItem('cities', JSON.stringify(citiesList));
}

const crearCity = (city) => {
    const imageName = city.weather[0].icon;
    return `
    <div class="card-clima animate">
    <i class="fa-solid fa-x close" data-id='${city.id}'></i>
    <div class="clima-info">
              <h2 class="info-title">${city.name}, ${city.sys.country}</h2>
              <p class="info-subtitle">${city.weather[0].description}</p>
              <div class="info-temp">
                <span class="temp">${convertCelsius(city.main.temp)}°</span>
                <span class="st">${convertCelsius(city.main.feels_like)}° ST</span>
              </div>
            </div>
            <div class="clima-img">
            <img src="./img/${imageName}.png" alt=""/>
            </div>
            <div class="clima-temp">
              <div class="clima-max-min">
                <span class="clima-max"
                  ><i class="fa-solid fa-arrow-up-long"></i>Max: ${convertCelsius(city.main.temp_max)}</span
                >
                <span class="clima-min"
                  ><i class="fa-solid fa-arrow-down-long"></i>Min: ${convertCelsius(city.main.temp_min)}</span>
         </div>
       <span class="clima-humedad">${city.main.humidity}% Humedad</span>
      </div>
    </div>
    `
}

const convertCelsius = (kelvin) => {
    const celsius = Math.round(kelvin - 273.15);
    return celsius
};

const renderCities = (citiesList) => {
    card.innerHTML = citiesList.map((city) => crearCity(city)).join('');
}

const searchCity = async(e) => {
    e.preventDefault();
    const searchCity = input.value.trim();
    if (searchCity === '') return showError('Por favor ingresa una ciudad');
    const fetchedCity = await requestCity(searchCity);

    if (!fetchedCity.id) {
        form.reset();
        showError('La ciudad ingresada no existe')
    } else if (cities.some((city) => city.id === fetchedCity.id)) {
        form.reset();
        showError('Ya estamos mostrando el clima de esa ciudad');
    }

    cities = [fetchedCity, ...cities];
    renderCities(cities);
    saveLocalStorage(cities);
    hideDeleteAll(cities);
    hideMsg(cities);
    form.reset();
}

const showError = (message) => {
    const error = document.querySelector('small');
    error.textContent = message;
}

const hideDeleteAll = citiesList => {
    if (!citiesList.length){
        deleteAll.classList.add('hidden')
        return;
    }
    deleteAll.classList.remove('hidden');
}

const hideMsg = (citiesList) => {
    if (citiesList.length !== 0) {
        msg.classList.add('hidden');
        return;
    }
    msg.classList.remove('hidden');
}

const removeCity = (e) => {
    if (!e.target.classList.contains('close')) return;
    const filterId = Number(e.target.dataset.id);
    if (window.confirm("¿Está seguro que desea eliminar esta ciudad de la lista?")) {
        cities = cities.filter((city) => city.id !== filterId);
        renderCities(cities);
        saveLocalStorage(cities);
        hideDeleteAll(cities);
        hideMsg(cities);
    }
}

const removeAll = () => {
    if (window.confirm("¿Está seguro que desea eliminar todas las ciudades de la lista?")) {
        cities = [];
    }
    renderCities(cities);
    saveLocalStorage(cities);
    hideDeleteAll(cities);
    hideMsg(cities);
}

const init = () => {
    renderCities(cities);
    hideMsg(cities);
    form.addEventListener('submit', searchCity);
    card.addEventListener('click', removeCity);
    deleteAll.addEventListener('click', removeAll);
    hideDeleteAll(cities);
}

init();