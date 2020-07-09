const express = require('express');
const router = express.Router();
const _ = require('lodash');
var moment = require('moment');

const Meal = require('../models/meal');

//params: from_date, to_date
router.get('/getCaloriesByDate', (req, res, next) => {
    moment.locale();

    var query = require('url').parse(req.url,true).query;
    var from_date = query.from_date.split("-");
    var to_date = query.to_date.split("-");
    var user_id = query.user_id;

    var from_date2 = from_date[2] + "-" + from_date[1] + "-" + from_date[0];
    var to_date2 = to_date[2]+"-"+to_date[1]+"-"+to_date[0];
  
    var d = new Date(2020, 5, 20);
    // console.log(from_date2)

    // var mongo_query = Meal.find({"mealByUser.date": {$gte: from_date2, $lte: to_date2}});
    // mongo_query.select('mealByUser');
    // mongo_query.exec(function(err, response){
    //     if (err) return handleError(err);
    //     console.log(response.mealByUser);
    // });
    
    Meal.find({
        "mealByUser.date": {
            $gte: from_date2,
            $lte: to_date2
        },
        "mealByUser.userId": user_id
    },
    { 
        "mealByUser.date": 1,
        "mealByUser.nutritionFacts": 1,
        "_id": 0
    },
    {
        sort: 'mealByUser.date'
    }, 
    (err, meals) => {
        var caloriesByDate = [];
        var date;
        try {
        meals.forEach(meal => {
            // console.log(meal.mealByUser.date);
            calories = meal.mealByUser.nutritionFacts.totalCalories;
            proteins = meal.mealByUser.nutritionFacts.totalProteins;
            carbs = meal.mealByUser.nutritionFacts.totalCarbs;
            // console.log(meal.mealByUser.nutritionFacts.totalProteins);
            // console.log(JSON.stringify(meal.mealByUser));
            fats = meal.mealByUser.nutritionFacts.totalFats;

            date =  moment(meal.mealByUser.date).locale("ro").format('l');
            var foundIndex = caloriesByDate.findIndex(x => x.date.localeCompare(date)==0);
            if (foundIndex > -1) {
                caloriesByDate[foundIndex]["total-calories"] += calories;
                caloriesByDate[foundIndex]["total-proteins"] += proteins;
                caloriesByDate[foundIndex]["total-carbs"] += carbs;
                caloriesByDate[foundIndex]["total-fats"] += fats;
            }
             else {
                caloriesByDate.push(
                    {
                        "date": date,
                        "total-calories": calories,
                        "total-proteins": proteins,
                        "total-carbs": carbs,
                        "total-fats": fats
                    }
                );

            }
        });
        res.send(caloriesByDate);
    } catch(e) {
        console.log("no dates for range selection");
    }
    });
});

module.exports = router;