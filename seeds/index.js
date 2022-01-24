const mongoose = require('mongoose');
const Campground = require('../models/campground');
const{places, descriptors} = require('./seedHelpers')
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connected")
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0 ; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() *20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in dolor metus. Nullam finibus sed mi eget iaculis. Integer congue euismod hendrerit. Sed vel sapien id nisl facilisis ullamcorper vel eget ligula. Phasellus bibendum turpis aliquet neque pharetra interdum. Nullam efficitur tellus nunc, a varius metus bibendum at. Mauris in imperdiet eros, vitae pellentesque risus. Mauris justo risus, placerat vitae sollicitudin non, mollis non mauris.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})

//This file we run seperately from our app only when we make changes to the database or model