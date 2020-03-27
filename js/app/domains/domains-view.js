$(document).ready(function(){
    $('select .remove_inuse').remove();
    $('select:not(#countrySelectorSid)').each(function () {
        var obj = $(this);

        obj.apply_chosen(obj.val());
    }).on('chosen:showing_dropdown',function(){
        select = $(this);
        $('#' + select.attr('id') + '_chosen li').each(function(key){
            var obj = $(this);
            if(obj.hasClass('missing_data')) {
                obj.html(obj.text() + $('#missing_data_warning').html().replace('#id#', select.find('option:eq(' + key + ')').val()));
            }
        });
    });

    log = {};
    log_contact_profiles();
    log_nameservers();

    var free_hosting_cont = $('#freeHosting');

    $.extend({'domain_view' : {contact_validation_callback : contact_validation_callback}});


    $('#syncDomain').on('click', function (e) {
        e.preventDefault();

        $.ajax(new $.ajax_prototype({
                type    : 'POST',
                url     : urls['syncDomain'],
                data    : {
                    '_token'    : $('[name="_token"]').val()
                },
                success : function (data) {
                    if(data.success){
                        $.alertHandler('', data.msg, alert_box_success);
                    }else{
                        errorHandler(data);
                    }
                }
            })
        );
    });

    //Domain Contacts Start

        //Initiate the edit function for contacts panels
        $('#contacts_edit').on('click',function(){
            assign_contacts_validation();
        });

        //Reveal the requested contact type
        $('#contact_type_list a').on('click',function(e){
            e.preventDefault();
            show_contact_role($(this));
        });

        $('.delete_contact').on('click', function(e){
            e.preventDefault();
            removeContactRole($(this).closest('.row'));
        });

        $('.contact_profile_list').on('change',function(){
            remove_selected_profiles($(this));
        });

    //Domain Contacts End


    //Domain Name Servers Start

        $('#ns_group').on('change', function () {
            var obj = $(this);
            // $('#shortcut').find('hr').show();

            $('#nameServerInputCont').empty();

            if(obj.val() == 'nons')
                toggleNsGroupToList();
            else
                toggleNsListToGroup(obj);
        });

        //Add a new server in nameserver block
        $('#addNameServers').on('click',function(e) {
            e.preventDefault();
            add_new_nameserver();
            $(this).blur();
        });

        //Confirm nameserver notice after change.
        $('#ns_agree').on('click', function(e){
            e.preventDefault();
            $('#nameServersNotice').modal_close();
        });

        $('#nsRadioSubmit').on('click', function (e) {
            e.preventDefault();

            if ($('[name="trigger_ns_group_save"]:checked').val() == 'yes') {
                $('#nsIntro').hide();
                var input_cont = $('#nsGName').show(),
                    nsSaveForm = $('#ns_group_create_form');

                if(!nsSaveForm.is_ready()){
                    nsSaveForm.prepare_form_advanced({
                        onSuccess             : function () {
                            name_servers_obj.data.ns_name = $('#nsGNameInput').val();
                            $.ajax(name_servers_obj);
                        },
                        handlers            : '#nsGNameSave',
                        cancel              : {
                            handler     : '#nsGNameCancel',
                            callback    : function(){
                                var input_cont = $('#nsGName').hide();

                                input_cont.find('[typeof="text"]').val('');

                                $('#nsIntro').show();

                                if('ns_name' in name_servers_obj.data)
                                    delete(name_servers_obj.data.ns_name);
                            }
                        },
                        version_exception   : true,
                        disable_exception   : $.is_user()
                    });
                }

                input_cont.find('.error').removeClass('error');
                input_cont.find('.help-block').remove();
            } else {
                $.ajax(name_servers_obj);
            }
        });
    //Domain Name Servers End


    //Domain Extras Start

        // $('.switch-controller:not(.free-hosting):not(.icann-trigger)').on('change',function(){
        //     perform_request_on_switch_toggle ($(this))
        // });

        $('#sendCode').on('click',function(e){
            e.preventDefault();
            authorization_code_request($('#send_code_form'));
        });

        //Trigger host class to disable free hosting in order to change nameservers
        $('#goToHosting').on('click', function(e){
            e.preventDefault();
            $('#hosting_tab_trig').click();
        });

        $('#reissueCode').on('click', function(e){
            e.preventDefault();
            authorization_code_request($('#reissue_code_form'));
        });

        $('#id-protect-trigger').on('change', function () {
            var obj = $(this);

            if(typeof idProtectToggle != 'object')
                idProtectToggle = new $.ajax_prototype({
                    type    : 'POST',
                    url     : urls['idProtectToggle'],
                    data    : {'_token'    : $('[name="_token"]').val()},
                    success : function (data) {
                        if(!data.success){
                            obj.prop('checked', !obj.prop('checked'));
                            errorHandler(data);
                        }
                    }
                });

            idProtectToggle.data.enabled = ((obj.prop('checked')) ? 1 : -1);
            $.ajax(idProtectToggle);
        });
    //Domain Extras End


    //Domain Hosts Start

        $('#deleteHost .request-verify').on('click',function(e){
            e.preventDefault();
            send_delete_host_request($(this));
        });

        //Create a new host.
        $('#addNewHost').on('click',function(){
            assign_add_host_validation($('#new_host_form'));
        });

    //Domain Hosts End


    //Free Hosting Start

        $('.free-hosting').on('change',function() {
            toggle_free_hosting_service($(this), $('#freeHosting'));
        });

        free_hosting_cont.find('.request-verify').on('click',function(e){
            e.preventDefault();
            free_hosting_request($(this));
        });

        free_hosting_cont.find('.modal_cancel').on('click', function(){
            var obj = $('#free-hosting');
            obj.prop({'checked':!obj.prop('checked')});
        });

        $('#goToHosts').on('click', function (e) {
            e.preventDefault();
            $('#hosts_tab_trig').click();
        });

        $('#icann-trigger').on('change', function () {
            $.ajax(new $.ajax_prototype({
                    'type'      : 'POST',
                    'url'       : urls['icann_update'],
                    'data'      : {
                        '_token'                : $('[name="_token"]').val(),
                        'icann_auto_approval'   : $('#icann-trigger').prop('checked')
                    },
                    'success'   : function (data) {
                        if(data.success){

                        }else{
                            var obj = $('#icann-trigger');

                            obj.prop('checked', !obj.prop('checked'));

                            globalApplicationErrors(data);
                        }
                    },
                    'error'     : function (e)  {
                        var obj = $('#icann-trigger');

                        obj.prop('checked', !obj.prop('checked'));
                        globalErrorsHandler(e);
                    }
                })
            )
        });

    //Free Hosting End

    $(document)
        .on('click', '.delete_host', function(e){
            e.preventDefault();
            delete_host_trigger_callback($(this));
        })
        .on('click', '.name_servers_edit.trigger_input_form:not(.disabled)', function(){
            edit_ns_form_trigger_callback();
        })
        .on('click', '.delete_ip', function(e){
            e.preventDefault();
            delete_host_ip($(this));
        })
        .on('click', '.edit_host', function(e){
            e.preventDefault();
            assign_host_edit_form_validation($(this).closest('.item').find('form'));
            closeLine($('.new_host_cont').hide());
        })
        .on('click', '.delete_server', function(e){
            e.preventDefault();
            remove_ns_from_form($(this));
        })
        .on('click', '.missing_link', function(){
            window.location.href = $(this).attr('href');
        })
        .on('click', '.tab-title a, .accordion-navigation > a[aria-hidden="true"]',function(){
            $('.is-open [class*="cancel"]').click();
        })
        .on('click', '.delete_reg.disabled', function(e){
            e.preventDefault();
        })
        .on('click', '#domainRenew', function (e) {
            e.preventDefault();

            $.ajax({
                type        : 'POST',
                data        : {
                    _token      : $('[name="_token"]').val(),
                    domain_id   : domains_id,
                    unique_id   : unique_page_identifier
                },
                timeout  : 30000,
                url         : $(this).attr('href'),
                beforeSend  : function () {
                    var btn = $('#domainRenew');

                    btn.find('.submitText').hide();
                    btn.find('.loading').show();
                },
                success     : function (data) {
                    if (data.success) {
                        $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);

                        $.alertHandler('', data.msg, alert_box_success);

                        $('#domainRenew').addClass('hide-important').attr('data-cart-item-id',data.data.id);
                    }else{
                        errorHandler(data, '');
                    }
                },
                error   : function (e) {
                    globalErrorsHandler(e);
                },
                complete    : function () {
                    var btn = $('#domainRenew');

                    btn.find('.submitText').show();
                    btn.find('.loading').hide();
                }
            })
        })
        .on('click', '#addIdProtect', function (e) {
            e.preventDefault();

            $.ajax(new $.ajax_prototype({
                    'type'          : 'POST',
                    'url'           : urls['add_id_protect'],
                    'data'          : {
                        '_token'    : $('[name="_token"]').val(),
                        'unique_id' : unique_page_identifier
                    },
                    'success'       : function (data) {
                        if(data.success){
                            $('#addIdProtect').attr('data-cart-item-id', data.data.id);
                            $.cart.insert(data.data.id, data.data.name, data.data.sub_name_small, data.data.total_price);

                            if (app_env != 'local' && 'remarketing_items' in data.data) {
                                $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                            }
                        }else{
                            var obj = $('#addIdProtect');

                            obj.removeClass('in-cart').text(((obj.hasClass('renew')) ? COMMON_LANG.DOMAINS.WHOIS.EXTEND : COMMON_LANG.CART.BUY_SERVICE));
                            globalApplicationErrors(data);
                        }
                    },
                    'beforeSend'    : function () {
                        $('#addIdProtect').addClass('in-cart').text(COMMON_LANG.CART.IN_CART);
                    }
                })
            )
        })
        .on('click', '.delete_group_entry', function (e) {
            e.preventDefault();

            removeEntryFromNsGroup($(this));
        })
        .on('change', '.name_server_input', function () {
            $(this).val($(this).val().toLowerCase());
        });

    $('.host_cont, .new_host_cont').setFieldsVersionControl();
});

var dependencies = {
        ns_container    : $('#nameServerInputCont'),
        ns_form         : $('#name_servers_form'),
        contacts_form   : $('#contacts_form'),
        has_min         : $('.nameservers_has_min'),
        isEu            : fqdn.match(/[.]eu$/) != null,
        hosts_changed   : false,
        ajax_timeout    : 60000
    },
    min_ns = (dependencies.has_min.attr('data-min')) ? dependencies.has_min.attr('data-min') : 0;

//CONTACTS START

    /**
     * Shows the selected contact role in contacts` edit form.
     * @param obj
     */
    function show_contact_role(obj){
        $('#contacts_form').find('.row:has(label[for^="' + obj.attr('data-add') + '"])').show().find('.delte_contact').removeClass('disabled');
        obj.closest('li').hide();
        var list = obj.closest('ul'),
            li_visible = list.find('li:visible').length;

        list.removeClass('open').css('left','-99999px').find('li:visible').length;

        if(li_visible < 1){
            $('#contacts_add_cont').hide();
        }
    }

    /**
     * Removes a contact role from contacts` edit form.
     * @param item
     */
    function removeContactRole(item){
        item.hide().find('select').chosen_update('');
        item.find('.error').removeClass('error').filter('.help-block').remove();

        $('[data-add="' + item.find('label').attr('for').replace(/_[0-9]+/,'') + '"]').closest('li').show();
        $('#contacts_add_cont').show();
    }

    /**
     * Create a log for each contact role.
     */
    function log_contact_profiles(){
        log.contacts = {};
        dependencies.contacts_form.find('select').each(function(){
            var obj = $(this),
                id = obj.attr('id').replace('select_','').replace(/_[0-9]+/,''),
                options = obj.find('option:selected')
            if(options.length) {
                if (typeof log.contacts[id] == 'undefined') {
                    log.contacts[id] = [];
                }
                options.each(function () {
                    log.contacts[id].push($(this).val());
                });
            }
        });
    }

    /**
     * Cancel contacts` edit form changes.
     * Use log to remove used contacts from multiple handlers in contact roles.
     */
    function cancel_contacts_changes(){
        var contacts = $('script#contacts').html(),
            show = false;

        $('#contact_type_list [data-add]').each(function () {
            var add = $(this),
                target = add.attr('data-add');

            $('select[id*="' + target + '"]').each(function(key){
                if(typeof log.contacts[target] != 'undefined' && typeof log.contacts[target][key] != 'undefined' && log.contacts[target][key]){
                    remove_selected_log_profiles(contacts, $(this), log.contacts[target][key], target, key);
                }else{
                    $(this).closest('.row').find('.delete_reg').click();
                    show = true;
                }
            });
        });

        if(!show){
            $('#contacts_add_cont').hide();
        }

        wrapper = dependencies.contacts_form.closest('.wrapper');
        removeAllFormErrorMessages(wrapper.find('form').attr('id'));
        closeBlock(wrapper);
    }

    /**
     * Assign the contacts` form validation callback function.
     * @param form
     */
    function assign_contacts_validation(){
        if(! dependencies.contacts_form.hasClass('under_validation')){
            dependencies.contacts_form.prepare_form_advanced({
                onSuccess   : function(){
                    openGDPRApprovalModal(dependencies.contacts_form);
                },
                handlers    : '.submit-edit',
                disable     : '.submit-edit,.contacts_cancel',
                ver_control : {
                    value   : 'log,contacts',
                    type    : 'array'
                },
                cancel      : {
                    handler     : '.contacts_cancel',
                    callback    : function(){
                        cancel_contacts_changes();
                    }
                }
            });
        }
    }

    function contact_validation_callback () {
        if(typeof contacts_obj != 'object'){
            contacts_obj = new $.ajax_prototype({
                type    : 'POST',
                url     : dependencies.contacts_form.attr('action'),
                timeout : dependencies.ajax_timeout,
                success : function(data){
                    domain_contacts_request_callback(data);
                }
            },dependencies.contacts_form.attr('id'));
        }

        contacts_obj.data = {
            _token 		: dependencies.contacts_form.find('[name="_token"]').val()
        };

        dependencies.contacts_form.find('select:not(:disabled)').each(function(){
            if($(this).closest('.row').is(':visible') && $(this).val()){
                id = $(this).attr('id').replace('select_','').replace(/_[0-9]+/,'');

                if(typeof contacts_obj.data[id] == 'undefined'){
                    contacts_obj.data[id] = [];
                }

                contacts_obj.data[id].push($(this).val());
            }
        });

        var gdpr_approval_form = $('#gdpr_approval_form');

        if (gdpr_approval_form.find('[name="agree_terms"]:checked').length) {
            contacts_obj.data.processing_approval = gdpr_approval_form.find('[name="processing_approval"]').val();
            contacts_obj.data.data_validity = gdpr_approval_form.find('[name="data_validity"]').val();
        }


        $.ajax(contacts_obj);
    }

    /**
     * Handle edit contact request`s response.
     * @param data
     */
    function domain_contacts_request_callback(data){
        if(data.success){
            clean_contacts_form();
            log_contact_profiles();
            show_saved_contacts();
            closeBlock($('.contacts_wrapper'));
        }else{
            errorHandler(data);
        }

        $.disable_gdpr_mopdal(data);
    }

    /**
     * When the edit contact request returns success show contact displays.
     */
    function show_saved_contacts(){
        $('.contact_cont').each(function(){
            var obj = $(this),
                about = obj.find('[data-about]');

            about.empty();
            $('select[id*="' + about.attr('data-about') + '"]').each(function(){
                var option = $(this).find('option:selected');
                if(option.length && option.val()){
                    obj.show();

                    about.append('<span><a href="' + urls['contact_profile'].replace('##id##', option.val()) + '">' + option.text() + '</a></span>');
                }else{
                    obj.hide();
                }
            });
        });
    }

    /**
     * Remove empty contact roles from contact form when success is true.
     */
    function clean_contacts_form(){
        $.each(log.contacts, function (key) {
            var targets = $('select[id^="select_' + key + '"]');
            if(targets.length > 1) {
                targets.each(function () {
                    option = $(this).find('option:selected');
                    if (option.length < 0 || !option.val()) {
                        $(this).closest('.row').remove();
                    }

                    if($('select[id^="select_' + key + '"]').length == 1){
                        return false;
                    }
                });
                target = $('select[id^="select_' + key + '"]');

                if(target.length == 1){
                    option = target.find('option:selected');
                    target.html($('script#contacts').html()).chosen_update((option.length) ? option.val() : '');
                }
            }
        });

        $('#contacts_add_cont').show();

        $('[data-add]').each(function(){
            type = $(this).attr('data-add');
            if($('label[for^="' + type + '"]:visible').length < $('label[for^="' + type + '"]').length){
                $(this).closest('li').show();
            }else{
                $(this).closest('li').hide();
            }
        });

        // if($('[data-add]:visible').length == 0){
        if($('#contact_type_list').find('li').filter(function () {return $(this).css('display') != 'none'}).length == 0){
            $('#contacts_add_cont').hide();
        }
    }

    /**
     * Finds roles related to the target and removes their values from the target.
     * @param obj
     */
    function remove_selected_profiles(obj){
        var id = obj.attr('id'),
            contacts = $('script#contacts').html();

        target = get_related_handles(id);
        target.each(function(){
            var obj = $(this),
                id = obj.attr('id'),
                value = obj.find('option:selected').val();

            obj.html(contacts);

            sources = get_related_handles(id);
            sources.each(function(){
                var source = $(this);

                obj.find('[value="' + source.val() + '"]').remove();
            });

            obj.chosen_update(value);
        });
    }

    /**
     * Gets the values that are related with the target and removes them from the target.
     * @param contacts
     * @param target
     * @param logged_value
     * @param key
     * @param index
     */
    function remove_selected_log_profiles(contacts, target, logged_value, key, index){
        if(dependencies.contacts_form.find('select[id*="' + key + '"]').length > 1){
            target.html(contacts);

            $.each(log.contacts[key],function(foreign_index,foreign_val){
                if(index != foreign_index){
                    target.find('option[value="' + foreign_val + '"]').remove();
                }
            });
        }

        target.chosen_update(logged_value).closest('.row').show();
    }

    /**
     * Returns all contact roles related with target role.
     * @param id
     * @returns {*|jQuery|HTMLElement}
     */
    function get_related_handles(id){
        return $('select[id*="' + clear_contact_id(id) + '"]:not(#' + id + ')')
    }

    /**
     * Returns a cleaned version of the contact role`s id.
     * @param id
     * @returns {*}
     */
    function clear_contact_id(id){
        return id.replace('select_','').replace(/_[0-9]+/,'');
    }

//CONTACTS END

//NAMESERVERS START

    /**
     * This function reads the nameserver logs and reverses the block to it`s previous state.
     */
    function cancel_nameserver_changes(obj){
        obj.blur();
        wrapper = obj.closest('.wrapper');
        removeAllFormErrorMessages(wrapper.find('form').attr('id'));

        if('list' in log.nameservers){
            $('#nameServerInputCont').empty();
            toggleNsListToGroup($('#ns_group').chosen_update(log.nameservers.list));

            $('#add_nameserver').hide();
        }else{
            var cont = $('#nameServerInputCont');

            cont.empty();
            $('#ns_group').chosen_update('nons');
            toggleNsGroupToList();

            for (i in log.nameservers) {
                if (log.nameservers.hasOwnProperty(i)) {
                    var obj = cont.find('[name="' + i + '"]');

                    if (obj.length < 1) {
                        add_new_nameserver(true);
                    }

                    obj = cont.find('[name="' + i + '"]');

                    obj.val(log.nameservers[i].value);
                }
            }

            if (dependencies.ns_container.find('.row').length < parseInt($('.nameservers_has_max').attr('data-max')))
                $('#add_nameserver').show();
            else
                $('#add_nameserver').hide();

            if (dependencies.ns_container.find('.suggested').length < 1)
                check_min_required_nameservers();
        }

        closeBlock(wrapper);
    }

    /**
     * Create a log of the currently saved nameservers.
     */
    function log_nameservers(){
        log.nameservers = {};

        var ns_list         = $('#ns_group'),
            ns_selection    = ns_list.val();

        if(ns_selection == 'nons'){
            dependencies.ns_container.find('input').each(function () {
                log.nameservers[$(this).attr('name')] = ({value: $(this).val(), disabled: $(this).disabled(), class: $(this).closest('.row').attr('class')});
            });
        }else{
            log.nameservers['list'] = ns_selection;
        }
    }

    /**
     * Add a new server to the bottom of the list.
     * @param all
     */
    function add_new_nameserver(all){
        $('#noNSNotice').remove();

        var servers = (typeof all == 'undefined') ? dependencies.ns_container.find('.row:visible').length : dependencies.ns_container.find('.row').length,
            input = $('[name="ns.' + servers + '"]:not(.ns_host_input)');

        if(servers == 0)
            servers = '0';

        if(input.length){
            input.val('').closest('.row').addClass('newly_added').show();
        }else{
            $('#nameServerInputCont').append($('#name_server_input_temp').html());

            var new_server = (typeof all == 'undefined') ? dependencies.ns_container.find('.newly_added:visible:last') : dependencies.ns_container.find('.newly_added:last');

            if(!dependencies.ns_form.is_ready())
                edit_ns_form_trigger_callback();

            new_server.find('label').attr_app('for',servers)/*.text_app(servers)*/;
            new_server.find('input').attr_app({'name':servers,'id':servers});
        }



        handle_add_when_max_applied();
        if(dependencies.has_min.length || min_ns > 1){
            check_min_required_nameservers();
        }
    }

    /**
     * Check if the minimum required name servers are registered and enables/disabled the delete accordingly.
     */
    function check_min_required_nameservers(all){
        dependencies.ns_container.find('.delete_reg').hide();

        if (typeof min_ns != 'undefined' && min_ns != 0) {
            min_ns = parseInt(min_ns);

            if (((typeof all == 'undefined') ? dependencies.ns_container.find('.row:visible').length : dependencies.ns_container.find('.row').length) > min_ns) {
                if(typeof all == 'undefined'){
                    var new_ns = $('.nameserver.newly_added:visible .delete_reg'),
                        saved_ns = dependencies.ns_container.find('.row:not(.newly_added):visible'),
                        all_ns = $('.nameserver:visible .delete_reg');
                }else{
                    new_ns = $('.nameserver.newly_added .delete_reg');
                    saved_ns = dependencies.ns_container.find('.row:not(.newly_added)');
                    all_ns = $('.nameserver .delete_reg');
                }

                if (saved_ns.length > min_ns) {
                    all_ns.show();
                } else {
                    new_ns.show();
                }
            }
        } else {
            $('.nameserver .delete_reg').show();
        }
    }

    /**
     * Remove the targeted nameserver and calls nameservers to sort.
     * @param obj
     * @param remove
     */
    function remove_name_server(obj, remove, all){
        if(obj.is('input')){
            obj.val('');
        }else{
            obj.closest('.row').find('input').val('');
        }

        sort_empty_nameservers(remove, all);

        if(dependencies.ns_container.find('.suggested').length < 1) {
            check_min_required_nameservers();
        }
    }

    /**
     * Assign the function that wil validate the nameservers edit form.
     */
    function assign_edit_nameservers_validation(){
        var cont = dependencies.ns_form.find('#nameServerInputCont');

        if(typeof name_servers_obj != 'object')
            name_servers_obj = new $.ajax_prototype({
                type    : 'POST',
                url     : dependencies.ns_form.attr('action'),
                timeout : dependencies.ajax_timeout,
                success : function(data){
                    edit_nameservers_request_callback(data);
                }
            }, dependencies.ns_form.attr('id'),{
                complete : function () {
                    $('#saveToGroup').off('closed.fndtn.reveal');

                    $('#ns_group_create_form').find('.button.disabled').removeClass('disabled');
                }
            });

        name_servers_obj.data = name_servers_collect_data(dependencies.ns_form, cont);

        var newNs       = $('#ns_group').val() == 'nons',
            nsList      = ('ns' in name_servers_obj.data && Object.keys(name_servers_obj.data.ns).length);


        if(newNs)
            dependencies.ns_container.find('.row:hidden').addClass('pending_delete');

        if(newNs && nsList){
            var saveToGroup     = $('#saveToGroup');

            saveToGroup.on('closed.fndtn.reveal', function () {
                var modal = $(this);

                enableBodyScroll();

                $('#name_servers_form').find('.button.disabled').removeClass('disabled');

                modal.off('closed.fndtn.reveal');
                modal.find('[type="text"]').val('');
            }).modal_open();

            $('#nsGName').hide();
            $('#nsIntro').show();
        }else{
            $.ajax(name_servers_obj);
        }
    }

    /**
     * Handles the server`s response to edit nameservers request.
     * @param data
     */
    function edit_nameservers_request_callback(data){
        if(data.success){
            var nsgroup = $('#ns_group'),
                nsValue = nsgroup.val();

            if('id' in data.data && 'name' in data.data){
                var nsList      = '';

                ns_group = ns_groups.findIndex(function (item) {return item.id == data.data.id});

                if(ns_group == -1){
                    ns_groups.push({
                        'id'            : data.data.id,
                        'name'          : data.data.name,
                        'nameservers'   : data.data.ns
                    });

                    var ns_group = data.data.ns;
                    log.nameservers = {'list' : data.data.id};

                    nsgroup.find('optgroup:last').append('<option value="' + data.data.id + '">' + data.data.name+ '</option>');
                    nsgroup.chosen_update(data.data.id).change();
                }else{
                    log.nameservers = {'list' : nsValue};
                    ns_group = ns_groups[ns_groups.findIndex(function (item) {return item.id == log.nameservers.list})].nameservers;
                }

                $('.ns_host_input').each(function () {
                    nsList += '<span class="toClipBoard">' + $(this).val() + $('#eu_host_tooltip').html() + '</span>';
                });

                $.each(ns_group, function (key, value) {
                    nsList += '<span class="toClipBoard">' + value.name + '</span>';
                });

                $('#min_ns_warning').hide();

                $('.nameserver_labels').html(nsList);

                $('.name_server_input:not(.grouped_ns_input), #nsGNameInput').val('');

                if(dependencies.isEu) {
                    $('#paid_hosting_wrn').hide();
                    $('.new_host_cont').hide();
                }
            }else{
                dependencies.ns_container.find('.pending_delete').remove();

                $('.newly_added.nameserver').removeClass('newly_added');

                dependencies.ns_container.find('.suggested').removeClass('suggested').find('.delete_server').removeClass('hide');

                reconstruct_ns_form_on_response (data.data.ns);

                log_nameservers();
                check_min_required_nameservers();
                show_saved_nameservers();

                handle_delete_when_max_applied();
                handle_add_host_visibility();
                handle_min_ns_warning();

                if(dependencies.isEu){
                    $('#paid_hosting_wrn').show();
                    $('.new_host_cont').show();
                }
            }

            closeBlock(dependencies.ns_container.closest('.wrapper'));
            // $('#nameServersNotice').modal_open();
            $('#saveToGroup').modal_close();
        }else{
            var errors          = (($.isEmptyObject(data.data)) ? [] : Object.keys(data.data)),
                modal           = $('#saveToGroup'),
                faulty_element;

            if (errors.length)
                faulty_element = $('#ns_group_create_form').find('[name="' + errors[0] + '"]');

            if (data.code == error_codes.validation_error && errors.length == 1 && !!faulty_element && faulty_element.length) {
                faulty_element.displayIndividualErrors(data.data[errors[0]][0]);

                if('nameserver_group_name' in data.data)
                    return;
            } else if(data.code == error_codes.nameserver_does_not_have_host) {
                var nsInputs = $('.name_server_input');

                $.each(data.data, function (key, value) {
                    nsInputs.each(function () {
                        if (this.value == value) {
                            var obj = $(this);

                            obj.displayIndividualErrors(data.msg);

                            return false;
                        }
                    });
                });

                modal.find('[type="text"]').val('');
                modal.modal_close();

                return;
            } else {
                modal.find('[type="text"]').val('');
                modal.modal_close();
            }

            errorHandler(data, 'name_servers_form');
        }
    }

    /**
     * Collect the nameservers for the edit request.
     * @param form
     * @param cont
     * @returns {{_token: *, ns: Array}}
     */
    function name_servers_collect_data(form, cont){
        var data = {_token 	: form.find('[name="_token"]').val()},
            ns_group = $('#ns_group').val();

        if(ns_group == 'nons'){
            data.ns = [];

            cont.find('.nameserver:visible input:not(:disabled)').each(function(){
                obj = $(this);

                if(obj.val() != ''){
                    // name = obj.attr('name').match(/[0-9]+/g)[0];
                    data.ns.push(obj.val());
                }
            });
        }else{
            data.list = ns_group;
        }

        return data;
    }

    /**
     * Move all empty nameservers to the bottom of the list. This function is called only after a delete so remove the last visible input.
     */
    function sort_empty_nameservers(remove,all){
        data = [];
        var inputs = (typeof all == 'undefined') ? dependencies.ns_container.find('input:visible') : $('.name_server_input');

        inputs.each(function () {
            obj = $(this);
            if(obj.val()){
                data.push({
                    value : obj.val(),
                    disabled : obj.disabled(),
                    class : obj.closest('.row').attr('class')
                });
            }
        });

        inputs.each(function (key){
            if(typeof data[key] != 'undefined'){
                $(this).val(data[key]['value']).disabled(data[key]['disabled']).closest('.row').attr('class',data[key]['class']);
            }else if (typeof remove != 'undefined' && remove) {
                $(this).closest('.row').remove();
            }
        });

        if (typeof remove == 'undefined') {
            dependencies.ns_container.find('.row:visible:last').hide();
        }
    }

    /**
     * Display all the saved nameservers on forms display mode.
     */
    function show_saved_nameservers(){
        var list = $('.nameserver_labels').empty(),
            nsHosts = $('.ns_host_input:not(.name_server_input)');

        if(nsHosts.length){
            nsHosts.each(function () {
                var host = $(this);

                list.append('<span>' + host.val() + $('#eu_host_tooltip').html() + '</span>');
            });

        }

        if(!$.isEmptyObject(log.nameservers)){
            var appendable = '';

            if('list' in log.nameservers){
                $('.grouped_ns_input').each(function () {
                    appendable += '<span class="toClipBoard">' + $(this).val() + '</span>';
                })
            }else{
                $.each(log.nameservers,function(key,data){
                    if(data.value) {
                        appendable += '<span class="toClipBoard">' + data.value + '</span>';
                    }else{
                        row = $('[name="' + key + '"]').closest('.row');
                        if(!row.hasClass('suggested'))
                            row.remove();
                    }
                });
            }
            list.append(appendable);
            reconstruct_ns_form();
        }else if(nsHosts.length < 1){
            list.append($('#no_ns_warning').html());
        }
    }

    /**
     * Manage delete nameserver btn`s visibility based on maximum number of nameservers.
     */
    function handle_delete_when_max_applied(){
        var max = $('.nameservers_has_max').attr('data-max');
        if(typeof max != 'undefined'){
            if(dependencies.ns_container.find('.row:visible').length < max) {
                $('#add_nameserver').show();
            }else{
                $('#add_nameserver').hide();
            }
        }else{
            $('#add_nameserver').show();
        }
    }

    /**
     * Determine if add nameserves btn can be visible.
     */
    function handle_add_when_max_applied(){
        var addBtn = $('#add_nameserver'),
            max = parseInt($('.nameservers_has_max').attr('data-max'));

        if(typeof max != 'undefined'){
            var $nsfound = dependencies.ns_container.find('.row:visible').length;

            if(dependencies.isEu)
                $nsfound += $('.ns_host').length;

            if($nsfound == max)
                addBtn.hide();
            else
                addBtn.show();

        }else{
            addBtn.hide();
        }
    }

    /**
     * Determine if add hosts btn can be visible.
     */
    function handle_add_host_visibility(){
        var addHost = $('#euHostAdd');

        if(addHost.length){
            var max = $('.nameservers_has_max').attr('data-max');

            if(dependencies.ns_container.find('.row').length >= max){
                addHost.hide();
            }else{
                addHost.show();
            }
        }
    }

    /**
     * Remove any previous validation error on nameservers form.
     */
    function remove_nameservers_errors(){
        dependencies.ns_container.find('.error').removeClass('error');
        dependencies.ns_container.find('.help-block').remove();
    }

    /**
     * Displays the warning for minimum whenever the nameservers count drops to minimum
     */
    function handle_min_ns_warning(){
        if(dependencies.has_min.length){
            if(dependencies.ns_container.find('.row:visible').length <= min_ns){
                $('#min_ns_warning').show();
            }else{
                $('#min_ns_warning').hide();
            }
        }else{
            $('#min_ns_warning').hide();
        }
    }

    /**
     * If the nameservers form is empty reconstruct the form to have the bare minimum servers waiting to be set
     */
    function reconstruct_ns_form(){
        if($('#ns_group').val() != 'nons'){
            $('#ns_group').change();
            return ;
        }

        if($.isEmptyObject(log.nameservers)){
            if(typeof min_ns == 'undefined' || min_ns == 0){
                add_new_nameserver(true);
            }else{
                for(var i = 1; i <= min_ns; i++){
                    add_new_nameserver(true);
                }
            }

            $('.newly_added.nameserver').removeClass('newly_added');

            if(typeof min_ns != 'undefined' && min_ns > 0)
                $('.nameserver').addClass('suggested').find('.delete_server').addClass('hide');
        }
        log_nameservers();
    }

    /**
     * Sort the nameservers so the host related servers to be on top
     */
    function hosts_first(){
        var log = [];

        dependencies.ns_container.find('.ns_host').each(function(){
            row = $(this);
            input = row.find('input');
            log.push({
                class : row.attr('class'),
                value : input.val(),
                disabled : input.prop('disabled'),
                del_reg : row.find('.del_reg').is('visible')
            });
        });

        dependencies.ns_container.find('.nameserver').each(function(){
            row = $(this);
            input = row.find('input');
            log.push({
                class : row.attr('class'),
                value : input.val(),
                disabled : input.prop('disabled'),
                del_reg : row.find('.del_reg').is('visible')
            });
        });

        dependencies.ns_container.find('.row').each(function(key){
            var row = $(this),
                input = row.find('input'),
                data = log[key];

            row.attr('class',data.class);
            input.val(data.value).disabled(data.disabled);

            if((data.class).indexOf('ns_host') > -1){
                row.find('.delete_server').hide();
            }else{
                row.find('.delete_server').show();
            }

            if(row.find('[data-tooltip]').length < 1 && row.hasClass('ns_host')){
                row.find('label').append($('#eu_host_tooltip').html());
            }
        });

        dependencies.ns_container.find('.row:not(.ns_host) [data-tooltip]').remove();
        $(document).foundation('tooltip', 'reflow');
    }

    /**
     * Reconstruct the form using the servers response as input.
     * Set the nameservers contained in the response and remove those not defined
     * @param ns
     */
    function reconstruct_ns_form_on_response (ns) {
        $('.nameserver').each(function (key) {
            var value = ns[key];

            if(value){
                $(this).find('input').val(value);
            }else{
                $(this).remove();
            }
        });
    }

    function edit_ns_form_trigger_callback () {
        if(! dependencies.ns_form.hasClass('under_validation')){
            dependencies.ns_form.prepare_form_advanced({
                onSuccess   : function(){
                    assign_edit_nameservers_validation();
                },
                handlers    : '.submit-edit',
                disable     : '.submit-edit,.nameservers_cancel',
                cancel      : {
                    handler     : '.nameservers_cancel',
                    callback    : function(obj){
                        cancel_nameserver_changes(obj);
                    }
                },
                ver_control : {
                    value   : 'log,nameservers',
                    type    : 'array'
                }
            });
        }
        reconstruct_ns_form();
    }

    function remove_ns_from_form (obj) {
        remove_name_server(obj);
        remove_nameservers_errors();

        var cont = $('#nameServerInputCont');

        if(cont.find('.nameserver:visible').length < 1) {
            var msg;

            if (dependencies.isEu && $('.ns_host_input').length)
                msg = COMMON_LANG.DOMAINS.EMPTY_NS_CUSTOM_EXCLUDED;
            else
                msg = COMMON_LANG.DOMAINS.EMPTY_NS;

            cont.append('<span id="noNSNotice" class="alert-box warning">' + msg + '</span>');
        }

        handle_delete_when_max_applied();
    }

    function look_up_shared_hosting_ns (){
        var post = JSON.stringify(name_servers_obj.data),
            shared_hosting_ns = false;

        $.each(dnhost_ns, function(key, value){
            if(post.indexOf(value) > -1){
                shared_hosting_ns = true;
                return false;
            }
        });

        return shared_hosting_ns;
    }

    function toggleNsGroupToList () {
        var ns_list = $('#nameServerInputCont').show();
        $('#nameServerInputCont, #add_nameserver').show();
        $('#nameServerGroupCont').hide();

        var current_servers = ns_list.find('.nameserver');

        if(current_servers.length == 0){
            if(min_ns <= 1)
                add_new_nameserver(true);
            else
                for($i = 0; $i < min_ns; $i ++){
                    add_new_nameserver(true);
                }
        }else if(current_servers.length < min_ns) {
            for ($i = ns_list.find('.nameserver').length; $i < min_ns; $i++) {
                add_new_nameserver(true);
            }
        }

        ns_list.find('.suggested').removeClass('suggested');

        check_min_required_nameservers();
    }

    function toggleNsListToGroup (obj) {
        var selectedNsItem  = obj.val();

        $('#add_nameserver').hide();

        NSGroupToList($('#nameServerInputCont'), ns_groups[ns_groups.findIndex(function($item){return $item.id == selectedNsItem})].nameservers);
    }

    function NSGroupToList ($cont, $servers){
        $.each($servers, function (key, value) {
            var newNs = $cont.append($('#name_server_input_temp').html()).find('.nameserver:last'),
                input = newNs.find('input');

            input.update_version_control(value.name).addClass('grouped_ns_input').disabled(true).attr_app('name', (++key));
            // newNs.find('.delete_reg').remove();
            newNs.find('.delete_reg').attr('class', 'delete_reg delete_group_entry');
            newNs.removeClass('newly_added').addClass('grouped_ns');
        });
    }

    function removeEntryFromNsGroup (button) {
        toggleNsGroupToList();

        $('#ns_group').chosen_update('nons');

        var cont = button.closest('#nameServerInputCont');

        cont.find('.grouped_ns').removeClass('grouped_ns').find('input').removeClass('grouped_ns_input').disabled(false);
        cont.find('.delete_reg').attr('class', 'delete_reg  delete_server  ');

        button.click();

        $('.name_server_input').each(function (i) {
            var obj = $(this);

            obj.attr('name', 'ns.' + (--i)).attr_app('id', i);
        });
    }

//NAMESERVERS END

//HOSTS START

    /**
     * Assign the validation and request execute function for add host form;
     * @param form
     */
    function assign_add_host_validation(form){
        if(!form.hasClass('under_validation')){
            form.prepare_form_advanced({
                onSuccess           : function(){
                    var form = $('#new_host_form');

                    if(typeof new_host_obj != 'object'){
                        new_host_obj = new $.ajax_prototype({
                            type    : 'POST',
                            url     : form.attr('action'),
                            timeout : dependencies.ajax_timeout,
                            success : function(data){
                                add_new_host_request_callback(data, form);
                            }
                        }, form.attr('id'));
                    }

                    new_host_obj.data = {
                        _token : form.find('[name="_token"]').val(),
                        hostname : form.find('[name="hostname"]').val(),
                        hostdetails : [form.find('[name="ip"]').val()]
                    };

                    $.ajax(new_host_obj);
                },
                handlers            : '.submit_new_host',
                disable             : '.submit_new_host,.new_host_cancel',
                version_exception   : true
            });
        }
    }

    /**
     * Handle the server`s response for add host request.
     * @param data
     * @param form
     */
    function add_new_host_request_callback(data, form){
        if(data.success){
            create_new_host(data);

            if (dependencies.isEu) {
                eu_post_create_host(data);
            } else {
                non_eu_host_handle_add(true)
            }

            closeLine($('.new_host_cont'));
            $('#noHostWarning').hide();

            $('.remove_hosts_wrn').show();

            dependencies.hosts_changed = true;
        }else{
            switch (data.code){
                case error_codes.validation_error:
                    if('hostname' in data.data)
                        $('#new_host_form').find('[name="hostname"]').displayIndividualErrors(data.data.hostname[0]);

                    if('hostdetails.0' in data.data)
                        $('#new_host_form').find('[name="ip"]').displayIndividualErrors(data.data['hostdetails.0'][0]);
                    break;
                default:
                    errorHandler(data);
            }
        }
    }

    /**
     * Assign the validation and request execute function for edit host.
     * @param current_form
     */
    function assign_host_edit_form_validation(current_form){
        if(!current_form.hasClass('under_validation')){
            current_form.prepare_form_advanced({
                onSuccess   : function(){
                    var form = current_form;

                    if(typeof host_edit_obj != 'object'){
                        host_edit_obj = new $.ajax_prototype({
                            type    : 'POST',
                            timeout : dependencies.ajax_timeout,
                            success : function(data){
                                if (data.success) {
                                    edit_host_request_callback(data);
                                } else {
                                    errorHandler(data, form.attr('id'));
                                }
                            }
                        }, form.attr('id'));
                    }

                    host_edit_obj.url = host_name_edit_url.replace('#id',form.closest('.host_cont').attr('data-hostId'));
                    host_edit_obj.data = {
                        _token : form.find('[name="_token"]').val(),
                        hostdetails : {}
                    };

                    form.find('[name*="hostdetails"]:visible').each(function(){
                        var obj = $(this),
                            val = obj.val();

                        if(val){
                            var name = obj.attr('name').match(/[0-9]+/g)[0];
                            host_edit_obj.data.hostdetails[name] = val;
                        }
                    });

                    $.ajax(host_edit_obj);
                },
                handlers    : '.submit_host',
                disable     : '.submit_host,.host_cancel',
                cancel      : {
                    handler     : '.host_cancel',
                    callback    : function(obj){
                        hosts_cancel_form(obj);
                    }
                }
            })
        }
    }

    /**
     * Handle the server`s response for edit host request.
     * @param data
     */
    function edit_host_request_callback(data){
        var cont = $('[data-host^="' + data.data.hostname + '."]'),
            ip_cont = cont.find('.host_ip_cont');

        ip_cont.empty();
        $.each(data.data.addr,function(key,value){
            ip_cont.append('<span>' + value + '</span>');
        });

        cont.find('[name^="hostdetails"]').each(function(key){
            var value = data.data.addr[key];
            if(value) {
                $(this).addClass('saved').update_version_control(value);
            }else{
                $(this).closest('.row').remove();
            }
        });

        cont.find('.pending_delete').closest('.row').remove();

        add_host = $('.new_host_cont');
        if ($('.host_cont').length > add_host.attr('data-max')) {
            add_host.hide();
        }else{
            add_host.show();
        }

        closeLine(cont);

        dependencies.hosts_changed = true;
    }

    /**
     * Handle the server`s response for delete host request.
     * @param data
     */
    function delete_request_callback(data){
        if (data.success) {
            var target = $('[data-hostId="' + data.data.hostId + '"]');

            if (dependencies.isEu) {
                eu_post_delete_host(target);
            }else {
                non_eu_host_handle_add();
            }

            target.remove();

            if($('.host_cont').length < 1){
                $('#noHostWarning').show();
                $('#a_records_wrn').hide();
                $('.remove_hosts_wrn').hide();
            }

            dependencies.hosts_changed = true;
        } else {
            errorHandler(data);
        }

        $('#deleteHost').modal_close();

        if($('.ns_host').length < 1)
            $('#euHosts').hide();
    }

    /**
     * Handle add host cont`s visibility based on the hosts count
     * @param hide
     */
    function non_eu_host_handle_add(hide){
        var cont = $('.new_host_cont'),
            max = cont.attr('data-max');

        if (typeof hide == 'undefined') {
            if($('.host_cont').length - 1 < max){
                cont.show();
            }
        } else {
            if($('.host_cont').length >= max){
                cont.hide();
            }
        }

    }

    /**
     * Add a new host based on servers response for add host request.
     * @param data
     */
    function create_new_host(data){
        $('.new_host_cont').before($('#host_temp').html());

        new_h = $('.host_cont:last');

        new_h.attr({'data-hostid': data.data.hostid, 'data-host' : data.data.hostname + new_h.attr('data-host')});
        new_h.find('form').attr_app('id',data.data.hostid);
        new_h.find('.first-label').text_pre(data.data.hostname);
        new_h.find('.host_ip_cont').html('<span>' + data.data.addr[0] + '</span>');

        new_h.find('[name="host_name"]').val(data.data.hostname);
        new_h.find('[name="hostdetails.0"]').update_version_control(data.data.addr[0]);
    }

    /**
     * Secondary callback function for new host request. Executes a collection of function like "convert_host_to_nameserver()".
     * @param data
     */
    function eu_post_create_host(data){
        ns = data.data.hostname + '.' + fqdn;
        ns_count = dependencies.ns_container.find('.row').length + 1;

        convert_host_to_nameserver(ns);
        handle_add_btn_visibility_for_eu(ns_count);

        check_min_required_nameservers(true);
        log_nameservers();
        show_saved_nameservers();
        handle_min_ns_warning();

        $('#free-hosting').disabled(true);
        $('#euHosts').show();
    }

    /**
     * Secondary callback function for delete host request. Executes a collection of functions like "remove_nameserver()".
     * @param target
     */
    function eu_post_delete_host(target){
        remove_nameserver(target);
        handle_add_btn_visibility_for_eu(dependencies.ns_container.find('.row').length);
        log_nameservers();
        handle_min_ns_warning();

        if(($('.host_cont').length - 1) < 1){
            $('#free-hosting').disabled(false);
            $('#shortcut').show();
        }
    }

    /**
     * If the domain is ".eu" create a name server for this after the server`s response on create.
     * @param ns
     * @param ns_count
     */
    function convert_host_to_nameserver(ns){
        var cont = $('#euHostCont');

        cont.append($('#custom_name_server_input_temp').html());

        new_ns = cont.find('.ns_host:last');
        new_ns.find('input').val(ns).disabled(true);
        new_ns.find('.delete_reg').remove();
        new_ns.removeClass('newly_added nameserver').addClass('ns_host');
        new_ns.find('input').attr('class', 'ns_host_input').attr('name', 'new_ns.' + $('.ns_host').length);
    }

    /**
     * If the domain is ".eu" this function is used to determine if add host button is required to be visible.
     * @param ns_count
     */
    function handle_add_btn_visibility_for_eu(ns_count){
        var max = $('.nameservers_has_max').attr('data-max');

        if(typeof max != 'undefined'){
            if(ns_count < max){
                $('#add_nameserver, #euHostAdd').show();
            }else{
                $('#add_nameserver, #euHostAdd').hide();
            }
        }else{
            $('#add_nameserver, #euHostAdd').show();
        }
    }

    /**
     * Create and send a request to delete selected server.
     * @param obj
     */
    function send_delete_host_request(obj){
        var form = obj.closest('form');

        if(typeof delete_verify != 'object'){
            delete_verify = new $.ajax_prototype({
                type 	: 'POST',
                timeout : dependencies.ajax_timeout,
                success	: function(data){
                    delete_request_callback(data);
                }
            },'',{
                complete    : function () {
                    $('#deleteHost').modal_close();
                }
            });
        }

        delete_verify.url = form.attr('action').replace('#id',$('#deleteHost').attr('data-target'));
        delete_verify.data = form.serialize();

        $.ajax(delete_verify)
    }

    /**
     * If the domain is ".eu" loops through the current name servers to find the targeted host and removes it from the nameserver list.
     * @param target_h
     */
    function remove_nameserver(target_h){
        $('.ns_host_input').each(function(){
            var obj = $(this);

            if(obj.val() == target_h.attr('data-host')){
                obj.closest('.row').remove();
                log_nameservers();
                show_saved_nameservers();
                return false;
            }
        });

        $('.nameserver .has-tip').remove();
    }

    function delete_host_trigger_callback (obj) {
        var server = obj.closest('.host_cont');

        $('#target_server').text(server.attr('data-host'));
        $('#deleteHost').attr('data-target',server.attr('data-hostId')).modal_open();
    }

    function hosts_cancel_form (obj) {
        var pending_delete = obj.closest('form').find('.pending_delete');

        if(pending_delete.length){
            $('.delete_ip').show();
            pending_delete.removeClass('pending_delete').closest('.row').show();
        }

        reveal_add_host();
    }

    function delete_host_ip (obj) {
        var form = obj.closest('form'),
            order = parseInt(obj.closest('.row').find('input').attr('name').match(/[0-9]+/g)[0]),
            inputs = form.find('.ip_input').length;

        for(var i = order; i < inputs; i++){
            var current = form.find('[name="ip_' + i + '"]'),
                next = form.find('[name="ip_' + (i + 1) + '"]');

            if(next.length){
                current.val(next.val());
            }
        }

        form.find('.row:visible:has(.ip_input):last').hide().find('input').addClass('pending_delete');

        var last_delete = form.find('.delete_ip:visible');
        if(last_delete.length == 1){
            last_delete.hide();
        }
    }

    function reveal_add_host () {
        if(dependencies.isEu && $('.name_server_input').length >= parseInt($('.nameservers_has_max').attr('data-max')))
            return ;

        $('.new_host_cont').show();

    }
//HOSTS END


//EXTRA SERVICES START

    function authorization_code_request(form) {
        if(typeof send_code != 'object'){
            send_code = new $.ajax_prototype({
                type 		: 'POST',
                timeout     : dependencies.ajax_timeout,
                beforeSend 	: function(){ return },
                complete	: function(){ return },
                success 	: function(data){
                    authorization_code_request_callback(data);
                }
            })
        }

        send_code.url = form.attr('action');
        send_code.data = form.serialize();
        $.ajax(send_code);
    }

    function authorization_code_request_callback (data) {
        if(data.success){
            if(data.code == error_codes.domain_authorization_code_sent){
                $.alertHandler('',data.msg.replace(/[#]+email[#]+/, data.data),alert_box_success);
            }else{
                $.alertHandler('',data.msg,alert_box_success);
            }
        }else{
            errorHandler(data);
        }
    }

    function perform_request_on_switch_toggle (obj) {
        var form = obj.closest('form'),
            token = form.find('[name="_token"]');

        if(typeof switch_con != 'object'){
            switch_con = new $.ajax_prototype({
                type	: 'POST',
                timeout : dependencies.ajax_timeout,
                success : function (data) {
                }
            });
        }

        switch_con.url = form.attr('action');
        switch_con.data = {
            '_token' 			: token.val(),
            'service'			: form.attr('data-service'),
            'service_status'	: obj.prop('checked')
        };

        $.ajax(switch_con)
    }

//EXTRA SERVICES START


//FREE HOSTING START

    function free_hosting_request(obj) {
        var form = obj.closest('form');

        if (typeof free_host_obj != 'object') {
            free_host_obj = new $.ajax_prototype({
                type    : 'POST',
                timeout : dependencies.ajax_timeout,
                success : function (data) {
                    free_host_request_callback (data);
                }
            });
        }

        free_host_obj.url = form.attr('action');
        free_host_obj.data = {
            _token: form.find('[name="_token"]').val(),
            active: $('.free-hosting').prop('checked')
        };

        $.ajax(free_host_obj)
    }

    function free_host_request_callback (data) {
        if (!data.success) {
            trigger = $('.free-hosting');
            trigger.prop({'checked': !trigger.prop('checked')});
            errorHandler(data);
        } else {
            if ($('.free-hosting').prop('checked')) {
                enable_free_hosting(data);
            } else {
                disable_free_hosting();
            }
        }

        $('#freeHosting').modal_close();
    }

    function enable_free_hosting (data) {
        $('#free-hosting-wrapper').find('.item').show();

        $.each(data.data, function (key, properties) {
            $.each(properties, function (property, value) {
                var element = $('[data-about="' + key + '-' + property + '"]');

                if (key == 'plesk' && property == 'address') {
                    element.attr('href', value['url'])/*.text(value['display'])*/;
                } else {
                    element.text(value);
                }
            });
        });

        rebuild_free_hosting_nameservers ();
        $('#nameserver_manager').hide();
        $('#free_host_redirect').show();
        closeBlock(dependencies.ns_container.closest('.wrapper'));

        if(dependencies.isEu){
            $('#free_hosting_wrn').show();
            $('#paid_hosting_wrn, .new_host_cont').hide();
        }
    }

    function disable_free_hosting () {
        $('.name_servers_edit').removeClass('disabled');

        $('.item:has(.free_hosting_info)').hide();

        $('#nameserver_manager').show();
        $('#free_host_redirect').hide();

        if(dependencies.isEu){
            $('#free_hosting_wrn').hide();
            $('#paid_hosting_wrn, .new_host_cont').show();
        }
    }

    function toggle_free_hosting_service (obj, modal) {
        var disableNoticeElements   = $('#hostingHeaderDisable, #hostingDisable'),
            enableNoticeElements    = $('#hostingHeaderActivate, #hostingActivate');

        if(obj.prop('checked')){
            disableNoticeElements.hide();
            enableNoticeElements.show();

            build_arecords_list();
            if($('.host_cont').length) {
                $('#a_records_wrn').show();
            }
        }else{
            disableNoticeElements.show();
            enableNoticeElements.hide();

            $('#a_records_wrn').hide();
        }

        modal.modal_open();
    }

    function build_arecords_list () {
        if(!dependencies.isEu && dependencies.hosts_changed){
            var a_records = $('#a_records').empty();

            $('.host_cont').each(function () {
                var obj = $(this);

                a_records.append('<li>' + obj.find('.first-label').text() + ' </li>');
                var last_li = a_records.find('li:last');

                ips = obj.find('[name*="hostdetails"]');

                ips.each(function(key){
                    if (++key < ips.length) {
                        last_li.text_app(' ' + $(this).val() + ',');
                    } else{
                        last_li.text_app(' ' + $(this).val());
                    }
                });
            });

            dependencies.hosts_changed = false;
        }
    }

    function rebuild_free_hosting_nameservers () {
        $('#ns_group').chosen_update('nons');
        $('#nameServerInputCont').show();
        $('#nameServerInputCont, #add_nameserver').show();
        $('#nameServerGroupCont').hide();

        dependencies.ns_container.empty();
        $.each(free_hosting_ns, function (key,value) {
            add_new_nameserver(true);
            $('.name_server_input:last').val(value);
        });

        log_nameservers();
        show_saved_nameservers();
    }

//FREE HOSTING END

function errorHandler(data, formId){
    if (data.code != error_codes.general_gdpr_approval_is_missing)
        $('#gdpr_approval_modal').modal_close();

    switch (data.code){
        case error_codes.contact_role_deletion_not_allowed      : //7502
        case error_codes.registry_maintenance                   : //26000
        case error_codes.domain_does_not_exist                  : //30014
        case error_codes.host_in_use_delete_not_allowed         : //32006
        case error_codes.nameserver_could_not_update            : //32050
        case error_codes.nameserver_could_not_get_info          : //32051
        case error_codes.nameserver_exceed_upper_limit          : //32052
        case error_codes.nameserver_do_not_cover_lower_limit    : //32053
        case error_codes.nameserver_does_not_have_host          : //32060
        case error_codes.contact_update_chargeable              : //32100
        case error_codes.contact_update_not_allowed_for_role    : //32101
        case error_codes.contact_maximum_reached                : //32102
        case error_codes.domain_contact_update_failed           : //32103
        case error_codes.contact_not_in_eu                      : //32104
        case error_codes.send_authorization_code_failed         : //32105
        case error_codes.free_hosting_cant_be_activated         : { //33003
            $.alertHandler('',data.msg,alert_box_failure);
            break;
        }
        default : {
            var dataKeys = Object.keys(data.data);
            if (dataKeys.join('').indexOf('nameservers') > -1) {
                for (var i in dataKeys) {
                    if (dataKeys.hasOwnProperty(i)) {
                        var fieldName = dataKeys[i].split('.');

                        if (fieldName.length == 2)
                            $('#nameserver' + fieldName[1]).displayIndividualErrors(data.data[dataKeys[i]][0])
                    }
                }
            } else {
                globalApplicationErrors(data, formId);
            }
        }
    }
}

function post_close_command (form) {
    if(form.attr('id').indexOf('host_form_') > -1){
        reveal_add_host();
    }
}

//TODO: For admin show along with contact name the contact key.
//TODO: Keep in mind that if the domains becomes one page the links targeting a tab should become smouth scroll.