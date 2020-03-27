$(document).ready(function(){
    $('li.length:not(.exception .length)').on('click',function(e){
        e.preventDefault();

        sslLengthManager($(this),true);
    });

    $('.with_discount .length').on('click', function(e){
        e.preventDefault();

        length = $(this);
        info = length.closest('.product_info');

        discount = (info.attr('data-sites')) ? discountTables[length.attr('data-length') + 'month'][info.attr('data-sites') + 'site'] : (info.hasClass('ssl_product')) ? discountTables[info.attr('data-product-id')][length.attr('data-length')] : discountTables[length.attr('data-length')];

        info.find('.price').update_vat('price', length.find('.vat'), 'like', 'unit');
        info.find('.total').update_vat('price', length.find('.vat'), 'like', 'total');
        info.find('.discount').update_vat('price', [discount],0);

        info.find('.length').removeClass('active');
        length.addClass('active');
        info.find('.duration button').text(length.get_length_duration());
    });

    $('.ssl_plan a').on('click', function (e) {
        e.preventDefault();
        var obj = $(this),
            product = obj.closest('.product, .product_info'),
            length = obj.closest('.length');

        product.find('.length').removeClass('active');
        length.addClass('active');

        // calculate_prices_for_certificates(length);
    });

    $(document).on('click','.selected_plan .length', function (e) {
        e.preventDefault();

        var length              = $(this),
            info                = $('.plan.selected'),
            selected_product    = $('.selected-product'),
            discount            = discountTables[length.attr('data-length') + 'month'][info.attr('data-sites') + 'site'],
            cost                = costsTables[length.attr('data-length') + 'month'][info.attr('data-sites') + 'site'],
            useCostBase         = false;

        if (cost.constructor == Object) {
            useCostBase = cost.base;
            cost = cost.total;
        }

        selected_product.find('.sup').update_vat('price-total-sup', length.find('.vat:not(.strikethrough .vat)'), 'like', 'unit');
        selected_product.find('#initial_price').update_vat('price', [(cost * length.attr('data-length') + discount).toFixed(2)],0);
        selected_product.find('#price_discount').update_vat('price', [discount],0);
        selected_product.find('#final_price').update_vat('price', length.find('.vat:not(.strikethrough .vat)'), 'like', 'data-price-length-total');

        selected_product.find('.length').removeClass('active');
        length.addClass('active');
        selected_product.find('.duration button').text(length.get_length_duration());

        var productOriginalPrice = $('#productOriginalPrice');

        if (productOriginalPrice.length) {
            if (useCostBase !== false) {
                productOriginalPrice.show().find('.vat').update_vat('price', [useCostBase],0);
            } else {
                productOriginalPrice.hide();
            }
        }
    });

    $('.ssl_plan .length').on('click', function(e){
        e.preventDefault();
        calculate_prices_for_certificates($(this));
    });

    $.extend({
        'calculate_prices_for_certificates' : function (length) {
            calculate_prices_for_certificates(length);
        }
    });

    function calculate_prices_for_certificates (length) {


        var months          = length.attr('data-length'),
            years           = months / 12,
            info            = length.closest('.product_info'),
            ssl_quantity    = ((info.find('.ssl-quantity .quantity_display').length) ? parseInt(info.find('.ssl-quantity .quantity_display').val()) : 1);

        var servers = $('#additional_servers');
            servers = (servers.length) ? servers.val() : 1;

        var $ssl_product_discounts = discountTables['ssl'] || discountTables;

        if(info.hasClass('ssl_product'))
            $ssl_product_discounts = $ssl_product_discounts[info.attr('data-product-id')];

        var discount = $ssl_product_discounts[length.attr('data-length')] * parseInt(servers),
            length_vat          = length.find('.vat:not(.strikethrough .vat)'),
            length_strike_vat   = length.find('.strikethrough .vat'),
            total_price = length_vat.get_price('data-price-length-total') * parseInt(servers),
            unit_price = length_vat.get_price('data-price-length-unit') * parseInt(servers);

        var domains = $('#additional_domains'),
            eq = years - 1;

        var domain_length, domains_unit_price, domains_total_price, domains_discount;

        if (domains.length) {
            var domainsDisplay      = $('#totalDomains'),
                domainsTotal        = parseInt(domains.val());

            domain_length           = $('.additionalPrice:eq(' + eq + ')');
            domains_unit_price      = domainsTotal * parseFloat(domain_length.get_price('data-price-length-unit'));
            domains_total_price     = domainsTotal * parseFloat(domain_length.get_price());
            domains_discount        = domainsTotal * discountTables.additional_domains[months];

            domainsDisplay.text((parseInt(domainsDisplay.attr('data-domains')) + domainsTotal));
        } else {
            domains_unit_price      = 0;
            domains_total_price     = 0;
            domains_discount        = 0;
        }

        var $total_cost         = total_price + domains_total_price,
            $total_discount     = discount + domains_discount;

        info.find('.price').update_vat('price-total-sup', [(unit_price + domains_unit_price) * ssl_quantity], 0);
        info.find('#initial_price').update_vat('price', [($total_cost + $total_discount) * ssl_quantity], 0);
        info.find('#final_price').update_vat('price', [$total_cost * ssl_quantity], 0);
        info.find('.discount').update_vat('price', [$total_discount * ssl_quantity],0);

        if (length_strike_vat.length) {
            info.find('.pricing .strikethrough').show().update_vat('price', [length_strike_vat.get_price()], 0);
        }else{
            info.find('.pricing .strikethrough').hide();
        }

        info.find('.length').removeClass('active');
        length.addClass('active');
        info.find('.duration button').text(length.get_length_duration());
    }
});