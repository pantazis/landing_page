$(document).ready(function(){
    createHandlerConfig();

    $('.edit_btn ').on('click',function(e){
        e.preventDefault();
        var form = $(this).closest('.item').find('form');
        if(!form.hasClass('under_validation')){
            form.prepare_form_advanced(assignCallbackFunction(form));
        }
    });

    $('#default-trigger').on('change',function(){
        default_trigger_handler ($(this).closest('form'));
    });

    $('#infoModal').find('.button').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        obj.find('.submitText').hide();
        obj.find('.loading').show();

        location.replace(obj.attr('href'));
    });

    $.extend({
        edit_contact : {
            emailFormValidationCallback : emailFormValidationCallback,
            handleErrors : handleErrors
        }
    });
    // $('#state').apply_chosen();
});

/**
 * Return the correct validation callback for each form when the form is first open.
 * @param form
 * @returns {Function}
 */
function assignCallbackFunction(form){
    switch (form.attr('id')){
        case 'set_contact_name_form' :
        case 'set_address_form'      :
        case 'set_email_form'        :
        case 'set_phone_form'        :
        case 'set_fax_form'          : {
            return {
                onSuccess   : function(){
                    openGDPRApprovalModal(form);
                },
                handlers    : '.contact-edit',
                disable     : '.contact-edit'
            }
        }
    }
}

/**
 * Handle all the error in this page.
 * @param data
 * @param formId
 */
function handleErrors(data,formId){

    $.disable_gdpr_mopdal(data);

    switch (data.code){
        case error_codes.validation_error           : { //100
            $.displayErrors(formId,data.data);
            break;
        }
        case error_codes.contact_profile_not_found  : { //7503
            contactProfileNotFound(data.msg);
            break;
        }
        default: {
            globalApplicationErrors(data, formId)
        }
    }
}

/**
 * Send set email request
 * @param form
 */
function emailFormValidationCallback(form){
    var targeted_form = form,
        line = form.closest('.item');

    if(typeof email_obj != 'object'){
        email_obj = new $.ajax_prototype({
            'type'  : 'POST',
            'url'   : form.attr('action'),
            'success'   : function(data){
                if(data.success) {
                    if (data.code != error_codes.no_change && data.code == error_codes.contact_profile_updated) {
                        $('.content_static [data-about="email"]').text(data.data.result.data);
                        $('[name="email"]').attr({'data-last-val': data.data.result.data});
                    }
                    closeLine(line);
                }else if(!data.success){
                    handleErrors(data,targeted_form.attr('id'));
                }
                return false;
            }
        }, form.attr('id'));
    }

    email_obj.data = collectData(form);
    $.ajax(email_obj);
}

function default_trigger_handler (form) {
    if(typeof default_obj != 'object'){
        default_obj = new $.ajax_prototype({
            'type': 'post',
            'url' : form.attr('action'),
            'success': function (data) {
                default_request_callback(data);
            }
        });
    }

    default_obj.data = {
        '_token'        : form.find('[name="_token"]').val(),
        'action'        : form.find('[name="action"]').val(),
        'is_default'    : $('#default-trigger').prop('checked')
    };

    $.ajax(default_obj);
}

function default_request_callback (data) {
    if(!data.success){
        trigger = $('#default-trigger');
        trigger.prop({'checked':!trigger.prop('checked')});
        handleErrors(data,form.attr('id'));
    }
}