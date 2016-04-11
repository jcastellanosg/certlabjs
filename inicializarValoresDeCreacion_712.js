
(function () {

    "use strict";
    // camposdatatable


    var acciones = window.FratrisFacturacion.acciones,
        dup_id;
    acciones.duplicar = duplicar;
    acciones.duplicarlista =duplicarlista;
    acciones.cancelarduplicarmuestras = cancelarduplicarmuestras;



    function duplicarx(id) {
        var botonActivar ,
            url = urlcrear.replace("task=listar.crear","task=listar.duplicarlista&listaid="+id),
            accionCallBack = resultado,
            rowvalues;
        acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
    }

    function resultado(msg) {
        msg['OK'] == 'NOK' ?displayerror("warning", msg['message']):displayerror("notice", msg['message']);
        $("#datatable_ajax").DataTable().draw();
    }


    function duplicarlista() {
        var rowvalues = {},
            botonActivar = $("#bt_form_duplicar_duplicar"),
            url = urlcrear.replace("task=listar.crear", "task=listar.duplicarlista"),
            accionCallBack = resultado;
        rowvalues.id = dup_id;
        rowvalues.l_nombre = acciones.recoverValor['input']($("#l_nombredelalista"))[0];
        rowvalues.l_incremento = acciones.recoverValor['input']($("#l_incremento"))[0];
        rowvalues.l_tipo = acciones.recoverValor['switchbox']($("#l_tipoincremento"))[0];
        if (validarrow(rowvalues)) {
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
            $("#duplicar_modal").modal("hide");
        }
    }

    function validarrow(row) {
        if (isNaN(row.id) || !parseInt(row.id) >0) {
            displayerror("warning", 'Lista de precios errada');
            return false;
        }

        if (row.l_nombre.trim().length <= 0){
            displayerror("warning", 'Nombre de lista errada');
            return false;
        }

        if (isNaN(row.l_incremento) || !parseInt(row.l_incremento) >0) {
            displayerror("warning", 'Incremento debe ser mayor o igual a 0');
            return false;
        }
        if (isNaN(row.l_tipo) || !(parseInt(row.l_tipo) >=0) || !(parseInt(row.l_tipo) < 2) ){
            displayerror("warning", 'Tipo incremento errado');
            return false;
        }
        return true;
    }


    function duplicar(id) {
           dup_id = id;  // guardar id
           $("#duplicar_modal").modal("show");
    }

    function cancelarduplicarmuestras(){
        $("#duplicar_modal").modal("hide");
    }


    })();



function  inicializarValoresDeCreacion() {

};
