const assert = require('assert');
const nock = require('nock');
const https = require('https');

var FB = require('../../services/fb');

FB.https = https;

nock.disableNetConnect();

var FBAccessTokenMock = 'aast1314y1siCEsac2asq';

var FBProfileInformationRequestMock = nock(`https://graph.facebook.com`)
                                      .get(`/me?access_token=${FBAccessTokenMock}&fields=email,name,first_name,last_name`)
                                      .twice()
                                      .reply(200, function() {
                                        return JSON.stringify({
                                          name: 'Izel',
                                          surname: 'Nakri'
                                        });
                                      });

var FBAccessTokenRequestMock = nock('https://graph.facebook.com')
                                .get(`/v2.8/oauth/access_token?client_id=${FB.clientId}&redirect_uri=${FB.redirectURI}&code=${FBAccessTokenMock}&client_secret=${FB.clientSecret}`)
                                .reply(200, function() {
                                    return JSON.stringify({
                                      access_token: FBAccessTokenMock
                                    });
                                });

describe('FB Service Test', () => {
  beforeEach(() => {
    FB.accessToken = undefined;
  });

  it('FB.getProfileInformation should run the callback', (done) => {
    FB.accessToken = FBAccessTokenMock;

    FB.getProfileInformation((userData) => {
      assert.deepEqual(userData, {
        name: 'Izel',
        surname: 'Nakri'
      });
      done();
    });
  });

  it('FB.getAccessToken should set the right accessToken', (done) => {
    FB.getAccessToken(FBAccessTokenMock, (userData) => {
      assert.deepEqual(userData, {
        name: 'Izel',
        surname: 'Nakri'
      });
      assert.equal(FB.accessToken, FBAccessTokenMock);

      done();
    });
  });
});
