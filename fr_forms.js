/**
 * Created by jcastellanosg on 5/19/2015.
 */


function Fr_getValues() {
    vm = this;
    vm.input = input;

    function input(element){
        value = $(element).val();
        if (value.trim()){
            return value;
        }
        return false
    }





}

fr_getValues = new Fr_getValues();








