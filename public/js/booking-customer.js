$(document).ready(() => {

});

let IDused = false;
let insertedID;
let customer=[];
function getCustomerFromDB(){
    $.ajax({
        url: "/get-customer",
        type: "POST",
        data: {"ID": insertedID},
        success: function (row) {
            customer=row;
            console.log(customer);
            insertDataInFields();
        },
        error: function (error) {
            console.log("Error receiving data from the database")
        }
    });
};

function dateConverter2Slashes(date){
    let d = date.substring(8, 10);
    let m = date.substring(5,7);
    let y = date.substring(0,4);
    return(d + "/" +m+ "/"+y);
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
    $("#customerBookingForm").css("visibility","visible");
});

$('#customer_id').keyup(function() {
    if (event.keyCode === 13) {
        insertedID = $('input[name=customer_ID]').val();
        getCustomerFromDB();
        IDused =true;
        $("#customerBookingForm").css("visibility","visible");
    }
});

function dateConverter(date){               //convert input date into database suitable date
    let d = date.substring(0, 2);
    let m = date.substring(3,5);
    let y = date.substring(6,10);
    return(y +"-"+m+"-"+d);
};

$('#next').click(function() {
    if (IDused === true) {            //update customer
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
            },


        })
    }
    else {
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
            success: function (err, rows) {
            },
            error: function (error) {
                console.log("Error inserting date into the database", error)
            }
        });
    }
    alert("Customer has been added/updated. --> NOW: Booking Summary!");
});