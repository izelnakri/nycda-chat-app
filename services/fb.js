var https = require('https');

module.exports = {
  https: https,
  clientId: process.env.FB_CLIENT_ID,
  redirectURI: 'http://localhost:3005/fb-login',
  accessToken: undefined,
  code: undefined,
  clientSecret: process.env.FB_CLIENT_SECRET,
  getAccessToken: function(tempToken, callback) {
    this.code = tempToken;
    var url = `https://graph.facebook.com/v2.8/oauth/access_token?client_id=${this.clientId}&redirect_uri=http://localhost:3005/fb-login&code=${this.code}&client_secret=${this.clientSecret}`;

    this.https.get(url, (res) => {
      res.on('data', (body) => {
        this.accessToken = JSON.parse(body).access_token;
        this.getProfileInformation(callback);
      });
    });
  },
  getProfileInformation: function(callback) {
    url = `https://graph.facebook.com/me?access_token=${this.accessToken}&fields=email,name,first_name,last_name`;

    this.https.get(url, (res) => {
      res.on('data', (body) => {
        var userData = JSON.parse(body);
        callback(userData);
     });
    });
  }
};
