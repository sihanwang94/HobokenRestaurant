$(document).ready(function() {
    var geocoder;
    var map;
    var places;
    var markers = [];
    var bindInfoWindow = function(marker, map, infowindow) {
	    google.maps.event.addListener(marker, 'click', function() {
	        infowindow.setContent(html);
	        infowindow.open(map, marker);
	    });
	} 

    function initialize() {
        geocoder = new google.maps.Geocoder();
    
        var mapOptions = {
            center: new google.maps.LatLng(40.7441,-74.0324),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    }
    // when page is ready, initialize the map!
    google.maps.event.addDomListener(window, 'load', initialize);

    var address=$('#locationId').text();
    var urlData=address.toString().split(' ').join('+');
    console.log(urlData);
              
    $.ajax({
        type: 'POST', 
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + urlData + "&key=" + "AIzaSyDDg770LxmiVd3xLpzpS7kri_aD6fKc2Is",
        data: address, 
        success: function(response) {
            if (response.status == 'OK') {
                geocoder.geocode( { 'address': address }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results);
                        map.setCenter(results[0].geometry.location);
                        
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
        
                        bindInfoWindow(marker, map,infowindow);
                        // not currently used but good to keep track of markers
                        markers.push(marker);
                    }
                })
            }else {
                alert("Try again. Geocode was not successful for the following reason: " + status);
            }
        },
        dataType: 'json', 
        encode : true
    }).done(function(data) {
        console.log(data);
    });

});

