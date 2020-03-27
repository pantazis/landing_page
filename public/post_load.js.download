$(document).ready(function() {
    //Polyfill
    if (!Date.prototype.toISOString) {
        (function() {

            function pad(number) {
                if (number < 10) {
                    return '0' + number;
                }
                return number;
            }

            Date.prototype.toISOString = function() {
                return this.getUTCFullYear() +
                    '-' + pad(this.getUTCMonth() + 1) +
                    '-' + pad(this.getUTCDate()) +
                    'T' + pad(this.getUTCHours()) +
                    ':' + pad(this.getUTCMinutes()) +
                    ':' + pad(this.getUTCSeconds()) +
                    '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                    'Z';
            };

        }());
    }

    $.extend({
        md : new MobileDetect(window.navigator.userAgent)
    });

    $('#site-menu').sidr({
        name: 'side-nav',
        // source: '#navigation',
        side: 'right',
        onOpen: function(){
            var body = $('body');

            body.append('<div class="reveal-sidr-bg"></div>');
            body.css('overflow', 'hidden');

            $('.reveal-sidr-bg').width($(document).width()).height($(document).height());

            $('#side-nav').css('overflow','auto');
            $('#backend-mobile-nav').css({'position':'fixed', 'right':'0px'});
        },
        onClose: function(){
            $('.reveal-sidr-bg').remove();
            $('#backend-mobile-nav').css({'position':'absolute', 'right':''});
        }
    });

    user = $('#user-menu').sidr({
        name: 'backend-side-nav',
        // source: '#backendSidrTarget',
        source: '',
        side: 'right',
        onOpen: function () {
            var body = $('body');

            body.append('<div class="reveal-sidr-bg"></div>');
            body.css('overflow', 'hidden');

            $('.reveal-sidr-bg').width($(document).width()).height($(document).height());

            $('#backend-side-nav').css('overflow', 'auto');
            $('#backend-mobile-nav').css({'position':'fixed', 'right':'0px'});
        },
        onClose: function () {
            $('.reveal-sidr-bg').remove();
            $('#backend-mobile-nav').css({'position':'absolute', 'right':''});
        }
    });

    $('.the-at').each(function () {
        var obj = $(this),
            parent = $(obj.parents()[0]);

        parent
            .on('mouseover', function () {
                if (parent.html().indexOf('@') < 0)
                    parent.html(parent.html().replace('support', 'support@')).find('span').hide();
            })
            .on('mouseleave', function () {
                parent.html(parent.html().replace(/@/g, '')).find('span').show();
            });
    });

    $(document).on('click', '.reveal-password', function (e) {
        var obj     = $(this),
            type    = 'text password',
            pass    = obj.closest('form').find('#' + obj.attr('data-target'));

        obj.find('i').toggleClass('icon-hide icon-eye');
        pass.attr('type', type.replace(pass.attr('type'),'').trim());
    });

    $('#showGDPRLaws,.showGDPRLaws').on('click', function (e) {
        e.preventDefault();

        $('#gdpr_approval_modal').modal_open();
    });

    try {
        if('billingProfile' in vat && 'vat_waived' in vat.billingProfile){
            if(vat.billingProfile.vat_waived){
                $('[value="no-Vat"],[value="sid-no-Vat"]').prop('checked', true);
                $('[name="Vat"],[name="sid-Vat"]').disabled(true);
                $('.billing-profile-vat').show().find('.vat-widget-notice').hide().filter('#vatWaivedNotice').show()
            }
        }
    } catch (e) {}

    var news_letter_form                    = $('#news_letter_form'),
        black_friday_news_letter_form       = $('#black_friday_news_letter_form');

    if(news_letter_form.length) {
        $('[name="newsletter"]').on('focus', function () {
            $(this).closest('form').find('.newsletterGDPRApprovalContainer').show();
        });

        news_letter_form.prepare_form_advanced({
            onSuccess: function (form) {
                var newsletterGDPRApprovalContainer= form.find('.newsletterGDPRApprovalContainer');

                if (newsletterGDPRApprovalContainer.css('display') != 'block') {
                    newsletterGDPRApprovalContainer.show();
                    form.validate();
                } else {
                    var formId = form.attr('id'),
                        disabled = form.find('[disabled]');

                    disabled.disabled(false);

                    var data = form.serialize();

                    disabled.disabled(true);

                    if (form.find('[name="newsletter_agree_terms"]:checked').length)
                        data += '&communication_agreement=1&data_validity=1&processing_approval=1';

                    $.ajax(new $.ajax_prototype(
                        {
                            'type': 'POST',
                            'url': form.attr('action'),
                            'data': data,
                            'success': function (data) {
                                if (data.success) {
                                    $('[name="newsletter"]:not([disabled])').val('');
                                    $.alertHandler('', data.msg, alert_box_success);
                                    $('#newsletterFooterCaptcha').slideUp();
                                    form.find('.newsletterGDPRApprovalContainer').hide().find('[type="checkbox"]').prop('checked', false);
                                } else {
                                    globalApplicationErrors(data, formId)
                                }

                                if (app_env != 'local')
                                    grecaptcha.reset(activeCaptcha[form.find('.g-recaptcha').attr('id')]);
                            },
                            'preerrorcallback': function () {
                                if (app_env != 'local')
                                    grecaptcha.reset(activeCaptcha[form.find('.g-recaptcha').attr('id')]);
                            }
                        }, 'news_letter_form', {
                            'complete': function () {
                                form.find('.disabled').removeClass('disabled');
                            }
                        }
                    ));
                }
            },
            handlers: '#newsLetterBtn',
            disable_exception: true,
            version_exception: true
        });
    }

    if(black_friday_news_letter_form.length)
        black_friday_news_letter_form.prepare_form_advanced({
            onSuccess           : function (form) {
                var formId = form.attr('id');
                $.ajax(new $.ajax_prototype(
                    {
                        'type'              : 'POST',
                        'url'               : form.attr('action'),
                        'data'              : form.serialize(),
                        'success'           : function (data) {
                            if(data.success){
                                $('[name="newsletter"]').val('');
                                $.alertHandler('', data.msg, alert_box_success);
                                $('#blackFridayNewsletterFooterCaptcha').slideUp();
                            }else{
                                globalApplicationErrors(data, formId)
                            }

                            grecaptcha.reset(activeCaptcha[form.find('.g-recaptcha').attr('id')]);
                        },
                        'preerrorcallback'  : function () {
                            grecaptcha.reset(activeCaptcha[form.find('.g-recaptcha').attr('id')]);
                        }
                    }, 'news_letter_form', {
                        'complete' : function () {
                            form.find('.disabled').removeClass('disabled');
                        }
                    }
                ));
            },
            handlers            : '#blackFridayNewsLetterBtn',
            disable_exception   : true,
            version_exception   : true
        });

    var newsLetterInput = $('[name="newsletter"]');

    if(newsLetterInput.length)
        newsLetterInput.on('focus', function () {
            $(this).closest('form').find('.captcha-wrapper').slideDown();
        });

    $('.lang_change').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        $.ajax(new $.ajax_prototype(
            {
                'type'      : 'POST',
                'url'       : obj.attr('href'),
                'data'      : {
                    '_token'        : $('[name="_token"]').val(),
                    'currentUrl'    : window.location.href
                },
                'success'   : function (data) {
                    window.location.reload(true);
                }
            })
        );
    });

    setTimeout(function () {
        $('.captcha-wrapper iframe').each(function () {
            $(this).attr('sandbox', 'allow-modals allow-popups-to-escape-sandbox');
        });
    }, 2000);

    $.getRegisterEventCookie();
    $.getLoginEventCookie();

    try {
        iOSGApp = $.md.os().toLowerCase() == 'ios' && window.navigator.appVersion.search('GSA') > -1
    } catch (er) {
        iOSGApp = false;
    }

    if (iOSGApp) {
        $('#btmNavCont').remove();
    } else {
        $('#btmNavCont').show();
    }

    var promoTopBar = $('.promo-top-bar');

    if (promoTopBar.length) {
        (function () {
            var mobile_nav = $('#mobile-nav'),
                offset = promoTopBar.height(),
                canDo = true;

           /* getMobileNavOffset();

            window.addEventListener('scroll', function () {
                getMobileNavOffset();
            });*/

            promoTopBar.find('.close').on('click', function () {
                canDo = false;

                setTimeout(function () {
                    mobile_nav.css('top', 0);

                    $.ajax(
                        new $.ajax_prototype({
                            'type'      : 'POST',
                            'data'      : {
                                '_token' : $('[name="_token"]').val()
                            },
                            'url'       : bannerCloseUrl,
                            'success'   : function (data) {}
                        })
                    )
                }, 250)
            });

            function getMobileNavOffset () {
                if (!canDo)
                    return;

                if (window.pageYOffset == 0)
                    mobile_nav.css('top', offset);
                else {
                    var newOffset = offset - window.pageYOffset;

                    if (newOffset > -1)
                        mobile_nav.css('top', newOffset);
                    else
                        mobile_nav.css('top', 0);
                }
            }
        })()
    }
});

$(window).on('load', function () {
    var iOSGApp;

    try {
        iOSGApp = $.md.os().toLowerCase() == 'ios' && window.navigator.appVersion.search('GSA') > -1
    } catch (er) {
        iOSGApp = false;
    }

    if ($.isMobile() && $.getSizeClassification('medium_down')) {
        var chat = '<div class="chat-block" ' + ((iOSGApp == false) ? '' : 'style="bottom: 130px"') + '><a href="https://lc.chat/now/10121972/7" target="_blank"><i></i></a></div>';

        $('body').append(chat);
    }
});

//--------------------------------------------------sticky-header---------------------------------------

          var headerTopBanner=$(".promo-top-bar");
          var mainNav =$("div#main_nav");
           var mainNavHeight;
            var pageScrollPosition;
            var navSpacer = $(".nav-spacer");
            var headerTopBannerHeight;



       if($("#custom-nav").length == 0 &&
           $("li .smoothScroll").length == 0 ||
           window.innerWidth < 1025){

           $(window).scroll(function(){

           mainNavHeight = mainNav.height();
           navSpacer.css("height",mainNavHeight+"px" );

           pageScrollPosition=$(this).scrollTop();

          if(headerTopBanner.length==1){
              headerTopBannerHeight = headerTopBanner.height();
          }else{
             headerTopBannerHeight = 0;
          };

                   if(pageScrollPosition > headerTopBannerHeight){
                        $("body").addClass("sticky_menu");
                   }else{
                        $("body").removeClass("sticky_menu");
                   }

                });

        }


        //--------------------------------------------------/sticky-header---------------------------------------
