$(document).ready(function () {

  var algoliasearch = require('algoliasearch');
  var algoliasearchHelper = require('algoliasearch-helper');

  var applicationID = '7Y37FN61ON';
  var apiKey = 'c2a03525b10a68c5cef230060122ebb4';
  var indexName = 'restaurants_list';

  // Parts of DOM we will be using
  var jFacets = $('#facets');
  var jHits = $('#hits');
  var jHitsInfo = $('#hits-info');
  var jSearchInput = $('#search-box');

  var client = algoliasearch(applicationID, apiKey);
  var helper = algoliasearchHelper(client, indexName, {
    // define disjunctive facets
    disjunctiveFacets: ['cuisine/food_type', 'rating', 'payment_options']
  });


  function success(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    // set a search to coordinates of user if it is provided
    helper.setQueryParameter('aroundLatLng', `${lat}, ${long}`);
    helper.search();
  }

  function error() {
    var sfLat = 37.77;
    var sfLong = -122.41;
    // set a search to coordinates of San fran user location is not provided
    helper.setQueryParameter('aroundLatLng', `${sfLat}, ${sfLong}`);
    helper.search();
  }
  // Get user location
  navigator.geolocation.getCurrentPosition(success, error);

  // take the result event and bind to it an updating results function
  helper.on('result', searchCallback);

  // Bind Event Listeners
  jFacets.on('click', handleFacetClick);

  // Tigger first search so we have page with results from start
  helper.search();

  jSearchInput.on('keyup', function() {
    helper.setQuery($(this).val())
    .search();
  });

  function searchCallback(results) {
    if (results.hits.length === 0) {
      // No results message
      jHits.empty().html("No results 😔");
      return;
    }
    renderHits(jHits, results);
    renderFacets(jFacets, results);
  }

  function displayStars(number) {
    var activeStarWidth = number * 15;
    var stars = '<span data-value='+ number +' data-attribute="rating" class="stars"><span data-value='+ number + ' data-attribute="rating" class="stars-active" style="width:'+ activeStarWidth +'px"></span>';
    return stars;
  }

  function renderFacets(jFacets, results) {
    // We use the disjunctive facets attribute.
    var facets = results.disjunctiveFacets.map(function(facet) {
      var name = facet.name;
      var nameFormated = name.split('_').join(' ');
      var header = '<h4>' + nameFormated + '</h4>';
      var facetValues = results.getFacetValues(name);
      var facetsValuesList = $.map(facetValues, function(facetValue) {
        var facetValueName = name !== "rating" ?  '<span data-attribute="' + name + '" data-value="' + facetValue.name + '" >' + facetValue.name + '</span>' : displayStars(facetValue.name);
        var facetValueClass = facetValue.isRefined ? 'refined'  : '';
        var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValueName + '<span class="facet-value fade" data-attribute="' + name + '" data-value="' + facetValue.name + '" >' + facetValue.count + '</span>' + '</a>';
        return '<li class="' + facetValueClass + '">' + valueAndCount + '</li>';
      })
      return header + '<ul>' + facetsValuesList.join('') + '</ul>';
    });

    jFacets.html(facets.join(''));
  }

  function handleFacetClick(e) {
    e.preventDefault();
    var target = e.target;
    var attribute = target.dataset.attribute;
    var value = target.dataset.value;
    if(!attribute || !value) return;
    helper.toggleRefine(attribute, value).search();
  }

  function renderHits(jHits, results) {
    var resultsInfoMessage = results.nbHits + " results found in " + results.processingTimeMS / 1000 + " seconds";
    jHitsInfo.text(resultsInfoMessage)
    var hitsContent = $.map(results.hits, function(hit) {
      return '<li> <div class="hit-image" style="background-image: url('+ hit.image_url +')"></div>' +
                '<div class="hit-text"><h3>' + hit._highlightResult.name.value + '</h3>' +
                '<p class="hit-reviews"><span>' + hit.stars_count + '</span><span class="stars"><span class="stars-active" style="width:' + hit.stars_count * 15 + 'px;"></span></span> <span>(' + hit.reviews_count+ ' reviews)</span> </p>' +
                '<p class="fade"><span>' + hit.food_type + '</span> | <span>' + hit.neighborhood + '</span> | <span>' + hit.price_range + '</span> </p>' +
              '</div></li>'
    });
    jHits.html(hitsContent);
  }

});
