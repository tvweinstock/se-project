var fs = require('fs');

var restaurantInfo1 = require('./restaurants_list.json');
var restaurantInfo2 = require('./restaurants_info_converted.json');
var restaurantsById = {};

var paymentOptions = ['AMEX/American Express', 'Visa', 'MasterCard', 'Discover'];

var cardsMap = {
  'Diners Club': 'Discover',
  'Carte Blanche': 'Discover',
  'JCB': '',
  'Pay with OpenTable': '',
  'Cash Only': ''
}

var foodType = 'food_type';
var foodCuisineType = 'cuisine/food_type';

restaurantInfo1.forEach(function(restaurant) {

  restaurant.payment_options = restaurant.payment_options.map(function(paymentOption) {
    // Clean up payment options to remove/update irrelevant fields
    if (paymentOption in cardsMap) {
      return cardsMap[paymentOption];
    }
    return paymentOption;
  });
  // map restaurant object to key
  restaurantsById[restaurant.objectID] = restaurant;
});

restaurantInfo2.forEach(function(restaurant) {
  // add rating key and assign rounded version of stars_count to create rating facet
  restaurant.rating = Math.round(restaurant.stars_count);
  // change name of food_type key to
  var foodTypeMemory = restaurant[foodType];
  delete restaurant[foodType];
  restaurant[foodCuisineType] = foodTypeMemory;
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
fs.writeFileSync('restaurant_info_merged.json', JSON.stringify(outputArray, '', 2));
