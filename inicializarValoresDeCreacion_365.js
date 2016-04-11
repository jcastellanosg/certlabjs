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
        Consecutivo: 'd_id',
        Producto: 'd_producto',
        Cantidad: 'd_cantidad',
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
    $('#Editar_documento').text('Guardar Requisicion');
    $('#Crear_documento').text('Guardar Requisicion');
    $("#Editar_dataempresa").remove();
    $("#Crear_dataempresa").remove();
    $("#Editar_TextoEncabezado").remove();
    $("#Crear_TextoEncabezado").remove();
    $("#bt_Editar_imprimir").remove();
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

/*
    function addrowdt(parametro, elemento) {
        var campo = $('#'+ tipo + '_d_producto'),
         producto = acciones.recoverValor['textarea'](campo)[0];
         campo = $('#'+ tipo + '_d_cantidad');
        var cantidad = acciones.recoverValor['input'](campo)[0];
        if( producto.trim() === '') {
            displayerror("warning", 'Falta producto');
            return
        }
        if( isNaN(cantidad) || !(parseInt(cantidad) > 0 )) {
            displayerror("warning", 'Falta cantidad');
            return
        }
        var rowvalues = {},
            forma = $(elemento).parents('form:first'),
            rowdata = forma.find("[data-facturacion-tipo = 'input']");
        $.each(rowdata, function (i, campo) {
            var tipo = $(campo).attr('data-facturacion-input');
            if (acciones.recoverValor.hasOwnProperty(tipo)) {
                var valor = acciones.recoverValor[tipo](campo);
                var id = $(campo).attr('data-facturacion-id');
                rowvalues[id] = valor[0];
                if (typeof (valor[1]) !== 'undefined') {
                    rowvalues[id + '_txt'] = valor[1];
                }
            }
        });

        if (rowvalues['DT_RowId_d'].trim() === '' || rowvalues['DT_RowId_d'].trim() === '0') {
            agregarNuevaRowData(rowvalues);
        } else {
            actualizarRowData(rowvalues);
        }
        refreshTable();
        acciones.show(tipo + '_secundaria');
    }

    function agregarNuevaRowData(rowvalues) {
        var timestamp = $.now();
        rowvalues['timestamp'] = timestamp;
        rowvalues['DT_RowId_d'] = timestamp;
        rowvalues['editar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='edtrowdt_" + timestamp + "' class='btn btn-sm btn-info hidden-print'>Editar</button>";
        rowvalues['borrar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='delrowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Borrar</button>";
        cotizaciondetalle.data.push(rowvalues);
    }

    function actualizarRowData(rowvalues) {
        for (var i = 0; i < cotizaciondetalle.data.length; i++) {
            if (parseInt(cotizaciondetalle.data[i]['DT_RowId_d']) === parseInt(rowvalues['DT_RowId_d'])) {
                for (var key in rowvalues) {
                    if (rowvalues.hasOwnProperty(key)) {
                        cotizaciondetalle.data[i][key] = rowvalues[key];
                    }
                }
            }
        }
    }

    function edtrowdt(parametro, elemento) {
        parametro = parseInt(parametro);
        var data;
        $("button[data-facturacion-accion='clearshow_" + tipo + "#terciaria']").click();
        for (var i = 0; i < cotizaciondetalle.data.length; i++) {
            if (parseInt(cotizaciondetalle.data[i].timestamp) === parseInt(parametro)) {
                inicializaValores(cotizaciondetalle.data[i]);
                break;
            }
        }
    }

    */

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


    function guardarcotizacion(pantalla) {
        var rowvalues = {},
            url = window.urlcrear.replace('listar.crear', 'listar.autorizarrequisiciones'),
            accionCallBack = cotizacionGuardada,
            forma = $("div[data-facturacion-pantalla = '" + tipo + "_secundaria']  form"),
            botonActivar = $("#"+ capitalizar(tipo) +"_documento"),
            elementos = forma.find("[data-facturacion-tipo = 'input']");
            $.each(elementos, function (i, campo) {
            var tipo = $(campo).attr('data-facturacion-input');
            if (acciones.recoverValor.hasOwnProperty(tipo)) {
                var valor = acciones.recoverValor[tipo](campo);
                var id = $(campo).attr('data-facturacion-id');
                rowvalues[id] = valor[0];
            }
        });
        rowvalues['TipoOperacion'] = tipo;
        if (validateCotizacion(rowvalues)) {
            rowvalues['productos'] = cotizaciondetalle.data;
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    function validateCotizacion(rowvalues) {
        var resultado = true;
        if (isNaN(rowvalues.c_estado) || !(parseInt(rowvalues.c_estado) > 0)){
            displayerror("warning", 'Seleccioneun estado valido');
            resultado = false;
        }
        return resultado;
    }

    function cotizacionGuardada(data) {
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

    function imprimir() {
        var textocotizacion;
        $(".dataTables_length").addClass("hidden-print");
        $(".dataTables_info").addClass("hidden-print");
        $(".dataTables_paginate").addClass("hidden-print");
        var tabla = $("#" + capitalizar(tipo) + "_imprimir").html();

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

        tabla = tabla.replace('#REFERENCIA#', 'Referencia :' + rowvalues['c_descripcion']).replace('#CLIENTE#', rowvalues['c_proveedor_id_txt']);
        $('#' + capitalizar(tipo) + 'diashabiles').text(rowvalues['c_diasentrega']);
        textocotizacion = '<h4>Requisicion Pendiente de aprobar</h4>' + moment().format();
        $('#' + capitalizar(tipo) + 'tipodocumento').html(textocotizacion);
        $("#" + capitalizar(tipo) + "nrocotizacion").addClass('hidden-print');
        $("#" + capitalizar(tipo) + "_imprimir").html(tabla);
        window.print();
    }

})();


function inicializarValoresDeCreacion() {


}


