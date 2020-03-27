$(document).ready(function () {
    var form = $('#csr_decoder_form'),
        csrInput = form.find('#csrInput'),
        resultsPanel = $('#resultsPanel'),
        recaptcha = form.find('.captcha-wrapper');

    form.prepare_form_advanced({
        handlers: '#decoderTrigger',
        disable_exception: true,
        version_exception: true,
        onSuccess: function (form) {
            if (recaptcha.length && parseInt($('#decoderCaptcha').css('height')) < 1) {
                csrInput.focus();
                return;
            }

            $.ajax(
                new $.ajax_prototype({
                    'url'       : form.attr('action'),
                    'timeout'   : 180000,
                    'type'      : 'POST',
                    'data'      : form.serialize(),
                    'success'   : function (data) {
                        if (data.success) {
                            printResult(data.data);
                        } else {
                            globalApplicationErrors(data, form.attr('id'))
                        }

                        if (recaptcha.length && data.code != error_codes.validation_error) {
                            recaptcha.slideUp();
                            grecaptcha.reset(activeCaptcha[recaptcha.find('.g-recaptcha').attr('id')]);
                        }
                    }
                }, form.attr('id'))
            )
        }
    });

    if (recaptcha.length)
        csrInput.on('focus', function () {
            recaptcha.slideDown();
        });

    function printResult (result) {
        resultsPanel.show().empty();
        $('#initPanel').remove();

        if (result.AuthResponse.isError)
            printErrors(result);
        else
            printResultsInArray(result);
    }

    function printErrors (result) {
        resultsPanel.append('<div class="alert-box alert">' + result.AuthResponse.Message.join('<br>') + '</div>');
    }

    function printResultsInArray (result) {
        var table = '<table><tbody><tr><td colspan="2"></td></tr>';

        $.each(result, function (key, value) {
            if (key != 'AuthResponse')
                table += '<tr><td width="30%"><strong>' + $.translate('ssl.csrdecoder.' + key.toLowerCase()) + '</strong></td><td>' + value + '</td></tr>';
        });

        table += '<tr><td colspan="2"></td></tr></tbody></table>';

        resultsPanel.append('<p class="smaller-margin"><strong>Πληροφορίες CSR</strong>:</p>');
        resultsPanel.append(table);
    }
});