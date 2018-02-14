let url = '';
let container = document.getElementById('container');
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
  .catch(set.error);
}

// Clear old location data
let clear = {
  clearPrevious: function(id) {
    let elem = document.getElementById(id);
    
    if (weatherDiv.contains(elem)) {
      weatherDiv.removeChild(elem);
    } else if (weatherData.contains(elem)) {
      weatherData.removeChild(elem);
    } else if (container.contains(elem)) {
      container.removeChild(elem);
    }
  },
   clearIcon: function(name) {
    name = name + '-iconDiv';
    let iconDiv = document.getElementById(name);
    
    if (weatherData.contains(iconDiv)) {
      weatherData.removeChild(iconDiv);
    }
  },
}

// Set new location data
let set = {
  setContent: function(id, content, category) {
  let newText = document.createElement('p');
  newText.id = id;
  newText.textContent = content + category;
  
  if (newText.id === 'location' || newText.id === 'temp' || newText.id === 'description') {
    weatherDiv.appendChild(newText);
  } else {
    weatherData.appendChild(newText);
  }
},
  setTime: function(timestamp) {  // set timestamp
  let timeDiv = document.createElement('div');
  let time = document.createElement('p');
  
  weatherData.insertAdjacentElement('afterend',timeDiv);
  timeDiv.appendChild(time);
  
  time.textContent = 'Data caputered at ' + timestamp + ' by Openweathermap.org';
  timeDiv.id = 'timestamp'
},
  setIcons:function(textContent, iconClass) {  // set weather icons
  let iconDiv = document.createElement('div');
  let icon = document.createElement('i');
  let text = document.createElement('p');
  
  text.className = 'iconText';
  text.textContent = textContent;
  icon.className = iconClass;
  iconDiv.id = textContent + '-iconDiv';
  
  weatherData.appendChild(iconDiv);
  iconDiv.appendChild(icon);
  iconDiv.appendChild(text);
},
  setNewLocation: function() {  // set new location
    showHide.showSearch();
    
    clear.clearPrevious('location'); // clear old location weather data
    clear.clearPrevious('temp');
    clear.clearPrevious('description');
    clear.clearPrevious('tempMin');
    clear.clearPrevious('tempMax');
    clear.clearPrevious('wind');
    clear.clearPrevious('pressure');
    clear.clearPrevious('humidity');
    clear.clearPrevious('errorMessage');
    
    
    clear.clearIcon('High'); // clear old weather icons
    clear.clearIcon('Low');
    clear.clearIcon('Wind');
    clear.clearIcon('Pressure');
    clear.clearIcon('Humidity');
    
    let cityInput = document.getElementById('city');  // set new location
    let city = cityInput.value;
    let countryInput = document.getElementById('country');
    let country = toTitleCase(countryInput.value);
    let match = false;
    let countryCode = '';
    
    if (city === '') {  // Make sure both inputs have data  
      alert('Please input a City');
    } else if (country === '') {
      alert('Please enter a Country');
    } else{
      for(let i = 0; i < countries.length; i++) {  // Find ISO country code
        let countryName = countries[i];
          if (countryName[0] === country) {
            countryCode = countryName[1];
            match = true;
          } 
      }
      
      if (match) {
        url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + countryCode + '&type=accurate&appid=dbef368b28c1e78087e801d1b009e369&units=metric';
        fetchJSON(url); 
        
        showHide.hideSearch();
        
      } else {
        this.error();
      }
    }
  },
  error: function() {
    let errorMessage = document.createElement('p');
    weatherDiv.appendChild(errorMessage);
    errorMessage.textContent = 'Sorry, we can\'t find this location! Please try another location';
    errorMessage.id = 'errorMessage';
    
    showHide.hideSearch();
  }
}

//Show or hide search inputs
let showHide = {
   showSearch: function() {
    let searchDiv = document.getElementById('search');
    let newSearch = document.getElementById('new-search');
    let searchBtn = document.getElementById('searchbtn');
    let cityInput = document.getElementById('city');
    let countryInput = document.getElementById('country');
    
    newSearch.addEventListener('click', function(event) {
      searchDiv.style.display = 'grid';
      newSearch.style.display = 'none';
      weatherDiv.style.display = 'none';
      weatherData.style.display = 'none';
      cityInput.value = '';
      countryInput.value = '';
      
      clear.clearPrevious('timestamp');
    });  
  },
  hideSearch: function() {
    let searchDiv = document.getElementById('search');
    let newSearch = document.getElementById('new-search');
    let searchBtn = document.getElementById('searchbtn');
    
    searchDiv.style.display = 'none';
    newSearch.style.display = 'block';
    weatherDiv.style.display = 'block';
    weatherData.style.display = 'grid';
  }
}

function toTitleCase(str) { 
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

// Save API response to variables

function weatherResults(response) {
  let city = response.name;
  let country = response.sys.country;
  let location = city + ', ' + country;
  let temp = response.main.temp;
  let description = response.weather[0].main;
  let tempMin = response.main.temp_min;
  let tempMax = response.main.temp_max;
  let wind = response.wind.speed;
  let pressure = response.main.pressure;
  let humidity = response.main.humidity;
  let timestamp = response.dt;
  
  let celcius = ' °C';
  let farenheit = ' °F';
  
  set.setContent('location', location, '');
  set.setContent('temp', temp, celcius);
  set.setContent('description', description, '');
  set.setContent('tempMax', tempMax, celcius);
  set.setContent('tempMin', tempMin, celcius);
  set.setContent('wind', wind, ' mph');
  set.setContent('pressure', pressure, ' mb');
  set.setContent('humidity', humidity, ' %');
  
  set.setIcons('High', 'ion ion-arrow-up-c');
  set.setIcons('Low', 'ion ion-arrow-down-c');
  set.setIcons('Wind', 'ion ion-ios-flag');
  set.setIcons('Pressure', 'ion ion-ios-speedometer');
  set.setIcons('Humidity', 'ion ion-umbrella');
  
  let date = new Date(timestamp*1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let formattedTime = hours + ':' + minutes.substr(-2);
  
  set.setTime(formattedTime);
}

// List of countries and their ISO country codes
let countries = [
  ['Afghanistan', 'AF'], 
  ['Aland Islands', 'AX'], 
  ['Albania', 'AL'], 
  ['Algeria', 'DZ'], 
  ['American Samoa', 'AS'], 
  ['Andorra', 'AD'], 
  ['Angola', 'AO'], 
  ['Anguilla', 'AI'], 
  ['Antarctica', 'AQ'], 
  ['Antigua and Barbuda', 'AG'], 
  ['Argentina', 'AR'], 
  ['Armenia', 'AM'], 
  ['Aruba', 'AW'], 
  ['Australia', 'AU'], 
  ['Austria', 'AT'], 
  ['Azerbaijan', 'AZ'], 
  ['Bahamas', 'BS'], 
  ['Bahrain', 'BH'], 
  ['Bangladesh', 'BD'], 
  ['Barbados', 'BB'], 
  ['Belarus', 'BY'], 
  ['Belgium', 'BE'], 
  ['Belize', 'BZ'], 
  ['Benin', 'BJ'], 
  ['Bermuda', 'BM'], 
  ['Bhutan', 'BT'], 
  ['Bolivia', 'BO'], 
  ['Bosnia and Herzegovina', 'BA'], 
  ['Botswana', 'BW'], 
  ['Bouvet Island', 'BV'], 
  ['Brazil', 'BR'], 
  ['British Virgin Islands', 'VG'], 
  ['British Indian Ocean Territory', 'IO'], 
  ['Brunei Darussalam', 'BN'], 
  ['Bulgaria', 'BG'], 
  ['Burkina Faso', 'BF'], 
  ['Burundi', 'BI'], 
  ['Cambodia', 'KH'], 
  ['Cameroon', 'CM'], 
  ['Canada', 'CA'], 
  ['Cape Verde', 'CV'], 
  ['Cayman Islands', 'KY'], 
  ['Central African Republic', 'CF'], 
  ['Chad', 'TD'], 
  ['Chile', 'CL'], 
  ['China', 'CN'], 
  ['Hong Kong', 'HK'], 
  ['Macao', 'MO'], 
  ['Christmas Island', 'CX'], 
  ['Cocos Keeling Islands', 'CC'], 
  ['Colombia', 'CO'], 
  ['Comoros', 'KM'], 
  ['Congo Brazzaville', 'CG'], 
  ['Congo Kinshasa', 'CD'], 
  ['Cook Islands', 'CK'], 
  ['Costa Rica', 'CR'], 
  ['Côte dIvoire', 'CI'], 
  ['Croatia', 'HR'], 
  ['Cuba', 'CU'], 
  ['Cyprus', 'CY'], 
  ['Czech Republic', 'CZ'], 
  ['Denmark', 'DK'], 
  ['Djibouti', 'DJ'], 
  ['Dominica', 'DM'], 
  ['Dominican Republic', 'DO'], 
  ['Ecuador', 'EC'], 
  ['Egypt', 'EG'], 
  ['El Salvador', 'SV'], 
  ['Equatorial Guinea', 'GQ'], 
  ['Eritrea', 'ER'], 
  ['Estonia', 'EE'], 
  ['Ethiopia', 'ET'], 
  ['Falkland Islands Malvinas', 'FK'], 
  ['Faroe Islands', 'FO'], 
  ['Fiji', 'FJ'], 
  ['Finland', 'FI'], 
  ['France', 'FR'], 
  ['French Guiana', 'GF'], 
  ['French Polynesia', 'PF'], 
  ['French Southern Territories', 'TF'], 
  ['Gabon', 'GA'], 
  ['Gambia', 'GM'], 
  ['Georgia', 'GE'], 
  ['Germany', 'DE'], 
  ['Ghana', 'GH'], 
  ['Gibraltar', 'GI'], 
  ['Greece', 'GR'], 
  ['Greenland', 'GL'], 
  ['Grenada', 'GD'], 
  ['Guadeloupe', 'GP'], 
  ['Guam', 'GU'], 
  ['Guatemala', 'GT'], 
  ['Guernsey', 'GG'], 
  ['Guinea', 'GN'], 
  ['Guinea Bissau', 'GW'], 
  ['Guyana', 'GY'], 
  ['Haiti', 'HT'], 
  ['Heard and Mcdonald Islands', 'HM'], 
  ['Vatican City', 'VA'], 
  ['Honduras', 'HN'], 
  ['Hungary', 'HU'], 
  ['Iceland', 'IS'], 
  ['India', 'IN'], 
  ['Indonesia', 'ID'], 
  ['Iran', 'IR'], 
  ['Iraq', 'IQ'], 
  ['Ireland', 'IE'], 
  ['Isle of Man', 'IM'], 
  ['Israel', 'IL'], 
  ['Italy', 'IT'], 
  ['Jamaica', 'JM'], 
  ['Japan', 'JP'], 
  ['Jersey', 'JE'], 
  ['Jordan', 'JO'], 
  ['Kazakhstan', 'KZ'], 
  ['Kenya', 'KE'], 
  ['Kiribati', 'KI'], 
  ['North Korea', 'KP'], 
  ['South Korea', 'KR'], 
  ['Kuwait', 'KW'], 
  ['Kyrgyzstan', 'KG'], 
  ['Lao PDR', 'LA'], 
  ['Latvia', 'LV'], 
  ['Lebanon', 'LB'], 
  ['Lesotho', 'LS'], 
  ['Liberia', 'LR'], 
  ['Libya', 'LY'], 
  ['Liechtenstein', 'LI'], 
  ['Lithuania', 'LT'], 
  ['Luxembourg', 'LU'], 
  ['Macedonia', 'MK'], 
  ['Madagascar', 'MG'], 
  ['Malawi', 'MW'], 
  ['Malaysia', 'MY'], 
  ['Maldives', 'MV'], 
  ['Mali', 'ML'], 
  ['Malta', 'MT'], 
  ['Marshall Islands', 'MH'], 
  ['Martinique', 'MQ'], 
  ['Mauritania', 'MR'], 
  ['Mauritius', 'MU'], 
  ['Mayotte', 'YT'], 
  ['Mexico', 'MX'], 
  ['Micronesia', 'FM'], 
  ['Moldova', 'MD'], 
  ['Monaco', 'MC'], 
  ['Mongolia', 'MN'], 
  ['Montenegro', 'ME'], 
  ['Montserrat', 'MS'], 
  ['Morocco', 'MA'], 
  ['Mozambique', 'MZ'], 
  ['Myanmar', 'MM'], 
  ['Namibia', 'NA'], 
  ['Nauru', 'NR'], 
  ['Nepal', 'NP'], 
  ['Netherlands', 'NL'], 
  ['Netherlands Antilles', 'AN'], 
  ['New Caledonia', 'NC'], 
  ['New Zealand', 'NZ'], 
  ['Nicaragua', 'NI'], 
  ['Niger', 'NE'], 
  ['Nigeria', 'NG'], 
  ['Niue', 'NU'], 
  ['Norfolk Island', 'NF'], 
  ['Northern Mariana Islands', 'MP'], 
  ['Norway', 'NO'], 
  ['Oman', 'OM'], 
  ['Pakistan', 'PK'], 
  ['Palau', 'PW'], 
  ['Palestinian Territory', 'PS'], 
  ['Panama', 'PA'], 
  ['Papua New Guinea', 'PG'], 
  ['Paraguay', 'PY'], 
  ['Peru', 'PE'], 
  ['Philippines', 'PH'], 
  ['Pitcairn', 'PN'], 
  ['Poland', 'PL'], 
  ['Portugal', 'PT'], 
  ['Puerto Rico', 'PR'], 
  ['Qatar', 'QA'], 
  ['Réunion', 'RE'], 
  ['Romania', 'RO'], 
  ['Russian Federation', 'RU'], 
  ['Rwanda', 'RW'], 
  ['Saint Barthélemy', 'BL'], 
  ['Saint Helena', 'SH'], 
  ['Saint Kitts and Nevis', 'KN'], 
  ['Saint Lucia', 'LC'], 
  ['Saint Martin', 'MF'], 
  ['Saint Pierre and Miquelon', 'PM'], 
  ['Saint Vincent and Grenadines', 'VC'], 
  ['Samoa', 'WS'], 
  ['San Marino', 'SM'], 
  ['Sao Tome and Principe', 'ST'], 
  ['Saudi Arabia', 'SA'], 
  ['Senegal', 'SN'], 
  ['Serbia', 'RS'], 
  ['Seychelles', 'SC'], 
  ['Sierra Leone', 'SL'], 
  ['Singapore', 'SG'], 
  ['Slovakia', 'SK'], 
  ['Slovenia', 'SI'], 
  ['Solomon Islands', 'SB'], 
  ['Somalia', 'SO'], 
  ['South Africa', 'ZA'], 
  ['South Georgia and the South Sandwich Islands', 'GS'], 
  ['South Sudan', 'SS'], 
  ['Spain', 'ES'], 
  ['Sri Lanka', 'LK'], 
  ['Sudan', 'SD'], 
  ['Suriname', 'SR'], 
  ['Svalbard and Jan Mayen Islands', 'SJ'], 
  ['Swaziland', 'SZ'], 
  ['Sweden', 'SE'], 
  ['Switzerland', 'CH'], 
  ['Syria', 'SY'], 
  ['Taiwan', 'TW'], 
  ['Tajikistan', 'TJ'], 
  ['Tanzania', 'TZ'], 
  ['Thailand', 'TH'], 
  ['Timor Leste', 'TL'], 
  ['Togo', 'TG'], 
  ['Tokelau', 'TK'], 
  ['Tonga', 'TO'], 
  ['Trinidad and Tobago', 'TT'], 
  ['Tunisia', 'TN'], 
  ['Turkey', 'TR'], 
  ['Turkmenistan', 'TM'], 
  ['Turks and Caicos Islands', 'TC'], 
  ['Tuvalu', 'TV'], 
  ['Uganda', 'UG'], 
  ['Ukraine', 'UA'], 
  ['United Arab Emirates', 'AE'], 
  ['United Kingdom', 'GB'], 
  ['Uk', 'GB'],
  ['UK', 'GB'],
  ['United States of America', 'US'], 
  ['Us', 'US'],
  ['Usa', 'US'],
  ['USA', 'US'],
  ['US Minor Outlying Islands', 'UM'], 
  ['Uruguay', 'UY'], 
  ['Uzbekistan', 'UZ'], 
  ['Vanuatu', 'VU'], 
  ['Venezuela', 'VE'], 
  ['Viet Nam', 'VN'], 
  ['Virgin Islands', 'VI'], 
  ['Wallis and Futuna Islands', 'WF'], 
  ['Western Sahara', 'EH'], 
  ['Yemen', 'YE'], 
  ['Zambia', 'ZM'], 
  ['Zimbabwe', 'ZW'],
];
