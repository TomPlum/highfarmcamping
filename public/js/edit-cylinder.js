
$(document).ready(() => {

    $(".gas-cylinders-overview").html(oTable + headers + tBody + cTable);


    if (window.location.pathname.match("gas-cylinders-overview")) {
        let rows = document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        for (i = 0; i < rows.length; i++) {
            rows[i].addEventListener('click', function () {
                if (document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex - 1].getElementsByTagName('td')[0].innerHTML !== selectedRowValue) {
                    selectedRowValue = document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[this.rowIndex - 1].getElementsByTagName('td')[0].innerHTML;

                    let rows2 = document.getElementById('cylindersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                    for (x = 0; x < rows2.length; x++) {
                        rows2[x].classList.remove('selected');
                    }
                    this.classList.add('selected');
                } else {

                    this.classList.remove('selected');
                    selectedRowValue = undefined;
                }

            });
        }
    }


    $('#Edit').on('click', function () {
        localStorage.setItem("selectedRow", selectedRowValue);
        goToEditCylinders();
    });

    $('#Delete').on('click', function () {
        goToDeleteCylinders();
    });

}
