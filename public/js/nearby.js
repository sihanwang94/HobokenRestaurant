
$(document).ready(function() {
    var geocoder;
    var map;
    var markerBounds = [];
    
    geocoder = new google.maps.Geocoder();

    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(40.7441,-74.0324),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };   
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    }

    // when page is ready, initialize the map!
    google.maps.event.addDomListener(window, 'load', initialize);
  
    var length=parseInt($('#arrayLength').text());
    var address_count = 0;
    for(let i=0;i<2;i++){
        var locationId='#locationId'+i.toString();
        var address=$(locationId).text();
        var urlData=address.toString().split(' ').join('+');
        console.log( address);
        var locationName='#locationName'+i.toString();
        var name=$(locationName).text();
        console.log(name);
        url="https://maps.googleapis.com/maps/api/geocode/json?address=" + urlData + "&key=" + "AIzaSyAwQhgCXQI5ELmiH6wu-O-MqQN26CQToco",
        $.ajax({       
            type:'POST', 
            url:url,
            data: address, 
            success: function(response) {
                    address_count++;   
                    geocoder.geocode( { 'address': address }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                            });
                            var infowindow = new google.maps.InfoWindow();
                            infowindow.setContent(name);
                            google.maps.event.addListener(marker, 'click', function() {
                                infowindow.open(map, marker);
                            });
                        }
                    })
            },
            dataType: 'json', 
            encode : true
        }).done(function(data) {console.log(data);}); 
    }
});
// $(document).ready(function() {
//         var map;
//         var marker;
//         var marker_bounds = [];
//         var geocoder = new google.maps.Geocoder();
//         function initialize() {
//             var options = {
//                 zoom: 14,
//                 center: new google.maps.LatLng(40.7441,-74.0324), // centered US
//                 mapTypeId: google.maps.MapTypeId.ROADMAP
//             };
//             map = new google.maps.Map(document.getElementById('map_canvas'), options);
//         }
       
//         google.maps.event.addDomListener(window, 'load', initialize);
//         var infowindow =  new google.maps.InfoWindow();
//         var length=parseInt($('#arrayLength').text());
//         console.log(length);
        
//         for(let i=0;i<2;i++){
//             var locationId='#locationId'+i.toString();
//             var address=$(locationId).text();
//             var urlData=address.toString().split(' ').join('+');
//             console.log( address);
//             var locationName='#locationName'+i.toString();
//             var name=$(locationName).text();
//             console.log(name);

//             geocoder.geocode({ 'address': address }, function(results, status) {
//                 if (status == google.maps.GeocoderStatus.OK) {
//                     //map.setCenter(results[0].geometry.location);
//                     marker = new google.maps.Marker({
//                         map: map,
//                         position: results[0].geometry.location
//                     });
                    
//                 }
//             }) 
//         }

// });

