let login = require('./login');
let register = require('./signup');
const mysql = require('../../../db/mysql');

module.exports = function(passport){
	//Serialise User
    passport.serializeUser(function(user, done) {
        done(null, user.user_id);
    });

    //De-Serialise User
    passport.deserializeUser(function(id, done) {
        mysql.connection.query("SELECT * FROM users WHERE user_id = " + id, function(err, rows) {
            done(err, rows[0]);
        });
    });

    //Setting up Passport Strategies for Login
    login(passport);
    register(passport);
};
