const express = require("express");
const config = require("../../config/config");
const docsRoute = require("./docs.routes");
const itemRoute = require("./item.routes");

const router = express.Router();

const defaultRoutes = [
 
  {
    path: "/items",
    route: itemRoute,
  },

];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
