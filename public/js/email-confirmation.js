$(document).ready(() => {
});

var customerEmail;

$('#printPDF').click(function(){
    //getCustomerFromDB();
    let id = parseURLParams(window.location.toString());
    sendEmailConfirmation(id.booking_id[0]);
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
        data: {id: id},
        type: "POST",
        success: function(data) {

        },
        error: function(err) {
            console.log(err);
        }
    });
}
