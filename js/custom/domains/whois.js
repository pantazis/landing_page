$(document).ready(function () {
    var searchbar = $('#searchbar'),
        inPanelErrors = [
            error_codes.whois_not_supported_for_this_domain,
            error_codes.whois_communications_failed,
            error_codes.whois_responded_with_error,
            error_codes.whois_responded_no_result,
            error_codes.whois_search_no_tld_given
        ],
        whois_search_form = $('#whois_search_form'),
        recaptcha = whois_search_form.find('.captcha-wrapper');

    whois_search_form.prepare_form_advanced({
        handlers                : '#whoisTrigger',
        disable_exception       : true,
        onSuccess               : function () {
            if (recaptcha.length && parseInt($('#whoisCaptcha').css('height')) < 1) {
                $('#searchbar').focus();
                return;
            }

            $.ajax(
                new $.ajax_prototype({
                    type    : 'POST',
                    timeout : 30000,
                    data : whois_search_form.serialize(),
                    success : function (data) {
                        if (data.success) {
                            $('#initPanel').hide();
                            $('#resultsPanel').html(data.data).show();

                            if (recaptcha.length)
                                recaptcha.slideUp();
                        } else {
                            if (recaptcha.length && data.code != error_codes.validation_error)
                                recaptcha.slideUp();

                            if (inPanelErrors.indexOf(data.code) > -1) {
                                $('#initPanel').hide();
                                $('#resultsPanel').html(data.msg).show();
                            } else
                                globalApplicationErrors(data, 'whois_search_form');
                        }

                        if (recaptcha.length && data.code != error_codes.validation_error) {
                            grecaptcha.reset(activeCaptcha[recaptcha.find('.g-recaptcha').attr('id')]);
                        }

                    }
                }, '#whois_search_form')
            );
        },
        version_exception       : true,
        custom_error_display    : {
            validate_required   : function (error, element) {
                element.show_validation_error(VALIDATION_MESSAGES.ERRORS.CUSTOM.WHOIS.POSTKEYWORD.REQUIRED);
            },
            validate_length     : function (error, element) {
                if (element.attr('name') == 'domain')
                    element.show_validation_error(VALIDATION_MESSAGES.ERRORS.CUSTOM.WHOIS.POSTKEYWORD.LENGTH.MIN.replace('##n##', error.ruleConfig.rule));
                else
                    element.show_validation_error(error.message);
            }
        }
    });

    if (recaptcha.length)
        searchbar.on('focus', function () {
            recaptcha.slideDown();
        });
});