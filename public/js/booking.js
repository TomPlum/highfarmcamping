$(document).ready(function () {



    //Collapse
    $('#bookingCard').click(function () {
        $('#collapseOne').collapse('show');
        $('#collapseTwo').collapse('hide');
    });

    $('#customerCard').click(function () {
        $('#collapseOne').collapse('hide');
        $('#collapseTwo').collapse('show');
    });


    //Call DB for Pitches & relation
    getPitches();
    getPitchBookings();


    //Initialize the DateRanger of the Booking
    $(function () {
        $('input[name="selectPitches"]').daterangepicker({
            "opens": "right",
            "showDropdowns": true,
            dateLimit: {
                days: '14'
            },
            locale: {
                format: 'DD/MM/YYYY'
            },
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
let selectedPitches = [];

function hideButton(){
    $('fieldset#changebutton').css("display","none");

}

function showInput(){
    $('fieldset#findbutton').css("display","inline");
    $('fieldset#tentfield').css("display","inline");
    $('fieldset#caravanfield').css("display","inline");
    $('fieldset#motorhomefield').css("display","inline");
    $('fieldset#electricalfield').css("display","inline");
    $('fieldset#daterange').removeAttr('disabled');
    $('fieldset#changebutton').css("display","none");

}
/*************************************/
/* --- Book a pitch -----------------*/
/*************************************/

function populatePitchSelection() {

    $('fieldset#changebutton').css("display","inline");
    $('fieldset#daterange').attr('disabled','disabled');
    $('fieldset#findbutton').css("display","none");

    if ($('input:checked').val()==='tent') {
        $('fieldset#caravanfield').css("display","none");
        $('fieldset#motorhomefield').css("display","none");
        $('fieldset#electricalfield').css("display","none");
    }

    if ($('input:checked').val()==='caravan') {
        $('fieldset#tentfield').css("display","none");
        $('fieldset#motorhomefield').css("display","none");
        $('fieldset#electricalfield').css("display","none");
    }

    if ($('input:checked').val()==='motorhome') {
        $('fieldset#caravanfield').css("display","none");
        $('fieldset#tentfield').css("display","none");
        $('fieldset#electricalfield').css("display","none");
    }

    if ($('input:checked').val()==='electrical') {
        $('fieldset#caravanfield').css("display","none");
        $('fieldset#motorhomefield').css("display","none");
        $('fieldset#tentfield').css("display","none");
    }

    let filter = $("input:checked").val();
    console.log("Filtering Pitches by " + filter + "...");

    let dates = $('#date-range').val().split("-");
    let dateFrom = dates[0];
    let dateTo = dates[1];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const oTable = "<table class='pitch-availability'>";
    const cTable = "</table>";
    let headers = "<tr><th class='hiddenRow'>ID</th><th>Pitch</th>";
    const allDates = getDatesInRange(dateFrom, dateTo);

    for (let i = 0; i < allDates.length; i++) {
        headers += "<th>" + months[allDates[i].getMonth()] + " " + allDates[i].getDate() + "<sup>" + getDateSuffix(allDates[i].getDate()) + "</sup></th>";
    }
    headers += "</tr>";

    const tentIcon = "<span class='glyphicon glyphicon-tent'></span>";
    const mhomeIcon = "<span class='fa fa-truck'></span>";
    const caravanIcon = "<span class='fa fa-car'></span>";
    const all = "<span class='glyphicon glyphicon-tent'></span> " + " <span class='fa fa-truck'></span> " + " <span class='fa fa-car'></span>" + " <span class='fa fa-bolt'></span>";

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
                    //body += "<td class='pitch-details'>" + pitches[i].pitch_name + "<br>" + icon + "</td>";
                    body += "<td class='hiddenRow'>("+ pitches[i].pitch_id +")</td></td><td class='pitch-details'>" + pitches[i].pitch_name +"<br>" + icon + "</td>";
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

    //Set default value of the 2nd datepicker based on the first value of the first datepicker
    $('input[name=selectPitches]').val( $('input[name=date-range]').val().substring(0,10)+"-" + $('input[name=date-range]').val().substring(0,10) );


    //Make fields selectable
    let rows = document.getElementById('pitchSelection').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (i = 0; i < rows.length; i++) {
        rows[i].addEventListener('click', function () {

            let selectedPitchID = this.getElementsByTagName("td")[0].innerHTML.substring(this.getElementsByTagName("td")[0].innerHTML.indexOf("(")+1, this.getElementsByTagName("td")[0].innerHTML.indexOf(")"));
            let selectedPitch;

            for(let pitch of pitches){
                if(pitch.pitch_id == selectedPitchID){
                    selectedPitch = pitch;
                }
            }

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
                    let dates = $('input[name=selectPitches]').val().split("-");

                    let allDates = getDatesInRange(dates[0].trim(), dates[1].trim());
                    let available = true;
                    for(let date of allDates){
                        if(!checkAvailability(selectedPitch,date)){
                            available=false;
                        }

                    }
                    if(available){
                        selectedPitches.push(selectedPitch);
                        this.classList.add("selected");
                    }else{
                        alert("This pitch is not available, please select another pitch or change your date.");
                    }


                }
            }
            block2ndDatePicker();
        });
    }


}

function getDatesInRange(start, end) {
    let startDate = new Date(convertBritishToISO(start));
    let endDate = new Date(convertBritishToISO(end));
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

function calculatePrice() {
    let totalPrice = 0;

    let dates = $('input[name=selectPitches]').val().split("-");
    let allDates = getDatesInRange(dates[0].trim(), dates[1].trim());

    totalPrice += 5 * parseInt($('select[name=dog_amount]').val());

    for (let selectedPitch of selectedPitches) {

        for (let pitch of pitches) {
            if (pitch.pitch_id === selectedPitch.pitch_id) {

                totalPrice += pitch.price * (allDates.length );

            }
        }

    }

    return totalPrice;

}

function block2ndDatePicker() {

    if( selectedPitches.length != 0 ){
        $('input[name=selectPitches]').attr('disabled','disabled');
    }else{
        $('input[name=selectPitches]').removeAttr('disabled');
    }


}


/*************************************/
/* --- DB Calls ----- ---------------*/
/*************************************/

//Booking
$('#next').click(function () {


    if (validityCheck()){

        book();
    } else {
        $('#error').text("");
        for (let error of errors) {
            $('#error').append(error + "<br>");
        }
    }


});

function book() {


    //get selected Dates
    let dates = $('input[name=selectPitches]').val().split("-");
    let data = {
        customerData:
            {
                firstName: $('input[name=first_name]').val(),
                lastName: $('input[name=last_name]').val(),
                dateOfBirth: dateConverter($('input[name=date_of_birth]').val()),
                email: $('input[name=email_address]').val(),
                homePhoneNumber: $('input[name=home_phone_number]').val(),
                mobilePhoneNumber: $('input[name=mobile_phone_number]').val(),
                registration: $('input[name=registration]').val(),
                addressLine1: $('input[name=address_line_1]').val(),
                addressLine2: $('input[name=address_line_2]').val(),
                idUsed: IDused,
                insertId: insertedID,
            },
        bookingData:
            {
                dogs: 0,
                startDate: datePickerDateConverter(dates[0].trim()),
                endDate: datePickerDateConverter(dates[1].trim()),
                paymentMethod: $('select[name=payment_method]').val(),
                price: calculatePrice(),
                alreadyPaid: document.getElementById('already_paid').checked,
                type: "phone-booking",
                bookingDate: dateConverter(formatDateFromMilliseconds(new Date()))
            },
        pitchData: selectedPitches
    };


    $.ajax({
        url: "/db-query-booking",
        type: "POST",
        data: {"data": data},
        success: function (bookingID) {
            console.log("Book a pitch successful!");
            alert("Booking successful!");
            window.location.href = "/manage-booking/show-booking?booking_id="+bookingID[0];

        },
        error: function (error) {
            console.log("Error inserting date into the database", error)
        }
    })


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
        },
        error: function (error) {
            console.log("Error getting pitches", error)
        }
    });
}





