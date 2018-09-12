var map, geocoder, current_location, start_position, dest_position ;
var places_position=[], places_marker=[]; /* for intermediate waypoints from start to destination */
var current_marker, start_marker,dest_marker ;
var directionsService;
var directionsDisplay;
var placesServices; 
var optimizeDirectionDisplay;
var waypoints=[];
var destination;
var TravelMode = 'Driving';
var toRadian = Math.PI/180; 
var toDegree = 180/Math.PI;

function initMap()
{
       
        var review = document.getElementById("review");
        review.style.visibility = "hidden";
         
        var uluru = {lat: 27.6818631, lng: 85.3234372};

        directionsService=new google.maps.DirectionsService();
        directionsDisplay= new google.maps.DirectionsRenderer();
        optimizeDirectionDisplay= new google.maps.DirectionsRenderer();
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
                label:'I\'m here',
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
 }

 function submit_form() 
 {
      
      destination = document.getElementById('destination').value; 
      for (var i = 0; i <1000000000; i++) {
          
      }
      optimizeDirectionDisplay.setMap(null);
      directionsDisplay.setMap(null);
    

      alert("places_marker length is "+ places_marker.length);
      for (var i=0; i<places_marker.length; i++)
      {
        places_marker[i].setMap(null);
      }
      switch(destination) {
          default:
              alert('Destination hasn\'t been geocoded.');
              

              break; 

          case 'Godawari':
            waypoints = [
                {location: 'Pashupatinath, kathmandu' , stopover:true},
                {location: 'Bota Momo- kumaripati', stopover: true}, 
                {location: 'Godawari Botanical Garden', stopover:true },
                {location: 'Patan Durbar Square, Lalitpur', stopover:true},
                {location:'Godavari Village Resort'}
                ];
            break;
             case 'godawari':
            waypoints = [
                {location: 'Patan Durbar Square, Lalitpur', stopover:true},
                {location: 'Bota Momo- kumaripati', stopover: true},
                {location: 'Central Zoo, Patan' , stopover:true},
                {location: 'Godawari Botanical Garden', stopover:true },
                {location:'Godavari Village Resort', stopover:true}
                ];
            break;
          case 'sanepa':
            waypoints = [
            {location: 'Pashupatinath, kathmandu', stopover:true},
            {location: 'Bota Mo:Mo, kamalpokhari', stopover: true},
            {location: 'Kathmandu Funpark, Nepal ', stopover: true},
            {location: 'kathmandu Durbar Square', stopover: true},
            {location: 'Summit Hotel, Sanepa', stopover: true}
            ];
            break;
            case 'nagarkot':
            waypoints = [
            {location: 'Patan Durbar Square, Lalitpur',stopover: true },
            {location: 'Bhaktapur Durbar Square, Bhaktapur', stopover: true },
            {location: 'Tryst Fast Food, Bhaktapur', stopover: true},
            {location: 'Nagarkot View Tower', stopover:true },
            {location: 'Hotel Mystic Mountain', stopover: true},
            
            ];

            break; 
            
            case 'Dhulikhel':
            waypoints = [
            { location:'Patan Durbar Square, Lalitpur', stopover: true},
            { location: 'Indreni Foodland, New Baneshwor Rd', stopover : true},
            {location: 'Kathmandu Fun Valley', stopover:true},
            {location: 'Kailashnath Mahadev Statue', stopover: true},
            {location: 'Lover\'s Point Dhulikhel', stopover: true},
            ];
            break;

            case 'dhulikhel':
            waypoints = [
            { location:'Patan Durbar Square, Lalitpur', stopover: true},
            { location: 'Indreni Foodland, New Baneshwor Rd', stopover : true},
            {location: 'Bhaktapur Durbar Square, Bhaktapur', stopover:true},
            {location: 'Kailashnath Mahadev Statue', stopover: true},
            {location: 'Dwarika\'s Resort Dhulikhel', stopover: true},
            
            ];
            break;

            case 'sundarijal':
            waypoints = [
              {location: 'Kathmandu Funpark, Nepal ', stopover: true},
              {location: 'Pashupatinath, kathmandu', stopover: true},
              {location: 'The Bakery Cafe, Boudhanath Sadak', stopover : true},
              {location: 'Boudhha Stupa, बुद्ध स्तुपा', stopover :true },
              {location: 'Gokarna Forest Resort', stopover :true},
              
            ];
            break;

            // case 'thankot':
            // waypoints = []
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

function CodeAddress(current_location, destination_location, mode, onReady)
{

  // optimized direction by google 
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

  optimizeDirectionDisplay =  new google.maps.DirectionsRenderer({ 
    suppressMarkers: true,
    polylineOptions: { strokeColor: "green"}, 
  });
  optimizeDirectionDisplay.setMap(map);

// waypoints given by us
  directionsService.route({
    origin: current_location,
    destination: destination,
    travelMode: mode, 
    waypoints: waypoints,
    optimizeWaypoints: true, 
    provideRouteAlternatives: true,
    travelMode: 'DRIVING',  
  }, function (response ,status)
    {
    if(status == google.maps.DirectionsStatus.OK)
      {
        optimizeDirectionDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById("directions_panel");
        summaryPanel.innerHTML = "";

        // For each route, display summary information.
         var routeSegment = 1;
         summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
         summaryPanel.innerHTML += route.legs[0].start_address + " to ";
         summaryPanel.innerHTML += waypoints[0].location + "<br />";
         summaryPanel.innerHTML += route.legs[0].distance.text + "<br /><br />";  

        for (var i = 1; i < route.legs.length-1 ; i++) 
        {
            routeSegment +=1; 
            summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";         
            summaryPanel.innerHTML += waypoints[i-1].location + " to ";
            summaryPanel.innerHTML += waypoints[i].location + "<br />";
            summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
        }

        optimizeDirectionDisplay.setDirections(response);
          if(typeof onReady == 'function') {
            onReady(optimizeDirectionDisplay);
          }
      }
    else{
      alert('Couldnt display direction due to:' + status);
    }
  });

/* create marker */
createMarker(waypoints);
}

function createMarker(waypoints)
{
  var labelarray = new Array('1', '2', '3', '4', '5');
  geocoder = new google.maps.Geocoder();
  for(i=0; i<5; i++)
  {
    var a = 0;

    // convert waypoint addresses into latlng
    var address = waypoints[i].location;
    geocoder.geocode({'address': address}, function(results, status) 
    {
      if (status == 'OK')
      {
        var interposition=results[0].geometry.location;
        places_marker[i] = new google.maps.Marker({
            map: map,
            position: interposition, 
            label: labelarray[a],
        });
          a++;
          var place_id;

          //when clicked on a waypoint marker, get placeid and hence get place details 
         google.maps.event.addListener(places_marker[i], 'click', function()
            {
              getPlaceId(this.label);
            });
      }
      else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }); 
  }
  return 1; 
}

function getPlaceId(label)
{
  var query = waypoints[label-1].location;
  var request = {
    query: query,
    fields: [ 'place_id'],
  }

  placesServices = new google.maps.places.PlacesService(map);
  placesServices.findPlaceFromQuery(request, function(results, status)
  {

      if (status == google.maps.places.PlacesServiceStatus.OK){
        placeDetails(results[0].place_id);
         
      }

      else{
        alert('Couldn\'t find place form Query');
        return;
      } 
  });
  return 1; 
}

function placeDetails(place_id)
{
   var review = document.getElementById("review");
   review.style.visibility = "visible";
   $('#reviews').html("");

   var request = {
    placeId: place_id
    };

    placesServices.getDetails(request, function(results, status)
    {
       if(status == google.maps.places.PlacesServiceStatus.OK)
       {
          for( var i=0; i<5; i++)
          {
          $('#reviews').append('<div class="card bg-light mb-2" style="max-width: 30rem;"><div class="card-header"> Rating: '+results.reviews[i].rating+'<img src="'+results.reviews[i].profile_photo_url+'" style="border-radius:50%;width: 30%; margin-left:20px; padding: 10px; "></div><div class="card-body"><h5 class="card-title">'+results.reviews[i].author_name+'</h5><p class="card-text">'+results.reviews[i].text+'</p></div><div class="card-footer">'+ results.reviews[i].relative_time_description+'</div></div>');
          }
        }
      });
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

    function getTotalDistance(directionsDisplay) 
    {
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
    function distanceAlongPath(directionsDisplay, distanceFromOrigin, ratioFromOrigin) 
    {
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


