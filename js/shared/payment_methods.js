$(document).ready(function () {
    $('#showMoraBanks').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        obj.hide();

        $('.bank-list .item').show();
    });
});