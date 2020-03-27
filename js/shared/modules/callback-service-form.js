$(document).ready(function() {
    var callbackCaptcha = $('#callbackCaptcha');

    $('#requestCallback').on('click', function (e) {
        e.preventDefault();

        $('#callbackModal').modal_open(function () {
            try {
                grecaptcha.reset(activeCaptcha[callbackCaptcha.attr('id')]);
            } catch (er) {}

            clearForm();
        });
    });

    $('#callback-service-form')
        .on('focus', function () {
            callbackCaptcha.slideDown();
        })
        .prepare_form_advanced({
            'handlers'          : '#submitCallback',
            'disable'           : '#submitCallback',
            version_exception   : true,
            'onSuccess'         : function (form) {
                var disabled = form.find(':disabled');

                disabled.removeAttr('disabled');

                var data = form.serialize();

                disabled.disabled(true);

                $.ajax(
                    new $.ajax_prototype({
                        'type'      : 'POST',
                        'url'       : form.attr('action'),
                        'data'      : data,
                        'success'   : function (data) {
                            if (data.success) {
                                var modal = $('#callbackModal');

                                modal.modal_close();

                                clearForm();
                            } else {
                                globalApplicationErrors(data, form.attr('id'))
                            }
                        }
                    }, form.attr('id'))
                );
            }
        });

    function clearForm () {
        var modal = $('#callbackModal');

        modal.find('#callback_time').val('');

        if (modal.find('#callback_name').disabled() === false) {
            modal.find('#callback_name, #callback_email, #callback_phone').val('');
            modal.find('#callback_phone_country').val('GR');
        }
    }
});