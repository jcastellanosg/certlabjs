(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    acciones.crearregistro = crearregistro;

    var tipodeacccion;

    function crearregistro(tipo, event) {
       subirArchivos.tipo = tipo;
        var botonActivar = $(event),
            url = window.urlcrear,
            accionCallBack = subirArchivos,
            forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form "),
            elementos = forma.find("[data-facturacion-input]");
        acciones.enviarAlServer(botonActivar, url, accionCallBack, elementos,tipo);
    }


    function subirArchivos(resultado) {
        if (resultado.OK === 'OK') {
            var tipo = subirArchivos.tipo;
            var forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form ");
            var idFile = forma.find('input[data-facturacion-input="files"]').attr('id');
            if (idFile) {
                subirArchivo(idFile);
            }
        } else {
            displayerrormodal(resultado.Mensaje);
        }
    }

    function subirArchivo(id) {
        var objUploadFiles = window["objUploadFiles_" + id];
        if (objUploadFiles && objUploadFiles.directorio) {
            var directorio = "&directorio=" + objUploadFiles.directorio;
            var url = urlcrear.replace('task=listar.crear', 'task=Uploadfiles.uploadFiles&directorio=' + directorio);
            objUploadFiles.setOption("url", url);
            objUploadFiles.bind("UploadComplete",UploadComplete);
            objUploadFiles.bind("Error",Error);
            objUploadFiles.start();
        }
    }

    function  UploadComplete(up,files){
        acciones.show('principal');
        $("#datatable_ajax").DataTable().draw();
    }

    function error (up, args) {
        displayerrormodal(args);
    }

// recuperar de la url campo & id
    function get_query() {
        var url = location.search;
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0, result = {}; i < qs.length; i++) {
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]); //generar todas las variables
        }
        return result;
    }

})();


function inicializarValoresDeCreacion() {


}


