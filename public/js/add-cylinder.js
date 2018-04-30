
// This file is to add a cylinder to the database

$(document).ready(() => {

    $('#btnAddCylinder').click(function () {

        let valide = validityCheck();
        // if reference is given, then execute INSERT statement:
        if(valide){
            let query = "INSERT into gas_cylinder_overview (cylinder_reference, size, `condition`, location) VALUES (\"" +
                document.forms[0].reference.value + "\",\"" +
                document.forms[0].size.value + "\",\"" +
                document.forms[0].condition.value + "\",\"" +
                document.forms[0].location.value + "\");";

            $.ajax({
                url: "/insert-cylinder",
                type: "POST",
                data: {"query": query},
                success: function () {
                    $("#addCylinderForm").css("visibility","hidden");
                    $("#alertBoxContainer").css("visibility","visible");
                },
                error: function (error) {
                    console.log("Error inserting data into the database", error);
                    alert(errorNotification);
                }
            });

        }
        // if reference is not given, mark this input box red:
        else{
            $('.error').text("");
            for (let error of errors){
                $('.error').append(error+"<br>");
            }

        }
    });
    // displays reference input box red if empty after clicking add cylinder:
    function validityCheck(){

        let validity = true;

        //Validate inputs
        if(document.forms[0].reference.value === ""){
            validity = false;
            $('input[name=reference]').addClass("errorInput");
        }else{
            $('input[name=reference]').removeClass("errorInput");
        }

        return validity;

    }
});

$('#btnCancelCylinder').click(function () {

    window.location.href = "/gas-cylinder-overview";
});


// This file is to add a cylinder to the database

$(document).ready(() => {

    $('#btnCancelButton').click(function () {
        window.location.href="/gas-cylinder-overview";
    });

    $('#btnAddCylinder').click(function () {

        let valide = validityCheck();
        // if reference is given, then execute INSERT statement:
        if(valide){
            let query = "INSERT into gas_cylinder_overview (cylinder_reference, size, `condition`, location) VALUES (\"" +
                document.forms[0].reference.value + "\",\"" +
                document.forms[0].size.value + "\",\"" +
                document.forms[0].condition.value + "\",\"" +
                document.forms[0].location.value + "\");";

            $.ajax({
                url: "/insert-cylinder",
                type: "POST",
                data: {"query": query},
                success: function () {
                    $("#addCylinderForm").css("visibility","hidden");
                    $("#alertBoxContainer").css("visibility","visible");
                },
                error: function (error) {
                    console.log("Error inserting data into the database", error);
                    alert(errorNotification);
                }
            });

        }
        // if reference is not given, mark this input box red:
        else{
            $('.error').text("");
            for (let error of errors){
                $('.error').append(error+"<br>");
            }

        }
    });
    // displays reference input box red if empty after clicking add cylinder:
    function validityCheck(){

        let validity = true;

        //Validate inputs
        if(document.forms[0].reference.value === ""){
            validity = false;
            $('input[name=reference]').addClass("errorInput");
        }else{
            $('input[name=reference]').removeClass("errorInput");
        }

        return validity;

    }
});