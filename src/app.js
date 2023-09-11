const express = require("express");
const cors = require('cors');
const errorHandling = require("./error/errorHandling");
const userRouters = require("./routers/user.routers");
const tiendaRouters = require("./routers/tienda.routers");
const eventRoutes=require("./routers/event.routers");
const chatRouters = require("./routers/chat.routers");
const homeRouters=require("./routers/home.routers")
const followRouters = require("./routers/follow.routers");
const camaraRouters = require("./routers/camara.routers");
const citaRouters = require("./routers/cita.routers");
const fs = require("fs");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 3000);

const uploadsFolderPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsFolderPath)) {
  fs.mkdirSync(uploadsFolderPath);
}

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRouters);
app.use(tiendaRouters);
app.use(eventRoutes);
app.use(homeRouters);
app.use(citaRouters);
app.use(followRouters);
app.use(chatRouters);
app.use(camaraRouters);
app.use(function(req, res, next) {
  res.status(404).json({ error: true, codigo: 404, message: "Endpoint doesnt found" });
});

app.use(errorHandling);

module.exports = app;
