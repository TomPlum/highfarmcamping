const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');

/* GET Home Page */
router.get('/', function(req, res) {
    mysql.connection.query("SELECT * FROM test", (err, rows, fields) => {
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

module.exports = router;