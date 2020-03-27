$(document).ready(function () {
    var tiersSelect     = $('#tiersSelect');

    tiersSelect.apply_chosen($('.tier.active').attr('data-tier')).on('change', function () {
        $('.tier' + $(this).val()).click();
    });

    $('button.tier').on('click', function () {
        var obj             = $(this),
            targetTier      = obj.attr('data-tier'),
            strikeThrough   = $('.strikethrough');

        $('.tier').removeClass('active');
        obj.addClass('active');

        strikeThrough.addClass('hide-important');
        $('.discount_target').removeClass('current-price');

        var visibleStricked = strikeThrough.filter('[data-visible-for*="' + targetTier + ',"],[data-visible-for$="' + targetTier + '"]');

        visibleStricked.removeClass('hide-important').next('.discount_target').addClass('current-price');

        $('.vat.tier').each(function () {
            var vat         = $(this),
                newPrice    = vat.attr('data-price-tier-' + targetTier);
            vat.update_vat('tier', [newPrice], 0);
        });

        tiersSelect.chosen_update(targetTier);

        $('.discount_msg').hide().filter('[data-visible-for*="' + targetTier + ',"],[data-visible-for$="' + targetTier + '"]').show().each(function () {
            var obj = $(this).find('span');

            if($.htmlLookUp(obj.attr('data-comment-tier-' + targetTier)))
                obj.html(obj.attr('data-comment-tier-' + targetTier).trim());
            else
                obj.text(obj.attr('data-comment-tier-' + targetTier).trim());
        });

        var $tierWrapper = $('.resp-table .price-wrapper:first'),
            strikethrough = $tierWrapper.find('.strikethrough'),
            imgPrices = $('.price-msg');

        if (strikethrough.length) {
            var imgPricesStrikeThrough = imgPrices.find('.strikethrough');

            imgPricesStrikeThrough.find('.vat').update_vat('price', [strikethrough.get_price()], [0]);

            if (! (strikethrough.get_price() > $tierWrapper.find('.vat:last').get_price()))
                imgPricesStrikeThrough.hide();
            else
                imgPricesStrikeThrough.show();
        }

        imgPrices.find('.vat:last').update_vat('price', [$tierWrapper.find('.vat:last').get_price()], [0]);
    });

    $('#tld_search').on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();

            $(this).closest('form').find('#searchBtn').click()
        }
    });

    $('#searchBar').on('submit', function (e){
        e.preventDefault();

        $('#searchBar').click();
    });

    $('#searchBtn').on('click',function(e){
        e.preventDefault();
        var form = $('#searchBar');

        var search = form.find('#tld_search').val().trim();

        if(search != '') {
            search = search.replace(/,|\||;/g, ' ').replace(/\s+/,' ').trim().split(' ');

            var $postfix = $('.searchContainer .postfix').text();

            for (var i in search) {
                if (search.hasOwnProperty(i)) {
                    search[i] = search[i].replace(/^[.-]|[.-]$/, '');

                    var possible_tld = search[i].match(/\./g);

                    if (possible_tld == null)
                        search[i] += $postfix;
                }
            }

            search = search.join(' ');

            $('#formatted_search').val(search);

            form.off('submit');
            form.trigger('submit');
        }
    });
});