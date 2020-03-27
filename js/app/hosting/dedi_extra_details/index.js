$(document).ready(function () {

    $('#status').on('change', function () {
        var obj = $(this),
            data = {
                '_token'    : $('[name="_token"]').val(),
                'status'    : obj.checked() ? 1 : 0
            };

        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : obj.closest('form').attr('action'),
                'data'                  : data,
                'success'               : function (data) {
                    if (data.success) {
                        $.alertHandler('', data.msg, alert_box_success);

                        $('#sellable, #renewable').checked(obj.checked());

                        $('#editContainer').toggle(obj.checked());
                    } else {
                        obj.checked(! obj.checked());

                        if (data.code == error_codes.attribute_delete_failed_attach_products)
                            openAttachedProductsModal(data, 'deactivate');
                        else
                            globalApplicationErrors(data);
                    }
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
                    '_token'    : $('[name="_token"]').val(),
                },
                'success'               : function (data) {
                    if (data.success) {
                        if ('url' in data.data)
                            redirect = data.data.url;
                        else
                            $.alertHandler('', data.msg, alert_box_success)
                    } else {
                        if (data.code == error_codes.attribute_delete_failed_attach_products)
                            openAttachedProductsModal(data, 'delete');
                        else
                            globalApplicationErrors(data);
                    }
                },
                complete                : function () {},
                postcompletecallback    : function () {
                    if (typeof redirect != 'undefined')
                        location.href = redirect;
                    else
                        $.deactivateOverlayLoader();
                }
            })
        )
    });

    $('.version_trigger').on('change', function (e) {
        var obj     = $(this),
            form    = obj.closest('form');

        var data = {
            '_token' : $('[name="_token"]').val(),
        };

        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : form.attr('action'),
                'data'                  : data,
                'success'               : function (data) {
                    if (data.success) {
                        var editContainer   = $('#editContainer'),
                            status          = $('#status');


                        editContainer.toggle(data.data.status);
                        status.checked(data.data.status);

                        if (data.data.status)
                            $('#statusLabel .label').removeClass('suspended').addClass('success').text($.translate('misc.statuses.active'));
                        else
                            $('#statusLabel .label').removeClass('success').addClass('suspended').text($.translate('misc.statuses.inactive'));
                    } else {
                        obj.checked(! obj.checked());

                        if (data.code == error_codes.action_not_allowed_on_product)
                            $.alertHandler('', data.data, alert_box_failure);
                        else
                            globalApplicationErrors(data, form.attr('id'));
                    }
                },
                posterrorcallback       : function () {
                    obj.checked(! obj.checked());
                },
                postcompletecallback    : function () {
                    $.deactivateOverlayLoader();
                }
            })
        );
    });

    $('#toggle_selected_on_create').on('change', function () {
        var obj = $(this),
            form = obj.closest('form'),
            data = {
                '_token' : $('[name="_token"]').val()
            };

        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'      : 'POST',
                'url'       : form.attr('action'),
                'data'      : data,
                'success'   : function (data) {
                    if (data.success) {
                        $.alertHandler('', data.msg, alert_box_success);
                    } else {
                        obj.checked(! obj.checked());
                        globalApplicationErrors(data, form.attr('id'));
                    }
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

    function openAttachedProductsModal (data, action) {
        var attachedServersModal = $('#attachedServersModal'),
            productList = attachedServersModal.find('#productList');

        attachedServersModal.find('.detail_action').text($.translate('hosting.actions.' + action));

        productList.empty();

        for (var i in data.data) {
            if (data.data.hasOwnProperty(i)) {
                productList.append('<li>' + data.data[i] + '</li>');
            }
        }
        attachedServersModal.modal_open();
    }
});