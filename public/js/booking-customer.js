$(document).ready(() => {

});

// Global variables
//*********************************************************

//Hold the input errors
let errors = [];

let IDused = false;
let insertedID;
let customer = [];


function getCustomerFromDB() {
    $.ajax({
        url: "/get-customer",
        type: "POST",
        data: {"ID": insertedID},
        success: function (row) {
            if(row.length != 0){
                customer = row;
                console.log(customer);
                IDused = true
                $("#customerBookingForm").css("visibility", "visible");
                insertDataInFields();
            }else{
                IDused=false
                $("#customerBookingForm").css("visibility", "hidden");
                alert("Wrong Customer ID, please check your entered ID.")
            }

        },
        error: function (error) {
            console.log("Error receiving data from the database")
        }
    });
};

function dateConverter2Slashes(date) {
    let d = date.substring(8, 10);
    let m = date.substring(5, 7);
    let y = date.substring(0, 4);
    return (d + "/" + m + "/" + y);
}

function insertDataInFields() {
    $('input[name=first_name]').val(customer[0].first_name);
    $('input[name=last_name]').val(customer[0].last_name);
    $('input[name=date_of_birth]').val(dateConverter2Slashes(customer[0].date_of_birth));
    $('input[name=email_address]').val(customer[0].email_address);
    $('input[name=address_line_1]').val(customer[0].address_line_1);
    $('input[name=address_line_2]').val(customer[0].address_line_2);
    $('input[name=registration]').val(customer[0].registration);
    $('input[name=home_phone_number]').val(customer[0].home_phone_number);
    $('input[name=mobile_phone_number]').val(customer[0].mobile_phone_number);
}

$('#addcustomerbooking').click(function () {
    IDused = false;
    $('input[name=first_name]').val("");
    $('input[name=last_name]').val("");
    $('input[name=date_of_birth]').val("");
    $('input[name=email_address]').val("");
    $('input[name=address_line_1]').val("");
    $('input[name=address_line_2]').val("");
    $('input[name=registration]').val("");
    $('input[name=home_phone_number]').val("");
    $('input[name=mobile_phone_number]').val("");
    $("#customerBookingForm").css("visibility", "visible");
});

$('#customer_id').keyup(function () {
    if (event.keyCode === 13) {
        insertedID = $('input[name=customer_ID]').val();
        getCustomerFromDB();
    }
});

function dateConverter(date) {               //convert input date into database suitable date
    let dateF  = date.trim();
    let d = dateF.substring(0, 2);
    let m = dateF.substring(3, 5);
    let y = dateF.substring(6, 10);
    return (y + "-" + m + "-" + d);
};

/*
function insertOrUpdateCustomer(callback) {

    if (IDused === true) {            //update customer
        let valide = validityCheck();
        if (valide) {
            let query = "UPDATE customers SET first_name = \"" +
                $('input[name=first_name]').val() + "\",last_name = \"" +
                $('input[name=last_name]').val() + "\",date_of_birth = \"" +
                dateConverter($('input[name=date_of_birth]').val()) + "\",email_address = \"" +
                $('input[name=email_address]').val() + "\",home_phone_number = \"" +
                $('input[name=home_phone_number]').val() + "\",mobile_phone_number = \"" +
                $('input[name=mobile_phone_number]').val() + "\",registration = \"" +
                $('input[name=registration]').val() + "\",address_line_1 = \"" +
                $('input[name=address_line_1]').val() + "\",address_line_2 = \"" +
                $('input[name=address_line_1]').val() + "\" WHERE customer_id = \"" + insertedID + "\";";

            $.ajax({
                url: "/insert-customer",
                type: "POST",
                data: {"query": query},
                success: function (err, rows) {
                    alert("Customer has been updated. --> NOW: Booking Summary!");
                    callback(null,insertedID);
                    return;
                },
                error: (err) => {
                    callback(err,null);
                    return;
                }

            })
        }
        else {
            $('#error').text("");
            for (let error of errors) {
                $('#error').append(error + "<br>");
            }
            callback("Inputs invalid",null);
            return;
        }

    }
    else {
        let valide = validityCheck();

        if (valide) {
            let query = "INSERT INTO customers ( first_name, last_name, date_of_birth, email_address, home_phone_number, mobile_phone_number, registration, address_line_1,address_line_2) VALUES (\"" +
                $('input[name=first_name]').val() + "\",\"" +
                $('input[name=last_name]').val() + "\",\"" +
                dateConverter($('input[name=date_of_birth]').val()) + "\",\"" +
                $('input[name=email_address]').val() + "\",\"" +
                $('input[name=home_phone_number]').val() + "\",\"" +
                $('input[name=mobile_phone_number]').val() + "\",\"" +
                $('input[name=registration]').val() + "\",\"" +
                $('input[name=address_line_1]').val() + "\",\"" +
                $('input[name=address_line_2]').val() + "\")";

            $.ajax({
                url: "/insert-customer",
                type: "POST",
                data: {"query": query},
                success: function (data) {
                    alert("Customer has been added. --> NOW: Booking Summary!");

                    callback(null,data[1]);
                    return;
                },
                error: function (error) {
                    console.log("Error inserting date into the database", error)
                    callback(err,null);
                    return;
                }
            });


        }
        else {
            $('#error').text("");
            for (let error of errors) {
                $('#error').append(error + "<br>");
            }
            callback("Inputs invalid",null);
            return;

        }
    }

}
*/
function validityCheck() {

    let validity = true;

    //Validate inputs
    if ($('input[name=first_name]').val() === "") {
        validity = false;
        $('input[name=first_name]').addClass("errorInput");
    } else {
        $('input[name=first_name]').removeClass("errorInput");
    }

    if ($('input[name=last_name]').val() === "") {
        validity = false;
        $('input[name=last_name]').addClass("errorInput");
    } else {
        $('input[name=last_name]').removeClass("errorInput");
    }

    if ($('input[name=date_of_birth]').val() === "" || !dateValidityCheck($('input[name=date_of_birth]').val())) {
        validity = false;
        $('input[name=date_of_birth]').addClass("errorInput");
    } else {
        $('input[name=date_of_birth]').removeClass("errorInput");

    }
    if ($('input[name=email_address]').val() === "" || !emailValidityCheck($('input[name=email_address]').val())) {
        validity = false;
        $('input[name=email_address]').addClass("errorInput");
    } else {
        $('input[name=email_address]').removeClass("errorInput");
    }

    if ($('input[name=address_line_1]').val() === "") {
        validity = false;
        $('input[name=address_line_1]').addClass("errorInput");
    } else {
        $('input[name=address_line_1]').removeClass("errorInput");
    }

    if(!selectedPitches || selectedPitches.length===0){
        alert("No pitch is selected!");
        validity = false;
    }

    return validity;

};

/**
 * Validate the date
 * @param input date
 * @returns {boolean} true=date is valid; false=date is invalid;
 */
function dateValidityCheck(date) {

    let validity = true;
    date += "";

    if (date.indexOf("/") !== 2 && date.indexOf("/", date.indexOf("/")) !== 5 && date.indexOf("/", date.indexOf(date.indexOf("/"), "/")) === -1) {
        validity = false;
    } else {
        let d = date.substring(0, 2);
        let m = date.substring(3, 5);
        let y = date.substring(6);

        if (d.length !== 2 || m.length !== 2 || y.length !== 4) {
            validity = false;
        } else {
            if (parseInt(d) > 31 || parseInt(m) > 12) {
                validity = false;
            }
        }

    }

    if (!validity) {
        errors.push("Invalid date format!");
        return false;
    } else {
        return true;
    }
}

/**
 * Validate the email address
 * @param email
 * @returns {boolean} true=email is valid; false=email is invalid;
 */
function emailValidityCheck(email) {

    let validity = true;
    email += "";

    if (email.indexOf("@") === 0 || email.indexOf("@") === -1 || email.indexOf(".", email.indexOf("@")) === -1 || email.indexOf(".") + 1 === email.length) {
        validity = false;
    } else if (!(email.indexOf(("."), email.indexOf("@")) > email.indexOf("@") + 1)) {


        validity = false;
    }


    if (!validity) {
        errors.push("Invalid email address!");
        return false;
    } else {
        return true;
    }

}