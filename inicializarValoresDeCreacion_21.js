
(function () {

    "use strict";

    var acciones = window.FratrisFacturacion.acciones;
    acciones.clearshowempleados = clearshowempleados;

    function clearshowempleados(){
        var query = acciones.getQuery();
        acciones.clearshow('crear_secundaria');
        $("#crear_e_empresa_id").val(query.id).trigger('change');
    }

})();



function  inicializarValoresDeCreacion() {

}
