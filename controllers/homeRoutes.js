const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          attributes: ["comment", "user_id"],
        },
      ],
    });
    const posts = await Promise.all(
      postData.map(async (p) => {
        const comments = p.comments;
        const users = await Promise.all(
          comments.map((c) =>
            User.findByPk(c.user_id, { attributes: ["name"] })
          )
        );
        const commentsWithUsernames = comments.map((c, i) => ({
          ...c.toJSON(),
          name: users[i].name,
        }));
        return { ...p.toJSON(), comments: commentsWithUsernames };
      })
    );

    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/user/:id", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [
        {
          model: Post,
        },
      ],
    });
    const user = userData.get({ plain: true });
    res.render("user", {
      ...user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

module.exports = router;