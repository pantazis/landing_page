$(document).ready(function(){
    var domCache = {
        keyword_submit_search : $('#keyword-submit-search'),
        search_field : $('#search_field'),
        search_btn : $('#search_btn'),
    };

    var merge = {
        search : {
        }
    };

    if ('domain_search' in $)
        $.extend($.domain_search, merge);
    else
        $.extend({'domain_search' : merge});


    domCache.keyword_submit_search.prepare_form_advanced({
        'handlers'          : '#search_btn',
        'disable_exception' : true,
        version_exception   : true,
        'onSuccess'         : function () {
            getSearchInput();
        },
        'custom_error_display' : {
            validate_required : function () {
                $.alertHandler('',DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.TOO_SMALL_SEARCH,alert_box_warning);
            }
        }
    });

    function getSearchInput () {
        clearGlobalErrors();

        $.domain_search.filters.clearFilters();

        var searchValue = domCache.search_field.val().trim();

        if (searchValue.length > 1) {
            var domainPairs = getKeywords(domCache.search_field);

            if($.isEmptyObject(domainPairs)){
                if ($.domain_search.management.syntaxErrors())
                    $.domain_search.management.handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.ONLY_SINGLE_KEYWORD_ALLOWED);
            } else {
                $.domain_search.currentResults = {};

                $.domain_search.management.handleErrorBox('hide');

                $.domain_search.config.functionality.search.keywords = domainPairs;

                domCache.search_field.val(rebuild_cleared_input(domainPairs));

                $.domain_search.management.searchKeyword(true);
            }
        } else {
            $.alertHandler('',DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.TOO_SMALL_SEARCH,alert_box_warning);
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
            if (list.length) {
                $.each(list, function (index, tld) {
                    temp += ' ' + key + '.' + tld;
                });
            } else {
                temp += ' ' + key;
            }
        });


        return temp.trim();
    }

    function getKeywords(source) {
        var collection = {},
            input = source.val().toLowerCase();

        if (!$.isEmptyObject(input.match(REG.ALL_ALLOWED.REGEX))) {
            var domains = input.split(REG.DOMAIN);

            for (var i in domains) {
                if (domains.hasOwnProperty(i) && domains[i].match(new RegExp('\\.el\W|\\.el$','g')) != null) {
                    domains[i] = domains[i].replace('el', 'ελ')
                }

                var tmp = [];

                for (var i in domains) {
                    if (domains.hasOwnProperty(i) && domains[i].length) {
                        tmp.push(domains[i]);
                    }
                }

                domains = tmp;
            }


            domains = domains.join(' ');
            input = domains;
            source.val(domains);

            //Prepare input to be split into separate domains.
            //Remove words that contain the postfix ':\\' for example 'http:\\'
            //This chars are used to define different domains  ',|;/' to spaces
            //Split input on space.
            input = input.replace(new RegExp('[' + REG.ALL_ALLOWED_EXTENDED.CHAR_SET + ']+://', 'g'), '').replace(/[,|;/]+|\s+/g, " ").trim().split(' ');

            $.each(input, function (key, value) {
                if($.domain_search.config.functionality.errors.bulk_fuzzy_error)
                    return false;

                value = value.replace(/[-]+/g, '-').replace(/[.]+/g, '.').trim();
                var temp = {};
                //Get all the valid characters of each domain.
                var matched = value.match(REG.ALL_ALLOWED_EXTENDED.REGEX);

                if(matched != null) {
                    //Clear reconstructed domain from leading/following dashes and dots.
                    var treated = rebuild_domain(matched).replace(/^[.-]+|[.-]+$/g,'');
                    collection = keywordDetection(treated, temp, collection);
                }
            });

            return ($.domain_search.config.functionality.errors.bulk_fuzzy_error) ? [] : collection;
        }
        return {};
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
                switch (treated.length) {
                    case 1:
                        collection = pushToCollection(treated[0], '', collection);
                        break;
                    case 2:
                        collection = pushToCollection(treated[0], treated[1], collection);
                        break;
                    case 3:
                        var tld = treated[1] + '.' + treated[2];
                        if (tld in dependencies['tldList']) {
                            pushToCollection(treated[0],tld, collection);
                        } else if (treated[0] == 'www') {
                            pushToCollection(treated[1],treated[2], collection);
                        }else{
                            return collection;
                        }
                        break;
                    default:
                        tld = treated[2] + '.' + treated[3];
                        if (treated[0] == 'www') {
                            collection = pushToCollection(treated[1],tld, collection);
                        }else{
                            return collection;
                        }
                        break;
                }
            } else {
                return collection;
            }
        } else {
            return collection;
        }

        return collection;
    }

    function pushToCollection(treated, tld, collection){
        var keyword = polishKeyword(treated);

        if(!(keyword in collection)) {
            $.each(collection, function(key, value){
                if($.isEmptyObject(value)){
                    $.domain_search.config.functionality.errors.bulk_fuzzy_error = true;
                    return false;
                }
            });

            if($.domain_search.config.functionality.errors.bulk_fuzzy_error)
                return collection;

            keyword = calculateKeyword(keyword);

            if(keyword) {
                collection[keyword] = []
            };
        }

        if(typeof tld !== 'undefined' && tld != '' && keyword in collection && tld in dependencies.tldList){
            collection[keyword].push(tld);
        }

        return collection;
    }

    /*
     polishKeyword
     Removes unnecessary dashes from a keyword.
     Sets an error flag if detects latin chars along with gr chars.
     */
    function polishKeyword(treated){
        treated = treated.replace(/^[-]/, '').replace(/[-]$/, '');
        if (!$.isEmptyObject(treated.match(REG.BASIC_LATIN.REGEX))&& !$.isEmptyObject(treated.match(REG.ALL_GR.REGEX))) {
            $.domain_search.config.functionality.errors.invalidKeys = true;
            return '';
        }
        return treated;
    }

    /*
    calculateKeyword
    Checks if the given keyword is between the allowed limits.
    Sets an error flag based on the keyword length.
    */
    function calculateKeyword(treated){
        if(treated.length > 63){
            $.domain_search.config.functionality.errors.tooBigKeys = true;
            return false;
        } else if(treated.length < 2){
            $.domain_search.config.functionality.errors.tooSmallKeys = true;
            return false;
        }
        return treated;
    }

    function clearGlobalErrors () {
        $.each($.domain_search.config.functionality.errors, function (key, value) {
            $.domain_search.config.functionality.errors[key] = false;
        })
    }
});

$(window).on('load', function () {
    $(document).trigger('loaded:search');
});