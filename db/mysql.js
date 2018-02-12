const mysql = require('mysql');

let connection = mysql.createConnection({
    host:  "216.189.151.23",
    user: "grp1",
    password: "muppet",
    database: "grp1"
});

let connect = connection.connect(err => {
    if (err) {
        console.log("MySQL Error: " + err);
    } else {
        console.log("Successfully Connected To MySQL DB");
    }
});

module.exports = {
    connection: connection,
    connect: connect
};

