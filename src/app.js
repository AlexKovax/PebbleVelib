/**
 * Pebble Velib
 *
 * A tiny app that gives you the closest Velib station
 */

//Requires
var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

//Conf
var url = 'http://api.kovaxlabs.com/velib/api.php?position=';

//Main UI screen
var main = new UI.Window();

// Create a background Rect
var bgRect = new UI.Rect({
  position: new Vector2(10, 10),
  size: new Vector2(124, 40),
  backgroundColor: 'white'
});

// Title
var title = new UI.Text({
  position: new Vector2(10, 10),
  size: new Vector2(124, 40),
  text: "Pebble Velib",
  font: 'gothic-28-bold',
  color: 'black',
  textAlign: 'center'
});

var desc = new UI.Text({
  position: new Vector2(10, 55),
  size: new Vector2(124, 30),
  text: "Press select to get the closest Velib station",
  font: 'gothic-14',
  color: 'white',
  textAlign: 'center'
});

// Create a line
var sepLine = new UI.Rect({
  position: new Vector2(10, 90),
  size: new Vector2(124, 1),
  backgroundColor: 'white'
});

//Address elements
var detailsAddr = new UI.Text({
  position: new Vector2(10, 55),
  size: new Vector2(134, 80),
  text: "",
  font: 'gothic-18',
  color: 'white',
  textAlign: 'left'
});

//Logo
var logo = new UI.Image({
  position: new Vector2(44, 100),
  size: new Vector2(40, 40),
  image: 'images/bike40invert.png'
});

// Add the elements
main.add(bgRect);
main.add(title);
main.add(desc);
main.add(sepLine);
main.add(logo);

main.show();

//Select click handler
main.on('click', 'select', function(e) {
	//Loading
	desc.text("Loading...");
	
	//Geolocation + API Call
	window.navigator.geolocation.getCurrentPosition(function(position){
		//Get the coordinates
		var coordinates = position.coords;
		var gps = coordinates.latitude+","+coordinates.longitude;
		
		// Download data
		var call = url + gps + "&limit=1&distance=1";
		ajax({url: call, type: 'json'},function(json) {				
			var res= json[0];
			
			//UI cleaning
			desc.remove();
			sepLine.remove();
			logo.remove();
			
			//Display details
			main.add(detailsAddr);
			detailsAddr.text(res.address + "\n\n" + "bikes: " + res.available_bikes + " | spots: " + res.available_bike_stands);			
		},
		function(error) {
			desc.text("Error...");
			console.log('Ajax failed: ' + error);
		});
		
	});//end navigator
	
});//end handler
