// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const suggestionsDiv = document.getElementById('suggestions');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast-section');
const hourlySection = document.getElementById('hourly-section');
const forecastContainer = document.getElementById('forecast-container');
const hourlyContainer = document.getElementById('hourly-container');
const errorMessage = document.getElementById('error-message');
const welcomeMessage = document.getElementById('welcome');

// API configuration
const API_BASE = '/api';

// Event Listeners
searchBtn.addEventListener('click', () => searchWeather(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchWeather(searchInput.value);
});
searchInput.addEventListener('input', handleSearchInput);
locationBtn.addEventListener('click', getLocationWeather);

// Search city suggestions
async function handleSearchInput(e) {
  const query = e.target.value.trim();

  if (query.length < 2) {
    suggestionsDiv.classList.remove('show');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/cities/search/${query}`);
    const cities = await response.json();

    if (cities.length === 0) {
      suggestionsDiv.classList.remove('show');
      return;
    }

    suggestionsDiv.innerHTML = cities
      .map(city => `
        <div class="suggestion-item" onclick="selectCity('${city.name}', '${city.country}')">
          <div class="suggestion-city">${city.name}</div>
          <div class="suggestion-country">${city.state ? city.state + ', ' : ''}${city.country}</div>
        </div>
      `)
      .join('');

    suggestionsDiv.classList.add('show');
  } catch (error) {
    console.error('Search error:', error);
    showError('Failed to search cities');
  }
}

// Select city from suggestions
function selectCity(cityName, country) {
  searchInput.value = `${cityName}, ${country}`;
  suggestionsDiv.classList.remove('show');
  searchWeather(cityName);
}

// Search weather by city
async function searchWeather(city) {
  if (!city.trim()) {
    showError('Please enter a city name');
    return;
  }

  try {
    showLoading();
    const response = await fetch(`${API_BASE}/weather/city/${city}`);

    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Weather fetch error:', error);
    showError(error.message || 'Failed to fetch weather data');
  }
}

// Get weather by geolocation
async function getLocationWeather() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser');
    return;
  }

  try {
    showLoading();
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        showError('Unable to get your location. Please allow location access.');
        console.error('Geolocation error:', error);
      }
    );
  } catch (error) {
    showError('Geolocation error: ' + error.message);
  }
}

// Fetch weather by coordinates
async function fetchWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(`${API_BASE}/weather/coordinates/${lat}/${lon}`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    searchInput.value = `${data.current.city}, ${data.current.country}`;
    displayWeather(data);
  } catch (error) {
    console.error('Weather fetch error:', error);
    showError('Failed to fetch weather data');
  }
}

// Display weather data
function displayWeather(data) {
  const { current, forecast } = data;

  // Update current weather
  document.getElementById('city-name').textContent = `${current.city}, ${current.country}`;
  document.getElementById('weather-description').textContent = current.description;
  document.getElementById('temperature').textContent = Math.round(current.temperature);
  document.getElementById('feels-like').textContent = Math.round(current.feelsLike);
  document.getElementById('humidity').textContent = `${current.humidity}%`;
  document.getElementById('wind-speed').textContent = `${current.windSpeed.toFixed(1)} m/s`;
  document.getElementById('pressure').textContent = `${current.pressure} hPa`;
  document.getElementById('cloudiness').textContent = `${current.cloudiness}%`;
  document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
  document.getElementById('sunrise').textContent = new Date(current.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('sunset').textContent = new Date(current.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('coordinates').textContent = `${current.coordinates.lat.toFixed(2)}°, ${current.coordinates.lon.toFixed(2)}°`;

  // Update weather icon
  const iconUrl = `https://openweathermap.org/img/wn/${current.icon}@4x.png`;
  document.getElementById('weather-icon').src = iconUrl;
  document.getElementById('weather-icon').alt = current.description;

  // Display sections
  welcomeMessage.classList.add('hidden');
  currentWeatherSection.classList.remove('hidden');
  forecastSection.classList.remove('hidden');
  hourlySection.classList.remove('hidden');
  errorMessage.classList.add('hidden');

  // Display forecast
  displayForecast(forecast);
  displayHourlyForecast(forecast);
}

// Display 5-day forecast
function displayForecast(forecast) {
  forecastContainer.innerHTML = forecast
    .map(day => `
      <div class="forecast-card">
        <div class="forecast-date">${formatDate(day.date)}</div>
        <div class="forecast-icon">
          <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
        </div>
        <div class="forecast-desc">${day.description}</div>
        <div class="forecast-temps">
          <div class="temp-box">
            <span class="temp-label">Max</span>
            <span class="temp-value">${Math.round(day.maxTemp)}°</span>
          </div>
          <div class="temp-box">
            <span class="temp-label">Avg</span>
            <span class="temp-value">${day.avgTemp}°</span>
          </div>
          <div class="temp-box">
            <span class="temp-label">Min</span>
            <span class="temp-value">${Math.round(day.minTemp)}°</span>
          </div>
        </div>
        <div class="forecast-humidity">💧 ${day.avgHumidity}%</div>
        <div class="forecast-wind">💨 ${day.avgWindSpeed} m/s</div>
      </div>
    `)
    .join('');
}

// Display hourly forecast (first day)
function displayHourlyForecast(forecast) {
  if (forecast.length === 0) return;

  const firstDay = forecast[0];
  hourlyContainer.innerHTML = firstDay.hourly
    .slice(0, 12) // Show first 12 hours
    .map(hour => `
      <div class="hourly-item">
        <div class="hourly-time">${hour.time}</div>
        <div class="hourly-icon">
          <img src="https://openweathermap.org/img/wn/${hour.icon}@2x.png" alt="Weather">
        </div>
        <div class="hourly-temp">${Math.round(hour.temp)}°C</div>
      </div>
    `)
    .join('');
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[date.getDay()]} ${date.getDate()}`;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  currentWeatherSection.classList.add('hidden');
  forecastSection.classList.add('hidden');
  hourlySection.classList.add('hidden');
}

function showLoading() {
  currentWeatherSection.classList.add('hidden');
  forecastSection.classList.add('hidden');
  hourlySection.classList.add('hidden');
  errorMessage.classList.add('hidden');
  welcomeMessage.classList.add('hidden');
}

// Initialize - close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (e.target !== searchInput) {
    suggestionsDiv.classList.remove('show');
  }
});

// Default city on load
window.addEventListener('load', () => {
  console.log('Weather Dashboard loaded');
});
