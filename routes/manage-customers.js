const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');


router.get('/add', function(req, res) {
    res.render("add-customer", {title: "Add a Customer"});
});

/* GET Edit Customer Page */
router.get('/edit', function(req, res) {
    res.render("edit-customer", {title: "Edit a Customer"});
});

/* GET Delete Customer Page */
router.get('/delete', function(req, res) {
    res.render("delete-customer", {title: "Delete a Customer"});
});

router.post('/getCustomer', function(req, res) {
    //+req.data.ID+
    let id = JSON.stringify(req.body["ID"]);
    let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";

    mysql.connection.query(sql_statement, function(err, rows) {
        res.send(rows);
    });
});

module.exports = router;