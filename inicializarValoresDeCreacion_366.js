(function () {

    "use strict";
    // camposdatatable




    var acciones = window.FratrisFacturacion.acciones;
    acciones.crearregistro = crearregistro;

    window.FratrisFacturacion.acciones.resetValor['files'] =   function (parametros) {
        var elemento = parametros.elemento,
            valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
        if ($(parametros.elemento).length) {
            var val = $(parametros.elemento).attr('id');
            if (window["objUploadFiles_" + val] !== undefined && valor !== '') {
                window["objUploadFiles_" + val].directorio = valor;
            } else {
                if (window["objUploadFiles_" + val] !== undefined) {
                    window["objUploadFiles_" + val].destroy();
                }
                files(val, valor);
            }
        }
    };

    var tipodeacccion;

    function crearregistro(tipo, event) {

        subirArchivos.tipo = tipo;
        var resultado = {};
            resultado.OK = 'OK';
        subirArchivos(resultado);
       /*

        var botonActivar = $(event),
            url = window.urlcrear,
            accionCallBack = subirArchivos,
            forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form "),
            elementos = forma.find("[data-facturacion-input]");
        acciones.enviarAlServer(botonActivar, url, accionCallBack, elementos,tipo);
        */
    }


    function subirArchivos(resultado) {
        if (resultado.OK === 'OK') {
            var tipo = subirArchivos.tipo;
            var forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form ");
            var idFile = forma.find('input[data-facturacion-input="files"]').attr('id');
            if (idFile) {
                subirArchivo(idFile);
            }
        } else {
            displayerrormodal(resultado.Mensaje);
        }
    }

    function subirArchivo(id) {
        var objUploadFiles = window["objUploadFiles_" + id];
        if (objUploadFiles && objUploadFiles.directorio) {
            var directorio = "&directorio=" + objUploadFiles.directorio;
            var url = urlcrear.replace('task=listar.crear', 'task=Uploadfiles.uploadFiles&directorio=' + directorio);
            objUploadFiles.setOption("url", url);
            objUploadFiles.bind("FileUploaded",FileUploadComplete);
            objUploadFiles.bind("UploadComplete",UploadComplete);
            objUploadFiles.bind("Error",Error);
            objUploadFiles.bind( "BeforeUpload", PluploadBeforeUpload );
            objUploadFiles.start();
        }
    }


    function  PluploadBeforeUpload( uploader, file) {
        var query = get_query(),
            params = uploader.settings.multipart_params;
        params.descripcion = $("#descripcionfile_" + file.id).val();
        params.campo = query.campo;
        params.id = query.id;
        params.uploader = uploader.id;
        params.tipo = "ordendecompra";
    }

    function FileUploadComplete(up,file,response) {
        console.log(response);
    }

    function  UploadComplete(up,file,response){
      acciones.show('principal');
      $("#datatable_ajax").DataTable().draw();
    }

    function error (up, args) {
        displayerrormodal(args);
    }

// recuperar de la url campo & id
    function get_query() {
        var url = location.search;
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0, result = {}; i < qs.length; i++) {
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]); //generar todas las variables
        }
        return result;
    }

})();


function inicializarValoresDeCreacion() {


}

function files(val, directorio) {


    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        url: "http://localhost",

        browse_button: document.getElementById('tab_images_uploader_pickfiles_' + val), // you can pass in id...
        container: document.getElementById('tab_images_uploader_container_' + val), // ... or DOM Element itself


        filters: {
            max_file_size: '100mb',
            mime_types: [
                {title: "Image files", extensions: "jpg,gif,png,pdf,doc,docx,txt"},
                {title: "Zip files", extensions: "zip"}
            ]
        },

        // Flash settings
        flash_swf_url: '../media/com_certilab/assets/global/plugins/plupload/js/Moxie.swf',

        // Silverlight settings
        silverlight_xap_url: '../media/com_certilab/assets/global/plugins/plupload/js/Moxie.xap',

        multipar : true,
        multipart_params : {
            "nombre" : "value1",
            "descripcion" : "value2"
        },


        init: {
            PostInit: function () {
                $('#tab_images_uploader_filelist_' + val).html("");

                $('#tab_images_uploader_uploadfiles_' + val).click(function () {
                    uploader.start();
                    return false;
                });

                $('#tab_images_uploader_filelist_' + val).on('click', '.added-files .remove', function () {
                    uploader.removeFile($(this).parent('.added-files').attr("id"));
                    $(this).parent('.added-files').remove();
                });
            },


            FilesAdded: function (up, files) {
                plupload.each(files, function (file) {
                    $('#tab_images_uploader_filelist_' + val).append('' +
                     '<div class="alert alert-warning added-files" id="uploaded_file_' + file.id + '">' +
                        file.name + '(' + plupload.formatSize(file.size) + ') ' +
                    '<input  type="text" id="descripcionfile_' + file.id + '" placeholder="Descripcion"> <span class="status label label-info" ></span>&nbsp;<a href="javascript:;"  style="padding:2px 4px; font-size:14px" class="remove pull-right btn btn-xs red"><i class="fa fa-times"></i> Borrar</a></div>');
                });
            },

            UploadProgress: function (up, file) {
                $('#uploaded_file_' + file.id + ' > .status').html(file.percent + '%');
            },

            FileUploaded: function (up, file, response) {
                response = JSON.parse(response.response);
                if (response.OK  == 1) {
                    var id = file.id; // uploaded file's unique name. Here you can collect uploaded file names and submit an jax request to your server side script to process the uploaded files and update the images tabke
                    $('#uploaded_file_' + file.id + ' > .status').removeClass("label-info").addClass("label-success").html('<i class="fa fa-check"></i> Listo!'); // set successfull upload
                } else {
                    $('#uploaded_file_' + file.id + ' > .status').removeClass("label-info").addClass("label-danger").html('<i class="fa fa-warning"></i> Fallo upload'); // set failed upload
                    Metronic.alert({
                        type: 'danger',
                        message: 'Fallo la transferencia dearchivo al servidor. Por favor reintente.',
                        closeInSeconds: 10,
                        icon: 'warning'
                    });
                }
            },

            Error: function (up, err) {
                Metronic.alert({type: 'danger', message: err.message, closeInSeconds: 10, icon: 'warning'});
            }
        }
    });
    uploader.init();
    uploader.directorio = directorio === '' ? uploader.directorio = uploader.id : uploader.directorio = directorio;
    window["objUploadFiles_" + val] = uploader;
}

