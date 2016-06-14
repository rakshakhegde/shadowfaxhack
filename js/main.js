function log(msg) {
  console.log(msg);
}

log('main.js loaded');

$(document).ready(function() {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();
});
var config = {
  apiKey: "AIzaSyArP5MzszVrueVZlSsmq_HifP_le9G309s",
  authDomain: "shadowfaxhack.firebaseapp.com",
  databaseURL: "https://shadowfaxhack.firebaseio.com",
  storageBucket: "shadowfaxhack.appspot.com",
};
firebase.initializeApp(config);
// Get a reference to the database service
var fbRef = firebase.database().ref();

appData = {
  items: [0, 1, 2, 3, 4, 5],
  names: ['Scottish Pizza Crunch', 'Tuna & Sweet Corn', 'Maltese', 'Chocolato', 'Wateroo', 'Vineguroo'],
  processing: false
};

var vm = new Vue({
  el: "#app",
  data: appData,
  methods: {
    order: function() {
      appData.processing = true;
      var ukey = fbRef.child('orders').push().key
      $.ajax({
        url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCiXFrfgjRZNd_d1raeMzEOdFEfEdGVRJo',
        type: 'POST',
        data: JSON.stringify({
          longUrl: 'https://shadowfaxhack.firebaseapp.com/order/#' + ukey
        }), contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          appData.processing = false;
          $('#orderModal').closeModal();
          log(data);
          fbRef.child('order/'+ukey).set({
            phoneNo: 9738144734,
            shortUrl: data.id,
            merchant_account_id: 'Ab2981ndjd7ak28ekdbbsid982m'
          });
          Materialize.toast('Ordered!', 3000);
          var message = encodeURI('ShadowFax: Track your rider\'s progress at ' + data.id);
          $.getJSON('https://www.kookoo.in/outbound/outbound_sms.php?phone_no=9738144734&api_key=KK268a2e81e84db444386421ac2d771fd8&message='+message);
        }
      });
    }
  }
});
