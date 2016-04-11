(function () {

    "use strict";
    // camposdatatable
    var resetValor = window.FratrisFacturacion.acciones.resetValor;
    var acciones = window.FratrisFacturacion.acciones;
    var cotizaciones = {
        Codigo: 'codigo',
        Descripcion: 'descripcion',
        Norma: 'norma',
        Cantidad: 'cantidad',
        'Precio Unitario': 'precio',
        'Vr Total': 'total'
    };


    creartabla("cotizacion", generatecolumnas(cotizaciones), urlcotizacion);

    function generatecolumnas(arrcolumnas, editable) {
        var columnas = [];
        for (var columna in arrcolumnas) {
            columnas.push({
                "searchable": true,
                "orderable": true,
                "name": columna,
                "data": arrcolumnas[columna]
            })
        }
        return columnas;
    }

    function creartabla(tabla, columnas, url) {
        return $('#' + tabla).dataTable({
            "iDisplayLength": 5,
            "bLengthChange": false,
            "processing": true,
            "serverSide": true,
            "ajax": url,
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

    $("#Aceptar").click(guardarcotizacion);

    //  $("#Autorizar" ).click(guardarcotizacion);

    // $("#Anular").click(guardarcotizacion);


    function guardarcotizacion(e) {
        var datos = e.target.dataset,
            accionCallBack = cotizacionGuardada,
            botonActivar = null,
            key = frtk.key,
            rowvalues = {c_id: datos.frId, key: 1};

        if (datos.frAccion === "Regresar") {
            cotizacionGuardada();
            return;
        }
        if (datos.frAccion === "Autorizar") {
            frhost = frhost + '?option=com_certilab&task=cotizaciones.crearCotizacionAceptada';
        }
        if (datos.frAccion === "Anular") {
            frhost = frhost + '?option=com_certilab&task=cotizaciones.crearCotizacionAnulada';
        }
        acciones.ajaxServer(botonActivar, rowvalues, frhost, accionCallBack);
    }


    function cotizacionGuardada(data) {
        window.location = frhost + "?option=com_certilab&view=dashboard&task=dashboard.generar&Itemid=133";
        $('#modalconfirmar').modal('toggle');

    }

    $('#modalconfirmar').on('show.bs.modal', function (e) {
        if (e.relatedTarget && e.relatedTarget.dataset) {
            var datos = e.relatedTarget.dataset;
            $("#texto").html(datos.frTexto);
            $('#Aceptar').attr('data-fr-id', datos.frId).attr('data-fr-accion', datos.frAccion);
        }
    });

})();


function inicializarValoresDeCreacion() {


}


