jQuery(document).ready(function($) {
    showTopScroll();
    token = $('input[name="_token"]').attr("value");
    pos = 0;

    /**
     * INITIATE VAT START
     */
    //if(vat)
    //    (vat['show']) ? enable_vat() : disable_vat();
    $.vat.initiate();
    /**
     * INITIATE VAT END
     */


    /**
     * TOOLBOX START
     */
    $('.slideTrigger').on('click',function(e){
        e.preventDefault();
        $('.bgactive').removeClass('bgactive');
        father = $(this).closest('li').attr('class');

        if($('#'+father).hasClass('activated')){

            var slide   = $('#'+father),
                support = slide.find('#support_toolbox_cont');

            slide.toggleClass('activated');

            if(support.length){
                support.show();
                slide.find('#support_toolbox_msg_cont').hide();
            }
        }else{
            $(this).closest('a').toggleClass('bgactive');

            slide   = $('.slide.activated');
            support = slide.find('#support_toolbox_cont');

            if(support.length){
                support.show();
                slide.find('#support_toolbox_msg_cont').hide();
            }

            slide.toggleClass('activated');
            $('#'+father).toggleClass('activated');

            if (father.indexOf('vat') > -1)
                $.sendUsevat();
        }
    });
    $('.menu-opener').on('click',function(e){
        e.preventDefault();
        $('.bgactive').removeClass('bgactive');

        if($('.slideUpForm .activated').length > 0){
            $('.slideUpForm .activated').removeClass('activated');
            setTimeout(function(){
                $('.menuContainer, .menu-opener-inner').toggleClass('activated');
            },300);
        }else{
            $('.menuContainer, .menu-opener-inner').toggleClass('activated');
        }

        if($('.menu-opener-inner').hasClass('activated')){
            $(this).closest('a').attr({'title':'Κλείσε την εργαλειοθήκη'})

            $.sendUsetoolbar();
        }else{
            $(this).closest('a').attr({'title':'Εργαλειοθήκη'})
        }
    });
    $('.close-toolbox').on('click',function(e){
        e.preventDefault;
        $('.bgactive').removeClass('bgactive');

        var slide   = $(this).closest('.slide'),
            support = slide.find('#support_toolbox_cont');

        slide.removeClass('activated');

        if(support.length){
            support.show();
            slide.find('#support_toolbox_msg_cont').hide();
        }


        setTimeout(function(){
            $('.menuContainer, .menu-opener-inner').toggleClass('activated');
        },300);
    });
    /**
     * TOOLBOX END
     */

    $('#toTop').on('click',function(){
        $('.bgactive').removeClass('bgactive');
        $('.slide.activated').removeClass('activated');
    });

    $(document)
        .mouseup(function (e){
            toolbox_menus_visibility_handler(e);
        })
        .scroll(function(){
            if(typeof scrollTopTimer == 'undefined' || scrollTopTimer == null){
                scrollTopTimer = setTimeout(function () {
                    showTopScroll();

                    scrollTopTimer = null;
                }, 100);
            }
        });

    /**
     * Footer Icons
     */
    $("#more").click(function(){
        $(".partners-list").animate({scrollLeft: "+=456"}, 300, "swing");
    });
    $("#prev").click(function(){
        $(".partners-list").animate({scrollLeft: "-=456"}, 300, "swing");
    });

    $('.smoothScroll:not(.customScroll)').smoothScroll();

    var cookies_box         = $('.cookies-box');

    try {
        if (cookies_box.length && cookie_acceptance == 'false') {
            cookies_box.show();

            cookies_box.find('a').on('click', function (e) {
                e.preventDefault();

                cookies_box.hide();

                $.cookie_api('cookiesAccepted', true, '', token);

            });
        }
    } catch (e) {}
});

var timeOut;
var alertType;
var type;

helperBlock = '<span class="help-block error">errorMessage</span>';
$('.help-block').css({'background':'#ff503f'});

/**
 * Filters TLD by the tag selected.
 * To function it needs the element that will provide the target data.
 * It can check:
 * if the row contains the requested flag or category.
 * if the row has 'gr' in her 'data-name'.
 * if the row has a 'td.discount'.
 * @param handler
 * @param target
 */
function criteriaApplierMain(handler,target){
    filterData = handler.data('target');
    if(handler.hasClass('all')){
        target.show();
    }else{
        target.hide();
        if(handler.hasClass('flag')){
            target.filter('[data-flag*="Flag'+filterData+'"]').show();
        }else if(handler.hasClass('category')){
            target.filter('[data-categories*="'+filterData+'"]').show();
        }else if(handler.hasClass('country')){
            target.filter('[data-tld=".'+filterData+'"],[data-tld$=".'+filterData+'"],[data-tld=".ελ"],[data-tld=".ευ"]').show();
        }else if(handler.hasClass('discount')){
            target.filter(':has(.discount .current-price)').show();
        }else if(handler.hasClass('favorite')){
            target.filter(':has(span.favorite.selected)').show();
        }
    }
}

/**
 * Creates a sorted instance of the table.
 * It is only used on ssl-by-type, for now.
 * It will be globalized to work along the price list and search!
 * @param rows
 * @param sortBy
 */
function tableSortMain(rows,sortBy){
    rows.sort(function(a, b) {
        var A = $(a).data(sortBy);
        var B = $(b).data(sortBy);
        if(sortBy == 'name'){
            A = A.toUpperCase();
            B = B.toUpperCase();
        }
        if(A < B) {
            return (-1 * decision);
        }
        if(A > B) {
            return (1 * decision);
        }
        return 0;
    });
}

function sslLengthManager(target, calculateFinalPrice){
    target.closest('ul').removeClass('open').css({'top': '163px', 'left': '-99999px'}).find('.active').removeClass('active');

    text = target.text().replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'').replace(' € / ','').replace(/\s[0-9]+[.,][0-9]+[.,][0-9]+|\s[0-9]+[.,][0-9]+/g,'.');
    text = text.split('.');
    target.closest('.duration').find('.dropdown').text(text[0]);

    if(calculateFinalPrice) {
        if($('.additional-domains').length > 0 || $('.number-of-servers').length > 0) {
            price = parseFloat(getProductPrice());
        }else{
            price = parseFloat(target.find('span').attr('data-price-length-total'));
        }
    }else{
        price = parseFloat(target.find('span').attr('data-price-length-total'));
    }
    noVatPrice = (price).toFixed(2);

    if(vat['show']){
        price *= vat['quote'];
    }

    price = (price).toFixed(2);
    price = price.split('.');
    price[0] = digitNumberFormat(price[0]);
    target.closest('.length').addClass('active').closest('.price-container, .checkout, .pricing-table').find('.price .vat').attr({'data-price-total':noVatPrice}).html(price[0] + '<small>,' + price[1] + '</small>');
}

function digitNumberFormat(digit){
    if(price[0] > 999) {
        digitPrice = digit.toString();
        digitPriceLength = digitPrice.length;
        test = [];
        c = 1;
        for(i = 0; i <= digitPriceLength; i++){
            if(c == 3 || c == digitPrice.length){
                test.push(digitPrice.substring(digitPrice.length-3));
                digitPrice = digitPrice.slice(0,-c);
                c = 1;
            }else{
                c++;
            }
        }
        num = '';
        for(i = 0; i < test.length; i++){
            num += test[test.length - i - 1];
            num += '.';
        }

        num = num.slice(0,-1);
        return num;
    }else{
        return digit;
    }
}

/**
 * Reveal scroll to top button when scroll point is reached.
 */
function showTopScroll(){
    if($('.domain-results-searchbar').length < 1) {
        if($.getSizeClassification('large_up')){
            if($(document).scrollTop() > $(document).height() * 0.20)
                $('#toTop-Container').fadeIn();
            else
                $('#toTop-Container').fadeOut();
        }else{
            var header              = $('header'),
                main_banner         = $('.main_banner'),
                main_inner_banner   = $('.main_banner'),
                intro               = $('.intro');

            if(header.length) {
                if($(document).scrollTop() > (header.offset().top + header.outerHeight()))
                    $('#toTop-Container').fadeIn();
                else
                    $('#toTop-Container').fadeOut();
            } else if(main_banner.length) {
                if($(document).scrollTop() > (main_banner.offset().top + main_banner.outerHeight() - 200))
                    $('#toTop-Container').fadeIn();
                else
                    $('#toTop-Container').fadeOut();
            } else if(intro.length) {
                if($(document).scrollTop() > (intro.offset().top + intro.outerHeight() - 200))
                    $('#toTop-Container').fadeIn();
                else
                    $('#toTop-Container').fadeOut();
            } else if(main_inner_banner.length) {
                if($(document).scrollTop() > (main_inner_banner.offset().top + main_inner_banner.outerHeight() - 200))
                    $('#toTop-Container').fadeIn();
                else
                    $('#toTop-Container').fadeOut();
            } else {
                if($(document).scrollTop() > 200)
                    $('#toTop-Container').fadeIn();
                else
                    $('#toTop-Container').fadeOut();
            }
        }

    }else if($('.domain-results-searchbar').length > 0 && $(document).scrollTop() >= $('.tld-results.list').position().top * 1.5 && $('.tld-results.list').is(':visible')){
        $('#toTop-Container').fadeIn();
    }else{
        $('#toTop-Container').fadeOut();
    }
}

/**
 * Open/Close menus from toolbox.
 * @param e
 */
function toolbox_menus_visibility_handler (e) {
    var target = $(e.target);

    if($('#formDim').length)
        return;

    var container = $("#toolBar-container");

    if ((!container.is(e.target) && container.has(e.target).length === 0)){
        var slide   = $('.slideUpForm .activated');

        if(slide.length > 0){
            var support = slide.find('#support_toolbox_cont');

            slide.removeClass('activated');

            if(support.length){
                support.show();
                slide.find('#support_toolbox_msg_cont').hide();
            }

            setTimeout(function(){
                $('.menuContainer, .menu-opener-inner').removeClass('activated');
            },300);
        }else{
            $('.menuContainer, .menu-opener-inner').removeClass('activated');
        }
    }
}