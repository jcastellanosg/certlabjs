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
            accionCallBack = grabacionCompleta,
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
        rowvalues['p_calificacion'] = calcularCalificacion(rowvalues);
        if(!rowvalues['p_calificacion']) {  // si calificacion es falsa o avanza
            return;
        }
        acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
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

    function grabacionCompleta(data){
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
    row.p_atencion = validarcalificacion(row.p_atencion,'atencion');
    if (!row.p_atencion){
        return false;
    }

    row.p_calidad = validarcalificacion(row.p_calidad,'calidad');
    if (!row.p_calidad){
        return false;
    }

    row.p_cumplimiento = validarcalificacion(row.p_cumplimiento,'cumplimiento');
    if (!row.p_cumplimiento){
        return false;
    }

    row.p_descuentos = validarcalificacion(row.p_descuentos,'descuentos');
    if (!row.p_descuentos){
        return false;
    }

    row.p_documentacion = validarcalificacion(row.p_documentacion,'documentacion');
    if (!row.p_documentacion){
        return false;
    }

    row.p_experiencia = validarcalificacion(row.p_experiencia,'experiencia');
    if (!row.p_experiencia){
        return false;
    }

    row.p_formadepago = validarcalificacion(row.p_formadepago,'forma de pago');
    if (!row.p_formadepago){
        return false;
    }

    row.p_garantia = validarcalificacion(row.p_garantia,'garantia');
    if (!row.p_garantia){
        return false;
    }

    row.p_precios = validarcalificacion(row.p_precios,'precios');
    if (!row.p_precios){
        return false;
    }

    row.p_serviciotecnico = validarcalificacion(row.p_serviciotecnico,'servicio tecnico');
    if (!row.p_serviciotecnico){
        return false;
    }

    promedio = row.p_atencion + row.p_calidad + row.p_cumplimiento + row.p_descuentos + row.p_documentacion ;
    promedio  += row.p_experiencia + row.p_formadepago + row.p_garantia +  row.p_precios + row.p_serviciotecnico;
    return (promedio /10);
}

    function validarcalificacion(valor,tipo) {
        valor = parseInt(valor);
        if (isNaN(valor) || valor < 1 || valor > 5) {
            displayerror("warning", 'El indicador ' + tipo + ' debe ser un numero entre 1 y 5');
            return false;
        }
        return valor;
    }

})();


function inicializarValoresDeCreacion() {


}


