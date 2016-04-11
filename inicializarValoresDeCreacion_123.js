(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    acciones.crearordendeservicio = crearordendeservicio;



    function crearordendeservicio() {
        var query = acciones.getQuery();
        acciones.clearshow('crear_secundaria');
        $('#crear_d_ordendeservicio_id').val(query.id).trigger('change');
    }



})();



function  inicializarValoresDeCreacion() {

}
