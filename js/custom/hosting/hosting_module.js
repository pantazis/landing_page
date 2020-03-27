$(document).ready(function () {
    var setCookies = [];

    $(document)
        .on('click', '.hosting-module .price-box a', function (e) {
            if (e.ctrlKey) {
                $(this).trigger('remarketing:new-tab');
                return;
            }

            e.preventDefault();

            $('#postChoiceToRemarketingForm').attr('action', $(this).attr('href')).submit();
        })
        .on('mousedown', '.hosting-module .price-box a, .hosting-module .price-wrapper a', function (e) {
            if (e.which == 2)
                $(this).trigger('remarketing:new-tab');
            else if (e.which == 3)
                $(this).trigger('remarketing:possible-new-tab-window');

        })
        .on('touchstart', '.hosting-module .price-box a', function (e) {
            e.preventDefault();

            $('#postChoiceToRemarketingForm').attr('action', $(this).attr('href')).submit();
        })
        .on('touchstart click', '.hosting-module .price-wrapper a', function (e) {
            e.preventDefault();

            $('#postChoiceToRemarketingForm').attr('action', $(this).attr('href')).submit();
        })
        .on('remarketing:new-tab', '.hosting-module .price-box a', function () {
            if (app_env != 'local') {
                $(this).sendSelectContentForThisUrl();
            }
        })
        .on('remarketing:possible-new-tab-window', '.hosting-module .price-box a', function () {
            if (app_env != 'local') {
                var obj = $(this),
                    target = obj.attr('href').split('/');

                target = target[target.length - 1];
                target = target.toLowerCase().replace(/-/g,'_');

                var cookie_name = 'new_tab_remarketing_' + target;

                setCookies.push(cookie_name);
                Cookies.set(cookie_name, true,{path: '/'});
            }
        })
        .on('click', function () {
            if (setCookies.length) {
                $.each(setCookies, function (key, value) {
                    Cookies.remove(value);
                });
            }
        })
        .on('scroll', function () {
            if (setCookies.length) {
                $.each(setCookies, function (key, value) {
                    Cookies.remove(value);
                });
            }
        });
});