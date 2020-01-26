module.exports = {

    // GET HOME PAGE
    getHomePage: (req, res) => {
        let query = 'SELECT * FROM restaurants';

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.render('getHomePage', {
                restaurants: result,
                name: req.user.name
            });
        });
    },

    // GET ADD RESTAURANT PAGE
    getAddPage: (req, res) => {
        res.render('getAddPage', {
            name: req.user.name
        });
    },

    // ADD RESTAURANT
    addRestaurant: (req, res) => {
        let restaurantName = req.body.restaurant_name;
        let restaurantCity = req.body.restaurant_city;
        let restaurantAddress = req.body.restaurant_address;
        let restaurantRating = req.body.restaurant_rating;      
        
        let query = "INSERT INTO restaurants (restaurant_name, restaurant_city, restaurant_address, restaurant_rating)" +
        "VALUES ('" + restaurantName + "', '" + restaurantCity + "', '" + restaurantAddress + "', '" + restaurantRating + "')";

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/restaurant')
        });
    },

    // GET EDIT RESTAURANT PAGE
    getEditPage: (req, res) => {
        let restaurantId = req.params.id;
        let query = `SELECT * FROM restaurants WHERE restaurant_id = ${restaurantId}`;

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.render('getEditPage', {
                // [0] to get the input fields in the form filled
                restaurants: result[0],
                name: req.user.name
            });
        });
    },

    // UPDATE RESTAURANT
    updateRestaurant: (req, res) => {
        let restaurantId = req.params.id;
        let restaurantName = req.body.restaurant_name;
        let restaurantAddress = req.body.restaurant_address;
        let restaurantCity = req.body.restaurant_city;
        let restaurantRating = req.body.restaurant_rating;

        let query = `UPDATE restaurants 
        SET restaurant_name = '${restaurantName}', restaurant_address = '${restaurantAddress}', 
        restaurant_city = '${restaurantCity}', restaurant_rating = '${restaurantRating}' 
        WHERE restaurant_id = ${restaurantId}`;
        
        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/restaurant');
        });
    },

    // DELETE RESTAURANT
    deleteRestaurant: (req, res) => {
        let restaurantId = req.params.id;
        let query = `DELETE FROM restaurants WHERE restaurant_id = ${restaurantId}`;

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/restaurant');
        });
    },

    // GET REVIEW PAGE
    getReviewPage: (req, res) => {
        let restaurantId = req.params.id;
        let query = `SELECT * FROM reviews WHERE restaurant_id = ${restaurantId}`;

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.render('getReviewPage', {
                reviews: result,
                name: req.user.name
            });
        });
    },

    // ADD REVIEW 
    addReview: (req, res) => {
        let userId = req.user.id;
        let userName = req.user.name;
        let review = req.body.review;
        let restaurantId = req.params.id;

        let query = `INSERT INTO reviews (user_id, user_name, review, restaurant_id) 
        VALUES ('${userId}', '${userName}', '${review}', '${restaurantId}')`;

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.redirect(`/restaurant/review/${restaurantId}`);
        });
    }
}