(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones;
        acciones.crearregistro = crearregistro;

    $("#grupo_editar_m_cantidad").html('');
    

    function crearregistro(pantalla) {
        var rowvalues = {},
            url = window.urlcrear.replace('listar.crear', 'listar.crearmuestras'),
            accionCallBack = cotizacionGuardada,
            forma = $("div[data-facturacion-pantalla = '" + pantalla + "_secundaria']  form"),
            botonActivar = $("button[data-facturacion-accion='crearregistro_" + pantalla + "'"),
            elementos = forma.find("[data-facturacion-tipo = 'input']");
        $.each(elementos, function (i, campo) {
            var tipo = $(campo).attr('data-facturacion-input');
            if (acciones.recoverValor.hasOwnProperty(tipo)) {
                var valor = acciones.recoverValor[tipo](campo);
                var id = $(campo).attr('data-facturacion-id');
                rowvalues[id] = valor[0];
            }
        });
        if (validateOrden(rowvalues)) {
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    function validateOrden(rowvalues) {
        var
            resultado = 'true',
            cliente = (rowvalues['m_cliente_id']),
            descripcion = rowvalues['m_descripcion'],
            estado = rowvalues['m_estado'];

        if (isNaN(cliente) || parseInt(cliente) <= 0) {
            displayerror("warning", 'Seleccione cliente');
            resultado = false;
        }
        if (descripcion.trim() == "") {
            displayerror("warning", 'Por escriba una descripcon de la muestra');
            resultado = false;
        }
        if (isNaN(cliente) || parseInt(cliente) < 0) {
            displayerror("warning", 'Seleccione estado de la muestra');
            resultado = false;
        }
        return resultado;
    }

    function cotizacionGuardada(data) {
        console.log(data);
        acciones.show("principal");
        $("#datatable_ajax").DataTable().draw();

    }

})();


function inicializarValoresDeCreacion() {


}


