$(document).ready(function() {
    var sidebarCont = $('.side-bar-container');

    sidebarCont.css('height', sidebarCont.closest('.wrapper').height() + 400).css('position', 'absolute');
    $('.sidebar').autofix_anything({
        customOffset: false, // You can define custom offset for when you want the container to be fixed. This option takes the number of pixels from the top of the page. The default value is false which the plugin will automatically fix the container when it is in the viewport
        manual: false, // Toggle this to true if you wish to manually fix containers with the public method. Default value is false
        onlyInContainer: true // Set this to false if you don't want the fixed container to limit itself to the parent's container.
    });

    $('#analytics_opt_in_form, #pixel_opt_in_form').each(function () {
        var form = $(this);

        form.prepare_form_advanced({
            version_exception : true,
            onSuccess: function (form) {
                var data = {
                    '_token' : form.find('[name="_token"]').val(),
                    'set_marketing' : form.find('[name="set_marketing"]').val(),
                    'status' : ((form.find('[name="status"]:checked').length) ? '0' : '1'),
                };

                $.ajax(
                    new $.ajax_prototype({
                        'url'       : form.attr('action'),
                        'type'      : 'POST',
                        'data'      : data,
                        'success'   : function (data) {
                            if (! data.success)
                                globalApplicationErrors(data, form.attr('id'))
                        }
                    }, form.attr('id'))
                )
            },
            trigger: [
                {
                    'item'          : '#' + form.attr('id') + ' [name="status"]',
                    'event'         : 'change',
                    'callback'      : function (e, obj) {
                        obj.closest('form').validate();
                    }
                }
            ]
        })
    });

});