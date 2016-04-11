
(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    acciones.clearshowlistadeprecios = clearshowlistadeprecios;

    function clearshowlistadeprecios(){
         getregistro();
    }

    function inicializarcampos(data){

        var empresa = data.data[0]['l_empresa_id'];
        acciones.clearshow('crear_secundaria');
        $("#crear_e_id").val(empresa).trigger('change');
    }

    function getregistro() {
        var botonActivar ,
            url = urldatatable.replace("menu=113", "menu=112").replace("campo=d_listadeprecios_id", "campo=l_id"),
            accionCallBack = inicializarcampos,
            rowvalues;
        acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
    }



})();



function  inicializarValoresDeCreacion() {
   url =  urldatatable.replace("menu=113", "menu=112").replace("campo=d_listadeprecios_id", "campo=l_id").replace("task=listar.crear", "task=listar.gettable");
    var saveData = $.ajax({
        url: url,
        timeout: 10000,
        dataType: 'json',
        success: function (resultData) {
            if (typeof resultData.data[0] == 'object') {
                valores_actuales.push(["e_id",resultData.data[0].l_empresa_id]);
            } else {
                displayerror("warning", resultData.Mensaje);
            }
        },
        error: function (x, t, m) {
            if (t === "timeout") {
                alert("Esta demorando demasiado");
            } else {
                alert('error');
                alert(t);
            }
        }
    });
};
