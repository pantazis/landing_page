$(document).ready(function () {
    var form_request_obj        = {},
        payment_methods         = {
            attributes  : true
        },
        active_loaders          = [],
        pending_delete          = [],
        up_sell_delete          = [],
        protected_items         = {},
        checkoutProgressSent    = false,
        gdpr_approval_modal     = $('#gdpr_approval_modal'),
        checkout_sent           = false;

    $.observers.register('payment_methods', function (mutations) {
        mutations.forEach(function(mutation) {
            var disabled = mutation.target.className.indexOf('disabled-options') > -1,
                target_inputs = mutation.target.getElementsByTagName('input'),
                containers = document.getElementsByClassName('payment_method_containers');

            for(var i = 0; i < target_inputs.length; i++){
                target_inputs[i].disabled = disabled;
            }

            for(i = 0; i < containers.length; i++){
                containers[i].className = containers[i].className.replace('active', '').trim();
                containers[i].getElementsByTagName('input')[0].checked = false;
            }
        });
    });

    $.getAddToCartConfiguredCart();
    $.getUpdateConfiguredCart();

    logs = {};

    $.extend({
        cart_modals         : {
            close : function (target) {
                close_cart_modal(target);
            },
            handlers : {
                cartContactHandler : function (data){
                    cartContactHandler(data);
                }
            }
        },
        cart_loaders        : {
            unsetLoader             : function (triggered_item) {
                unsetLoader (triggered_item);
            },
            get_protected_item      : function (item) {
                if(Object.keys(protected_items).length && item in protected_items)
                    return protected_items[item];

                return false;
            },
            get_pending_delete      : function () {
                return pending_delete;
            },
            remove_pending_delete   : function (item) {
                pending_delete = pending_delete.join(',').replace(item,'').replace(/,{2,}/,',').replace(/^,|,$/,'');

                if(pending_delete == '')
                    pending_delete = [];
                else
                    pending_delete = pending_delete.split(',');
            },
            get_active_loaders      : function () {
                return active_loaders;
            },
            find_up_sell_delete     : function (item) {
                return $.inArray(item, up_sell_delete) > -1;
            }
        },
        request_flavors     : {
            cart_edit       : {
                properties  : {
                    type        : 'POST',
                    success     : function (data) {
                        data.data.instance = this;

                        if(data.success)
                            $.cart.view.reCreateCartSummary(data.data);
                        else
                            $.cart.errorHandler(data);

                        if (app_env != 'local' && 'remarketing_items' in data.data)
                            $.updateItemInAnalytics(data.data.remarketing_items);
                    },
                    complete    : function () {}
                },
                parameters  : {
                    beforeSend  : function (instance) {
                        activateFormDim();
                        addLayerLoader(instance.triggered_item, true, false, true);
                        registerLoader(instance.triggered_item);
                    }
                },
                expansion   : {
                    presuccesscallback  : function (instance) {
                        unsetLoader(instance.triggered_item);
                    },
                    preerrorcallback    : function (instance) {
                        unsetLoader(instance.triggered_item);
                    }
                }
            },
            up_sell         : {
                properties  : {
                    type        : 'POST',
                    success     : function (data) {
                        data.data.instance = this;

                        if(data.success)
                            $.cart.view.reCreateCartSummary(data.data);
                        else
                            $.cart.errorHandler(data);
                    },
                    complete    : function () {}
                },
                parameters  : {
                    beforeSend  : function (instance) {
                        activateFormDim();
                        var obj     = $(instance.triggered_item),
                            $upsell = $(instance.triggered_item).filter('input');

                        if($upsell.length < 1)
                            $upsell = $(instance.triggered_item).find('input');

                        if($upsell.hasClass('item'))
                            $upsell = $upsell.find('[type="checkbox"]');

                        if($upsell.prop('checked')){
                            addLayerLoader(instance.triggered_item, true, true);
                            registerLoader(instance.triggered_item);
                        }else{
                            pending_delete.push(instance.triggered_item);

                            var parentId = '[data-cart-item-id="' + $upsell.closest('[data-group="ssl"]').attr('data-cart-item-id') + '"]';

                            addLayerLoader(parentId, true, true);
                            up_sell_delete.push(parentId);

                            registerLoader(instance.triggered_item);
                        }
                    }
                },
                expansion   : {
                    presuccesscallback  : function (instance) {
                        unsetLoader(instance.triggered_item);
                    },
                    preerrorcallback    : function (instance) {
                        unsetLoader(instance.triggered_item);
                    }
                }
            },
            cart_delete     : {
                parameters  : {
                    beforeSend  : function (instance) {
                        activateFormDim();
                        addLayerLoader(instance.triggered_item, true, false, true);
                        registerLoader(instance.triggered_item);

                        pending_delete.push(instance.triggered_item);

                        var $item = $(instance.triggered_item);

                        if($item.hasClass('cross_sale')){
                            $item.prev('hr').remove();
                            $item.closest('.item').attr('data-contains', instance.triggered_item.match(/[0-9]+/));
                        }

                        $item.remove();

                        if($('.cart_step  .item:visible').length < 1) {
                            var cont = $('#product-summary');

                            cont.find('.footer, .cart-chechout').hide();

                            cont.find('#itemsWrapper').append('<div class="item"><div class="loading" style="height: 4rem; top: 1.5rem; right: 0.5rem; text-align: center;"><span class="spinner bigger dark"></span></div></div>')
                        }
                    }
                },
                expansion   : {
                    presuccesscallback  : function (instance) {
                        unsetLoader(instance.triggered_item);
                    },
                    preerrorcallback    : function (instance) {
                        unsetLoader(instance.triggered_item);
                    }
                }
            },
            cross_sell      : {
                parameters  : {
                    beforeSend  : function (instance) {
                        activateFormDim();
                        addLayerLoader(instance.triggered_item, true, true);
                        registerLoader(instance.triggered_item);
                    }
                },
                expansion   : {
                    presuccesscallback  : function (instance) {
                        unsetLoader(instance.triggered_item);
                    },
                    preerrorcallback    : function (instance) {
                        unsetLoader(instance.triggered_item);
                    }
                }
            },
            domain_objects  : {
                properties  : {
                    type        : "POST",
                    success     : function (data) {
                        var modal = $('#saveToGroup');

                        if(modal.length){
                            modal.attr('data-about','').modal_close();
                            modal.find('.button.disabled').removeClass('disabled');

                            $('#nsGNameInput').val('');

                            modal.find('.error').removeClass('error');
                            modal.find('.help-block').remove();
                        }

                        data.data.instance = this;

                        if(data.success)
                            $.cart.view.reCreateCartSummary(data.data);
                        else
                            $.cart.errorHandler(data);
                    },
                    complete    : function () {
                        var modal           = $('#saveToGroup'),
                            loader_conts    = modal.find('.loader_cont');

                        loader_conts.find('.submitText').show();
                        loader_conts.find('.loading').hide();
                    }
                },
                parameters  : {
                    beforeSend  : function (instance) {
                        activateFormDim();
                        addLayerLoader(instance.triggered_item, false, true, false, $(instance.triggered_item).find('.submit-edit:visible'));
                        registerLoader(instance.triggered_item);
                    }
                },
                expansion   : {
                    presuccesscallback  : function (instance) {
                        unsetLoader(instance.triggered_item);
                    },
                    preerrorcallback    : function (instance) {
                        unsetLoader(instance.triggered_item);
                    }
                }
            }
        },
        rebuildCheckoutForm : function (settings) {
            rebuildCheckoutForm(settings);
        },
        durations           : {
            fixPricesForMediumDown  : function (durations) {
                if(durations.length > 1)
                    durations.each(function() {
                        fixPricesForMediumDown($(this));
                    });
                else
                    fixPricesForMediumDown(durations);

                return this;
            },
            fixPricesForLargeUp     : function (durations) {
                if(durations.length > 1)
                    durations.each(function() {
                        fixPricesForLargeUp($(this));
                    });
                else
                    fixPricesForLargeUp(durations);

                return this;
            }
        }
    });

    $.fn.extend({
        controlDeleteButtons : function () {
            var obj = $(this);

            if(! obj.is('form'))
                obj = obj.closest('form');

            controlDeleteButtons(obj);
        }
    });

    var edit_request        = $.ajax_variable_prototype(null, 'cart_edit'),
        up_sell             = $.ajax_variable_prototype(null, 'up_sell'),
        domain_objects      = $.ajax_variable_prototype(null, 'domain_objects');

    $('.login').on('click', function (e) {
        $('#register-forms').modal_open();
        $('.step_buttons').removeClass('active');
    });

    $('#cartStep').on('click', function () {
        $('.cart_step').hide();
        $('#product-summary').show();
        $('.step_buttons').removeClass('active');
    });

    $('#billingProfileHandler').on('change', function () {
        if(typeof billingProfileUpdate != 'object'){
            billingProfileUpdate = new $.ajax_prototype({
                type    : 'POST',
                url     : billing_update,
                data    : {
                    '_token'        : $('[name="_token"]').val(),
                    'unique_id'     : unique_page_identifier
                },
                success : function (data) {
                    if(data.success) {
                        var billingProfile = data.data.billingProfile,
                            checkout = data.data.checkout,
                            profileData = '',
                            address = '',
                            name;

                        $('#billingType').translate('billing.type.' + billingProfile.type);

                        if (billingProfile.type == 'rec') {
                            name = $('.account-text small').text()
                        } else {
                            if (billingProfile.vat)
                                profileData = $.translate('billing.vat') + ': ' + billingProfile.vat.substring(2);

                            if (billingProfile.address && billingProfile.zip && Object.keys(billingProfile.country_detail).length) {
                                address = billingProfile.address + ', ' + billingProfile.zip + ' - ';
                            }

                            if (billingProfile.country_detail.iso_2 == 'GR') {
                                name = billingProfile.name;

                                if (billingProfile.doy) {
                                    if (profileData)
                                        profileData += ' - ';

                                    profileData += $.translate('billing.doy') + ': ' + billingProfile.doy;
                                }

                                if (billingProfile.state_detail && Object.keys(billingProfile.state_detail).length) {
                                    address += billingProfile.state_detail.name_el + ' (' + billingProfile.country_detail.name + ')';
                                } else {
                                    address = '';
                                }
                            }else{
                                name = billingProfile.name;

                                if (billingProfile.state) {
                                    address += billingProfile.state + ' (' + billingProfile.country_detail.name + ')';
                                } else {
                                    address = '';
                                }
                            }
                        }

                        $('#billingProfileName').set_text(name);
                        $('#billingProfileData').text(profileData);
                        $('#billingProfileAddress').text(address);

                        $('#billingProfileVatRate').text('(' + checkout.totals.vat_percent + '%)');

                        $('.checkout_order_price').text($.imperial_to_metric(checkout.totals.sub_total));
                        $('.checkout_order_vat').text($.imperial_to_metric(checkout.totals.vat));

                        $order_total = $('.checkout_order_total');
                        if($order_total.hasClass('relative'))
                            $('.checkout_order_total').update_vat(relative, [checkout.totals.sub_total], 0);
                        else
                            $('.checkout_order_total').text($.imperial_to_metric(checkout.totals.grand_total));

                        payment_totals = checkout.settings.total;

                        setOrderTotalBasedOnPaymentSelection(checkout.settings);
                    } else {
                        $.cart.errorHandler(data);
                    }
                }
            })
        }

        billingProfileUpdate.data.billing_profile_id = $(this).val();

        $.ajax(billingProfileUpdate);
    });

    $('.new-billing-profile').on('click', function (e) {
        e.preventDefault();
        open_cart_modal($('#createBilling'), true);
    });

    $('.modal-cancel').on('click', function (e) {
        e.preventDefault();
        close_cart_modal($(this).closest('.custom-modal'));
    });

    $('#nsSave, #nsGNameCancel').on('click', function (e) {
        e.preventDefault();

        $('#nsIntro, #nsGName').toggle();
    });

    $('.payment-methods').on('change', function () {
        var obj = $(this);

        $('.payment_method_containers').removeClass('active');

        if($('.payment-methods:disabled').length){
            obj.closest('.payment_method_containers').addClass('active');
            return ;
        }

        $('.payment-methods[value="' + obj.val() + '"]').prop('checked', true).closest('.payment_method_containers').addClass('active');

        if(obj.val() == 3)
            $('#payment_total').text(payment_totals.credit.display);
        else
            $('#payment_total').text(payment_totals.none.display)
    });

    $('#submitOrder').on('click', function (e){
        e.preventDefault();

        var form = $('#checkout_terms_conditions_form');

        if (! form.is_ready()) {
            form.prepare_form_advanced({
                onSuccess           : function () {
                    handle_order_forms($('#credit_payment_form:visible,#no_credit_payment_form:visible'));
                },
                version_exception   : true
            });
        }

        form.validate();

    });

    $('#reloadCart').on('click', function (e) {
        e.preventDefault();

        location.reload(true);
    });

    $.observers.register('gdpr_approval', function (mutations) {
        try {
            clearTimeout(modalActivbationTimer)
        } catch (e) {}

        modalActivbationTimer = setTimeout(function () {
            $(mutations[0].target).find('[name="agree_terms"]').prop('checked', false);
        }, 100);
    });

    $.observers.observe('gdpr_approval', $('#createContact'), {attributes:true, attributeFilter:['class']});
    $.observers.observe('gdpr_approval', $('#createBilling'), {attributes:true, attributeFilter:['class']});

    $.observers.register('gdpr_info_modal', function (mutations) {
        var creationModal = $('.custom-modal.active');

        if (creationModal.length) {
            if (gdpr_approval_modal.hasClass('open')) {
                gdpr_approval_modal.css('z-index', parseInt(creationModal.css('z-index')) + 1);
                $('.reveal-modal-bg').css('z-index', parseInt(creationModal.css('z-index')) + 1);
            } else {
                disableBodyScrollModalScroll(creationModal);
            }
        }
    });
    $.observers.observe('gdpr_info_modal', $('#gdpr_approval_modal'), {attributes:true, attributeFilter:['class']});

    var groupCreate = $('#ns_group_create_form');

    if(groupCreate.length) {
        groupCreate.prepare_form_advanced({
            onSuccess                   : function () {
                var form = $('#ns_group_create_form'),
                    modal = form.closest('.reveal-modal'),
                    name_input = $('#nsGNameInput:visible');

                if (name_input.length) {
                    form_request_obj[modal.attr('data-about')].data.nameserver_group_name = name_input.val();
                }

                if ($('[name="trigger_ns_group_save"]:checked').val() == 'yes' && name_input.length < 1) {
                    $('#nsIntro').hide();
                    $('#nsGName').show();
                } else {
                    $.ajax(form_request_obj[modal.attr('data-about')]);
                }
            },
            handlers                    : '#nsRadioSubmit, #nsGNameSave',
            disable                     : '.setting_cancel,.submit-edit',
            disable_exception           : true,
            version_exception           : true
        });

        $.observers.register('saveToGroup', function (mutations) {
            $('#nsIntro').show().find('[type="radio"]').prop('checked', false);
            $('#nsGName').hide().find('#nsGNameInput').val('');
        });

        $.observers.observe('saveToGroup', $('#saveToGroup'), {attributes:true, attributeFilter:['class']});
    }

    $(document)
        .on('click', '.item_length', function (e) {
            e.preventDefault();

            var obj = $(this),
                duration = obj.closest('.item_duration'),
                duration_head = duration.find('button'),
                item = obj.closest('[data-cart-item-id]'),
                price = obj.attr('data-price');

            var $edit_item = edit_request();

            $edit_item.url = edit_url.replace('##id##', item.attr('data-cart-item-id'));
            $edit_item.data = {
                _token      : $('[name="_token"]').val(),
                length      : obj.attr('data-length'),
                unique_id   : unique_page_identifier,
                settings    : {}
            };

            $edit_item.triggered_item = '[data-cart-item-id="' + obj.closest('[data-cart-item-id]').attr('data-cart-item-id') + '"]';

            duration.find('.active').removeClass('active');
            obj.closest('li').addClass('active');
            // duration_head.text(obj.get_length_duration('right'));

            durationSizeProcess(duration);

            $.ajax($edit_item);
        })
        .on('click', '.add_cross_sell', function (e) {
            e.preventDefault();
            var obj         = $(this),
                parent_id   = obj.closest('.item').attr('data-cart-item-id'),
                dropdown    = obj.find('.f-dropdown.open'),
                sku         = obj.attr('data-cross-product-sku');

            var data = {
                    '_token': $('[name="_token"]').val(),
                    'parent': parent_id,
                    'unique_id': unique_page_identifier,
                    'sku': sku
                };


            if (sku.indexOf('sha_lin') > -1)
                data['length'] = $('.item_duration #item_' + parent_id + ' .length.active .item_length').attr('data-length');


            if(! $.isTouch() || dropdown.length) {
                $.ajax($.ajax_get_flavor({
                    type: 'POST',
                    url: cart_add,
                    data: data,
                    success: function (data) {
                        data.data.instance = this;

                        if (data.success) {
                            $.cart.view.reCreateCartSummary(data.data);

                            if (app_env != 'local' && 'remarketing_items' in data.data)
                                $.sendAddToCartRemarketingEvent(data.data.remarketing_items)
                        } else {
                            $.cart.errorHandler(data);
                        }
                    },
                    complete: function () {
                    },
                    triggered_item: '[data-cart-item-id="' + obj.closest('.item').attr('data-cart-item-id') + '"]'
                }, 'cross_sell'));
            }
        })
        .on('change', '[data-group="ssl"] select', function () {
            var obj = $(this),
                item = obj.closest('.item');

            var $edit_item = edit_request();

            $edit_item.url = edit_url.replace('##id##', item.attr('data-cart-item-id'));
            $edit_item.data = {
                '_token'    : $('[name="_token"]').val(),
                'length'    : parseInt(item.find('.active [data-length]').attr('data-length')),
                'unique_id' : unique_page_identifier,
                'settings'  : {}
            };
            $edit_item.data.settings[obj.attr('name')] = parseInt(obj.val());

            // obj.closest('.row').find('select').each(function(){
            //     var select = $(this);
            //
            //     edit_request.data.settings[select.attr('name')] = parseInt(select.val());
            // });

            $edit_item.triggered_item = '[data-cart-item-id="' + item.attr('data-cart-item-id') + '"]';

            $.ajax($edit_item);

            obj.blur();
            obj.closest('div').find('.chosen-container').removeClass('chosen-container-active');
        })
        .on('click', '#goToCheckOut:not(.disabled)', function () {
            checkForErrorBeforeGoingToBilling();

            sendCheckoutProgress();
        })
        .on('click', '#billingStep:not(.login):not(.disabled)', function () {
            checkForErrorBeforeGoingToBilling();

            sendCheckoutProgress();
        })
        .on('click', '#goToCheckOut.disabled', function (e) {
            e.preventDefault();
        })
        .on('click', '.domainEdit:not(.login)', function (e) {
            e.preventDefault();
            domainEditSettingOpen($(this));
        })
        .on('click', '.domainEdit.login', function (e) {
            e.preventDefault();
            $('#register-forms').modal_open();
        })
        .on('click', '.addNameServers', function (e) {
            e.preventDefault();
            addNewNameServer($(this));
        })
        .on('click', '.delete_server', function (e) {
            e.preventDefault();
            removeNameserver($(this));
        })
        .on('change', '.ns_group', function () {
            assignNSGroup($(this));
        })
        .on('click', '.new-contact-profile', function (e){
            e.preventDefault();
            open_cart_modal($('#createContact').attr('data-form', $(this).closest('form').attr('id')), true);
        })
        .on('change', '.up_sell_manager', function (e) {
            controlUpSells($(this));
        })
        .on('click', '.edit_domain_name_attribute', function (e) {
           e.preventDefault();

           var obj = $(this).closest('.domain_name_attribute_container');

           obj.find('.domain_name_display_container').hide();
           obj.find('.domain_name_form_container').show();

           var form = obj.find('.ssl_domain_name_form');

           if (! form.is_ready()) {
               form.prepare_form_advanced({
                   onSuccess           : function () {
                       setCommonNameToSslInstallation (form.find('.ssl_domain_name'));
                   },
                   version_exception   : true,
                   handlers            :  '.submit-edit',
                   disable             : '.submit-edit,.up_sell_cancel',
                   cancel              : {
                       handler     : '.up_sell_cancel',
                       callback    : function(obj){
                           upSellCancelForm(obj);
                       }
                   }
               });
           }
        })
        .on('click', '.save_target_domains:not(.stand_alone)', function (e) {
            e.preventDefault();

            saveSSLInstallationSettings($(this).closest('.up_sell'));
        })
        .on('click', '.save_target_domains.stand_alone', function (e) {
            e.preventDefault();

            saveStandAloneSSLInstallationSettings($(this).closest('[data-cart-item-id]'));
        })
        .on('keypress', '.target_domains:not(.stand_alone)', function (e) {
            if(e.which == '13'){
                e.preventDefault();
                saveSSLInstallationSettings($(this).closest('.up_sell'));
            }
        })
        .on('keypress', '.target_domains.stand_alone', function (e) {
            if(e.which == '13'){
                e.preventDefault();
                saveStandAloneSSLInstallationSettings($(this).closest('[data-cart-item-id]'));
            }
        })
        .on('click', '[data-dropdown*="explanation-"]', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('click', '[id*="explanation-"]', function (e) {
            if (!$(e.target).is('a')) {
                e.preventDefault();
                e.stopPropagation();
            }
        })
        .on('click', '.edit_target_domains:not(.stand_alone)', function (e) {
            e.preventDefault();

            convertSslDomainDisplayToEditable($(this).closest('.get-ssl-domain'));
        })
        .on('click', '.edit_target_domains.stand_alone', function (e) {
            e.preventDefault();

            convertSslDomainDisplayToEditableForStandAlone($(this).closest('.get-ssl-domain'));
        });

    $('.get-ssl-domain').slideDown();

    var previousClassification = '',
        currentClassification;

    if($.getSizeClassification('medium_down')){
        var durationSizeProcess = fixPricesForMediumDown;
    }else{
        durationSizeProcess     = fixPricesForLargeUp;
    }

    setTimeout(function () {
        $.durations[durationSizeProcess.name]($('#product-summary .duration'));
    }, 350);

    $(window).on('resize', function () {
        if($.getSizeClassification('medium_down')){
            durationSizeProcess     = fixPricesForMediumDown;
            currentClassification   = 'medium_down';
        }else{
            durationSizeProcess     = fixPricesForLargeUp;
            currentClassification   = 'large_up';
        }

        if(previousClassification != currentClassification)
            $('#product-summary .duration').each(function () {
                durationSizeProcess($(this));
            });

        previousClassification = currentClassification;
    });

    logDomains();
    prepareOrderForm($('.payment-options div:not(.hide) > form:not(#checkout_terms_conditions_form)'));

    $.cookieHandler('cart_item', function ($value) {
        $('html,body').animate({
            scrollTop: $('[data-cart-item-id="' + $value + '"]').offset().top
        }, 1000);
    });

    setTimeout(function () {
        $('#billingProfileHandler_chosen').css('margin-bottom', 0);
    }, 500);

    $('.cart_step select:not([name="additional_domains"]):not([name="servers"]), .custom-modal select:not([name="additional_domains"]):not([name="servers"])').each(function () {
        var select = $(this);

        select.apply_chosen({'value':((select.val()) ? select.val() : ''),'par':{search_contains:true}});
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasCreated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemsWereCreated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasDeleted', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasUpdated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\ItemAlreadyInCart', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\UpSellWasCreated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\UpSellWasDeleted', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\CartBillingProfileWasUpdated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.cart.bind('App\\Events\\Cart\\CartDomainObjectsUpdated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.billing.bind('App\\Events\\Billing\\DefaultProfileWasUpdated', function (data) {
        $.ajax(
            new $.ajax_prototype({
                'type'      : 'POST',
                'url'       : $reloadVatWidgetUrl,
                'success'   : function (data) {},
                'complete'  : function () {
                    handleEventsOnIdle(data);
                }
            })
        );

    });

    channel.billing.bind('App\\Events\\Billing\\BillingProfileWasAdded', function (data) {
        handleEventsOnIdle(data);
    });

    channel.billing.bind('App\\Events\\Billing\\InvoiceProfileWasDeleted', function (data) {
        handleEventsOnIdle(data);
    });

    channel.billing.bind('App\\Events\\Billing\\InvoiceProfileWasUpdated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.domain.bind('App\\Events\\Domains\\NameServerGroupWasCreated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.domain.bind('App\\Events\\Domains\\NameServerGroupWasUpdated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.domain.bind('App\\Events\\Domains\\NameServerGroupWasDeleted', function (data) {
        handleEventsOnIdle(data);
    });

    channel.domain.bind('App\\Events\\Domains\\NameServerWasUpdated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.domain.bind('App\\Events\\Domains\\NameServerWasDeleted', function (data) {
        handleEventsOnIdle(data);
    });

    channel.contacts.bind('App\\Events\\Contacts\\ContactWasCreated', function (data) {
        handleEventsOnIdle(data);
    });

    channel.contacts.bind('App\\Events\\Contacts\\ContactWasDeleted', function (data) {
        handleEventsOnIdle(data);
    });

    function open_cart_modal (target, modalScroll) {
        target.activation(true, function () {
            if(typeof modalScroll == 'undefined')
                disableBodyScroll();
            else
                disableBodyScrollModalScroll(target)
        });
    }

    function close_cart_modal (target) {
        target.activation(false, function () {
            enableBodyScroll();
        });
    }


    /**
     * DOMAIN SETTING START
     */

        /**
         * Open the corresponding form this edit button.
         * Assign validation for this form.
         * @param obj
         */
        function domainEditSettingOpen (obj) {
            var content = obj.closest('.content'),
                item = obj.closest('.item'),
                form_cont = content.find('.attr-form'),
                attr_items = obj.closest('.attr-items'),
                form = form_cont.find('form');

            item.find('.attr-items').show();
            item.find('.attr-form').hide();

            attr_items.hide();
            form_cont.show();

            if(! form.hasClass('under_validation')){
                prepareDomainSettingForm (obj, form, attr_items, form_cont);
            }

        }

        function prepareDomainSettingForm (obj, form, attr_items, form_cont) {
            var validation_config = {
                onSuccess           : function () {
                    commonValidationCallback(obj);
                },
                disable_exception   : true,
                cancel              : {
                    handler     : '.setting_cancel',
                    callback    : function(){
                        getTheCorrespondingCancelForm(obj, form, attr_items);
                    }
                },
                callback            : {
                    'after:prepare' : function () {
                        getTheCorrespondingPrepareCallbackMethod(obj);
                    }
                }
            };

            validation_config = getTheCorrespondingFormHandlers(obj, validation_config);
            validation_config = getTheCorrespondingFormTriggers(obj, validation_config, form);
            validation_config = getTheCorrespondingFormVControl(obj, validation_config);

            form.prepare_form_advanced(validation_config);
        }

        function getTheCorrespondingFormHandlers (obj, validation_config) {
            if (obj.attr('data-edit') == 'nameservers') {
                validation_config.handlers =  '.submit-edit';
            }else if (obj.attr('data-edit') == 'contacts') {
                validation_config.handlers =  '.submit-edit';
            }

            return validation_config;
        }

        function getTheCorrespondingCancelForm (obj, form, attr_cont) {
            if (obj.attr('data-edit') == 'contacts'){
                form.find('[data-last-val]').each(function () {
                    var obj = $(this),
                        val = JSON.parse(obj.attr('data-last-val'))[0];

                    if(obj.is('select'))
                        obj.chosen_update(val);
                    else
                        obj.val(obj);

                });
            }else if (obj.attr('data-edit') == 'nameservers'){
                cancelNameServerGroup(obj, form);
            }

            form.closest('.attr-form').hide();
            attr_cont.show();
        }

        function cancelNameServerGroup (obj, form) {
            var item = obj.closest('.item'),
                ns_cont = item.find('.ns_container'),
                item_logs = logs[item.attr('data-cart-item-id')].name_servers;

            ns_cont.find('.noNS').remove();
            form.find('.submit-edit').removeClass('disabled');

            if('groupId' in item_logs){
                var item_logs_length = 1;

                form.find('.ns_group').chosen_update(item_logs.groupId).change();
            }else if('values' in item_logs){
                var ns_group = form.find('.ns_group');

                form.find('.ns_container').empty();

                if(ns_group.length)
                    ns_group.chosen_update('nons').change();

                item_logs_length = item_logs.values.length;

                $.each(item_logs.values, function (key, value) {
                    var ns = form.find('.nameservers:eq(' + key + ')');

                    if(ns.length < 1)
                        form.find('.addNameServers').click();

                    ns = form.find('.nameservers:eq(' + key + ')');

                    ns.val(value);
                });

            }else{
                var ns_group = form.find('.ns_group');

                if(ns_group.length && ns_group.val())
                    ns_group.chosen_update('').change();

                form.find('.add_nameserver_cont').hide();
                ns_cont.empty();
            }

            for(var i = item_logs_length; i < ns_cont.find('.nameservers').length; i ++){
                $(this).closest('.row').remove();
            }

            if('values' in item_logs){
                controlDeleteButtons(form);
                controlAddNameServerCont(form);
            }
        }

        function getTheCorrespondingFormTriggers (obj, validation_config, form){
            if (obj.attr('data-edit') == 'contacts') {
                // validation_config.trigger =  [
                //     {
                //         'item'  : form,
                //         'event' : 'change',
                //         'callback'  : function () {
                //             form.validate();
                //         }
                //     }
                // ]
            }

            return validation_config;
        }

        function getTheCorrespondingFormVControl (obj, validation_config) {
            if (obj.attr('data-edit') == 'contacts') {
                validation_config.version_exception = true
            }else if(obj.attr('data-edit') == 'nameservers') {
                validation_config.version_exception = true
            }

            return validation_config;
        }

        function commonValidationCallback (obj) {
            var item    = obj.closest('.item'),
                form    = item.find('.' + obj.attr('data-edit') + '_cont form'),
                formId  = form.attr('id'),
                modal   = $('#saveToGroup');

            if(!form_request_obj[formId])
                form_request_obj[formId] = domain_objects();

            form_request_obj[formId].url                = edit_contacts.replace('##id##', item.attr("data-cart-item-id"));
            form_request_obj[formId].data               = {
                '_token'    : form.find('[name="_token"]').val(),
                'unique_id' : unique_page_identifier
            };
            form_request_obj[formId].triggered_item     = '[data-cart-item-id="' + item.attr('data-cart-item-id') + '"]';

            form_request_obj = getProperCollectDataMethod(obj, form, form_request_obj);
            

            var nsOption = form.find('.ns_group').val();

            if(obj.attr('data-edit') == 'contacts' || modal.length < 1 || (nsOption && nsOption != 'nons'))
                $.ajax(form_request_obj[formId]);
            else{
                var toSave = $.makeArray(form.find('.nameservers').filter(function () {return $(this).closest('.row').css('display') != 'none'}).map(function (a, b) {return $(b).val()})).join().replace(/,{2,}/,',').trim().replace(/,$/g,'');

                if(form.find('.nameservers').length && toSave)
                    modal.modal_open().attr('data-about', formId);
                else{
                    $.ajax(form_request_obj[formId]);
                    form.find('a.disabled').removeClass('disabled');
                }
            }

        }

        function getProperCollectDataMethod (obj, form, form_request_obj) {
            if (obj.attr('data-edit') == 'nameservers') {
                return nameserversCollectData(obj, form, form_request_obj);
            }else if (obj.attr('data-edit') == 'contacts') {
                return contactsCollectData(obj, form, form_request_obj);
            }
        }

        function nameserversCollectData (obj, form, form_request_obj) {
            form_request_obj[form.attr('id')].data.object = 'nameservers';

            var ns_group = form.find('.ns_group');

            if(ns_group.length && ns_group.val() && ns_group.val() != 'nons'){
                form_request_obj[form.attr('id')].data.nameservers_group_id = ns_group.val();
            }else{
                var nameservers = $.makeArray(form.find('input:visible').map(function (a, b) {return $(b).val()})).join().replace(/,{2,}/,',').trim().replace(/^,|,$/g,'');

                if(nameservers){
                    nameservers = nameservers.split(',');
                    form_request_obj[form.attr('id')].data.nameservers = nameservers;
                }
            }

            return form_request_obj
        }

        function contactsCollectData (obj, form, form_request_obj) {
            form_request_obj[form.attr('id')].data.object = 'contacts';
            form.find('select').each(function () {
                form_request_obj[form.attr('id')].data[$(this).attr('name')] = $(this).find('option:selected').val();
            });

            return form_request_obj;
        }

        function getTheCorrespondingPrepareCallbackMethod (obj) {
            // if (obj.attr('data-edit') == 'nameservers') {
            //     nameserversPostPrepareCallback();
            // }
        }

        function setGroupToNameServers (form, nameservers) {
            var ns_container = form.find('.ns_container');

            ns_container.empty();
            form.find('.submit-edit').removeClass('disabled');

            $.each(nameservers, function (key, data) {
                ns_container.append('<span>' + data.name + '</span>');
            });

            form.find('.add_nameserver_cont').hide();
        }

        function setEmptyGroup (form) {
            form.find('.ns_container').empty().append('<p class="noNS">This nameserver group has no nameservers</p>');
            form.find('.submit-edit').addClass('disabled');
        }

        function removeGroupSelection (form) {
            var ns_container = form.find('.ns_container');

            if(ns_container.find('.nameservers').length)
                return ;

            ns_container.find('span').remove();
            ns_container.find('.noNS').remove();

            if(form.find('.ns_group').val()){
                form.find('.submit-edit').removeClass('disabled');
                ns_container.find('.nameservers:first').val('').disabled(false);
                ns_container.find('.nameservers:not(:first)').closest('.row').remove();

                if(form.find('.nameservers').length < 1)
                    if(ns_container.attr('data-min') == 0)
                        form.find('.addNameServers').click();
                    else
                        for(var i = 0; i < ns_container.attr('data-min'); i++){
                            form.find('.addNameServers').click();
                        }


                controlDeleteButtons(form);
                controlAddNameServerCont(form);
            }else{
                ns_container.empty();
                form.find('.add_nameserver_cont').hide();
            }
        }

        function controlDeleteButtons (form) {
            var ns = form.find('.nameservers').filter(function () {return $(this).closest('.row').css('display') != 'none'});

            if(ns.length <= form.find('.ns_container').attr('data-min'))
                form.find('.delete_server').hide();
            else
                form.find('.delete_server').show();
        }

        function controlAddNameServerCont (form) {
            if(form.find('.nameservers:visible').length < form.find('.ns_container').attr('data-max'))
                form.find('.add_nameserver_cont').show();
            else
                form.find('.add_nameserver_cont').hide();
        }

    /**
     * DOMAIN SETTING END
     */

    /**
     * SSL SETTING START
     */

        function saveSSLInstallationSettings (item) {
            var target_domains = item.find('.target_domains'),
                data = {
                    '_token'    : $('[name="_token"]').val(),
                    'domain'    : item.find('.target_domains').val(),
                    'unique_id' : unique_page_identifier,
                    'object'    : 'domain'
                },
                url = edit_ssl_settings.replace('##id##', target_domains.attr('name').match(/[0-9]+/g)[0]),
                itemId = item.attr('data-cart-item-id');

            target_domains.element();

            if (target_domains.hasClass('error'))
                return;

            $.ajax(
                new $.ajax_prototype({
                    'type'              : 'POST',
                    'url'               : url,
                    'data'              : data,
                    'beforeSend'        : function () {
                        item.find('.help-block').remove();

                        item.find('.save_target_domains .submitText').hide();
                        item.find('.save_target_domains .loading').show();
                        activateFormDim();
                    },
                    'success'           : function (data) {
                        deactivateFormDim();

                        if (data.success) {
                            data.data.instance = this;
                            $.cart.view.reCreateCartSummary(data.data);
                        } else {
                            if (data.code == error_codes.validation_error && 'domain' in data.data) {
                                target_domains.addClass('error').after(helperBlock);
                                item.find('.help-block').html(data.data.domain.join('<br>'));
                            }

                            globalApplicationErrors(data);

                        }
                    },
                    'preerrorcallback'  : function () {
                        deactivateFormDim();
                    },
                    'triggered_item'    : '[data-cart-item-id="' + ((itemId) ? item.attr('data-cart-item-id') : item.closest('[data-cart-item-id]').attr('data-cart-item-id')) + '"]'
                })
            );
        }

        function saveStandAloneSSLInstallationSettings (item) {
            var target_domains = item.find('.target_domains'),
                data = {
                    '_token'    : $('[name="_token"]').val(),
                    'domain'    : item.find('.target_domains').val(),
                    'unique_id' : unique_page_identifier,
                    'object'    : 'domain'
                },
                url = edit_ssl_settings.replace('##id##', item.attr('data-cart-item-id')),
                itemId = item.attr('data-cart-item-id');

            target_domains.element();

            if (target_domains.hasClass('error'))
                return;

            $.ajax(
                new $.ajax_prototype({
                    'type'              : 'POST',
                    'url'               : url,
                    'data'              : data,
                    'beforeSend'        : function () {
                        item.find('.help-block').remove();

                        item.find('.save_target_domains .submitText').hide();
                        item.find('.save_target_domains .loading').show();
                        activateFormDim();
                    },
                    'success'           : function (data) {
                        deactivateFormDim();

                        if (data.success) {
                            data.data.instance = this;
                            $.cart.view.reCreateCartSummary(data.data);
                        } else {
                            if (data.code == error_codes.validation_error && 'domain' in data.data) {
                                target_domains.after(helperBlock);
                                item.find('.help-block').html(data.data.domain.join('<br>'));
                            }

                            globalApplicationErrors(data);

                        }
                    },
                    'preerrorcallback'  : function () {
                        deactivateFormDim();
                    },
                    'triggered_item'    : '[data-cart-item-id="' + ((itemId) ? item.attr('data-cart-item-id') : item.closest('[data-cart-item-id]').attr('data-cart-item-id')) + '"]'
                })
            );
        }
        
        function convertSslDomainDisplayToEditable (obj) {
            var domain      = obj.find('.target_domain_display').text(),
                cartItemId  = obj.find('[data-domain-for-cart-item]').attr('data-domain-for-cart-item');

            obj.after($('#ssl_installation_required_domain').html().replace(/##id##/g, cartItemId));

            var newInput = obj.next('.get-ssl-domain');

            obj.remove();

            newInput.find('input').val(domain);

            newInput.show(0, function () {
                $('[name="target_domains_' + cartItemId + '"]').focus();
            }).focus();
        }

        function convertSslDomainDisplayToEditableForStandAlone (obj) {
            var domain      = obj.find('.target_domain_display').text(),
                cartItemId  = obj.closest('[data-cart-item-id]').attr('data-cart-item-id');

            obj.closest('.row').after($('#ssl_installation_required_domain_for_stand_alone').html().replace(/##id##/g, cartItemId));

            var newInput = $('[name="target_domains_' + cartItemId + '"]').closest('.get-ssl-domain');

            obj.closest('.row').remove();

            newInput.find('input').val(domain);

            newInput.show(0, function () {
                $('[name="target_domains_' + cartItemId + '"]').focus();
            }).focus();
        }

    /**
     * SSL SETTING END
     */

    /**
     * ORDER FORMS START
     */
    
        function handle_order_forms (form) {
            if(form.is_ready()){
                form.validate();
            }else{
                prepareOrderForm(form);
                form.validate();
            }
        }

        function prepareOrderForm (form) {
            var formConfiguration = {
                onSuccess           : function () {
                    if (checkout_sent == false) {
                        checkout_sent = true;
                        $('#submitOrder').addClass('requestTrigger');

                        var formId = form.attr('id');

                        if (!form_request_obj[formId])
                            form_request_obj[formId] = new $.ajax_prototype({
                                type: 'POST',
                                url: '/cart/checkout',
                                success: function (data) {
                                    if (data.success) {
                                        if (data.data.payment_route) {
                                            redirect = data.data.payment_route;
                                        } else {
                                            $('#orderId').text(data.data.document.id);
                                            $('#orderLink').attr('href', order.replace('##id##', data.data.document.id));

                                            $('.cart_step').hide();
                                            $('#checkout-summary').show();

                                            $('#paymentStep').addClass('active');
                                        }

                                        var cacheName = cacheNames.domainSearch;

                                        if (app_env == 'local')
                                            cacheName += '_beta';

                                        localStorage.setItem(cacheName, JSON.stringify({cache:{}, updater: unique_page_identifier, updatedFor : ''}));

                                        if (app_env != 'local') {
                                            var custom_variables = [
                                                {name: '__order_id', value: data.data.document.id},
                                                {name: '__order_price', value: data.data.document.total},
                                            ];
                                            LC_API.trigger_sales_tracker('dPpPWjmvfBMvOUxSB6tMFGKY9WgBt3fZ', custom_variables);
                                        }

                                    } else {
                                        if (data.code == error_codes.validation_error && 'pay_method' in data.data) {
                                            var form = $('#credit_payment_form:visible,#no_credit_payment_form:visible');

                                            if (form.attr('id') == 'no_credit_payment_form')
                                                cont = form.find('.payment_method_containers').closest('.row');
                                            else
                                                var $method = $('[name="pay_method"]:first'),
                                                    cont = $method.closest('ul');

                                            if (cont.length < 1) {
                                                cont = $method.closest('.payment_method_containers').closest('.columns')
                                            }

                                            cont.displayIndividualErrors(data.data.pay_method);
                                        } else {
                                            if (data.data != null && 'order_agreement' in data.data) {
                                                $('[name="order_agreement"]').closest('div').find('a').displayIndividualErrors(data.data.order_agreement);

                                                delete data.data.order_agreement;
                                            }

                                            globalApplicationErrors(data, formId);
                                        }
                                    }
                                },
                                complete: function () {
                                    checkout_sent = false;
                                    if (typeof redirect != 'undefined') {
                                        window.location.href = redirect;
                                    } else {
                                        $.enable_form_controls(formId);
                                        $('.submitText').show();
                                        $('.loading').hide();
                                    }
                                }
                            }, form.attr('id'));

                        var data = {
                                '_token': $('[name="_token"]').val()
                            },
                            payment_method = $('[name="pay_method"]:checked'),
                            credit_payment = $('#credit_payment:checked'),
                            credit_limit = $('#credit_limit:checked');

                        if (payment_method.length) {
                            payment_method = payment_method.val();
                            if (payment_method == 3)
                                data.use_cr_adj = 1;
                            else
                                data.pay_method = payment_method;
                        }

                        if (credit_payment.length)
                            data.use_cr_adj = 1;

                        if (credit_limit.length)
                            data.use_cr_limit = 1;

                        var aggremment = $('[name="order_agreement"]:checked');

                        if (aggremment.length)
                            data.order_agreement = 1;

                        if ($('#order-agrmt:checked').length) {
                            data['processing_approval'] = $('[name="cart_gdpr_processing_approval"]').val();
                            data['data_validity'] = $('[name="cart_gdpr_data_validity"]').val();
                        }

                        form_request_obj[formId]['data'] = data;

                        $.ajax(form_request_obj[formId]);
                    }
                },
                version_exception   : true
            };

            if(form.attr('id') == 'credit_payment_form')
                $.observers.observe('payment_methods', $('#payment_method_list'), payment_methods);

            formConfiguration = orderFormTriggers(form, formConfiguration);
            form.prepare_form_advanced(formConfiguration);
        }

        function orderFormTriggers (form, config) {
            if(form.attr('id') == 'credit_payment_form')
                config.trigger =  [
                    {
                        'item'  : form,
                        'event' : 'change',
                        'callback'  : function () {
                            var credit_payment = form.find('[name="use_cr_adj"]'),
                                credit_limit = form.find('[name="use_cr_limit"]'),
                                payment_total = $('#payment_total'),
                                payment_method_list = $('#payment_method_list'),
                                payment_required = true;

                            if(credit_limit.prop('checked')){
                                payment_total.text(payment_totals.credit_limit.display);
                                payment_required = payment_totals.credit_limit.payment_required;
                            }else if(credit_payment.prop('checked')){
                                payment_total.text(payment_totals.credit.display);
                                payment_required = payment_totals.credit.payment_required;
                            }else{
                                payment_total.text(payment_totals.none.display);
                                payment_required = payment_totals.none.payment_required;
                            }

                            if(payment_required)
                                payment_method_list.removeClass('disabled-options');
                            else
                                payment_method_list.addClass('disabled-options');
                        }
                    },
                    {
                        'item'  : '#credit_limit',
                        'event' : 'change',
                        'callback'  : function () {
                            if($(this.item).prop('checked'))
                                $('#credit_payment').prop('checked', true);
                        }
                    },
                    {
                        'item'  : '#credit_payment',
                        'event' : 'change',
                        'callback'  : function () {
                            if(!$(this.item).prop('checked'))
                                $('#credit_limit').prop('checked', false);

                        }
                    }
                ];

            return config;
        }
    
    /**
     * ORDER FORMS END
     */

    function addNewNameServer (obj) {
        var form = obj.closest('form'),
            ns_container = form.find('.ns_container'),
            current_ns = ((form.is(':visible')) ? form.find('.nameservers:visible') : form.find('.nameservers')),
            next_index = ++(current_ns.length),
            next_ns = ns_container.find('[data-name="nameserver_' + next_index + '"]');

        ns_container.find('.noNS').remove();
        form.find('.submit-edit').removeClass('disabled');

        if(next_ns.length){
            next_ns.show().val('');
        }else{
            ns_container.append($('#nameservers_input_temp').html().replace(/##index##/g, current_ns.length));
        }

        if(next_index > ns_container.attr('data-min'))
            ns_container.find('.delete_server').show();

        if(next_index >= ns_container.attr('data-max'))
            form.find('.add_nameserver_cont').hide();
    }

    function removeNameserver (obj) {
        var cont = obj.closest('.ns_container'),
            form = obj.closest('form'),
            input = obj.closest('div').find('input'),
            values = $.makeArray(obj.closest('.ns_container').find('input:visible').map(function (a, b) { return $(b).val()})).join(',').replace(input.val(),'').replace(/,{2,}/,',').replace(/^,|,$/,'');

        if(values){
            values = values.split(',');

            $.each(values, function (key, value) {
                var ns = form.find('.nameservers:eq(' + key + ')');

                if(ns.length < 1)
                    form.find('.addNameServers').trigger('click');

                ns = form.find('.nameservers:eq(' + key + ')');
                ns.val(value);
            });
        }

        cont.find('.row:visible:last').hide();

        controlDeleteButtons(form);
        controlAddNameServerCont(form);
    }

    function assignNSGroup (obj) {
        var form = obj.closest('form');

        if(obj.val() && obj.val() != 'nons'){

            var nameservers = nsgroups[obj.val()].nameservers;

            if(nameservers && nameservers.length)
                setGroupToNameServers(form, nameservers);
            else
                setEmptyGroup(form);
        }else {
            removeGroupSelection(form);
        }

        obj.blur();
    }

    function logDomains () {
        $('[data-group="domains"]').each(function () {
            var obj = $(this),
                ns_container = obj.find('.ns_container'),
                group_container = obj.find('.ns_group');

            if(group_container.length && group_container.val() && group_container.val() != 'nons'){
                logs[obj.attr('data-cart-item-id')] = {
                    name_servers : {
                        groupId : group_container.val()
                    }
                };
            }else if(ns_container.length){
                var ns = ns_container.find('.nameservers');
                logs[obj.attr('data-cart-item-id')] = {
                    name_servers : {}
                };

                if(ns.length) {
                    logs[obj.attr('data-cart-item-id')].name_servers.values = [];

                    ns.each(function () {
                        logs[obj.attr('data-cart-item-id')].name_servers.values.push($(this).val());
                    });
                }
            }
        });
    }

    function cartContactHandler (data) {
        var modal = $('#createContact'),
            modal_form = modal.find('form'),
            form = $('#' + modal.attr('data-form'));

        $('.contactProfileManager').each(function () {
            var obj = $(this),
                current = obj.val();

            obj.append('<option value="' + data.data.contactId + '">' + data.data.name + '</option>').chosen_update(current ? current : '');
        });
        form.find('.contactProfileManager').chosen_update(data.data.contactId);

        modal_form.find('input:visible').val('').trigger('input');
        modal.find('#person_type').chosen_update('');
        modal.find('#state_id').chosen_update('');
        modal.find('[id*="country"]').chosen_update('GR').change();

        modal.find('[class*="hide-for-"]').hide();
        modal.find('.button.disabled').removeClass('disabled');

        close_cart_modal(modal);

        $('.contactWRN').hide();
        $('.contactLabel').show();

        contacts.list.push({'id' : data.data.contactId, 'name' : data.data.name, 'enom_ready' : data.data.enom_ready, 'eurid_ready' : data.data.eurid_ready, 'forth_ready' : data.data.forth_ready});
    }

    function contactById (a) {
        if(a.id == contactId)
            return a
    }

    function getNameServerById (a) {
        if(a.id == nameServerId)
            return a
    }

    function controlUpSells (obj) {
        var data = {
            '_token'    : $('[name="_token"]').val(),
            'unique_id' : unique_page_identifier
        };

        var upSaleObj = {
            type        : 'POST',
            success     : function (data) {
                deactivateFormDim();
                var instance = this;

                data.data.instance = instance;

                unsetLoader(instance.triggered_item);

                if (data.success) {
                    $.cart.view.reCreateCartSummary(data.data);

                    if (app_env != 'local' && 'remarketing_items' in data.data) {
                        if(obj.prop('checked'))
                            $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                        else
                            $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items);
                    }
                } else {
                    $.cart.errorHandler(data);
                }
            },
            beforeSend  : function () {
                activateFormDim()
                var instance    = this,
                    obj         = $(instance.triggered_item),
                    $upsell     = $(instance.triggered_item).filter('input');

                if($upsell.length < 1)
                    $upsell = $(instance.triggered_item).find('input');

                if($upsell.hasClass('item'))
                    $upsell = $upsell.find('[type="checkbox"]');

                if($upsell.prop('checked')){
                    addLayerLoader(instance.triggered_item, true, true);
                    registerLoader(instance.triggered_item);
                }else{
                    pending_delete.push(instance.triggered_item);

                    var parentId = '[data-cart-item-id="' + $upsell.closest('[data-group="ssl"]').attr('data-cart-item-id') + '"]';

                    addLayerLoader(parentId, true, true);
                    up_sell_delete.push(parentId);

                    registerLoader(instance.triggered_item);
                }
            },
            error       : function () {
                deactivateFormDim();
                unsetLoader(this.triggered_item);
            }
        };


        if(obj.prop('checked')){
            upSaleObj.url           = up_sell_add;
            data.sku                = obj.attr('data-product-sku');
            data.parent             = obj.closest('[data-group="ssl"], .cross_sale').attr('data-cart-item-id');
        }else{
            upSaleObj.url           = up_sell_remove;
            data.cart_item_id       = obj.attr('data-cart-item-id');
        }

        var itemId = obj.attr('data-cart-item-id');
        upSaleObj.triggered_item    = '[data-cart-item-id="' + ((itemId) ? obj.attr('data-cart-item-id') : obj.closest('[data-cart-item-id]').attr('data-cart-item-id')) + '"]';

        data.unique_id = unique_page_identifier;

        upSaleObj.data = data;

        if(upSaleObj.url)
            $.ajax(upSaleObj);
    }

    function addLayerLoader (item, $show_total_loader, $show_loader, $price_loader, $object_loader) {
        var $item = $(item),
            $loader;

        $loader = '<div class="item_loader" style="/*background-color: rgba(28, 29, 30, 0.7);*/ height: 100%; margin-left: -0.75rem; position: absolute; top: 0; width: 100%;">';

        if($show_loader)
            $loader += '<div class="loading" style="left: 50%; margin-left: -1.5rem; margin-top: -1.5rem; position: absolute; top: 50%;"><span class="spinner bigger dark"></span></div>';

        $loader += '</div>';

        if(typeof $object_loader == 'undefined'){
            if($item.hasClass('item'))
                $item.css('position', 'relative').append($loader);
            else
                $item.closest('.item').css('position', 'relative').append($loader);
        }else{
            $object_loader.find('.submitText').hide();
            $object_loader.find('.loading').show();
        }

        if(typeof $price_loader != 'undefined' && $price_loader)
            $item.find('.price:first').css('position', 'relative').html('<div class="loading" style="right: 1rem; top: 0.75rem;"><span class="spinner smaller dark"></span></div>');

        if($show_total_loader){
            var prices = $('#itemsWrapper').find('.prices-box');

            prices.find('ul').hide();
            prices.find('.loading').show();
        }

    }

    function registerLoader (item) {
        var temp = $(item);

        if(!temp.hasClass('item'))
            item = '[data-cart-item-id="' + temp.closest('.item').attr('data-cart-item-id') + '"]';

        active_loaders.push(item);
    }

    function unsetLoader (item) {
        deactivateFormDim();
        if(typeof active_loaders == 'undefined' || active_loaders.length < 1)
            return ;

        var $item = $(item);

        if(!$item.hasClass('item') || $item.length < 1){

            $item = $item.closest('.item');

            if($item.length < 1){
                $item = $('[data-contains="' + item.match(/[0-9]+/) + '"]');
                $item.removeAttr('data-contains');
            }
        }

        if($item.length){
            $item.find('.item_loader').remove();
            var itemId = '[data-cart-item-id="' + $item.attr('data-cart-item-id') + '"]';
        }else{
            itemId = item;
        }
        
        active_loaders = active_loaders.join(',').replace(itemId, '').replace(/^,|,$/g,'').replace(/,{2,}/g,',');

        if(active_loaders == '')
            active_loaders = [];
        else
            active_loaders = active_loaders.split(',');

        if(up_sell_delete.length){
            item = '[data-cart-item-id="' + $(item).closest('.item').attr('data-cart-item-id') + '"]';

            up_sell_delete = up_sell_delete.join(',').replace(item, '').replace(/^,|,$/g,'').replace(/,{2,}/g,',');

            if(up_sell_delete == '')
                up_sell_delete = [];
            else
                up_sell_delete = up_sell_delete.split(',');
        }
    }

    function handleEventsOnIdle (data) {
        data = data.msg || data;

        if('unique_id' in data && data.unique_id == unique_page_identifier)
            return ;

        if('execution_time' in data && new Date(data.execution_time * 1000) < new Date($loadTime))
            return ;

        var idleModal   = $('#idleCartNotice');

        if(idleModal.is(':hidden'))
            idleModal.modal_open();

    }

    function rebuildCheckoutForm(settings){
        if(typeof settings == 'undefined')
            return ;

        if(settings.use_credit){
            if(settings.credit_adjustment_suffice){
                var $valueSelected = $('[name="pay_method"]:checked').val();

                $('.payment-options .no-credit').show();
                $('.payment-options .credit').hide();
                $('#creditsSuffice').closest('.columns').show().find('.credit_payment_usable').text(settings.credits.usable.formated);
                $('.transactions').attr('class', 'transactions medium-4 columns');

                $('[name="pay_method"][value="' + $valueSelected + '"]').prop('checked', true).closest('.payment_method_containers').addClass('active');
            }else{
                if(settings.credits.use || settings.credit_limit.use){
                    $('.payment-options .no-credit').hide();
                    $('.payment-options .credit').show();

                    if(settings.credits.use)
                        $('#credit_payment').closest('.credit-box').show().find('.credit_payment_usable').text(settings.credits.usable.formated);
                    else
                        $('#credit_payment').closest('.credit-box').hide();

                    if(settings.credit_limit.use)
                        $('#credit_limit').closest('.credit-box').show().find('.credit_limit_usable').text(settings.credit_limit.usable.formated);
                    else
                        $('#credit_limit').closest('.credit-box').hide();
                }else{
                    $('.payment-options .no-credit').show();
                    $('.payment-options .credit').hide();
                    $('#creditsSuffice').closest('.columns').hide();

                    $('.transactions:first').attr('class', 'transactions medium-5 large-4 columns medium-push-1 large-push-2');
                    $('.transactions:last').attr('class', 'transactions medium-5 large-4 columns medium-push-1 large-pull-2');
                }
            }
        }else{
            $('.payment-options .no-credit').show();
            $('.payment-options .credit').hide();
            $('#creditsSuffice').closest('.columns').hide();

            $('.transactions:first').attr('class', 'transactions medium-5 large-4 columns medium-push-1 large-push-2');
            $('.transactions:last').attr('class', 'transactions medium-5 large-4 columns medium-push-1 large-pull-2');
        }

        var form = $('#credit_payment_form,#no_credit_payment_form').filter(function () {return $(this).css('display') != 'none'});

        form.each(function () {
            var obj = $(this);

            if(!obj.is_ready())
                prepareOrderForm(obj);
        });

        payment_totals = settings.total;

        setOrderTotalBasedOnPaymentSelection();
    }

    function setOrderTotalBasedOnPaymentSelection (settings) {
        if(typeof settings != 'undefined'){
            rebuildCheckoutForm(settings);
            return ;
        }

        var $total      = $('#payment_total'),
            amount      = payment_totals.none.node,
            paymethod   = $('[name="pay_method"]:checked');

        if(paymethod.val() == 3)
            amount = payment_totals.credit.display;

        if($('#credit_payment:visible:checked').length)
            amount = payment_totals.credit.display;

        if($('#credit_limit:visible:checked').length)
            amount = payment_totals.credit_limit.display;

        $total.text(amount);

    }

    function fixPricesForMediumDown (obj) {
        var length  = obj.find('.length.active'),
            price   = length.find('.price-per-length').text(),
            text    = length.text().replace(price, ' - ' + price),
            btn     = obj.find('button'),
            strikethrough = length.find('.strikethrough');

        if (strikethrough.length) {
            text = text.replace(strikethrough.text(), strikethrough.getOuterHTML());
            
            btn.html(text);
        } else {
            btn.text(text);
        }
    }

    function fixPricesForLargeUp (obj) {
        var length  = obj.find('.length.active'),
            price   = length.find('.price-per-length').text(),
            text    = length.text().replace(price,'').trim(),
            btn     = obj.find('button');

        btn.text(text);
    }

    function setCommonNameToSslInstallation (obj) {
        var item_id = obj.closest('.up_sell').find('[data-cart-item-id]').attr('data-cart-item-id');
        $.ajax(
            new $.ajax_prototype({
                type            : 'POST',
                url             : up_sell_update,
                data            : {
                    '_token'            : $('[name="_token"]').val(),
                    'cart_item_id'      : item_id,
                    'user_attributes'   : {
                        'domain_name'   : obj.val()
                    }
                },
                success         : function (data, instance) {
                    if (data.success){
                        var $item   = $('[data-cart-item-id="' + instance.cart_item_id + '"]').closest('.product'),
                            input   = $item.find('.ssl_domain_name');

                        input.attr('data-last-val', input.val());

                        $item.find('.domain_name_display_container').show();
                        $item.find('.domain_name_form_container').hide();

                        $item.find('.domain_name_display').text(input.val());
                        $item.find('.edit_domain_name_attribute').text(APP_LANG.RESP_TABLE_ACTIONS.edit);

                    } else {
                        globalApplicationErrors(data, 'ssl_domain_name_form_' + instance.cart_item_id, {
                            'user_attributes.domain_name' : function () {
                                return $('#ssl_domain_name_form_' + instance.cart_item_id + ' .ssl_domain_name')
                            }
                        });
                    }
                },
                cart_item_id    : item_id
            }, 'ssl_domain_name_form_' + item_id)
        )
    }

    function upSellCancelForm (obj) {
        var cont = obj.closest('.domain_name_attribute_container');

        cont.find('.domain_name_display_container').show();
        cont.find('.domain_name_form_container').hide();

        cont.find('.help-block').remove();
        cont.find('.error').removeClass('error invalid');

        var input = cont.find('.ssl_domain_name');

        input.val(input.attr('data-last-val'));
    }

    function checkForErrorBeforeGoingToBilling () {
        var domainErrors = $('[data-group="domains"] .icon.alert'),
            sslErrors = $('.target_domains');

        if (domainErrors.length == 0 && sslErrors.length == 0) {
            var scroll_target = $('.steps');

            $('html,body').animate({
                'scrollTop': scroll_target.position().top
            }, 500);

            $('#product-summary').hide();
            $('#billing-summary').show();
            $('#billingStep').addClass('active');
            $('#paymentStep').removeClass('active');
        } else if (domainErrors.length ) {
            $('html,body').animate({
                'scrollTop': domainErrors.filter(':eq(0)').offset().top - 80
            }, 500);

            var alert = $('#errorDomains');

            alert.show();
            cartDomainAlert = setTimeout(function () {
                alert.hide();
            }, 11000);
        } else {
            $('html,body').animate({
                'scrollTop': sslErrors.filter(':eq(0)').offset().top - 80
            }, 500);

            var alert = $('#errorSsls');

            alert.show();
            cartDomainAlert = setTimeout(function () {
                alert.hide();
            }, 11000);
        }
    }
    
    function sendCheckoutProgress () {
        if (checkoutProgressSent === false && app_env != 'local') {
            $.getCurrentCartForAnalytics();

            checkoutProgressSent = true;
        }
    }
});