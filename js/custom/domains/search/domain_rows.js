$(document).ready(function () {
    var currentCacheDate = null,
        singleResultHtml = $('.singleResult').html();

    var merge = {
        rows : {
            setSearchTermToDomainRows : function () {
                setSearchTermToDomainRows();
            },
            revealDomainRows : function (count, target) {
                revealDomainRows(count, target);
            },
            build_single_domain : function (target) {
                return build_single_domain(target);
            },
            loadFromCache : function (keyword, keepAlive) {
                loadFromCache(keyword, keepAlive)
            },
            updateLocalStorage : function () {
                initUpdateLocalStorage();
            },
            colorVisibleDomainRows : function () {
                colorVisibleDomainRows();
            },
            shortenName : function (keyword) {
                shortenName(keyword);
            },
            tldStatusUpdate : tldStatusUpdate
        }
    };

    if ('domain_search' in $)
        $.extend($.domain_search, merge);
    else
        $.extend({'domain_search' : merge});
    
    $.fn.extend({
        'domain_rows' : function (callback, args) {
            domain_rows_callback($(this), callback, args);
            return this;
        }
    });

    $(document)
        .ajaxStop(function () {
            setTimeout(function () {
                checkForPendingReroutes();
                getNotCheckedVisible();

                if ($.domain_search.config.functionality.filters.availability) {
                    if ($('.tld-line:visible').length < $.domain_search.config.iteration.limit) {
                        if ($.domain_search.config.functionality.filters.active_filter != '')
                            revealDomainRows();
                        else
                            revealDomainRows($.domain_search.config.iteration.limit, $('.tld-line:not(:has(.loading))'));
                    }

                    colorVisibleDomainRows();
                }
            }, 250);
        });

    var domCache = {
        show_more : $('#show_more')
    };


    function setSearchTermToDomainRows () {
        var keyword = $.keys($.domain_search.config.functionality.search.keywords)[0],
            short_name = shortenName(keyword);

        $('.singleResult').filter(function () {return !!$(this).attr('data-tld')}).attr_pre('data-fqdn', keyword).find('.name').text((($.getSizeClassification('large_up')) ? short_name : keyword)).attr('data-name', keyword);
        $('.tld-line .name').text(short_name).attr('data-name', keyword).closest('.tldResults').attr_pre('data-fqdn', keyword);
    }

    function revealDomainRows (count, target) {
        if (typeof count == 'undefined' || count == '')
            count = $.domain_search.config.iteration.limit * $.domain_search.config.iteration.times;

        var revealTargets;

        if (typeof target == 'undefined' || target == '') {
            var selector = $.domain_search.config.functionality.filters.active_filter + ' .tld-line:hidden:lt(' + count + ')';

            revealTargets = $(selector);
        } else {
            revealTargets = target;
        }


        if (($('.tld-line:visible').length + revealTargets.length) >= $.domain_search.config.functionality.show_more.available)
            domCache.show_more.hide();
        else
            domCache.show_more.show();

        var searchable = getPendingTlds(revealTargets);

        checkStructuresAvailability(searchable[0]);

        revealTargets.show();
        colorVisibleDomainRows();


        if (! $.domain_search.config.functionality.filters.decorate) {
            $('.' + $.domain_search.config.functionality.filters.tld_search_class).each(function () {
                var obj = $(this);

                obj.closest('.tld').html(obj.closest('[data-tld]').attr('data-tld'));
            });
        }
    }

    function colorVisibleDomainRows () {
        setTimeout(function () {
            $('.tld-line:visible').removeClass('odd').filter(':even').addClass('odd');
        });
    }

    function getPendingTlds (domainRows) {
        var result = domainRows.filter(function () {
                var obj = $(this);

                if (! obj.hasClass('tldResults') && ! obj.hasClass('singleResult'))
                    obj = obj.closest('.tldResults, .singleResult');

                if ($.domain_search.config.functionality.filters.decorate) {
                    var tld_obj_t = obj.attr('data-tld').split($.domain_search.config.functionality.filters.decorate);
                    obj.find('.tld').html(tld_obj_t[0] + '<span class="' + $.domain_search.config.functionality.filters.tld_search_class + '">' + $.domain_search.config.functionality.filters.decorate + '</span>' + tld_obj_t[1]);
                } else {
                    obj.find('.tld').html(obj.attr('data-tld'));
                }

                if (typeof $.domain_search.currentResults == 'undefined')
                    return (obj.find('.loading').length || obj.hasClass('singleResult'));
                else
                    return (obj.find('.loading').length || obj.hasClass('singleResult')) && ! (obj.attr('data-tld') in $.domain_search.currentResults);
            }),
            unstructred = [],
            structured = {
                forth : {},
                eurid : {},
                enom : {}
            };

        result.each(function () {
            var obj = $(this);

            if (! obj.hasClass('tldResults') && ! obj.hasClass('singleResult'))
                obj = obj.closest('.tldResults');

            if (obj) {
                obj.addClass('checking');

                var tld = obj.attr('data-tld'),
                    name = obj.find('.name').attr('data-name');

                if (tld.match(/\.gr$/) != null || tld == 'gr' || tld == 'ελ') {
                    try {
                        structured.forth[name].push(tld);
                    } catch (e) {
                        structured.forth[name] = [];
                        structured.forth[name].push(tld);
                    }
                } else if (tld == 'eu' || tld == 'ευ') {
                    try {
                        structured.eurid[name].push(tld);
                    } catch (e) {
                        structured.eurid[name] = [];
                        structured.eurid[name].push(tld);
                    }
                } else {
                    try {
                        structured.enom[name].push(tld);
                    } catch (e) {
                        structured.enom[name] = [];
                        structured.enom[name].push(tld);
                    }
                }

                unstructred.push(tld);
            }
        });

        return [structured, unstructred];
    }

    function checkStructuresAvailability (structure) {
        $.each(structure, function (registry, domains) {
            $.each(domains, function (keyword, tlds) {
                var times = Math.ceil(tlds.length / $.domain_search.config.iteration.limit);

                for (var i = 0; i < times; i++) {
                    var data = {
                        '_token'    : $('[name="_token"]').val(),
                        'tld'       : tlds.splice(0, $.domain_search.config.iteration.limit),
                        'keyword'   : keyword
                    };

                    if (data.tld.length && data.keyword)
                        sendRequest(data);
                }
            });
        });
    }

    function sendRequest (data) {
        $.ajax(
            domainSearchRequest($.domain_search.config.functionality.search.url, data)
        );
    }

    function sendRecheck(KeyWord,tld){
        $.ajax(
            domainSearchRequest($.domain_search.config.functionality.search.url + "?recheck", {
                keyword: KeyWord,
                tld: tld,
                _token: $('[name="_token"]').val(),
                action: 'getStatus'
            })
        );
    }

    function domainResponseHandler (data) {
        if(data.success == false){
            switch (data.code){
                case error_codes.empty_search           :
                case error_codes.too_long_search        :
                case error_codes.no_tld                 :
                case error_codes.multiple_registries    :
                case error_codes.not_enough_tld         : {
                    $.alertHandler('',data.msg,alert_box_failure);
                    break;
                }
                case error_codes.token_error            : { //49500
                    if(!Cookies.get('tokenMismatch')) {
                        $.set_cookie('tokenMismatch', $('#search_field').val(), '/');
                    }
                    break;
                }
                default :
                    globalApplicationErrors(data);
            }
        }else{

            currentCacheDate = new Date();
            currentCacheDate.setMinutes(parseInt(currentCacheDate.getMinutes()) + 15);

            reroute = [];
            //Check if the server's response is appropriate for processing.
            if($.isPlainObject(data) && 'data' in data && $.isPlainObject(data.data) && !$.isEmptyObject(data.data)) {
                $.each(data.data, function(keyword,tlds) {
                    if($.isPlainObject(tlds) && !$.isEmptyObject(tlds)) {
                        updateTld (keyword, tlds);
                    }
                });

                initUpdateLocalStorage();

                if ($.domain_search.config.functionality.filters.availability)
                    colorVisibleDomainRows();
            } else {
                $.domain_search.config.functionality.errors.run_errorCheck = true;
            }
        }
    }

    function updateTld (keyword, tlds) {
        $.each(tlds, function (tld, info) {
            var target = $('[data-fqdn="' + keyword + '.' + tld + '"]');

            tldStatusUpdate(target, keyword, tld, info);
        });
    }

    function tldStatusUpdate (target, keyword, tld, info) {
        if (target.find('.spinner').length || target.find('.checking').length) {
            if (typeof info.status !== 'undefined') {
                target.hasClass('singleResult') ? updateSingleDomain(target, keyword, tld, info) : updateListedDomain(target, keyword, tld, info);

                if ((keyword + '.' + tld) in dependencies.domains_in_cart && (info.status == dependencies.Status.available || info.status == dependencies.Status.conditionally))
                    target.attr('data-cart-item-id', dependencies.domains_in_cart[keyword + '.' + tld]['cart_item_id']).find('.buttonTarget, .singleButtonTarget').addClass($.domain_search.config.functionality.rows.selected_class).attr('title', DOMAINS_LANG.DOMAIN_SEARCH.TITLES.REMOVE_FROM_CART);

                if ('callback' in info) {
                    target.domain_rows(info.callback[0], info.callback[1]);
                }
            } else {
                $.domain_search.currentResults[tld] = dependencies.Status.noquote;

                target.removeClass('checking pending-recheck');
                target.find('.actions .price').hide();
                target.find('.actions .add-to-cart').remove();

                if (target.find('.actions .errors').length < 1)
                    target.find('.actions').append($.domain_search.config.templates.error).find('.errors span').text(dependencies['statuses'][9]['locale']).css({'visibility': 'visible'});
                else
                    target.find('.actions .errors span').text(dependencies['statuses'][9]['locale']).css({'visibility': 'visible'});

                if ($.domain_search.config.functionality.filters.availability)
                    target.find('.tld-line').hide();

                cacheTld(keyword, tld, {'status' : 9});
            }
        }
    }

    function updateSingleDomain (target, keyword, tld, info) {
        if (info.status != dependencies.Status.reroute) {
            target.find('.checking').removeClass('checking');

            var statusText = dependencies['statuses'][info['status']]['locale_single'],
                icon = '';

            switch (info.status) {
                case dependencies.Status.available: {
                    premiumPrice(target, info);
                    icon = "checkmark";
                    target.find('.price-container').show().css('visibility', 'visible');
                    target.find('.singleButtonTarget').removeClass('secondary').text(DOMAINS_LANG['DOMAIN_SEARCH']['BUTTON_TEXTS']['ADD_TO_CART']).attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['ADD_TO_CART']});
                    break;
                }
                case dependencies.Status.unavailable: {
                    icon = "cross3";
                    target.find('.price-container').hide();

                    target.attr({'data-price-final': '-'}).find('.singleButtonTarget').addClass('secondary taken').text(dependencies['statuses'][info['status']]['locale']).attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['WHOIS']});
                    break;
                }
                case dependencies.Status.expiration:
                case dependencies.Status.conditionally: {
                    premiumPrice(target,info);
                    icon = "info2";
                    target.find('.price-container').show();
                    target.find('.button').removeClass('secondary').text(DOMAINS_LANG['DOMAIN_SEARCH']['BUTTON_TEXTS']['ADD_TO_CART']).attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['ADD_TO_CART']});
                    break;
                }
                default : {
                    icon = "cross3";
                    target.find('.price-container').hide();
                    statusText = dependencies['statuses'][dependencies['Status']['unavailable']]['locale_single'];
                    target.attr({'data-price-final':'-'}).find('.inline-list').empty().append('<li class="errors">' + dependencies['statuses'][info['status']]['locale_single'] + '</li>');
                }
            }

            target.find('.status').html(statusText + '<i class="icon-' + icon + '"></i>');

            if (icon == "info2")
                target.find('i').attr({'title': dependencies['statuses'][info['status']]['more_info']});

            if (typeof info.premium != 'undefined') {
                target.find('.inline-list').prepend('<li class="premium" title="' + dependencies.premiumTitle + '"></li>');

                var strikethrough = target.find('.strikethrough');
                strikethrough.after('<span class="regular-price">' + strikethrough.html() + '</span>');
                strikethrough.remove();
            }

            $.domain_search.currentResults[tld] = info.status;
            target.removeClass('checking pending-recheck');
        } else {
            addSingleDomainToRecheck(target, keyword, tld);
        }
    }

    function addSingleDomainToRecheck (target, keyword, tld) {
        if (! target.hasClass('pending-recheck')) {
            try {
                $.domain_search.config.functionality.rows.reroute[keyword].push(tld);
            } catch (er) {
                $.domain_search.config.functionality.rows.reroute[keyword] = [];
                $.domain_search.config.functionality.rows.reroute[keyword].push(tld);
            }

            target.addClass('pending-recheck');
        } else {
            var icon = "cross3",
                statusText = dependencies['statuses'][dependencies['Status']['unavailable']]['locale_single'];

            target.find('.price-container').hide();
            target.attr({'data-price-final':'-'}).find('.inline-list').empty().append('<li class="errors">' + dependencies['statuses'][9]['locale_single'] + '</li>');

            target.find('.status').html(statusText + '<i class="icon-' + icon + '"></i>');

            target.removeClass('checking pending-recheck');
        }
    }

    function updateListedDomain (target, keyword, tld, info, cache) {
        if (info.status != dependencies.Status.reroute) {

            if (cache !== false)
                cacheTld(keyword, tld, info);

            target.removeClass('checking');


            try {
                target.find('.buttonTarget').removeClass('loading').addClass('cart-button').attr({'title': DOMAINS_LANG.DOMAIN_SEARCH.TITLES.ADD_TO_CART}).find('span').remove();
                target.attr({'data-status': info.status});
            } catch (er) {}

            switch (info.status) {
                case dependencies.Status.unavailable : {
                    target.find('.add-to-cart').remove();
                    // target.find('.cart-button').addClass('taken').attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['WHOIS']});
                    target.find('.price').hide();
                    target.find('.actions').prepend($.domain_search.config.templates.taken).find('.output').text(dependencies['statuses'][info['status']]['locale']).css({'visibility': 'visible'});
                    break;
                }
                case dependencies.Status.available : {
                    premiumPrice(target,info);

                    target.find('.actions .price').show().css({'visibility': 'visible'});
                    break;
                }
                case dependencies.Status.expiration :
                case dependencies.Status.conditionally : {
                    premiumPrice(target,info);

                    if(target.find('.info').length < 1){
                        target.find('.tld-name').append($.domain_search.config.templates.info);
                    }

                    target.find('.info').attr({'title': dependencies['statuses'][info['status']]['more_info']}).css({'visibility':'visible'});
                    target.find('.actions .price').show();
                    break;
                }
                case dependencies.Status.syntax :
                case dependencies.Status.unacceptable :
                case dependencies.Status.unsupported :
                case dependencies.Status.noconnection :
                case dependencies.Status.noquote :
                case dependencies.Status.registry_error :
                case dependencies.Status.registry_unavail : {
                    target.find('.actions .price').remove();
                    target.find('.actions .add-to-cart').remove();

                    if (target.find('.actions .errors').length < 1)
                        target.find('.actions').append($.domain_search.config.templates.error).find('.errors span').text(dependencies['statuses'][info['status']]['locale']).css({'visibility': 'visible'});
                    else
                        target.find('.actions .errors span').text(dependencies['statuses'][info['status']]['locale']).css({'visibility': 'visible'});

                    break;
                }
            }

            if (info.status != dependencies.Status.available && $.domain_search.config.functionality.filters.availability)
                target.find('.tld-line').hide();

            $.domain_search.currentResults[tld] = info.status;
        } else {
            addListedDomainToRecheck(target, keyword, tld);
        }
    }

    function addListedDomainToRecheck (target, keyword, tld) {
        if (! target.hasClass('pending-recheck')) {
            try {
                $.domain_search.config.functionality.rows.reroute[keyword].push(tld);
            } catch (er) {
                $.domain_search.config.functionality.rows.reroute[keyword] = [];
                $.domain_search.config.functionality.rows.reroute[keyword].push(tld);
            }

            target.addClass('pending-recheck');
        } else {
            target.removeClass('checking pending-recheck');
            target.find('.actions .price').hide();
            target.find('.actions .add-to-cart').remove();

            if (target.find('.actions .errors').length < 1)
                target.find('.actions').append($.domain_search.config.templates.error).find('.errors span').text(dependencies['statuses'][9]['locale']).css({'visibility': 'visible'});
            else
                target.find('.actions .errors span').text(dependencies['statuses'][9]['locale']).css({'visibility': 'visible'});

            if ($.domain_search.config.functionality.filters.availability)
                target.find('.tld-line').hide();

            cacheTld(keyword, tld, {'status' : 9});
        }
    }

    function premiumPrice(target,info){
        try {
            if('premium' in info && info.premium){
                var discount = target.find('.discount');

                if (discount.length) {
                    discount.removeClass('discount');
                    target.find('.price, .price-container').find('.regular-price').remove();
                    target.find('.reduced-price').removeClass('reduced-price').addClass('regular-price');
                }

                target.find('.price .vat, .price-container .vat').attr({'data-price':info.finalPrice}).text($.domain_search.management.convertPrices(info.finalPrice)).css({'visibility':'visible'});
                target.find('.premium').show();
            }else{
                target.find('.price span, .price-container').css({'visibility':'visible'});
                target.find('.premium').hide();
            }
        } catch (er) {}
    }
    
    function checkForPendingReroutes () {
        if (! $.isEmptyObject($.domain_search.config.functionality.rows.reroute)) {
            var tmp = $.domain_search.config.functionality.rows.reroute;


            $.each(tmp, function (key, tlds) {

                for (var i = 0; i < Math.ceil(tlds.length / $.domain_search.config.iteration.limit); i++) {
                    var tldsToSend = tlds.splice(0,$.domain_search.config.iteration.limit);

                    if (tldsToSend.length) {
                        sendRecheck(key,tldsToSend)
                    }
                }

                // delete $.domain_search.config.functionality.rows.reroute[key];
                if (tlds.length == 0)
                    delete $.domain_search.config.functionality.rows.reroute[key];
            });

        }
    }

    function getNotCheckedVisible () {
        if ($.active)
            return;

        // var targets = $('.tldResults:not(.pending-recheck):not(.checking):has(.tld-line:visible):has(.loading)');
        var targets = $('.tldResults:has(.tld-line:visible):has(.loading)');

        targets.addClass('checking');

        for (var i = 0; i < Math.ceil(targets.length / $.domain_search.config.iteration.limit); i++) {
            var temp = $(targets.splice(0,$.domain_search.config.iteration.limit));

            var searchable = getPendingTlds(temp);

            checkStructuresAvailability(searchable[0]);
        }
        // getPendingTlds();
    }

    function build_single_domain (target) {
        var singleResult;
        $('.list .tld-line.inactive').removeClass('inactive');

        $('.singleResult').attr({'data-categories':target.attr('data-categories'),'data-tld':target.attr('data-tld'),'data-flag':target.attr('data-flag'),'data-fqdn':target.attr('data-fqdn'),'data-product':target.attr('data-product')});

        singleResult = $('.singleResult');
        singleResult.html(singleResultHtml);
        // singleResult.find('.name').text($.domain_search.config.functionality.rows.single.keyword).attr({'data-name':$.domain_search.config.functionality.rows.single.keyword});
        singleResult.find('.tld').text($.domain_search.config.functionality.rows.single.tld);
        singleResult.find('.regular-price').html(target.find('.regular-price').html());

        //Target tld has a discount.
        if(target.find('.reduced-price').length > 0){
            singleResult.find('.reduced-price').html(target.find('.reduced-price').html());
            singleResult.find('.regular-price').addClass('discount');
        }

        //Remove source tld from the list.
        target.remove();

        //Show the single specified tld.
        $('.top-targets').removeClass('hide');

        return singleResult;
    }

    function cacheTld (keyword, tld, info) {
        if (! $.visibility_api_config.available)
            return;


        if (! currentCacheDate) {
            currentCacheDate = new Date();
            currentCacheDate.setMinutes(parseInt(currentCacheDate.getMinutes()) + 15);
        }

        try {
            $.domain_search.config.cache[keyword][tld] = {
                'status' : info.status,
                'date' : currentCacheDate.getTime()
            }
        } catch (er) {
            $.domain_search.config.cache[keyword] = {};
            $.domain_search.config.cache[keyword][tld] = {
                'status' : info.status,
                'date' : currentCacheDate.getTime()
            }
        }

        if ('premium' in info) {
            $.domain_search.config.cache[keyword][tld]['premium'] = true;
        }
    }

    function loadFromCache (keyword, keepAlive) {
        try {
            var currentDate = new Date().getTime();

            if (keyword in $.domain_search.config.cache) {
                $.each($.domain_search.config.cache[keyword], function (tld, value) {
                    var obj = $('[data-fqdn="' + keyword + '.' + tld + '"]');

                    if (value.date > currentDate && (keepAlive !== true || (keepAlive === true && $.domain_search.config.functionality.cache.keep_alive.indexOf(tld) < 0)) && ! ('premium' in value)) {
                        tldStatusUpdate(obj, keyword, tld, {status: value.status}, false);
                    }
                });
            }
        } catch (er) {}
    }

    function initUpdateLocalStorage () {
        if (! $.visibility_api_config.available)
            return;

        try {
            clearTimeout(updateLocalStorageTimer);
        } catch (er){}

        updateLocalStorageTimer = setTimeout(function () {
            updateLocalStorage();
        }, 5000);
    }

    function updateLocalStorage () {
        if ($.domain_search.config.functionality.cache.outerUpdate) {
            $.domain_search.config.functionality.cache.outerUpdate = false;
            return;
        }

        if (! $.visibility_api_config.available)
            return;

        var cacheItem = localStorage.getItem($.domain_search.config.functionality.cache.item_name), tmp;

        if (! cacheItem)
            tmp = {};
        else
            tmp = JSON.parse(cacheItem).cache;

        tmp = $.extend(tmp, $.domain_search.config.cache);

        $.domain_search.config.cache = tmp;

        localStorage.setItem($.domain_search.config.functionality.cache.item_name, JSON.stringify({cache: tmp, updater: unique_page_identifier, updatedFor : $.keys($.domain_search.config.functionality.search.keywords)}));
    }

    function domainSearchRequest (url, data) {
        return new $.ajax_prototype({
            'type'      : 'POST',
            'timeout'   : $.domain_search.config.request_timeout.check,
            'data'      : data,
            'url'       : url,
            'success'   : function (data, instance) {
                domainResponseHandler(data);
            },
            'error'     : function () {
                $.each(data.tld, function (key, tld) {
                    var target = $('[data-fqdn="' + data.keyword + '.' + tld +'"]');

                    if (target.hasClass('singleResult'))
                        addSingleDomainToRecheck(target, data.keyword, tld);
                    else
                        addListedDomainToRecheck(target, data.keyword, tld);
                });
            },
            'complete'  : function () {
                if ($.domain_search.config.functionality.filters.availability)
                    colorVisibleDomainRows();
            }
        })
    }

    function shortenName(name){
        var split, partA, partB, finalName;

        if($.getSizeClassification('medium_up') && name.length > 35){
            split = Math.floor((name.length - 1) / 4);
            partA = name.substring(0,split);
            partB = name.substring(name.length-split);
            finalName = partA + '...' + partB;
        }else if($.getSizeClassification('small') && name.length > 20){
            split = Math.floor((name.length - 1) / 8);
            partA = name.substring(0,split + 2 );
            partB = name.substring(name.length - (split + 1));
            finalName = partA + '...' + partB;
        }else{
            finalName = name;
        }
        return finalName;
    }

    function domain_rows_callback (obj, callback, args) {
        switch (callback) {
            case 'addWarning':
                addWarning(obj, args);
                break;
        }
    }

    function addWarning (obj, args) {
        var status = obj.find('.status');

        if (status.length)
            status.find('i').attr('title', args);
        else
            obj.find('.tld-name .info').attr('title', args);
    }
});

$(window).on('load', function () {
    $(document).trigger('loaded:rows');
});