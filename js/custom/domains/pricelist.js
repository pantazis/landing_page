$(document).ready(function(){
    var tiersSelect     = $('#tiersSelect'),
        filtersSelect   = $('select.filters'),
        table           = $('#domains-pricelist').find('tbody'),
        reflow_dropdown = false;

    $('tbody tr').each(function () {
        var currentTr   = $(this),
            firstTd     = currentTr.find('td:first');

        firstTd.append($('#tldSmallTemp').html()
            .replace('##registerCont##', currentTr.find('.registerCont').html())
            .replace('##renewCont##', currentTr.find('.renewCont').html())
            .replace('##transferCont##', currentTr.find('.transferCont').html())
            .replace('##lengthCont##', currentTr.find('.lengthCont').html()));

        var dropdown_trigger_small  = firstTd.find('.dropdown');

        if(dropdown_trigger_small.length) {
            var dropdown_small = firstTd.find('#' + dropdown_trigger_small.attr('data-dropdown'));

            dropdown_trigger_small.attr_app('data-dropdown', '-small');
            dropdown_small.attr_app('id', '-small');

            reflow_dropdown = true;
        }
    });

    if(reflow_dropdown)
        $(document).foundation('dropdown', 'reflow');

    tiersSelect.apply_chosen($('.tier.active').attr('data-tier')).on('change', function () {
        $('tbody .expand').removeClass('expand');

        $('.tier' + $(this).val()).click();
    });

    filtersSelect.apply_chosen(filtersSelect.val()).on('change', function () {
        var obj     = $(this),
            option  = obj.find('option:selected');

        $('#mobileResultsSearch').val('');
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

        var discountFilter = $('.ButtonFilters.discount.selected');
        if(discountFilter.length)
            discountFilter.trigger('click');

        tiersSelect.chosen_update(targetTier);
        colorRows();

        $('.discount_msg').hide().filter('[data-visible-for*="' + targetTier + ',"],[data-visible-for$="' + targetTier + '"]').show().each(function () {
            var obj = $(this).find('span');

            if($.htmlLookUp(obj.attr('data-comment-tier-' + targetTier)))
                obj.html(obj.attr('data-comment-tier-' + targetTier).trim());
            else
                obj.text(obj.attr('data-comment-tier-' + targetTier).trim());
        });
    });

    $('span.favorite').on('click',function(){
        var obj = $(this);

        if(obj.hasClass('selected')){
            obj.attr({'title':DOMAINS_LANG['PRICELIST']['FAV_TITLE']['ADD']});
            obj.removeClass('selected');
            if($('.ButtonFilters.favorite').hasClass('selected') || $('option.favorite').is(':selected')){
                obj.closest('tr').hide();
                colorRows();
            }
            $.cookie_api('tldFav', obj.closest('tr').data('tld').replace(/^\./,''), 'pull', token);
        }else{
            obj.attr({'title':DOMAINS_LANG['PRICELIST']['FAV_TITLE']['REMOVE']});
            obj.addClass('selected');
            $.cookie_api('tldFav', obj.closest('tr').data('tld').replace(/^\./,''), 'push', token);
        }
    });

    $('#TLD-Name').on('input change',function(){
        var obj = $(this);

        $('.ButtonFilters.selected').removeClass('selected');
        $('.ButtonFilters.all').addClass('selected');

        $('.FilterSelector').val('all');

        filterByName(obj, $('tbody tr'));
        colorRows();

        $('#mobileResultsSearch').val(obj.val());
        filtersSelect.chosen_update('');

        handleNoResultWrn();
    });

    $('.ButtonFilters').on('click',function(e){
        e.preventDefault();
        var obj = $(this);

        $('#TLD-Name').val('');
        $('.ButtonFilters.selected').removeClass('selected');
        obj.addClass('selected');

        criteriaApplierMain(obj, $('tbody tr'));
        colorRows();

        var option = filtersSelect.find('option[data-src="' + obj.attr('class').split(' ')[1] + '"]');

        if(option.length > 1)
            option = option.filter(['data-target="' + obj.attr('data-target') + '"']);

        filtersSelect.chosen_update(option.val());

        handleNoResultWrn();
    });

    $('#mobileFilters').show().on('click', function (e) {
        e.preventDefault();

        $(this).closest('div').find('.cd-panel').addClass('is-visible');
    });

    $('.cd-panel-close').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.cd-panel').removeClass('is-visible');
    });

    $('.apply-filters').on('click', function (e) {
        e.preventDefault();

        $('tbody .expand').removeClass('expand');

        var obj     = $(this),
            panel   = obj.closest('.cd-panel'),
            input   = panel.find('#mobileResultsSearch'),
            filters = panel.find('.filters');

        if(input.val()){
            filters.chosen_update('');

            $('#TLD-Name').val(input.val()).change();
        }else{
            $('#TLD-Name').val('');

            var option          = filters.find('option:selected'),
                activateFilter  = $('.ButtonFilters').filter('.' + option.attr('data-src'));

            if(activateFilter.length > 1)
                activateFilter = activateFilter.filter('[data-target="' + option.attr('data-target') + '"]');

            activateFilter.click();
        }

        $('.cd-panel-close').click();
    });

    $(document)
        .on('click', '.sorter:not(.inActive)',function(e){
            e.preventDefault();

            var obj     = $(this),
                rows    = $('tbody tr').get(),
                sortBy      = obj.closest('th').data('sort'),
                decision    = ((obj.hasClass('asc')) ? 1 : -1);

            $('.sorter.active').removeClass('active');
            obj.addClass('active');

            tableSort(rows,sortBy, decision);
            $.each(rows, function(index, row) {
                $('tbody').append(row);
            });
            colorRows();
        })
        .on('click', '.sorter.inActive', function (e) {
            e.preventDefault();
        })
        .on('click', '.arrow-animate', function () {
            var td = $(this).closest('td');

            if(td.hasClass('expand')){
                td.removeClass('expand');
            }else{
                $('tbody .expand').removeClass('expand');
                td.addClass('expand');
            }
        });

    function filterByName(TLDName, target){
        target.hide();
        nameValue = TLDName.val().substring(1,-TLDName.val().length);
        if(nameValue == '.'){
            nameValue = TLDName.val().slice(1).toLowerCase();
        }else{
            nameValue = TLDName.val().toLowerCase();
        }
        if (nameValue != '' && nameValue !== undefined) {
            target.filter('[data-tld^="'+nameValue+'"],[data-tld*=".'+nameValue+'"]').show();
        }else{
            target.show();
        }
    }

    function tableSort(rows,sortBy, decision){
        rows.sort(function(a, b) {
            switch (sortBy){
                case 'tld':
                    var A = $(a).data(sortBy).toUpperCase(),
                        B = $(b).data(sortBy).toUpperCase();
                    break;
                case 'price-register':
                    A = $(a).find('.registerCont').get_price();
                    B = $(b).find('.registerCont').get_price();
                    break;
                case 'price-renew':
                    A = $(a).find('.renewCont').get_price();
                    B = $(b).find('.renewCont').get_price();
                    break;
                case 'price-registrant':
                    A = $(a).find('.transferCont').get_price();
                    B = $(b).find('.transferCont').get_price();
                    break;
            }

            if(A < B)
                return (-1 * decision);
            else if(A > B)
                return (1 * decision);

            return 0;
        });
    }

    $(window).on('resize', function () {
        if($.getSizeClassification('medium_up'))
            $('tbody .expand').removeClass('expand');
    });

    function colorRows(){
        $('.even').removeClass('even');
        $('tr:visible').addClass('TLDsSelected');
        $('.TLDsSelected').filter(':even').addClass('even');
        $('.TLDsSelected').removeClass('TLDsSelected');
    }

    function handleNoResultWrn () {
        if(table.find('tr:visible').length < 1){
            $('.sorter').addClass('inActive');
            table.append('<tr id="noResultWrn"><td colspan="5" class="text-left"><span class="smaller">' + $.translate('MISC.TABLES.NO_RESULTS') + '</span></td></tr>');
        }else if(table.find('tr:visible').length > 1){
            $('.sorter').removeClass('inActive');
            table.find('#noResultWrn').remove();
        }
    }
});