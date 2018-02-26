$(document).ready(() => {

    /**
     * TODO Prevent SQL Injection and Escape the inputs
     * TODO Security problems?
     * TODO Search text: maybe not just the id
     * TODO Instead of UPDATe Customer edit customer?
     * TODO Improve row selecting
     */



    // Global variables
    //*********************************************************
    let customer = [];


    //Hold the input errors
    let errors = [];

    // Edit and delete customer
    //***********************************************
    let selected_row_value;

    if(localStorage.getItem("selectedRow")){
        selected_row_value = localStorage.getItem("selectedRow");
    }else{
        localStorage.setItem("selectedRow","");
    }



    // Add customer
    //***********************************************

    // Listen on the "add customer" button
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
            $('.error').text("");
            for (let error of errors){
                $('.error').append(error+"<br>");
            }

        }
    });



    // Update customer
    //***********************************************

    // Listen on the "Update customer" button
    $('#btnUpdateCustomer').click(function () {

        let valide = validityCheck();

        if(valide){
            let query = "UPDATE customers SET first_name = \"" +
                document.forms[0].first_name.value + "\",last_name = \""+
                document.forms[0].last_name.value + "\",date_of_birth = \""+
                dateConverter(document.forms[0].date_of_birth.value) + "\",email_address = \""+
                document.forms[0].email_address.value + "\",home_phone_number = \""+
                document.forms[0].home_phone_number.value + "\",mobile_phone_number = \""+
                document.forms[0].mobile_phone_number.value + "\",registration = \""+
                document.forms[0].registration.value + "\",address_line_1 = \""+
                document.forms[0].address_line_1.value + "\",address_line_2 = \""+
                document.forms[0].address_line_2.value + "\" WHERE customer_id = \""+selected_row_value + "\";";

            $.ajax({
                url: "/insert-customer",
                type: "POST",
                data: {"query": query},
                success: function (err, rows) {

                },
                error: function (error) {
                    console.log("Error inserting data into the database", error)
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

    // Listen on the "Delete Customer" button and invoke SQL delete statement when clicking
    $('#btnDeleteCustomer').click(function () {
            $.ajax({
                url: "/delete-customer",
                type: "POST",
                data: {"ID": selected_row_value},
                success: function (err, rows) {
                    console.log("Deleting successful");
                    //alert("THIS IS "+ err);
                },
                error: function (error) {
                    console.log("Error deleting data from database", error);
                }
            });
        $("#deleteCustomerSection").css("visibility","hidden");
        let idString = selected_row_value.toString()
        if (idString.startsWith(6))
        {$("#alertBoxContainer").css("visibility","visible");}
        else
        {
            {$("#alertBoxContainer2").css("visibility","visible");}
        }
    });

    // Listen on the "alert box" button
    $('#alertBoxBtn').click(function () {
        window.location.href="/customer-overview";
    });
    $('#alertBoxBtn2').click(function () {
        window.location.href="/customer-overview";
    });

    function dateConverter(date){               //convert input date into database suitable date
        let d = date.substring(0, 2);
        let m = date.substring(3,5);
        let y = date.substring(6,10);
        return(y +"-"+m+"-"+d);

    }

    function dateConverter2Slashes(date){
        let d = date.substring(8, 10);
        let m = date.substring(5,7);
        let y = date.substring(0,4);
        return(d + "/" +m+ "/"+y);
    }

    /**
     * Validate the form inputs
     * @returns {boolean} true=inputs valid; false=inputs invalid;
     */
    function validityCheck(){

        let validity = true;

        //Validate inputs
        if(document.forms[0].first_name.value === ""){
            validity = false;
            $('input[name=first_name]').addClass("errorInput");
        }else{
            $('input[name=first_name]').removeClass("errorInput");
        }

        if(document.forms[0].last_name.value === ""){
            validity = false;
            $('input[name=last_name]').addClass("errorInput");
        }else{
            $('input[name=last_name]').removeClass("errorInput");
        }

        if(document.forms[0].date_of_birth.value === "" || !dateValidityCheck(document.forms[0].date_of_birth.value)){
            validity = false;
            $('input[name=date_of_birth]').addClass("errorInput");
        }else{
            $('input[name=date_of_birth]').removeClass("errorInput");

        }
        if(document.forms[0].email_address.value === "" || !emailValidityCheck(document.forms[0].email_address.value)){
            validity = false;
            $('input[name=email_address]').addClass("errorInput");
        }else{
            $('input[name=email_address]').removeClass("errorInput");
        }

        if(document.forms[0].address_line_1.value === ""){
            validity = false;
            $('input[name=address_line_1]').addClass("errorInput");
        }else{
            $('input[name=address_line_1]').removeClass("errorInput");
        }

        return validity;

    }

    /**
     * Validate the date
     * @param input date
     * @returns {boolean} true=date is valid; false=date is invalid;
     */
    function dateValidityCheck(date) {

        let validity = true;
        date +="";

        if(date.indexOf("/")!==2 && date.indexOf("/",date.indexOf("/"))!== 5 && date.indexOf("/",date.indexOf(date.indexOf("/"),"/")) === -1 ){
            validity = false;
        }else{
            let d = date.substring(0, 2);
            let m = date.substring(3,5);
            let y = date.substring(6);

            if(d.length !== 2 || m.length !== 2 || y.length !== 4){
                validity=false;
            }else{
                if(parseInt(d)>31 || parseInt(m)>12){
                    validity=false;
                }
            }

        }

        if(!validity){
            errors.push("Invalid date format!");
            return false;
        }else {
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
        email +="";

        if (email.indexOf("@") === 0 || email.indexOf("@") === -1 || email.indexOf(".",email.indexOf("@")) === -1 || email.indexOf(".") + 1 === email.length){
            validity = false;
        }else if(!(email.indexOf(("."),email.indexOf("@"))>email.indexOf("@")+1)){


            validity = false;
        }


        if(!validity){
            errors.push("Invalid email address!");
            return false;
        }else {
            return true;
        }

    }

    function goToEditCustomer() {
        console.log(selected_row_value);
        if(selected_row_value !== undefined){
            window.location = "/edit-customer";
        }
    }

    function insertDataInFields(){
        console.log(localStorage.getItem("selectedRow"));

        //selected_row_value = parseInt(localStorage.getItem("selectedRow"));
        //if selected_row_value = NULL
        for (let customer1 of customer){
            if (customer1.customer_id === parseInt(selected_row_value)){
                $('input[name=first_name]').val(customer1.first_name);
                $('input[name=last_name]').val(customer1.last_name);
                $('input[name=date_of_birth]').val(dateConverter2Slashes(customer1.date_of_birth));
                $('input[name=email_address]').val(customer1.email_address);
                $('input[name=address_line_1]').val(customer1.address_line_1);
                $('input[name=address_line_2]').val(customer1.address_line_2);
                $('input[name=registration]').val(customer1.registration);
                $('input[name=home_phone_number]').val(customer1.home_phone_number);
                $('input[name=mobile_phone_number]').val(customer1.mobile_phone_number);
            }
        }




    }


    // Delete Customer
    //***********************************************
    function goToDeleteCustomer(){

        if(selected_row_value !== undefined){
            window.location = "/deletecustomer";
        }

    }


    // Customer Overview
    //***********************************************

    getDataFromDB();

    function getDataFromDB() {
        startLoadingAnimation();
        //Ajax Call to the DB
        // If page deletecustomer: we invoke Ajax call for getting a single customer
        if(!window.location.pathname.match("deletecustomer")) {
            $.ajax({
                url: "/get-customers",
                type: "POST",
                success: function (dataP) {
                    stopLoadingAnimation();
                    customer = dataP;
                    createTable();
                    if (window.location.pathname.match("edit-customer")) {

                        insertDataInFields();
                    }
                },
                error: function (error) {
                    console.log("Error receiving data from the database")
                }
            });
        }else
        {
            $.ajax({
                url: "/get-customer",
                type: "POST",
                data: {"ID": selected_row_value},
                success: function (dataP) {
                    customer = dataP;
                    createTable();
                },
                error: function (error) {
                    console.log("Error receiving data from the database")
                }
            });
        }
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
            tBody += "<td>" + customer[i].address_line_1+"<br>" +customer[i].address_line_2+ "</td>";
            tBody += "<td>" + customer[i].registration + "</td>";
            tBody += "<td>" + customer[i].home_phone_number + "</td>";
            tBody += "<td>" + customer[i].mobile_phone_number + "</td>";
            tBody += "</tr>";
        }

        tBody += "</tbody>";


        $(".customer-overview").html(oTable + headers + tBody + cTable);


        //Make the rows selectable but only if you enter the customer-overview page
        if(window.location.pathname.match("customer-overview") ){
            let rows = document.getElementById('customerTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

            for (i = 0; i < rows.length; i++) {
                rows[i].addEventListener('click', function() {

                    if(document.getElementById('customerTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex-1].getElementsByTagName('td')[0].innerHTML !== selected_row_value){
                        selected_row_value = document.getElementById('customerTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex-1].getElementsByTagName('td')[0].innerHTML;

                        let rows2 = document.getElementById('customerTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                        for (x = 0; x < rows2.length; x++) {
                            rows2[x].classList.remove('selected');
                        }
                        this.classList.add('selected');
                    }else{

                        this.classList.remove('selected');
                        selected_row_value = undefined;
                    }

                });
            }
        }
    }

    $('#Edit').on('click', function(){
        localStorage.setItem("selectedRow", selected_row_value);
        goToEditCustomer();
    });

    $('#Delete').on('click', function(){
        localStorage.setItem("selectedRow", selected_row_value);
        goToDeleteCustomer();
    });

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

            if (i !== customers.length - 1) {

                if (customers[i].customer_id !== customers[i + 1].customer_id) {
                    y = 0;
                    returnAddress += customers[i].address_line_1 + "<br>" + customers[i].address_line_2 + "<br><br>";
                    customers[i].address_line_1 = "";
                    customers[i].address_line_1 = returnAddress;
                    returnAddress = "";
                    returnObject.push(customers[i]);
                } else {
                    y = 0;
                    while (customers[i].customer_id === customers[i + y].customer_id) {
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

    // filter Table through ID when inserting values into "search customer through ID" field through JQuery:

    $('#customer_id').keyup(function(){
        let id = document.getElementById("customer_id").value;
        let table = document.getElementById("customerTable");
        let tr = table.getElementsByTagName("tr");
        let i=0;
        let td;
        // Go through all table rows and search for row with desired ID
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if(td) {
                if(td.innerHTML.indexOf(id)> -1)
                {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    });

});