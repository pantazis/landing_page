$(document).ready(function(){
    var sidrClose = '<span class="sidClose"><i class="icon-cross3 hide"></i></span>',
        sidrArrow = '<span class="sidClose arrow"></span>';

    /*  Delete data-dropdown attribute from Mobile menu header links so they can work  */
    optionCountries= '';
    $.each(countries, function(key,value){
        optionCountries += '<option class="sidOptionCountries" value="'+value['iso_2']+'" data-name="'+COMMON_LANG.COUNTRIES[value['iso_2']]+'" data-vat="'+value['vat_rate']+'">'+COMMON_LANG.COUNTRIES[value['iso_2']]+'</option>';
    });

    var global_side_nav = $('#side-nav');
    global_side_nav.append('<div id="sidNavContainer"></div>');

    var items_in_cart = $.cart.get_items().length;


    var containers = $('.sidr-class-inline-list>li:not(#sidCartContainer)');

    containers.each(function () {
        var obj         = $(this),
            htmlTemp    = obj.html();

        obj.html(('<div style="display:none;">' + htmlTemp + '</div>').replace(/\s+/g,' ').replace(/> </g,'>\r\n<'));

        var mainAnchor = obj.find('a.sidr-class-button');
        mainAnchor.html(mainAnchor.text() + ' ' + sidrArrow);
        obj.prepend(mainAnchor);

        var telAnchor = obj.find('a.sidr-class-tel');
        obj.prepend(telAnchor);
    });

    $('.sidr-class-with-dropdown').each(function () {
        var obj = $(this);

        obj.append('<div style="display: none"></div>');

        obj.find('div').append(obj.find('> ul'));

        var mainAnchor = obj.find('a:first');
        mainAnchor.addClass('sidr-class-button').html(mainAnchor.text() + ' <span class="sidClose arrow"></span>');
    });


    $(document)
        .keypress(function(e){
            disabled_scroll_with_arrows(e);
        })
        .on('touchstart  click', function(e){
            out_of_sidr_click(e);
        })
        .on('click', 'a.sidr-class-button:not(#cartController)',function(e){
            e.preventDefault();
            var obj             = $(this),
                containingDiv   = obj.closest('li').find('div');

            if (($(e.target).is('span') || $(e.target).is('i')) && containingDiv.css('display') != 'none') {
                obj.closest('li').find('div:not(#countriesContainer):not(.countries-wrapper)').slideUp(400);
                obj.find('.sidClose').removeClass('active').find('i').toggleClass('hide');
            } else {
                if (containingDiv.css('display') == 'none') {

                    var closestContainer = obj.closest('li');

                    if (! closestContainer.hasClass('sidr-class-with-dropdown')) {
                        $('.sidr-class-inline-list > li div:not(#countriesContainer):not(.countries-wrapper)').slideUp(400);
                        $('.sidClose').removeClass('active').find('i').addClass('hide');
                    } else {
                        var closestContainerGrouper = closestContainer.closest('ul');

                        closestContainerGrouper.find('div:not(#countriesContainer):not(.countries-wrapper)').slideUp(400);
                        closestContainerGrouper.find('.sidClose').removeClass('active').find('i').addClass('hide');
                    }

                    var closestContainerDiv = obj.closest('.sidr-inner'),
                        containerDivs   = $('#backend-side-nav .sidr-inner:not(:eq(' + closestContainerDiv.index() + '))');

                    containerDivs.find('.sidr-class-with-dropdown div:not(#countriesContainer):not(.countries-wrapper)').slideUp(400);
                    containerDivs.find('.sidClose').removeClass('active');

                    var div_wrapper = obj.closest('li').find(' > div');

                    if(div_wrapper.has('.countries-wrapper') && $('[name="sid-Vat"]:checked').val() == 'sid-Vat'){
                        div_wrapper.find('#countriesContainer').show();
                    }

                    div_wrapper.slideDown(400);

                    var arrow = obj.find('.arrow');

                    if (arrow.length)
                        arrow.toggleClass('active');
                    else
                        obj.find('i').toggleClass('hide');
                } else {
                    var linkTarget = obj.attr('href');

                    window.location.href = linkTarget;
                }
            }
        })
        .on('click', '.sidr-close', function (e) {
            e.preventDefault();

            var obj = $(this).closest('.sidr');

            $.sidr('close', obj.attr('id'));
            obj.find('div:has(> ul):not(.sidr-inner)').slideUp();
            obj.find('.sidClose.arrow.active').removeClass('active');
        });

    // Handle Sidr Side menu from small-medium to large screens
    $(window).resize(function(){
        if ($(window).width() > 1024) {
            $.sidr('close', 'side-nav');
            $.sidr('close', 'backend-side-nav');
        }

        if(typeof resizeNavTimer == 'undefined' || resizeNavTimer == null)
            resizeNavTimer = setTimeout(function () {
                hideShowNavItemsBasedOnWidth();

                resizeNavTimer = null;
            })
    });

    $.extend({
        intMenuCreation : intMenuCreation
    });

    function intMenuCreation () {
        hideShowNavItemsBasedOnWidth();

        menuFunction = {
            'getHostingHeader'  : getHostingHeader,
            'getActionLink'     : getActionLink,
            'getLogoutLink'     : getLogoutLink,
            'getAccountName'    : getAccountName
        };

        debug = true;

        setStaticMenu($siteMenuConfig.common);

        debug = false;

        try {
            setBackendMenu($userMenuConfig[$userGroup]);
        } catch (e) {}
    };

    function getHostingHeader (choices) {
        if ($jsMenu.has_pbas_account != true)
            return choices[0];
        else
            return choices[1];
    }

    function getActionLink (choices) {
        if ($jsMenu.has_pbas_account != true)
            return choices[0];
        else
            return choices[1];
    }

    function getLogoutLink (choices) {
        if ($userGroup == 'guest')
            return false;

        if ($userGroup == 'user')
            return choices[0];
        else
            return choices[1];
    }

    function getAccountName (choices) {
        var link = choices[0];

        link.link.text = $jsMenu.account_name;
        link.link.title = $jsMenu.account_name;

        return link;
    }

    function setBackendMenu (config) {
        var container   = $('#backend-side-nav');

        container.empty();
        loopLists (container, config);

        var support = $('#sidSupportContainer');

        /**
         * SIDE NAV CART START
         */
        $.cart.inc();
        /**
         * SIDE NAV CART END
         */


        /**
         * SIDE NAV SUPPORT START
         */
            var supportContainer = $('#supportContainer');
            support.append('<div style="display: none"></div>').find('> div').append(((supportContainer.is('noscript')) ? supportContainer.html() : supportContainer.find('ul').clone()));
            support.find('ul').attr({'id':'','class':'support-wrapper'}).find('.line span').addClass('sidr-support-tel');
        /**
         * SIDE NAV SUPPORT END
         */

        /**
         * SIDE NAV VAT START
         */
            optionCountries= '';
            $.each(countries, function(key,value){
                optionCountries += '<option class="sidOptionCountries" value="'+value['iso_2']+'" data-name="'+COMMON_LANG.COUNTRIES[value['iso_2']]+'" data-vat="'+value['vat_rate']+'">'+COMMON_LANG.COUNTRIES[value['iso_2']]+'</option>';
            });

            if(vat['country'] != 'OTHER') {
                quote = vat['quote'].toString().split('.');
                quote = parseInt(quote[1]);

                if (quote < 10) {
                    quote *= 10;
                }
            }else{
                quote = '';
            }

            $appendVat = '<ul class="vat-wrapper">'
                +'<li>'
                +'<input id="sid-no-Vat" type="radio" value="sid-no-Vat" name="sid-Vat">'
                +'<label for="sid-no-Vat">' + COMMON_LANG.SIDE_NAV.VAT_TEMPLATES.WITHOUT.TEXT + '</label>'
                +'</li>'
                +'<li>'
                +'<input id="sid-with-Vat" type="radio" value="sid-with-Vat" name="sid-Vat">'
                +'<label for="sid-with-Vat">' + COMMON_LANG.SIDE_NAV.VAT_TEMPLATES.WITH.TEXT + '</label>'
                +'</li>';

            if($('#countrySelector').length){
                $appendVat += '<li id="countriesContainer">'
                    +'<div class="countries-wrapper">'
                    +'<ul>'
                    +'<li class="c-header">' + COMMON_LANG.SIDE_NAV.SELECTED_VAT + ' :</li>'
                    +'<li id="countrySelected"><span class="flag ' + vat['country'].toLowerCase() +'"></span><span class="sid-country">' + COMMON_LANG.COUNTRIES[vat['country']] + '</span> <span class="sid-percentage"></span></span></li>'
                    +'</ul>'
                    +'<select id="countrySelectorSid">'
                    +'<option class="sidOptionPlaceholder placeholder" selected disabled value="">' + COMMON_LANG.SIDE_NAV.CHANGE_VAT + '</option>'
                    +optionCountries
                    +'<option class="sidOptionSeparator" disabled>-------------------------------------</option>'
                    +'<option class="sidOptionOther" value="OTHER" data-name="' + COMMON_LANG.COUNTRIES.OTHER + '">' + COMMON_LANG.COUNTRIES.OTHER + '</option>'
                    +'</select>'
                    +'</div>'
                    +'</li>';
            }

            $appendVat += '<li><button id="cancelVatChangesSidr" class="button small secondary">Ακύρωση</button><button id="submitVatSidr" class="button small" style="display:none;"><span class="submitText">Υποβολή</span><div class="loading hide" style="display:none;"><span class="spinner smaller"></span></div></button></li>';

            $appendVat += '</ul>';

            $('#sidVatContainer').append('<div style="display: none"></div>').find('> div').append($appendVat);

            setTimeout(function () {
                if(!vat['show']){
                    $('#sid-no-Vat').prop({'checked':true});
                    $('#sid-with-Vat').prop({'checked':false});
                    $('#countriesContainer').slideUp();
                }else{
                    $('#sid-no-Vat').prop({'checked':false});
                    $('#sid-with-Vat').prop({'checked':true});
                }
            },200);

            if(vat['country'] != 'OTHER') {
                $('#countrySelected .sid-percentage').html('&lpar; ' + quote + '&percnt; &rpar;');
            }
            $.vat.sort_vat_countries('sidOptionCountries','countrySelectorSid','sidOptionOther','sidOptionSeparator');

            /*$(document).on('click', '#sidVatTrigger', function () {
                console.log($('[name="sid-Vat"]:checked').val());
                // $('[name="sid-Vat"]:checked').trigger('change');

                // if ($('[name="sid-Vat"]:checked').val() == 'sid-with-Vat')

            });*/
        /**
         * SIDE NAV VAT END
         */

        $('#sidNavContainer').append(global_side_nav.find('.sidr-inner')).append('<div id="userNav" class="sidr-inner"></div>');
        // $('#sidNavContainer').prepend('<div class="sidr-inner"><span class="side-menu-title">' + $.translate('MENU.STATIC.TITLE') + '</span></div>');

        $('.side-menu-title').after('<a href="#" class="sidr-close" rel="nofollow"><i class="icon-cross2" /></a>');
    }

    function setStaticMenu (config) {
        var container   = $('#side-nav');

        container.empty();
        loopLists (container, config);
    }

    function loopLists (container, lists, $submenu) {
        var navList;

        if (lists.hasOwnProperty('group')) {
            for (var i in lists['group']) {
                if (lists['group'].hasOwnProperty(i)) {
                    navList = container.append('<div class="sidr-inner"></div>').find('div:last');

                    if (lists['group'][i].hasOwnProperty('mobile_text') || lists['group'][i].hasOwnProperty('text')) {
                        navList.append('<span class="side-menu-title">' + (lists['group'][i].hasOwnProperty('mobile_text') ? lists['group'][i]['mobile_text'] : lists['group'][i]['text']) + '</span>');
                    }

                    if (lists['group'][i].hasOwnProperty('list')) {

                        if (lists['group'][i]['list'].hasOwnProperty('decoration')) {

                            if (lists['group'][i]['list']['decoration'].hasOwnProperty('id')) {
                                navList.attr('id', lists['group'][i]['list']['decoration']['id']);
                            }

                            if (lists['group'][i]['list']['decoration'].hasOwnProperty('class')) {
                                navList.addClass(lists['group'][i]['list']['decoration']['class']);
                            }

                            delete lists['group'][i]['list']['decoration'];
                        }

                        loopLists(navList, lists['group'][i]['list']);
                    }
                }
            }
        } else {
            if (typeof $submenu != 'undefined')
                navList = container.append('<div style="display: none"><ul class="sidr-class-f-dropdown"></ul></div>').find('ul:last');
            else
                navList = container.append('<ul class="sidr-class-f-dropdown"></ul>').find('ul:last');

            for (i in lists) {
                if (lists.hasOwnProperty(i)) {
                    if (lists[i].hasOwnProperty('function')) {
                        lists[i] = menuFunction[lists[i]['function']](lists[i]['choices']);

                        if (lists[i] === false)
                            continue;
                    }

                    if (lists[i].hasOwnProperty('label')) {
                        continue;
                    }

                    var liId = '',
                        liClass = '';

                    if (lists[i].hasOwnProperty('class'))
                        liClass += ' ' + lists[i]['class'];

                    if (lists[i].hasOwnProperty('list'))
                        liClass += ' sidr-class-with-dropdown ';

                    liClass = liClass.trim().split(' ').filter(function (v, i, a){ return a.indexOf(v) === i}).join(' ');


                    if (lists[i].hasOwnProperty('decoration')) {
                        if (lists[i]['decoration'].hasOwnProperty('id')) {
                            liId += ' ' + lists[i]['decoration']['id'];

                            liId = liId.trim();
                        }

                        if (lists[i]['decoration'].hasOwnProperty('class')) {
                            liClass += ' ' + lists[i]['decoration']['class'];

                            liClass = liClass.trim();
                        }
                    }

                    var item = navList.append('<li id="' + liId + '" class="' + liClass + '"></li>').find('> li:last');

                    if (lists[i].hasOwnProperty('header')) {

                        if (lists[i]['header'].hasOwnProperty('function')) {
                            lists[i]['header'] = menuFunction[lists[i]['header']['function']](lists[i]['header']['choices']);
                        }

                        if (lists[i]['header'] !== false) {
                            var span = '',
                                text = '',
                                path = '',
                                id = '',
                                $class = '',
                                control = '';

                            // if (typeof $submenu != 'undefined')
                            //     control = sidrArrow;

                            if (lists[i]['header'].hasOwnProperty('span')) {
                                span = '<span>' + lists[i]['header']['span'] + '</span>';
                            }

                            if (lists[i]['header'].hasOwnProperty('mobile_text') || lists[i]['header'].hasOwnProperty('text')) {
                                text = (lists[i]['header'].hasOwnProperty('mobile_text') ? lists[i]['header']['mobile_text'] : lists[i]['header']['text']);
                            }

                            if (lists[i]['header'].hasOwnProperty('link')) {
                                if (lists[i]['header']['link'] != '#')
                                    path = lists[i]['header']['link']['path'];
                                else
                                    path = lists[i]['header']['link'];

                                if (text == '' && (lists[i]['header']['link'].hasOwnProperty('mobile_text') || lists[i]['header']['link'].hasOwnProperty('text')))
                                    text = (lists[i]['header']['link'].hasOwnProperty('mobile_text') ? lists[i]['header']['link']['mobile_text'] : lists[i]['header']['link']['text']);
                            }


                            if (lists[i]['header'].hasOwnProperty('id')) {
                                id = lists[i]['header']['id'];
                            }

                            if (lists[i].hasOwnProperty('list') || lists[i].hasOwnProperty('pending_list')) {
                                $class = 'sidr-class-button sidr-class-dropdown';
                                control = '<span class="sidClose arrow"></span>';
                            }

                            item.append('<a id="' + id + '" href="' + path + '" class="' + $class + '">' + span + text + control + '</a>').find('> a:last');
                        }
                    }

                    // if (lists[i].hasOwnProperty('label')) {
                    //     item.append('<label>' + lists[i]['label'] + '</label>');
                    // }


                    if (lists[i].hasOwnProperty('link')) {
                        span    = '';
                        text    = '';
                        path    = '';
                        id      = '';
                        $class  = '';
                        icon    = '';
                        control = '';

                        var decoration  = '',
                            title       = '';

                        if (lists[i].hasOwnProperty('link')) {
                            path = lists[i]['link']['path'];

                            if (lists[i]['link'].hasOwnProperty('id')) {
                                id = lists[i]['link']['id'].trim();
                            }

                            if (lists[i]['link'].hasOwnProperty('class')) {
                                $class = lists[i]['link']['class'].trim();
                            }

                            if (lists[i]['link'].hasOwnProperty('mobile_text') || lists[i]['link'].hasOwnProperty('text')) {
                                text = (lists[i]['link'].hasOwnProperty('mobile_text') ? lists[i]['link']['mobile_text'] : lists[i]['link']['text']);
                            }

                            if (lists[i]['link'].hasOwnProperty('icon')) {
                                icon = '<icon class="' + lists[i]['link']['icon'] + '"> ';
                            }

                            if (lists[i]['link'].hasOwnProperty('decoration')) {
                                var $decorations = lists[i]['link']['decoration'];

                                for (var j in $decorations) {
                                    var attributes  = '',
                                        icon        = '';

                                    if ($decorations.hasOwnProperty(j)) {

                                        if ($decorations[j].hasOwnProperty('id'))
                                            attributes += 'id="' + $decorations[j]['id'] + '" ';

                                        if ($decorations[j].hasOwnProperty('class'))
                                            attributes += 'class="' + $decorations[j]['class'] + '"';

                                        if ($decorations[j].hasOwnProperty('icon'))
                                            icon = '<icon class="' + $decorations[j]['icon'] + '" />';

                                        decoration += '<' + j + ' ' + attributes + '>' + icon + '</' + j + '>'
                                    }
                                }
                            }

                            if (lists[i]['link'].hasOwnProperty('title')) {
                                title = lists[i]['link']['title'];
                            }

                            if (lists[i].hasOwnProperty('list')) {
                                $class += 'sidr-class-button sidr-class-dropdown';
                                control = '<span class="sidClose arrow"></span>';
                            }
                        }

                        item.append('<a id="' + id + '" class="' + $class + '" href="' + path + '" title="' + title + '">' + icon + span + text + decoration + control + '</a>');
                    }

                    if (lists[i].hasOwnProperty('list')) {
                        loopLists(item, lists[i]['list'], true);
                    }
                }
            }
        }
    }
});

$(window).on('load', function () {
    $.intMenuCreation();
});

function hideShowNavItemsBasedOnWidth () {
    if ($('.primary-menu:visible').length) {
        $('#user-menu').css('top','8px');
        $('#site-menu').hide();
        $.sidr('close', 'side-nav');
    } else {
        $('#user-menu').css('top','');
        $('#site-menu').show();
    }
}

function out_of_sidr_click (event){
    if ( !$(event.target).closest('.sidr').length && !$(event.target).closest('#mobile-nav').length ) {
        $('.sidClose:visible').click();
        $.sidr('close', 'side-nav');
        $.sidr('close', 'backend-side-nav');
    }
}

function disabled_scroll_with_arrows (e) {
    if($('#side-nav').css('display') != 'none'){
        if(e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 38 || e.keyCode == 40) {
            e.preventDefault();
        }
    }
}