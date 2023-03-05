import {
    items,
    tabs,
    nameTown,
    temperatureTown,
    iconsMain,
    searchInput,
    favoriteBtn,
    locationList,
    weatherList,
    feelsList,
    sunriseList,
    sunsetList,
    wind,
    humidity,
    count
} from "./const.js";
import {
    setItemStorage, getItemStorage
} from './storage.js'
const serverUrl = "http://api.openweathermap.org/data/2.5/weather";
const apiKey = "f660a2fb1e4bad108d6160b7f58c555f";
const uniqueCities = JSON.parse(localStorage.getItem('cities')) || [];
let result;
tabs.forEach((item, index, array) => {
    item.addEventListener('click', function (e) {
        e.preventDefault()
        activeTab(item, index, array);
        activeTab(item, index, items)
    })
})

function activeTab(tab, index, array) {
    array.forEach(item => {
        if (item.classList.contains('active')) {
            item.classList.remove('active');
        }
    })
    array[index].classList.add('active')
}

function request(url = serverUrl, city = searchInput.value) {
    let cityUrl = `${url}?q=${city}&appid=${apiKey}&units=metric`;
    fetch(cityUrl)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            infoCity(data);
        })
        .catch(() => console.log('some error'));
}

function favoriteBtnActive() {
    if (uniqueCities.includes(getItemStorage('city'))) {
        favoriteBtn.classList.toggle('active')
    }
}

searchInput.addEventListener('change', function () {
    request(serverUrl);
    favoriteBtnActive()
});

function enumeration(item, value) {
    item.forEach((item) => (item.textContent = value));
    return value;
}

function infoCity(info) {
    result =
    {
        town: info.name,
        temperature: parseInt(info.main.temp),
        feelslike: parseInt(info.main.feels_like),
        sunrise: sunriseTime(info.sys.sunrise),
        sunset: sunriseTime(info.sys.sunset),
        icon: `http://openweathermap.org/img/wn/${info.weather[0]["icon"]}@4x.png`,
        weather: info.weather[0].main,
        wind: parseInt(info.wind.speed),
        humidity: info.main.humidity
    }
    enumeration(nameTown, result.town);
    enumeration(temperatureTown, result.temperature);
    enumeration(weatherList, result.weather);
    enumeration(feelsList, result.feelslike);
    sunriseList.textContent = result.sunrise;
    sunsetList.textContent = result.sunset;
    iconsMain.src = result.icon;
    wind.textContent = result.wind;
    humidity.textContent = result.humidity;
    setItemStorage('city', result.town)
    let dataName = document.querySelector('.name-data');
    dataName.dataset.name = result.town
    favoriteBtnActive()

}


function sunriseTime(sunriseValue) {
    let resultTime = new Date(sunriseValue * 1000);
    resultTime = resultTime.toLocaleTimeString();
    return resultTime;
}


function addList(value) {
    let li = document.createElement("li");
    li.className = 'location__item';
    let deleteTown = document.createElement('button');
    let spanName = document.createElement('span')
    locationList.appendChild(li);
    spanName.textContent = value;
    deleteTown.className = "location__btn";
    li.append(spanName);
    li.append(deleteTown);
    spanName.addEventListener('click', function () {
        request(serverUrl, this.textContent);
    })
    deleteTown.addEventListener('click', function () {
        deleteCityFavoriteList(spanName.textContent)
    })
}

favoriteBtn.addEventListener('click',
    function (e) {
        if (!e.currentTarget.classList.contains('active')) {

            if (!uniqueCities.includes(result.town)) {
                uniqueCities.push(result.town);
            }
            render(uniqueCities);
            setItemStorage('cities', JSON.stringify(uniqueCities))
            count.textContent = uniqueCities.length;
            favoriteBtn.classList.toggle('active');
        } else {
            if (!uniqueCities.includes(result.town)) {
                uniqueCities.push(result.town);
            }
            render(uniqueCities);
            setItemStorage('cities', JSON.stringify(uniqueCities))
            count.textContent = uniqueCities.length;
            deleteCityFavoriteList(getItemStorage('city'))
            favoriteBtn.classList.remove('active');
        }
    }
);

function render(array) {
    locationList.innerHTML = "";
    array.forEach(item => addList(item))
}

function deleteCityFavoriteList(city) {
    uniqueCities.splice(uniqueCities.indexOf(city), 1);
    setItemStorage('cities', JSON.stringify(uniqueCities))
    render(uniqueCities);
    favoriteBtn.classList.remove('active');
    count.textContent = uniqueCities.length
}
document.addEventListener("DOMContentLoaded", function () {
    if (JSON.parse(getItemStorage('cities'))) {
        render(JSON.parse(getItemStorage('cities')))
    }
    getItemStorage('city') ? request(serverUrl, getItemStorage('city')) : request(serverUrl, 'Kazan');
    count.textContent = uniqueCities.length;
});
