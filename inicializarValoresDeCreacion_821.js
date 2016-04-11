(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    // acciones.cambio_c_empresa_id = cambio_c_empresa_id;
    //acciones.cambio_c_cliente_id = cambio_c_cliente_id;
    //acciones.cambio_d_producto_id = cambio_d_producto_id;
    acciones.cambio_l_tipodeorden = cambio_l_tipodeorden;

    acciones.cambio_d_cantidad = cambio_d_cantidad;
    acciones.addrowdt = addrowdt;
    acciones.edtrowdt = edtrowdt;
    acciones.delrowdt = delrowdt;
    acciones.duprowdt = duprowdt;
    acciones.imprimir = imprimir;
    acciones.duplicarmuestras =duplicarmuestras;
    acciones.cancelarduplicarmuestras = cancelarduplicarmuestras;
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
        dataduplicaterow={},
        dtcontainer,
        containertotales = 'Crear_totales';

    $("#Editar_dataempresa").remove();
    $("#Editar_totales").remove();
    $("#bt_Editar_imprimir").remove();
    $("button[data-facturacion-accion='clearshow_editar#terciaria']").hide();
    $("[data-facturacion-accion='clearshow_crear#secundaria']").click(crearDtCotizacion);
    $('#Editar_dtsecundaria').find('#Editarthdetalle').append("<th>Duplicar</th>");

    var cotizaciondetalle = window.FratrisFacturacion.data.cotizaciondetalle;


    cotizaciondetalle.encabezado = {
        Consecutivo: 'd_id',
        Ensayo: 'p_descripcioncorta',
        Norma: 'p_nombre',
        Muestra: 'd_muestra',
        Cantidad: 'd_cantidad',
        Obervaciones: 'd_observaciones'
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

    $('#grupo_editar_c_cliente_id').hide();
    $('#grupo_editar_l_proveedor').hide();
    $('#grupo_editar_l_empleado').hide();
    function cambio_l_tipodeorden(event) {
        if ($(event.target).select2('data') === null)
            return;

        var tipo = acciones.recoverValor['select'](event.target);
        if (parseInt(tipo) === 1) {
            $('#grupo_editar_l_proveedor').show();
            $('#grupo_editar_l_empleado').hide();
            $('#Editar_documento').text('Guardar Orden Servicio');
        } else {
            $('#grupo_editar_l_proveedor').hide();
            $('#grupo_editar_l_empleado').show();
            $('#Editar_documento').text('Guardar Orden Ejecucion');
        }
    }



    function cambio_c_cliente_id(event) {
        if ($(event.target).select2('data') === null)
            return;
        var botonActivar,
            forma = $(event.target).parents('form:first'),
            cliente = parseInt(forma.find("select[data-facturacion-id = 'c_cliente_id']").select2('data').id),
            url = window.urlcrear.replace("listar.crear", 'listadeprecios.getLista'),
            accionCallBack = actualizarlistaDePrecios;
        deshabilitarBotones(true);
        if (cliente > 0) {
            var data = {cliente: cliente};
            window.FratrisFacturacion.listadeprecios = [];
            acciones.ajaxServer(botonActivar, data, url, accionCallBack);
        }
    }

    function cambio_d_producto_id(event) {
        if ($(event.target).select2('data') === null)
            return;
        var valortotal,
            elementoactual = event.target;
        setPrecio(elementoactual);
        calcularValorItem(elementoactual);
    }

    function cambio_d_cantidad(event) {
        var elementoactual = event.target;
        calcularValorItem(elementoactual);
    }

    function addrowdt(parametro, elemento) {
       var cantidad = acciones.recoverValor['input']($(editar_d_cantidad));
        if (parseInt(cantidad) <= 0){
            displayerror("warning", 'Cantidad errado');
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
        var muestra = rowvalues['d_muestra'];
        if (!muestra){
            displayerror("warning", 'Muestra Errada');
         } else {
            rowvalues['d_muestra'] = rowvalues['d_muestra_txt'];
            rowvalues['d_muestra_txt'] = muestra;
            if (rowvalues['DT_RowId_d'].trim() === '' || rowvalues['DT_RowId_d'].trim() === '0') {
                agregarNuevaRowData(rowvalues);
            } else {
                actualizarRowData(rowvalues);
            }
            refreshTable();
            acciones.show(tipo + '_secundaria');
        }
        if(rowvalues['DT_RowId_d']) {
            restaurarLinea($("button[data-facturacion-accion='edtrowdt_" + rowvalues['DT_RowId_d'].trim() + "']")[0]);
        }
    }

    function agregarNuevaRowData(rowvalues) {
        var timestamp = $.now()+ cotizaciondetalle.data.length;
        rowvalues['timestamp'] = timestamp;
        rowvalues['DT_RowId_d'] = timestamp;
        rowvalues['editar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='edtrowdt_" + timestamp + "' class='btn btn-sm btn-info hidden-print'>Editar</button>";
        rowvalues['borrar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='delrowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Borrar</button>";
        rowvalues['duplicar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='duprowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Duplicar</button>";
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
                break;
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



    function restaurarLinea(obj) {
        if (!obj)
            return;
        var curtop = 0,
            w = $(window),
            i = 0,
            pos= 0,
            attr = $(obj).attr("data-facturacion-accion");
        if  (!attr && obj && obj.selector && obj.selector.split('=')[0].trim() == "button[data-facturacion-accion") {
            attr = obj.selector.split('=')[1].replace(/'/g,'');
        }
        obj = $("button[data-facturacion-accion='" + attr + "']")[0];
        if (obj) {
            do {
                curtop = $(obj).offset().top;
                if (i++ > 15 || obj.nodeName == 'TR')
                    break;
            } while (obj = obj.parentElement);
            w.scrollTop(curtop - (w.height() / 2 ));
            $(obj).css("background-color", "#00FFFF");
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
            if (parseInt(cotizaciondetalle.data[i].timestamp) === parametro) {
                cotizaciondetalle.data.splice(i, 1);
                t = refreshTable(t);
                break;
            }
        }
    }


    function actualizarlistaDePrecios(listadeprecios) {
        if (listadeprecios.hasOwnProperty('data') && typeof listadeprecios.data[0] !== 'undefined') {
            deshabilitarBotones(false);
            window.FratrisFacturacion.listadeprecios = listadeprecios.data
        }
    }

    function deshabilitarBotones(opcion) {
        var botones = $("button[data-facturacion-accion ='clearshow_crear#terciaria']");
        $.each(botones, function (i, el) {
            $(el).prop('disabled', opcion);
        });
    }

    function getPrecio(categoria, producto, cantidad) {
        var i,
            precio = 0,
            listadeprecios = window.FratrisFacturacion.listadeprecios;
        for (i = listadeprecios.length; i--;) {
            if (parseInt(listadeprecios[i]['categoria_id']) === categoria && parseInt(listadeprecios[i]['producto_id']) === producto) {
                cantidad.prop('disabled', false);
                return listadeprecios[i]['valor'];
            }
        }
        displayerror("warning", 'No hay un precio valido para este servicio');
        return precio;
    }

    function setPrecio(producto) {
        var precio,
            categoria,
            forma = $(producto).parents('form:first'),
            cantidad = forma.find("input[data-facturacion-id='d_cantidad']");
        cantidad.prop('disabled', true);
        producto = acciones.recoverValor['select'](producto)[0];
        if (!parseInt(producto)) {
            return;
        }
        categoria = forma.find("select[data-facturacion-id='d_categoria_id']")[0];
        categoria = acciones.recoverValor['select'](categoria)[0];
        categoria = parseInt(categoria);
        producto = parseInt(producto);
        if (isNaN(categoria) || isNaN(producto)) {
            displayerror("warning", 'No hay un precio valido para este servicio');
            return;
        }
        precio = getPrecio((categoria), producto, cantidad);
        forma.find("[data-facturacion-id='d_precio']").text(precio);
    }



    function calcularValorItem(elementoactual) {
        var total,
            forma = $(elementoactual).parents('form:first'),
            cantidad = forma.find("input[data-facturacion-id='d_cantidad']")[0],
            precio = forma.find("p[data-facturacion-id='d_precio']")[0];
        cantidad = acciones.recoverValor['input'](cantidad)[0];
        precio = acciones.recoverValor['estatica'](precio)[0];
        precio = parseInt(precio);
        cantidad = parseInt(cantidad);
        precio = isNaN(precio) ? 0 : precio;
        cantidad = isNaN(cantidad) ? 0 : cantidad;
        total = precio * cantidad;
        forma.find("[data-facturacion-id='d_total']").text(total);
        return total;
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
        columnas.push({"orderable": false, "name": "Duplicar", "data": "duplicar"});
        return columnas;
    }


    function refreshTable() {
        var pagina = 0,
            infopagina;
        if ($.fn.DataTable.isDataTable('#' + dtcontainer)) {
            if (!t) {
                t = $('#' + dtcontainer).dataTable();
            }
            infopagina = t.fnPagingInfo();
            pagina = (infopagina.iStart / infopagina.iLength);
            pagina = pagina <= infopagina.iTotalPages ? pagina : 0;
            //t.fnDraw();
            t.fnClearTable();
            t.fnDestroy();
            $(dtcontainer).empty();
            //actualizarTotales();
            //t.draw();

        }
        t= acciones.creartabla(dtcontainer, generatecolumnas(), cotizaciondetalle.data);
        t.fnPageChange(pagina, true);
    }




    function actualizarTotales() {
        var total = calcularTotaldeCotizacion();
        var impuestos = formatCurrency(total * 0.16);
        var grantotal = formatCurrency(total * 1.16);
        total = formatCurrency(total);
        var totalhtml = "<li><strong>Sub - Total : </strong>" + total + "</li>" +
            "<li><strong>Impuestos 16% : </strong>" + impuestos + "</li>" +
            "<li><strong>Gran Total : </strong>" + grantotal + "</li>";
        $("#" + containertotales).html(totalhtml);
    }

    function calcularTotaldeCotizacion() {
        var total = 0;
        for (var i = 0; i < cotizaciondetalle.data.length; i++) {
            total += cotizaciondetalle.data[i].d_precio * cotizaciondetalle.data[i].d_cantidad;
        }
        return total;
    }

    function formatCurrency(valor) {
        valor = parseFloat(valor);
        return "$" + Number(valor.toFixed(0)).toLocaleString();
    }

    function guardarcotizacion(pantalla) {
        var rowvalues = {},
            url = window.urlcrear.replace('listar.crear', 'listar.crearordendetrabajo'),
            accionCallBack = cotizacionGuardada,
            forma = $("div[data-facturacion-pantalla = '" + tipo + "_secundaria']  form"),
            botonActivar = $("#"+ capitalizar(tipo) +"_documento"),
            elementos = forma.find("[data-facturacion-tipo = 'input']"),
            dummy;
        //       precio = calcularTotaldeCotizacion();
        //   if (!precio) {
        //       displayerror("warning", 'No hay analisis validos para esta cotizacion');
        //       return;
        //   }
        $.each(elementos, function (i, campo) {
            var tipo = $(campo).attr('data-facturacion-input');
            if (acciones.recoverValor.hasOwnProperty(tipo)) {
                var valor = acciones.recoverValor[tipo](campo);
                var id = $(campo).attr('data-facturacion-id');
                rowvalues[id] = valor[0];
            }
        });
        rowvalues['productos'] = cotizaciondetalle.data;
        if (validateOrden(rowvalues)) {
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    function validateOrden(rowvalues) {
        var i,
            resultado = 'false',
            tipodeorden,
            proveedor,
            empleado,
            productos= rowvalues['productos'],
            msg = '';
        tipodeorden = parseInt(rowvalues['l_tipodeorden']);
        if (tipodeorden !== 1 && tipodeorden !== 2) {
            displayerror("warning", 'Seleccione le tipo de orden');
            return false;
        }
        proveedor = parseInt(rowvalues['l_proveedor']);
        if (tipodeorden === 1 && (isNaN(proveedor) || proveedor < 0)) {
            displayerror("warning", 'Proveedor errado');
            return false;
        }
        empleado = parseInt(rowvalues['l_empleado']);
        if (tipodeorden === 2 && (isNaN(empleado) || empleado < 0)) {
            displayerror("warning", 'Empleado errado');
            return false;
        }
        i=productos.length;
        if (!i){
            displayerror("warning", 'No hay analisis para generar orden');
            return false;
        }
        for (i=productos.length;i--;){
            if (!(parseInt(productos[i]['d_cantidad']) >0 )){
                displayerror("warning", 'Algunas cantidades erradas');
                return false;
            }
            if (!(productos[i]['d_muestra'].trim())){
                displayerror("warning", 'Algunas muestras erradas');
                return false;
            }
        }
        return true;
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
        refreshTable();  // borrar tabla;
        tipo = 'editar';
        var parametros = $(event.target).attr("data-facturacion-accion").split('_');
        var botonActivar, rows,
            url = window.urldatatable.replace('task=listar.getTable', 'task=listar.listarCotizacionOT'),
            accionCallBack = addRowsToDatatable,
            data = {"cotizacion_id": parametros[2]};
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
                rowvalues['editar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='edtrowdt_" + timestamp + "' class='btn btn-sm btn-info hidden-print'>Editar</button>";
                rowvalues['borrar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='delrowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Borrar</button>";
                rowvalues['duplicar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='duprowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Duplicar</button>";
                cotizaciondetalle.data.push(rowvalues);
            }
        }
        cotizaciondetalle.data = cotizaciondetalle.data.sort();
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
        tabla = tabla.replace('#REFERENCIA#', 'Referencia :' + rowvalues['c_descripcion']).replace('#CLIENTE#', rowvalues['c_cliente_id_txt']);
        $('#' + capitalizar(tipo) + 'diashabiles').text(rowvalues['c_diasentrega']);


        textocotizacion = '<h4>Orden de servicio </h4>' + moment().format();
        $('#' + capitalizar(tipo) + 'tipodocumento').html(textocotizacion);
        $("#" + capitalizar(tipo) + "nrocotizacion").addClass('hidden-print');

        $("#" + capitalizar(tipo) + "_imprimir").html(tabla);
        window.print();
    }

    function formDuplicate() {
        var
            muestras = valoresselect.d_muestra.map(function (i) {
                return "<option value=" + i.id + ">" + i.value + "</option>";
            });

        $("#my_multi_select1").html(muestras.join('\n'));
        $("#duplicar_modal").modal("show");
        $('#my_multi_select1').multiSelect({
            selectableHeader: "<div class='custom-header'>Seleccionar Muestra</div>",
            selectionHeader: "<div class='custom-header'>Muestras Seleccionadas</div>"
        });
        $('#my_multi_select1').multiSelect('deselect_all');
    }

    function duplicarmuestras() {
        var row = {},
            muestras = acciones.recoverValor['multiselect']($("#my_multi_select1"))[0];
        for (var muestra in muestras) {
            row = {};
            for (var campo in dataduplicaterow) {
                if (dataduplicaterow.hasOwnProperty(campo)) {
                    row[campo] = dataduplicaterow[campo];
                }
            }
            row.d_muestra = muestras[muestra];
            row.d_muestra_txt = muestra;
            row.d_cantidad = 1;
            agregarNuevaRowData(row);
        }
        refreshTable();
        restaurarLinea($("button[data-facturacion-accion='duprowdt_" + dataduplicaterow.timestamp + "'"));
        $("#duplicar_modal").modal("hide");
    }

    function cancelarduplicarmuestras(){
        $("#duplicar_modal").modal("hide");
    }

    function duprowdt(parametro, elemento) {
        parametro = parseInt(parametro);
        var data,
            rowvalues = {},
            valor;
        for (var i = 0; i < cotizaciondetalle.data.length; i++) {
            if (parseInt(cotizaciondetalle.data[i].timestamp) === parseInt(parametro)) {
                for (valor in cotizaciondetalle.data[i]) {
                    if (cotizaciondetalle.data[i].hasOwnProperty(valor)) {
                        rowvalues[valor] = cotizaciondetalle.data[i][valor];
                    }
                }
            }
        }
        dataduplicaterow=rowvalues;
        formDuplicate();
    }

    function compare(a, b) {
        if (a.timestamp < b.timestamp) {
            return -1;
        }
        if (a.timestamp > b.timestamp) {
            return 1;
        }
        return 0;
    }


})();


function inicializarValoresDeCreacion() {


}


