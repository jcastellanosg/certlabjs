function Editar(id) {
    if (inicializarValoresDeEdicion(id)) {
        var ventanamodal = $('#myModal_editar');
        if (ventanamodal.length == 0) {
            activarVentanaEdicion();
        } else {
            ventanamodal.modal('show');
        }
    }
}

function activarVentanaEdicion(id) {
    $("#myNoModal_editar").css('display', 'block');
    $("#tabla").css('display', 'none');
}

function activarVentanaListarEdicion() {
    $("#myNoModal_editar").css('display', 'none');
    $("#tabla").css('display', 'block');
}

function inicializarValoresDeEdicion(id) {
    ressetFormaEdicion();
    var resultado = false;
    var datarow = null;
    var datos = $('#datatable_ajax').DataTable().ajax.json().data;
    // Recuperar los valores de edicion desde el json que coincidan con el id del registro
    // y los guarda en datarow en el formato {campo:valor ... }
    $.each(datos, function (index, value) {
        if (value.DT_RowId == id)
            datarow = value;
    });
    if (datarow != null) {
        $.each(tiposecampos, function (index, value) {
            if (value[1].indexOf("editar_") >= 0) {
                // usando el array tipos de campos extrae del id el nombre del campo eliminando el prefijo buscar
                rowid = value[1].substring(7);
                //Inicializa el valor del campo mediante el metodo value[0] objecto setValueEdition del archivo recovervalues.js
                if (typeof setValueEdition[value[0]] != 'undefined') {
                    setValueEdition[value[0]](value[1], datarow[rowid], datarow);
                } else {
                    displayerror('warning', 'Forma edicion:  Error inicializando tipo de input: ' + value[0] + ' campo: ' + value[1]);
                }
            }
        });
        resultado = true;
    }
    return resultado;
}


function ressetFormaEdicion() {
    $("#form_edicion")[0].reset();
// Inicializar campos de busqueda
    $.each(tiposecampos, function (index, value) {
        if (value[1].indexOf("editar_") >= 0) {
            // dependiendo del tipo de campo inicializar el valor  mediante el metodo value[0]
            // del objecto inicializarValoresInputs  archivo template js
            if (typeof inicializarValoresInputs[value[0]] != "undefined") {
                inicializarValoresInputs[value[0]](value[1]);  // Recupera el valor dependiendo del tipo de input value[1]
            } else {
                displayerror('warning', 'Forma edicion:  Error inicializando tipo de input: ' + value[0] + ' campo: ' + value[1]);
            }
        }
    });
}


function crearRegistroEdicion() {
    if (typeof urlcrear != "undefined") {
        var data = getDataFromFormEdicion();
        EnviarDataEdicion(urlcrear, data);
    } else {
        displayerror('warning', 'Forma edicion:  No existe url para edicion ');
    }
}

function getDataFromFormEdicion() {
    valores = [];
    $.each(tiposecampos, function (index, value) {
        if (value[1].indexOf("editar_") >= 0) {
            // Recuperar el valor del campo input dependiendo del metodo value[0] objeto recoverValueCreacion
            // archivo recovervaluejs
            if (typeof recoverValueCreacion[value[0]] != 'undefined') {
                valor = recoverValueCreacion[value[0]](value[1]);
                if (valor != "") {
                    valores.push(valor);  // Recupera el valor dependiendo del tipo de input value[1]
                }
            } else {
                displayerror('warning', 'Forma edicion:  Error recuperando el valor del input: ' + value[0] + ' campo: ' + value[1]);
            }
        }
    });
    return JSON.parse("{" + valores.join(",").replace('buscar_', '') + "}");
}

function EnviarDataEdicion(url, data) {

    jQuery("#bt_form_editar_crear").attr("disabled", true);
    var saveData = $.ajax({
        url: url,
        timeout: 10000,
        data: data,
        dataType: 'json',
        success: function (resultData) {
            if (resultData.hasOwnProperty('OK')) {
                if (resultData.OK == 'OK') {
                    subirArchivoEdicion();
                    displayerror("notice", resultData.Mensaje);
                    activarVentanaListarEdicion();
                    $('#myModal_editar').modal('hide');
                    $('#datatable_ajax').DataTable().draw();
                } else {
                    displayerror("warning", resultData.Mensaje);
                }
            }
        },
        error: function (x, t, m) {
            if (t === "timeout") {
                displayerror('warning', 'Forma edicion:  tiempo de espera en envio de datos sobrepaso el limite por favor contacte al administrador');
            } else {
                displayerror('warning', 'Forma edicion:  Error enviando datos al servidor por favor revise - ' + t);
            }
        }
    });

    saveData.always(function () {
        jQuery("#bt_form_editar_crear").attr("disabled", false);
    });
}


function subirArchivoEdicion() {
    for (var j = 0; j < tiposecampos.length; j++) {
        if ((tiposecampos[j][0] == 'files') && (tiposecampos[j][1].indexOf('editar_') >= 0)) {
            var objUploadFiles = window["objUploadFiles_" + tiposecampos[j][1]];
            if (objUploadFiles && objUploadFiles.directorio) {
                var directorio = "&directorio=" + objUploadFiles.directorio;
                var url = urlcrear.split('&')
                for (var i = 0; i < url.length; i++)
                    if (url[i].indexOf('task') >= 0)
                        url[i] = "task=Uploadfiles.uploadFiles";
                urlsubirfiles = url.join('&') + directorio;
                objUploadFiles.setOption("url", urlsubirfiles);
                $('#tab_images_uploader_uploadfiles_' + tiposecampos[j][1]).trigger("click");
            }
        }
    }
}
