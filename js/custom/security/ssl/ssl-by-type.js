$(document).ready(function(){
    var filters = $('.ssl-filters-container'),
        fixFilters = filters.offset().top;

    $('#tool-bar select:not(#selections)').each(function(){
        $(this).apply_chosen('');
    });

    $('#selections').apply_chosen('all');

    $('.filters').on('change',function(){
        target = $('.ssl_product');
        target.hide();

        $('.filters').each(function(){
            if($(this).find('option:selected').val() != 'all' && $(this).find('option:selected').val() != '' && $(this).find('option:selected').val() != null) {
                if ($(this).hasClass('group') ) {
                    target = target.filter('[data-suggested!="0"]');
                } else if ($(this).hasClass('ssl-type')) {
                    target = target.filter('[data-validation="' + $(this).find('option:selected').val() + '"]');
                } else if($(this).hasClass('ssl-validation-type')){
                    target = target.filter('[data-domains*="' + $(this).find('option:selected').val() + '"]');
                }else if($(this).hasClass('ssl-company')){
                    target = target.filter('[data-brand="' + $(this).find('option:selected').val() + '"]');
                }
            }
        });

        target.show();
        if(target.length){
            $('#noResults').hide();
        }else{
            $('#noResults').show();
        }
    });

    $('#order').on('change',function(){
        sortBy = $(this).find('option:selected').data('sort');

        if($(this).find('option:selected').hasClass('asc')){
            decision = 1;
        }else{
            decision = -1;
        }

        rows = $('.sslContainer .product').get();
        tableSortMain(rows,sortBy);

        $.each(rows, function(index, row) {
            $('.sslContainer').append(row);
        });
    }).apply_chosen('0');

    $('#order').chosen_update('0').change();

    $('#mobileFilters').on('click', function (e) {
        e.preventDefault();
        $(this).closest('div').find('.cd-panel').addClass('is-visible');
    });

    $('.cd-panel-close').on('click', function (e) {
        $(this).closest('.cd-panel').removeClass('is-visible');
    });

    $('#searchName').on('input', function () {
        if(typeof searchTimer != 'undefined')
            clearTimeout(searchTimer);

        $('dd.selected').removeClass('selected');
        $('.mobileFilters').chosen_update('');

        var input = $(this);

        searchTimer = setTimeout(function () {
            var products = $('.ssl_product'),
                search = input.val();

            $('#mobileResultsSearch').val(search);
            lookUpName(search, products);
            scrollTop();
            fixFiltersPosition();
        }, 300);
    });

    $('.mobileFilters').on('change', function (){
        $('#mobileResultsSearch').val('');

        if(typeof $sslConfig == "object"){
            $('dd.disabled').removeClass('disabled');

            enable_all_filter_option();

            $.each($sslConfig, function (key, configurable) {
                var possibleMatch = $('option[value="' + key + '"]:selected');

                if(possibleMatch.length){
                    $.each(configurable, function (name, configuration) {
                        var mobileFilter    = $('select:has([value="' + name + '"])');

                        if(configuration.disabled && mobileFilter.length)
                            disable_filter_options(mobileFilter, name);
                    });
                }
            });
        }
    });

    $('.apply-filters').on('click', function () {
        var input = $('#mobileResultsSearch'),
            search = input.val(),
            products = $('.ssl_product');

        if(search){
            $('#searchName').val(search);

            $('dd.selected').removeClass('selected');
            $('.mobileFilters').chosen_update('');
            lookUpName(search, products);
        }else{
            $('#searchName').val('');
            products.hide();

            $('dd').removeClass('selected');

            $('select.mobileFilters:has(:selected)').each(function () {
                var filter = $(this);

                switch (filter.attr('data-key')){
                    case 'suggested':
                        products = products.filter('[data-suggested="1"]');
                        $('dd[data-target="suggested"]').addClass('selected');
                        break;
                    case 'validation':
                    case 'domains':
                        if(filter.attr('data-key') == 'validation')
                            var $key = 'validation';
                        else
                            $key = 'domains';

                        products = products.filter('[data-' + $key + '*="' + filter.find(':selected').val() + '"]');
                        $('dd[data-target="' + filter.find(':selected').val() + '"]').addClass('selected');
                        break;

                    case 'vendor':
                        temp = [];
                        var selector = '';

                        if(filter.attr('data-key') == 'vendor')
                            $key = 'brand';
                        else
                            $key = 'properties';

                        filter.find(':selected').each(function () {
                            $.merge(temp, products.filter('[data-' + $key + '*="' + $(this).val() + '"]'));
                            $('dd[data-target="' + $(this).val() + '"]').addClass('selected');
                        });

                        products = $(temp);
                        break;
                    case 'properties':
                        var temp = [];

                        if(filter.attr('data-key') == 'vendor')
                            $key = 'brand';
                        else
                            $key = 'properties';

                        filter.find(':selected').each(function () {
                            selector += '[data-' + $key + '*="' + $(this).val() + '"]';
                            $('dd[data-target="' + $(this).val() + '"]').addClass('selected');
                        });

                        $.merge(temp, products.filter(selector));
                        products = $(temp);
                        break;
                }
            });

            showResults(products);
        }

        $(this).closest('.cd-panel').removeClass('is-visible');
        scrollTop();

        if(typeof $sslConfig == "object"){
            var disabled = $('.mobileFilters option:disabled');

            $('dd.disabled').removeClass('disabled');

            if(disabled.length){
                disabled.each(function () {
                    $('dd[data-target="' + $(this).val() + '"]').addClass('disabled').removeClass('selected');
                });
            }
        }
    });

    $('.mobileFilters').apply_chosen('');

    $(document)
        .on('click', 'dd:not(.disabled)', function () {
            var filter = $(this);

            $('#searchName').val('');

            if(filter.hasClass('selected')){
                filter.removeClass('selected');

                $('.mobileFilters:has([value="' + filter.attr('data-target') + '"])').chosen_update('');
            }else{
                var dl = filter.closest('dl');
                if(!dl.hasClass('multiple'))
                    dl.find('.selected').removeClass('selected');

                filter.addClass('selected');
            }

            if(typeof $sslConfig == "object"){
                $('dd.disabled').removeClass('disabled');

                enable_all_filter_option();

                $.each($sslConfig, function (key, configurable) {
                    var possibleMatch = $('[data-target="' + key + '"].selected');

                    if(possibleMatch.length){
                        $.each(configurable, function (name, configuration) {
                            var filter          = $('[data-target="' + name + '"]'),
                                mobileFilter    = $('select:has([value="' + name + '"])');

                            if(configuration.disabled){
                                filter.addClass('disabled').removeClass('selected');

                                if(mobileFilter.length){
                                    disable_filter_options(mobileFilter, name);
                                }
                            }
                        });
                    }
                });
            }

            var products = $('.ssl_product').hide();

            $('dl:has(.selected)').each(function () {
                var filter = $(this);

                switch (filter.attr('data-key')){
                    case 'suggested':
                        products = products.filter('[data-suggested="1"]');
                        $('select:has([value="sugested"])').chosen_update('suggested');
                        break;
                    case 'validation':
                    case 'domains':
                        if(filter.attr('data-key') == 'validation')
                            var $key = 'validation';
                        else
                            $key = 'domains';

                        var target = filter.find('.selected').attr('data-target');

                        products = products.filter('[data-' + $key + '*="' + target + '"]');
                        $('select:has([value="' + target + '"])').chosen_update(target);
                        break;
                    case 'vendor':
                        var temp = [],
                            tempTargets = [];

                        if(filter.attr('data-key') == 'vendor')
                            $key = 'brand';
                        else
                            $key = 'properties';

                        filter.find('.selected').each(function () {
                            target = $(this).attr('data-target');
                            $.merge(temp, products.filter('[data-' + $key + '*="' + target + '"]'));
                            tempTargets.push(target);
                        });

                        $('select:has([value="' + tempTargets[0] + '"])').chosen_update(tempTargets);

                        products = $(temp);
                        break;
                    case 'properties':
                        var temp = [],
                            tempTargets = [];

                        var selector = '';

                        if(filter.attr('data-key') == 'vendor')
                            $key = 'brand';
                        else
                            $key = 'properties';

                        filter.find('.selected').each(function () {
                            target = $(this).attr('data-target');

                            selector += '[data-' + $key + '*="' + target + '"]';
                            tempTargets.push(target);
                        });

                        $.merge(temp, products.filter(selector));

                        $('select:has([value="' + tempTargets[0] + '"])').chosen_update(tempTargets);

                        products = $(temp);
                        break;
                }
            });

            showResults(products);
            scrollTop();
            fixFiltersPosition();
        });

    $(window)
        .on('scroll', function () {
            if(typeof scrollTimer == 'undefined' || scrollTimer == null){
                scrollTimer = setTimeout(function () {
                    fixFiltersPosition();

                    scrollTimer = null;
                }, 100);
            }
        })
        .on('resize', function () {
            if($.getSizeClassification('large_up')){
                $('.cd-panel').removeClass('is-visible');
                fixFiltersPosition();
            }
        });

    function lookUpName(search, products, strict) {
        if(search){
            search = search.toLowerCase().trim().split(' ');
            products.hide();

            var lookRegex = '(^:search[\\w-]*)|,:search[\\w-]*|,(?=[\\w]*:search[\\w]*)[\\w]*',
                terms = searchTerms.join(',');

            if(typeof strict == 'undefined'){
                //FUZZY SEARCH START
                var found = [];
                $.each(search, function (key, value) {
                    var matched = terms.match(new RegExp(lookRegex.replace(/:search/g, value), 'gi'));

                    if(matched != null) {
                        $.each($.unique(matched), function (index, term) {
                            term = term.replace(/^,/g, '');
                            var temp = products.filter('[data-name*="' + term + '"]');

                            if (temp.length)
                                $.merge(found,temp);
                        });
                    }
                });

                if(found.length)
                    $(found).show();

                //FUZZY SEARCH END
            }else{
                //STRICT SEARCH START
                products.each(function () {
                    var product = $(this),
                        name = product.attr('data-name').toLowerCase();

                    if(name.indexOf(search) > -1)
                        product.show();
                });
                //STRICT SEARCH END
            }

            if($('.product:visible').length)
                $('#noResults').hide();
            else
                $('#noResults').show();
        }else{
            showResults(products);
        }
    }

    function fixFiltersPosition () {
        var windowPos = $(window).scrollTop(),
            container = $('.ssl-filters-container'),
            stuckPos = $('.sslContainer').height();

        // console.log($('.sslContainer').height());
        //
        if(stuckPos > 10000)
            stuckPos -= 245;
        else if(stuckPos > 2000)
            stuckPos -= 50;
        else
            stuckPos -= 11;

        if(windowPos >= fixFilters){
            filters.addClass('fixed-filters');

            // pgHeight   = $(document).height();
            // prEnd      = $('.sslContainer').height() + $('.sslContainer').offset().top - 16;
            // coverage   = prEnd / pgHeight;
            //
            //
            // footStart =  $('footer').offset().top - $('.disclaimer:last').outerHeight();
            // footPer = footStart / pgHeight;
            //
            // scroll     = $(window).scrollTop();
            // scrollPer  = windowPos / pgHeight + 0.05;
            // fixedPer   = scrollPer + coverage / 4;

            // if(fixedPer >= 1)
            //     fixedPer = scrollPer + coverage / 16;

            if(windowPos >= stuckPos)
                filters.css({
                    'position'  : 'absolute',
                    'top'       : $('.sslContainer').height() + 16 - filters.height() + 'px',
                    'z-index'   : 99
                });
            else if(windowPos < stuckPos && filters.css('position') == 'absolute')
                filters.attr('style', '');

        }else
            filters.removeClass('fixed-filters').attr('style', '');

    }

    function showResults (products){
        products.show();

        if($('.product.ssl_product:visible').length)
            $('#noResults').hide();
        else
            $('#noResults').show();
    }

    function scrollTop(){
        $('html, body').animate({scrollTop : fixFilters},400);
    }

    function enable_all_filter_option () {
        $('.mobileFilters').each(function () {
            var obj         = $(this),
                disabled    = obj.find('option:disabled');

            if(disabled.length) {
                disabled.disabled(false);

                obj.chosen_update(obj.val());
            }
        });
    }

    function disable_filter_options (mobileFilter, name) {
        mobileFilter.find('[value="' + name + '"]').disabled(true);

        mobileFilter.chosen_update(mobileFilter.val());
    }

    fixFiltersPosition();
});