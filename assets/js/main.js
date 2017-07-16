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
  disjunctiveFacets: ['food_type', 'stars_count', 'payment_options']
});

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

function renderFacets(jFacets, results) {
  // We use the disjunctive facets attribute.
  var facets = results.disjunctiveFacets.map(function(facet) {
    var name = facet.name;
    var nameFormated = name.split('_').join(' ');
    var header = '<h4>' + nameFormated + '</h4>';
    var facetValues = results.getFacetValues(name);
    var facetsValuesList = $.map(facetValues, function(facetValue) {
      var facetValueClass = facetValue.isRefined ? 'refined'  : '';
      var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#"><span>' + facetValue.name + '</span><span>' + facetValue.count + '</span>' + '</a>';
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
  // Because we are listening in the parent, the user might click where there is no data
  if(!attribute || !value) return;
  // The toggleRefine method works for disjunctive facets as well
  helper.toggleRefine(attribute, value).search();
}

function renderHits(jHits, results) {
  var resultsInfoMessage = results.nbHits + " results found in " + results.processingTimeMS / 1000 + " seconds";
  jHitsInfo.text(resultsInfoMessage)
  var hitsContent = $.map(results.hits, function(hit) {
    console.log(hit);
    return '<li> <div class="hit-image" style="background-image: url('+ hit.image_url +')"></div>' +
              '<div class="hit-text"><h3>' + hit._highlightResult.name.value + '</h3>' +
              '<p><span>' + hit.stars_count + '</span> <span>(' + hit.reviews_count+ ' reviews)</span> </p>' +
              '<p><span>' + hit.food_type + '</span> | <span>' + hit.neighborhood + '</span> | <span>' + hit.price_range + '</span> </p>' +
            '</div></li>'
  });
  jHits.html(hitsContent);

}
