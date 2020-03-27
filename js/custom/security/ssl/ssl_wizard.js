$(document).ready(function () {
    $('.item').hide();

    var answer_margin_bottom = $('.question_container li:has([type="radio"])').css({
        'max-height'    : '11rem',
        'opacity'       : 1,
        'visibility'    : 'visible'
    }).css('margin-bottom');


    $('#questionsList').on('change', function () {
        var obj                 = $(this),
            items               = $('.item'),
            ssl_list_products   = $('#ssl-list-products');

        items.hide().filter('.suggested').removeClass('suggested with-offer');

        obj.find('.question_container:visible li:has([type="radio"]:not(:checked))').css({'max-height': '0px', 'margin-bottom' : '0px', 'opacity' : 0, 'visibility' : 'hidden'});
        obj.find('.question_container:visible .question_redo').show();
        obj.find('.question_container:hidden:first').show();

        if (obj.find('[type="radio"]:checked').length == obj.find('.question_container').length) {
            ssl_list_products.find('.lead, #productsSeparator').show();
            $('#ssl_custom_list').show();

            var selection = $sslCombinations;

            obj.find('[type="radio"]:checked').each(function () {
                var input   = $(this),
                    value   = input.val();

                selection = selection[value];
            });

            $('[data-product-sku="' + selection.list.join('"],[data-product-sku="') + '"]').show();
            $('[data-product-sku="' + selection.suggested.join('"],[data-product-sku="') + '"]').addClass('suggested').filter(':has(.offer)').addClass('with-offer');
        }
    });

    $('.question_redo').on('click', function (e) {
        e.preventDefault();

        var obj                 = $(this),
            current_container   = obj.closest('.question_container'),
            next_questions      = current_container.nextAll();

        next_questions.hide();
        next_questions.find('.question_redo').hide();
        next_questions.find('li').css({'opacity' : 1, 'visibility' : 'visible', 'max-height' : '11rem', 'margin-bottom' : answer_margin_bottom}).show().find('[type="radio"]').attr('checked', false);

        current_container.find('.question_redo').hide();
        current_container.find('li').css({'opacity' : 1, 'visibility' : 'visible', 'max-height' : '11rem', 'margin-bottom' : answer_margin_bottom}).show().find('[type="radio"]').attr('checked', false);

        $('#ssl-list-products').find('#ssl_custom_list, .lead, .items, #productsSeparator').hide();
    });
});