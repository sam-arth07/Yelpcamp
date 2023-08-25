const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require('../utils/catchAsync')
const passport = require("passport");
const {storeReturnTo} = require('../middleware')

router.get("/register", (req, res) => {
    res.render("user/register");
});

router.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email,username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,function (err) {
            if(err) return next(err)
            req.flash("success", "Welcome to Yelp Camp");
            res.redirect("/campgrounds");
        })
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('/register')
    }
}));

router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),async(req,res)=>{
    req.flash('success','Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout',(req,res,next)=>{
    req.logout(function (err) {
        if(err){
            return next(err)
        }
        req.flash('success','Sayonara! Mate ne')
        res.redirect('/campgrounds')
    })
    
    
})

module.exports = router;