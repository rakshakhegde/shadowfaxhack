var orderId = window.location.hash.substring(1)
console.log(orderId);
var map;
var marker;
var routePath;
var customerCoords;

var config = {
  apiKey: "AIzaSyArP5MzszVrueVZlSsmq_HifP_le9G309s",
  authDomain: "shadowfaxhack.firebaseapp.com",
  databaseURL: "https://shadowfaxhack.firebaseio.com",
  storageBucket: "shadowfaxhack.appspot.com",
};
firebase.initializeApp(config);
// Get a reference to the database service
fbRef = firebase.database().ref();

function getCustomerLoc() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(loc) {
      console.log(loc);
      customerCoords={lat: loc.coords.latitude, lng: loc.coords.longitude};
      console.log('getCustomerLoc()', customerCoords);
      fbRef.child('order/'+orderId+'/coords').set(customerCoords, function(error) {
        console.log('setting error', error);
      });
      setCurrentLoc();
    });
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function setCurrentLoc() {
  if(map && customerCoords) {
    console.log('customerCoords: ', customerCoords);
    new google.maps.Marker({
      position: {lat: customerCoords.lat, lng: customerCoords.lng},
      icon: 'https://i.stack.imgur.com/Kbx0I.png'
    }).setMap(map);
  }
}

function initMap() {
  $("#map").css("top", $("#header").height());
  // $("#map").css("left", $(".container").css('marginLeft'));
  // $("#map").css("right", $(".container").css('marginRight'));
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 12.9716, lng: 77.5946},
    zoom: 14
  });
  marker = new google.maps.Marker({
    position: {lat: 0, lng: 0},
    map: map,
    title: 'Ahmed Khan'
  });
  routePath = new google.maps.Polyline({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
  routePath.setMap(map);
  setCurrentLoc();
}

fbRef.child('rider_position/666').on('child_added', function(snapshot) {
  var coords = snapshot.val();
  if(routePath) {
    routePath.getPath().push(new google.maps.LatLng(coords.lat, coords.lng));
  }
  if(marker) {
    marker.setPosition(coords);
  }
  if(map) {
    map.setCenter(coords);
  }
});

getCustomerLoc();

$('#paytag').click(function() {
  fbRef.child('order/'+orderId+'/paidOnline').set(true);
});
