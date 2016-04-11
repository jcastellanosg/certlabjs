/**
 * Created by jcastellanosg on 5/19/2015.
 */

var FratrisINI = function () {



    // Primera letra en mayuscula
    String.prototype.primeraLetraEnMayuscula = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    // Convertir a spanish fechas
    $.fn.datetimepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        suffix: [],
        meridiem: []
    };

     //if(typeof tiposecampos != "undefined") {
/*
        $.each($("[data-facturacion-input]"), function (index, elemento) {
            var tipo = $(elemento).attr("data-facturacion-input");
                if (typeof inicializarScriptsInputs[tipo] != 'undefined') {
                    inicializarScriptsInputs[tipo](elemento);  // Inicializa el elemento
                } else {
                    displayerror('warning', 'Error inicializando tipo de input: ' + tipo);
                }
        });
*/




    if (typeof mensajes_error != "undefined" && mensajes_error instanceof Array) {
        var messagerror = "";
        $.each(mensajes_error, function (index, value) {
            messagerror += '</p>' + value + '</p>';
        });
        displayerrormodal(messagerror);
    }

    if (typeof mensajes_notice != "undefined" && mensajes_notice instanceof Array) {
        $.each(mensajes_notice, function (index, value) {
            displayerror("notice", value);
        });
    }

    if (typeof mensajes_warning != "undefined" && mensajes_warning instanceof Array) {
        $.each(mensajes_warning, function (index, value) {
            displayerror("warning", value);
        });
    }

    if (typeof mensajes_ != "undefined" && mensajes_ instanceof Array) {
        $.each(mensajes_, function (index, value) {
            displayerror("information", value);
        });
    }

    /*
     Asigna al boton de busqueda avanzada la funcion de desplegar ventana de busqueda modal
     */
    $("#lnk_Crear").click(function () {
        var ventanamodal = $('#myModal_crear');
        if(ventanamodal.length == 0) {
            activarVentanaCreacion();
        } else {
            ventanamodal.modal('show');
        }
        ressetFormaCreacion();
    });

    $('#bt_form_crear_regresar').click(desactivarVentanaCreacion);

    $('#bt_form_crear_limpiar').click(ressetFormaCreacion);

    $("#bt_form_crear_crear").click(crearRegistro);


   // $('#bt_form_editar_limpiar').click(ressetFormaEdicion);

    $("#bt_form_editar_crear").click(crearRegistroEdicion);

    $("#bt_form_editar_regresar").click(activarVentanaListarEdicion);

    //Asigna al boton de busqueda avanzada la funcion de desplegar ventana de busqueda modal
    // Inicilizando los campos de busqueda
    $("#lnk_Busqueda_Avanzada").click(function () {
        ressetFormaBusqueda();
        $('#myModal_buscar').modal('show')
    });

    // Inicializa la forma de busqueda, sin limpiar datatable
    // y cierra la ventana de busqueda
    $("#bt_form_buscar_cancelar").click(cancelarFormaBusqueda);

    // En la form buscar asignar el boton reset, este limpia la forma y los campos de busqueda de datatable
    // y redibuja el datatable
    $('#bt_form_buscar_limpiar').click(resetInputBusqueda);

    // Modifica los camposdebusquedade datatable y lo redibuja
    $("#bt_form_buscar_buscar").click(buscarForma);




};

function displayerror(tipo, msg) {
    switch (tipo) {
        case "error" :
            displayerrormodal(msg);
            break;
        case "warning" :
            displaymessage('lemon', true, 0, 'top', 'right', 'Warning', msg);
            break;
        case "notice" :
            displaymessage('lime', false, 5000, 'top', 'right', 'Notificacion', msg);
            break;
        default  :
            displaymessage('ebony', false, 5000, 'top', 'right', 'Informacion', msg);
    }
}

function displaymessage(theme, sticky, life, position, left, heading, msg) {
    var settings = {
        theme: theme,
        sticky: sticky,
        horizontalEdge: position,
        verticalEdge: left
    };

    if (heading.trim() != '') {
        settings.heading = heading;
    }

    if (!settings.sticky) {
        settings.life = life;
    }

    $.notific8('zindex', 11500);
    $.notific8(msg, settings);
}

function displayerrormodal(msg) {
    $('#mensajedeerror').html(msg);
    $('#myModalError').modal('show');
}











