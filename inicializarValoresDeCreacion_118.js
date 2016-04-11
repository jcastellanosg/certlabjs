(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    acciones.cambio_c_empresa_id = cambio_c_empresa_id;
    acciones.cambio_c_cliente_id = cambio_c_cliente_id;
    acciones.cambio_d_producto_id = cambio_d_producto_id;
    acciones.cambio_d_cantidad = cambio_d_cantidad;
    acciones.addrowdt = addrowdt;
    acciones.edtrowdt = edtrowdt;
    acciones.delrowdt = delrowdt;
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
        id: 'd_id',
        categoria: 'd_categoria_id_txt',
        Producto: 'd_producto_id_txt',
        Cantidad: 'd_cantidad',
        Precio: 'd_precio',
        Total: 'd_total'
    };
    cotizaciondetalle.data = [];

    function crearDtCotizacion() {
        dtcontainer = 'Crear_dtsecundaria';
        containertotales = 'Crear_totales';
        cotizaciondetalle.data = [];
        tipo = 'crear';
        refreshTable();
    }

    $('select').on('change', cambioSelect);
    $("input[data-facturacion-id='d_cantidad']").on('change', acciones.cambio_d_cantidad);
    $("[data-facturacion-accion*='editar_editar#secundaria_']").live('click', acciones.getDetallesCotizacion);


    function cambioSelect(event) {
        var id = $(event.target).attr('data-facturacion-id');
        if (typeof id !== "undefined") {
            var metodo = "cambio_" + id;
            if (acciones.hasOwnProperty(metodo)) {
                acciones[metodo](event);
            }
        }
    }

    function cambio_c_empresa_id(event) {
        if ($(event.target).select2('data') === null) {
            return;
        }
        var botonActivar,
            empresa = parseInt($(event.target).select2('data').id),
            url = window.urldatatable.replace('menu=118', 'menu=26'),
            accionCallBack = actualizarPantallaEmpresa,
            data = {"campo": "e_id", "id": empresa};
        if (empresa > 0) {
            acciones.ajaxServer(botonActivar, data, url, accionCallBack);
        }
    }

    function cambio_c_cliente_id(event) {
        if ($(event.target).select2('data') === null)
            return;
        var botonActivar,
            empresa = parseInt($(event.target).select2('data').id),
            forma = $(event.target).parents('form:first'),
            cliente = parseInt(forma.find("select[data-facturacion-id = 'c_cliente_id']").select2('data').id),
            url = window.urlcrear.replace("listar.crear", 'listadeprecios.getLista'),
            accionCallBack = actualizarlistaDePrecios;
        if (empresa > 0 && cliente > 0) {
            var data = {"empresa": empresa, cliente: cliente};
            window.FratrisFacturacion.listadeprecios = [];
            acciones.ajaxServer(botonActivar, data, url, accionCallBack);
        }
    }

    function cambio_d_producto_id(event) {
        if ($(event.target).select2('data') === null)
            return;
        var valortotal,
            elementoactual = event.target,
            producto_id = parseInt($(elementoactual).select2('data').id),
            precio = getPrecio(producto_id),
            cantidad = getCantidad(elementoactual);
        setPrecio(precio, elementoactual);
        var valorItem = calcularValorItem(precio, cantidad);
        setValorItem(valorItem, elementoactual);
    }

    function cambio_d_cantidad(event) {
        var elementoactual = event.target;
        var forma = $(elementoactual).parents('form:first');
        var precio = parseInt(forma.find("[data-facturacion-id='d_precio']").text());
        var cantidad = parseInt($(elementoactual).val());
        cantidad = isNaN(cantidad) ? 0 : cantidad;
        $(elementoactual).val(cantidad);
        var valorItem = calcularValorItem(precio, cantidad);
        setValorItem(valorItem, elementoactual);
    }

    function addrowdt(parametro, elemento) {
        var rowvalues = {};
        var forma = $(elemento).parents('form:first');
        var rowdata = forma.find("[data-facturacion-tipo = 'input']");
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
            if (cotizaciondetalle.data[i].timestamp === parametro) {
                cotizaciondetalle.data.splice(i, 1);
                t = refreshTable(t);
                break;
            }
        }
    }


    function actualizarPantallaEmpresa(empresa) {
        if (empresa.hasOwnProperty('data') && typeof empresa.data[0] !== 'undefined') {
            empresa = empresa.data[0];
            var dataempresa = "      <address><strong>#EMPRESA#</strong><br/>" +
                "#DIRECCION#<br/>" +
                "#CIUDAD#<br/>" +
                "#DEPARTAMENTO#<br/>" +
                "#PAIS#<br/>" +
                "<abbr title='Telefono'>T:</abbr> #TELEFONO#" +
                "</address>" +
                "<address>" +
                "    <a href='#URL#'> #URL# </a>" +
                "</address>";
            dataempresa = dataempresa.replace("#EMPRESA#", empresa.e_nombre);
            dataempresa = dataempresa.replace("#DIRECCION#", empresa.e_direccion);
            dataempresa = dataempresa.replace("#CIUDAD#", empresa.c_ciudad);
            dataempresa = dataempresa.replace("#DEPARTAMENTO#", empresa.d_departamento);
            dataempresa = dataempresa.replace("#PAIS#", empresa.p_pais);
            dataempresa = dataempresa.replace("#TELEFONO#", empresa.e_telefono);
            dataempresa = dataempresa.replace("#NOMBRE#", empresa.e_nombre);
            dataempresa = dataempresa.replace("#NOMBRE#", empresa.e_nombre);
            dataempresa = dataempresa.replace(/#URL#/g, empresa.e_url);
            $("#" + capitalizar(tipo) + "_dataempresa").html(dataempresa);

            var logoempresa = '../media/com_certilab/files/' + empresa.e_fotos + '/logo.png';
            $("#" + capitalizar(tipo) + "_logoempresa").attr("src", logoempresa);

            $("#textocotizacion").text("Pendiente aprobación");
        }
    }

    function actualizarlistaDePrecios(listadeprecios) {
        if (listadeprecios.hasOwnProperty('data') && typeof listadeprecios.data[0] !== 'undefined') {
            window.FratrisFacturacion.listadeprecios = listadeprecios.data
        }
    }

    function getPrecio(producto) {
        return 21;
    }

    function setPrecio(precio, elementoactual) {
        var forma = $(elementoactual).parents('form:first');
        forma.find("[data-facturacion-id='d_precio']").text(precio);
    }

    function setValorItem(valorItem, elementoactual) {
        var forma = $(elementoactual).parents('form:first');
        forma.find("[data-facturacion-id='d_total']").text(valorItem);
    }

    function getCantidad(elementoactual) {
        var forma = $(elementoactual).parents('form:first');
        var cantidad = parseInt(forma.find("[data-facturacion-id='d_total']").val());
        return isNaN(cantidad) ? 0 : cantidad;
    }

    function calcularValorItem(precio, cantidad) {
        precio = parseInt(precio);
        cantidad = parseInt(cantidad);
        precio = isNaN(precio) ? 0 : precio;
        cantidad = isNaN(cantidad) ? 0 : cantidad;
        return cantidad * precio;
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
        columnas.push({"orderable": false, "name": "Editar", "data": "editar"});
        columnas.push({"orderable": false, "name": "Borrar", "data": "borrar"});
        return columnas;
    }

    function refreshTable() {
        t = $('#' + dtcontainer).dataTable();
        t.fnClearTable();
        t.fnDestroy();
        $(dtcontainer).empty();
        actualizarTotales();
        return acciones.creartabla(dtcontainer, generatecolumnas(), cotizaciondetalle.data);
    }

    function actualizarTotales() {
        var total = 0;
        for (var i = 0; i < cotizaciondetalle.data.length; i++) {
            total += cotizaciondetalle.data[i].d_precio * cotizaciondetalle.data[i].d_cantidad;
        }
        var impuestos = formatCurrency(total * 0.16);
        var grantotal = formatCurrency(total * 1.16);
        total = formatCurrency(total);
        var totalhtml = "<li><strong>Sub - Total : </strong>" + total + "</li>" +
            "<li><strong>Impuestos 16% : </strong>" + impuestos + "</li>" +
            "<li><strong>Gran Total : </strong>" + grantotal + "</li>";
        $("#" + containertotales).html(totalhtml);
    }

    function formatCurrency(valor) {
        valor = parseFloat(valor);
        return "$" + Number(valor.toFixed(0)).toLocaleString();
    }

    // var url = window.urlcrear.replace('listar.crear', 'listar.crearcotizacion');
    // var url = window.urlcrear.replace('listar.crear', 'listar.crearcotizacion');

    function guardarcotizacion(pantalla) {
        var botonActivar, rowvalues = {},
            url = window.urlcrear.replace('listar.crear', 'listar.crearcotizacion'),
            accionCallBack = cotizacionGuardada,
            forma = $("div[data-facturacion-pantalla = '" + tipo + "_secundaria']  form"),
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
        rowvalues['productos'] = cotizaciondetalle.data;
        acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
    }


    function cotizacionGuardada(data) {
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
        tipo = 'editar';
        var parametros = $(event.target).attr("data-facturacion-accion").split('_');
        var botonActivar, rows,
            url = window.urldatatable.replace('menu=118', 'menu=120'),
            accionCallBack = addRowsToDatatable,
            data = {campo: 'd_cotizacion_id', id: parametros[2]};
        acciones.ajaxServer(botonActivar, data, url, accionCallBack);
    }


    function addRowsToDatatable(data) {
        cotizaciondetalle.data =[];
        if (data.data !== undefined) {
            for (var i = 0; i < data.data.length; i++) {
                var rowvalues = data.data[i];
                rowvalues['d_categoria_id_txt'] = rowvalues['a_categoria'];
                rowvalues['d_producto_id_txt'] = rowvalues['p_nombre'];
                var timestamp = rowvalues.d_id;
                rowvalues['timestamp'] = timestamp;
                rowvalues['DT_RowId_d'] = timestamp;
                rowvalues['editar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='edtrowdt_" + timestamp + "' class='btn btn-sm btn-info hidden-print'>Editar</button>";
                rowvalues['borrar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='delrowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Borrar</button>";
                cotizaciondetalle.data.push(rowvalues);
            }
        }
        refreshTable();
    }


    function capitalizar(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function imprimir() {
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
        tabla = tabla.replace('#EMPRESA#', rowvalues['c_empresa_id_txt']).replace('#CLIENTE#', rowvalues['c_cliente_id_txt']);
        tabla = tabla.replace('#OBRA#', rowvalues['c_obra_id_txt']).replace('#LOCALIDAD#', rowvalues['c_localidad_id_txt']);
        tabla = tabla.replace('#DESTINO#', rowvalues['c_destino_id_txt']);

        $("#" + capitalizar(tipo) + "_imprimir").html(tabla);
        window.print();
    }

})();


function inicializarValoresDeCreacion() {


}


