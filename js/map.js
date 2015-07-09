// Function to draw your map
var drawMap = function() {
	var map = L.map('container').setView([30,-100],4);
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
	getData(map);
}

// Function for getting data
var getData = function(map) {
	$.ajax({
		url:'data/response.json',
		type: "get",
		success:function(data) {
			customBuild(map, data);
		}, 
		dataType:"json"
	}) 
}

// Add points based on armed and fatalities 
var customBuild = function(map, data) {
	var unarmed_fatalities = L.layerGroup().addTo(map);
	var unarmed_hits = L.layerGroup().addTo(map);
	var armed_fatalities = L.layerGroup().addTo(map);
	var armed_hits = L.layerGroup().addTo(map);
	data.map(function(d){
		if (d["Hit or Killed?"] == "Killed"){
			if (d["Armed or Unarmed?"] == "Unarmed"){
				var mark = new L.circleMarker([d.lat, d.lng], {fillColor:'red', radius:3, fillOpacity:.5, stroke:false});
				unarmed_fatalities.addLayer(mark);
			}else { //armed
				var mark = new L.circleMarker([d.lat, d.lng], {fillColor:'purple', radius:3, fillOpacity:.5, stroke:false});
				armed_fatalities.addLayer(mark);
			}
		}else { //hit}
			if(d["Armed or Unarmed?"] == "Unarmed"){
				var mark = new L.circleMarker([d.lat, d.lng], {fillColor:'blue', radius:3, fillOpacity:.5, stroke:false});
				unarmed_hits.addLayer(mark);
			}else {
				var mark = new L.circleMarker([d.lat, d.lng], {fillColor:'black', radius:3, fillOpacity:.5, stroke:false});
				armed_hits.addLayer(mark);
			}
		}
		mark.bindPopup(d.Summary);
	})
	var overlays = {
		"Unarmed fatalities" : unarmed_fatalities,
		"Unarmed hits" : unarmed_hits,
		"Armed fatalities" : armed_fatalities,
		"Armed hits" : armed_hits
	}
	L.control.layers(null, overlays).addTo(map);
}