(function () {

    "use strict";

    var acciones = window.FratrisFacturacion.acciones;
    acciones.crearregistro = crearregistro;
    acciones.editarusuario = editarusuario;
    acciones.borrarusuario = borrarusuario;

    var validarEmail = {
        validators: {
            emailAddress: {
                message: 'el email es invalido'
            }
        }
    };

    var confirmarPassword = {
        validators: {
            identical: {
                field: 'password',
                message: 'El password no coincide'
            },
            stringLength: {
                min :7,
                max: 10,
                message: 'El password debe tener entre 7 y 10 caracteres'
            }
        }
    };


    function editarusuario(p, elemento) {
        acciones.editar(p, elemento);
        $("#editar_u_password").val('');
        $("#editar_u_password2").val('');
        var parametros = ($(elemento).attr('data-facturacion-accion')).split('_');
        getCategoria(parametros[2]);
        setPerfil();

    }

    function crearregistro(tipo, event) {
        var forma = $("div[data-facturacion-pantalla='" + tipo + "_secundaria'] form "),
            elementos = forma.find("[data-facturacion-input]");
            enviarAlServer(elementos, tipo,event.target);
    }



    function accionCallBack(data) {
        console.log(data);
        if(data.OK !== undefined && data.OK === 'OK') {
            acciones.show('principal');
            $("#datatable_ajax").DataTable().draw();
            displayerror("notice", data.mensaje);
        } else {
            displayerrormodal(data.mensaje);
        }
    }

    function enviarAlServer(elementos, tipo, botonActivar) {
        var dataset,
            url,
            rowvalues = {};
        $.each(elementos, function (i, campo) {
            dataset = campo.dataset;
            if (dataset.facturacionGrabar === '1') {
                if (acciones.recoverValor.hasOwnProperty(dataset.facturacionInput)) {
                    var valor = acciones.recoverValor[dataset.facturacionInput](campo);
                    var id = dataset.facturacionId;
                    setValues(rowvalues, id, valor[0]);
                } else {
                    displayerrormodal('no se puede editar y o crear tipo: ' + tipo);
                }
            }
        });
        if(isFormaValida(rowvalues)) {
            url = window.urlcrear.replace("task=listar.crear", "task=usuarios.crearusuario");
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    function getCategoria(id) {
        var url,
            rowvalues = {"u_id" : id};
        url = window.urlcrear.replace("task=listar.crear", "task=usuarios.getcategorias");
        acciones.ajaxServer('', rowvalues, url, setCategorias);
    }

    function setCategorias(data) {
        var id,
            ids = [],
            tab = $("button[data-facturacion-accion='crear_registro_editar']");
        tab.prop('disabled', true);
        for (id in data.grupos) {
            ids.push(id);
        }
        $("#editar_u_groups").multiSelect('select', ids);
        tab.prop('disabled', false);
    }

    function borrarusuario(p, elemento) {
        var url,
         parametros = ($(elemento).attr('data-facturacion-accion')).split('_'),
        rowvalues = {"u_id": parametros[2]};
        url = window.urlcrear.replace("task=listar.crear", "task=usuarios.borrarusuario");
        acciones.ajaxServer('', rowvalues, url, accionCallBack);
    }

    function setValues(rowvalues, id, valor) {
        var i,
            j = 0,
            values = {};
        if (id.indexOf('password') > 0 && valor.trim() === "") {
            return;
        }
        if (id.indexOf('group') > 0) {
            for (i in valor) {
                values[j] = i;
                j++;
            }
            valor = values;
        }
        rowvalues[id] = valor;
    }

    function isFormaValida(rowvalues) {
        var re = /\S+@\S+\.\S+/,
            valido= true;
        if (!re.test(rowvalues.u_email)){
            displayerror("warning", 'Email errado ');
            valido =false;
        }
        if (rowvalues.hasOwnProperty('u_password') && rowvalues.u_password.trim() != rowvalues.u_password2) {
            displayerror("warning", 'Password no coincide');
            valido =false;
        }
        if (rowvalues.u_name.trim() === '') {
            displayerror("warning", 'falta el nombre');
            valido =false;
        }
        return valido;
    }

    function setPerfil() {
        var perfil = acciones.recoverValor['oculto']($("#editar_f_id"));
        acciones.resetValor['select']({elemento: '#editar_u_perfil', valor: perfil});
    }

})();


function inicializarValoresDeCreacion() {

}

