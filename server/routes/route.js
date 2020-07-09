const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const _ = require('lodash');
var moment = require('moment');

const jwtHelper = require('../config/jwtHelper');

const User = require('../models/user');
const PersonalDetails = require('../models/personalDetails');
const Food = require('../models/food');
const Meal = require('../models/meal');
const UserNutritionData = require('../models/userNutritionData');

router.get('/users', (req, res, next)=>{
    User.find(function(err, users){
        res.json(users);
    });
    // res.send('Retrieving the user list');
    // res.end();
});

//add user
router.post('/register', (req, res, next)=>{

    var noUsers;
    User.countDocuments({ }, function (err, count) {
        if (err) {
            console.log(err);
        } else {
            if(count == 0) {
                noUsers = true;
            } else {
                noUsers = false;
            } 
        }
        var newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            role: noUsers == false ? 'user' : 'admin'
        });
        
        newUser.save((err, user)=>{
            if (!err) {
                res.send(user);
            } else {
                //if email already exists - 11000 code 
                if(err.code == 11000){
                    res.status(422).send(['Duplicate email address found.']);
                } else {
                    return next(err);
            }
        }
        });
    });
});

router.post('/authenticate', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        //error from passport middleware
        if(err) {
            return res.status(400).json(err);
        } else if (user) {
            return res.status(200).json({ "token": user.generateJwt() });
        } else {
            return res.status(404).json(info);
        }
    })(req, res);
});

router.post('/personalDetails', (req, res, next) => {

    var personalDetails = new PersonalDetails({
        user: req.body.user,
        goal: req.body.goal,
        age: req.body.age,
        gender: req.body.gender,
        height: req.body.height,
        current_weight: req.body.current_weight,
        desired_weight: req.body.desired_weight,
        activity_level: req.body.activity_level
    });
    
    personalDetails.save((err, details)=>{
        if(!err){
            // res.send(personalDetails);
            res.send(details);
            // console.log(req.body);
        } else {
            console.log(err);
            return err;
        }
    });
});

router.post('/addFood', (req, res, next) => {

    var food = new Food({
        name: req.body.name || '',
        quantity: req.body.quantity,
        unit: req.body.unit,
        calories: req.body.kcal,
        proteins: req.body.proteins,
        carbs: req.body.carbs,
        fats: req.body.fats,
        addedBy: req.body.addedBy,
    });

    food.save((err, foodAdded) => {
        if(!err) {
            res.send(foodAdded);
        } else {
            console.log(err);
            return err;
        }
    });
});

router.post('/addMeal', (req, res, next) => {
    mealByUser = req.body;

    var data = req.body.date.split("-");
    var day = data[0];
    var month = data[1];
    var year = data[2];

    mealByUser.date = year+"-"+month+"-"+day;

    if(mealByUser.food.length == 0) {
        Meal.deleteOne({
            "mealByUser.type": mealByUser.type,
            "mealByUser.date": mealByUser.date,
            "mealByUser.userId": mealByUser.userId
        }, (err, succ) => {
            // console.log(err);
            if(succ){
                // console.log("NEW DATE" + succ);
            } else {
                console.log(err);
            }
            
        })

    } else {
    Meal.findOneAndUpdate({
        "mealByUser.type": mealByUser.type,
        "mealByUser.date": mealByUser.date,
        "mealByUser.userId": mealByUser.userId
    },
    {
        $set: {
            "mealByUser.nutritionFacts.totalCalories": mealByUser.nutritionFacts.totalCalories,
            "mealByUser.nutritionFacts.totalProteins": mealByUser.nutritionFacts.totalProteins,
            "mealByUser.nutritionFacts.totalCarbs": mealByUser.nutritionFacts.totalCarbs,
            "mealByUser.nutritionFacts.totalFats": mealByUser.nutritionFacts.totalFats,
            "mealByUser.food": mealByUser.food
        }
    },
        (err, succ) => {
        if(succ){

            console.log("UPDATAT CU SUCCES");
        } else {
            console.log("NU L AM GASIT, IL ADAUG");
            console.log(mealByUser);
            //daca nu a gasit mealul in db, adauga-l
            var meal = new Meal({mealByUser});
            meal.save((err, mealByUserAdded) => {
            if(!err) {
            // console.log("res");
           
            res.send(mealByUserAdded);
            console.log("MEAL ADDED");
            } else {
                console.log(err);
                return err;
        }} );
    
        }
    });
}
});

router.post('/addUserNutritionData', (req, res, next) => {
    // console.log(req.body);

    var userNutritionData = new UserNutritionData(req.body);
    userNutritionData.save((err, succ) => {
        if(err) {
            console.log(err);
        } else {
            console.log(succ);
            res.send(userNutritionData);
        }
    });
});

router.get('/userProfile', jwtHelper.verifyJwtToken, (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            // console.log(req._id);
            if (!user) {
                return res.status(404).json({ status: false, message: 'User record not found.' });
            } else {
                return res.status(200).json({ status: true, user: _.pick(user, ['_id', 'first_name', 'last_name', 'email', 'role']) });
            }
        });
});

router.get('/userProfileId',  jwtHelper.verifyJwtToken, (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user) {
                return res.status(404).json({ status: false, message: 'User record not found.' });
            } else {
                return res.status(200).json({ status: true, user: _.pick(user, ['_id']) });
            }
        });
});

router.get('/userPersonalDetails', jwtHelper.verifyJwtToken, (req, res, next) => {
    //req._id => user logged in id
    PersonalDetails.findOne({user: req._id},
        (err, personalDetails) => {
            if(personalDetails) {
                return res.status(200).json({ status: true, personalDetails });
            } else {
                console.log("no data");
                //return res.status(404).json({ status: false, message: "Record not found for logged in user." });
            }
        });
        
    // console.log(req.body);
    //PersonalDetails.findOne({ user: req._})
});

router.get('/getAllFood', (req, res, next) => {
    Food.find({}, function(err, food) {
        if(err) {
            console.log(err);
        } else {
            res.send(food);
        }
    });

});


//params: date, userId
router.get('/getMealsByDate', async (req, res, next) => {
    var query = require('url').parse(req.url,true).query;
    
    var data = query.date.split("-");
    var day = data[0];
    var month = data[1];
    var year = data[2];
    var date = data[2] + "-" + month + "-" + day;

    var userIdFromParam = query.userId;

    var meals = await Meal.find({
        "mealByUser.date": date,
        "mealByUser.userId": userIdFromParam
    }, function(err, response) {
        if(response) {
            // response.forEach(meal => {
            //     meal.mealByUser.date = moment(meal.mealByUser.date).format('l');
            //     console.log(moment(meal.mealByUser.date).format('l'));
            // })
            // console.log(response);
            res.send(response);
            
        } else {
            console.log(err);
            res.json({error: err});
        }
    });
    // res.send(meals);
});

router.get('/getUserNutritionData', (req, res, next) => {
    var query = require('url').parse(req.url,true).query;
    var userId = query.userId;

    var userNutritionData = UserNutritionData.find({
        "userId": userId
    }, function(err, response) {
        if(response) {
            res.send(response);
            // console.log(response);
        } else {
            res.send(err);
        }
    })

});

router.get('/getAllUsers', (req, res, next) => {

    User.find(function(err, users){
        res.json(users);
    });
});

router.post('/updateUserNutritionData', (req, res, next) => {

    // console.log(req.body);
    var data = req.body;
    UserNutritionData.findOneAndUpdate({
        'userId': req.body.userId
    }, {
        $set: {
            'dailyNutritionGoals': req.body.dailyNutritionGoals,
            'nutritionByMeal': req.body.nutritionByMeal,
            'dateUpdated': req.body.dateUpdated
        }
        
    }, (err, res) => {
        // UserNutritionData.save(req);
        if (res) {
            console.log(res);
            // console.log(userId);
        } else {
            console.log(err);
        }
    });


});


module.exports = router;