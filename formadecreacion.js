
function ressetFormaCreacion() {
    $("#form_crear")[0].reset();
// Inicializar campos de busqueda
    $.each(tiposecampos, function (index, value) {
        if (value[1].indexOf("crear_") >= 0) {
            //poner a 0 valores de campo mediante el metodo value[0] objecto inicializarValoresInputs del archivo template.js
            if (typeof inicializarValoresInputs[value[0]] != "undefined") {
                inicializarValoresInputs[value[0]](value[1]);  // Recupera el valor dependiendo del tipo de input value[1]
            } else {
                displayerror('warning', 'Forma creacion: Error inicializando tipo de input: ' + value[0] + ' campo: ' + value[1]);
            }
        }
    });

    //Inicializar Valores
    if (typeof valores_actuales != "undefined" && valores_actuales instanceof Array) {
        for (var i = 0; i < valores_actuales.length; i++) {
            id = "crear_" + valores_actuales[i][0];
            for (var j = 0; j < tiposecampos.length; j++) {
                if (tiposecampos[j][1] == id) {
                    setValueEdition[tiposecampos[j][0]](id, valores_actuales[i][1])
                }
            }
        }
    }
}


function crearRegistro() {
    if (typeof urlcrear != "undefined") {
        var data = getDataFromForm();
        EnviarData(urlcrear, data);
    } else {
        displayerror('warning', 'Forma creacion:  No existe url para creacion');
    }
}

function getDataFromForm() {
    valores = [];
    $.each(tiposecampos, function (index, value) {
        if (value[1].indexOf("crear_") >= 0) {
            // Recuperar el valor del campo input dependiendo del metodo value[0] objeto recoverValueCreacion
            // archivo recovervaluejs
            if (typeof recoverValueCreacion[value[0]] != 'undefined') {
                valor = recoverValueCreacion[value[0]](value[1]);
                if (valor != "") {
                    $.each(valor, function (i, value) {
                        valores.push(value);
                    });
                }
            } else {
                displayerror('warning', 'Forma creacion:  Error recuperando el valor del input: ' + value[0] + ' campo: ' + value[1]);
            }
        }
    });
    return JSON.parse("{" + valores.join(",") + "}");
}

function EnviarData(url, data) {
    jQuery("#bt_form_crear_crear").attr("disabled", true);
    var saveData = $.ajax({
        url: url,
        timeout: 10000,
        data: data,
        dataType: 'json',
        success: function (resultData) {
            if (resultData.hasOwnProperty('OK')) {
                if (resultData.OK == 'OK') {
                    subirArchivo();
                    displayerror("notice", resultData.Mensaje);
                    $('#myModal_crear').modal('hide');
                    desactivarVentanaCreacion();
                    $('#datatable_ajax').DataTable().draw();

                } else {
                    displayerror("warning", resultData.Mensaje);
                }
            }
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
        jQuery("#bt_form_crear_crear").attr("disabled", false);
    });
}


function activarVentanaCreacion() {
    $("#myNoModal_crear").css('display', 'block');
    $("#tabla").css('display', 'none');
}

function desactivarVentanaCreacion() {
    $("#myNoModal_crear").css('display', 'none');
    $("#tabla").css('display', 'block');
}


function subirArchivo() {
    for (var j = 0; j < tiposecampos.length; j++) {
        if ((tiposecampos[j][0] == 'files') && (tiposecampos[j][1].indexOf('crear_') >= 0)) {
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


