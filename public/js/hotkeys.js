(function($) {
    //Find event keycodes here: http://keycode.info/
    //Ctrl 17
    //Shift 16
    //b 66
    //d 68
    //m 77

    window.onkeydown = e => {
        if (e.ctrlKey && e.altKey && e.keyCode === 68) {
            $(".hotkeys").find(".ctrl-d").toggleClass("active-hotkey");
            setTimeout(function() {
                $(".hotkeys").find(".ctrl-d").toggleClass("active-hotkey");
            }, 2000);
            //alert("You pressed Ctrl + Alt + D!");
        } else if (e.ctrlKey && e.altKey && e.keyCode === 66) {
            $(".hotkeys").find(".ctrl-b").toggleClass("active-hotkey");
            setTimeout(function() {
                $(".hotkeys").find(".ctrl-b").toggleClass("active-hotkey");
            }, 2000);
        }
    }
})(jQuery);