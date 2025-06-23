const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { itemController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");

const UPLOADS_FOLDER_ITEM = "./public/uploads/items";
const uploadItems = userFileUploadMiddleware(UPLOADS_FOLDER_ITEM);

const router = express.Router();

router.route("/create").post(
  uploadItems.fields([
    { name: "image", maxCount: 1 },
    { name: "mainImage", maxCount: 1 },
    { name: "itemImages", maxCount: 10 },
  ]),
  convertHeicToPngMiddleware(UPLOADS_FOLDER_ITEM),
  itemController.createItem
);

router.route("/all").get(itemController.getItems);

router
  .route("/:itemId")
  .get(itemController.getItemById)
  .patch(
    uploadItems.fields([
      { name: "image", maxCount: 1 },
      { name: "mainImage", maxCount: 1 },
      { name: "itemImages", maxCount: 10 },
    ]),
    convertHeicToPngMiddleware(UPLOADS_FOLDER_ITEM),
    itemController.updateItem
  )
  .delete(itemController.deleteItem);

module.exports = router;
