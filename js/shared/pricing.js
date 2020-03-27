$(document).ready(function () {

    var vatControlsModal = $('#vatControlsModal'),
        modalObserverTimer, sidrObserverTimer;

    $.observers.register('vatControlsModal', function (mutations) {
        try {
            clearTimeout(modalObserverTimer);
        } catch (e) {}

        modalObserverTimer = setTimeout(function () {
            if (! vatControlsModal.hasClass('open')) {
                fixModalVatView();
            }
        }, 250);
    });

    $.observers.register('sidVatContainer', function (mutations) {
        try {
            clearTimeout(sidrObserverTimer);
        } catch (e) {}

        sidrObserverTimer = setTimeout(function () {
            if (! $('#sidVatContainer .sidClose').hasClass('active')) {
                fixSidrVatView();
            }
        }, 250);
    });

    $.observers.observe('vatControlsModal', vatControlsModal, {attributes : true});


    var vat_templates       = {
            'price'                                 : {
                'template'      : '<span class="vat" data-price="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price'],
                'class'         : 'vat',
                'alt_class'     : ['vat setup-fee'],
                'computation'   : {
                    'total':'init'
                }
            },
            'price-small-decimals'                  : {
                'template'      : '<span class="vat small-decimals" data-price="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price'],
                'class'         : 'vat small-decimals'
            },
            'price-small-follow-up'                 : {
                'template'      : '<span class="vat small-follow-up" data-price="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price'],
                'class'         : 'vat small-follow-up'
            },
            'price-total-sup'                       : {
                'template'      : '<span class="vat sup" data-price="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price'],
                'class'         : 'vat sup',
                'alt_class'     : ['vat sup price']
            },
            'price-total'                           : {
                'template'      : '<span class="vat price-total" data-price-total="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price-total'],
                'class'         : 'vat price-total'
            },
            'price-total-small-decimals'            : {
                'template'      : '<span class="vat price-total small-decimals" data-price-total="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price-total'],
                'class'         : 'vat price-total small-decimals'
            },
            'price-total-small-follow-up'           : {
                'template'      : '<span class="vat price-total small-follow-up" data-price-total="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price-total'],
                'class'         : 'vat price-total small-follow-up'
            },
            'on-length'                             : {
                'template'      : '<span class="vat on-length" data-price-length-total="##total##" data-price-length-unit="##length##">##final##</span>&euro;',
                'multi_pricing' : true,
                'update'        : ['data-price-length-total','data-price-length-unit'],
                'class'         : 'vat on-length',
                'computation'   : {
                    'final':'length'
                }
            },
            'on-length-with-setup-fees'             : {
                'template'      : '<span class="vat on-length-with-setup-fees" data-price-setup-fees="##setup_fee##" data-price-length-total="##total##" data-price-length-unit="##length##">##final##</span>&euro;',
                'multi_pricing' : true,
                'update'        : ['data-price-length-total','data-price-length-unit'],
                'class'         : 'vat on-length'
            },
            'regular-price'                         : {
                'template'      : '<span class="vat regular-price" data-price="##init##">##total##</span>&euro;',
                'multi_pricing' : false,
                'update'        : ['data-price'],
                'class'         : 'vat regular-price'
            },
            'tier'                                  : {
                'template'      : '',
                'multi_pricing' : false,
                'update'        : ['data-price'],
                'class'         : 'vat tier'
            },
            'relative'                              : {
                'template'          : '',
                'multi_pricing'     : false,
                'update'            : ['data-target'],
                'class'             : 'vat relative',
                'alt_class'         : ['vat relative checkout_order_total']
            },
            'calculation-component'                 : {
                'template'          : '',
                'multi_pricing'     : false,
                'update'            : ['data-component-price'],
                'class'             : 'vat calculation-component',
                'no-display'        : true
            },
            'calculation-component-with-length'     : {
                'template'          : '',
                'multi_pricing'     : true,
                'update'            : ['data-component-price', 'data-component-price-unit'],
                'class'             : 'vat calculation-component-with-length',
                'no-display'        : true
            }
        },
        small_decimals      = '<small>,##dec##</small>',
        small_follow_up     = '<small>##dec## &euro; / ' + COMMON_LANG.LENGTH.YEAR + '</small>',
        vat_quote;

    try {
        if(vat['show'])
            vat_quote = vat['quote'];
        else
            vat_quote = 1;

    } catch (e) {
        vat_quote = 1;
    }

    $.fn.extend({
        update_vat          : function (template, src, text, attr, price_src) {
            var obj = ($(this).hasClass('vat')) ? $(this) : $(this).find('.vat');

            if(text != 'like'){
                attr = undefined;
                price_src = undefined;
            }

            if(!(template in vat_templates)){
                throw 'Unknown template';
            }

            if(src instanceof $) {
                if (!vat_templates[template].multi_pricing) {
                    //TODO: Might need to add alternative classes control.
                    if (text == 'like') {
                        $.each(src[0].attributes, function (key, value) {
                            if (value.name.indexOf(attr) > -1) {
                                price = parseFloat(src.attr(value.name));
                                return false;
                            }
                        });
                    }else if (src.attr('class') == vat_templates[template].class || ( 'alt_class' in vat_templates[template] && $.inArray(src.attr('class'), vat_templates[template].alt_class))) {
                        var price = parseFloat(src.attr(vat_templates[template].update[0]));
                    }

                    if (! ('no-display' in vat_templates[template]))
                        obj.attr(vat_templates[template].update[0], price).html(create_vatted_price(price, check_prices_follow_ups(obj), obj.hasClass('noDec')));
                    else
                        obj.attr(vat_templates[template].update[0], price)

                } else {
                    /**
                     * Multi pricing templates, no variations found.
                     */
                    if (text == 'like') {
                        if(typeof attr == 'string')
                            throw 'Asset must be array not a string';

                        $.each(vat_templates[template].update, function (key, value) {
                            obj.attr(value, src.attr(attr[key]));
                        });

                        if (! ('no-display' in vat_templates[template]))
                            obj.html(create_vatted_price(src.attr(price_src), check_prices_follow_ups(obj), obj.hasClass('noDec')));
                    } else {
                        $.each(vat_templates[template].update, function (key, value) {
                            obj.attr(value, src.attr(value));
                        });

                        if (! ('no-display' in vat_templates[template]))
                            obj.html(create_vatted_price(src.attr(text), check_prices_follow_ups(obj), obj.hasClass('noDec'))); //This template does not support variations.
                    }
                }
            }else if($.isArray(src)){
                if(vat_templates[template].update.length > src.length){
                    throw 'Input does not match needs.'
                }

                $.each(vat_templates[template].update, function (key, value) {
                    obj.attr(value, src[key]);
                });

                obj.html(create_vatted_price(src[text], check_prices_follow_ups(obj), obj.hasClass('noDec')));
            }

            return obj;
        },
        get_price           : function (attr) {
            var vat = ($(this).hasClass('vat')) ? $(this) : $(this).find('.vat'),
                vat_class = vat.attr('class');

            if(vat.length){
                if (typeof attr == 'undefined') {
                    var price = 0;

                    if(vat.attr('class') == 'vat'){
                        price = vat.attr('data-price');
                    }else{
                        vat_class = vat_class.trim().replace(/[ ]+/,' ');

                        $.each(vat_templates, function (key, value) {
                            if (vat_class == value.class || ('alt_class' in value && value.alt_class.indexOf(vat_class) > -1)) {
                                if (value.update.length == 1) {
                                    price = vat.attr(value.update[0]);
                                } else {
                                    $.each(value.update, function (index, attr) {
                                        if (attr.indexOf('total') > -1) {
                                            price = vat.attr(attr);
                                            return false;
                                        }
                                    });
                                }

                                return false
                            }
                        });
                    }
                } else {
                    if(typeof attr != 'string') {
                        for (i = 0; i < attr.length; i++) {
                            price = vat.attr(attr[i]);

                            if(typeof price != 'undefined')
                                break;
                        }
                    } else {
                        price = vat.attr(attr);
                    }
                }

                return ($.isNumeric(price)) ? parseFloat(price) : 0;
            }
        },
        get_vated_price     : function (properties) {
            if(typeof properties == 'boolean'){
                return create_vatted_price($(this).get_price(), check_prices_follow_ups($(this)), $(this).hasClass('noDec'), properties);
            }else if(typeof properties == 'object'){
                return create_vatted_price($(this).get_price(properties.attr), check_prices_follow_ups($(this)), $(this).hasClass('noDec'), properties.get_number);
            }else{
                return create_vatted_price($(this).get_price(properties), check_prices_follow_ups($(this)), $(this).hasClass('noDec'));
            }
        },
        get_length_duration : function (div_class) {
            var length = ($(this).hasClass('length')) ? $(this) : $(this).closest('.length');

            if(typeof div_class != 'undefined'){
                return length.find('a').html().replace(/\s{2,}/g,' ').replace(new RegExp('<div.+' + div_class + '(.+|\n)+\/div>','g'),'').trim();
            }else{
                return length.find('a').html().replace(/\s{2,}/g,' ').replace(/<div.+price-per-length(.+|\n)+\/div>/g,'').trim();
            }
        },
        insert_vat          : function (template, init_price, total_price, misc_prices, overwrite) {
            var obj = $(this);

            if (typeof overwrite != 'undefined' && overwrite === true)
                obj.empty();

            var result = $.insert_vat(template, init_price, total_price, misc_prices);

            obj.append(result);

            return obj;
        },
        imperial_to_metric  : function (price) {
            $(this).text(imperial_to_metric(price));
            return this;
        },
        implementPriceTemplate : function (template, prices, interval) {
            var obj = $(this);

            obj.append(implementPriceTemplate (template, prices, interval));

            return obj;
        }, refreshVatPrices: function () {
            var obj = $(this);
            vat_on_span();
            return obj
        }
    });
    $.extend({
        get_vated_price : function(price){
            return create_vatted_price(parseFloat(price)); //This cant create a formatted price since it uses only the price.
        },
        insert_vat : function (template, init_price, total_price, misc_prices, masks) {
            if (!(template in vat_templates))
                throw 'Unknown template';

            if (typeof init_price != 'number')
                throw 'Invalid or Undefined initial price';

            var new_template;

            if (!vat_templates[template].multi_pricing)
                new_template = vat_templates[template]['template'].replace('##init##', init_price).replace('##total##',create_vatted_price(parseFloat(init_price), check_prices_follow_ups(vat_templates[template]['template']), vat_templates[template]['template'].indexOf('nodec') > -1));
            else
                new_template = vat_templates[template]['template'].replace('##length##', init_price).replace('##total##',parseFloat(total_price)).replace('##final##',create_vatted_price(parseFloat(init_price), false, vat_templates[template]['template'].indexOf('nodec') > -1));

            if (typeof misc_prices != 'undefined') {
                $.each(misc_prices, function (key, value) {
                    new_template = new_template.replace(new RegExp('##' + key + '##'), value);
                })
            }

            if (typeof masks != 'undefined') {
                for (var i in masks) {
                    if (masks.hasOwnProperty(i)) {
                        new_template = new_template.replace(masks[i].mask, masks[i].replacement);
                    }
                }
            }

            return new_template;
        },
        imperial_to_metric : function (price) {
            return imperial_to_metric(price);
        },
        metric_to_imperial : function (price) {
            return metric_to_imperial(price);
        },
        get_price_vat : function (price) {
            return imperial_to_metric((price * (vat['quote'] - 1)).toFixed(2));
        },
        create_vatted_price : function (price, follow_up, no_dec, get_number) {
            return create_vatted_price(price, follow_up, no_dec, get_number);
        },
        implementPriceTemplate : function (template, prices, interval) {
            return implementPriceTemplate (template, prices, interval);
        },
        convertDifToPercentage : function (prices, toNumber) {
            return convertDifToPercentage(prices, toNumber);
        },
        vatApplier  : vatApplier,
        fixModalVatView: fixModalVatView,
        fixSidrVatView: fixSidrVatView,
        vat : {
            initiate : function (){
                try {
                    if(!!vat)
                        (vat['show']) ? enable_vat() : disable_vat();
                } catch (e) {}

                $('#countrySelector, #countrySelectorSid').val('');
                sortVatCountries('optionCountries','countrySelector','optionOther','optionSeparator');
            },
            sort_vat_countries : function (option, container, others, separator) {
                sortVatCountries(option, container, others, separator);
            }
        }
    });

    $('[name="Vat"]').on('change',function(){
        percentage = $('#countrySelected .sid-percentage, .percentage');

        if ($('[name="Vat"]:checked').val() == 'no-Vat') {
            $('#sid-no-Vat').prop({'checked': 'true'});
            $('#countriesContainer').slideUp();

            if (typeof $keepVatNoticesVisible === 'undefined' || $keepVatNoticesVisible === false) {
                $('.billing-profile-vat').slideUp();
            } else {
                $keepVatNoticesVisible = false;
            }

            $('.select-vat').hide();
            percentage.text('');
        } else {
            percentage.html('&lpar; ' + (vat['quote']).toFixed(2).replace('1.','') + '&percnt; &rpar;');
            $('#sid-with-Vat').prop({'checked': 'true'});
            $('#countriesContainer').slideDown();
            $('.billing-profile-vat').slideDown();
            $('.select-vat').show();
        }

        $('#submitVat').show();
    });

    $(document)
        .on('vat:changed', function () {
            if(vat['show'])
                vat_quote = vat['quote'];
            else
                vat_quote = 1;
        })
        .on('change','#countrySelector, #countrySelectorSid',function(){
            var obj = $(this);
            // change_vat_country(obj);

            if (obj.attr('id') == 'countrySelector')
                $('#submitVat').show();
            else
                $('#submitVatSidr').show();
        })
        .on('change','[name="sid-Vat"]',function(){
            sideNavVatTriggerHandler();
        })
        .on('click', '.vatControlsTrigger, #footerVatControls', function (e) {

            e.preventDefault();

            if ($.getSizeClassification('large_up'))
                $('#vatControlsModal').modal_open();
            else {
                setTimeout(function () {
                    $.sidr('open', 'backend-side-nav');
                    $('#sidVatTrigger').trigger('click');

                    if (vat['show'])
                        $('#sidVatContainer #countriesContainer').show().find('.countries-wrapper').show();
                },100);
            }
        })
        .on('click', '#submitVat, #submitVatSidr', function (e) {

            e.preventDefault();

            var obj = $(this),
                checkedVat = $('[name="Vat"]:visible:checked, [name="sid-Vat"]:visible:checked');

            obj.find('.submitText').hide();
            obj.find('.loading').show(0);

            setTimeout(function () {

                if (checkedVat.val() == 'with-vat' || checkedVat.val() == 'sid-with-Vat') {
                    vat['show'] = true;
                    // Andreas 20/06/2019
                    $('.shared-hosting-plans .vatControlsTrigger').text(COMMON_LANG.VAT.DISCLAIMER.VAT_ON_2);
                    // Andreas end

                    var countrySelector = $('#countrySelector:visible, #countrySelectorSid:visible');

                    if (countrySelector.find('option:selected:not(:disabled)').length) {
                        change_vat_country(countrySelector, function () {
                            if ($.getSizeClassification('large_up')) {
                                $('#vatControlsModal').modal_close();
                                // Andreas 21/06/2019
                                $(window).trigger('resize').trigger('scroll');
                                // Andreas end
                            } else {
                                $.sidr('close', 'backend-side-nav');
                                $('#sidVatTrigger .sidClose').trigger('click')
                            }

                            fixModalVatView();
                            fixSidrVatView();
                        });
                    } else {
                        vatApplier(true, function () {
                            if ($.getSizeClassification('large_up')) {
                                $('#vatControlsModal').modal_close();
                            // Andreas 21/06/2019
                            $(window).trigger('resize').trigger('scroll');
                            // Andreas end
                        } else {
                                $.sidr('close', 'backend-side-nav');
                                $('#sidVatTrigger .sidClose').trigger('click')
                            }

                            fixModalVatView();
                            fixSidrVatView();
                        });
                    }
                } else {
                    vat['show'] = false;

                    // Andreas 20/06/2019
                    $('.shared-hosting-plans .vatControlsTrigger').text(COMMON_LANG.VAT.DISCLAIMER.VAT_OFF_2);
                    // Andreas end

                    vatApplier(true, function () {
                        if ($.getSizeClassification('large_up')) {
                            $('#vatControlsModal').modal_close();
                        // Andreas 21/06/2019
                        $(window).trigger('resize').trigger('scroll');
                        // Andreas end
                        } else {
                            $.sidr('close', 'backend-side-nav');
                            $('#sidVatTrigger .sidClose').trigger('click')
                        }

                        fixModalVatView();
                        fixSidrVatView();
                    });
                }
            }, 500);

            obj.blur();
        })
        .on('click', '#cancelVatChanges, #cancelVatChangesSidr', function (e) {

            e.preventDefault();

            if ($.getSizeClassification('large_up')) {
                $('#vatControlsModal').modal_close();
                // Andreas 21/06/2019
                $(window).trigger('resize').trigger('scroll');
                // Andreas end
            } else {
                $.sidr('close', 'backend-side-nav');
                $('#sidVatTrigger .sidClose').trigger('click')
            }

            $(this).blur();
        });

        // Andreas 04/07/2019
        $("#vatControlsModal .close-reveal-mymodal").click(function() {
            $(window).trigger('resize').trigger('scroll');
        });
        // Andreas end

    function sideNavVatTriggerHandler () {
        var container = $('#countriesContainer');

        if($('[name="sid-Vat"]:checked').val() == 'sid-no-Vat'){
            $('#toolbox-vat #no_Vat').prop({'checked':true});
            $('.billing-profile-vat').slideUp();
            $('.select-vat').hide();

            container.slideUp();
        }else{
            $('#toolbox-vat #with_Vat').prop({'checked':true});
            $('.billing-profile-vat').slideDown();
            $('.select-vat').show();

            $('#countriesContainer .countries-wrapper').show();
            container.slideDown();
        }

        $('#submitVatSidr').show();
    }
    /**
     * On load set vat "ON".
     */
    function enable_vat () {
        $('#no_Vat').prop({'checked': 'false'});
        $('#with_Vat').prop({'checked': 'true'});
        $('#sid-with-Vat').prop({'checked': 'true'});
        $('.vatControl.add').addClass('active');
        $('.select-vat, .billing-profile-vat').removeClass('hide');
        // Andreas 20/06/2019
        $('.shared-hosting-plans .vatControlsTrigger').text(COMMON_LANG.VAT.DISCLAIMER.VAT_ON_2);
        // Andreas end
    }

    /**
     * On load set vat "OFF"
     */
    function disable_vat () {
        $('#with_Vat').prop({'checked': 'false'});
        $('#no_Vat').prop({'checked': 'true'});
        $('#sid-no-Vat').prop({'checked': 'true'});
        $('.vatControl.remove').addClass('active');
        $('.select-vat, .billing-profile-vat').addClass('hide');
        $('#countriesContainer').css({'display': 'none'});
        // Andreas 20/06/2019
        $('.shared-hosting-plans .vatControlsTrigger').text(COMMON_LANG.VAT.DISCLAIMER.VAT_OFF_2);
        // Andreas end
    }

    function vatApplier(setCookie, callback) {
        if(vat['show'])
            vat_quote = vat['quote'];
        else
            vat_quote = 1;

        vat_on_span();
        vat_on_paragraphs();
        vat_on_domains_pricelist();

        $(document).trigger('vat:changed'); //work in progress

        if(typeof setCookie == 'undefined' || setCookie === true) {
            $.cookie_api('showVat', ((vat['show']) ? 'yes' : 'no'), '', $('#VatForm [name="_token"]').val());
        }

        if(vat.show)
            text = COMMON_LANG.VAT.DISCLAIMER.VAT_ON.replace('##VAT##',(vat['quote']).toFixed(2).toString().split('.')[1]);
        else
            text = COMMON_LANG.VAT.DISCLAIMER.VAT_OFF;


        $('.vat-disclaimer').text(text);

        if (typeof callback == 'function') {
            callback();
        }
    }

    /**
     * Apply vat on existing spans
     */
    function vat_on_span () {
        $('span.vat:not(.related):not(.relative)').each(function(){
            var obj = $(this);

            if(obj.hasClass('on-length')){
                if(obj.closest('.length, .configurator, .summary').length){
                    var price = obj.get_price('data-price-length-unit');
                }else{
                    var price = obj.get_price();
                }
            }else{
                var price = obj.get_price();
            }


            if(price == 0)
                return ;

            $(this).html(create_vatted_price(price, check_prices_follow_ups(obj), obj.hasClass('noDec')));
        });

        $('span.vat.related').each(function () {
            var obj             = $(this),
                percent         = $('.vat_percent[data-relation="' + obj.attr('data-relation') + '"]'),
                relative_from   = $('[data-relation="' + obj.attr('data-relation') + '"][data-role="from"]'),
                relative_to     = $('[data-relation="' + obj.attr('data-relation') + '"][data-role="to"]'),
                priceFrom       = relative_from.get_price('data-target'),
                priceTo         = (priceFrom * vat_quote).toFixed(2);

            obj.text($.imperial_to_metric((priceFrom * parseFloat((vat_quote - 1))).toFixed(2)));
            relative_to.text($.imperial_to_metric(priceTo));

            if(percent.length){
                var vat_percent = vat_quote * 100 - 100;
                percent.text(vat_percent);
            }
        });
    }

    /**
     * Apply vat on existing paragraphs
     */
    function vat_on_paragraphs () {
        $('p.vat:not(:has(.vat-disclaimer))').each(function(){
            startingPrice = parseFloat($(this).attr('data-price'));
            if(! isNaN(startingPrice)) {
                text = $(this).text();
                match = text.match(/([0-9]{1,3}[,.])+[0-9]+/g);
                text = text.split(match[0]);

                if (!vat['show']) {
                    startingPrice = startingPrice * vat['quote'];
                }

                price = (startingPrice).toFixed(2).split('.');
                price[0] = digitNumberFormat(price[0]);
                dec = ',' + price[1];

                if ($(this).hasClass('noDec') && price[1] < 1) {
                    dec = '';
                }

                price = price[0] + dec;

                $(this).text(text[0] + price + text[1]);
            }
        });
    }

    /**
     * Calculate the data price fina attribute for the domains with discount.
     */
    function vat_on_domains_pricelist () {
        if($('table.domains').length > 0){
            $('.products').each(function(){
                if(vat['show'])
                    finalPrice = $(this).find('.vat:last').attr('data-price')*vat['quote'];
                else
                    finalPrice = $(this).find('.vat:last').attr('data-price');

                $(this).attr({'data-price-final': finalPrice});
            });
        }
    }

    /**
     * Short vat countries to be displayed the way we decided.
     * @param option
     * @param container
     * @param others
     * @param separator
     */
    function sortVatCountries(option, container, others, separator){
        options = $('.'+option);
        options.sort(function(a, b) {
            var A = $(a).data('name');
            var B = $(b).data('name');
            A = A.toUpperCase();
            B = B.toUpperCase();
            if(A < B) {
                return (-1);
            }
            if(A > B) {
                return (1);
            }
            return 0;
        });
        countrieSelect = $('#'+container);
        options.each(function(){
            countrieSelect.append($(this));
        });
        $('.'+option+':last').after($('.'+others));
        $('.'+option+':last').after($('.'+separator));
    }

    function change_vat_country (obj, callback) {
        country = obj.find('option:selected');

        img = $('.flag:not(.ButtonFilters)');
        span = $('#countrySelected .sid-country, .country:not(.ButtonFilters)');
        percentage = $('#countrySelected .sid-percentage, .percentage');

        if (country.val() != 'OTHER') {
            src = imgsrc + '/flags/' + country.val().toLowerCase()+'.png';
            img.attr({'class': 'flag ' + country.val().toLowerCase()});

            vat['show'] = true;
            vat['quote'] = parseFloat(country.attr('data-vat'));

            quote = vat['quote'].toString().split('.');
            quote = parseInt(quote[1]);

            if (quote < 10)
                quote *= 10;

            percentage.html('&lpar; ' + quote + '&percnt; &rpar;');
        } else {

            src = imgsrc + '/flags/allothers.png';
            img.attr({'class': 'flag allothers'});

            vat['show'] = false;
            percentage.text('');
        }
        vat['country'] = country.val();

        vatApplier();

        span.text(country.attr('data-name'));
        img.attr({
            'alt': country.attr('data-name'),
            'title': country.attr('data-name')
        });

        $.cookie_api('countryVat', country.val(), '', token);
        $('#countrySelector, #countrySelectorSid').val('');

        if (typeof callback == 'function')
            callback();
    }

    function create_vatted_price (price, follow_up, no_dec, get_number) {
        if(typeof price == 'string')
            price = reconstruct_string_price(price);

        price = (price * vat_quote).toFixed(2);

        if(get_number)
            return price;

        if(follow_up){
            var temp = imperial_to_metric (price, true);

            if(follow_up === 'small-decimals'){
                price = temp[0] + small_decimals.replace('##dec##',temp[1]);
            }else if(follow_up === 'small-follow-ups'){
                price = temp[0] + small_follow_up.replace('##dec##',temp[1]);
            }else if(follow_up === 'sup'){
                price = temp[0] + '<sup>,' + temp[1] + '</sup>';
            }
        }else{
            price = imperial_to_metric(price);
        }

        return price;
    }

    function imperial_to_metric (price, array, no_dec) {
        price = (parseFloat(price)).toFixed(2).toString().split('.');

        if(no_dec){
            price[1] = '';
        }else{
            if(typeof price[1] == 'undefined'){
                price[1] = '00';
            }else if(price[1].length == 1){
                price[1] = price[1] + '0';
            }
        }

        price[0] = separate_by_3(price[0]);

        if(array){
            return price;
        }

        price = price[0] + ',' + price[1];

        return price;
    }

    function metric_to_imperial (value){
        return parseFloat(value.replace('.','').replace(',','.'));
    }

    function separate_by_3 (number, delimiter){
        var temp = (number).toString().split("").reverse().join('').match(/\d{1,3}/g);

        if(typeof delimiter == 'undefined')
            delimiter = '.';

        for (var i = temp.length - 1; i >= 0; i--) {
            temp[i] = temp[i].split("").reverse().join('');
        }

        return temp.reverse().join(delimiter)
    }

    function check_prices_follow_ups (obj) {
        if (! (obj instanceof $))
            return false;

        if (obj.hasClass('small-decimals') || (typeof obj == 'string' && obj.indexOf('small-decimals') > -1)) {
            return 'small-decimals';
        } else if (obj.hasClass('small-follow-ups') || (typeof obj == 'string' && obj.indexOf('small-follow-ups') > -1)) {
            return 'small-follow-ups';
        } else if (obj.hasClass('sup') || (typeof obj == 'string' && obj.indexOf('sup') > -1)) {
            return 'sup';
        }

        return false;
    }

    function reconstruct_string_price (price){
        if(typeof price == 'string'){
            var dots = price.match(/[.]/g);
            var commas = price.match(/[,]/g);

            if(dots != null && (commas != null || dots.length > 1)){
                return parseFloat(price.replace(/[.]/g,'').replace(',','.'));
            }else if(commas == null && (dots == null ||dots.length <= 1)){
                return parseFloat(price);
            }
        }

        return price;
    }

    function detect_classes (classA, classB) {
        var match_classes = false;

        $.each(classB.split(' '), function (key, value) {
            if(classA.indexOf(value) > -1){
                match_classes = true;
            }else{
                match_classes = false;
                return false;
            }
        });

        return match_classes;
    }

    function implementPriceTemplate (template, prices, interval) {
        if (typeof template != 'string' || ! (template in vat_templates))
            throw 'Invalid template';

        if (prices.constructor != Object || Object.keys(prices).length < 1)
            throw 'Invalid prices';

        if (! ('computation' in vat_templates[template]))
            throw 'Computation is missing';

        if (vat_templates[template].constructor != Object)
            throw 'Invalid computation property';


        var errorFound  = null,
            temp        = vat_templates[template].template;

        for (i in prices) {
            if (prices.hasOwnProperty(i)) {
                if ((typeof prices[i] != 'string' && typeof prices[i] != 'number') || (typeof prices[i] == 'string' && isNaN(parseFloat(prices[i])))) {
                    errorFound = i + ' is invalid, price got ' + prices[i];
                    break;
                }

                temp = temp.replace(new RegExp('##' + i + '##', 'g'), prices[i])
            }
        }

        if (errorFound != null)
            throw errorFound;

        var computation = vat_templates[template].computation;

        for (i in computation) {
            if (computation.hasOwnProperty(i)) {
                if (typeof computation[i] != 'string') {
                    errorFound = computation[i] + ' not applicable';
                    break;
                }

                if (! (computation[i] in prices)) {
                    errorFound = computation[i] + ' missing from prices';
                    break;
                }

                temp = temp.replace(new RegExp('##' + i + '##', 'g'), create_vatted_price(parseFloat(prices[computation[i]])));
            }
        }

        if (errorFound != null)
            throw errorFound;

        if (typeof interval == 'string')
            interval = parseInt(interval);


        if (typeof interval != 'undefined' && typeof interval != 'number') {
            throw 'Invalid interval';
        }

        if (typeof interval == 'number') {
            temp += '/' + $.translate('length.' + ((interval < 12) ? 'month' : 'year'), 1);
        }

        return temp;
    }

    function convertDifToPercentage (prices, toNumber) {
        var dif = null;

        $.each(prices, function (index, value) {
            if (dif == null)
                dif = value;
            else
                dif -= value;
        });

        var percentage   = dif/Math.max.apply(null, prices);

        if (typeof toNumber != 'undefined' && toNumber === true)
            return (percentage * 100).toFixed(2);

        return percentage.toFixed(2);
    }

    function fixModalVatView () {
        $('[name="Vat"]').prop('checked', false);

        if (vat.show) {
            $('#with_Vat').prop('checked', true).trigger('change');
            $('#countrySelector:visible, #countrySelectorSid:visible').val('');
        } else {
            $('#no_Vat').prop('checked', true).trigger('change');
        }

        var submitVat = $('#submitVat').hide();
        submitVat.find('.submitText').show();
        submitVat.find('.loading').hide();
    }

    function fixSidrVatView () {
        $('[name="sid-with-Vat"]').prop('checked', false);
        $('#countrySelector:visible, #countrySelectorSid:visible').val('');

        if (vat.show) {
            $('#sid-with-Vat').prop('checked', true);
            $('#sidVatContainer #countriesContainer').show().find('.countries-wrapper').show();
        } else {
            $('#sid-no-Vat').prop('checked', true);
            $('#sidVatContainer #countriesContainer').hide().find('.countries-wrapper').hide();
        }

        var submitVatSidr = $('#submitVatSidr').hide();
        submitVatSidr.find('.submitText').show();
        submitVatSidr.find('.loading').hide();
    }
});


$(window).on('load', function () {
    if (vat.country != 'OTHER') {
        try {
            var testVat = $.grep(countries, function (a) {
                return a.iso_2 == vat.country;
            });

            if (testVat.length < 1) {
                var grCountry = $.grep(countries, function (a) {
                    return a.iso_2 == 'GR';
                })[0];

                vat.show = false,
                    vat.country = 'GR';
                vat.quote = grCountry.vat_rate;

                var span = $('#countrySelected .sid-country, .country:not(.ButtonFilters)'),
                    percentage = $('#countrySelected .sid-percentage, .percentage'),
                    img = $('.flag:not(.ButtonFilters)');

                span.text(grCountry.name);
                img.attr({
                    'alt': grCountry.name,
                    'title': grCountry.name,
                    'src': imgsrc + '/flags/gr.png',
                    'class': 'flag gr'
                });

                percentage.html('&lpar; ' + vat.quote + '&percnt; &rpar;');

                $.vatApplier();
                $.fixModalVatView();
                $.fixSidrVatView();

                $.cookie_api('showVat', 'no', '', $('[name="_token"]').val());
                $.cookie_api('countryVat', 'GR', '', token);
            }
        } catch (e) {}
    }

    var sidclose = $('#sidVatContainer .sidClose'),
        sidcloseInterval;

    if (sidclose.length)
        $.observers.observe('sidVatContainer', sidclose, {attributes : true});
    else {
        sidcloseInterval = setInterval(function () {
            sidclose = $('#sidVatContainer .sidClose');

            if (sidclose.length) {
                $.observers.observe('sidVatContainer', sidclose, {attributes : true});
                clearInterval(sidcloseInterval);
            }
        }, 100);
    }
});