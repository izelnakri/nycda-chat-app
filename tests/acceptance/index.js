const Nightmare = require('nightmare'),
      assert = require('assert'),
      browser = Nightmare();

describe('homepage tests', function() {
  it('shows hello world', function(done) {
    browser
      .goto('http://localhost:3005')
      .evaluate(function() {
        return $("h1").first().text();
      }).then((helloWorldText) => {
        assert.equal(helloWorldText, 'Hello NYCDA');
        done();
      });
  });

  it('visitor sees a username prompt');

  it('visitor can pick a username');

  it('visitor with username joins a channel');

  it('visitor can post a message to the channel');

  it('visitor can see the messages of other members');

  // it('visitor can see members of the channel');

  // it('visitor can see the previous messages of the channel');
});
