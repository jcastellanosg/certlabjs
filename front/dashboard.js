(function () {

    "use strict";
    // camposdatatable
    var cotizaciones = {Cotizacion: 'id', Precio: 'precio', Estado: 'estado', Fecha: 'fecha'},
        cotizacionesautorizadas = {Cotizacion: 'id', Precio: 'precio', Fecha: 'fecha', Autorizar: 'autorizar'},
        url = hostfr + "/index.php?option=com_certilab&view=dashboard&task=dashboard.listarCotizacion",
        urlpendientes = hostfr + "/index.php?option=com_certilab&view=dashboard&task=dashboard.pendientesdeaprobar";

    $('li').click(mostrartiquete);

    function mostrartiquete(event) {
        var id,
            i,
            titulo,
            contenido;
        if (event.currentTarget.id && event.currentTarget.id.indexOf('queja') >= 0) {
            id = event.currentTarget.id.split('_');
            id = id[1]
            for (i= 0 ; i < tiquetes.length; i++){
                if (parseInt(tiquetes[i].id) == parseInt(id) ){
                    titulo = "Tiquete Nro: " +tiquetes[i].id;
                    contenido = "<p><strong>Tema:</strong>:"+tiquetes[i].tema + "</p>" +
                    "<p><strong>Descripcion:</strong>:"+tiquetes[i].descripcion + "</p>" ;
                    if (tiquetes[i].estado !== 'abierto'){
                        contenido += "<p><strong>Solucion:</strong>:"+tiquetes[i].solucion + "</p>"
                    }
                }
                $("#titulotiquete").text(titulo);
                $("#contenidotiquete").html(contenido);
                $('#tiquete_modal').modal('show');
            }
        }
    }


    creartabla("cotizaciones", generatecolumnas(cotizaciones),url );
    creartabla("cotizacionesautorizadas", generatecolumnas(cotizacionesautorizadas),urlpendientes);

    function generatecolumnas(arrcolumnas,editable) {
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

})();


function inicializarValoresDeCreacion() {


}


