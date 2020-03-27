//Form Select Validator
$.formUtils.addValidator({
    name : 'customSelect',
    validatorFunction : function(value,$el) {
        this.errorMessage = LANG_CUSTOM_SELECT;
        if($el.val() == 0){
            return false;
        }else{
            return true;
        }
    },
    errorMessage : '',
    errorMessageKey: ''
});

//Form Password Confirm
$.formUtils.addValidator({
    name : 'PassConfirm',
    validatorFunction : function(value, $el, config, language, $form) {
        var pass = $form.find('input[name="password"]'),
            passConf = $form.find('input[name="password_confirmation"]');

        if(passStrength > 1){
            if(pass.val() == passConf.val()){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    },
    errorMessage : '',
    errorMessageKey: 'notConfirmed'
});

//Users search
$.formUtils.addValidator({
    name:'UserSearch',
    validatorFunction: function(){
        element = $('#selected_clients').parent('div').parent('div');
        if(element.hasClass('hideImportant')){
            return true;
        }else{
            if(SelectedClients.length > 0){
                return true;
            }else{
                return false;
            }
        }
    },
    errorMessage : 'No user selected'
});

$.formUtils.addValidator({
    name:'namevalidation',
    validatorFunction: function(value,$el){
        //element = $('#first_name');
        return false;
    },
    errorMessage : 'No user selected',
    errorMessageKey: 'badEvenNumber'
});

$.formUtils.addValidator({
    name:'visible_length',
    validatorFunction: function(value,$el){
        //if($el.closest('[style="display: none;"]').length > 0 || $el.closest('hide').length > 0){
        if($el.closest(':hidden').length){
            return true;
        }else{
            valLength = $el.attr('data-validation-length');
            if(valLength.replace(/[0-9]+/g,'') == 'min'){
                if($el.val().length >= parseInt(valLength.match(/[0-9]+/))){
                    return true;
                }else{
                    this.errorMessage = APP_LANG.VALIDATOR.CUSTOM.LENGTH.BIGGER_THAN.replace(/[#]+n[#]+/,parseInt(valLength.match(/[0-9]+/)));
                    return false;
                }
            }else if(valLength.replace(/[0-9]+/g,'') == 'max'){
                if($el.val().length <= parseInt(valLength.match(/[0-9]+/))){
                    return true;
                }else{
                    this.errorMessage = APP_LANG.VALIDATOR.CUSTOM.LENGTH.SMALLER_THAN.replace(/[#]+n[#]+/,parseInt(valLength.match(/[0-9]+/)));
                    return false;
                }
            }else if(valLength.replace(/[0-9]+/g,'') == 'ex'){
                if($el.val().length == parseInt(valLength.match(/[0-9]+/))){
                    return true;
                }else{
                    this.errorMessage = APP_LANG.VALIDATOR.CUSTOM.LENGTH.EXACTLY.replace(/[#]+n[#]+/,parseInt(valLength.match(/[0-9]+/)));
                    return false;
                }
            }else{
                valLength = valLength.trim().split();
                if($el.val().length >= parseInt(valLength.match(/[0-9]+/)) || $el.val().length <= parseInt(valLength.match(/[0-9]+/))){
                    return true;
                }else{
                    this.errorMessage = APP_LANG.VALIDATOR.CUSTOM.LENGTH.BETWEEN.replace(/[#]+n1[#]+/,parseInt(valLength[0].match(/[0-9]+/))).replace(/[#]+n2[#]+/,parseInt(valLength[1].match(/[0-9]+/)));
                    return false;
                }
            }
        }
    }
});

$.formUtils.addValidator({
    name: 'visible_required',
    validatorFunction: function (value, $el) {
        if($el.closest(':hidden').length > 1){
            return true;
        }else if($el.val() > 0){
            return true;
        }else{
            this.errorMessage = APP_LANG.VALIDATOR.CUSTOM.LENGTH.EMPTY;
            return false;
        }
    }
});

$.formUtils.addValidator({
    name: 'visible_mobile',
    validatorFunction: function (value, $el) {
        if($el.closest(':hidden').length > 1){
            return true;
        }else if($el.val() > 0 && $el.val().replace(/[0-9]+/g,'').length < 1){
            return true;
        }else if($el.val().replace(/[0-9]+/g,'').length < 1) {
            this.errorMessage = APP_LANG.VALIDATOR.CUSTOM.LENGTH.ILLEGAL_CHARS;
            return false;
        }
    }
});

$.formUtils.addValidator({
    name: 'visible_regex',
    validatorFunction: function (value, $el) {
        regex = $el.attr('data-validation-regexp');
        value = $el.val();
        value = value.replace(value.match(regex),'');
        if($el.is(':visible') && value != ''){
            this.errorMessage = APP_LANG.VALIDATOR.CUSTOM.ILLEGAL.CHARS;
            return false;
        }
        return true;
    }
});