(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones,
        query = acciones.getQuery();
    acciones.crearListadePrecios = crearListadePrecios;

    function crearListadePrecios(){
        getregistro();
    }


    function inicializarcampos(data) {
        var empresa = data.data[0]['c_empresa_id'],
            cliente = data.data[0]['c_id'];
        acciones.clearshow('crear_secundaria');
        $("#crear_e_id").val(empresa).trigger('change');
        $("#crear_d_cliente_id").val(cliente).trigger('change');
    }

    function getregistro() {
        var botonActivar ,
            url = urldatatable.replace("menu=115", "menu=107").replace("campo=d_cliente_id", "campo=c_id"),
            accionCallBack = inicializarcampos,
            rowvalues;
        acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
    }


})();



function  inicializarValoresDeCreacion() {

}
