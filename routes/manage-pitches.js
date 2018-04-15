const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');
const async = require("async");
const asyncLoop = require('node-async-loop');

const isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User " + req.user.username + " authenticated.");
        return next();
    } else {
        res.redirect('/unauthorised');
    }
};

module.exports = function(passport) {
    /* GET Edit Pitches Page */
    router.get('/pitch-management', isAuthenticated, function(req, res) {
        res.render('pitch-management', {title: "Pitch Management", username: req.user.username});
    });

    /* POST Get Pitches Data */
    router.post('/get-pitches', function(req, res) {
        let pitchInformationQuery = "SELECT * FROM pitch_bookings" +
            " INNER JOIN pitches ON pitch_bookings.pitch_id = pitches.pitch_id" +
            " INNER JOIN bookings ON pitch_bookings.booking_id = bookings.booking_id" +
            " INNER JOIN customers ON bookings.customer_id = customers.customer_id;";
        let pitchesQuery  = "SELECT * FROM pitches";
        async.waterfall([
            function(callback) {
                mysql.connection.query(pitchesQuery, function(err, rows) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            function(pitches, callback) {
                mysql.connection.query(pitchInformationQuery, function(err, rows) {
                    if (err) {
                        console.log(err);
                        callback(err, pitches, null);
                    } else {
                        callback(null, pitches, rows);
                    }
                });
            }
        ], function(err, pitches, pitchInformation) {
            res.status(200).send({pitches: pitches, info: pitchInformation});
        });
    });

    /* POST Edit Pitch */
    router.post('/edit-pitch', function(req, res) {
        console.log(req.body.name, req.body.type, req.body.price, req.body.availability, req.body.electrical, req.body.id);
        mysql.connection.query(
            "UPDATE pitches SET pitch_name = ?, type = ?, price = ?, available = ?, electrical = ? WHERE pitch_id = ?;",
            [req.body.name, req.body.type, req.body.price, req.body.availability, req.body.electrical, req.body.id],
            function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send("Successfully Updated Pitch " + req.body.id);
                }
            }
        );
    });

    /* POST Delete Pitch */
    router.post('/delete-pitch', function(req, res) {
        mysql.connection.query("DELETE FROM pitches WHERE pitch_id = ?", [req.body.id], function(err) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send("Successfully Deleted Pitch " + req.body.id);
            }
        });
    });

    /* POST Add Pitch */
    router.post('/add-pitch', function(req, res) {
        mysql.connection.query(
            "INSERT INTO pitches (type, available, price, electrical, pitch_name) VALUES (?, ?, ?, ?, ?)",
            [req.body.type, req.body.available, req.body.price, req.body.electrical, req.body.name],
            function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send("Successfully Added New Pitch");
                }
            }
        );
    });

    /* POST Get Seasonal Pricing */
    router.post('/season-pricing', function(req, res) {
        mysql.connection.query("SELECT * FROM seasons;", function(err, rows) {
            if (err) {
                console.log(err);
            }

            res.status(200).send(rows);
        });
    });

    /* POST Update Seasonal Pricing */
    router.post('/update-seasonal-pricing', function(req, res) {
        let seasons = req.body.val;
        console.log(seasons);
        asyncLoop(seasons, function (item, next) {
            mysql.connection.query("UPDATE seasons SET price_per_pitch = ? WHERE season_name = ?;", [parseFloat(item.val), item.type.toString()], function (err) {
                if (err) {
                    console.log("MySQL Error: " + err);
                } else {
                    next();
                }
            });
        }, function (err) {
            if (err) {
                console.log("Node Async Loop Error: " + err);
            } else {
                res.status(200).send("Successfully Updated Seasonal Pricing");
            }
        });

    });

    return router;
};