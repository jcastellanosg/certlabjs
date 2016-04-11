/**
 * Created by jcastellanosg on 5/19/2015.
 */

(function () {
    "use strict";

    var resetValor = window.FratrisFacturacion.acciones.resetValor;
    var acciones = window.FratrisFacturacion.acciones;
    acciones.clearshow = clearshow;   //Limpiar campos y mostrar pantalla
    acciones.show = show;              // mostrar pantalla
    acciones.cleardisplay = cleardisplay; // limpiar campos
    acciones.ajaxServer = ajaxServer;
    acciones.creartabla = creartabla;
    acciones.editar = editar;
    acciones.crearregistro = crearregistro;
    acciones.resetbusqueda = resetbusqueda;
    acciones.buscar = buscar;
    acciones.enviarAlServer = enviarAlServer;
    acciones.getQuery = getQuery;
    acciones.listarusuarios = listarusuarios;


    //window.FratrisFacturacion.acciones.editar = editar;
    // window.FratrisFacturacion.acciones.borrar = borrar;
    // window.FratrisFacturacion.acciones.listar = listar;


    $("button").live("click", ejecutarClick);
    $("a").live("click", ejecutarClick);
    $("select").live("change", ejecutarChange);
    $("input").live("change", ejecutarChangeInput);


    function ejecutarClick(event) {
        var accion = $(event.target).attr('data-facturacion-accion');
        if (typeof accion !== "undefined") {
            accion = accion.split('_');
            var metodo = accion[0];
            var parametros = typeof accion[1] !== 'undefined' ? accion[1].replace('#', '_') : '';
            if (acciones.hasOwnProperty(metodo)) {
                acciones[metodo](parametros, event.target);
            } else
                alert(accion("Accion " + metodo + " no existe!!"));
        }
    }

    function ejecutarChange(event) {
        ejecutarChangeSelect(event);

    }

    // funcionesgenerales.js
    /**
     * @name ejecutarChangeSelect;
     * @description Ejecutar un change en un select
     *              Se capturan todos los elementos de la forma actual, delse revisa quien depende del select actual, ccadauno de los que dependa se iniciliza
     *
     */
    function ejecutarChangeSelect(event) {
        var select,
            id= $(event.target).attr('data-facturacion-id');
        if (id !== undefined) {
            select = $(event.target).select2('data');
            if (select !== null) {
                var valor = select.id;
                cambiarvaloresdeselect(id, valor)
            }
        }
    }

    function ejecutarChangeInput(event) {
        var valor,
            id = $(event.target).attr('data-facturacion-id');
        if (id !== undefined) {
            valor = $(event.target).val();
            if (parseInt(valor) >= 0) {
                cambiarvaloresdeselect(id, valor)
            }
        }
    }

    function cambiarvaloresdeselect(id, valor) {
        for (var select in valoresselect) {
            if (valoresselect.hasOwnProperty(select)) {
                var elementos = valoresselect[select][0];
                if (elementos.hasOwnProperty(id)) {
                    var elemento = $("select[data-facturacion-id='" + select + "']");
                    if (elemento.length) {
                        resetValor['select']({elemento: elemento, dependientede: id, valordependencia: valor});
                    }
                }
            }
        }
    }


    // funcionesgenerales.js
    /**
     * @name mostrarPantalla;
     * @description Mostrar la pantalla de creacion de registros
     */
    function clearshow(pantalla) {
        cleardisplay(pantalla);
        show(pantalla);
    }

    // funcionesgenerales.js
    /**
     * @name mostrarPantalla;
     * @description Mostrar la pantalla de creacion de registros
     */
    function show(pantalla) {
        pantalla = $("div[data-facturacion-pantalla= '" + pantalla + "'] ");
        if ($(pantalla).hasClass("modal")) {
            $(pantalla).modal('show');
        } else {
            ocultarPantallas();
            $(pantalla).show();
        }

        $(pantalla).find('form[data-facturacion-tipo="forma"]').each(function(el,forma){
            var formaAValidar = $(forma).data('formValidation');
            if (formaAValidar !== undefined ){
                formaAValidar.destroy();
            }
            acciones.asignarValidadorAforma(forma);
        });
    }


    // funcionesgenerales.js
    /**
     * @name ocultarpantalla
     * @description Recorre el documento y busca y oculta elementos con tag data-facturacion-tipo='pantalla'
     */
    function ocultarPantallas() {
        var pantallas = $("div[data-facturacion-tipo='pantalla']");
        $.each(pantallas, function (index, pantalla) {
            if ($(pantalla).hasClass("modal")) {
                $(pantalla).modal('hide');
            } else {
                $(pantalla).hide();
            }
        });
    }

    // funcionesgenerales.js
    /**
     * @name limpiarPantalla;
     * @description Buscar todos los elementos con tag data-facturacion-tipo='input' dentro de la(s) forma(s) en la pantalla y les hace un reset
     */
    function cleardisplay(pantalla) {
        var tipoelemento,
            forma = $("div[data-facturacion-pantalla = '" + pantalla + "'] form"),
            elementos = forma.find("[data-facturacion-tipo = 'input']");
        $.each(elementos, function (index, elemento) {
            tipoelemento = $(elemento).attr('data-facturacion-input');
            if (typeof tipoelemento !== 'undefined') {
                if (resetValor.hasOwnProperty(tipoelemento)) {
                    resetValor[tipoelemento]({elemento: elemento});
                }
                else {
                    console.log('Noexiste reset valido para tipoelemento ' + tipoelemento);
                }
            }
        });
    }

    // funcionesgenerales.js
    /**
     * @name getInputs;
     * @description Buscar todos los elementos con tag data-facturacion-tipo='input' dentro de la(s) forma(s) en la pantalla
     */
    function getInputs(pantalla) {
        return $("div[data-facturacion-pantalla = '" + pantalla + "'] form").find("[data-facturacion-tipo = 'input']");
    }

    // funcionesgenerales.js
    /**
     * @name mostraPantalla;
     * @description Mostrar la pantalla actual
     */
    function mostrarPantalla(pantalla) {
        return $("div[data-facturacion-tipo = '" + pantalla + "'] form").find("[data-tipo-centrek = 'input']");
    }



    function ajaxServer(botonActivar, data, url, accionCallBack) {
        if (typeof botonActivar !== 'undefined' && $(botonActivar).length) {
            botonActivar.attr("disabled", true);
        }
        var saveData = $.ajax({
            url: url,
            timeout: 60000,
            type:'POST',
            data: data,
            dataType: 'json',
            success: function (resultData) {
                accionCallBack(resultData);
            },
            error: function (x, t, m) {
                if (t === "timeout") {
                    alert("Esta demorando demasiado");
                } else {
                    alert('error');
                    alert(t);
                }
            }
        });

        saveData.always(function () {
            if (typeof botonActivar !== 'undefined' && $(botonActivar).length) {
                botonActivar.attr("disabled", false);
            }
        });
    }

    function creartabla(tabla, columnas, datasrc) {
        return $('#' + tabla).dataTable({
            "aaData": datasrc,
            "aoColumns": columnas,
            "bFilter": false,
            "loadingMessage": 'Cargando Datos...',
            "pageLength": 100,
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


    function editar(p, elemento) {
        var parametros = ($(elemento).attr('data-facturacion-accion')).split('_');
        var pantalla = parametros[1].replace('#', '_');
        acciones.clearshow(pantalla);
        var forma = $("div[data-facturacion-pantalla='" + pantalla + "'] form ");
        var elementos = forma.find("[data-facturacion-input]");
        var data = $("#datatable_ajax").DataTable();
        for (var i = 0; i < data.rows().data().length; i++) {
            if (parseInt(data.row(i).data().DT_RowId) === parseInt(parametros[2])) {
                $.each(elementos, function (index, elemento) {
                    var tipo = $(elemento).attr('data-facturacion-input');
                    var id = $(elemento).attr('data-facturacion-id');
                    var row = data.row(i).data();
                    var valor = getValor(elemento, tipo, id, row);
                    if (resetValor.hasOwnProperty(tipo)) {
                        resetValor[tipo]({elemento: elemento, valor: valor});
                    }
                    else {
                        console.log('Noexiste reset valido para tipoelemento ' + tipo);
                    }
                });
                break;
            }
        }
    }

    function getValor(elemento, tipo, id, data) {
        var valor,
            idf;
        if (tipo == 'rangofechasavanzadofuturo') {
            idf = id.replace('inicial', 'final');
            valor = data[id] + "_" + data[idf];
        } else {
            valor = data[id];
        }
        return valor;
    }

    function crearregistro(tipo, event) {
        var botonActivar = $(event),
            url = window.urlcrear,
            accionCallBack = registrocreado,
            forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form "),
            elementos = forma.find("[data-facturacion-input]");
  //      forma = forma.data('formValidation');
  //      if (forma !== undefined && forma.validate().isValid()) {
            acciones.enviarAlServer(botonActivar, url, accionCallBack, elementos, tipo);
  //      }
    }

    function enviarAlServer(botonActivar, url, accionCallBack, elementos, tipo) {
        var rowvalues = {},
            queryurl = getQuery();
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
        acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
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


    function registrocreado(data) {
        if (data.OK === 'OK') {
            show('principal');
            displayerror("notice", data.Mensaje);
            $("#datatable_ajax").DataTable().draw();
        } else {
            displayerror("warning", data.Mensaje);
        }
    }


    function resetdatatable(table) {
        table.columns().eq(0).each(function (i) {
            table.column(i).search('', false, true);
        });
        var filtro = $("#filtradopor").find("li");
        filtro.eq(2).remove();
        filtro.eq(1).remove();
    }

    function resetbusqueda() {
        var table = jQuery('#datatable_ajax').DataTable();
        resetdatatable(table);
        table.draw();
        show('principal');
    }


    function buscar() {
        var filtro = "";
        var table = jQuery('#datatable_ajax').DataTable();
        resetdatatable(table);
        var forma = $("div[data-facturacion-pantalla='buscar'] form ");
        var elementos = forma.find("[data-facturacion-input]");
        $.each(elementos, function (index, elemento) {
            var tipo = $(elemento).attr('data-facturacion-input');
            var id = $(elemento).attr('data-facturacion-id');
            var nombre = $(elemento).attr('data-facturacion-label');
            if (acciones.recoverValorBusqueda.hasOwnProperty(tipo)) {
                var valor = acciones.recoverValorBusqueda[tipo](elemento);
                if (valor !== undefined) {
                    var campo = id + '#' + valor[0] + '#' + valor[1];
                    table.column(nombre + ':name').search(campo, false, true);
                    filtro += filtro.trim() != "" ? " y " + valor[2] : valor[2];
                }
            } else {
                displayerror('warning', 'Forma busqueda: Error inicializando tipo de input: ' + value[0] + ' campo: ' + value[1]);
            }
        });
        //Actualizar mensaje de filtrado
        var filtrospan = $("#filtradopor");
        var filtroli = filtrospan.find("li");
        filtroli.eq(2).remove();
        filtroli.eq(1).remove();
        filtrospan.append('<li><h5>Filtrado por :</h5></b></li><li><h6>' + filtro + '</h6></li>');
        table.draw();
        show('principal');
    }


    function getQuery() {
        var url = location.search;
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0, result = {}; i < qs.length; i++) {
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]); //generar todas las variables
        }
        return result;
    }


    function subirArchivo(id) {
        var objUploadFiles = window["objUploadFiles_" + id];
        if (objUploadFiles && objUploadFiles.directorio) {
            var directorio = "&directorio=" + objUploadFiles.directorio;
            var url = urlcrear.replace('task=listar.crear', 'Uploadfiles.uploadFiles&' + directorio);
            objUploadFiles.setOption("url", urlsubirfiles);
            $('#tab_images_uploader_uploadfiles_' + tiposecampos[j][1]).trigger("click");
        }
    }

    /**
     *
     * @param campo
     * opciones[0] : Requerido
     * opciones[1]:  Tipo de campo
     * opciones[2]: Se debe enviar para grabacion
     * opciones[3]: Longitud
     */

    function campoSeDebeGrabar(campo) {
        var opciones = $(campo).attr('data-facturacion-grabar');
        return parseInt(opciones) ? true : false;
    }


    function generateValidation(){

    }



    function listarusuarios(){
        window.frhost = frhost+ "?option=com_certilab&view=listar&menu=201";
        window.location = frhost;
    }


})();


function EditarItem() {

}








