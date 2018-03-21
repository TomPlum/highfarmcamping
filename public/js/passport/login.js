let LocalStrategy = require('passport-local').Strategy;
let bCrypt = require('bcrypt-nodejs');
let mysql = require('../../../db/mysql');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({passReqToCallback: true},
        function(req, username, password, done) {
            //Queries DB For User
            mysql.connection.query("SELECT * FROM users WHERE username = '" + username + "';", function(err, rows) {
                //In The Event Of An Error, Throw It
                if (err) {
                    console.log(err);
                    return done(err);
				}

				console.log(rows);

                //Username Does Not Exist, Log Error, Callback, Flash Error Message
                if (!rows.length){
                    console.log('User: '+ username + ", does not exist.");
                    return done(null, false, req.flash('error', "User '" + username + "' Not Found."));
                }

                //User Exists, But Password Is Incorrect
                /*
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }
                */
                if (!isValidPassword(rows[0].password, password)) {
                    return done(null, false, req.flash('error', 'Incorrect Password.'));
                }

                //If No Previous Error Conditions Are Met - Username/Password Are Correct
				console.log("Validated User: " + username + ".");

                //Return User Object
				return done(null, rows[0]);
            }); //End of User.findOne()
        }) //End of new LocalStrategy
	); //End of passport.use()

    let isValidPassword = function(user, password){
        console.log(user);
        console.log(password);
        return bCrypt.compareSync(password, user);
    };

    let createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};
