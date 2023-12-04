const inputField = document.querySelector("input"),
  infoText = document.querySelector(".info-txt"),
  locationBtn = document.querySelector(".input-part button"),
  wrapper = document.querySelector(".wrapper"),
  weatherImg = document.querySelector(".weather-part img");

let api;

// console.log(weatherImg);

inputField.addEventListener("keyup", (e) => {
  const inputLen = e.target.value.length;
  // console.log(inputLen);
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  } else if (inputLen === 0 && !inputField.value) {
    console.log("empty");
    infoText.classList.remove("error"); //if inputField is empty
  }
});

//calling city waether api
const API_KEY = "94244446178779ce391711484deccdc7";
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  fetchApi();
}

locationBtn.addEventListener("click", (e) => {
  if (navigator.geolocation) {
    //if browser support geolocation
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation");
  }
});

function onSuccess(position) {
  console.log(position);
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
  fetchApi();
}

function onError(error) {
  alert("Your location is disabled. Please first enable your location");
}

const fetchApi = async () => {
  try {
    infoText.innerHTML = `Getting Weather Details...`;
    infoText.classList.add("pending");
    await fetch(api)
      .then((response) => response.json())
      .then((result) => weatherDetails(result));
  } catch (error) {
    infoText.classList.replace("pending", "error");
    infoText.innerHTML = `${error.message}`;
  }
};

function weatherDetails(result) {
  infoText.classList.replace("error", "pending");
  if (result.cod == "404") {
    infoText.classList.replace("pending", "error");
    infoText.innerHTML = `${inputField.value} is not a valid city`;
  } else {
    infoText.classList.remove("pending", "error");
    wrapper.classList.add("active");
    inputField.value = "";

    const city = result.name;
    const { feels_like, humidity, temp } = result.main;
    const { description, id } = result.weather[0];
    const country = result.sys.country;

    console.log(feels_like, humidity, temp);
    wrapper.querySelector(".temperature .num").innerHTML = Math.trunc(temp);
    wrapper.querySelector(".weather").innerHTML = description;
    wrapper.querySelector(".location .city").innerHTML = city + `,`;
    wrapper.querySelector(".location .country").innerHTML = country;
    wrapper.querySelector(".temp .degree").innerHTML = Number(
      feels_like.toFixed(1)
    );
    wrapper.querySelector(".humidity-details .humidity").innerHTML =
      humidity + `%`;

    //images according to weather
    if (id >= 200 && id <= 232) {
      weatherImg.src = "img/strom.svg";
    } else if (id >= 300 && id <= 321) {
      weatherImg.src = "img/rain.svg";
    } else if (id >= 500 && id <= 531) {
      weatherImg.src = "img/rain.svg";
    } else if (id >= 600 && id <= 622) {
      weatherImg.src = "img/snow.svg";
    } else if (id >= 701 && id <= 781) {
      weatherImg.src = "img/haze.svg";
    } else if (id == 800) {
      weatherImg.src = "img/clear.svg";
    } else if (id >= 801 && id <= 804) {
      weatherImg.src = "img/cloud.svg";
    }
  }
}

//back arrow-btn
wrapper.querySelector("header i").addEventListener("click", () => {
  wrapper.classList.remove("active");
});
