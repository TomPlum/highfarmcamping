$(document).ready(() => {

    /**
     * TODO Problem: DB data is inserted at id 6**
     * TODO Comment the code
     * TODO Prevent SQL Injection and Escape the inputs
     */

    // Global Variables
    //***********************************************
    let customer = [];

    let errors = [];


    // Add customer
    //***********************************************

    $('#btnAddCustomer').click(function () {
        let valide = validityCheck();
        if(valide){
            let query = "INSERT INTO customers ( first_name, last_name, date_of_birth, email_address, home_phone_number, mobile_phone_number, registration, address_line_1,address_line_2) VALUES (\"" +
                document.forms[0].first_name.value + "\",\"" +
                document.forms[0].last_name.value + "\",\"" +
                dateConverter(document.forms[0].date_of_birth.value) + "\",\"" +
                document.forms[0].email_address.value + "\",\"" +
                document.forms[0].home_phone_number.value + "\",\"" +
                document.forms[0].mobile_phone_number.value + "\",\"" +
                document.forms[0].registration.value + "\",\"" +
                document.forms[0].address_line_1.value + "\",\"" +
                document.forms[0].address_line_2.value + "\");";

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

            $("#addCustomerForm").css("visibility","hidden");
            $("#alertBoxContainer").css("visibility","visible");
        }else{
            $('#error').text("");
            for (let error of errors){
                $('#error').append(error+"<br>");
            }

        }
    });

    $('#alertBoxBtn').click(function () {
        window.location.href="/customer-overview";
    });

    function dateConverter(date){               //convert input date into database suitable date
        let d = date.substring(0, 2);
        let m = date.substring(3,5);
        let y = date.substring(6,10);
        return(y +"-"+m+"-"+d);

    }

    function validityCheck(){
        let validity = true;
        errors = [];

        if(document.forms[0].first_name.value == ""){
            validity = false;
            $('input[name=first_name]').addClass("errorInput");
        }else{
            $('input[name=first_name]').removeClass("errorInput");
        }

        if(document.forms[0].last_name.value == ""){
            validity = false;
            $('input[name=last_name]').addClass("errorInput");
        }else{
            $('input[name=last_name]').removeClass("errorInput");
        }

        if(document.forms[0].date_of_birth.value=="" || !dateValidityCheck(document.forms[0].date_of_birth.value)){
            validity = false;
            $('input[name=date_of_birth]').addClass("errorInput");
        }else{
            $('input[name=date_of_birth]').removeClass("errorInput");

        }
        if(document.forms[0].email_address.value == "" || !emailValidityCheck(document.forms[0].email_address.value)){
            validity = false;
            $('input[name=email_address]').addClass("errorInput");
        }else{
            $('input[name=email_address]').removeClass("errorInput");
        }

        if(document.forms[0].address_line_1.value == ""){
            validity = false;
            $('input[name=address_line_1]').addClass("errorInput");
        }else{
            $('input[name=address_line_1]').removeClass("errorInput");
        }


        /*
        if(!validity){
            errors.push("The red fields shouldn´t be empty!")
        }
        */

        return validity;

    };

    function dateValidityCheck(date) {

        let validity = true;
        date +="";

        if(date.indexOf("/")!=2 && date.indexOf("/",date.indexOf("/"))!= 5 && date.indexOf("/",date.indexOf(date.indexOf("/"),"/"))==-1 ){
            validity = false;
        }else{
            let d = date.substring(0, 2);
            let m = date.substring(3,5);
            let y = date.substring(6);

            if(d.length!=2 || m.length!=2 || y.length!=4){
                validity=false;
            }else{
                if(parseInt(d)>31 || parseInt(m)>12){
                    validity=false;
                }
            }

        }

        if(!validity){
            errors.push("Invalid date format!")
            return false;
        }else {
            return true;
        }

    }

    function emailValidityCheck(email) {

        let validity = true;
        email +="";

        if (email.indexOf("@")==0 || email.indexOf("@")==-1 || email.indexOf(".",email.indexOf("@"))==-1 || email.indexOf(".")+1==email.length){
            validity = false;
        }else if(!(email.indexOf(("."),email.indexOf("@"))>email.indexOf("@")+1)){
            console.log(email.indexOf(email.indexOf("@"),(".")));
            console.log(email.indexOf("@")+1);

            validity = false;
        }


        if(!validity){
            errors.push("Invalid email address!")
            return false;
        }else {
            return true;
        }

    }



    // Customer Overview
    //***********************************************

    getDataFromDB();

    function getDataFromDB() {
        //Ajax Call to the DB
        $.ajax({
            url: "/test-db",
            type: "POST",
            success: function (dataP) {
                customer = dataP;
                console.log(customer);
                // don´t needed anymore since addresses are in the customer table
                // customer = addressGenerator(customer);
                createTable();
            },
            error: function (error)
            {
                console.log("Error receiving data from the database")
            }
        });
    }

    /**
     * Creates the table with the customers
     */
    function createTable() {

        const oTable = "<table class='table table-hover table-striped table-condensed'>";
        const cTable = "</table>";
        let tBody = "<tbody>";

        //Create Table Header
        let headers = "<thead>" +
            "<tr>" +
            "<th>ID</th>" +
            "<th>First Name</th>" +
            "<th>Surname</th>" +
            "<th>Date of Birth</th>" +
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
            tBody += "<td>" + customer[i].address_line_1+"<br>" +customer[i].address_line_2+ "</td>";
            tBody += "<td>" + customer[i].registration + "</td>";
            tBody += "<td>" + customer[i].home_phone_number + "</td>";
            tBody += "<td>" + customer[i].mobile_phone_number + "</td>";
            tBody += "</tr>";

        }

        tBody += "</tbody>";


        $(".customer-overview").html(oTable + headers + tBody + cTable);

    }

    /**
     * Format the Date
     * @param Date in DB Format
     * @returns formatted Strinf
     */
    function formatDate(dateDB) {
        let date = new Date(dateDB);
        let DD = date.getDate();
        if (DD < 10) {
            DD = "0" + DD;
        }
        let MM = date.getMonth();
        MM += 1;     //Need to do +1, don´t know why yet
        if (MM < 10) {
            MM = "0" + MM;
        }
        const YYYY = date.getFullYear();
        return DD + "/" + MM + "/" + YYYY;
    }

    /**
     * Checks if a customer has more than one address and connects both address lines
     * @param Data from DB
     * @returns Data with all address in one field (address_line_1)
     */
    function addressGenerator(customerP) {
        let customers = customerP;
        let returnObject = [];
        let returnAddress = "";
        let y = 0;

        for (let i = 0; i < customers.length; i++) {

            if (i != customers.length - 1) {

                if (customers[i].customer_id != customers[i + 1].customer_id) {
                    y = 0;
                    returnAddress += customers[i].address_line_1 + "<br>" + customers[i].address_line_2 + "<br><br>";
                    customers[i].address_line_1 = "";
                    customers[i].address_line_1 = returnAddress;
                    returnAddress = "";
                    returnObject.push(customers[i]);
                } else {
                    y = 0;
                    while (customers[i].customer_id == customers[i + y].customer_id) {
                        returnAddress += customers[i + y].address_line_1 + "<br>" + customers[i + y].address_line_2 + "<br><br>";
                        y++;
                    }
                    customers[i].address_line_1 = "";
                    customers[i].address_line_1 = returnAddress;
                    returnAddress = "";
                    returnObject.push(customers[i]);
                    i += y - 1;
                }
            }else{
                returnAddress += customers[i].address_line_1 + "<br>" + customers[i].address_line_2 + "<br><br>";
                customers[i].address_line_1 = "";
                customers[i].address_line_1 = returnAddress;
                returnAddress = "";
                returnObject.push(customers[i]);
            }

        }
        return returnObject;
    }

});


