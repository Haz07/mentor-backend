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
      where: {
        UserId: req.user.id,
      },
    });
    res.status(200).json(posts);
  }
);

router.get(
  '/all',
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

router.patch(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { title, description } = req.body;
    const post = await models.Post.findOne({
      where: {
        uuid: req.params.uuid,
        UserId: req.user.id,
      },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, msg: 'Could not find post' });
    }

    if (title) {
      post.title = title;
    }
    if (description) {
      post.message = description;
    }

    await post.save();

    res.status(200).json(post);
  }
);

router.delete(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const post = await models.Post.destroy({
      where: {
        uuid: req.params.uuid,
        UserId: req.user.id,
      },
    });
    if (post === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Couldn't find post" });
    }

    res.status(200).json({ success: true });
  }
);
module.exports = router;
