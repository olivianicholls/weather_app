let url = '';
let weatherDiv = document.getElementById('weather');
let weatherData = document.getElementById('weatherData');

// Api request into JSON
function fetchJSON() {
  fetch(url)
    .then(function(response) {
    return response.json();
  })
    .then(function(response) {
    weatherResults(response);
  })
    .catch(function(error){
    console.log('Error', error);
  })
}


// Clear old and set new location functions
let clearAndSet = {
  clearPrevious: function(id) {
    let elem = document.getElementById(id);
    
    if (weatherDiv.contains(elem)) {
      weatherDiv.removeChild(elem);
    } else if (weatherData.contains(elem)) {
      weatherData.removeChild(elem);
    }
  },
  clearIcon: function(name) {
    name = name + '-iconDiv';
    
    let iconDiv = document.getElementById(name);
    
    if (weatherData.contains(iconDiv)) {
      weatherData.removeChild(iconDiv);
    }
  },
  setNewLocation: function() {
    this.showSearch();
    
    this.clearPrevious('location');
    this.clearPrevious('temp');
    this.clearPrevious('description');
    this.clearPrevious('tempMin');
    this.clearPrevious('tempMax');
    this.clearPrevious('wind');
    this.clearPrevious('pressure');
    this.clearPrevious('humidity');
    
    this.clearIcon('High');
    this.clearIcon('Low');
    this.clearIcon('Wind');
    this.clearIcon('Pressure');
    this.clearIcon('Humidity');
    
    let cityInput = document.getElementById('city');
    let city = cityInput.value;
    let countryInput = document.getElementById('country');
    let country = countryInput.value;
    
    url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country + '&appid=dbef368b28c1e78087e801d1b009e369&units=metric';
    fetchJSON(url);
    
    // Hide search inputs
    let searchDiv = document.getElementById('search');
    let newSearch = document.getElementById('new-search');
    let searchBtn = document.getElementById('searchbtn');
    
    searchDiv.style.display = 'none';
    newSearch.style.display = 'block';
    weatherDiv.style.display = 'block';
    weatherData.style.display = 'grid';
  },
  showSearch: function() {
    let searchDiv = document.getElementById('search');
    let newSearch = document.getElementById('new-search');
    let searchBtn = document.getElementById('searchbtn');
    let cityInput = document.getElementById('city');
    let countryInput = document.getElementById('country');
    
    newSearch.addEventListener('click', function(event) {
      let elementClicked = event.target;
      
      
       if (elementClicked.id === 'new-search') {
        searchDiv.style.display = 'block';
        newSearch.style.display = 'none';
         weatherDiv.style.display = 'none';
         weatherData.style.display = 'none';
         
         cityInput.value = '';
         countryInput.value = '';
      }
    });  
  }
}

function setContent(id, content, category) {
  let newText = document.createElement('p');
  newText.id = id;
  newText.textContent = content + category;

  if (newText.id === 'location' || newText.id === 'temp' || newText.id === 'description') {
    weatherDiv.appendChild(newText);
  } else {
  weatherData.appendChild(newText);
  }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function weatherResults(response) {
  let city = response.name;
  let country = response.sys.country;
  let location = city + ', ' + country;
  let temp = response.main.temp;
  let description = response.weather[0].description;
  let capitalizedDescription = capitalizeFirstLetter(description);
  let tempMin = response.main.temp_min;
  let tempMax = response.main.temp_max;
  let wind = response.wind.speed;
  let pressure = response.main.pressure;
  let humidity = response.main.humidity;
  
  let celcius = ' ℃';
  let farenheit = ' ℉';
  
  setContent('location', location, '');
  setContent('temp', temp, celcius);
  setContent('description', capitalizedDescription, '');
  setContent('tempMax', tempMax, celcius);
  setContent('tempMin', tempMin, celcius);
  setContent('wind', wind, ' mph');
  setContent('pressure', pressure, ' mb');
  setContent('humidity', humidity, ' %');
  
  icon('tempMax', 'High', 'ion ion-arrow-up-c');
  icon('tempMin', 'Low', 'ion ion-arrow-down-c');
  icon('humidity', 'Humidity', 'ion ion-umbrella');
  icon('pressure', 'Pressure', 'ion ion-ios-speedometer');
  icon('wind', 'Wind', 'ion ion-ios-flag');
}


function icon(name, textContent, iconClass) {
  name = document.getElementById(name);
  let iconDiv = document.createElement('div');
  let icon = document.createElement('i');
  let text = document.createElement('p');
  
  text.className = 'iconText';
  text.textContent = textContent;
  icon.className = iconClass;
  iconDiv.id = textContent + '-iconDiv';
  
  name.insertAdjacentElement('beforebegin',iconDiv);
  iconDiv.appendChild(icon);
  iconDiv.appendChild(text);
}
