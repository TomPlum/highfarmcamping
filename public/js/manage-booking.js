// this file loads the booking overview of all bookings to the web page

$(document).ready(() => {
    startLoadingAnimation();

    // selectedRowValue is the stored booking id when clicking on a specific row:
    let selectedRowValue="";

    $.ajax({
        url: "/manage-booking/get-booking-overview",
        type: "POST",
        success: (data) => {
            stopLoadingAnimation();
            renderTable(data);
        },
        error: (err) => {
            console.log(err);
            alert(errorNotification);
        }
    });

    function renderTable(data) {

        try {
            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</table>";
            let tBody = "<tbody>";

            let headers = "<thead>" +
                "<tr>" +
                "<th>Booking ID</th>" +
                "<th>Customer Name</th>" +
                "<th>Booking Date</th>"+
                "<th>Payment Total in £</th>"+
                "<th>Paid?</th>" +
                "<th>Booking Duration</th>" +
                "<th>Booked Pitches</th>"+
                "</tr>" +
                "</thead>";

            //Create Table Body
            for (let i = 0; i < data.length; i++) {
                // if clause to prevent multiple row creating for same booking:
                if (i === 0 || data[i].booking_id !== data[i - 1].booking_id) {
                    tBody += "<tr>";
                    tBody += "<td>" + data[i].booking_id + "</td>";
                    tBody += "<td>" + data[i].first_name + " " + data[i].last_name + "</td>";
                    tBody += "<td>" + formatDate(data[i].booking_date) + "</td>";
                    tBody += "<td>" + data[i].payment_total.toFixed(2) + "</td>";
                    tBody += "<td>" + formatPaid(data[i].paid) + "</td>";
                    tBody += "<td>" + formatDate(data[i].stay_start_date) + " - " + formatDate(data[i].stay_end_date) + "</td>";
                    tBody += "<td>" + getIcon(data[i].type) + " Pitch " + data[i].pitch_id + "&nbsp; &nbsp;";
                    // For the case: several pitches per booking we use the for loop to fill several pitches into the Booked Pitches column:
                    for (let o = i + 1; o <= (i + 3); o++) {
                        if (o < data.length - 1) {
                            if (data[o].booking_id === data[i].booking_id) {
                                tBody += getIcon(data[o].type) + " Pitch " + data[o].pitch_id + "<br>";
                            }
                            else break;
                        }
                        else break;
                    }
                    tBody+="</tr>";
                    tBody += "</td>";

                    /*if (i+1 < data.length -1) {
                        if (data[i].booking_id === data[i + 1].booking_id) {
                            tBody += "<td><button type='button' class='btn-info'>" +
                                " <span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>" +
                                "</button></td>";
                        }
                    }
                    tBody += "</tr>";
                    for (let o = i + 1; o <= (i + 3); o++) {
                        if (o < data.length - 1) {
                            if (data[o].booking_id === data[i].booking_id) {
                                tBody += "<tr class=multiplePitchesRow>";//class=multiplePitchesRow
                                tBody += "<td></td>";
                                tBody += "<td></td>";
                                tBody += "<td></td>";
                                tBody += "<td></td>";
                                tBody += "<td></td>";
                                tBody += "<td>" + getIcon(data[o].type)+ " &nbsp; Pitch " + data[o].pitch_id + "</td>";
                                tBody += "</tr>";
                            }
                            else break;
                        }
                        else break;
                    }
                }*/
                }
            }

            tBody += "</tbody>";
            $(".pitch-booking-overview").html(oTable + headers + tBody + cTable);

            // Make booking rows selectable:
            let rows = document.getElementById('bookingTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (i = 0; i < rows.length; i++) {
                rows[i].addEventListener('click', function () {

                    if (document.getElementById('bookingTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex - 1].getElementsByTagName('td')[0].innerHTML !== selectedRowValue) {
                        selectedRowValue = document.getElementById('bookingTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex - 1].getElementsByTagName('td')[0].innerHTML;

                        let rows2 = document.getElementById('bookingTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                        for (x = 0; x < rows2.length; x++) {
                            rows2[x].classList.remove('selected');
                        }
                        this.classList.add('selected');
                    } else {

                        this.classList.remove('selected');
                        selectedRowValue = undefined;
                    }
                });
            }
        }
        catch(err)
        {
            console.log("Error in renderTable function of manage-booking.js: " + err.toString());
            alert(errorNotification);
        }
    }

    /*
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    Date.prototype.addDays = function(days) {
        let dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };



    function getName() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
    } */


// Goes to booking confirmation of selected booking when clicking show booking confirmation:

    $('#Show').on('click', function(){
        goToShowBookingConfirmation();
    });

    function goToShowBookingConfirmation(){

        if(selectedRowValue !== ""){
            console.log("This is the selectedRowValue :" + selectedRowValue);
            window.location = "/manage-booking/show-booking?booking_id="+selectedRowValue;
        }
        // You have to select a row before you can get the booking confirmation:
        else alert("To continue, please select a booking and click the button again.");

    }

// Navigates to the delete booking page.

    $('#Delete').on('click', function(){
        goToDeleteBooking();
    });

    function goToDeleteBooking(){

        if(selectedRowValue !== ""){
            console.log("This is the selectedRowValue :" + selectedRowValue);
            window.location = "/manage-booking/delete?booking_id="+selectedRowValue;
        }
        // You have to select a row before you can get the booking confirmation:
        else alert("To continue, please select a booking and click the button again.");

    }
// filter Table through ID when inserting values into "search customer through ID" field through JQuery:

    $('#booking_id').keyup(function(){
        let inputValue = document.getElementById("booking_id").value.toLowerCase();
        let table = document.getElementById("bookingTable");
        let tr = table.getElementsByTagName("tr");
        let td;

        // Go through all table rows and search for row with desired ID
        for (let i = 0; i < tr.length; i++) {
            // If inputValue starts with digit, filter ID, if not filter customer name
            if (inputValue.match(/^\d/)) {
                td = tr[i].getElementsByTagName("td")[0];
            }
            else {
                td = tr[i].getElementsByTagName("td")[1];
            }
            if(td) {
                let searchInput = td.innerHTML.toLowerCase();
                if(searchInput.indexOf(inputValue.toLowerCase()) > -1)
                {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    });
});