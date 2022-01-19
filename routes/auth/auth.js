const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const models = require('../../models');
const validate = require('../../config/validate');
const utils = require('../../lib/utils');

router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password')
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage('Must be at least 8 chars long'),
    check('firstName')
      .not()
      .isEmpty()
      .withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required'),
  ],
  validate,
  async (req, res) => {
    const { salt, hash } = utils.generatePassword(req.body.password);

    const olduser = await models.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (olduser == null) {
      const user = await models.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hash,
        salt,
      });

      try {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          uuid: user.uuid,
        });
      } catch (e) {
        res
          .status(500)
          .json({ success: false, msg: 'token generation failed' });
      }
    } else {
      res.status(400).json({
        message:
          'The email address you have entered is already associated with another account.',
      });
    }
  }
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password')
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage('Must be at least 8 chars long'),
  ],
  validate,
  async (req, res) => {
    const user = await models.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: 'could not find user' });
    }
    const isValidPassword = utils.validPassword(
      req.body.password,
      user.hash,
      user.salt
    );

    try {
      if (isValidPassword) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          uuid: user.uuid,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: 'you entered the wrong password' });
      }
    } catch (e) {
      res.status(500).json({ success: false, msg: 'token generation failed' });
    }
  }
);

module.exports = router;
