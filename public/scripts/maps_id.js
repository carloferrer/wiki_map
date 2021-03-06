$(document).ready(function() {

  var path = window.location.pathname;

  loadMap();
  formSubmission();

  var editMode = false;

  var map, infowindow;

  var markers = {};

  function loadMap() {
    if (path != '/maps/create') {
      console.log(path);
      $.get('http://localhost:8080/api'+path)
      .done(function(map) {


        loadPoints();

        console.log(map);
        $('#map-title').text(map.title);

      })
      .fail(function(error) {
        console.error(error);
      });
    } else {
      $('#map-title').text('CREATE NEW MAP');
        initMap([]);
    }
  }

  function loadPoints() {
    console.log("***loading points...***");
    $.get('http://localhost:8080/api'+path+'/points')
    .done(function(points) {
      console.log(points[0]);
      console.log(points.length);
      initMap(points);
    })
    .fail(function(error) {
      console.error(error);
    });
  }

  function createNewPoint(all) {
    $.post('http://localhost:8080/api'+path+'/points/new', all)
    .done(function(){})
    .fail(function(error) {
      console.error(error);
    });
  }

  function formSubmission() {
    $('#point-info').on('submit', function(event) {
      event.preventDefault();

      var temp = $('#edit-title,#edit-desc,#edit-coord-x,#edit-coord-y').serialize();

      console.log(temp);


      createNewPoint(temp);
    });
  }

  function editMapMode() {
    $('#map-edit').on('click', function() {
      if (!editMode) {
        editMode = true;
        $('#map-edit').val('NOW CLICK MAP TO ADD MARKER');

      } else {
        editMode = false;
        $('#map-edit').val('CLICK HERE TO ADD MARKER');
      }
    });
  }

  function initMap(points) {
    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // infoWindow.setContent('You are here.');


    geolocate(map, navigator.geolocation);
    searchPlace(map);

    console.log('pointsarraylength from inside init', points.length);

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

    if(points.length) {
      for (var i = 0; i < points.length; i++) {
        var lat = points[i].coordinate_x; // lat of loaded point
        var lng = points[i].coordinate_y; // lng of loaded point
        var markerId = getMarkerUniqueId(lat, lng); // an that will be used to cache this marker in markers object.

        var pointWindow = new google.maps.InfoWindow;
        console.log(points[i]);

        var marker = new google.maps.Marker({
            position: getLatLng(lat, lng),
            map: map,
            id: 'marker_' + markerId,
            title: points[i].point_title
        });
        markers[markerId] = marker; // cache marker in markers object
        bindMarkerEvents(marker); // bind right click event to marker

        var temp_title = points[i].point_title;
        var temp_desc = points[i].point_description;

        google.maps.event.addListener(marker,'click',function(){
          console.log(temp_title, temp_desc);
          pointWindow.setContent('Title: '+temp_title+'<br>Description: '+temp_desc);
          pointWindow.open(map, this);
          
        });
      }
    }

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

        $('#edit-coord-x').text(lat);
        $('#edit-coord-y').text(lng);
        editMode = false;
        $('#map-edit').val('CLICK HERE TO ADD MARKER');
      }
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
