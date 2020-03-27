$(document).ready(function () {
    $('#logTable .toggle-table').on('click',function(){
        if($('.headersRow').next().length) {
            $(this).find('i').toggleClass('icon-plus-circle2 icon-minus-circle2');
            $('#logTable').find('.resp-table,.footer').toggle();
        }
    }).one('click',function(){
        $('.toggle-table i').hide();
        $('.table-loader .loader').show();
        $.responsive_tables.initiate();
    });

    onLoadRequestCallBack = function(){
        table = $('#logTable');
        table.find('.toggle-table i').toggleClass('icon-plus-circle2 icon-minus-circle2').show();
        table.find('.resp-table,.footer').show();
        $('.table-loader .loader').hide();
    };
});
