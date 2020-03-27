$(document).ready(function () {
    var filtersLists        = $('.filters-dropdown'),
        items               = $('.ssl-list .item:not(.header)'),
        filtersContainer    = $('#sslFiltersContainers'),
        searchByNameTimer   = null,
        stickyFilterTimers  = null,
        custom_nav_exists   = $('#custom-nav').length,
        navWrapper          = $('#wrapper-nav [href="#ssl-list-products"]');

    if (filtersContainer.length) {
        var filtersOffsetTop = filtersContainer.offset().top - 2;
        //
        // console.log(navWrapper.height());
        // console.log();

        if (navWrapper.length)
            filtersOffsetTop -= $('#wrapper-nav').height();
        // filtersOffsetTop -= (navWrapper.height() * 5);
        // filtersOffsetTop -= navWrapper.height() + 50;
    }


    var modalPriceTemp = '<li>' +
        '<label for="##id##">' +
        '<input id="##id##" type="radio" name="length" value="##value##">' +
        '<span>##lengthLabel## στα ##price##</span>' +
        '<div class="prices show-for-medium-up">' +
        '<span class="initial">' + $.translate('ssl.order_ssl_modal.initial') + ': <s class="strikethrough grey-version">##initialPrice##</s></span>' +
        '<span class="discount">' + $.translate('ssl.order_ssl_modal.discount') + ': ##discount##</span>' +
        '<span class="final">##finalPrice##</span>' +
        '</div>' +
        '</label>' +
        '</li>';

    $('.item').css('display','block');

    $('.mobileFilters').apply_chosen('');

    $('.apply-filters').on('click', function (e) {
        e.preventDefault();

        var input   = $('#mobileResultsSearch'),
            search  = input.val();

        if (search != '') {
            $('#searchName').val(search).change();
            $('.mobileFilters').chosen_update('');
        } else {
            input.val('');
            $('#searchName').val('');

            $('.filters-dropdown [type="checkbox"]').attr('checked', false);

            $('.mobileFilters option:selected').each(function () {
                $('.filters-dropdown [type="checkbox"][name="' + $(this).attr('name') + '"]').click();
            });
        }

        $(this).closest('.cd-panel').removeClass('is-visible');
    });

    $('[data-single-selection] input').on('change', function () {
        var obj         = $(this),
            container   = obj.closest('ul');

        container.find('input:not(#' + obj.attr('id') + ')').attr('checked', false)
    });

    filtersLists.on('change', function () {
        if (typeof filterTimeout != 'undefined')
            clearTimeout(filterTimeout);

        filterTimeout = setTimeout(function () {
            $('#searchName, #mobileResultsSearch').val('');

            items = $('.ssl-list .item:not(.header)');
            items.show();

            items.filter('.visible:last').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            items.filter('.filtered-out:last').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');

            items.removeClass('visible');

            var filteredItemsShow = items,
                filteredItemsHide = items;

            filtersLists.each(function () {
                var list = $(this),
                    active_filters = list.find('input:checked');

                if (active_filters.length) {
                    var operator = list.attr('data-operator');

                    if (typeof operator == 'undefined') {
                        active_filters.each(function () {
                            var filter = $(this);

                            filteredItemsShow = filteredItemsShow.filter('[data-' + list.attr('data-key') + '*="' + filter.val() + '"]');
                        });
                    } else {
                        var currentFilter = '';

                        active_filters.each(function () {
                            var filter = $(this);

                            if (currentFilter != '')
                                currentFilter += ',';

                            currentFilter += '[data-' + list.attr('data-key') + '*="' + filter.val() + '"]';
                        });

                        filteredItemsShow = filteredItemsShow.filter(currentFilter);
                    }
                }
            });

            filteredItemsShow.addClass('visible');
            filteredItemsHide = $('.ssl-list .item:not(.header):not(.visible)');

            var lastFilteredOut = filteredItemsShow.filter('.filtered-out:last');

            items.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');

            if(lastFilteredOut.length) {
                if (filteredItemsHide.length) {
                    lastFilteredOut.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                        filteredItemsHide.filter(':last').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                            lastFilteredOut.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                            filteredItemsHide.filter(':last').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                        });

                        filteredItemsHide.addClass('filtered-out');
                    });
                }

                filteredItemsShow.filter('.visible').removeClass('filtered-out');
            } else {
                filteredItemsHide.addClass('filtered-out');
            }

            if ($.getSizeClassification('medium_down'))
                filteredItemsHide.hide();

            $('#visibleCount').text(filteredItemsShow.length);

            checkIfItemsVisible();

            $(window).scrollTop(filtersOffsetTop + filtersContainer.height());
        }, 400);
    });

    $('#searchName')
        .on('input', function () {
            var obj = $(this);

            if (searchByNameTimer != null)
                clearTimeout(searchByNameTimer);

            searchByNameTimer = setTimeout(function () {
                searchByName(obj);
                searchByNameTimer = null;
            }, 250)
        })
        .on('change', function () {
            searchByName($(this));
        });

    $('.cd-panel-close').on('click', function (e) {
        $(this).closest('.cd-panel').removeClass('is-visible');
    });

    $('.custom-close-modal').on('click', function (e) {
        e.preventDefault();

        closeSslOrderModal();
    });

    $('#ssl_order_form').on('change', function () {
        var form                = $(this),
            length              = form.find('[name="length"]:checked'),
            price               = length.closest('label').find('.vat').get_price(),
            domains             = $('#additionalDomains'),
            domainsTotal        = $('#domainsTotal'),
            domainsCount        = parseInt(domains.val() | 0),
            domainPrices        = domains.attr('data-prices').split(','),
            totalCertificates   = parseInt($('#additionalProducts').val()),
            totalAmount         = (price * totalCertificates) + (price * (parseInt($('#additionalServers').val() || 1) - 1) * totalCertificates) + ((domainsCount > 0) ? (domainsCount * totalCertificates * domainPrices[parseInt(length.val()) / 12 - 1]) : 0);

        form.find('li.active').removeClass('active');
        form.find('li:has([type="radio"]:checked)').addClass('active');

        $('#amountTotal').update_vat('price',[totalAmount],0);

        domainsTotal.text((parseInt(domainsTotal.attr('data-included')) + domainsCount));
    });

    $('#addSslToCart').on('click', function (e) {
        e.preventDefault();

        var obj     = $(this),
            modal   = obj.closest('.reveal-modal'),
            length  = modal.find('[name="length"]:checked').val(),
            sku     = obj.closest('[data-sku-target]').attr('data-sku-target');

        var addObject = new $.ajax_prototype({
            'type'      : 'POST',
            'url'       : site_map.cart + '/add',
            'data'      : {
                'settings'                      : {
                    'additional_domains'    : modal.find('#additionalDomains').val(),
                    'servers'               : modal.find('#additionalServers').val()
                },
                'quantity'                      : modal.find('#additionalProducts').val(),
                'sku'                           : sku,
                'length'                        : length,
                'multipleInsertionsConfirmed'   : true,
                '_token'                        : $('[name="_token"]').val(),
                'unique_id'                     : unique_page_identifier
            },
            'success'   : function (data) {
                if (data.success) {
                    $('#sslOrder').hide();
                    $('#sslOrderBgLayer').remove();

                    enableBodyScroll();

                    var productBtn = $('[data-product-sku="' + sku + '"]').find('.orderSslProduct');
                    productBtn.addClass('success').text(COMMON_LANG.CART.IN_CART);

                    setTimeout(function () {
                        productBtn.removeClass('success').text(COMMON_LANG.CART.ORDER);
                    }, 3000);

                    if (app_env != 'local' && 'remarketing_items' in data.data) {
                        $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                    }

                    if('cart_items' in data.data){
                        $.each(data.data.cart_items, function (index, value) {
                            $.cart.insert(value.id, value.name, value.sub_name, value.total_price);
                        });
                    }else{
                        $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);
                    }

                    $.my_modals.unpinDisplay();
                } else {
                    $.cart.errorHandler(data);
                }
            },
            'complete'  : function () {
                $('.submitText').show();
                $('.loading').hide();
            }
        });

        $.ajax(addObject);
    });

    $(document)
        .on('click', '#mobileFilters', function (e) {
            e.preventDefault();

            $(this).closest('div').find('.cd-panel').addClass('is-visible');
        })
        .on('click', '#sslOrderBgLayer', function () {
            closeSslOrderModal();
        })
        .on('click', '.orderSslProduct:not(.success)', function (e) {
            e.preventDefault();

            var obj                 = $(this),
                item                = obj.closest('.item'),
                itemSku             = item.attr('data-product-sku'),
                modal               = $('#sslOrder'),
                additionalServers   = $('#additionalServers'),
                additionalDomains   = $('#additionalDomains'),
                additionalProducts  = $('#additionalProducts'),
                pricesCont          = modal.find('#pricesContainer'),
                displays            = ssl_js_displays[itemSku],
                backGroundLayer     = $('#sslOrderBgLayer');



            obj.blur();

            if (backGroundLayer.length < 1) {
                var $position = 'fixed',
                    $top = 0;

                // if($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) {
                //     $position = '';
                //     $top = '';
                // }

                modal.after('<div id="sslOrderBgLayer" style="position: ' + $position + '; top: ' + $top + '; width: 100%; height: 100%; background-color: rgba(28, 29, 30, 0.7); z-index: 99;"></div>');
            } else {
                $('#sslOrderBgLayer').show();
            }

            if($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) {
                modal.css({'position': 'absolute', 'top': window.pageYOffset + 'px'});
            } else if ($.getSizeClassification('small')) {
                modal.css({'position' : 'fixed', 'top' : 0});
            } else {

                var offset = ($(window).height() - modal.height()) / 2 + 'px';

                modal.css({'position' : 'fixed', 'top' : offset});

                disableBodyScroll();
            }

            modal.show().css('visibility','visible');
            modal.my_modal('whiten');

            modal.attr('data-sku-target', itemSku);

            pricesCont.empty();
            additionalServers.find('option:not(.placeholder)').remove();
            additionalServers.val('').disabled(true).closest('li').find('span').addClass('disabled');

            additionalDomains.find('option:not(.placeholder)').remove();
            additionalDomains.val('').disabled(true).closest('li').find('span').addClass('disabled');

            additionalProducts.val(1);

            var orderBtn = modal.find('#addSslToCart');

            orderBtn.find('.submitText').show();
            orderBtn.find('.loading').hide();


            var intervals       = $prices[itemSku].total_per_interval,
                intervalKeys    = Object.keys(intervals),
                firstInterval   = intervalKeys[0],
                max             = Math.max.apply(null, intervalKeys);

            for (var i in intervals) {
                if (intervals.hasOwnProperty(i)) {
                    var length_in_years = i / 12,
                        priceObj        = {'length' : intervals[i], 'total' : $prices[itemSku].total[i]},
                        initialPriceObj = {'init' : (length_in_years * $prices[itemSku].srp[i])},
                        discountObj     = {'init' : ((length_in_years * $prices[itemSku].srp[i]) - $prices[itemSku].total[i])},
                        finalPriceObj   = [(length_in_years * $prices[itemSku].srp[i]), $prices[itemSku].total[i]];

                    var $initialPrice = '';

                    if ('base_per_interval' in $prices[itemSku]) {
                        $initialPrice = ' <div class="on-offer">' + $.translate('billing.from', 0, {'price' : $.implementPriceTemplate('on-length', {'length' : $prices[itemSku].base_per_interval[i], 'total' : (parseFloat($prices[itemSku].base_per_interval[i]) * (length_in_years))}, firstInterval)}) + '</div>';


                    }
                     if(priceObj.length==priceObj.total){
                      $initialPrice = "";
                     };

                    pricesCont.append(
                        modalPriceTemp
                            .replace(/##id##/g, 'product_length_' + i)
                            .replace(/##value##/g, i)
                            .replace(/##lengthLabel##/g, create_length_string(i))
                            .replace(/##price##/g, $.implementPriceTemplate('on-length', priceObj, firstInterval) + $initialPrice)
                            .replace(/##discount##/g, $.implementPriceTemplate('price', discountObj))
                            .replace(/##initialPrice##/g, $.implementPriceTemplate('price', initialPriceObj))
                            .replace(/##discount##/g, $.implementPriceTemplate('price', discountObj))
                            .replace(/##finalPrice##/g, '(-' + $.imperial_to_metric($.convertDifToPercentage(finalPriceObj, true)) + '%)')
                    );
                }
            }

            if (itemSku in $additionalServers) {
                additionalServers.disabled(false).closest('li').find('span').removeClass('disabled');

                for (i = 1; i <= $additionalServers[itemSku]; i ++) {
                    additionalServers.append('<option value="' + i + '">' + i + '</option>')
                }

                additionalServers.val(1);
            }

            if (itemSku in $additionalDomains) {
                additionalDomains.disabled(false).closest('li').find('span').removeClass('disabled');

                for (i = 0; i <= $additionalDomains[itemSku].maximum; i = i + $additionalDomains[itemSku].domains_per_pack) {
                    additionalDomains.append('<option value="' + i + '">' + i + '</option>')
                }

                var included = $additionalDomains[itemSku].included + 1;
                $('#domainsTotal').attr('data-included', included).text(included);

                additionalDomains.val(0).attr('data-prices', Object.values($prices[itemSku].additional_domains).join(','));
            } else {
                additionalDomains.attr('data-prices', '');
                $('#domainsTotal').attr('data-included', 1).text(1);
            }

            $('#amountTotal').update_vat('price',[$prices[itemSku].total[max]],0);
            $('#product_length_' + max).attr('checked', true).closest('li').addClass('active');

            var itemName = item.find('.name strong'),
                itemCompany = itemName.text().match(/comodo|geotrust|thawte|symantec/gi)[0];


            // $('#sslOrderTitle').text(itemName.text().replace(itemCompany,'').trim().replace(/^-/,'').trim());
            var productName         = itemName.text().trim(),
                discount_percentage = productName.match(/^−[0-9]+%/);

            if (discount_percentage != null) {
                productName = productName.replace(discount_percentage[0], '');
            }

            var itemUrl = item.find('.name a').attr('href');

            $('#sslOrderTitle').text(productName + ((discount_percentage != null) ? ' (' + discount_percentage[0] + ')' : '')).attr('href', itemUrl).attr('title', productName);

            $('#modalGoToDetailesLink').attr('href', itemUrl).attr('title', productName).text(productName);

            var logo        = $('#orderCompanyLogo'),
                isComodo    = item.find('.name').text().match(/comodo/gi) != null,
                notDv       = item.find('.validation').text().match(/dv/gi) == null;

            if (isComodo && notDv)
                modal.find('.greek-support').show();
            else
                modal.find('.greek-support').hide();

            logo.attr('src', logo.attr('src').replace(/comodo|geotrust|thawte|symantec/gi,itemCompany)).attr('title', itemCompany).attr('alt', itemCompany);



            $.each(displays, function (display, structure) {
                var current_display = modal.find('#' + display);

                $.each(structure, function (type, values) {
                    switch (type) {
                        case 'text':
                            current_display.text(values);
                            break;
                        case 'class':
                            current_display.attr('class', values);
                            break;
                        case 'attributes':
                            $.each(values, function (attribute, value) {
                                current_display.attr(attribute, ((attribute == 'src') ? ssl_js_images[value] : ssl_js_translations[value]));
                            });
                            break;
                    }
                });
            });

            $('#btmNavCont').addClass('hidden');
            $.my_modals.pinDisplay();
        })
        .on('click', '.orderSslProduct', function (e) {
            e.preventDefault();

            $(this).blur();
        });

    if (filtersContainer.length) {
        scrollHandler();

        window.addEventListener('scroll', function (e) {
            if ($.getSizeClassification('large_up')) {
                if (stickyFilterTimers != null)
                    clearTimeout(stickyFilterTimers);

                stickyFilterTimers = setTimeout(function () {
                    scrollHandler();

                    stickyFilterTimers = null;
                }, 25);
            }
        });

        window.addEventListener('resize', function(e) {
            if ($.getSizeClassification('large_up')) {
                filtersOffsetTop = (filtersContainer.offset().top + filtersContainer.height()) - 10;
                scrollHandler();
            }

            if ($.getSizeClassification('medium_down')) {
                $('.ssl-list').css('padding-top', 'initial');
            }

            $('.cd-panel').removeClass('is-visible');
        });

        function scrollHandler () {
            if ($(window).scrollTop() >= filtersOffsetTop && $.getSizeClassification('large_up')) {
                filtersContainer.addClass('sticky');
                $('.ssl-list').css('padding-top', '98px');

                if (custom_nav_exists)
                    filtersContainer.css('top', '44px');
            } else {
                filtersContainer.removeClass('sticky');
                $('.ssl-list').css('padding-top', 'initial');

                if (custom_nav_exists)
                    filtersContainer.css('top', '');
            }
        }

        if (custom_nav_exists) {
            $.observers.register('custom_nav_observer', function (mutations) {
                if (typeof customNavMutationTimer != 'undefined' && customNavMutationTimer != null)
                    return;

                customNavMutationTimer = setTimeout(function () {
                    var filtersContainer = $('#sslFiltersContainers');

                    if ($.getSizeClassification('large_up')) {
                        if ($('#wrapper-nav').css('display') != 'none') {
                            if ($('#wrapper-nav [href="#ssl-list-products"]').hasClass('active'))
                                filtersContainer.show();
                            else{
                                filtersContainer.hide();
                            }
                        } else {
                            filtersContainer.show();
                        }
                    } else {
                        filtersContainer.hide();
                    }

                    customNavMutationTimer = null;
                },100);
            });

            $.observers.observe('custom_nav_observer', $('#wrapper-nav'), {subtree:true, attributes:true});

            $.observers.register('item_observer', function (mutations) {
                if (typeof itemMutationTimer != 'undefined')
                    clearTimeout(itemMutationTimer);

                if ($.getSizeClassification('large_up')) {
                    itemMutationTimer = setTimeout(function () {
                        $.recalculateSections();
                    },300);
                }
            });

            $.observers.observe('item_observer', document.querySelectorAll('.item:not(.header)'), {subtree:true, attributes:true});
        }
    }

    window.addEventListener('resize', function () {
        var modal = $('#sslOrder:visible').filter(function () {return $(this).css('visibility') == 'visible'});

        if ($.getSizeClassification('medium_down')) {
            $('.item.filtered-out').hide();
            $('#sslFiltersContainers').hide();
        } else {
            $('.item.filtered-out').show();
            // $.recalculateSections();
        }

        if (modal.length) {
            if ($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) {
                // modal.css({'position': 'absolute', 'top': window.pageYOffset + 'px'});
            } else if ($.getSizeClassification('small')) {
                modal.css({'position' : 'fixed', 'top' : 0});
            }else {
                var offset = ($(window).height() - modal.height()) / 2 + 'px';

                modal.css({'position' : 'fixed', 'top' : offset});
            }
        }
    });

    function closeSslOrderModal () {
        $('#sslOrder').css('visibility', 'invisible');
        $('#sslOrderBgLayer').hide();

        enableBodyScroll();

        $.my_modals.unpinDisplay();
    }

    function searchByName (obj) {
        filtersLists.find('input:checked').attr('checked', false);
        items.removeClass('visible filtered-out');
        $('.mobileFilters').chosen_update('');

        var value = obj.val().toLowerCase();

        if (value != '')
            items.hide().filter('[data-name*="' + value + '"]').show();
        else
            items.show();

        checkIfItemsVisible();
    }

    function checkIfItemsVisible () {
        if (items.filter(':visible:not(.filtered-out)').length) {
            $('#noResults').remove();
        } else if ($('#noResults').length < 1) {
            items.filter(':last').after('<div id="noResults" class="hide" style="display: block;"><div class="alert-box info" data-alert="">' + $.translate('misc.tables.no_results') + '</div></div>');
        }
    }

    if ($(window).scrollTop() > 0) {
        if (navWrapper.length && ! navWrapper.hasClass('active') && $('#sslFiltersContainers').hasClass('sticky'))
            $('#sslFiltersContainers').hide();
    }
});