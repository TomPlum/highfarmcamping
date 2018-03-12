$(document).ready(function () {


    //Call DB for Pitches & relation
    getPitches();
    getPitchBookings();

    //Initialize the DateRanger of the Booking
    $(function() {
        $('input[name="selectPitches"]').daterangepicker({
            "opens": "right",
            "showDropdowns": true
        });
    });


    $("input:checkbox").on('click', function () {
        // in the handler, 'this' refers to the box clicked on
        let $box = $(this);
        if ($box.is(":checked")) {
            // the name of the box is retrieved using the .attr() method
            // as it is assumed and expected to be immutable
            let group = "input:checkbox[name='" + $box.attr("name") + "']";
            // the checked state of the group/box on the other hand will change
            // and the current value is retrieved using .prop() method
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });
});

/*************************************/
/* --- Global Variables -------------*/
/*************************************/
let pitches = [];
let pitchBookings = [];

//should contain max. 3 currentBooking, each one has a pitch id, stard-date and end-date example:

/* For future use
let allBookings = [
    {
        pitchID: "",
        startDate: "",
        endDate: "",
    },
    {
        pitchID: "",
        startDate: "",
        endDate: "",
    },
    {
        pitchID: "",
        startDate: "",
        endDate: "",
    },
];
let selectingPitch = false;
let lastSelection;
*/

let selectedPitches = [];

function writeBooking() {
    document.getElementById("currentBooking").innerHTML = allBookings[0].pitchID+allBookings[0].startDate+allBookings[0].endDate+"<br>"+
        allBookings[1].pitchID+allBookings[1].startDate+allBookings[1].endDate+"<br>"+
        allBookings[2].pitchID+allBookings[2].startDate+allBookings[2].endDate+"<br>";


}


/*************************************/
/* --- Book a pitch -----------------*/

/*************************************/

function populatePitchSelection() {
    console.log(pitches);
    let filter = $("input:checked").val();
    console.log("Filtering Pitches by " + filter + "...");

    let dates = $('#date-range').val().split("-");
    let dateFrom = dates[0];
    let dateTo = dates[1];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const oTable = "<table class='pitch-availability'>";
    const cTable = "</table>";
    let headers = "<tr><th>Pitch</th>";
    const allDates = getDatesInRange(dateFrom, dateTo);

    for (let i = 0; i < allDates.length; i++) {
        headers += "<th>" + months[allDates[i].getMonth()] + " " + allDates[i].getDate() + "<sup>" + getDateSuffix(allDates[i].getDate()) + "</sup></th>";
    }
    headers += "</tr>";

    const tentIcon = "<span class='glyphicon glyphicon-tent'></span>";
    const mhomeIcon = "<span class='fa fa-truck'></span>";
    const caravanIcon = "<span class='fa fa-car'></span>";
    const all = "<span class='glyphicon glyphicon-tent'></span> " + " <span class='fa fa-truck'></span> " + " <span class='fa fa-car'></span>";

    let body = "";
    for (let i = 0; i < pitches.length; i++) {
        if (pitches[i].type === filter || pitches[i].type === "all" || filter === undefined) {
            body += "<tr>";
            for (let j = 0; j < allDates.length + 1; j++) {
                //First Column (Pitch Details)
                if (j === 0) {
                    let icon;
                    switch (pitches[i].type) {
                        case "tent":
                            icon = tentIcon;
                            break;
                        case "motorhome":
                            icon = mhomeIcon;
                            break;
                        case "caravan":
                            icon = caravanIcon;
                            break;
                        default:
                            icon = all;
                    }
                    body += "<td class='pitch-details'>Pitch " + pitches[i].pitch_id + "<br>" + icon + "</td>";
                } else {
                    let available = checkAvailability(pitches[i], allDates[j - 1]);
                    if (available === true) {
                        body += "<td class='available-pitch'></td>";
                    } else {
                        body += "<td class='not-available-pitch'></td>";
                    }
                }
            }
            body += "</tr>";
        }

    }

    $(".pitch-selection").html(oTable + headers + body + cTable);
    $("#selectPitches").css("visibility", "visible");
    $("#selectPitches").val($("#date-range").val());


    //Make fields selectable
    let rows = document.getElementById('pitchSelection').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (i = 0; i < rows.length; i++) {
        rows[i].addEventListener('click', function () {

            let selectedPitch = this.getElementsByTagName("td")[0].innerHTML.substring(0, this.getElementsByTagName("td")[0].innerHTML.indexOf("<"));

            if (!selectedPitches.includes(selectedPitch) && selectedPitches.length === 3) {
                alert("Your are not allowed to select more than 3 pitches");
            } else {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");

                    for (let i = 0; i < selectedPitches.length; i++) {

                        if (selectedPitch === selectedPitches[i]) {
                            selectedPitches.splice(i, 1);
                        }
                    }
                } else {
                    let dates = $('#selectPitches').val().split("-");
                    if (checkIfPitchIsFree()) {
                        this.classList.add("selected");
                        selectedPitches.push(selectedPitch);
                    } else {
                        alert("This pitch is not free. Select another pitch or change your date.");
                    }

                }
            }


        });
    }


    //Fuck my life
    /*
    //iterate through the colums of a row
    //iterate through the colums of a row
    //x=1 because first row should not be selectable
    for (let x = 1; x < columsPerRow.length; x++) {

        //check if this date is available
        if (columsPerRow[x].classList.contains("available-pitch")) {
            columsPerRow[x].addEventListener('click', function () {

                //get DAte of selected Cell
                let selectedDate = allDates[this.cellIndex - 1];
                console.log(selectedDate);

                //get Pitch ID of selected Cell
                let selectedPitch = rows[this.parentNode.rowIndex].getElementsByTagName("td")[0].innerHTML.substring(0, rows[this.parentNode.rowIndex].getElementsByTagName("td")[0].innerHTML.indexOf("<"));
                console.log(selectedPitch);








                console.log(selectingPitch);

                if(!selectingPitch){
                    lastSelection = selectedPitch;

                    if (this.classList.contains("selected")) {
                        this.classList.remove("selected");
                    } else {
                        this.classList.add("selected");
                    }



                }

                selectingPitch = true;



                if(selectingPitch){

                    if(selectedPitch === lastSelection) {


                        if (this.classList.contains("selected")) {
                            this.classList.remove("selected");
                        } else {
                            this.classList.add("selected");

                            selectingPitch = true;
                        }
                    } else {
                        alert("Please finish your selection before continuing!");
                    }
                } else {


                }

                writeBooking();


            });
        }
    }*/

    function checkIfPitchIsFree() {
        return true;
    }


}

function getDatesInRange(start, end) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    let dates = [];

    while (true) {
        dates.push(new Date(startDate));
        if (Date.parse(dates[dates.length - 1]) === Date.parse(endDate)) {
            break;
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
}

function checkAvailability(pitch, date) {
    for (let pitchBooking of pitchBookings) {
        if (pitchBooking.pitch_id === pitch.pitch_id) {

            if (date >= convertDate(pitchBooking.stay_start_date) && date <= convertDate(pitchBooking.stay_end_date)) {
                return false;
            }
        }
    }
    return true;
}

function convertDate(date) {
    return new Date(date);
}


/*************************************/
/* --- DB Calls ----- ---------------*/
/*************************************/

//Booking
function bookPitches() {

    for(let booking of allBookings){
        if(booking.pitchID!=""){
            $.ajax({
                url: "/insert-customer", //use an existing ajaxCall
                type: "POST",
                data: {"query": query},
                success: function (err, rows) {

                },
                error: function (error) {
                    console.log("Error inserting date into the database", error)
                }
            });
        }
    }

}


//Inner join of bookings and pitches
function getPitchBookings() {
    $.ajax({
        url: "/get-PitchBookings",
        type: "POST",
        success: function (rows) {
            pitchBookings = rows;
        },
        error: function (error) {
            console.log("Error getting pitches", error)
        }
    });
}

function getPitches() {
    $.ajax({
        url: "/get-pitches",
        type: "POST",
        success: function (rows) {
            pitches = rows;
            console.log(pitches);
        },
        error: function (error) {
            console.log("Error getting pitches", error)
        }
    });
}

function insertBooking() {
    try {
        // generating booking date:
        let date = formatDateFromMilliseconds(new Date());
        date = dateConverter(date);
        let query = "INSERT bookings (customer_id, count_dogs, stay_start_date, stay_end_date, payment_type, payment_total, paid, type, booking_date) VALUES (4,2,\"2018-01-08\",\"2018-01-09\", \"cash\", 50.00, 0,\"phone-booking\",\"" + date + "\");";
        // executing insert a booking
        $.ajax({
            url: "/db-query",
            type: "POST",
            data: {"query": query},
            success: function (err) {
                console.log("Ajax Request successful");
                if (JSON.stringify(err) === "\"\"") {
                    console.log("db-query successful");
                    alert("SUCCESS");
                }
            },
            error: function (error) {
                console.log("Ajax request error : " + error);
                alert(errorNotification);
            }
        })
    }
    catch(err)
    {
        console.log(err);
    }
}
