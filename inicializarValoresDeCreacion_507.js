(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    acciones.crearregistro = crearregistro;

    var tipodeacccion;

    function crearregistro(tipo, event) {
       subirArchivos.tipo = tipo;
        var botonActivar = $(event),
            url = window.urlcrear.replace('listar.crear','listar.crearCliente'),
            //accionCallBack = subirArchivos,
            accionCallBack = clienteActualizado,
            forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form "),
            elementos = forma.find("[data-facturacion-input]");
            capturaDatos(botonActivar, url, accionCallBack, elementos,tipo);
    }

    function capturaDatos(botonActivar, url, accionCallBack, elementos, tipo) {
        var rowvalues = {},
            queryurl =  acciones.getQuery();
        $.each(elementos, function (i, campo) {
            if (campoSeDebeGrabar(campo)) {
                var tipo = $(campo).attr('data-facturacion-input');
                if (acciones.recoverValor.hasOwnProperty(tipo)) {
                    var valor = acciones.recoverValor[tipo](campo);
                    var id = $(campo).attr('data-facturacion-id');
                    var idjq = $(campo).attr('id');
                    setValor(rowvalues, id, valor, tipo, idjq);
                } else {
                    displayerrormodal('no se puede editar y o crear tipo: ' + tipo);
                }
            }
        });
        var campo = queryurl['campo'];
        var id = queryurl['id'];
        if (campo !== undefined)
            rowvalues[campo] = id;
        rowvalues['TipoOperacion'] = tipo;
        if (validateCliente(rowvalues)) {
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    function validateCliente(rowvalues) {

        var resultado = true;
        if (rowvalues['c_direccion'].trim() == '') {
            displayerror("Warning", 'Direccion Errada');
            resultado = false;
        }
        if (rowvalues['c_nit'].trim() == '') {
            displayerror("Warning", 'Nit Errado');
            resultado = false;
        }
        if (rowvalues['c_email'].trim() == '') {
            displayerror("Warning", 'email Errado');
            resultado = false;
        }
        if (rowvalues['c_nombre'].trim() == '') {
            displayerror("Warning", 'Falta el Nombre');
            resultado = false;
        }
        if (isNaN(rowvalues['c_tipo']) || [1, 2].indexOf(parseInt(rowvalues['c_tipo'])) < 0) {
            displayerror("Warning", 'Tipode cliente Errado');
            resultado = false;
        }
        return resultado;
    }


    function subirArchivos(resultado) {
        console.log(resultado);
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

    function  clienteActualizado(){
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

    function campoSeDebeGrabar(campo) {
        var opciones = $(campo).attr('data-facturacion-grabar');
        return parseInt(opciones) ? true : false;
    }

    function setValor(rowvalues,id,valor,tipo,idjq) {
        var idf,fechaInicial, fechaFinal;
        if (tipo == 'rangofechasavanzadofuturo') {
            idf = id.replace('inicial', 'final');
            valor = valor[0].split("-");
            fechaInicial =  valor[0] ? moment(valor[0]).format("YYYY-MM-DD"): "";
            fechaFinal =  valor[1] ? moment(valor[1]).format("YYYY-MM-DD"): "";
            rowvalues[id] = fechaInicial;
            rowvalues[idf] = fechaFinal;
            idjq = idjq.replace("inicial","final").replace("grupo_","");
            $("#" + idjq ).val(fechaFinal);

        } else {
            rowvalues[id] = valor[0];
        }
    }

function calcularCalificacion(row){
    var promedio ;
    row.c_atencion = isNaN(parseInt(row.c_atencion)) ? 1 : parseInt(row.c_atencion);
    row.c_calidad =  isNaN(parseInt(row.c_calidad)) ? 1 : parseInt(row.c_calidad);
    row.c_cumplimiento =  isNaN(parseInt(row.c_cumplimiento)) ? 1 : parseInt(row.c_cumplimiento);
    row.c_descuentos =  isNaN(parseInt(row.c_descuentos)) ? 1 : parseInt(row.c_descuentos);
    row.c_documentacion =  isNaN(parseInt(row.c_documentacion)) ? 1 : parseInt(row.c_documentacion);
    row.c_experiencia =  isNaN(parseInt(row.c_experiencia)) ? 1 : parseInt(row.c_experiencia);
    row.c_formadepago =  isNaN(parseInt(row.c_formadepago)) ? 1 : parseInt(row.c_formadepago);
    row.c_garantia =  isNaN(parseInt(row.c_garantia)) ? 1 : parseInt(row.c_garantia);
    row.c_precios =  isNaN(parseInt(row.c_precios)) ? 1 : parseInt(row.c_precios);
    row.c_serviciotecnico =  isNaN(parseInt(row.c_serviciotecnico)) ? 1 : parseInt(row.c_serviciotecnico);
    promedio = row.c_atencion + row.c_calidad + row.c_cumplimiento + row.c_descuentos + row.c_documentacion ;
    promedio  += row.c_experiencia + row.c_formadepago + row.c_garantia +  row.c_precios + row.c_serviciotecnico;
    return (promedio /10);
}

})();


function inicializarValoresDeCreacion() {


}


