const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { User } = require('../models');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_KEY,
};

const prodStrategy = new JwtStrategy(options, (jwtPayload, done) => {
  console.log(jwtPayload);
  const db = require('../models').sequelize;
  try {
    db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  // Since we are here, the JWT is valid!
  // We will assign the `sub` property on the JWT to the database ID of user
  User.findOne({ where: { id: jwtPayload.sub } }).then((user, err) => {
    // This flow look familiar?  It is the same as when we implemented
    // the `passport-local` strategy
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
});

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
  // The JWT payload is passed into the verify callback
  // passport.use(FakeStrategy);

  passport.use(prodStrategy);
};
