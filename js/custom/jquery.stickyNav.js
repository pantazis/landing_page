;
(function ($, window) {

  'use strict';

  $.fn.stickyNavbar = function (prop) {

    var options = $.extend({
      header: '.header',
      activeClass: 'active',
      attachActiveClassTo: 'li',
      animationDuration: 500,
      easing: 'swing',
      disableOnMobile: true,
      mobileWidth: 640 ,
      offsetTo:   0
    }, prop);

    var header = options.header ? $(options.header) : undefined
      , navBar = $(this);
      var offsetTo = options.offsetTo;
    if (navBar.length == 0) {
      return;
    }

    if (options.disableOnMobile && $(window).width() <= options.mobileWidth) {
      return;
    }

    var stickyPosition = header ? header.outerHeight(true) : 0
      , heroHeight = navBar.offset().top - stickyPosition,
      navBarHeight = navBar.outerHeight(true);

    // collect all the sections for jumping
    var sections = new jQuery();
    navBar.find('li a').map(function () {
      var id = $(this).attr('href');
      sections = sections.add($(id));
    });

    // because we have header/banner so there is offset for sections
    var sectionsOffset = stickyPosition + navBarHeight + 2;

    // the active menu in navigator
    var activeOne;
    var myoff = $('#sub-nav').offset().top;

    function initSecondaryNav() {
      navBar.before('<div class="nav-placeholder"></div>');
      $('.nav-placeholder').css('padding-bottom', navBarHeight  + 'px');
      $('.nav-placeholder').css('padding-bottom', navBarHeight + 'px');
      $('.nav-placeholder').css('height', '0px');
      $('.nav-placeholder').css('z-index', '-9999');

      navBar.css('position', 'fixed').css('margin-top', -navBarHeight - offsetTo + 'px' );
      scrollCallback();

    }

    function addActiveState(sections) {

      var windowScrollHeight = $(window).scrollTop();
      sections.each(function (index) {
          var top = $(this).offset().top
            , bottom = $(this).outerHeight(true) + top;

          windowScrollHeight = $(window).scrollTop();

          if (
            (windowScrollHeight > top - sectionsOffset && windowScrollHeight < bottom - sectionsOffset)
            || (index == 0 && windowScrollHeight < top - sectionsOffset)
            || (index == sections.length - 1 && windowScrollHeight > bottom - sectionsOffset)
            ) {

            if (activeOne) {
              
              activeOne.removeClass(options.activeClass);
            }
            activeOne = options.attachActiveClassTo === 'a' ?
              navBar.find('li a[href~="#' + this.id + '"]')
              : navBar.find('li a[href~="#' + this.id + '"]').parents('li');
            if( windowScrollHeight > myoff )
            {

              activeOne.addClass(options.activeClass);
            }
          }

        }
      );

    }

    function positionNavBar() {

      if ($(window).scrollTop() >= 0) {
        if( $(window).scrollTop() < heroHeight )
        {
           navBar.css('margin-top', -navBarHeight - $(window).scrollTop()  + 'px');
           
        }
        else
        {
          navBar.css('margin-top', -navBarHeight - heroHeight  - offsetTo + 'px' );
        }
      }
    }

    function scrollCallback() {
      positionNavBar();
      // put this into next tick
      setTimeout(function () {
        addActiveState(sections);
      }, 1);
    }

    function smoothScroll(e) {
      e.preventDefault();
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').stop().animate({
            scrollTop: target.offset().top - stickyPosition - navBarHeight + offsetTo
          }, {
            duration: options.animationDuration,
            easing: options.easing
          });
        }
      }
    }


    initSecondaryNav();
    $(window).on('scroll', scrollCallback);
    $(this).find(' a[href*=#]:not([href=#])').on('click', smoothScroll);
  }
})
(jQuery, window, document);