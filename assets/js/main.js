var algoliasearch = require('algoliasearch');
var algoliasearchHelper = require('algoliasearch-helper');

var applicationID = '7Y37FN61ON';
var apiKey = 'c2a03525b10a68c5cef230060122ebb4';
var indexName = 'restaurants_list';

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, indexName)//, {
  // add attribute to facet in display configuration of index
  // facets: ['food_type', 'stars_count', 'payment_options']
// };

$(document).ready(function() {

  helper.on('result', function(content) {
    // filter list for cuisine type
    // renderFacetList(content);
    // TODO create facet lists so users can flter by ratings and payment options

    // set main list results
    renderHits(content);
  });

  // render dynamic list of facets. render list each time  new results are received
  // this list will allow user to select a value made possible using jQuery
  function renderFacetList(content) {
    $('#cuisine-type-list').html(function() {
      // getFacetValues will return list of values (an object) usable to filter an attribute
      // returned object contains 3 properties: name (facet value), count (number of items in results)
      // isRefined (boolean - is value already selected)
      return $.map(content.getFacetValues('food_type'), function(facet) {
        var checkbox = $('<input type=checkbox>')
            .data('facet', facet.name)
            .attr('id', 'fl-' + facet.name);
        if (facet.isRefined) checkbox.attr('checked', 'checked');
        var label = $('label').html(facet.name + ' (' + facet.count + ')')
                              .attr('for', 'fl-' + facet.name);
        // dynamically append list item for each value in the results
        return $('<li>').append(checkbox).append(label);

      });
    });
  }

  function renderHits(content) {
    console.log(content.hits);
    $('.results-list').html(function() {
      return $.map(content.hits, function(hit) {
        return '<li><img src=' + hit.image_url +'><h3>' + hit._highlightResult.name.value + '</h3></li>';
      });
    });
  }

  // EVENT LISTENERS

  // event listener for user click on facet list
  $('#cuisine-type-list').on('click', 'input[type=checkbox]', function(e) {
    var facetValue = $(this).data('facet');
    helper.toggleFacetRefinement('food_type', facetValue)
          .search();
  });

  // event listener for user typing input
  $('#search-box').on('keyup', function() {
    helper.setQuery($(this).val())
    .search();
  });
  helper.search();
});
