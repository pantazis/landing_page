$(document).ready(function () {
    $('#admin_details_cont .switch-controller').on('change', function () {
        var obj = $(this),
            form = obj.closest('form');

        var data = {
            '_token' : $('[name="_token"]').val()
        };

        if (obj.attr('name') == 'status')
            data.status = (obj.checked() ? 1 : 0);

        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : form.attr('action'),
                'data'                  : data,
                'success'               : function (data) {
                    if (data.success) {
                        if (obj.attr('name') == 'status') {
                            $('#sellable-trigger, #renewable-trigger').checked(data.data.status == true);
                            $('#editContainer').toggle(data.data.status == true);
                        } else if (obj.hasClass('status_dependent')) {
                            $('#status-trigger').checked(data.data.status == true);
                            $('#editContainer').toggle(data.data.status == true);

                            if (data.data.status == true)
                                $('#statusLabel .label').removeClass('suspended').addClass('success').text($.translate('misc.statuses.active'));
                            else
                                $('#statusLabel .label').removeClass('success').addClass('suspended').text($.translate('misc.statuses.inactive'));
                        }

                        $.alertHandler('', data.msg, alert_box_success);
                    } else {
                        obj.checked(! obj.checked());

                        if (data.code == error_codes.action_not_allowed_on_product)
                            $.alertHandler('', data.data, alert_box_failure);
                        else
                            globalApplicationErrors(data, form.attr('id'));
                    }
                },
                beforeSend              : function () {
                    form.find('.error').removeClass('error');
                    form.find('.help-block').remove();
                },
                posterrorcallback       : function () {
                    obj.checked(! obj.checked());
                },
                postcompletecallback    : function () {
                    $.deactivateOverlayLoader();
                }
            })
        )
    });

    $('#removeBtn').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : obj.attr('href'),
                'data'                  : {
                    '_token' : $('[name="_token"]').val()
                },
                'success'               : function (data) {
                    if (data.success) {
                        redirect = true;
                        location.href = urls.plans;
                    } else
                        globalApplicationErrors(data);
                },
                postcompletecallback    : function () {
                    if (typeof redirect == 'undefined')
                        $.deactivateOverlayLoader();
                }
            })
        )
    });

});