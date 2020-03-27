$(document).ready(function(){
    var main_navigation = $('#navigation'),
        overlay         = $('#main_nav .overlay'),
        nav_background = $('#main_nav .nav-background'),
        phonesCont = $('.secondary-menu .phone'),
        topPos = 0;

    window.addEventListener('scroll', function(e) {
        if (topPos > 0 && topPos <= window.pageYOffset)
            menuFadeOut();
    });
    window.addEventListener('resize', function () {
        if ($('#main_nav .primary-menu:visible').length < 1)
            menuFadeOut();
    });

    main_navigation.find('.container > li > a').on('click', function(e) {
       e.preventDefault();
    });

    $(document)
        .on('click', '#navigation .container > li > a', function () {
            openMenuSection($(this));
        })
        .on('mouseenter', '#navigation .container > li > a:not(.is-active)', function () {
            if ($('#navigation .container > li > a.is-active').length) {
                openMenuSection($(this));
            }
        });

    function openMenuSection (obj) {
        var opened = obj.hasClass('is-active');

        $('#main_nav a, #main_nav .nav-dropdown').removeClass('is-active');

        if (! opened) {
            obj.closest('li').find('.nav-dropdown').addClass('is-active');
            obj.addClass('is-active');

            nav_background.addClass('is-active');
            overlay.show().addClass('is-active');

            phonesCont.hide();

            topPos = ($('#main_nav').height() + $('#main_nav .nav-background').height()) * 0.8;
        } else {
            nav_background.removeClass('is-active');
            overlay.hide().removeClass('is-active');

            phonesCont.show();
            topPos = 0;
        }
    }

    $(document)
        .on('click', function (e) {
            if (e.target != main_navigation && main_navigation.has(e.target).length < 1 && !nav_background.is(e.target) && nav_background.has(e.target).length < 1) {
                nav_background.removeClass('is-active');
                overlay.hide().removeClass('is-active');

                main_navigation.find('.is-active').removeClass('is-active');

                phonesCont.show();
                topPos = 0;
            } else {
                var activeSub = main_navigation.find('.with-dropdown.is-active');

                if (e.target = activeSub && activeSub.has(e.target).length < 1) {
                    activeSub.removeClass('is-active');
                }
            }
        });
        // .on('keydown', function (e) {
        //     if (main_navigation.has('.is-active')) {
        //         var target;
        //
        //         switch (event.keyCode) {
        //             case 37:
        //                 target = main_navigation.find('.container > li > a.is-active').closest('li').prev();
        //
        //                 if (target.length < 1)
        //                     target = main_navigation.find('.container > li:last');
        //
        //                 target.find('> a').click();
        //                 break;
        //             case 39:
        //                 target = main_navigation.find('.container > li > a.is-active').closest('li').next();
        //
        //                 if (target.length < 1)
        //                     target = main_navigation.find('.container > li:first');
        //
        //                 target.find('> a').click();
        //                 break;
        //         }
        //     }
        // });

    function menuFadeOut () {
        nav_background.removeClass('is-active');

        overlay.fadeOut(400, function () {
            overlay.removeClass('is-active');
        });

        $('#main_nav a, #main_nav .nav-dropdown').removeClass('is-active');

        phonesCont.show();
        topPos = 0;
    }
});