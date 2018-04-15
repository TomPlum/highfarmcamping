const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const async = require('async');

const isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User " + req.user.username + " authenticated.");
        return next();
    } else {
        res.redirect('/unauthorised');
    }
};

module.exports = function(passport) {

    /* GET Overview Page */
    router.get('/overview', isAuthenticated, function(req, res) {
        res.render("manage-booking", {title: "Booking Overview", username: req.user.username});
    });

    /* GET Edit Booking Page */
    router.get('/edit', isAuthenticated, function(req, res) {
        res.render("edit-booking", {title: "Edit a Booking", username: req.user.username});
    });

    /* GET Delete Booking Page */
    router.get('/delete', isAuthenticated, function(req, res) {
        res.render("delete-booking", {title: "Delete a Booking", username: req.user.username});
    });

    /* GET Booking History Page */
    router.get('/booking-history', isAuthenticated, function(req, res) {
        res.render('booking-history', {title: "Booking History", username: req.user.username});
    });

// GET Booking Search Page
    router.get('/show-booking', isAuthenticated, function(req, res) {
        res.render('show-booking', {title: "Show Booking Confirmation", username: req.user.username});
    });

//* POST Search Booking */
    router.post('/get-booking', isAuthenticated, function(req, res) {
        let id = req.body.ID;
        let queryString = "SELECT pitches.pitch_id, pitches.pitch_name,  pitches.type, customers.customer_id, customers.first_name, customers.last_name, customers.address_line_1, customers.address_line_2, customers.email_address, customers.home_phone_number, customers.mobile_phone_number, customers.registration, customers.date_of_birth, bookings.stay_start_date, bookings.stay_end_date, bookings.count_dogs, bookings.booking_id, bookings.payment_total, bookings.paid, bookings.payment_type, bookings.booking_date FROM pitch_bookings" +
            " INNER JOIN pitches ON pitch_bookings.pitch_id = pitches.pitch_id" +
            " INNER JOIN bookings ON pitch_bookings.booking_id = bookings.booking_id" +
            " INNER JOIN customers ON bookings.customer_id = customers.customer_id" +
            " WHERE bookings.booking_id =" + id + ";";
        mysql.connection.query(
            queryString, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                res.status(200).send(rows);
            });
    });

// POST DB Query for getting single customer for delete customer -- ? IS THAT CORRECT?
    router.post('/send-booking-confirmation', isAuthenticated, function (req, res) {
        let sql_statement = "SELECT customers.email_address, customers.first_name, customers.last_name, customers.registration, " +
            "customers.mobile_phone_number, bookings.booking_duration, bookings.payment_total " +
            "FROM customers WHERE customer_id='1' " +
            "INNER JOIN customers ON bookings.customer_id = customers.customer_id;";
        async.waterfall([
            function(callback) {
                mysql.connection.query(sql_statement, function (err, rows) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            function(email, callback) {
                const customerEmail = email[0].email_address;
                const emailText = 'Hello ' + email[0].first_name + ' ' + email[0].last_name + '. Thanks ' +
                    'for choosing Highfarm Campsites! This is your booking confirmation: Your ' +
                    'registration number: ' + email[0].registration + ", your mobile: " + email[0].mobile_phone_number + ', ' +
                    'your booking date: ' + formatDate(email[0].booking_duration) + ', payment total: ' + (email[0].payment_total).toFixed(2) +
                    ', number of dogs: ';

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'highfarm.campsites@gmail.com',
                        clientId: '211967510289-m2if3f96pcrauqp26s9q9pbc5njni23l.apps.googleusercontent.com',
                        clientSecret: 'UI3d-NQTmGPkEQCx1vTYtPFC',
                        refreshToken: '1/GFMjz4NXVjrTt09mDhKct7GH6bjEaO7AfaDoDB_OtlM',
                        accessToken: 'ya29.GluYBev-3ScBR8waQNph75piaCzUAFRwCVQagfv7m6hoXzoxOoeGqs1rCSCbsdmFOWZ2wseU8eCHMoIKIIWFywEU8g4j88MHl-nQ0rXkiriuMmiqCVydyYOsmqZv',
                    },
                });

                let mailOptions = {
                    from: 'High Farm Campsites <highfarm.campsites@gmail.com>',
                    to: customerEmail,
                    subject: 'Your Booking confirmation',
                    text: emailText
                };

                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, "Successfully Sent Email To: " + customerEmail);
                    }
                });
            }
        ], function(err, success) {
            if (err) {
                console.log(err);
            }
            res.status(200).send(success);
        });

    });

    /* POST Booking Overview */
    router.post('/get-booking-overview', isAuthenticated, function(req, res) {
        mysql.connection.query(
            "SELECT pitches.pitch_id, pitches.pitch_name, pitches.type, customers.first_name, customers.last_name, bookings.paid, bookings.stay_start_date, bookings.stay_end_date, bookings.payment_total, bookings.booking_id, bookings.booking_date FROM pitch_bookings " +
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

    /* POST Delete Booking */
    router.post('/delete-single-booking', isAuthenticated, function(req, res) {
        let id = req.body.ID;

        async.waterfall([
            function(callback) {
                mysql.connection.query("DELETE FROM pitch_bookings WHERE booking_id=" + id + ";", (err) => {
                    if (err) {
                        callback(err, null);
                    }
                    callback(null, "Success");
                });
            },
            function(pitch_booking, callback) {
                mysql.connection.query("DELETE FROM bookings WHERE booking_id=" + id + ";", (err) => {
                    if (err) {
                        callback(pitch_booking, err);
                    }
                    callback(pitch_booking, "Success");
                });
            }
        ], function(pitch_booking, booking) {
            if (pitch_booking === "Success" && booking === "Success") {
                res.status(200).send(booking);
            } else if (pitch_booking !== "Success") {
                res.status(500).send(pitch_booking);
            } else {
                res.status(500).send(booking);
            }
        });
    });

    /* POST Booking History */
    router.post('/history', isAuthenticated, function(req, res) {
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

    return router;
};
