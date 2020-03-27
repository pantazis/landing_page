$(document).ready(function () {
    /* Bottom navigation*/
    var bottomNav = $('#btmNavCont'),
        md = new MobileDetect(window.navigator.userAgent),
        prev = 0,
        scrollTop = 0,
        iOSGApp;

    try {
        iOSGApp = md.os().toLowerCase() == 'ios' && window.navigator.appVersion.search('GSA') > -1
    } catch (er) {
        iOSGApp = false;
    }

    if (bottomNav.length) {
        (function () {
            var $window = $(window);

            var initialHeight = window.innerHeight;

            if (iOSGApp) {
                window.addEventListener('scroll', function () {
                    revealBottomNav();
                });

                window.addEventListener('resize', function () {
                    if (initialHeight != window.innerHeight)
                        bottomNav.css('bottom', '130px');
                    else
                        bottomNav.css('bottom', '0px');
                });
            } else {
                $window
                    .on('scroll', function () {
                        var scrollTop = $window.scrollTop();

                        bottomNav.toggleClass('hidden', scrollTop > prev);

                        prev = scrollTop;
                    })
                    .on('resize', function () {
                        if (iOSGApp) {
                            if (initialHeight != window.innerHeight)
                                bottomNav.css('bottom', '130px');
                            else
                                bottomNav.css('bottom', '0px');
                        }
                    });
            }

            function revealBottomNav ()  {
                scrollTop = $window.scrollTop();

                if (scrollTop < prev)
                    bottomNav.css('bottom', '0px').show();
                else
                    bottomNav.hide();

                bottomNav.toggleClass('hidden', scrollTop > prev);

                if (initialHeight != window.innerHeight) {
                    if (bottomNav.hasClass('hidden'))
                        bottomNav.css('bottom', '0px');
                    else
                        bottomNav.css('bottom', '130px');
                } else {
                    bottomNav.css('bottom', '0px');
                }

                prev = $window.scrollTop();
            }
        })();
    }
});