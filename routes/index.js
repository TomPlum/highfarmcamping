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

/*************************************/
/* --- Get Pages --------------------*/
/*************************************/

module.exports = function(passport) {
    /* GET Home Page */
    router.get('/dashboard', isAuthenticated, function (req, res) {
        res.render('dashboard', {title: 'Dashboard', username: req.user.username});
    });

    /* GET Pitch Booking Page */
    router.get('/book', isAuthenticated, function (req, res) {
        res.render('booking', {title: 'Book a Pitch'});
    });

    /* GET Help Page */
    router.get('/help', isAuthenticated, function (req, res) {
        res.render('help', {title: 'Information'});
    });

    /* GET Customer Overview Page */
    router.get('/customer-overview', isAuthenticated, function (req, res) {
        res.render('customer-overview', {title: "Customer Overview"});
    });

    /* GET Add Customer Page  */
    router.get('/add-customer', isAuthenticated, function (req, res) {
        res.render('addcustomer', {title: "Add Customer"});
    });

    /* GET Search Customer Page */
    router.get('/searchcustomer', isAuthenticated, function (req, res) {
        res.render('searchcustomer', {title: "Search Customer"});
    });

    /* GET Edit Customer Page */
    router.get('/edit-customer', isAuthenticated, function (req, res) {
        res.render('editcustomer', {title: "Edit Customer"});
    });

    /* GET Delete Customer Page */
    router.get('/delete-customer', isAuthenticated, function (req, res) {
        res.render('delete-customer', {title: "Delete a Customer"});
    });

    /* GET Unauthorised Page */
    router.get('/unauthorised', function (req, res) {
        res.render('unauthorised', {title: "Unauthorised."});
    });

    /* GET Login Page */
    router.get('/', function (req, res) {
        res.render('login', {title: "Login"});
    });

    /* POST Login Page */
    router.post('/authenticate', passport.authenticate('login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /*
    router.post('/authenticate', function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
            console.log("authenticate");
            console.log(err);
            console.log(user);
            console.log(info);
        })(req, res, next);
    });
    */

    /* Handle Logout */
    router.get('/logout', isAuthenticated, function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    //POST DB Query of the Customer-Overview
    router.post('/get-customers', isAuthenticated, function (req, res) {
        mysql.connection.query("SELECT  * FROM customers ORDER BY customer_id;", function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });
    });

//POST DB Query of the Customer-Overview
    router.post('/get-PitchBookings', isAuthenticated, function (req, res) {
        mysql.connection.query("select pitch_bookings.*, bookings.* from bookings INNER JOIN pitch_bookings on bookings.booking_id = pitch_bookings.booking_id;", function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });
    });

//POST DB Query of the Customer-Overview
    router.post('/get-pitches', isAuthenticated, function (req, res) {
        mysql.connection.query("SELECT * FROM pitches ", function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });
    });

//POST DB Query to get all Bookings
    router.post('/get-bookings', isAuthenticated, function (req, res) {
        mysql.connection.query("SELECT * FROM bookings ", function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                console.log(rows);
                res.send(rows);
            }
        });
    });

// POST DB Query for getting single customer for delete customer
    router.post('/get-customer', isAuthenticated, function (req, res) {
        //+req.data.ID+
        let id = JSON.stringify(req.body["ID"]);
        //let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";
        let sql_statement = "SELECT * FROM customers WHERE customer_id=" + id + ";";
        mysql.connection.query(sql_statement, function (err, rows) {
            res.send(rows);
        });
    });

// POST DB Query for deleting customer
    router.post('/delete-single-customer', isAuthenticated, function (req, res) {
        //+req.data.ID+
        let id = JSON.stringify(req.body["ID"]);
        //let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";
        let sqlStatement = "DELETE FROM customers WHERE customer_id=" + id + ";";

        mysql.connection.query(sqlStatement, function (err) {
            console.log("THIS IS OUR" + err);
            res.send(err);
        });
    });

// GENERAL DB UPDATE/ INSERT QUERY / HTTP POST Request. CAN BE USED FOR ALL KIND OF SQL UPDATE OR INSERT Statements!
    router.post('/db-query', isAuthenticated, function (req, res) {
        console.log(req.body.query);
        mysql.connection.query(req.body.query, function (err) {
            //console.log("GENERAL DB-QUERY ERROR: " + err);
            res.send(err);
        });
    });

// General SELECT db query:
    router.post('/select-db-query', isAuthenticated, function (req, res) {
        console.log(req.body.query);
        //let sql_statement = "SELECT * FROM customers JOIN address JOIN customers_addresses WHERE customers.customer_id = customers_addresses.customer_id AND address.address_id = customers_addresses.address_id AND customers.customer_id="+id+";";
        mysql.connection.query(req.body.query, function (err, rows) {
            res.send(rows);

        });
    });

//POST DB Query of add / edit customer
    router.post('/insert-customer', isAuthenticated, function (req, res) {
        console.log(req.body.query);
        let insertedId;
        mysql.connection.query(req.body.query, function (err, rows) {
            console.log(err);
            console.log(rows);
            insertedId = rows.insertId;
            if (!err) {
                res.send([200, insertedId]);
            }

        });

    });

    /*************************************/
    /* --- Queries for book a pitch -----*/
    /*************************************/

//DB Query for booking a pitch
    router.post('/db-query-booking', isAuthenticated, function (req, res) {
        let data = req.body.data;
        let bookingIdReturnValue;

        book();

        function book() {
            async.waterfall([
                insertOrUpdateCustomer,
                insertBooking,
                insertPitchesBooking
            ], function (error, success) {
                if (error) {
                    alert('Something is wrong!');
                }
                return alert('Done!');
            });
        }

        function insertOrUpdateCustomer(callback) {
            let query;
            if(data.customerData.idUsed === "true"){
                query = "UPDATE customers SET first_name = \"" +
                    data.customerData.firstName + "\",last_name = \"" +
                    data.customerData.lastName + "\",date_of_birth = \"" +
                    data.customerData.dateOfBirth + "\",email_address = \"" +
                    data.customerData.email + "\",home_phone_number = \"" +
                    data.customerData.homePhoneNumber + "\",mobile_phone_number = \"" +
                    data.customerData.mobilePhoneNumber + "\",registration = \"" +
                    data.customerData.registration + "\",address_line_1 = \"" +
                    data.customerData.addressLine1 + "\",address_line_2 = \"" +
                    data.customerData.addressLine2 + "\" WHERE customer_id = \"" + data.customerData.insertId + "\";";
                console.log(query);
            } else {
                query = "INSERT INTO customers ( first_name, last_name, date_of_birth, email_address, home_phone_number, mobile_phone_number, registration, address_line_1,address_line_2) VALUES (\"" +
                    data.customerData.firstName + "\",\"" +
                    data.customerData.lastName + "\",\"" +
                    data.customerData.dateOfBirth + "\",\"" +
                    data.customerData.email + "\",\"" +
                    data.customerData.homePhoneNumber + "\",\"" +
                    data.customerData.mobilePhoneNumber + "\",\"" +
                    data.customerData.registration + "\", \"" +
                    data.customerData.addressLine1 + "\", \"" +
                    data.customerData.addressLine2 + "\" )";
            }

            mysql.connection.query(query, function (err, rows) {
                let insertedCustomerID;
                if(data.customerData.idUsed === "true"){
                    insertedCustomerID = data.customerData.insertId;
                }else{
                    insertedCustomerID = rows.insertId;
                }

                if (!err) {
                    console.log("Book a pitch: Customer inserted/updated!");
                    callback(null, insertedCustomerID);
                } else {
                    callback(err, null);
                }

            });

        }

        function insertBooking(customerID, callback) {

            let query;
            query = "INSERT bookings (customer_id, count_dogs, stay_start_date, stay_end_date, payment_type, payment_total, paid, type, booking_date) VALUES (" +
                customerID + "," +
                data.bookingData.dogs + ",\"" +
                data.bookingData.startDate + "\",\"" +
                data.bookingData.endDate + "\",\"" +
                data.bookingData.paymentMethod + "\"," +
                data.bookingData.price + "," +
                data.bookingData.alreadyPaid + ",\"" +
                data.bookingData.type+ "\",\"" +
                data.bookingData.bookingDate+  "\");";
            console.log(query);
            mysql.connection.query(query, function (err, okPacket) {
                insertedId = okPacket.insertId;
                bookingIdReturnValue = okPacket.insertId;
                if (!err) {
                    console.log("Book a pitch: Booking inserted!");
                    callback(null, insertedId);
                } else {
                    callback(err, null);
                }

            });

        }

        function insertPitchesBooking(bookingID, callback) {

            asyncLoop(data.pitchData, function (pitch, next) {
                let query = "INSERT pitch_bookings (pitch_id,booking_id) VALUES (" +
                    pitch.pitch_id + "," +
                    bookingID + ");";

                mysql.connection.query(query, function (err, rows) {
                    if (err) {
                        console.log(err);
                        next(err);
                        return;
                    }

                    next();
                });
            }, function (err) {
                if (err) {
                    console.error('Error: ' + err.message);
                    return;
                }

                console.log('Book a pitch finished!');
                res.send([bookingIdReturnValue]);
            });
        }
    });

    return router;
};

