$(document).ready(() => {
    //Instantiate Date and Time on Navbar
    $('#today').html(getToday());

    //Update the time every second (1000ms)
    setInterval(updateTime, 1000);

    //Bind Event To SideBar Collapse (Reduces length of sidebar text upon collapsing)
    const sidebar = $("#sidebarCollapse");
    sidebar.on("click", () => {
        if ($("#sidebar").hasClass("active")) {
            $("#bookingManagement > a").html("<i class='glyphicon glyphicon-calendar'></i>Booking Management");
            $("#customerManagement > a").html("<i class='glyphicon glyphicon-user'></i>Customer Management");
            $("#pitchManagement > a").html("<i class='glyphicon glyphicon-tent'></i>Pitch Management");
            $("#emailManagement > a").html("<i class='glyphicon glyphicon-envelope'></i>Email Management");
            $("#helpAndInformation > a").html("<i class='glyphicon glyphicon-info-sign'></i>Help &amp; Information");
        } else {
            $("#bookingManagement > a").html("<i class='glyphicon glyphicon-calendar'></i>Manage Bookings");
            $("#customerManagement > a").html("<i class='glyphicon glyphicon-user'></i>Manage Customers");
            $("#pitchManagement > a").html("<i class='glyphicon glyphicon-tent'></i>Manage Pitches");
            $("#emailManagement > a").html("<i class='glyphicon glyphicon-envelope'></i>Manage Emails");
            $("#helpAndInformation > a").html("<i class='glyphicon glyphicon-info-sign'></i>Help &amp; Info");
        }
    });
});

function getToday() {
    const today = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let YYYY = today.getFullYear(); //YYYY
    let day = today.getDay(); //0-6 (0 is Sunday)
    let date = today.getDate(); //1-31
    let month = today.getMonth(); //0-11
    return days[day] + " " + date + getDateSuffix(date) + " " + months[month] + " " + YYYY;
}

function getDateSuffix(number) {
    if (number > 3 && number < 21) {
        return "th";
    } else if (number === 1) {
        return "st";
    } else if (number === 2) {
        return "nd";
    } else if (number === 3) {
        return "rd";
    } else {
        switch (number % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }
}

function updateTime() {
    //new Date() = System Current Time
    const today = new Date();

    //Define Hour, if its less than 9, append a 0 before (consistent format)
    let HH = today.getHours();
    if (HH < 10) {
        HH = "0" + HH;
    }

    let MM = today.getMinutes();
    if (MM < 10) {
        MM = "0" + MM;
    }

    let SS = today.getSeconds();
    if (SS < 10) {
        SS = "0" + SS;
    }

    //Update the div in the DOM
    $('#current-time').html(HH + ":" + MM + ":" + SS);
}

function startLoadingAnimation() {
    $("#loading").html("<i class='fa fa-fw fa-3x fa-spinner fa-pulse'></i> <p class='loading-text'>Loading...</p>");
}

function stopLoadingAnimation() {
    $("#loading").html("");
}

