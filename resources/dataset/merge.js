var fs = require('fs');
var restaurantInfo1 = require('./restaurants_list.json');
var restaurantInfo2 = require('./restaurants_info_converted.json');
var dicoverCard = 'Discover' || 'Diners Club' || 'Carte Blanche';
var paymentOptions = ['AMEX/American Express', 'Visa', 'MasterCard', dicoverCard];

var restaurantsById = {};
restaurantInfo1.forEach(function(restaurant) {
  restaurantsById[restaurant.objectID] = restaurant;
});

restaurantInfo2.forEach(function(restaurant) {
  // merge object from right to left with Object.assign,
  // pass in empty object just in case there is a new id that didn't exist in the first JSON
  restaurantsById[restaurant.objectID] = Object.assign({}, restaurantsById[restaurant.objectID], restaurant);
});

// create array with object
// map makes an array of keys into an array of values
var outputArray = Object.keys(restaurantsById).map(function(key) {
  return restaurantsById[key];
});

// use node FileSync to write merged json into a new file
fs.writeFileSync('restaurant_info_merged.json', JSON.stringify(outputArray));

// For payment options we should only
// AMEX/American Express, Visa, Discover, and MasterCard
// Diners Club and Carte Blanche are Discover cards
