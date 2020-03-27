$(document).ready(function () {
    $(document).on('click', '.button.renew', function (e) {
        e.preventDefault();
        var obj = $(this);

        obj.addClass('disabled requestTrigger');

        var closestRow = obj.closest('.responsiveTableRow');

        renewObject = new $.ajax_prototype({
            type        : 'POST',
            data        : {
                '_token'        : $('[name="_token"]').val(),
                'unique_id'     : unique_page_identifier
            },
            success     : function (data, instance) {
                if(data.success){
                    $('[href="' + instance.url + '"]').addClass('in-cart').attr('data-cart-item-id', data.data.id).find('.submitText').text(COMMON_LANG.CART.IN_CART);
                    $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);

                    if (app_env != 'local' && 'remarketing_items' in data.data)
                        $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                }else{
                    globalApplicationErrors(data);
                }
            },
            complete    : function () {
                var activeElement = $(this.active_element);

                activeElement.find('.submitText').show();
                activeElement.find('.loading').hide();
                activeElement.removeClass('disabled');
            },
        });

        renewObject.url             = $(this).attr('href');
        renewObject.active_element  = this;

        $.ajax(renewObject);
        obj.blur();
        obj.removeClass('requestTrigger');
    });
});