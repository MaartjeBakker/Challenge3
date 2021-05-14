
function mainAPI(city) {

	var url = 'https://api.openweathermap.org/data/2.5/weather';
	var apiKey = '0da3526759bc841388aa0ee8ea5f0561'; //Mijn eigen API code
	
	var request = url + '?' + 'appid=' + apiKey + '&' + 'q=' + city;

	// haalt het huidige weer op
	fetch(request)	
	
	.then(function(response) {
		//foutmelding bij een niet bekende stad
		if(!response.ok) throw Error(response.statusText);
		return response.json();
	})
	
	// doet iets met de response van hierboven
	.then(function(response) {
		console.log(response);
		APIGoed(response);	
	})

	//"ga naar de error"
	.catch(function (error) {
		APIError(error);
	});
}

// functie waar in staat wat er gebeurd als er een juiste stad is ingevuld
function APIGoed(response) {

	var bewolking = response.weather[0].description;
	var gevoelTemp = Math.floor(response.main.feels_like - 273.15);
	var temp = Math.floor(response.main.temp - 273.15);
	var weer = document.getElementById('weer');
	var wind = response.wind.speed;
	weer.innerHTML = 'Temperature:  ' + temp + '&#176;C <br> Feels like: ' + gevoelTemp + '&#176;C <br> Cloud cover: ' + bewolking + '<br> Windspeed: ' + wind + ' m/s';

	// API kaat
	mapboxgl.accessToken = 'pk.eyJ1IjoibWFhcnRqZWJha2tlciIsImEiOiJja21rbGFkeWsxMjlpMnBxNHI0NXZ6Y3EyIn0.Op9hiBfTzVgrugY1lpJpGg';

	// coordinaten die op de kaart geladen moeten worden
	var long = response.coord.lon;
	var lat = response.coord.lat;

	// de kaart
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [long, lat],
		zoom: 9.5,
	});

	// zoom knoppen op de kaart
	map.addControl(new mapboxgl.NavigationControl()); 

	// Marker op de plek die is ingevuld
	var marker = new mapboxgl.Marker()
		.setLngLat([long, lat])
		.addTo(map);
}

// Functie waar i staat wat er gebeurd als er een onjuiste stad is ingevuld
function APIError(error) {
	console.error('Fetch request failed', error);
	var weer = document.getElementById('weer');
	weer.innerHTML = 'Did you enter a valid city? Try again'; 
}

// Als er iets wordt ingevuld wordt de eerste functie uitgevoerd op basis van het ingevulde
document.getElementById('getWeather').onclick = function(){
	mainAPI(document.getElementById('city').value);
};

// Als de pagina laad wordt deze plek als default weergegeven
window.onload = function(){
	mainAPI('Texel');
}

//onload
mainAPI();
APIGoed();
APIError();





