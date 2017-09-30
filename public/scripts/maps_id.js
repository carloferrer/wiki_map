$(document).ready(function() {

  loadMap();
  editMapMode();

  var editMode = false;
  var infowindow;
  var map;

  function loadMap() {
    $.get('http://localhost:8080/api'+window.location.pathname)
    .done(function(map) {



      initMap();

      console.log(map);
      reloadDetails(map);

    })
    .fail(function(error) {
      console.error(error);
    });
  }

  function editMapMode( ) {
    $('#map-edit').on('click', function() {
      if (!editMode) {
        editMode = true;
        console.log('IN EDIT MODE!');

      } else {
        editMode = false;
        console.log('LEFT EDIT MODE! NO LONGER EDITING!');
      }
    });
  }

  function reloadDetails(map) {
    $('#map-title').text('Map: '+map.title);
  }

  function initMap() {
    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    geolocate(map, navigator.geolocation);
    searchPlace(map);
    // addPoints(google.maps);

    google.maps.event.addListener(map, 'click', function(event) {
      placeMarker(event.latLng);
      console.log('LAT LNG: ',event.latLng.lat(),event.latLng.lng());
    });

  }

  function addPoints(map) {
    // if (editMode) {
      map.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        console.log(editMode);
        console.log('PLACE MARKER ATTEMPT');
      });
    // }
  }

  function placeMarker(location) {

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: location.name,
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent('Coordinates of point:\n'+(location.lat()).toString()+'\n'+(location.lng()).toString());
      infowindow.open(map, this);
      console.log('Point located here: ', location.lat(), location.lng());
    });
  }

  function geolocate(map, geolocation) {
    infoWindow = new google.maps.InfoWindow;

    if (geolocation) {
      geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('You are here.');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  function searchPlace(map) {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        // var icon = {
        //   url: place.icon,
        //   size: new google.maps.Size(71, 71),
        //   origin: new google.maps.Point(0, 0),
        //   anchor: new google.maps.Point(17, 34),
        //   scaledSize: new google.maps.Size(25, 25)
        // };

        // Create a marker for each place.
        var newMark = new google.maps.Marker({
          map: map,
          // icon: icon,
          title: place.name,
          position: place.geometry.location
        });

        google.maps.event.addListener(newMark,'click',function(){
          console.log(place.geometry.location.lat()+' '+place.geometry.location.lng());
        });

        markers.push(newMark);


        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.fitBounds(bounds);
    });

  }

});


