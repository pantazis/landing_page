$(document).ready(function () {
    var config = {
        iteration       : {
            limit : 10,
            times : 2
            // limit : 20
        },
        functionality   : { //Configs targeting a certain functionality
            show_more   : {
                available : $.keys(dependencies.tldList).length, //Indicates how many match the filter. Should change every time a filter is applied
            },
            search      : {
                url         : '/api/domains/check', //Domain search handler
                keywords    : {}, //Keyword active search
                tld         : '' //Tld search in domains list
            },
            filters     : {
                selected_class      : 'selected',
                active_filter       : '',
                availability        : false,
                tld_search_class    : 'colored_tld',
                decorate            : ''
            },
            scrolls     : {
                searchbar : $('.domain-results-searchbar').offset().top
            },
            rows        : {
                selected_class          : 'selected',
                containers_min_height   : 900,
                single                  : {
                    keyword : '',
                    tld : ''
                },
                reroute                 : {

                }
            },
            cache       : {
                item_name   : cacheNames.domainSearch,
                keep_alive  : ['gr','com.gr','net.gr','org.gr','edu.gr','gov.gr','eu','com','net','org','ελ'],
                outerUpdate : false
            },
            errors      : {
                bulk_fuzzy_error : false,
                invalidKeys : false,
                tooBigKeys : false,
                tooSmallKeys : false,

            },
            cart        : {
                pending_class   : 'pending-cart',
                urlAdd          : '/cart/add',
                urlRemove       : '/cart/delete/',
            },
            whois       : {
                'url'   : '/domains/whois'
            }
        },
        templates       : {
            'taken'     : '<div class="tld-taken"><span class="output"></span></div>',
            'error'     : '<div class="errors"><span></span></div>',
            'info'      : '<span class="info"><i class="icon-info2"></i></span>',
            'checking'  : {
                'single'    : '<li><a href="#" class="button singleButtonTarget secondary checking">' + $.translate('domains.search.buttons.checking') + '...</a></li>',
                'list'      : '<div class="add-to-cart"><a href="#" class="buttonTarget loading"><span class="spinner"></span></a></div>'
            },
            'spinner'   : '<a href="#" class="buttonTarget loading"><span class="spinner"></span></a>'
        },
        availTemp       : '<div class="row availabilityLoader"><div class="small-12 columns"><div class="results-load"><div class="loading"><span class="spinner"></span></div></div></div></div>',
        request_timeout : {
            check       : 90000, //This is in milliseconds
            cart        : 90000,
            whois       : 90000,
            recheck     : 120000,
            typing      : 500
        },
        cache           : {},
        timers          : {
            cacheCleanUp : 600000
            // cacheCleanUp : 10000
        }
    };

    var domCache = {
        domain_results_searchbar    : $('.domain-results-searchbar'),
        domains_more_results        : $('.domains-more-results'),
        filtering                   : $('.filtering '),
        show_more                   : $('#show_more'),
        top_targets                 : $('.top-targets'),
        domainList                  : $('.tld-results.list'),
        resultTableRow              : $('#resultTableRow'),
        searchField                 : $('#search_field'),
    };

    domainList = domCache.domainList.html();


    var merge = {
        config : config,
        management : {
            searchKeyword   : function (keepAlive) {
                searchKeyword(keepAlive);
            },
            convertPrices   : function (price) {
                return convertPrices(price);
            },
            handleErrorBox  : function (action, msg, disable) {
                handleErrorBox(action, msg, disable)
            },
            syntaxErrors    : function () {
                return syntaxErrors()
            },
            initPage        : function () {
                initPage();
            },
            loaded          : {
                main : false,
                search : false,
                // whois : false,
                rows : false,
                filters : false
            }
        }
    };

    if ('domain_search' in $)
        $.extend($.domain_search, merge);
    else
        $.extend({'domain_search' : merge});

    $(document)
        .on('click', '.cart-button:not(.taken):not(.pending):not(.' + $.domain_search.config.functionality.cart.pending_class + '), .singleButtonTarget:not(.taken):not(.secondary):not(.pending):not(.' + $.domain_search.config.functionality.cart.pending_class + ')', function (e) {
            e.preventDefault();

            var obj     = $(this),
                action  = ((obj.hasClass($.domain_search.config.functionality.rows.selected_class)) ? 'removeDomainFromCart' : 'addDomainToCart'),
                fqdn    = obj.closest('[data-fqdn]'),
                tld     = fqdn.attr('data-tld');


            obj.toggleClass($.domain_search.config.functionality.rows.selected_class).addClass($.domain_search.config.functionality.cart.pending_class);

            fqdn[action]();
        })
        .on('click', '.buttonTarget.taken, .singleButtonTarget.secondary', function (e) {
            e.preventDefault();
        })
        .on('loaded:main loaded:search loaded:whois loaded:rows loaded:filters', function () {
            try {
                clearTimeout(loadedFileTimer);
            } catch (er) {}

            loadedFileTimer = setTimeout(function () {
                checkLoaded();
            }, 100);
        })
        .on('loaded:main', function () {
            $.domain_search.management.loaded.main = true;
        })
        .on('loaded:search', function () {
            $.domain_search.management.loaded.search = true;
        })
        .on('loaded:whois', function () {
            $.domain_search.management.loaded.whois = true;
        })
        .on('loaded:rows', function () {
            $.domain_search.management.loaded.rows = true;
        })
        .on('loaded:filters', function () {
            $.domain_search.management.loaded.filters = true;
        });

    window.addEventListener('scroll', function(e) {
        handleSearchBarPosOnScroll();

        if($.isMobile() === false) {
            var docHeight = $(document).height();

            if ((Math.ceil($(window).scrollTop() + $(window).height())) == docHeight) {
                $.domain_search.rows.revealDomainRows();
            }
        }

        handleFilterVisibility();
    });

    if($.isMobile()) {
        window.addEventListener('touchmove', function () {
            try {
                clearTimeout(touchemoveTimer);
            } catch (er) {
            }

            touchemoveTimer = setTimeout(function () {
                if (($(window).scrollTop() + $(window).height()) >= $(document).height() - 250) {
                    $.domain_search.rows.revealDomainRows();
                }
            }, 10)
        });
    }

    window.addEventListener('resize', function (e) {
        try {
            clearTimeout(domainSearchResizeTimer);
        } catch (er) {}

        domainSearchResizeTimer = setTimeout(function () {
            handleSearchBarPosOnScroll();

            shortNamedOnResize();

            handleFilterVisibility();
        }, 150);
    });

    $.fn.extend({
        addDomainToCart : addDomainToCart,
        removeDomainFromCart : removeDomainFromCart
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasCreated', function(data) {
        if(data.msg.unique_id == unique_page_identifier)
            return ;

        add_item_callback(data);
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasDeleted', function(data) {
        if(data.msg.unique_id == unique_page_identifier)
            return ;

        remove_item_callback(data);
    });

    if ($.visibility_api_config.available) {
        window.addEventListener("storage", function (e) {
            if (e.key != $.domain_search.config.functionality.cache.item_name)
                return;

            try {
                clearTimeout(domainSearchTimer);
            } catch (er) {}

            domainSearchTimer = setTimeout(function () {
                storageDomainCacheUpdated();
            }, 1000);
        }, false);

        var cacheCleanUpInterval;

        if (! document[$.visibility_api_config.hidden])
            setClearDomainInterval();

        $.visibility_api({
            callback: function (e) {
                if (document[$.visibility_api_config.hidden])
                    clearInterval(cacheCleanUpInterval);
                else
                    setClearDomainInterval();
            }
        });
    }

    function checkLoaded () {
        var loaded = true;

        $.each($.domain_search.management.loaded, function (key, value) {
            if (value === false) {
                loaded = false;
                return false;
            }
        });

        if (loaded)
            $.domain_search.management.initPage();
    }

    function initPage () {
        initConfigs();

        initiatePreviousSearches();
    }

    function searchKeyword (keepAlive) {
        if(!beforeSearch())
            return ;

        domCache.top_targets.addClass('hide').removeClass('search-margin');

        var keywords = $.keys($.domain_search.config.functionality.search.keywords);

        if (keywords.length) {
            domCache.domainList.html(domainList);

            domCache.domains_more_results.show();

            if (keywords.length == 1) {
                singleKeywordSearch(keywords[0], keepAlive);

                $('dl').removeClass('inactive');
                $('dd').removeClass('disabled');

                $.cookie_api('keyword', domCache.searchField.val(), '', token);
            } else {
                $.domain_search.management.handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.ONLY_SINGLE_KEYWORD_ALLOWED);
                // multipleKeywordSearch();
            }
        } else {
            domCache.domains_more_results.hide();
        }
    }

    function singleKeywordSearch (keyword, keepAlive) {
        if ($.domain_search.config.functionality.search.keywords[keyword].length == 1) {
            $.domain_search.config.functionality.rows.single.keyword = keyword;
            $.domain_search.config.functionality.rows.single.tld = $.domain_search.config.functionality.search.keywords[keyword][0];

            var target = $('.list [data-tld="' + $.domain_search.config.functionality.rows.single.tld + '"]'),
                singleResult = $.domain_search.rows.build_single_domain(target);
        } else if ($.domain_search.config.functionality.search.keywords[keyword].length > 1) {
            for (var i = $.domain_search.config.functionality.search.keywords[keyword].length - 1; i >= 0; i--) {
                domCache.domainList.prepend($('.tldResults[data-tld="' + $.domain_search.config.functionality.search.keywords[keyword][i] + '"]'));
            }
        }

        $.domain_search.rows.setSearchTermToDomainRows();
        $.domain_search.rows.loadFromCache(keyword, keepAlive);

        if (keyword.length == 2) {
            getTwoCharachtersSpecialPrice();
        }

        var count = $.domain_search.config.iteration.limit * $.domain_search.config.iteration.times,
            selector = '.singleResult, ' + $.domain_search.config.functionality.filters.active_filter + ' .tld-line:hidden:lt(' + count + ')';

        $('.top-targets:visible:first').addClass('search-margin');

        $.domain_search.rows.revealDomainRows(count, $(selector));
    }
    
    function multipleKeywordSearch () {
        domCache.domainList.empty();

        var html = domCache.resultTableRow.html();
        
        $.each($.domain_search.config.functionality.search.keywords, function (keyword, tlds) {
            $.each(tlds, function (index, tld) {
                var regPrice = dependencies.tldList[tld].s.np.t[dependencies.t_id],
                    redPrice = ((tld in dependencies.offers) ? dependencies.offers[tld] : ''),
                    length = dependencies.tldList[tld].s.l / 12;

                var tldResults = domCache.domainList.append(html.replace(/##keyWord##/g, keyword)
                                                .replace(/##tld##/g,tld)
                                                .replace(/##regPrice##/, regPrice)
                                                .replace(/##regPrice##/, convertPrices(regPrice))
                                                .replace(/##redPrice##/, redPrice)
                                                .replace(/##redPrice##/, convertPrices(redPrice))
                                                .replace(/##length##/g, (((length == 1) ? '' : length + ' ') + $.translate('length.year', length)))
                                            ).find('.tldResults:last');

                if (! redPrice)
                    tldResults.find('.reduced-price').remove();
                else
                    tldResults.find('.regular-price').html('<s class="strikethrough">' + tldResults.find('.regular-price span').html() + ' &euro;</s>');
            });

            if (keyword.length == 2) {
                getTwoCharachtersSpecialPrice();
            }
        });

        $.domain_search.rows.revealDomainRows('', $('.tld-line'));
    }

    function initConfigs () {
        $.domain_search.config.functionality.scrolls.windowHeight = getWindowHeight();

        if (app_env == 'local')
            $.domain_search.config.functionality.cache.item_name += '_beta';

        validateLocalCache();

        var tmp = JSON.parse(localStorage.getItem($.domain_search.config.functionality.cache.item_name));

        if (tmp == null) {
            $.domain_search.config.cache = {};
            localStorage.setItem($.domain_search.config.functionality.cache.item_name, JSON.stringify({cache:{}, updater: unique_page_identifier, updatedFor : ''}));
        } else {
            $.domain_search.config.cache = tmp.cache;
        }
    }

    function getWindowHeight () {
        var body = document.body,
            html = document.documentElement;

        return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    }

    function storageDomainCacheUpdated () {
        var tmp = JSON.parse(localStorage.getItem($.domain_search.config.functionality.cache.item_name));

        if (tmp.updater != unique_page_identifier) {
            var keywordFound = false;

            $.each($.keys($.domain_search.config.functionality.search.keywords), function (key, value) {
                if (tmp.updatedFor.indexOf(value) > -1) {
                    keywordFound = true;
                    return false;
                }
            });

            if (! keywordFound)
                return;

            $.domain_search.config.cache = $.extend($.domain_search.config.cache, tmp.cache);

            $.domain_search.config.functionality.cache.outerUpdate = true;

            reloadTldsFromCache();
        }
    }

    function validateLocalCache () {
        var tmp = JSON.parse(localStorage.getItem($.domain_search.config.functionality.cache.item_name));

        if (tmp == null || ! ('cache' in tmp || 'updater' in tmp || 'updatedFor' in tmp))
            invalidateLocalCache();
    }

    function invalidateLocalCache () {
        localStorage.setItem($.domain_search.config.functionality.cache.item_name, JSON.stringify({cache:{}, updater: unique_page_identifier, updatedFor : ''}));
    }

    function reloadTldsFromCache () {
        var visibleResults = [];

        $('.tldResults:has(.tld-line:visible)').each(function () {
            visibleResults.push(this.dataset.fqdn);
        });

        searchKeyword(false);

        $.each(visibleResults, function (key, value) {
            $('[data-fqdn="' + value + '"] .tld-line').show();
        });

        $.domain_search.rows.colorVisibleDomainRows();
    }

    function getTwoCharachtersSpecialPrice () {
        $.each(dependencies.tldList, function (key,value) {
            if('p' in value.s && typeof value.s.p.t[dependencies.t_id] != 'undefined'){
                var price = value.s.p.t[dependencies.t_id],
                    target = $('[data-tld="' + key + '"]').find('.price, .price-container');

                target.removeClass('discount');
                target.find('.regular-price .vat').attr({'data-price':price}).text(convertPrices(price));
                target.find('.reduced-price').remove();
            }
        });
    }

    /**
     * convertPrices
     * Converts prices from Imperial to Metric system.
     * Add vat if it is required.
     * @param price
     * @returns {string}
     */
    function convertPrices(price) {
        if (! price)
            return '';

        if (price !== undefined) {
            if (vat['show']) {
                price = parseFloat(price) * vat['quote'];
            }

            var dataPrice = price.toFixed(2).toString().split('.');

            dataPrice[0] = dataPrice[0].replace(',', '.');

            if(dataPrice[1] === undefined){
                dataPrice[1] = '00';
            }

            return dataPrice[0] + ',' + dataPrice[1];
        }
    }

    function handleSearchBarPosOnScroll () {
        if ($.getSizeClassification('large_up') && window.pageYOffset >= $.domain_search.config.functionality.scrolls.searchbar) {
            domCache.domain_results_searchbar.addClass('fixed-top').attr('style', 'position: fixed; top: 0px; width: 100%; z-index: 99;');
            domCache.filtering.addClass('fixed-filters').attr('style', 'width: 320px;');
        } else {
            domCache.domain_results_searchbar.removeClass('fixed-top').attr('style', '');
            domCache.filtering.removeClass('fixed-filters').attr('style', '');
        }
    }

    function handleErrorBox(action, msg, disable){
        if(typeof action == 'string'){
            var errorMessageContainer = $('#tldAlertContainer');

            switch (action) {
                case 'show' : {
                    errorMessageContainer.show();

                    if (typeof msg == 'string') {
                        errorMessageContainer.find('.alert-box').html(msg);
                    }

                    $('.list').hide();
                    $('.domains-more-results').show();

                    //Hide single result and reorganise the top margin.
                    $('.singleResult').hide();
                    $('.search-margin').removeClass('search-margin');
                    $('.top-targets:visible:first').addClass('search-margin');
                    // $('.top-targets:visible').addClass('search-margin');

                    //If search is invalid disable filters.
                    if(disable != false){
                        $('dl').addClass('inactive');
                        $('dd').addClass('disabled');
                        $('#resultsSearch,#mobileResultsSearch').disabled(true);
                        $('select.filters').chosen_disable();
                    }

                    break;
                }
                case 'hide' : {
                    errorMessageContainer.hide();

                    $('.list, .domains-more-results').show();

                    $('#resultsSearch,#mobileResultsSearch').disabled(false);
                    $('select.filters').each(function () {
                        var obj = $(this),
                            val = obj.val();

                        obj.chosen_enable().chosen_update(val);
                    });

                    break;
                }
                default     : {
                    throw new TypeError('Action is not recognised Action must be show or hide.');
                }
            }
        }else{
            throw new TypeError('Action is either empty or is of invalid type.');
        }
    }

    function beforeSearch () {
        if (! displayInitiationErrors())
            return false;

        return true;
    }

    /**
     * Handle all possible errors before search begins.
     * @returns {boolean}
     */
    function displayInitiationErrors (){
        if(! syntaxErrors())
            return false;

        return true;
    }

    /**
     * Handle input errors.
     *
     * Invalid Keys flag is set to true. Stop propagation.
     * A keyword is invalid when latin and greek chars are mixed.
     *
     * Length error handling
     * Inform the user what goes wrong with his search.
     * If a domain is bigger than the max allowed limit then is cut to fit the limit.
     * If it is too small then excluded from the search.
     * @returns {boolean}
     */
    function syntaxErrors () {
        if ($.domain_search.config.functionality.errors.invalidKeys) {
            $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.INVALID_KEYS, alert_box_warning);
            return false;
        }

        if ($.domain_search.config.functionality.errors.tooBigKeys || $.domain_search.config.functionality.errors.tooSmallKeys) {
            if ($.domain_search.config.functionality.errors.tooBigKeys && $.domain_search.config.functionality.errors.tooSmallKeys ) {
                $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.ILLEGAL_KEY_LENGTH, alert_box_warning);
                $.domain_search.config.functionality.errors.tooBigKeys = false;
                $.domain_search.config.functionality.errors.tooSmallKeys = false;
            } else if ($.domain_search.config.functionality.errors.tooBigKeys) {
                $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.TOO_BIG_KEYWORDS, alert_box_warning);
                $.domain_search.config.functionality.errors.tooBigKeys = false;
            } else if ($.domain_search.config.functionality.errors.tooSmallKeys) {
                $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.TOO_SMALL_KEYWORDS, alert_box_warning);
                $.domain_search.config.functionality.errors.tooSmallKeys = false;
            }
            return false;
        }

        return true;
    }

    function shortNamedOnResize () {
        var keywords = $.domain_search.config.functionality.search.keywords;

        if (! $.isEmptyObject(keywords)) {
            keywords = $.keys(keywords);

            if (keywords.length == 1) {
                var keyword = keywords[0],
                    partA, partB, finalName;

                $('.list .name').text($.domain_search.rows.shortenName(keyword));

                if ($.getSizeClassification('small') && keyword.length > 25) {
                    partA = keyword.substring(0, 11);
                    partB = keyword.substring(keyword.length - 11);
                    finalName = partA + '...' + partB;
                } else if ($.getSizeClassification('large_up') && keyword.length > 37) {
                    partA = keyword.substring(0, 17);
                    partB = keyword.substring(keyword.length - 17);
                    finalName = partA + '...' + partB;
                } else {
                    finalName = keyword;
                }

                $('.singleName').text(finalName);
            }


            if ($.getSizeClassification('large_up')) {
                if (Math.floor($(document).scrollTop()) >= $('.domain-results').position().top * 1.65 && $(window).height() > 900 && $('.domain-results-searchbar').hasClass('fixed-top') && $.getSizeClassification('xlarge')) {
                    $('.filtering').addClass('fixed-filters');
                }
                $('.filtering.fixed-filters').css({'width': $('.domains-more-results .small-12').width() + 'px'});
            } else {
                $('.filtering.fixed-filters').removeClass('fixed-filters').css({'width': ''});

                if ($.getSizeClassification('small')) {
                    if(document.body.scrollHeight == document.body.clientHeight){
                        $('#mobileFilters').show();
                    }
                } else {
                    $('.buttonTarget.taken').closest('div').show();
                }
            }
        }
    }

    function handleFilterVisibility () {
        try {
            if($.getSizeClassification('large_down')) {
                filters_trig = $('#mobileFilters');
                if ($(document).scrollTop() >= $('.domain-results-searchbar-container').offset().top - 16 && filters_trig.is(':hidden')) {
                    filters_trig.show();
                }

                if ($(document).scrollTop() < $('.domain-results-searchbar-container').offset().top && filters_trig.is(':visible')) {
                    filters_trig.hide();
                }
            }
        } catch (er) {}
    }

    function initiatePreviousSearches () {
        var search = '';

        if (dependencies.postKeyword != '') {
            search = dependencies.postKeyword;
        } else if(Cookies.get('tokenMismatch')) {
            search = Cookies.get('tokenMismatch');
            Cookies.remove("tokenMismatch");
        } else if(!$.isEmptyObject(dependencies.cKeywords)) {
            $.each(dependencies['cKeywords'], function(key,value){
                search += value['keyword'];
                if(value['tld'] !== null){
                    search += '.' + value['tld'] + ' ';
                }else{
                    search += ' ';
                }
            });

            search = search.trim();
        }

        if (search) {
            domCache.searchField.val(search).closest('form').validate();
        }
    }

    function add_item_callback (data) {
        dependencies.domains_in_cart[data.msg.cart_item.name] = {cart_item_id : data.msg.cart_item.id};
    }

    function remove_item_callback (data) {
        delete dependencies.domains_in_cart[data.msg.fqdn];
    }

    function addDomainToCart () {
        var obj = this,
            data = {
                fqdn        : obj.attr('data-fqdn'),
                action      : 'register',
                settings    : {},
                _token      : $('[name="_token"]').val(),
                unique_id   : unique_page_identifier
            };

        $.ajax({
            type        : "POST",
            url         : $.domain_search.config.functionality.cart.urlAdd,
            data        : data,
            timeout     : $.domain_search.config.request_timeout.cart,
            success     : function (data) {
                if (obj.find('.buttonTarget').hasClass('loading') || obj.find('.singleButtonTarget').hasClass('checking')) {
                    $.domain_search.rows.tldStatusUpdate(obj, obj.attr('data-fqdn').split('.')[0], obj.attr('data-tld'), {'status': $.domain_search.currentResults[obj.attr('data-tld')]});
                    obj.find('.buttonTarget,.singleButtonTarget').addClass($.domain_search.config.functionality.rows.selected_class);
                }

                addToCartResponse(obj, data);
            },
            error       : function (data) {
                if (obj.find('.buttonTarget').hasClass('loading'))
                    $.domain_search.rows.tldStatusUpdate(obj, obj.attr('data-fqdn').split('.')[0], obj.attr('data-tld'), {'status':$.domain_search.currentResults[obj.attr('data-tld')]});

                if(data.statusText == 'timeout')
                    obj.find('.' + $.domain_search.config.functionality.rows.selected_class).removeClass($.domain_search.config.functionality.rows.selected_class);
                else
                    addToCartErrorHandler(obj);
            },
            complete    : function (response) {
                obj.find('.' + $.domain_search.config.functionality.cart.pending_class).removeClass($.domain_search.config.functionality.cart.pending_class);

                globalErrorsHandler(response)
            }
        });
    }

    function addToCartResponse (obj, data) {
        if(data.success) {
            //Item was added to cart - send add_to_cart event to analytics
            if (app_env != 'local' && 'remarketing_items' in data.data)
                $.sendAddToCartRemarketingEvent(data.data.remarketing_items);

            obj.attr('data-cart-item-id',data.data.id);
            obj.find('.buttonTarget, .singleButtonTarget').attr('title', DOMAINS_LANG.DOMAIN_SEARCH.TITLES.REMOVE_FROM_CART);
            $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);

            dependencies.domains_in_cart[data.data.name] = {cart_item_id : data.data.id};
        } else
            addToCartErrorHandler(obj, data);
    }

    function addToCartErrorHandler (obj, data) {
        if(data) {
            if (data.code != error_codes.domain_already_in_cart) {
                obj.find('.' + $.domain_search.config.functionality.rows.selected_class).removeClass($.domain_search.config.functionality.rows.selected_class);
            }else{
                obj.attr('data-cart-item-id',data.data.id);

                if($('li[data-cart-item-id="' + data.data.id + '"]').length < 1)
                    $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.billing.price.total);

                return ;
            }

            if (data.code == error_codes.cart_not_found || data.code == error_codes.cart_item_add_failed) {
                $.alertHandler('', data.msg, alert_box_failure);
            } /*else if(data.code == error_codes.domain_already_in_cart) {

            } */else {
                obj.find('.' + $.domain_search.config.functionality.rows.selected_class).removeClass($.domain_search.config.functionality.rows.selected_class);
                globalApplicationErrors(data);
            }
        } else {
            obj.find('.' + $.domain_search.config.functionality.rows.selected_class).removeClass($.domain_search.config.functionality.rows.selected_class);
        }
    }

    function removeDomainFromCart () {
        var obj = this;

        $.ajax({
            type: "POST",
            url: $.domain_search.config.functionality.cart.urlRemove + obj.attr('data-cart-item-id'),
            data: {
                _token: $('[name="_token"]').val(),
                unique_id: unique_page_identifier
            },
            timeout: $.domain_search.config.request_timeout.cart,
            success: function (data) {
                removeFromCartResponse(obj, data);
            },
            error: function (data) {
                removeFromCartErrorHandler(obj);
            },
            complete: function (response) {
                obj.find('.' + $.domain_search.config.functionality.cart.pending_class).removeClass($.domain_search.config.functionality.cart.pending_class);

                globalErrorsHandler(response)
            }
        });
    }

    function removeFromCartResponse (obj, data) {
        if (data.success) {
            if (app_env != 'local' && 'remarketing_items' in data.data)
                $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items);

            $.cart.remove(obj.attr('data-cart-item-id'));
            obj.removeAttr('data-cart-item-id');
            obj.find('.buttonTarget, .singleButtonTarget').attr('title', DOMAINS_LANG.DOMAIN_SEARCH.TITLES.REMOVE_FROM_CART);
        }else{
            removeFromCartErrorHandler(obj,data);
        }
    }

    function removeFromCartErrorHandler (obj, data) {
        if(data){
            if(data.code != error_codes.cart_item_not_found){
                $('li[data-cart-item-id="' + obj.attr('data-cart-item-id') + '"]').cart_show();
                obj.find('.' + $.domain_search.config.functionality.rows.selected_class).removeClass($.domain_search.config.functionality.rows.selected_class);
            }

            if(data.code == error_codes.cart_not_found){
                $.alertHandler('', data.msg, alert_box_failure);
            }else {
                globalApplicationErrors(data);
            }
        }
    }

    function setClearDomainInterval () {
        cacheCleanUpInterval = setInterval(function () {
            cleanUpDomainCache();
        }, $.domain_search.config.timers.cacheCleanUp);
    }

    function cleanUpDomainCache () {
        var cacheItem = localStorage.getItem($.domain_search.config.functionality.cache.item_name),
            newCache = {},
            currentDate = new Date().getTime(),
            changed = false,
            savedCache;

        if (! cacheItem)
            return;

        savedCache = JSON.parse(cacheItem).cache;
        savedCache = $.extend(savedCache, $.domain_search.config.cache);

        $.each(savedCache, function (keyword, $tlds) {
            var tmp = {};

            $.each($tlds, function (tld, info) {
               if (info.date > currentDate)
                   tmp[tld] = info;
               else
                   changed = true;
            });

            if (! $.isEmptyObject(tmp))
                newCache[keyword] = tmp;
        });

        if (changed) {
            $.domain_search.config.cache = newCache;

            localStorage.setItem($.domain_search.config.functionality.cache.item_name, JSON.stringify({
                cache: newCache,
                updater: unique_page_identifier,
                updatedFor: $.keys($.domain_search.config.functionality.search.keywords)
            }));
        }
    }
});

$(window).on('load', function () {
    $(document).trigger('loaded:main');
});