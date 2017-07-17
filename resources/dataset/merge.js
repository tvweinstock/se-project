var fs = require('fs');
var restaurantInfo1 = require('./restaurants_list.json');
var restaurantInfo2 = require('./restaurants_info_converted.json');

var paymentOptions = ['AMEX/American Express', 'Visa', 'MasterCard', 'Discover'];

var cardsMap = {
  'Diners Club': 'Discover',
  'Carte Blanche': 'Discover',
  'JCB': '',
  'Pay with OpenTable': '',
  'Cash Only': ''
}

var restaurantsById = {};

restaurantInfo1.forEach(function(restaurant) {

  restaurant.payment_options = restaurant.payment_options.map(function(paymentOption) {
    if (paymentOption in cardsMap) {
      return cardsMap[paymentOption];
    }
    return paymentOption;
  });
  // map restaurant object to key
  restaurantsById[restaurant.objectID] = restaurant;
});

restaurantInfo2.forEach(function(restaurant) {
  // merge object from right to left with Object.assign,
  // pass in empty object just in case there is a new id that didn't exist in the first JSON
  restaurant.rating = Math.round(restaurant.stars_count);
  restaurantsById[restaurant.objectID] = Object.assign({}, restaurantsById[restaurant.objectID], restaurant);
});

// create array with object
// map makes an array of keys into an array of values
var outputArray = Object.keys(restaurantsById).map(function(key) {
  return restaurantsById[key];
});

// use node FileSync to write merged json into a new file
fs.writeFileSync('restaurant_info_merged.json', JSON.stringify(outputArray, '', 2));

// TODO
// Change name of food_type to cuisine/food_type_type
// change name of Stars count to rating

// For payment options we should only
// AMEX/American Express, Visa, Discover, and MasterCard
// Diners Club and Carte Blanche are Discover cards
