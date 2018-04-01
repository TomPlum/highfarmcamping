// This file enables displaying count of dogs for today and for desired date
$(document).ready(() => {

    getBookingForCountDogs();

    let today = new Date();
    let rowsPitchOverview="";
    getPitchOverview(today);


    let rowsBooking = "";


    $('#Count').click(function () {
        let date = document.forms[0].date.value;
        if(generalDateValidityCheck(date))
        {
            // generating date in correct format for calculating count of dogs:
            let dateForJavaScript =  writtenDateToJavaScriptDate(date);
            calculateCountDogs(rowsPitchOverview, dateForJavaScript);
            generatePitchOverviewTable(rowsPitchOverview, dateForJavaScript);
        }
        else
        {
            alert("The date has the wrong format or is not defined.");
        }
    });

    function getBookingForCountDogs() {
        try {
            let query = "SELECT count_dogs, stay_start_date, stay_end_date FROM bookings";
            // executing select all booking data for calculating count of dogs

            $.ajax({
                url: "/select-db-query",
                type: "POST",
                data: {"query": query},
                success: function (rows) {
                    //alert(Date.parse(writtenDateToJavaScriptDate(formatDate(rows[2].stay_start_date))));
                    // alert(Date.parse(new Date()));
                    rowsBooking=rows;
                    calculateCountDogs(rowsBooking, today);

                },
                error: function (error) {
                    console.log("Ajax request error : " + error);
                    alert(errorNotification);
                }
            })
        }
        catch (err) {
            console.log(err);
            alert(errorNotification);
        }
    }

    function getPitchOverview(date)
    {
        try {
            let query = "SELECT pitches.pitch_id, pitches.type, customers.first_name, customers.last_name, customers.registration, bookings.stay_start_date, bookings.stay_end_date, bookings.count_dogs, bookings.booking_id, bookings.paid FROM pitches" +
                "        LEFT JOIN pitch_bookings ON pitch_bookings.pitch_id = pitches.pitch_id" +
                "        LEFT JOIN bookings ON pitch_bookings.booking_id = bookings.booking_id" +
                "        LEFT JOIN customers ON bookings.customer_id = customers.customer_id";
            $.ajax({
                url: "/select-db-query",
                type: "POST",
                data: {"query": query},
                success: function (rows) {
                    //alert(Date.parse(writtenDateToJavaScriptDate(formatDate(rows[2].stay_start_date))));
                    // alert(Date.parse(new Date()));
                    rowsPitchOverview=rows;
                    generatePitchOverviewTable(rows, date);

                },
                error: function (error) {
                    console.log("Ajax request error : " + error);
                    alert(errorNotification);
                }
            })
        }
        catch (err) {
            console.log(err);
            alert(errorNotification);
        }
    }
    function generatePitchOverviewTable(data, date)
    {
        try {
            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</table>";
            let tBody = "<tbody>";

            let headers = "<thead>" +
                "<tr>" +
                "<th>Pitch ID</th>" +
                "<th>Customer Name</th>" +
                "<th>Registration Number</th>" +
                "<th>Booking ID</th>" +
                "<th>Paid?</th>" +
                "<th>Booking Duration</th>" +
                "<th>Count Dogs per Pitch</th>" +
                "</tr>" +
                "</thead>";

            //Create Table Body

           // let testDate =  writtenDateToJavaScriptDate("15/01/2018");

            let nothingBooked=true;
            for (let i = 0; i < data.length; i++) {


                    let startDate = writtenDateToJavaScriptDate(formatDate(data[i].stay_start_date));
                    let endDate = writtenDateToJavaScriptDate(formatDate(data[i].stay_end_date));
                    // if statement goes through every booking timeframe and looks if the date today lies within the booking timeframe
                    if (date <= endDate && startDate <= date) {
                        nothingBooked=false;
                        tBody += "<tr>";
                        tBody += "<td>" + getIcon(data[i].type) + " Pitch " + data[i].pitch_id;
                        tBody += "<td>" + data[i].first_name + " " + data[i].last_name + "</td>";
                        tBody += "<td>" + data[i].registration + "</td>";
                        tBody += "<td>" + data[i].booking_id + "</td>";
                        tBody += "<td>" + formatPaid(data[i].paid) + "</td>";
                        tBody += "<td>" + formatDate(data[i].stay_start_date) + " - " + formatDate(data[i].stay_end_date) + "</td>";
                        tBody += "<td>" + data[i].count_dogs + "</td>";
                        tBody += "</td>";
                        tBody += "</tr>";
                    }

            }
            tBody += "</tbody>";
            if(nothingBooked===false) {
                $(".pitchOverview").html(oTable + headers + tBody + cTable);
            } else
            {
                if(date === today)
                {
                    $(".pitchOverview").html("For today, no pitch is booked.");
                }
                else
                {
                    $(".pitchOverview").html("On " + formatDate(date) + ", no pitch is booked.");
                }
            }


        }

        catch(err) {
            console.log(err);
            alert(errorNotification);
        }
    }

   /* function generatePitchOverviewTable(data)
    {
        try {
            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</table>";
            let tBody = "<tbody>";

            let headers = "<thead>" +
                "<tr>" +
                "<th>Pitch ID</th>" +
                "<th>Customer Name</th>" +
                "<th>Registration Number</th>" +
                "<th>Booking ID</th>" +
                "<th>Paid?</th>" +
                "<th>Booking Duration</th>" +
                "<th>Count Dogs per Pitch</th>" +
                "</tr>" +
                "</thead>";

            //Create Table Body

            let testDate =  writtenDateToJavaScriptDate("15/01/2018");
            let pitchId="";
            for (let i = 0; i < data.length; i++) {
                if (pitchId !== data[i].pitch_id) {
                    pitchId = data[i].pitch_id;
                    tBody += "<tr>";
                    tBody += "<td>" + getIcon(data[i].type) + " Pitch " + data[i].pitch_id;

                    let startDate = writtenDateToJavaScriptDate(formatDate(data[i].stay_start_date));
                    let endDate = writtenDateToJavaScriptDate(formatDate(data[i].stay_end_date));
                    // if statement goes through every booking timeframe and looks if the date today lies within the booking timeframe
                    if (testDate <= endDate && startDate <= testDate) {
                        tBody += "<td>" + data[i].first_name + " " + data[i].last_name + "</td>";
                        tBody += "<td>" + data[i].registration + "</td>";
                        tBody += "<td>" + data[i].booking_id + "</td>";
                        tBody += "<td>" + formatPaid(data[i].paid) + "</td>";
                        tBody += "<td>" + formatDate(data[i].stay_start_date) + " - " + formatDate(data[i].stay_end_date) + "</td>";
                        tBody += "<td>" + data[i].count_dogs + "</td>";
                        tBody += "</td>";

                    }
                    tBody += "</tr>";

                }
            }
            tBody += "</tbody>";
            $(".pitchOverview").html(oTable + headers + tBody + cTable);
        }
        catch(err) {
            console.log(err);
            alert(errorNotification);
        }
    }
        */
        // calculates count of dogs which are on campsite for today
        function calculateCountDogs(rows, date) {

            let countDogs=0;
            for(let i = 0; i < rows.length; i++)
            {
                let startDate = writtenDateToJavaScriptDate(formatDate(rows[i].stay_start_date));
                let endDate = writtenDateToJavaScriptDate(formatDate(rows[i].stay_end_date));
                // if statement goes through every booking timeframe and looks if the date today lies within the booking timeframe
                if(date <= endDate && startDate <= date)
                {
                    countDogs+=rows[i].count_dogs;
                }
            }
            // display the count of dogs on the webpage:
            if (date === today)
            {
              //  $(".countDogs").html("<p> Count of dogs for today: " + countDogs +"</>");
                  $(".countDogs").html("<div class='panel panel-default'> <div class='panel-body'> Count of dogs for today: "+countDogs+" </div>   </div>");
            }
            else{
                $(".countDogs").html("<p> Count of dogs on " + formatDate(date) + ": " + countDogs +"</p>");
            }

        }


/*
    getBookingForCountDogs();

    let today = new Date();
    let rowsBooking = "";


    $('#Count').click(function () {
        let date = document.forms[0].date.value;
        if(generalDateValidityCheck(date))
        {
            // generating date in correct format for calculaing count of dogs:
            let dateForJavaScript =  writtenDateToJavaScriptDate(date);
            calculateCountDogsForSpecificDate(dateForJavaScript, date);
        }
        else
        {
            alert("Your given date has the wrong format.");
        }
    });

    function getBookingForCountDogs() {
        try {
            let query = "SELECT count_dogs, stay_start_date, stay_end_date FROM bookings";
            // executing select all booking data for calculating count of dogs

            $.ajax({
                url: "/select-db-query",
                type: "POST",
                data: {"query": query},
                success: function (rows) {
                    //alert(Date.parse(writtenDateToJavaScriptDate(formatDate(rows[2].stay_start_date))));
                    // alert(Date.parse(new Date()));
                    rowsBooking=rows;
                    calculateCountDogs(rowsBooking, today);

                },
                error: function (error) {
                    console.log("Ajax request error : " + error);
                    alert(errorNotification);
                }
            })
        }
        catch (err) {
            console.log(err);
            alert(errorNotification);
        }
    }
// calculates count of dogs which are on campsite for today
    function calculateCountDogs(rows, date) {

        let countDogs=0;
        for(let i = 0; i < rows.length; i++)
        {
            let startDate = writtenDateToJavaScriptDate(formatDate(rows[i].stay_start_date));
            let endDate = writtenDateToJavaScriptDate(formatDate(rows[i].stay_end_date));
            // if statement goes through every booking timeframe and looks if the date today lies within the booking timeframe
            if(date <= endDate && startDate <= date)
            {
                countDogs+=rows[i].count_dogs;
            }
        }
        // display the count of dogs on the webpage:
        $(".countDogsCurrently").html("Current count of dogs: " + countDogs);
    }
// calculates count of dogs which are on campsite for a specific date
    function calculateCountDogsForSpecificDate(dateForJavaScript, date) {

        let countDogs=0;
        for(let i = 0; i < rowsBooking.length; i++)
        {
            let startDate = writtenDateToJavaScriptDate(formatDate(rowsBooking[i].stay_start_date));
            let endDate = writtenDateToJavaScriptDate(formatDate(rowsBooking[i].stay_end_date));
            if(dateForJavaScript <= endDate && startDate <= dateForJavaScript)
            {
                countDogs+=rowsBooking[i].count_dogs;
            }
        }
        $(".countDogsForDate").html("Count of dogs on " + date + " : " + countDogs);
    }
*/

});