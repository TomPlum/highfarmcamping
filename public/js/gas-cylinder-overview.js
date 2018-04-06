$(document).ready(() => {
    startLoadingAnimation();
    $.ajax({
        url: "/gas-cylinder-overview",
        type: "POST",
        async: true,
        success: function(data) {
            stopLoadingAnimation();
            renderGasCylinderOverview(data)
        },
        error: function(err) {
            console.log(err);
        }
    }) ;
});

function renderGasCylinderOverview(data) {
    const oTable = "<table class='table table-hover table-striped table-condensed'>";
    const cTable = "</table>";
    let tBody = "<tbody>";

    let headers = "<thead>" +
        "<tr>" +
        "<th>gas_cylinder_id</th>" +
        "<th>cylinder_reference</th>" +
        "<th>size</th>" +
        "<th>condition</th>" +
        "</tr>" +
        "</thead>";

    for (let i = 0; i < data.length; i++) {
        tBody += "<tr>";
        tBody += "<td>" + data[i].gas_cylinder_id + "</td>";
        tBody += "<td>" + data[i].cylinder_reference + "</td>";
        tBody += "<td>" + data[i].size + "</td>";
        tBody += "<td>" + data[i].condition + "</td>";
    }

    $("#gas-cylinder-overview").html(oTable + headers + tBody + cTable);
    console.log(data);
}
