const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const passport = require('passport');

const models = require('../../models');
const validate = require('../../config/validate');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const posts = await models.Post.findAll({
      attributes: ['uuid', 'message', 'title', 'createdAt'],
      include: {
        model: models.User,
        attributes: ['firstName', 'lastName'],
      },
    });
    res.status(200).json(posts);
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),

  [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').not().isEmpty().withMessage('Description is required'),
  ],
  validate,
  async (req, res) => {
    const post = await models.Post.create({
      title: req.body.title,
      message: req.body.description,
      UserId: req.user.id,
    });
    res.status(200).json(post);
  }
);

module.exports = router;
