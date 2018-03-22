let LocalStrategy = require('passport-local').Strategy;
let bCrypt = require('bcrypt-nodejs');
let mysql = require('../../../db/mysql');

module.exports = function(passport) {
    passport.use(new LocalStrategy({passReqToCallback: true},
        function(req, username, password, done) {
            let changePassword = function() {
                mysql.connection.query("SELECT * FROM users WHERE username = '" + username + "';", function(err, rows) {
                    //If Unexpected Error - Log It & Return It
                    if (err) {
                        console.log("Error: " + err);
                        return done(err, null); //Return err, no user
                    }

                    //New Password & Confirm Passwords DO NOT match
                    if (password !== req.body.confirm) {
                        return done(null, false, req.flash('error', "Passwords Do Not Match"));
                    }

                    //New Password & Current Database Passwords DO NOT match
                    if(!isValidPassword(rows[0].password, password)) {
                        return done(null, false, req.flash('error', 'Incorrect Current Password'));
                    }

                    mysql.connection.query("UPDATE users SET password = ? WHERE username = ?;", [req.body.confirm, username], (err, rows) => {
                        return done(null, true, req.flash('message', 'Successfully Update Password'));
                    });
                }); //End of User.findOne()
            }; //End of registerUser's anon function
            //Delay Invocation of registerUser() until the next event loop tick
            process.nextTick(changePassword);
        }) //End of passport.use() anon function
    ); //End of passport.use()

    //Function For Encrypting Passwords
    let createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    let isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user);
    };
}; //End of exported function

