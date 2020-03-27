$(document).ready(function () {
    $('#form-support').prepare_form_advanced({
        onSuccess             : function (form) {
            var formId = form.attr('id');
            $.ajax(new $.ajax_prototype(
                {
                    'type'              : 'POST',
                    'url'               : form.attr('action'),
                    'data'              : form.serialize(),
                    'success'           : function (data) {
                        if(data.success){
                            $('#new_support_request_cont').slideUp(function () {
                                $('#new_support_request_msg_cont').slideDown();
                            });
                        }else{
                            grecaptcha.reset(activeCaptcha[form.find('.g-recaptcha').attr('id')]);
                            globalApplicationErrors(data, formId)
                        }
                    },
                    'preerrorcallback'  : function () {
                        grecaptcha.reset(activeCaptcha[form.find('.g-recaptcha').attr('id')]);
                    }
                }, 'form-support', {
                    'complete' : function () {
                        form.find('.disabled').removeClass('disabled');
                    }
                }
            ));
        },
        handlers            : '#supportBtn',
        disable_exception   : true,
        version_exception   : true,
        callback            : {
            'after:prepare' : function (form) {
                form.find('select').each(function () {
                    var obj = $(this);

                    obj.apply_chosen('');
                })
            }
        }
    });
});
