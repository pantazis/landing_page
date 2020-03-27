$(document).ready(function () {
    var createForm = $('#document_create_form');

    createForm.find('select').each(function () {
        var obj = $(this);

        obj.apply_chosen(obj.val());
    });

    createForm.prepare_form_advanced({
        onSuccess           : function () {
            if(typeof createObj != 'object')
                createObj = new $.ajax_prototype({
                    type        : 'POST',
                    success     : function (data) {
                        if(data.success){
                            redirect = data.data.route;
                        }else{
                            globalApplicationErrors(data, 'document_create_form');
                        }
                    },
                    url         : '',
                    complete    : function () {
                        if (typeof redirect != 'undefined') {
                            window.location.href = redirect;
                        } else {
                            $.enable_form_controls('document_create_form');
                            $('.submitText').show();
                            $('.loading').hide();
                        }
                    }
                });

            createObj.data = {
                '_token'            : $('[name="_token"]').val(),
                'document_type'     : $('#documentType').val(),
                'amount'            : $('#amount').val(),
                'reference'         : $('#reference').val(),
                'comments'          : $('#comments').val(),
                'notify_user'       : (($('#notify_user:checked').length) ? 1 : 0),
                'create_remittance' : (($('#create_remittance:checked').length) ? 1 : 0),
                'bank_origin'       : $('#bank_origin').val()
            };

            $.ajax(createObj);
        },
        handlers            : '#btn-submit-new-document',
        disable             : '#btn-submit-new-document',
        version_exception   : true,
        trigger             : [
            {
                'item'  : '#create_remittance',
                'event' : 'change',
                'callback'  : function (e, obj) {
                    var notify_user = $('#notify_user');

                    notify_user.prop('checked', obj.prop('checked'));
                }
            },
            {
                'item'  : '#documentType',
                'event' : 'change',
                'callback'  : function (e, obj) {
                    if (obj.val() != 'debit_adjustment') {
                        $('#create_remittance').prop('checked', false).change().disabled(true).closest('.row').hide();
                    } else {
                        $('#create_remittance').disabled(false).closest('.row').show();
                    }

                    if (obj.val() != 'offline_payment') {
                        $('#bank_origin_container').hide().find('select').chosen_update(null);
                    } else {
                        $('#bank_origin_container').show();
                    }
                }
            }
        ]
    });
});