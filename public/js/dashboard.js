// This file enables displaying count of dogs for today and for desired date
$(document).ready(() => {

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


});