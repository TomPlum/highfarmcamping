
$(document).ready(() => {


    //Variables
    let cylinder = [];
    let selectedRowValue;

    $.ajax({
        url: "/get-gas_cylinder_overview",
        type: "POST",


        success: (data) => {


            cylinder = data;
            console.log(cylinder);
            insertDataInFields();

        },
        error: (err) => {
            console.log(err);
            alert(errorNotification);
        }
    });

    function insertDataInFields() {


        selectedRowValue = window.location.search.substring(17);

        //selectedRowValue = parseInt(localStorage.getItem("selectedRow"));
        //if selectedRowValue = NULL
        for (let cylinder1 of cylinder) {
            if (cylinder1.gas_cylinder_id === parseInt(selectedRowValue)) {
                $('output[name=reference]').val(cylinder1.cylinder_reference);
                $('output[name=size]').val(cylinder1.size);
                $('output[name=condition]').val(cylinder1.condition);
                $('output[name=location]').val(cylinder1.location);
                $('input[name=reference]').val(cylinder1.cylinder_reference);
                $('input[name=size]').val(cylinder1.size);
                $('input[name=condition]').val(cylinder1.condition);
                $('input[name=location]').val(cylinder1.location);

            }
        }
    }








    $('#btnUpdateCylinder').click(function () {


        let query;
        query = "UPDATE gas_cylinder_overview SET cylinder_reference=\"" +
            $('input[name=reference]').val() + "\",size=\"" +
            $('input[name=size]').val() + "\",`condition`=\"" +
            $('input[name=condition]').val() + "\",location=\"" +
            $('input[name=location]').val() + "\" WHERE gas_cylinder_id =" + selectedRowValue + ";";

        $.ajax({
            url: "/update-gas_cylinder_overview",
            type: "POST",
            data: {"query": query},
            success: function (data) {

                $("#editCylinderForm").css("visibility","hidden");
                $("#alertBoxContainer").css("visibility","visible");

            },
            error: function (error) {
                console.log("Error inserting data into the database", error)
            }
        });


    // Listen on the "alert box" button
        $('#alertBoxBtn').click(function () {
            window.location.href="/gas-cylinder-overview";
        });
        // $('#alertBoxBtn2').click(function () {
        //     window.location.href="/customer-overview";
        // });

    });

});



