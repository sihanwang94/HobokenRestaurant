// var MAPAPP = {};
// MAPAPP.markers = [];
// MAPAPP.currentInfoWindow;
// MAPAPP.pathName = window.location.pathname;

// $(document).ready(function() {
//     initialize();
//     populateMarkers(MAPAPP.pathName);
// });

// //Initialize our Google Map
// function initialize() {
//     var center = new google.maps.LatLng(40.7447096,-74.0377053);
//     var mapOptions = {
//         zoom: 13,
//         mapTypeId: google.maps.MapTypeId.ROADMAP,
//         center: center,
//     };
//     this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
// };

// // Fill map with markers
// function populateMarkers() {
//     apiLoc = typeof apiLoc !== 'undefined' ? apiLoc : '/config/' + dataType + '.json'; 
//     var geocoder = new google.maps.Geocoder();

//     // jQuery AJAX call for JSON
//     $.getJSON(apiLoc, function(data) {
//         $.each(data, function(i, ob) {
//             var address=this.R_location;
//             geocoder.geocode({'address': address}, function(results, status) {
//                 if (status === 'OK') {
//                     var marker = new google.maps.Marker({
//                         map: map,
//                         position: results[0].geometry.location,
//                         shopname: this.R_name,
//                         icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
//                     });
//                 } else {
//                     alert('Geocode was not successful for the following reason: ' + status);
//                   }
//             });


//     	    //Build the content for InfoWindow
//             var content = '<h1 class="mt0"><a href="' + marker.website + '" target="_blank" title="' + marker.shopname + '">' + marker.shopname + '</a></h1><p>' + marker.details + '</p>';
//         	marker.infowindow = new google.maps.InfoWindow({
//             	content: content,
//             	maxWidth: 400
//             });

//     	    //Add InfoWindow
//             google.maps.event.addListener(marker, 'click', function() {
//                 if (MAPAPP.currentInfoWindow) MAPAPP.currentInfoWindow.close();
//                 marker.infowindow.open(map, marker);
//                 MAPAPP.currentInfoWindow = marker.infowindow;
//             });
//             MAPAPP.markers.push(marker);
//         });
//     });
// };



