
(function () {

    "use strict";

    var acciones = window.FratrisFacturacion.acciones;
    acciones.clearshowcargos = clearshowcargos;

    function clearshowcargos(){
        var query = acciones.getQuery();
        acciones.clearshow('crear_secundaria');
        $("#crear_c_empresa_id").val(query.id).trigger('change');
    }

})();



function  inicializarValoresDeCreacion() {

};
