$(document).ready(function () {
    var timezone        = $('.timezone'),
        timezone_html   = ((timezone.length) ? timezone[0].outerHTML : '');

    $('#adminActions')
        .on('change', function () {
            $('#urlContainer').toggle($(this).val() == 'insert_ticket').find('#url').val('');
        })
        .apply_chosen('');

    $('#installationStatus').on('change', function () {
        $('#completeNotifyContainer').toggle($(this).val() == 'order_completed');
    }).apply_chosen('');

    $('#getStatus').on('click', function (e){
        e.preventDefault();

        appendPageCoverLoader();

        $.ajax({
            timeout     : 30000,
            type        : 'POST',
            data        : {
                '_token' : $('[name="_token"]').val()
            },
            url         : urls['get-status'],
            error       : function (e) {
                globalErrorsHandler(e);
            },
            success     : function (data) {
                if(data.success){
                    $.alertHandler('', data.data[0], alert_box_success);

                    var status          = data.data[1].major_status_name.toLowerCase(),
                        label_status    = statuses[status],
                        major_status    = $('#majorStatus');

                    major_status.text($.translate('ssl.statuses.caps.' + status)).attr('class', 'label ' + label_status + ' align-left');
                    $('.top-header-wrapper .top-header').attr('class', 'top-header ' + label_status);

                    if('ssl_poll_status_name' in data.data[1]){
                        if(data.data[1].ssl_poll_status_name){
                            $('#pollStatus').text(data.data[1].ssl_poll_status_name).closest('.item').show();
                        }else{
                            $('#pollStatus').closest('.item').hide();
                        }
                    }else{
                        $('#pollStatus').closest('.item').remove();
                    }

                    var authStatusesCont = $("#authStatusesCont");

                    if(data.data[2] != null){
                        authStatusesCont.empty();

                        $.each(data.data[2], function (key, value){
                            authStatusesCont.append('<span><strong>' + key + '</strong> ' + value + '</span>');
                        });

                        authStatusesCont.closest('.item').show();
                    }else{
                        authStatusesCont.closest('.item').hide();
                    }

                    if('start_date' in data.data[1]) {
                        (function () {
                            var date = data.data[1].start_date.split(' '),
                                time = date[1].split(':');

                            $('#crDate').show().html(date[0] + '<span class="time">' + time[0] + ':' + time[1] + '</span>' + timezone_html).closest('.item').show();
                        })()
                    }

                    if('end_date' in data.data[1]){
                        (function () {
                            var date = data.data[1].end_date.split(' '),
                                time = date[1].split(':');

                            $('#exDate').show().html(date[0] + '<span class="time">' + time[0] + ':' + time[1] + '</span>' + timezone_html).closest('.item').show();
                        })()
                    }

                    if(status != 'pending') {
                        if (location.host.indexOf('admin') == 0) {
                            if(data.data[1].refund_request_id != null && data.data[1].refund_approved != 0)
                                $('#getStatus').remove();
                        } else {
                            $('#getStatus').remove();
                        }
                    }

                    if(label_status == 'alert'){
                        $('#minorStatus').closest('.item').remove();
                        $('.actions').remove();
                    }else{
                        if(status == 'active'){
                            var actions = $('#actionCont .row');

                            actions.empty();

                            var reissueFound        = false,
                                excludedActions     = ['reissue', 'renew'],
                                validActions        = [];

                            $.each(data.data[1].actions.reverse(), function (key, value) {
                                if (value.indexOf('reissue') > -1) {
                                    reissueFound = value;
                                }

                                if (excludedActions.indexOf(value) == -1) {
                                    validActions.push(value);
                                }
                            });

                            var $actionLength = validActions.length;

                            $.each(validActions, function (key, value) {
                                var $class = 'button actions',
                                    $attrs = '';

                                if (value == 'cancel')
                                    $class += ' secondary';


                                if (value == 'get-certificate')
                                    $attrs = ' target="_blank"';

                                var $divClass;

                                if ($actionLength > 1){
                                    $divClass = 'small-12 medium-6 columns';

                                    if(key == $actionLength - 1)
                                        $divClass += ' medium-text-right';
                                }else{
                                    $divClass = 'small-12 columns medium-text-right';
                                }

                                actions.append('<div class="' + $divClass + '"><a id="action_' + value + '" href="' + urls[value] + '" class="' + $class + '" title="' + $.translate('SSL.BUTTONS.' + value.toUpperCase().replace(/\-/g,'_')) + '"' + $attrs + '>' + $.translate('SSL.BUTTONS.' + value.toUpperCase().replace(/\-/g,'_')) + '</a></div>');
                            });

                            if (reissueFound !== false) {
                                var reissueActionCont = $('#reissueActionCont');

                                $('#reissueCont').show();

                                reissueActionCont.empty();

                                reissueActionCont.append('<a id="action_reissue" href="' + urls[reissueFound] + '" title="' + $.translate('SSL.BUTTONS.' + reissueFound.toUpperCase().replace(/\-/g,'_')) + '">' + $.translate('SSL.BUTTONS.' + reissueFound.toUpperCase().replace(/\-/g,'_')) + '</a>')
                                reissueActionCont.append($reissue_instructions_dropdown);
                            }

                            $('#sslRenew').removeClass('hide-important');
                        }

                        $('#minorStatus').text(data.data[1].minor_status_name.replace(/_/g, ' '));
                    }

                    if(data.data[1].refund_request_id != null){
                        var refundStatus = $('#refundStatus');

                        if (refundStatus.length < 1) {
                            major_status.after('<span id="refundStatus" class="label pending align-left">' + $.translate('SSL.DETAILS.REFUND.PENDING') + '</span>');

                            refundStatus = $('#refundStatus');
                        }

                        switch (data.data[1].refund_approved ) {
                            case 1 : {
                                refundStatus.attr('class', 'label success align-left').translate('SSL.DETAILS.REFUND.SUCCESS');
                                break;
                            }
                            case 0 : {
                                refundStatus.attr('class', 'label pending align-left').translate('SSL.DETAILS.REFUND.PENDING');
                                break;
                            }
                            case -1 : {
                                refundStatus.attr('class', 'label error align-left').translate('SSL.DETAILS.REFUND.FAILED');
                                break;
                            }
                        }
                    }
                }else{
                    globalApplicationErrors(data);
                }
            },
            complete    : function () {
                $('#pageLoader').remove()
            }
        })
    });

    $('#adminTakeAction').on('click', function (e) {
        e.preventDefault();

        var sslInteractModal = $('#sslInteractModal');

        $('#adminActions').chosen_update('').trigger('change');
        $('#url').val('');

        sslInteractModal.find('.error').removeClass('error');
        sslInteractModal.find('.help-block').remove();

        sslInteractModal.modal_open();
    });

    $('#cancel_ssl .modal_cancel').on('click', function (e) {
        e.preventDefault();

        $('#installationServiceRefundContainer').hide();
        $('#refund_allowed').checked(false);
    });

    $('#openServices').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        obj.find('i').toggleClass('icon-plus-circle2 icon-minus-circle2');

        obj.closest('.editable-form').find('.wrapper').toggle();
    });

    $('.toggle-table').on('click',function(){
        if($('.headersRow').next().length) {

        }
        $(this).find('i').toggleClass('icon-plus-circle2 icon-minus-circle2');
            $('#servicesTable').find('.resp-table,.footer').toggle();
    }).one('click',function(){
        $('.toggle-table i').hide();
        $('.table-loader .loader').show();
        $.responsive_tables.initiate();
    });

    $(document)
        .on('click', '#action_renew, #sslRenew', function (e) {
            e.preventDefault();

            addRenewToCart();
        })
        .on('click', '#action_cancel', function (e) {
            e.preventDefault();

            $('#cancel_ssl').modal_open();
        })
        .on('click', '#action_reissue', function (e) {
            e.preventDefault();

            $('#reissue_verification').modal_open();
        })
        .on('click', '#reissue_agree', function (e) {
            e.preventDefault();

            window.location.href = $('#action_reissue').attr('href');
        })
        .on('click', '#buyInstallation:not(.success)', function (e) {
            e.preventDefault();

            var obj = $(this),
                commonName = obj.attr('data-common-name'),
                ssl_order_id = obj.attr('data-ssl-order-id'),
                data = {
                    '_token'                : $('[name="_token"]').val(),
                    'sku'                   : obj.attr('data-product-sku'),
                    'settings'              : {},
                    'length'                : '',
                    'unique_id'             : unique_page_identifier,
                    'ssl_certificate_id'    : obj.attr('data-certificate-id'),
                    'ssl_order_id'          : obj.attr('data-ssl-order-id')
                };

            if (typeof ssl_order_id != 'undefined')
                data['ssl_order_id'] = ssl_order_id;

            if (typeof commonName != 'undefined')
                data['target_domain'] = commonName;

            if (! obj.hasClass('loader_cont'))
                $.activateOverlayLoader();

            $.ajax(
                new $.ajax_prototype({
                    'type'                  : 'POST',
                    'url'                   : urls['buy_installation'],
                    'data'                  : data,
                    'success'               : function (data) {
                        if (data.success) {
                            obj.addClass('success').attr('data-cart-item-id', data.data.id);
                            var submitText = obj.find('.submitText');

                            if (submitText.length)
                                submitText.text(COMMON_LANG.CART.IN_CART);
                            else
                                obj.text(COMMON_LANG.CART.IN_CART);

                            if ('cart_items' in  data.data)
                                $.each(data.data.cart_items, function (index, item) {
                                    $.cart.insert(item.id, item.name, item.sub_name, item.total_price);
                                });
                            else
                                $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);
                        } else {
                            $.cart.errorHandler(data);
                        }
                    },
                    postcompletecallback    : function () {
                        $.deactivateOverlayLoader();
                    }
                })
            )
        })
        .on('click', '#buyInstallation.success', function (e) {
            e.preventDefault();
        })
        .on('click', '.openService', function (e) {
            e.preventDefault();

            var obj = $(this);

            obj.find('i').toggleClass('icon-plus-circle2 icon-minus-circle2');
            obj.closest('.item').find('.serviceContainer').toggle();
            obj.closest('p').find('.label').toggle();
        });

    $('body')
        .on('remove_item_request', function (e, item_id) {
            var target = $('[data-cart-item-id="' + item_id + '"]:not(li)');

            if (target.length < 1)
                return;

            if (target.attr('id') == 'buyInstallation') {
                target.removeClass('success');

                var submitText = target.find('.submitText');

                if (submitText.length)
                    submitText.text($.translate('cart.buy_action'));
                else
                    target.text($.translate('cart.buy_action'));
            }
        })
        .on('remove_item_failed', function (e, item_id) {
            var target = $('[data-cart-item-id="' + item_id + '"]:not(li)');

            if (target.length < 1)
                return;

            if (target.attr('id') == 'buyInstallation') {
                target.addClass('success');

                var submitText = target.find('.submitText');

                if (submitText.length)
                    submitText.text(COMMON_LANG.CART.IN_CART);
                else
                    target.text(COMMON_LANG.CART.IN_CART);
            }
        })
        .on('remove_item_success', function (e, item_id) {
            var target = $('[data-cart-item-id="' + item_id + '"]:not(li)');

            if (target.length < 1)
                return;

            if (target.attr('id') == 'buyInstallation') {
                target.removeAttr('data-cart-item-id');
            }
        });

    var offerRenew = $('#offerAutoEnrollRenew');

    if (offerRenew.length) {
        offerRenew.on('click', function (e) {
            e.preventDefault();

            $('#renew_ssl').modal_open();
        });

        $('#autoEnrollRenew').on('click', function (e) {
            e.preventDefault();

            var modalBgLayer = $('.reveal-modal-bg');

            modalBgLayer.css('z-index', 1000).append('<div id="autoRenewLoader" style="position: relative; margin-left: 50%; margin-right: 50%; height: 100%; top: 50%;"><div class="loading"><span class="spinner bigger"></span></div></div>');

            $.ajax(
                new $.ajax_prototype({
                    timeout: 60000,
                    type: 'POST',
                    url: urls.auto_renew,
                    data: {
                        '_token': $('[name="_token"]').val()
                    },
                    success: function (data) {
                        if (data.success) {
                            reloading = true;
                            location.reload(true);
                        } else {
                            globalApplicationErrors(data);
                        }
                    },
                    complete: function () {
                        if (typeof reloading == 'undefined') {
                            modalBgLayer.css('z-index', 100);
                            $('#autoRenewLoader').remove();
                        }
                    }
                })
            );
        });
    }

    $('#cancelSubmit').on('click', function (e) {
        e.preventDefault();

        var obj     = $(this),
            form    = $('#ssl_cancel_form');

        if (! form.is_ready()) {
            form.prepare_form_advanced({
                outer_handlers      : '#cancelSubmit',
                disable             : '#cancelSubmit, .modal_cancel',
                version_exception   : true,
                onSuccess           : function () {
                    var action = form.find('[name="ssl_cancel_action"]');

                    if (action.is('[type="radio"]'))
                        action = form.find('[name="ssl_cancel_action"]:checked');

                    var data = {
                        '_token'            : form.find('[name="_token"]').val(),
                        'ssl_cancel_action' : action.val(),
                        'ssl_info_reuse'    : form.find('[name="ssl_info_reuse"]:checked').length ? $('[name="ssl_info_reuse"]:checked').val() : 0,
                        'comment'           : form.find('[name="comment"]').val().trim()
                    };

                    var refund_allowed = $('#refund_allowed:visible');

                    if (refund_allowed.length)
                        data.refund_allowed = (refund_allowed.checked() ? 1 : 0);

                    $.ajax(new $.ajax_prototype({
                        timeout     : 60000,
                        type        : 'POST',
                        url         : $('#action_cancel').attr('href'),
                        data        : data,
                        error       : function (e) {
                            globalErrorsHandler(e);
                        },
                        success     : function (data) {
                            if (data.success) {
                                if (data.data.constructor == Object && ('route' in data.data || 'reload' in data.data)) {
                                    if ('route' in data.data)
                                        location.href = data.data.route;
                                    else
                                        location.reload(true);

                                } else {
                                    if (data.data.constructor == Object && 'not_cancelable' in data.data) {
                                        $.alertHandler('', data.data.not_cancelable, alert_box_failure);
                                        obj.removeClass('disabled');

                                        form.find('[name="ssl_cancel_action"]:checked').attr('checked',false);
                                        form.find('[name="ssl_info_reuse"]:checked').attr('checked',false);
                                        form.find('[name="comment"]').val(null);

                                        form.closest('.reveal-modal').modal_close();
                                    } else {
                                        var status = $('#majorStatus');

                                        if (status.length < 1)
                                            location.reload(true);

                                        status.translate('SSL.STATUSES.CAPS.CANCELLED').attr('class', 'label cancelled align-left');

                                        if ($('#refundStatus').length < 1)
                                            status.after('<span id="refundStatus" class="label pending align-left">' + $.translate('SSL.DETAILS.REFUND.PENDING') + '</span>');

                                        $('.top-header-wrapper .top-header').attr('class', 'top-header error');

                                        $('#pollStatus').closest('.item').remove();
                                        $("#authStatusesCont").closest('.item').remove();
                                        $('#crDate, #exDate').closest('.item').remove();
                                        $('#minorStatus').closest('.item').remove();
                                        // $('#getStatus').remove();
                                        $('.actions').remove();

                                        $('#refund_allowed').checked(false);
                                        $('#cancel_ssl').modal_close();

                                        $('#comment_cont').show().find('.content_static').html($('[name="comment"]').val().trim().replace(/\n/g, '<br>'));
                                    }
                                }
                            } else {
                                if (data.code == error_codes.installation_service_needs_admin_vetting) {
                                    $('#installationServiceRefundContainer').show().find('input').checked(false);
                                    form.enable_form_controls();
                                } else
                                    globalApplicationErrors(data, 'ssl_cancel_form');
                            }
                        }
                    }));
                }
            });
        }
    });

    $('#cancelPendingEnroll').on('click', function (e) {
        e.preventDefault();

        $('#cancel_ssl').modal_open();
    });

    $('[name="ssl_cancel_action"]').on('change', function () {
        $('[name="ssl_info_reuse"]:checked').attr('checked', false);

        if ($(this).val() == 'reorder')
            $('#reorderExtraInfo').show();
        else
            $('#reorderExtraInfo').hide();
    });

    $('#installationStatusForm .cancel').on('click', function () {
        $('#installationStatus').chosen_update('').trigger('change');
        $('#completed_notify').checked(false);
    });

    var sslInteractForm = $('#sslInteractForm');

    if (sslInteractForm.length)
        $('#sslInteractForm').prepare_form_advanced({
            outer_handlers      : '#actionSubmit',
            disable             : '#actionSubmit, .modal_cancel',
            version_exception   : true,
            onSuccess           : function (form) {
                var adminActions = $('#adminActions').val(),
                    data = {
                    '_token'        : $('[name="_token"]').val(),
                    'interaction'   : adminActions
                };

                if (adminActions == 'insert_ticket')
                    data.ticket_id = $('#ticket_id').val();

                interactWithInstallation (data, form)
            }
        });

    var installationStatusForm = $('#installationStatusForm');

    if (installationStatusForm.length)
        $('#installationStatusForm').prepare_form_advanced({
            handlers : '.submit-edit',
            disable : '.cancel, .submit-edit',
            version_exception : true,
            onSuccess: function (form) {
                var data = {
                    '_token'        : $('[name="_token"]').val(),
                    'interaction'   : $('#installationStatus').val(),
                    'notify_user'   : ($('#completed_notify').checked() ? 1 : 0)
                };

                interactWithInstallation (data, form)
            }
        });

    var ticketIdForm = $('#ticketIdForm');

    if (ticketIdForm.length)
        ticketIdForm.setFieldsVersionControl().prepare_form_advanced({
            handlers : '.submit-edit',
            disable : '.cancel, .submit-edit',
            onSuccess: function (form) {
                var data = {
                    '_token'        : form.find('[name="_token"]').val(),
                    'interaction'   : form.find('[name="interaction"]').val(),
                    'ticket_id'     : form.find('[name="ticket_id"]').val()
                };

                interactWithInstallation (data, form)
            }
        });

    channel.ssl.bind('App\\Events\\SslCertificates\\SslCertificateRefundResponseReceivedPusher', function(data) {
        if(parseInt($('#ssl_id .number').text()) != parseInt(data.msg.certificate_id) && parseInt($('[data-ssl-order-id]').attr('data-ssl-order-id')) != parseInt(data.msg.ssl_order_id))
            return ;

        var refundStatus = $('#refundStatus'),
            status, text;

        if (refundStatus.length < 1) {
            $('#majorStatus').after('<span id="refundStatus"></span>');
            refundStatus = $('#refundStatus');
        }

        switch (data.msg.refund_status ) {
            case 1 : {
                status  = 'success';
                text    = $.translate('SSL.DETAILS.REFUND.SUCCESS');
                break;
            }
            case 0 : {
                status  = 'pending';
                text    = $.translate('SSL.DETAILS.REFUND.PENDING');
                break;
            }
            case -1 : {
                status  = 'error';
                text    = $.translate('SSL.DETAILS.REFUND.FAILED');
                break;
            }
        }

        refundStatus.attr('class', 'label ' + status + ' align-left').text(text);

        $('#getStatus').remove();
    });

    shouldExpandButtons();

    $(window).on('resize', function () {
        shouldExpandButtons();
    });

    function shouldExpandButtons () {
        if ($.getSizeClassification('small')) {
            $('#actionCont .button').addClass('expand');
        } else {
            $('#actionCont .button').removeClass('expand');
        }
    }

    function addRenewToCart () {
        var activeElement = $('#oldInfoYes');

        activeElement.find('.submitText').hide();
        activeElement.find('.loading').show();

        var data = {
            '_token'        : $('[name="_token"]').val(),
            'unique_id'     : unique_page_identifier,
            'sku'           : $('#sslRenew').attr('data-product-sku'),
            'action'        : 'renew',
            'auto_enroll'   : false
        };

        $.ajax({
            timeout     : 30000,
            type        : 'POST',
            data        : data,
            url         : urls['addToCart'],
            error       : function (e) {
                globalErrorsHandler(e);
            },
            success     : function (data) {
                if(data.success){
                    if ('cart_items' in  data.data)
                        $.each(data.data.cart_items, function (index, item) {
                            $.cart.insert(item.id, item.name, item.sub_name, item.total_price);
                        });
                    else
                        $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);

                    $('#sslRenew').addClass('hide-important').attr('data-cart-item-id', data.data.id);
                }else{
                    $.cart.errorHandler(data);
                }
            },
            complete    : function () {
                activeElement.find('.submitText').show();
                activeElement.find('.loading').hide();
            }
        });
    }

    function interactWithInstallation (data, form) {
        var interaction = data.interaction;

        $.ajax(
            new $.ajax_prototype({
                'type'      : 'POST',
                'url'       : form.attr('action'),
                'data'      : data,
                'success'   : function (data) {
                    if (data.success) {
                        if (interaction == 'order_completed') {
                            $('.tab-title:has([href="#installationServiceContent"]), [href="#installationServiceContent"], #installationServiceContent').remove();
                            $('[data-about="installationService"] .data-label').empty().append('<span class="label error align-left">' + $.translate('ssl.statuses.caps.inactive') + '</span>');
                            $('[href="#detailsContent"]:visible').trigger('click')
                        } else if (interaction == 'insert_ticket') {
                            var ticketIdDisplay = $('[data-about="ticket_id"]');

                            if (ticketIdDisplay.find('a').length) {
                                var ticketLink = ticketIdDisplay.find('a');

                                ticketLink.text('#' + data.data.ticket_id);
                                ticketLink.attr('href', 'https://helpdesk.dnhost.gr/display/' + data.data.ticket_id);
                            } else {
                                ticketIdDisplay.html('<a href="https://helpdesk.dnhost.gr/display/' + data.data.ticket_id + '">&num;' + data.data.ticket_id + '</a>');
                            }

                            var ticket_id = $('#ticket_id');

                            ticket_id.update_version_control(ticket_id.val());

                            closeLine(ticket_id.closest('.item'));
                        }

                        if (data.data.ssl_installation_status.name != 'pending') {
                            var status = $('[data-about="status"] .label');

                            status.removeClass('pending');

                            if (data.data.ssl_installation_status.name == 'completed') {
                                status.addClass('success').text($.translate('misc.statuses.completed'));
                            } else if (data.data.ssl_installation_status.name == 'processing') {
                                status.addClass('processing').text($.translate('misc.statuses.processing'));
                            } else {
                                status.addClass('error').text($.translate('misc.statuses.cancelled'));
                            }
                        }
                    } else {
                        if (data.code == error_codes.validation_error && 'notify_user' in data.data)
                            data.data.completed_notify = data.data.notify_user;

                        globalApplicationErrors(data, form.attr('id'));
                    }
                }
            }, form.attr('id'))
        )
    }
});