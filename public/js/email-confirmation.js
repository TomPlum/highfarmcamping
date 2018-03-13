function sendEmailConfirmation() {

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'highfarm.campsites@gmail.com',
            pass: 'BoltonCampingProject123'
        }
    });

    var mailOptions = {
        from: 'High Farm Campsites <highfarm.campsites@gmail.com>',
        to: 'heimburg@outlook.com',
        subject: 'High Farm Campground - Booking Overview',
        text: 'Test Text. That was easy.'
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Email could not be sent');
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
