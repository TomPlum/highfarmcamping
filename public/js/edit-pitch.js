//Global Muuri Grid Variable
let grid;

//Pitch data from AJAX calls needs to be used outside of page load function calls. So stored globally here
let pitchData;

$(document).ready(() => {
    $.ajax({
        url: "/manage-pitches/get-pitches",
        type: "POST",
        async: true,
        success: function(data) {
            renderPitchOverview(parsePitchTypes(data));
            bindGridControlEvents();
            pitchData = data;
        },
        error: function(err) {
            console.log(err);
        }
    });
});

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
                                        "<button id='editPitch' type='button' class='pitch-button' title='View Details' data-toggle='modal' data-target='#viewModal'>" +
                                            "<i class='fas fa-fw fa-eye'></i>" +
                                        "</button>" +
                                    "</div>" +
                                    "<div class='edit_pitch'>" +
                                        "<button type='button' onclick='openEditModal(" + data[i].pitch_id +")' class='pitch-button' title='Edit' data-toggle='modal' data-target='#editModal'>" +
                                            "<i class='far fa-fw fa-edit'></i>" +
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
        layoutOnResize: 200,
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
        editPitch(id, $("#editPitchName").val(), $("#editPitchType").val(), $("#editPitchPrice").val(), $("#editPitchAvailability").val(), $("#editPitchElectrical").val());
    });
}

function openDeleteModal(id) {
    //Are you sure?
    $("#areYouSure").html("Are you sure you want to delete Pitch " + id + "?\nThis action cannot be un-done.");

    //Bind Delete Pitch Button Event
    $("#deletePitch").on("click", () => {
        deletePitch(id);
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
                $('#editModal').modal('hide')
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

        },
        error: function(err) {
            console.log(err);
        }
    });
}