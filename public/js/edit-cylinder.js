
$(document).ready(() => {



    let cylinder = [];

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


      let selectedRowValue =window.location.search.substring(17);

        //selectedRowValue = parseInt(localStorage.getItem("selectedRow"));
        //if selectedRowValue = NULL
        for (let cylinder1 of cylinder) {
            if (cylinder1.gas_cylinder_id === parseInt(selectedRowValue)) {
                $('input[name=reference]').val(cylinder1.cylinder_reference);
                $('input[name=size]').val(cylinder1.size);
                $('input[name=condition]').val(cylinder1.condition);

            }
        }

//
// first : take number out of url : save as a variable :  then pass the url to selectedRowValue
//     second :

    }

});




