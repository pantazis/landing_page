$(document).ready(function () {
    var table_controller = $('#table_controller');

    if(typeof activeFilters == 'undefined' || activeFilters == null || activeFilters.length < 1)
        activeFilters = {};

    var extendable = {
        rowTemp                 : $('#rowTemp'),
        table_controller        : table_controller,
        defaultConfiguration    : {
            urlPrefix           : table_controller.attr('data-url-prefix'),
            defaultSortingOrder : table_controller.attr('data-sorting-order'),
            defaultSortingField : table_controller.attr('data-sorting-field'),
            pageLengthValue     : table_controller.attr('data-page-length'),
        },
        activeFilters           : activeFilters,
        table_inline_loader     : '<div class="responsiveTableRow"><div class="loader-wrapper" style="position: relative; padding: 4rem 0; width: 100%; height: 100%;"><div class="loading" style="left: 50%; margin-left: -2.5rem; position: absolute;margin-top: -1rem;"><div class="spinner dark" style="width: 5rem;height: 5rem;border-width: 6px;"></div></div></div></div>',
        pagination_config       : {
            view : {
                small   : 4,
                medium  : 6,
                large   : 6,
                xlarge  : 6
            },
            show : { //Show on each side of current;
                small   : 1,
                medium  : 2,
                large   : 2,
                xlarge  : 2
            }
        },
        main                    : {
            tablesErrorHandler              : tablesErrorHandler,
            preconfiguredTablesErrorHandler : preconfiguredTablesErrorHandler
        },
        initiate                : function (param) {
            $.responsiveTables.db.getFilters();
            $.responsiveTables.db.initiateTable(param);
        },
        row_delete              : function () {
            $.responsiveTables.db.performRequestAfterRowDelete();
        },
    };

    $.extend({
        commonDefaultRequestHandler     : function (data, error_code_list) {
            $.responsiveTables.rows.commonDefaultRequestHandler(data, error_code_list);
        }
    });

    if(extendable.rowTemp.length) {
        extendable.rowTemp.html(extendable.rowTemp.html().replace(/ {2,}/g, ' '));

        extendable.rowPlaceholders    = extendable.rowTemp.html().match(/##\w+##/g);
        extendable.rowField           = extendable.rowTemp.html().match(/data-field="\w+"/g);
    }

    if ('responsiveTables' in $)
        $.extend($.responsiveTables, extendable);
    else
        $.extend({'responsiveTables' : extendable});

    if(typeof defaultButtonHandler == 'function')
        $(document).on('click', '.button.default:not(.active):not(.inactive):not(.disabled)', function(){
            var btn = $(this);

            if(btn.closest('.row').find('.pending').length < 1) {

                if(typeof setDefaultObj != 'object'){
                    setDefaultObj = new $.ajax_prototype({
                        'test'          : 111,
                        'type'          : 'post',
                        'data'          : JSON.stringify({'_token':$('[name="_token"]').val(),'action':actions_obj['setDefault'],'is_default':'true'}),
                        'contentType'   : 'application/json',
                        'success'       : function (data) {
                            defaultButtonHandler(data);
                        },
                        'complete'      : function () {
                            var activeButtons = $('.button.default:not(.disabled.permanent)'),
                                requestedButton = $(this.active_element);

                            activeButtons.removeClass('disabled');
                            requestedButton.find('.submitText').show();
                            requestedButton.find('.loading').hide();
                        },
                        active_element    : btn
                    }, null, {
                        'beforeSend'    : function (instance) {
                            if ($("#alertContainer").is(':visible')) {
                                killDisplays(true);
                            }

                            var activeButtons   = $('.button.default'),
                                requestedButton = $(instance.active_element);

                            if ($.isTouch()) {
                                requestedButton = $('.requestTrigger:first');
                            }

                            activeButtons.addClass('disabled');
                            requestedButton.find('.submitText').hide();
                            requestedButton.find('.loading').show();
                        }
                    })
                }

                setDefaultObj.url               = btn.attr('href');
                setDefaultObj.active_element    = btn;

                $.ajax(setDefaultObj);
            }
        });

    $('#pageLength').apply_chosen($.responsiveTables.defaultConfiguration.pageLengthValue);

    $(document).on('click', '.button.default',function(e){
        e.preventDefault();
        $(this).blur();
    });

    window.addEventListener('resize', function () {
        $.responsiveTables.pagination.managePaginationView($('.current a'));
        $.responsiveTables.rows.adjustColumnsHeights($('.resp-table'));
    });

    /**
     * Default error handler
     */
    function tablesErrorHandler() {
        $('.global_loader').hide();
        $('.responsiveTableRow').remove();
        $.alertHandler('', APP_LANG.MESSAGES.RESPONSIVE_TABLES_ERROR, alert_box_failure);
    }

    function preconfiguredTablesErrorHandler (current_table) {
        current_table.find('.global_loader').hide();
        current_table.find('.responsiveTableRow').remove();
        $.alertHandler('', APP_LANG.MESSAGES.RESPONSIVE_TABLES_ERROR, alert_box_failure);
    }
});

$(window).on('load', function () {
    if(typeof respoConf == 'undefined') {
        if ($('#logTable').length < 1)
            $.responsiveTables.db.initiateTable({'disable_search': true});
    } else {
        $.each(respoConf.init, function($table, $configuration){
            $.responsiveTables.configured_tables.initThroughConfig($configuration);
        });
    }
});

