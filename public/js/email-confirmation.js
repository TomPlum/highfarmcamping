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
    const nodemailer = require('nodemailer');
    const xoauth2 = require('xoauth2');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
                user: 'highfarm.campsites@gmail.com',
                clientId: '211967510289-m2if3f96pcrauqp26s9q9pbc5njni23l.apps.googleusercontent.com',
                clientSecret: 'UI3d-NQTmGPkEQCx1vTYtPFC',
                refreshToken: '1/VKbDNf3ZIkAz3pHuYDlZMiyH7e_PwBiXWPoJnBGl-eS7Nwpz9ljpVxaUrp671GZP'
            })
        }
    })

    var mailOptions = {
        from: 'High Farm Campsites <highfarm.campsites@gmail.com>',
        to: customerEmail,
        subject: 'Your Booking confirmation',
        text: 'This is a test. Thx'
    }

    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log('Error');
        } else {
            console.log('Email Sent');
        }
    })}