$(document).ready(function(){
    var DEPENDENCIES            = {
            'SUBDOMAIN_LENGTH'      : 18,
            'DOMAIN_NAME_MAX_LEN'   : 63,
            'TEXT_INPUTS'           : '#formId [type="date"],#formId [type="datetime"],#formId [type="datetime-local"],#formId [type="email"],#formId [type="month"],#formId [type="password"],#formId [type="search"],#formId [type="tel"],#formId [type="text"],#formId [type="time"],#formId [type="url"],#formId [type="week"]',
        },
        ERROR_MSG               = VALIDATION_MESSAGES.ERRORS,
        validation_rules        = {
            'validate_required'             : {
                'rule' : function(el,form,override_visibility){
                    if((el.is(':hidden') && !el.is('select')) && !override_visibility){
                        return true;
                    }

                    var requiredIf = el.attr('data-required-if');

                    if (typeof requiredIf != 'undefined') {
                        requiredIf = $(requiredIf);

                        if (requiredIf.is('[type="radio"]') || requiredIf.is('[type="checkbox"]')) {
                            if (requiredIf.prop('checked') !== true)
                                return true;
                        }

                        var requiredFor = el.attr('data-required-for');

                        if (typeof requiredFor != 'undefined') {
                            requiredFor = requiredFor.split(',');

                            if (requiredFor.indexOf(requiredIf.val()) < 0)
                                return true;
                        }
                    }

                    switch ( el.attr('type') ) {
                        case 'checkbox':
                            return el.is(':checked');
                        case 'radio':
                            return form.find('input[name="' + el.attr('name') + '"]').filter(':checked').length > 0;
                        default:
                            if(el.is('select')){
                                var selected = el.find('option:selected'),
                                    chosen = $('#' + el.attr('id') + '_chosen:visible');

                                if(chosen.length || el.is(':visible') || override_visibility){
                                    if(el.attr('data-disabled')){
                                        return selected.length && !!selected.val();
                                    }else{
                                        selected = el.find('option:selected:not(:disabled)');
                                        return selected.length && !!selected.val();
                                    }
                                }

                                return true;
                            }else{
                                return el.val() && $.trim(el.val().trim()) !== '';
                            }
                    }
                },
                'message' : ERROR_MSG.REQUIRED
            },
            'validate_length'               : {
                'rule' : function(el,form,override_visibility) {
                    if ((el.is(':hidden') && !el.is('select')) && !override_visibility) {
                        return true;
                    }

                    length = el.attr('data-validate-length');

                    var possible_lengths = length.match(/min|max/g);

                    if(!$.isEmptyObject(possible_lengths)) {
                        if (possible_lengths.length == 1) {
                            var length_rule = length.match(/[0-9]+/);

                            this.ruleConfig = {
                                rule : length_rule[0]
                            };

                            if(!$.isEmptyObject(possible_lengths)) {
                                length_rule = parseInt(length_rule[0]);

                                if (length.match('min'))
                                    return !this.utilities.min(el, length_rule, this);
                                else
                                    return !this.utilities.max(el, length_rule, this);
                            }
                        } else {
                            var range = length.replace(/\-$/, '').split('-');

                            range[0] = parseInt(range[0].replace('min', ''));
                            range[1] = parseInt(range[1].replace('max', ''));

                            this.ruleConfig = {
                                rule : range,
                                type : 'range'
                            };

                            this.message = ERROR_MSG.LENGTH.RANGE.replace('##min##', range[0]).replace('##max##', range[1]);


                            var val_len = el.val().length;
                            return val_len > (range[0] - 1) && val_len < (range[1] + 1);
                        }
                    }
                    return true;
                },
                'utilities' : {
                    'min' : function(el, length, src){
                        src.ruleConfig.type = 'min';

                        src.message = ERROR_MSG.LENGTH.MIN.replace('##n##',length);

                        return el.val().length < length;
                    },
                    'max' : function(el, length, src){
                        src.ruleConfig.type = 'max';

                        src.message = ERROR_MSG.LENGTH.MAX.replace('##n##',length);

                        return el.val().length > length;
                    }
                }
            },
            'validate_international'        : {
                'rule' : function(el,form,override_visibility) {
                    if ((el.is(':hidden') && !el.is('select')) && !override_visibility) {
                        return true;
                    }
                    var value = el.val();
                    value = value.match(REG.ALL_GR.REGEX);
                    if (! $.isEmptyObject(value)){
                        return false;
                    }
                    return true;
                },
                'message' : ERROR_MSG.INTERNATIONAL
            },
            'validate_email'                : {
                'rule' : function(el,form,override_visibility) {
                    if ((el.is(':hidden') && !el.is('select')) && !override_visibility) {
                        return true;
                    }
                    value = el.val().trim();
                    found = value.match(/@/g);
                    if(!$.isEmptyObject(found) && found.length == 1){
                        var username = '',
                            domain = '';

                        value = value.split('@');
                        username = value[0];
                        domain = value[1];

                        if(domain != null){
                            if(!$.isEmptyObject(domain.match(REG.DOMAIN)) || $.isEmptyObject(domain.replace(/\.$/,'').match(/\./))){
                                return false;
                            }

                            return true;
                        }
                    }else if(!$.isEmptyObject(found) && found.length > 1){
                        return true;
                    }
                    return false;
                },
                'message' : ERROR_MSG.EMAIL
            },
            'validate_regex'                : {
                'rule' : function(el,form,override_visibility){
                    if ((el.is(':hidden') && !el.is('select')) && !override_visibility) {
                        return true;
                    }

                    value = el.val().trim();
                    regex = el.attr('data-validate-regex').split('/#/');
                    modifiers = regex[1];
                    regex = regex[0];

                    if(modifiers != null){
                        regex = new RegExp(regex,modifiers);
                    }else{
                        regex = new RegExp(regex);
                    }

                    value = value.replace(regex,'');

                    return value == "";
                },
                'message' : ERROR_MSG.ILLEGAL.CHARS
            },
            'validate_number'               : {
                'rule' : function(el,form,override_visibility){
                    if ((el.is(':hidden') && !el.is('select')) && !override_visibility) {
                        return true;
                    }
                    value = el.val().trim().replace(/[0-9]/g,'');
                    return value == "";
                },
                'message' : ERROR_MSG.ILLEGAL.CHARS
            },
            'validate_strength'             : {
                'rule' : function(el,form,override_visibility){
                    var requiredStrength = el.attr('data-validate-strength');
                    if(requiredStrength && requiredStrength > 3)
                        requiredStrength = 3;

                    return this.utilities.calculatePasswordStrength(el.val()) >= requiredStrength;
                },
                'message' : ERROR_MSG.PASSWORD,
                'utilities' : {
                    calculatePasswordStrength : function(password) {

                        if (password.length < 4) {
                            return 0;
                        }

                        var score = 0;

                        var checkRepetition = function (pLen, str) {
                            var res = "";
                            for (var i = 0; i < str.length; i++) {
                                var repeated = true;

                                for (var j = 0; j < pLen && (j + i + pLen) < str.length; j++) {
                                    repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + pLen));
                                }
                                if (j < pLen) {
                                    repeated = false;
                                }
                                if (repeated) {
                                    i += pLen - 1;
                                    repeated = false;
                                }
                                else {
                                    res += str.charAt(i);
                                }
                            }
                            return res;
                        };

                        //password has 3 numbers
                        if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
                            score += 5;
                        }

                        //password has 2 symbols
                        if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                            score += 5;
                        }

                        //password has Upper and Lower chars
                        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                            score += 10;
                        }
                        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                            if(password.match(/([0-9])/)){
                                score +=40;
                            }
                        }
                        //password has number and chars
                        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
                            score += 15;
                        }
                        //
                        //password has number and symbol
                        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) {
                            score += 15;
                        }

                        //password has char and symbol
                        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) {
                            score += 15;
                        }

                        //password is just a numbers or chars
                        if (password.match(/^\w+$/) || password.match(/^\d+$/)) {
                            score -= 10;
                        }

                        //verifying 0 < score < 100
                        if (score < 0) {
                            score = 0;
                        }
                        if (score > 100) {
                            score = 100;
                        }

                        if (score < 20) {
                            return 0;
                        }
                        else if (score < 40) {
                            return 1;
                        }
                        else if(score <= 60) {
                            return 2;
                        }
                        else {
                            return 3;
                        }
                    },
                    strengthDisplay : function($el, options) {
                        var config = {
                            bad : 'Very bad',
                            weak : 'Weak',
                            good : 'Good',
                            strong : 'Strong'
                        };

                        if (options) {
                            $.extend(config, options);
                        }

                        $el.bind('keyup', function(e) {
                            var val = $(this).val().trim();
                            var $parent = typeof config.parent == 'undefined' ? $(this).parent() : $(config.parent).parent();
                            var $displayContainer = $parent.find('.strength-meter');

                            if(val != '') {
                                if ($displayContainer.length == 0) {
                                    $displayContainer = $('<span></span>');
                                    $displayContainer
                                        .addClass('strength-meter')
                                        .appendTo($parent);
                                }

                                if (!val) {
                                    $displayContainer.hide();
                                } else {
                                    $displayContainer.show();
                                }

                                var strength = validation_rules.validate_strength.utilities.calculatePasswordStrength(val);
                                var css = {
                                    'color'             : 'white',
                                    'display'           : 'block',
                                    'font-size'         : '0.825rem',
                                    'padding'           : '0.125rem 0.575rem',
                                    'position'          : 'relative',
                                    'top'               : '-1.25rem',
                                    'background-color'  : '#fd8549'
                                };

                                var text = config.bad;

                                if (strength == 1) {
                                    css['background-color'] = '#F5D01C';
                                    text = config.weak;
                                } else if (strength == 2) {
                                    css['background-color'] = '#20b6db';
                                    text = config.good;
                                } else if (strength >= 3) {
                                    css['background-color'] = '#18bf93';
                                    text = config.strong;
                                }

                                $displayContainer
                                    .css(css)
                                    .text(text);
                            }else{
                                if ($displayContainer.length){
                                    $displayContainer.remove();
                                }
                            }
                        });
                    }
                }
            },
            'validate_pass_confirm'         : {
                'rule' : function(el,form,override_visibility){
                    passToBeConfirmed = form.find('#password').val().trim();
                    if( passToBeConfirmed == ''){
                        return true;
                    }

                    if(passToBeConfirmed != el.val().trim()){
                        return false;
                    }

                    return true;
                },
                'message' : ERROR_MSG.NOTCONFIRMED
            },
            'validate_email_confirm'        : {
                'rule' : function(el,form,override_visibility){
                    emailToBeConfirmed = form.find('#email').val().trim();
                    if( emailToBeConfirmed == ''){
                        return true;
                    }

                    if(emailToBeConfirmed != el.val().trim()){
                        return false;
                    }

                    return true;
                },
                'message' : ERROR_MSG.NOTCONFIRMED
            },
            'validate_ip'                   : {
                'rule'  : function(el,form,override_visibility){
                    //ipV = 'ip' + el.attr('data-type');
                    //
                    //if(! (ipV in this.utilities)){
                    //    this.message = ERROR_MSG.IP.UNRECOGNISED_IP_VERSION;
                    //    return false;
                    //}
                    //
                    //return this.utilities[ipV](el,this);
                    var val = el.val();

                    if(val.replace(/[0-9a-fA-F:.]+/g,'').length){
                        this.message = ERROR_MSG.IP.INVALID_CHARS;
                        return false;
                    }

                    if(val.match(/^[:.]|[:.]$/) != null || val.match(/[:][.]|[.][:]/) != null){
                        this.message = ERROR_MSG.IP.INVALID_SYNTAX;
                        return false;
                    }

                    return true;
                }
            },
            'validate_name_servers'         : {
                'rule' : function (el, form, override_visibility) {
                    var optional = el.attr('data-optional'),
                        scope = el.attr('data-scope');

                    //Skip if optional or unusable
                    if((typeof optional != 'udefined' && optional && el.val().length < 1) || (el.is('input') && el.is(':hidden'))){
                        return true;
                    }

                    this.message = '';

                    if(typeof scope == 'string' && scope){
                        if(scope in this.utilities.scope) {
                            return this.utilities.scope[scope](el, this);
                        }else{
                            throw "The requested scope is not recognised!";
                        }
                    }else{
                        return this.utilities.scope.name_server(el, this);
                    }

                    return true;
                },
                'utilities' : {
                    'scope': {
                        'host' : function(el,src){
                            var val = el.val();

                            if(val.match((el.attr('data-validate-idn') == 'true') ? REG.NS_NAME.IDN_SUPPORT.HOST.REGEX : REG.NS_NAME.NO_IDN_SUPPORT.HOST.REGEX) != null){
                                src.message = ERROR_MSG.NAME_SERVERS.INVALID_CHARS;
                                return false;
                            }

                            if(val.match(/^[-]|[-]$|[-]{2,}/g) != null){
                                src.message = ERROR_MSG.NAME_SERVERS.INVALID_SYNTAX;
                                return false;
                            }

                            return true;
                        },
                        'name_server' : function(el,src){
                            var val = el.val();

                            if(val.match((el.attr('data-validate-idn') == 'true') ? REG.NS_NAME.IDN_SUPPORT.NAMESERVER.REGEX : REG.NS_NAME.NO_IDN_SUPPORT.NAMESERVER.REGEX) != null){
                                src.message = ERROR_MSG.NAME_SERVERS.INVALID_CHARS;
                                return false;
                            }

                            if(val.match(/^[.-]|[.-]$|[.-]{2,}/g) != null){
                                src.message = ERROR_MSG.NAME_SERVERS.INVALID_SYNTAX;
                                return false;
                            }
                            return true;
                        }
                    }
                }
            },
            'validate_terms_and_conditions' : {
                'rule' : function(el,form,override_visibility){
                    if (el.is('[type="checkbox"]') && el.closest('label').is(':visible')) {
                        if (!el.prop('checked')) {
                            return false;
                        }
                    }
                    return true;
                }
            },
            'validate_required_contact'     : {
                'rule' : function(el,form,override_visibility){
                    var option = el.find('option:selected'),
                        chosen = $('#' + el.attr('id') + '_chosen');

                    if((chosen.length < 1 && !el.is(':visible')) || (chosen.length && !chosen.is(':visible'))){
                        return true;
                    }

                    if(option.length){
                        if(option.disabled()) {
                            this.message = ERROR_MSG.CONTACT_PROFILES.MISSING;
                            return false;
                        }
                    }else{
                        this.message = ERROR_MSG.REQUIRED;
                        return false;
                    }

                    return true;
                }
            },
            'validate_ascii'                : {
                'rule'      : function(el,form,override_visibility){
                    if(el.val() == '')
                        return true;

                    var extended = el.attr('data-extended-character-set');

                    if(typeof extended == 'undefined')
                        extended = false;


                    return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(el.val());
                },
                'message'   : ERROR_MSG.ASCII
            },
            'validate_numeric'              : {
                'rule'  : function (el,form,override_visibility) {
                    if ((el.is(':hidden') && !el.is('select')) && !override_visibility) {
                        return true;
                    }

                    switch (el.attr('type')) {
                        case 'checkbox':
                            return true;
                        case 'radio':
                            return true;
                        default:
                            if (el.is('select')) {
                                return true;
                            } else {
                                var value = el.val();

                                if (! value)
                                    return true;

                                value = value.toString();

                                if (REG.NUMERIC.IMPERIAL_PLAIN.WHOLE_WORD)
                                    return true;
                                else if (REG.NUMERIC.IMPERIAL_FORMATTED.WHOLE_WORD)
                                    return true;
                                else if (REG.NUMERIC.METRIC_PLAIN.WHOLE_WORD)
                                    return true;
                                else if (REG.NUMERIC.METRIC_FORMATTED.WHOLE_WORD)
                                    return true;
                                else
                                    return false;
                            }
                    }
                },
                'message' : ERROR_MSG.NUMERIC
            },
            'validate_value'                : {
                'rule'  : function (el,form,override_visibility) {
                    if((el.is(':hidden') && !el.is('select')) && !override_visibility){
                        return true;
                    }

                    switch ( el.attr('type') ) {
                        case 'checkbox':
                            return true;
                        case 'radio':
                            return true;
                        default:
                            if(el.is('select')){
                                return true;
                            }else{
                                var value = el.val(),
                                    min = el.attr('data-min-value'),
                                    max = el.attr('data-max-value');

                                if (! value)
                                    return true;

                                value = value.toString();

                                //Identify numeric representation and convert to number
                                if (REG.NUMERIC.IMPERIAL_PLAIN.WHOLE_WORD)
                                    value = parseFloat(value);
                                else if (REG.NUMERIC.IMPERIAL_FORMATTED.WHOLE_WORD)
                                    value = parseFloat(value.replace(/,/g,''));
                                else if (REG.NUMERIC.METRIC_PLAIN.WHOLE_WORD)
                                    value = parseFloat(value.replace(',','.'));
                                else if (REG.NUMERIC.METRIC_FORMATTED.WHOLE_WORD)
                                    value = parseFloat(value.replace(/\./g,'').replace(',','.'));
                                else
                                    return true;

                                if (typeof min != 'undefined' && value < min) {
                                    this.message = ERROR_MSG.VALUES.MIN.replace('##min##', min);
                                    return false;
                                }

                                if (typeof max != 'undefined' && value > max) {
                                    this.message = ERROR_MSG.VALUES.MAX.replace('##max##', max);
                                    return false;
                                }

                                return true;
                            }
                    }
                }
            }
        },
        local_validation_rules  = {},
        group_validation_rules  = {
            'validate_unique'   : {
                'rule' : function(el,form,override_visibility){
                    var targets = el.find('[type="text"]:visible:not(disabled):not(.error)[name*="' + el.attr('data-validate-target') + '"]'),
                        data = {},
                        msg = this.message;

                    targets.each(function(){
                        var input = $(this),
                            val = input.val();

                        if (!(val in data)) {
                            data[val] = [];
                        }

                        data[val].push(input.attr('name'));

                    });

                    $.each(data, function(key, value){
                        if (value.length > 1){
                            $.each(value, function(key, names){
                                $('[name="' + names + '"]').show_validation_error(msg);
                            })
                        }
                    })
                },
                'message' : ERROR_MSG.UNIQUE
            }
        },
        validation_class        = 'under_validation',
        valid_callbacks         = ['before:validate','before:execute','after:prepare'],
        strict_validation       = true;

    var form_objs = {};

    $.fn.extend({
        validate_form           : function(display_errors){
            var form = $(this),
                formId = form.attr('id');

            if(typeof form_objs[formId]['version_exception'] == 'undefined') {
                if(!perform_two_way_version_control (form, formId)){
                    handle_no_changes_error (form);
                    return ;
                }
            }

            if (typeof form_objs[formId]['callback'] != 'undefined' && typeof form_objs[formId]['callback']['before:validate'] == 'function') {
                form_objs[formId]['callback']['before:validate']();
            }

            validate_form(form);
            perform_status_handler_function(display_errors, form);

            return form;
        },
        display_form_errors     : function(callback){
            obj = $(this);

            validate_form(obj);
            obj.trigger('onError');

            if (typeof callback == 'function')
                callback();

            return obj;
        },
        show_validation_error   : function(errorMsg){
            el = $(this);

            el.addClass('invalid error');
            errorMsg = (typeof el.attr('data-validate-error-msg') != 'undefined') ? el.attr('data-validate-error-msg') : errorMsg;

            siblingTarget = (typeof el.attr('data-sibling-class') != 'undefined') ? '.' + el.attr('data-sibling-class') : null;
            siblingTarget = (typeof el.attr('data-sibling-id') != 'undefined' && siblingTarget == null) ? '#' + el.attr('data-sibling-id') : siblingTarget;

            if(siblingTarget != null){
                if(typeof el.attr('type') != 'undefined' && el.attr('type') == 'checkbox')
                    el.siblings(siblingTarget).after('<span class="help-block error">' + errorMsg +"</span>");
                else
                    el.siblings(siblingTarget).addClass('invalid error').after('<span class="help-block error">' + errorMsg +"</span>");
            }else{
                el.addClass('invalid error').after('<span class="help-block error">' + errorMsg +"</span>");
            }

            if(el.hasClass('chosen-container')){
                el = $('#' + el.attr('id').replace('_chosen',''));
            }

            var name = el.attr('name');
            if(name === 'undefined'){
                name = el.attr('data-name');
            }

            if(typeof el.attr('type') != 'undefined' && el.attr('type') == 'checkbox')
                return ;

            var label = el.closest('form').find('label[for="' + name + '"]');

            if(label.length < 1)
                label = el.closest('form').find('label[for="' + el.attr('id') + '"]');

            label.addClass('error');
        },
        displayPasswordStrength : function(conf) {
            new validation_rules.validate_strength.utilities.strengthDisplay(this, conf);
            return this;
        },
        prepare_form            : function(onSuccess,onError, disable){
            var form = $(this),
                formId = form.attr('id'),
                events = {
                    'onError': function () {
                        if (typeof onError == 'function') {
                            onError(form)
                        }
                        return false;
                    },
                    'onSuccess': function () {
                        onSuccess(form);
                    }
                };

            if (typeof onSuccess != 'function') {
                throw "Callback for success was not set!";
                return false;
            }

            if(!(formId in form_objs)){
                form_objs[formId] = events;
            }else{
                $.extend(form_objs[formId], events);
            }

            if(typeof disable != 'undefined'){
                form_objs[formId].disabled = form.find(disable);
            }

            //Disable HTML5 validation.
            form.attr({'novalidate':''});

            //Mark this form as validation ready to distinguish if further prepare is required.
            form.addClass(validation_class);

            //Display a password strength meter after password element with validation rule strength.
            form.find('[data-validate*="strength"]').displayPasswordStrength();

            form.find('textarea').on('keypress', function (e) {
                if(e.which == '13' && e.shiftKey == true){
                    e.preventDefault();
                    $(this).closest('form').trigger('validate');
                }
            });

            //Set validation event for this form.
            form.on('validate', function (e) {
                form.validate_form();
            });

            //Disable default submit method in order to be rerouted through the validation method.
            form.on('submit', function (e) {
                e.preventDefault();
            });

            //Set error event for this invalid form.
            form.on('onError', function () {
                form_objs[formId].onError();

                defaultErrorHandler(formId);

                $(this).find_errors();
            });

            form.on('onSuccess', function () {
                if(typeof disable != 'undefined') {
                    form_objs[formId].disabled.addClass('disabled');
                }

                form_objs[formId].onSuccess();
            });

            //Find all form inputs which can receive the keypress event and trigger the "validate" event.
            form.add_handler();

            return $(this);
        },

        
        prepare_form_advanced   : function(properties){
            // The function prepare_form_advanced() is a more advanced version of prepare_form() capable to assign manual triggers for the forms "validate" event.
            var form = $(this),
                formId = form.attr('id');

            if(form.is_ready())
                return form;

            if(!$.isPlainObject(properties) || $.isEmptyObject(properties)){
                throw "Properties object is undefined! Define it to continue.";
            }

            if(! ('onSuccess' in properties) || typeof properties.onSuccess != 'function'){
                throw "Callback for success was not set!";
            }

            if(! ('onError' in properties)){
                properties.onError = null;
            }

            if('custom_keypress_handler' in properties){
                if(!(formId in form_objs))
                    form_objs[formId] = {};

                form_objs[formId].custom_keypress_handler = properties.custom_keypress_handler;
            }

            form.prepare_form(properties.onSuccess,properties.onError, properties.disable);

            if('handlers' in properties){

                if(typeof properties.handlers != 'string'){
                    throw 'The handlers property contains invalid type of data! It should be string, ' + typeof properties.handlers + ' was given. Handlers must contain a JQuery selector.';
                }

                var handlers = form.find(properties.handlers);

                if(handlers.length){
                    form_objs[form.attr('id')].handlers = handlers;
                    $.each(properties.handlers.split(','), function(key, handler){
                        $(document).on('click', '#' + form.attr('id') + ' ' + handler + ':not(.disabled)', function(e){
                            e.preventDefault();

                            var obj = $(this);

                            if(!obj.hasClass('order') && !obj.hasClass('update') && !('disable_exception' in properties))
                                obj.addClass('disabled');

                            if($.isTouch()){
                                obj.addClass('requestTrigger');
                            }

                            form.trigger('validate');
                            obj.blur();
                        });

                        $(document).on('click', '#' + form.attr('id') + ' ' + handler + '.disabled', function(e){
                            e.preventDefault();
                        });
                    });
                }else{
                    throw 'The handlers you provided, for Form : "' + formId + '" didn`t match any elements.';
                }
            }

            hook_outer_handles(form, formId, properties);
            hook_cancel_form(form, formId, properties);
            hook_callbacks(form, formId, properties);
            hook_triggers(form, formId, properties);

            log_version_control(formId, properties);
            log_exceptions(formId, properties);

            if ('callback' in form_objs[formId] && 'after:prepare' in form_objs[formId]['callback']) {
                form_objs[formId]['callback']['after:prepare'](form);
            }

            //Provides a global error hook
            if ('custom_error_handler' in properties) {
                form_objs[formId].custom_error_handler = properties.custom_error_handler
            }

            //Provides an error specific handler
            if ('custom_error_display' in properties) {
                form_objs[formId].custom_error_display = properties.custom_error_display
            }

            return form;
        },
        add_handler             : function(){
            var form    = $(this),
                formId  = form.attr('id');

            if('custom_keypress_handler' in form_objs[formId]){
                $.each(form_objs[formId].custom_keypress_handler, function (selector, callback){
                    $(selector).on('keypress', function (e){
                        if(e.which == 13) {
                            e.preventDefault();

                            callback();
                        }
                    });
                });
            }else{
                $(document).on('keypress', '#' + formId + ' input:not(.chosen-container input)',function(e){
                    if(e.which == 13) {
                        e.preventDefault();

                        var form = $(this).closest('form');

                        $(this).closest('form').submit_form();
                    }
                });
            }

            return form;
        },
        submit_form             : function(){
            $(this).trigger('validate');
        },
        find_errors             : function($speed) {
            var form    = $(this),
                formId  = form.attr('id'),
                error   = form.find('.error:first');

            if(typeof form_objs[formId] != 'undefined' && 'custom_error_handler' in form_objs[formId]){
                form_objs[formId].custom_error_handler(error)
            }else{
                if(error.is(':visible')) {
                    $('html,body').animate({
                        scrollTop: error.offset().top - 100
                    }, ($speed || 2000));
                }
            }


        },
        enable_form_controls    : function(){
            if($(this).is('form'))
                enable_form_controls($(this).attr('id'));

            return $(this);
        },
        validate                : function(){
            $(this).trigger('validate');

            return $(this);
        },
        element                 : function (strict, callback, error, success) {
            if (typeof strict == 'function') {
                var tmp     = callback,
                    tmp2    = error;

                callback    = strict;
                error       = tmp;
                success     = tmp2;

                strict      = false;
            }


            validate_element($(this), callback, error, strict, success);
        },
        is_ready                : function () {
            return $(this).hasClass(validation_class);
        },
        handle_errors           : function () {
            defaultErrorHandler(this[0].id);
        },
        alter_event_callback    : function (event, callback) {
            if (['onSuccess', 'onError'].indexOf(event) < 0)
                throw 'Event "' + event + '" unknown';

            if (typeof callback != 'function')
                throw 'Callback must be function';

            var form = $(this);

            form_objs[form.attr('id')][event] = function () {
                callback(form);
            };
        },
    });

    $.extend({
        read_dependencies       : function (key) {
            return DEPENDENCIES[key.toUpperCase()];
        },
        read_logs               : function (key) {
            return form_objs;
        },
        get_logs                : function (formId) {
            return form_objs[formId];
        },
        enable_form_controls    : function(formId) {
            if(formId !== false)
                enable_form_controls(formId);
        },
        add_validation_rule     : function(rules) {
            if(typeof rules != 'object'){
                throw 'No rules to add.';
            }

            $.each(rules, function (key, value) {
                if(!(key in local_validation_rules)){
                    local_validation_rules[key] = value;
                }
            });
        },
        get_error_msg           : function () {
            return ERROR_MSG;
        },
        getValidationClass      : function () {
            return validation_class;
        }
    });

    function validate_form(obj){
        if(obj.is('form')){
            obj.find('.error:not(.stickly_warning)').removeClass('error');
            $('.invalid').removeClass('invalid');
            $('.help-block').remove();
            src = obj.find('[data-validate]');

            $.each(validation_rules,function(key,value){
                rule_name = key.replace('validate_','');
                elements = [];

                src.each(function(){
                    var item = $(this),
                        rules = item.attr('data-validate').split(' ');

                    if($.inArray(rule_name, rules) > -1){
                        if(!item.is('disabled') && !item.hasClass('invalid')){
                            elements.push(item);
                        }
                    }
                });

                if(elements.length) {
                    $(elements).each(function () {
                        el = $(this);

                        type = el.attr('data-validate-type');

                        if (typeof type == 'undefined') {
                            var override = typeof el.attr('data-override-visibility') != 'undefined';

                            if (!value.rule(el, obj, override)) {
                                if (el.is('select')) {
                                    el.addClass('invalid');
                                    var chosen = $('#' + el.attr('id') + '_chosen');

                                    if (chosen.length) {
                                        var target = chosen;
                                    } else {
                                        target = el;
                                    }
                                } else {
                                    target = el;
                                }

                                if (!getCustomDisplay(obj.attr('id'), key, target)) {
                                    target.show_validation_error(value.message);
                                }
                            }
                        } else {
                            if (el.is(':visible') || typeof el.attr('data-override-visibility') != 'undefined') {
                                validation_target = el.find('[type="' + type + '"]');

                                if (!value.rule(validation_target, obj, true)) {
                                    if (!getCustomDisplay(obj.attr('id'), key, el)) {
                                        el.show_validation_error(value.message);
                                    }
                                }
                            }
                        }
                    });
                }
            });

            apply_localised_rules (obj);

            if(obj.find('.error').length < 1){
                $.each(group_validation_rules,function(key,value){

                    elements = obj.find('[data-validate*="' + key.replace('validate_','') + '"]');

                    if(elements.length) {
                        elements.each(function () {
                            value.rule($(this));
                        });
                    }
                })
            }
        }
    }

    function apply_localised_rules (obj) {
        if(obj.find('.error').length < 1 && !$.isEmptyObject(local_validation_rules)) {
            $.each(local_validation_rules, function (rule, definition) {
                if (obj.is(definition.form) && typeof definition.targets == 'string') {
                    var targets = obj.find(definition.targets);
                    if (targets.length) {
                        targets.each(function () {
                            var el = $(this);

                            if (!definition.rule(el)) {
                                el.show_validation_error(definition.message);
                            }
                        });
                    }
                }
            })
        }
    }

    function perform_status_handler_function(display_errors, obj){
        if(typeof display_errors == 'undefined') {
            if ($('.invalid').length) {
                obj.trigger('onError');
            } else {
                obj.trigger('onSuccess');

            }
        }

        return false;
    }

    function hook_cancel_form (form, formId, properties) {
        if(! ('cancel' in properties)){
            return ;
        }

        if(! ('handler' in properties.cancel)){
            throw "There is no handle to hook."
        }

        if(! ('callback' in properties.cancel)){
            throw "No callback is defined."
        }

        var handler = form.find(properties.cancel.handler);

        if(handler.length) {
            var handlers = properties.cancel.handler.split(',');

            $.each(handlers, function (key, value) {
                var current_handler = '#' + formId + ' ' + value;

                $(document)
                    .on('click',  current_handler + ':not(.disabled)', function (e) {
                        e.preventDefault();
                        properties.cancel.callback($(this));
                    })
                    .on('click',  current_handler + '.disabled', function (e) {
                        e.preventDefault();
                    });
            });
        }
    }

    function hook_triggers (form, formId, properties) {
        if(!properties.trigger)
            return;

        $.each(properties.trigger, function (key, data) {
            $(data.item).on(data.event, function (e) {
                data.callback(e, $(this));
            });
        });
    }

    function perform_two_way_version_control (form, formId) {
        if (typeof form_objs[formId].ver_control != 'undefined') {
            if (!perform_version_test_on_logs(form, form_objs[form.attr('id')].ver_control)) {
                no_change_enable_submit_button(form);
                form.find('.error').removeClass('error');
                form.find('.help-block').remove();
                return false;
            }
        }else if(!perform_version_test_on_local_version_control(form)) {
            no_change_enable_submit_button(form);
            form.find('.error').removeClass('error');
            form.find('.help-block').remove();
            return false;
        }

        return true;
    }

    /**
     * If there are no changes remove disabled class to enable the submit button
     * @param form
     */
    function no_change_enable_submit_button (form){
        handlers = $.get_logs(form.attr('id')).handlers;

        if(typeof handlers != 'undefined' && handlers.length){
            $(handlers).removeClass('disabled').blur();
        }
    }

    function log_version_control (formId, properties){
        if('ver_control' in properties){
            form_objs[formId]['ver_control'] = properties.ver_control;
        }
    }

    /**
     * Collect all the log handlers together
     * @param form
     * @param logs
     * @returns {*}
     */
    function perform_version_test_on_logs (form,logs) {
        if(logs.type == 'array'){
            return check_log_array(form,logs);
        }
    }

    /**
     * Find the corresponding log var and compare against it the forms input.
     * Logs are only used when the form`s content is a group on identical fields (ex: a list on nameservers).
     * To check if there any changes the function checks if the element`s name exists in logs.
     * If it does not exist means that is a new addition to the form that must be submitted to the server.
     * Also the function compares the keys that finds in logs with their current value to see if they are changed.
     * On the first encounter breaks and returns true to continue the validation in order to submit the form.
     * @param form
     * @param logs
     * @returns {boolean}
     */
    function check_log_array (form,logs){
        var data            = fetch_data_from_array (logs.value),
            form_array      = uniform_input_form_to_obj(form),
            changes_found   = false;

        $.each(form_array['data'], function(key, value){
            if(typeof data[key] == 'undefined' || ($.isArray(data[key]) && data[key].indexOf(value) < 0) || ('value' in data[key] && data[key]['value'] != value)){
                changes_found = true;
                return false;
            }
        });

        if(!changes_found){
            $.each(data, function(key){
                if(data[key]) {
                    var target = form.find('[name="' + key + '"]'),
                        value = ($.isArray(data[key])) ? data[key] : data[key]['value'];

                    if (target.length < 1 || value.indexOf(target.val()) < 0 || (!target.is('select') && target.is(':hidden'))) {
                        changes_found = true;
                        return false;
                    }
                }else{
                    changes_found = true;
                }
            });
        }

        return changes_found;
    }

    /**
     * Find the elements that use local version control and see for changes.
     * The process is similar with looking up changes in logs.
     * @param form
     * @returns {boolean}
     */
    function perform_version_test_on_local_version_control (form) {
        var targets             = form.find('input[data-last-val]:not([type="hidden"]):not(:disabled):not(.chosen-drop input):not([name="_token"]), textarea[data-last-val]:not(:disabled)'),
            changes_found       = false;

        if(targets.length){
            targets.each(function(){
                var obj = $(this), last_val, current_val;

                if(obj.is('div')){
                    return ;
                }

                last_val = obj.attr('data-last-val');
                current_val = obj.val();

                if(obj.attr('type') == 'checkbox')
                    current_val = JSON.parse('"[' + ((obj.prop('checked')) ? 1 : 0) + ']"');
                else
                    current_val = ($.isArray(current_val)) ? JSON.stringify(current_val) : JSON.stringify([current_val]);

                if(last_val.indexOf('[') != 0){
                    last_val = ($.isArray(last_val)) ? JSON.stringify(last_val) : JSON.stringify([last_val]);
                }

                if(last_val != current_val){
                    changes_found = true;
                    return false;
                }
            });
        }

        if (!changes_found) {
            if (!$.isTouch()) {
                var chosen = form.find('.chosen-container:visible'),
                    selects = [];

                if(chosen.length){
                    chosen.each(function(){
                        selects.push($('#' + $(this).attr('id').replace('_chosen','') + ':not(:disabled)'));
                    });

                    selects = $(selects);
                }
            } else {
                selects = form.find('select:visible:not(:disabled)');
            }

            if(selects.length){
                selects.each(function(){
                    var obj = $(this),
                        last_val = obj.attr('data-last-val'),
                        current_val = obj.val();

                    if(!last_val)
                        last_val = '';

                    current_val = ($.isArray(current_val)) ? JSON.stringify(current_val) : JSON.stringify([current_val]);

                    if(last_val.indexOf('[') != 0){
                        last_val = ($.isArray(last_val)) ? JSON.stringify(last_val) : JSON.stringify([last_val]);
                    }

                    if(last_val != current_val){
                        changes_found = true;
                        return false;
                    }
                })
            }
        }

        return changes_found;
    }

    /**
     * Fetches the logs from the window object.
     * @param value
     * @returns {*}
     */
    function fetch_data_from_array (value) {
        var path = value.split(','),
            data = null;

        $.each(path, function(key, value){
            if(data == null){
                data = window[value];
            }else{
                data = data[value];
            }
        });

        return data;
    }

    function log_exceptions (formId, properties){
        if('version_exception' in properties){
            form_objs[formId]['version_exception'] = properties.version_exception;
        }
    }

    function handle_no_changes_error (form) {
        var item = form.closest('.item'),
            wrapper = item.closest('.wrapper');

        if(item.length){
            if(item.hasClass(identifiers.inline_block_items_class)){
                closeBlock(wrapper);
            }else{
                closeLine(item);
            }

            $.alertHandler('',ERROR_MSG.NOCHANGES,alert_box_warning);
        }

        if(typeof post_close_command == 'function'){
            post_close_command(form);
        }
    }

    /**
     * Returns an array of changeable fields and the length of those possible to send.
     * This function should handle the forms with only one type of input.
     * This function can return all selects.
     * Select do not need filter as they will either be hidden because of chosen or visible because of mobiles
     * @param form
     * @returns {{data: {}, length: *}}
     */
    function uniform_input_form_to_obj (form) {
        var data = {};

        inputs = form.find('input:not(:disabled):not(:hidden):not(.chosen-drop input), textarea:not(:disabled):not(:hidden)');

        inputs.each(function(){
            data[$(this).attr('name')] = $(this).val();
        });

        form.find('select:not(:disabled)').each(function(){
            var obj = $(this);

            if(obj.is(':visible') || $('#' + obj.attr('id') + '_chosen').is(':visible')){
                data[obj.attr('name')] = obj.val();
            }
        });

        return {'data':data,'length':form.find('input:not(:hidden), textarea:not(:hidden), select').length};
    }

    function enable_form_controls (formId) {
        if(typeof formId != 'undefined'){
            var logs = $.get_logs(formId);

            if(typeof logs == 'undefined'){
                return ;
            }

            var disabled = logs.disabled;

            if (typeof disabled == 'object') {
                $(disabled).filter(':not([data-keep_disabled])').removeClass('disabled');
            } else {
                $('#' + formId).find('.disabled:not([data-keep_disabled])').removeClass('disabled');
            }

            $('#formDim').remove();
        }
    }

    function hook_callbacks (form, formId, properties) {
        if(typeof properties.callback != 'object'){
            return ;
        }

        form_objs[formId]['callback'] = {};

        $.each(properties.callback, function(key, value) {
            if (valid_callbacks.indexOf(key) > -1 && typeof value == 'function') {
                form_objs[formId]['callback'][key] = value;
            }
        })
    }

    function hook_outer_handles (form, formId, properties) {
        if(typeof properties.outer_handlers != 'string'){
            return ;
        }

        var handlers = $(properties.outer_handlers);

        form_objs[form.attr('id')].outer_handlers = handlers;

        if(!('disabled' in form_objs[form.attr('id')]))
            form_objs[form.attr('id')].disabled = [];

        handlers.each(function (){
            form_objs[form.attr('id')].disabled.push(this);
        });

        handlers = properties.outer_handlers.split(',');

        var active_handlers = '',
            disabled_handlers = '';

        $.each(handlers, function (key, value) {
            active_handlers += value.trim() + ':not(.disabled), ';
            disabled_handlers += value.trim() + '.disabled, ';
        });


        active_handlers = active_handlers.trim().replace(/,$/,'');
        disabled_handlers = disabled_handlers.trim().replace(/,$/,'');

        $(document).on('click', active_handlers, function(e){
            e.preventDefault();

            var obj = $(this);

            if(!obj.hasClass('order'))
                obj.addClass('disabled');

            form.trigger('validate');
        });

        $(document).on('click', disabled_handlers, function(e){
            e.preventDefault();
        });
    }

    function validate_element (obj, callback, error, strict) {
        strict_validation = strict;

        var rules = obj.attr('data-validate').split(' ');

        obj.removeClass('error invalid');

        var cont;
        if(!obj.is('div'))
            cont = obj.closest('div');
        else
            cont = obj;

        cont.find('.error:not(.stickly_warning)').removeClass('error');
        cont.find('.invalid').removeClass('invalid');
        cont.find('.help-block').remove();

        for(var rule in rules){
            if (rules.hasOwnProperty(rule)) {
                rule = validation_rules['validate_' + rules[rule]];

                var type = obj.attr('data-validate-type'),
                    el = obj;

                if (el.is('select')) {
                    var tmp = $('#' + el.attr('id') + '_chosen.chosen-container');

                    if (tmp.length)
                        el = tmp;
                }

                if (typeof type != 'undefined') {
                    var target = obj.find('[type="' + type + '"]');
                    if (!rule.rule(target, obj.closest('form'), true)) {
                        el.show_validation_error(rule.message);
                        break;
                    }
                } else {
                    try {
                        if (!rule.rule(obj, obj.closest('form'), !strict)) {
                            el.show_validation_error(rule.message);
                            break;
                        }
                    } catch (e) {
                        throw e;
                    }
                }
            }
        }

        if(obj.hasClass('error')) {
            if (typeof error == 'function')
                error(obj);
        } else {
            if (typeof callback == 'function')
                callback(obj);
        }

        strict_validation = true;
    }

    function getCustomDisplay (form, rule, element) {
        try {
            if (! (rule in form_objs[form].custom_error_display))
                return false;

            if (typeof form_objs[form].custom_error_display[rule] == 'function')
                form_objs[form].custom_error_display[rule](validation_rules[rule], $(element));

            return true;
        } catch (err) {
            return false;
        }
    }

    function defaultErrorHandler (formId) {
        if('handlers' in form_objs[formId]) {
            form_objs[formId].handlers.removeClass('disabled').blur();
        }

        if('outer_handlers' in form_objs[formId]) {
            form_objs[formId].outer_handlers.removeClass('disabled').blur();
        }
    }
});