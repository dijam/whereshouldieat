var Main = {};

var Main = function(){

	this.init = function(){
		window.x = document.getElementById("demo");
		setLocation();
	};
	
	this.init();
}

function setGoogleMap(position){
	var mapOptions = {
		center: new google.maps.LatLng(position.Ya, position.Za),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map_canvas"),
		mapOptions);
	return map;

	// new google.maps.LatLng(window.position.coords.latitude, window.position.coords.longitude);
}

function setLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPosition, showError);
	}
	else {
		window.x.innerHTML="Geolocation is not supported by this browser.";
	}
}

function setPosition(position) {
	// console.log("Your location: " + position);
	// window.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);  //Uncomment to enable auto location finder

	window.position = new google.maps.LatLng(59.34702, 18.040195); // Uncomment for manual location
	window.map = setGoogleMap(window.position);

	createMarker(window.position, "Your Location", "http://maps.google.com/mapfiles/ms/icons/green-dot.png");
	new LocationFinder(window.position, window.map);
}


function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			window.x.innerHTML="User denied the request for Geolocation."
			break;
		case error.POSITION_UNAVAILABLE:
			window.x.innerHTML="Location information is unavailable."
			break;
		case error.TIMEOUT:
			window.x.innerHTML="The request to get user location timed out."
			break;
		case error.UNKNOWN_ERROR:
			window.x.innerHTML="An unknown error occurred."
			break;
	}
}

function createMarker(location, title, icon){
	window.marker = new google.maps.Marker({
    	map: window.map,
    	position: location,
    	icon: icon,
    	animation: google.maps.Animation.DROP,
    	title: title
	});
}

var LocationFinder = function (position, map){
	var request = {
    	location: new google.maps.LatLng(position.Ya, position.Za),
    	radius: '500',
    	types: ['restaurant', 'cafe', 'bar', 'food', 'restaurang']
	};


	service = new google.maps.places.PlacesService(window.map);
	service.nearbySearch(request, callbackPlaces);
}

function callbackPlaces(results, status){
	window.places = new Array();
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		console.log("Places found: " + results.length);
		for (var i = 0; i < results.length; i++) {
			window.places.push(results[i]);
		}
		fisherYates(window.places);
		showLocation(window.places[0]);
		window.count = 0;
	} else {
		console.log("No results");
	}
}

function showLocation(location){
	console.log(location); 
	//create google location and show it on the map! See you after concert
	createMarker(location.geometry.location, location.name);
	var placeHTML = document.getElementById("place");
	placeHTML.innerHTML = location.name;
}

function showNext(){
	window.marker.setMap(null);
	window.count ++;
	if (window.count >= window.places.length)
		window.count = 0;
	showLocation(window.places[window.count]);
}


// Randomize restaurants' places
function fisherYates(myArray){
	var i = myArray.length;
	if (i == 0) return false;
	while (--i){
		var j = Math.floor(Math.random() * (i + 1));
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
}