(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    // acciones.cambio_c_empresa_id = cambio_c_empresa_id;
    acciones.addrowdt = addrowdt;
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


    $("#editar_c_cliente_id").prop('disabled', true);
    $("button[data-facturacion-accion='clearshow_editar#terciaria']").hide();
    $("#Editar_documento").remove();
    $("#bt_Editar_imprimir").remove();
    $("#bt_Crear_imprimir").remove();
    $('#Editar_dtsecundaria tr').find('th:last-child, td:last-child').remove();
    $('#Editar_dtsecundaria tr').find('th:last-child, td:last-child').remove();

    $("[data-facturacion-accion='clearshow_crear#secundaria']").click(crearDtCotizacion);
    var cotizaciondetalle = window.FratrisFacturacion.data.cotizaciondetalle;
    cotizaciondetalle.encabezado = {
        //id: 'd_id',
        //categoria: 'd_categoria_id_txt',
        //Producto: 'd_producto_id_txt',
        Codigo: 'p_codigointerno',
        Descripcion: 'd_descripcion',
        Norma: 'd_producto_id_txt',
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

    // $('select').on('change', cambioSelect);
    // $("input[data-facturacion-id='d_cantidad']").on('change', acciones.cambio_d_cantidad);
    $("[data-facturacion-accion*='editar_editar#secundaria_']").live('click', acciones.getDetallesCotizacion);


    /*
     function cambioSelect(event) {
     var id = $(event.target).attr('data-facturacion-id');
     if (typeof id !== "undefined") {
     var metodo = "cambio_" + id;
     if (acciones.hasOwnProperty(metodo)) {
     acciones[metodo](event);
     }
     }
     }
     */


    function addrowdt(parametro, elemento) {
        var total = calcularValorItem(elemento);
        if (parseInt(total) <= 0) {
            displayerror("warning", 'Cantidad y/o Precio errado');
            return;
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

    /*
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

    /*
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
     */

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

    /*
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



     function setValorItem(valorItem, elementoactual) {
     var forma = $(elementoactual).parents('form:first');
     forma.find("[data-facturacion-id='d_total']").text(valorItem);
     }

     function getCantidad(elementoactual) {
     var forma = $(elementoactual).parents('form:first');
     var cantidad = parseInt(forma.find("[data-facturacion-id='d_total']").val());
     return isNaN(cantidad) ? 0 : cantidad;
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
     */

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
        //    columnas.push({"orderable": false, "name": "Editar", "data": "editar"});
        //    columnas.push({"orderable": false, "name": "Borrar", "data": "borrar"});
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

    function guardarcotizacion(pantalla) {
        var botonActivar, rowvalues = {},
            url,
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
        if (validateOperacion(rowvalues['c_estado_id'])) {
            if (parseInt(rowvalues['c_estado_id']) === 1) {
                url = window.urlcrear.replace('listar.crear', 'listar.crearCotizacionCerrada');
            } else {
                url = window.urlcrear.replace('listar.crear', 'listar.crearCotizacionAnulada');
            }
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    function validateOperacion(estado){
        var valido = true;
        if(isNaN(estado) || [1,2].indexOf(parseInt(estado)) === -1 ){
            displayerror("Warning", 'Debe seleccionar si autoriza o anula la cotizacion');
            valido= false;
        }
        return valido;
    }



    function cotizacionGuardada(data) {
        if (data.OK === 'OK') {
            displayerror("Information", 'Operacion Exitosa!!');
            resetDataProductos();
            acciones.show("principal");
            $("#datatable_ajax").DataTable().draw();
        } else {
            displayerror("Warning", 'Error en la operacion');
        }
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
            url = window.urldatatable.replace('task=listar.getTable', 'task=listar.listarDetallesDeCotizacion'),
            accionCallBack = addRowsToDatatable,
            data = {cotizacion_id: parametros[2]};
        mostrarSpinner(true);
        acciones.ajaxServer(botonActivar, data, url, accionCallBack);
    }


    function addRowsToDatatable(data) {
        cotizaciondetalle.data = [];
        if (data.data !== undefined) {
            for (var i = 0; i < data.data.length; i++) {
                var rowvalues = data.data[i];
                rowvalues['d_categoria_id_txt'] = rowvalues['a_categoria'];
//                rowvalues['d_producto_id_txt'] = rowvalues['p_nombre'];
                var nombres = rowvalues['p_nombre'].split("::");
                rowvalues['d_producto_id_txt'] = nombres[0];
                rowvalues['d_descripcion'] = nombres[1];
                rowvalues['p_codigointerno'] = nombres[2];

                var timestamp = rowvalues.d_id;
                rowvalues['timestamp'] = timestamp;
                rowvalues['DT_RowId_d'] = timestamp;
                //rowvalues['editar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='edtrowdt_" + timestamp + "' class='btn btn-sm btn-info hidden-print'>Editar</button>";
                //rowvalues['borrar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='delrowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Borrar</button>";
                cotizaciondetalle.data.push(rowvalues);
            }
        }
        mostrarSpinner(false);
        refreshTable();
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
        var tabla = $("#" + capitalizar(tipo) + "_imprimir").html(),
            firma = '_____________________________<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspFirma';

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
        textocotizacion = '<h4>Cotizacion ' + rowvalues['c_id'] + '</h4>' + rowvalues['c_fechacreacion'];
        $('#' + capitalizar(tipo) + 'tipodocumento').html(textocotizacion);
        $('#' + capitalizar(tipo) + 'nrocotizacion').addClass('hidden-print');
        $('#' + capitalizar(tipo) + 'firma').html(firma);
        $("#" + capitalizar(tipo) + "_imprimir").html(tabla);
        window.print();
    }

})();


function inicializarValoresDeCreacion() {


}


