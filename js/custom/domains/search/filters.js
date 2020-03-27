$(document).ready(function  () {
    var domCache = {
        resultsSearch       : $('#resultsSearch'),
        filters             : $('.filtersContainer dd'),
        mobileResultsSearch : $('#mobileResultsSearch'),
        mobileFilters       : $('select.filters'),
        applyFilters        : $('.aplly-filters'),
        filters_on_use      : $('.filters-on-use')
    };

    var merge = {
        filters : {
            clearFilters : function () {
                clearFilters();
            }
        }
    };

    if ('domain_search' in $)
        $.extend($.domain_search, merge);
    else
        $.extend({'domain_search' : merge});

    var tldSearchTimer = null;

    $('#mobileFilters').on('click', function (e) {
        e.preventDefault();

        $(this).closest('div').find('.cd-panel').addClass('is-visible');
    });

    $('.cd-panel-close').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.is-visible').removeClass('is-visible');
    });

    domCache.resultsSearch
        .on('input', function () {
            tldInsertedToSearch($(this));
        })
        .on('keypress',function(e){
            if(e.which == 13) {
                e.preventDefault();
                tldInsertedToSearch($(this));
            }
        });

    domCache.filters.on('click', function (e) {
        e.preventDefault();

        filterWasClicked($(this));
    });

    domCache.applyFilters.on('click', function (e) {
        e.preventDefault();

        applyMobileFilters();
    });

    domCache.mobileFilters.each(function () {
        $(this).apply_chosen('')
    });

    function tldInsertedToSearch (obj) {
        if (tldSearchTimer != null)
            clearTimeout(tldSearchTimer);

        tldSearchTimer = setTimeout(function () {
            lookUpTld(obj);

            tldSearchTimer = null;
        }, 500);
    }

    function lookUpTld (obj) {
        var filter = obj.val();

        if (filter)
            domCache.filters_on_use.text(filter);
        else
            domCache.filters_on_use.translate('domains.search.filters.all');

        domCache.filters.removeClass($.domain_search.config.functionality.filters.selected_class);

        $.domain_search.config.functionality.filters.active_filter = (filter ? '.singleResult[data-tld*="' + filter + '"], [data-tld*="' + filter + '"]' : '');
        $.domain_search.config.functionality.filters.decorate = filter;

        applyFiltersToDomainRows();
    }

    function filterWasClicked (obj) {
        var selected_class = $.domain_search.config.functionality.filters.selected_class;

        domCache.resultsSearch.val('');

        if (obj.hasClass(selected_class)) {
            obj.removeClass(selected_class);
        } else {
            obj.closest('dl').find('dd').removeClass(selected_class);
            obj.addClass(selected_class);
        }

        $.domain_search.config.functionality.filters.active_filter = getSelectedFilters();

        applyFiltersToDomainRows();
    }

    function getSelectedFilters () {
        var selectedFilters = $('dd.' + $.domain_search.config.functionality.filters.selected_class),
            selector = '';

        $.domain_search.config.functionality.filters.availability = false;

        if (selectedFilters.length) {
            var activeFiltersTitle = [];

            selectedFilters.each(function () {
                var obj = $(this),
                    target = obj.attr('data-target');

                activeFiltersTitle.push(obj.text().replace(/\([0-9]+\)/,'').trim());

                if (obj.hasClass('flag')) {
                    selector += '[data-flag*="Flag' + target + ',"]';
                } else if (obj.hasClass('category')) {
                    selector += '[data-categories*="Cat' + target + ',"]'
                } else if (obj.hasClass('availability')) {
                    selector += '.tldResults:has(.loading, .cart-button:not(.taken)):not(:has(.errors))';
                    $.domain_search.config.functionality.filters.availability = true;
                }
            });

            domCache.filters_on_use.text(activeFiltersTitle.join(' + '));
        } else {
            domCache.filters_on_use.translate('domains.search.filters.all');
        }

        return selector;
    }

    function applyFiltersToDomainRows () {
        $('body').scrollTop(0);
        $('.tld-line').hide();

        $.domain_search.management.handleErrorBox('hide');

        $.domain_search.config.functionality.show_more.available = $('.tldResults' + $.domain_search.config.functionality.filters.active_filter).length;
        
        if ($.domain_search.config.functionality.filters.active_filter != '')
            $.domain_search.rows.revealDomainRows();
        else
            $.domain_search.rows.revealDomainRows($.domain_search.config.iteration.limit, $('.tld-line:not(:has(.loading))'));

        var resultsPanel = $('.resultsPanel');


        if (resultsPanel.height() < $.domain_search.config.functionality.rows.containers_min_height)
            resultsPanel.css({'min-height': $.domain_search.config.functionality.rows.containers_min_height});
        else
            resultsPanel.css({'min-height': ''});

        if ($.domain_search.config.functionality.filters.availability) {
            if ($('.tld-line:visible').length < $.domain_search.config.iteration.limit) {
                if ($.domain_search.config.functionality.filters.active_filter != '')
                    $.domain_search.rows.revealDomainRows();
                else
                    $.domain_search.rows.revealDomainRows($.domain_search.config.iteration.limit, $('.tld-line:not(:has(.loading))'));
            }
        } else if ($('.tld-line:visible').length < 1) {
            $.domain_search.management.handleErrorBox('show', DOMAINS_LANG.DOMAIN_SEARCH.ALERTS.NO_RESULTS, false);
        }
    }

    function clearFilters () {
        domCache.resultsSearch.val('');
        domCache.filters.removeClass($.domain_search.config.functionality.filters.selected_class);

        $.domain_search.config.functionality.filters.active_filter = '';
        $.domain_search.config.functionality.filters.availability = false;
        $.domain_search.config.functionality.filters.decorate = '';

        domCache.filters_on_use.translate('domains.search.filters.all');
    }

    function applyMobileFilters () {
        var tldSearch = domCache.mobileResultsSearch.val();

        if (tldSearch) {
            domCache.mobileFilters.each(function () {
                $(this).chosen_update('');
            });

            domCache.resultsSearch.val(tldSearch);

            lookUpTld(domCache.resultsSearch);
        } else {
            $('dd').removeClass($.domain_search.config.functionality.filters.selected_class);

            domCache.mobileFilters.each(function () {
                var obj     = $(this),
                    value   = obj.val();

                if (value != null) {
                    if (value == 'all')
                        obj.chosen_update('');
                    else
                        $('dd.' + obj.attr('class').replace('filters','').trim() + '[data-target="' + value + '"]').addClass($.domain_search.config.functionality.filters.selected_class);
                }
            });

            $.domain_search.config.functionality.filters.active_filter = getSelectedFilters();

            applyFiltersToDomainRows();
        }
    }
});

$(window).on('load', function () {
    $(document).trigger('loaded:filters');
});