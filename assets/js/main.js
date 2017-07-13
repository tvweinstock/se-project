var algoliasearch = require('algoliasearch');
var algoliasearchHelper = require('algoliasearch-helper');

var applicationID = '7Y37FN61ON';
var apiKey = 'c2a03525b10a68c5cef230060122ebb4';
var indexName = 'restaurants_list';

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, indexName);

helper.on('result', function(content) {
  renderHits(content);
});

function renderHits(content) {
  $('.results-list').html(function() {
    return $.map(content.hits, function(hit) {
      return '<li>' + hit._highlightResult.name.value + '</li>';
    });
  });
}

$('#search-box').on('keyup', function() {
  helper.setQuery($(this).val())
        .search();
});
