/*variables */
var map, geocoder, current_location, start_position, dest_position ;
var places_position=[], places_marker=[]; /* for intermediate waypoints from start to destination */
var current_marker, start_marker,dest_marker ;
var directionsService;
var directionsDisplay;
var waypoints=[];
var destination;
var TravelMode = 'Driving';
var toRadian = 3.14/180; 
var toDegree = 180/3.14;
/*on load*/
function initialize()
{
    
}

function initMap(){
        var uluru = {lat: 27.6818631, lng: 85.3234372};

        directionsService=new google.maps.DirectionsService();
        directionsDisplay= new google.maps.DirectionsRenderer();
        map = new google.maps.Map(document.getElementById('map'), { center: uluru, zoom: 13});
        google.maps.event.trigger(map, "resize");

        var infoWindow =new google.maps.InfoWindow;
        //Get current location of your device
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(position)
             {
                var pos =
                {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                current_marker = new google.maps.Marker({
                position: pos,
                map: map,
                label:'I  am here',
                });
                directionsDisplay.setMap(map); 
                //bind map with direction display
                current_location= {lat: pos.lat, lng: pos.lng};// store current location value in a var
                
              }
              ,
            function() {
             handleLocationError(true, infoWindow, map.getCenter());
            });
        }
        else
         {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
         }

        /* after rendering map, wait for events to trigger*/
        /*  //for places*/
        //dest_position .setMap(null); /* to remove from map but keep value in variable */
        


         var Place = function()
          {
              SetMapOnAll(null); /* delete markers from previous places (kept as waypoints) */
              places_position=[];
              places_marker=[];
              alert("clear places_position : "+ places_position.length);
              alert("clear places_marker: "+ places_marker.length);
              Search_Places(current_location);
          };
        //  document.getElementById('category').addEventListener('change', Place);  
      
 }



function handleLocationError(browserHasGeolocation, infoWindow, pos){
    var infoWindow =new google.maps.InfoWindow;
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}



/* current location ko warpara ko places find and mark garne */
function Search_Places(location,rad)
{
       // alert("inside Search Places");
        var selectedMode=document.getElementById('category').value;
       // map.setCenter(current_location);
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: location,
          radius: rad*1000 ,
          type: selectedMode,
          }, callback);
        //alert("now routing start and destination ....");
        //calculateAndDisplayRoute(current_location, dest_position ); 
        return 1; 
}

function callback(results, status)
{
    //alert("inside callback");
    var i;
    if (status === google.maps.places.PlacesServiceStatus.OK)
    {
        if(results.length>0)
        {
          alert("alert from the callback is ok... ");
          for ( i= 0; i < results.length; i++)
          {
              placeDetails(results[i]); //check the rating of the respective place and place the marker. 
              //createMarker(results[i], i);
          }
          map.setZoom(13);
          // alert(i + " number of data....");
          // alert("Place_position array size: " + places_position.length);
          // alert("Place_marker array size: " + places_marker.length);

        }
        else
          alert("No data found..");
    } 
 
}


function createMarker(place, i)
{
    var placeLoc = place.geometry.location;
    places_position.push(placeLoc); /* push all places found in an array */
   
    places_marker[i] = new google.maps.Marker({ // this is local var marker, add it to markers array as global
      map:map,
      position: placeLoc
    });
    
    /*var infoWindow =new google.maps.InfoWindow;
    Find direction between start and destination 
    google.maps.event.addListener(places_marker[i], 'click', function()
    {
        infoWindow.setPosition(placeLoc);
        infoWindow.setContent('You are here...');
        infoWindow.open(map);
        direction();
        
    });
    google.maps.event.addListener(dest_marker, 'click', function()
    {
      calculateAndDisplayRoute(current_location, dest_position); 
    });

    var direction =function(){
      calculateAndDisplayRoute(current_location, placeLoc);
    }
    document.getElementById('mode').addEventListener('change', direction);*/
}

/* According to mode selected, find the directions and displaying on map */
/* Direction shown based on request made and respose got*/

function calculateAndDisplayRoute(f, t)
{
    var selectedMode=document.getElementById('mode').value;
      directionsService.route({
      origin: f,
      destination: t,
      travelMode: google.maps.TravelMode[selectedMode],
      optimizeWaypoints: true,
      waypoints: 
        [
          {
            location:places_position[0],
            stopover: false
          },
          {
            location:places_position[1],
            stopover: true
          }
        ],
      }, function(response, status)
         {
          if (status === 'OK')
          {
            directionsDisplay.setDirections(response);
          }
          else
           {
            window.alert('Directions request failed due to ' + status);
          }
        });
}


// Sets the map on all markers in the array.
function SetMapOnAll(map) 
{
  for (var i = 0; i < places_position.length; i++) 
  {
    places_marker[i].setMap(map);
  }
}

function Route()
{
  //dest_position .setMap(null); /* to remove from map but keep value in variable */
  SetMapOnAll(null); /* delete markers from previous places (kept as waypoints) */
  places_position=[];
  places_marker=[];
  alert(" Now clear the previous data");
  alert("clear places_position : "+ places_position.length);
  alert("clear places_marker : "+ places_marker.length);
  //for places
  Search_Places(current_location);
}


/* geocode user address */
function CodeAdress(){
    //marker.setMap(null);
  geocoder = new google.maps.Geocoder();
    var address = document.getElementById('destination').value;
    alert(address);
    geocoder.geocode({'address': address}, function(results, status) {
      if (status == 'OK') 
      {
       alert("Inside address to latlng conversion status, ok...");
        map.setCenter(results[0].geometry.location);
        map.setZoom(11);
        dest_position=results[0].geometry.location;
        dest_marker = new google.maps.Marker({
            map: map,
            position: dest_position, 
            label: 'Destination',
        });
      var distanceAndMid = calculateDistanceAndMid(results[0].geometry.location.lat(), results[0].geometry.location.lng(),current_location.lat,current_location.lng);
        
        var mid_position = {
          lat: distanceAndMid.mid_lat, 
          lng:distanceAndMid.mid_lng,
        };

        var interMediate1 = calculateDistanceAndMid(results[0].geometry.location.lat(),results[0].geometry.location.lng(),mid_position.lat,mid_position.lng);

        var interMediate1pos = {
          lat: interMediate1.mid_lat,
          lng: interMediate1.mid_lng,
        };

        var interMediate2 = calculateDistanceAndMid(mid_position.lat,mid_position.lng,current_location.lat, current_location.lng);

        var interMediate2pos = {
          lat: interMediate2.mid_lat,
          lng: interMediate2.mid_lng,
        };

        var searchArray = [interMediate1pos, interMediate2pos];

        mid_marker = new google.maps.Marker({
            map: map,
            position: mid_position, 
            label: 'Mid',
        });
        var rad = distanceAndMid.distance/4; 

       /* console.log(rad);
        console.log(distanceAndMid.mid_lat);
        console.log(distanceAndMid.mid_lng);

*/
        for(i=0;i<2;i++){
          Search_Places(searchArray[i], rad);  
        }
        
        //console.log(waypoints);
        
        createRoute();

        } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}


function createRoute(){
  
  directionsService.route({
    origin: current_location,
    destination: dest_position,
    waypoints: waypoints,
    optimizeWaypoints: true, 
    travelMode: 'DRIVING',  
  }, function (response ,status){
    if(status == google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      var summaryPanel = document.getElementById("directions_panel");
      summaryPanel.innerHTML = "";
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
            }
    }else{
      alert('Couldnt display direction due to:' + status);
    }
  });

return 1; 
}

function calculateDistanceAndMid(destlat, destlng, orilat, orilng){
        //alert("inside calculation");
        var x1 = toX(orilat, orilng);
        var y1 = toY(orilat, orilng); 
        var z1 = toZ(orilat);

        var x2 = toX(destlat, destlng);
        var y2 = toY(destlat, destlng);
        var z2 = toZ(destlat);


        var distance = Math.sqrt(Math.pow(x2-x1, 2)+ Math.pow(y2-y1, 2) + Math.pow(z2-z1, 2));
        
        //calculation of latlng of midpoint
        var φ2 = destlat * toRadian; var φ1 =  orilat * toRadian;
        var λ2 = destlng * toRadian; var λ1 = orilng * toRadian;

        var Bx = Math.cos(φ2) * Math.cos(λ2-λ1);
        var By = Math.cos(φ2) * Math.sin(λ2-λ1);
        var φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2),
                          Math.sqrt( (Math.cos(φ1)+Bx)*(Math.cos(φ1)+Bx) + By*By ) );
        var λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
        
        var mid_lat = φ3 * toDegree; var mid_lng = λ3 * toDegree;

         // var mid_pos = {'mid_lat' : mid_lat, 'mid_lng' : mid_lng};
        
        // console.log(mid_lat);
        // console.log(mid_lng);

         return {'distance': distance, 'mid_lat' : mid_lat, 'mid_lng' : mid_lng} ;
}  


function toX(p, q){

  var x = 6371 * Math.cos(p*toRadian) * Math.cos(q*toRadian);

  return x; 
}

function toY(p,q){

  var y = 6371 * Math.cos(p*toRadian) * Math.sin(q*toRadian);

  return y;
}

function toZ(p){

  var z = 6371 * Math.sin(p*toRadian);

  return z;

}

function placeDetails(place){
  if (place.rating == 5) {
  // console.log(place.name);
    var pos = place.geometry.location;
    var pos_lat = place.geometry.location.lat; var pos_lng = place.geometry.location.lng;
    var latlng = new google.maps.LatLng(pos_lat,pos_lng);
    waypoints.push({
      position: latlng,
    });
    
    place_marker = new google.maps.Marker({
            map: map,
            position: pos, 
            icon: place.icon,
        });
  }
//i++;
  return 1;
}

function CodeAddress(current_location, destination_location, mode, onReady){
  directionsService.route({
    origin: current_location,
    destination: destination,
    travelMode: 'DRIVING',  
  }, function (response ,status){
    if(status == google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
    }else{
      alert('Couldnt display direction due to:' + status);
    }

  });

  var optimizeDirectionDisplay =  new google.maps.DirectionsRenderer({ 
    //suppressMarkers: true,
    polylineOptions: { strokeColor: "green",
 } 
  });
  optimizeDirectionDisplay.setMap(map);
  directionsService.route({
    origin: current_location,
    destination: destination,
    travelMode: mode, 
    waypoints: waypoints,
    optimizeWaypoints: true, 
    provideRouteAlternatives: true,
    travelMode: 'DRIVING',  
  }, function (response ,status){
    if(status == google.maps.DirectionsStatus.OK){
      optimizeDirectionDisplay.setDirections(response);
      var route = response.routes[0];
      var summaryPanel = document.getElementById("directions_panel");
      summaryPanel.innerHTML = "";
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
            }
     optimizeDirectionDisplay.setDirections(response);
          if(typeof onReady == 'function') {
            onReady(optimizeDirectionDisplay);
          }
    }else{
      alert('Couldnt display direction due to:' + status);
    }

  });


 
}

 function submit_form() {
      destination = document.getElementById('destination').value; 
      for (var i = 0; i <1000000000; i++) {
          
      }
        //directionsDisplay.setMap(null);
      switch(destination) {
          default:
          case 'Godawari':
            waypoints = [
                {location: 'Pashupatinath, kathmandu' , stopover:true},
                {location: 'Bota Momo- kumaripati', stopover: true}, 
                {location: 'Godawari Botanical Garden', stopover:true },
                {location: 'Patan Durbar Square, Lalitpur', stopover:true},
                {location:'Godavari Village Resort'}
                ];
            break;
          case 'sanepa':
            waypoints = [
            {location: 'kathmandu Durbar Square'},
            {location: 'Kathmandu Funpark, Nepal ', stopover: true},
            {location: 'Pashupatinath, kathmandu', stopover:true},
            {location: 'Bota Mo:Mo, kamalpokhari', stopover: true},
            {location: 'Summit Hotel, Sanepa'}
            ];
            break;
            case 'Nagarkot':
            waypoints = [
            {location: 'Patan Durbar Square, Lalitpur',stopover: true },
            {location: 'Bhaktapur Durbar Square, Bhaktapur', stopover: true },
            {location: 'Tryst Fast Food, Bhaktapur', stopover: true},
            {location: 'Hotel Mystic Mountain', stopover: true},
            {location: 'Nagarkot View Tower', stopover:true }
            ];

            break; 
            
            case 'Dhulikhel':
            waypoints = [
            { location:'Patan Durbar Square, Lalitpur', stopover: true},
            { location: 'Indreni Foodland, New Baneshwor Rd', stopover : true},
            {location: 'Lover\'s Point Dhulikhel', stopover: true},
            {location: 'Kathmandu Fun Valley', stopover:true},
            {location: 'Kailashnath Mahadev Statue', stopover: true},
            ]

            case 'dhulikhel':
            waypoints = [
            { location:'Patan Durbar Square, Lalitpur', stopover: true},
            { location: 'Indreni Foodland, New Baneshwor Rd', stopover : true},
            {location: 'Dwarika\'s Resort Dhulikhel', stopover: true},
            {location: 'Bhaktapur Durbar Square, Bhaktapur', stopover:true},
            {location: 'Kailashnath Mahadev Statue', stopover: true},
            ]

            case 'sundarijal':
            waypoints = [
              {location: 'Boudhha Stupa, बुद्ध स्तुपा', stopover :true },
              {location: 'The Bakery Cafe, Boudhanath Sadak', stopover : true},
              {location: 'Pashupatinath, kathmandu', stopover: true},
              {location: 'KL Tower', stopover: true},
              {location: 'Gokarna Forest Resort', stopover :true},
              
            ]
          }

      CodeAddress(
        current_location, 
        destination, 
        'DRIVING', 
        function(display) {
          // we put an infoWindow, 20% along the Driving route, and display the total length and duration in the content.
          directionsDisplayDriving = display; 
          var temp = getTotalDuration(display)/3600;
          var point = distanceAlongPath(display, null, .2);
          var content = 'Driving - total distance: ' + getTotalDistance(display)/1000 + 'km <br/> total duration: ' + temp.toFixed(2) +'hr';
          // if(infowindowDriving) {
          //   infowindowDriving.setMap(null);
          // }
          infowindowDriving = new google.maps.InfoWindow({
            content: content,
            map: map,
            position: point
          });  
        }
      );
  }

   function getTotalDuration(directionsDisplay) {
      var directionsResult = directionsDisplay.getDirections();
      var route = directionsResult.routes[0];
      var totalDuration = 0;
      var legs = route.legs;
      for(var i=0; i<legs.length; ++i) {
        totalDuration += legs[i].duration.value;
      }
      return totalDuration;
    }

    function getTotalDistance(directionsDisplay) {
      var directionsResult = directionsDisplay.getDirections();
      var route = directionsResult.routes[0];
      var totalDistance = 0;
      var legs = route.legs;
      for(var i=0; i<legs.length; ++i) {
        totalDistance += legs[i].distance.value;
      }
      return totalDistance;
    }
    //  Returns a point along a route; at a requested distance ( either absolute (in meter) or as a ratio (0 to 1)  of the route)
    //     example : you have a random route ( 100km long), and you want to put a marker, 30km from the origin.
    //     we add the distances of the waypoints and stop when we reach the requested total length.
    //     nothing stops you from making it even more precise by interpolling.
    // the function returns a location (LatLng) along the route
    function distanceAlongPath(directionsDisplay, distanceFromOrigin, ratioFromOrigin) {
      var directionsResult = directionsDisplay.getDirections();
      var route = directionsResult.routes[0];
      var totalDistance = getTotalDistance(directionsDisplay);
      var tempDistanceSum = 0;
      var dist = 0;

      if(ratioFromOrigin) {
        distanceFromOrigin = ratioFromOrigin * totalDistance;
      }

      // we prepare the object 
      var result = new Object();
      result.routes = new Array();
      result.routes[0] = route;
      for(var i in result.routes[0].overview_path) {
        if (i>0) {
          dist = google.maps.geometry.spherical.computeDistanceBetween (result.routes[0].overview_path[i], result.routes[0].overview_path[i - 1]);
        }
        tempDistanceSum += dist;
        if (tempDistanceSum > distanceFromOrigin) {
          return result.routes[0].overview_path[i];
        } 
        // console.log(dist+' '+tempDistanceSum);
      }
    }

