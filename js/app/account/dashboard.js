$(document).ready(function () {
    // $('#expires_show').on('click', function (e) {
    //     e.preventDefault();
    //
    //     $.set_cookie('responsive-filters', ['date:30'], '/', $('#domains_show').attr('href'));
    // });
    //
    // $('#expired_show').on('click', function (e) {
    //     e.preventDefault();
    //
    //     $.set_cookie('responsive-filters', ['date:0'], '/', $('#domains_show').attr('href'));
    // });

    $('#tableSelector').on('change', function () {
       $('#filterNameInput').val($(this).find('option:selected').attr('data-filter'));
    });
});