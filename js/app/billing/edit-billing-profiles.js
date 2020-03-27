$(document).ready(function(){
    createHandlerConfig();

    mustInform = {
        'noRegistryConection' : true
    };

    $(document)
        .on('click','#active-trigger:not(:disabled)',function(){
            active_status_trigger_handler ($(this).closest('form'))
        })
        .on('click','#default-trigger:not(:disabled)',function(){
            default_flag_trigger_handler ($(this).closest('form'))
        });

    $('.edit_btn ').on('click',function(e){
        e.preventDefault();
        form = $(this).closest('.item').find('form');
        if(!form.hasClass('under_validation')){
            form.prepare_form_advanced(assignCallbackFunction(form));
        }
    });

    $('#vat_recheck').on('click',function(e){
        e.preventDefault();
        send_vat_recheck_request ($(this).closest('form'))
    });
    $('#vat_approve').on('click',function(e){
        e.preventDefault();
        send_vat_approve_request($(this).closest('form'))
    });
    $('#vat_waived_status').apply_chosen();

    $('#infoModal').find('.button').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        obj.find('.submitText').hide();
        obj.find('.loading').show();

        location.replace(obj.attr('href'));
    });

    $.extend({
        'edit_billing_profiee' : {
            titleFormValidationCallback : titleFormValidationCallback,
            doyFormValidationCallback : doyFormValidationCallback,
            activityFormValidationCallback : activityFormValidationCallback,
            handleErrors : handleErrors
        }
    });

    setFieldsVersionControl($('.content_form form'));

    channel.billing.bind('App\\Events\\Billing\\InvoiceProfileWasUpdated', function(data) {
        profile = data.billingProfileParsed;

        if($('[data-profile-id]').attr('data-profile-id') != profile.id)
            return ;

        label = $('.content_static .data-label');
        visibleLoaders = $('.loader_block:visible');

        if(profile.country.iso_2 == 'GR') {
            if(visibleLoaders.length)
                $('.registryDependent').toggle();

            label.filter('[data-about="name"]').set_text(profile.name);

            $('.top-header h2').set_text(profile.name);

            label.filter('[data-about="title"]').set_text(profile.title);
            label.filter('[data-about="doy"]').set_text(profile.doy.display);

            if($('.inner-header').length < 1){
                $('.panel.white').prepend('<div class="inner-header"><h3></h3></div>');
            }

            title = $('.inner-header h3');

            if(profile.title)
                title.set_text(profile.title);
            else
                title.set_text(profile.name);

            title.removeClass('saving');

            label.filter('[data-about="activity"]').set_text(profile.activity.display);
            $('[data-about="address"]').set_text(profile.address);
            $('[data-about="city"]').set_text(profile.zip.display);

            $('#name').val(profile.name).attr({'data-last-val': profile.name});
            $('#title').val(profile.title).attr({'data-last-val': profile.title});
            $('#doy_name').val(profile.doy.data.name).attr({'data-last-val': profile.doy.data.name});
            $('#doy_code').val(profile.doy.data.code).attr({'data-last-val': profile.doy.data.code});
            $('#activity_name').val(profile.activity.data.name).attr({'data-last-val': profile.activity.data.name});
            $('#activity_code').val(profile.activity.data.code).attr({'data-last-val': profile.activity.data.code});
            $('#zip').val(profile.zip.data).attr({'data-last-val': profile.zip.data});
            $('#address').val(profile.address).attr({'data-last-val': profile.address});
            $('#city').val(profile.city).attr({'data-last-val': profile.city});

            $('#deleteModal #target').html($bill_notice + ' <strong>' + profile.name + '</strong> ' + $bill_notice_with_id + ': <strong>' + $('[data-profile-id]').attr('data-profile-id') + '</strong>');
        }else{
            if(visibleLoaders.length)
                $('.vies_registryDependent').toggle();

            viewsDisp = label.filter('[data-about="vies_response"]');
            viewsDisp.html('');
            $.each(profile.vies_response,function(key,value){
                if(value == true)
                    value = 'true';
                else if(value == false)
                    value = 'false';

                viewsDisp.append('<span>' + key + ':' + value + '</span>');
            })
        }

        if('taxis_status' in profile){
            if(profile['taxis_status'] == 1){
                $('#vat_recheck').show();
                $('#vat_approve').hide();
            }else{
                $('#vat_recheck,#vat_approve').show();
            }
        }

        $('.label.vat_status').hide();
        $('.label.vat_status[data-about="' + profile.taxis_status + '"]').show();
        $('#taxis_status').chosen_update(profile.taxis_status).attr({'data-last-val':profile.taxis_status});
        $('#vat_recheck').show();

        $('.edit_btn').show();
        makeHoverable('.edit_btn');

        var status = $('#status_container .label');

        if ('profile_status' in profile) {
            if (profile.profile_status == 1)
                status.removeClass('error').addClass('success').translate('billing.status.success');
            else
                status.removeClass('success').addClass('error').translate('billing.status.error');
        }
        

        var today = new Date(),
            date = today.getDate(),
            month = today.getMonth() + 1;

        if (data < 10)
            date = '0' + date;

        if (month < 10)
            month = '0' + month;

        $('#date_updated_container .number').text(date + '/' + month + '/' + today.getFullYear());
    });

    channel.billing.bind('App\\Events\\Billing\\InvoiceProfileWasDeleted', function(data) {
        if($('[data-profile-id]').attr('data-profile-id') != data.profileId)
            return ;

        if(typeof data.msg != 'string' && !('error' in data.msg))
            return ;

        var modal = $('#infoModal');
        modal.find('.modal-content p').text(data.msg.error);
        modal.find('.orange').toggleClass('orange red').text(APP_LANG.MISC.ERROR);
        modal.modal_open();
    });

    channel.billing.bind('App\\Events\\Billing\\RegistryConnectionFailed', function(data) {
        if(mustInform.noRegistryConection){
            mustInform.noRegistryConection = false;
            $.alertHandler('',data.msg,alert_box_failure);
        }
    });
});

/**
 * Handle all the error in this page.
 * @param data
 * @param formId
 */
function handleErrors(data, formId){
    $.disable_gdpr_mopdal(data);

    switch (data.code){
        case error_codes.validation_error                   : { //100
            $.displayErrors(formId,data.data);
            break;
        }
        case error_codes.billing_not_found                  : {//3000
            billingProfileNotFound(data.msg);
            break;
        }
        case error_codes.billing_set_default_not_allowed    : {//3002
            billingProfileSetDefaultProhibited(data.msg);
            break;
        }
        default: {
            globalApplicationErrors(data, formId)
        }
    }
}

function default_flag_trigger_handler (form) {
    formId = form.attr('id');

    if(typeof defaultObj != 'object'){
        defaultObj = new $.ajax_prototype({
            'type':'post',
            'url':form.attr('action'),
            'success':function(data){
                default_flag_request_callback(data, form);
            }
        });
    }

    defaultObj.data = {
        '_token'        : form.find('[name="_token"]').val(),
        'action'        : form.find('[name="action"]').val(),
        'is_default'    : form.find('.default-trigger').is(':checked')
    };

    $.ajax(defaultObj);
}

function default_flag_request_callback (data, form) {
    if(!data.success) {
        handleErrors(data,form.attr('id'));
        $('#default-trigger').prop({'checked': !$('#default-trigger').prop('checked')});
    }else{
        var vat = data.data.result.vat_settings;

        if(vat.vat_waived){
            $('[value="no-Vat"],[value="sid-no-Vat"]').prop('checked', true);
            $('[name="Vat"],[name="sid-Vat"]').disabled(true);
            $('.billing-profile-vat').show().find('.vat-widget-notice').hide().filter('#vatWaivedNotice').show()
        }else{
            $('[name="Vat"],[name="sid-Vat"]').disabled(false);
            $('.vat-widget-notice').hide();
            $('#vatNotice').show();

            if($('[value="no-Vat"]').prop('checked')){
                $('.billing-profile-vat').hide();
            }else{
                $('.billing-profile-vat').show();
            }
        }

        $('.vatNoticeRate').text(vat.rate);
        $('.vatNoticeCountry').text(vat.country_name);
        $('.vatNoticeProfileName').text(vat.name);

        $('.billing-profile-vat a').attr('href', vat.route);
    }
}

function active_status_trigger_handler (form) {
    formId = form.attr('id');

    if(typeof activeObj != 'object')
        activeObj = new $.ajax_prototype({
            'type':'post',
            'url':form.attr('action'),
            'success':function(data){
                active_status_request_callback (data, form);
            }
        });


    activeObj.data = {
        '_token' : form.find('[name="_token"]').val(),
        'action' : form.find('[name="action"]').val(),
        'status' : (!form.find('.active-trigger').is(':checked') ? -1 : 1)
    };

    $.ajax(activeObj);
}

function active_status_request_callback (data, form) {
    if(!data.success) {
        handleErrors(data,form.attr('id'));
    }else{
        if(!$('#active-trigger').prop('checked')){
            $('#default-trigger').prop({'checked':false,'disabled':true});
        }else{
            $('#default-trigger').prop({'disabled':false});
        }
    }
}

function send_vat_recheck_request (form) {
    if(typeof recheck_obj != 'object'){
        recheck_obj = new $.ajax_prototype({
            'type'          : 'post',
            'url'           : form.attr('action'),
            'beforeSend'    : function(){
                killDisplays(true);
                $('.opened .cancel').click();
            },
            'success'       : function(data){
                vat_recheck_request_callback (data, form);
            }
        });
    }
    recheck_obj.data = form.serialize();
    $.ajax(recheck_obj);
}

function vat_recheck_request_callback (data, form){
    if(data.success){
        $('.vat_status, #vat_recheck, .edit_btn').hide();
        $('.vat_status.pending').show();
        $('.item:has(.edit_btn)').addClass('non-hover');
        if($('#country').val() == 'Greece'){
            if($('.loader_block:hidden').length) {
                $('.registryDependent').toggle();
            }
            $('.inner-header h3').addClass('saving').html($('.loader_block p').html());
        }else{
            if($('.loader_block:hidden').length) {
                $('.vies_registryDependent').toggle();
            }
        }
    }else if(!data.success){
        if(data.code == error_codes.sql_error || data.code == error_codes.billing_not_found){
            $.alertHandler('',data.msg,alert_box_failure);
        }else{
            $.alertHandler('',APP_LANG.MESSAGES.ERROR,alert_box_failure);
        }
    }else{
        $.alertHandler('',APP_LANG.MESSAGES.ERROR,alert_box_warning);
    }
}

function send_vat_approve_request(form){
    if(typeof approve_obj != 'object'){
        approve_obj = new $.ajax_prototype({
            'type'          : 'post',
            'url'           : form.attr('action'),
            'beforeSend'    : function(){
                killDisplays(true);
                $('.opened .cancel').click();
            },
            'success'   : function(data){
                vat_approve_request_callback (data);
            }
        });
    }
    approve_obj.data = form.serialize();
    $.ajax(approve_obj);
}

function vat_approve_request_callback (data) {
    if(data.success){
        if(data.data.result != null) {
            status = data.data.result.taxis_status.data;
            $('.vat_status').hide().filter('[data-about="' + status + '"]').show();
            $('#taxis_status').attr({'data-last-val': status});
            $('.edit_btn,#vat_recheck').show();
            if($('.loader_block:visible').length) {
                if($('#country').val() == 'Greece') {
                    $('.registryDependent').toggle();
                    if($('.data-label[data-about="title"]').text() != '-'){
                        $('.inner-header h3').text($('.data-label[data-about="title"]').text());
                    }else{
                        $('.inner-header h3').text($('.data-label[data-about="name"]').text());
                    }
                }else {
                    $('.vies_registryDependent').toggle();
                }
            }
            $('#vat_approve').hide();
            $('#vat_recheck').show();
        }
    }else{
        $.alertHandler('',APP_LANG.MESSAGES.ERROR,alert_box_warning);
    }
}

/**
 * Return the correct validation callback for each form when the form is first open.
 * @param form
 * @returns {Function}
 */
function assignCallbackFunction(form){
    switch(form.attr('id')){
        case('set_name_form'):
        case('set_title_form'):
        case('doy_form'):
        case('activity_form'):
        case('address_form'):{
            return {
                onSuccess   : function(){
                    openGDPRApprovalModal(form);
                },
                handlers    : '.billing-edit',
                disable     : '.billing-edit'
            }
        }
        case('vat_waived_form'):{
            return {
                onSuccess   : function(){
                    vatWaivedFormValidationCallback(form);
                },
                handlers    : '.billing-edit',
                disable     : '.billing-edit'
            }
        }
        case('erp_form'):{
            return {
                onSuccess   : function(){
                    erpFormValidationCallback(form);
                },
                handlers    : '.billing-edit',
                disable     : '.billing-edit'
            }
        }
    }
}

/**
 * Send set title request
 * @param form
 */
function titleFormValidationCallback(form){
    if(typeof title_Obj != "object"){
        title_Obj = new $.ajax_prototype({
            'type'  : 'post',
            'url'   : editUrl,
            'success' : function(data){
                if(data.success) {
                    if(data.code != error_codes.no_change && data.code == error_codes.billing_profile_updated){
                        $('.content_static [data-about="title"], .panel h3').set_text(data.data.result.title.data);
                        $('.content_form [name="title"]').attr({'data-last-val': data.data.result.title.data});
                    }
                    closeLine(line);
                }else if(!data.success){
                    handleErrors(data,form.attr('id'));
                }
            }
        }, form.attr('id'));
    }
    title_Obj.data = collectData(form);
    $.ajax(title_Obj);
}

/**
 * Send vat waived request
 * @param form
 */
function vatWaivedFormValidationCallback(form){
    if(typeof waived_Obj != "object"){
        waived_Obj = new $.ajax_prototype({
            'type'  : 'post',
            'url'   : editUrl,
            'success' : function(data){
                if(data.success) {
                    if(data.code != error_codes.no_change && data.code == error_codes.billing_profile_updated){
                        $('.waived_status').hide();
                        $('.content_static .waived_status[data-about="' + data.data.result.vat_waived.data + '"]').show();
                        $('#vat_waived_status').attr({'data-last-val':data.data.result.vat_waived.data});
                    }
                    closeLine(line);
                }else if(!data.success){
                    handleErrors(data,form.attr('id'));
                }
            }
        }, form.attr('id'));
    }
    waived_Obj.data = collectData(form);
    $.ajax(waived_Obj);
}

/**
 * Send set doy request
 * @param form
 */
function doyFormValidationCallback(form){
    if(typeof doy_Obj != "object"){
        doy_Obj = new $.ajax_prototype({
            'type'  : 'post',
            'url'   : editUrl,
            'success' : function(data){
                if(data.success) {
                    if(data.code != error_codes.no_change && data.code == error_codes.billing_profile_updated){
                        $('.content_static [data-about="doy"]').set_text(data.data.result.doy.display);
                        $('.content_form [name="doy"]').attr({'data-last-val' : data.data.result.doy.data.doy});
                        if('doy_code' in data.data.result.doy.data) {
                            $('.content_form [name="doy_code"]').attr({'data-last-val': data.data.result.doy.data.doy_code});
                        }
                    }
                    closeLine(line);
                }else if(!data.success){
                    handleErrors(data,form.attr('id'));
                }
            }
        }, form.attr('id'));
    }
    doy_Obj.data = collectData(form);
    $.ajax(doy_Obj);
}

/**
 * Send set activity request
 * @param form
 */
function activityFormValidationCallback(form){
    if(typeof activity_Obj != "object"){
        activity_Obj = new $.ajax_prototype({
            'type'  : 'post',
            'url'   : editUrl,
            'success' : function(data){
                if(data.success) {
                    if(data.code != error_codes.no_change && data.code == error_codes.billing_profile_updated){
                        $('.content_static [data-about="activity"]').set_text(data.data.result.activity.display);
                        $('.content_form [name="activity_name"]').attr({'data-last-val' : data.data.result.activity.data.activity_name.data});
                        if('activity_code' in data.data.result.activity.data){
                            $('.content_form [name="activity_code"]').attr({'data-last-val': data.data.result.activity.data.activity_code.data});
                        }
                    }
                    closeLine(line);
                }else if(!data.success){
                    handleErrors(data,form.attr('id'));
                }
            }
        }, form.attr('id'));
    }
    activity_Obj.data = collectData(form);
    $.ajax(activity_Obj);
}

/**
 * Send set erp request.
 */
function erpFormValidationCallback(form){
    if(typeof erp_Obj != "object"){
        erp_Obj = new $.ajax_prototype({
            'type'  : 'post',
            'url'   : editUrl,
            'success' : function(data){
                if(data.success) {
                    if(data.code != error_codes.no_change && data.code == error_codes.billing_profile_updated){
                        $('.content_static [data-about="erp"]').set_text(data.data.result.erp_id.data);
                        $('.content_form [name="erp_id"]').attr({'data-last-val': data.data.result.erp_id.data});
                    }
                    closeLine(line);
                }else if(!data.success){
                    handleErrors(data,form.attr('id'));
                }
            }
        }, form.attr('id'));
    }
    erp_Obj.data = collectData(form);
    $.ajax(erp_Obj);
}