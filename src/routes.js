const router = require("express").Router();

const homeController = require("./controllers/homeController");
const authController = require("./controllers/authController");
const recipesController = require("./controllers/recipesController");

router.use("/", homeController);
router.use("/auth", authController);
router.use("/recipes", recipesController);

router.all("*", (req, res) => {
    res.render("404");
});

module.exports = router;