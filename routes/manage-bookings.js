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

/* GET Booking History Page */
router.get('/booking-history', function(req, res) {
   res.render('booking-history', {title: "Booking History"});
});

// GET Booking Search Page
router.get('/show-booking', function(req, res) {
   res.render('show-booking', {title: "Show Booking Confirmation"});
});

//* POST Search Booking */
router.post('/get-booking', function(req, res) {
    let id = JSON.stringify(req.body["ID"]);
    let queryString = "SELECT pitches.pitch_id, pitches.type, customers.customer_id, customers.first_name, customers.last_name, customers.address_line_1, customers.address_line_2, customers.email_address, customers.home_phone_number, customers.mobile_phone_number, customers.registration, customers.date_of_birth, bookings.stay_start_date, bookings.stay_end_date, bookings.count_dogs, bookings.booking_id, bookings.payment_total, bookings.paid, bookings.payment_type, bookings.booking_date FROM pitch_bookings" +
        " INNER JOIN pitches ON pitch_bookings.pitch_id = pitches.pitch_id" +
        " INNER JOIN bookings ON pitch_bookings.booking_id = bookings.booking_id" +
        " INNER JOIN customers ON bookings.customer_id = customers.customer_id" +
        " WHERE bookings.booking_id ="+id+";";
    mysql.connection.query(
        queryString, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.send(rows);
        });
});

/* POST Booking Overview */
router.post('/get-booking-overview', function(req, res) {
    mysql.connection.query(
        "SELECT pitches.pitch_id, pitches.type, customers.first_name, customers.last_name, bookings.paid, bookings.stay_start_date, bookings.stay_end_date, bookings.payment_total, bookings.booking_id, bookings.booking_date FROM pitch_bookings " +
        "INNER JOIN pitches ON pitch_bookings.pitch_id = pitches.pitch_id " +
        "INNER JOIN bookings ON pitch_bookings.booking_id = bookings.booking_id " +
        "INNER JOIN customers ON bookings.customer_id = customers.customer_id " +
        "ORDER BY bookings.booking_id", (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});

/* POST Booking History */
router.post('/history', function(req, res) {
   mysql.connection.query(
       "SELECT * FROM pitch_bookings " +
       "INNER JOIN pitches ON pitch_bookings.pitch_id = pitches.pitch_id " +
       "INNER JOIN bookings ON pitch_bookings.booking_id = bookings.booking_id " +
       "INNER JOIN customers ON bookings.customer_id = customers.customer_id " +
       "ORDER BY bookings.booking_id", (err, rows) => {
       if (err) {
           console.log(err);
       }
       res.status(200).send(rows);
    });
});

module.exports = router;