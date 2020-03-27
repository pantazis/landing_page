$(document).ready(function(){
    cookieSource = null;

    var inputs      = $('#searchbar, #searchHeaderBar'),
        searchForms = inputs.closest('form'),
        touchTimer  = null;

    inputs.on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();

            $(this).closest('form').find('#searchTrigger, #searchHeaderTrigger').click()
        }
    });

    searchForms.on('submit', function (e) {
        e.preventDefault();

        $(this).find('#searchTrigger, #searchHeaderTrigger').click();
    });

    $(document)
        .on('click', '#searchTrigger, .searchbar:not(.transfer) #searchHeaderTrigger',function(e){
            e.preventDefault();
            var obj     = $(this),
                form    = obj.closest('form'),
                input   = form.find('input:not([name="_token"])');

            if(input.val() != '') {
                obj.find('.submitText').hide();
                obj.find('.loading').show();

                form.off('submit');
                form.trigger('submit');
            }
        })
        .on('click', '.searchbar.transfer #searchHeaderTrigger', function (e) {
            e.preventDefault();

            var obj     = $(this),
                form    = obj.closest('form'),
                input   = form.find('input:not([name="_token"])');

            if(input.val() != '') {
                obj.find('.submitText').hide();
                obj.find('.loading').show();

                $.set_cookie('domain_transfer', input.val(), '/', location.origin + '/domains/μεταφορά-domain');
            }
        })
        // .on('click', '.searchbar #hp-search a', function (e) {
        //     e.preventDefault();
        //
        //     handleModeChange($(this));
        //     e.stopPropagation();
        // })
        .on('touchstart click', '.searchbar #hp-search a', function (e) {
            e.preventDefault();

            if (touchTimer != null)
                clearTimeout(touchTimer);

            var obj = $(this);
            touchTimer = setTimeout(function () {
                handleModeChange(obj);

                if ($.md.mobile() != null || $.md.phone() != null || $.md.tablet() != null)
                    $('[data-dropdown="hp-search"]').click();
            }, 100);
        });

    function handleModeChange (obj) {
        var search  = obj.closest('.searchbar'),
            dropDownBtn             = search.find('[data-dropdown="hp-search"]'),
            searchHeaderBar         = search.find('#searchHeaderBar'),
            searchHeaderTrigger     = search.find('#searchHeaderTrigger'),
            searchHeaderTriggerI    = searchHeaderTrigger.find('i');

        search.toggleClass('transfer');
        searchHeaderTrigger.toggleClass('success');
        searchHeaderTriggerI.toggleClass('icon-search icon-loop');

        if (search.hasClass('transfer')) {
            obj.translate('domains.searchbar.mode.search').attr('title', $.translate('domains.searchbar.mode.search_title'));
            dropDownBtn.translate('domains.searchbar.mode.transfer');
            searchHeaderBar.attr('placeholder', $.translate('domains.searchbar.mode.transfer_ph'));
        } else {
            obj.translate('domains.searchbar.mode.transfer').attr('title', $.translate('domains.searchbar.mode.transfer_title'));
            dropDownBtn.translate('domains.searchbar.mode.search');
            searchHeaderBar.attr('placeholder', $.translate('domains.searchbar.mode.search_ph'));
        }
    }
});