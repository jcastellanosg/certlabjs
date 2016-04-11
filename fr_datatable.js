/**
 * Created by jcastellanosg on 5/19/2015.
 */


function Fr_datatables() {
    vm = this;
    vm.init = init;
    vm.data = [];
    vm.fr_searchDataTable = fr_searchDataTable;
    vm.fr_clearsearchDataTable = fr_clearsearchDataTable;


    function init() {
        $(document).on("click", controller);
    }

    function controller(event) {
        var element = $(event.target),
            namemethod = element[0].dataset.method;
        method = vm[namemethod];
        if (method) {
            method(element);
        }
    }

    function fr_searchDataTable(element) {
        elements = element.closest("form").find("[data-fr-input]");
        vm.data = [];
        $.each(elements, addSearchData);
        fr_refreshDataTable('#mainTable');
    }

    function fr_clearsearchDataTable(element){
        elements = element.closest("form").find("[data-fr-input]");
        vm.data = [];
        $.each(elements, addSearchData); vm.data = [];
        fr_refreshDataTable('#mainTable');
    }

    function fr_refreshDataTable(table) {
        table = $(table).DataTable();
        table.draw();
    }

    function addSearchData(index, element) {
        var value;
        elementtag = element.dataset.frInput;
        elementtype = element.dataset.frType;
        if (fr_getValues[elementtag]) {
            value = fr_getValues[elementtag](element);
            if (value) {
                vm.data.push({"field": element.id, "operator": "=", "value": value, "type": elementtype});
            }
        }
    }


}

fr_datatables = new Fr_datatables();
fr_datatables.init();







