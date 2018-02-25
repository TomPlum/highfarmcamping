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
/*GET customer-searchform */
router.get('/searchcustomer', function(req, res) {
    res.render('searchcustomer', {title: "Search Customer"});
});
/*GET customer-addform */
router.get('/addcustomer', function(req, res) {
    res.render('addcustomer', {title: "Add Customer"});
});

/*GET Edit Customer Page */
router.get('/edit-customer', function(req, res) {
    res.render('editcustomer', {title: "Edit Customer"});
});

/* GET customer-deleteform */
router.get('/deletecustomer', function(req, res) {
    res.render('deletecustomer', {title: "Delete a Customer"});
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
router.post('/delete-customer', function(req, res) {
    //+req.data.ID+
    let id = JSON.stringify(req.body["ID"]);
    //let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";
    let sql_statement = "DELETE FROM customers WHERE customer_id="+id+";";
    mysql.connection.query(sql_statement, function(err, rows) {
        res.send();
        console.log(err);
    });
});

//POST DB Query of add / edit customer
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