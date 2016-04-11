


// Inicializar los campos de busquedade acuerdo al tipo
function ressetFormaBusqueda() {
    $("#form_buscar")[0].reset();
// Inicializar campos de busqueda
    $.each(tiposecampos, function (index, value) {
        if (value[1].indexOf("buscar_") >= 0) {
            if (typeof inicializarValoresInputs[value[0]] != "undefined") {
                inicializarValoresInputs[value[0]](value[1]);  // Recupera el valor dependiendo del tipo de input value[1]
            }
        }
    });
}

// Inicializa la forma de busqueda, sin limpiar datatable
// y cierra la ventana de busqueda
function cancelarFormaBusqueda() {
    $('#myModal_buscar').modal('hide')
}


// Limpiar los inputs de busqueda en la forma
// Buscar cada campoen datatable y limpiarlo
// redibujar la tabla
function resetInputBusqueda() {
    ressetFormaBusqueda();
    table = jQuery('#datatable_ajax').DataTable();
    table.columns().eq(0).each(function (i) {
        table.column(i).search('', false, true);
    });
    var filtro = $("#filtradopor").find( "li" );
    filtro.eq(2).remove();
    filtro.eq(1).remove();
    table.draw();
}


// Limpir camposdebusquedadel datatable
// Assignar en datatable el valor del campo de busqueda
// Render el datatable
function buscarForma() {
    // Reset columnas debusqueda en datatable
    var filtro = "";
    table = jQuery('#datatable_ajax').DataTable();
    table.columns().eq(0).each(function (i) {
        table.column(i).search('', false, true);
    });
    $.each(tiposecampos, function (index, value) {
        if (value[1].indexOf("buscar_") >= 0) {
            if (typeof recoverValueBusqueda[value[0]] != "undefined") {
                valor = recoverValueBusqueda[value[0]](value[1]);  // Recupera el valor dependiendo del tipo de input value[1]
                if (typeof valor != "undefined") {
                    recoverAndAssignValue(value[1], valor);
                    filtro += filtro.trim() != "" ? " y " + valor[2] : valor[2];
                }
            } else {
                displayerror('warning', 'Forma busqueda: Error inicializando tipo de input: ' + value[0] + ' campo: ' + value[1]);
            }
        }
    });
    //Actualizar mensaje de filtrado
    var filtroli = $("#filtradopor").find( "li" );
    filtroli.eq(2).remove();
    filtroli.eq(1).remove();
    $("#filtradopor").append('<li><h5>Filtrado por :</h5></b></li><li><h6>'+filtro+'</h6></li>');;
    $('#myModal_buscar').modal('hide');

    table.draw();
}

function recoverAndAssignValue(id, valor) {

    $.each(tiposecampos, function (index, value) {
        if (value[3] == id) {
            i = value[0];
            campo = value[1] + '#' + valor[0].trim() + '#' + valor[1].trim();
            $('#datatable_ajax').DataTable().column(i).search(campo, false, true);
        }
    });
}

