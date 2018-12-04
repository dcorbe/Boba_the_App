var map;
var userInfoWindow;
var pos;
var ShopData;


function nearbySearchCallback(results, status) {
  console.log("I'm doing the nearbysearch call")
  results.forEach(function(result) {
    let lat = result["geometry"]["location"].lat()
    let lng = result["geometry"]["location"].lng()
    let bobaShopName = result["name"]
    // the line below renders each seperate boba shop name
    // $('p').append(bobaShopName + "  ");
    // added this tonight race condition?
    console.log("About to trigger event, Step 2")
    $.event.trigger({
	     type: "addBobaShop",
	     shopData: { name: bobaShopName },
    });
    let marker = addMarker('static/imgs/boba.png', {lat: lat, lng: lng}, bobaShopName, map);
    let address = result["vicinity"]
    let placeId = result["place_id"]
    let webAddress = result["url"]

    var ShopData = {
      placeId,
      address,
      bobaShopName
    }


    addInfoWindowToMarker(ShopData, marker, map);
  })
}


function initMap() {
  console.log("I'm initializing the map")
  map = new google.maps.Map(document.getElementById('map'), {
    //why is this the center?
    center: {lat: 37.7886679, lng: -122.411499},
    zoom: 14,
    mapTypeControl: false,
    scaleControl: false,
    scrollwheel: false,
    navigationControl: false,
    streetViewControl: false,
    draggable: true,
    // Pink color Scheme Added from SnazzyMaps
    styles:[
    {
        "stylers": [{"hue": "#dd0d0d"}]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    }
    ]
  });
  userInfoWindow = new google.maps.InfoWindow({map: map});


  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // built in library function for nearbysearch instead of parsing json string from API call
      var service = new google.maps.places.PlacesService(map);
      // instead of using AJAX
      service.nearbySearch({
        location: pos,
        radius: 10000,
        type: ['cafe'],
        keyword: ['boba']
      }, nearbySearchCallback);

      userInfoWindow.setPosition(pos);
      userInfoWindow.setContent('You are here.');

      // this resets the center to the geolocated center
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, userInfoWindow, map.getCenter());
    },
    {maximumAge: 600000, timeout: 5000, enableHighAccuracy: true});
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, userInfoWindow, map.getCenter());
  }
}


//if floating panel is clicked then reinitializing the map for boba shops near new location

function manual_input_address() {

  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('address').value;

  console.log("Manual input address function blast off")
  geocoder.geocode({'address': address}, function(results, status) {
         if (status === 'OK') {
           console.log((results[0].geometry.location.lat()));
           console.log((results[0].geometry.location.lng()));
          pos = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };

          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: pos,
            radius: 10000,
            type: ['cafe'],
            keyword: ['boba']
          }, nearbySearchCallback);
          map.setCenter(results[0].geometry.location);
           var marker = new google.maps.InfoWindow({
             // map: map,   <-- by commenting this out it gets rid of white empty pointer box
             position: results[0].geometry.location});
           }
           else {
                   alert('Geocode was not successful for the following reason: ' + status);
                 }
               });

}


function addMarker(icon, position, title, map) {
  const marker = new google.maps.Marker({ position, map, title, icon });

  return marker;
}

function addInfoWindowToMarker(ShopData, marker, map) {
  // change from click to mouseover
  marker.addListener('click', () => {

    var detailsRequest = {
      placeId: ShopData.placeId,
      fields: ['photos', 'photo', 'rating', 'formatted_phone_number', 'website']
    };


    var service = new google.maps.places.PlacesService(map);
    service.getDetails(detailsRequest, (place, status) => {

      if (!place.hasOwnProperty('website')) {
        place.website = "This location doesn't have a website";
      }

      if (!place.hasOwnProperty('formatted_phone_number')) {
        place.formatted_phone_number = "This shop doesn't have a phone Number"
      }

      var url = place.photos[3].getUrl({'maxWidth': 100, 'maxHeight': 100})
      const aboutLocation = `
        <h1>${marker.title}</h1>
        <p> <img src=${url}> </img> </p>
        <ul>
          <li><b>Address:</b> ${ShopData.address}</li>
          <li><b>Phone:</b> ${place.formatted_phone_number}</li>
          <li><b>Website:</b> ${place.website} </li>

          <li><a href="/boba-shop-ratings/${marker.title}/${ShopData.placeId}/${ShopData.address}"> Rate me! </a></li>
        </ul>
      `;


      const infoWindow = new google.maps.InfoWindow({
        content: aboutLocation,
        maxWidth: 500
      }, );
      console.log("opening winnow")
      infoWindow.open(map, marker)

    })

   });
}


function handleLocationError(browserHasGeolocation, userInfoWindow, pos) {
  userInfoWindow.setPosition(pos);
  userInfoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
