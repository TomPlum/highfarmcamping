$(document).ready(function() {
    $('#today').html(getToday());
    setInterval(updateTime, 1000);

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

function populatePitchSelection() {
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

    let body = "";
    for (let i = 0; i < 5; i++) {
        body += "<tr>";
        for (let j = 0; j < allDates.length + 1; j++) {
            //First Column (Pitch Details)
            if (j === 0) {
                let icon;
                switch(filter) {
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
                        icon = tentIcon;
                }

                body += "<td class='pitch-details'>Pitch" + (i + 1) + icon + "</td>";
            } else {
                let available = Math.floor(Math.random() * 2);
                if (available === 0) {
                    body += "<td class='available'>1</td>";
                } else {
                    body += "<td class='not-available'>1</td>";
                }
            }
        }
        body += "</tr>";
    }

    $(".pitch-selection").html(oTable + headers + body + cTable);
}