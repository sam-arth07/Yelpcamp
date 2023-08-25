const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/Campground.js");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router.get(
    "/",
    catchAsync(async (req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash("success", "Successfully created a new Campground!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const camp = await Campground.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("author");
        console.log(camp);
        if (!camp) {
            req.flash("error", "Cannot find the requested Campground!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { camp });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        if (!camp) {
            req.flash("error", "Cannot find the requested Campground!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { camp });
    })
);
router.put(
    "/:id",
    validateCampground,
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        req.flash("success", "Successfully updated the Campground!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully deleted the Campground!");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
