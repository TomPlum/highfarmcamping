$(document).ready(function() {

        //Call DB for Pitches & relation
        getPitches();
        getPitchBookings();


        $("input:checkbox").on('click', function() {
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




/*************************************/
/* --- Global Variables -------------*/
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
        headers += "<th>" + months[allDates[i].getMonth()] + " "  + allDates[i].getDate() + "<sup>" + getDateSuffix(allDates[i].getDate()) + "</sup></th>";
    }
    headers += "</tr>";

    const tentIcon = "<span class='glyphicon glyphicon-tent'></span>";
    const mhomeIcon = "<span class='fa fa-truck'></span>";
    const caravanIcon = "<span class='fa fa-car'></span>";
    const all = "<span class='glyphicon glyphicon-ok'></span>";

    let body = "";
    for (let i = 0; i < pitches.length; i++) {
        if(pitches[i].type == filter || pitches[i].type=="all"){
            body += "<tr>";
            for (let j = 0; j < allDates.length + 1; j++) {
                //First Column (Pitch Details)
                if (j === 0) {
                    let icon;
                    switch(pitches[i].type) {
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
                    let available = checkAvailability(pitches[i], allDates[j-1]);
                    if (available === true ){
                        body += "<td class='available-pitch'>1</td>";
                    } else {
                        body += "<td class='not-available-pitch'>1</td>";
                    }
                }
            }
            body += "</tr>";
        }

    }

    $(".pitch-selection").html(oTable + headers + body + cTable);
}

function getDatesInRange(start, end) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    let dates = [];

    while(true) {
        dates.push(new Date(startDate));
        if (Date.parse(dates[dates.length - 1]) === Date.parse(endDate)) {
            break;
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
}

function checkAvailability(pitch, date) {
    for(let pitchBooking of pitchBookings){
        if(pitchBooking.pitch_id == pitch.pitch_id){

            if(date >= convertDate(pitchBooking.stay_start_date) && date <= convertDate(pitchBooking.stay_end_date) ){
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
};

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