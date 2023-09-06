const Campground = require("../models/Campground.js");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfully created a new Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampgrounds = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author");
    if (!camp) {
        req.flash("error", "Cannot find the requested Campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash("error", "Cannot find the requested Campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const imgs = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    await campground.save();
    req.flash("success", "Successfully updated the Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted the Campground!");
    res.redirect("/campgrounds");
};
