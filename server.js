const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const keys = require('./keys');
const port = 3000;

const app = express();
app.use(session({secret: 'topsecretstringcreatedbydave'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
  domain: keys.domain,
  clientID: keys.clientID,
  clientSecret: keys.clientSecret,
  callbackURL: 'http://localhost:3000/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  //go to db to find and create user in a large-scale project
  return done(null, profile);//goes to serialize user when done.
}));

app.get('/auth/', passport.authenticate('auth0'));
app.get('/auth/callback',
    passport.authenticate('auth0', {successRedirect: '/me'}));


passport.serializeUser(function(profileToSession, done) {
  done(null, profileToSession);//puts second argument ('profileToSession') on session
});

passport.deserializeUser(function(profileFromSession, done) {
  //obj is value from session
  done(null, profileFromSession); //puts second argument ('profileFromSession') on req.user
});

app.get('/me', function(req,res) {
  res.send(req.user);
})

app.listen(port, ()=>{console.log(`Listening on port ${port}.`) })
