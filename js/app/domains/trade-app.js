$(document).ready(function () {
    var choose_domain       = $('#choose-domain'),
        $contactsSelector   = $('#contacts'),
        submitButton        = $('#btn-submit-new-contact');


    $('#transfer_form').prepare_form_advanced({
        onSuccess           : function () {
            if(typeof change_contact_obj != 'object')
                change_contact_obj = new $.ajax_prototype({
                    type    : 'POST',
                    success : function (data){
                        if(data.success){
                            if('route' in data.data){
                                $('#tradeContinue').attr('href', data.data.route);

                                $('#confirmModal').modal_open();
                            }else{
                                $('#checkoutModal').modal_open();
                            }

                            if (app_env != 'local' && 'remarketing_items' in data.data) {
                                $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                            }
                        }else{
                            globalApplicationErrors(data, 'transfer_form', {
                                'registrant'    : function () {
                                    var new_ownere_id = $('#new-owner-id');

                                    return (new_ownere_id.is(':visible')) ? new_ownere_id : $('#contacts');
                                }
                            });
                        }
                    },
                    url     : ''
                }, '#transfer_form');

            change_contact_obj.data = {'_token' : $('[name="_token"]').val()};

            var domain_id   = $('#choose-domain'),
                trade_type  = $('[name="type-owner-change"]:checked'),
                my_contact  = $('#contacts').val();

            if(domain_id.length)
                change_contact_obj.data.domain_id   = domain_id.val();

            if(trade_type.length)
                change_contact_obj.data.trade_type  = trade_type.val();

            change_contact_obj.data.registrant  = (my_contact) ? my_contact : $('#new-owner-id').val();

            if ($('[name="agree_terms"]:checked').length) {
                change_contact_obj.data.processing_approval = $('[name="processing_approval"]').val();
                change_contact_obj.data.data_validity = $('[name="data_validity"]').val();
            }

            $.ajax(change_contact_obj);
        },
        handlers            : '#btn-submit-new-contact',
        disable             : '#btn-submit-new-contact',
        version_exception   : true
    });

    choose_domain.apply_chosen({'search_contains' : true}).chosen_update('');
    choose_domain.on('change', function () {
        var obj             = $(this),
            steps           = $('.trade_steps'),
            transferRole    = $('#transferRoleContainer');

        if(obj.find('option:selected').attr('data-registry') == 'forth'){
            if(transferRole.is(':hidden')){
                steps.hide();
                transferRole.show();

                var checkedInput = steps.find('input:checked');
                if(checkedInput.length){
                    checkedInput.each(function () {
                        $(this).change();
                    });

                    $('#myContacts:visible, #thirdPartyContacts:visible').find('select, input').change();
                }
            }

            submitButton.find('.submitText').text(COMMON_LANG.DOMAINS.TRADE.APPLICATION.BUTTON.FORTH);
        }else{
            submitButton.find('.submitText').text(COMMON_LANG.DOMAINS.TRADE.APPLICATION.BUTTON.OTHERS);

            if(transferRole.is(':visible')){
                steps.hide();
            }

            var contactsCont    = $('#myContacts'),
                options         = contactsCont.find('option:not(.placeholder)');

            if(options.length)
                contactsCont.show();
            else
                getContactProfiles();
        }

        var contactSelector = $('#contacts'),
            contacts        = contactSelector.find('option'),
            registry        = $(this).find('option:selected').attr('data-registry');

        if(contacts.length){
            contacts.filter(':not(.placeholder)').disabled(false).show();

            contacts.filter('[data-' + registry + '="0"]').disabled(true).hide();

            var currentRegistrant = $('#choose-domain').find('option:selected').attr('data-current-registrant');

            contacts.filter('[value="' + currentRegistrant + '"]').disabled(true).hide();

            var selectedContact = contactSelector.find('[value="' + contactSelector.val() + '"]');

            contactSelector.chosen_update((selectedContact.disabled() === false) ? contactSelector.val() : '');
        }
    });

    $('[name="type-owner-change"]').on('change', function () {
        $('#contactProfileContainer').show();
    });

    $('[name="type-contact-profile"]').on('change', function () {
        $('#myContacts, #thirdPartyContacts').hide();
        $('#new-owner-id').val('');

        $('#btn-submit-new-contact').addClass('disabled');

        if($('[name="type-contact-profile"]:checked').val() == 1){
            $('#myContacts').show();
            $('#new-owner-id').val('');
        }else{
            $('#contacts').chosen_update('');
            $('#thirdPartyContacts').show();
        }
    });

    $('[for="account-contact-profile"]').one('click', function () {
        getContactProfiles();
    });

    $('#contacts, #new-owner-id').on('change', function () {
        if($(this).val())
            $('#btn-submit-new-contact').removeClass('disabled');
        else
            $('#btn-submit-new-contact').addClass('disabled');
    });

    $('#newTrade').on('click', function (e) {
        e.preventDefault();

        if(typeof $urls == 'object' && 'newTrade' in $urls){
            window.location.href = $urls['newTrade'];
        }else{
            var steps = $('.trade_steps');

            $('[name="agree_terms"]:checked').prop('checked', false);

            steps.find('[type="radio"]:checked, [type="checkbox"]:checked').prop('checked', false);
            steps.find('[type="text"]:visible').val('');
            steps.find('select').chosen_update('');

            steps.hide();
            choose_domain.chosen_update('');

            $('#btn-submit-new-contact').addClass('disabled');
            $('#checkoutModal').modal_close();
        }
    });

    $('#gotToCart').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        obj.find('.submitText').hide();
        obj.find('.loading').show();

        window.location.href = obj.attr('href');
    });

    function getContactProfiles () {
        $('#myContacts').show();

        $.ajax({
            timeout  : 30000,
            type     : 'POST',
            url      : $urls.contacts,
            data     : {
                '_token' : $('[name="_token"]').val()
            },
            success  : function (data) {
                if(data.success){
                    var contactsContainer   = $('#contacts'),
                        options             = '';

                    $.each(data.data.list, function (key, value){
                        options += '<option value="' + value.id + '" data-enom="' + value.enom_ready + '" data-eurid="' + value.eurid_ready + '" data-forth="' + value.forth_ready + '">' + value.name + '</option>';
                    });

                    contactsContainer.append(options);

                    var currentDomain = $('#choose-domain').find('option:selected'),
                        registry = currentDomain.attr('data-registry');

                    contactsContainer.find('[data-' + registry + '="0"]').disabled(true).hide();

                    var currentRegistrant = currentDomain.attr('data-current-registrant');

                    contactsContainer.find('[value="' + currentRegistrant + '"]').disabled(true).hide();

                    contactsContainer.apply_chosen('');

                    $('#myContactsLoader').hide();
                    $('#myContactsList').show();
                }
            },
            error   : function (e) {
                $('#myContactsLoader').hide();
                globalErrorsHandler(e, true);
            },
        })
    }

    if($contactsSelector.find('option').length)
        $contactsSelector.apply_chosen($contactsSelector.val()).change();
});