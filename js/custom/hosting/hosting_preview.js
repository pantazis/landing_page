$(document).ready(function () {
    $('.accordion-navigation > a').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        if(obj.hasClass('active'))
            obj.removeClass('active');
        else {
            obj.closest('.accordion-navigation').find('.active').removeClass('active');
            obj.addClass('active');
        }

    });

    $.observers.register('tabs', function (mutations) {
        if($.getSizeClassification('medium_up')) {
            for (mutation in mutations) {
                if (mutations[mutation].attributeName == 'class') {
                    if ((mutations[mutation].target.className).indexOf('active') > -1 && (mutations[mutation].target.className).indexOf('content') > -1) {
                        var navigation = $('.accordion-navigation');

                        navigation.find('a.active').removeClass('active');
                        navigation.find('a[href="#' + mutations[mutation].target.id + '"]').addClass('active');
                    }
                }
            }
        }
    });

    $.observers.observe('tabs', $('.hosting-module dd')[0], {subtree : true, attributes: true});

    window.addEventListener('resize', function () {
        try {
            clearTimeout(hostingPreview);
        } catch (e) {}

        hostingPreview = setTimeout(function () {
            fixTabsBasedOnView();
        }, 100);
    });
    
    function fixTabsBasedOnView () {
        if($.getSizeClassification('medium_up')) {
            var activeTabs = $('.hosting-module .accordion-navigation .content.active');

            if (activeTabs.length < 1) {
                var activeTab = $('.tab-title.active a');

                activeTab.click();
                $(activeTab.attr('href')).show();
            }
        }
    }
});