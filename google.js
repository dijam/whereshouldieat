

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