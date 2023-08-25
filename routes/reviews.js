const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review.js");
const Campground = require("../models/Campground.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
    "/",
    isLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        review.author = req.user._id;
        await review.save();
        await campground.save();
        req.flash("success", "Created new review!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Successfully deleted review");
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;
