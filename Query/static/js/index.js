/*variables */
var map, current_location, start_position, dest_position ;
var places_position=[], places_marker=[]; /* for intermediate waypoints from start to destination */
var current_marker, start_marker,dest_marker ;
var directionsService;
var directionsDisplay;
var radius=6371 // earth radius in km 
var xi, xf, yi, yf;
var way_points = [], way_markers=[];

/*  var xi=0.696386;
  var xf=-0.557633;
  var yi=2.031563;
  var yf=2.022255; */

// Converts from degrees to radians.
Math.radians = function(degrees) 
{
 // alert("degree is: "+ degrees +" and radians is: "+ (degrees * Math.PI / 180));
  return degrees * Math.PI / 180;
};

Math.ToX=function(lat, lng) /* lat lng in radians */
{
  return radius*Math.cos(lat)*Math.cos(lng);
}
Math.ToY=function(lat, lng)
{
  return radius*Math.cos(lat)*Math.sin(lng);
}
Math.ToZ=function(lat)
{
  return radius*Math.sin(lat);
}

function distance(c,d) 
{
  xi=c.lat, yi=c.lng, xf=d.lat(), yf=d.lng();
  xi=Math.radians(xi);
  xf=Math.radians(xf);
  yi=Math.radians(yi);
  yf=Math.radians(yf);

  var delx=(xi-xf), dely=(yi-yf); /* x refer latitude and y refer longitude in radian strictly */
  var sin_comp=Math.pow(Math.sin(delx/2), 2);
  var cos_comp=Math.cos(xi)*Math.cos(xf)*Math.pow(Math.sin(dely/2), 2); 
  var a=2*Math.asin(Math.sqrt(sin_comp+cos_comp));
  alert("distance is : "+ (radius*a));
};

function dis(delx, dely, delz)
{
  return Math.sqrt(Math.pow(delx, 2)+ Math.pow(dely, 2)+ Math.pow(delz, 2));
}

function Filter()
{ 
  var i, delx, dely, delz;
  var xc, xd, yc, yd, zc, zd;
  var destx=Math.ToX(Math.radians(dest_position.lat()),Math.radians(dest_position.lng()));
  var desty=Math.ToY(Math.radians(dest_position.lat()),Math.radians(dest_position.lng()));

  xc=Math.ToX(Math.radians(current_location.lat),Math.radians(current_location.lng));
  yc=Math.ToY(Math.radians(current_location.lat),Math.radians(current_location.lng));
 
  var m=(desty-xc)/(desty-yc);
  var intercept=yc-(m*xc);
  for(i=0; i<places_position.length; i++)
  {
   
   xd=Math.ToX(Math.radians(places_position[i].lat()),Math.radians(places_position[i].lng()));
    yd=Math.ToY(Math.radians(places_position[i].lat()),Math.radians(places_position[i].lng()));
    zd=Math.ToZ(Math.radians(places_position[i].lat()));

    var temp=(yd-m*xd-intercept);
    var dist=(Math.abs(temp))/(Math.sqrt(Math.pow(-m, 2)+Math.pow(1, 2)));
    alert(" For place["+ i+"] distance = "+ dist);
    if(dist<=0.5)
    {
      //filter.push(places_position[i]);
      var ways = {
      location:places_position[i],
      stopover: false
      }
      way_points.push(ways);
    }
  }
  alert("waypoints[].length: "+ way_points.length);
  alert("waypoints are: "+ way_points);
  alert("end of loop in filterand now settle waypoints as...");
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
                directionsDisplay.setMap(map); //bind map with direction display
                current_location={lat: pos.lat, lng: pos.lng};// store current location value in a var
                
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
              way_markers=[];
              way_points=[];
              alert("clear places_position : "+ places_position.length);
              alert("clear places_marker: "+ places_marker.length);
              alert("clear way_points: "+ way_points.length);
              alert("clear way_markers: "+ way_markers.length);
              Search_Places(current_location);
          };
          document.getElementById('category').addEventListener('change', Place);  
      
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
function Search_Places(current_location)
{
        alert("inside Search Places");
        var selectedMode=document.getElementById('category').value;
        map.setCenter(current_location);
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: current_location,
          radius: 3000,
          type: selectedMode,
          }, callback);
         
}

function callback(results, status)
{
    var i;
    if (status === google.maps.places.PlacesServiceStatus.OK)
    {
        if(results.length>0)
        {
          alert("alert from the callback is ok... ");
          for ( i= 0; i < results.length; i++)
          {
              createMarker(results[i], i);
          }
          map.setZoom(13);
          alert(i + " number of data....");
          alert("Place_position array size: " + places_position.length);
          alert("Place_marker array size: " + places_marker.length);
          alert("filter hai taw");
          Filter();
            alert("waypoints filtered are: ");
            for( var i=0; i<way_points.length; i++)
            {
              way_markers[i] = new google.maps.Marker({ 
                map:map,
                position: way_points[i].location,
                label: 'w'
              });
            }

         alert("now routing start and destination ....");
         calculateAndDisplayRoute(current_location, dest_position ); 

        }
        else
          alert("No data found..");
    } 
    alert("callback finished...");
 
}


function createMarker(place, i)
{
    var placeLoc = place.geometry.location;
   places_position.push(placeLoc); /* push all places found in an array */

   
    places_marker[i] = new google.maps.Marker({ // this is local var marker, add it to markers array as global
      map:map,
      position: placeLoc, 
     
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
  alert("for start to destination routing....");
  alert("Inside calculateAndDisplayRoute we have waypoints as : "+ way_points[0].location);
    var selectedMode=document.getElementById('mode').value;
      directionsService.route({
      origin: f,
      destination: t,
      travelMode: google.maps.TravelMode[selectedMode]
      //optimizeWaypoints: true
      /*waypoints: [
        {location: way_points[0].position, stopover: false},
        {location: way_points[1].position, stopover: false},
        {location: way_points[2].position, stopover: true},
      ]*/
    
      , function(response, status)
         {
          if (status === 'OK')
          {
            directionsDisplay.setDirections(response);
          }
          else
           {
            window.alert('Directions request failed due to ' + status);
          }
        }
        });
}


// Sets the map on all markers in the array.
function SetMapOnAll(map) 
{
  for (var i = 0; i < places_marker.length; i++) 
  {
    places_marker[i].setMap(map);
  }
  for (var i = 0; i < way_markers.length; i++) 
  {
    way_markers[i].setMap(map);
  }
}

function Route()
{
  
  // dest_marker.setMap(null);
    SetMapOnAll(null); /* delete markers from previous places (kept as waypoints) */
    places_position=[];
    places_marker=[];
    way_markers=[];
    way_points=[];

    //for places
  Search_Places(current_location);

}


/* geocode user address */
function CodeAddress()
{

    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('destination').value;
    alert(address);
    geocoder.geocode({'address': address}, function(results, status)
    {
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
      Route();
      }   
    });
}
