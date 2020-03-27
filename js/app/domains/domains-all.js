$(document).ready(function () {
    $(document).on('click', '.id_dropdown button', function () {
        var obj     = $(this),
            item    = obj.closest('.responsiveTableRow'),
            url     = urls['add_id_protect'].replace('##domainId##', item.attr('data-id')).replace('##userId##', item.attr('data-user-id'));

        obj.addClass('in-cart').text(COMMON_LANG.CART.IN_CART);

        $.ajax(new $.ajax_prototype({
                type    : 'POST',
                url     : url,
                data    : {
                    '_token'        : $('[name="_token"]').val(),
                    'unique_id'     : unique_page_identifier
                },
                success : function (data) {
                    if(data.success){
                        $.cart.insert(data.data.id, data.data.name, data.data.sub_name_small, data.data.total_price);

                        obj.attr('data-cart-item-id', data.data.id);
                    }else{
                        obj.removeClass('in-cart').text(COMMON_LANG.CART.BUY_SERVICE);
                        globalApplicationErrors(data);
                    }
                }
            })
        )
    });
});