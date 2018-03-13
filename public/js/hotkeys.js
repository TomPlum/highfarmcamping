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
        if (e.ctrlKey && e.altKey && e.keyCode === 68) {
            window.location.href = "/";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 66) {
            window.location.href = "/book";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 67) {
            window.location.href = "/customer-overview";
        } else if (e.ctrlKey && e.altKey && e.keyCode === 72) {
            window.location.href = "/help";
        }
    };
})(jQuery);