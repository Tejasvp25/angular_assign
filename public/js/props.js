// Custom attributes on elements
$(document).ready(() => {
    $('.submit').click(function () {
        sendMessage();
    });

    $(window).on('keydown', function (e) {
        if (e.which == 13) {
            sendMessage();
            return false;
        }
    });

    $('#addgroup').click(function () {
        console.log("Group added")
        addGroup();
    });

    $('.changeGroup').click(function () {
        console.log("Button clicked!")
        joinGroup();
    });

    $("#profile-img").click(function () {
        $("#status-options").toggleClass("active");
    });

    $(".expand-button").click(function () {
        $("#profile").toggleClass("expanded");
        $("#contacts").toggleClass("expanded");
    });

    $("#status-options ul li").click(function () {
        $("#profile-img").removeClass();
        $("#status-online").removeClass("active");
        $("#status-away").removeClass("active");
        $("#status-busy").removeClass("active");
        $("#status-offline").removeClass("active");
        $(this).addClass("active");

        if ($("#status-online").hasClass("active")) {
            $("#profile-img").addClass("online");
        } else if ($("#status-away").hasClass("active")) {
            $("#profile-img").addClass("away");
        } else if ($("#status-busy").hasClass("active")) {
            $("#profile-img").addClass("busy");
        } else if ($("#status-offline").hasClass("active")) {
            $("#profile-img").addClass("offline");
        } else {
            $("#profile-img").removeClass();
        };

        $("#status-options").removeClass("active");
    });
})