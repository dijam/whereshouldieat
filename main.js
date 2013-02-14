var Main = {};

var Main = function(){

	this.init = function(){
		window.x = document.getElementById("demo");
		setLocation();
	}
}

function setGoogleMap(){
	console.log("Latitude: " + window.position.coords.latitude);
	console.log("Longitude: " + window.position.coords.longitude);

	var mapOptions = {
		center: new google.maps.LatLng(window.position.coords.latitude, window.position.coords.longitude),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map_canvas"),
		mapOptions);

	var myLocation = new google.maps.LatLng(window.position.coords.latitude, window.position.coords.longitude);
	var myloc = new google.maps.Marker({
    	map: map,
    	position: myLocation,
    	title: "You are here!"
	});

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
	window.position = position;
	setGoogleMap();
	new LocationFinder(position);
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
