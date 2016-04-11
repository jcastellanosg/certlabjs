var inicializarValoresInputs = {

    datatable: function (val) {

    },
    countrylist: function (val) {
    },

    files: function (val) {
        $('#tab_images_uploader_filelist_' + val + ' a').each(function () {
            $(this).trigger("click");
        });
    },

    oculto: function (val) {
        valor = $("#" + val).val('');
    },

    input: function (val) {
        valor = $("#" + val).val('');
    },


    switchbox: function (val) {
        $("#" + val).prop('checked', true);
    },

    // Aplica para todos losinput
    selectinputtext: function (val) {
        $('.dropdown-toggle').addClass('default').removeClass('green');
        $('.green').addClass('default').removeClass('green').text('Debe');
    },

    estatica: function () {
        return true;
    },

    thumbnail: function () {
        return true;
    },


    textarea: function (val) {
        $("#" + val).text('');
    },

    select: function (val) {
      $('#' + val).select2('val',"0", true).val("0","xxxx").trigger("change");
    },

    selecthorizontal: function (val) {
        $('#' + val).val("0","000").trigger("change");
    },
    selectAll: function (val) {
        $('#' + val).select2('val',"0", true);
    },

    checkboxinline: function (val) {
        $("input:checkbox[name='" + val + "[]']").attr('checked', false);
        $("#grupo_" + val + " span").removeClass('checked');
        return true;
    },

    checkbox: function (val) {
        $("#grupo_" + val + " span").removeClass('checked');
        return true;
    },

    radio: function (val) {
        $("#grupo_" + val + " span").removeClass('checked');
        $("input:radio[name='" + val + "']").removeAttr('checked');

        return true;
    },

    rangofechasavanzado: function (val) {
        //Set the initial state of the picker label
        $('#' + val).find('span').html('');
    },

    rangofechasavanzadofuturo: function (val) {
        $('#' + val).data('daterangepicker').setStartDate('2014-03-01');
        $('#rangofechas_' + val).html('');
    }
};

// Aplicar los eventos a que haya lugar
var inicializarScriptsInputs = {

    files: function (val) {
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

        window["objUploadFiles_" + val] = uploader;
    },

    datatable: function (val) {
        for (var idt = 0; idt < window.tiposecampos.length; idt++) {
            if (window.tiposecampos[idt][1] == val) {
                inicializardatatabla(tiposecampos[idt][5], val)
            }
        }
    },

    selectinputtext: function (elemento) {
        var id = $(elemento).attr("data-facturacion-id");
        elemento = $('#grupo_buscar_' + id);
        elemento.find("li").click(function () {
            elemento.find('button').addClass('green').removeClass('default');
            $('#buscar_' + id + '_operador').text($(this).text());
        });
    },

    selectinputnumerico: function (elemento) {
        var id = $(elemento).attr("data-facturacion-id");
        elemento = $('#grupo_buscar_' + id);
        elemento.find("li").click(function () {
            elemento.find('button').addClass('green').removeClass('default');
            $('#buscar_' + id + '_operador').text($(this).text());
        });
    },

    countrylist: function (elemento) {
        $(elemento).select2({
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });
    },

    estatica: function () {
        return true;
    },

    thumbnail: function () {
        return true;
    },

    oculto: function () {
        return true;
    },

    switchbox: function () {
        return true;
    },

    radio: function () {
        return true;
    },

    checkbox: function () {
        return true;
    },

    checkboxinline: function () {
        return true;
    },

    input: function () {
        return true;
    },

    textarea: function () {
        return true;
    },

    select: function (value) {
        $.each(valoresselect, function (index, valor) {
            if (valor[0] == value || valor[1] == value) {
                if (typeof valor[7] != "undefined") {
                    addOnclickSelect(value, valor[6]); // enviar id del target y del source
                } else {
                    addValoresAlSelect(value);
                }
                return false;  // salir del break
            }
        });
    },

    selecthorizontal: function (value) {
        $.each(valoresselect, function (index, valor) {
            if (valor[0] == value || valor[1] == value) {
                if (typeof valor[7] != "undefined") {
                    addOnclickSelect(value, valor[6]); // enviar id del target y del source
                } else {
                    addValoresAlSelect(value);
                }
                return false;  // salir del break
            }
        });
    },

    selectAll: function (value) {
        this.select(value);
//       $("<option value='0'> Todo</option>").append("#"+value)
      },

    rangofechasavanzado: function (value) {
        $('#' + value).daterangepicker({
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
                timePicker: true,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                ranges: {
                    'Hoy': [moment(), moment()],
                    'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Ultimos 7 Dias': [moment().subtract(6, 'days'), moment()],
                    'Ultimos30 dias': [moment().subtract(29, 'days'), moment()],
                    'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                    'Ultimo Mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                buttonClasses: ['btn'],
                applyClass: 'green',
                cancelClass: 'default',
                format: 'YYYY/MM/DD',
                separator: ' hasta ',
                locale: {
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
                $('#' + value).find('span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            }
        ).on('cancel.daterangepicker', function (ev, picker) {
                //do something, like clearing an input
                $('#daterange').val('');
            });

    },

    rangofechasavanzadofuturo: function (value) {
        $('#' + value).daterangepicker({
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
                $('#rangofechas_' + value).html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            }
        ).on('cancel.daterangepicker', function (ev, picker) {
                $('#rangofechas_' + value).html('');
                $('#' + value).val('');
            }).on('apply.daterangepicker', function (ev, picker) {
                $('#rangofechas_' + value).html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            });

    },

    datetime: function (value) {
        $('#' + value).datetimepicker({
            autoclose: true,
            todayHighlight: true,
            language: "es",
            minuteStep: 5,
            isRTL: Metronic.isRTL(),
            format: "yyyy/mm/dd hh:ii",
            todayBtn: true,
            pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
        });
    }

};



function format(state) {
    if (!state.id) return state.text; // optgroup
    return "<img class='flag' src='../media/com_certilab/assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
}

// Value es el id del select y condicion es el filtro
function addValoresAlSelect(value, condicion) {
    var opciones = [];
    var select = $("#" + value);
    select.html('');

    $.each(valoresselect, function (index, valor) {
        // Validar que el id corresponda con el id buscar o crear en la matris valores select
        if (valor[0] == value || valor[1] == value) {
            // VAlidar si hay una condicion a cumplir
            if (typeof condicion != "undefined") {
                if (valor[7] == condicion) {
                    opciones.push("<option value='" + valor[3] + "'>" + valor[5] + "</option>");
                }
            } else {
                opciones.push("<option value='" + valor[3] + "'>" + valor[5] + "</option>");
            }
        }
    });
    opciones.push("<option value='0' selected='selected'> </option>");
    select.html(opciones.join('\n\t\t'));
    select.select2('val',"0", true);
 }

function addOnclickSelect(target, source) {
    if (target.indexOf('crear') >= 0)
        source = "#crear_" + source;
    else
        source = "#editar_" + source;

    if ($(source).is("select")) {
        $(source).select2().on("change", function () {
            addValoresAlSelect(target, $(source).val())
        }).on("select",function(){console.log("alert oo")})
    } else {
        $(source).change(function () {
            addValoresAlSelect(target, $(source).val())
        });
    }
}



function inicializardatatabla(url, id) {
    var newurl = url.replace('listar.getTable', 'listar.getCamposDeDatos');
    $.ajax({
        url: newurl,
        timeout: 10000,
        data: id,
        dataType: 'json',
        success: function (resultData) {
            if (typeof resultData.resultado != "OK") {
                crearTipoDatatable(id, resultData.data, url);
            } else {
                displayerror("warning", resultData.Mensaje);
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

}


function crearTipoDatatable(id, data, url) {
    var rowtd = "", columnas = [];
    for (var i = 0; i < data.length; i++) {
        columna = {};
        columna.searchable = !!data[i].buscar;
        columna.orderable = !!data[i].ordenar;
        columna.name = data[i].descripcion;
        columna.data = data[i].id;
        columnas.push(columna);
        rowtd += "<th>" + data[i].descripcion + "</th>";
    }

    $("#tr_" + id).append(rowtd);

    var grid = new Datatable();

    grid.init({
        src: $('#datatable_' + id),
        onSuccess: function (grid) {
            // execute some code after table records loaded
        },
        onError: function (grid) {
            // execute some code on network or other general error
        },
        loadingMessage: 'Loading...',
        dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/scripts/datatable.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",

            "lengthMenu": [
                [10, 20, 50, 100, 150, -1],
                [10, 20, 50, 100, 150, "All"] // change per page values here
            ],
            "pageLength": 10, // default record count per page
            "ajax": {
                "url": url + inicializarScriptsInputs.datatableurlopcion  // ajax source
            },
            "columns": columnas,
            "order": [
                [0, "asc"]
            ] // set first column as a default sort by asc
        }
    });


}

