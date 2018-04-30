$(function() {

    let $formLogin = $('#login-form');
    let $formLost = $('#lost-form');
    let $formRegister = $('#register-form');
    let $divForms = $('#div-forms');
    let $modalAnimateTime = 300;
    let $msgAnimateTime = 150;
    let $msgShowTime = 2000;

    $('#login_register_btn').click( function () { modalAnimate($formLogin, $formRegister) });
    $('#register_login_btn').click( function () { modalAnimate($formRegister, $formLogin); });
    $('#login_lost_btn').click( function () { modalAnimate($formLogin, $formLost); });
    $('#lost_login_btn').click( function () { modalAnimate($formLost, $formLogin); });
    $('#lost_register_btn').click( function () { modalAnimate($formLost, $formRegister); });
    $('#register_lost_btn').click( function () { modalAnimate($formRegister, $formLost); });

    function modalAnimate ($oldForm, $newForm) {
        let $oldH = $oldForm.height();
        let $newH = $newForm.height();
        $divForms.css("height",$oldH);
        $oldForm.fadeToggle($modalAnimateTime, function(){
            $divForms.animate({height: $newH}, $modalAnimateTime, function(){
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    }

    function msgFade ($msgId, $msgText) {
        $msgId.fadeOut($msgAnimateTime, function() {
            $(this).text($msgText).fadeIn($msgAnimateTime);
        });
    }

    function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
        let $msgOld = $divTag.text();
        msgFade($textTag, $msgText);
        $divTag.addClass($divClass);
        $iconTag.removeClass("glyphicon-chevron-right");
        $iconTag.addClass($iconClass + " " + $divClass);
        setTimeout(function() {
            msgFade($textTag, $msgOld);
            $divTag.removeClass($divClass);
            $iconTag.addClass("glyphicon-chevron-right");
            $iconTag.removeClass($iconClass + " " + $divClass);
        }, $msgShowTime);
    }

    //Bind Lost Password Event
    $("#lostPassword").on("click", () => {
        let button = $("#lostPasswordResponseMessage");

        //Add Loading Animation
        button.html("<span class='fa fa-fw fa-spinner fa-pulse'></span> Changing Password...");

        $.ajax({
            type: "POST",
            url: "/lost-password",
            data: {
                username: $("#lostPasswordUsername").val(),
                old: $("#lostPasswordOld").val(),
                newPassword: $("#lostPasswordNew").val(),
                confirm: $("#lostPasswordConfirm").val()
            },
            success: function(data) {
                let buttonHTML;
                if (data.success) {
                    button.addClass("btn-success").removeClass("btn-danger");
                    buttonHTML = "<span class='fa fa-fw fa-check'></span> Success!";
                } else {
                    button.addClass("btn-danger").removeClass("btn-success");
                    buttonHTML = "<span class='fa fa-fw fa-times'></span> " + data.error;
                }

                button.html(buttonHTML);
            },
            error: function(err) {
                console.log(err);
            }
        });
    })
});