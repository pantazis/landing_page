$(document).ready(function () {
    unique_page_identifier = parseInt($.now() * Math.random());

    var cart_list           = $('#main_nav').find('ul.cart-items'),
        side_cart           = $('#sideCartCont'),
        side_cart_list      = side_cart.find('ul.cart-items'),
        cart_badge          = $('#cart_badge'),
        cart_item           = '<li data-cart-item-id="##id##">'
                                    + '<div class="product">##name## <br><span class="cart_item_desc">##desc##</span></div>'
                                    + '<div class="price"><span class="vat" data-price=""></span> &euro;</div>'
                                    + '<a href="#" class="item-remove" title="Αφαίρεση προϊόντος"></a>'
                                + '</li>',
        cart_item_list      = $('#product-summary'),
        sideCartVisGet      = true,
        sidCartVisibility   = false,
        // Andreas 16/07/2019
        //nav_end = 200,
        nav_end = 70,
        // Andreas end
        cart_containers     = $('#cartContainer, #sideCartCont'),
        $wrapper            = $('#itemsWrapper'),
        promoPrices         = '<s class="strikethrough"><span class="item_price">##previousPrice##</span> &euro;</s><div class="current-price"><span class="item_price">##newPrice##</span> &euro;</div>',
        badgeHeartBit       = null;
    
        execution_time = {
            delete : 0,
            update : 0,
            create : 0
        };

    $('#openSideCart').on('click', function (e) {
        e.preventDefault();

        var obj = $(this).closest('div');

        if(!obj.hasClass('active'))
            obj.addClass('w-shadow active');
        else
            obj.removeClass('active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (){
                obj.removeClass('w-shadow');
                obj.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            });
    });

    $(document)
        .on('click', '.item-remove', function (e) {
            e.preventDefault();

            var item = $(this).closest('li'),
                items = $('li[data-cart-item-id="' + item.attr('data-cart-item-id') + '"]');

            items.cart_hide();
            remove_item_request(item);
        })
        .on('click', '.item:not(.order) .delete', function (e) {
            e.preventDefault();

            var item = $(this).closest('[data-cart-item-id]');

            $('#cartContainer').find('[data-cart-item-id="' + item.attr('data-cart-item-id') + '"]').cart_hide();
            remove_item_request(item);
        });

    $(window)
        .on('scroll', function(){
            sideCartVisibility();
        })
        .on('resize', function(){
            checkVisibility()
        });

    $.fn.extend({
       cart_hide : function () {
           $(this).hide();
           cart_dec();
       },
       cart_show : function () {
           $(this).show();
           cart_inc();
       }
    });
    $.extend({
        cart : {
            insert          : function (itemId, itemName, itemDesc, itemPrice) {
                var itemsList   = $('ul.cart-items'),
                    item        = itemsList.find('[data-cart-item-id="' + itemId + '"]');

                if (item.length)
                    return;

                var vat = $('ul.cart-items').append(cart_item.replace('##id##', itemId).replace('##name##', itemName).replace('##desc##', itemDesc)).find('.vat:last');

                if(typeof itemPrice == 'number')
                    vat.update_vat('price', [itemPrice], 0).closest('li');
                else
                    vat.update_vat('price', itemPrice, 1).closest('li');

                cart_inc();
            },
            update          : function (itemId, properties) {
                if(typeof properties != 'object')
                    throw 'Invalid update properties.';

                var item = $('ul.cart-items').find('[data-cart-item-id="' + itemId+ '"]');

                if(typeof properties.name != 'undefined')
                    item.find('.cart_item_name').text(properties.name);

                if(typeof properties.desc != 'undefined')
                    item.find('.cart_item_desc').text(properties.desc);

                if(typeof properties.price != 'undefined')
                    item.update_vat('price', [properties.price], 0);
            },
            remove          : function (itemId, skip_dec) {
                if(cart_containers.length) {
                    cart_containers.find('li[data-cart-item-id="' + itemId + '"]').remove();

                    if (!skip_dec) {
                        cart_dec();
                    }
                }
            },
            dec             : function () {
                cart_dec();
            },
            inc             : function () {
                cart_inc();
            },
            get_items       : function () {
                return get_active_items();
            },
            view            : {
                insert                      : {
                    item : function (data) {
                        return cart_view_insert(data);
                    },
                    sale : function (itemId, data, items){
                        insert_sale(itemId, data, items);
                    }
                },
                remove                      : function (data) {
                    data = data.msg;

                    if(!('add_on' in data)) {
                        var item = cart_item_list.find('[data-cart-item-id="' + data.cart_item_id + '"]');

                        item.prev('hr').remove();

                        var wrapper = item.closest('.item').find('.wrapper');
                        wrapper.find('li:has([data-cross-product-id="' + item.attr('data-product-id') + '"])').show();

                        var sales = wrapper.find('li:has(.add_cross_sell)').filter(function () {
                            return $(this).css('display') != 'none'
                        });

                        manage_sales(sales, wrapper);

                        item.remove();
                    } else {
                        var upsell = $('[data-cart-item-id="' + data.add_on.item_id + '"]').prop('checked', false).removeAttr('data-cart-item-id').closest('.up_sell');

                        upsell.find('.add_label').show();
                        upsell.find('.service_in_cart').hide();
                        upsell.find('.up_sell_price').hide();
                    }

                    updateCheckoutPrices(data.checkout, 'delete', data.execution_time);
                },
                update                      : function (data) {
                    var updates = data.msg.updates,
                        checkout = data.msg.checkout;

                    $.each(updates, function (key, info) {
                        var item = cart_item_list.find('[data-cart-item-id="' + info.id + '"]'),
                            setup_fee = item.find('.set_up_fee'),
                            price_el = (!item.hasClass('cross_sale')) ? item.find('.item_price:not(.cross_sale .item_price)') : item.find('.item_price'),
                            duration = (!item.hasClass('cross_sale')) ? item.find('.item_duration:not(.cross_sale .item_duration)') : item.find('.item_duration');

                        duration.find('button').text(create_length_string(info.billing.length.selected));
                        duration = duration.find('ul');

                        duration.empty();

                        $.each(info.billing.all_lengths.total_per_interval, function (key, value){
                            duration.append(
                                '<li class="length">'
                                    + '<a href="#" class="item_length" data-length="' + key + '">'
                                        + create_length_string(key)
                                        + '<div class="price-per-length right"> ' + $.imperial_to_metric(value) + ' € / μήνα</div>'
                                    + '</a>'
                                + '</li>'
                            );
                        });

                        duration.find('li:has([data-length="' + info.billing.length.selected + '"])').addClass('active');

                        if(setup_fee.length){
                            price_el.text($.imperial_to_metric(info.billing.price.total));
                            setup_fee.text($.imperial_to_metric(info.billing.price.setup_fee));
                        }else{
                            price_el.text($.imperial_to_metric(info.billing.price.total));
                        }

                        if (info.options) {
                            $.each(info.options, function (key, opt) {
                                item.find('[data-opt-name="' + opt.name + '"]').find('.spec-value').text(opt.selected.name);
                            });
                        }

                        if (info.user_attributes) {
                            $.each(info.user_attributes, function (key, attr) {
                                item.find('[data-opt-name="' + key + '"]').find('.spec-value').text(attr);
                            });
                        }

                        if (info.settings) {
                           for (i in info.settings){
                               if(info.type == 'ssl')
                                   var quantity = 'quantity';

                               var setting = item.find('[name="' + info.settings[i].name + '"]');

                               setting.val(info.settings[i][quantity]);
                           }
                        }
                    });

                    updateCheckoutPrices(checkout, 'update', data.msg.execution_time);
                },
                manage_sales                : function (sales, cont) {
                    manage_sales (sales, cont);
                },
                updateCheckoutPrices        : function (checkout, action, time) {
                    updateCheckoutPrices(checkout, action, time);
                },
                process_checkout_settings   : function (checkout) {
                    process_checkout_settings(checkout);
                },
                sort_items                  : function () {
                    sort_items();
                },
                reCreateCartSummary         : function (data) {
                    reCreateCartSummary(data);
                }
            },
            sideCart        : {
                checkVisibility : function (){
                    checkVisibility();
                }
            },
            errorHandler    : function (data) {
                if ($('#product-summary').length) {
                    $.alertHandler('', data.msg, alert_box_failure);

                    if (typeof data.data == 'object' && 'items' in data.data) {
                        reCreateCartSummary(data.data);
                    } else if(data.code == error_codes.cart_not_found){
                        $('.cart_step, .steps').hide();
                        $('.cart-icon-msg').show();
                    }
                } else {
                    $('.order.pending').removeClass('pending');
                    addToCartErrorHandler(data);
                }
            }
        }
    });

    side_cart_list.html(cart_list.html());
    checkVisibility();
    sideCartVisibility();

    if($wrapper.length) {
        var $height = $wrapper.height();

        $wrapper.css('min-height', $height);
    }

    function cart_inc () {
        var text = get_active_items().length;

        if(text){
            cart_badge.css({'visibility':'visible', 'opacity':1}).text(text).addClass('heartbit');
            $('#cart_badge_sidr, #sidCartBadge, #bottomCartBadge').text(text).addClass('heartbit');
            $('#mobile-nav .badge').css({'visibility':'visible', 'opacity':1}).text(text).addClass('heartbit');

            if (badgeHeartBit == null) {
                badgeHeartBit = setTimeout(function () {
                    cart_badge.removeClass('heartbit');
                    $('#cart_badge_sidr, #sidCartBadge, #bottomCartBadge, #mobile-nav .badge').removeClass('heartbit');

                    badgeHeartBit = null;
                }, 7000);
            }


            var $sideCartCont = $('#sideCartCont');

            $('#empty_cart, #emptySideCart').hide();
            $('#go_to_cart, #sideCartGoTo, #bottomCartBadge').show();
            $('#btmNavCont').removeClass('hidden');

            $sideCartCont.removeClass('empty');

            sideCartVisibility(function () {
                if(sidCartVisibility) {
                    if (typeof $openCartTimer != 'undefined')
                        clearTimeout($openCartTimer);

                    $openCartTimer = setTimeout(function () {
                        if ($sideCartCont.length) {
                            if (typeof $clearCartCont != 'undefined')
                                clearTimeout($clearCartCont);

                            $sideCartCont.addClass('w-shadow active');

                            var $itemsCont = $sideCartCont.find('.wrapper .cart-items');

                            $itemsCont.animate({scrollTop: $itemsCont.find('li:last').offset().top});

                            $clearCartCont = setTimeout(function () {
                                $sideCartCont.removeClass('active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                                    $sideCartCont.removeClass('w-shadow');
                                    $sideCartCont.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                                });
                            }, 5000);
                        }
                    }, 100);
                }
            });

            $('#cart_badge_sidr').show();
        }else{
            cart_dec();
        }
    }

    function cart_dec () {
        var text = get_active_items().length;

        cart_badge.text(text);
        $('#cart_badge_sidr, #sidCartBadge, #bottomCartBadge, #mobile-nav .badge').text(text);

        if(text == 0){
            cart_badge.css({'visibility':'hidden', 'opacity':0});
            $('#mobile-nav .badge').css({'visibility':'hidden', 'opacity':0});
            $('#empty_cart, #emptySideCart').show();
            $('#go_to_cart, #sideCartGoTo, #bottomCartBadge').hide();
            $('#sideCartCont').addClass('empty');
            $('#cart_badge_sidr').hide();

            sidCartVisibility = false;
            sideCartVisibility();
        }
    }

    function remove_item_request (item) {
        var item_id                 = item.attr('data-cart-item-id'),
            domain_button           = $('.tldResults[data-cart-item-id="' + item_id + '"]').find('.cart-button'),
            single_domain_button    = $('.singleResult[data-cart-item-id="' + item_id + '"]').find('.singleButtonTarget'),
            resp_button             = $('.responsiveTableRow .button[data-cart-item-id="' + item_id + '"]'),
            idProtect               = $('#addIdProtect[data-cart-item-id="' + item_id + '"]'),
            domain_renew            = $('#domainRenew[data-cart-item-id="' + item_id + '"]'),
            ssl_renew               = $('#sslRenew[data-cart-item-id="' + item_id + '"]'),
            resp_button_id_protect  = $('.id_icon_action[data-cart-item-id="' + item_id + '"]');

        $('body').trigger('remove_item_request', [item_id]);

        if (domain_button.length)
            domain_button.removeClass('selected');

        if (single_domain_button.length)
            single_domain_button.removeClass('selected');

        if(resp_button.length){
            resp_button.removeClass('in-cart');

            var submitText = resp_button.find('.submitText');
            
            if(submitText.length)
                submitText.text(COMMON_LANG.RESP_TABLE.RENEW);
            else
                resp_button.text(COMMON_LANG.RESP_TABLE.RENEW);
        }

        if(idProtect.length){
            idProtect.removeClass('in-cart');

            var submitText = idProtect.find('.submitText');

            if(submitText.length)
                submitText.text(((idProtect.hasClass('renew')) ? COMMON_LANG.DOMAINS.WHOIS.EXTEND : COMMON_LANG.CART.BUY_SERVICE));
            else
                idProtect.text(((idProtect.hasClass('renew')) ? COMMON_LANG.DOMAINS.WHOIS.EXTEND : COMMON_LANG.CART.BUY_SERVICE));
        }

        if(domain_renew.length)
            domain_renew.removeClass('hide-important');

        if(ssl_renew.length)
            ssl_renew.removeClass('hide-important');

        if(resp_button_id_protect.length){
            resp_button_id_protect.removeClass('in-cart').text(COMMON_LANG.CART.BUY_SERVICE)
        }

        if($('.cart_step').length){
            $.ajax($.ajax_get_flavor({
                data            : {
                    '_token' : $('[name="_token"]').val(),
                    unique_id : unique_page_identifier
                },
                success         : function (data) {
                    data.data.instance = this;

                    if (data.success) {
                        reCreateCartSummary(data.data);

                        if (app_env != 'local' && 'remarketing_items' in data.data)
                            $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items);
                    }else{
                        $.cart_loaders.remove_pending_delete(this.triggered_item);

                        $.alertHandler('', data.msg, alert_box_failure);

                        if(typeof data.data == 'object' && 'items' in data.data) {
                            reCreateCartSummary(data.data);
                        }else if(data.code == error_codes.cart_not_found) {
                            $('.cart_step, .steps').hide();
                            $('.cart-icon-msg').show();
                        }
                    }
                },
                complete        : function () {},
                url             : delete_item_url.replace('##id##', item.attr('data-cart-item-id')),
                type            : 'POST',
                triggered_item  : '[data-cart-item-id="' + item.attr('data-cart-item-id') + '"]'
            }, 'cart_delete'));
        }else{
            $.ajax({
                timeout     : 30000,
                data        : {
                    '_token' : $('[name="_token"]').val(),
                    unique_id : unique_page_identifier
                },
                error       : function (e) {
                    globalErrorsHandler(e);

                    if($('#product-summary').length < 1){
                        item.cart_show();

                        $('body').trigger('remove_item_failed', [item_id]);

                        if (domain_button.length)
                            domain_button.addClass('selected');

                        if (single_domain_button.length)
                            single_domain_button.addClass('selected');

                        if(resp_button.length){
                            resp_button.addClass('in-cart');

                            var submitText = resp_button.find('.submitText');

                            if(submitText.length)
                                submitText.text(COMMON_LANG.CART.IN_CART);
                            else
                                resp_button.text(COMMON_LANG.CART.IN_CART);
                        }


                        if(idProtect.length){
                            idProtect.removeClass('in-cart');

                            var submitText = idProtect.find('.submitText');

                            if(submitText.length)
                                submitText.text(COMMON_LANG.CART.IN_CART);
                            else
                                idProtect.text(COMMON_LANG.CART.IN_CART);
                        }

                        if(domain_renew.length)
                            domain_renew.addClass('hide-important');

                        if(ssl_renew.length)
                            ssl_renew.addClass('hide-important');

                        if(resp_button_id_protect.length)
                            resp_button_id_protect.addClass('in-cart').text(COMMON_LANG.CART.IN_CART);
                    }
                },
                success     : function (data) {
                    if (data.success) {
                        if ($('.cart_step').length){
                            reCreateCartSummary(data.data);

                            if (app_env != 'local' && 'remarketing_items' in data.data)
                                $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items);
                        } else {
                            $('body').trigger('remove_item_success', [item_id]);

                            if (item.hasClass('cross_sale')) {
                                var product = item.closest('.item').find('li:has(.add_cross_sell[data-cross-product-id="' + item.attr('data-product-id') + '"])'),
                                    cont = product.closest('.wrapper');

                                product.show();

                                var sales = cont.find('li:has(.add_cross_sell)').filter(function () {
                                    return $(this).css('display') != 'none'
                                });

                                manage_sales(sales, cont);
                                item.prev('hr').remove();
                            }

                            if (item.is('li'))
                                $('li[data-cart-item-id="' + item.attr('data-cart-item-id') + '"]').remove();
                            else
                                item.remove();

                            var product_summary = $('#product-summary');
                            if (product_summary.length && product_summary.find('.item').length < 1) {
                                $('.cart-icon-msg').show();
                                $('.steps, #product-summary').hide();
                            }

                            cart_dec();

                            if (typeof data.data == 'object' && 'checkout' in data.data) {
                                var prices = data.data.checkout.totals;

                                $('.checkout_order_price').attr('data-target',prices.sub_total).text($.imperial_to_metric(prices.sub_total));
                                $('.checkout_order_vat').text($.imperial_to_metric(prices.vat));

                                updateOrderTotalVat (prices.sub_total, prices.grand_total);

                                execution_time.delete = data.data.execution_time;
                                service_time.delete = data.data.service_time;
                            }

                            if ('deleted_items' in data.data) {
                                $.each(data.data.deleted_items, function (key, item_id) {
                                    var item = $('li[data-cart-item-id="' + item_id + '"]');

                                    if (item.length) {
                                        item.remove();
                                        cart_dec();
                                    }
                                });
                            }

                            var transferCart = $('#toCartGroup');

                            if (transferCart.length)
                                transferCart.find('[data-cart-item-id="' + data.msg.cart_item_id + '"]').remove();

                            process_checkout_settings(data.data.checkout);

                            try {
                                if (typeof dependencies != 'undefined' && ! $.isEmptyObject(dependencies.domains_in_cart)) {
                                    var domains = Object.keys(dependencies.domains_in_cart);

                                    $.each(domains, function (key, value) {
                                        if(dependencies.domains_in_cart[value].cart_item_id == item_id)
                                            delete dependencies.domains_in_cart[value]
                                    });
                                }
                            } catch (er) {}

                            if (app_env != 'local' && 'remarketing_items' in data.data)
                                $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items);
                        }
                    }else{
                        if ($('#product-summary').length) {
                            $.alertHandler('', data.msg, alert_box_failure);

                            if(typeof data.data == 'object' && 'items' in data.data) {
                                reCreateCartSummary(data.data);
                            }else if(data.code == error_codes.cart_not_found) {
                                $('.cart_step, .steps').hide();
                                $('.cart-icon-msg').show();
                            }
                        } else {
                            item.cart_show();

                            $('body').trigger('remove_item_failed', [item_id]);


                            if (domain_button)
                                domain_button.addClass('selected');

                            if(resp_button.length){
                                resp_button.addClass('in-cart');

                                var submitText = resp_button.find('.submitText');

                                if(submitText.length)
                                    submitText.text(COMMON_LANG.CART.IN_CART);
                                else
                                    resp_button.text(COMMON_LANG.CART.IN_CART);
                            }


                            if(idProtect.length){
                                idProtect.removeClass('in-cart');

                                var submitText = idProtect.find('.submitText');

                                if(submitText.length)
                                    submitText.text(COMMON_LANG.CART.IN_CART);
                                else
                                    idProtect.text(COMMON_LANG.CART.IN_CART);
                            }

                            if(domain_renew.length)
                                domain_renew.addClass('hide-important');

                            if(ssl_renew.length)
                                ssl_renew.addClass('hide-important');

                            if(resp_button_id_protect.length)
                                resp_button_id_protect.addClass('in-cart').text(COMMON_LANG.CART.IN_CART);

                            globalApplicationErrors(data, '');
                        }
                    }
                },
                url         : delete_item_url.replace('##id##', item.attr('data-cart-item-id')),
                type        : 'POST'
            });
        }

        $('body').trigger('cart-item:removed', {'item':item_id});
    }

    function get_active_items () {
        return cart_list.find('li').filter(function () {
            return $(this).css('display') != 'none'
        })
    }

    /**
     * Insert a new item in cart view list.
     *
     * @param data
     */
    function cart_view_insert   (data) {
        var checkout = data.msg.checkout;

        if('cart_item' in data.msg) {

            var cart_item = data.msg.cart_item;

            if (data.msg.parent) {

                insert_sale(data.msg.parent, data.msg.cart_item);
                updateCheckoutPrices(checkout, 'create', data.msg.execution_time);
                return;
            }

            var $item_name = (('name_full' in cart_item) ? cart_item.name_full : cart_item.name);

            cart_item_list.find('.footer').before($('#general_item_temp').html()
                .replace(/##itemid##/g, cart_item.id)
                .replace('##itemname##', $item_name)
                .replace('##action##', cart_item.sub_name)
                .replace('##itemprice##', $.imperial_to_metric(cart_item.billing.price.total)));

            var new_item    = cart_item_list.find('.item:last'),
                cross_cont  = new_item.find('.cross_cont'),
                row         = cross_cont.closest('.row'),
                duration    = new_item.find('.item_duration');

            if ('promo' in cart_item.billing.price && typeof cart_item.billing.price.promo == 'number' && cart_item.billing.price.promo != cart_item.billing.price.base) {

                new_item.find('.price').addClass('discount').html(promoPrices.replace('##previousPrice##', $.imperial_to_metric(cart_item.billing.price.base)).replace('##newPrice##', $.imperial_to_metric(cart_item.billing.price.promo)))
            }

            if ('registry_name' in cart_item) {

                new_item.attr('data-registry', cart_item.registry_name);
            }

            cart_view_inform_new_item(new_item, cart_item);

            cart_view_inform_new_lengths(duration, cart_item);

            cart_append_cross_sells(new_item, cart_item);

            cart_append_ssl_settings(new_item, cart_item);


            if (cart_item.sku.indexOf('ssl_install') > -1) {

                new_item.find('.ssl-configure').remove();

                if ('domain' in cart_item.user_attributes) {

                    new_item.append($('#ssl_installation_required_domain_set_for_stand_alone').html().replace(/##domain##/g, cart_item.user_attributes.domain));

                    if ('common_name_fixed' in cart_item)
                        new_item.find('.edit_stand_alone_installation').remove();
                } else
                    new_item.append($('#ssl_installation_required_domain_for_stand_alone').html().replace(/##id##/g, cart_item.id));

                if ('san_domains' in cart_item && cart_item.san_domains > 0)
                    new_item.find('.stand-alone-ssl-installation').closest('.row').remove();
            }

            if (Object.keys(cart_warnings).length) {

                if ('hosting_warning' in cart_warnings && data.msg.cart_item.type.indexOf('hosting') > -1) {
                    new_item.find('.description').append('<div class="cart-item-msg"><span>' + $.translate('cart.warnings.hosting') + '</span></div>');
                }
            }

            if ('up_sells' in cart_item) {

                var new_panel       = new_item.append('<div class="actions-panel"></div>').find('.actions-panel:last'),
                    up_sell_temp    = $('#general_item_temp').html();

                $.each(cart_item.up_sells, function (key, value) {
                    var $upsell_data = upsells[key],
                        explanations = '',
                        requiredInfo = '';

                    if (data.msg.cart_item.type == 'ssl') {
                        explanations = $('#ssl_' + data.msg.cart_item.validation_type.toLowerCase() + '_installation_explanations').html().replace(/##itemId##/g, data.msg.cart_item.id);
                    }

                    if (cart_item['type'] == 'ssl' && cart_item['children_up_sell'].length) {
                        var totalDomains = 1,
                            additionalDomains = null;

                        additionalDomains = $.grep(cart_item['settings'], function (obj) {
                            return obj.name == 'additional_domains';
                        });

                        if (!!additionalDomains && additionalDomains.length) {
                            totalDomains = additionalDomains[0].vendor_settings.maximum;
                        }

                        if(totalDomains == 1)
                            requiredInfo = $('#ssl_installation_required_domain').html().replace(/##id##/g, cart_item['children_up_sell'][0]);
                    }

                    new_panel.append('<hr class="big-inner-margin">');
                    new_panel.append($('#up_sell_temp').html()
                        .replace(/##productid##/g, $upsell_data.product_id)
                        .replace(/##parentid##/g, new_item.attr('data-cart-item-id'))
                        .replace(/##productSku##/g, $upsell_data.product_sku)
                        .replace(/##itemnameadd##/g, $upsell_data.name_add)
                        .replace(/##itemname##/g, $upsell_data.name)
                        .replace(/##explanations##/g, explanations)
                        .replace(/##requiredInfo##/g, requiredInfo)
                        .replace(/##itemtitle##/g, $upsell_data.title)
                        .replace(/##action##/g, $upsell_data.desc)
                        .replace(/##itemprice##/g, $.imperial_to_metric($upsell_data.price_out.setup_fee))
                    );

                    if('promo' in $upsell_data.price_out && typeof $upsell_data.price_out.promo == 'number' && $upsell_data.price_out.promo != $upsell_data.price_out.setup_fee){
                        new_panel.find('.price').addClass('discount').html(promoPrices.replace('##previousPrice##', $.imperial_to_metric($upsell_data.price_out.setup_fee)).replace('##newPrice##', $.imperial_to_metric($upsell_data.price_out.promo)))
                    }
                });
            }


            return new_item;
        }

        if('add_on' in data.msg){

            var upsell = $('.item[data-cart-item-id="' + data.msg.add_on.parent + '"]').find('[data-product-id="' + data.msg.add_on.product + '"]').attr('data-cart-item-id', data.msg.add_on.id).prop('checked', true).closest('.up_sell');

            upsell.find('.add_label').hide();
            upsell.find('.service_in_cart').show();
            upsell.find('.up_sell_price').show();
        }


        // updateCheckoutPrices(checkout, 'create', data.msg.execution_time);
        // sort_items();
    }

    function cart_view_inform_new_item (new_item, cart_item) {
        if ('promo' in cart_item.billing.price && cart_item.billing.price.promo != null && cart_item.billing.price.promo != 0) {
            new_item.find('.product .description strong').addClass('discount');
        }

        if(cart_item.type == 'domain'){
            new_item.attr('data-group', 'domains');

            fixDomainObjects(new_item,cart_item);
        }else if((cart_item.type).indexOf('hosting') > -1){
            new_item.attr('data-group', 'hosting');
        }else if((cart_item.sku).indexOf('ssl_install') > -1){
            new_item.attr('data-group', 'ssl_installation');
        }else{
            new_item.attr('data-group', 'ssl');
        }

        if(cart_item.type.indexOf('vps') < 0 && cart_item.type.indexOf('dedi') < 0){
            new_item.find('.configure').remove();

            if(cart_item.type == 'domain' && cart_item.rgp === true) {
                new_item.find('.set-up-price').html($.translate('cart.rgp_setup_fee') + ':<span class="set_up_fee">' + $.imperial_to_metric(cart_item.billing.price.setup_fee) + '</span> <span>€</span>');
            } else {
                new_item.find('.set-up-price').remove();
            }
        }else{
            new_item.find(' > div:eq(0)').after($('#item_options_temp').html());
            new_item.find('.configure').attr('href', cart_edit.replace('##id##', cart_item.id));
            new_item.find('.delete').attr('href', cart_delete.replace('##id##', cart_item.id));

            if(cart_item.type.indexOf('vps') > -1){
                var conf_to_use = configs.vps;
                if(cart_item.type.indexOf('linux') > -1){
                    conf_to_use = conf_to_use.linux;
                }else{
                    conf_to_use = conf_to_use.windows;
                }
                new_item.find('.set-up-price').remove();
            }else{
                var setupFeeCont = new_item.find('.set_up_fee');

                if (cart_item.type.indexOf('semi') < 0) {

                    if (typeof cart_item.billing.price.setup_fee != 'undefined'){
                        if (setupFeeCont.length < 1) {
                            new_item.find('.current-price').after('<span class="set-up-price">' + $.translate('misc.setup_fee') + ':<span class="set_up_fee">0</span> <span>€</span></span>');

                            setupFeeCont = new_item.find('.set_up_fee');
                        }

                        setupFeeCont.text($.imperial_to_metric(cart_item.billing.price.setup_fee));
                    } else {
                        new_item.find('.set-up-price').remove();
                    }

                    conf_to_use = configs.dedicated;

                    if (cart_item.type.indexOf('greece') > -1) {
                        conf_to_use = conf_to_use.greece;
                    } else {
                        conf_to_use = conf_to_use.germany;
                    }
                } else {
                    conf_to_use = configs.semi.france;

                    if (typeof cart_item.billing.price.setup_fee != 'undefined'){
                        if (setupFeeCont.length < 1) {
                            new_item.find('.current-price').after('<span class="set-up-price">' + $.translate('misc.setup_fee') + ':<span class="set_up_fee">0</span> <span>€</span></span>');

                            setupFeeCont = new_item.find('.set_up_fee');
                        }

                        setupFeeCont.text($.imperial_to_metric(cart_item.billing.price.setup_fee));
                    } else {
                        new_item.find('.set-up-price').remove();
                    }

                }
            }

            cart_view_insert_build_options_user_attributes(new_item, cart_item, conf_to_use);
        }
    }

    function cart_view_insert_build_options_user_attributes (new_item, cart_item, conf_to_use) {
        var newConf = Object.assign({},conf_to_use).array_except('management'),
            categories_count = Object.keys(newConf).length - 1,
            cont = new_item.find('.specs-panel').find('.in-list'),
            opt_cont = cont.html(),
            list_eq = 0;


        if (cart_item.type != 'hosting-dedi') {
            for(var i = 1; i <= categories_count; i++){
                cont.append(opt_cont);
            }

            $.each(newConf, function (key, assets) {
                var list = cont.find('.columns:eq(' + list_eq + ')');

                list.find('.lead').text(COMMON_LANG.CART[key.toUpperCase()]);
                list = list.find('ul');

                $.each(assets, function (assetIndex, asset) {
                    var text = '-';

                    if (asset in cart_item.user_attributes) {
                        text = cart_item.user_attributes[asset];
                    } else {
                        var option = $.grep(cart_item.options, function (i) {
                            return i.name == asset;
                        });

                        if (option.length) {
                            if ('name' in option[0].selected) {
                                type = 'option';

                                text = option[0].selected.name;
                            }
                        } else {
                            var attr = $.grep(cart_item.attributes, function (i) {
                                return i.name == asset;
                            });

                            if (attr.length) {
                                type = 'attribute';

                                if ('locale' in attr[0].selected && !!attr[0].selected.locale)
                                    text = attr[0].selected.locale;
                                else
                                    text = attr[0].selected.name;

                                if (cart_item.type.indexOf('semi') > -1 && asset == 'entry_processes')
                                    text = attr[0].selected.extra_settings.amount;
                            }
                        }
                    }

                    list.append('<li data-opt-name="' + asset + '"><span class="spec">' + COMMON_LANG.CART[asset.toUpperCase()] + ':</span> <span class="spec-value">' + text + '</span></li>');

                });

                list_eq++;
            });

            cont.find('.columns:eq(' + (list_eq - 1) + ')').addClass('end');

            $.each(cart_item.options, function (key, value) {
                if (cart_item.sku.indexOf('semi') > -1 && value.name == 'ram')
                    value.name = 'ram_semidedi';

                var opt = new_item.find('[data-opt-name="' + value.name + '"]');

                opt.find('.spec-value').text(value.selected.name);
            });

            if ('hostname' in cart_item.user_attributes && !!cart_item.user_attributes.hostname)
                new_item.find('.serverHostName').text(cart_item.user_attributes.hostname);
        } else {
            cont.empty();

            var contHtml = opt_cont;

            var features = Object.assign({},dedi_format.features).array_except('management');

            for (var i in features) {
                if (features.hasOwnProperty(i)) {
                    cont.append(contHtml.replace('##opt_category##', COMMON_LANG.CART[i.toUpperCase()]));

                    var list = cont.find('ul:last');

                    list.closest('.columns').toggleClass('large-6 large-4');
                    for (var j in features[i]) {
                        if (features[i].hasOwnProperty(j)) {

                            var type = '',
                                name = '',
                                optionName = features[i][j],
                                option = $.grep(cart_item.options, function (i) {
                                    return i.name == optionName;
                                });

                            if (option.length) {
                                if ('name' in option[0].selected) {
                                    type = 'option';

                                    name = option[0].selected.name;
                                }
                            } else {
                                var attr = $.grep(cart_item.attributes, function (i) {
                                    return i.name == optionName;
                                });

                                if (attr.length) {
                                    type = 'attribute';

                                    name = attr[0].selected.name;
                                }
                            }

                            if (optionName == 'bandwidth' || optionName == 'traffic')
                                optionName += '_dedi';

                            if (name) {
                                list.append('<li data-opt-name="' + optionName + '"><span class="spec">' + COMMON_LANG.CART[optionName.toUpperCase()] + ':</span> <span class="spec-value">' + name + '</span></li>');

                                if (type == 'option' && 'extensions' in option[0].selected) {
                                    for (var k in option[0].selected.extensions) {
                                        if (option[0].selected.extensions.hasOwnProperty(k)) {
                                            list.append('<li><span class="spec">Επέκταση ' + name + ':</span> <span class="spec-value">' + option[0].selected.extensions[k].name + '</span></li>');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if ('hostname' in cart_item.user_attributes && !!cart_item.user_attributes.hostname)
                cont.closest('.specs-panel').find('.serverHostName').text(cart_item.user_attributes.hostname);
        }
    }

    function cart_view_inform_new_lengths (duration, cart_item) {
        if(cart_item.billing.all_lengths && Object.keys(cart_item.billing.all_lengths).length){
            duration.find('button').text(create_length_string(cart_item.billing.length.selected));
            duration = duration.find('ul');

            duration.empty();

            if ('base_per_interval' in cart_item.billing.all_lengths) {
                duration.addClass('discount');
            }

            var $minLength          = cart_item.billing.length.valid[0],
                $lengthInterval     = (($minLength < 12) ? (($minLength > 1) ? $minLength : '') + ' ' +  $.translate('LENGTH.MONTH', $minLength) : ((($minLength / 12) > 1) ? ($minLength / 12) : '') + ' ' +  $.translate('LENGTH.YEAR', ($minLength / 12)));

            if (['sha_win_pro','sha_lin_pro'].indexOf(cart_item['sku']) > -1) {
                cart_item.billing.all_lengths.total_per_interval = {1 : cart_item.billing.all_lengths.total_per_interval[1]};
            }

            var billingLengths = cart_item.billing.all_lengths;

            if(cart_item.type == 'domain' && cart_item.rgp === true) {
                var firstLength = Object.keys(billingLengths.total_per_interval)[0],
                    firstLengthValue = billingLengths.total_per_interval[firstLength];

                billingLengths.total_per_interval = {};
                billingLengths.total_per_interval[firstLength] = firstLengthValue;
            }

            $.each(billingLengths.total_per_interval, function (key,value) {

                var currentPrice = value.toFixed(2) + ' € / ' + $lengthInterval;

                if (typeof cart_item.billing.all_lengths.base_per_interval != 'undefined' && cart_item.billing.all_lengths.base_per_interval[key] != value && cart_item.billing.all_lengths.base_per_interval[key] > value) {
                    currentPrice = '<s class="strikethrough"><span>' + cart_item.billing.all_lengths.base_per_interval[key] + ' €</span></s>' + currentPrice
                }

                duration.append(
                    '<li class="length">'
                        + '<a href="#" class="item_length" data-length="' + key + '">'
                            + create_length_string(key)
                            + '<div class="price-per-length right">' + currentPrice + '</div>'
                        + '</a>'
                    + '</li>'
                );
            });

            duration.find('[data-length="' + cart_item.billing.length.selected + '"]').closest('.length').addClass('active');
        }else{
            duration.remove();
        }
    }


    function cart_inform_checkout_prices (checkout) {
        $('.checkout_order_price').attr('data-target',checkout.totals.sub_total).text($.imperial_to_metric(checkout.totals.sub_total));
        $('.checkout_order_vat').text($.imperial_to_metric(checkout.totals.vat));
        updateOrderTotalVat (checkout.totals.sub_total, checkout.totals.grand_total);
    }

    function cart_append_cross_sells (new_item, cart_item) {
        if(cart_item['type'] == 'domain'){

            item_classes_clear ('other_only_', 'domain_only_', new_item);
            new_item.find('.other_remove').removeClass('other_remove');
        }else{

            item_classes_clear ('domain_only_', 'other_only_', new_item);
            new_item.find(".other_remove").remove();
        }

        if(Object.keys(cart_item.cross_sells).length){

            var sales_cont = new_item.find('.sales_remaining ul');

            $.each(cart_item.cross_sells, function (key, value){
                var sale = $('#cross_sell_' + key + '_temp');

                if(sale.html().indexOf('id_protect') > -1 && 'expired' in cart_item)
                    return true;

                if(sale.length)
                    sales_cont.append(sale.html().replace(/##id##/g, cart_item.id));
            });

            $(document).foundation('dropdown', 'reflow');

            new_item.find('.sales_remaining li:visible:not(:eq(0))').addClass('v-line');
        }else{

            new_item.find('.addons-panel').remove();
        }
    }

    function cart_append_ssl_settings (new_item, cart_item) {
        if(cart_item.settings) {
            var settings_length = cart_item.settings.length;

            new_item.find(' > .row:first').after($('#ssl_settings_temp').html());

            var settings = new_item.find('.settings'),
            setting_temp = settings.html();

            settings.empty();

            for(i = 0; i <= settings_length - 1; i++){
                var current_settings = cart_item.settings[i];
                settings.append(setting_temp.replace('##locale##', current_settings.locale).replace('##name##', current_settings.name));
                var selected_setting = settings.find('.columns:last'),
                    duration = selected_setting.find('select');

                if(current_settings.min_quantity_required && current_settings.vendor_settings.minimum){
                    if(current_settings.min_quantity_required > current_settings.vendor_settings.minimum)
                        var $j = current_settings.min_quantity_required;
                    else
                        $j = current_settings.vendor_settings.minimum
                }else if(current_settings.vendor_settings.minimum){
                    $j = current_settings.vendor_settings.minimum
                }else if(current_settings.min_quantity_required){
                    $j = current_settings.min_quantity_required;
                }else{
                    $j = 0;
                }

                for (j = $j; j <= current_settings.vendor_settings.maximum; j += (('domains_per_pack' in current_settings.vendor_settings) ? current_settings.vendor_settings.domains_per_pack : 1)){
                    duration.append('<option value="' + j + '">' + j + '</option>');
                }

                duration.val(cart_item.settings[i].quantity)
            }

            settings.find('.columns:last').addClass('end');
        }
    }

    function sort_items () {
        $.each(group_order, function (key, value) {
            $('.footer').before($('[data-group="' + value + '"]'));
        });
    }

    function manage_sales (sales, cont){
        var item = cont.closest('.item');

        if(sales.length){
            cont.closest('.addons-panel').show();
        }else{
            cont.closest('.addons-panel').hide();
        }

        item.find('.sales_remaining li').removeClass('v-line');
        item.find('.sales_remaining li:visible:not(:eq(0))').addClass('v-line');
    }

    function insert_sale (itemId, data, cart_items) {
        var item            = $('[data-cart-item-id="' + itemId + '"]'),
            panel           = item.find('.crossSellPanel'),
            parentDomain    = $.grep(cart_items, function (obj) {
                return obj.id == itemId && obj.type == 'domain';
            });

        panel.append('<hr class="big-inner-margin">'
            + $('#general_item_temp').html()
                .replace(/##itemid##/g,data.id)
                .replace('##itemname##',(('name_full' in data) ? data.name_full : data.name))
                .replace('##action##',data.sub_name)
                .replace('##selected_length##', create_length_string(data.billing.length.selected))
                .replace('##itemprice##', $.imperial_to_metric((data.total_price) ? data.total_price : data.billing.price.total)));

        var sale = panel.find('.item:last').attr('class', 'cross_sale');

        if('promo' in data.billing.price && typeof data.billing.price.promo == 'number' && data.billing.price.promo != data.billing.price.base){
            panel.find('.price').addClass('discount').html(promoPrices.replace('##previousPrice##', $.imperial_to_metric(data.billing.price.base)).replace('##newPrice##', $.imperial_to_metric(data.billing.price.promo)))
        }

        var duration_cont = sale.find('.duration').closest('.columns'),
            duration_html = duration_cont.html();

        duration_cont.empty();
        duration_cont.append('<div class="cross-sell-duration">' + duration_html + '</div>');

        sale.find('> div:eq(1)').remove();

        sale.attr('data-product-id', data.catalog_product_id);
        sale.find('.description').addClass('big-inner-margin');
        sale.find('.configure').remove();
        sale.find('.actions-panel').remove();
        sale.find('.set-up-price').remove();
        sale.find('.addons-panel').remove();

        var duration        = sale.find('.item_duration ul'),
            first_length    = duration.find('li'),
            length_temp     = first_length[0].outerHTML,
            $first_length   = data.billing.length.valid[0],
            $length_trans   = (($first_length < 12) ? ((($first_length > 1)? ($first_length + ' ') : '') + trans('length.month', $first_length)) : (((($first_length / 12) + ' ') ? (($first_length / 12) + ' ') : '') + trans('length.year', ($first_length / 12))));

        first_length.remove();

        $.each(data.billing.length.valid, function (key, value) {
            duration.append(length_temp
                .replace('##length##', value)
                .replace('##total_price##', data.billing.all_lengths.total[value])
                .replace('##length_text##', create_length_string(value))
                .replace('##price_per_length##', $.imperial_to_metric(data.billing.all_lengths.total_per_interval[value]) + ' € / ' + $length_trans)
            );
        });

        duration.find('li:has([data-length="' + data.billing.length.selected + '"])').addClass('active');

        wrapper = sale.closest('.item').find('.wrapper');

        wrapper.find('li:has([data-cross-product-id="' + data.catalog_product_id + '"])').hide();

        sales = wrapper.find('li:has(.add_cross_sell)').filter(function () {
            return $(this).css('display') != 'none'
        });

        manage_sales(sales, wrapper);

        if(data.up_sells.constructor == Object){
            var $new_action_panel = sale.append('<div class="actions-panel medium-inner-margin"></div>').find('.actions-panel:last');

            $.each(data.up_sells, function (key) {
                var $upsell_data = upsells[key],
                    explanations = '',
                    requiredInfo = '';

                if (data.type == 'ssl') {
                    explanations = $('#ssl_' + data.validation_type.toLowerCase() + '_installation_explanations').html().replace(/##itemId##/g, data.id);
                }

                if (data.type == 'ssl' && data.children_up_sell.length/* && parentDomain.length < 1*/) {
                    var totalDomains = 1,
                        additionalDomains = null;

                    additionalDomains = $.grep(data['settings'], function (obj) {
                        return obj.name == 'additional_domains';
                    });

                    if (!!additionalDomains && additionalDomains.length) {
                        totalDomains = additionalDomains[0].vendor_settings.maximum;
                    }

                    if(totalDomains == 1)
                        requiredInfo = $('#ssl_installation_required_domain').html().replace(/##id##/g, data.children_up_sell[0]);
                }

                $new_action_panel.append($('#up_sell_temp').html()
                    .replace(/##productid##/g, $upsell_data.product_id)
                    .replace(/##parentid##/g, sale.attr('data-cart-item-id'))
                    .replace(/##productSku##/g, $upsell_data.product_sku)
                    .replace(/##itemnameadd##/g, $upsell_data.name_add)
                    .replace(/##itemname##/g, $upsell_data.name)
                    .replace(/##itemtitle##/g, $upsell_data.title)
                    .replace(/##explanations##/g, explanations)
                    .replace(/##requiredInfo##/g, requiredInfo)
                    .replace(/##action##/g, $upsell_data.desc)
                    .replace(/##itemprice##/g, $.imperial_to_metric($upsell_data.price_out.setup_fee))
                );
            });

            $.each(data.children_up_sell, function (index, child){
                var childLookup = child;

                child = cart_items[cart_items.findIndex(function ($item){return $item.id == childLookup})];

                var $up_sell = $new_action_panel.find('[data-product-id="' + child.catalog_product_id + '"]').prop('checked', true).attr('data-cart-item-id', child.id).closest('.up_sell');

                $up_sell.find('.add_label').hide();
                $up_sell.find('.service_in_cart').show();

                $up_sell.find('.up_sell_price').show();
            });
        }
    }

    function item_classes_clear (classes_remove, classes_keep, new_item) {
        new_item.find('[class*="' + classes_remove + '"]').each(function () {
            var obj = $(this),
                classes = obj.attr('class'),
                valid_classes = '';

            classes = classes.split(' ');

            $.each(classes, function (key, value) {
                if(value && value.indexOf(classes_remove) < 0)
                    valid_classes += value + ' ';
            });

            obj.attr('class',valid_classes.trim());
        });

        new_item.find('[class*="' + classes_keep + '"]').each(function () {
            $(this).attr('class', $(this).attr('class').replace(classes_keep, '').replace(/ +/g,' ').trim());
        });
    }

    function fixDomainObjects (new_item,cart_item) {
        var stop_for;

        if(cart_item.user_attributes === undefined) {
            new_item.find('.domain-configure').remove();
            return;
        }

        var allow;

        stop_for = ['renew','trade'];
        allow = ! (stop_for.indexOf(cart_item.product_action) < 0 || (cart_item.product_action.toString().indexOf('transfer') > -1 && cart_item.sku == 'eu'));

        if (allow) {
            new_item.find('.domain-configure .contacts_cont').closest('.columns').remove();
        } else {
            fixDomainContactObject(new_item, cart_item);

            if ('contacts_no_edit' in cart_item.user_attributes)
                new_item.find('.domainEdit[data-edit="contacts"]').remove();
        }

        stop_for = ['transfer', 'renew', 'transfer_renew', 'trade'];


        if(stop_for.indexOf(cart_item.product_action) > -1){
            new_item.find('.domain-configure .nameservers_cont').closest('.columns').remove();
            return ;
        }

        fixDomainNameserverObject(new_item, cart_item.user_attributes.nameservers);
    }

    function fixDomainContactObject (new_item,cart_item) {
        if(!('list' in contacts)){
            new_item.find('.oneRequired, .manyRequired').remove();
            return ;
        }

        var saved_contacts = cart_item.user_attributes.contacts,
            config = new_item.find('.domain-configure .content:first');

        if(saved_contacts.registry_settings.required.length == 1){
            var attr = config.find('.attr-items'),
                form = config.find('.attr-form'),
                result = config.find('.oneRequired').html();

            attr.find('div').remove();
            attr.find('a').before(result);

            var label = form.find('label'),
                select = label.find('select');
            label.html(label.find('select'));

            var value = saved_contacts.saved[saved_contacts.registry_settings.required[0]];

            if(value) {
                var contact = contacts.list[contacts.list.findIndex(function (a) {
                    if(a.id == saved_contacts.saved[saved_contacts.registry_settings.required[0]])
                        return a;
                })];

                attr.find('span').text('#' + contact.id + ' ' + contact.name);
            }

            if(contacts.list.length){
                $('.contactWRN').hide();
                $('.contactLabel').show();

                $.each(contacts.list, function (key, value) {
                    var option = select.find('[value="' + value.id + '"]');

                    if(option.length < 1){
                        select.append('<option value="' + value.id + '">' + value.name + '</option>');

                        option = select.find('[value="' + value.id + '"]');
                    }

                    if(value[cart_item.registry_name + '_ready'] === 0)
                        option.disabled(true);
                });

                if ('explicit_contacts' in cart_item.user_attributes) {
                    select.find('option').filter(function (a, i) {
                        return cart_item.user_attributes.explicit_contacts.indexOf(parseInt(i.value)) < 0
                    }).remove();

                    form.find('.new-contact-profile').remove();

                    select.chosen_update(select.val());
                }
            }else{
                $('.contactWRN').show();
                $('.contactLabel').hide();
            }

            select.apply_chosen({'value':(value ? value : ''),'par':{search_contains:true}}).update_version_control(value);

            if(value){
                config.closest('.wrapper').find('.icon.alert').toggleClass('alert success').find('i').toggleClass('icon-question icon-checkmark');
                config.find('.domainEdit').text(COMMON_LANG.CART.MISC.CHANGE);
            }

        }else{
            var attr = config.find('.attr-items'),
                form = config.find('.attr-form'),
                result = config.find('.manyRequired').html();

            attr.find('div').remove();
            attr.find('a').before(result);

            var contact_list = attr.find('ul'),
                contact_item = contact_list.find('li')[0].outerHTML,
                label = form.find('label')[0].outerHTML,
                a = form.find('.new-contact-profile'),
                saved_count = 0;

            contact_list.empty();

            form.find('label').remove();

            $.each(saved_contacts.registry_settings.required, function (key, value) {
                contact_list.append(contact_item.replace(/##role##/g,value).replace(/##Role##/,trans('DOMAINS.CONTACT_ROLES.' + value.toUpperCase() + '.DISPLAY')));

                a.before(label);
                var current_label = form.find('label:last'),
                    span = current_label.find('span'),
                    select = current_label.find('select'),
                    placeholder = current_label.find('.placeholder'),
                    text;

                span.text(span.text().replace(trans('DOMAINS.CONTACT_ROLES.REGISTRANT.FORM', 1), trans('DOMAINS.CONTACT_ROLES.' + value.toUpperCase() + '.FORM', 1)));

                text = select.attr('data-placeholder').replace(trans('DOMAINS.CONTACT_ROLES.REGISTRANT.FORM', 2), trans('DOMAINS.CONTACT_ROLES.' + value.toUpperCase() + '.FORM', 2));
                select.attr('data-placeholder',text);
                placeholder.text(text);

                if(saved_contacts.saved[value])
                    contact_list.find('li:last span').text(contacts.list[contacts.list.findIndex(function (a) {
                        if(a.id == saved_contacts.saved[value])
                            return a;
                    })].name);

                select.attr('name',value).apply_chosen(saved_contacts.saved[value]? saved_contacts.saved[value] : '').update_version_control(saved_contacts.saved[value]);

                if(saved_contacts.saved[value])
                    ++saved_count;
            });

            if(saved_count == saved_contacts.registry_settings.required.length){
                config.closest('.wrapper').find('.icon.alert').toggleClass('alert success').find('i').toggleClass('icon-question icon-checkmark');
                config.find('.domainEdit').text(COMMON_LANG.CART.MISC.CHANGE);
            }
        }
    }

    function fixDomainNameserverObject (new_item,saved_ns) {
        var config      = new_item.find('.domain-configure .content:last'),
            ns_cont     = config.find('.ns_container'),
            select      = config.find('.ns_group'),
            group       = select.find('optgroup:last'),
            attr_cont   = config.find('.attr-items'),
            item_id     = new_item.attr('data-cart-item-id'),
            editbtn     = config.find('.domainEdit');

        new_item.attr('data-registry', saved_ns.registry_settings.name);
        ns_cont.attr('data-min', saved_ns.registry_settings.min).attr('data-max', saved_ns.registry_settings.max);

        $.each(nsgroups, function (key, value) {
            if(select.find('[value="' + key + '"]').length < 1)
                group.append('<option value="' + key + '">' + value.name + '</option>');
        });

        if(saved_ns.saved.group_id) {
            if(!$.isTouch())
                select.apply_chosen(saved_ns.saved.group_id);
            else
                select.val(saved_ns.saved.group_id);

            select.change();
            attr_cont.prepend(ns_cont.html());

            logs[item_id].name_servers = {
                groupId : saved_ns.saved.group_id
            };

            editbtn.text(COMMON_LANG.CART.MISC.CHANGE);
        }else if(saved_ns.saved.list){
            select.apply_chosen('nons').change();

            logs[item_id].name_servers = {
                values : []
            };

            $.each(saved_ns.saved.list, function (key, value) {
                var ns      = ns_cont.find('.nameservers:eq(' + key + ')'),
                    add_btn = ns_cont.closest('form').find('.addNameServers');

                if(ns.length < 1)
                    add_btn.click();

                ns = ns_cont.find('.nameservers:eq(' + key + ')');

                ns.val(value);

                logs[item_id].name_servers.values.push(value);
                editbtn.before('<span>' + value + '</span>');
            });

            editbtn.text(COMMON_LANG.CART.MISC.CHANGE);

            select.controlDeleteButtons();
        }else{
            select.apply_chosen('');
        }

        if(saved_ns.status){
            var wrapper = config.closest('.wrapper').find('.icon').toggleClass('alert success').find('i').toggleClass('icon-question icon-checkmark');
        }
    }

    function updateCheckoutPrices (checkout, action, time) {
        // if(execution_time[action] > time)
        //     return ;

        var prices = checkout['totals'];

        $('.checkout_order_price').attr('data-target',prices.sub_total).text($.imperial_to_metric(prices.sub_total));

        if (vat['show'] || $userGroup == 'user')
            $('.checkout_order_vat').text($.imperial_to_metric(prices.vat));

        updateOrderTotalVat (prices.sub_total, prices.grand_total);

        // execution_time[action]  = time;

        process_checkout_settings (checkout);
    }

    function process_checkout_settings (checkout) {
        if(typeof payment_totals == 'undefined')
            return;

        $.each(checkout.settings.total, function (key, value){
            payment_totals[key] = value;

            if(key == 'credit'){
                var obj = $('.credit_payment_balance');

                obj.text(checkout.settings.credits.balance.formated);
                checkout.settings.credits.use ? obj.closest('.credit-box ').show() : obj.closest('.credit-box ').hide().find('[type="checkbox"]').prop('checked', false);
            }else if(key == 'credit_limit'){
                var obj = $('.credit_limit_balance');

                obj.text(checkout.settings.credit_limit.balance.formated);
                checkout.settings.credit_limit.use ? obj.closest('.credit-box ').show() : obj.closest('.credit-box ').hide().find('[type="checkbox"]').prop('checked', false);
            }
        });

        $('#credit_payment_form').trigger('change');

    }

    function sideCartVisibility (callback) {
        if(typeof sideCartTimer != 'undefined')
            clearTimeout(sideCartTimer);

        sideCartTimer = setTimeout(function(){
            if(!sideCartVisGet)
                return ;

            var cont = $('#sideCartCont');

            if($(window).scrollTop() >= nav_end){
                $('#sideCartCont.empty.active').removeClass('active');

                if(sidCartVisibility)
                    return ;

                $('#sideCartCont:not(.empty)').removeClass('hide-important');
                $('#sideCartCont.empty').addClass('hide-important');

                checkVisibility();
            }else{
                if(!sidCartVisibility)
                    return ;

                if(cont.hasClass('active'))
                    cont.removeClass('active');
                else
                    cont.addClass('hide-important');

                checkVisibility();
            }
        }, 100);

        if(typeof callback == 'function'){
            if($('.reveal-modal-bg:visible').length < 1){
                callback();
            }else{
                setTimeout(function(){
                    callback();
                },300);
            }
        }
    }

    function reCreateCartSummary (data) {

        if(data.items.length){

            var current_item = $(data.instance.triggered_item);

            if(current_item.length > 1)
                current_item = current_item.filter('input');

            var $loading_items  = ((current_item.is('input')) ? $('.item:has(.item_loader):not([data-cart-item-id="' + current_item.closest('.item').attr('data-cart-item-id') + '"])') : $('.item:has(.item_loader):not(' + data.instance.triggered_item + ')')),
                templates       = {},
                pending_delete  = $.cart_loaders.get_pending_delete(),
                firstItem       = true;

            if($loading_items.length){
                $loading_items.each(function () {
                    var obj = $(this);

                    templates[obj.attr('data-cart-item-id')] = obj[0].outerHTML;
                });
            }

            $('.item').remove();

            if('ns_group' in data){
                nsgroups[data.ns_group.group_id] = {
                    id          : data.ns_group.group_id,
                    name        : data.ns_group.group_name,
                    nameservers : data.ns_group.list
                }
            }

            $.each(data.items, function (key, value) {

                if($.inArray('[data-cart-item-id="' + value.id + '"]', pending_delete) == -1){

                    if($.inArray(value.id, data.children) == -1){

                        if (value.id in templates) {

                            if(firstItem)
                                $('#itemsWrapper .header').after(templates[value.id]);
                            else
                                $('.item:last').after(templates[value.id]);
                        } else {

                            var $new_item = $.cart.view.insert.item({'msg' : {'cart_item' : value}});

                            if (value.children_cross_sell.length) {

                                $.each(value.children_cross_sell, function (index, child) {
                                    var childLookup = child;

                                    if ($.inArray('[data-cart-item-id="' + childLookup + '"]', pending_delete) == -1) {

                                        child = data.items[data.items.findIndex(function ($item) {
                                            return $item.id == childLookup;
                                        })];

                                        $.cart.view.insert.sale(value.id, child, data.items);
                                    } else {

                                        $.cart_loaders.remove_pending_delete('[data-cart-item-id="' + childLookup + '"]');
                                    }
                                });
                            }

                            if (value.children_up_sell.length) {

                                $.each(value.children_up_sell, function (index, child){
                                    var childLookup = child;

                                    if ($.inArray('[data-cart-item-id="' + childLookup + '"]', pending_delete) == -1) {

                                        child = data.items[data.items.findIndex(function ($item) {
                                            return $item.id == childLookup
                                        })];

                                        var $up_sell = $new_item.find('[data-product-id="' + child.catalog_product_id + '"]').prop('checked', true).attr('data-cart-item-id', child.id).closest('.up_sell');

                                        $up_sell.find('.add_label').hide();
                                        $up_sell.find('.service_in_cart').show();

                                        $up_sell.find('.up_sell_price').show();


                                    } else {

                                        $.cart_loaders.remove_pending_delete('[data-cart-item-id="' + childLookup + '"]');
                                    }
                                });
                            }

                            $new_item.find('.actions-panel').each(function () {
                                var obj         = $(this),
                                    children    = obj.children();

                                if(children.length < 1)
                                    obj.remove();
                            });

                            if(value.type == 'ssl' && value.settings.length < 1){
                                $new_item.find('.ssl-configure').remove();
                            }
                        }

                        if(value.type == 'ssl' && !$.cart_loaders.find_up_sell_delete()){
                            $('[data-cart-item-id="' + value.id + '"]').find('.item_loader').remove();
                        }
                    } else {

                        if (value.sku.indexOf('ssl_install') > -1 && 'domain' in value.user_attributes) {
                            var parent = $.grep(data.items, function (obj) {
                                return obj.children.length > 0 && obj.children.indexOf(value.id) > -1;
                            });

                            if (parent[0].product_action == 'renew')
                                $('.get-ssl-domain:has([name="target_domains_' + value.id + '"])').show().empty().append($('#ssl_installation_required_domain_set_display').html().replace(/##domain##/g,value.user_attributes.domain));
                            else
                                $('.get-ssl-domain:has([name="target_domains_' + value.id + '"])').show().empty().append($('#ssl_installation_required_domain_set').html().replace(/##id##/g,value.id).replace(/##domain##/g,value.user_attributes.domain));
                        }
                    }
                    firstItem = false
                }else{

                    $.cart_loaders.remove_pending_delete('[data-cart-item-id="' + value.id + '"]');
                }
            });

            var productCont = $('#product-summary');

            productCont.find('.footer, .cart-chechout').show();

            $('.item:not([data-group="ssl"])').find('.ssl-configure').remove();

            updateCheckoutPrices(data.checkout, 'update');
            sort_items();

            $wrapper.css('min-height', '');
            var $height = $wrapper.height();

            $wrapper.css('min-height', $height);

            if($.cart_loaders.get_active_loaders().length < 1){

                var prices = $('#itemsWrapper').find('.prices-box');

                prices.find('ul').show();
                prices.find('.loading').hide();
            }
        }else{

            $('.cart_step, .steps').remove();
            $('.cart-icon-msg').show()
        }

        var durations = $('#product-summary .duration');

        if($.getSizeClassification('medium_down')){

            $.durations.fixPricesForMediumDown(durations);
        }else{

            $.durations.fixPricesForLargeUp(durations);
        }

        $.rebuildCheckoutForm(data.checkout.settings);

        $(document).foundation('dropdown', 'reflow');

        $('.get-ssl-domain').slideDown(200);

    }

    $('#sideCartCont').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        var obj = $(this);

        if(!obj.hasClass('active')){
            obj.removeClass('w-shadow');

            if($(window).scrollTop() < nav_end || obj.hasClass('empty'))
                setTimeout(function () {
                    obj.addClass('hide-important');
                    checkVisibility();
                }, 500);
        }
    });

    function checkVisibility() {
        if($('.reveal-modal-bg:visible').length < 1){
            sideCartVisGet = $.getSizeClassification('large_up');
            sidCartVisibility = $('#sideCartCont:not(.empty):visible').length > 0;
        }else{
            setTimeout(function(){
                sideCartVisGet = $.getSizeClassification('large_up');
                sidCartVisibility = $('#sideCartCont:not(.empty):visible').length > 0;
            },250);
        }

    }
    
    function addToCartErrorHandler (data) {
        switch (data.code){
            case error_codes.validation_error  : {
                $.alertHandler('',(data.data.length) ? data.data.length : data.msg,alert_box_failure);
                break;
            }
            case error_codes.cart_option_error  : {
                $.each(data.data, function (key, value) {
                    $('ul[data-option-id="' + value['option_id'] + '"]').after(helperBlock).closest('.panel').find('.help-block').text(value['error']);
                });
                break;
            }
            case error_codes.cart_extension_error  : {
                $.each(data.data, function (key, value) {
                    $('.extension-panel[data-detail-id="' + value['option_detail_id'] + '"]').append(helperBlock).find('.help-block').text(value['error']);
                });
                break;
            }
            case error_codes.cart_attribute_error : {
                $.alertHandler('',data.msg,alert_box_failure);

                $.each(data.data, function (key, value) {
                    var error = {};
                    error[key] = value.locale;

                    $.displayErrors($('#' + key).closest('form').attr('id'), error);
                });
                break;
            }
            default : {
                globalApplicationErrors(data, '');
            }
        }
    }

    function updateOrderTotalVat (subTotal, grandTotal){
        var $order_total = $('.checkout_order_total');

        if($order_total.hasClass('relative'))
            $order_total.update_vat('relative', [subTotal], 0);
        else
            $order_total.text($.imperial_to_metric(grandTotal));
    }

    if ($('#sideCartCont .cart-items').length) {
        $.observers.register("side_cart", function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.removedNodes.length) {
                    if (typeof observationSideCartTimer == 'undefined' || observationSideCartTimer == null) {
                        observationSideCartTimer = setTimeout(function () {
                            sideCartVisibility();
                        }, 250);
                    }
                }
            });
        });

        $.observers.observe('side_cart', $('#sideCartCont .cart-items')[0], {childList: true})
    }
});