/**
 * Created by jcastellanosg on 5/19/2015.
 */

(function () {

    window.FratrisFacturacion.acciones.resetValor = {

        datetime:function(parametros){
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : 0;

        },

        oculto: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : 0;
            $(elemento).val(valor).trigger('change');
        },

        input: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            $(elemento).val(valor).trigger("change");
        },

        selecthorizontal: select,

        select: select,

        multiselect:multiselect,

            selectinputtext: selectbusquedas,

        selectinputnumerico: selectbusquedas,


        estatica: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            $(elemento).text(valor);
        },

        switchbox: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : 'Activo';
            valor = valor.indexOf('Activo') > 0;
            $(elemento).bootstrapSwitch('state', valor);
        },

        datatable: function (id, valor) {
            inicializarScriptsInputs.datatableurlopcion = "&campo=f_producto_id&id=1434129612248";
            $('#datatable' + id).DataTable().draw();
        },


        countrylist: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            $(elemento).select2({
                placeholder: "Seleccionar pais",
                allowClear: true,
                formatResult: format,
                formatSelection: format,
                escapeMarkup: function (m) {
                    return m;
                }
            });
            $(elemento).val(valor).trigger('change');
        },

        thumbnail: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            $(elemento).html(valor);
        },


        selectAll: function (id, valor) {
            $("#" + id).select2('val', valor, true).trigger('click');

        },


        textarea: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            $(elemento).val(valor);
        },

        rangofechasavanzadofuturo: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            fechaInicial = valor.split("_")[0] ? moment(valor.split("_")[0]).format("YYYY/MM/DD") : moment().format("YYYY/MM/DD");
            fechaFinal = valor.split("_")[1] ? moment(valor.split("_")[1]).format("YYYY/MM/DD") : moment().format("YYYY/MM/DD");
            rangoFechas(elemento);
            $(elemento).data('daterangepicker').setStartDate(fechaInicial);
            $(elemento).data('daterangepicker').setEndDate(fechaFinal);
            $(elemento).find('span').html(fechaInicial + " - " + fechaFinal);
        },

        radio: function (id, valor) {
            valor = valor.primeraLetraEnMayuscula();
            // $("#grupo_"+ val + " span").removeClass('checked');
            // $("input:radio[name='"+ val +"']").removeAttr('checked');
            $("input:radio[name='" + id + "'][value='" + valor + "']").attr('checked', 'checked').parent().addClass('checked');
        },

        checkboxinline: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            valor = valor.split(',');
   //         $.each(valor, function (i, value) {
  //              $("input:checkbox[name='" + id + "[]'][value='" + value + "']").attr('checked', 'checked').parent().addClass('checked');
  //          });
        },

        files: function (parametros) {
            var elemento = parametros.elemento,
                valor = parametros.hasOwnProperty('valor') ? parametros.valor : '';
            if ($(parametros.elemento).length) {
                val = $(parametros.elemento).attr('id');
                if (window["objUploadFiles_" + val] !== undefined && valor !== '') {
                    window["objUploadFiles_" + val].directorio = valor;
                } else {
                    if (window["objUploadFiles_" + val] !== undefined) {
                        window["objUploadFiles_" + val].destroy();
                    }
                    files(val, valor);
                }
            }
        }

    };

    function select(parametros) {
        var nuevosvalores,
            opciones = [],
            elemento = parametros.elemento,
            valor = parametros.hasOwnProperty('valor') ? parametros.valor : 0,
            id = $(elemento).attr('data-facturacion-id');
        if (isEmptyObjeto(valoresselect) || !valoresselect.hasOwnProperty(id)){
            return;
        }
        if (typeof parametros.dependientede !== "undefined" && valoresselect[id][0].hasOwnProperty(parametros.dependientede)) {
            nuevosvalores = valoresselect[id].filter(function (elemento) {
                return elemento[parametros.dependientede] === parametros.valordependencia;
            })
        } else if (typeof parametros.dependientede === 'undefined' && Object.keys(valoresselect[id][0]).length === 2) {
            nuevosvalores = valoresselect[id];
        }
        if (typeof nuevosvalores !== 'undefined') {
            $.each(nuevosvalores, function (index, el) {
                opciones.push("<option value='" + el.id + "'>" + el.value + "</option>");
            });
            opciones.push("<option value='0'> </option>");
            $(elemento).html(opciones.join('\n\t\t'));
        }
        $(elemento).select2().select2('val', valor, true);
    }

    function isEmptyObjeto(objeto) {
        var x;
        for (x in objeto) {
            if (objeto.hasOwnProperty(x)) {
                return false
            }
        }
        return true
    }


    function files(val, directorio) {
        // see http://www.plupload.com/
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
//            url: "http://localhost/joomla/administrator/index.php?option=com_facturacion&task=Uploadfiles.uploadFiles&view=listar",
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
                        $('#tab_images_uploader_filelist_' + val).append('<div class="alert alert-warning added-files" id="uploaded_file_' + file.id + '">' + file.name + '(' + plupload.formatSize(file.size) + ') <span class="status label label-info"></span>&nbsp;<a href="javascript:;" style="margin-top:-5px" class="remove pull-right btn btn-sm red"><i class="fa fa-times"></i> Borrar</a></div>');
                    });
                },

                UploadProgress: function (up, file) {
                    $('#uploaded_file_' + file.id + ' > .status').html(file.percent + '%');
                },

                FileUploaded: function (up, file, response) {
                    response = JSON.parse(response.response);
                    if (response.result && response.result == 'OK') {
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

    function rangoFechas(elemento) {
        $(elemento).daterangepicker({
                opens: (Metronic.isRTL() ? 'left' : 'right'),
                startDate: moment().subtract(29, 'days'),
                endDate: moment(),
                minDate: '2000/01/01',
                maxDate: '2099/01/01',
                dateLimit: {
                    days: 360
                },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                ranges: {
                    'Hoy': [moment(), moment()],
                    'Desde Hoy': [moment().subtract(1, 'days'), moment(new Date(2099, 01, 01, 0, 0, 0))],
                    'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                    'Este año': [moment().startOf('year'), moment().endOf('year')]
                },
                buttonClasses: ['btn'],
                applyClass: 'green',
                cancelClass: 'default',
                format: 'YYYY/MM/DD',
                separator: ' hasta ',
                locale: {
                    cancelLabel: 'Clear',
                    applyLabel: 'Aceptar',
                    fromLabel: 'Desde',
                    toLabel: 'Hasta',
                    customRangeLabel: 'Seleccionar Fechas',
                    daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    firstDay: 1
                }
            },
            function (start, end) {
                $(elemento).find('span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            }
        );
    }

    function format(state) {
        if (!state.id) return state.text; // optgroup
        return "<img class='flag' src='../media/com_certilab/assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
    }

    function selectbusquedas(parametros) {
        var icono = '&nbsp<i class="fa fa-angle-down"></i>',
            elemento = parametros.elemento;
        $(elemento).find('button').html('Debe ' + icono);
        $(elemento).find('input').val('');
        $(elemento).find('ul').click(
            function clickLi(event) {
                var texto = $(event.target).text().trim();
                $(elemento).find('button:first-child').html(texto + icono);
            })
    }

    function multiselect(parametros) {
        var nuevosvalores,
            opciones = [],
            elemento = parametros.elemento,
            valor = parametros.hasOwnProperty('valor') ? parametros.valor : 0,
            id = $(elemento).attr('data-facturacion-id');
        if (isEmptyObjeto(valoresselect) || !valoresselect.hasOwnProperty(id)){
            return;
        }
        if (typeof parametros.dependientede !== "undefined" && valoresselect[id][0].hasOwnProperty(parametros.dependientede)) {
            nuevosvalores = valoresselect[id].filter(function (elemento) {
                return elemento[parametros.dependientede] === parametros.valordependencia;
            })
        } else if (typeof parametros.dependientede === 'undefined' && Object.keys(valoresselect[id][0]).length === 2) {
            nuevosvalores = valoresselect[id];
        }
        if (typeof nuevosvalores !== 'undefined') {
            $.each(nuevosvalores, function (index, el) {
                opciones.push("<option value='" + el.id + "'>" + el.value + "</option>");
            });
            opciones.push("<option value='0'> </option>");
            $(elemento).html(opciones.join('\n\t\t'));
        }
        $(elemento).multiSelect();
        $(elemento).multiSelect('deselect_all');
    }

})();