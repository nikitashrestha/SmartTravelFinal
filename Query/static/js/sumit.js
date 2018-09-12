var map, geocoder, current_location, start_position, dest_position ;
var places_position=[], places_marker=[]; /* for intermediate waypoints from start to destination */
var current_marker, start_marker,dest_marker ;
var directionsService;
var directionsDisplay;
var placesServices; 
var optimizeDirectionDisplay;
var waypoints=[];
var notGeocoded = true; 
var destination;
var TravelMode = 'Driving';
var toRadian = Math.PI/180; 
var toDegree = 180/Math.PI;

function initMap()
{
  
        var review = document.getElementById("review");
        review.style.visibility = "hidden";

        
        var uluru = {lat: 27.6818631, lng: 85.3234372};
        dest_marker = new google.maps.Marker({
                position: uluru,
                map: map,
                label:'destination',
                });
        mid_marker = new google.maps.Marker({
                position: uluru,
                map: map,
                label:'mid',
                });
        geocoder = new google.maps.Geocoder;

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
                current_location= {lat: pos.lat, lng: pos.lng};// store current location value in a var 
                document.getElementById('soflow').addEventListener('change', Shristi);                
              }
              ,
            function() {
             handleLocationError(true, infoWindow, map.getCenter());
            });
        }
        else
         {
            handleLocationError(false, infoWindow, map.getCenter());
         }
 }

/* geocode user address */
function Shristi()
{
  console.log("shristi function call ");
  //optimizeDirectionDisplay.setMap(null);
  //directionsDisplay.setMap(null);
  var address = document.getElementById('destination').value;
  console.log(address);
  for(var i=0; i<100000000; i++){}
    SetMapOnAll(null);
    count=0;
    dest_marker.setMap(null);
    mid_marker.setMap(null);
    places_marker=[];
    places_position=[];

    geocoder.geocode({'address': address}, function(results, status) {
      if (status == 'OK') 
      {
       alert("Shristi Function ");
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
        for(i=0;i<2;i++){
          Search_Placesi(searchArray[i], rad);  
        }
        createRoute();

        } 
        else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}


/* current location ko warpara ko places find and mark garne */
function Search_Placesi(location,rad)
{
        console.log("inside Search Places");
        var selectedMode=document.getElementById('soflow').value;
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: location,
          radius: rad*1000 ,
          type: selectedMode,
          }, callback);
        return 1; 
}
var temp; //temp marker 
function callback(results, status)
{
    console.log("inside callback");
    if (status === google.maps.places.PlacesServiceStatus.OK)
    {
        if(results.length>0)
        {
          for ( i= 0; i < results.length; i++)
          {
              if(results[i].rating>=2)
                {
                  var placeloc=results[i].geometry.location;
                  places_position.push(placeloc);
                  var image = 
                  {
                    url: results[i].icon,                    
                    size: new google.maps.Size(30, 32), // This marker is 10 pixels wide by 12 pixels high.
                  };
                  
                 temp=new google.maps.Marker({ 
                    map:map,
                    position: placeloc,
                    icon:image,

                  });
                 places_marker.push(temp);
                  
                  //when clicked on a waypoint marker, show address and opening time 
                  var content=results[i].name+" located at "+ results[i].formatted_address+" opens "+ results[i].opening_hours;
                  google.maps.event.addListener(temp, 'click', function()
                  {
                      var infoWindow =new google.maps.InfoWindow;
                      infoWindow.setPosition(placeloc);
                      infoWindow.setContent(content);
                      infoWindow.open(map);
                      var placesServices = new google.maps.places.PlacesService(map);
                    
                      var id=results[0].place_id;
                         var review = document.getElementById("review");
                         review.style.visibility = "visible";
                         $('#reviews').html("");

                         var request = {
                          placeId: id,
                          };

                          placesServices.getDetails(request, function(results, status)
                          {
                             if(status == google.maps.places.PlacesServiceStatus.OK)
                             {
                                document.getElementById('review_head').innerHTML=results.formatted_address;
                                document.getElementById('review_head_number').innerHTML=results.international_phone_number;
                                for( var i=0; i<5; i++)
                                {
                                $('#reviews').append('<div class="card bg-light mb-2" style="max-width: 30rem;"><div class="card-header"><div class="row"><div class="col"><h5 class="lead">'+ results.reviews[i].author_name+'</h5></div><div class="col"><img src="'+results.reviews[i].profile_photo_url+'" style="border-radius:50%;width: 60%; margin-left:20px; padding: 10px; "></div></div></div><div class="card-body"><p class="card-text">'+results.reviews[i].text+'</p></div><div class="card-footer"><h6 class="lead">Rating: '+results.reviews[i].rating+' <br/> Posted: '+results.reviews[i].relative_time_description+'</h5></div></div>');
                                }
                              }
                          });
                        
                       });        
                  }

              }
                map.setZoom(13);
              console.log("result length: "+ results.length);
          } 
      }
  else
    console.log("No data found..");
      
}

// Sets the map on all markers in the array.
function SetMapOnAll(map) 
{
  for (var i = 0; i < places_position.length; i++) 
  {
    places_marker[i].setMap(map);
  }
}

function createRoute()
{
  alert("Inside Create route function ...");
  directionsService.route({
    origin: current_location,
    destination: dest_position,
    travelMode: 'DRIVING',  
  }, function (response ,status){
    if(status == google.maps.DirectionsStatus.OK)
    {

      console.log("well going wel");
    directionsDisplay.setDirections(response);
    var route = response.routes[0];
    var summaryPanel = document.getElementById("directions_panel");
    summaryPanel.innerHTML = "";
    // For each route, display summary information.
    for (var i = 0; i < route.legs.length; i++) 
    {
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
}

function calculateDistanceAndMid(destlat, destlng, orilat, orilng)
{
       
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

 function submit_form() 
 {
  destination=document.getElementById('destination').value;
      for (var i = 0; i <1000000000; i++) {
          
      }
           
      switch(destination) {
          

          case 'Godawari':
            waypoints = [
                {location: 'Pashupatinath, kathmandu' , stopover:true},
                {location: 'Bota Momo- kumaripati', stopover: true}, 
                {location: 'Godawari Botanical Garden', stopover:true },
                {location: 'Patan Durbar Square, Lalitpur', stopover:true},
                {location:'Godavari Village Resort'}
                ];
              notGeocoded = false; 
            break;
             case 'godawari':
            waypoints = [
                {location: 'Patan Durbar Square, Lalitpur', stopover:true},
                {location: 'Bota Momo- kumaripati', stopover: true},
                {location: 'Central Zoo, Patan' , stopover:true},
                {location: 'Godawari Botanical Garden', stopover:true },
                {location:'Godavari Village Resort', stopover:true}
                ];
                 notGeocoded = false; 
            break;
          case 'sanepa':
            waypoints = [
            {location: 'Pashupatinath, kathmandu', stopover:true},
            {location: 'Bota Mo:Mo, kamalpokhari', stopover: true},
            {location: 'Kathmandu Funpark, Nepal ', stopover: true},
            {location: 'kathmandu Durbar Square', stopover: true},
            {location: 'Summit Hotel, Sanepa', stopover: true}
            ];
             notGeocoded = false; 
            break;
            case 'nagarkot':
            waypoints = [
            {location: 'Patan Durbar Square, Lalitpur',stopover: true },
            {location: 'Bhaktapur Durbar Square, Bhaktapur', stopover: true },
            {location: 'Tryst Fast Food, Bhaktapur', stopover: true},
            {location: 'Nagarkot View Tower', stopover:true },
            {location: 'Hotel Mystic Mountain', stopover: true},
            
            ];
             notGeocoded = false; 
            break; 
             
            case 'Dhulikhel':
            waypoints = [
            { location:'Patan Durbar Square, Lalitpur', stopover: true},
            { location: 'Indreni Foodland, New Baneshwor Rd', stopover : true},
            {location: 'Kathmandu Fun Valley', stopover:true},
            {location: 'Kailashnath Mahadev Statue', stopover: true},
            {location: 'Lover\'s Point Dhulikhel', stopover: true},
            ];
             notGeocoded = false; 
            break;

            case 'dhulikhel':
            waypoints = [
            { location:'Patan Durbar Square, Lalitpur', stopover: true},
            { location: 'Indreni Foodland, New Baneshwor Rd', stopover : true},
            {location: 'Bhaktapur Durbar Square, Bhaktapur', stopover:true},
            {location: 'Kailashnath Mahadev Statue', stopover: true},
            {location: 'Dwarika\'s Resort Dhulikhel', stopover: true},
            ];
             notGeocoded = false; 
            break;

            case 'sundarijal':
            waypoints = [
              {location: 'Kathmandu Funpark, Nepal ', stopover: true},
              {location: 'Pashupatinath, kathmandu', stopover: true},
              {location: 'The Bakery Cafe, Boudhanath Sadak', stopover : true},
              {location: 'Boudhha Stupa, बुद्ध स्तुपा', stopover :true },
              {location: 'Gokarna Forest Resort', stopover :true},
              ];
               notGeocoded = false; 
            break;

            case 'thankot':
            waypoints = [
            {location:'Kathmandu Durbar Square', stopover:true},
            {location:'Swoyambhunath Stupa', stopover:true},
           {location:'Newa Lahana Kirtipur', stopover: true},
            {location: 'Chandragiri Cable Car Bottom Station Nepal', stopover: true},
            {location: 'Patleban Vineyard Resort', stopover: true},
            ];
             notGeocoded = false; 

            break; 

            case 'kakani':
            destination = 'kakani, Nepal';
            waypoints = [ 
            {location:'Kathmandu Durbar Square', stopover: true},
            {location:'The Garden of Dreams, kathmandu', stopover: true},
            {location:'Swoyambhunath Stupa', stopover:true},
            {location:'Osho Tapoban', stopover:true},
            //{location:'', stopover:true},
            ];

            notGeocoded = false;

            break; 

            default:
              alert('Destination Couldn\'t be geocoded.');
              

              break; 
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

  if(! notGeocoded){

    //google optimized directions 
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

// OUR optimization 
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
          document.getElementById('review_head').innerHTML=results.formatted_address;
          document.getElementById('review_head_number').innerHTML=results.international_phone_number;
          for( var i=0; i<5; i++)
          {
          $('#reviews').append('<div class="card bg-light mb-2" style="max-width: 30rem;"><div class="card-header"><div class="row"><div class="col"><h5 class="lead">'+ results.reviews[i].author_name+'</h5></div><div class="col"><img src="'+results.reviews[i].profile_photo_url+'" style="border-radius:50%;width: 60%; margin-left:20px; padding: 10px; "></div></div></div><div class="card-body"><p class="card-text">'+results.reviews[i].text+'</p></div><div class="card-footer"><h6 class="lead">Rating: '+results.reviews[i].rating+' <br/> Posted: '+results.reviews[i].relative_time_description+'</h5></div></div>');
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


