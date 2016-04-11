/**
 * Created by jcastellanosg on 5/19/2015.
 */

(function () {


    "use strict";
if (window.FratrisFacturacion === undefined){
    window.FratrisFacturacion ={};
}
    if (window.FratrisFacturacion.acciones === undefined){
        window.FratrisFacturacion.acciones = {};
    }
    var acciones = window.FratrisFacturacion.acciones;
    acciones.asignarValidadorAforma = asignarValidadorAforma;

    var reglasDeValidacion,
        validadores = {

            notEmpty: {
                message: 'Se requiere un valor'
            },

            longitud: {
                max: 30,
                message: '#Debe tener entre longitud max de'
            },

            varchar: {
                regexp: {
                    regexp: /^[a-zA-Z0-9_\s\n\t]+$/,
                    message: 'Solo puede tener letras, numeros y _(underscore)'
                }
            },


            date: {
                date: {
                    format: 'YYYY/MM/DD',
                    message: 'Debe ser una fecha valida'
                }
            },

            email: {
                emailAddress: {
                    message: 'El email no es valido'
                }
            },

            int: {
                integer: {
                    message: 'Debe ser un numero sin decimales'
                }
            },

            float: {
                numeric: {
                    message: 'Debe ser un valor numerico',
                    // The default separators
                    thousandsSeparator: '',
                    decimalSeparator: '.'
                }
            }
        };

    function crearvalidador() {
        var formas = [].slice.call(document.querySelectorAll("form[data-facturacion-tipo='forma']"));
        formas.forEach(asignarValidadorAforma)

    }

    function asignarValidadorAforma(forma) {
        reglasDeValidacion = {};
        var validador;

        var    elementos = [].slice.call($(forma).find("[data-facturacion-tipo = 'input']"));
        elementos.forEach(crearReglasDeValidacion);
        validador = {
            framework: 'bootstrap',
            err: {
                container: 'tooltip'
            },
            row: {
                selector: '.form-group'
            },
            fields:
                reglasDeValidacion
        };

        //$(forma).formValidation(validador);


    }

    function crearReglasDeValidacion(elemento) {
        if ($(elemento).attr('data-facturacion-grabar') != '1') {
            return;
        }
        var dummy,
            key,
            validators = {},
            tipos = elemento.dataset,
            input = tipos.facturacionInput,
            tipo = tipos.facturacionTipodecampo,
            requerido = tipos.facturacionRequerido,
            validar = parseInt(tipos.facturacionValidar),
            longitud = tipos.facturacionLen,
            descripcion = tipos.facturacionDescripcion,
            nombre = elemento.name;
        if (!validar)
            return;

        if (nombre) {
            validators = {};
            if (requerido) {
                validators.notEmpty = validadores.notEmpty;
            }
            dummy = validadores[tipo];
            for (key in dummy) {
                if (dummy.hasOwnProperty(key)) {
                    validators[key] = dummy[key];
                    break;
                }
            }
            if (tipo === 'varchar') {
                validators.stringLength = validadores.longitud;
            }
            reglasDeValidacion[nombre] = {};
            reglasDeValidacion[nombre]['validators'] = validators;
        }
    }

    crearvalidador();


})();












