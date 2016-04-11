/**
 * Created by jcastellanosg on 5/19/2015.
 */

// Recupera el valor del input dependiendo del tipo devuelve valor operador
var recoverValueBusqueda = {

    oculto: function (val) {

    },

    switchbox: function (val) {
        valor = ($("#" + val).prop('checked')) ? '1' : '0';
        var mensaje = valor == 1 ? val.substring(9).primeraLetraEnMayuscula() + ': Activo' : val.substring(9) + ' Inactivo';
        return [valor, 'Igual a', mensaje];
    },

    // Usado en busquedas
    selectinputtext: function (val) {
        var valor = $('#' + val).val();
        if (valor.trim() != "") {
            var operador = $('#' + val + '_operador').text();
            var mensaje = val.substring(9).primeraLetraEnMayuscula() + ": Debe " + operador + valor;
            return [valor, operador, mensaje];
        }
    },

    // Usado en busquedas
    selectinputnumerico: function (val) {
        var valor = $('#' + val).val();
        if (valor.trim() != "") {
            var operador = $('#' + val + '_operador').text();
            var mensaje = val.substring(9).primeraLetraEnMayuscula() + ": Debe " + operador + valor;
            return [valor, operador, mensaje];
        }
    },

    // Usado en busquedas
    checkboxinline: function (val) {
        var valor = [];
        $("input[name='" + val + "[]']").each(function () {
            if (this.checked) {
                valor.push($(this).val());
            }
        });
        valor = valor.join(',')
        if (valor.trim() != '') {
            var operador = 'AND';
            var mensaje = val.substring(9).primeraLetraEnMayuscula() + ": Debe contener " + valor;
            return [valor, operador, mensaje];
        }
    },

    // Usado en busquedas
    rangofechasavanzadofuturo: function (val) {
        var valor = $('#rangofechas_' + val).text();
        if (valor.trim() != '') {
            var operador = 'DATE';
            var mensaje = val.substring(9).primeraLetraEnMayuscula() + ": En este rango de fechas " + valor;
            return [valor, operador, mensaje];
        }
    }


};

// recuperar valores  de campos de edicion y/o creacion
var recoverValueCreacion = {
    countrylist: function (val) {
        var valor = $("#" + val + " option:selected").text();
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    oculto: function (val) {
        var valor = $("#" + val).val();
        if (typeof valor != undefined && valor.trim() != '') {
            return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
        } else {
            return [];
        }
    },

    thumbnail: function (val) {
        return [];
    },

    input: function (val) {
        var valor = $("#" + val).val();
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    switchbox: function (val) {
        valor = ($("#" + val).prop('checked')) ? '1' : '0';
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    estatica: function (val) {
        var valor = $("#" + val).text();
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    select: function (val) {
        var valor = $("#" + val).select2('data').id;
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    selecthorizontal: function (val) {
        var valor = $("#" + val).select2('data').id;
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    selectAll: function (val) {
        var valor = $("#" + val).select2('data').id;
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    textarea: function (val) {
        var valor = $("#" + val).val();
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    radio: function (val) {
        var valor = $('input:radio[name=' + val + ']:checked').val();
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    },

    rangofechasavanzadofuturo: function (val) {
        var valor = $('#' + val).find('span').text();
        var valinicial = "";
        var valfinal = "";
        valor = valor.split("-");
        if (typeof valor[0] != "undefined" && valor[0].trim() != "") {
            var fechainicial = valor[0] + ' 00:00:00';
            valinicial = '"' + val.replace('editar_', '').replace('crear_', '') + '":"' + fechainicial + '"'
            if (typeof valor[1] != "undefined" && valor[1].trim() != "") {
                fechafinal = valor[1] + ' 00:00:00';
                valfinal = '"' + val.replace('editar_', '').replace('crear_', '').replace('inicial', 'final') + '":"' + fechafinal + '"'
            }
        }
        return [valinicial, valfinal];
    },

    rangofechasavanzado: function (val) {
        var valor = $('#' + val).find('span').text();
        var valinicial = "";
        var valfinal = "";
        valor = valor.split("-");
        if (typeof valor[0] != "undefined" && valor[0].trim() != "") {
            var fechainicial = valor[0] + ' 00:00:00';
            valinicial = '"' + val.replace('editar_', '').replace('crear_', '') + '":"' + fechainicial + '"'
            if (typeof valor[1] != "undefined" && valor[1].trim() != "") {
                fechafinal = valor[1] + ' 00:00:00';
                valfinal = '"' + val.replace('editar_', '').replace('crear_', '').replace('inicial', 'final') + '":"' + fechafinal + '"'
            }
        }
        return [valinicial, valfinal];
    },

    checkboxinline: function (val) {
        var valor = [];
        $("input[name='" + val + "[]']").each(function () {
            if (this.checked) {
                valor.push($(this).val());
            }
        });
        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor.join(',') + '"'];
    },

    files: function (val) {
        if (val.indexOf('crear') >= 0) {
            var valor = Date.now() + Math.floor(Math.random() * 1000000);
            if (typeof window["objUploadFiles_" + val] != "undefined") {
                window["objUploadFiles_" + val].directorio = valor;
            }
        } else {
            valor = window["objUploadFiles_" + val].directorio;
        }

        return ['"' + val.replace('editar_', '').replace('crear_', '') + '":"' + valor + '"'];
    }


};

// Inicilizar los campos de edicion
var setValueEdition = {

    datatable: function (id, valor) {
        inicializarScriptsInputs.datatableurlopcion = "&campo=f_producto_id&id=1434129612248";
        $('#datatable' + id).DataTable().draw();
    },


    countrylist: function (id, valor) {
        var valor = $("#" + id + "  option:contains('" + valor + "')").val();
        $("#" + id).val(valor).change();
    },

    oculto: function (id, valor) {
        var valor = $("#" + id).val(valor).trigger('change');
    },

    input: function (id, valor) {
        var valor = $("#" + id).val(valor).trigger("change");
    },

    switchbox: function (id, valor) {
        valor = valor.indexOf('Activo') > 0;
        $('#' + id).bootstrapSwitch('state', valor);
    },

    estatica: function (id, valor) {
        $("#" + id).text(valor);
    },

    thumbnail: function (id, valor) {
        $("#" + id).append(valor);
    },

    select: function (id, valor) {
        $("#" + id).select2('val', valor, true);
        $("#" + id).trigger('click');
    },

    selecthorizontal: function (id, valor) {
        $("#" + id).select2('val', valor, true);
        $("#" + id).trigger('click');
    },

    selectAll: function (id, valor) {
        $("#" + id).select2('val', valor, true).trigger('click');

    },

    textarea: function (id, valor) {
        $("#" + id).val(valor);
    },

    rangofechasavanzado: function (id, valor, row) {
        var idi = id.replace('editar_', '');
        var idf = idi.replace('inicial', 'final');
        fechainicial = row[idi].replace(/-/g, '/').replace('00:00:00', '');
        fechafinal = row[idf].replace(/-/g, '/').replace('00:00:00', '');
        $('#' + id).find('span').html(fechainicial + ' - ' + fechafinal);
    },

    rangofechasavanzadofuturo: function (id, valor, row) {
        var idi = id.replace('editar_', '');
        var idf = idi.replace('inicial', 'final');
        fechainicial = row[idi].replace(/-/g, '/').replace('00:00:00', '');
        fechafinal = row[idf].replace(/-/g, '/').replace('00:00:00', '');
        $('#' + id).find('span').html(fechainicial + ' - ' + fechafinal);
    },

    radio: function (id, valor) {
        valor = valor.primeraLetraEnMayuscula();
        // $("#grupo_"+ val + " span").removeClass('checked');
        // $("input:radio[name='"+ val +"']").removeAttr('checked');
        $("input:radio[name='" + id + "'][value='" + valor + "']").attr('checked', 'checked').parent().addClass('checked');
    },

    checkboxinline: function (id, valor) {
        valor = valor.split(',');
        $.each(valor, function (i, value) {
            $("input:checkbox[name='" + id + "[]'][value='" + value + "']").attr('checked', 'checked').parent().addClass('checked');
        });
    },

    files: function (id, valor) {
        if (typeof window["objUploadFiles_" + id] != "undefined") {
            if (typeof valor == "undefined" || valor.trim() == "")
                valor = Date.now() + Math.floor(Math.random() * 1000000);
            window["objUploadFiles_" + id].directorio = valor;
        }
    }


};


(function () {

    if (typeof  window.FratrisFacturacion === 'undefined') {
        window.FratrisFacturacion = {};
        if (typeof  window.FratrisFacturacion.acciones === 'undefined') {
            window.FratrisFacturacion.acciones = {};
        }
    }
    window.FratrisFacturacion.acciones.recoverValor = {


        oculto: function (elemento) {
            return [$(elemento).val()];
        },

        input: function (elemento) {
            return [$(elemento).val()];
        },

        selecthorizontal: select,

        select: select,

        multiselect: function (elemento) {
            var valor,
                texto,
                valores = {},
                textos = {},
                i=0;
            $(elemento).find("option:selected").each(function(index,el){
                valor = $(this).val();
                texto =  $(this).text();
                valores[valor] = texto;
            });
            return [valores];
        },

        estatica: function (elemento) {
            return [$(elemento).text()];

        },

        switchbox: function (elemento) {
            valor = $(elemento).prop('checked') ? '1' : '0';
            return [valor];
        },

        countrylist:function(elemento){
            var el = select(elemento);
            return [el[1],el[0]]
        },

        files:function(elemento) {
            var id = $(elemento).attr('id');
            var objUploadFiles = window["objUploadFiles_" + id];
            if (objUploadFiles && objUploadFiles.directorio) {
                return [objUploadFiles.directorio.replace("_","")];
            }
        },


        textarea:function(elemento){
            return [$(elemento).val()];
        },

        thumbnail: function (elemento) {
            return [];
        },

        rangofechasavanzadofuturo: function (elemento) {
            return [$(elemento).find('span').html()];
        }


    };

    function select(elemento) {
        if ($(elemento).select2('data') === null && typeof $(elemento).select2('data') === "object"){
            return 0;
        }
        return [$(elemento).select2('data').id, $(elemento).select2('data').text];

    }


    window.FratrisFacturacion.acciones.recoverValorBusqueda = {

        oculto: function (val) {

        },

        switchbox: function (elemento) {
            valor = ($(elemento).prop('checked')) ? '1' : '0';
            val = $(elemento).attr('data-facturacion-label');
            var mensaje = valor == 1 ? val + ': Activo' : val + ' :Inactivo';
            return [valor, 'Igual a', mensaje];
        },

        // Usado en busquedas
        selectinputtext:  selectinput ,

        // Usado en busquedas
        selectinputnumerico:  selectinput ,

        // Usado en busquedas
        checkboxinline: function (val) {
            var valor = [];
            $("input[name='" + val + "[]']").each(function () {
                if (this.checked) {
                    valor.push($(this).val());
                }
            });
            valor = valor.join(',')
            if (valor.trim() != '') {
                var operador = 'AND';
                var mensaje = val.substring(9).primeraLetraEnMayuscula() + ": Debe contener " + valor;
                return [valor, operador, mensaje];
            }
        },

        // Usado en busquedas
        rangofechasavanzadofuturo: function (val) {
            var valor = $('#rangofechas_' + val).text();
            if (valor.trim() != '') {
                var operador = 'DATE';
                var mensaje = val.substring(9).primeraLetraEnMayuscula() + ": En este rango de fechas " + valor;
                return [valor, operador, mensaje];
            }
        }



    };

    function selectinput (elemento) {
        var mensaje,
            operador = $(elemento).find('button').text().trim(),
            valor = $(elemento).find('input').val();
        if (valor.trim() != "" && operador !== 'Debe') {
            label =  $(elemento).attr('data-facturacion-label');
            mensaje = label + ": Debe " + operador + " " + valor;
            return [valor, operador, mensaje];
        }
    }

})();