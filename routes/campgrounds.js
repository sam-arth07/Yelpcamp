const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        upload.array("image"),
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(
        validateCampground,
        isLoggedIn,
        isAuthor,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
