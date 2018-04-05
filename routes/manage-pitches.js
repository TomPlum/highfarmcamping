const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');

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
    router.get('/overview', isAuthenticated, function(req, res) {
        res.render('edit-pitch', {title: "Pitch Management", username: req.user.username});
    });

    /* POST Get Pitches Data */
    router.post('/get-pitches', function(req, res) {
        mysql.connection.query("SELECT * FROM pitches", function(err, rows) {
            if (err) {console.log(err);}

            res.status(200).send(rows);
        });
    });

    /* POST Edit Pitch */
    router.post('/edit-pitch', function(req, res) {
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

    return router;
};