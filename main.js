var Main = {};

var Main = function(){

	this.init = function(){
		window.x = document.getElementById("demo");
		setLocation();
	};
	
	this.init();
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

var LocationFinder = function (position){
	var http = require('http');

	var url = "https://maps.googleapis.com/maps/api/place/add/json?sensor=true&key=AIzaSyAFoZAd_6SBPJBMXybVDknm0UjsTO5A0ps HTTP/1.1";
	http.request()


	var body = JSON.stringify({
		"location": {
			"lat": position.coords.latitude,
			"lng": position.coords.longitude
		},
		"accuracy": 50,
		"name": "Google Shoes!",
		"types": ["restaurant"],
		"language": "en-US"
	});

	var options = {
	    hostname: "maps.googleapis.com",
	    port: 80,
	    path: "/maps/api/place/add/json?sensor=true&key=AIzaSyAFoZAd_6SBPJBMXybVDknm0UjsTO5A0ps HTTP/1.1",
	    method: "POST",
	    headers: {
	        "Content-Type": "application/json",
	        "Content-Length": body.length
	    }
	};

	var request = new http.request(options, function(res){
		res.setEncoding('utf8');
		request.on('data', function(chunk) {
			console.log('chunk: ' + chunk);
		});
	});

	request.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	request.end(body)
}