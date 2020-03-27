$(document).ready(function () {
    $('#auto-code-trigger').on('change', function () {
        var manualCodeCont = $('#manualCodeCont'),
            manual_code = $('#manual_code');

        if ($(this).prop('checked')) {
            manualCodeCont.hide();
            manual_code.removeAttr('data-override-visibility');
        } else {
            manualCodeCont.show();
            manual_code.attr('data-override-visibility',true);
        }
    });

    $('#status-trigger').on('change', function () {
        if ($(this).prop('checked'))
            $('#activationWarning').hide();
        else
            $('#activationWarning').show();
    });

    $('#manual_code').on('change input', function () {
        var obj = $(this),
            matched = obj.val().match(/[\w0-9]+/g);

        obj.val(((matched) ? matched.join('').toUpperCase() : ''));
    });

    $('#greek_title, #greek_description').on('change', function () {
        var obj = $(this),
            target = $('#' + obj.attr('id').replace('greek','english'));

        if (obj.val().match(REG.ASCII.INVERSE.REGEX) == null)
            target.removeAttr('data-override-visibility');
        else
            target.attr('data-override-visibility',true);
    });
});