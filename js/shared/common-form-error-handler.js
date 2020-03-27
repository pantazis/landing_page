$(document).ready(function(){
    use_global_handler = true;

    $.fn.extend({
        displayIndividualErrors : function (error){
            displayIndividualInputErrors($(this), error);
            return this;
        }
    });

    $.extend({
        alertHandler            : function (formid, mssg, alertType, data, error_code, outerShutter) {
            var cartDomainAlertCont = $('#errorDomains');

            if(cartDomainAlertCont.length) {
                cartDomainAlertCont.hide();

                if(typeof cartDomainAlert != 'undefined')
                    clearTimeout(cartDomainAlert);
            }

            alert['formid']         = formid;
            alert['mssg']           = mssg;
            alert['alert']          = alertType;
            alert['error_code']     = error_code;
            alert['data']           = data;
            alert['outerShutter']   = (outerShutter) ? outerShutter : false;

            killDisplays('', error_code);
            return false;
        },
        displayErrors           : function (formid,data) {
            displayErrorInputMessages(formid,data)
        },
        closeDisplays           : function () {
            killDisplays(true);
        }
    });

    $(function () {
        // Locks the tab jump on inputs. Press Tab to jump forward and Shift+Tab to jump backwards
        // gather all inputs of selected types
        var inputs = $('input, textarea, text, button'), inputTo;

        // bind on keydown
        inputs.on('keydown', function (e) {
            var targets = $('input:visible:not(:disabled), textarea'), inputTo;

            // if we pressed the tab
            if (e.keyCode == 9 || e.which == 9) { // prevent default tab action
                e.preventDefault();
                if (e.shiftKey) { // get previous input based on the current input
                    inputTo = targets.get(targets.index(this) - 1);
                } else { // get next input based on the current input
                    inputTo = targets.get(targets.index(this) + 1);
                }
                // move focus to inputTo, otherwise focus first input
                if (inputTo) {
                    inputTo.focus();
                } else {
                    targets[0].focus();
                }
            }
        });
    });

    $(document).on('change', '.gdpr_approvals', function () {
        if ($('.gdpr_approvals:checked').length)
            $('#login_btn').removeClass('disabled');
        else
            $('#login_btn').addClass('disabled');
    });


});

var custom_selectors_apply  = {},
    common_error_modal      = '<div id="errorModal" class="reveal-modal tiny" data-reveal aria-labelledby="" role="" data-options="close_on_background_click:false; close_on_esc:false;" style="display: none"><div class="row collapse"><div class="small-12 columns"><p id="errorModalTitle" class="lead red"></p></div></div><div class="modal-content"><div class="row"><div class="small-12 columns"><p id="errorModalContent"></p></div></div></div></div>',
    gdpr_built = false;

alert_box_failure           = "alert";
alert_box_warning           = "warning";
alert_box_success           = "success";

alert_visibility_duration   = 11000;

alert_help_box              = '<div class="alert-box help-block alert"></div>';

/**
 * Coordinate error handling.
 */
function globalErrorsHandler(x, modalError){
    if(x.readyState == 0){
        connectionErrors(x.statusText, modalError);
    }else if(x.readyState == 4){
        if(x.status != 200){
            httpErrors('http' + x.status);
        }
    }
}

/**
 * Handle errors about the connection.
 * @param statusText
 */
function connectionErrors(statusText, modalError){
    switch (statusText){
        case 'timeout':{
            if(typeof modalError != 'undefined' && modalError === true)
                openModalError(function (modal){
                    modal.find('#errorModalTitle').text(APP_LANG.MESSAGES.TIMEOUT_UNRECOVERABLE.TITLE);
                    modal.find('#errorModalContent').html(APP_LANG.MESSAGES.TIMEOUT_UNRECOVERABLE.CONTENT);
                });
            else
                $.alertHandler('',APP_LANG.MESSAGES.TIMEOUT,alert_box_failure, '', 'timeout');
            break;
        }
        default:{
            $.alertHandler('',APP_LANG.MESSAGES.ERROR,alert_box_failure, '', 'default');
        }
    }
}

/**
 * Handle http errors
 */
function httpErrors(error_code){
    $.alertHandler('',APP_LANG.MESSAGES.ERROR,alert_box_failure, '', error_code);
}

function openModalError (callback) {
    if(typeof callback != 'function')
        throw 'Callback function is not defined';

    $('body').append(common_error_modal);

    var modal = $('#errorModal');

    try{
        modal.modal_open()
    }catch($err){}

    callback(modal);
}

/**
 * Handle application generated errors.
 * @param response
 */
function globalApplicationErrors(response, formId, custom_selectors){
    if(typeof custom_selectors == 'object'){
        $.extend(custom_selectors_apply, custom_selectors)
    }

    if(typeof response == 'object' && 'success' in response && !response.success){
        switch (response.code){
            case error_codes.validation_error                                           : { //100
                $.displayErrors(formId, response.data);
                break;
            }
            case error_codes.sql_error                                                  : //120
            case error_codes.update_db_error                                            : //126
            case error_codes.delete_db_error                                            : { //127
                $.alertHandler('',response.msg,alert_box_failure);
                break;
            }
            case error_codes.unrecognized_action                                        : { //150
                $.alertHandler('',APP_LANG.MESSAGES.ERROR,alert_box_failure);
                break;
            }
            case error_codes.action_not_allowed                                         : //151
            case error_codes.insufficient_permissions                                   : { //175
                $.alertHandler('',response.msg,alert_box_failure);
                break;
            }
            case error_codes.session_error                                              : { //400
                // location.reload(true);
                break;
            }
            case error_codes.session_active                                             : { //402
                document.location.reload(true);
                break;
            }
            case error_codes.ip_blacklisted                                             : { //403
                $.alertHandler('',response.msg,alert_box_failure);
                break;
            }
            case error_codes.login_failed                                               : { //2000
                $.alertHandler(formId,response.msg,alert_box_failure);
                break;
            }
            case error_codes.two_factor_auth                                            : { //2004
                $.alertHandler('',response.msg,alert_box_warning);
                break;
            }
            case error_codes.account_auto_suspended                                     : //2010
            case error_codes.account_suspended                                          : { //2011
                current_location = window.location.href;
                if(checkIfLocationIsBackend(current_location)){
                    if((/\//g).test(current_location)){
                        $.set_cookie('errorCode',[response.msg,response.success],'/')
                    }else{
                        $.alertHandler('',response.msg,alert_box_failure,response.data);
                    }
                }else{
                    $.alertHandler('',response.msg,alert_box_failure,response.data);
                }
                break;
            }
            case error_codes.registry_maintenance                                       : //26000
            case error_codes.domain_is_not_valid                                        : //30009
            case error_codes.domain_check_failed                                        : //30010
            case error_codes.domain_info_failed                                         : //30013
            case error_codes.domain_does_not_exist                                      : //30014
            case error_codes.invalid_domain_cant_be_registered                          : //30019
            case error_codes.domain_max_length_reached                                  : //30020
            case error_codes.domain_registrant_is_dnhost                                : //30021
            case error_codes.invalid_epp_auth                                           : //30022
            case error_codes.domain_not_registered_cant_be_transferred_not_registered   : //30023
            case error_codes.can_not_get_premium_quote                                  : //30024
            case error_codes.domain_register_failed                                     : //30025
            case error_codes.domain_not_registered_cant_be_transferred_syntax_error     : //30026
            case error_codes.domain_not_registered_cant_be_transferred_tld_unsupported  : //30027
            case error_codes.domain_check_renew_with_auto_renew_failed                  : { //30034
                $.alertHandler(formId,response.msg,alert_box_failure);
                break;
            }
            case error_codes.cart_item_not_found                                        : { //35001
                cartItemNotFound(response);
                break;
            }
            case error_codes.cart_action_exception                                      : //35003
            case error_codes.item_already_in_cart                                       : //35004
            case error_codes.cart_option_error                                          : //35006
            case error_codes.cart_attribute_error                                       : //35007
            case error_codes.domain_already_in_cart                                     : //35008
            case error_codes.parent_child_does_not_exist                                : //35009
            case error_codes.item_cant_be_child                                         : //35010
            case error_codes.item_associated_as_child                                   : //35011
            case error_codes.get_domain_info_failed                                     : //35013
            case error_codes.cart_not_associated_with_billing_profile                   : //35015
            case error_codes.domain_check_failure                                       : { //35018
                $.alertHandler(formId,response.msg,alert_box_failure);
                break;
            }
            case error_codes.cart_item_attributes_missing                               : { //35022
                $.alertHandler(formId,response.msg,alert_box_failure);
                break;
            }
            case error_codes.cart_extension_error                                       : { //35024
                $.alertHandler(formId,response.msg,alert_box_failure);
                break;
            }
            case error_codes.certificate_auto_reorder_failed                            : { //39786
                $.alertHandler('',response.msg,alert_box_failure);
                break;
            }
            case error_codes.certificate_out_of_renew_period                            : { //39791
                $.alertHandler('',response.data,alert_box_failure);
                break;
            }
            case error_codes.ssl_store_in_maintenance                                   : { //39792
                $.alertHandler('',response.data,alert_box_failure);
                break;
            }
            case error_codes.profile_required_gdpr_approval                             : { //43005
                loginGdprApprovalRequired(response);
                break;
            }
            case error_codes.token_error                                                : { //49500
                location.reload(true);


                // $('[name="_token"]').val(response.data['_token']).closest('form').enable_form_controls();
                // $('.submitText').show();
                // $('.loading').hide();
                break;
            }
            case error_codes.network_connection_error                                   : { //49997
                $.alertHandler('',response.msg,alert_box_failure);
                break;
            }
            case error_codes.access_denied                                              : { //100000
                document.location.href = response.data;
                break;
            }
                
            default:{
                $.alertHandler('',(response.msg) ? response.msg : APP_LANG.MESSAGES.ERROR,alert_box_failure);
            }
        }
    }else{
        $.alertHandler('',APP_LANG.MESSAGES.ERROR,alert_box_failure);
    }

    var gdprModal = $('#gdpr_approval_modal');

    if (gdprModal.length ) {
        $('#gdpr_approval_modal .disabled').removeClass('disabled');

        var modal_bg = $('.reveal-modal-bg');

        modal_bg.css('z-index', modal_bg.attr('data-init-index'));

        var loader_cont = gdprModal.find('.loader_cont');

        loader_cont.find('.submitText').show();
        loader_cont.find('.loading').hide();
    }
}

function creditDocumentApplicationErrors(response, formId) {
    switch(response.code){
        case error_codes.credit_action_not_found:                           //35700
        case error_codes.credit_document_not_found:                         //35701
        case error_codes.credit_status_not_permitted:                       //35702
        case error_codes.credit_paying_not_allowed_by_status:{              //35703
            $.alertHandler('', response.msg, alert_box_failure);
        }
        default :{
            billingDocumentsApplicationErrors(response, formId);
            break;
        }
    }
}

function billingDocumentsApplicationErrors(response, formId){
    switch(response.code){
        case error_codes.user_credit_exhausted                              : //2104
        case error_codes.sale_document_update_exception                     : //35500
        case error_codes.sale_document_not_found                            : //35502
        case error_codes.due_status_does_not_allow_payment                  : //35503
        case error_codes.due_type_does_not_allow_payment                    : //35504
        case error_codes.paying_document_status_does_not_allow_payment      : //35505
        case error_codes.paying_document_type_does_not_allow_payment        : //35506
        case error_codes.due_document_balance_already_paid                  : //35507
        case error_codes.paying_document_balance_is_zero                    : //35508
        case error_codes.document_action_not_permitted                      : //35510
        case error_codes.requested_task_not_allowed                         : //35511
        case error_codes.document_status_not_permitted                      : //35512
        case error_codes.document_balance_total_difference                  : //35513
        case error_codes.no_due_document_defined                            : //35514
        case error_codes.no_paying_document_defined                         : //35515
        case error_codes.balance_must_be_zero_or_equal                      : //35516
        case error_codes.undefined_document_status                          : //35517

        case error_codes.order_not_found                                    : //35601
        case error_codes.order_item_pending_process_after                   : //35602
        case error_codes.order_item_expired                                 : //35603
        case error_codes.order_requested_status_not_executable              : //35604

        case error_codes.invoice_billing_profile_missing                    : //35601
        case error_codes.invoice_must_be_requested_by_order                 : //35602
        case error_codes.invoice_already_exists_for_this_document           : //35603

        case error_codes.credit_action_not_found                            : //35700
        case error_codes.credit_document_not_found                          : //35701
        case error_codes.credit_status_not_permitted                        : //35702
        case error_codes.credit_paying_not_allowed_by_status                : //35703
        case error_codes.debit_status_does_not_allow_cancel                 : { //35802
            $.alertHandler('', response.msg, alert_box_failure);
            break;
        }
        default :{
            globalApplicationErrors(response, formId);
            break;
        }
    }
}

function masterDocumentsApplicationErrorsHandler(response, formId){
    switch(response.code){

        /*
        |--------------------------------------------------------------------------
        | Documents General Errors
        |--------------------------------------------------------------------------
        */
        case error_codes.sale_document_update_exception:                    //35500
        case error_codes.sale_document_not_found:                           //35502
        case error_codes.due_status_does_not_allow_payment:                 //35503
        case error_codes.due_type_does_not_allow_payment:                   //35504
        case error_codes.paying_document_status_does_not_allow_payment:     //35505
        case error_codes.paying_document_type_does_not_allow_payment:       //35506
        case error_codes.due_document_balance_already_paid:                 //35507
        case error_codes.paying_document_balance_is_zero:                   //35508
        case error_codes.document_action_not_permitted:                     //35510
        case error_codes.document_status_not_permitted:                     //35512
        case error_codes.document_balance_total_difference:                 //35513

        /*
        |--------------------------------------------------------------------------
        | Credit Adjustment General Errors
        |--------------------------------------------------------------------------
        */
        case error_codes.credit_action_not_found:                           //35700
        case error_codes.credit_document_not_found:                         //35701
        case error_codes.credit_status_not_permitted:                       //35702
        case error_codes.credit_paying_not_allowed_by_status:{              //35703
            $.alertHandler('', response.msg, alert_box_failure);
            break;
        }
        default :{
            globalApplicationErrors(response, formId);
            break;
        }
    }
}

function enableGlobalHandler(){
    use_global_handler = true;
}

function disableGlobalHandler(){
    use_global_handler = false;
}


/**
 * Specified errors handlers START
 */

    /**
     * Error codes 101. Handle the invalid verification error for email/phone verification process.
     * @param formId
     * @param msg
     */
    function userProfileVerificationCodeError(formId,msg){
        $.displayErrors(formId,{'verification_code':msg});
    }

    /**
     * Error codes 1060, 1061. Handle the errors returned while attempting to validate invalid target.
     * @param formId
     * @param msg
     */
    function verificationTargetErrors(formId, msg, success){
        if(success){
            $.alertHandler(formId,msg,alert_box_success);
        }else{
            $.alertHandler(formId,msg,alert_box_failure);
        }
    }

    /**
     * Error codes 1062, 1063, 1064, 1065. Handle the errors returned during email/phone verification process.
     * @param formId
     * @param msg
     */
    function userProfileVerificationErrors(formId,msg){
        $.alertHandler(formId,msg,alert_box_failure);
    }

    /**
     * Error codes 2000. Handle the error return when user not found during password reset.
     * @param formId
     * @param msg
     * @param data
     */
    function passResetUserNotFound(formId, msg, data){
        $.alertHandler(formId, msg, alert_box_failure, data);
    }

    /**
     * Error codes 2001. Handle the errors returned from user verifcation during email/phone verification or delete pending.
     * @param formId
     * @param msg
     */
    function unauthorisedEmailError(formId,msg){
        $.alertHandler(formId,msg,alert_box_failure);
    }

    /**
     * Error code 2005. Two factor auth failed on reset password.
     */
    function resetPassTwoFactorFailed(){
        $('.step:visible').hide();
        $('#reset-view3,#failed-auth').show();
        formId = $('.step:visible form').attr('id');

        $('#btn-method-skip').text(COMMON_LANG.BUTTONS.RESET_NO_ACCESS).addClass('button expand warning').removeClass('link').blur();
        initializeNextForm();
    }

    /**
     * Error codes 2100. Handle the errors returned during the verification with the current password.
     * @param formId
     * @param msg
     */
    function passwordVerificationErrors(formId,msg){
        $.alertHandler(formId,msg,alert_box_failure);
    }

    /**
     * Error codes 2101. Handle the errors returned during the set reset with mobile feature.
     * @param formId
     * @param msg
     */
    function setMobileResetErrors(formId,msg){
        $.alertHandler(formId,msg,alert_box_failure);
    }

    /**
     * Error code 2163. The used reset option is not valid.
     * @param msg
     */
    function invalidResetOption(msg){
        $.alertHandler('',msg,alert_box_warning);
    }

    /**
     * Error codes 3000. The user attempted to change a billing profile that was deleted.
     * @param msg
     */
    function billingProfileNotFound(msg){
        $('#infoModal').modal_open().find('.modal-content p').text(msg);
    }

    /**
     * Error coded 3002. The billing profile setdefault action is disabled.
     * @param msg
     */
    function billingProfileSetDefaultProhibited(msg){
        $.alertHandler('',msg,alert_box_failure);
    }

    /**
     * Error codes 7503. Contact profile not found error.
     * @param msg
     */
    function contactProfileNotFound(msg){
        $('#infoModal').modal_open().find('.modal-content p').text(msg);
    }

    /**
     * Error codes 7530. Individual's contact profile name does not match.
     * @param msg
     */
    function individualTypeNameMismatch(given_name){
        $('[name="first_name_int_ind"]').show_validation_error(given_name);
        $('[name="last_name_int_ind"]').show_validation_error(given_name);
    }

    function cartItemNotFound (response) {
        var not_found   = response.data.not_found,
            item        = $('.item[data-cart-item-id="' + not_found + '"]'),
            prices_box  = $('.prices-box'),
            domain      = $('.tldResults[data-cart-item-id="' + not_found + '"], .singleResult[data-cart-item-id="' + not_found + '"]');

        $.cart.remove(not_found);

        if(item.length)
            item.remove();

        if(prices_box.length){
            $('#order').text($.imperial_to_metric(response.data.check_out.totals.sub_total));
            $('#order_vat').text($.imperial_to_metric(response.data.check_out.totals.vat));
            $('#order_total').text($.imperial_to_metric(response.data.check_out.totals.grand_total));
        }

        if(domain.length)
            domain.find('.cart-button, .singleButtonTarget').removeClass('selected');

        if ($('.panel.specs').length) {
            $.alertHandler('',response.msg,alert_box_failure);
        }
    }

    function loginGdprApprovalRequired () {
        var form = $('#form-login-modal, #form-login');

        $('#inputs_cont, #newsletter_cont, #agreement_cont, #agreement_list_cont, #explanation_cont, #info_cont').remove();

        form.find('#email, #password').closest('.row').hide();

        form.prepend('<div id="inputs_cont"> \n' +
            '<input id="communication_agreement" name="communication_agreement" type="hidden" value="1"> \n' +
            '<input id="data_validity" name="data_validity" type="hidden" value="1"> \n' +
            '<input id="processing_approval" name="processing_approval" type="hidden" value="1"> \n' +
            '<input id="newsletter_hidden" name="newsletter" type="hidden" value="0"> \n' +
            '</div>');

        form.prepend('<div id="newsletter_cont" class="row">\n' +
            '            <div class="large-12 columns agree-terms">\n' +
            '                <div class="checkbox">\n' +
            '                    <label class="text-left">\n' +
            '                        <input id="newsletter_dial" name="newsletter_dial" type="checkbox" value="1">\n' +
            '                        <span class="checkbox__label">' + $.translate('gdpr.login.newsletter_label') + '</span>\n' +
            '                    </label>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>');

        form.prepend('<div id="agreement_cont" class="row">\n' +
            '            <div class="large-12 columns agree-terms">\n' +
            '                <div class="checkbox">\n' +
            '                    <label class="text-left">\n' +
            '                        <input id="agreement" class="gdpr_approvals" data-validate="terms_and_conditions" data-validate-error-msg="' + $.translate('gdpr.login.accept_all_above_label_error') + '" data-sibling-class="checkbox__label" name="agreement" type="checkbox" value="1">\n' +
            '                        <span class="checkbox__label">' + $.translate('gdpr.login.accept_all_above_label') + '</span>\n' +
            '                    </label>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>');

        form.prepend('<div id="agreement_list_cont" class="row">\n' +
            '            <div class="large-12 right columns">\n' +
            '                <ul class="global-list">\n' +
            '                    <li>' + $.translate('gdpr.login.processing_approval_label') + '</li>\n' +
            '                    <li>' + $.translate('gdpr.login.data_validity_label') + '</li>\n' +
            '                    <li>' + $.translate('gdpr.login.communication_agreement_label') + '</li>\n' +
            '                </ul>\n' +
            '            </div>\n' +
            '        </div>');

        form.prepend('<div id="explanation_cont">' + $.translate('gdpr.login.explanation') + '</div>');

        form.prepend('<div id="info_cont" class="alert-box info"><p class="no-margin-bottom smallest small-font"><strong>' + $.translate('gdpr.login.explanation_title') + '</strong></p></div>');

        if (window.location.href.match(/http(s)?:\/\/my/) == null) {
            // form.css({'max-height': '18rem', "overflow-y": 'scroll'});
            form.addClass('with-scroll');
            $('#explanation_cont li').css({'margin-bottom' : '0.5rem', 'line-height' : '1.3'});
        } else {
            $('#explanation_cont li').css('margin-bottom', '0.5rem');
            $('#explanation_cont ul').css('font-size', '');
        }

        $('#login_btn').translate('misc.acceptance');

        form.closest('div').find('hr:last').hide();
        $('#passResetLink').hide();

        if (gdpr_built == false) {
            $.observers.register('register_forms', function (mutations) {
                if (typeof $loginErrors == 'undefined' || $loginErrors == null) {
                    $('#inputs_cont, #newsletter_cont, #agreement_cont, #agreement_list_cont, #explanation_cont, #info_cont').remove();

                    form.find('#email, #password').val('').closest('.row').show()

                    form.closest('div').find('hr:last').show();
                    $('#passResetLink').show();

                    form.removeClass('with-scroll');

                    $('#login_btn').translate('misc.login').removeClass('disabled');
                    gdpr_built = false;
                }
            });

            $.observers.observe('register_forms', $('#register-forms, #panel1'), {attributes:true, attributeFilter:['class']});
        }

        gdpr_built = true;

        setTimeout(function () {
            $loginErrors = null;
        }, 500);
    }

/**
 * Specified errors handlers END
 */


/*
 **killDisplays**
 Closes modal after I am sure btn was clicked.
 Closes all open information messages.
 */
function killDisplays(no_trigger, error_code){
    message = $("#alertContainer");
    set_error_code = message.attr('data-error-code');

    if(set_error_code && error_code && set_error_code == error_code)
        return ;

    if(message.is(":visible")){ //If there is a visible message
        clearTimeout(timeOut); //Stops messenger time lock
        $('#alertContainer').slideUp('default',function(){
            if(!no_trigger) {
                clearAlertNotice(error_code);
            }
        });
    }else{
        if(!no_trigger) {
            clearAlertNotice(error_code);
        }
    }

    if(!no_trigger)
        $("#alertContainer").removeAttr('data-error-code');
}

/*
 **shutter**
 Closes the alert_box, on a given time/delay.
 It is called after displayAlertMessages function.
 Id demands the alert_box's Id.
 SlideUp and Delay are optional, but to set Delay you must first set SlideUp.
 */
function shutter(adelay,aslide){
    if((aslide === undefined) || (aslide == "")){aslide = 400;}
    else if(aslide == 'slow'){aslide = 800;}
    else if(aslide == 'medium'){aslide = 400;}
    else if(aslide == 'fast'){aslide = 200;}

    if((adelay === undefined) || (adelay == "")){adelay = 0;}
    else if(adelay == 'slow'){adelay = 800;}
    else if(adelay == 'medium'){adelay = 400;}
    else if(adelay == 'fast'){adelay = 200;}

    timeOut = setTimeout(function(){
        $('#alertContainer').removeAttr('data-error-code','').slideUp(aslide);
    },adelay);
}

/**
 *  This function displays the Alert message.
 *  It creates default values where it is needed.
 *  It sets the alert type of the message and appends the needed message.
 *  It displays the message and calls the shutter message.
 * @param formid
 * @param myMessage
 * @param messageType
 * @param data
 * @param outerShutter
 * @param element
 */
function displayAlertMessages (formid, myMessage, messageType, data, error_code, outerShutter, element ){
    if(alert['control']) {
        if ((outerShutter === undefined) || (outerShutter == "")) {
            outerShutter = false; //Checks if there is outer shutter
        }
        $('#message').remove();
        if ((messageType == '') || (messageType === undefined)) {
            messageType = alert_box_warning;
        }

        if ((myMessage == '') || (myMessage === undefined)) {
            myMessage = APP_LANG.MESSAGES.ERROR;
        }

        $("#alertMessage").addClass(messageType); //Sets message type
        $("#alertMessage .icon-announcement").after("<span id='message'>" + myMessage + "</span>");
        $("#alertContainer").slideDown(700);   //Opens message

        if(error_code)
            $("#alertContainer").attr('data-error-code', error_code);

        if (outerShutter == false) {
            shutter(alert_visibility_duration, 700);
        }

        $('button.disabled').removeClass('disabled', function () {
            if (((element !== undefined) || (element !== "")) && (alert == alert_box_success)) {
                $(element).remove(); //Removes selected element
            }
            if (((data === false) || (data === undefined) || (data === ""))) {
                if ((formid !== undefined) || (formid !== "")) {
                    displayErrorInputMessages(formid,data);
                }
            }
        });

        if ($.isTouch())
            $(window).scrollTop($(window).scrollTop() + 30);

        displayErrorInputMessages(formid,data);
        alertType = messageType;
    }
}

function displayErrorInputMessages(form,errorsInput){
    if(typeof errorsInput == 'undefined')
        return;

    form = $('#' + form);

    $.each(errorsInput, function (i, value) {
        if(Object.keys(custom_selectors_apply).length > 0 && i in custom_selectors_apply){
            element = custom_selectors_apply[i]();
        }else{
            element = form.find('[name="' + i + '"]');
        }

        target = false;

        if(element.length < 1){
            var elements = form.find('[name^="' + i + '."]');

            if(elements.length){
                element = elements.filter(':last');

                var parent = element.closest('.row');

                parent.after(alert_help_box);

                $(parent.parents()[0]).find('.alert-box.help-block:last').text(errorsInput[i]);
            }
            return ;
        }

        if(element.length > 1){
            element = element.filter(function () {
                var obj = $(this);

                if(obj.is('select'))
                    return $('#' + obj.attr('id') + '_chosen').css('display') != 'none';
                else
                    return obj.css('display') != 'none';
            });
        }

        if(element.is('select')){
            element.addClass('error');
            chosen = form.find('#' + element.attr('id') + '_chosen' );

            if(chosen.length) {
                target = chosen;
            }else{
                element.parent("div").find('.form-error').css({'margin-top':0});
            }
        }else{
            target = element;
        }

        if(target){
            if(typeof target == 'object')
                target = target[0];

            target = $(target);

            if (target.hasClass('switch-controller'))
                target = $('[for="' + target.attr('id') + '"]');

            if(typeof errorsInput[i] == 'string')
                target.after(helperBlock.replace('errorMessage',errorsInput[i]));
            else
                $.each(errorsInput[i], function (key, value) {
                    target.after(helperBlock.replace('errorMessage',value));
                });

            parent = target.addClass('error').parent("div");

            parent.children('label').addClass('error');

            var block = parent.find('.help-block:not(:last)');

            if(block.length){
                block.css('margin-bottom', 0);
            }
        }

        form.find('[for="' + i + '"]').addClass('error');

    });

    $('.form-error').addClass('error');
}

function displayIndividualInputErrors (element, error) {
    element.addClass('error');
    
    var chosen = $('#' + element.attr('id') + '_chosen');
    
    if(chosen.length)
        var label = chosen.addClass('error').after(helperBlock.replace('errorMessage',error)).parent("div").children('label');
    else
        label = element.after(helperBlock.replace('errorMessage',error)).parent("div").children('label');

    if(label.length < 1)
        label = $('label[for="' + element.attr('id') + '"]');

    label.addClass('error');
}

function removeErrors(){
    $(".myErrorLabel").removeClass('myErrorLabel').removeClass('error');
    $("select.error").each(function(){
        $(this).closest('div').find('[id*="_chosen"]').addClass('error');
    });
}

function clearAlertNotice(error_code){
    $('#loaderContainer').hide();
    $("#alertMessage").removeClass(alertType);
    $("#alertContainer").removeAttr('data-error-code');
    displayAlertMessages(alert['formid'], alert['mssg'], alert['alert'], alert['data'], error_code, alert['outerShutter']);
}