$(document).ready(() => {





    let selectedRowValue="";





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

        if(selectedRowValue !== undefined){
            window.location = "/edit-cylinder";
        }
        else
        {
            alert("To continue, please select a customer and click the button again.")
        }

    }
   

});