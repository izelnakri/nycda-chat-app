const Nightmare = require('nightmare'),
      assert = require('assert'),
      request = require('request'),
      browser = Nightmare({ show: true }),
      nock = require('nock');

// facebook Mocks:
var facebookCodeMock = 'asiCEwFzct52asq',
    facebookAccessTokenMock = 'aast1314y1siCEsac2asq',
    facebookClientId = '1829373514000205',
    facebookClientSecret = '7af34a02aaf09fb7f1882b019afbf0e3';

var facebookPermissionMock = nock('https://www.facebook.com')
                              .get(`/v2.8/dialog/oauth?client_id=${facebookClientId}&redirect_uri=http://localhost:3005/fb-login&scope=public_profile,email`)
                              .reply(200, function() {
                                return request.get(`http://localhost:3005/fb-login?code=${facebookCodeMock}`);
                              });

var facebookAccessTokenMock = nock('https://graph.facebook.com')
                              .get(`/v2.8/oauth/access_token?client_id=${facebookClientId}&redirect_uri=http://localhost:3005/fb-login&code=${facebookCodeMock}&client_secret=${facebookClientSecret}`)
                              .reply(200, JSON.stringify({
                                access_token: facebookAccessTokenMock
                              }));

var facebookUserProfileMock;
// Mocks - end

describe('homepage tests', function() {
  this.timeout(10000);

  it('visitor sees a Login with Facebook prompt', function(done) {
    browser
      .goto('http://localhost:3005')
      .wait()
      .evaluate(function() {
        return {
          text: $(".ny-username-modal a").text(),
          link: $(".ny-username-modal a").attr('href')
        };
      }).then((facebookLoginLink) => {
        console.log(facebookLoginLink);
        assert.notEqual(facebookLoginLink.text.match('Login with Facebook'), null);
        assert.notEqual(facebookLoginLink.link.match('facebook.com'), null);
        done();
      });
  });

  it('visitor after a facebook a login can join channel', function(done) {
    console.log(facebookAccessTokenMock.activeMocks());
    request.get('https://www.facebook.com/v2.8/dialog/oauth?client_id=1829373514000205&redirect_uri=http://localhost:3005/fb-login&scope=public_profile,email', (error, response, body) => {
      console.log(body);
      // assert.equal(body, 'Hello from our HTTP Mock!');
      done();
    });
  });

  it('visitor can post a message to the channel');

  it('visitor can see the messages of other members');

  // it('visitor can see members of the channel');

  // it('visitor can see the previous messages of the channel');
});
