$(document).ready(function () {
    var extendable = {
        configured_tables  : {
            initThroughConfig   : initThroughConfig,
            findTableInConfig   : findTableInConfig
        },
        getFiltersForTable      : function (tablename) {
            return getFiltersForTable(tablename);
        },
        getURL                  : function (tablename) {
            var parameters = respoConf.init[tablename],
                $table_conf = {
                    prefix      : parameters.urlPrefix,
                    pagelength  : $('.my-table:has(.' + parameters.name + ')').find('.pageLength').val(),
                    sort        : parameters.sort,
                    page        : parameters.page
                };

            return $.responsiveTables.db.createRequestURL(5 , 1, $.now(), $table_conf);
        }
    };

    if ('responsiveTables' in $)
        $.extend($.responsiveTables, extendable);
    else
        $.extend({'responsiveTables' : extendable});

    function initThroughConfig (parameters) {
        disable = typeof parameters == 'object' && 'disable_search' in parameters;
        $.responsiveTables.search.activateSortable($('.' + $.responsiveTables.defaultConfiguration.defaultSortingField + ' .' + $.responsiveTables.defaultConfiguration.defaultSortingOrder));

        if(Object.keys(activeFilters).length){
            $.responsiveTables.search.setPredefinedFilters(activeFilters);
        }else{
            $('#andoperator').prop({'checked':true});
        }

        if(Cookies.get('responsive-filters')){
            var form = $('.responsive_table_search');

            $('#toggle-responsive-table-search').click();

            $.each(Cookies.get('responsive-filters').split(','), function (key, value) {
                var filter = value.split(':'),
                    item = form.find('[name="' + filter[0] +'"]');

                if(item.is('select'))
                    item.chosen_update(filter[1]);
                else
                    item.val(filter[1]);
            });

            $.responsiveTables.search.getFilters();
        }


        respoConf.init[parameters.source].table = $('.resp-table.' + parameters.name);

        var $tableContainer = respoConf.init[parameters.source].table.closest('.pending_answer').addClass('configured_table');

        if(typeof respoConf.init_connections[parameters.name] != 'object')
            respoConf.init_connections[parameters.name] = new $.ajax_prototype({
                'type'      : 'POST',
                'success'   : function (data) {
                    if($.isPlainObject(data) && !$.isEmptyObject(data)) {
                        try {
                            $.responsiveTables.rows.handleInitialRequest(data, disable, respoConf.init[parameters.source].table);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                },
                'complete'  : function(){}
            });

        var $table_conf = {
            prefix      : parameters.urlPrefix,
            pagelength  : parameters.pagelength,
            sort        : parameters.sort,
            page        : parameters.page
        };


        respoConf.init_connections[parameters.name].url = $.responsiveTables.db.createRequestURL(parameters.pagelength , 1, $.now(), $table_conf);

        respoConf.init_connections[parameters.name].data = getFiltersForTable(parameters.source);
        respoConf.init_connections[parameters.name].data['_token'] = $('[name="_token"]').val();

        if(!('templates' in respoConf))
            respoConf.templates = {};

        respoConf.templates[parameters.name]                    = {rowTemp : $('#' + parameters.template)};
        respoConf.templates[parameters.name].rowPlaceholders    = respoConf.templates[parameters.name].rowTemp.html().match(/##\w+##/g);
        respoConf.templates[parameters.name].rowField           = respoConf.templates[parameters.name].rowTemp.html().match(/data-field="\w+"/g);

        if(parameters.fetch)
            $.ajax(respoConf.init_connections[parameters.name]);

        var $pendingId = '#' + $tableContainer.attr('id', parameters.name + '_wrapper').attr('id');

        $tableContainer.find('#search').attr('id', parameters.name + '_search').addClass('applyFilters');
        $tableContainer.find('#andoperator').attr('id', parameters.name + '_operator').addClass('andoperator');
        $tableContainer.find('[for="andoperator"]').attr('for', parameters.name + '_operator');
        $tableContainer.find('#oroperator').attr('id', parameters.name + '_oroperator').addClass('oroperator');
        $tableContainer.find('[for="oroperator"]').attr('for', parameters.name + '_oroperator');
        $tableContainer.find('#pageLength').attr('id', parameters.name + '_length').addClass('pageLength').apply_chosen(parameters.pagelength);
        $tableContainer.find('#toggle-responsive-table-search').attr('id', parameters.name + '_toggle_form').addClass('toggle_form');
        $tableContainer.find('#dateAfterRespTable').attr('id', parameters.name + '_dateAfterRespTable').attr('name', 'dateAfterRespTable').addClass('dateAfterRespTable');
        $tableContainer.find('#dateBeforeRespTable').attr('id', parameters.name + '_dateBeforeRespTable').attr('name', 'dateBeforeRespTable').addClass('dateBeforeRespTable');

        $(document)
            .on('change', $pendingId + ' .pageLength', function () {
                var obj = $(this),
                    tableName = findTableInConfig(obj.closest('.my-table').find('.resp-table').attr('class').replace('resp-table ',''));

                respoConf.init[tableName].pagelength = obj.find('option:selected').val();
                respoConf.init[tableName].page = 1;

                parameters = respoConf.init[tableName];

                if(!('page_len_connections' in respoConf))
                    respoConf['page_len_connections'] = {};

                if(typeof respoConf.page_len_connections[parameters.name] != 'object')
                    respoConf.page_len_connections[parameters.name] = new $.responsiveTables.db.preconfiguredTableAjaxPrototypeFactory({
                        'type'      : 'POST',
                        'success'   : function (data) {
                            $.responsiveTables.rows.handlePageLengthChange(data, respoConf.init[parameters.source].table);
                        },
                        'complete'  : function(){},
                        table_name  : parameters.name
                    });

                var $table_conf = {
                    prefix      : parameters.urlPrefix,
                    pagelength  : parameters.pagelength,
                    sort        : parameters.sort,
                    page        : parameters.page
                };

                respoConf.page_len_connections[parameters.name].url = $.responsiveTables.db.createRequestURL(5, 1, $.now(), $table_conf);

                respoConf.page_len_connections[parameters.name].data = getFiltersForTable(parameters.source);
                respoConf.page_len_connections[parameters.name].data['_token'] = $('[name="_token"]').val();

                $.ajax(respoConf.page_len_connections[parameters.name]);
            })
            .on('click', $pendingId + ' .pageEnum:not(.current .pageEnum)',function (e) {
                e.preventDefault();

                var obj = $(this),
                    tableName = findTableInConfig(obj.closest('.my-table').find('.resp-table').attr('class').replace('resp-table ',''));

                if(!('page_enum_connections' in respoConf))
                    respoConf['page_enum_connections'] = {};

                respoConf.init[tableName].page = obj.attr('data-page');

                parameters = respoConf.init[tableName];

                var $table = respoConf.init[parameters.source].table;

                if(typeof respoConf.page_enum_connections[parameters.name] != 'object')
                    respoConf.page_enum_connections[parameters.name] = $.responsiveTables.db.preconfiguredTableAjaxPrototypeFactory({
                        'type'      : 'POST',
                        'success'   : function (data) {
                            $.responsiveTables.rows.newPageRequest(data, $table);
                        },
                        'complete'  : function () {},
                        table_name  : parameters.name
                    });

                var $table_conf = {
                    prefix      : parameters.urlPrefix,
                    pagelength  : parameters.pagelength,
                    sort        : parameters.sort,
                    page        : parameters.page
                };

                respoConf.page_enum_connections[parameters.name].url = $.responsiveTables.db.createRequestURL(5, 1, $.now(), $table_conf);

                respoConf.page_enum_connections[parameters.name].data = getFiltersForTable(parameters.source);
                respoConf.page_enum_connections[parameters.name].data['_token'] = $('[name="_token"]').val();

                $.ajax(respoConf.page_enum_connections[parameters.name]);

                $table.closest('.my-table').find(".pagination li.current").removeClass("current");
                obj.closest('li').addClass('current');
                $.responsiveTables.pagination.fixArrows(obj, $table);
            })
            .on('click', $pendingId + ' .partial_show .pageEnum',function(e){
                e.preventDefault();

                var obj = $(this),
                    tableName = findTableInConfig(obj.closest('.my-table').find('.resp-table').attr('class').replace('resp-table ','')),
                    parameters = respoConf.init[tableName],
                    $table = respoConf.init[parameters.source].table;

                $.responsiveTables.pagination.managePaginationView(obj, $table);
            })
            .on('click', $pendingId + ' .paginationArrow', function(e){
                e.preventDefault();

                var obj = $(this),
                    tableName = findTableInConfig(obj.closest('.my-table').find('.resp-table').attr('class').replace('resp-table ','')),
                    parameters = respoConf.init[tableName],
                    $table = respoConf.init[parameters.source].table;

                $.responsiveTables.pagination.handleArrowClick(obj, parseInt($table.closest('.my-table').find('.current .pageEnum').attr('data-page')));
            })
            .on('click', $pendingId + ' .sortTable', function (e) {
                e.preventDefault();
                var obj = $(this),
                    tableName = findTableInConfig(obj.closest('.my-table').find('.resp-table').attr('class').replace('resp-table ',''))[0];

                onClickConfiguredTableSortingArrows(obj, tableName);
            })
            .on('click', $pendingId + ' .applyFilters', function (e){
                e.preventDefault();

                var obj = $(this),
                    tableName = findTableInConfig(obj.closest('.pending_answer').find('.resp-table').attr('class').replace('resp-table ',''));

                performFilterSearchForConfiguredTable(tableName);
            })
            .on('keypress', $pendingId + ' .responsive_table_search input', function(e){
                if(e.which == 13) {
                    e.preventDefault();

                    var obj = $(this),
                        tableName = findTableInConfig(obj.closest('.pending_answer').find('.resp-table').attr('class').replace('resp-table ',''));

                    performFilterSearchForConfiguredTable(tableName);
                }
            })
            .on('click', $pendingId + ' .clear-filters', function(e){
                e.preventDefault();

                clearFilters($(this).closest('form'), true);
            })
            .on('click', $pendingId + ' .toggle_form', function (e){
                e.preventDefault();
                $.responsiveTables.search.toggleResponsiveTableSearch($(this), $tableContainer.find('.form-search .form_cont'));
            });

        var dateAfterConfigured = $tableContainer.find('.dateAfterRespTable'),
            dateBeforeConfigured = $tableContainer.find('.dateBeforeRespTable');

        if(dateAfterConfigured.length && dateBeforeConfigured.length){
            dateAfterConfigured.datepicker({
                dateFormat          : 'dd/mm/yy',
                showOtherMonths     : true,
                selectOtherMonths   : true,
                showButtonPanel     : true,
                showAnim            : 'slideDown',
                changeMonth         : true,
                changeYear          : true,
                yearRange           : '1940:' + new Date().getFullYear(),
                onChangeMonthYear   : function (year, month, inst){
                    setTimeout(function () {

                        var obj     = $(inst.dpDiv),
                            table   = obj.find('table'),
                            input   = $(inst.input);

                        if(input.val()){
                            var currentDay =  input.val().split('/');

                            currentDay = new Date(currentDay[2] + '-' + currentDay[1] + '-' + currentDay[0]);

                        }else{
                            currentDay =  new Date();
                        }

                        currentDay = currentDay.getDate();


                        var date = table.find('td:not(.ui-datepicker-other-month):eq(' + (currentDay - 1) + ') a');

                        if(date.length < 1)
                            date = table.find('td:not(.ui-datepicker-other-month):eq(' + (currentDay - 2) + ') a');

                        if(date.length < 1 && month == 2)
                            date = table.find('td:not(.ui-datepicker-other-month):last a');

                        if(!date.hasClass('ui-state-active'))
                            date.addClass('ui-state-highlight');
                    },200)
                }
            });

            dateBeforeConfigured.datepicker({
                dateFormat          : 'dd/mm/yy',
                showOtherMonths     : true,
                selectOtherMonths   : true,
                showButtonPanel     : true,
                showAnim            : 'slideDown',
                changeMonth         : true,
                changeYear          : true,
                yearRange           : '1940:' + new Date().getFullYear(),
                onChangeMonthYear   : function (year, month, inst){
                    setTimeout(function () {

                        var obj     = $(inst.dpDiv),
                            table   = obj.find('table'),
                            input   = $(inst.input);

                        if(input.val()){
                            var currentDay =  input.val().split('/');

                            currentDay = new Date(currentDay[2] + '-' + currentDay[1] + '-' + currentDay[0]);

                        }else{
                            currentDay =  new Date();
                        }

                        currentDay = currentDay.getDate();


                        var date = table.find('td:not(.ui-datepicker-other-month):eq(' + (currentDay - 1) + ') a');

                        if(date.length < 1)
                            date = table.find('td:not(.ui-datepicker-other-month):eq(' + (currentDay - 2) + ') a');

                        if(date.length < 1 && month == 2)
                            date = table.find('td:not(.ui-datepicker-other-month):last a');

                        if(!date.hasClass('ui-state-active'))
                            date.addClass('ui-state-highlight');
                    },200)
                }
            });

            dateAfterConfigured.on('change', function () {
                var $date = $(this).val().split('/');

                dateBeforeConfigured.datepicker('option', 'minDate', new Date($date[2] + '/' + $date[1] + '/' + $date[0]));
            });

            dateBeforeConfigured.on('change', function () {
                var $date = $(this).val().split('/');

                dateAfterConfigured.datepicker('option', 'maxDate', new Date($date[2] + '/' + $date[1] + '/' + $date[0]));
            });
        }


        if(parameters.lazy && !('overRide' in parameters)){
            var $contentId = respoConf.init[parameters.source].table.closest('.content').attr('id');


            $('[href="#' + $contentId + '"]').one('click', function (e){
                e.preventDefault();

                $.ajax(respoConf.init_connections[parameters.name]);
            });
        }else if('overRide' in parameters){
            window[parameters.overRide](parameters);
        }
    }

    function onClickConfiguredTableSortingArrows (myObject, tableName) {
        respoConf.init[tableName].sort.order = (myObject.hasClass('arrow-up')) ? 'asc' : 'desc';
        respoConf.init[tableName].sort.field = myObject.parent("div").attr('data-sorting');
        respoConf.init[tableName].page = 1;

        var parameters = respoConf.init[tableName];

        if(!('sort_connections' in respoConf))
            respoConf.sort_connections = {};

        if(typeof respoConf.sort_connections[tableName] != 'object')
            respoConf.sort_connections[tableName] = $.responsiveTables.db.preconfiguredTableAjaxPrototypeFactory({
                'type'      : 'POST',
                'success'   : function (data) {
                    $.responsiveTables.rows.configuredTableSortingArrowsHandler(data, respoConf.init[parameters.source].table);
                },
                'complete'  : function () {},
                table_name  : parameters.name
            });

        respoConf.sort_connections[tableName].complete = function(request,event_status){
            if(event_status == 'success'){
                $.responsiveTables.search.activateSortable(myObject, respoConf.init[parameters.source].table);
            }
        };

        var $table_conf = {
            prefix      : parameters.urlPrefix,
            pagelength  : parameters.pagelength,
            sort        : parameters.sort,
            page        : parameters.page
        };

        respoConf.sort_connections[tableName].url = $.responsiveTables.db.createRequestURL(5, 1, $.now(), $table_conf);

        respoConf.sort_connections[tableName].data = getFiltersForTable(parameters.source);
        respoConf.sort_connections[tableName].data['_token'] = $('[name="_token"]').val();

        $.ajax(respoConf.sort_connections[tableName]);
    }

    function performFilterSearchForConfiguredTable (tableName) {
        var parameters = respoConf.init[tableName];

        if(typeof filters == 'undefined')
            filters = {};

        if(tableName in filters)
            old_filters = filters[tableName];
        else
            old_filters = {};

        new_filters = getFiltersForTable(parameters.source);

        delete old_filters["_token"];
        delete new_filters["_token"];

        var $performSearch = true;

        lengthOld = Object.keys(old_filters).length;
        lengthNew = Object.keys(new_filters).length;

        if(lengthOld == 0 && lengthNew == 0)
            return ;

        if(lengthOld == lengthNew)
            $.each(new_filters, function (key, value) {
                if (!(key in old_filters) || old_filters[key] != value) {
                    $performSearch = true;
                    return false;
                }

                if (old_filters[key] == value)
                    $performSearch = false;
            });

        if($performSearch === false)
            return ;

        if(!('search_connection' in respoConf))
            respoConf.search_connection = {};

        if(typeof respoConf.search_connection[parameters.name] != 'object')
            respoConf.search_connection[parameters.name] = new $.responsiveTables.db.preconfiguredTableAjaxPrototypeFactory({
                'type'          : 'POST',
                'success'       : function (data) {
                    $.responsiveTables.rows.commonSearchResultHandler(data, respoConf.init[parameters.source].table);
                },
                'complete'      : function () {
                    var search = $('#' + parameters.name + '_search');

                    search.find('.submitText').show();
                    search.find('.loading').hide();
                },
                'table_name'    : parameters.name
            });

        respoConf.init[tableName].page = 1;

        var $table_conf = {
            prefix      : parameters.urlPrefix,
            pagelength  : parameters.pagelength,
            sort        : parameters.sort,
            page        : 1
        };

        respoConf.search_connection[parameters.name].url = $.responsiveTables.db.createRequestURL(5, 1, $.now(), $table_conf);

        respoConf.search_connection[parameters.name].data = new_filters;
        respoConf.search_connection[parameters.name].data['_token'] = $('[name="_token"]').val();

        filters[tableName] = new_filters;

        $.ajax(respoConf.search_connection[parameters.name]);
    }

    function getFiltersForTable(tableName){
        if(typeof filters == 'undefined')
            var filters = {};

        filters[tableName] = {};

        var table = respoConf.init[tableName].table.closest('.pending_answer');

        table.find('.search-fields input[type="text"]:not([name="_token"]):not(.chosen-container input)').each(function(){
            var value = $(this).val();

            if (value != '') {
                var obj  = $(this),
                    name = obj.attr('id'),
                    temp = obj.attr('name');

                if(name.indexOf('date') > -1 && typeof temp != 'undefined')
                    name = temp;

                filters[tableName][name] = value;
            }
        });

        table.find('.search-fields select').each(function(){
            var value = $(this).val();

            if(typeof value == 'string' && $(this).val() != 'all')
                filters[tableName][$(this).attr('name')] = value.trim();
        });

        table.find('.search-fields [type="checkbox"]:checked').each(function(){
            var obj = $(this);

            filters[tableName][obj.attr('name')] = true;
        });

        if(table.find('#allRespTableAndOr [type="radio"]:checked').attr('class') == "oroperator")
            filters[tableName]['operator'] = 1;

        if('permanent_filter' in respoConf.init[tableName])
            $.extend(filters[tableName], respoConf.init[tableName].permanent_filter);

        return filters[tableName];
    }

    function findTableInConfig(name) {
        return $.grep(Object.keys(respoConf.init), function (a,b){
            return (respoConf.init[a].name == name);
        })
    }
});

$(window).on('load', function () {

});

function contentActive($parameters){
    var $contentId = $parameters.table.closest('.content').attr('id');

    if($('#' + $contentId).is(':visible'))
        $.ajax(respoConf.init_connections[$parameters.name]);
    else
        $('[href="#' + $contentId + '"]').one('click', function (e){
            e.preventDefault();

            $.ajax(respoConf.init_connections[$parameters.name]);
        });
}