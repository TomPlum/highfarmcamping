const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');

/* GET Overview Page */
router.get('/overview', function(req, res) {
   res.render("manage-booking", {title: "Booking Overview"});
});

/* GET Edit Booking Page */
router.get('/edit', function(req, res) {
   res.render("edit-booking", {title: "Edit a Booking"});
});

/* GET Delete Booking Page */
router.get('/delete', function(req, res) {
    res.render("delete-booking", {title: "Delete a Booking"});
});

/* POST Booking Overview */
router.post('/get-booking-overview', function(req, res) {
    mysql.connection.query(
        "SELECT pitches.pitch_id, pitches.type, customers.first_name, customers.last_name, bookings.paid, bookings.stay_start_date, bookings.stay_end_date FROM pitch_bookings " +
        "INNER JOIN pitches ON pitch_bookings.pitch_id = pitches.pitch_id " +
        "INNER JOIN bookings ON pitch_bookings.booking_id = bookings.booking_id " +
        "INNER JOIN customers ON bookings.customer_id = customers.customer_id " +
        "ORDER BY pitch_bookings.pitch_id", (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});

module.exports = router;