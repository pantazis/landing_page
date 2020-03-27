$(document).ready(function() {

    question = '';

    $('#btn-method-skip').on('click', function () {
        skipReminderStep($(this))
    });

    $('#start_over_trig').on('click', function (e) {
        e.preventDefault();

        $('.step input:not([type="hidden"])').val('');
        resetPassInitiatives();
        formId = $('.step:visible form').attr('id');

        $('#start_over').hide();
        $('.step:first,#remembered,#tokenReceived,#tokenContainer').show();

        $('#reset-forms').find('.reveal-password:has(.icon-eye)').click();
    });

    $('#remembered_trig_modal').on('click', function (e) {
        e.preventDefault();
        $('#login-contents input:not([type="hidden"]), #reset-contents input:not([type="hidden"])').val('');
        resetPassInitiatives();
        formId = $('#panel1 form').attr('id');
        $('.step, #reset-controller').hide();
        $('#login-contents').show();
        $('#start_over').hide();
        $('#remembered').hide();
    });

    $('#btn-remind-submit').on('click',function(e){
        e.preventDefault();

        var cont = $('#reset-contents, #reset-forms');
        cont.find('.error').removeClass('error');

        cont.find('form:visible:first').submit_form();
    });

    $('#form-login, #form-login-modal, [id*="form-register"]').each(function () {
        var form = $(this);

        if(form.length && !form.hasClass($.getValidationClass()))
            form.prepare_form_advanced(assignCallbackFunction(form));
    });

    $('#goToRegister').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        redirectToRegister();
    });

    if($('.reminder-page').length){
        form = $('#form-remind-options');
        form.prepare_form_advanced(assignCallbackFunction(form));
    }

    $(document)
        .on('click', '.btn-login, #icon-loginBtn, #sitemapLogin', function (e) {
            e.preventDefault();
            $.sidr('close', 'side-nav');
            openRegisterForms();
        })
        .on('click', '#sidr-id-registerBtn, #icon-registerBtn, #goToRegister', function (e) {
            e.preventDefault();

            if ($('#register-forms').length) {
                redirectToRegister();
            } else {
                $('.tabTrigger [href="#panel2"]').trigger('click');
            }
        })
        .on('click', '#sidr-id-loginBtn, #sidr-id-registerBtn', function (e) {
            e.preventDefault();

            openRegisterForms();
            $.sidr('close', 'backend-side-nav');

            if ($.md.os() == 'iOS') {
                $('#register-forms').css({
                    // 'display' : 'block',
                    // 'height' : '100%',
                    // 'width' : '100%',
                    'position' : 'fixed !important',
                    'z-index' : 10000
                });
            }
        })
        .on('click', '.tabTrigger [href="#panel2"]', function (e) {
            e.preventDefault();

            $('#all-forms').find('.reveal-password:has(.icon-eye)').click();
        })
        .on('change', '[name="newsletter_dial"]', function () {
            var obj = $(this);

            obj.closest('form').find('[name="newsletter"]').val(((obj.is(':checked'))? '1' : '0'));
        });

    $registerSteps = {
        first : $('#registerStep1')
    };

    if($registerSteps.first.length){
        $('#form-register, #form-register-modal').find('select').each(function () {
            var obj = $(this);

            obj.apply_chosen(obj.val());
        });

        $registerSteps.second = $('#registerStep2');

        step1inputs = $registerSteps.first.find('input:not(.chosen-container input), select');

        $('#country').on('change', function () {
            var value           = $(this).val(),
                stateSelect     = $('#stateSelect'),
                stateInput      = $('#stateInput');

            if(value == 'GR'){
                stateSelect.show();
                stateInput.hide();
            }else{
                stateSelect.hide();
                stateInput.show();
            }

            stateSelect.find('select').chosen_update('');
            stateInput.find('input').val('');

        });

        $registerSteps.second.find('#previous_btn').on('click', function (e) {
            e.preventDefault();

            $registerSteps.first.show().find('input:first').focus();
            $registerSteps.second.hide();
        });
    }

    var resetStep1 = $('#form-remind-options:visible');

    if(resetStep1.length){
        resetStep1.prepare_form_advanced(assignCallbackFunction(resetStep1));
    }

    $('#accountSuspendedForm').on('submit', function (e) {
        e.preventDefault();
    });

    if (typeof $loginErrors != 'undefined' && $loginErrors != null) {
        openRegisterForms();

        var form = $('#form-login-modal, #form-login');

        $.each($loginErrors.data.filled, function (name, value) {
            var obj = form.find('[name="' + name + '"]');

            obj.val(value);
        });

        globalApplicationErrors({
            'success'   : false,
            'code'      : $loginErrors.code,
            'msg'       : $loginErrors.msg,
            'data'      : $loginErrors.data.errors
        }, form.attr('id'));
    }
});

function redirectToRegister () {
    var target = $('#goToRegister').attr('href');

    if (typeof $flashOffers == 'string') {
        $('body').append('<form id="flashOffersRegisterForm" method="post" action="' + target + '">' + $('[name="_token"]')[0].outerHTML + '<input type="hidden" name="flashOffer" value="' + $flashOffers + '"></form>');
        $('#flashOffersRegisterForm').submit();
    } else {
        window.location.href = target;
    }
}

function openRegisterForms () {
    var register_forms = $('#register-forms');

    register_forms.find('.reveal-password:has(.icon-eye)').click();

    if (register_forms.length) {
        if (!register_forms.hasClass('open')) {
            $('#register-forms').modal_open();

            $('#accountSuspendedNotice').hide();
            account_suspended = false;
        }

        if ($(this).is('#loginBtn') || $(this).is('#sidr-id-loginBtn') || $(this).is('#icon-loginBtn')) {
            $('#register-forms .step, #reset-controller,#method-skip-cont').hide();
            $('#btn-remind-submit').hide().find('.submitText').text(COMMON_LANG.BUTTONS.RESET_START);
            $('input[type="text"],input[type="password"]').val('');
            $('#login-contents').show();
            $('.tabTrigger[href="#panel1"]').trigger('click');
            $('#remembered, #start_over').hide();
        }
    } else {
        $('.tabTrigger [href="#panel1"]').trigger('click');
    }
}

function resetPassInitiatives(){
    $('#failed-auth,.mob_avail,.email.panel, .mobile.panel').hide();
    $('.step').hide().removeClass('available');
    $('#reset-view5').addClass('available');
    $('#btn-method-skip').hide();
    $('.step select').chosen_update('');
    $('.email_rep,.mobile_rep').text('');
    $('#btn-remind-submit').show().find('.submitText').text(COMMON_LANG.BUTTONS.RESET_START);
}

function assignCallbackFunction(form){
    var formId = form.attr('id');
    switch (formId){
        case 'form-login':
        case 'form-login-modal':{
            return {
                onSuccess           : function(){
                    loginFormValidationCallback(form);
                },
                handlers            : '#login_btn',
                disable             : '#login_btn',
                // disable_exception   : false,
                version_exception   : true
            };
            break;
        }
        case 'form-register-step-1':
        case 'form-register-modal-step-1':{

            return {
                onSuccess                   : function(){
                    registerFormValidationCallback(form);
                },
                handlers                    : '#continue_btn',
                disable_exception           : true,
                version_exception           : true
            };
            break;
        }
        case 'form-register-step-2':
        case 'form-register-modal-step-2':{
            return {
                onSuccess                   : function(){
                    registerFormValidationCallback(form);
                },
                handlers                    : '#register_btn',
                disable_exception           : true,
                version_exception           : true,
                callback                    : {
                    'after:prepare' : function (form) {
                        form.find('select').each(function () {
                            var obj = $(this);

                            obj.apply_chosen(obj.val());
                        });
                    }
                },
                'custom_error_handler'      : function (error) {
                    if($registerSteps.first.find(error).length){
                        $registerSteps.first.show();
                        $registerSteps.second.hide();
                    }

                    $('html,body').animate({
                        scrollTop: error.offset().top - 100
                    }, 2000);
                }
            };
            break;
        }
        case 'form-remind-options':{
            return {
                onSuccess           : function(){
                    reminderOptionsFormValidationCallback(form);
                },
                version_exception   : true
            };
            break;
        }
        case 'form-question':{
            return {
                onSuccess           : function() {
                    questionFormValidationCallback(form);
                },
                version_exception   : true
            };
            break;
        }
        case 'form-email':{
            return {
                onSuccess           : function() {
                    emailFormValidationCallback(form);
                },
                version_exception   : true
            };
            break;
        }
        case 'form-mobile':{
            return {
                onSuccess           : function() {
                    mobileFormValidationCallback(form);
                },
                version_exception   : true
            };
            break;
        }
        case 'form-reset-pass':{
            return {
                onSuccess           : function() {
                    resetPassFormValidationCallback(form);
                },
                version_exception   : true
            };
            break;
        }
    }
}

function handleErrors(data,formId){
    switch (data.code) {
        case error_codes.unauthorised_email                 : { //2001
            passResetUserNotFound(formId, data.msg, data.data);
            break;
        }
        case error_codes.two_factor_fail                    : { //2005
            resetPassTwoFactorFailed();
            break;
        }
        case error_codes.password_mismatch                  : {//2100
            passwordVerificationErrors(formId,data.msg);
            break;
        }
        case error_codes.reset_password_option_not_valid    : { //2163
            invalidResetOption(data.msg);
            break;
        }
        default :
            globalApplicationErrors(data, formId);
    }
}

function mediumLargeViewLogin(obj){
    frondEndLogin(obj);
    //if(!checkIfLocationIsBackend(document.location)){
    //}else{
    //    backEndLogin(obj);
    //}
}

function frondEndLogin(obj){
    var register_forms = $('#register-forms');
    if(!register_forms.hasClass('open')) {
        register_forms.modal_close();
    }

    if(obj.is('#loginBtn') || obj.is('#sidr-id-loginBtn')){
        $('#register-forms .step, #reset-controller,#method-skip-cont').hide();
        $('#btn-remind-submit').hide().find('.submitText').text(COMMON_LANG.BUTTONS.RESET_START);
        $('input[type="text"],input[type="password"]').val('');
        $('#login-contents').show();
        $('.tabTrigger[href="#panel1"]').trigger('click');
    }else{
        $('.tabTrigger[href="#panel2"]').trigger('click');
    }
}

function backEndLogin(obj){
    if($('#reset-forms').length) {
        location.replace(obj.attr('href'));
    }else{
        if (obj.is('#loginBtn') || obj.is('#sidr-id-loginBtn')) {
            $('.tabTrigger [href="#panel1"]').trigger('click');
        } else {
            $('.tabTrigger [href="#panel2"]').trigger('click');
        }
    }
}

function smallViewLogin(obj){
    if($('#register-forms').length || $('#reset-forms').length){
        location.replace($(this).attr('href'));
    }else{
        if(obj.is('#loginBtn') || obj.is('#sidr-id-loginBtn')){
            $('.tabTrigger [href="#panel1"]').trigger('click');
        }else{
            $('.tabTrigger [href="#panel2"]').trigger('click');
        }
    }
}

function skipReminderStep(btn){
    activeStep = $('.step:visible');
    activePos = parseInt(activeStep.attr('id').match(REG.ALL_NUM.REGEX));

    activeStep.find('.error').removeClass('error');

    $('.step.available').each(function () {
        pos = parseInt($(this).attr('id').match(REG.ALL_NUM.REGEX));
        if(pos > activePos){
            activeStep.hide();
            if($(this).is(':hidden')){
                $(this).show();
            }
            if($(this).is($('.step.available:last'))) {
                btn.hide();
            }
            if($(this).attr('data-method') == 'email' || $(this).attr('data-method') == 'mob-reset-pass'){
                $('#btn-method-skip').text(COMMON_LANG.BUTTONS.RESET_NO_ACCESS);
                $('#btn-remind-submit .submitText').text(COMMON_LANG.BUTTONS.RESET_ACCESS);
            }else{
                $('#btn-remind-submit').hide();
            }
            formId = $('.step:visible form').attr('id');
            return false;
        }
    });


    activeForm = $('#reset-contents form:visible, #reset-forms form:visible');

    if(activeForm.length && !activeForm.hasClass('under_validation')){
        activeForm.prepare_form_advanced(assignCallbackFunction(activeForm));
    }

    activeStep = $('.step:visible');
    if(activeStep.attr('id') == 'reset-view5' || activeStep.attr('id') == 'reset-view6'){
        $('#start_over').removeClass('positioned-bottom');
    }else{
        $('#start_over').addClass('positioned-bottom');
    }

    btn.addClass('button expand warning').removeClass('link').blur();
}

//TODO: Check two-factor auth for retrieve password.


/**
 * Form validation callbacks START
 */

/**
 * Login Form validation callback
 * @param form
 */
function loginFormValidationCallback(form){
    var formID = form.attr('id');

    if(typeof login_con != "object"){
        login_con = new $.ajax_prototype({
            'url' : form.attr('action'),
            'success' : function(data){
                loginRequestCallback(data,formID);
            },
            'type' : 'POST',
            'complete' : function () {
                // if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
                //     if(typeof loginRedirect != 'undefined'){
                //         console.log('');
                //         form.append('<input id="redirect" type="hidden" name="redirect" value="' + loginRedirect + '">');
                //         form.off('submit');
                //         return ;
                //         form.submit();
                //     }
                //     else if(typeof loginReload != 'undefined' || typeof keep_progress != 'undefined'){
                //
                //         // var backend = /^my\./.test(window.location.host);
                //         //
                //         // if(!backend){
                //         //     form.attr('action', window.location.href);
                //         // }
                //
                //         if(typeof keep_progress != 'undefined'){
                //             $.cookie('keep_progress', keep_progress,{path: '/'});
                //         }
                //
                //         form.off('submit');
                //         // return ;
                //         form.submit();
                //     }
                //     else {
                //         $.enable_form_controls(formID);
                //         $('.submitText').show();
                //         $('.loading').hide();
                //     }
                // }else{
                    if(typeof keep_progress != 'undefined') {
                        $.set_cookie('keep_progress', keep_progress, '/');
                    } else if(typeof loginRedirect != 'undefined') {
                        document.location.href = loginRedirect;
                    } else if(typeof loginReload != 'undefined') {
                        document.location.reload();
                    } else if(typeof account_suspended == 'undefined' || account_suspended !== true) {
                        $.enable_form_controls(formID);
                        $('.submitText').show();
                        $('.loading').hide();
                    }

                    if (gdpr_built)
                        $('#login_btn').addClass('disabled');
                // }

            }
        }, formID);
    }

    login_con.data = form.serialize();
    $.ajax(login_con);
}

/**
 * Register Form validation callback
 * @param form
 */
function registerFormValidationCallback(form){
    var formID = form.attr('id');

    register_con = new $.ajax_prototype({
        'url'       : form.attr('action'),
        'success'   : function(data){
            registerRequestCallback(data, formID)
        },
        'type'      : 'POST',
        'complete'  : function () {
            if(typeof registerReload != 'undefined'){
            } else {
                $.enable_form_controls(formID);
                $('.submitText').show();
                $('.loading').hide();
            }
        }
    }, formID);

    if(formID.indexOf('step-1') != -1)
        data = {};

    form.find('input:not(.chosen-container input), select').each(function (){
        var obj = $(this);

        if(obj.attr('name') != 'state_id'){
            if(obj.val() && (! obj.is('[type="checkbox"]') || obj.is(':checked')))
                data[obj.attr('name')] = obj.val();
        }else{
            if(obj.val())
                data[obj.attr('name')] = obj.find('option:selected').attr('data-lang');
        }
    });

    register_con.data = data;

    $.ajax(register_con);
}

/**
 * Reset password user form validation callback
 * @param form
 */
function reminderOptionsFormValidationCallback(form){
    var formID = form.attr('id');

    if(typeof send_email_con != "object"){
        send_email_con = new $.ajax_prototype({
            'url' : form.attr('action'),
            'success' : function(data){
                reminderOptionsRequestCallback(data,formID);
                hide_loader();
            },
            'type' : 'POST'
        }, formID);
    }
    send_email_con.data = form.serialize();
    $.ajax(send_email_con);
    show_loader();
}

/**
 * Two factor auth form validation callback
 * @param form
 */
function questionFormValidationCallback(form){
    var formID = form.attr('id');

    if(typeof form_question != "object"){
        form_question = new $.ajax_prototype({
            'url' : form.attr('action'),
            'success' : function(data){
                questionRequestCallback(data,formID);
                hide_loader();
            },
            'type' : 'POST'
        }, formID);
    }
    form_question.data = {
        _token : form.find('[name="_token"]').val(),
        email  : form.find('[name="email"]').val(),
        answer : form.find('[name="answer"]').val(),
        method : form.find('[name="method"]').val()
    };

    birth = form.find('[name="birth_date"]').val().split('/');
    form_question.data['birth_date'] = birth[2] + '/' + birth[1] + '/' + birth[0];

    $.ajax(form_question);
    show_loader();
}

/**
 * Reset by email form validation callback
 * @param form
 */
function emailFormValidationCallback(form){
    var formID = form.attr('id');

    if(typeof form_email != "object"){
        form_email = new $.ajax_prototype({
            'url' : form.attr('action'),
            'success' : function(data){
                emailRequestCallback(data,formID);
                hide_loader();
            },
            'type' : 'POST'
        }, form.attr('id'));
    }
    form_email.data = form.serialize();
    $.ajax(form_email);
    show_loader();
}

/**
 * Reset by mobile form validation callback
 * @param form
 */
function mobileFormValidationCallback(form){
    var formID = form.attr('id');

    if(typeof form_sms != "object"){
        form_sms = new $.ajax_prototype({
            'url' : form.attr('action'),
            'success' : function(data){
                mobileRequestCallback(data,formID);
                hide_loader();
            },
            'type' : 'POST'
        }, formID);
    }
    form_sms.data = form.serialize();
    $.ajax(form_sms);
    show_loader();
}

/**
 * Set password validation form validation callback
 * @param form
 */
function resetPassFormValidationCallback(form){
    var formID = form.attr('id');

    if(typeof form_pass != "object"){
        form_pass = new $.ajax_prototype({
            'url' : form.attr('action'),
            'success' : function(data){
                resetPassRequestCallback(data,formID);
                hide_loader();
            },
            'type' : 'POST'
        }, formID);
    }
    form_pass.data = form.serialize();
    $.ajax(form_pass);
    show_loader();
}

/**
 * Form validation callbacks END
 */


/**
 * Request callbacks START
 */

/**
 * Handle login request
 * @param data
 * @param formID
 */
function loginRequestCallback(data,formID){
    if (data.success == true) {
        if(data.code != error_codes.two_factor_auth){
            var forms = $('#register-forms');

            if(forms.hasClass('keep_progress')){
                var progress = {};

                $('#' + forms.attr('data-progress')).find('input:visible, textarea:visible').each(function () {
                    var obj = $(this);

                    progress[this.name] = this.value;
                });

                keep_progress = [JSON.stringify({form : forms.attr('data-progress'), tab : $('.tab-title.active a').attr('href'), values : progress})];
            }else{
                if(data.data){
                    loginRedirect = data.data;
                }else{
                    loginReload = true;
                }

                $.setLoginEventCookie();
            }
        }else{
            $.alertHandler('',data.msg,alert_box_warning);
        }
    } else if (data.success == false) {
        if (data.code == error_codes.account_auto_suspended) {
            account_suspended = true;

            // if ($('#register-forms').length) {
            //     var view = $('#reset-view1');
            //
            //     view.find('#email').val($('#form-login-modal #email').val());
            //
            //     var optionsForm = view.find('#form-remind-options');
            //
            //     if (!optionsForm.is_ready()) {
            //         optionsForm.prepare_form_advanced(assignCallbackFunction(optionsForm));
            //     }
            //
            //     optionsForm.submit_form();
            // } else {
            //     $('[name="suspendedAccount"]').val($('#email').val());
            //
            //     $('#passResetLink').on('click', function (e) {
            //         e.preventDefault();
            //     });
            //
            //     $('#accountSuspendedForm').off('submit').submit();
            // }

            $('[name="suspendedAccount"]').val($('#email').val());

            $('#passResetLink').on('click', function (e) {
                e.preventDefault();
            });

            $('#accountSuspendedForm').off('submit').submit();
        } else {
            handleErrors(data,formID);
        }
    } else {
        $.alertHandler(formID, data.msg, alert_box_warning);
    }
}

/**
 * Handle register request
 * @param data
 * @param formID
 */
function registerRequestCallback(data, formID){

    if (data.success == true) {
        if (formID.indexOf('step-1') == -1) {
            window.location.href = data.data.url;
            registerReload = true;

            $.setRegisterEventCookie();
        } else {
            $registerSteps.first.hide();
            $registerSteps.second.show().find('input:first').focus();

            $registerSteps.second.find('.error').removeClass('error');
            $registerSteps.second.find('.help-block').remove();
        }

        if (data.data.newsletter_manager.status == true) { // Andreas 18/06/2019
            $(".row.newsletter").hide();
        }
        else {
            $(".row.newsletter").show();
        }// Andreas end

    } else if (data.success == false) {
        if(formID.indexOf('step-2') > -1) {
            switch (data.code) {
                case error_codes.validation_error:
                    $.each(data.data, function (key, value) {
                        firstStepElement = $registerSteps.first.find('[name="' + key + '"]');

                        if (firstStepElement.length) {

                            if($registerSteps.second.is(':visible')) {
                                $registerSteps.first.show();
                                $registerSteps.second.hide();
                            }

                            firstStepElement.displayIndividualErrors(value);
                        }else{
                            $registerSteps.second.find('[name="' + key + '"]').displayIndividualErrors(value);
                        }
                    });

                    break;
                default:
                    handleErrors(data, formID);
            }
        }else{
            handleErrors(data, formID);
        }
    } else {
        $.alertHandler(formID, data.msg, alert_box_warning);
    }
}

/**
 * Set available reset options.
 * @param data
 * @param formID
 */
function reminderOptionsRequestCallback(data,formID){
    if (data.success == true) {

        if(typeof account_suspended != 'undefined' && account_suspended === true) {
            $('#accountSuspendedNotice').show();
            $('#login-contents, #start_over').hide();
            $('#reset-view1,#reset-controller,#remembered,#btn-remind-submit').show();
        }

        $('[name="method"]:last').val($('.step:visible').attr('data-method'));
        rollBackSteps();
        initializeAvailableSteps(data);
        email = $('#reset-view1 [name="email"]').val();

        $('#reset-forms [name="email"], #reset-contents [name="email"]').val(email);
        $('.email_rep').text(email);
        $('#method-skip-cont').show();

        if(typeof account_suspended != 'undefined' && account_suspended === true)
            $('#btn-method-skip').show();
        else
            $('#start_over, #btn-method-skip').show();

        openNextStep();
        reformFirstVisibleStep(question);
        initializeNextForm();
    } else if (data.success == false) {
        handleErrors(data,formID);
    } else {
        $.alertHandler(formID, data.msg, alert_box_warning);
    }
}

/**
 * Handle server`s response on two factor auth for password reset
 * @param data
 * @param formID
 */
function questionRequestCallback(data,formID){
    if (data.success == true) {
        $('[name="method"]:last').val($('.step:visible').attr('data-method'));
        $('.step, #btn-method-skip, #tokenReceived').hide();
        $('#reset-view6').show().find('#resetToken').val(data.data.token);
        initializeNextForm();
    } else if (data.success == false) {
        handleErrors(data,formID);
    } else {
        $.alertHandler(formID, data.msg, alert_box_warning);
    }
}

/**
 * Handle server`s response on reset password with email.
 * @param data
 * @param formID
 */
function emailRequestCallback(data,formID){
    if (data.success == true) {
        $('[name="method"]:last').val($('.step:visible').attr('data-method'));
        $('.step, #btn-method-skip, #tokenReceived').hide();
        $('#reset-view6, .email.panel').show();
        $('#btn-remind-submit .submitText').text(COMMON_LANG.BUTTONS.RESET_SUBMIT);

        initializeNextForm();
    } else if (data.success == false) {
        handleErrors(data,formID);
    } else {
        $.alertHandler(formID, data.msg, alert_box_warning);
    }
}

/**
 * Handle server`s request on reset password with email.
 * @param data
 * @param formID
 */
function mobileRequestCallback(data,formID){
    if (data.success == true) {
        $('[name="method"]:last').val('mobile');
        $('#tokenReceived, .step, #btn-method-skip').hide();
        $('#reset-view6, .mobile.panel').show();
        $('#btn-remind-submit .submitText').text(COMMON_LANG.BUTTONS.RESET_SUBMIT);

        initializeNextForm();
    } else if (data.success == false) {
        handleErrors(data,formID);
    } else {
        $.alertHandler(formID, data.msg, alert_box_warning);
    }
}

/**
 * Handle server`s response on new password request.
 * @param data
 * @param formID
 */
function resetPassRequestCallback(data,formID){
    if (data.success == true) {
        if ($('#remembered_trig').length) {
            // $.set_cookie('errorCode', [data.msg, data.success], '/', $('#remembered_trig').attr('href'));
            $('#resetSuccess').modal_open();
        } else {
            var success_modal = $('#resetSuccess');

            if (success_modal.length) {
                success_modal.modal_open();
            } else {
                $.alertHandler(formID, data.msg, alert_box_success);
                $('#remembered_trig_modal').trigger('click');
                $('#accountSuspendedNotice').hide();
            }

            account_suspended = false;
        }
    } else if (data.success == false) {
        handleErrors(data,formID);
    } else {
        $.alertHandler(formID, data.msg, alert_box_warning);
    }
}

/**
 * Request callbacks END
 */

function rollBackSteps(){
    $('.mob_avail').hide();
    $('.step.available:not(:last)').removeClass('available');
}

function setMobileContents(method,value){
    if (method.indexOf('mob') > -1) {
        $('.mob_avail').show();
        $('.mobile_rep').text(value.target);
    }
}

function initializeAvailableSteps(data){
    $('.step[data-method]').each(function () {
        method = $(this).attr('data-method');
        $.each(data.data, function (key, value) {
            if (value.type == method) {
                if ('question' in value) {
                    question = value.question;
                }
                $('[data-method="' + method + '"]').addClass('available');
                setMobileContents(method,value);
            }
        });
    });
}

function openNextStep(){
    $('.step:visible').hide();
    $('.step.available:first').show();
}

function reformFirstVisibleStep(question){
    $('#remembered').hide();
    $('.step .help-block').remove();

    if ($('.step:visible').is($('#reset-view2'))) {
        var label = $('[for="answer"]');

        if(label.find('span').length < 1)
            label.text(question);
        else
            label.find('span').text(question);

        $('#btn-method-skip').text(COMMON_LANG.BUTTONS.RESET_ANS_FORGOT).removeClass('button expand warning').addClass('link');
    } else {
        $('#btn-method-skip').text(COMMON_LANG.BUTTONS.RESET_NO_ACCESS);
        $('#btn-remind-submit .submitText').text(COMMON_LANG.BUTTONS.RESET_ACCESS);
    }
}

function initializeNextForm(){
    step = $('.step:visible');
    form = step.find('form');

    if(step.attr('id') == 'reset-view6'){
        step.find('.strength-meter').remove()
    }

    if(!form.hasClass('under_validation')){
        form.prepare_form_advanced(assignCallbackFunction(form));
    }

    if(step.attr('id') == 'reset-view5' || step.attr('id') == 'reset-view6'){
        $('#start_over').removeClass('positioned-bottom');
    }else{
        $('#start_over').addClass('positioned-bottom');
    }
}

function hide_loader () {
    $('#btn-remind-submit').find('.submitText').show();
    $('#btn-remind-submit').find('.loading').hide();
}

function show_loader () {
    $('#btn-remind-submit').find('.submitText').hide();
    $('#btn-remind-submit').find('.loading').show();
}