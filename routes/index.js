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

/* GET Customer Overview Page */
router.get('/customer-overview', function(req, res) {
    res.render('customer-overview', {title: "Customer Overview"});
});

/* GET Add Customer Page  */
router.get('/add-customer', function(req, res) {
    res.render('addcustomer', {title: "Add Customer"});
});

/* GET Search Customer Page */
router.get('/searchcustomer', function(req, res) {
    res.render('searchcustomer', {title: "Search Customer"});
});

/* GET Edit Customer Page */
router.get('/edit-customer', function(req, res) {
    res.render('editcustomer', {title: "Edit Customer"});
});

/* GET Delete Customer Page */
router.get('/delete-customer', function(req, res) {
    res.render('delete-customer', {title: "Delete a Customer"});
});

/* POST Redirect */
router.post('/redirect', function(req, res) {
    console.log(req.body.uri);
    res.status(302).redirect(req.body.uri);
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

//POST DB Query of the Customer-Overview
router.post('/get-PitchBookings', function(req, res) {
    mysql.connection.query("select pitch_bookings.*, bookings.* from bookings INNER JOIN pitch_bookings on bookings.booking_id = pitch_bookings.booking_id;", function(err, rows) {
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    });
});

//POST DB Query of the Customer-Overview
router.post('/get-pitches', function(req, res) {
    mysql.connection.query("SELECT * FROM pitches ", function(err, rows) {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.send(rows);
        }
    });
});

//POST DB Query to get all Bookings
router.post('/get-bookings', function(req, res) {
    mysql.connection.query("SELECT * FROM bookings ", function(err, rows) {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.send(rows);
        }
    });
});

// POST DB Query for getting single customer for delete customer
router.post('/get-customer', function(req, res) {
    //+req.data.ID+
    let id = JSON.stringify(req.body["ID"]);
    //let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";
    let sql_statement = "SELECT * FROM customers WHERE customer_id="+id+";";
    mysql.connection.query(sql_statement, function(err, rows) {
        res.send(rows);
    });
});

// POST DB Query for deleting customer
router.post('/delete-single-customer', function(req, res) {
    //+req.data.ID+
    let id = JSON.stringify(req.body["ID"]);
    //let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";
    let sqlStatement = "DELETE FROM customers WHERE customer_id=" + id + ";";

        mysql.connection.query(sqlStatement, function (err) {
            console.log("THIS IS OUR" + err);
            res.send(err);
        });
});

// GENERAL DB UPDATE/ INSERT QUERY / HTTP POST Request. CAN BE USED FOR ALL KIND OF SQL UPDATE OR INSERT Statements!
router.post('/db-query', function(req, res) {
    console.log(req.body.query);
    mysql.connection.query(req.body.query, function(err){
        //console.log("GENERAL DB-QUERY ERROR: " + err);
        res.send(err);
    });
});


//DB Query for booking a pitch
router.post('/db-query-booking', function(req, res) {
    console.log(req.body.query);
    mysql.connection.query(req.body.query, function(err, rows) {
        if (!err) {
            res.send([200, rows.insertId]);
        } else {
            res.send(err);
        }
    });
});

// General SELECT db query:

router.post('/select-db-query', function(req, res) {
    console.log(req.body.query);
    //let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";
    mysql.connection.query(req.body.query, function(err, rows) {
        res.send(rows);

    });
});

//POST DB Query of add / edit customer
router.post('/insert-customer', function(req, res) {
    console.log(req.body.query);
    let insertedId;
    mysql.connection.query(req.body.query, function(err,rows){
        console.log(err);
        console.log(rows);
        insertedId = rows.insertId;
        if(!err){
            res.send([200,insertedId]);
        }

    });

});

module.exports = router;