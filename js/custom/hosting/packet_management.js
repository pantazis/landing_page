$(document).ready(function () {
    var productId = null;

    summary_included_template ='<li>'+
        '<div>Info</div>'+
        '<div class="text-right price_container">Price</div>'+
    '</li>';

    $(document)
        .on('click', '.immediate.order, .order.server, .update.order, .update.server', function (e) {
            e.preventDefault();
        })
        .on('click', '.immediate.order:not(.pending):not(.validate):not(.go_to_configure)', function () {
            place_immediate_order($(this));
        })
        .on('click', '.order.server:not(.pending):not(.validate)', function () {
            place_immediate_order($('.immediate.order'));
        })
        .on('click', '.update.order:not(.pending):not(.validate)', function (e) {
            e.preventDefault();
            update_order($(this));
        })
        .on('click', '.update.server:not(.pending):not(.validate)', function (e) {
            e.preventDefault();
            update_order($('.update.order'));
        })
        .on('click', '.quantity_handler', function (e) {
            var obj         = $(this),
                cont        = obj.closest('.quantity_container'),
                display     = cont.find('.quantity_display'),
                quantity    = parseInt(display.val()),
                step        = parseInt(cont.attr('data-step'));

            if (typeof step == 'undefined' || isNaN(step))
                step = 1;

            if (obj.attr('data-handling') == 'raise') {
                var max = parseInt(cont.attr('data-max'));

                quantity += step;

                if (quantity > max)
                    quantity = max;

            } else {
                var min = parseInt(cont.attr('data-min'));

                if (typeof min == 'undefined' || isNaN(min))
                    min = 1;

                quantity -= step;

                if (quantity < min)
                    quantity = min;
            }

            obj.blur();
            display.val(quantity);
            $.calculate_prices_for_certificates($(this).closest('.product_info').find('.length.active'));
        })
        .on('click', '.additional-domains .quantity_handler, .additional-servers .quantity_handler', function () {
            $.calculate_prices_for_certificates($(this).closest('.product_info').find('.length.active'));
        })
        .on('click', '.additional-domains .quantity_handler', function () {
            var domains = $('#totalDomains');


            domains.text(parseInt(domains.attr('data-domains')) + parseInt($('.additional-domains .quantity_display').val()));
        })
        .on('input change', '.quantity_display', function (e) {
            var obj     = $(this),
                cont    = obj.closest('.quantity_container'),
                max     = parseInt(cont.attr('data-max'));

            if (obj.val() < 1)
                obj.val(1);
            else if (obj.val() > max)
                obj.val(max);
        });

    $.extend({
        packet : {
            order : function () {
                place_immediate_order($('.order.validate'));
            },
            update : function () {
                update_order($('.update.validate'));
            },
            pricing : {
                update : function () {
                    update_config_total_price();
                }
            }
        }
    });

    $('.configurator input:not(.configuration_tab input):not([type="text"]):not(.local_handler)').change(function () {
        option_changed($(this));
    });

    $(document).on('click', '.summary .length a', function (e){
        e.preventDefault();

        adjust_for_length($(this).closest('.length'));
    });

    $('.configuration_tab input:not([type="text"])').on('change', function () {
        handle_configuration_event($(this));
    });

    $('.implement_post .length a').on('click', function () {
        $('.implement_post [name="length"]').val($(this).closest('.length').attr('data-length'));
    });

    $('.plan').on('click', function () {
        var product = $(this),
            selected_plan = $('.plan.selected').removeClass('selected'),
            selected_select = selected_plan.find('.select-plan span'),
            selected_text = selected_select.text(),
            current_select = product.find('.select-plan span'),
            product_display = $('.selected-product');

        selected_select.text(current_select.text());
        product.addClass('selected');
        current_select.text(selected_text);

        product_display.find('.title').text(product.find('.plan-header').text());
        var duration = product_display.find('.duration ul'),
            selected_length = duration.find('.length.active').attr('data-length');

        duration.find('.active').removeClass('active');


        $.each(costsTables, function (key, value){

            var length = key.match(/[0-9]+/)[0],
                init_price = value[product.attr('data-sites') + 'site'];

            if (init_price.constructor == Object) {
                var strikethrough = duration.find('[data-length="' + length +'"] .strikethrough');

                if (strikethrough.length < 1) {
                    duration.find('[data-length="' + length +'"] .price-per-length').prepend('<s class="strikethrough"><span class="vat" data-price="0.0">0.0</span> €</s>');
                }

                duration.find('[data-length="' + length +'"] .strikethrough .vat').update_vat('price', [init_price.base], 0);

                duration.find('[data-length="' + length +'"] .on-length').update_vat('on-length', [(init_price.total * length).toFixed(2), init_price.total], 1);
            } else {
                duration.find('[data-length="' + length +'"] .strikethrough').remove();
                duration.find('[data-length="' + length +'"] .on-length').update_vat('on-length', [(init_price * length).toFixed(2), init_price], 1);
            }
        });

        duration.find('[data-length="' + selected_length + '"]').click();
    });

    $('.go_to_configure').on('click', function (e) {
        e.preventDefault();
        var product_id = $('[name="product_id"]'),
            length = $('[name="length"]');

        if($(this).hasClass('small_view')){
            product_id.val($('#siteAmountForm [type="radio"]:checked').val());
            length.val($('#hostingLengthForm [type="radio"]:checked').val());
        }else{
            product_id.val($('.plan.selected').attr('data-product-id'));
            length.val($('.buy-overview .length.active').attr('data-length'));
        }

        var obj = $(this);

        obj.find('.submitText').hide();
        obj.find('.loading').show();

        product_id.first().closest('form').submit();
    });

    $('#informedSubmit').on('click', function (e) {
        e.preventDefault();

        var obj     = $(this),
            modal   = obj.closest('[data-target]'),
            target  = modal.attr('data-target');

        modal.attr('data-target', '');

        modal.modal_close();

        $('[data-product-sku="' + target + '"] .add-to-cart a').trigger('click');
    });

    $('#informedSubmitContinue').on('click', function (e) {
        e.preventDefault();

        $(this).closest('[data-target]').attr('data-target', '');
    });

    $('.order_dedi').on('click', function (e) {
        e.preventDefault();

        $(this).closest('form').submit()
    });

    if ($.getNewTabRemarketingCookie) {
        var $remarketingCookie = $.getNewTabRemarketingCookie();

        if ($remarketingCookie) {
            $.sendSelectContentForThisUrl(location.href);

            $.removeNewTabRemarketingCookie();
        }
    }

    /**
     * FROM PRODUCT TO CONFIG START
     */

        function update_option_price (length) {
            if(typeof products == 'undefined'){
                return ;
            }

            length = (length.hasClass('.length')) ? length.attr('data-length') : length.closest('.length').attr('data-length');

            $.each(products, function(key, value){
                var inputs = $('.panel input[name="' + key + '"]:not(.remove_spec)');

                if (inputs.length == 1) {
                    inputs.closest('li').find('label .vat:first').update_vat('on-length', [value['total'][length],value['total_per_interval'][length]], 1);

                    if ('setup_fee' in value)
                        inputs.closest('li').find('setup-fee').update_vat('price', value['setup_fee'][length]);
                } else if(inputs.length > 1) {
                    inputs.each(function () {
                        var obj = $(this),
                            sku = obj.attr('data-sku');

                        if (sku in value) {
                            obj.closest('li').find('label .vat:first').update_vat('on-length', [value[sku]['total'][length], value[sku]['total_per_interval'][length]], 1);

                            if ('setup_fee' in value[sku]) {
                                obj.closest('li').find('setup-fee .vat:not(.strikethrough .vat)').update_vat('price', value[sku]['setup_fee'][length])
                            }
                        }
                    });
                }
            });
        }

    /**
     * FROM PRODUCT TO CONFIG END
     */

    /**
     * CONFIG PRODUCTS AND PRICES UPDATE START
     */

        function option_changed (input) {
            var panel   = input.closest('.panel'),
                specs   = $('.summary .specs'),
                label   = input.closest('li').find('label');

            var add_ons = $('.server-configurator .summary .specs ul'),
                target  = add_ons.find('.' + input.attr('name'));

            if(target.length < 1) {
                var data_target = input.closest('[data-target]');

                if (data_target.length) {
                    data_target = data_target.attr('data-target');

                    target = $('ul.' + data_target).find('.' + input.attr('name'));
                }
            }

            if(input.attr('type') == 'checkbox'){
                handle_checkbox_addon(input, target, add_ons, label);
            }else{
                handle_radio_addon(input, target, add_ons, label);
            }

            if(add_ons.find('li').length > 1){
                $('#no_add_ons').hide();
            }else{
                $('#no_add_ons').show();
            }

            update_config_total_price();
        }

        function handle_checkbox_addon (input, target, add_ons, label) {
            if(target.length){
                target.remove();

                var products_setup_fee = label.find('.vat.setup-fee');

                if(products_setup_fee.length) {
                    var setupFee                    = $('#setupFee .vat'),
                        setup_fee_price             = setupFee.get_price('data-price-length-unit'),
                        full_length_setup_fee_price = setupFee.get_price();

                    setup_fee_price                 -= products_setup_fee.get_price();
                    full_length_setup_fee_price     -= products_setup_fee.get_price();

                    setupFee.update_vat('on-length', [full_length_setup_fee_price, setup_fee_price], 1);
                }
            }else{
                var setup_fee_exists    = false,
                    extra_fees          = {};

                if (label.find('.vat').length == 1) {
                    var product_price               = label.get_price('data-price-length-unit'),
                        full_length_product_price   = label.get_price();
                } else {
                    var product                     = label.find('.vat.on-length');
                    products_setup_fee              = label.find('.vat.setup-fee');

                    product_price                   = product.get_price('data-price-length-unit');
                    full_length_product_price       = product.get_price();

                    // setupFee                        = $('#setupFee .vat'),
                    // setup_fee_price                 = setupFee.get_price('data-price-length-unit'),
                    // full_length_setup_fee_price     = setupFee.get_price();

                    // setup_fee_price                 += products_setup_fee.get_price();
                    // full_length_setup_fee_price     += products_setup_fee.get_price();
                    //
                    // setupFee.update_vat('on-length', [full_length_setup_fee_price, setup_fee_price], 1);
                    //
                    setup_fee_exists                = true;

                    extra_fees.setup_fee            = products_setup_fee.get_price();
                }

                add_ons.append(summary_included_template.replace('Info',label.find('.name:first').text()).replace('Price', $.insert_vat(((setup_fee_exists) ? 'on-length-with-setup-fees' : 'on-length'), product_price, full_length_product_price, extra_fees))).find('li:last').addClass(input.attr('name'));
            }
        }

        function handle_radio_addon (input, target, add_ons, label){
            if(input.hasClass('remove_spec')){
                target.remove();
                return ;
            }

            if(target.length){
                var product_name = target.find('.product_name'),
                    price_container = target.find('.price_container');

                if(product_name.length)
                    product_name.text(label.find('.name').text());
                else
                    target.find('div:first').text(label.find('.name').text());

                if (label.get_price() == 0) {
                    price_container.update_vat('on-length', [0,0], 0);
                    price_container.find('.vat').text(price_container.find('.vat').text() + ' €');
                } else {
                    price_container.update_vat('on-length', label.find('.vat'), 'data-price-length-unit');

                    if(price_container.hasClass('add_currency'))
                        price_container.find('.vat').append(' €');
                }
            }else{
                add_ons.append(summary_included_template.replace('Info',label.find('.name').text()).replace('Price', $.insert_vat('on-length', label.get_price('data-price-length-unit'), label.get_price()))).find('li:last').addClass(input.attr('name'));
            }
        }

        function update_config_total_price () {
            var summary                 = $('.summary'),
                total                   = 0,
                total_per_interval      = 0,
                total_base_per_interval = 0,
                current_length          = summary.find('.length.active').attr('data-length'),
                options_discount        = 0;

            summary.find('.specs .vat:not(#setupFee .vat)').each(function () {
                var obj = $(this),
                    product = products[obj.closest('li').attr('class')],
                    item_price = obj.get_price(['data-price-length-total']);

                total_per_interval += parseFloat(obj.get_price('data-price-length-unit'));
                total += parseFloat(item_price);

                if (! obj.is('.packet .vat'))
                    total_base_per_interval += parseFloat(obj.get_price('data-price-length-unit'));

                if(product){
                    if ('total' in product) {
                        options_discount += product.discount[current_length];
                    } else {
                        var discount_cont = $.grep(product, function (data) {
                            return JSON.stringify(data.total).indexOf(':' + item_price) > -1
                        })[0];

                        if (typeof discount_cont != 'undefined')
                            options_discount += discount_cont.discount[current_length];
                    }
                }
            });


            var total_discount = discount[current_length] + options_discount;

            total_per_interval = total_per_interval.toFixed(2);

            summary.find('.price, .pricing').find('.vat:not(.strikethrough .vat)').update_vat('price-total-sup', [total_per_interval], 0);
            summary.find('#final_price').update_vat('price', [total], 0);
            summary.find('#price_discount').update_vat('price', [total_discount], 0);
            summary.find('#initial_price').update_vat('price', [total + total_discount], 0);

            var productOriginalPrice = $('#productOriginalPrice');

            if (productOriginalPrice.length) {
                var selected_length = $('.length.active');

                if (selected_length.find('.strikethrough').length) {
                    total_base_per_interval += selected_length.find('.strikethrough').get_price();

                    productOriginalPrice.show().find('.vat').update_vat('price', [total_base_per_interval],0);
                } else {
                    productOriginalPrice.hide();
                }
            }

            collectSetupFeesInSummary();
        }

        function update_summary_option_price () {
            $('.configurator input:checked:not(.remove_spec)').each(function () {
                var input = $(this),
                    vat = input.closest('li').find('label .vat:first');

                if(vat.get_price() > 0){
                    $('.summary li.' + input.attr('name') + ' .vat').update_vat('on-length', vat, 'data-price-length-unit');
                }else{
                    var vatToUpdate = $('.summary li.' + input.attr('name') + ' .vat');
                    vatToUpdate.update_vat('on-length', [0,0], 0);
                    vatToUpdate.find('.vat').text(vatToUpdate.find('.vat').text() + ' €');
                }
            });
        }

        function adjust_for_length (length) {
            var vat         = length.find('.vat:not(.strikethrough .vat)'),
                setuFeeCont = $('#setupFee');

            length.closest('ul').find('.active').removeClass('active');
            length.addClass('active');

            $('.summary li.packet').update_vat('on-length',vat,'like', ['data-price-length-total', 'data-price-length-unit'], 'data-price-length-unit');
            $('.summary .duration button').text(vat.get_length_duration('right'));

            if(setuFeeCont.length) {
                var setuFeeContPrice = 0;

                if (typeof setup_fee != 'undefined' && setup_fee !== false) {
                    if (setup_fee.constructor == Object && 'base' in setup_fee)
                        setuFeeContPrice = setup_fee['base'][length.attr('data-length')];
                    else
                        setuFeeContPrice = setup_fee[length.attr('data-length')];
                }

                $('.on-length-with-setup-fees').each(function () {
                    setuFeeContPrice += $(this).get_price('data-price-setup-fees');
                });


                if (setuFeeContPrice)
                setuFeeCont.find('.vat:not(.strikethrough .vat)').update_vat('price', [setuFeeContPrice], 0);
            }

            update_option_price(length);
            update_summary_option_price();
            update_config_total_price();
        }

    /**
     * CONFIG PRODUCTS AND PRICES UPDATE END
     */

    /**
     * DEDICATED SERVERS CONFIGURATOR START
     */

        function handle_configuration_event (input) {
            var target_val = input.val(),
                target_spec = $('.summary .specs .' + input.attr('name'));

            if(target_val.length) {
                update_dedicated_summary(input, target_spec);
            }else{
                target_spec.remove();
            }

            update_config_total_price ();


        }

        function update_dedicated_summary (input, target_spec) {
            var target_li = input.closest('li');

            if (target_li.find('.setup-fee').length){
                option_name = input.closest('.panel').find('.lead').text() + ': ' + target_li.find('.name:first').text();
            }else
                option_name = input.closest('.panel').find('.lead').text() + ': ' + target_li.find('.name').text();

            var vat = input.closest('li').find('.vat');

            if(target_spec.length){
                update_item_in_dedicated_summary(input, vat, target_spec);
            }else{
                insert_item_to_dedicated_summary(input, vat);
            }
        }

        function update_item_in_dedicated_summary (input, vat, target_spec) {
            target_spec.find('div:first').text(option_name);

            if(!input.hasClass('included')) {
                var containing_li = input.closest('li');
                var product_price = containing_li.find('.vat.on-length');
                var products_setup_fee = containing_li.find('.vat.setup-fee');

                if (products_setup_fee.length) {
                    target_spec.find('.vat').remove();
                    target_spec.find('.text-right').empty().insert_vat('on-length-with-setup-fees',product_price.get_price('data-price-length-unit'),product_price.get_price(),{'setup_fee':products_setup_fee.get_price()});
                } else{
                    target_spec.find('.vat').remove();
                    target_spec.find('.text-right').empty().insert_vat('on-length',0,0,{});
                    source_included_item(vat, target_spec);
                }
            }else{
                target_spec.find('.vat').remove();
                target_spec.find('div.text-right').empty().html($.insert_vat('on-length',0,0));
            }
        }

        function source_included_item (vat, target_spec) {
            target_spec.update_vat('on-length', vat, 'data-price-length-unit');

            if (target_spec.text().match('€') == null) {
                target_spec.find('.vat').after(' €');
            }
        }

        function insert_item_to_dedicated_summary (input, vat) {
            var target_list = $('.summary .specs .' + input.closest('.configurator').attr('data-target'));
            target_list.append(summary_included_template.replace('Info', option_name).replace('Price', $.insert_vat('on-length', vat.get_price('data-price-length-unit'), vat.get_price(), ['data-price-length-unit'])));
            target_list.find('li:last').addClass(input.attr('name'));
        }

    /**
     * DEDICATED SERVERS CONFIGURATOR END
     */

    function place_immediate_order (obj, confirmed) {
        if (obj.hasClass('no_gr_support') && ! cookie_comodo_language_warning) {
            $('#supportedLanguages').attr('data-target', obj.closest('[data-product-sku]').attr('data-product-sku')).modal_open();

            cookie_comodo_language_warning = true;

            Cookies.get('comodo_language_warning', true, {path: '/', expires: 7});

            return;
        }

        if(obj.hasClass('small_view')){
            place_immediate_order_small(obj, confirmed)
        }else{
            place_immediate_order_large(obj, confirmed);
        }
    }
    
    function place_immediate_order_large (obj, confirmed) {
        var info = obj.closest('.product_info'),
            options     = {},
            orders      = $('.order'),
            length      = info.find('.length.active'),
            formId      = '',
            checked_options,
            data;

        if (obj.hasClass('preview')) {
            info = $('.plan.selected');
            length = obj.closest('ul').find('.length.active');
        }

        orders.addClass('pending');

        checked_options = $('input:checked');

        checked_options.each(function () {
            var obj = $(this),
                detail = obj.closest('li');

            if(detail.length){
                var option = detail.closest('ul'),
                    option_id = option.attr('data-option-id');

                if(typeof options[option_id] == 'undefined')
                    options[option_id] = [];

                options[option_id].push(detail.attr('data-option-detail-id'));
            }
        });

        data = {
            length      : length.attr('data-length'),
            sku         : info.attr('data-product-sku'),
            settings    : build_settings(info),
            _token      : $('[name="_token"]').val(),
            unique_id   : unique_page_identifier,
            options     : options
        };

        // Andreas 26/06/2019
        if ($(".shared-hosting-plans").length) {
            data = {
                length      : obj.parents('.plan').attr('data-product-length'),
                sku         : obj.parents('.plan').attr('data-product-sku'),
                settings    : build_settings(info),
                _token      : $('[name="_token"]').val(),
                unique_id   : unique_page_identifier,
                options     : options
            };
        }
        // Andreas end

        var quantity = info.find('.ssl_quantity_input');

        if (quantity.length) {
            data.quantity = parseInt(quantity.val());
        }

        if(confirmed){
            data.confirmed = true;
        }

        var hostname = $('.configurator #hostname');

        if(hostname.length){
            data.user_attributes = {};
            data.user_attributes.hostname = (hostname.val()) ? hostname.val() : null;

            formId = hostname.closest('form').attr('id');
        }

        var domain_name = $('.configurator #domain_name');

        if (domain_name.length) {
            if (!('user_attributes' in data))
                data.user_attributes = {};

            data.user_attributes.domain_name = (domain_name.val()) ? domain_name.val() : null;

            formId = domain_name.closest('form').attr('id');
        }

        activateBtnsLoader(obj);

        var configuration_forms = $('#vps_form, #configurator_form');

        var immediate_order = new $.ajax_prototype({
            type : 'POST',
            url: site_map.cart + '/add',
            data : data,
            success: function (data) {
                if(data.success){
                    var totalDomains = $('#totalDomains');

                    totalDomains.text(totalDomains.attr('data-domains'));

                    if (quantity.length)
                        quantity.val(1);

                    if(configuration_forms.length < 1) {
                        obj.addClass('success').find('.submitText').text(COMMON_LANG.CART.IN_CART);

                        setTimeout(function () {
                            obj.removeClass('success').find('.submitText').text(((obj.hasClass('ssl_order')) ? COMMON_LANG.CART.ORDER_SSL : COMMON_LANG.CART.ORDER));
                        }, 3000);
                    }

                    if (String(window.location).indexOf('configure') > -1) {
                        //Item added to cart - due to redirect add_to_cart event will be sent on next load
                        if (app_env != 'local' && 'remarketing_items' in data.data)
                            $.setAddToCartConfiguredCart(data.data.remarketing_items);
                        redirect = data.data.id;
                    } else {
                        //Item added to cart - send add_to_cart event
                        if (app_env != 'local' && 'remarketing_items' in data.data)
                            $.sendAddToCartRemarketingEvent(data.data.remarketing_items);

                        if ('cart_items' in data.data) {
                            $.each(data.data.cart_items, function (index, value) {
                                $.cart.insert(value.id, value.name, value.sub_name, value.total_price);
                            });
                        } else {
                            $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);
                        }
                    }
                }else{
                    disableBtnsLoader(obj);
                    $.cart.errorHandler(data);
                }

                orders.removeClass('pending');
            },
            beforeSend : function () {
                if(configuration_forms.length){
                    configuration_forms.find('input').each(function () {
                        $(this).disabled(true);
                    });
                }

                $('.server-configurator .help-block').remove();
                $('.server-configurator .error').removeClass('error');
            },
            complete   : function () {
                if (typeof redirect != 'undefined') {
                    $.set_cookie('cart_item', redirect, '/', site_map.cart);
                } else {
                    disableBtnsLoader(obj);

                    if(configuration_forms.length){
                        configuration_forms.find('input').each(function () {
                            $(this).disabled(false);
                        });
                    }
                }
            }
        }, formId);

        $.ajax(immediate_order);

        orders.blur();
    }

    function place_immediate_order_small (obj, confirmed) {
        var info    = obj.closest('.product_info'),
            sku     = $('#siteAmountForm [type="radio"]:checked').val(),
            length  = $('#hostingLengthForm [type="radio"]:checked').val(),
            orders  = $('.order'),
            data;

        data = {
            length      : length,
            sku         : sku,
            _token      : $('[name="_token"]').val(),
            unique_id   : unique_page_identifier,
            options     : {}
        };

        var quantity;

        if (typeof info != 'undefined') {
            var quantity = info.find('.ssl_quantity_input');

            if (quantity.length) {

                data.quantity = parseInt(quantity.text());
            }
        }

        if(confirmed){
            data.confirmed = true;
        }

        var hostname = $('.configurator #hostname');

        if(hostname.length){
            data.user_attributes = {};
            data.user_attributes.hostname = (hostname.val()) ? hostname.val() : null;
        }

        var domain_name = $('.configurator #domain_name');

        if (domain_name.length) {
            if (!('user_attributes' in data))
                data.user_attributes = {};

            data.user_attributes.domain_name = (domain_name.val()) ? domain_name.val() : null;
        }

        activateBtnsLoader(obj);

        $.ajax({
            type        : 'POST',
            url         : site_map.cart + '/add',
            data        : data,
            timeout     : 30000,
            success     : function (data) {
                if (typeof quantity != 'undefined' && quantity.length)
                    quantity.val(1);

                if(data.success){
                    if (String(window.location).indexOf('configure') > -1) {
                        //Item added to cart - due to redirect add_to_cart event will be sent on next load
                        if (app_env != 'local' && 'remarketing_items' in data.data)
                            $.setAddToCartConfiguredCart(data.data.remarketing_items);
                    } else {
                        //Item added to cart - send add_to_cart event
                        if (app_env != 'local' && 'remarketing_items' in data.data)
                            $.sendAddToCartRemarketingEvent(data.data.remarketing_items);

                        $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);

                        obj.addClass('success').find('.submitText').text(COMMON_LANG.CART.IN_CART);

                        setTimeout(function () {
                            obj.removeClass('success').find('.submitText').text(((obj.hasClass('ssl_order')) ? COMMON_LANG.CART.ORDER_SSL : COMMON_LANG.CART.ORDER));
                        }, 3000);
                    }
                }else{
                    disableBtnsLoader(obj);
                    $.cart.errorHandler(data);
                }
                orders.removeClass('pending');
            },
            beforeSend  : function () {
                $('.server-configurator .help-block').remove();
                $('.server-configurator .error').removeClass('error');
            },
            error       : function (e) {
                globalErrorsHandler(e);
                disableBtnsLoader(obj);
            },
            complete    : function () {
                if (typeof redirect != 'undefined') {
                    $.set_cookie('cart_item', redirect, '/' ,site_map.cart);
                } else {
                    disableBtnsLoader(obj);
                }
            }
        });

        orders.blur();
    }

    function build_settings (info) {
        var settings = {};

        if(info.hasClass('ssl_details')){
            var additional_domains = $('#additional_domains'),
                additional_servers = $('#additional_servers');

            settings['additional_domains'] = (additional_domains) ? additional_domains.val() : 0;
            settings['servers'] = (additional_servers) ? additional_servers.val() : 0;
        }

        return ($.isEmptyObject(settings)) ? '' : settings;
    }

    function update_order (obj) {
        var info = obj.closest('.product_info'),
            checked_options,
            options = {},
            orders = $('.update.order, .update.server'),
            length = info.find('.length.active'),
            data;


        orders.addClass('pending');

        checked_options = $('input:checked');

        checked_options.each(function () {
            var obj = $(this),
                detail = obj.closest('li');

            if(detail.length){
                var option = detail.closest('ul'),
                    option_id = option.attr('data-option-id');

                if(typeof options[option_id] == 'undefined'){
                    options[option_id] = [];
                }

                options[option_id].push(detail.attr('data-option-detail-id'));
            }
        });

        data = {
            length: length.attr('data-length'),
            settings: build_settings(info),
            _token: $('[name="_token"]').val(),
            unique_id : unique_page_identifier,
            options : options
        };


        hostname = $('.configurator #hostname');

        if(hostname){
            data.user_attributes = {};
            data.user_attributes.hostname = (hostname.val()) ? hostname.val() : null;
        }

        domainNname = $('.configurator #domain_name');

        if(domainNname){
            data.user_attributes = {};
            data.user_attributes.domain_name = (domainNname.val()) ? domainNname.val() : null;
        }

        activateBtnsLoader(obj);

        $.ajax({
            type        : 'POST',
            url         : site_map.cart + '/edit/' + info.attr('data-cart-item-id'),
            data        : data,
            timeout     : 30000,
            success     : function (data) {
                if (data.success) {
                    redirect = info.attr('data-cart-item-id');

                    if (app_env != 'local' && 'remarketing_items' in data.data)
                        $.setUpdateConfiguredCart(data.data.remarketing_items);
                } else {
                    $.cart.errorHandler(data);
                }

                orders.removeClass('pending');
            },
            beforeSend  : function () {
                $('.server-configurator .help-block').remove();
                $('.server-configurator .error').removeClass('error');
            },
            error       : function (e) {
                globalErrorsHandler(e);
            },
            complete    : function () {
                if(typeof redirect != 'undefined')
                    $.set_cookie('cart_item', redirect, '/', site_map.cart);
                else
                    disableBtnsLoader(obj);
            }
        });

        orders.blur();
    }

    function activateBtnsLoader (button){
        if (button && button.length) {

            button.addClass('pending');

            button.find('.submitText').hide();
            button.find('.loading').show();
        }
    }

    function disableBtnsLoader (button){
        if (button && button.length) {
            button.removeClass('pending');

            button.find('.submitText').show();
            button.find('.loading').hide();
        }
    }

    function collectSetupFeesInSummary () {
        var setup_fees = 0;

        $('.summary .on-length-with-setup-fees').each(function () {
            var obj = $(this);

            setup_fees += parseFloat(obj.get_price('data-price-setup-fees').toFixed(2));
        });

        var setup_fee_vat = $('#setupFee .vat:not(.strikethrough .vat)'),
            final_fee;


        if (typeof setup_fee != 'undefined') {
            if (setup_fee.constructor == Object) {
                if ('discount' in setup_fee)
                    final_fee = parseFloat(setup_fee['discount'][$('.summary .duration .active').attr('data-length')]) + setup_fees;
                else if ('base' in setup_fee)
                    final_fee = parseFloat(setup_fee['base'][$('.summary .duration .active').attr('data-length')]) + setup_fees;
                else
                    final_fee = parseFloat(setup_fee[$('.summary .duration .active').attr('data-length')]) + setup_fees;
            } else {
                final_fee = parseFloat(setup_fee[$('.summary .duration .active').attr('data-length')]) + setup_fees;
            }
        } else {
            final_fee = setup_fees;
        }


        setup_fee_vat.update_vat('on-length', [final_fee, final_fee], 0);
    }
});