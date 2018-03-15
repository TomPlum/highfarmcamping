(function($) {
    //Find event keycodes here: http://keycode.info/
    //Ctrl 17
    //Shift 16
    //b 66
    //c 67
    //d 68
    //m 77
    //h 72

    window.onkeydown = e => {

        if (e.ctrlKey && e.altKey && e.keyCode === 68) {            //D
            window.location.href = "/";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 66) {     //B
            window.location.href = "/book";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 67) {     //C
            window.location.href = "/customer-overview";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 72) {     //H
            window.location.href = "/help";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 79) {     //O
            window.location.href = "/manage-booking/overview";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 69) {     //E
            window.location.href = "/manage-booking/booking-history";
        }
    };
})(jQuery);