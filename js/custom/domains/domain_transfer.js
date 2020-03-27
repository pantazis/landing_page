$(document).ready(function() {
    $.toggleMultiExpand();

    var responses               = $('#bulk_transfer_form').find('.responses'),
        transferVerification    = $('#transferVerification'),

        immediateG              = transferVerification.find('#immediateGroup'),
        immediateGI             = immediateG.find('.injected'),
        immediateGIT            = immediateGI.getOuterHTML(),

        toCartG                 = transferVerification.find('#toCartGroup'),
        toCartGI                = toCartG.find('.injected'),
        toCartGIT               = toCartGI.getOuterHTML(),

        errorsG                 = transferVerification.find('#errorsGroup'),
        errorsGI                = errorsG.find('.injected'),
        errorsGIT               = errorsGI.getOuterHTML();

    immediateGI.remove();
    toCartGI.remove();
    errorsGI.remove();

    max_reached = false;

    $('#single_domain_transfer').prepare_form_advanced({
        onSuccess 			: function () {
            single_domain_post_validation();
        },
        handlers    		: '.button.validate',
        disable_exception   : true,
        version_exception   : true
    });

    $('#bulk_transfer_form').prepare_form_advanced({
        onSuccess : function () {
            bulk_transfer_post_validation();
        },
        handlers    		: '.submit',
        disable_exception   : true,
        version_exception   : true
    });

    $('#bulkSubmit').on('click', function (e) {
        e.preventDefault();

        validateDomainObj.data = {
            '_token'    : $('[name="_token"]').val(),
            'continue'  : true,
            'pairs'     : $.makeArray($('#invalidDomainsForm .injected').map(function(a,b){return $.makeArray($(b).find('input').map(function(c,d){return $(d).val()})).join(',')})),
            'unique_id' : unique_page_identifier
        };

        $.ajax(validateDomainObj);
    });

    $('#bulkCancel').on('click', function () {
        $('#transferForm, #transferVerification').toggle();
    });

    $('#bulk_input')
        .on('input', function () {
            //TODO: Cut input on 20 lines.
            clear_bulk_input($(this));
        })
        .on('keypress', function (e) {
            control_bulk_input(e);
        })
        .on('keyup', function (e) {
            if(max_reached){
                if(e.which == 188){
                    if($(this).val().match(/,.+,$/g) != null){
                        $(this).val($(this).val().replace(/,$/g,''));
                    }
                }
                if(e.which == 32){
                    if($(this).val().match(/,.+ $/g) != null){
                        $(this).val($(this).val().trim());
                    }
                }
            }
        });

    $(document)
        .on('click', '.removeInjected', function (e){
            e.preventDefault();

            $(this).closest('.injected').remove();

            if($('#invalidDomainsForm .injected').length < 1){
                errorsG.hide();
                $('#bulkCancel').text(COMMON_LANG.MISC.RETURN);
            }

        })
        .on('keypress', '.injected input', function (e) {
            if(e.which == 13) {
                validateDomainObj.data = {
                    '_token'    : $('[name="_token"]').val(),
                    'continue'  : true,
                    'pairs'     : $.makeArray($('#invalidDomainsForm .injected').map(function(a,b){return $.makeArray($(b).find('input').map(function(c,d){return $(d).val()})).join(',')})),
                    'unique_id' : unique_page_identifier
                };

                $.ajax(validateDomainObj);
            }
        });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasDeleted', function(data) {
        if(data.msg.unique_id == unique_page_identifier)
            return ;

        $('#toCartGroup').find('[data-cart-item-id="' + data.msg.cart_item_id + '"]').remove();
    });

    channel.domain.bind('App\\Events\\Domains\\DomainWasTransferredIn', function(data) {
        var domain = $('[data-fqdn="' + data.msg.fqdn + '"]');

        if(domain.hasClass('injected'))
            domain.find('.status').text(COMMON_LANG.DOMAINS.TRANSFER.SUCCESSFUL_PROCESS);
        else
            domain.removeClass('error').addClass('success').find('.msg-type').text(COMMON_LANG.DOMAINS.TRANSFER.SUCCESSFUL_PROCESS);

        domain.find('.warning').toggleClass('warning success');
    });

    channel.domain.bind('App\\Events\\Domains\\DomainTransferInFailed', function(data) {
        var domain = $('[data-fqdn="' + data.msg.fqdn + '"]');

        if(domain.hasClass('injected'))
            domain.find('.status').text(data.msg.error);
        else
            domain.removeClass('success').addClass('error').find('.msg-type').text(data.msg.error);


        domain.find('.label').removeClass('warning success').addClass('alert');
    });

    if(Cookies.get('keep_progress')){
        setTimeout(function() {
            var data = JSON.parse(Cookies.get('keep_progress')),
                form = $('#' + data.form);


            $('[href="' + data.tab + '"]:visible').trigger('click');
            $.each(data.values, function (key, value) {
                form.find('[name="' + key + '"]').val(value);
            });

            Cookies.remove("keep_progress");
        }, 100);
    }

    if(Cookies.get('domain_transfer')){
        setTimeout(function() {
            var form = $('#single_domain_transfer');

            form.find('[name="fqdn"]').val(Cookies.get('domain_transfer'));

            Cookies.remove("domain_transfer");
        }, 100);
    }
    
    function single_domain_post_validation () {
        if(typeof validate_fqdn != 'object')
            validate_fqdn = new $.ajax_prototype({
                type 	: 'POST',
                url		: $('#single_domain_transfer').attr('action'),
                success : function (data) {
                    if(data.success){
                        var domain = $('#domain_name'),
                            fqdn = domain.val().toLowerCase();

                        if('immediate' in data.data.validated){
                            $('#single_domain_transfer').find('.responses').append('<div class="msg success" data-fqdn="' + fqdn + '"><div class="domain">' + domain.val() + '</div><div class="msg-type">' + COMMON_LANG.DOMAINS.TRANSFER.UNDER_PROCESS + '</div></div>');
                            $('#domain_name, #epp_key').val('');
                        }else if('toCart' in data.data.validated){
                            //Domain added to cart - should send remarketing event
                            if (app_env != 'local' && 'remarketing_items' in data.data.validated)
                                $.sendAddToCartRemarketingEvent(data.data.validated.remarketing_items);

                            $.cart.insert(data.data.validated.toCart['0'].id, data.data.validated.toCart['0'].name, data.data.validated.toCart['0'].sub_name, data.data.validated.toCart['0'].price);
                            $('#domain_name, #epp_key').val('');
                        }else if('errors' in data.data.validated){
                            if('name' in data.data.validated.errors[fqdn].errors)
                                domain.displayIndividualErrors(data.data.validated.errors[fqdn].errors.name);

                            if('auth' in data.data.validated.errors[fqdn].errors)
                                $('#epp_key').displayIndividualErrors(data.data.validated.errors[fqdn].errors.auth);
                        }


                        if ('addToCart' in data.data)
                            addPossibleProductToCart(data);
                    }else{
                        if(data.code == error_codes.action_allowed_only_to_users){
                            $.alertHandler('', data.msg, alert_box_failure);
                            $('#register-forms').addClass('keep_progress').attr('data-progress','single_domain_transfer').modal_open();
                        }else{
                            globalApplicationErrors(data, 'single_domain_transfer');
                        }
                    }
                }
            }, 'single_domain_transfer');

        var domain = $('#domain_name').val();

        validate_fqdn.data = {
            '_token'    : $('[name=_token]').val(),
            'unique_id' : unique_page_identifier,
            'pairs'     : [domain + ',' + $('#epp_key').val()]
        };

        if (typeof onImediateAdd != 'undefined' && onImediateAdd.indexOf(domain) > -1)
            validate_fqdn.data.addEl = onImediateAdd;


        $('#single_domain_transfer').find('.responses').empty();

        $.ajax(validate_fqdn);
    }

    function bulk_transfer_post_validation () {
        var pairs = $('#bulk_input').val().trim().replace(/( )/g,'').split('\n');
        responses.empty();

        if(typeof validateDomainsObj != 'object')
            validateDomainObj = new $.ajax_prototype({
                type : 'POST',
                url : $('#bulk_transfer_form').attr('action'),
                success : function (data) {
                    if(data.success){
                        if(!('continue' in data.data)){
                            $('#transferForm, #transferVerification').toggle();
                            transferVerification.find('.domain_groups').hide();
                        }else{
                            errorsG.hide()
                        }

                        $.each(data.data.validated, function (group, domains){
                            switch (group){
                                case "immediate"            :
                                    var container = immediateG.show(),
                                        handler = function (data) {
                                            inject_successful_entry (container, immediateGIT, data[1])
                                        };
                                    break;
                                case "toCart"               :
                                    container = toCartG.show();
                                    handler = function (data) {
                                        inject_successful_entry (container, toCartGIT, data[1], true)
                                    };
                                    break;
                                case "errors"               :
                                    target = errorsG.show().find('#bulkSubmit');
                                    container = target.closest('form');
                                    $('#bulkCancel').text(COMMON_LANG.MISC.CANCEL);
                                    handler = function (data) {
                                        inject_error_entry (target, errorsGIT, data[0], data[1], data[2])
                                    };
                                    break;
                                case "remarketing_items"    :
                                    if (app_env != 'local')
                                        $.sendAddToCartRemarketingEvent(data.data.validated.remarketing_items);
                                    break;
                            }

                            if(!('continue' in data.data) || group == 'errors')
                                container.find('.injected').remove();

                           $.each(domains, function (index, data){
                               handler([index,((typeof data == 'object' && 'auth' in data) ? data.auth : data),data.errors]);
                           });

                            $('.injected:hidden').remove();
                        });

                        if($('#invalidDomainsForm .injected').length < 1)
                            $('#bulkCancel').text(COMMON_LANG.MISC.RETURN);

                        $('#bulk_transfer_form .disabled').removeClass('disabled');

                        if ('addToCart' in data.data)
                            addPossibleProductToCart(data);
                    }else{
                        if(data.code == error_codes.action_allowed_only_to_users){
                            $.alertHandler('', data.msg, alert_box_failure);
                            $('#register-forms').addClass('keep_progress').attr('data-progress','bulk_transfer_form').modal_open();
                        }else{
                            globalApplicationErrors(data, ($('#bulk_transfer_form:visible').length ? 'bulk_transfer_form' : 'invalidDomainsForm'));
                        }
                    }
                }
            }, 'bulk_transfer_form');

        validateDomainObj.data = {
            '_token'    : $('[name="_token"]').val(),
            'pairs'     : pairs,
            'unique_id' : unique_page_identifier
        };

        if (typeof onImediateAdd != 'undefined') {
            var $addToTransfer = true;

            for (var i in pairs) {
                if (pairs.hasOwnProperty(i)) {
                    var pair = pairs[i].split(',');

                    if (onImediateAdd.indexOf(pair[0]) < 0)
                        $addToTransfer = false;
                }
            }

            if ($addToTransfer === true) {
                validateDomainObj.data.addEl = onImediateAdd;
            }
        }



        $.ajax(validateDomainObj);
    }

    function addPossibleProductToCart (data) {
        setTimeout(function () {
            try {
                $.ajax(
                    new $.ajax_prototype({
                        'type'  : 'POST',
                        'url'   : '/cart/add',
                        'data'  : {
                            '_token'    : $('[name="_token"]').val(),
                            'fqdn'      : data.data.addToCart,
                            'action'    : 'register',
                            'settings'  : {},
                        }
                    })
                )
            } catch (e) {
            }
        }, 3000);
    }

    function inject_successful_entry (container, template, data) {
        container.append(template);
        var injected = container.find('.injected:last');

        if(typeof data == 'object'){
            container.find('.name:last').text(data.name);
            injected.attr('data-cart-item-id', data.id);
            $.cart.insert(data.id, data.name, data.sub_name, data.price);
        }else{
            container.find('.name:last').text(data);
            injected.attr('data-fqdn', data);
        }

    }

    function inject_error_entry (target, template, domain, pass, error) {
        target.before(template);

        var container = target.closest('form');

        container.find('.name:last').val(domain);

        container.find('.auth:last').val(pass);

        $.each(error, function (obj, msg){
            container.find('.' + obj + ':last').addClass('error').displayIndividualErrors(msg);
        });
    }

    function clear_bulk_input (obj) {
        var caret_pos = obj.prop("selectionStart");
        cleared_val = obj.val().replace(/^\s+/g,'').replace(/^\n$/gm,'').replace(/[ ]+/g,' ');

        if(cleared_val.match(/,.+[ ]$/g) != null){
            cleared_val = cleared_val.replace(/[ ]$/g,'\n');
        }

        splited_val = cleared_val.split('\n');

        if(splited_val.length >= 20){
            max_reached = true;
            temp = '';

            for(i = 0; i < 20; i++){
                temp += splited_val[i];

                if(i != 19)
                    temp += '\n';
            }

            $('#max_domains_wrn').show();
            cleared_val = temp;
        }else{
            max_reached = false;
            $('#max_domains_wrn').hide();
        }

        obj.val(cleared_val);

        cleared_val = cleared_val.split('\n');

        rows = cleared_val.length;

        obj.prop({"selectionStart": caret_pos, "selectionEnd":caret_pos});
    }

    function control_bulk_input (e){
        if(max_reached){
            if(e.which == 13 || (e.which == 118 && e.ctrlKey)){
                e.preventDefault();
            }
        }
    }

    function populate_panel (panel, data) {
        $.each(data, function (key, value){
            responses.append('<div class="msg ' + ((panel == 'alert') ? ' error' : ' success')+ '"><div class="domain">' + (('fqdn' in value) ? value['fqdn'] : value[0]) + '</div><div class="msg-type">' + (('msg' in value) ? value['msg'] : value[1]) + '</div></div>');

            if('cart_item_id' in value && $('li[data-cart-item-id="' + value.cart_item_id + '"]')){
                $.cart.insert(value.cart_item_id, value.fqdn, value.sub_name, value.total);
            }
        });

        $(responses.parents('div')[0]).show();
    }

    function error_handler (response, formId){
        switch (response.code) {
            case error_codes.insufficient_permissions:
            case error_codes.cart_action_exception:
            case error_codes.domain_already_in_cart:
            case error_codes.domain_check_failed:
            case error_codes.domain_is_not_valid:
            case error_codes.domain_does_not_exist:
            case error_codes.domain_info_failed:
            case error_codes.domain_registrant_is_dnhost:
            case error_codes.invalid_epp_auth:
            case error_codes.domain_not_registered_cant_be_transferred_not_registered:
            case error_codes.invalid_domain_cant_be_registered:
            case error_codes.registry_maintenance:
            case error_codes.can_not_get_premium_quote:
                var responses = $('#' + formId).find('.responses');
                responses.empty().append('<div class="msg error"><div class="domain">' + response.msg + '</div></div>');
                break;
            default:
                globalApplicationErrors(response, formId);
        }
    }
});

$(window).on('load', function () {
    var grFamilyTransferIn = Cookies.get('grFamilyTransferIn');

    if (grFamilyTransferIn) {
        try {
            var cookie = JSON.parse(grFamilyTransferIn),
                domains = JSON.parse(cookie.search);

            onImediateAdd = domains;


            if (domains.length == 1)
                $('#domain_name').val(domains[0]);
            else {
                $('[href="#bulk-transfer"]:visible').trigger('click');
                $('#bulk_input').val(domains.join(',\r\n') + ',');
            }
        } catch (e) {
            
        }

        if (! $.is_guest())
            Cookies.remove('grFamilyTransferIn',{path: '/', domain: location.host.replace(/(my|admin)\./,'')});
    }
});