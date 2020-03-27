(function($) {
    var options = {
            active_class : 'active',    // class for items when active
            multi_expand: false,        // whether mutliple items can expand
            speed : 300,                // speed of animation
            toggleable: true            // setting to false only closes accordion panels when another is opened
        };

    $.extend({
        toggleMultiExpand : function () {
            options.multi_expand = true;

        }
    });

    $.fn.accordionAnimated = function() {
        var $accordion = this,
            $items = $accordion.find('> dd');


        $.extend(options, Foundation.utils.data_options($accordion));

        if(typeof faq == 'undefined'){
            $items.find('> a').on('click.accordion', function (){
                console.log('click one');
                var obj = $(this);

                if(!options.toggleable && obj.closest('dd').hasClass(options.active_class))
                    return;

                $(obj.attr('href')).stop(true, true).slideToggle(options.speed);

                if (!options.multi_expand){
                    $items.find('> .content:not(' + obj.attr('href') + ')').stop(true, true).slideUp(options.speed);
                } else {
                    obj.closest('.accordion').find('.content:not(' + obj.attr('href') + ')').stop(true, true).slideUp(options.speed);
                }

            });
        }else{
            $(document).ready(function(){
                $('.accordion dd a').on('click',function(){
                    console.log('click two');
                    var obj = $(this).closest('.accordion');


                    obj.find('dd.active').removeClass('active');
                    obj.find('dd.content.active').removeClass('active');
                });
            });

            $items.find('> a').on('click.accordion', function (){
                var obj = $(this);

                if(!options.toggleable && obj.closest('dd').hasClass(options.active_class))
                    return;

                $(obj.attr('href')).stop(true, true).slideToggle(options.speed);

                if (!options.multi_expand){
                    $items.find('.content:not(' + obj.attr('href') + ')').stop(true, true).slideUp(options.speed);
                } else {
                    obj.closest('.accordion').find('.content:not(' + obj.attr('href') + ')').stop(true, true).slideUp(options.speed);
                }

            });
        }
    };

}(jQuery));

$(document).ready(function(){

    $('.accordion').accordionAnimated();

});