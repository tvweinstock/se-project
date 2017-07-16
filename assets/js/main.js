var algoliasearch = require('algoliasearch');
var algoliasearchHelper = require('algoliasearch-helper');

var applicationID = '7Y37FN61ON';
var apiKey = 'c2a03525b10a68c5cef230060122ebb4';
var indexName = 'restaurants_list';

// Parts of DOM we will be using
var jFacets = $('#facets');
var jHits = $('#hits');
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
    var header = '<h4>' + name + '</h4>';
    var facetValues = results.getFacetValues(name);
    var facetsValuesList = $.map(facetValues, function(facetValue) {
      var facetValueClass = facetValue.isRefined ? 'refined'  : '';
      var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
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
  var hits = results.hits.map(function renderHit(hit) {
    var highlighted = hit._highlightResult;
    var attributes = $.map(highlighted, function renderAttributes(attribute, name) {
      return (
        '<div class="attribute">' +
        '<strong>' + name + ': </strong>' + attribute.value +
        '</div>');
    }).join('');
    return '<div class="hit panel">' + attributes + '</div>';
  });
  jHits.html(hits);
}
