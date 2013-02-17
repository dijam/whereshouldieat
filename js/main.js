var Main = {};

var Main = function(){

	this.init = function(){
		setLocation();
		// $('#show_next').tooltip();
	};

	this.init();
}

function setGoogleMap(position){
	var mapOptions = {
		center: new google.maps.LatLng(position.Ya, position.Za),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var mapElement = document.getElementById("map_canvas");
	console.log(mapElement);
	return new google.maps.Map(mapElement, mapOptions);

	// new google.maps.LatLng(window.position.coords.latitude, window.position.coords.longitude);
}

function setStreetView(position) {
	var viewElement = document.getElementById("place_street_view");
	var thumbnail = '<img class="img-polaroid" src="//maps.googleapis.com/maps/api/streetview?size=220x180&location=' + position.Ya + ',' + position.Za + '&fov=60&pitch=10&sensor=false" />';
	viewElement.innerHTML = thumbnail;
}

function setLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPosition, showError);
	}
	else {
		showErrorMessage("Geolocation is not supported by this browser.");
	}
}

function setPosition(position) {
	// console.log("Your location: " + position);
	// window.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);  //Uncomment to enable auto location finder

	window.position = new google.maps.LatLng(59.34702, 18.040195); // Uncomment for manual location
	window.map = setGoogleMap(window.position);

	createMarker(window.position, "Your are here!", "http://maps.google.com/mapfiles/ms/icons/green-dot.png");
	new LocationFinder(window.position, window.map);
}


function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			showErrorMessage("User denied the request for Geolocation.")
			break;
		case error.POSITION_UNAVAILABLE:
			showErrorMessage("Location information is unavailable.")
			break;
		case error.TIMEOUT:
			showErrorMessage("The request to get user location timed out.")
			break;
		case error.UNKNOWN_ERROR:
			showErrorMessage("An unknown error occurred.")
			break;
	}
}

function createMarker(location, title, icon){
	// var infowindow = new google.maps.InfoWindow();
	// infowindow.setContent(results[1].formatted_address);
	// infowindow.open(map, marker);

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
	var myLocation = new google.maps.LatLng(location.geometry.location.Ya, location.geometry.location.Za);
	createMarker(location.geometry.location, location.name);
	setStreetView(myLocation);
	var placeHTML = document.getElementById("place_title");
	placeHTML.innerHTML = "<strong>" + location.name + "</strong>";
	placeHTML.innerHTML += "<br />";
	findAddress(myLocation, placeHTML);
}

function showNext(){
	window.marker.setMap(null);
	window.count ++;
	if (window.count >= window.places.length)
		window.count = 0;
	showLocation(window.places[window.count]);
}

function findAddress(position, element) {
	geocoder = new google.maps.Geocoder();

    geocoder.geocode({'latLng': position}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				element.innerHTML += '<address>' + formatAddress(results[0].formatted_address) + '</address>';
			}
		} else {
			console.log("Couldn't find the address for:" + position);
			return "";
		}
    });
}

function formatAddress(address) {
	var array = address.split(",");

	//If something went wrong, just return the original address
	if (array.length <= 0)
		return address;

	var results = array[0];
	for (var i = 1; i < array.length; i++) {
		results += "<br>" + array[i];
	};

	return results;
}

function showErrorMessage(message) {
	var messageElement = document.getElementById("message");
	messageElement.innerHTML = messageElement.innerHTML + "<strong>Warning!</strong> " + message;
	messageElement.removeClass("hide");
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