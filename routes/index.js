const express = require('express');
const router = express.Router();

/* GET Home Page */
router.get('/', function(req, res) {
    res.render('dashboard', {title: 'Dashboard'});
});

/* GET Pitch Booking Page */
router.get('/book', function(req, res) {
   res.render('booking', {title: 'Book a Pitch'});
});

module.exports = router;