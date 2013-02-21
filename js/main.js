var Main = {};

var Main = function(){
	// if (1 == 2)
	if(navigator.appName == "Microsoft Internet Explorer") {
		alert("Internet Explorer! You need to change it soon or even now!");
		// exit();
	}
	this.init = function(){
		$('#loading').css("display", "none");
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

	var mapElement = document.getElementById("map_canvas");
	return new google.maps.Map(mapElement, mapOptions);

	// new google.maps.LatLng(window.position.coords.latitude, window.position.coords.longitude);
}

function setStreetView(position) {
	var viewElement = document.getElementById("place_street_view");
	var thumbnail = '<img class="img-polaroid" src="//maps.googleapis.com/maps/api/streetview?size=220x180&location=' + position.lat() + ',' + position.lng() + '&fov=60&pitch=10&sensor=false&key=AIzaSyAFoZAd_6SBPJBMXybVDknm0UjsTO5A0ps" />';
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
	// Uncomment to enable auto location finder
	// console.log("Your location: " + position);
	window.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	// Uncomment for manual location
	// 59.34702, 18.040195 - Test Location!
	// window.position = new google.maps.LatLng(59.34702, 18.040195);
	window.map = setGoogleMap(window.position);

	window.map.setCenter(window.position);

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
	var marker = new google.maps.Marker({
    	map: window.map,
    	position: location,
    	icon: icon,
    	animation: google.maps.Animation.DROP,
    	title: title
	});

	// Set markers' click event
	google.maps.event.addListener(marker, 'click', function() {
		var infowindow = new google.maps.InfoWindow();
		infowindow.setContent(marker.title);
    	infowindow.open(window.map, marker);
	});

	window.marker = marker;
}

var LocationFinder = function (position, map){
	var request = {
    	location: position,
    	radius: '1000',
    	types: ['restaurant', 'cafe', 'bar', 'food', 'restaurang', 'grocery_or_supermarket']
	};


	service = new google.maps.places.PlacesService(window.map);
	service.nearbySearch(request, callbackPlaces);
}

function callbackPlaces(results, status){
	window.places = new Array();
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			window.places.push(results[i]);
		}
		fisherYates(window.places);
		showLocation(window.places[0]);
		window.count = 0;
	} else {
		showErrorMessage("Sorry! Nowhere for you to eat!");
	}
}

function showLocation(location){
	createMarker(location.geometry.location, location.name);
	setStreetView(location.geometry.location);
	var placeHTML = document.getElementById("place_title");
	placeHTML.innerHTML = "<div id='star' class='text-left'></div>";
	placeHTML.innerHTML += "<strong>" + location.name + "</strong>";
	placeHTML.innerHTML += "<br />";

	//Setting up rating element
	$('#star').raty({
		half: true,
		score: location.rating,
		numberMax: 5,
		readOnly: true,
		starHalf: 'js/raty-2.5.2/lib/img/star-half.png',
		starOff: 'js/raty-2.5.2/lib/img/star-off.png',
		starOn: 'js/raty-2.5.2/lib/img/star-on.png',
	});
	findAddress(location.geometry.location, placeHTML);
}

function showNext(){
	restartLoading();
	window.marker.setMap(null);
	window.count ++;
	if (window.count >= window.places.length)
		window.count = 0;
	showLocation(window.places[window.count]);
}

function findAddress(position, element) {
	geocoder = new google.maps.Geocoder();

    geocoder.geocode({'latLng': position}, function(results, status) {
    	stopLoading();
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

function startLoading() {
	$('#loading').css("display", "block");
}

function stopLoading() {
	$('#loading').css("display", "none");
}

function restartLoading() {
	stopLoading();
	startLoading();
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
	messageElement.innerHTML = messageElement.innerHTML + message;
	messageElement.className = "alert alert-error";
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