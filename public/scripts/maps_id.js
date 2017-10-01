$(document).ready(function() {

  var path = window.location.pathname;


  loadMap();

  var editMode = false;
  var map, infowindow;
  // var markerID = [];
  var markers = {};

  function loadMap() {
    if (path != '/maps/create') {
      console.log(path);
      $.get('http://localhost:8080/api'+path)
      .done(function(map) {

        initMap();

        console.log(map);
        $('#map-title').text('Map: '+map.title);

      })
      .fail(function(error) {
        console.error(error);
      });
    } else {
      $('#map-title').text('CREATE NEW MAP');
        initMap();
    }
  }

  // function savePoint() {
  //   let
  // }

  function editMapMode() {
    $('#map-edit').on('click', function() {
      if (!editMode) {
        editMode = true;
        $('#map-edit').text('NOW CLICK MAP TO ADD MARKER');

      } else {
        editMode = false;
        $('#map-edit').text('CLICK HERE TO ADD MARKER');
      }
    });
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

    editMapMode();


    // All of the below borrowed from http://jsfiddle.net/fatihacet/CKegk/
    var addMarker = google.maps.event.addListener(map, 'click', function(e) {
      var lat = e.latLng.lat(); // lat of clicked point
      var lng = e.latLng.lng(); // lng of clicked point
      var markerId = getMarkerUniqueId(lat, lng); // an that will be used to cache this marker in markers object.
      if(editMode) {
        var marker = new google.maps.Marker({
            position: getLatLng(lat, lng),
            map: map,
            id: 'marker_' + markerId
        });
        markers[markerId] = marker; // cache marker in markers object
        bindMarkerEvents(marker); // bind right click event to marker
        $('.edit-coord-x').text('Latitude: '+lat);
        $('.edit-coord-y').text('Longitude: '+lng);
        editMode = false;
        $('#map-edit').text('CLICK HERE TO ADD MARKER');
      }
    });
    var getMarkerUniqueId = function(lat, lng) {
        return lat + '_' + lng;
    };

    var getLatLng = function(lat, lng) {
      return new google.maps.LatLng(lat, lng);
    };

    var bindMarkerEvents = function(marker) {
      google.maps.event.addListener(marker, "rightclick", function (point) {
          var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
          var marker = markers[markerId]; // find marker
          removeMarker(marker, markerId); // remove it
      });
    };

    var removeMarker = function(marker, markerId) {
      marker.setMap(null); // set markers setMap to null to remove it from map
      delete markers[markerId]; // delete marker instance from markers object
    };
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

    var searchMarkers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      searchMarkers.forEach(function(marker) {
        marker.setMap(null);
      });
      searchMarkers = [];

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
        var marker = new google.maps.Marker({
          map: map,
          // icon: icon,
          title: place.name,
          position: place.geometry.location,
          animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(marker,'click',function(){
          console.log(place.geometry.location.lat()+' '+place.geometry.location.lng());
        });

        searchMarkers.push(marker);


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


  // function addPoints(map) {
  //   // if (editMode) {
  //     map.event.addListener(map, 'click', function(event) {
  //       placeMarker(event.latLng);
  //       console.log(editMode);
  //       console.log('PLACE MARKER ATTEMPT');
  //     });
  //   // }
  // }

  //https://stackoverflow.com/questions/8521766/google-maps-api-3-remove-selected-marker-only

  // function placeMarker(location) {

  //   var marker = new google.maps.Marker({
  //       position: location,
  //       map: map,
  //       title: location.name,
  //       animation: google.maps.Animation.DROP
  //   });

  //   map.panTo(location);

  //   console.log('MARKER ID ARRAY BEFORE:'+markerID.length);
  //   console.log('MARKERS OBJECT LENGTH BEFORE:'+Object.keys(markers).length);

  //   markerID.push(marker.__gm_id);
  //   markers[markerID[markerID.length-1]] = marker;

  //   console.log('MARKER ID ARRAY AFTER:'+markerID.length);
  //   console.log('MARKERS OBJECT LENGTH AFTER:'+Object.keys(markers).length);

  //   google.maps.event.addListener(marker, "rightclick", function () {
  //     delMarker(this.__gm_id);
  //     markerID.splice(markerID.indexOf(markerID.length));
  //     console.log('MARKER ID ARRAY AFTER DELETE:'+markerID.length);
  //     console.log('MARKERS OBJECT LENGTH AFTER DELETE:'+Object.keys(markers).length);
  //   });

  //   google.maps.event.addListener(marker, 'click', function() {
  //     infowindow.setContent('Coordinates of point:\n'+(location.lat()).toString()+'\n'+(location.lng()).toString());
  //     infowindow.open(map, this);
  //     console.log('Point located here: ', location.lat(), location.lng());
  //   });

  //   function delMarker(markerID) {
  //     marker = markers[markerID];
  //     marker.setMap(null);
  //   }

  //   editMode = false;
  // }
