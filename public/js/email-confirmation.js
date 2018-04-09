$(document).ready(() => {
});

var customerEmail;

$('#printPDF').click(function(){
    //getCustomerFromDB();
    sendEmailConfirmation();
});

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

function sendEmailConfirmation(id) {
    $.ajax({
        url: "/manage-booking/send-booking-confirmation",
        data: {id: id, body: body},
        type: "POST",
        success: function(data) {

        },
        error: function(err) {
            console.log(err);
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
