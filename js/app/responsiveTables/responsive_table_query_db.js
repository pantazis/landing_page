$(document).ready(function () {
    var $pending_csv = null,
        last_execution = 0,
        requestObj;

    var extendable = {
        db  : {
            initiateTable                               : initiateTable,
            initiatePageRequest                         : initiatePageRequest,
            onClickSortingArrows                        : onClickSortingArrows,
            searchRequest                               : searchRequest,
            sendShortcutRequest                         : sendShortcutRequest,
            createRequestURL                            : createRequestURL,
            preconfiguredTableAjaxPrototypeFactory      : preconfigured_table_ajax_prototype_factory,
            performRequestAfterRowDelete                : performRequestAfterRowDelete
        }
    };

    if ('responsiveTables' in $)
        $.extend($.responsiveTables, extendable);
    else
        $.extend({'responsiveTables' : extendable});

    $.extend({
        fetch_pending_csv               : function () {
            return $pending_csv;
        }
    });

    $(document).on('change','#pageLength:not(.configured_table #pageLength)',function(e){
        e.preventDefault();
        $.responsiveTables.defaultConfiguration.pageLengthValue = $(this).find('option:selected').val();

        page_len_obj = responsive_table_ajax_prototype_factory ({
            'type'      : 'POST',
            'success'   : function (data) {
                $.responsiveTables.rows.handlePageLengthChange(data);
            },
            'complete'  : function(){
                $('.pending_answer .global_loader').hide();
            }
        });

        page_len_obj.url = createRequestURL($.responsiveTables.defaultConfiguration.pageLengthValue, 1, $.now());

        var shortcut = $('.shortcut_btn.active');

        if(shortcut.length){
            var shortcutName = shortcut.attr('data-shortcut');

            if(typeof shortcutName != 'undefined')
                page_len_obj.data = {
                    shortcut : shortcutName
                };
            else
                page_len_obj.data = {};

            if(typeof persistentFilters != 'undefined')
                $.extend(page_len_obj.data, persistentFilters);
        }else{
            page_len_obj.data = $.responsiveTables.search.getFilters();
        }

        page_len_obj.data['_token'] = $('[name="_token"]').val();

        $.ajax(page_len_obj);
    });

    function initiateTable(parameters) {
        var disable = typeof parameters == 'object' && 'disable_search' in parameters;
        $.responsiveTables.search.activateSortable($('.' + $.responsiveTables.defaultConfiguration.defaultSortingField + ' .' + $.responsiveTables.defaultConfiguration.defaultSortingOrder));

        var activeFilters = $.responsiveTables.activeFilters;

        if(typeof activeFilters == 'object' && Object.keys(activeFilters).length && 'shortcut' in activeFilters){
            $shortcut = activeFilters.shortcut;

            activeFilters = $.array.except.key(activeFilters, ['shortcut']);

            if(Object.keys(activeFilters).length  < 1)
                activeFilters = null;
        }

        if(typeof activeFilters != 'undefined' && activeFilters != null){
            setPredefinedFilters(activeFilters);
        }else{
            $('#andoperator').prop({'checked':true});
        }

        if(typeof requestObj != 'object')
            requestObj = responsive_table_ajax_prototype_factory({
                'type'      : 'POST',
                'success'   : function (data) {
                    if($.isPlainObject(data) && !$.isEmptyObject(data)) {
                        $.responsiveTables.rows.handleInitialRequest(data, disable);
                    }
                },
                'complete'  : function(){}
            });

        requestObj.url = createRequestURL($.responsiveTables.defaultConfiguration.pageLengthValue, 1, $.now());

        requestObj.data = $.responsiveTables.search.getFilters();
        requestObj.data['_token'] = $('[name="_token"]').val();

        $.ajax(requestObj);
    }

    function initiatePageRequest (obj) {
        page_obj = responsive_table_ajax_prototype_factory ({
            'type'      : 'POST',
            'success'   : function (data) {
                $.responsiveTables.rows.newPageRequest(data);
            },
            'complete'  : function(){
                $('.pending_answer .global_loader').hide();
            }
        });

        page_obj.url = createRequestURL($.responsiveTables.defaultConfiguration.pageLengthValue, obj.attr('data-page'), $.now());

        var shortcut = $('.shortcut_btn.active');

        if(shortcut.length) {
            var shortcutName = shortcut.attr('data-shortcut');

            if(typeof shortcutName != 'undefined')
                page_obj.data = {
                    shortcut : shortcutName
                };
            else
                page_obj.data = {};

            if(typeof persistentFilters != 'undefined')
                $.extend(page_obj.data, persistentFilters);
        } else {
            page_obj.data = $.responsiveTables.search.getFilters();
        }

        page_obj.data['_token'] = $('[name="_token"]').val();

        $.ajax(page_obj);

        $(".pagination li.current").removeClass("current");
        obj.closest('li').addClass('current');
        $.responsiveTables.pagination.fixArrows(obj);
    }

    function onClickSortingArrows(myObject){
        $.responsiveTables.defaultConfiguration.defaultSortingOrder = (myObject.hasClass('arrow-up')) ? 'asc' : 'desc';
        $.responsiveTables.defaultConfiguration.defaultSortingField = myObject.parent("div").attr('data-sorting');

        sort_obj = responsive_table_ajax_prototype_factory ({
            'type'      : 'POST',
            'success'   : function (data) {
                $.responsiveTables.rows.sortRequestCallback(data);
            },
            'complete'  : function(){}
        });

        sort_obj.complete = function(request,event_status){
            if(event_status == 'success'){
                $.responsiveTables.search.activateSortable(myObject);
            }
        };

        sort_obj.url = createRequestURL($.responsiveTables.defaultConfiguration.pageLengthValue, 1, $.now());

        var shortcut = $('.shortcut_btn.active');

        if(shortcut.length){
            var shortcutName = shortcut.attr('data-shortcut');

            if(typeof shortcutName != 'undefined')
                sort_obj.data = {
                    shortcut : shortcutName
                };
            else
                sort_obj.data = {};

            if(typeof persistentFilters != 'undefined')
                $.extend(sort_obj.data, persistentFilters);
        }else{
            sort_obj.data = $.responsiveTables.search.getFilters();
        }

        sort_obj.data['_token'] = $('[name="_token"]').val();

        $.ajax(sort_obj);
    }

    function searchRequest (filters) {
        search_obj = responsive_table_ajax_prototype_factory ({
            'type'      : 'POST',
            'success'   : function (data) {
                $.responsiveTables.rows.commonSearchResultHandler(data);
                $.responsiveTables.filterDisplay = true;
            },
            'complete'  : function() {
                var search = $('#search');

                search.find('.submitText').show();
                search.find('.loading').hide();
            }
        });

        search_obj.url = createRequestURL($.responsiveTables.defaultConfiguration.pageLengthValue, 1, $.now());

        search_obj.data = filters;
        search_obj.data['_token'] = $('[name="_token"]').val();

        $.ajax(search_obj);
    }

    function sendShortcutRequest (obj) {
        $('.shortcut_btn').removeClass('active');
        $('.shortcut_btn:not(.inactive)').closest('div').removeClass('hide-important').show();

        obj.addClass('active').closest('div').hide();

        $.responsiveTables.search.clearFilters($('.responsive_table_search'), false, false);

        shortcut = responsive_table_ajax_prototype_factory ({
            type        : 'POST',
            success     : function (data) {
                $.responsiveTables.rows.commonSearchResultHandler(data)
            }
        });

        shortcut.url = createRequestURL($.responsiveTables.defaultConfiguration.pageLengthValue, 1, $.now());
        shortcut.data = {'_token': $('[name="_token"]').val()};

        shortcutName = obj.attr('data-shortcut');

        if(typeof shortcutName != 'undefined')
            shortcut.data.shortcut = shortcutName;

        if(typeof persistentFilters != 'undefined')
            $.extend(shortcut.data, persistentFilters);

        $.ajax(shortcut);

        old_filters = $.responsiveTables.search.getFilters();
    }
    
    /**
     * Create next request`s url
     * @param pageLengthValue
     * @param page
     * @param version
     * @param config
     * @returns {string}
     */
    function createRequestURL(pageLengthValue, page, version, config){
        var url = '';

        if(typeof config != 'object')
            return $.responsiveTables.defaultConfiguration.urlPrefix + pageLengthValue + '/' + $.responsiveTables.defaultConfiguration.defaultSortingOrder + '/' + $.responsiveTables.defaultConfiguration.defaultSortingField + "?page=" + page + '&v=' + version;

        url += ('prefix' in config) ? config.prefix : $.responsiveTables.defaultConfiguration.urlPrefix;

        url += '/' + (('pagelength' in config) ? config.pagelength : pageLengthValue);

        if('sort' in config)
            url += '/' + config.sort.order + '/' + config.sort.field;
        else
            url += '/' + $.responsiveTables.defaultConfiguration.defaultSortingOrder + '/' + $.responsiveTables.defaultConfiguration.defaultSortingField;

        if('page' in config)
            url += '?page=' + config.page + '&v=' + version;
        else
            url += '?page=' + page + '&v=' + version;


        url = url.replace(/\/{2}/g, '/');

        return url;
    }

    /**
     * Stringifies the predefined filters to use for the initial request.
     * @param activeFilters
     * @returns {string}
     */
    function setPredefinedFilters(activeFilters){
        $.each(activeFilters, function(key,filterCell){
            var target = $(filterCell['selector']);
            if(target.is('input[type="radio"]')) {
                if(filterCell['set_ui'][0] == 'checked' && filterCell['set_ui'][1] == true)
                    target.prop({'checked' : true});
            } else {
                if(filterCell['set_ui'][0] == 'val')
                    target.val(filterCell['set_ui'][1]);

                if(target.is('select'))
                    target.trigger("chosen:updated");
            }
        });
    }

    /**
     * Performs a request when a Responsive Table is deleted.
     */
    function performRequestAfterRowDelete() {
        if(typeof delete_row_obj != 'object'){
            delete_row_obj = new $.ajax_prototype({
                type        : 'POST',
                success     : function (data) {
                    $.responsiveTables.rows.afterDeleteRequestCallback(data);
                },
                complete    : function(){}
            });
        }

        var current_page = parseInt($('.current a').attr('data-page')),
            page;

        page =  (($('.delete').length == 1 && current_page > 1) ? current_page - 1 : current_page);

        delete_row_obj.url = createRequestURL(pageLengthValue, page, $.now());

        delete_row_obj.data = $.responsiveTables.search.getFilters();
        delete_row_obj.data['_token'] = $('[name="_token"]').val();

        $.ajax(delete_row_obj);
    }

    /*Request factories START*/

        /**
         * Create the plain request obj
         * @param properties
         * @returns {$.ajax_prototype}
         */
        function responsive_table_ajax_prototype_factory (properties) {
            properties.timeout              = 60000;
            properties.presuccesscallback   = function (instance, data) {
                if(last_execution > instance.execution)
                    throw 'old Request';

                $pending_csv = data;

                if(data.constructor == Object && 'total' in data) {
                    if (data.total > 0) {
                        $('.headersRow, .my-table .footer').show();
                        $('.my-table').removeAttr('style');
                    } else {
                        $('#noEntries').show();
                    }
                }else{
                    $.responsiveTables.main.tablesErrorHandler();
                }
            };
            properties.error                = function () {
                $.responsiveTables.main.tablesErrorHandler();
            };

            properties.execution = $.now();

            return new $.ajax_prototype(properties, null, {
                'beforeSend'    : function (instance) {
                    last_execution = instance.execution;

                    $('.resp-table').find('.responsiveTableRow').remove();
                    $('.headersRow').after($.responsiveTables.table_inline_loader).hide();
                    $('.my-table').css('border', 'none').find('.footer').hide();
                    $('#noEntries').hide();
                },
                'complete'      : function (instance) {
                    if(last_execution > instance.execution)
                        throw 'old Request';

                    var search = $('#search');

                    search.find('.submitText').show();
                    search.find('.loading').hide();

                    $('.global_loader').hide();
                    $('.responsiveTableRow:has(.loader-wrapper)').remove();
                }
            });
        }

        function preconfigured_table_ajax_prototype_factory (properties) {
            properties.timeout              = 60000;
            properties.presuccesscallback   = function (instance, data) {
                if(last_execution > instance.execution)
                    throw 'old Request';

                var current_table   = $('.resp-table.' + instance.table_name);

                if(data.constructor == Object && 'total' in data) {
                    if (data.total > 0) {
                        current_table.find('.headersRow').show();

                        var myTable = current_table.closest('.my-table');

                        myTable.removeAttr('style');
                        myTable.find('.footer, .head').show();
                    } else {
                        current_table.closest('.content').find('#noEntries').show();
                    }
                }else{
                    $.responsiveTables.main.preconfiguredTablesErrorHandler($('.resp-table.' + instance.table_name));
                }
            };
            properties.preerrorcallback     = function (instance) {
                if(last_execution > instance.execution)
                    throw 'old Request';

                $.responsiveTables.main.preconfiguredTablesErrorHandler($('.resp-table.' + instance.table_name));
            };
            properties.error                = function () {
                return ;
            };

            return new $.ajax_prototype(properties, null, {
                'beforeSend'    : function (instance) {
                    var current_table   = $('.resp-table.' + instance.table_name),
                        table_cont      = current_table.closest('.content');

                    current_table.find('.responsiveTableRow').remove();
                    table_cont.find('.headersRow').after($.responsiveTables.table_inline_loader).hide();
                    table_cont.find('.my-table').css('border', 'none').find('.footer').hide();
                    table_cont.find('#noEntries').hide();
                    table_cont.find('.my-table .head').hide();
                },
                'complete'      : function (instance) {
                    var working_table = $('.resp-table.' + instance.table_name);

                    working_table.find('.responsiveTableRow:has(.loader-wrapper)').remove();
                }
            });
        }

    /*Request factories END*/
});

$(window).on('load', function () {

});