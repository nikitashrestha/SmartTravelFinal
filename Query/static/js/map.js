/*variables */
var map, geocoder, current_location, start_position, dest_position ;
var places_position=[], places_marker=[]; /* for intermediate waypoints from start to destination */
var current_marker, start_marker,dest_marker, mid_marker ;
var directionsService;
var directionsDisplay;
var waypoints=[];
var destination;
var TravelMode = 'Driving';
var toRadian = 3.14/180; 
var toDegree = 180/3.14;


function initiMap()
{
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

        directionsService=new google.maps.DirectionsService();
        directionsDisplay= new google.maps.DirectionsRenderer();
        map = new google.maps.Map(document.getElementById('map'), { center: uluru, zoom: 13});
        google.maps.event.trigger(map, "resize");

        var infoWindow =new google.maps.InfoWindow;
        
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
                label:'I am here',
                });
                directionsDisplay.setMap(map); 
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

        document.getElementById('soflow').addEventListener('change', Shristi);  
      
 }

function handleLocationError(browserHasGeolocation, infoWindow, pos){
    var infoWindow =new google.maps.InfoWindow;
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

/* geocode user address */
function Shristi()
{
  console.log("shristi function call ");
  for(var i=0; i<100000000; i++){}
    SetMapOnAll(null);
    count=0;
    dest_marker.setMap(null);
    mid_marker.setMap(null);
    places_marker=[];
    places_position=[];
    
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById('destination').value;
    alert(address);
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
                    url: results[i].icon;
                    // This marker is 10 pixels wide by 12 pixels high.
                    size: new google.maps.Size(10, 12),
                  };
                  temp=new google.maps.Marker({ 
                    map:map,
                    position: placeloc,
                    label:'P',
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
                  });
                }
          }
          console.log("result length: "+ results.length);
          map.setZoom(13);
        }
        else
          console.log("No data found..");
    }  
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
  directionsService.route({
    origin: current_location,
    destination: destination,
    travelMode: 'DRIVING',  
  }, function (response ,status){
    if(status == google.maps.DirectionsStatus.OK)
    {
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
