const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

function generatePassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt,
    hash: genHash,
  };
}

function issueJWT(user) {
  if (user?.id) {
    const expiresIn = '12h';

    const payload = {
      sub: user.id,
      iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, process.env.PASSPORT_KEY, {
      expiresIn,
    });

    jsonwebtoken.verify(signedToken, process.env.PASSPORT_KEY, (err, data) => {
      if (err) {
        console.log(err, data);
      } else {
        console.log('Verified!');
      }
    });
    return {
      token: `Bearer ${signedToken}`,
      expires: expiresIn,
    };
  } else {
    throw new TypeError(`'Cannot read property 'id' of ${typeof user}`);
  }
}

module.exports.generatePassword = generatePassword;
module.exports.issueJWT = issueJWT;
