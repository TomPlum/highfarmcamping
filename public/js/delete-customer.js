// This file is for displaying the customer to be deleted

$(document).ready(() => {


    // variable filters the customer ID from the URL:
    let customer_id = window.location.search.substring(13);
// We invoke Ajax call for getting a single customer
    getCustomerFromDB();

// Listen on the "Delete Customer" button and invoke SQL delete statement when clicking

$('#btnDeleteCustomer').click(function () {
    try
    {
    $.ajax({
        url: "/delete-single-customer",
        type: "POST",
        data: {"ID": customer_id},
        success: function (err) {
            console.log("Ajax Request successful");
            if(JSON.stringify(err)==="\"\"")
            {
                $("#alertBoxContainer").css("visibility","visible");
            }
            // When delete customer is not possible due to referential integrity we invoke a notification for the user:
            else
            {
                $("#alertBoxContainer2").css("visibility", "visible");
            }

            $("#deleteCustomerSection").css("visibility","hidden");
        },
        error: function (error) {
            console.log("Ajax request error : " + error);
            alert(errorNotification);
        }
    });
    }
    catch(err)
    {
        console.log("Error in delete Customer Ajax request: " + err.toString());
        alert(errorNotification);
    }
});



//Ajax call for getting a single customer

function getCustomerFromDB() {
    try {
        $.ajax({
            url: "/get-customer",
            type: "POST",
            data: {"ID": customer_id},
            success: function (dataP) {
                customer = dataP;
                createTable();
            },
            error: function (error) {
                console.log("Error receiving data from the database")
            }
        })
    }
    catch(err)
    {
        console.log("Error in getCustomerFromDB(): " + err.toString());
        alert(errorNotification);
    }
}

function createTable() {
    try {

        const oTable = "<table class='table table-hover table-striped table-condensed'>";
        const cTable = "</table>";
        let tBody = "<tbody>";

        //Create Table Header
        let headers = "<thead>" +
            "<tr>" +
            "<th>ID</th>" +
            "<th>First Name</th>" +
            "<th>Surname</th>" +
            "<th>DOB</th>" +
            "<th>E-Mail</th>" +
            "<th>Address</th>" +
            "<th>Registration</th>" +
            "<th>Home Phone</th>" +
            "<th>Mobile Phone</th>" +
            "</tr>" +
            "</thead>";

        //Create Table Body
        for (let i = 0; i < customer.length; i++) {
            tBody += "<tr>";
            tBody += "<td>" + customer[i].customer_id + "</td>";
            tBody += "<td>" + customer[i].first_name + "</td>";
            tBody += "<td>" + customer[i].last_name + "</td>";
            tBody += "<td>" + formatDate(customer[i].date_of_birth) + "</td>";
            tBody += "<td>" + customer[i].email_address + "</td>";
            tBody += "<td>" + customer[i].address_line_1 + "<br>" + customer[i].address_line_2 + "</td>";
            tBody += "<td>" + customer[i].registration + "</td>";
            tBody += "<td>" + customer[i].home_phone_number + "</td>";
            tBody += "<td>" + customer[i].mobile_phone_number + "</td>";
            tBody += "</tr>";
        }
        tBody += "</tbody>";
        $(".customer-to-be-deleted").html(oTable + headers + tBody + cTable);
    }
    catch(err)
    {
        console.log("Error in create table function: " + err.toString());
        alert(errorNotification);
    }
}
});
