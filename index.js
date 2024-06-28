const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const routes = require("./src/routes");
const { authMiddleware } = require("./src/middleware/authMiddleware");

const app = express();
const port = 3000;

app.use(express.static("src/public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authMiddleware);

app.engine("hbs", handlebars.engine({
    extname: "hbs",
}));

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use(routes);

mongoose.connect("mongodb://localhost:27017/home-cooking-recipes");
try {
  mongoose.connection.on("connected", () => console.log("DB is connected"));
  mongoose.connection.on("disconnected", () => console.log("DB is disconnected"));
} catch (err) {
  mongoose.connection.on("error", (err) => console.log(err));
}
app.listen(port, () => {
    console.log(`Server is started on port 3000...`);
});