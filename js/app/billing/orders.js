$(document).ready(function () {
    $('#csvExport').on('click', function (e) {
        console.log(1);
        e.preventDefault();

        $('#csvOutput').modal_open();
        buildCsv();
    });

    $('.modal-cancel').on('click', function () {
        $('body').css('position','initial');
    });

    var csv_config = {
        'id'        : 'id',
        'type'      : 'documentType',
        'status'    : 'getStatus',
        'date'      : 'date',
        'email'     : 'email',
        'total'     : 'total',
        'balance'   : 'balance'
    };

    function buildCsv () {
        var pending_csv = $.fetch_pending_csv(),
            tmp_csv     = '';

        console.log(csv_config);
        $.each(pending_csv.data, function (key, value) {
            var item_csv = '';

            $.each(csv_config, function (csv_key, data_key) {
                if(data_key.indexOf('get') < 0)
                    item_csv += value[data_key] + ';';
                else
                    switch (data_key) {
                        case 'getStatus':
                            item_csv = getStatus(item_csv, value[csv_key]);
                    }
            });

            tmp_csv += item_csv.replace(/;$/,'') + '\n';
        });

        // tmp_csv += tmp_csv + '\n' + tmp_csv;

        $('#csvTextArea').val(tmp_csv.replace(/\r\n$/,''));
    }

    function getStatus (item_csv, value) {
        return item_csv + value.match(/>.+</g)[0].replace(/>|</g,'') + ';';
    }
});