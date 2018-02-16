const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');

/* GET Home Page */
router.get('/', function(req, res) {
    mysql.connection.query("SELECT * FROM bookings", (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        console.log(rows);
        console.log(fields);

    });
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

/*GET Test Page*/
router.get('/test', function(req, res) {
    res.render('test', {title: "Testing page"});
});

//POST DB Querie of the Customer-Overview
//Maybe need to create a common solution for such queries
router.post('/test-db', function(req, res) {
    mysql.connection.query("SELECT  * FROM customers JOIN address JOIN customers_addresses  WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id;", function(err, rows) {
        res.send(rows);
    });
});

/*GET customer-overview */
router.get('/customer-overview', function(req, res) {
        res.render('customer-overview', {title: "Customer Overview"});
});

/* POST Test page */
router.post('/send-to-database', function(req, res) {
   let test_field = req.body.test_field;
   let values = [
       ['Tom'],
       ['Vincent'],
       ['Flo'],
       ['Jack']
   ];
   mysql.connection.query("INSERT INTO test (test_field) VALUES ?", [values], function(err, result) {
       if (err) {
           console.log(err);
       } else {
           console.log("Affected " + result.affectedRows + " rows.");
       }
   });
});

function createSqlString(dbname, columns, data) {
    return mysql.connection.query("INSERT INTO ? (?) VALUES ?", [dbname, columns, data], function(err, result) {

    });
}

module.exports = router;