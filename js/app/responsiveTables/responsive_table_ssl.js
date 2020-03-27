$(document).ready(function () {
    $(document).on('click', '.renew.ssl', function (e){
        e.preventDefault();

        var obj = $(this);

        $.ajax({
            timeout         : 30000,
            type            : 'POST',
            data            : {
                '_token'        : $('[name="_token"]').val(),
                'unique_id'     : unique_page_identifier,
                'sku'           : obj.attr('data-product-sku'),
                'action'        : 'renew',
                'auto_enroll'   : false
            },
            url             : obj.attr('href'),
            beforeSend      : function () {
                this.active_element.find('.submitText').hide();
                this.active_element.find('.loading').show();
            },
            error           : function (e) {
                globalErrorsHandler(e);
            },
            success         : function (data) {
                if (data.success) {
                    var obj = this.active_element;

                    obj.addClass('in-cart').attr('data-cart-item-id', data.data.id).find('.submitText').text(COMMON_LANG.CART.IN_CART);

                    if ('cart_items' in data.data) {
                        $.each(data.data.cart_items, function (index, item) {
                            $.cart.insert(item.id, item.name, item.sub_name, item.total_price);

                            if (item.type == 'ssl') {
                                obj.attr('data-cart-item-id', item.id);
                            }
                        });
                    } else {
                        $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);
                        obj.attr('data-cart-item-id', data.data.id);
                    }

                    if (app_env != 'local' && 'remarketing_items' in data.data) {
                        $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                    }
                } else {
                    $.cart.errorHandler(data);
                }
            },
            complete        : function () {
                this.active_element.find('.submitText').show();
                this.active_element.find('.loading').hide();
            },
            active_element  : obj
        });
    });
});