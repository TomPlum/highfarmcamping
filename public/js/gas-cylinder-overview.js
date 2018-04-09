$(document).ready(() => {
    startLoadingAnimation();

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
        }


        $("#gas-cylinders-overview").html(oTable + headers + tBody + cTable);
    }
});