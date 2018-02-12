const express = require('express');
const router = express.Router();

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

module.exports = router;