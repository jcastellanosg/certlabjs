(function () {

    "use strict";
    var acciones = window.FratrisFacturacion.acciones;
    acciones.delrowdt = delrowdt;

    var cotizaciondetalle = {};

    cotizaciondetalle.encabezado = {
        Categoria: 'categoria',
        Analis: 'analisis',
        Muestra: 'muestra',
        Cantidad: 'cantidad'
    };
    cotizaciondetalle.data = [];

    $('#Categoria').on("change", cambiarAnalisis);
    // $('#Ensayo').select2().on("change", dummy);
    $("#nuevoanalisis").click(nuevoAnalisis);
    $("#solicitarcotizacion").click(solicitarcotizacion);
    $('#tblcotizaciones').click('accionesDatatable');
    $("#solicitarcotizacion").hide();
    $("#Categoria").val("0").trigger("change");


    function generatecolumnas() {
        var columnas = [],
            encabezados = cotizaciondetalle.encabezado;

        for (var columna in encabezados) {
            if (encabezados.hasOwnProperty(columna)) {
                columnas.push({
                    "searchable": true,
                    "orderable": true,
                    "name": columna,
                    "data": cotizaciondetalle.encabezado[columna]
                })
            }
        }
        columnas.push({"orderable": false, "name": "Borrar", "data": "borrar"});
        return columnas;
    }

    function creartabla(tabla, columnas, datasrc) {
        return $('#' + tabla).dataTable({
            "aaData": datasrc,
            "aoColumns": columnas,
            "bFilter": false,
            "loadingMessage": 'Cargando Datos...',
            "language": { // language settings
                // metronic spesific
                "metronicGroupActions": "_TOTAL_ registros selecciondos:  ",
                "metronicAjaxRequestGeneralError": "No se pudo completar la peticion. Por favor verifique su conexion de internet",

                // data tables spesific
                "infoFiltered": "(Filtrados de un total de _MAX_ registros)",
                "lengthMenu": "<span class='seperator'> | </span>Mostrar _MENU_ registros por pagina",
                "info": "<span class='seperator'> | </span>Total registros _TOTAL_ ",
                "infoEmpty": "No hay registros para mostrar",
                "emptyTable": "No hay datos disponibles ",
                "zeroRecords": "No hay registros para mostrar",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente",
                    "last": "Ultimo",
                    "first": "Primer",
                    "page": "Pagina",
                    "pageOf": "de"
                }
            }
        });
    }

    function refreshTable() {
        var t = $('#tblcotizaciones').dataTable();
        t.fnClearTable();
        t.fnDestroy();
        //$(dtcontainer).empty();
        creartabla("tblcotizaciones", generatecolumnas(), cotizaciondetalle.data);
    }


    function delrowdt(parametro, elemento) {
        parametro = parseInt(parametro);
        var row;
        for (var i = 0; i < cotizaciondetalle.data.length; i++) {
            if (parseInt(cotizaciondetalle.data[i].timestamp) === parseInt(parametro)) {
                cotizaciondetalle.data.splice(i, 1);
                refreshTable();
                break;
            }
        }
        if(cotizaciondetalle.data.length <= 0){
            $("#solicitarcotizacion").hide();
        }
    }


    function solicitarcotizacion() {
        var rowvalues = {},
            url = frhost + "?option=com_certilab&task=pedidos.web",
            accionCallBack = cotizacionGuardada,
            botonActivar = "",
            campos = $("#frmcotizacion").find("[data-facturacion-tipo = 'input']");
        $.each(campos, function (i, campo) {
            rowvalues[campo.id] = $(campo).val();
        });
        rowvalues['analisis'] = cotizaciondetalle.data;
        if (validacionDataCotizacion(rowvalues)) {
            $("#nuevoanalisis").prop( "disabled", true );
            $("#solicitarcotizacion").prop( "disabled", true );
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }


    function validacionDataCotizacion(rowvalues) {
        var valido = true;
        if (!validateEmail(rowvalues.email.trim())) {
            displayerror("notice", 'Email no es valido');
            valido = false;
        }
        if (rowvalues.nombre.trim() == '') {
            displayerror("notice", 'Nombre no es valido');
            valido = false;
        }
        if (isNaN(rowvalues.telefono) || !(parseInt(rowvalues.telefono) > 0 ))  {
            displayerror("notice", 'Telefono no es valido');
            valido = false;
        }
        if (rowvalues.contacto.trim() == '') {
            displayerror("notice", 'Contacto no es valida');
            valido = false;
        }
        if (cotizaciondetalle.data.length <= 0){
            displayerror("notice", 'Debe seleccionar Analisis a cotizar');
            valido = false;
        }

        return valido;
    }

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function cotizacionGuardada(data) {
        cotizaciondetalle.data={};
        $("#frmcotizacion")[0].reset();
        $("#nuevoanalisis").prop( "disabled", false );
        $("#solicitarcotizacion").prop( "disabled", false );
        refreshTable();
        $("#modalconfirmar").modal('show');
    }


    function nuevoAnalisis() {
        if (!validarAnalisis()) {
            return;
        }
        var rowvalues = {},
            categoria = $("#Categoria").select2('data'),
            analisis = $("#Ensayo").select2('data'),
            muestra = $("#Muestra"),
            cantidad = $("#Cantidad"),
            ensayos = $("#TotalEnsayos"),
            timestamp = $.now();
        rowvalues['categoria_id'] = categoria.id;
        rowvalues['categoria'] = categoria.text;
        rowvalues['analisis_id'] = analisis.id;
        rowvalues['analisis'] = analisis.text;
        rowvalues['muestra'] = muestra.val();
        rowvalues['cantidad'] = cantidad.val();
        rowvalues['ensayos'] = ensayos.val();
        rowvalues['timestamp'] = timestamp;
        rowvalues['borrar'] = "<button type='button' data-facturacion-tipo='accion' data-facturacion-accion='delrowdt_" + +timestamp + "' class='btn btn-sm btn-info hidden-print'>Borrar</button>";
        cotizaciondetalle.data.push(rowvalues);
        muestra = muestra.val('');
        cantidad = cantidad.val('');
        $("#Categoria").select2('val', 0, true);
        refreshTable();
        $("#solicitarcotizacion").show();
    }

    function validarAnalisis() {
        var valido = true,
            categoria = $("#Categoria").select2('data'),
            analisis = $("#Ensayo").select2('data'),
            muestra = $("#Muestra").val(),
            cantidad = $("#Cantidad").val(),
            ensayos = $("#TotalEnsayos").val();
        if (!categoria || !categoria.id || isNaN(categoria.id) || parseInt(categoria.id) <= 0) {
            displayerror("notice", 'Debe seleccionar una categoria valida');
            valido = false;
        }
        if (!analisis || !analisis.id || isNaN(analisis.id) || parseInt(analisis.id) <= 0) {
            displayerror("notice", 'Debe seleccionar un ensayo valido');
            valido = false;
        }
        if (muestra.trim() == "") {
            displayerror("notice", 'Debe seleccionar una muestra  valido');
            valido = false;
        }
        if (cantidad.trim() == "") {
            displayerror("notice", 'Debe seleccionar una cantidad valida');
            valido = false;
        }
        if (isNaN(ensayos) || !(parseInt(ensayos) >0) ) {
            displayerror("notice", 'Numero de ensayos invalida');
            valido = false;
        }
        return valido
    }

    function cambiarAnalisis(e) {
        var opciones = [],
            ensayo = $("#Ensayo");
        if (isNaN(e.val)) {
            return;
        }

        $.each(listaanalisis, function (i, valor) {
            if (valor[0] == parseInt(e.val)) {
                opciones.push(valor[1]);
            }
        });

        ensayo.html(opciones.join('\n\t'));
        ensayo.select2('val', 0, true);
    }

    refreshTable();


})();


function inicializarValoresDeCreacion() {


}


