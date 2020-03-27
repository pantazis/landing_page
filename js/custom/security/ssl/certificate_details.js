$(document).ready(function(){
    $('.additional-domains').val(0);
    $('.number-of-servers').val(1);

    $('.additional-domains,.number-of-servers').on('change',function(){
        $.calculate_prices_for_certificates($(this).closest('.product_info').find('.length.active'));
    });

    $('#additional_domains').on('change', function () {
        var obj = $(this),
            domains = $('#totalDomains');


        domains.text(parseInt(domains.attr('data-domains')) + parseInt(obj.val()));
    });
});

function getProductPrice(){
    addServers = $('.number-of-servers').find('option:selected').val();
    addDomains = $('.additional-domains').find('option:selected').val();

    lengthId = parseInt($('.duration .button.dropdown ').text().replace(/\s[a-zα-ωάώέύίό]+/,''))-1;

    basicPrice = parseFloat($('.length.active .vat').attr('data-price-length-total'));
    addPrice = parseFloat($('.additionalPrice:eq(' + lengthId + ')').attr('data-priceList'));

    if(typeof addServers != "undefined"){
        serverPrice = basicPrice * addServers;
    }else{
        serverPrice = basicPrice * 1;
    }
    domPrice = addPrice * addDomains;

    if(addDomains === undefined){
        domPrice = 0;
    }
    productPrice = (serverPrice + domPrice).toFixed(2);

    return productPrice;
}