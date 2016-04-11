(function () {

    "use strict";
    var acciones = window.FratrisFacturacion.acciones;
    $("#nuevoanalisis").click(creartiquete);
    $('#cancelar').click(cancelar);


    function cancelar() {

    }

    function creartiquete() {
        var rowvalues = {},
            url = frhost + "?option=com_certilab&task=tiquetes.web",
            accionCallBack = cotizacionGuardada,
            botonActivar = "",
            campos = $("#frmcotizacion").find("[data-facturacion-tipo = 'input']");
        $.each(campos, function (i, campo) {
            rowvalues[campo.id] = $(campo).val();
        });
        if (validacionDataCotizacion(rowvalues)) {
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }


    function validacionDataCotizacion(rowvalues) {
        var valido = true;
        if (rowvalues.tema.trim() == '') {
            displayerror("notice", 'Tema no es valido');
            valido = false;
        }
        if (rowvalues.descripcion.trim() == '') {
            displayerror("notice", 'Descripcion no es valida');
            valido = false;
        }

        return valido;
    }


    function cotizacionGuardada(data) {
        $("#modalconfirmar").modal("show");
    }


})();


function inicializarValoresDeCreacion() {


}


