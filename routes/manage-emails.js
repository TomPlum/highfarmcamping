const express = require('express');
const router = express.Router();
const mysql = require('../db/mysql');
const async = require("async");

const isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User " + req.user.username + " authenticated.");
        return next();
    } else {
        res.redirect('/unauthorised');
    }
};

module.exports = function(passport) {



    return router;
};