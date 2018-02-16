$(document).ready(() => {

    let customer = [];

    getDataFromDB();


    function getDataFromDB() {
        //Ajax Call to the DB
        $.ajax({
            url: "/test-db",
            type: "POST",
            success: function (dataP) {
                customer = dataP;
                customer = addressGenerator(customer);
                createTable();
            },
            error: function (error)
            {
                console.log("Error receiving data from the database")
            }        });
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
            tBody += "<td>" + customer[i].address_line_1 + "</td>";
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


