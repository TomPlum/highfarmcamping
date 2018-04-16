$(document).ready(() => {





    let selectedRowValue="";

    let cylinder = [];



    startLoadingAnimation();


//pulls data from database using ajax
    $.ajax({
        url: "/get-gas_cylinder_overview",
        type: "POST",
        success: (data) => {
            stopLoadingAnimation();
            renderGasCylinderOverview(data);
        },
        error: (err) => {
            console.log(err);
            alert(errorNotification);
        }
    });


//renders table to put details in that are pulled from database
    function renderGasCylinderOverview(data) {
        const oTable = "<table class='table table-hover table-striped table-condensed'>";
        const cTable = "</table>";
        let tBody = "<tbody>";

        let headers = "<thead>" +
                        "<tr>" +
                            "<th>Gas Cylinder ID</th>" +
                            "<th>Reference</th>" +
                            "<th>Size</th>" +
                            "<th>Condition</th>" +
                            "<th>Allocated Pitch ID</th>" +
                            "<th>Location</th>" +
                        "</tr>" +
                    "</thead>";

        for (let i = 0; i < data.length; i++) {
            tBody += "<tr>";
            tBody += "<td>" + data[i].gas_cylinder_id + "</td>";
            tBody += "<td>" + data[i].cylinder_reference + "</td>";
            tBody += "<td>" + data[i].size + "</td>";
            tBody += "<td>" + data[i].condition + "</td>";
            if (data[i].allocated_pitch!== null)
            {
                tBody += "<td>" + data[i].allocated_pitch + "</td>"
            }
            else{
                tBody += "<td> Not allocated </td>"
            }
            tBody += "<td>" + data[i].location + "</td>";
        }

//make row selectable
        $(".gas-cylinders-overview").html(oTable + headers + tBody + cTable);



            let rows = document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (i = 0; i < rows.length; i++) {
                rows[i].addEventListener('click', function() {
                    if(document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex-1].getElementsByTagName('td')[0].innerHTML !== selectedRowValue){
                        selectedRowValue = document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex-1].getElementsByTagName('td')[0].innerHTML;

                        let rows2 = document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                        for (x = 0; x < rows2.length; x++) {
                            rows2[x].classList.remove('selected');
                        }
                        this.classList.add('selected');
                    }else{

                        this.classList.remove('selected');
                        selectedRowValue = undefined;
                    }

                });
            }
        }


    $('#Edit').on('click', function(){
        localStorage.setItem("selectedRow", selectedRowValue);
        goToEditCylinders();
    });

    $('#Delete').on('click', function(){
        goToDeleteCylinders();
    });




    function goToDeleteCylinders(){

        if(selectedRowValue !== undefined){
            window.location = "/delete-cylinder";
        }
        else
        {
            alert("To continue, please select a customer and click the button again.")
        }

    }


    function goToEditCylinders(){

        if(selectedRowValue !== ""){
            console.log("This is the selectedRowValue :" + selectedRowValue);
            window.location.href = "/edit-cylinder?gas_cylinder_id="+selectedRowValue;
        }
        else
        {
            alert("To continue, please select a customer and click the button again.")
        }


    }
    // function insertDataInFields(){
    //     console.log(localStorage.getItem("selectedRow"));
    //
    //     //selectedRowValue = parseInt(localStorage.getItem("selectedRow"));
    //     //if selectedRowValue = NULL
    //
    //
    //     for (let cylinder1 of cylinder){
    //         if (cylinder1.gas_cylinder_id === parseInt(selectedRowValue)){
    //             $('input[name=cylinder_reference]').val(cylinder1.cylinder_reference);
    //
    //


                // function insertDataInFields(){
    //     console.log(localStorage.getItem("selectedRow"));
    //
    //     //selectedRowValue = parseInt(localStorage.getItem("selectedRow"));
    //     //if selectedRowValue = NULL
    //     for (let customer1 of customer){
    //         if (customer1.customer_id === parseInt(selectedRowValue)){
    //             $('input[name=first_name]').val(customer1.first_name);
    //             $('input[name=last_name]').val(customer1.last_name);
    //             $('input[name=date_of_birth]').val(dateConverter2Slashes(customer1.date_of_birth));
    //             $('input[name=email_address]').val(customer1.email_address);
    //             $('input[name=address_line_1]').val(customer1.address_line_1);
    //             $('input[name=address_line_2]').val(customer1.address_line_2);
    //             $('input[name=registration]').val(customer1.registration);
    //             $('input[name=home_phone_number]').val(customer1.home_phone_number);
    //             $('input[name=mobile_phone_number]').val(customer1.mobile_phone_number);
    //         }
    //     }
    //
    //
    //
    //
    // }

});