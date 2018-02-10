function getToday() {
    const today = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let YYYY = today.getFullYear(); //YYYY
    let day = today.getDay(); //0-6 (0 is Sunday)
    let date = today.getDate(); //1-31
    let month = today.getMonth(); //0-11
    console.log(day);

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
    const today = new Date();
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

    $('#current-time').html(HH + ":" + MM + ":" + SS);
}