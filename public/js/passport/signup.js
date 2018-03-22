let LocalStrategy = require('passport-local').Strategy;
let bCrypt = require('bcrypt-nodejs');
let mysql = require('../../../db/mysql');

module.exports = function(passport) {
    passport.use('signup', new LocalStrategy({passReqToCallback: true},
        function(req, username, password, done) {
            let registerUser = function() {
                mysql.connection.query("SELECT * FROM users WHERE username = '" + username + "';", function(err, rows) {
                    //If Unexpected Error - Log It & Return It
                    if (err) {
                        console.log("Registration Error: " + err);
                        return done(err, null); //Return err, no user
                    }

                    //If User Already Exists
                    if (rows.length) {
                        console.log("Username '" + username + "' already exists.'");
                        return done(null, false, req.flash('error', 'User Already Exists.'));
                    } else {
                        mysql.connection.query("SELECT * FROM admin", function(err, rows) {
                            if (err) {
                                console.log(err);
                            }

                            if (password !== req.body.confirm) {
                                return done(null, false, req.flash('error', "Passwords Do Not Match"));
                            }

                            console.log(rows);
                            //Check if Admin Key Correct
                            if (!validAdminKey(rows, req.body.admin_key)) {
                                return done(null, false, req.flash('error', "Incorrect Admin Key"));
                            }

                            //Add New User
                            let newUser = {};
                            newUser.username = username;
                            newUser.email = req.body.email;
                            newUser.password = createHash(password);
                            newUser.role = req.body.role;

                            let query = 'INSERT INTO users (username, email, password, permissions) VALUES ("' + newUser.username + '", "' + newUser.email + '", "' + newUser.password + '", "' + newUser.role + '");';
                            mysql.connection.query(query, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Successfully Registered User " + username);
                                    return done(null, newUser, req.flash('message', "Successfully Registered User '" + username + "'."));
                                }
                            });
                        });
                    }
                }); //End of User.findOne()
            }; //End of registerUser's anon function
            //Delay Invocation of registerUser() until the next event loop tick
            process.nextTick(registerUser);
        }) //End of passport.use() anon function
    ); //End of passport.use()

    //Function For Encrypting Passwords
    let createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    function validAdminKey(arr, key) {
        for(let i = 0; i < arr.length; i++) {
            if (arr[i].key === key) {
                return true;
            }
        }
        return false;
    }
}; //End of exported function
