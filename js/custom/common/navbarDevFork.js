$(document).ready(function () {
    (function(){
        nav = $('#custom-nav');
        navWrapper = $('#wrapper-nav');

        if(nav.length < 1)
            return ;

        if (navWrapper.length < 1) {
            $('main').append('<div id="wrapper-nav" class="hide" style="position:fixed; top:0; width:100%; display: none">' + $('#custom-nav').html() + '</div>');
            navWrapper = $('#wrapper-nav');
        } else
            $('#wrapper-nav').html($('#custom-nav').html());

        nav_pos = nav.position().top;

        var sections            = $('#wrapper-nav a.customScroll'),
            sectionToOffsets    = {},
            firstSection        = sections.filter(':first').attr('href');

        sections.each(function (i) {
            var obj = $(this),
                sectionName = obj.attr('href'),
                section = $(sectionName);

            sectionToOffsets[sectionName] = [parseFloat(section.offset().top.toFixed(5)) - navWrapper.height() + 4];

            if (i > 0) {
                var prevSection = $(sections[i-1]),
                    prevSectionName = prevSection.attr('href');

                sectionToOffsets[prevSectionName].push(sectionToOffsets[sectionName][0]);
            }

            if (i == sections.length - 1) {
                sectionToOffsets[sectionName].push(sectionToOffsets[sectionName][0] + section.height());
            }
        });

        $('.customScroll').on('click', function (e) {
            e.preventDefault();

            var section = $($(this).attr('href'));

            if(section.length < 1)
                return ;

            if($.getSizeClassification('large_up'))
                var top = section.offset().top - $('#wrapper-nav').height() + 4;
            else
                top = section.offset().top;

            var target = ((top > nav_pos) ? top : nav_pos);

            if($(window).scrollTop() >= nav_pos && $.getSizeClassification('large_up')){
                $('#wrapper-nav').show();
            }

            $.smoothScroll({
                // afterScroll : function() {
                //     updateNav();
                // }
            }, target)
        });

        $('#toTop').smoothScroll({
            afterScroll : function() {
                if(!$.getSizeClassification('large_up'))
                    return ;

                $('#wrapper-nav').hide();

                navWrapper.find('.active').removeClass('active');
                nav.find('.active').removeClass('active');
            }
        });

        var scrolling           = false,
            isViewPortLarge     = $.getSizeClassification('large_up');

        scrollMenuVisibilitHandler();

        $(window).on('resize', function () {
            var currentViewPort = $.getSizeClassification('large_up');

            if (isViewPortLarge != currentViewPort) {

                if (! currentViewPort) {
                    navWrapper.hide();
                } else {
                    navWrapper.show();
                }

                isViewPortLarge = currentViewPort;
            }
        });

        window.addEventListener('scroll', function () {
            if (scrolling)
                return ;

            scrolling = true;

            scrollMenuVisibilitHandler();
        });

        function scrollMenuVisibilitHandler () {
            var current_pos = $(window).scrollTop();
            if (current_pos <= nav_pos) {
                navWrapper.hide();

                navWrapper.find('.active').removeClass('active');
                nav.find('.active').removeClass('active');
            } else {
                navWrapper.show();

                if (!window.requestAnimationFrame) {
                    if (typeof activateNavBtn != 'undefined' && activateNavBtn != null) {
                        scrolling = false;
                        return ;
                    }

                    activateNavBtn = setTimeout(function () {
                        activateBtn();
                        activateNavBtn = null;
                    }, 5);
                } else {
                    requestAnimationFrame(activateBtn);
                }
            }

            scrolling = false;
        }

        function activateBtn () {
            var current_pos = $(window).scrollTop();

            for (section in sectionToOffsets) {

                if (Math.floor(sectionToOffsets[firstSection][0]) == current_pos || (sectionToOffsets[section][0] < current_pos && current_pos < sectionToOffsets[section][1])) {
                    navWrapper.find('.active').removeClass('active');
                    navWrapper.find('[href="' + section + '"]').addClass('active');

                    nav.find('.active').removeClass('active');
                    nav.find('[href="' + section + '"]').addClass('active');
                    scrolling = false;
                    break;
                }
            }
        }

    })();
});