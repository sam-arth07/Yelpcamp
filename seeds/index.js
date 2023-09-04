const Campground = require("../models/Campground.js");
const mongoose = require("mongoose");
const { descriptors, places } = require("./seedHelpers.js");
const cities = require("./cities.js");

mongoose
    .connect("mongodb://localhost:27017/Yelp-Camp")
    .then(() => console.log("Mongo DB connection successful"))
    .catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const location = cities[random1000];
        const camp = new Campground({
            author: "64e22a7703554b94e955ba58",
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${location.city} ,${location.state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/doqqtrkyb/image/upload/v1693739219/YelpCamp/fknifyxeuqrdw9gyd6rv.webp',
                  filename: 'YelpCamp/fknifyxeuqrdw9gyd6rv',
                },
                {
                  url: 'https://res.cloudinary.com/doqqtrkyb/image/upload/v1693739220/YelpCamp/yhxifmutgxre88sdcmqv.jpg',
                  filename: 'YelpCamp/yhxifmutgxre88sdcmqv',
                },
                {
                  url: 'https://res.cloudinary.com/doqqtrkyb/image/upload/v1693739220/YelpCamp/myrep3vd7va2tfkracvu.jpg',
                  filename: 'YelpCamp/myrep3vd7va2tfkracvu',                }
              ],
            price,
            description:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae corrupti voluptatem tempora consectetur, praesentium temporibus nulla cum numquam delectus earum explicabo ea officiis rem architecto animi ipsum ex ad fugitQuibusdam possimus non, id, officia suscipit dolor corporis laudantium hic mollitia nobis excepturi veniam ex porro optio fuga. Amet, nulla? Nam, temporibus",
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
