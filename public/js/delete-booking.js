// This file is for displaying the customer to be deleted
$(document).ready(() => {
    // variable filters the customer ID from the URL:
    let uriParams = parseURLParams(window.location.toString());

    // We invoke Ajax call for getting a single customer
    getBookingFromDB();

    // Listen on the "Delete Booking" button and invoke SQL delete statement when clicking
    $('#btnDeleteBooking').click(function () {
        try {
            $.ajax({
                url: "/manage-booking/delete-single-booking",
                type: "POST",
                async: true,
                data: {"ID": uriParams.booking_id[0]},
                success: function (res) {
                    if (typeof res === "object" && res.errno.toString() === "1451") {
                        //Referential Integrity Error - Display Error Notification
                        $("#alertBoxContainer2").css("display", "inline");

                    } else if (typeof res === "string" && res === "Success") {
                        //Successfully Deleted Booking
                        $("#alertBoxContainer").css("display", "inline");
                    }

                    //Remove The Delete Elements From The DOM
                    $("#deleteBookingSection").css("display", "none");
                },
                error: function (error) {
                    console.log("Ajax Request Error : " + error);
                    alert(errorNotification);
                }
            });
        } catch (err) {
            console.log("Error in delete Booking Ajax request: " + err.toString());
            alert(errorNotification);
        }
    });

    //Ajax call for getting a single booking
    function getBookingFromDB() {
        try {
            $.ajax({
                url: "/manage-booking/get-booking",
                type: "POST",
                data: {"ID": uriParams.booking_id[0]},
                success: function (data) {
                    createTable(data);
                },
                error: function (error) {
                    console.log("getBookingFromDB() Error: " + error);
                }
            })
        } catch (err) {
            console.log("Error in getBookingFromDB(): " + err.toString());
            alert(errorNotification);
        }
    }

    function createTable(booking) {
        try {
            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</table>";
            let tBody = "<tbody>";

            //Create Table Header
            let headers = "<thead>" +
                "<tr>" +
                "<th>Booking ID</th>" +
                "<th>Customer ID</th>" +
                "<th>Count Dogs</th>" +
                "<th>Stay Start Date</th>" +
                "<th>Stay End Date</th>" +
                "<th>Payment Type</th>" +
                "<th>Payment Total</th>" +
                "<th>Paid</th>" +
                "<th>Type</th>" +
                "<th>Booking Data</th>" +
                "</tr>" +
                "</thead>";

            //Create Table Body
            let i = 0;

            tBody += "<tr>";
            tBody += "<td>" + booking[i].booking_id + "</td>";
            tBody += "<td>" + booking[i].customer_id + "</td>";
            tBody += "<td>" + booking[i].count_dogs + "</td>";
            tBody += "<td>" + formatDate(booking[i].stay_start_date) + "</td>";
            tBody += "<td>" + formatDate(booking[i].stay_end_date) + "</td>"
            tBody += "<td>" + booking[i].payment_type + "</td>";
            tBody += "<td>" + booking[i].payment_total + "</td>";
            tBody += "<td>" + booking[i].paid + "</td>";
            tBody += "<td>" + booking[i].type + "</td>";
            tBody += "<td>" + formatDate(booking[i].booking_date) + "</td>";
            tBody += "</tr>";

            tBody += "</tbody>";
            $(".booking-to-be-deleted").html(oTable + headers + tBody + cTable);
        } catch (err) {
            console.log("Error in create table function: " + err.toString());
            alert(errorNotification);
        }
    }
});
