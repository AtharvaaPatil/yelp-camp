const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})
//This should be before the later one because it will hit the id route and wont find anything and we don't want that
router.post('/', validateCampground, catchAsync(async (req, res, next) => {    
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success', 'Successfully created a new campground')
        res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
         return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}));

// router.get('/makecampground', catchAsync(async (req, res) => {
//     const camp = new Campground({
//         title: 'My yard',
//         description: 'nice camping'
//     })
//     await camp.save();
//     res.send(camp);
// }));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
         return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', catchAsync(async(req, res) => {
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground')
    res.redirect('/campgrounds')
}));

module.exports = router;