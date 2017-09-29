require('dotenv').config();

const GOOGLE_KEY = process.env.GOOGLE_KEY;

$.get('https://maps.googleapis.com/maps/api/js?key='+GOOGLE_KEY+'&libraries=places&callback=initMap');

