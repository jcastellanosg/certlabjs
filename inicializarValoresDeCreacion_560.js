(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
    // acciones.cambio_c_empresa_id = cambio_c_empresa_id;
    //acciones.addrowdt = addrowdt;
    //acciones.imprimir = imprimir;
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



    $("button[data-facturacion-accion='clearshow_editar#terciaria']").hide();
    $('#Editar_dtsecundaria tr').find('th:last-child, td:last-child').remove();
    $('#Editar_dtsecundaria tr').find('th:last-child, td:last-child').remove();
    //$('#Editar_documento').remove();
    $('#Editar_documento').text('Cambiar Estado');
    $('#Editar_totales').remove();
    $('#bt_Editar_imprimir').remove();

    $("[data-facturacion-accion='clearshow_crear#secundaria']").click(crearDtCotizacion);
    var cotizaciondetalle = window.FratrisFacturacion.data.cotizaciondetalle;
    cotizaciondetalle.encabezado = {
        Codigo: 'codigo',
        Categoria: 'categoria',
        Analisis: 'analisis',
        Muestra: 'muestra',
        'Cantidad Muestra': 'cantidad',
        Ensayos : 'ensayos'
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
    // $("input[data-facturacion-id='d_cantidad']").on('change', acciones.cambio_d_cantidad);
    $("[data-facturacion-accion*='editar_editar#secundaria_']").live('click', acciones.getDetallesCotizacion);
    mostrarCliente(false);

    function mostrarCliente(opcion) {
        $('#editar_c_diasentrega').val('');
        $('#editar_c_condicionesdepago').val('');
        $("#editar_c_descripcion").val('');
        if (opcion) {
            $('#grupo_editar_c_cliente_id').show();
            $('#grupo_editar_c_diasentrega').show();
            $('#grupo_editar_c_condicionesdepago').show();
            $("#grupo_editar_c_descripcion").show();
        } else {
            $('#grupo_editar_c_cliente_id').hide();
            $('#grupo_editar_c_diasentrega').hide();
            $('#grupo_editar_c_condicionesdepago').hide();
            $("#grupo_editar_c_descripcion").hide();
        }
    }

    function cambioSelect(event) {
        var valor,
            opcion;
        if (event.target.id === 'editar_c_estado') {
            valor = acciones.recoverValor['select'](event.target);
            opcion = parseInt(valor[0]) === 1;
            mostrarCliente(opcion);
        }
    }
/*
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
    */

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
        return columnas;
    }

    function refreshTable() {
        t = $('#' + dtcontainer).dataTable();
        t.fnClearTable();
        t.fnDestroy();
        $(dtcontainer).empty();
        //actualizarTotales();

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
        if (validateOperacion(rowvalues)) {
            rowvalues['productos']=  cotizaciondetalle.data;
            url = window.urlcrear.replace('listar.crear', 'listar.autorizarpedidosweb');
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    function validateOperacion(rowvalues){
        var valido = true;

        if(isNaN(rowvalues.c_estado) || [1,2].indexOf(parseInt(rowvalues.c_estado)) === -1 ){
            displayerror("Warning", 'Debe seleccionar si autoriza o anula la cotizacion');
            valido= false;
        }
        if(parseInt(rowvalues.c_estado) === 1) {
            if(isNaN(rowvalues.c_cliente_id) || !(parseInt(rowvalues.c_cliente_id)>0)){
                displayerror("Warning", 'Cliente errado');
                valido= false;
            }
            if(cotizaciondetalle.data.length <= 0){
                displayerror("Warning", 'No hay items para cotizar');
                valido= false;
            }
            if(rowvalues.c_condicionesdepago.trim() === ''){
                displayerror("Warning", 'Condiciones de pago erradas');
                valido= false;
            }
            if(isNaN(rowvalues.c_diasentrega) || !(parseInt(rowvalues.c_diasentrega)>0)){
                displayerror("Warning", 'Dias entrega errados');
                valido= false;
            }
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
            url = window.urldatatable.replace('task=listar.getTable', 'task= listar.listarDetallesDePedido'),
            accionCallBack = addRowsToDatatable,
            data = {pedido_id: parametros[2]};
        mostrarSpinner(true);
        acciones.ajaxServer(botonActivar, data, url, accionCallBack);
    }


    function addRowsToDatatable(data) {
        cotizaciondetalle.data = [];
        if (data.data !== undefined) {
            cotizaciondetalle.data = data.data;
        }
        mostrarSpinner(false);
        refreshTable();
    }

    function mostrarSpinner(opcion) {
        if (opcion) {
            $('#Editargifspinner').show();
          //  $("#Editartabladedatos").hide();
            $("#Editar_documento").hide();
        } else {
            $('#Editargifspinner').hide();
           // $("#Editartabladedatos").show();
            $("#Editar_documento").show();
        }
    }

    function capitalizar(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /*
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
    */

})();


function inicializarValoresDeCreacion() {


}


