//Global Muuri Grid Variable
let grid;

//Pitch data from AJAX calls needs to be used outside of page load function calls. So stored globally here
let pitchData, pitchInformation;

$(document).ready(() => {
    loadPitchManagementData();

    //Bind Refresh Button
    $("#refreshPitchManagement").on("click", () => {
        refreshPitchManagement();
    });

    //Bind Add Button Form Validation
    $("#addPitchBeforeModal").on("click", () => {
        addFormValidation();
    });

    //Bind Sidebar Menu Collapse (Re-Layout Muuri)
    $("#sidebarCollapse").on("click", () => {
        setTimeout(() => {
            grid.layout();
        }, 200);
    });
});

function loadPitchManagementData() {
    startLoadingAnimation();
    $.ajax({
        url: "/manage-pitches/get-pitches",
        type: "POST",
        async: true,
        success: function(data) {
            console.log(data.pitches);
            console.log(data.info);
            //renderPitchOverview(parsePitchTypes(data.pitches));
            renderPitchOverview(data.pitches);
            stopLoadingAnimation();
            bindGridControlEvents();
            pitchData = data.pitches;
            pitchInformation = data.info;
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function clearPitchManagementGrid() {
    $("#pitchManagementGrid").html("");
}

function renderPitchOverview(data) {
    //DOM Element Responsible For Grid
    const pmg = $("#pitchManagementGrid");

    //Loop Over Pitches
    for (let i = 0; i < data.length; i++) {
        //Create Item Per Pitch
        const item = "<div class='item' data-id='" + data[i].pitch_id + "' data-type='" + data[i].type + "' data-availability='" + data[i].available + "'>" +
                        "<div class='item-content " + data[i].type + "'>" +
                            "<div class='my-custom-content'>" +
                                "<div class='item-header'>" +
                                    "<div class='pitch_id'> Pitch " + data[i].pitch_id + "</div>" +
                                "</div>" +
                                "<div class='item-body vertically-center'>" +
                                    "<div class='pitch_icon'>" + getIcon(data[i].type) + "</div>" +
                                "</div>" +
                                "<div class='item-footer'>" +
                                    "<hr>" +
                                    "<div class='view_pitch'>" +
                                        "<button id='editPitch' onclick='renderPitchBookingHistory(" + data[i].pitch_id + "); renderPitchCurrentlyBooked(" + data[i].pitch_id + ")' type='button' class='pitch-button' title='View Details' data-toggle='modal' data-target='#viewModal'>" +
                                            "<i class='fas fa-fw fa-eye'></i>" +
                                        "</button>" +
                                    "</div>" +
                                    "<div class='edit_pitch'>" +
                                        "<button type='button' onclick='openEditModal(" + data[i].pitch_id +")' class='pitch-button' title='Edit' data-toggle='modal' data-target='#editModal'>" +
                                            "<i class='far fa-fw fa-edit'></i>" +
                                        "</button>" +
                                    "</div>" +
                                    "<div class='seasonal_pricing'>" +
                                        "<button type='button' onclick='getSeasonalPricing()' class='pitch-button' title='Seasonal Pricing' data-toggle='modal' data-target='#seasonalPricingModal'>" +
                                            "<i class='fas   fa-fw fa-snowflake'></i>" +
                                        "</button>" +
                                    "</div>" +
                                    "<div class='delete_pitch'>" +
                                        "<button type='button' onclick='openDeleteModal(" + data[i].pitch_id + ")' class='pitch-button' title='Delete' data-toggle='modal' data-target='#deleteModal'>" +
                                            "<i class='fas fa-fw fa-trash-alt'></i>" +
                                        "</button>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                     "</div>";

        //Append Item HTML To DOM
        pmg.append(item);
    }

    //Muuri Constructor - Initialises Plugin
    grid = new Muuri('.grid', {
        dragEnabled: true,
        layoutOnResize: 100,
        horizontal: true,
        layoutOnInit: true,
        sortData: {
            id: function (item, element) {
                return parseFloat(element.getAttribute('data-id'));
            }
        }
    });

    //Applies Algorithm To Detect If User Is Clicking Or Dragging Item
    [].slice.call(document.querySelectorAll('.item')).forEach(function (elem) {
        elem.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });
}

function bindGridControlEvents() {
    $("#sortGrid").change(() => {
        const val = $("#sortGrid option:selected").val();
        console.log(val);
        if (val === "asc") {
            grid.sort('id');
        } else if (val === "desc") {
            grid.sort('id:desc');
        }
    });

    $("#filterGrid").change(filter);

    $("#addPitch").on("click", () => {
        addPitch();
    })
}

function filter() {
    let filterFieldValue = $("#filterGrid option:selected").val();
    grid.filter(function (item) {
        let element = item.getElement();
        //let isSearchMatch = !searchFieldValue ? true : (element.getAttribute(searchAttr) || '').toLowerCase().indexOf(searchFieldValue) > -1;
        let isPitchType = !filterFieldValue ? true : (element.getAttribute('data-type') || '') === filterFieldValue;
        let isAvailable = !filterFieldValue ? true : (element.getAttribute('data-availability') || '') === filterFieldValue;
        return isPitchType || isAvailable;
    });
}

function parsePitchTypes(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "all") {
            data[i].type = "all-manage";
        }
    }
    return data;
}

function openEditModal(id) {
    const pitch = getPitchById(id);

    //Append Values To Edit Form
    $("#editPitchName").val(pitch.pitch_name);
    $("#editPitchType").val(pitch.type);
    $("#editPitchPrice").val(pitch.price);
    $("#editPitchAvailability").val(pitch.available);
    $("#editPitchElectrical").val(pitch.electrical);

    //Bind Finished Editing Button Event
    $("#finishedEditing").on("click", () => {
        let type = $("#editPitchType").val();
        if (type === "all-manage") {
            type = "all";
        }
        editPitch(id, $("#editPitchName").val(), type, $("#editPitchPrice").val(), $("#editPitchAvailability").val(), $("#editPitchElectrical").val());
    });

    //Load Validation
    editFormValidation();
}

function openDeleteModal(id) {
    //Are you sure?
    $("#areYouSure").html("Are you sure you want to delete Pitch " + id + "?\nThis action cannot be un-done.");

    //Bind Delete Pitch Button Event
    $("#deletePitch").on("click", () => {
        deletePitch(id);
    });
}

function openSeasonalPricingModal(data) {
    //Add Values To Input Fields
    for (let i = 0; i <  data.length; i++) {
        $("#" + data[i].season_name).val(parseFloat(data[i].price_per_pitch));
    }

    //Bind update ajax function here
    $("#updateSeasonalPricing").on("click", () => {
        let values = [];
        for (let i = 0; i < data.length; i++) {
            values.push({
                id: i + 1,
                type: data[i].season_name,
                val: $("#" + data[i].season_name).val()
            });
        }

        updateSeasonalPricing(values);
    });
}


function getSeasonalPricing() {
    $.ajax({
        url: "/manage-pitches/season-pricing",
        type: "POST",
        success: function(seasonalData) {
            openSeasonalPricingModal(seasonalData);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function updateSeasonalPricing(values) {
    console.log(values);
    $.ajax({
        url: "/manage-pitches/update-seasonal-pricing",
        type: "POST",
        data: {val: values},
        success: function(res) {

        },
        error: function(err) {
            console.log(err);
        }
    });
}

function getPitchById(id) {
    for (let i = 0; i < pitchData.length; i++) {
        if (pitchData[i].pitch_id.toString() === id.toString()) {
            return pitchData[i];
        }
    }
}

function formatTextCasing(string) {
    string = string.toString();
    return string.substring(0, 1).toUpperCase() + string.substring(1, string.length);
}

function editPitch(id, name, type, price, availability, electrical) {
    const pitch = getPitchById(id);

    $("#finishedEditing svg").removeClass("fa fa-check").addClass("fa-spin fas fa-circle-notch");

    $.ajax({
        url: "/manage-pitches/edit-pitch",
        type: "POST",
        async: true,
        data: {id: id, name: name, type: type, price: price, availability: availability, electrical: electrical},
        success: function(data) {
            $("#editModal .modal-title").html(data);
            $("#finishedEditing svg").addClass("fa fa-check").removeClass("fa-spin fas fa-circle-notch");
            setTimeout(() => {
                $('#editModal').modal('hide');
                refreshPitchManagement();
            }, 1000);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function deletePitch(id) {
    $.ajax({
        url: "/manage-pitches/delete-pitch",
        type: "POST",
        async: true,
        data: {id: id},
        success: function(data) {
            alert("Successfully Deleted Pitch " + id);
            refreshPitchManagement();
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function renderPitchBookingHistory(id) {
    //Clear Last Selection
    const html = $("#pitchBookingHistory");
    html.html("");
    const oTable = "<div class='history-booking'>" +
                        "<table class='table table-condensed table-striped table-hover'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th>ID</th>" +
                                    "<th>Name</th>" +
                                    "<th>Duration</th>" +
                                    "<th>Paid</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody id='pitchBookingHistoryBody'>";
    html.append(oTable);

    for (let i = 0; i < pitchInformation.length; i++) {
        if (pitchInformation[i].pitch_id === id) {
            const booking_id = pitchInformation[i].booking_id;
            const name = pitchInformation[i].first_name + " " + pitchInformation[i].last_name;
            const duration = formatDate(pitchInformation[i].stay_start_date) + " - " + formatDate(pitchInformation[i].stay_end_date);
            const paid = pitchInformation[i].price;
            const row = "<tr>" +
                            "<td>" + booking_id + "</td>" +
                            "<td>" + name + "</td>" +
                            "<td>" + duration + "</td>" +
                            "<td>£" + paid + "</td>" +
                        "</tr>";
            $("#pitchBookingHistoryBody").append(row);
        }
    }

    const cTable = "</tbody>" +
                "</table>" +
            "</div>";
    html.append(cTable);
}

function renderPitchCurrentlyBooked(id) {
    let currentlyBooked = false;

    for (let i = 0; i < pitchInformation.length; i++) {
        //Find Correct Pitch
        if (pitchInformation[i].pitch_id === id) {
            //Check If Today's Date Falls Within Booking Duration
            const today = new Date();
            const start = pitchInformation[i].stay_start_date;
            const end = pitchInformation[i].stay_end_date;

            if (Date.parse(today) >= Date.parse(start) && Date.parse(today) <= Date.parse(end)) {
                currentlyBooked = true;
            }
        }
    }

    const el = $("#pitchCurrentlyBooked");
    if (currentlyBooked) {
        el.html("This pitch is currently booked by; table of info to be rendered here");
    } else {
        el.html("This pitch is currently available.")
    }
}

function addPitch() {
    const name = $("#addPitchName").val();
    const type = $("#addPitchType").val();
    const price = $("#addPitchPrice").val();
    const available = $("#addPitchAvailability").val();
    const electrical = $("#addPitchElectrical").val();

    $.ajax({
        url: "/manage-pitches/add-pitch",
        type: "POST",
        async: true,
        data: {name: name, type: type, price: price, available: available, electrical: electrical},
        success: function(data) {
            alert("Successfully Added Pitch " + name);
            refreshPitchManagement();
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function editFormValidation() {
    const type = $("#editPitchType");
    type.on("change", () => {
        const val = type.val();
        if (val === "all") {
            //Change Electrical To Yes
            $("#editPitchElectrical").val("1");
        } else {
            //Change Electrical To No
            $("#editPitchElectrical").val("0");
        }
    });

    //Monetary Validation (Price)
    $("#editPitchPrice").on("keyup", () => {
        let val = $("#editPitchPrice").val();
        const valid = /^\d{0,4}(\.\d{0,2})?$/.test(val);

        if(!valid){
            //Remove The Invalid Character
            $("#editPitchPrice").val(val.substring(0, val.length - 1));
        }
    });
}

function addFormValidation() {
    const type = $("#addPitchType");
    type.on("change", () => {
        const val = type.val();
        if (val === "all") {
            //Change Electrical To Yes
            $("#addPitchElectrical").val("1");
        } else {
            //Change Electrical To No
            $("#addPitchElectrical").val("0");
        }
    });

    //Monetary Validation (Price)
    $("#addPitchPrice").on("keyup", () => {
        let val = $("#addPitchPrice").val();
        const valid = /^\d{0,4}(\.\d{0,2})?$/.test(val);

        if(!valid){
            //Remove The Invalid Character
            $("#addPitchPrice").val(val.substring(0, val.length - 1));
        }
    });
}

function refreshPitchManagement() {
    console.log("Number of Muuri Tiles: " + $(".item").length);
    console.log("Pitch Data Length: " + pitchData.length);
    while ($('.item').length > 0) {
        clearPitchManagementGrid();
    }
    loadPitchManagementData();
}