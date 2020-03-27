$(document).ready(function(){
    createHandlerConfig({event: {country:'change'}});

    $(".content select").each(function () {
        var obj = $(this);

        obj.apply_chosen(obj.val());
    });

    $("#pref_timezone_region").change(function(){
        region = $(this).val();
        options = '';
        $.each(tz[region],function(key,value){
            options = options + '<option value="' + value + '">' + value + '</option>'
        });
        $('#pref_timezone_city').html(options).chosen_update();
    });

    $('.edit_btn').on('click',function(e){
        e.preventDefault();
        form = $(this).closest('.item').find('.content_form form');
        if(!form.hasClass('under_validation')){
            form.prepare_form_advanced(assignCallbackFunction(form));
        }
    });

    $('#country').on('change',function(){
        statesManager($(this));
    });

    $('.verify_btn').on('click',function(){
        $('[name="type"]').val($(this).attr('data-about'));
        form = $('#verify_codes').find('form');

        $('#verify_codes').modal_open();
        if(!form.hasClass('under_validation')){
            form.prepare_form_advanced(assignCallbackFunction(form));
        }
    });
    $('.resendCode').on('click',function(e){
        e.preventDefault();
        sendResendCode($(this));
    });
    $('.remove_pending').on('click',function(e){
        e.preventDefault();
        sendRemovePendingRequest($(this).attr('data-target'));
    });

    $('.auth-trigger').on('change',function(){
        input = $(this);
        item = input.closest('.item');
        if(input.prop('checked')){
            activateTowFactorAuth(item);
        }else{
            disableTwoFactorAuth(input);
        }
    });

    $('.mobile-trigger').on('change',function(){
        $('#security-confirm').attr({'data-src': $(this).closest('form').attr('id')}).modal_open();

        var form = $('#security-confirm').find('form');
        if(!form.hasClass('under_validation')) {
            form.prepare_form_advanced(assignCallbackFunction(form));
        }
    });
    $('#approve-trigger').on('change', function () {
        var obj     = $(this),
            form    = obj.closest('form');

        $.ajax(new $.ajax_prototype({
                type    : 'POST',
                url     : form.attr('action'),
                data    : {
                    '_token'        : form.find('[name="_token"]').val(),
                    'action'        : form.find('[name="action"]').val(),
                    'is_checked'    : ((obj.prop('checked')) ? 1 : 0)
                },
                success : function (data) {
                    if(!data.success){
                        obj.prop('checked', !obj.prop('checked'))
                    }
                }
            })
        )
    });

    $('#newsletter-trigger').on('change', function () {
        $('#newsletterConfirmation').modal_open();
    });

    $('#newsConfCancel').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.reveal-modal').modal_close();

        var trigger = $('#newsletter-trigger');

        trigger.prop('checked', ! trigger.prop('checked'));
    });

    $('#newsConfConfirm').on('click', function (e) {
        e.preventDefault();

        var form = $('#newsletter_notification_form');

        if (! form.is_ready())
            form.prepare_form_advanced(assignCallbackFunction(form));

        form.validate();
    });

    $('#mobile-notification-trigger').on('change', function () {
        var obj = $(this).addClass('pending');
        $('#gdpr_approval_modal').attr({'data-form-src': $(this).closest('form').attr('id')});

        openGDPRApprovalModal(obj.closest('form'));
    });

/*    channel.newsletter.bind('App\\Events\\User\\UserSubscribedToNewsletter', function(data) {

    });

    channel.newsletter.bind('App\\Events\\User\\UserNotSubscribedToNewsletter', function(data) {

    });*/

    if ($('#newsletterFormContainer').length)
        $.ajax(
            new $.ajax_prototype({
                'type'      : 'POST',
                'url'       : location.origin + urls.newsletter_status,
                'data'      : {
                    '_token' : $('[name="_token"]').val()
                },
                'success'   : function (data) {
                    var newsletterFormContainer = $('#newsletterFormContainer').show(),
                        trigger = newsletterFormContainer.find('[type="checkbox"]'),
                        newsletterConfirmationNotice    = $('#newsletterConfirmationNotice');

                    $('#newsletterLoader').hide();
                    newsletterConfirmationNotice.hide();

                    // Andreas 15/07/2018

                    /*if (data.success) {
                        console.log(data.data.not_subscribed + ' ' + data.data.pending);
                        if (! ('not_subscribed' in data.data)) {
                            trigger.prop('checked', true);

                            if (! data.data.confirmed)
                                newsletterConfirmationNotice.show();

                        } else
                            trigger.prop('checked', false);

                    } else {
                        trigger.prop('checked', false);
                    }*/

                    if (data.success) {
                        if (data.data.pending) {
                            $("#newsletter_notification_form .switch").hide();
                            newsletterConfirmationNotice.show();
                        } else {
                            if (!data.data.not_subscribed) {
                                trigger.prop('checked', true);
                            } else {
                                trigger.prop('checked', false);
                            }
                        }
                    }

                    // Andreas end

                    translateNewsletterModal(trigger);
                }
            })
        );


    $(document)
        .on('keypress',function(e){
            modal = $('.reveal-modal.open');
            if(modal.length && e.keyCode == 27){
                cancelModalConnectedSwitch(modal);
                modal.find('#current-password').val();
                enableBodyScroll();
            }
        })
        .on('click', '#archivedInfoBtn:not(.archived)', function (e) {
            e.preventDefault();

            $('#security-confirm').attr({'data-src': $(this).closest('form').attr('id')}).modal_open();

            var form = $('#security-confirm').find('form');
            if(!form.hasClass('under_validation')) {
                form.prepare_form_advanced(assignCallbackFunction(form));
            }
        })
        .on('click', '#archivedInfoBtn.archived', function (e) {
            var obj = $(this);

            obj.translate('gdpr.archive_buttons.step_2').removeClass('archived');
        });

    $('.reveal-modal .cancel, .close-reveal-mymodal').on('click',function(e){
        e.preventDefault();
        cancelModalButton($(this).closest('.reveal-modal'));
    });

    $.extend({
        'user_profile' : {
            birthdayFormValidationCallback : birthdayFormValidationCallback,
            companyFormValidationCallback : companyFormValidationCallback,
            emailFormValidationCallback : emailFormValidationCallback,
            mobileFormValidationCallback : mobileFormValidationCallback,
            mobileNotificationValidationCallback : mobileNotificationValidationCallback,
            icannAutoApproveValidationCallback : icannAutoApproveValidationCallback,
            handleErrors : handleErrors
        }
    });

    $('#newsletterLoader .loading').show();


    /**
     * Form validation callbacks START
     */

        /**
         * Send set birthday request.
         */
        function birthdayFormValidationCallback(form){
            var line = form.closest('.item');
            if(typeof birthday_con != 'object') {
                birthday_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url'  : form.attr('action'),
                    'success' : function(data){
                        setBirthdayRequestCallback(data)
                    }
                }, form.attr('id'));
            }

            birthday_con.data = collectData(form);
            $.ajax(birthday_con);
        }

        /**
         * Send set company action.
         */
        function companyFormValidationCallback(form){
            var line = form.closest('.item');
            if(typeof company_con != 'object') {
                company_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url'  : form.attr('action'),
                    'success' : function(data){
                        setCompanyRequestCallback(data);
                    }
                }, form.attr('id'));
            }

            company_con.data = collectData(form);
            $.ajax(company_con);
        }

        /**
         * Send a request to change the email.
         */
        function emailFormValidationCallback(form){
            var line = form.closest('.item');
            if(typeof email_con != 'object') {
                email_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url'  : form.attr('action'),
                    'success' : function(data){
                        changeEmailRequestCallback(data);
                    }
                }, form.attr('id'));
            }

            email_con.data = collectData(form);
            $.ajax(email_con);
        }

        /**
         * Send a request to change the mobile phone number
         */
        function mobileFormValidationCallback(form){
            if(typeof mobile_con != 'object') {
                mobile_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url'  : form.attr('action'),
                    'success' : function(data){
                        changeMobileRequestCallback(data);
                    }
                }, form.attr('id'));
            }

            mobile_con.data = collectData(form);
            $.ajax(mobile_con);
        }

        /**
         * Changing a verified email or mobile requires verification to be activated.
         * After the form is validated a request will be sent to verify either the email or the mobile.
         */
        function verificationFormValidationCallback(form){
            if (typeof verification != 'object') {
                verification = new $.ajax_prototype({
                    'type': 'post',
                    'url': form.attr('action'),
                    'success': function (data) {
                        verifiedFormsRequestCallbacks(data);
                    }
                }, form.attr('id'));
            }
            verification.data = form.serialize();
            $.ajax(verification);
        }

        /**
         * Changing password or editing two factor auth requires a verification through password.
         * When the changes are done and the form validated, a modal will be revealed requiring from the user to add his current password.
         */
        function formsRequireVerificationValidationCallback(form){
            var security_confirm = $('#security-confirm'),
                security_confirm_form = security_confirm.find('form');

            security_confirm.attr({'data-src': form.attr('id')}).modal_open(function () {
                security_confirm.find('form .content').show();
            });

            form.find('.reveal-password:has(.icon-eye)').click();

            if (!security_confirm_form.hasClass('under_validation')) {
                security_confirm_form.prepare_form_advanced(assignCallbackFunction(security_confirm_form));
            }
        }

        /**
         * Send a request to change password or edit two factor auth after the form is validated.
         */
        function securityFormValidationCallback(form){
            var srcForm = form.closest('.reveal-modal').attr('data-src');

            if(typeof security_verify_con != 'object'){
                security_verify_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url' : $('#' + srcForm).attr('action'),
                    'beforeSend' : function(){
                        var modal = $('#security-confirm');
                        modal.find('.submitText').hide();
                        modal.find('.loading').show();
                    },
                    'success' : function(data){
                        if(data.success) {
                            try {
                                if (data.data != null && 'action' in data.data) {
                                    switch (data.data.action) {
                                        case actions_obj.setPassword: {
                                            passwordRequestCallback(data);
                                            break;
                                        }
                                        case actions_obj.setTwoFactorAuth: {
                                            twoFactorAuthRequestCallback(data);
                                            break;
                                        }
                                        case actions_obj.setIcannAutoApproval: {
                                            icannAutoAproveRequestCallback(data);
                                            break;
                                        }
                                    }


                                    $('#security-confirm').modal_close().find('#current-password').val('');

                                    srcForm = $('#' + srcForm);

                                    srcForm.find('.strength-meter').remove();

                                    if (srcForm.closest('.item').find('.content_static').hasClass('is-closed')) {
                                        srcForm.closest('.item').find('.cancel').click();
                                    }

                                    srcForm.find('.button.disabled').removeClass('disabled');
                                } else if (data.code == error_codes.create_info_archive_request_received) {
                                    // $.alertHandler('', data.msg, alert_box_success);
                                    $('#security-confirm').modal_close().find('#current-password').val('').attr('type', 'password');
                                    $('#archivedInfoBtn').hide();
                                    $('#downloadWarning').show();
                                }

                                closeLine($('.item.opened'));
                            } catch (e) {
                                console.log(e);
                            }
                        }else{
                            if (data.code == error_codes.archived_info_pending_download) {
                                $('#archivedInfoBtn').translate('gdpr.archive_buttons.step_3').addClass('archived');
                                $('#security-confirm').modal_close().find('#current-password').val('').attr('type', 'password');
                            } else {
                                handleErrors(data, form.attr('id'));
                            }
                        }
                    }
                }, form.attr('id'), {
                    'complete' : function () {
                        srcForm.find('.reveal-password:has(.icon-eye)').click();
                    }
                });
            }

            security_verify_con.data = securityFormCollectData();
            $.ajax(security_verify_con);
        }

        /**
         * If lang is set successfully reloads the page.
         */
        function languageFormValidationCallback(form){
            if(typeof lang_con != 'object'){
                lang_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url' : form.attr('action'),
                    'success' : function(data){
                        if(data.success){
                            document.location.reload(true);
                        }else{
                            handleErrors(data, form.attr('id'));
                        }
                        return false;
                    }
                }, form.attr('id'));
            }

            lang_con.data = form.serialize();
            $.ajax(lang_con);
        }

        /**
         * Sends a set timezone request.
         */
        function timezoneFormValidationCallback(form){
            if(typeof timezone_con != 'object'){
                timezone_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url' : form.attr('action'),
                    'success' : function(data){
                        timezoneRequestCallback(data)
                    }
                }, form.attr('id'));
            }

            timezone_con.data = form.serialize();
            $.ajax(timezone_con);
        }

        function icannAutoApproveValidationCallback(form){
            // security_verify_con.data = securityFormCollectData();
            var modal = $('#gdpr_approval_modal'),
                data = {
                '_token'                : form.find('[name="_token"]').val(),
                'action'                : form.find('[name="action"]').val(),
                'icann_auto_approval'   : form.find('#apply_auto_approve').prop('checked'),
                'apply_on_domains'      : ((form.find('#apply_on_domains').prop('checked')) ? 1 : -1),
                'current_password'      : encodeURIComponent(modal.find('#gdpr-current-password').val())
            };

            if (modal.find('[name="agree_terms"]:checked').length) {
                data.communication_agreement = modal.find('[name="communication_agreement"]').val();
                data.data_validity = modal.find('[name="data_validity"]').val();
                data.processing_approval = modal.find('[name="processing_approval"]').val();
            }

            $.ajax(
                new $.ajax_prototype({
                    'type' : 'post',
                    'url' : form.attr('action'),
                    'data' : data,
                    'beforeSend' : function(){
                        var modal = $('#security-confirm');
                        modal.find('.submitText').hide();
                        modal.find('.loading').show();
                    },
                    'success' : function(data){
                        icannAutoAproveRequestCallback(data);
                    }
                }, form.attr('id'), {
                    'complete' : function () {
                        srcForm.find('.reveal-password:has(.icon-eye)').click();
                    }
                })
            );
        }

        /**
         * Groups the callbacks for the forms that require code verification.
         * @param data
         */
        function securityVerifiedFormsCallbacks(data, form){
            if(data.success) {
                if (data.data != null && 'action' in data.data) {
                    switch (data.data.action) {
                        case actions_obj.setPassword: {
                            passwordRequestCallback(data);
                            break;
                        }
                        case actions_obj.setTwoFactorAuth: {
                            twoFactorAuthRequestCallback(data);
                            break;
                        }
                        case actions_obj.setIcannAutoApproval: {
                            icannAutoAproveRequestCallback(data);
                            break;
                        }
                    }


                    $('#security-confirm').modal_close().find('#current-password').val('');
                    srcForm.find('.strength-meter').remove();

                    if (srcForm.closest('.item').find('.content_static').hasClass('is-closed')) {
                        srcForm.closest('.item').find('.cancel').click();
                    }

                    srcForm.find('.button.disabled').removeClass('disabled');
                } else if (data.code == error_codes.create_info_archive_request_received) {
                    $.alertHandler('', data.msg, alert_box_success);
                    $('#security-confirm').modal_close().find('#current-password').val('').attr('type', 'password');
                    $('#archivedInfoBtn').hide();
                    $('#downloadWarning').show();
                }

                closeLine($('.item.opened'));
            }else{
                if (data.code == error_codes.archived_info_pending_download) {
                    $('#archivedInfoBtn').addClass('archived');
                    $('#security-confirm').modal_close().find('#current-password').val('').attr('type', 'password');
                } else {
                    handleErrors(data, form.attr('id'));
                }
            }
        }

        function mobileNotificationValidationCallback (form) {
            var modal = $('#gdpr_approval_modal:visible, #security-confirm:visible'),
                data = {
                    '_token'                        : form.find('[name="_token"]').val(),
                    'action'                        : form.find('[name="action"]').val(),
                    'use_mobile_for_notifications'  : ((form.find('[name="use_mobile_for_notifications"]').prop('checked')) ? 'true' : 'false'),
                    //'current_password'              : encodeURIComponent(modal.find('[name="current-password"]').val())
                    // Andreas 12/07/2019
                    'current_password'              : modal.find('[name="current-password"]').val()
                    // Andreas end
                };

            if (modal.find('[name="agree_terms"]:checked').length) {
                data.communication_agreement = modal.find('[name="communication_agreement"]').val();
                data.data_validity = modal.find('[name="data_validity"]').val();
                data.processing_approval = modal.find('[name="processing_approval"]').val();
            }

            $.ajax(
                new $.ajax_prototype({
                    'type' : 'POST',
                    'url' : form.attr('action'),
                    'data' : data,
                    'beforeSend' : function(){
                        modal.find('.submitText').hide();
                        modal.find('.loading').show();
                    },
                    'success' : function(data){
                        mobileNotificationRequestCallback(data, form);
                    }
                }, form.attr('id'))
            );
        }

        function newsletterFormCallback (form) {
            if(typeof newsletter_con != 'object'){
                newsletter_con = new $.ajax_prototype({
                    'type' : 'post',
                    'url' : form.attr('action'),
                    'success' : function(data){
                        if (! data.success){
                            globalApplicationErrors(data, form.attr('id'));
                        } else {
                            var newsletterConfirmationNotice = $('#newsletterConfirmationNotice'),
                                msg;

                            var trigger = $('#newsletter-trigger');

                            /*if (trigger.prop('checked')) {*/
                            if (trigger.prop('checked')) {
                                msg = 'gdpr.newsletter.enable_2';
                                if (!data.data.verified) {
                                    msg = 'gdpr.newsletter.enable';
                                    $("#newsletter_notification_form .switch").hide();
                                    newsletterConfirmationNotice.show();
                                }
                            } else {
                                msg = 'gdpr.newsletter.disable';
                                newsletterConfirmationNotice.hide();
                            }

                            $('#newsletterConfirmation').modal_close(function () {
                                translateNewsletterModal(trigger);
                            });

                            $.alertHandler('', $.translate(msg), alert_box_success)
                        }
                    }
                }, form.attr('id'));
            }

            newsletter_con.data = {
                '_token'        : form.find('[name="_token"]').val(),
                'action'        : form.find('[name="action"]').val(),
                'newsletter'    : ((form.find('#newsletter-trigger:checked').length) ? '1' : '0')
            };
            $.ajax(newsletter_con);
        }

        /**
         * Form validation callbacks END
         */

    /**
     * Send requests START
     */

        /**
         * Request pending be removed
         * @param type
         */
        function sendRemovePendingRequest(type){
            if(typeof rmv_pending != 'object'){
                rmv_pending = new $.ajax_prototype({
                    'type'			: 'post',
                    'url'			: r_pending_link,
                    'success'       : function(data){
                        removePending(data);
                    }
                });
            }
            rmv_pending.data = {
                '_token'    : token,
                'action'    : actions_obj.trashPendingDevice,
                'type'      : type
            };
            $.ajax(rmv_pending);
        }

        function sendResendCode(obj){
            if(typeof resend_code != 'object'){
                resend_code = new $.ajax_prototype({
                    'type'			: 'post',
                    'success'       : function(data){
                        resendCodeCallback(data);
                    }
                });
            }
            resend_code.url = resendVerificationCodeUrl.replace(/[#]+type[#]+/,obj.attr('data-target'));
            resend_code.data = {'_token' : token};
            $.ajax(resend_code);
        }

    /**
     * Send requests END
     */


    /**
     * Request callbacks START
     */

        /**
         * Set birthday request callback
         * @param data
         */
        function setBirthdayRequestCallback(data){
            if(data.success) {
                if (data.code != error_codes.no_change && data.code == error_codes.profile_updated_successfully) {
                    $('.content_static [data-about="birth_date"]').set_text(data.data.result['birth_date']['display']);
                    $('.content_form [name="birth_date"]').attr({'data-last-val': data.data.result['birth_date']['display']});
                }
                closeLine(line);
            }else if(!data.success){
                handleErrors(data, form.attr('id'));
            }
        }

        /**
         * Set company request callback
         * @param data
         */
        function setCompanyRequestCallback(data){
            if(data.success) {
                if (data.code != error_codes.no_change && data.code == error_codes.profile_updated_successfully) {
                    $('.content_static [data-about="company"]').set_text(data.data.result['company']);
                    $('.content_form [name="company"]').attr({'data-last-val': data.data.result['company']});
                }
                closeLine(line);
            }else if(!data.success){
                handleErrors(data, form.attr('id'));
            }
        }

        /**
         * Set email request callback
         * @param data
         */
        function changeEmailRequestCallback(data){
            if(data.success) {
                var results = data.data.result;
                if (data.code != error_codes.no_change && data.code == error_codes.profile_updated_successfully) {
                    if ('pending' in data.data.result) {
                        editVerifiedEmail(results);
                    } else {
                        editFirstEmail(results.primary);
                    }
                }
                closeLine(line);
            }else if(!data.success){
                handleErrors(data, form.attr('id'));
            }
        }

        /**
         * Set mobile request callback
         * @param data
         */
        function changeMobileRequestCallback(data){
            if(data.success) {
                var results = data.data.result;
                if (data.code != error_codes.no_change && data.code == error_codes.profile_updated_successfully) {
                    if('pending' in results){
                        if(results.primary.data.nr){
                            editVerifiedMobile(results);
                        }else{
                            addFirstMobile(results.pending);
                        }

                    }else{
                        editFirstMobile(results.primary);
                    }
                }
                closeLine(line);

                $('#switcher-mobile-missing').remove();
                $('#switcher-mobile-unverified').show();
            }else if(!data.success){
                handleErrors(data, form.attr('id'));
            }
        }

        /**
         * Handles the request to verify the new email or mobile.
         * @param data
         */
        function verifiedFormsRequestCallbacks(data){
            if(data.success) {
                if (data.data != '' && data.data != null) {
                    $.each(data.data.result, function (key, value) {
                        $('.content_static span[data-about="' + key + '"]').set_text((key == 'email') ? handleEmailChanges(value) : handleMobileChanges(value));

                        var cont = $('span[data-about="' + key + '"]').closest('.content_static');
                        hideVerificationNotice(cont);
                        cont.find('.saved').set_text(value.primary.display);
                        cont.find('.warning.label').set_text(COMMON_LANG.LABEL.VERIFIED).toggleClass('warning success');

                        $('#verification_code').val('');
                    });
                    $('#verify_codes').modal_close();
                }
            }else{
                handleErrors(data, form.attr('id'));
            }
        }

        /**
         * Password request callback
         * @param data
         */
        function passwordRequestCallback(data){
            if (data.data.result != null) {
                $('.content_static [data-about="password"]').text(data.data.result.password.display);
            }

            $('#password,#password_confirmation').val('');
        }

        /**
         * Two factor authentication request callback.
         * @param data
         */
        function twoFactorAuthRequestCallback(data){
            if (data.data.result != null) {
                if (data.data.result['two-factor-auth'].active) {
                    $('#question').update_version_control(data.data.result['two-factor-auth'].data.question);
                    $('#answer').update_version_control(data.data.result['two-factor-auth'].data.answer);
                } else {
                    $('#question,#answer').val('').attr({'data-last-val': ''}).closest('.item').find('.edit_btn').hide();
                }
            }

            $('#two_factor_auth_form').find('.disabled').removeClass('disabled');
        }

        /**
         * Handles the set timezone request.
         * @param data
         */
        function timezoneRequestCallback(data){
            if(data.success){
                $('[data-about="timezone"]').set_text(data.data.result.timezone.display);
                $('#pref_timezone_region').attr({'data-last-val':data.data.result.timezone.data.region});
                $('#pref_timezone_city').attr({'data-last-val':data.data.result.timezone.data.city});
                closeLine($('.item.opened'));
            }else{
                handleErrors(data, form.attr('id'));
            }
        }

        /**
         * Handles the resend verification code request
         * @param data
         */
        function resendCodeCallback(data){
            if(data.code == error_codes.verify_code_resend){
                $.alertHandler('', data.msg, alert_box_success);
            }else if(data.code == 1060 || data.code == 1061){
                $.alertHandler('', data.msg, alert_box_failure);
            }else{
                $.alertHandler('', data.msg, alert_box_warning);
            }
        }

        /**
         * Remove pending email/mobile
         * @param data
         */
        function removePending(data){
            if(data.success){
                if(data.code == error_codes.profile_updated_successfully){
                    if('mobile' in data.data.result){
                        hideVerificationNotice($('#mobile_item'));
                        $('#mobile_country').update_version_control(data.data.result.mobile.primary.data.cc);
                        $('.content_form [name="phonemobile"]').update_version_control(data.data.result.mobile.primary.data.nr);
                    }else{
                        hideVerificationNotice($('#email_item'));
                        $('.content_form [name="email"]').update_version_control(data.data.result.email.primary.data);
                    }
                }
            }else if(!data.success){
                $.alertHandler('', data.msg, alert_box_failure);
            }else{
                $.alertHandler('', APP_LANG.MESSAGES.SOMETHING_GOES_WRONG, alert_box_warning);
            }
        }

        function icannAutoAproveRequestCallback (data) {
            if(data.success){
                var approve = $('#apply_auto_approve'),
                    domains = $('#apply_on_domains');

                approve.attr('data-last-val', '[' + ((approve.prop('checked')) ? 1 : 0) + ']');
                domains.attr('data-last-val', '[' + ((domains.prop('checked')) ? 1 : 0) + ']');

                $('[data-about="icannAutoApprove"]').find('.label').attr('class', 'label left ' + ((approve.prop('checked')) ? 'success' : 'error')).translate('misc.statuses.' + ((approve.prop('checked')) ? 'active' : 'inactive') + '_female');

                closeLine($('.item.opened'));
            }else{
                handleErrors(data);
            }
        }

        function mobileNotificationRequestCallback (data, form) {
            if(data.success) {
                $('#mobile-notification-trigger').removeClass('pending');
                $('#gdpr_approval_modal').modal_close();
            }else{
                handleErrors(data, form.attr('id'));
            }
        }

    /**
     * Request callbacks END
     */


    /**
     * Miscellaneous START
     */

        /**
         * Apply changes to email form and return the value to display.
         * @param value
         * @returns {*}
         */
        function handleEmailChanges(value){
            $('.content_form [name="email"]').update_version_control(value.primary.data);
            return value.primary.data;
        }

        /**
         * Apply changes to mobile form, return the display value and show the reveal the reset by mobile switch.
         * @param value
         * @returns {*}
         */
        function handleMobileChanges(value){
            $('#phonemobile_country').update_version_control(value.primary.data.cc);
            $('.content_form [name="phonemobile"]').update_version_control(value.primary.data.nr);

            $('#switcher-notice').remove();
            $('#switcher-block').show().find('input').disabled(false);

            return value.primary['display'];
        }

        /**
         * Close the active modal. Remove any typed password.
         * Cancels changes on any associated switch.
         * @param modal
         */
        function cancelModalButton(modal){
            var src_formId = modal.attr('data-src'),
                src_form = $('#' + src_formId),
                form = modal.find('form');

            cancelModalConnectedSwitch(modal);
            modal.find('[name="current-password"]').val('');

            modal.modal_close();
            removeErrors();

            form.enable_form_controls();
            src_form.enable_form_controls();

            modal.find('.reveal-password:has(.icon-eye)').click();
        }

        /**
         * Return the correct validation callback for each form when the form is first open.
         * @param form
         * @returns {Function}
         */
        function assignCallbackFunction(form){
            switch (form.attr('id')){
                case 'identity_form'                :
                case 'birthday_form'                :
                case 'company_form'                 :
                case 'address_form'                 :
                case 'email_form'                   :
                case 'mobile_form'                  :
                case 'landline_form'                :
                case 'fax_form'                     : {
                    return {
                        onSuccess   : function(){
                            openGDPRApprovalModal(form);
                        },
                        handlers    : '.submit-edit',
                        disable     : '.submit-edit, .cancel'
                    };
                }
                case 'verification_form'            : {
                    return {
                        onSuccess           : function(){
                            verificationFormValidationCallback(form);
                        },
                        handlers            : '.verification',
                        disable             : '.verification,.cancel',
                        version_exception   : true
                    };
                }
                case 'password_form'                : {
                    return {
                        onSuccess           : function(){
                            formsRequireVerificationValidationCallback(form);
                        },
                        handlers            : '.security-submit',
                        disable             : '.security-submit,.cancel',
                        version_exception   : true
                    };
                }
                case 'two_factor_auth_form'         : {
                    return {
                        onSuccess   : function(){
                            formsRequireVerificationValidationCallback(form);
                        },
                        handlers    : '.security-submit',
                        disable     : '.security-submit,.cancel'
                    };
                }
                case 'security_verify_form'         : {
                    return {
                        onSuccess           : function(){
                            securityFormValidationCallback(form);
                        },
                        handlers            : '.request-verify',
                        disable             : '.request-verify,.cancel',
                        version_exception   : true
                    };
                }
                case 'language_form'                : {
                    return {
                        onSuccess   : function(){
                            languageFormValidationCallback(form);
                        },
                        handlers    : '.preferences-edit',
                        disable     : '.preferences-edit,.cancel'
                    };
                }
                case 'timezone_form'                : {
                    return {
                        onSuccess   : function(){
                            timezoneFormValidationCallback(form);
                        },
                        handlers    : '.preferences-edit',
                        disable     : '.preferences-edit,.cancel'
                    };
                }
                case 'icann_auto_approval_form'     : {
                    return {
                        onSuccess   : function(){
                            openGDPRApprovalModal(form);
                        },
                        handlers    : '.preferences-edit',
                        disable     : '.preferences-edit,.cancel',
                        cancel      : {
                            'handler'   : '.cancel',
                            'callback'  : function (obj) {
                                var form = obj.closest('form');

                                form.find('[type="checkbox"]').each(function () {
                                    var obj         = $(this),
                                        checked     = JSON.parse(obj.attr('data-last-val'));

                                    obj.prop('checked', checked[0] == 1);
                                })
                            }
                        },
                        callback    : {
                            'after:prepare' : function (form) {
                                form.find('[type="checkbox"]').each(function () {
                                    var obj = $(this);

                                    obj.attr('data-last-val', '[' + ((obj.prop('checked')) ? 1 : 0) + ']');
                                });
                            }
                        }
                    };
                }
                case 'newsletter_notification_form' : {
                    return {
                        onSuccess           : function(form){
                            newsletterFormCallback(form);
                        },
                        version_exception   : true
                    };
                }
            }
        }

        /**
         * Handle all the error in this page.
         * @param data
         * @param formId
         */
        function handleErrors(data, formId){
            // Andreas 17/07/2019
            //$.disable_gdpr_mopdal(data);
            // Andreas end

            switch (data.code){
                case error_codes.validation_error                       : { //100
                    $.displayErrors(formId,data.data);

                    var open_modal = $('.reveal-modal.open');
                    if(open_modal.length && open_modal.find('.error').length < 1){
                        open_modal.find('#current-password').val('');
                        open_modal.modal_close();
                    }
                    break;
                }
                case error_codes.invalid_verification_code              : { //101
                    userProfileVerificationCodeError(formId,data.msg);
                    break;
                }
                case error_codes.verification_target_already_validated  : //1060
                case error_codes.verification_target_not_exists         : { //1061
                    verificationTargetErrors(formId,data.msg,data.success);
                    break;
                }
                case error_codes.verification_code_already_pending      : //1062
                case error_codes.verification_code_sent_recently        : //1063
                case error_codes.mail_already_pending                   : //1064
                case error_codes.mobile_already_pending                 : { //1065
                    userProfileVerificationErrors(formId,data.msg);
                    break;
                }
                case error_codes.unauthorised_email                     : { //2001
                    unauthorisedEmailError(formId,data.msg);
                    break;
                }
                case error_codes.password_mismatch                      : { //2100
                    passwordVerificationErrors(formId,data.msg);
                    break;
                }
                case error_codes.no_mobile_to_reset_by                  : { //2101
                    setMobileResetErrors(formId,data.msg);
                    break;
                }
                default: {
                    globalApplicationErrors(data, formId);
                }
            }
        }

        /**
         * Collect the data for the forms that require password verification.
         */
        function securityFormCollectData(){
            security_form = $('#security_verify_form');
            srcForm = $('#' + $('#security-confirm').attr('data-src'));

            if(srcForm.attr('id') == 'icann_auto_approval_form'){
                data = {
                    '_token'                : srcForm.find('[name="_token"]').val(),
                    'action'                : srcForm.find('[name="action"]').val(),
                    'icann_auto_approval'   : srcForm.find('#apply_auto_approve').prop('checked'),
                    'apply_on_domains'      : ((srcForm.find('#apply_on_domains').prop('checked')) ? 1 : -1),
                    'current_password'      : security_form.find('#current-password').val()
                };
            }
            /*else if(srcForm.attr('id') == 'admin_profile_approve_form'){
                data = {
                    '_token'        : srcForm.find('[name="_token"]').val(),
                    'action'        : srcForm.find('[name="action"]').val(),
                    'is_checked'    : ((srcForm.find('#approve-trigger').prop('checked')) ? 1 : 0)
                };
                data.current_password = security_form.find('#current-password').val();
            }*/
            else{
                data = srcForm.serialize();
                data = data + '&current_password=' + encodeURIComponent(security_form.find('#current-password').val());

                switch_contr = srcForm.find('.switch-controller');
                if(switch_contr.length && !switch_contr.prop('checked')){
                    if(switch_contr.hasClass('auth-trigger')){
                        data = data + '&trash=true';
                    }else{
                        data = data + '&' + srcForm.find('.switch-controller').attr('name') + '=' + (srcForm.find('.switch-controller').is(':checked') ? 'true' : 'false');
                    }
                }
            }

            return data
        }

        /**
         * Handle mobile change if there is a verified mobile.
         * @param results
         */
        function editVerifiedMobile(results){
            var src = $('#mobile_item'),
                display = results.pending.display;

            src.find('.secondary-wrapper').show().find('.unverified').text(display);
            src.find('.verified_pressent').show();
            src.find('.edit_btn').closest('div').hide();
        }

        /**
         * Handle adding the first mobile.
         * @param results
         */
        function addFirstMobile(results){
            var src = $('#mobile_item');

            src.find('.secondary-wrapper').show().find('.unverified').text(results.display);
            src.find('.data-label').text(results.display);

            $('#phonemobile_country').update_version_control(results.data.cc);
            src.find('[name="phonemobile"]').update_version_control(results.data.nr);
            $('.warning.label').show();
        }

        /**
         * Handle editing the first mobile.
         * @param results
         */
        function editFirstMobile(results){
            var src = $('#mobile_item'),
                display = results.display;

            src.find('.data-label, .unverified').text(display);
            $('#phonemobile_country').update_version_control(results.data.cc);
            src.find('[name="phonemobile"]').update_version_control(results.data.nr);
        }

        /**
         * Handle editing the verified email.
         * @param results
         */
        function editVerifiedEmail(results){
            var src = $('#email_item'),
                display = results.pending.data;

            src.find('.secondary-wrapper').show().find('.unverified').text(display);
            src.find('.verified_pressent').show();
            src.find('.edit_btn').closest('div').hide();
        }

        /**
         * Handle editing the first email.
         * @param results
         */
        function editFirstEmail(results){
            var src = $('#email_item'),
                display = results.data;

            src.find('.data-label, .unverified').text(display);
            src.find('[name="email"]').update_version_control(display);
        }

        /**
         * Hide verification notice for email and mobile.
         * @param results
         */
        function hideVerificationNotice(src){
            src.find('.secondary-wrapper').hide();
            src.find('.verified_pressent').hide();
            src.find('.edit_btn').closest('div').show();
        }

        /**
         * Opens the two factor auth to set the question and answer.
         * @param item
         */
        function activateTowFactorAuth(item){
            item.find('.edit_btn').show().closest('div').show();
            removeUnsavedChanges($('.opened:not(.display_form .opened)'));
            openLine(item);
            form = $('#two_factor_auth_form');
            if(!form.hasClass('under_validation')) {
                form.prepare_form_advanced(assignCallbackFunction(form));
            }
        }

        /**
         * Opens the verification modal to verify the request before forward it to the server.
         * @param item
         */
        function disableTwoFactorAuth(item){
            var confirm = $('#security-confirm');
            confirm.attr({'data-src': item.closest('form').attr('id')}).modal_open();

            var form = confirm.find('form');

            if(!form.hasClass('under_validation')) {
                form.prepare_form_advanced(assignCallbackFunction(form));
            }
        }

        function translateNewsletterModal (trigger) {
            var newsletterConfirmation          = $('#newsletterConfirmation'),
                newsletterConfirmationLead      = newsletterConfirmation.find('.lead'),
                newsletterConfirmationContent   = newsletterConfirmation.find('.content p');

            if (trigger.prop('checked')) {
                newsletterConfirmationLead.translate('gdpr.newsletter.account_confirm_modal.disable.title');
                newsletterConfirmationContent.translate('gdpr.newsletter.account_confirm_modal.disable.body');
            } else {
                newsletterConfirmationLead.translate('gdpr.newsletter.account_confirm_modal.enable.title');
                newsletterConfirmationContent.translate('gdpr.newsletter.account_confirm_modal.enable.body');
            }
        }

    /**
     * Miscellaneous END
     */

     // Andreas 17/07/2019

     $("#cancel-confirmation").click(function() {
         $("#cancel-confirmation .submitText").addClass('hide');
         $("#cancel-confirmation .loading").removeClass('hide').css('display', 'block');
         $.ajax({
             type: "POST",
             url: "/newsletter/cancel",
             success: function() {
                 location.reload();
             }
         });
     });

     $("#resend-confirmation").click(function() {
         $("#resend-confirmation .submitText").addClass('hide');
         $("#resend-confirmation .loading").removeClass('hide').css('display', 'block');
         $.ajax({
             type: "POST",
             url: "/newsletter/resend",
             success: function() {
                 //$("#newsletterConfirmationNotice > span").translate('gdpr.newsletter.resend');
                 $("#newsletterConfirmationNotice #confirmation-msg").css('display', 'none');
                 $("#newsletterConfirmationNotice #resend-conf-msg").css('display', 'block');
                 $("#resend-confirmation .loading").addClass('hide').css('display', 'none');
                 $("#resend-confirmation .submitText").removeClass('hide');
             }
         });
     });

     $(".submit-edit").click(function() {
         if ($(this).closest("#email_item").length) {
             $.ajax({
                 type: "POST",
                 url: "/newsletter/status",
                 success: function (response) {
                     if (response.data.not_subscribed == false) {
                         $("#newsletter-bullet").css('display', 'list-item');
                     }
                 }
             });
         }
         else {
             $("#newsletter-bullet").css('display', 'none');
         }
     });

     // Andreas end_

});