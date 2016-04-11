(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
 //   acciones.addrowdt = addrowdt;
 //   acciones.edtrowdt = edtrowdt;
 //   acciones.delrowdt = delrowdt;
    acciones.imprimir = imprimir;
    acciones.getDetallesCotizacion = getDetallesCotizacion;
    acciones.guardarcotizacion = guardarcotizacion;

    /**
     * crear el datatable
     */


    if (typeof window.FratrisFacturacion.data === 'undefined') {
        window.FratrisFacturacion.data = {};
    }
    if (typeof window.FratrisFacturacion.data.cotizaciondetalle === 'undefined') {
        window.FratrisFacturacion.data.cotizaciondetalle = {};
    }

    var t, tipo,
        dtcontainer,
        containertotales = 'Crear_totales';

    $("[data-facturacion-accion='clearshow_crear#secundaria']").click(crearDtCotizacion);
    var cotizaciondetalle = window.FratrisFacturacion.data.cotizaciondetalle;
    cotizaciondetalle.encabezado = {
        //Consecutivo: 'd_id',
        Producto: 'd_producto',
        Cantidad: 'd_cantidad'
    };
    cotizaciondetalle.data = [];

    function crearDtCotizacion() {
        dtcontainer = 'Crear_dtsecundaria';
        containertotales = 'Crear_totales';
        cotizaciondetalle.data = [];
        tipo = 'crear';
        refreshTable();
    }

    //$('select').on('change', cambioSelect);
    $("[data-facturacion-accion*='editar_editar#secundaria_']").live('click', acciones.getDetallesCotizacion);
    $('#Editar_documento').text('Enviar email');
    $('#Crear_documento').text('Guardar Requisicion');
    $("#Editar_dataempresa").remove();
    $("#Crear_dataempresa").remove();
    $("#Editar_TextoEncabezado").remove();
    $("#Crear_TextoEncabezado").remove();
    //$("#bt_Editar_imprimir").remove();
    $("#bt_Crear_imprimir").remove();
    $("button[data-facturacion-accion='clearshow_editar#terciaria']").remove();
    $('#Editar_dtsecundaria tr').find('th:last-child, td:last-child').remove();
    $('#Editar_dtsecundaria tr').find('th:last-child, td:last-child').remove();

    function cambioSelect(event) {
        var id = $(event.target).attr('data-facturacion-id');
        if (typeof id !== "undefined") {
            var metodo = "cambio_" + id;
            if (acciones.hasOwnProperty(metodo)) {
                acciones[metodo](event);
            }
        }
    }

    function inicializaValores(registro) {
        var elementos = $("div[data-facturacion-pantalla ='" + tipo + "_terciaria'] form").find("[data-facturacion-tipo = 'input']");
        $.each(elementos, function (index, elemento) {
            var id = $(elemento).attr('data-facturacion-id');
            var tipo = $(elemento).attr('data-facturacion-input');
            if (registro.hasOwnProperty(id) && acciones.resetValor.hasOwnProperty(tipo)) {
                var valor = registro[id];
                acciones.resetValor[tipo]({elemento: elemento, valor: valor});
            }
            else
                alert("error: " + tipo + " elemento :" + id);
        });
    }

    function delrowdt(parametro, elemento) {
        parametro = parseInt(parametro);
        var row;
        for (var i = 0; i < cotizaciondetalle.data.length; i++) {
            if (parseInt(cotizaciondetalle.data[i].timestamp) === parseInt(parametro)) {
                cotizaciondetalle.data.splice(i, 1);
                t = refreshTable(t);
                break;
            }
        }
    }



    function deshabilitarBotones(opcion) {
        var botones = $("button[data-facturacion-accion ='clearshow_crear#terciaria']");
        $.each(botones, function (i, el) {
            $(el).prop('disabled', opcion);
        });
    }


    function generatecolumnas() {
        var columnas = [];
        for (var columna in cotizaciondetalle.encabezado) {
            columnas.push({
                "searchable": true,
                "orderable": true,
                "name": columna,
                "data": cotizaciondetalle.encabezado[columna]
            })
        }
       // columnas.push({"orderable": false, "name": "Editar", "data": "editar"});
       // columnas.push({"orderable": false, "name": "Borrar", "data": "borrar"});
        return columnas;
    }

    function refreshTable() {
        t = $('#' + dtcontainer).dataTable();
        t.fnClearTable();
        t.fnDestroy();
        $(dtcontainer).empty();
        return acciones.creartabla(dtcontainer, generatecolumnas(), cotizaciondetalle.data);
    }


    function guardarcotizacion() {
        var rowvalues = {},
            url = window.urlcrear.replace('listar.crear', 'sendemail.send'),
            accionCallBack = emailenviado,
            forma = $("div[data-facturacion-pantalla = '" + tipo + "_secundaria']  form"),
            botonActivar = $("#" + capitalizar(tipo) + "_documento"),
            elementos = forma.find("[data-facturacion-tipo = 'input']");
        $.each(elementos, function (i, campo) {
            var tipo = $(campo).attr('data-facturacion-input');
            if (acciones.recoverValor.hasOwnProperty(tipo)) {
                var valor = acciones.recoverValor[tipo](campo);
                var id = $(campo).attr('data-facturacion-id');
                rowvalues[id] = valor[0];
            }
        });
        rowvalues['TipoOperacion'] = 'cotizacion';
        rowvalues['productos'] = cotizaciondetalle.data;
        acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
    }

/*
    function validateCotizacion(rowvalues) {
        var resultado = true;
        if (isNaN(rowvalues.c_estado) || !(parseInt(rowvalues.c_estado) > 0)){
            displayerror("warning", 'Seleccioneun estado valido');
            resultado = false;
        }
        return resultado;
    }
*/
    function emailenviado(data) {
        console.log(data);
        resetDataProductos();
        acciones.show("principal");
        $("#datatable_ajax").DataTable().draw();

    }

    function resetDataProductos() {
        cotizaciondetalle.data = [];
    }

    function getDetallesCotizacion(event) {
        dtcontainer = 'Editar_dtsecundaria';
        containertotales = 'Editar_totales';
        cotizaciondetalle.data = [];
        refreshTable();  // borrar tabla;
        tipo = 'editar';
        var parametros = $(event.target).attr("data-facturacion-accion").split('_');
        var botonActivar, rows,
            url = window.urldatatable.replace('task=listar.getTable', 'task=listar.listarDetallesRequisicion'),
            accionCallBack = addRowsToDatatable,
            data = {c_id : parametros[2]};
        mostrarSpinner(true);
        acciones.ajaxServer(botonActivar, data, url, accionCallBack);
    }


    function addRowsToDatatable(data) {
        cotizaciondetalle.data = [];
        if (data.data !== undefined) {
            for (var i = 0; i < data.data.length; i++) {
                var rowvalues = data.data[i];
                var timestamp = rowvalues.d_id;
                rowvalues['timestamp'] = timestamp;
                rowvalues['DT_RowId_d'] = timestamp;
                cotizaciondetalle.data.push(rowvalues);
            }
        }
        refreshTable();
        mostrarSpinner(false);
    }

    function mostrarSpinner(opcion) {
        if (opcion) {
            $('#Editargifspinner').show();
            $("#Editartabladedatos").hide();
            $("#Editar_documento").hide();
        } else {
            $('#Editargifspinner').hide();
            $("#Editartabladedatos").show();
            $("#Editar_documento").show();
        }
    }

    function capitalizar(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function imprimir(){
        getHtml();
        window.print();
    }

    function getHtml() {

        var textocotizacion,
            texto = [];
        $(".dataTables_length").addClass("hidden-print");
        $(".dataTables_info").addClass("hidden-print");
        $(".dataTables_paginate").addClass("hidden-print");

        textocotizacion = '<h5>Formato de Requisicion de Insumos y Servicios</h5>';
        $('#' + capitalizar(tipo) + 'tipodocumento').html(textocotizacion);
        $("#" + capitalizar(tipo) + "_forcod").html("ADM-P01-F1");
        $("#" + capitalizar(tipo) + "_forver").html("2");
        $("#" + capitalizar(tipo) + "_forvig").html("01/2/2015");

        texto.push("<tr>");
        texto.push("<td>Fecha: "+ $("#editar_c_fechacreacion").val() + "</td>");
        texto.push("<td>Numero: " + $("#editar_c_id").val() + "</td>");
        texto.push("</tr><tr>");
        texto.push("<td >Nombre: "+ $("#editar_e_nombre").val() + " " + $("#editar_e_apellido").val()  + "</td>");
        texto.push("</tr><tr>");
        texto.push("<td>Cargo: "+  $("#editar_g_cargo").val() + "</td>");
        texto.push("</tr>");
        $("#" + capitalizar(tipo) + "_imprimir").html(texto.join("\n"));


     var rowvalues = {};
        var forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form");
        var rowdata = forma.find("[data-facturacion-tipo = 'input']");
        $.each(rowdata, function (i, campo) {
            var tipoinput = $(campo).attr('data-facturacion-input');
            if (acciones.recoverValor.hasOwnProperty(tipoinput)) {
                var valor = acciones.recoverValor[tipoinput](campo);
                var id = $(campo).attr('data-facturacion-id');
                rowvalues[id] = valor[0];
                if (typeof (valor[1]) !== 'undefined') {
                    rowvalues[id + '_txt'] = valor[1];
                }
            }
        });

        $("#" + capitalizar(tipo) + "nrocotizacion").addClass('hidden-print');

    }

})();


function inicializarValoresDeCreacion() {


}


