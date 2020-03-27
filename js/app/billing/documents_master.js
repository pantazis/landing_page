$(document).ready(function () {
    var $deleted                        = {},
        $toSave                         = {},
        defaultDocumentType             = null,
        current_legal_docs              = $('#attachDocumentsContent .legalDocsCont'),
        adminCustomerInteractionModal   = $('#adminCustomerInteractionModal');

    $fileList = {};

    $('#action_pay_document').on('click', function (e) {
        e.preventDefault();

        $('[href="#pendingDebitsContent"]').trigger('click');
        $('#pendingDebitsContent').addClass('active');
    });

    $('#action_cancel').on('click', function (e) {
        e.preventDefault();

        $('#cancelModal').modal_open()
    });

    $('#cancelSubmit').on('click', function (e) {
        e.preventDefault();

        data = {'_token' : $('[name="_token"]').val()};

        var comment = $('#cancelComment').val();
        if(comment)
            data['comments'] = comment;

        $.ajax(new $.ajax_prototype({
            type    : 'POST',
            url     : $('#action_cancel').attr('href'),
            data    : data,
            success : function (data) {
                if(data.success){
                    $('#actionCont').hide();

                    $('[href="#pendingDebitsContent"]').hide().closest('li').hide();
                    $('.label.open').toggleClass('open cancelled').text($.translate('DOCUMENTS.CREDITS.CANCELLED'));
                    $('#balancePrice').text('0,00').closest('.number').attr('class', 'number');
                    $('#updatedAt').text(data.data.document_updated_at);

                    $comment = $('[data-about="comment"]');

                    $comment.html($comment.html() + '<br>' + comment);
                    $('#cancelModal').modal_close();


                    $('#availableCreditsContent, #pendingDebitsContent').remove();
                    $('.tab-title:has([href="#availableCreditsContent"]), .tab-title:has([href="#pendingDebitsContent"])').remove();
                    $('[href="#availableCreditsContent"], [href="#pendingDebitsContent"]').remove();

                    $('.checkout_order_price, .checkout_order_vat, .checkout_order_total, #documentTotal, .item_price').text($.imperial_to_metric(0));
                    $('.document_actions').remove();
                }else{
                    masterDocumentsApplicationErrorsHandler(data);
                }
            }
        }))
    });

    $('#applyPayment').on('click', function (e) {
        // $('#paymentModal').modal_close();
        //
        // $('#paymentsLoader').show();

        $('[data-document-id="' + payDocument.data.credit_document + '"]').closest('.resp-table').find('.button').addClass('pending');

        $.ajax(payDocument);
    });

    $('.configure').on('click', function (e) {
        e.preventDefault();

        $(this).hide().closest('.item').find('.edit_order').show();
    });

    $('.configure, .item .delete').on('click', function () {
        $('#orderEditCont').show();
    });

    $('[name^="catalogPrice"]').on('change', function () {
        var obj = $(this),
            form    = obj.closest('.item_edit_form').find('.row'),
            target  = obj.attr('name').split('.')[1],
            price   = form.find('.columns:has([name="price.' + target + '"])'),
            setup_fee   = form.find('.columns:has([name="setup_fee.' + target + '"])');

        (obj.prop('checked') ? price.hide() : price.show());

        if(setup_fee.length)
            (obj.prop('checked') ? setup_fee.hide() : setup_fee.show());
    });

    $('select').each(function () {
        var obj = $(this);

        obj.apply_chosen(((obj.val()) ? obj.val() : ''));
    });

    $('.primary_delete').on('click', function (e) {
        e.preventDefault();

        var obj = $(this),
            id  = obj.closest('[data-order-item-id]').attr('data-order-item-id');

        $deleted[id] = true;

        // $(this).closest('.item').remove();

        var item = $(this).closest('.item');

        item.addClass('pendingDelete');

        item.find('.deleteItemOverlay.cross').remove();
        item.css('position', 'relative').append('<div class="deleteItemOverlay primary"><a href="#" class="undoDelete"><i class="icon-synchronize-4"></i></a></div>');
        item.find('.configure').show();
        item.find('.item_edit_form').hide();
    });

    $('.cross_delete').on('click', function (e) {
        e.preventDefault();

        var obj     = $(this),
            id      = obj.closest('[data-order-item-id]').attr('data-order-item-id'),
            parent  = obj.closest('.item').attr('data-order-item-id');

        if(!(parent in $deleted))
            $deleted[parent] = [];

        $deleted[parent].push(id);

        $('#' + obj.attr('data-target')).hide().addClass('pendingDelete');

        var item = obj.closest('.cross_sale').addClass('pendingDelete');



        item.css('position', 'relative').append('<div class="deleteItemOverlay cross"><a href="#" class="undoDelete"><i class="icon-synchronize-4"></i></a></div>');
        item.find('.configure').show();
        item.find('.item_edit_form').hide();

    });

    $('#reloadOrder').on('click', function (e) {
        e.preventDefault();

        var items = $('.item');

        items.find('[data-last-val]').each(function () {
            var obj = $(this);

            if(obj.is('select'))
                obj.chosen_update(obj.attr('data-last-val'));
            else
                obj.val(obj.attr('data-last-val'));
        });

        items.find('[name*="catalogPrice"]').prop('checked', true).change();
        items.find('.item_edit_form').hide();
        items.find('.deleteItemOverlay').remove();
        items.find('.configure').show();

        $('#orderEditCont').hide();
    });

    $('.cancel_changes').on('click', function (e) {
        e.preventDefault();

        var obj = $(this),
            cont = obj.closest('.item_edit_form');

        cont.find('[data-last-val]').each(function () {
            var obj = $(this);

            if(obj.is('select'))
                obj.chosen_update(obj.attr('data-last-val'));
            else
                obj.val(obj.attr('data-last-val'));
        });

        cont.hide().find('[name*="catalogPrice"]').prop('checked', true).change();
        obj.closest('.item').find('.configure').show();

        if(Object.keys($deleted).length < 1 && $('.item_edit_form:visible').length < 1)
            $('#orderEditCont').hide();
    });

    $('.submit-edit').on('click', function (e) {
        e.preventDefault();

        $('.item_edit_form:visible').each(function () {
            var form = $(this);

            form.find('select').each(function () {
                var duration    = $(this),
                    item        = duration.attr('id').split('_')[1];

                $toSave[item] = {duration : duration.val()};

                if($('#' + item + '_catalogPrice').prop('checked') == false)
                    $toSave[item]['price'] = $('#' + item + '_price').val();
            });
        });

        data = {
            '_token'    : $('[name="_token"]').val(),
            'delete'    : [],
            'edits'     : $toSave,
        };

        $.each($deleted, function (key, value) {
            if(value !== true){
                $.each(value, function (index, id){
                    data.delete.push(id);
                });
            }else{
                data.delete.push(key);
            }
        });

        if(typeof $orderItems != 'object')
            $orderItems = new $.ajax_prototype({
                type        : 'Post',
                url         : urls['edit'],
                success     : function (data) {
                    if(data.success){

                        $('.item.pendingDelete').each(function () {
                            var item = $(this);

                            item.find('.item_edit_form').remove();
                            item.find('.item_price').text($.imperial_to_metric(0));
                            item.find('.actions').remove();
                            item.find('.label').attr('class', 'label cancelled').text($.translate('DOCUMENTS.CREDITS.CANCELLED'));
                            item.find('.deleteItemOverlay').remove();
                            item.removeClass('pendingDelete');
                        });

                        $('.cross_sale.pendingDelete').each(function () {
                            var item = $(this);

                            item.find('.item_price').text($.imperial_to_metric(0));
                            item.find('.actions').remove();
                            item.find('.label').attr('class', 'label cancelled').text($.translate('DOCUMENTS.CREDITS.CANCELLED'));
                            item.find('.deleteItemOverlay').remove();
                            item.removeClass('pendingDelete');
                        });

                        $('#orderEditCont, .item_edit_form').hide();
                        $('.configure').show();

                        $('.checkout_order_price').text(data.data.sub_total);
                        $('.checkout_order_vat').text(data.data.vat.amount);
                        $('#vat_rate').text('(' + ((typeof data.data.vat.vat_rate == 'number') ? data.data.vat.vat_rate : 0) + '%)');
                        $('.checkout_order_total').text(data.data.grand_total);

                        var vatRate = (data.data.vat.vat_rate + 100) / 100;

                        $.each(data.data.items, function (key, value) {
                            var item    = $('.item[data-order-item-id="' + value.id + '"]'),
                                length  = value.billing.length.selected;

                            if(length < 12){
                                length = length + ' ' + $.translate('LENGTH.MONTH', length);
                            }else{
                                length = length / 12;
                                length = length + ' ' + $.translate('LENGTH.YEAR', length);
                            }

                            item.find('.duration:first span').text(length);
                            item.find('div.label:first').attr('class', 'label ' + value.status.data).text(value.status.display);
                            item.find('.item_price:first').text($.imperial_to_metric(value.billing.price.total));
                            $('#' + value.id + '_price').val(value.billing.price.total);

                            var vattedPrice = value.billing.price.total;

                            if ('setup_fee' in value.billing.price)
                                vattedPrice += parseFloat(value.billing.price.setup_fee);

                            item.find('[data-last-val]').each(function () {
                                var obj = $(this);

                                obj.attr('data-last-val', obj.val());
                            });

                            item.find('.vatted-price').text($.imperial_to_metric(vattedPrice * vatRate));
                        });

                        if('cross_sell' in data.data && Object.keys(data.data.cross_sell).length){
                            $.each(data.data.cross_sell, function (key, value) {
                                var item    = $('.cross_sale[data-order-item-id="' + value.id + '"]'),
                                    length  = value.billing.length.selected;

                                if(length < 12){
                                    length = length + ' ' + $.translate('LENGTH.MONTH', length);
                                }else{
                                    length = length / 12;
                                    length = length + ' ' + $.translate('LENGTH.YEAR', length);
                                }

                                item.find('.duration:first span').text(length);
                                item.find('div.label:first').attr('class', 'label ' + value.status.data).text(value.status.display);
                                item.find('.item_price:first').text($.imperial_to_metric(value.billing.price.total));
                            });
                        }

                        $('#documentTotal').text(data.data.grand_total + ' €');

                        if($('.document .status').length == $('.document .status .cancelled').length){
                            $('#inlineStatus, #documentStatus').attr('class', 'label cancelled').text($.translate('DOCUMENTS.CREDITS.CANCELLED'));
                            $('#balancePrice').text($.imperial_to_metric(0));
                            $('#documentBalance').removeClass('negative-balance');
                        }else{
                            $('#balancePrice').text(data.data.balance);
                        }
                    }else{
                        masterDocumentsApplicationErrorsHandler(data);
                    }
                }
            });

        $orderItems.data = data;

        $.ajax($orderItems);
    });

    $('#addLegalDocument').on('click', function (e) {
        e.preventDefault();

        $('#newLegalDocument').activation(true, function (modal) {
            modal = $(modal);

            if (defaultDocumentType == null) {
                defaultDocumentType = modal.find('#documentType').val();
            } else {
                var documentType = modal.find('#documentType');

                if (documentType.val() != defaultDocumentType) {
                    documentType.chosen_update(defaultDocumentType);
                }
            }

            modal.find('#reference').focus();

        });
    });

    $('.custom-modal .modal-cancel').on('click', function (e) {
        e.preventDefault();

        $('#newLegalDocument').activation(false, function (modal) {
            var form = modal.find('form');

            form.find('.error').removeClass('error');
            form.find('.help-block').remove();

            form.find('[type="text"]:not([name="_token"]), textarea').val('');
            form.find('select').chosen_update('');
        });
    });

    $('#legal_document_form').prepare_form_advanced({
        onSuccess           : function (form) {
            legal_doc_con = new $.ajax_prototype({
                type    : 'POST',
                url     : urls.attach_new_document,
                success : function (data) {
                    if(data.success){
                        var legal_documents = data.data.sale_document.legal_documents,
                            legalDocCont    = $('#legalDocsCont');

                        $.each(legal_documents, function (key, value) {
                            if($('[data-legal-doc="' + value.id + '"]').length < 1){
                                legalDocCont.append($('#legalDocTemplate').html()
                                    .replace(/##id##/g, value.id)
                                    .replace(/##document_type##/g, $.translate('DOCUMENTS.LEGAL_DOCUMENTS.TYPES.' + (value.legal_document_type.name).toUpperCase()))
                                    .replace(/##reference##/g, value.reference)
                                    .replace(/##comments##/, ((value.comments) ? value.comments.replace(/\n/g, '<br>') : $.html_encoder.decode('&ndash;')))
                                    .replace(/##comments##/, value.comments)
                                    .replace(/##init_user##/, value.initiated_by)
                                    .replace(/##created_at##/, value.created_at)
                                );

                                var last_legal_doc  = $('[data-legal-doc]:last');

                                hookDropZoneToForm(last_legal_doc.find('.dropzone'));

                                last_legal_doc.find('h5').css('background-color',(value.legal_document_type.name == 'receipt' ? '#fd9662' : '#18BF93'));
                            }
                        });

                        $('[href="#attachDocumentsContent"]').translate('DOCUMENTS.LEGAL_DOCUMENTS.TITLE', data.data.legal_documents_count, {'count' : data.data.legal_documents_count});

                        $('.custom-modal .modal-cancel').click();

                        $('#noLegalDocWrn').hide();
                    }else{
                        globalApplicationErrors(data);
                    }
                }
            },'legal_document_form');

            legal_doc_con.data = form.serialize();

            $.ajax(legal_doc_con);
        },
        handlers            : '#btn-submit',
        disable             : '#btn-submit, .modal-cancel',
        version_exception   : true
    });

    $('#action_retry').on('click', function (e) {
       e.preventDefault();

       var obj = $(this);

       $.ajax(
           new $.ajax_prototype({
               'type'       : 'POST',
               'url'        : obj.attr('href'),
               'data'       : {
                   '_token' : $('[name="_token"]').val()
               },
               'success'    : function (data) {
                   $.alertHandler('', data.msg, (data.success ? alert_box_success : alert_box_failure));
               }
           })
       )
    });

    $(document)
        .on('click', '.button.pay', function (e) {
            e.preventDefault();

            var obj = $(this);

            if(typeof payDocument != 'object')
                payDocument = new $.ajax_prototype({
                    type                        : 'POST',
                    url                         : obj.attr('href'),
                    data                        : {
                        '_token' : $('[name="_token"]').val(),
                        'action' : paying_method
                    },
                    success                     : function (data) {
                        if (data.success) {
                            var $sale_document = data.data.sale_document;
                            $('#balancePrice').imperial_to_metric($sale_document.balance.display);
                            $('#documentStatus, #inlineStatus').statuses_update($sale_document.status.data, $sale_document.status.display);
                            $('#updatedAt').text($sale_document.update_date.display).closest('.item').show();

                            if ($sale_document.balance.display == 0)
                                $('#documentBalance').attr('class', 'number');

                            if ('completed_on' in $sale_document)
                                $('#completedOn').text($sale_document.completed_on.display).closest('.item').show();

                            if ('updated_by' in $sale_document)
                                $('#updatedBy').text($sale_document.updated_by.display);


                            if ('open_debit_documents' in data.data) {
                                if (data.data.open_debit_documents.documents == 0) {
                                    $('li:has([href="#pendingDebitsContent"])').addClass('hide-important');
                                    $('.accordion_links[href="#pendingDebitsContent"]').addClass('hide-important');

                                    $('#pendingDebitsContent').hide();
                                    $('[href="#detailsContent"]:first').click();
                                } else {
                                    $('[href="#pendingDebitsContent"]').translate('TRANS.DOCUMENTS.TABS.PAY_DOCUMENTS', data.data.open_debit_documents.documents, {'count': data.data.open_debit_documents.documents});

                                    if($.getSizeClassification('medium_up'))
                                        $('li:has([href="#pendingDebitsContent"])').removeClass('hide-important').show();
                                    else
                                        $('.accordion_links[href="#pendingDebitsContent"]').removeClass('hide-important').show();

                                    var pendingDebitsContent = $('#pendingDebitsContent');

                                    if (pendingDebitsContent.find('.responsiveTableRow').length)
                                        reloadTable(pendingDebitsContent);
                                }
                            }


                            if ('open_credit_documents' in data.data) {
                                if (data.data.open_credit_documents.documents == 0) {
                                    $('li:has([href="#availableCreditsContent"])').addClass('hide-important');
                                    $('.accordion_links[href="#availableCreditsContent"]').addClass('hide-important');

                                    $('#availableCreditsContent').hide();
                                } else {
                                    $('[href="#availableCreditsContent"]').translate('TRANS.DOCUMENTS.TABS.PAY_DOCUMENTS', data.data.open_credit_documents.documents, {'count': data.data.open_credit_documents.documents});

                                    if($.getSizeClassification('medium_up'))
                                        $('li:has([href="#availableCreditsContent"])').removeClass('hide-important').show();
                                    else
                                        $('.accordion_links[href="#availableCreditsContent"]').removeClass('hide-important').show();

                                    var availableCreditsContent = $('#availableCreditsContent');

                                    if (availableCreditsContent.find('.responsiveTableRow').length)
                                        reloadTable(availableCreditsContent);
                                }
                            }


                            if ('document_use' in data.data) {
                                if (data.data.document_use == 0) {
                                    $('li:has([href="#documentUseContent"])').addClass('hide-important');
                                    $('.accordion_links[href="#documentUseContent"]').addClass('hide-important');

                                    $('#documentUseContent').hide();
                                } else {
                                    $('[href="#documentUseContent"]').translate(('TRANS.DOCUMENTS.TABS.PAYMENTS.' + ((data.data.transaction.display == 'credit') ? 'USED_TO_PAY_DOCUMENT' : 'PAID_BY_DOCUMENTS')), data.data.document_use, {'count': data.data.document_use});

                                    if($.getSizeClassification('medium_up'))
                                        $('li:has([href="#documentUseContent"])').removeClass('hide-important').show();
                                    else
                                        $('.accordion_links[href="#documentUseContent"]').removeClass('hide-important').show();

                                    var documentUseContent = $('#documentUseContent');

                                    if (documentUseContent.find('.responsiveTableRow').length)
                                        reloadTable(documentUseContent);
                                }
                            }

                            if($sale_document.status.data == 'completed')
                                $('#action_pay_document, #action_cancel').hide();


                            if($('.content:visible').length < 1)
                                $('[href="#detailsContent"]:first').click();

                        } else {
                            billingDocumentsApplicationErrors(data);
                        }
                    },
                    complete                    : function () {
                        $('[data-document-id="' + payDocument.data.credit_document + '"]').closest('.resp-table').find('.button').removeClass('pending');

                        if(typeof reloadStarted != 'undefined' && !reloadStarted)
                            $('#paymentsLoader').hide();
                    },
                    postbeforesendcallback      : function () {
                        $('#paymentModal .button').addClass('disabled');

                        var approveBtn = $('#applyPayment');

                        approveBtn.find('.submitText').hide();
                        approveBtn.find('.loading').show();
                    },
                    postcompletecallback        : function () {
                        var modal       = $('#paymentModal'),
                            approveBtn  = $('#applyPayment');

                        modal.modal_close();
                        modal.find('.button').removeClass('disabled');

                        approveBtn.find('.submitText').show();
                        approveBtn.find('.loading').hide();
                    }
                });

            payDocument.data.credit_document    = parseInt($('[data-document-id]').attr('data-document-id'));
            payDocument.data.debit_document     = parseInt(obj.closest('.responsiveTableRow').find('.id a').text());

            $('#paymentModal').modal_open();
        })
        .on('click', function (e) {
            var statusList  = $('#statusList.active'),
                profileList = $('#billingProfileList.active');

            if(statusList.length){
                var trigger = $('#toggleStatusList');

                if(!statusList.is(e.target) && statusList.has(e.target).length < 1 && !trigger.is(e.target) && trigger.has(e.target).length < 1){
                    statusList.css('left', '-9999px').removeClass('active');
                }
            }

            if(profileList.length){
                trigger = $('#toggleProfileList');

                if(!profileList.is(e.target) && profileList.has(e.target).length < 1 && !trigger.is(e.target) && trigger.has(e.target).length < 1){
                    profileList.css('left', '-9999px').removeClass('active');
                }
            }
        })
        .on('click', '.configure', function (e) {
            e.preventDefault();

            $(this).hide().closest('.item').find('.item_edit_form').show();
        })
        .on('click', '.undoDelete', function (e) {
            e.preventDefault();

            var overlay = $(this).closest('.deleteItemOverlay'),
                item    = overlay.closest('[data-order-item-id]');

            type = overlay.attr('class').replace('deleteItemOverlay ', '').trim();

            if(type == 'primary'){
                item.find('.item_edit_form .pendingDelete').removeClass('pendingDelete').show();

                delete $deleted[overlay.closest('.item').attr('data-order-item-id')];
            }else{
                var temp    = [],
                    target  = overlay.closest('.item').attr('data-order-item-id'),
                    remove  = overlay.closest('.cross_sale').attr('data-order-item-id');

                $.each($deleted[target], function (key, value) {
                    if(value != remove)
                        temp.push(value);
                });

                if(temp.length)
                    $deleted[target] = temp;
                else
                    delete $deleted[target];

                $('#cross_' + item.attr('data-order-item-id')).removeClass('pendingDelete').show();
            }

            item.removeClass('pendingDelete');

            overlay.remove();

            if(Object.keys($deleted).length < 1 && $('.item_edit_form:visible').length < 1)
                $('#orderEditCont').hide();
        })
        .on('click', '.edit_btn', function (e) {
            e.preventDefault();

            var obj = $(this);

            if(obj.hasClass('legal_doc_edit_btn'))
                openLegalDocEditableForm(obj);
            else
                openEditableForm(obj);
        })
        .on('click', '.legal_doc_edit_btn', function (e) {
            e.preventDefault();

            openLegalDocEditableForm($(this));
        })
        .on('change', '[name="is_locked"]', function () {
            var obj         = $(this),
                form        = obj.closest('form'),
                document    = obj.closest('[data-legal-doc]').attr('data-legal-doc');

            legal_doc_locked_obj = new $.ajax_prototype({
                type        : 'POST',
                url         : urls.update_legal_document,
                data        : {
                    '_token'    : form.find('[name="_token"]').val(),
                    'action'    : form.find('[name="action"]').val(),
                    'is_locked' : ((obj.prop('checked')) ? 1 : -1),
                    'legal_doc' : document
                },
                document    : document,
                success     : function (data, instance) {
                    if(data.success){
                        var document = $('[data-legal-doc="' + instance.document + '"]'),
                            switcher = document.find('.switch input');

                        if(switcher.prop('checked')){
                            document.find('.edit_btn').closest('.columns').hide();
                            document.find('.detach_doc').closest('.item').hide();

                            var dropzone    = document.find('.dropzone'),
                                dzRemoves   = dropzone.find('.dz-remove');

                            if(dzRemoves.length){
                                dropzone.css('pointer-events', 'none');
                                dzRemoves.hide();
                                dropzone.find('.dz-download').css('pointer-events', 'initial');
                            }else{
                                dropzone.closest('.item').hide();
                            }
                        }else{
                            document.find('.edit_btn').closest('.columns').show();
                            document.find('.detach_doc').closest('.item').show();

                            dropzone    = document.find('.dropzone');
                            dzRemoves   = dropzone.find('.dz-remove');

                            if(dzRemoves.length){
                                dropzone.css('pointer-events', 'initial');
                                dzRemoves.show();
                            }else{
                                dropzone.closest('.item').show();
                            }
                        }
                    }else{
                        switcher = $('[data-legal-doc="' + instance.document + '"]').find('.switch input');

                        switcher.prop('checked', !switcher.prop('checked'));
                        globalApplicationErrors(data);
                    }
                },
                error       : function (e) {
                    globalErrorsHandler(e);
                }
            });

            $.ajax(legal_doc_locked_obj);
        })
        .on('click', '.detach_doc', function (e) {
            e.preventDefault();
            var obj         = $(this),
                document    = obj.closest('.editable-form').attr('data-legal-doc');

            $.ajax(new $.ajax_prototype({
                    type        : 'POST',
                    url         : urls.detach_document.replace('##legalId##', document),
                    data        : {
                        '_token'    : $('[name="_token"]').val(),
                        'legal_doc' : document
                    },
                    document    : document,
                    success     : function (data) {
                        if(data.success){
                            $('[data-legal-doc="' + this.document + '"]').remove();

                            var legal_docs_count = $('[data-legal-doc]').length;
                            if(legal_docs_count < 1)
                                $('#noLegalDocWrn').show();

                            $('[href="#attachDocumentsContent"]').translate('DOCUMENTS.LEGAL_DOCUMENTS.TITLE', legal_docs_count, {'count' : legal_docs_count});
                        }else{
                            globalApplicationErrors(data);
                        }
                    }
                })
            )
        })
        .on('change', '.installation_actions', function () {
            interactionMadeWithItem($(this));
        })
        .on('click', '.ssl_installation_actions', function (e) {
            e.preventDefault();

            var obj = $(this);

            obj.find('[class*="icon-arrow"]').toggleClass('icon-arrow-down2 icon-arrow-up2');
            obj.closest('[data-order-item-id]').find('.ssl_actions').slideToggle();
        });

    $('[href="#attachDocumentsContent"]').on('click', function () {
        if ($('#attachDocumentsContent #legalDocsCont > .row').length < 1) {
            $('#addLegalDocument').trigger('click');
        }
    });

    $.observers.register('interaction_modal', function (mutations) {
        if (! adminCustomerInteractionModal.hasClass('open')) {
            $('.installation_actions').chosen_update('');
            $('#helpdeskUrlContainer').hide().find('input').val('');
        }
    });
    $.observers.observe('interaction_modal', adminCustomerInteractionModal, {attributes:true, attributeFilter:['class']});

    window.addEventListener('resize', function () {
        try {
            clearTimeout(documentResizeCounter);
        } catch (e) {}

        documentResizeCounter = setTimeout(function () {
            fixSslActionsSize();
        }, 100);
    });

    $('form.dropzone').each(function () {
        var form = $(this);

        hookDropZoneToForm(form);
    });



    var $cookie_name = 'order_edit' + $('[data-document-id]').attr('data-document-id');

    $.cookieHandler($cookie_name, function ($value) {
        var msg = $value;

        setTimeout(function(){
            if(msg == 'success'){
                $.alertHandler('', $.translate('DOCUMENTS.DEBITS.ORDER.EDIT.SUCCESS'), alert_box_success);
            }else{
                msg = JSON.parse(msg);

                var modal       = $('#invalidOrderEditModal'),
                    error_temp  = modal.find('.errors')[0].outerHTML,
                    display     = modal.find('.error_display').empty();

                modal.modal_open();

                $.each(msg, function (error, items) {
                    $.each(items, function (index, item){
                        var $error = display.append(error_temp).find('.errors:last');

                        $error.find('.item').text($('[data-order-item-id="' + item + '"]').find('.description:first strong').text() || item);
                        $error.find('.error_type').text($.translate('DOCUMENTS.DEBITS.ORDER.EDIT.FAILURE.' + error));
                    });
                });
            }
        },100);
    });

    // if(Cookies.get($cookie_name)){
    //     var msg = Cookies.get($cookie_name);
    //
    //     setTimeout(function(){
    //         if(msg == 'success'){
    //             $.alertHandler('', $.translate('DOCUMENTS.DEBITS.ORDER.EDIT.SUCCESS'), alert_box_success);
    //         }else{
    //             msg = JSON.parse(msg);
    //
    //             var modal       = $('#invalidOrderEditModal'),
    //                 error_temp  = modal.find('.errors')[0].outerHTML,
    //                 display     = modal.find('.error_display').empty();
    //
    //             modal.modal_open();
    //
    //             $.each(msg, function (error, items) {
    //                 $.each(items, function (index, item){
    //                     var $error = display.append(error_temp).find('.errors:last');
    //
    //                     $error.find('.item').text($('[data-order-item-id="' + item + '"]').find('.description:first strong').text() || item);
    //                     $error.find('.error_type').text($.translate('DOCUMENTS.DEBITS.ORDER.EDIT.FAILURE.' + error));
    //                 });
    //             });
    //         }
    //     },100);
    //
    //     Cookies.remove($cookie_name);
    // }

    $.cookieHandler('open_tab', function (value) {
        setTimeout(function(){
            $('[href="#documentUseContent"]:first').click()
        },110);
    });
    // if(Cookies.get('open_tab')){
    //     setTimeout(function(){
    //         $('[href="#documentUseContent"]:first').click()
    //     },110);
    //
    //     Cookies.remove('open_tab');
    // }

    Dropzone.autoDiscover = false;

    fixSslActionsSize();

    function reloadTable (tableContainer) {
        var $tableName      = tableContainer.find('.resp-table').responsive_tables('findTableInConfig'),
            filters         = Object.keys($.responsive_tables.getFiltersForTable($tableName)),
            currentPage     = tableContainer.find('.pagination .current .pageEnum').attr('data-page');

        reloadStarted = true;

        if(filters.length)
            tableContainer.responsive_tables('clear_filtersForTable', false);

        var $sort = tableContainer.find('[data-sorting="id"]').find('.desc');

        if($sort.hasClass('active')){
            respoConf.init_connections[respoConf.init[$tableName].name].url = $.responsive_tables.getURL($tableName);

            var newConnectionObj = new $.ajax_prototype($.extend(respoConf.init_connections[respoConf.init[$tableName].name], {
                'postsuccesscallback' : function () {
                    $('#paymentsLoader').hide();
                }
            }), null, {
                complete : function () {
                    if(tableContainer.find('[data-page="' + currentPage + '"]').length) {
                        tableContainer.find('.pagination .current').removeClass('current');
                        tableContainer.find('.pagination li:has([data-page="' + currentPage + '"])').addClass('current');
                    }

                    reloadStarted = false;
                }
            });

            $.ajax(newConnectionObj);
        }else{
            $sort.click();
        }
    }

    function openEditableForm (obj) {
        var form = obj.closest('.editable_line').find('form');

        if(!form.is_ready())
            form.prepare_form_advanced(prepareForm(form));
    }

    function openLegalDocEditableForm (obj) {
        var form = obj.closest('.editable_line').find('form');

        if(!form.is_ready())
            form.prepare_form_advanced(prepareLegalDocForm(form));
    }

    function prepareForm(form){
        var formid = form.attr('id');

        switch (formid){
            case 'comments_form':
                return {
                    onSuccess   : function () {
                        var form = $('#comments_form');

                        if(typeof comment_obj != 'object')
                            comment_obj = new $.ajax_prototype({
                                type    : 'POST',
                                url     : urls.update_document,
                                success : function (data) {
                                    editCommentRequestHandler(data);
                                }
                            }, 'comments_form');

                        comment_obj.data = form.serialize();

                        $.ajax(comment_obj);
                    },
                    handlers    : '.form-edit',
                    disable     : '.form-edit, .cancel',
                    callback    : {
                        'after:prepare' : function (form) {
                            setFieldsVersionControl(form);
                        }
                    }
                };
            case 'reference_form':
                return {
                    onSuccess   : function () {
                        var form = $('#reference_form');

                        if(typeof reference_obj != 'object')
                            reference_obj = new $.ajax_prototype({
                                type    : 'POST',
                                url     : urls.update_document,
                                success : function (data) {
                                    editReferenceRequestHandler(data);
                                }
                            }, 'reference_form');

                        reference_obj.data = form.serialize();

                        $.ajax(reference_obj);
                    },
                    handlers    : '.form-edit',
                    disable     : '.form-edit, .cancel',
                    callback    : {
                        'after:prepare' : function (form) {
                            setFieldsVersionControl(form);
                        }
                    }
                };
            case 'status_form':
                return {
                    onSuccess   : function () {
                        var form = $('#status_form');

                        if(typeof status_obj != 'object')
                            status_obj = new $.ajax_prototype({
                                type    : 'POST',
                                url     : urls.update_document,
                                success : function (data) {
                                    editStatusRequestHandler(data);
                                }
                            }, 'status_form');

                        status_obj.data = {
                            '_token' : $('[name="_token"]').val(),
                            'task_name' : form.find('[name="task_name"]').val(),
                            'status' : $('[name="status"]').val(),
                        };

                        $.ajax(status_obj);
                    },
                    handlers    : '.form-edit',
                    disable     : '.form-edit, .cancel',
                    callback    : {
                        'after:prepare' : function (form) {
                            setFieldsVersionControl(form);
                        }
                    }
                };
            case 'billing_form':
                return {
                    onSuccess   : function () {
                        var form = $('#billing_form');

                        if(typeof billing_obj != 'object')
                            billing_obj = new $.ajax_prototype({
                                type    : 'POST',
                                url     : urls.update_document,
                                success : function (data) {
                                    editBillingProfileRequestHandler(data);
                                }
                            }, 'billing_form');

                        billing_obj.data = form.serialize();

                        $.ajax(billing_obj);
                    },
                    handlers    : '.form-edit',
                    disable     : '.form-edit, .cancel',
                    callback    : {
                        'after:prepare' : function (form) {
                            setFieldsVersionControl(form);
                        }
                    }
                };
        }
    }

    function prepareLegalDocForm(form){
        var formid = form.attr('id');

        if(formid.indexOf('legal_doc_reference_form') > -1)
            return {
                    onSuccess   : function (form) {
                        var formId =  form.attr('id');

                        legal_doc_ref_obj = new $.ajax_prototype({
                            type    : 'POST',
                            url     : urls.update_legal_document,
                            success : function (data, instance) {
                                if(data.success){
                                    var document    = $('[data-legal-doc="' + instance.document + '"]'),
                                        reference   = document.find('[name="reference"]');

                                    reference.update_version_control();

                                    document.find('[data-about="reference"]').text(reference.val());

                                    closeLine(reference.closest('.item'));
                                }else{
                                    globalApplicationErrors(data);
                                }
                            }
                        }, formId);

                        var document = form.closest('[data-legal-doc]').attr('data-legal-doc');

                        legal_doc_ref_obj.data = {
                            '_token'    : form.find('[name="_token"]').val(),
                            'action'    : form.find('[name="action"]').val(),
                            'reference' : form.find('[name="reference"]').val(),
                            'legal_doc' : document
                        };

                        legal_doc_ref_obj.document = document;

                        $.ajax(legal_doc_ref_obj);
                    },
                    handlers    : '.submit-edit',
                    disable     : '.submit-edit, .cancel',
                    callback    : {
                        'after:prepare' : function (form) {
                            setFieldsVersionControl(form);
                        }
                    }
                };
        else if(formid.indexOf('legal_docs_comments_form') > -1)
            return {
                    onSuccess   : function (form) {
                        var formId =  form.attr('id');

                        legal_doc_com_obj = new $.ajax_prototype({
                            type    : 'POST',
                            url     : urls.update_legal_document,
                            success : function (data, instance) {
                                if(data.success){
                                    var document    = $('[data-legal-doc="' + instance.document + '"]'),
                                        comments   = document.find('[name="comments"]');

                                    comments.update_version_control();

                                    document.find('[data-about="comments"]').html(comments.val().replace(/\n/g,'<br>'));

                                    closeLine(comments.closest('.item'));
                                }else{
                                    globalApplicationErrors(data);
                                }
                            }
                        }, formId);

                        var document = form.closest('[data-legal-doc]').attr('data-legal-doc');

                        legal_doc_com_obj.data = {
                            '_token'    : form.find('[name="_token"]').val(),
                            'action'    : form.find('[name="action"]').val(),
                            'comments'  : form.find('[name="comments"]').val(),
                            'legal_doc' : document
                        };

                        legal_doc_com_obj.document = document;

                        $.ajax(legal_doc_com_obj);
                    },
                    handlers    : '.submit-edit',
                    disable     : '.submit-edit, .cancel',
                    callback    : {
                        'after:prepare' : function (form) {
                            setFieldsVersionControl(form);
                        }
                    }
                };
    }

    function updateDocument (form, document, route) {
        closeLine(form.closest('.item'));

        $('#inlineStatus, #documentStatus').attr('class', 'label ' + document.sale_document.status.data).text(document.sale_document.status.display);
        $('#documentTotal').text($.imperial_to_metric(document.sale_document.total.display) + ' €');
        $('#balancePrice').text($.imperial_to_metric(document.sale_document.balance.display));

        if(document.sale_document.balance.display == 0)
            $('#documentBalance').attr('class', 'number');


        if(document.type == 'order'){
            $('.checkout_order_price').text($.imperial_to_metric(document.sub_total.display));
            $('.checkout_order_vat').text($.imperial_to_metric(document.vat_total.display.amount));
            $('.checkout_order_total').text($.imperial_to_metric(document.sale_document.total.display));
            $('#vat_rate').text('(' + ((document.vat_total.display.amount > 0) ? document.vat_total.display.vat_rate : 0)+ '%)');
        }

        var billingSelector = $('#billingProfileSelector');

        if(document.sale_document.billing_profile.display != null){
            billingSelector.update_version_control();

            if(document.sale_document.billing_profile.display.type == 'rec')
                $('#billingProfile').html('<a href="' + route + '">#' + document.sale_document.billing_profile.display.id + ' ' + $.translate('BILLING.TYPE.REC') + '</a>');
            else
                $('#billingProfile').html('<a href="' + route + '">#' + document.sale_document.billing_profile.display.id + ' ' + document.sale_document.billing_profile.display.name + '</a>');
        }

        if('associated' in document && document.associated.children > 0){
            var associatedLink = $('[href="#associatedDocumentsContent"]');

            $('li:has([href="#associatedDocumentsContent"])').show();
            associatedLink.text($.translate('DOCUMENTS.TABS.ASSOCIATED', document.associated.children, {'count' : document.associated.children}));

            if(!$.getSizeClassification('medium_up'))
                associatedLink.show();
        }

        if(document.authorized.statuses.length === 0){
            var status_form = $('#status_form'),
                item        = status_form.closest('.item');

            item.find('.content_form').remove();
            item.find('.edit_btn').closest('div').remove();
        }else{
            status_form = $('#status_form');

            var status_selector = status_form.find('#statusSelector');

            status_selector.find('option').remove();

            $.each(document.authorized.statuses, function (key, value) {
                status_selector.append('<option value="' + value + '">' + $.translate('DOCUMENTS.STATUSES.' + value) + '</option>');
            });

            status_selector.chosen_update('').update_version_control();
        }

        if('reference' in document && typeof document.reference.display == 'string') {
            $('[data-about="reference"]').set_text(document.reference.display);

            $('[name="reference"]').update_version_control();
        }

        if('comments' in document) {
            var comment_display = document.comments.display;
            $('[data-about="comment"]').set_text((comment_display != null) ? comment_display.replace(/\r\n/g, '<br>') : '');

            $('[name="comments"]').update_version_control();
        }


        if('sale_order_items' in document){
            $.each(document.sale_order_items, function (index, group) {
                if(group.constructor == Array)
                    var $length = group.length;
                else if(group.constructor == Object)
                    $length = Object.keys(group).length;

                var $editableItems = false;

                if($('.item_edit_form').length)
                    $editableItems = true;

                if($length > 0)
                    $.each(group, function (key, value) {
                        var $item       = $('[data-order-item-id="' + value.id + '"]').find('.row:first'),
                            duration;

                        if (value.billing.length.selected != null)
                            duration = ((value.billing.length.selected < 12) ? (value.billing.length.selected + ' ' + $.translate('LENGTH.MONTH', value.billing.length.selected)) : ((value.billing.length.selected/12)+ ' ' + $.translate('LENGTH.YEAR', (value.billing.length.selected/12))));
                        else
                            duration = '-';

                        $item.find('.duration span').text(duration);
                        $item.find('.price .item_price').text($.imperial_to_metric(value.billing.price.total));

                        if('setup_fee' in value.billing.price)
                            $item.find('.price .set-up-price').text($.imperial_to_metric(value.billing.price.setup_fee));

                        if($editableItems){
                            $('#duration_' + value.id).chosen_update(value.billing.length.selected).update_version_control();
                            $('#' + value.id + '_price').val(value.billing.price.total).update_version_control();

                            if('setup_fee' in value.billing.price)
                                $('#' + value.id + '_setup_fee').val(value.billing.price.setup_fee).update_version_control();
                        }

                        $item.find('.status .label').attr('class', 'label ' + value.status.data).text(value.status.display);
                    });
            });
        }
    }

    function editCommentRequestHandler (data) {
        if(data.success){
            updateDocument($('#comments_form'), data.data.document, data.data.route);
        }else{
            masterDocumentsApplicationErrorsHandler(data);
        }
    }

    function editReferenceRequestHandler (data) {
        if(data.success){
            updateDocument($('#reference_form'), data.data.document, data.data.route);
        }else{
            masterDocumentsApplicationErrorsHandler(data);
        }
    }

    function editStatusRequestHandler (data) {
        if(data.success){
            updateDocument($('#status_form'), data.data.document, data.data.route);
        }else{
            masterDocumentsApplicationErrorsHandler(data);
        }
    }

    function editBillingProfileRequestHandler (data) {
        if(data.success){
            updateDocument($('#billing_form'), data.data.document, data.data.route);
        }else{
            masterDocumentsApplicationErrorsHandler(data);
        }
    }

    function hookDropZoneToForm (form) {
        form.dropzone({
            'url'                       : form.attr('action'),
            'method'                    : 'post',
            'addRemoveLinks'            : true,
            'createImageThumbnails'     : true,
            'init'                      : function () {
                var dropzone    = this,
                    docId       = form.closest('[data-legal-doc]').attr('data-legal-doc');

                dropzone
                    .on("removedfile", function(file) {
                        if('duplicate' in file)
                            return ;

                        var form = $(dropzone.element);

                        if(file.name in uploadedFiles[form.attr('id')]){
                            var files           = form.find('.dz-preview');

                            if(files.length == 0)
                                Dropzone.options[form.attr('id')].files = [];

                            $.ajax({
                                'type'          : 'POST',
                                'timeout'       : 30000,
                                'data'          : {
                                    '_token'    : $('[name="_token"]').val(),
                                    'file'      : uploadedFiles[form.attr('id')][file.name].id
                                },
                                'error'         : function (e) {
                                    globalErrorsHandler(e);
                                },
                                'success'       : function (data) {
                                    if(data.success){

                                    }else{
                                        var file        = this.file,
                                            dropzone    = this.myDropzone,
                                            form        = $(dropzone.element);

                                        dropzone.options.addedfile.call(dropzone, file);
                                        dropzone.emit("complete", file);

                                        var $preview = $('.dz-preview:last');

                                        $preview.append('<a href="' + urls.download_file.replace('##legalId##', docId).replace('##fileId##', uploadedFiles[form.attr('id')][file.name].id) + '" target="_blank" class="dz-download">' + $.translate('FILE_MANAGE.DOWNLOAD') + '</a>');

                                        $.alertHandler('', data.msg, alert_box_failure);
                                    }
                                },
                                'url'           : urls.delete_file.replace('##legalId##', form.closest('[data-legal-doc]').attr('data-legal-doc')),
                                'file'          : {
                                    'name'      : file.name,
                                    'size'      : file.size,
                                    'preview'   : file.previewElement
                                },
                                'myDropzone'    : dropzone
                            }, 'uploadForm');
                        }
                    })
                    .on('success', function (file, response) {
                        var form = $(dropzone.element);

                        if(response.success){
                            uploadedFiles[form.attr('id')][file.name] = {};
                            uploadedFiles[form.attr('id')][file.name].id = response.data.file;

                            $(file.previewElement).append('<a target="_blank" href="' + urls.download_file.replace('##legalId##', docId).replace('##fileId##', response.data.file) + '" class="dz-download">' + $.translate('FILE_MANAGE.DOWNLOAD') + '</a>');
                        }else{
                            if(response.code == error_codes.duplicate_file_on_legal_document)
                                file.duplicate = true;

                            file['_removeLink'].click();
                            $.alertHandler('', response.msg, alert_box_failure);
                        }
                    });

                var files       = uploadedFiles[form.attr('id')],
                    formFiles   = [];



                var formId = form.attr('id');
                Dropzone.options[formId] = dropzone;

                if(typeof files != 'undefined' && Object.keys(files).length){
                    $.each(files, function (key, value) {
                        var file = {name: value.name, size: value.size};
                        dropzone.options.addedfile.call(dropzone, file);
                        dropzone.emit("complete", file);

                        var $preview = $(dropzone.previewsContainer).find('.dz-preview:last');
                        $preview.append('<a target="_blank" href="' + urls.download_file.replace('##legalId##', docId).replace('##fileId##', value.id) + '" class="dz-download">' + $.translate('FILE_MANAGE.DOWNLOAD') + '</a>');

                        $fileList[value.name] = value.id;
                        formFiles.push(new File([''], value.name));
                    });
                    Dropzone.options[formId].files = formFiles;
                }else{
                    Dropzone.options[formId].files = [];
                    uploadedFiles[form.attr('id')] = {};
                }

                var lockTrigger = form.closest('.editable-form').find('[name="is_locked"]');

                if(lockTrigger.length < 1 || lockTrigger.prop('checked')){
                    form.css('pointer-events', 'none');
                    form.find('.dz-remove').hide();
                    form.find('.dz-download').css('pointer-events', 'initial');
                }
            }
        });

    }
    
    function interactionMadeWithItem (trigger) {
        var item = trigger.closest('[data-order-item-id]'),
            modal = $('#adminCustomerInteractionModal').modal_open();

        modal.find('#warningActionName').text(trigger.find('option:selected').text());
        modal.find('[name="interacted_item"]').val(item.attr('data-order-item-id'));
        modal.find('[name="interaction"]').val(trigger.val());

        if (trigger.val() == 'insert_ticket')
            $('#helpdeskUrlContainer').show();
        
        initInteractionsVerificationForm();
    }

    function initInteractionsVerificationForm () {
        var form = $('#interactionVerificationForm');

        if (form.is_ready())
            return;

        form.prepare_form_advanced({
            handlers : '#interactionSubmit',
            disable : '#interactionSubmit',
            version_exception : true,
            onSuccess: function (form) {
                $.ajax(
                    new $.ajax_prototype({
                        'type'      : 'POST',
                        'url'       : form.attr('action'),
                        'data'      : form.serialize(),
                        'success'   : function (data) {
                            if (data.success) {
                                adminCustomerInteractionModal.modal_close();

                                var interacted_item = $('[data-order-item-id="' + adminCustomerInteractionModal.find('[name="interacted_item"]').val() + '"]');

                                if ('id' in data.data)
                                    interacted_item.find('.ssl_admin_actions_list').prepend('<li><a href="https://helpdesk.dnhost.gr/display/' + data.data.id + '" target="_blank">Συνδεμένο ticket <i class="icon-new-tab"></i></a></li>');
                                else
                                    interacted_item.find('.ssl_admin_actions_list').prepend('<li>' + data.data.action + ' <span class="smallest-font normal-weight">(' + data.data.date.split(' ')[0] + ')</span></li>');

                                interacted_item.find('.no_log_notice').remove();
                            } else {
                                globalApplicationErrors(data, form.attr('id'));
                            }
                        }
                    }, form.attr('id'))
                );
            }
        });
    }

    function fixSslActionsSize () {
        if ($.getSizeClassification('large_up'))
            $('.ssl_actions:not(.stand_alone)').addClass('big-inner-margin');
        else
            $('.ssl_actions').removeClass('big-inner-margin');
    }
});