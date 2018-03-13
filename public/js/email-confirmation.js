$(document).ready(() => {

});

var customerEmail;

$('#printPDF').click(function(){
    getCustomerFromDB();
    sendEmailConfirmation();
})

function getCustomerFromDB() {
    $.ajax({
        type: 'POST',
        async: false,
        url: '/get-customer',
        data: {
            'ID': window.location.search.substring(12)
        },
        success: function (data) {
            stopLoadingAnimation();
            customer=data;
            console.log(customer);
            customerEmail = customer[0].email_address;
            console.log(customerEmail);
        },
        error: function () {
            console.log("We have an error in AJAX request for customer ID: " + err);
            alert(errorNotification);
        }
    });
}

function createPdfFromHtml() {
    var fs = require('fs');
    var pdf = require('html-pdf');
    var html = fs.readFileSync('./test/businesscard.html', 'utf8');
    var options = {format: 'A4', orientation: 'landscape'};

    pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
        if (err) return console.log('Error creating the PDF');
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });

}


function sendEmailConfirmation() {

    let nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'highfarm.campsites@gmail.com',
            pass: 'BoltonCampingProject123'
        }
    });

    let mailOptions = {
        from: 'High Farm Campsites <highfarm.campsites@gmail.com>',
        to: customerEmail,
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
