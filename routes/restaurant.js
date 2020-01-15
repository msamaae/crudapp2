module.exports = {

    // GET HOME PAGE
    getHomePage: (req, res) => {
        let query = 'SELECT * FROM restaurants';

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.render('getHomePage', {
                restaurants: result
            });
        });
    },

    // GET ADD RESTAURANT PAGE
    getAddRestaurantPage: (req, res) => {
        res.render('getAddRestaurantPage');
    },

    // ADD RESTAURANT
    addRestaurant: (req, res) => {
        let restaurantName = req.body.restaurant_name;
        let restaurantCity = req.body.restaurant_city;
        let restaurantAddress = req.body.restaurant_address;
        let restaurantRating = req.body.restaurant_rating;      
        
       /*  let query = 'INSERT INTO restaurants (restaurant_name, restaurant_city, restaurant_address, restaurant_rating)' +
        'VALUES' ('" + restaurant_name + "', '" + restaurant_adress + "', '" + restaurant_city + "')"; */

        let query = "INSERT INTO restaurants (restaurant_name, restaurant_city, restaurant_address, restaurant_rating)" +
        "VALUES ('" + restaurantName + "', '" + restaurantCity + "', '" + restaurantAddress + "', '" + restaurantRating + "')";

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/')
        });
    },

    // GET EDIT RESTAURANT PAGE
    getEditRestaurantPage: (req, res) => {
        let restaurantId = req.params.id;
        let query = `SELECT * FROM restaurants WHERE restaurant_id = ${restaurantId}`;

        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.render('getEditRestaurantPage', {
                // [0] to get the input fields filled
                restaurants: result[0]
            });
        });
    },

    // UPDATE RESTAURANT
    updateRestaurant: (req, res) => {
        let restaurantId = req.params.id;
        let restaurantName = req.body.restaurant_name;
        let restaurantAddress = req.body.restaurant_address;
        let restaurantCity = req.body.restaurant_city;

        let query = `UPDATE restaurants 
        SET restaurant_name = '${restaurantName}', restaurant_address = '${restaurantAddress}', restaurant_city = '${restaurantCity}' 
        WHERE restaurant_id = ${restaurantId}`;
        
        db.query(query, (err, result) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/');
        })
    },

    // DELETE RESTAURANT
}