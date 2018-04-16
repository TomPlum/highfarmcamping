// This file is for displaying the cylinder to be deleted

$(document).ready(() => {


    // variable filters the cylinder ID from the URL:
    let gas_cylinder_id = window.location.search.substring(8);
    let cylinder;
    console.log(gas_cylinder_id);
// We invoke Ajax call for getting a single cylinder
    getCylinderFromDB();


// Listen on the "Delete Cylinder" button and invoke SQL delete statement when clicking

    $('#btnDeleteCylinder').click(function () {
        try {
            $.ajax({
                url: "/delete-cylinder",
                type: "POST",
                data: {"ID": gas_cylinder_id},
                success: function (err) {
                    console.log(err);
                    console.log("Ajax Request successful");
                    if (JSON.stringify(err) === "\"\"") {
                        $("#alertBoxContainer").css("visibility", "visible");
                    }
                    // When delete cylinder is not possible due to referential integrity we invoke a notification for the user:
                    else {
                        $("#alertBoxContainer2").css("visibility", "visible");
                    }

                    $("#deleteCylinderSection").css("visibility", "hidden");
                },
                error: function (error) {
                    console.log("Ajax request error : " + error);
                    alert(errorNotification);
                }
            });
        }
        catch (err) {
            console.log("Error in delete Cylinder Ajax request: " + err.toString());
            alert(errorNotification);
        }
    });


//Ajax call for getting a single cylinder

    function getCylinderFromDB() {
        try {
            $.ajax({
                url: "/get-cylinder",
                type: "POST",
                data: {"ID": gas_cylinder_id},
                success: function (dataP) {
                    cylinder = dataP;
                    console.log(dataP);
                    createTable();
                },
                error: function (error) {
                    console.log("Error receiving data from the database")
                }
            })
        }
        catch (err) {
            console.log("Error in getCylinderFromDB(): " + err.toString());
            alert(errorNotification);
        }
    }

    function createTable() {
        try {

            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</tbody></table>";
            let tBody = "<tbody>";

            //Create Table Header
            let headers = "<thead>" +
                "<tr>" +
                "<th>Gas Cylinder ID</th>" +
                "<th>Reference</th>" +
                "<th>Size</th>" +
                "<th>Condition</th>" +
                "<th>Location</th>" +
                "</tr>" +
                "</thead>";

            for (let i = 0; i < cylinder.length; i++) {
                tBody += "<tr>";
                tBody += "<td>" + cylinder[i].gas_cylinder_id + "</td>";
                tBody += "<td>" + cylinder[i].cylinder_reference + "</td>";
                tBody += "<td>" + cylinder[i].size + "</td>";
                tBody += "<td>" + cylinder[i].condition + "</td>";
                tBody += "<td>" + cylinder[i].location + "</td>";
            }
            $('.cylinder-to-be-deleted').html(oTable + headers + tBody + cTable);

        }
        catch (err) {
            console.log("Error in create table function: " + err.toString());
            alert(errorNotification);
        }
    }
});
