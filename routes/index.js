const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');

/*************************************/
/* --- Get Pages --------------------*/
/*************************************/

/* GET Home Page */
router.get('/', function(req, res) {
    res.render('dashboard', {title: 'Dashboard'});
});

/* GET Pitch Booking Page */
router.get('/book', function(req, res) {
   res.render('booking', {title: 'Book a Pitch'});
});

/* GET Help Page */
router.get('/help', function(req, res) {
    res.render('help', {title: 'Information'});
});

/*GET Customer Overview Page */
router.get('/customer-overview', function(req, res) {
    res.render('customer-overview', {title: "Customer Overview"});
});

/*GET Add Customer Page  */
router.get('/add-customer', function(req, res) {
    res.render('addcustomer', {title: "Add Customer"});
});

/*GET Edit Customer Page */
router.get('/edit-customer', function(req, res) {
    res.render('editcustomer', {title: "Edit Customer"});
});

/*************************************/
/* --- Post DB Access ---------------*/
/*************************************/

//POST DB Query of the Customer-Overview
router.post('/get-customers', function(req, res) {
    mysql.connection.query("SELECT  * FROM customers ORDER BY customer_id;", function(err, rows) {
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    });
});

//POST DB Query of add customer
router.post('/insert-customer', function(req, res) {
    console.log(req.body.query);
    mysql.connection.query(req.body.query, function(err,rows){
        res.send();
        console.log(err);
    });
});

function createSqlString(dbname, columns, data) {
    return mysql.connection.query("INSERT INTO ? (?) VALUES ?", [dbname, columns, data], function(err, result) {

    });
}

module.exports = router;