


test("Finds the word 'Boss' an article title and returns the full article title", function(assert) {
  var title = findTitleContainingWord('Boss');
  assert.equal(title, 'The Linguistics of Writing an Email Like a Boss',
  'Boom you know how to search an html page!');
});
