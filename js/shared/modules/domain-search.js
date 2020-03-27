$(document).ready(function () {
    var searchModuleController = $('#searchModuleController,.searchModuleController');

    $.fn.extend({
        domain_search : function (action) {
            return domain_search($(this), action);
        }
    });

    if (searchModuleController.length)
        $(searchModuleController.attr('data-target')).each(function () {
            $(this).domain_search('init');
        });

    function domain_search (form, action) {
        switch (action) {
            case 'init':
                return new init(form);
                break;
            default :
                throw 'Unknown ' + action + ' action';
                break;
        }

        return form;
    }

    function init (form) {
        form = form.closest('form');

        var trigger = form.find('.trigger'),
            input = form.find('.search-input'),
            drop = form.find('.drop');

        form.on('submit', function (e) {
            e.preventDefault();
        });

        trigger.on('click', function (e) {
            e.preventDefault();

            submitForm();
        });

        input.on('keypress', function(e) {
            if (e.which == 13) {
                e.preventDefault();

                submitForm();
            }
        });


        input.on('input', function(e) {
            var obj = $(this);

            try {
                clearTimeout(domainSearchConvertElTimer);
            } catch (e) {}

            domainSearchConvertElTimer = setTimeout(function () {
                if (!!obj.val()) {
                    /*var domains = input.val().split(REG.FQDN);

                    for (var i in domains) {
                        if (domains.hasOwnProperty(i) && domains[i].match(new RegExp('\\.el\W|\\.el$','g')) != null) {
                            domains[i] = domains[i].replace('el', 'ελ')
                        }
                    }

                    var tmp = [];

                    for (var i in domains) {
                        if (domains.hasOwnProperty(i) && domains[i].length) {
                            tmp.push(domains[i]);
                        }
                    }

                    obj.val(tmp.join(' '));*/

                    obj.val(obj.val().replace(/(\.el\s)|\.el$/g,function (i) {
                        return i.replace('el','ελ')
                    }));
                }
            }, 400);
        });

        if (drop.length) {
            drop.find('a').on('touchstart click', function (e) {
                e.preventDefault();

                try {
                    clearTimeout(touchTimer);
                } catch (er) {}

                touchTimer = setTimeout(function () {
                    handleModeChange();

                    if ($.md.mobile() != null || $.md.phone() != null || $.md.tablet() != null)
                        $('[data-dropdown="hp-search"]').click();
                }, 100);
            });

            function handleModeChange () {
                var search                  = drop.closest('.searchbar'),
                    dropDownBtn             = drop.find('button'),
                    searchHeaderBar         = search.find('.search-input'),
                    searchHeaderTrigger     = search.find('.trigger'),
                    searchHeaderTriggerI    = searchHeaderTrigger.find('i');

                search.toggleClass('transfer');
                searchHeaderTrigger.toggleClass('success');
                searchHeaderTriggerI.toggleClass('icon-search icon-loop');

                if (search.hasClass('transfer')) {
                    drop.find('a').translate('domains.searchbar.mode.search').attr('title', $.translate('domains.searchbar.mode.search_title'));
                    dropDownBtn.translate('domains.searchbar.mode.transfer');
                    searchHeaderBar.attr('placeholder', $.translate('domains.searchbar.mode.transfer_ph'));
                } else {
                    drop.find('a').translate('domains.searchbar.mode.transfer').attr('title', $.translate('domains.searchbar.mode.transfer_title'));
                    dropDownBtn.translate('domains.searchbar.mode.search');
                    searchHeaderBar.attr('placeholder', $.translate('domains.searchbar.mode.search_ph'));
                }
            }
        }

        function submitForm () {
            if(input.val() != '') {
                trigger.find('.submitText').hide();
                trigger.find('.loading').show();

                if (form.find('.transfer').length) {
                    $.set_cookie('domain_transfer', input.val(), '/', location.origin + '/domains/μεταφορά-domain');
                } else {
                    form.off('submit');
                    form.trigger('submit');
                }
            }
        }
    }
});