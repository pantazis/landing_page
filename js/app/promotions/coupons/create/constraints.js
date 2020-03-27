$(document).ready(function () {
    var step = $('#constraints_step'),
        constraintsTemp = $('#constraints_step .product_form').getOuterHTML().replace(/_[0-9]+/g, '_##enum##').replace(/#[0-9]+/,'###enum##');

    $(document)
        .on('click', '#constraints_step .product_form .add', function (e) {
            e.preventDefault();

            $(this).blur();
            $.coupon_create.copyProductForm(step, constraintsTemp);
        })
        .on('click', '#constraints_step .product_form .remove', function (e) {
            e.preventDefault();

            $.coupon_create.removeProductForm($(this).blur());
        });
});