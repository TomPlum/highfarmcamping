// This file enables displaying an overview of all booked pitches and count of dogs for today and for desired date
$(document).ready(() => {

    startLoadingAnimation();


    let today = new Date();

    // rowsPitchOverview stores the data for calculating count of dogs for specific date
    let rowsPitchOverview="";

    // as default pitch overview for today will be displayed:
    getPitchOverview(today);
    // as default count of dogs for today will be displayed:
    getBookingForCountDogs();

    // rowsBooking stores the data for calculating count of dogs for specific date
    let rowsBooking = "";

// Starts generating the pitch overview and count of dogs for desired date

    $('#Show').click(function () {
        let date = document.forms[0].date.value;
        startLoadingAnimation();

        // Testing if input is a valid date
        if(generalDateValidityCheck(date))
        {
            // generating date in correct format for calculating count of dogs:
            let dateForJavaScript =  writtenDateToJavaScriptDate(date);
            generatePitchOverviewTable(rowsPitchOverview, dateForJavaScript);
            calculateCountDogs(rowsPitchOverview, dateForJavaScript);
        }
        else
        {
            stopLoadingAnimation();
            alert("The date has the wrong format or is not defined.");
        }
    });

    // this function gets data from the database for calculating count of dogs
    function getBookingForCountDogs() {
        try {
            let query = "SELECT count_dogs, stay_start_date, stay_end_date FROM bookings";
            // executing select all booking data for calculating count of dogs

            $.ajax({
                url: "/select-db-query",
                type: "POST",
                data: {"query": query},
                success: function (rows) {
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
    // this function gets the data from the database for displaying the overview of all booked pitches on a specific date
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
            stopLoadingAnimation();
            console.log(err);
            alert(errorNotification);
        }
    }
    // generates a HTML table for the list of all booked pitches:
    function generatePitchOverviewTable(data, date)
    {
        try {
            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</table>";
            let tBody = "<tbody>";

            let headers = "<thead>" +
                "<tr>" +
                "<th>Pitch</th>" +
                "<th>Customer Name</th>" +
                "<th>Registration Number</th>" +
                "<th>Booking ID</th>" +
                "<th>Paid?</th>" +
                "<th>Booking Duration</th>" +
                "<th>Dogs per Pitch</th>" +
                "</tr>" +
                "</thead>";

            //Create Table Body

            let nothingBooked=true;
            for (let i = 0; i < data.length; i++) {


                    let startDate = writtenDateToJavaScriptDate(formatDate(data[i].stay_start_date));
                    let endDate = writtenDateToJavaScriptDate(formatDate(data[i].stay_end_date));
                    // if statement goes through every booking timeframe and looks if the date today lies within the booking timeframe
                    if (date <= endDate && startDate <= date) {
                        nothingBooked=false;
                        tBody += "<tr>";
                        tBody += "<td> Pitch " + data[i].pitch_id + " " + getIcon(data[i].type) ;
                        tBody += "<td>" + data[i].first_name + " " + data[i].last_name + "</td>";
                        tBody += "<td>" + data[i].registration + "</td>";
                        tBody += "<td>" + data[i].booking_id + "</td>";
                        tBody += "<td>" + formatPaid(data[i].paid) + "</td>";
                        tBody += "<td>" + formatDate(data[i].stay_start_date) + " - " + formatDate(data[i].stay_end_date) + "</td>";
                        tBody += "<td>" + data[i].count_dogs + "</td>";
                        tBody += "<td id='IdColumn'>" + data[i].pitch_id + "</td>";
                        tBody += "</td>";
                        tBody += "</tr>";
                    }

            }
            tBody += "</tbody>";
            stopLoadingAnimation();

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
            stopLoadingAnimation();
            console.log(err);
            alert(errorNotification);
        }
    }

        // function calculates count of dogs which are on campsite for specific date
        function calculateCountDogs(rows, date) {
            try {
                let countDogs = 0;
                for (let i = 0; i < rows.length; i++) {
                    let startDate = writtenDateToJavaScriptDate(formatDate(rows[i].stay_start_date));
                    let endDate = writtenDateToJavaScriptDate(formatDate(rows[i].stay_end_date));
                    // if statement goes through every booking timeframe and looks if the given date lies within the booking timeframe
                    if (date <= endDate && startDate <= date) {
                        countDogs += rows[i].count_dogs;
                    }
                }
                // display the count of dogs on the webpage:
                if (date === today) {
                    $(".countDogs").html("<p> Count of dogs for today: " + countDogs + "</p>");
                }
                else {
                    $(".countDogs").html("<p> Count of dogs on " + formatDate(date) + ": " + countDogs + "</p>");
                }
            }
            catch(err) {
                console.log(err);
                alert(errorNotification);
            }
        }
// Searching for a booked pitch through its ID
    $('#pitchSearch').keyup(function(){

        try {
        let inputValue = document.getElementById("pitchSearch").value;
        let table = document.getElementById("pitchTable");
        let tr = table.getElementsByTagName("tr");
        let td;
        let noPitch = true;
        // This for loop determines if searched pitch is booked or not
        for (let i = 0; i < tr.length; i++) {
            // idColumn in pitchTable with index 7, it is hidden and only there to deliver the ID for the search engine
            td = tr[i].getElementsByTagName("td")[7];

            if(td) {
                let searchInput = td.innerHTML.toLowerCase();
                if(searchInput.indexOf(inputValue) > -1) {
                    noPitch=false;
                }
            }

        }
        if(noPitch===true)
        {
            if(inputValue !=="")
            {
                if(inputValue.startsWith("0"))
                {
                    alert("No pitch with ID 0 or starting with 0 exists.");
                }
                else {
                    alert("Pitch with ID " + inputValue + " or with ID containing a " + inputValue + " is not booked.");
                }
            }
        } else
         //  pitch is booked, now the row of this pitch will be found through the search engine:
        // For loop: Go through all table rows and search for row with desired ID:
        {
            for (let i = 0; i < tr.length; i++) {

                td = tr[i].getElementsByTagName("td")[7];

                if (td) {
                    let searchInput = td.innerHTML.toLowerCase();
                    if (searchInput.indexOf(inputValue) > -1) {
                        noPitch = false;
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }

            }
        }
        }
        catch(err) {
            console.log(err);
            alert(errorNotification);
        }
    });

});