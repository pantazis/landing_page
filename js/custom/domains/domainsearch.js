$(document).ready(function(){
    //Javascript dependencies
    if (!Object.keys) {
        defineObjectKeys()
    }
    $.extend({
        keys        : function(obj){
            return Object.keys(obj);
        },
        upDownTable : function(obj){
            size = obj.length - 1;
            temp = [];
            for(pos = size; pos >= 0; pos--){
                temp.push(obj[pos]);
            }
            return temp;
        }
    });

    //Project dependencies
    fundamental_vars = {
        log                 : {},
        toCart              : [],
        appliedCriteria     : {
            'categories'        : '',
            'flag'              : '',
            'availability'      : ''
        },
        filteredSelector    : {
            'categories'        : '',
            'flag'              : '',
            'availability'      : ''
        },
        filtersOn           : false,
        defaultLimit        : 20,
        templates           : {
            'taken'     : '<div class="tld-taken"><span class="output"></span></div>',
            'error'     : '<div class="errors"><span></span></div>',
            'info'      : '<span class="info"><i class="icon-info2"></i></span>',
            'checking'  : {
                'single'    : '<li><a href="#" class="button singlebuttonTargetsecondary checking">Cheking..</a></li>',
                'list'      : '<div class="add-to-cart"><a href="#" class="buttonTargetloading"><span class="spinner"></span></a></div>'
            },
            'spinner'   : '<a href="#" class="buttonTarget loading"><span class="spinner"></span></a>'
        },
        retry               : true,
        availTemp           : '<div class="row availabilityLoader"><div class="small-12 columns"><div class="results-load"><div class="loading"><span class="spinner"></span></div></div></div></div>',
        searchPos           : $('.domain-results-searchbar').position().top,
        keysLength          : 0,
        tooBigKeys          : false,
        tooSmallKeys        : false,
        invalidKeys         : false,
        bypass_cache_check  : false,
        tlds_count          : $.keys(dependencies.tldList).length,
        unresolved_pool     : [],
        gr_results          : $('[data-tld="gr"],[data-tld*=".gr"]').length,
        error_status        : false,
        startingState       : $('.resultsPanel').html(),
        startingStateSingle : $('.domain-results').html(),
        statingStateList    : $('.list')[0].outerHTML,
        keywords            : [],
        recheck_unresolved  : {},
        request_timeout     : {
            check       : 90000, //This is in milliseconds
            recheck     : 120000,
            typing      : 500
        },
        cache_lifetime      : 15,
        run_errorCheck      : false,
        previous_error      : '',
        bulk_fuzzy_error    : false
    };
    keywords = [];
    target_item = 0;
    $('select.filters').each(function () {
        var obj = $(this);

        obj.apply_chosen(obj.val());
    });


    $(document)
        .ajaxComplete(function() {
            request_completed();
        })
        .ajaxStop(function(){
            requests_finished();
        })
        .scroll(function(){
            scroll_event_handler();
        })
        .on('click','main a[href="#"]',function(e){
            e.preventDefault();
        })
        .on('click','.cart-button:not(.taken):not(.pending), .singleButtonTarget:not(.taken):not(.pending)',function(e){
            e.preventDefault();
            selectResult($(this));
        })
        .on('click','.taken',function(e){
            e.preventDefault();
        })
        .on('click','.aplly-filters',function(){
            apply_filter();
        })
        .on('click','#show_more',function(e){
            e.preventDefault();
            show_more_handler($(this));
        })
        .on('show','#show_more',function(){
            show_more_event($(this));
        })
        .on('click','dd',function(){
            var obj = $(this);

            if(obj.hasClass('disabled') && fundamental_vars.error_status && !obj.hasClass('selected'))
                return ;

            handle_dd_filter_select(obj);
        });

    $('#keyword-submit-search').on('submit',function(e){
        e.preventDefault();
        input_submit();
        document.activeElement.blur();
    });
    $('#search_btn').on('click',function(e){
        e.preventDefault();
        input_submit();
    });
    $('.searchInResults').on('input',function(){
        $('.searchInResults').val($(this).val().toLowerCase());
    });
    $('#resultsSearch')
        .on('input',function(){
            findTld($(this));
        })
        .on('keypress',function(e){
            if(e.which == 13) {
                e.preventDefault();
                findTld($(this));
            }
        });

    $(window).on('resize',function(){
        if(!$.isEmptyObject(fundamental_vars.keywords)) {
            if (fundamental_vars.keysLength == 1) {
                $('.list .name').text(shortenName(universalKeyword));
                if ($.getSizeClassification('small') && universalKeyword.length > 25) {
                    partA = universalKeyword.substring(0, 11);
                    partB = universalKeyword.substring(universalKeyword.length - 11);
                    finalName = partA + '...' + partB;
                } else if ($.getSizeClassification('large_up') && universalKeyword.length > 37) {
                    partA = universalKeyword.substring(0, 17);
                    partB = universalKeyword.substring(universalKeyword.length - 17);
                    finalName = partA + '...' + partB;
                } else {
                    finalName = universalKeyword;
                }
                $('.singleName').text(finalName);
            } else {
                $.each(fundamental_vars.keywords, function (key, value) {
                    $('.name[data-name="' + value + '"]').text(shortenName(value));
                });
            }
            if ($.getSizeClassification('large_up')) {
                if (Math.floor($(document).scrollTop()) >= $('.domain-results').position().top * 1.65 && $(window).height() > 900 && $('.domain-results-searchbar').hasClass('fixed-top') && $.getSizeClassification('xlarge')) {
                    $('.filtering').addClass('fixed-filters');
                }
                $('.filtering.fixed-filters').css({'width': $('.domains-more-results .small-12').width() + 'px'});
            } else {
                $('.filtering.fixed-filters').removeClass('fixed-filters').css({'width': ''});
            }
            if ($.getSizeClassification('small')) {
                $('.buttonTarget.taken').closest('div').hide();
                if(document.body.scrollHeight == document.body.clientHeight){ //Check if scroll is posible;
                    $('#mobileFilters').show();
                }
            } else {
                $('.buttonTarget.taken').closest('div').show();
            }
        }
    });

    //open the lateral panel
    $('.cd-btn').on('click', function(event){
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
    });
    //close the lateral panel
    $('.cd-panel').on('click', function(event){
        if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });


    search_cookie();
    enum_categories();


    $('.resultsPanel').css({'min-height':$('.filtering').height() + 200});

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
});

/**
 * INITIATE SEARCH START
 */

/**
 * Route user`s input to app`s search mechanism
 */
function input_submit () {
    initiateErrorFlags();

    var tldName = $('#search_field'),
        val     = tldName.val().toLowerCase();

    tldName.val(val);

    if(val.length > 1) {
        var typedByUser = getKeywords(tldName);
        if($.isEmptyObject(typedByUser)){
            handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.UNACCEPTABLE_SEARCH);
        } else {
            handleErrorBox('hide');
            tldName.val(rebuild_cleared_input(typedByUser));
            startSearch(typedByUser);
        }
    }else{
        $.alertHandler('',DOMAINS_LANG['DOMAIN_SEARCH']['ALERTS']['TOO_SMALL_SEARCH'],alert_box_failure);
    }
}

/**
 * Turn search terms to string.
 * @param typedByUser
 * @returns {string}
 */
function rebuild_cleared_input (typedByUser) {
    var temp = '';
    $.each(typedByUser,function(key,list){
        if(!$.isEmptyObject(list)) {
            $.each(list, function (index, tld) {
                temp += ' ' + key + '.' + tld;
            });
        }else{
            temp += ' ' + key;
        }
    });

    return temp.trim();
}

/**
 * Input preprocessor.
 * Takes the string given by the user and clears it from:
 * Internet prefixes
 * Multiple spaces
 * Spaces on the start or end.

 * Explodes the cleared string on space and creates an array of domains.
 * Gets every domain and clears it from:
 * Needless www.
 * Special Characters
 * Starting or ending dashes or dots
 * @param source
 * @returns {*}
 */
function getKeywords(source) {
    collection = {};
    input = source.val();
    if (!$.isEmptyObject(input.match(REG.ALL_ALLOWED.REGEX))) {
        //Prepare input to be split into separate domains.
        //Remove words that contain the postfix ':\\' for example 'http:\\'
        //This chars are used to define different domains  ',|;/' to spaces
        //Split input on space.
        input = input.replace(new RegExp('[' + REG.ALL_ALLOWED_EXTENDED.CHAR_SET + ']+://', 'g'), '').replace(/[,|;/]+|\s+/g, " ").trim().split(' ');
        $.each(input, function (key, value) {
            if(fundamental_vars.bulk_fuzzy_error)
                return false;

            value = value.replace(/[-]+/g, '-').replace(/[.]+/g, '.').trim();
            temp = {};
            //Get all the valid characters of each domain.
            matched = value.match(REG.ALL_ALLOWED_EXTENDED.REGEX);
            if(matched != null) {
                //Clear reconstructed domain from leading/following dashes and dots.
                treated = rebuild_domain(matched).replace(/^[.-]+|[.-]+$/g,'');
                keywordDetection(treated, temp, collection);
            }
        });
        return (fundamental_vars.bulk_fuzzy_error) ? [] : collection;
    }
    return false;
}

/**
 * Rebuild domain using the matched allowed chars.
 * @param matched
 * @returns {string}
 */
function rebuild_domain (matched){
    var treated = '';
    $.each(matched, function (key, value) {
        treated += value;
    });

    return treated;
}

/**
 * Checks the length of each domain array created and decides where the keyword is.
 * Takes the keyword and the tld it found and pushes it in a collection pool for further process.
 * @param treated
 * @param temp
 * @param collection
 * @returns {boolean}
 */
function keywordDetection(treated,temp,collection){
    if(treated != '' && treated != null) {
        treated = treated.split('.');
        if (treated.length <= 4){
            if (treated.length == 1) {
                pushToCollection(treated[0]);
            }else if (treated.length == 2) {
                pushToCollection(treated[0], treated[1]);
            } else if (treated.length == 3) {
                tld = treated[1] + '.' + treated[2];
                if (tld in dependencies['tldList']) {
                    pushToCollection(treated[0],tld);
                } else if (treated[0] == 'www') {
                    pushToCollection(treated[1],treated[2]);
                }else{
                    return false;
                }
            } else {
                tld = treated[2] + '.' + treated[3];
                if (treated[0] == 'www') {
                    pushToCollection(treated[1],tld);
                }else{
                    return false;
                }
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * Starts searching the domains given when the input is submitted.
 * The function differentiates between wildCard search and bulk search.
 * Based on the search either shows and requests part of the available domains or creates new results based on the domains requested.
 * This function is where the search is initiated.
 * The function displays the appropriate error notice as the search begins.
 * @param source
 */
function startSearch(source){
    if(!before_search())
        return ;

    if(!$.isEmptyObject(source)){
        //Set flags and vars to their initial conditions to ensure a smooth execution.
        startingConditions();
        fundamental_vars.keywords = source;

        var KeyWords = $.keys(fundamental_vars.keywords);
        logKeywords(KeyWords);
        build_search(KeyWords);
        size_scroll_to();


        //Show this error when there is no result for bulk search.
        if(fundamental_vars.keysLength > 1 && fundamental_vars.keysLength > $('.tldResults').length && $('.tldResults').length > 0){
            handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.BULK_SEARCH_ERROR);
        }

        //Save search to reuse.
        $.cookie_api('keyword', $('#search_field').val(), '', token);
    }
}

/**
 * Create domain search list.
 * @param KeyWords
 */
function build_search (KeyWords) {
    fundamental_vars.keysLength = KeyWords.length;
    if(fundamental_vars.keysLength == 1){ //One keyword is given
        build_search_for_single_domain(KeyWords);
    }else{ //Many keywords are given.
        build_search_for_multiple_domains();
    }

    fix_margins();
    colorRows();
}

/**
 * Create domain search for a single requested keyword.
 */
function build_search_for_single_domain (KeyWords){
    universalKeyword = KeyWords[0];
    finalName = shortenName(universalKeyword);
    domain_name_builder();

    //Cycle through the specified tlds
    if(!$.isEmptyObject(fundamental_vars.keywords[universalKeyword])){
        handle_requested_domains();
    }

    single_keyword_special_prices();

    $('.tld-line:hidden:lt(' + fundamental_vars.defaultLimit + ')').show();
    createRequests();
}

/**
 * Update domain name and fqdn with the single given keyword.
 */
function domain_name_builder () {
    $('.list .tldResults').each(function(){
        tld = $(this).attr('data-tld');
        $(this).attr({'data-fqdn': universalKeyword + '.' + tld}).find('.name').attr({'data-name':universalKeyword}).text(finalName);
    });
}

/**
 * Apply special prices for a single keyword search.
 */
function single_keyword_special_prices () {
    //The given keyword is 2 chars long. Special prices must be applied and remove discounts;
    if(universalKeyword.length == 2){
        $.each(dependencies.tldList, function (key,value) {
            if('p' in value.s && typeof value.s.p.t[dependencies.t_id] != 'undefined'){
                price = value.s.p.t[dependencies.t_id] ;
                target = $('[data-tld="' + key + '"]').find('.price, .price-container');
                target.removeClass('discount');
                target.find('.regular-price .vat').attr({'data-price':price}).text(convertPrices(price));
                target.find('.reduced-price').remove();
            }
        });
    }
}

/**
 * Bring requested domains to the domains list top.
 */
function handle_requested_domains () {
    if(fundamental_vars.keywords[universalKeyword].length == 1){
        //If name is to big shorten name's presentation to fit on this screen width.
        finalName = single_domain_keyword_length_fix();
        tld = fundamental_vars.keywords[universalKeyword][0];

        var target = $('.list [data-tld="' + tld + '"]'),
            singleResult = build_single_domain(target);

        //Target tld has a discount.
        if(target.find('.reduced-price').length > 0){
            singleResult.find('.reduced-price').html(target.find('.reduced-price').html());
            singleResult.find('.regular-price').addClass('discount');
        }

        //Remove source tld from the list.
        target.remove();

        //Show the single specified tld.
        $('.top-targets').removeClass('hide');
    }else{// Many specific domains requested.

        //Since the specified tlds are more than one then bring them to the top of the list in the order the user typed them.
        $.each($.upDownTable(fundamental_vars.keywords[universalKeyword]),function(key,value){
            $('.list').prepend($('[data-tld="' + value + '"]'));
        });
    }
}

/**
 * If required shorten keyword.
 * @returns {string}
 */
function single_domain_keyword_length_fix () {
    if($.getSizeClassification('small') && universalKeyword.length > 25){
        partA = universalKeyword.substring(0,11);
        partB = universalKeyword.substring(universalKeyword.length - 11);
        var finalName = partA + '...' + partB;
    }else if($.getSizeClassification('large_up') && universalKeyword.length > 37){
        partA = universalKeyword.substring(0,15);
        partB = universalKeyword.substring(universalKeyword.length - 15);
        finalName = partA + '...' + partB;
    }else{
        finalName = universalKeyword;
    }

    return finalName;
}

/**
 * Convert a domain list line to a single domain object.
 * @param target
 */
function build_single_domain (target) {
    var singleResult;
    $('.list .tld-line.inactive').removeClass('inactive');
    $('.singleResult').attr({'data-categories':target.attr('data-categories'),'data-tld':target.attr('data-tld'),'data-flag':target.attr('data-flag'),'data-fqdn':target.attr('data-fqdn'),'data-product':target.attr('data-product')});
    singleResult = $('.singleResult');
    singleResult.find('.name').text(finalName).attr({'data-name':universalKeyword});
    singleResult.find('.tld').text(tld);
    singleResult.find('.regular-price').html(target.find('.regular-price').html());

    return singleResult;
}

/**
 * Create domain search for multiple requested keywords.
 */
function build_search_for_multiple_domains () {
    $('select.filters').chosen_disable();

    //Deactivate filters for bulk search.
    $('dl').addClass('inactive');
    $('dd').addClass('disabled');
    $('.list, .show-more-btn').remove(); //Remove active list.

    //Create a list of tlds for each keyword given.
    $.each(fundamental_vars.keywords,function(key,tldList){
        $('.resultsPanel').append(fundamental_vars.statingStateList);

        current_list = $('.list:last');
        var finalName = shortenName(key);
        current_list.find('.tldResults').each(function(){
            tld = $(this).attr('data-tld');
            $(this).attr({'data-fqdn': key + '.' + tld}).find('.name').attr({'data-name':key}).text(finalName);
        });

        $.each(tldList,function(key,value){
            current_list.find('[data-tld="' + value + '"] .tld-line').show();
        });
    });

    createRequests($('.tld-line:visible'));

    $('.list').show();
}

/**
 * Fix margins based on request.
 */
function fix_margins () {
    if(fundamental_vars.keysLength == 1 && fundamental_vars.keywords[universalKeyword].length == 1){
        $('.domain-results').addClass('search-margin');
        $('.domains-more-results').removeClass('search-margin');
    }else{
        $('.domain-results').removeClass('search-margin');
        $('.domains-more-results').addClass('search-margin');
    }
}

/**
 * Scroll window to top based on window`s size.
 */
function size_scroll_to () {
    if($.getSizeClassification('large_up')){
        $(window).scrollTop(0);
    }else{
        target = $('.top-targets:visible');
        $('html, body').animate({ scrollTop: target.offset().top}, 500);
    }
}

/**
 * Do before search.
 * @returns {boolean}
 */
function before_search () {
    if(!display_initiation_errors())
        return false;

    return true;
}

/**
 * Handle all possible errors before search begins.
 * @returns {boolean}
 */
function display_initiation_errors (){
    if(!syntax_errors())
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
function syntax_errors () {
    if(fundamental_vars.invalidKeys){
        $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.INVALID_KEYS, alert_box_warning);
        return false;
    }

    if(fundamental_vars.tooBigKeys || fundamental_vars.tooSmallKeys){
        if(fundamental_vars.tooBigKeys && fundamental_vars.tooSmallKeys ){
            $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.ILLEGAL_KEY_LENGTH, alert_box_warning);
            fundamental_vars.tooBigKeys = false;
            fundamental_vars.tooSmallKeys = false;
        }else if(fundamental_vars.tooBigKeys){
            $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.TOO_BIG_KEYWORDS, alert_box_warning);
            fundamental_vars.tooBigKeys = false;
        }else if(fundamental_vars.tooSmallKeys){
            $.alertHandler('', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.TOO_SMALL_KEYWORDS, alert_box_warning);
            fundamental_vars.tooSmallKeys = false;
        }
        return false;
    }

    return true;
}

/**
 * Search a previously saved cookie.
 */
function search_cookie () {
    if(dependencies.postKeyword != ''){
        $('#search_field').val(dependencies.postKeyword);
        $('#search_btn').click();
    }else if(Cookies.get('tokenMismatch')){
        $('#search_field').val(Cookies.get('tokenMismatch'));
        Cookies.remove("tokenMismatch");
        $('#search_btn').click();
    }else if(!$.isEmptyObject(dependencies.cKeywords)){
        search = '';
        $('.domains-more-results').show();
        $.each(dependencies['cKeywords'], function(key,value){
            search += value['keyword'];
            if(value['tld'] !== null){
                search += '.' + value['tld'] + ' ';
            }else{
                search += ' ';
            }
        });
        search = search.trim();
        $('#search_field').val(search).trigger('input');
        input_submit();
    }
}

/**
 * Sets elements and required vars to a starting condition on the beginning of search.
 */
function startingConditions(){
    $('dl,dd').removeClass('inactive');
    $('.domains-more-results').removeClass('hide');
    $('.domain-results').addClass('hide');
    $('.list, div.filters').show();
    $('.filters-on-use').text(DOMAINS_LANG['DOMAIN_SEARCH']['HEAD_TEXT']['ALL']);
    $('dd').removeClass('selected');
    $('.searchInResults').val('');

    $('.resultsPanel').html(fundamental_vars.startingState);
    $('.domain-results').html(fundamental_vars.startingStateSingle);

    if(!($('.domains-more-results').is(':visible'))) {
        $('.domains-more-results').show();
    }


    temp = [];
    fundamental_vars.filtersOn = false;
    fundamental_vars.retry = true;
    universalKeyword = null;
}

/**
 * INITIATE SEARCH END
 */


/**
 * FILTERING START
 */

/**
 * Perform the preparations required to apply the filters selected through the "dd" elements
 * @param obj
 */
function handle_dd_filter_select (obj) {
    //Log filters
    log_selected_dd_filters(obj);

    selected_dd = $('dd.selected');
    fundamental_vars.filtersOn = selected_dd.length > 0;
    $('#resultsSearch, #mobileResultsSearch').val('');

    if(fundamental_vars.filtersOn){
        $('.filters-on-use').text($.upDownTable(selected_dd.map(function () {
            return $(this).text();
        })).join(' + ').replace(/ \([0-9]+\)/,''));
    }else{
        $('.filters-on-use').text(DOMAINS_LANG.DOMAIN_SEARCH.HEAD_TEXT.ALL);
    }

    apply_selector();
}

/**
 * Add filter action to the filters log
 * @param obj
 */
function log_selected_dd_filters (obj) {
    if (obj.hasClass('selected')) {
        obj.removeClass('selected');
        remove_dd_filter_from_logs (obj)
    } else if(fundamental_vars.keysLength == 1){
        obj.closest('dl').find('dd').removeClass('selected');
        obj.addClass('selected');
        add_dd_filter_to_logs(obj);
    }
}

/**
 * Remove the target filter from the log
 * @param obj
 */
function remove_dd_filter_from_logs (obj) {
    if(obj.hasClass('category')){
        fundamental_vars.appliedCriteria.categories = '';
        fundamental_vars.filteredSelector.categories = '';

        mobile_cat_filter = $('select.category');
        if(mobile_cat_filter.val() != ''){
            mobile_cat_filter.chosen_update('all');
        }else{
            mobile_cat_filter.chosen_update('');
        }

    }else if(obj.hasClass('flag')) {
        fundamental_vars.appliedCriteria.flag = '';
        fundamental_vars.filteredSelector.flag = '';

        mobile_flag_filter = $('select.flag');
        if(mobile_flag_filter.val() != ''){
            mobile_flag_filter.chosen_update('all');
        }else{
            mobile_flag_filter.chosen_update('');
        }
    }else{
        fundamental_vars.appliedCriteria.availability = '';
        fundamental_vars.filteredSelector.availability = '';

        mobile_avail_filter = $('select.availability');
        if(mobile_avail_filter.val() != ''){
            mobile_avail_filter.chosen_update('all');
        }else{
            mobile_avail_filter.chosen_update('');
        }
    }
}

/**
 * Add the target filter from the log
 * @param obj
 */
function add_dd_filter_to_logs (obj) {
    target = obj.attr('data-target');
    if(obj.hasClass('category')){
        fundamental_vars.appliedCriteria.categories = target;
        fundamental_vars.filteredSelector.categories = '[data-categories*="Cat' + target + ',"]';
        $('select.category').chosen_update(target);
    }else if(obj.hasClass('flag')) {
        if(typeof target != 'undefined'){
            fundamental_vars.appliedCriteria.flag = target;
            $('select.flag').chosen_update(target);
            fundamental_vars.filteredSelector.flag = '[data-flag*="Flag' + target + ',"]';
        }else if(obj.hasClass('favorite')){
            fundamental_vars.appliedCriteria.flag = 'favorite';
            fundamental_vars.filteredSelector.flag = '.my-favorite';
            $('select.flag').chosen_update('favorite');
        }else{
            fundamental_vars.appliedCriteria.flag = 'discount';
            fundamental_vars.filteredSelector.flag = '.has-discount';
            $('select.flag').chosen_update('discount');
        }
    }else{
        fundamental_vars.appliedCriteria.availability = target;
        $('select.availability').chosen_update(target);
    }
}

/**
 * Apply filters for handheld devices and small screens
 */
function apply_filter () {
    $.each(fundamental_vars.appliedCriteria,function(key){
        fundamental_vars.appliedCriteria[key] = '';
        fundamental_vars.filteredSelector[key] = '';
    });

    if ($('#mobileResultsSearch').val().length > 0){
        findTld($('#mobileResultsSearch'));
        $('.cd-panel').removeClass('is-visible');
        $('dd').removeClass('selected');
        $('select.filters').each(function(){
            if($(this).val() != '' && $(this).val() != null){
                $(this).chosen_update('all');
            }
        });
    } else {
        //Find if filters are set.
        $('.searchInResults').val('');
        filters_for_medium = $('.filters-for-medium');
        medium_selects = filters_for_medium.find('select');
        selected_options = medium_selects.find('option:not([value=""]):not([value="all"]):selected');

        fundamental_vars.filtersOn = selected_options.length > 0;

        //Create filter logs if filters are applied
        if(selected_options.length){
            var category = $('.filters.category option:not([value=""]):not([value="all"]):selected');
            if(category.length){
                fundamental_vars.appliedCriteria.categories = category.val();
                fundamental_vars.filteredSelector.categories = '[data-categories*="Cat' + category.val() + ',"]';
                $('dd.category[data-target="' + category.val() + '"]').addClass('selected');
            }else{
                $('dd.category').removeClass('selected');
            }

            var flag = $('.filters.flag option:not([value=""]):not([value="all"]):selected');
            if(flag.length){
                fundamental_vars.appliedCriteria.flag = flag.val();
                if($.isNumeric(flag.val())) {
                    fundamental_vars.filteredSelector.flag = '[data-flag*="Flag' + flag.val() + ',"]';
                    $('dd.flag[data-target="' + flag.val() + '"]').addClass('selected');
                } else if(flag.val() == 'favorite') {
                    fundamental_vars.filteredSelector.flag = '.my-favorite';
                    $('dd.flag.favorite').addClass('selected');
                } else {
                    fundamental_vars.filteredSelector.flag = '.has-discount';
                    $('dd.flag.discount').addClass('selected');
                }
            }else{
                $('dd.flag').removeClass('selected');
            }

            var availability = $('.filters.availability option:not([value=""]):not([value="all"]):selected');
            if(availability.length){
                fundamental_vars.appliedCriteria.availability = availability.val();
                $('dd.availability[data-target="' + availability.val() + '"]').addClass('selected');
            }else{
                $('dd.availability').removeClass('selected');
            }
        }

        if(fundamental_vars.filtersOn) {
            $('.filters-on-use').text(
                $.upDownTable($('select.filters').map(function () {
                    option = $(this).find('option:selected');
                    if(option.length && option.val() != 'all' && option.val() != ''){
                        return option.text();
                    }
                })).join(' + ').replace(/ \([0-9]+\)/,'')
            );
        }else{
            $('.filters-on-use').text(DOMAINS_LANG['DOMAIN_SEARCH']['HEAD_TEXT']['ALL']);
        }

        apply_selector();

        $('.cd-panel').removeClass('is-visible');
    }
    if ($('#mobileResultsSearch').val() == '' && $('select.filters').filter(function(){ return $(this).val() == null || $(this).val() == "all"}).length == 3){
        $('.tldResults').show();
    }
    if (searchVisibleResults().length > 0){
        $('.list').removeClass('hide');
    }else{
        $('.list').addClass('hide');
    }
}

/**
 * FILTERING END
 */


/**
 * REQUEST FACTORY START
 */

/**
 * Passes through each tld and sends it.
 * Calls the getTlds to create and sent the requests.
 * @param target
 */
function createRequests(target){
    requestOn = true;
    requests = {};
    enomBuffer = [];
    grBuffer = [];

    var targets = create_request_targets(target);

    //Count how many gr domains are picked.
    grs_found = targets.filter(function(){return filter_gr_form_targets ($(this).closest('[data-tld]')); }).length;

    //Loop through each keyword and find the domains that contain it.
    $.each(fundamental_vars.keywords, function(keyword){
        requests[keyword] = [];

        $.each(targets.filter(function(){
            return $(this).closest('[data-fqdn^="' + keyword + '."]').length;
        }),function(){
            var tld = $(this).closest('.tldResults:visible, .singleResult:visible').attr('data-tld');

            build_request_obj(keyword, tld);
        });

        //If Enom's buffer is not empty then push it to the request object.
        if(!$.isEmptyObject(enomBuffer)){
            requests[keyword].push(enomBuffer);
            enomBuffer = [];
        }

        //Mark targets as asked before the requests are sent.
    });

    sendRequest(requests,'');
}

/**
 * Central request obj factory.
 * @param keyword
 * @param tld
 */
function build_request_obj (keyword, tld) {
    //Check if the tld in question exists in registries array.
    if('.' + tld in dependencies.registries){
        request_by_registry(keyword, tld);
    }else{
        request_without_registry(keyword, tld)
    }
}

/**
 * Request creation for those domains with registry defined.
 * @param keyword
 * @param tld
 */
function request_by_registry (keyword, tld) {
    if($.compare_two_strings(dependencies.registries['.' + tld],dependencies.grRegistry)){
        grBuffer.push(tld);
        if(grBuffer.length == fundamental_vars.gr_results || grBuffer.length == grs_found){
            requests[keyword].push(grBuffer);
        }
    }else{
        requests[keyword].push([tld]);
    }
}

/**
 * Request creation without registry dependency.
 * @param keyword
 * @param tld
 */
function request_without_registry (keyword, tld) {
    if(cacheCheck(keyword,tld) == null){
        var target = $('[data-fqdn="' + keyword + '.' + tld + '"]');
        info = fundamental_vars.log[keyword][tld];
        ajax_response_apply(target, info);
    }else{
        enomBuffer.push(tld);
    }

    //When the buffers length reach the maximum aloud push the buffers content to the request object.
    if(enomBuffer.length >= fundamental_vars.defaultLimit){
        requests[keyword].push(enomBuffer);
        enomBuffer = [];
    }
}

/**
 * Collect the domains to be requested.
 * @param target
 * @returns {*|jQuery}
 */
function create_request_targets (target) {
    if(typeof target === 'undefined') {
        // If there is no target specified then pick the visible domains that still have spinner.
        if (fundamental_vars.keysLength == 1) {
            var targets = $('.singleResult:visible').filter(':has(.checking)');
            $.merge(targets, $('.tld-line:visible').filter(':has(.spinner)'))
        } else {
            targets = $('.tld-line:visible').filter(':has(.spinner)');
        }
        targets = targets.filter(':not(.asked)');
    }else{
        targets = target;
    }

    return targets;
}

/**
 * Check if current tld is a "GR" variation
 * @param tld
 * @returns {boolean}
 */
function filter_gr_form_targets (tld) {
    return tld.attr('data-tld').indexOf('.gr') > -1 || tld.attr('data-tld') == 'gr'
}

/**
 * Break request object and send it to server piece by piece.
 * @param requests
 * @param action
 */
function sendRequest(requests, action){
    //Check if this request is a check or a recheck to route it correctly.
    if(typeof action === 'undefined' || action == ''){
        $.each(requests,function(keyword,tlds){
            $.each(tlds,function(key,tld_list){
                logTlds(keyword,tld_list);
                send_request_obj (keyword, tld_list);
            });
        })
    }else{
        KeyWord = requests[0];
        tld     = requests[1];
        if(! (KeyWord in fundamental_vars.recheck_unresolved)) {
            fundamental_vars.recheck_unresolved[KeyWord] = [];
        }
        var temp_list = null;

        tld_length = Math.floor(tld.length / 5);

        //Loop through the listed tlds and group them by five and execute the request.
        for(i = 0; i <= tld_length; i++){
            temp_list = tld.slice(0,5);
            tld.splice(0,5);
            recheckTld(KeyWord,temp_list);
        }
    }
}

/**
 * Send a request to the server.
 * @param keyword
 * @param tld_list
 */
function send_request_obj (keyword, tld_list) {
    $.ajax({
        type        : "POST",
        url         : baseUrl + "/api/domains/check",
        data        : {
            keyword: keyword,
            tld: tld_list,
            _token: $('[name="_token"]').val()
        },
        timeout     : fundamental_vars.request_timeout.check,
        success     : function (data) {
            request_obj_response (data);
        },
        error       : function(){
            fundamental_vars.run_errorCheck = true;
        },
        complete    : function (response) {
            globalErrorsHandler(response)
        }
    });
}

/**
 * Handle request`s response;
 * @param data
 */
function request_obj_response (data) {
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
        reroute = [];
        //Check if the server's response is appropriate for processing.
        if($.isPlainObject(data) && 'data' in data && $.isPlainObject(data.data) && !$.isEmptyObject(data.data)) {
            $.each(data.data,function(keyword,tlds){
                if($.isPlainObject(tlds) && !$.isEmptyObject(tlds)) {
                    update_tld (keyword, tlds);

                    ///If there are tlds in reroute send them in a last request.
                    if (!$.isEmptyObject(reroute)) {
                        reroute_tld_request (keyword);
                    }
                }
            });
        }else{
            fundamental_vars.run_errorCheck = true;
        }
    }
}

/**
 * Handle tld update.
 * @param keyword
 * @param tlds
 */
function update_tld (keyword, tlds) {
    $.each(tlds, function (tld, info) {
        target = $('[data-fqdn="' + keyword + '.' + tld + '"]');
        updateCache(keyword, tld, info);

        target.find('.tld-line').addClass('asked');
        //If the domain's status is not reroute then call the ajaxResponse else push it to reroute pool.
        if (info.status != dependencies['Status']['reroute']) {
            ajax_response_apply(target, info);
        } else {
            reroute.push(tld);
            //When reroute pool reach the limit a request is performed.
            if (reroute.length >= fundamental_vars.defaultLimit) {
                reroute_tld_request (keyword);
            }
        }
    });
}

/**
 * Send an object for recheck
 * @param keyword
 */
function reroute_tld_request (keyword){
    sendRequest([keyword, reroute], true);
    reroute = [];
}

/**
 * REQUEST FACTORY END
 */


/**
 * RESPONSE HANDLER START
 */

/**
 * Manages the way info appears for the targeted domain either on ".singleResult" or ".list".
 * It takes care of the status and notices visualization and price fixing wherever it is needed.
 * Also marks as selected those domains that where selected by user and informs him if a selected domain was taken by the time he selected it.
 * @param target
 * @param info
 */
function ajax_response_apply(target,info){
    var fqdn = target.attr('data-fqdn');
    if (target.find('.spinner').length > 0 || target.find('.checking').length > 0) { //Check if the domain is pending answer. Apply info only if it is pending answer.

        if(typeof info.status !== 'undefined'){
            //Is the targeted domain the single specified domain by the user?
            if (target.hasClass('singleResult')) {
                single_domain_show_results(target, info);
            } else {
                listed_domains_show_results(target, info);
            }
        }else{
            fundamental_vars.run_errorCheck = true;
        }
    }

    //If this domain is added to the cart it might need an update.
    // update_domains_in_cart (fqdn, target);
}

/**
 * Apply response to the single domain.
 * @param target
 * @param infor
 */
function single_domain_show_results (target, info) {
    target.find('.checking').removeClass('checking');
    single_domain_status_handler(target,info);
    if (typeof info.premium != 'undefined') {
        target.find('.inline-list').prepend('<li class="premium" title="' + dependencies.premiumTitle + '"></li>');

        var strikethrough = target.find('.strikethrough');
        strikethrough.after('<span class="regular-price">' + strikethrough.html() + '</span>');
        strikethrough.remove();
    }
    if (icon == "info2") {
        target.find('i').attr({'title': dependencies['statuses'][info['status']]['more_info']});
    }
    //Remove each of the prices (regular/reduced) if they are empty and remove the price list if both prices are empty.
    pricesLi = target.find('.price-container');
    if (target.find('.regular-price').html() == ''){
        target.find('.regular-price').remove();
    }
    if (target.find('.reduced-price').html() == ''){
        target.find('.reduced-price').remove();
    }
    if (target.find('.regular-price').length < 1 && target.find('.reduced-price').length < 1){
        pricesLi.remove();
    }
    if(target.find('.price-container').css('visibility') == 'hidden'){
        target.find('.price-container').css({'visibility':'visible'});
    }
}

/**
 * Fix the status for the single domain.
 * @param target
 * @param info
 */
function single_domain_status_handler (target,info) {
    statusText = dependencies['statuses'][info['status']]['locale_single'];
    icon = '';
    if (info.status == dependencies.Status.available) { //The domain is available
        premiumPrice(target,info);
        icon = "checkmark";
        target.find('.price-container').show();
        target.find('.singleButtonTarget').removeClass('secondary').text(DOMAINS_LANG['DOMAIN_SEARCH']['BUTTON_TEXTS']['ADD_TO_CART']).attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['ADD_TO_CART']});
    } else if (info.status == dependencies.Status.unavailable) { //The domain is unavailable(taken)
        icon = "cross3";
        target.find('.price-container').hide();
        // target.attr({'data-price-final':'-'}).find('.singleButtonTarget').addClass('secondary taken').text('Whois').attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['SEE_DOMAIN_INFO']});
        target.attr({'data-price-final':'-'}).find('.singleButtonTarget').addClass('secondary taken').text(dependencies['statuses'][info['status']]['locale']).attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['UNAVAILABLE']});
    } else if (info.status == dependencies.Status.expiration || info.status == dependencies.Status.conditionally) { //The domain is in expiration period or is available conditionally.
        premiumPrice(target,info);
        icon = "info2";
        target.find('.price-container').show();
        target.find('.button').removeClass('secondary').text(DOMAINS_LANG['DOMAIN_SEARCH']['BUTTON_TEXTS']['ADD_TO_CART']).attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['ADD_TO_CART']});
    } else { //Some non fatal error occurred. See dependencies.Status
        icon = "cross3";
        target.find('.price-container').hide();
        statusText = dependencies['statuses'][dependencies['Status']['unavailable']]['locale_single'];
        target.attr({'data-price-final':'-'}).find('.inline-list').empty().append('<li class="errors">' + dependencies['statuses'][info['status']]['locale_single'] + '</li>');
    }

    mark_domains_in_cart(target, info);
    target.find('.status').html(statusText + '<i class="icon-' + icon + '"></i>');
}

/**
 * Apply results to the domains in list.
 * Preset the domain to available. Many of the other statuses depend on available scheme.
 * @param target
 * @param info
 */
function listed_domains_show_results (target, info) {
    target.find('.buttonTarget').removeClass('loading').addClass('cart-button').attr({'title': DOMAINS_LANG.DOMAIN_SEARCH.TITLES.ADD_TO_CART}).find('span').remove();
    target.attr({'data-status':info.status});

    if (info.status != dependencies.Status.available) {
        if (info.status == dependencies.Status.unavailable) {
            // target.find('.cart-button').addClass('taken').attr({'title': DOMAINS_LANG.DOMAIN_SEARCH.TITLES['SEE_DOMAIN_INFO']});
            target.find('.cart-button').addClass('taken').attr({'title': DOMAINS_LANG['DOMAIN_SEARCH']['TITLES']['UNAVAILABLE']});
            target.find('.price').hide();
            target.find('.actions').prepend(fundamental_vars.templates['taken']).find('.output').text(dependencies['statuses'][info['status']]['locale']).css({'visibility':'visible'});
        } else if (info.status == dependencies.Status.expiration || info.status == dependencies.Status.conditionally) {
            premiumPrice(target,info);
            if(target.find('.info').length < 1){
                target.find('.tld-name').append(fundamental_vars.templates['info'])
            }

            target.find('.info').attr({'title': dependencies['statuses'][info['status']]['more_info']}).css({'visibility':'visible'});
            target.find('.actions .price').show();
        } else { //Some non fatal error occurred. See dependencies.Status
            target.find('.actions .price').hide();
            target.find('.actions .add-to-cart').hide();
            if(target.find('.actions .errors').length < 1)
                target.find('.actions').append(fundamental_vars.templates['error']).find('.errors span').text(dependencies['statuses'][info['status']]['locale']).css({'visibility':'visible'});
            else
                target.find('.actions .errors span').text(dependencies['statuses'][info['status']]['locale']).css({'visibility':'visible'});
        }
    } else {
        //If the domain is available then check the premium price.
        premiumPrice(target,info);
        target.find('.actions .price').show();
    }

    mark_domains_in_cart(target, info);
    if (typeof info.premium !== 'undefined') {
        target.find('.premium').show();

        var strikethrough = target.find('.strikethrough');
        strikethrough.after('<span class="regular-price">' + strikethrough.html() + '</span>');
        strikethrough.remove();
    }
    if(target.find('.price span').css('visibility') == 'hidden'){
        target.find('.price span').css({'visibility':'visible'});
    }
}

/**
 * Inform all those domains in cart with the new information taken by the registry.
 * @param fqdn
 * @param target
 */
function update_domains_in_cart (fqdn, target) {
    if(fundamental_vars.toCart.indexOf(fqdn) > -1){
        //If while the user was searching this domains was taken the cart should be updated and show a notification.
        if(target.find('.cart-button').hasClass('taken')) {
            fundamental_vars.toCart = $.grep(fundamental_vars.toCart, function(val){
                return val != fqdn;
            });

            $.alertHandler('',DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.DOMAIN_TAKEN,alert_box_warning);
        }else{
            //This domain is still available mark it as available.
            if (!$.isEmptyObject(startingStateCart)) {
                target.find('.cart-button, .singleButtonTarget').addClass('selected');
            } else {
                target.find('.cart-button, .singleButtonTarget').trigger('click');
            }
        }
    }
}

/**
 * Called by ajax_response_apply checks if the targeted domain has premium name.
 * If that's true it forms the pricing and notices accordingly.
 * @param target
 * @param info
 */
function premiumPrice(target,info){
    if('premium' in info && info.premium){
        target.find('.discount').removeClass('discount');
        target.find('.price, .price-container').find('.reduced-price').remove();
        target.find('.price .vat, .price-container .vat').attr({'data-price':info.finalPrice}).text(convertPrices(info.finalPrice)).css({'visibility':'visible'});

        try {
            delete  fundamental_vars.log[target.attr('data-fqdn').split('.')[0]][target.attr('data-tld')];
        } catch (er) {}
    }else{
        target.find('.price span, .price-container').css({'visibility':'visible'});
    }
}

function mark_domains_in_cart (target, info) {
    var fqdn = target.attr('data-fqdn');
    if(!$.isEmptyObject(dependencies.domains_in_cart) && fqdn in dependencies.domains_in_cart) {
        if (info.status == dependencies.Status.available || info.status == dependencies.Status.expiration || info.status == dependencies.Status.conditionally) {
            target.attr('data-cart-item-id', dependencies.domains_in_cart[fqdn].cart_item_id).find('.cart-button, .singleButtonTarget').addClass('selected');
        }else{
            delete_from_cart_request (target.find('.cart-button, .singleButtonTarget'), dependencies.domains_in_cart[fqdn].cart_item_id);
            target.attr('data-cart-item-id', '').find('.cart-button, .singleButtonTarget').removeClass('selected');
        }
    }
}

/**
 * RESPONSE HANDLER END
 */


/**
 * FIND TLD START
 */

/**
 * Finds a domain in all results based on the handlers value.
 * Also creates a new result for each tld missing on a bulk search.
 * @param handler
 */
function findTld(handler){
    prepare_app_to_find_tld(handler);

    if($('.list .tld-line.asked').length > 0 && handler.val() != ''){
        //Clear the search term and print it to result headers.
        var tld = handler.val().trim().replace(/^[.]/,'');

        fundamental_vars.error_status = false;
        $('.list .tld-line').hide();
        $('.filters-on-use').text(tld);

        // Kill any running timer for typing.
        if(typeof typing_finished != 'undefined'){
            clearTimeout(typing_finished);
        }

        if (fundamental_vars.keysLength == 1) {
            single_keyword_find_tld($('.list [data-tld*="' + tld + '"], .singleResult[data-tld="' + tld + '"]'), tld);
        } else {
            multiple_keywords_find_tld($('.list [data-tld*="' + tld + '"]'), tld);
        }

        $('#show_more').hide();
    }else{
        empty_find_tld_handle();
    }
    colorRows();
}

/**
 * App initialization to support the find tld function.
 */
function prepare_app_to_find_tld (handler) {
    $('dd').removeClass('selected');
    $('select.filters').each(function () {
        if (handler.val() != '' && handler.val() != null) {
            handler.chosen_update('all');
        }
    });

    $('.availabilityLoader').remove();
    $.each(fundamental_vars.appliedCriteria,function(key){
        fundamental_vars.appliedCriteria[key] = '';
        fundamental_vars.filteredSelector[key] = '';
    });
    fundamental_vars.filtersOn = false;
    $('.list').show();
    handleErrorBox('hide');
}

/**
 * Find all domains matching the search term for a single keyword.
 * @param target
 * @param tld
 */
function single_keyword_find_tld (target, tld) {
    //Reveal the targets and highlight the search term.
    $.each(target,function(){
        colorSearch($(this),tld);
        $(this).find('.tld-line').show();
    });

    // If half a second is passed without input that means that typing is finished and the requests must be sent.
    typing_finished = setTimeout(function(){
        //Filter selected target to get only those pending data.
        target = target.has('.spinner').not(':has(.asked)');
        if(target.length){
            createRequests(target.find('.tld-line'));
        }
    },fundamental_vars.request_timeout.typing);
}

/**
 * Find all domains matching the search term for all given keywords.
 * @param target
 * @param tld
 */
function multiple_keywords_find_tld (target, tld) {
    target.show();
    target.each(function(){
        var result = $(this);
        colorSearch(result,tld);
        result.find('.tld-line').css({'visibility': 'visible'}).show();
    });

    // If half a second is passed without input that means that typing is finished and the requests must be sent.
    typing_finished = setTimeout(function(){
        fundamental_vars.search_in_results_unresolved = [];

        // The requests must be sent for each keyword only if there is no other request active. If there is an active request send those pending in a pool.
        $.each($.keys(fundamental_vars.keywords),function(key,value){
            if(jQuery.active < 1){
                target = $('[data-fqdn^="' + value + '"] .tld-line:has(.spinner):visible');
                if(target.length) {
                    createRequests(target);
                }
            }else{
                fundamental_vars.search_in_results_unresolved.push(value);
            }
        });
    },fundamental_vars.request_timeout.typing);
}

/**
 * Show all results if tld search is empty.
 */
function empty_find_tld_handle () {
    fundamental_vars.error_status = false;
    fundamental_vars.filtersOn = false;

    $('.filters-on-use').text(DOMAINS_LANG['DOMAIN_SEARCH']['HEAD_TEXT']['ALL']);
    $('.tldResults').show();
    $('.tld-line').hide();
    $('.asked').show();
    $('#show_more').show();

    $('.tldResults:has(.colored_tld)').each(function(){
        $(this).find('.tld').text($(this).attr('data-tld'));
    });
}

/**
 * FIND TLD END
 */


/**
 * CART CONTROLLER START
 */

/**
 * When a .cart-button is clicked this function is called.
 * This function sets/unsets the selected class based on the state of the trigger element.
 * This function can handle requests from .list and .cart.
 * Based on where the request came it can either create an element on .cart or remove it.
 * If creating an element on .cart isn't a matter of copy/paste it creates a new element based on the stats of the source element.
 * @param source
 */
function selectResult(source){
    result = source.addClass('pending').closest('.tldResults,.singleResult');
    fqdn = result.data('fqdn');

    if(source.hasClass('selected')){
        delete_from_cart_request(source);
    }else{
        add_to_cart_request(source);
    }
}

function add_to_cart_request (obj) {
    var tld_cont = obj.closest('.tldResults, .singleResult');

    obj.addClass('selected');
    $.ajax({
        type        : "POST",
        url         : baseUrl + "/cart/add",
        data        : {
            fqdn        : tld_cont.attr('data-fqdn'),
            action      : 'register',
            settings    : {},
            _token      : $('[name="_token"]').val(),
            unique_id   : unique_page_identifier
        },
        timeout     : fundamental_vars.request_timeout.check,
        success     : function (data) {
            add_to_cart_response(data, tld_cont, obj);
        },
        error       : function (data) {
            if(data.statusText == 'timeout')
                obj.removeClass('selected');
            else
                add_to_cart_response_error (null, tld_cont, obj);
        },
        complete    : function (response) {
            setTimeout(function () {
                obj.removeClass('pending');
            }, 150);
            globalErrorsHandler(response)
        }
    });
}

function add_to_cart_response (data, tld_cont, obj) {
    if(data.success) {
        //Item was added to cart - send add_to_cart event to analytics
        if (app_env != 'local' && 'remarketing_items' in data.data)
            $.sendAddToCartRemarketingEvent(data.data.remarketing_items);

        tld_cont.attr('data-cart-item-id',data.data.id);
        $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);

        dependencies.domains_in_cart[data.data.name] = {cart_item_id : data.data.id};
    }else{
        add_to_cart_response_error(data, tld_cont, obj);
    }

    tld_cont.find('.pending').removeClass('pending');
}

function add_to_cart_response_error (data, tld_cont, obj) {
    if(data) {
        if (data.code != error_codes.domain_already_in_cart) {
            obj.removeClass('selected');
        }else{
            tld_cont.attr('data-cart-item-id',data.data.id);

            if($('li[data-cart-item-id="' + data.data.id + '"]').length < 1)
                $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.billing.price.total);

            return ;
        }
        if (data.code == error_codes.cart_not_found || data.code == error_codes.cart_item_add_failed) {
            $.alertHandler('', data.msg, alert_box_failure);
        } else if(data.code == error_codes.domain_already_in_cart) {

        }else {
            obj.removeClass('selected');
            globalApplicationErrors(data);
        }
    } else {
        obj.removeClass('selected');
    }
}

function delete_from_cart_request (obj, id) {
    var tld_cont = obj.closest('.tldResults, .singleResult');

    if(id){
        tld_cont.attr('data-cart-item-id', id);
    }else{
        id = tld_cont.attr('data-cart-item-id');
    }

    $('li[data-cart-item-id="' + id + '"]').cart_hide();
    obj.removeClass('selected');

    $.ajax({
        type        : "POST",
        url         : baseUrl + "/cart/delete/" + tld_cont.attr('data-cart-item-id'),
        data        : {
            _token  : $('[name="_token"]').val(),
            unique_id : unique_page_identifier
        },
        timeout     : fundamental_vars.request_timeout.check,
        success     : function (data) {
            delete_from_cart_response(data, tld_cont, obj);
        },
        error       : function () {
            delete_from_cart_response_error(null, tld_cont, obj);
        },
        complete    : function (response) {
            setTimeout(function () {
                obj.removeClass('pending');
            }, 150);
            globalErrorsHandler(response)
        }
    });
}

function delete_from_cart_response (data, tld_cont, obj) {
    if (data.success) {
        if (app_env != 'local' && 'remarketing_items' in data.data)
            $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items);

        $.cart.remove(tld_cont.attr('data-cart-item-id'));
        tld_cont.removeAttr('data-cart-item-id');
    }else{
        delete_from_cart_response_error(data, tld_cont, obj);
    }
}

function delete_from_cart_response_error (data, tld_cont, obj) {
    if(data){
        if(data.code != error_codes.cart_item_not_found){
            $('li[data-cart-item-id="' + tld_cont.attr('data-cart-item-id') + '"]').cart_show();
            obj.addClass('selected');
        }
        if(data.code == error_codes.cart_not_found){
            $.alertHandler('', data.msg, alert_box_failure);
        }else {
            globalApplicationErrors(data);
        }
    }
}

function add_item_callback (data) {
    dependencies.domains_in_cart[data.msg.cart_item.name] = {cart_item_id : data.msg.cart_item.id};
}

function remove_item_callback (data) {
    delete dependencies.domains_in_cart[data.msg.fqdn];
}

/**
 * CART CONTROLLER END
 */


/**
 * Print the number of matching tlds
 */
function enum_categories () {
    $('dd.category').each(function(){
        startText = $(this).text();
        catTarget = $(this).data('target');
        if(catTarget !== undefined) {
            $(this).text(startText + ' (' + dependencies['categories'][catTarget].length + ')');
        }
    });
}

function scroll_event_handler () {
    if($('#alertContainer').is(':visible')){
        $.closeDisplays();
    }else{
        pin_filters();
        if($.getSizeClassification('large_down')){
            filters_visibility();
        }
    }
}

/**
 * For large and up screens pin the filters to their position.
 */
function pin_filters () {
    if(Math.floor($(document).scrollTop()) >= fundamental_vars.searchPos && $.getSizeClassification('large_up')){
        $('.domain-results-searchbar').css({'position': 'fixed','top': 0,'width': '100%','z-index': '100'}).addClass('fixed-top');
        if($.getSizeClassification('xlarge')) {
            if (($('.singleResult').length < 1 || (Math.floor($(document).scrollTop()) >= $('.domain-results').position().top)) && $(window).height() > 900 && $('.domain-results-searchbar').hasClass('fixed-top')) {
                $('.filtering').addClass('fixed-filters').css({'width': $('.domains-more-results .small-12').width() + 'px'});
            } else {
                $('.filtering').removeClass('fixed-filters');
            }
        }
    }else{
        $('.domain-results-searchbar').css({'position': '','top': 0,'width': '','z-index': ''}).removeClass('fixed-top');
        $('.filtering').removeClass('fixed-filters');
        setTimeout(function(){
        },1);
    }
}

/**
 * Handles the open filters button visibility for small screens.
 */
function filters_visibility () {
    filters_trig = $('#mobileFilters');
    if($(document).scrollTop() >= $('.domain-results-searchbar-container').offset().top - 16 && filters_trig.is(':hidden') || fundamental_vars.filtersOn) {
        filters_trig.show();
    }

    if($(document).scrollTop() < $('.domain-results-searchbar-container').offset().top && filters_trig.is(':visible') && !fundamental_vars.filtersOn) {
        filters_trig.hide();
    }
}

/**
 * When a request is served a new request must begin with part of the unresolved domains.
 */
function request_completed () {
    if(fundamental_vars.filtersOn && fundamental_vars.appliedCriteria.availability == ''){
        $('.availabilityLoader').remove();
    }
    if(jQuery.active - 1 < 2 && !$.isEmptyObject(fundamental_vars.recheck_unresolved)){
        $.each(fundamental_vars.recheck_unresolved,function(key,value){
            var recheck_keyword = key;
            if($('[data-fqdn^="' + recheck_keyword + '"]').length){
                var tld_list = [];

                $.each(fundamental_vars.recheck_unresolved[recheck_keyword],function(key,tld){
                    tld_list.push(tld);

                    if(tld_list.length == 5){
                        sendRecheck(recheck_keyword,tld_list);
                        fundamental_vars.recheck_unresolved[recheck_keyword].splice(0,5);
                        tld_list = [];
                    }

                    if(jQuery.active > 2){
                        return false;
                    }
                });

                if(!$.isEmptyObject(tld_list) && jQuery.active < 2){
                    sendRecheck(recheck_keyword,tld_list);
                    fundamental_vars.recheck_unresolved[recheck_keyword].splice(0,5);
                    tld_list = [];
                }
            }else{
                delete fundamental_vars.recheck_unresolved[recheck_keyword];
            }
        });
    }
    colorRows();
}

/**
 * AJAX Stop event Handler.
 */
function requests_finished () {
    if(fundamental_vars.filtersOn && fundamental_vars.appliedCriteria.availability != ''){
        find_domains_based_on_availability();
    }else{
        if(typeof fundamental_vars.search_in_results_unresolved != 'undefined' && !$.isEmptyObject(fundamental_vars.search_in_results_unresolved)){
            find_unresolved_domains_from_filters();
        }else{
            var errors = $('.tld-line:visible:has(.price:hidden):has(.add-to-cart:hidden)');

            if (errors.length) {
                var unresolved = [];

                errors.each(function () {
                    var obj = $(this);

                    if (obj.find('.errors').text() == '') {
                        unresolved.push(obj.closest('.tldResults').attr('data-tld'));

                        obj.find('.add-to-cart').html(fundamental_vars.templates.spinner).show();
                    }
                });

                if (unresolved.length) {
                    fundamental_vars.run_errorCheck = true
                }
            }
        }
    }

    requests_error_handler();
    colorRows();
}

/**
 * When all requests are serviced check to see if the available results reach the upper visible limit.
 * If the requested matching results do not match this limit perform supplementary requests until this limit is reached.
 */
function find_domains_based_on_availability () {
    $('.availabilityLoader').remove();
    $('.list').show();

    var selector = '.list .tldResults';

    $.each(fundamental_vars.filteredSelector,function(key,value){ //Category && Flag selector
        selector += value;
    });

    matching = $(selector); //Find the range of matching results.
    matching_asked = matching.filter(':has(.asked)'); //Find what is asked through those.

    if(fundamental_vars.appliedCriteria.availability == 'available'){
        availability_matched = matching_asked.filter(function(){
            status = $(this).attr('data-status');
            return status > 0 && status < 4;
        });
    }else{
        availability_matched = matching_asked.filter(function(){
            status = $(this).attr('data-status');
            return status < 1 || status > 3 || status == '';
        });
    }

    availability_matched.find('.tld-line').show();

    if(matching.length > matching_asked.length){
        var show_more = $('#show_more').show();
        if(availability_matched.length < fundamental_vars.expected_results){
            show_more_handler(show_more);
        }else{
            fundamental_vars.expected_results = 0;
        }
    }else{
        $('#show_more').hide();
    }
}

/**
 * When all requests are serviced check if there are unresolved domains and request their info.
 */
function find_unresolved_domains_from_filters () {
    var keyword = fundamental_vars.search_in_results_unresolved[0];
    fundamental_vars.search_in_results_unresolved.splice(0,1);

    var target = $('[data-fqdn^="' + keyword + '"] .tld-line:has(.spinner):visible');

    if(target.length) {
        createRequests(target);
    }
}

/**
 * When all requests are serviced and ques are cleared handle any unprocessed errors.
 */
function requests_error_handler () {
    var alert_container = $('#tldAlertContainer');
    if(jQuery.active < 1) {
        if ($('.tld-line:visible').length == 0 && alert_container.is(':hidden')) {
            handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.NO_RESULTS);
        } else if(fundamental_vars.run_errorCheck){
            errorManager(); //When there is no more active request call errorManager to collect all the tld with no answer.
        }
    }
}

/*
 colorRows
 Colors each result on .list and .cart based of the filters applied or not.
 */
function colorRows(){
    $('.targeted').removeClass('targeted');
    $('.list .odd').removeClass('odd');
    $('.list .tldResults:not(.availabilityLoader) .tld-line:visible').addClass('targeted');
    $('.targeted').filter(':even').addClass('odd');
}

/**
 * Show more results.
 * Applied only for one keyword and when no tld search is applied.
 * @param obj
 * @returns {boolean}
 */
function show_more_handler (obj) {
    var selector = '';

    if(fundamental_vars.filtersOn){
        $.each(fundamental_vars.filteredSelector, function (key, value) {
            selector += value;
        });

        if(fundamental_vars.appliedCriteria.availability != '') {
            if(typeof fundamental_vars.expected_results == 'undefined' || fundamental_vars.expected_results == 0) {
                fundamental_vars.expected_results = $('.list ' + createAvailabilitySelector(selector)).length + fundamental_vars.defaultLimit;
            }
            target = $(selector + ' .tld-line:not(.asked):lt(' + fundamental_vars.defaultLimit + ')');
            createRequests(target);
            if($('.availabilityLoader').length < 1){
                $('#show_more').hide();
                $('.show-more-btn').before(fundamental_vars.availTemp);
                if($('.list .tld-line:visible').length < 1){
                    $('.list').hide();
                }
            }
            return false;
        } else {
            length_selector = selector + ' .tld-line';
            selector += ' .tld-line:hidden:lt(' + fundamental_vars.defaultLimit + ')';
        }
    }else{
        length_selector = '.tld-line';
        selector = '.tld-line:hidden:not(.asked):lt(' + fundamental_vars.defaultLimit + ')';
    }

    fetched = $(selector);

    fetched.show();
    colorRows();
    createRequests(fetched);

    total_selectable_results = $(length_selector).length;
    total_results_visible = $('.tld-line:visible').length;

    if(total_selectable_results == total_results_visible){
        obj.hide();
    }
}

/**
 * Reveal show more button.
 * @param obj
 */
function show_more_event (obj) {
    selector = get_selector();
    all_matching_length = $('.list ' + selector).length;
    all_matching_visible_length = $('.list ' + selector + ' .tld-line:visible').length;

    ($('#tldAlertContainer:visible').length  > 0 || $('.availabilityLoader:visible').length > 0 || all_matching_length == all_matching_visible_length) ? obj.hide() : obj.show();
}

/*
 convertPrices
 Converts prices from Imperial to Metric system.
 Add vat if it is required.
 */
function convertPrices(price) {
    if (price !== undefined) {
        if (vat['show']) {
            price = parseFloat(price) * vat['quote'];
        }
        dataPrice = price.toFixed(2).toString().split('.');
        dataPrice[0] = dataPrice[0].replace(',', '.');
        if(dataPrice[1] === undefined){
            dataPrice[1] = '00';
        }
        return dataPrice[0] + ',' + dataPrice[1];
    }
}

/*
 errorManager
 Called only if there are answered domains on ajax request complete.
 The function requests the domains once again and then if still there is no answer marks them with no connection error.
 */
function errorManager(){
    if(fundamental_vars.retry == true){
        //Collect the domains still pending data. Collect all the domains bypassing what the cache says.
        fundamental_vars.bypass_cache_check = true;
        createRequests($('.tld-line.asked:has(.spinner)'));

        fundamental_vars.bypass_cache_check = false;
        fundamental_vars.retry = false;
    }else{
        //The requests failed again. Collect all the failed domains and apply to them a no connection error status.
        fundamental_vars.retry = true;
        fundamental_vars.run_errorCheck = false;

        var target = $('.tld-line.asked').filter(':has(.add-to-cart:visible)').filter(':has(.spinner)');

        target.find('.price').hide();
        target.find('.add-to-cart').hide();

        if(target.find('.errors').length < 1) {
            target.find('.actions').append(fundamental_vars.templates['error']).find('.errors span').text(dependencies['statuses'][dependencies['Status']['noconnection']]['locale'])
        }else{
            target.find('.actions .errors span').text(dependencies['statuses'][dependencies['Status']['noconnection']]['locale'])
        }
    }
}

/*
 logKeywords
 After the keyword and tlds are separated and grouped based on the users request the keywords are logged to cache.
 */
function logKeywords(keyword){
    $.each(keyword,function(key,value){
        if(!(value in fundamental_vars.log)){
            fundamental_vars.log[value] = {};
        }
    });
}

/*
 logTlds
 Before the domains are requested each tld must be loged to are cache.
 */
function logTlds(keyword,tld_list){
    $.each(tld_list,function(key,value){
        if(value && !(value in fundamental_vars.log[keyword]) && dependencies['tldList'][value]['cache']){
            fundamental_vars.log[keyword][value] = {};
        }
    });
    return false;
}

/*
 updateCache
 Runs on ajax's complete function and logs any new info given by the register.
 */
function updateCache(keyword,tld,info){
    if(keyword in fundamental_vars.log && tld in fundamental_vars.log[keyword]){
        fundamental_vars.log[keyword][tld] = info;
        fundamental_vars.log[keyword][tld]['date'] = $.now();
    }
}

/*
 cacheCheck
 Checks if the requesting tld is in cache and not expired.
 */
function cacheCheck(keyword,tld){
    if($.keys(fundamental_vars.log[keyword]).indexOf(tld) > -1){
        tldExpirationDate = fundamental_vars.log[keyword][tld]['date'] + fundamental_vars.cache_lifetime * 60000 ;
        if(tldExpirationDate > $.now() && !fundamental_vars.bypass_cache_check){
            return null;
        }else{
            return tld;
        }
    }else{
        return tld;
    }
}

/*
 searchVisibleResults
 Returns all the visible tld-lines that has been asked.
 */
function searchVisibleResults(){
    target = $('.list .asked');
    target = target.filter(function () {
        return $(this).css('visibility') == 'visible'
    });
    target = target.filter(function () {
        return $(this).closest('.tldResults').css('display') != 'none'
    });
    return target;
}

/*
 shortenName
 Used to shorten names on result create and window resize.
 */
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

/*
 calculateKeyword
 Checks if the given keyword is between the allowed limits.
 Sets an error flag based on the keyword length.
 */
function calculateKeyword(treated){
    if(treated.length > 63){
        fundamental_vars.tooBigKeys = true;
        return treated.substring(0,63);
    } else if(treated.length < 2){
        fundamental_vars.tooSmallKeys = true;
        return false;
    }
    return treated;
}

/*
 polishKeyword
 Removes unnecessary dashes from a keyword.
 Sets an error flag if detects latin chars along with gr chars.
 */
function polishKeyword(treated){
    treated = treated.replace(/^[-]/, '').replace(/[-]$/, '');
    if (!$.isEmptyObject(treated.match(REG.BASIC_LATIN.REGEX))&& !$.isEmptyObject(treated.match(REG.ALL_GR.REGEX))) {
        fundamental_vars.invalidKeys = true;
        return '';
    }
    return treated;
}

/*
 If Object.keys() is not supported by a browser the following will be used.
 This will define a keyed function in JS's Object object that will return all the keys of an object.
 */
function defineObjectKeys(){
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

/*
 get_selector
 Convert fundamental_vars.filteredSelector to a string to select objects.
 */
function get_selector(){
    var selector = '';

    $.each(fundamental_vars.filteredSelector,function(key,value){
        selector += value;
    });

    return selector;
}

/*
 apply_selector
 Apply the selected filters to the page's elements.
 The function uses get_selector to get the filters.
 The filters are applied based on availability filter value.
 If availability is set means that we must check what is the availability of each domain at the end of our query.
 To avoid confusion when the results arrive we create the requests with the elements in question hidden.
 A loader is appended after the domains to indicate that there is an active search.
 Results that match both the selector and availability rule are shown before answers to our requests arrive.
 If there is no request created and there is no element matched an error message will appear.
 If availability is not set then function the selector is used and the matched elements are revealed and requested.
 If there are no results an error message will appear.
 Based on the visible results and total results the show more button will be visible or hidden.
 */
function apply_selector(){
    $('.list').show();
    handleErrorBox('hide');

    var selector = get_selector();

    $('.availabilityLoader').remove();

    if($('.colored_tld').length){
        single = $('.singleResult');
        single.find('.tld').html(single.attr('data-tld'));
        $('.tldResults:has(.colored_tld)').each(function(){
            tld = $(this).attr('data-tld');
            $(this).find('.tld').html(tld);
        });
    }

    if(fundamental_vars.appliedCriteria.availability != ''){
        var matching_selector = '.list ' + createAvailabilitySelector(selector),
            target = null;
        matching_results = $(matching_selector); //Find all the results that at this moment match the query to question.
        fundamental_vars.expected_results = matching_results.length + fundamental_vars.defaultLimit;

        if(matching_results.length < fundamental_vars.defaultLimit) { //If the matching results are too few fetch more.
            $('.list .tld-line').hide(); //hide all active results
            target = $('.list .tldResults' + selector + ' .tld-line:not(.asked):lt(' + fundamental_vars.defaultLimit + ')');

            /*
             * Find the results that match the filters and availability and show them before the search begins.
             * If there are tlds available for search perform a request and show the availability loader.
             * If there is nothing to search and no visible result hide list show border is not visible on mobile and display the error message.
             */
            if (fundamental_vars.appliedCriteria.availability == 'available') {
                selector = '.list .tldResults' + selector + '[data-status="1"] .tld-line.asked, .tldResults' + selector + '[data-status="2"] .tld-line.asked, .tldResults' + selector + '[data-status="3"] .tld-line.asked';
            } else {
                selector = '.list .tldResults' + selector + '[data-status!="1"][data-status!="2"][data-status!="3"][data-status!=""][data-status] .tld-line.asked';
            }
            var already_fetched = $(selector);

            already_fetched.show();
            colorRows();

            if (target.length) { //Tlds available for search.
                if(jQuery.active < 2){
                    createRequests(target);
                }
                if ($('.availabilityLoader').length < 1) {
                    $('#show_more').hide();
                    $('.show-more-btn').before(fundamental_vars.availTemp);
                    if ($('.list .tld-line:visible').length < 1) {
                        $('.list').hide();
                    }
                }
            } else {
                if (jQuery.active < 2 && already_fetched.length < 1 && $('.availabilityLoader').length < 1){ //No tlds available for search. Show what is searched.
                    handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.NO_RESULTS)
                }
            }
            return false;
        }else{
            total_matching = '.list ' + selector;
            selector = matching_selector; //If the results suffice show them.
        }
    }else{
        if(selector != ''){
            selector = '.list .tldResults' + selector;
            total_matching = selector;
            selector = selector + ' .tld-line:hidden:lt(' + fundamental_vars.defaultLimit + '), ' + selector + ' .asked'; //If filters are applied select the first in default limit
        }else{
            selector = '.list .tld-line.asked'; //If no filter is applied show all the asked.
            total_matching = '.list .tld-line';
        }
    }

    $('.list .tld-line').hide(); //hide all active results
    fetched = $(selector); //Fetched by selector

    fetched.show();
    colorRows();
    createRequests();

    total_matching_length = $(total_matching).length;
    total_visible_length = $('.tld-line:visible').length;

    if(total_matching_length == total_visible_length){
        $('#show_more').hide();
    }else{
        $('#show_more').trigger('show');
    }


    if(fundamental_vars.appliedCriteria.availability == '' && total_visible_length < 1){
        handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.NO_RESULTS, false);
    }

    return false;
}

/*
 createAvailabilitySelector
 Combines the given selector with the selected availability to find the matching results.
 */
function createAvailabilitySelector(selector){
    if(selector.indexOf('.tldResults') < 0){
        selector = '.tldResults' + selector;
    }

    if(fundamental_vars.appliedCriteria.availability == 'available'){
        selector = selector + '[data-status="1"] .tld-line.asked,' + selector + '[data-status="2"] .tld-line.asked,' + selector + '[data-status="3"] .tld-line.asked';
    }else{
        selector = selector + '[data-status!="1"][data-status!="2"][data-status!="3"][data-status!=""][data-status] .tld-line.asked';
    }

    return selector
}

/*
 sendRecheck
 Send a request to recheck a list of tlds.
 */
function sendRecheck(KeyWord,tld){
    $.ajax({
        type: "POST",
        url: baseUrl + "/api/domains/check?recheck",
        data: {
            keyword: KeyWord,
            tld: tld,
            _token: $('[name="_token"]').val(),
            action: 'getStatus'
        },
        timeout: fundamental_vars.request_timeout.recheck,
        success: function (data) {
            if(data.data != null) {
                $.each(data.data[KeyWord], function (tld, info) {
                    target = $('[data-fqdn="' + KeyWord + '.' + tld + '"]');
                    if (tld in fundamental_vars.log[KeyWord]) {
                        fundamental_vars.log[KeyWord][tld]['status'] = info['status'];
                    }
                    ajax_response_apply(target, info);
                });
            }else{
                fundamental_vars.run_errorCheck = true;
            }
        },
        error: function(){
            fundamental_vars.run_errorCheck = true;
        }
    });
}

/*
 Check if it is possible to send a new request.
 If it is not possible to create a new request inject new tld to the key in the unresolved pool.
 */
function recheckTld(KeyWord,tld){
    if(jQuery.active < 2){
        sendRecheck(KeyWord,tld)
    }else{
        $.merge(fundamental_vars.recheck_unresolved[KeyWord],tld);
    }
}

/*
 colorSearch
 Take the search value, find all it's occurrences and color their background.
 */
function colorSearch(result,search){
    tld = result.attr('data-tld');

    tld_obj = result.find('.tld');
    tld_obj_t = tld.split(search);

    arguments_l = tld_obj_t.length;
    fixed_text = '';
    $.each(tld_obj_t,function(key,value){
        if(key + 1 != arguments_l){
            fixed_text += value + '<span class="colored_tld">' + search + '</span>';
        }else{
            fixed_text += value;
        }
    });
    tld_obj.html(fixed_text);
}

/*
 initiateErrorFlags
 Set the error flags to false.
 This is called before getKeywords() to ensure that the error flag that we get is an original error not trashes transferred from previous search.
 */
function initiateErrorFlags(){
    fundamental_vars.invalidKeys        = false;
    fundamental_vars.error_status       = false;
    fundamental_vars.tooBigKeys         = false;
    fundamental_vars.tooSmallKeys       = false;
    fundamental_vars.run_errorCheck     = false;
    fundamental_vars.bulk_fuzzy_error   = false;
}

function pushToCollection(treated, tld){
    var keyword = polishKeyword(treated);
    if(!(keyword in collection)) {
        $.each(collection, function(key, value){
            if($.isEmptyObject(value)){
                fundamental_vars.bulk_fuzzy_error = true;
                return false;
            }
        });

        if(fundamental_vars.bulk_fuzzy_error)
            return ;

        keyword = calculateKeyword(keyword);
        if(keyword) {
            collection[keyword] = []
        };
    }
    if(typeof tld !== 'undefined' && keyword in collection && tld in dependencies.tldList){
        collection[keyword].push(tld);
    }

    return collection;
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

                fundamental_vars.error_status = true;
                $('.list').hide();
                $('#show_more').hide();
                $('.domains-more-results').show();

                //Hide single result and reorganise the top margin.
                $('.domain-results').hide();
                $('.search-margin').removeClass('search-margin');
                $('.top-targets:visible').addClass('search-margin');

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
                if(fundamental_vars.keysLength == 1) {
                    $('dl').removeClass('inactive');
                    $('dd').removeClass('disabled');
                }
                $('#resultsSearch,#mobileResultsSearch').disabled(false);
                $('select.filters').chosen_enable();
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