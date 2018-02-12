const express = require('express');
const router = express.Router();

/* GET Overview Page */
router.get('/overview', function(req, res) {
   res.render("manage-booking", {title: "Booking Overview"});
});

module.exports = router;