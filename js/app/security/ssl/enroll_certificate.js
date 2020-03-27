$(document).ready(function () {
    var commonName      = '',
        reValidateCsr   = true,
        cache_data      = {},
        submittedIso    = '';
        csrValidated    = false;

    $.ajax (
        new $.ajax_prototype({
            'type'      : 'POST',
            'url'       : urls['agreement'],
            'data'      : {
                '_token'    : $('[name="_token"]').val()
            },
            'timeout'   : 60000,
            'success'   : function (data) {
                if(data.success){
                    $('#agreementDoc').val(data.data);
                }else{
                    $('#agreementDoc').closest('.panel').remove();
                }
            },
            'error'     : function (e) {
                globalErrorsHandler(e);
                $('#agreementDoc').closest('.panel').remove();
            }
        })
    );

    var org_phone_country = $('#org_phone_country');
    org_phone_country.disabled(true).chosen_update(org_phone_country.val());

    $('#csr_input').on('input', function () {
        if ($('#gdpr_agree_terms').length < 1 || $('#gdpr_agree_terms:checked').length)
            executeCSRValidation();
    });

    $('#gdpr_agree_terms').on('change', function () {
        var obj = $(this);

        if (obj.prop('checked') && csrValidated === false)
            executeCSRValidation();
    });

    $('#cpAdmin').on('click', function (){

        var container = $('#techManualInput');

        container.toggle();

        if(!$(this).prop('checked')){
            container.find('[type="radio"]').prop('checked', false);

            container.find('input:visible').val('');

            $('#tech_phone_country').chosen_update(submittedIso);
        }

    });

    $('.enrollment_back').on('click', function () {
        var currentStep = $(this).closest('.enrollment_step');

        currentStep.hide().prev('.enrollment_step:last').show();
        $('[data-target="#' + currentStep.attr('id') + '"]').removeClass('active');
        $('html, body').animate({scrollTop : $('#enrollmentSteps').offset().top - 120},800);
    });

    $('.auth_radio').on('change', function () {
        var obj     = $(this),
            cont    = obj.closest('.custom-tabs');

        cont.find('.active').removeClass('active');
        obj.closest('.button').addClass('active');

        cont.find('.content').hide();

        cont.find('#content_' + obj.val()).show();
    });

    var extra_approver_email = $('#extra_approver_email');

    if (extra_approver_email.length) {
        $('#authTabs label').on('click', function () {
           var obj = $(this);

           if (obj.find('input').val().indexOf('email') > -1 && csrValidated)
               extra_approver_email.show();
            else
               extra_approver_email.hide();
        });

        var mainApproverEmail   = extra_approver_email.find('select'),
            selectRow           = mainApproverEmail.closest('.row'),
            approverTemplate    = selectRow[0].outerHTML;

        mainApproverEmail.disabled(true);

        $('[name^="san"]').on('change', function () {
            var obj = $(this);

            if(obj.val()) {
                appendPageLoader();

                $.ajax(new $.ajax_prototype({
                    'type'                  : 'POST',
                    'url'                   : urls['get_approver_list'],
                    'data'                  : {
                        '_token': $('[name="_token"]').val(),
                        'fqdn': $(this).val()
                    },
                    'timeout'               : 60000,
                    'success'               : function (data) {
                        handleGetSanApproverListRequest(obj, data);
                    },
                    'error'                 : function (e) {
                        var proceed = $('#enter_csr_form').find('.enrollment_proceed');

                        proceed.find('.submitText').show();
                        proceed.find('.loading').hide();

                        globalErrorsHandler(e);
                        proceed.removeClass('disabled');
                        reValidateCsr = true;
                    },
                    'postcompletecallback'  : function () {
                        $('#pageLoader').remove();
                    }
                }));
            } else {
                var target_select = extra_approver_email.find('[data-for="' + obj.attr('id') + '"]');

                if (target_select.length) {
                    target_select.closest('.row').remove();
                }
            }

            var approverLists = extra_approver_email.find('select');

            if (approverLists.length && $('#authTabs .button.active input').val() == 'email')
                extra_approver_email.show();
            else
                extra_approver_email.hide();
        });
    }

    function collectData (form) {
        var data;

        switch (form.attr('id')){
            case 'enter_csr_form':
                data = collectEnterCsrData(form);
                break;
            case 'verify_details_form':
                data = collectVerifyDetailsData(form);
                break;
            case 'company_info_form':
                data = collectCompanyInfoData(form);
                break;
        }

        data['_token'] = form.find('[name="_token"]').val();


        if ($('#gdpr_agree_terms:checked').length) {
            data['processing_approval'] = $('[name="processing_approval"]').val();
            data['data_validity'] = $('[name="data_validity"]').val();
        }

        return data;
    }

    function collectEnterCsrData (form) {
        if(typeof form == 'undefined')
            form = $('#enter_csr_form');

        var data = {
            'order_type'    : form.find('[name="order_type"]:checked').val(),
            'csr'           : form.find('[name="csr"]').val(),
        };

        var auth_option = $('[name="auth_option"]'),
            san = $('[name*=san]'),
            server_type = $('[name=server_type]');

        if(auth_option.length)
            data.auth_option = auth_option.filter(':checked').val();

        if(san.length){
            data.san = [];

            san.each(function (key) {
                if($(this).val())
                    data.san[key] = $(this).val();
            });
        }

        if(server_type.length)
            data.server_type = server_type.val();

        cache_data[form.attr('id')] = data;

        if (extra_approver_email.length) {
            data.approver_email = {};

            extra_approver_email.find('select').each(function () {
                var obj = $(this);

                data.approver_email[obj.attr('data-domain')] = obj.val();
            });
        }

        return data;
    }

    function collectVerifyDetailsData (form) {
        if(typeof form == 'undefined')
            form = $('#verify_details_form');

        var data = {
            'commonName'        : commonName,
            'approver_email'    : form.find('[name="approver_email"]').val()
        },
            contactsCont = '#adminContainer',
            cpAdmin = $('#cpAdmin').prop('checked');

        if(!cpAdmin)
            contactsCont += ', #techContainer';

        form.find(contactsCont).find('[type="radio"]:checked, input:not([type="radio"]):visible:not(.chosen-container input), select:not([name="approver_email"])').each(function (){
            var obj = $(this);

            if(obj.val()){
                data[obj.attr('name')] = obj.val();

                if(cpAdmin)
                    data[obj.attr('name').replace('admin', 'tech')] = obj.val();
            }
        });

        data['approver_email'] = {};

        $('[name="approver_email"]').each(function () {
            var obj = $(this);

            data.approver_email[obj.attr('data-domain')] = obj.val();
        });

        var agreement = form.find('[name="agreement"]'),
            auth_option = $('[name="auth_option"]');

        if(agreement.prop('checked'))
            data.agreement = true;

        if(auth_option.length)
            data.auth_option = auth_option.filter(':checked').val();

        var cache = {};
        $.extend(cache, data, cache_data['enter_csr_form']);

        cache_data[form.attr('id')] = cache;


        if($('.enrollment_step:visible').is('.enrollment_step:last'))
            return cache;
        else
            return data;
    }

    function collectCompanyInfoData (form) {
        var data = {};

        form.find('input:visible:not(.chosen-container input):not(:disabled)').each(function () {
            var obj = $(this);

            if(obj.val())
                data[obj.attr('name')] = obj.val();
        });

        data['org_phone_country'] = $('#org_phone_country').val();
        data['org_country'] = $('#org_country').val();

        $.extend(data, cache_data['verify_details_form']);

        return data;
    }

    function errorHandler (formId, data) {
        switch (data.code){
            case error_codes.ssl_does_not_exist:
            case error_codes.enrollment_already_exists:
            case error_codes.ssl_with_no_enrollment:
            case error_codes.ssl_status_does_not_allow_reissue:
            case error_codes.ssl_status_does_not_allow_cancellation:
            case error_codes.ssl_status_does_not_allow_renew:
            case error_codes.request_not_allowed:
            case error_codes.fetching_agreement_failed:
            case error_codes.fetching_csr_details_failed:
            case error_codes.fetching_approver_list_failed:
            case error_codes.communication_with_supplier_error:
                $.alertHandler(formId,data.msg,alert_box_failure);
                break;
            case error_codes.certificate_enrollment_failed:
                $.alertHandler(formId,data.data,alert_box_failure);
                break;
            default:
                globalApplicationErrors(data, formId);
        }
    }

    function executeCSRValidation () {
        if(typeof checkCSR != 'undefined')
            clearTimeout(checkCSR);

        var obj = $('#csr_input');

        checkCSR = setTimeout(function () {
            csrValidated = false;

            obj.element(function () {
                var data = {
                    '_token'    : $('[name="_token"]').val(),
                    'csr'       : obj.val()
                };

                if ($('#gdpr_agree_terms:checked').length) {
                    data['processing_approval'] = $('[name="processing_approval"]').val();
                    data['data_validity'] = $('[name="data_validity"]').val();
                }

                var auth_options = $('[name="large_auth_option"]');
                if(auth_options.length){
                    var checked = auth_options.filter(':checked');

                    if(checked.val() == 'email'){
                        data.approverList = '1';
                    }
                }

                var proceed = $('#enter_csr_form').find('.enrollment_proceed');

                proceed.addClass('disabled');
                proceed.find('.submitText').hide();
                proceed.find('.loading').show();

                if (extra_approver_email.length)
                    extra_approver_email.hide();

                $.ajax(new $.ajax_prototype({
                    'type'      : 'POST',
                    'url'       : urls['csr'],
                    'data'      : data,
                    'timeout'   : 60000,
                    'success'   : function (data) {
                        var proceed = $('#enter_csr_form').find('.enrollment_proceed');

                        proceed.find('.submitText').show();
                        proceed.find('.loading').hide();

                        if(data.success){
                            csrValidated = true;
                            handleCsrResponse(data.data);

                            $('#enter_csr_form').find('.enrollment_proceed').removeClass('disabled');
                            reValidateCsr = false;
                        }else{
                            $('#enter_csr_form').find('.enrollment_proceed').addClass('disabled');
                            reValidateCsr = true;

                            switch (data.code){
                                case error_codes.validation_error:
                                    if(data.data.csr.constructor == Array){
                                        $error = '';

                                        $.each(data.data.csr, function (key, value) {
                                            $error  += value + '<br>';
                                        });

                                        $('#csr_input').displayIndividualErrors($error);
                                    }else if(data.data.constructor == Object){
                                        $error = '';

                                        $.each(data.data.csr.attributes, function (key, value) {
                                            $error  += key + ': ' + value + '<br>';
                                        });

                                        $('#csr_input').displayIndividualErrors($error);
                                    }else{
                                        var errors = data.data;
                                        $.alertHandler('enter_csr_form', data.msg, alert_box_failure, errors);
                                    }
                                    break;
                                default:
                                    errorHandler('enter_csr_form', data);
                            }
                        }
                    },
                    'error'     : function (e) {
                        var proceed = $('#enter_csr_form').find('.enrollment_proceed');

                        proceed.find('.submitText').show();
                        proceed.find('.loading').hide();

                        globalErrorsHandler(e);
                        proceed.removeClass('disabled');
                        reValidateCsr = true;
                    }
                }));
            }, function (){
                $('#enter_csr_form').find('.enrollment_proceed').removeClass('disabled');

                if (extra_approver_email.length)
                    extra_approver_email.hide();
            });
        }, 1000);
    }

    function handleCsrResponse(csr){
        var except = ['hasBadExtensions', 'isValidDomainName', 'isWildcardCSR'],
            inputs = $.array.except.key(csr, except);

        $.each(inputs, function (key, value){
            var obj = $('#csr_' + key);

            if(!obj.is('input'))
                obj.text(value);
        });

        $('#csr_SecureDomainName').text('https://' + inputs['DomainName']);

        commonName = inputs['DomainName'];
        submittedIso = inputs['Country'];

        var approverEmail = $('#approver_email');

        if (approverEmail.length) {
            var listForDomain;

            if (approverEmail.disabled() === false) {
                if ('approverList' in inputs) {
                    approverEmail.attr('data-validate', 'required').find('.email').remove();

                    listForDomain = Object.keys(inputs.approverList)[0];

                    $.each(inputs.approverList[listForDomain], function (index, value) {
                        approverEmail.attr('data-domain', listForDomain).append('<option class="email" value="' + value + '">' + value + '</option>');
                    });
                } else {
                    approverEmail.attr('data-validate', '').find('.email').remove();
                }

                approverEmail.chosen_update('');
            } else {
                approverEmail.attr('data-validate', 'required');

                listForDomain = Object.keys(inputs.approverList)[0];

                $.each(inputs.approverList[listForDomain], function (index, value) {
                    if (previous_approver_list.indexOf(value) > -1) {
                        approverEmail.attr('data-domain', listForDomain).append('<option class="email" value="' + value + '">' + value + '</option>');

                        return false;
                    }
                });

                approverEmail.chosen_update(approverEmail.find('option.email').val());
            }
        }

        $('#admin_phone_country, #tech_phone_country, #org_phone_country').chosen_update(csr['Country']).change();

        $('#org_country').val(inputs['Country_string']);
        $('#org_name').val(inputs['Organization']);
        $('#org_division').val(inputs['OrganizationUnit']);
        $('#org_city').val(inputs['Locality']);
        $('#org_state_input').val(inputs['State']);

        if (extra_approver_email.length) {
            if (extra_approver_email.find('select').length && $('#authTabs .button.active input').val() == 'email' && $('[name*="san"]').length)
                extra_approver_email.show();
            else
                extra_approver_email.hide();
        }
    }

    function appendPageLoader () {
        $('body').append('<div id="pageLoader" style="width:100%; height:100%; background-color:rgba(28, 29, 30, 0.7); position:fixed; top:0"><div style="position: relative; margin-left: 50%; margin-right: 50%; height: 100%; top: 50%;"><div class="loading"><span class="spinner bigger"></span></div></div></div>')
    }

    function handleGetSanApproverListRequest (obj, data) {
        if (data.success) {
            var target_select = extra_approver_email.find('[data-for="' + obj.attr('id') + '"]');

            if (target_select.length < 1) {
                extra_approver_email.append(approverTemplate);

                target_select = extra_approver_email.find('select:last');
                target_select.attr('data-for', obj.attr('id'));

                target_select.attr_app({
                    'name': '_' + parseInt(obj.attr('id').match(/[0-9]+/)),
                    'id': '_' + parseInt(obj.attr('id').match(/[0-9]+/))
                });

                target_select.next().remove();
            }

            target_select.attr('data-domain', obj.val());

            target_select.find('option').remove();

            for (i in data.data) {
                if (data.data.hasOwnProperty(i)) {
                    target_select.append('<option value="' + data.data[i] + '">' + data.data[i] + '</option>');
                }
            }

            target_select.apply_chosen('');

            var label = target_select.closest('.row').find('label');

            label.text(label.text().replace(/ \(.+\)$/, '')).text_app(' (' + obj.val() + ')');

            if (csrValidated) {
                var first_label = extra_approver_email.find('select:first').closest('.row').find('label');

                first_label.text(first_label.text().replace(/ \(.+\)$/, '')).text_app(' (' + commonName + ')');
            }

            if($('#csr_input').val())
                extra_approver_email.show();
        } else {
            errorHandler('enter_csr_form', data);
        }
    }

    $('#enter_csr_form').prepare_form_advanced({
        handlers            : '.enrollment_proceed',
        disable             : '.enrollment_proceed',
        version_exception   : true,
        onSuccess           : function () {
            if(typeof csrConnection != 'object')
                csrConnection = new $.ajax_prototype({
                    'type'      : 'POST',
                    'url'       : urls['validate']['csr'],
                    'timeout'   : 60000,
                    'success'   : function (data) {
                        if(data.success){
                            if(data.data.hasOwnProperty('target')) {
                                window.location.href = data.data.target;
                            }else {
                                var original_list   = $('#approver_email').closest('.row'),
                                    after_target    = original_list;

                                if (typeof data.data == 'object' && 'approver_list' in data.data){
                                    $('[name="approver_email"]:not(:first)').closest('.row').remove();

                                    $.each(data.data.approver_list, function (key, value) {
                                        after_target.after(original_list.getOuterHTML());

                                        var currentList = $('[name="approver_email"]:last');
                                        after_target    = currentList.closest('.row');

                                        currentList.attr('data-domain', key).empty();

                                        after_target.find('.chosen-container').remove();

                                        currentList.attr_app('id', '_' + key.replace(/\./g,'_'));

                                        currentList.append('<option value="" class="placeholder" selected disabled>' + currentList.attr('data-placeholder') + '</option>');

                                        $.each(value, function (index, email) {
                                            currentList.append('<option value="' + email + '">' + email + '</option>');
                                        });

                                        var $label = after_target.find('label').text();

                                        after_target.find('label').text($label.replace(/\(.+\)/, '').trim() + ' (' + key + ')');
                                    });

                                    $('[name="approver_email"]:not(:first)').apply_chosen('');

                                    original_list.find('label').text(original_list.find('label').text().replace(/\(.+\)/, '').trim() + ' (' + original_list.find('select').attr('data-domain') + ')');
                                }


                                $('.enrollment_step').hide().next('.enrollment_step:first').show();
                                $('.step_buttons:first').addClass('active');

                                $('html, body').animate({scrollTop: $('#enrollmentSteps').offset().top - 120}, 800);
                            }
                        }else{
                            reValidateCsr = true;
                            switch (data.code){
                                case error_codes.validation_error:
                                    if(reValidateCsr)
                                        if(data.data.constructor == Array){
                                            $.each(data.data, function (key, value) {
                                                $('#csr_input').displayIndividualErrors(value);
                                            })
                                        }else{
                                            $.alertHandler('enter_csr_form', data.msg, alert_box_failure, data.data);
                                        }
                                    else
                                        errorHandler('enter_csr_form', data);
                                    break;
                                default:
                                    errorHandler('enter_csr_form', data);
                            }
                        }
                    }
                },'enter_csr_form');

            csrConnection.data = collectData($('#enter_csr_form'));

            $.ajax(csrConnection);
        }
    });

    var details_from = $('#verify_details_form');

    if(details_from.length)
        details_from.prepare_form_advanced({
            handlers            : '.enrollment_proceed',
            disable             : '.enrollment_proceed',
            version_exception   : true,
            onSuccess           : function () {
                if(typeof detailsConnection != 'object')
                    detailsConnection = new $.ajax_prototype({
                        'type'      : 'POST',
                        'url'       : urls['validate']['details'],
                        'timeout'   : 60000,
                        'success'   : function (data) {
                            if(data.success){
                                if(data.data.hasOwnProperty('target')) {
                                    redirect = data.data.target
                                }else{
                                    $('.enrollment_step:visible').hide();

                                    var nextStep = $('#verify_details').closest('.enrollment_step').next();
                                    nextStep.show();

                                    $('[data-target="#' + nextStep.attr('id') + '"]').addClass('active');
                                    $('html, body').animate({scrollTop : $('#enrollmentSteps').offset().top - 120},800);
                                }
                            }else{
                                if (data.data.constructor == Object) {
                                    if ('agreement' in data.data) {
                                        var agreement = $('[name="agreement"]');
                                        agreement.closest('label').find('.' + agreement.attr('data-sibling-class')).displayIndividualErrors(data.data['agreement'][0]);

                                        data.data = $.array.except.key(data.data, ['agreement']);
                                    }

                                    if ('approver_email' in data.data) {
                                        var notFoundDomains = [];

                                        $.each(data.data.approver_email, function (index, domain) {
                                            var targetEmail = $('[name="approver_email"][data-domain="' + domain + '"]');

                                            if (targetEmail.length) {
                                                targetEmail.displayIndividualErrors($.translate('SSL.ENROLLMENT.VALIDATION.INVALID_APPROVER_EMAIL'));
                                            } else {
                                                notFoundDomains.push(domain);
                                            }
                                        });

                                        if (notFoundDomains.length) {
                                            $.alertHandler('', $.translate('SSL.ENROLLMENT.VALIDATION.MISSING_APPROVER_EMAIL', notFoundDomains.length, {'domain' : notFoundDomains.join(', ')}), alert_box_failure);
                                        }
                                        delete data.data.approver_email
                                    }
                                }

                                errorHandler('verify_details_form', data);
                            }
                        },
                        'complete'  : function () {
                            if(typeof redirect != 'undefined'){
                                window.location.href = redirect;
                            }else{
                                $.enable_form_controls('verify_details_form');
                                $('.submitText').show();
                                $('.loading').hide();
                            }
                        }
                    },'verify_details_form');

                detailsConnection.data = collectData($('#verify_details_form'));

                $.ajax(detailsConnection);
            }
        });

    var company_form = $('#company_info_form');

    if(company_form.length)
        company_form.prepare_form_advanced({
            handlers            : '.enrollment_proceed',
            disable             : '.enrollment_proceed',
            version_exception   : true,
            onSuccess           : function () {
                if(typeof companyConnection != 'object')
                    companyConnection = new $.ajax_prototype({
                        'type'      : 'POST',
                        'url'       : urls['validate']['company'],
                        'timeout'   : 60000,
                        'success'   : function (data) {
                            if(data.success){
                                if(data.data.hasOwnProperty('target')) {
                                    redirect = data.data.target;
                                }else{
                                    $('.enrollment_step:visible').hide();
                                    $('#company_info_form').closest('.enrollment_step').next().show();
                                    $('html, body').animate({scrollTop : $('#enrollmentSteps').offset().top - 120},800);
                                }
                            }else{
                                errorHandler('company_info_form', data);
                            }
                        },
                        'complete'  : function () {
                            if(typeof redirect != 'undefined'){
                                window.location.href = redirect;
                            }else{
                                $.enable_form_controls('company_info_form');
                                $('.submitText').show();
                                $('.loading').hide();
                            }
                        }
                    },'company_info_form');

                companyConnection.data = collectData($('#company_info_form'));

                $.ajax(companyConnection);
            }
        });

    $('select').each(function () {
        var obj = $(this);

        obj.apply_chosen((obj.val() ? obj.val() : ''));
    });
});