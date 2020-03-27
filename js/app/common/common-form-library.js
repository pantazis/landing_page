$(document).ready(function(){
    $.fn.extend({
        setFieldsVersionControl : function(){
            setFieldsVersionControl ($(this));

            return this;
        },
        update_version_control  : function(new_value) {
            obj = $(this);

            if(typeof new_value == 'undefined'){
                new_value = obj.val();
            }

            if(obj.is('select')){
                if($('#' + obj.attr('id') + '_chosen').length){
                    obj.chosen_update(new_value);
                }else{
                    obj.apply_chosen(new_value);
                }
            }else{
                obj.val(new_value);
            }

            if(new_value === null){
                new_value = '';
            }

            if($.isArray(new_value)){
                new_value = JSON.stringify(new_value);
            }else{
                new_value = JSON.stringify([new_value]);
            }
            obj.attr({'data-last-val':new_value});

            return obj;
        },
        set_text                : function(value, delimiter) {
            if(!$.isArray(value)) {
                value = ((value) ? value : '-');if($.htmlLookUp(value))
                    $(this).html(value);
                else
                    $(this).text(value);

            }else{
                var temp = '',
                    texts = value.length;

                $.each(value,function(key,string){
                    if(temp == ''){
                        if(string != null) {
                            temp = string;
                        }
                    } else {
                        if(string != null) {
                            if(typeof delimiter != 'undefined' && delimiter != '()') {
                                temp = temp + ' ' + delimiter + ' ' + string;
                            }else if(typeof delimiter != 'undefined' && texts) {
                                temp = temp + ' (' + string + ')';
                            }else{
                                temp = temp + ' ' + string;
                            }
                        }
                    }
                });

                if($.htmlLookUp(temp))
                    $(this).html(temp);
                else
                    $(this).text(temp);
            }
            return $(this);
        },
        text_app                : function(val){
            var obj = $(this);
            if(val){
                var text = obj.text();

                if(!text){
                    text = '';
                }

                obj.text(text + val);
            }

            return obj;
        },
        text_pre                : function(val){
            var obj = $(this);
            if(val){
                var text = obj.text();

                if(!text){
                    text = '';
                }

                obj.text(val + text);
            }

            return obj;
        }
    });
    $.extend({
        update_version_control  : function (properties) {
            if(typeof properties == 'object'){
                if('radio' in properties){
                    title = properties['radio'].toLowerCase() + '_radio';
                    $('#' + title).prop({'checked':true}).closest('.inline-list').attr({'data-last-checked':properties['radio']});
                }
            }
        }
    });

    $(document)
        .on("click", '.add_btn, .edit_btn,.item .cancel:not(.disabled)', function(e){
            e.preventDefault();
            var obj = $(this);
            line = obj.closest('.item');
            open_line = $('.editable_line.opened');

            (obj.hasClass('edit_btn')) ? closePreviousAndOpenCurrent(open_line, line) : cancelCurrentLineForm(line);

            if(obj.hasClass('add_btn')){
                openLine(obj.closest('.item'));
            }
        })
        .on("click", '.item .cancel.disabled', function(e){
            e.preventDefault();
        })
        .on('click', '.edit_block_btn.disabled',function(e) {
            e.preventDefault();
        })
        .on('click', '.edit_block_btn:not(.disabled), .cancel_block_btn',function(e){
            e.preventDefault();
            previously_open = $('.is-open');

            //Restore form to their previous state and close them.
            if(previously_open.length) {

                previously_open.find('[data-last-val]').each(function(){
                    var obj = $(this);

                    if(obj.is('select')){
                        obj.chosen_update(obj.attr('data-last-val'));
                    }else{
                        obj.val(obj.attr('data-last-val'));
                    }
                });
                if ($(this).hasClass('edit_block_btn')) {
                    $('.is-closed').toggleClass("is-closed");
                    previously_open.toggleClass("is-open");
                }

                previously_open.find('.error').removeClass('error').filter('.help-block').remove();
                previously_open.find('.form-error').remove();
                $('.item:not(.block_item)').removeClass('opened');
            }
            wrapper = $(this).closest('.wrapper');
            wrapper.find('.display_items').toggleClass("is-closed");
            wrapper.find('.display_form').toggleClass("is-open");
        });

    var gdpr_approval_modal = $('#gdpr_approval_modal');

//    $('#gdpr_approval_modal')
    $.observers.register('gdpr_approval_modal', function (mutations) {
        var src = gdpr_approval_modal.attr('data-form-src');

        if (! gdpr_approval_modal.hasClass('open')) {
            var modal_bg = $('.reveal-modal-bg');

            modal_bg.css('z-index', modal_bg.attr('data-init-index'));

            gdpr_approval_modal.find('[type="checkbox"]').prop('checked', false);
            gdpr_approval_modal.find('.disabled').removeClass('disabled');

            var form = $('#' + src);

            form.enable_form_controls();

            $('#gdprPassCont').hide().find('input').val('');

            if (src == 'mobile_notification_form') {
                var input = form.find('[type="checkbox"].pending');

                input.removeClass('pending').prop('checked', ! input.prop('checked'));
            }

            gdpr_approval_modal.find('.reveal-password:has(.icon-eye)').click();
        } else {
            src = gdpr_approval_modal.attr('data-form-src');

            if (src == 'mobile_notification_form' || src == 'icann_auto_approval_form') {
                gdpr_approval_modal.find('#gdprPassCont').show();
            }
        }
    });

    $.observers.observe('gdpr_approval_modal', gdpr_approval_modal, {attributes:true, attributeFilter:['class']});
});

var results_storage = {},
    config;

/**
 * Ajax callback functions START
 */

function commonEditableFormCallback(data, storage_key, form, errorHandler){
    if(data.success){
        if(!$.isPlainObject(data.data.result) || $.isEmptyObject(data.data.result)){
            closeLine(form.closest('.item'));
            return;
        }

        if(data.data.action == 'setFax' && data.data.result.fax.data.cc == null){
            data.data.result.fax.data.cc = $('#fax_country').val()
        }else if(data.data.action == 'setPhone' && data.data.result.phone.data.cc == null) {
            data.data.result.phone.data.cc = $('#phone_country').val()
        }

        commonSuccessfulRequest(data.data.result, storage_key);

        closeLine(form.closest('.item'));

        $('#gdpr_approval_modal').modal_close();
    }else{
        if(typeof errorHandler != 'function')
            throw "Error handler is not defined.";

        errorHandler(data,form.attr('id'));
    }
}

/**
 * Ajax callback functions END
 */

/**
 * Successful request callback START
 */

function commonSuccessfulRequest(result,storage_key){
    results_storage[storage_key] = result;

    $.each(results_storage[storage_key], function (key, value) {
        if (typeof config == 'object' && 'skip' in config && $.inArray(key, config.skip) > - 1) {
            return true;
        }
        if (!$.isPlainObject(value) && !$.isArray(value)) {
            commonHandleNoArrayField(key, value, storage_key);
        } else {
            commonHandleArrayField(key, value, storage_key)
        }
    });
}

/**
 * Successful request callback END
 */

/**
 * Data handling functions START
 */

/**
 * Handles response fields that are not arrays/objects. work in progress.
 * @param key
 * @param value
 */
function commonHandleNoArrayField(key, value, storage_key) {
    if(key in config.combine){
        display = getCombinedDisplay(key, value, storage_key);

        combined_field = config.combine[key].field;

        var element = $('[name="' + combined_field + '"');
        element.update_version_control(results_storage[storage_key][combined_field]);
        triggerPostUpdateEvent(combined_field, element);
    }else{
        display = value;
    }

    $('.data_display[data-about="' + key + '"]').set_text(display);

    var element = $('[name="' + key + '"');
    if(element.length){
        element.update_version_control(value);
        triggerPostUpdateEvent(key, element);
    }
}

/**
 * Determines if the received object contains language depended information.
 * @param key
 * @param value
 */
function commonHandleArrayField(key, value, storage_key) {
    if ('data' in value) {
        commonHandleNoLangArrayField(key, value, storage_key);
    } else {
        commonHandleLangArrayField(key, value, storage_key)
    }
}

/**
 * Handles objects which are language independent. Handles display, form is work in progress.
 * @param key
 * @param value
 */
function commonHandleNoLangArrayField(key, value, storage_key) {
    var data = value.data,
        display;
    if ($.isArray(data)) {
        //cont = $('.data_display[data-about="' + key + '"]').empty();
        //if (key in config.combine) {
        //    $.each(data, function (index, value) {
        //        cont.append('<span>' + getCombinedDisplay(key, ('display' in value) ? value.display : data, storage_key) + '</span>');
        //    });
        //} else {
        //    $.each(data, function (index, value) {
        //        cont.append('<span>' + ('display' in value) ? value.display : data + '</span>');
        //    });
        //}
    } else if($.isPlainObject(data)) {
        $('.data_display[data-about="' + key + '"]').set_text(('display' in value) ? value.display : data);

        if('cc' in data && 'nr' in data){

            $('select[id*="' + key + '"]').update_version_control(data.cc);
            $('input[name="' + key + '"]').update_version_control(data.nr);
        }else{
            $.each(data, function(name,value){
                var element = $('[name="' + name + '"]');
                if(element.is('[type="text"],select')){
                    element.update_version_control(value);
                }else if(element.is('[type="radio"]')){
                    $.update_version_control({'radio': value});
                }

            });
        }
    }else {
        //Display handling.
        if (key in config.combine) {
            display = getCombinedDisplay(key, ('display' in value) ? value.display : data, storage_key);
        } else {
            display = ('display' in value) ? value.display : data;
        }

        $('.data_display[data-about="' + key + '"]').set_text(display);

        //Form handling.
        var element;
        if(key == 'state'){
            if('country' in results_storage[storage_key]){
                if(results_storage[storage_key].country.data == 'GR')
                    element = $('select[name="' + key + '"],select[name="state_id"]');
                else
                    element = $('input[name="' + key + '"]');
            }else{
                element = $('[name="' + key + '"]');
            }
        }else{
            element = $('[name="' + key + '"]');
        }

        element.update_version_control(data);
        triggerPostUpdateEvent(key, element);
    }
}

/**
 * Handles objects which are language depended. Handles display, form is work in progress.
 * Checks if the give language pack is an array itself.
 * If true produces a list of the results else replaces the old display.
 * Local and foreign data are handled separately.
 * @param key
 * @param value
 */
function commonHandleLangArrayField(key, value, storage_key) {
    var loc = value.loc,
        int = value.int;

    processLocalizedData(key, loc, 'loc', storage_key);
    processLocalizedData(key, int, 'int', storage_key);
}

/**
 * Data handling functions END
 */

/**
 * Miscellaneous functions START
 */

/**
 * Processes the given lang and updates the form.
 * @param key
 * @param lang
 * @param lang_str
 * @param storage_key
 */
function processLocalizedData(key, lang, lang_str, storage_key){
    var data = lang.data,
        display;

    if ($.isArray(data)) {
        display_cont = $('[data-about="' + lang_str + '"] .data_display[data-about="' + key + '"]').empty();
        form_cont = $('.' + key + '_' + lang_str);
        form_cont.find('input').val('');

        if (key in config.combine) {
            $.each(data, function (index, value) {
                display_cont.append('<span>' + getCombinedDisplay(key, value, storage_key) + '</span>');

                //I believe those elements will be excluded from the event listing.
                form_cont.find('[name*="' + index + '"]').update_version_control(value);
            });
        } else {
            $.each(data, function (index, value) {
                display_cont.append('<span>' + value + '</span>');

                //I believe those elements will be excluded from the event listing.
                element = form_cont.find('[name*="' + index + '"]');
                if(element.length){
                    element.update_version_control(value);
                }
            });
        }

        form_cont.find('input:not(:first)').each(function(){
            if(!$(this).val()){
                $(this).closest('.address-body').remove();
            }
        });
    } else {
        //Handle display
        if (key in config.combine) {
            if($.isPlainObject(lang)){
                display = getCombinedDisplay(key, ('display' in lang) ? lang.display : data, storage_key);
            }else{
                display = getCombinedDisplay(key, lang, storage_key);
            }

            if(lang_str == 'loc'){
                combined_field = config.combine[key].field;

                var element = $('#' + combined_field);
                if(element.length){
                    element.update_version_control(results_storage[storage_key][combined_field]);
                    triggerPostUpdateEvent(key, element);
                }
            }
        } else {
            if($.isPlainObject(lang)){
                display = ('display' in lang) ? lang.display : data;
            }else{
                display = lang;
            }

        }
        $('[data-about="' + lang_str + '"] .data_display[data-about="' + key + '"]').set_text(display);

        //Handle form
        name = (lang_str == 'int') ? key + '_int' : key;

        var element = $('[name="' + name + '"]');
        if(element.length){
            element.update_version_control(data);
            triggerPostUpdateEvent(key, element);
        }
    }
}

/**
 * Search the config if there is an entry for the given key, in order to produce a combine display from the given prefix.
 * @param key
 * @param prefix
 * @param storage_key
 * @returns {*}
 */
function getCombinedDisplay(key, prefix, storage_key) {
    return prefix + config.combine[key].delimiter + results_storage[storage_key][config.combine[key].field];
}

/**
 * Trigger an event defined to config on the given element using the key to find it.
 * @param key
 * @param element
 */
function triggerPostUpdateEvent(key, element){
    if(key in config.event){
        element.trigger(config.event[key]);
    }
}

/**
 * Build the configuration based on the given properties, if the properties are not defined produces a default config
 * @param properties
 */
function createHandlerConfig(properties){
    if(!$.isPlainObject(properties)){
        properties = {};
    }

    if(!('skip' in properties)){
        properties.skip = ['zip'];
    }

    if(!('combine' in properties)){
        properties.combine = {
            city: {
                field: 'zip',
                delimiter: ', '
            }
        };
    }

    if(!('event' in properties)){
        properties.event = {};
    }

    config = properties;
}

/**
 * Close an inline editable form.
 * @param line
 */
function closeLine(line){
    line.removeClass('opened');
    line.find('.content_static').removeClass("is-closed");
    line.find('.content_form').removeClass("is-open");

    var gdpr_modal = $('#gdpr_approval_modal');

    if (gdpr_modal.length);
    gdpr_modal.modal_close();
}

function closeBlock(wrapper){
    wrapper.find('.display_items').removeClass("is-closed");
    wrapper.find('.display_form').removeClass("is-open");
}

/**
 * Open an inline editable form.
 * @param line
 */
function openLine(line){
    line.addClass('opened');
    line.find('.content_static').addClass("is-closed");
    line.find('.content_form').addClass("is-open");
}

/**
 * Open an editable form but close te previous ones first.
 * @param open_line
 * @param line
 */
function closePreviousAndOpenCurrent(open_line, line){
    if(open_line.length) {
        var form = open_line.find('.content_form form');

        removeUnsavedChanges(open_line);
        closeLine(open_line);
        removeAllFormErrorMessages(open_line.find('form').attr('id'));
        $('.strength-meter').remove();
        form.enable_form_controls();

        form.find('.reveal-password:has(.icon-eye)').click();
    }
    openLine(line);
}

/**
 * Close current inline editable form and cancel any changes.
 * @param line
 */
function cancelCurrentLineForm(line){
    var form = line.find('.content_form form');

    removeUnsavedChanges(line);
    removeAllFormErrorMessages(line.find('form').attr('id'));
    form.enable_form_controls();
    closeLine(line);
    $('.strength-meter').remove();

    form.find('.reveal-password:has(.icon-eye)').click();
}

/**
 * Cancel any changes on the specified editable form.
 * @param line
 */
function removeUnsavedChanges(line){
    var inputs = line.find('textarea, [type="email"],[type="password"],[type="text"]:not(.chosen-container input):not(:disabled),select:not(#state):not(select[id*="state"])');

    inputs.each(function(){
        var element = $(this);
        if(element.is('select')){
            var last_val = element.attr('data-last-val');

            if(last_val) {
                if(element.attr('data-last-val').indexOf('[') == 0){
                    element.chosen_update((typeof element.attr('multiple') == 'undefined') ? JSON.parse(last_val)[0] : JSON.parse(last_val));
                }else{
                    element.chosen_update(last_val);
                }
            }

            if(element.attr('id') == 'pref_timezone_region' && element.val()){
                element.change();
            }
        }else{
            var last_val = element.attr('data-last-val');

            if(last_val) {
                if(element.attr('data-last-val').indexOf('[') == 0){
                    element.val(JSON.parse(last_val)[0]);
                }else{
                    element.val(last_val);
                }
            }
        }
    });

    element = line.find('#state, #state_id');
    if(element.length){
        val = line.find('[name="country"]').change().val();

        var last_val = line.find('#state, #state_id').attr('data-last-val');

        if(last_val) {
            if(last_val.indexOf('[') == 0){
                var state = (typeof element.attr('multiple') == 'undefined') ? JSON.parse(last_val)[0] : JSON.parse(last_val);
            }else{
                state = last_val;
            }
        }

        if(val == 'GR' || val == 'Greece'){
            element.chosen_update(state);
        }else{
            element.val(state);
        }
    }

    line_switch = line.find('.switch input');
    if(line_switch.length){
        question = line.find('#question');
        answer = line.find('#answer');
        if(question.length && answer.length && (question.val() == '' || answer.val() == '')) {
            line_switch.prop({'checked': false});
            line.find('.edit_btn').hide();
        }
    }

    radio_cont = line.find('[data-last-checked]');
    if(radio_cont.length){
        radio_cont.each(function(){
            $(this).prop({'checked':false});
            radio_name = $(this).attr('data-last-checked').toLowerCase() + '_radio';
            $('#' + radio_name).prop({'checked':true});
        });
    }
}

/**
 * Get the form defined in modal's data-src and locate the switch inside.
 * If modal was canceled by any means turn switch to it's previous state.
 * @param modal
 */
function cancelModalConnectedSwitch(modal){
    form = $('#' + modal.attr('data-src'));
    switchInput = form.find('.switch input');
    if(switchInput.length){
        switchInput.prop({'checked' : !switchInput.prop('checked')})
    }
}

/**
 * Fix the state view based on the country selected.
 * The ids for the states must "ALWAYS" be "#stateSelect" for greek states and "#statesInput" for foreign states.
 * @param trigger
 */
function statesManager(trigger){
    if(trigger.val() == 'GR'){
        $('#stateSelect').show().find('select').chosen_update('');
        $('#stateInput').hide();
    }else{
        $('#stateSelect').hide();
        $('#stateInput').show().find('input').val('');
    }
}

/**
 * Clear form from the error elements.
 * @param formId
 */
function removeAllFormErrorMessages(formId){
    $("#"+formId +" .help-block").remove();
    $("#"+formId +" .has-error").removeClass('has-error');
    $("#"+formId +" .error").removeClass('error').removeAttr( 'style' );
}

/**
 * Initiate the version control for the elements in editable forms.
 * @param forms
 */
function setFieldsVersionControl (forms){
    forms.find('input:not(.chosen-container input):not([type="radio"]):not([type="checkbox"]), select, textarea').each(function(){
        val = $(this).val();

        if(val == null){
            val = '';
        }

        if(!$.isArray(val)){
            val = [val];
        }

        val = JSON.stringify(val);

        $(this).attr({'data-last-val':val});
    });
}

/**
 * Miscellaneous functions END
 */

/**
 * Send set name request.
 */
function nameFormValidationCallback(form, errorHandler){
    if(typeof name_obj != 'object'){
        name_obj = new $.ajax_prototype({
            'type'  : 'POST',
            'url'   : form.attr('action'),
            'success'   : function(data){
                commonEditableFormCallback(data,'name', form,errorHandler);
            }
        }, form.attr('id'));
    }

    name_obj.data = collectData(form);
    $.ajax(name_obj);
}

/**
 * Send set address action
 */
function addressFormValidationCallback(form, errorHandler){
    if(typeof address_obj != 'object'){
        address_obj = new $.ajax_prototype({
            'type'  : 'POST',
            'url'   : form.attr('action'),
            'success'   : function(data){
                commonEditableFormCallback(data,'address', form, errorHandler);

                if($('.user_defined').length){
                    $('.user_defined').show();
                    $('.default_address').hide();
                }

                if(data.success && typeof data.data.result.country != 'undefined' && typeof data.data.result.country.data == 'string'){
                    $('[id*=_country]').each(function () {
                        if(!$('#' + $(this).attr('id').replace('_country', '')).val()){
                            $(this).update_version_control(data.data.result.country.data);
                        }
                    });
                }
            }
        }, form.attr('id'));
    }
    address_obj.data = collectData(form);
    $.ajax(address_obj);
}

/**
 * Send a request to change the fax
 */
function phoneFormValidationCallback(form, form_name, errorHandler){
    phone_obj = new $.ajax_prototype({
        'type'      : 'POST',
        'url'       : form.attr('action'),
        'success'   : function(data){
            commonEditableFormCallback(data,form_name, form, errorHandler);
        },
        data        : collectData(form)
    }, form.attr('id'));
    $.ajax(phone_obj);
}

/**
 * Collect the form data.
 * @param form
 */
function collectData(form){
    var data;

    if(form.find('[id^="state"]').length) {
        data = {};
        form.find('input:not(.chosen-container input):not(#state)').each(function () {
            data[$(this).attr('name')] = $(this).val();
        });
        data['country'] = form.find('#country').val();

        select_state = $('select[id^="state"]');

        if (form.find('#' + select_state.attr('id') + '_chosen:visible').length || (select_state.length && select_state.is(':visible'))) {

            data['state_id'] = select_state.find('option:selected').attr('data-lang');
            if (data['state_id'] < 10) {
                data['state_id'] = '0' + data['state_id']
            }
        } else {
            data['state'] = form.find('#state').val();
        }
    }else{
        data = form.serialize();
    }

    var modal = $('#gdpr_approval_modal.open');
    if (modal.length) {
        if (modal.find('#agree_terms:checked').length) {
            var communication_agreement = modal.find('[name="communication_agreement"]'),
                data_validity = modal.find('[name="data_validity"]'),
                processing_approval = modal.find('[name="processing_approval"]');

            if (typeof data == 'string') {
                data += '&communication_agreement=' + communication_agreement.val() + '&data_validity=' + data_validity.val() + '&processing_approval=' + processing_approval.val();
            } else if (typeof data == 'object')
                $.extend(data,  {'communication_agreement' : communication_agreement.val(), 'data_validity' : data_validity.val(), 'processing_approval' : processing_approval.val()});
        }
    }

    return data;
}

function openGDPRApprovalModal (form) {
    if ($.is_user()) {
        var modal = $('#gdpr_approval_modal'),
            modal_form = modal.find('form');

        modal.modal_open(function () {
            modal.attr('data-form-src', form.attr('id'));
        });

        if (!modal_form.is_ready())
            modal_form.prepare_form_advanced({
                handlers: '.request-verify',
                disable: '.button, .close-reveal-mymodal',
                version_exception: true,
                onSuccess: function () {
                    var modal_bg = $('.reveal-modal-bg'),
                        form = $('#' + modal.attr('data-form-src'));

                    modal_bg.attr('data-init-index', modal_bg.css('z-index')).css('z-index', (parseInt(modal.css('z-index')) + 1));

                    getGDPRCallback(form);
                }
            });
    } else {
        (function (form) {
            if (form.attr('id') == 'mobile_notification_form') {
                var modal = $('#security-confirm').attr('data-src', form.attr('id')).modal_open(),
                    modal_form = modal.find('form');

                if (!modal_form.is_ready())
                    modal_form.prepare_form_advanced({
                        handlers: '.request-verify',
                        disable: '.button, .close-reveal-mymodal',
                        version_exception: true,
                        onSuccess: function () {
                            var modal_bg = $('.reveal-modal-bg'),
                                form = $('#' + modal.attr('data-src'));

                            modal_bg.attr('data-init-index', modal_bg.css('z-index')).css('z-index', (parseInt(modal.css('z-index')) + 1));

                            getGDPRCallback(form);
                        }
                    });
            } else {
                getGDPRCallback(form);
            }
        })(form);
    }
}

function getGDPRCallback (form) {
    switch (form.attr('id')) {
        case 'identity_form':
            nameFormValidationCallback(form,function(data, formId){
                $.user_profile.handleErrors(data, formId);
            });
            break;
        case 'birthday_form':
            $.user_profile.birthdayFormValidationCallback(form);
            break;
        case 'company_form':
            $.user_profile.companyFormValidationCallback(form);
            break;
        case 'address_form':
            addressFormValidationCallback(form,function(data, formId){
                if (window.location.pathname.indexOf('/account') > -1)
                    $.user_profile.handleErrors(data, formId);
                else
                    $.edit_billing_profiee.handleErrors(data, formId);
            });
            break;
        case 'email_form':
            $.user_profile.emailFormValidationCallback(form);
            break;
        case 'mobile_form':
            $.user_profile.mobileFormValidationCallback(form);
            break;
        case 'landline_form':
        case 'fax_form':
            phoneFormValidationCallback(form, form.attr('id'), function(data, formId){
                $.user_profile.handleErrors(data, formId)
            });
            break;
        case 'mobile_notification_form':
            $.user_profile.mobileNotificationValidationCallback(form);
            break;
        case 'icann_auto_approval_form':
            $.user_profile.icannAutoApproveValidationCallback(form);
            break;
        case 'set_contact_name_form':
            nameFormValidationCallback(form,function(data, formId){
                $.edit_contact.handleErrors(data, formId);
            });
            break;
        case 'set_address_form':
            addressFormValidationCallback(form,function(data, formId){
                $.edit_contact.handleErrors(data, formId);
            });

            var zip = form.find('#zip');
            zip.val(zip.val().replace(/\s/g,''));
            break;
        case 'set_email_form':
            $.edit_contact.emailFormValidationCallback(form);
            break;
        case 'set_phone_form':
        case 'set_fax_form':
            phoneFormValidationCallback(form, form.attr('id'),function(data, formId){
                $.edit_contact.handleErrors(data, formId);
            });
            break;
        case 'set_name_form':
            nameFormValidationCallback(form,function(data, formId){
                $.edit_billing_profiee.handleErrors(data, formId);
            });
            break;
        case 'set_title_form':
            $.edit_billing_profiee.titleFormValidationCallback(form);
            break;
        case 'doy_form':
            $.edit_billing_profiee.doyFormValidationCallback(form);
            break;
        case 'activity_form':
            $.edit_billing_profiee.activityFormValidationCallback(form);
            break;
        case 'contacts_form' :
            $.domain_view.contact_validation_callback(form);
            break;
    }
}