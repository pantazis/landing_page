$(document).ready(function () {
    $('#addNSinGroup').on('click', function () {
        var form = $(this).closest('form');

        form.find('.ns_cont:last').after($('#createNSGroupNSTemp').html().replace(/##index##/g, $('.ns_cont').length + 1));
        form.find('.nsRemoveFromGroup').show();
    });

    $(document).on('click', '.nsRemoveFromGroup', function (e) {
        e.preventDefault();

        var obj = $(this),
            form = obj.closest('form'),
            group_ns = form.find('.group_ns');

        obj.closest('div').find('input').val('');

        var values = $.makeArray(group_ns.map(function (a, b) {return $(b).val()})).join().replace(/,{2,}/,',').trim().replace(/,$/g,'');

        if(group_ns.length && values){
            values = values.split(',');
            $.each(values, function (key, value){
                form.find('.group_ns:eq(' + key + ')').val(value);
            });
        }

        form.find('.ns_cont:last').remove();

        if(form.find('.group_ns').length == 1)
            form.find('.nsRemoveFromGroup').hide();
    });
});