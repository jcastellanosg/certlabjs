(function () {

    "use strict";

    var acciones = window.FratrisFacturacion.acciones;
    //acciones.crearregistro = crearregistro;
    //acciones.editarusuario = editarusuario;
    //acciones.borrarusuario = borrarusuario;

    $("#guardarcambios").click(crearregistro);

    $("#sample_editable_1").find("td:nth-child(1)").hide();


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


    /*
    function editarusuario(p, elemento) {
        acciones.editar(p, elemento);
        $("#editar_u_password").val('');
        $("#editar_u_password2").val('');
        var parametros = ($(elemento).attr('data-facturacion-accion')).split('_');
        getCategoria(parametros[2]);
        setPerfil();

    }


*/


    function accionCallBack(data) {
        $("#pantallafinal").modal('show');
    }

    function crearregistro() {
        var dataset,
            url,
            rowvalues = {},
            botonActivar = $("#guardarcambios"),
        oTable = $('#sample_editable_1').dataTable();
        $.each($("#formperfil input"), function (i, campo) {
            rowvalues[campo.id] = $(campo).val();
        });
        if (isFormaValida(rowvalues)) {
            rowvalues['contactos'] = oTable.fnGetData();
            url =  frhost + "?option=com_certilab&task=perfil.actualizarCliente";
            acciones.ajaxServer(botonActivar, rowvalues, url, accionCallBack);
        }
    }

    /*
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
*/
    function isFormaValida(rowvalues) {
        var re = /\S+@\S+\.\S+/,
            valido= true;
        if (!re.test(rowvalues.email)){
            displayerror("warning", 'Email errado ');
            valido =false;
        }
   /*     if (rowvalues.hasOwnProperty('u_password') && rowvalues.u_password.trim() != rowvalues.u_password2) {
            displayerror("warning", 'Password no coincide');
            valido =false;
        }
     */
        if (rowvalues.nombre.trim() === '') {
            displayerror("warning", 'Nombre errado');
            valido =false;
        }
        if (rowvalues.direccion.trim() === '') {
            displayerror("warning", 'Direccion errada');
            valido =false;
        }
        if (rowvalues.nit.trim() === '' || isNaN(rowvalues.nit) || parseInt(rowvalues.nit) <= 0) {
            displayerror("warning", 'Nit errado');
            valido =false;
        }
        if (rowvalues.telefono.trim() === '' || isNaN(rowvalues.telefono) || parseInt(rowvalues.telefono) <= 0) {
            displayerror("warning", 'telefono errado');
            valido =false;
        }
        return valido;
    }




    /*
    function setPerfil() {
        var perfil = acciones.recoverValor['oculto']($("#editar_f_id"));
        acciones.resetValor['select']({elemento: '#editar_u_perfil', valor: perfil});
    }
    */

})();


function inicializarValoresDeCreacion() {

}

