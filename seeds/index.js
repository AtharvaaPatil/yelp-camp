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
    for(let i = 0 ; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() *20) + 10;
        const camp = new Campground({
            author: '61fb933868a372dc48d75ea2',
            //Your user id
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude, ] },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/yelp-camp-atharva/image/upload/v1644085750/YelpCamp/e06sdmciheqxvl3aiwky.jpg',
                    filename: 'YelpCamp/e06sdmciheqxvl3aiwky'
                  },
                  {
                    url: 'https://res.cloudinary.com/yelp-camp-atharva/image/upload/v1644085750/YelpCamp/jcf3vzjqqtaxpx0culy3.jpg',
                    filename: 'YelpCamp/jcf3vzjqqtaxpx0culy3'
                  },
                  {
                    url: 'https://res.cloudinary.com/yelp-camp-atharva/image/upload/v1644085750/YelpCamp/go821mlevrjifelmbdy1.jpg',
                    filename: 'YelpCamp/go821mlevrjifelmbdy1'
                  }
            ],
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