$(document).ready(function () {
    $('#domain_selector').apply_chosen({'value':'','par':{search_contains:true}});

    $('#openTerms').on('click', function (e) {
        e.preventDefault();
        $('#gdpr_approval_modal').modal_open();
    });

    var form = $('#domain_move_form');

    form.prepare_form_advanced({
        handlers            : '#moveSubmit',
        version_exception   : true,
        onSuccess           : function () {
            $('#verifyMove').modal_open();
        }
    });

    $('#domain_selector').on('change', function () {
        $('#pendingApproveContainer').hide();
        $('#pendingApproveDomains').empty();
        $('#transferring').text('');
        $('#move_all').attr('checked', false);
        $('#domainErrors').hide();
        $('#transferFailedTable tr:has(td)').remove();
        $('#domainTransferAllAgreement, #agreementContainer, #submitContainer').show().find('chekbox').attr('checked', false);
    });

    $('#verifyMove .modal_cancel').on('click', function () {
        $.enable_form_controls(form.attr('id'));
    });

    $('#moveVerified').on('click', function (e) {
        e.preventDefault();

        var domain_id       = $('[name="domain_id"]'),
            data_domain_id  = ((domain_id.is('select')) ? domain_id.val() : domain_id.attr('data-domain-id')),
            agree_terms = $('#agree_terms'),
            data = {
                '_token'        : $('[name="_token"]').val(),
                'domain_id'     : data_domain_id,
                'target_user'   : $('[name="target_user"]').val(),
                'password'      : $('[name="password"]').val(),
                'agree'         : agree_terms.is(':checked')
            },
            move_all = $('#move_all');

        if (move_all.closest('.row').is(':visible'))
            data.move_all = $('#move_all').is(':checked');

        if (agree_terms.is(':checked')) {
            data['processing_approval'] = $('[name="processing_approval"]').val();
            data['data_validity'] = $('[name="data_validity"]').val();
        }

        $.ajax(
            new $.ajax_prototype({
                timeout         : 300000,
                type            : 'POST',
                url             : urls.move,
                data            : data,
                beforeSend      : function () {
                    $('#verifyMove').modal_close();
                    $('#domainErrors').hide();
                    $('#transferFailedTable tr:has(td)').remove();

                    appendPageCoverLoader();
                },
                success         : function (data) {
                    if (data.success) {
                        if (data.data.constructor == Object) {
                            var pendingCont = $('#pendingApproveContainer');

                            $('#move_all').attr('checked', false);

                            if ('pending_approval' in data.data) {
                                buildMandatoryDomainsList(data.data.pending_approval);
                            } else {
                                pendingCont.hide()
                            }

                            if ('success' in data.data) {
                                $('#domainTransferContainer, #pendingApproveContainer, #agreementContainer').hide();

                                $('#moveSubmit').closest('.row').hide();

                                var transferredContainer    = $('#transferredContainer').show(),
                                    count                   = 1;

                                $('.breadcrumbs li:has(a[href*="domains/' + data_domain_id + '"])').remove();

                                if (Object.keys(data.data.success).length > 1) {
                                    $('#transferCompletedNotice').translate('domains.internal_transfer.multiple_domains', 0, {'user' : $('[name="target_user"]').val()});

                                    for (var i in data.data.success) {
                                        $('#transfersTable').append('<tr><td>' + data.data.success[i] + '</td></tr>');
                                    }
                                } else {
                                    domainElement   = $('[name="domain_id"]');
                                    sourceDomain    = ((domainElement.is('select')) ? domainElement.find('option:selected').text() : domainElement.val());

                                    transferredContainer.find('table').hide();
                                    $('#transferCompletedNotice').translate('domains.internal_transfer.single_domain', 0, {'domain' : sourceDomain, 'user' : $('[name="target_user"]').val()});
                                }
                            }
                        }
                    } else {

                        if (data.code == error_codes.auxiliary_contacts_remove_failed) {
                            if (data.data.constructor == Object && 'domains' in data.data && 'errors' in data.data) {
                                $('#domainTransferAllAgreement, #agreementContainer, #submitContainer').hide();
                                buildMandatoryDomainsList(data.data.domains);

                                $('#domainErrors').show();
                                var errorTable      = $('#transferFailedTable');

                                domainElement   = $('[name="domain_id"]');
                                sourceDomain    = ((domainElement.is('select')) ? domainElement.find('option:selected').text() : domainElement.val());

                                for (i in data.data.domains) {
                                    if (data.data.domains.hasOwnProperty(i) && data.data.domains[i] != sourceDomain && data.data.errors.hasOwnProperty(i)) {
                                        $msgClass   = 'fail';
                                        $msg        = data.data.errors[i];
                                        errorTable.append('<tr><td class="domain">' + data.data.domains[i] + '</td><td class="msg ' + $msgClass + '">' + $msg + '</td></tr>');
                                    }
                                }
                            } else {
                                $('[name="domain_id"]').displayIndividualErrors(data.msg);
                            }
                        }else {
                            globalApplicationErrors(data, form.attr('id'));
                        }
                    }
                },
                complete        : function () {
                    $('#pageLoader').remove();
                }
            }, form.attr('id'))
        );
    });

    function buildMandatoryDomainsList (data) {
        var pendingCont = $('#pendingApproveContainer');

        pendingCont.show();
        pendingCont.find('#move_all').attr('checked', false);

        var domainElement   = $('[name="domain_id"]'),
            sourceDomain    = ((domainElement.is('select')) ? domainElement.find('option:selected').text() : domainElement.val());

        $('#transferring').text(sourceDomain);

        var transferList = $('#pendingApproveDomains');

        transferList.empty();

        for (i in data) {
            if (data.hasOwnProperty(i) && data[i] != sourceDomain) {
                transferList.append('<li>' + data[i] + '</li>');
            }
        }
    }
});