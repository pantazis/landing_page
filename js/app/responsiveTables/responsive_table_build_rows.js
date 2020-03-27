$(document).ready(function () {
    var extendable = {
        rows    : {
            handleInitialRequest                    : handleInitialRequest,
            newPageRequest                          : newPageRequest,
            sortRequestCallback                     : sortRequestCallback,
            handlePageLengthChange                  : handlePageLengthChange,
            commonSearchResultHandler               : commonSearchResultHandler,
            adjustColumnsHeights                    : adjustColumnsHeights,
            configuredTableSortingArrowsHandler     : configuredTableSortingArrowsHandler,
            commonDefaultRequestHandler             : commonDefaultRequestHandler,
            afterDeleteRequestCallback              : afterDeleteRequestCallback
        }
    };

    if ('responsiveTables' in $)
        $.extend($.responsiveTables, extendable);
    else
        $.extend({'responsiveTables' : extendable});


    /*Response handlers START*/

        /**
         * Handle table initiation
         * @param data
         * @param disable
         * @param table
         */
        function handleInitialRequest(data, disable, table){
            renderSortTableResult(data, disable, table);
            informShowingLabel(data, table);
            $.responsiveTables.pagination.createPaginationLinks(data.last_page);
            informTableResults(data.total, table);
            setResponsiveTablesPreview(data, table);

            if (typeof onLoadRequestCallBack == 'function')
                onLoadRequestCallBack(data);

            if($('.responsiveTableRow').length)
                $('#noEntries').css('margin-top',0);
        }

        /**
         * Handles the request sent by changing page.
         * @param data
         */
        function newPageRequest(data, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            renderSortTableResult(data, false, table);
            informShowingLabel(data, table);

            var tableCont = table.closest('.my-table');

            var last_page = parseInt(tableCont.find('.pageEnum:visible:last').attr('data-page'));
            if(last_page != data.last_page){
                createPaginationLinks(data.last_page, tableCont);
                current = table.find('.pageEnum[data-page="' + data.current_page + '"]');

                if(current.length < 1)
                    tableCont.find('#moreRight').before(returnPageItem(data.current_page));

                setPaginationToPage(data.current_page, table);

                tableCont.find('.endPage').attr('data-page',data.last_page).text(data.last_page);

                managePaginationView(tableCont.find('.current a'), table);
                $.responsiveTables.pagination.fixArrows(tableCont.find('.current a'), table);
            }
        }

        /**
         * Handles the request sent by sort arrows.
         * @param data
         */
        function sortRequestCallback(data, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            var $myTable = table.closest('.my-table');

            renderSortTableResult(data, false, table);
            managePaginationView($myTable.find('[data-page="' + data.current_page + '"]'), table);
            informShowingLabel(data, table);

            setPaginationToPage(null, table);
            $.responsiveTables.pagination.fixArrows($myTable.find('.pageEnum:first'), table);

            informTableResults(data.total, table);
        }

        /**
         * Renders the table with the new data.
         * Updates the pagination links and sets page one as active.
         * Updates pagination results.
         * @param data
         */
        function handlePageLengthChange(data, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            renderSortTableResult(data, false, table);
            $.responsiveTables.pagination.createPaginationLinks(data.last_page, table);
            $.responsiveTables.pagination.setPaginationToPage(null, table);
            informShowingLabel(data, table);
            informTableResults(data.total, table);
        }

        /**
         * Handles the search response for all responsive tables.
         * @param data
         */
        function commonSearchResultHandler(data, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            var $myTable = table.closest('.my-table');

            if($.isPlainObject(data) && !$.isEmptyObject(data)){
                if(data.total > 0){
                    renderSortTableResult(data, false, table);
                    $.responsiveTables.pagination.createPaginationLinks(data.last_page, 1, table);
                    $.responsiveTables.pagination.fixArrows($myTable.find('.pageEnum:first'), table);
                    informShowingLabel(data, table);
                    $myTable.removeClass("hide-important");
                }
            }else{
                $.alertHandler('', APP_LANG.SOMETHING_GOES_WRONG, alert_box_warning);
            }

            informTableResults(data.total);
        }

        function configuredTableSortingArrowsHandler (data, table) {
            sortRequestCallback(data, table);
            informTableResults(data.total, table);
        }

        /**
         * Handle the set default request response
         * @param data
         * @param success_msg
         * @param error_code_list
         */
        function commonDefaultRequestHandler (data, error_code_list) {
            if (data.success == true) {
                var id  = (('data' in data) ? data.data.result.id : data.result.id),
                    row = $('[data-id="' + id + '"]');


                $('[data-user-id="' + row.attr('data-user-id') + '"] .default').removeClass('active').find('.submitText').text(APP_LANG.RESP_TABLE_ACTIONS.set_as_default);
                row.find('.default').addClass('active').find('.submitText').text(APP_LANG.RESP_TABLE_ACTIONS.default);
            } else if (data.success == false) {
                $.alertHandler('', data.msg, alert_box_failure);
                if($.inArray(data.code,error_code_list) > -1){
                    initiateTable({'skip_before':true});
                }
            } else {
                $.alertHandler('', APP_LANG.MESSAGES.SOMETHING_GOES_WRONG, alert_box_warning);
            }
        }

        /**
         * Render the new table after row delete.
         * @param data
         */
        function afterDeleteRequestCallback (data) {
            renderSortTableResult(data, filters == '');
            createPaginationLinks(data.last_page, data.current_page);
            informShowingLabel(data);
            informTableResults(data.total);
        }

    /*Response handlers END*/

    /*Render table START*/
        function renderSortTableResult(data, disable_required, table) {
            if(typeof table == 'undefined')
                table = $('.resp-table');

            var myTable = table.closest('.pending_answer');

            myTable.find('.global_loader').hide();

            /*    If results found reveal results` table and filters.
             *    Else if results not found and this is the initial search disable any further search.
             *    Else hide results' table.
             */
            revealResponsiveTable(data.total,disable_required, myTable);

            table.find('.responsiveTableRow').remove();

            newRowsAppend(data, table);

            var type = data.type;
            var column = data.column;
            var name = data.name;
            var value = data.value;

            table.data({
                'type': type,
                'column': column,
                'name': name,
                'value': value
            });
            table.find('.responsiveTableRow:last').find('.odd,.even').addClass("last");

            adjustColumnsHeights(table);
            $(document).foundation('dropdown', 'reflow');
        }

        /**
         * Reveals the table if there are data to show and hides it if there are no data.
         * Removes the table if there are no data and shows the no data warning.
         * @param total
         * @param disable_required
         */
        function revealResponsiveTable(total,disable_required, myTable) {
            if (total < 1) {
                if(disable_required  && typeof Cookies.get('responsive-filters') == 'undefined') {
                    myTable.find('.table_cont').remove();
                    myTable.find('#noEntries').show();
                } else {
                    myTable.find('.my-table').hide();
                }
            } else {
                myTable.find('.table_cont,.my-table').show();
            }


            if(typeof Cookies.get('responsive-filters') != 'undefined'){
                myTable.find('.table_cont').show();
                Cookies.remove("responsive-filters",{ path:'/'});
            }
        }

        /**
         * Synchronous table row append
         * @param data
         * @param table
         */
        function newRowsAppend(data, table) {
            var classRmv = 'even';

            if(typeof table == 'undefined')
                table = $('.resp-table');

            table.find('.responsiveTableRow').remove();

            var tableClass = table.attr('class').replace('resp-table ','');

            if(tableClass.length > 0 && typeof respoConf != 'undefined')
                var tableName = respoConf.init[$.responsiveTables.configured_tables.findTableInConfig(tableClass)].name;

            if ($.responsiveTables.rowTemp.length) {
                var to_append       = $.responsiveTables.rowTemp.html(),
                    placeholders    = $.responsiveTables.rowPlaceholders,
                    fields          = $.responsiveTables.rowField;
            } else {
                to_append       = respoConf.templates[tableName].rowTemp.html();
                placeholders    = respoConf.templates[tableName].rowPlaceholders;
                fields          = respoConf.templates[tableName].rowField;
            }

            var newAppending    = '';

            actionsDo       = new $.responsiveTables.queue.tableCallback('actionsDo');
            alerts          = new $.responsiveTables.queue.tableCallback('alerts');
            modificationsDo = new $.responsiveTables.queue.tableCallback('modificationsDo');

            $.each(data.data, function (key, value) {
                newAppending += to_append.replace(classRmv, '');
                classRmv = ((classRmv == 'even') ? 'odd' : 'even');


                for (i in placeholders) {
                    if (placeholders.hasOwnProperty(i)) {
                        var property = placeholders[i],
                            txt = value[property.replace(/#/g, '')];

                        if((property.indexOf('date') > -1 || property.indexOf('created_at') > -1) && txt != null){
                            var fullDisplay = false,
                                tmptxt;

                            if (typeof txt == 'string') {
                                tmptxt = txt.split(' ');
                            } else {
                                if ('display' in txt) {
                                    tmptxt = txt.display.split(' ');
                                }

                                if ('full' in txt) {
                                    fullDisplay = true;
                                }
                            }

                            if(fullDisplay){
                                if (window.location.host.indexOf('admin') == 0) {
                                    $.responsiveTables.queue.newExecuteActionHandler({
                                        'target'    : ('.' + property.replace(/#/g,'')),
                                        'condition' : [
                                            'id=' + value['id']
                                        ],
                                        'perform'   : 'addClass',
                                        'class'     : 'admin-timezone'
                                    });
                                }

                                tmptxt = tmptxt[0] + '<small>' + tmptxt[1].replace(/:[0-9]+$/,'') + '</small>';
                            }else{
                                tmptxt = tmptxt[0];
                            }

                            txt = tmptxt;
                        }


                        if(txt != null) {
                            if (property.indexOf('mail') > -1) {
                                $.responsiveTables.queue.newExecuteActionHandler({
                                    'target': '.' + property.replace(/#/g,'') + ' a',
                                    'condition': [
                                        'id=' + value['id']
                                    ],
                                    'perform': 'addAttr',
                                    'attrName': 'title',
                                    'attrValue': txt
                                });
                            }
                        }

                        if (txt == null)
                            txt = '-';

                        newAppending = newAppending.replace(new RegExp(property, 'g'), txt);
                    }
                }

                newAppending = newAppending.replace(/^\s*[\r\n]/gm,'');

                if('actions' in data){
                    var $actions = data.actions;

                    if($actions.constructor == Object){
                        $.responsiveTables.queue.newExecuteActionHandler($actions, value);
                    }else{
                        $.responsiveTables.queue.newExecuteActionHandler($actions, value);
                    }
                }

                if('actions' in value){
                    var $actions = value.actions;

                    if($actions.constructor == Object){
                        $.responsiveTables.queue.newExecuteActionHandler($actions, value);
                    }else{
                        $.responsiveTables.queue.newExecuteActionHandler($actions, value);
                    }
                }

                if('is_default' in value && value.is_default === 1){
                    actionsDo.add(function (data) {
                        var target = $(data.selector).find(data.target);

                        if(target.length)
                            target.addClass('active');
                    },{
                        selector    : '[data-id="' + value.id+ '"]',
                        target      : '.button.default'
                    });
                }

                if('alert' in value){
                    var properties = {
                        selector    : '[data-id="' + value.id + '"]',
                        alerts      : value.alert
                    };

                    if('modifications' in value){
                        properties.modifications = value.modifications;

                        var tmp = value;

                        delete value.modifications;
                        delete value.alert;

                        properties.info = tmp;
                    }

                    alerts.add(function (data) {
                        var obj = $(data.selector);

                        var foundDivs       = '',
                            foundAnchors    = '';

                        $.each(data.alerts, function (alertIndex, alertName) {
                            var div = obj.find('[id*="droping"][id*="' + alertName + '"]'),
                                divId = div.attr('id');

                            if (typeof divId != 'undefined') {
                                foundDivs += ':not([id="' + divId + '"])';
                                foundAnchors += ':not([data-dropdown="' + divId + '"])';
                            }

                            if('modifications' in data && data.modifications.hasOwnProperty(alertName)){
                                if('classColumn' in data.modifications[alertName]) {
                                    var $errorStatus = data.info[data.modifications[alertName].classColumn];

                                    if ($errorStatus) {
                                        obj.find('.warn[data-dropdown="' + div.attr('id') + '"]:not([data-warn="' + $errorStatus + '"])').remove();
                                    }
                                }

                                if('do' in data.modifications[alertName]){
                                    $.each(data.modifications[alertName].do, function ($action, $config) {
                                        switch($action){
                                            case 'addClass':
                                                modificationsDo.add(function (data) {
                                                    $.responsiveTables.queue.known.addClassModification(data.row, data.config);
                                                },{
                                                    row     : obj,
                                                    config  : $config
                                                });
                                                break;
                                            case 'linkToText':
                                                modificationsDo.add(function (data) {
                                                    $.responsiveTables.queue.known.linkToText(data.row,alertName);
                                                },{
                                                    row         : obj,
                                                    alertName   : alertName
                                                });
                                                break;
                                            case 'protectFieldWarning':
                                                var protect = $.responsiveTables.queue.known.protectFieldWarning($config, div, foundDivs, foundAnchors);

                                                foundDivs       = protect[0];
                                                foundAnchors    = protect[1];
                                                break;
                                        }
                                    });
                                }
                            }

                        });

                        obj.find('.f-dropdown:not(.id_dropdown):not(.date_dropdown)' + foundDivs + '').remove();
                        obj.find('.warn:not(.date_icon)' + foundAnchors + '').remove();
                    },properties)
                }else{
                    alerts.add(function (data) {
                        var obj = $(data.selector);

                        obj.find('.warn:not(.protected), div[id*="droping"]').remove();
                    },{
                        selector    : '[data-id="' + value.id + '"]'
                    });
                }
            });

            table.append(newAppending).find('.responsiveTableRow:last');

            if(alerts.pending())
                actionsDo.add(alerts);

            actionsDo.add(function () {
                if(modificationsDo.pending())
                    modificationsDo.fire();
            }, {});

            actionsDo.fire();

            table.find('.responsiveTableRow').find('[href*="_"]').each(function () {
                var $a = $(this);

                $a.attr('href', $a.attr('href').replace('_', '-'));
            });
        }

        /**
         * Fixes the height foreach cell in order the border to enclose it completely.
         * Finds the max height in each row and assignees it to the included cells.
         * @param table
         */
        function adjustColumnsHeights (table) {
            if($('#logTable').length < 1) {
                if ($.windowSize() > 1024) {
                    table.find('.responsiveTableRow').each(function () {
                        var height = 0,
                            obj = $(this);

                        obj.find('.row:first > .columns').each(function () {
                            var thisHeight = $(this).actual('height');

                            if (height < thisHeight)
                                height = thisHeight;
                        });

                        obj.find('.row:first > .columns').height(height).css({'visibility':'visible'});
                    });
                } else {
                    table.find('.responsiveTableRow').each(function () {
                        $(this).find('.row:first > .columns').removeAttr('style');
                    });
                }
            }
        }

        /**
         * Updates the pagination showing results label
         * @param data
         */
        function informShowingLabel(data, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            table.find('#fromEnum').text(data.from);
            table.find('#toEnum').text(data.to);
            table.find('#totalEnum').text(data.total);
        }
    /*Render table END*/

    /*Inform result info START*/
        /**
         * Updates the form`s result label.
         * @param total
         */
        function informTableResults(total, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.pending_answer');

            if(total > 0){
                table.find('.table-results').html(APP_LANG.RESULTS_FOUND['results_found'].replace('%%results%%',total));
            }else{
                table.find('.table-results').html(APP_LANG.RESULTS_FOUND['no_results_found']);
            }
        }

        /**
         * Find and set all preview elements for responsive tables
         * @param data
         */
        function setResponsiveTablesPreview (data, table) {
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.pending_answer');

            if('domain_all_count' in data)
                table.find('#total_count').text(data.domain_all_count).next('.number-label').text($.translate('DOMAINS.RESPONSIVE_TABLES_PREVIEW.REGISTERED', data.domain_all_count));
            else
                table.find('#total_count').text(data.total);

            var missing = table.find('#missing_total'),
                expired = table.find('#expired_total'),
                expires = table.find('#expires_total');

            if(missing.length)
                if(data.missing_count > 0){
                    missing.text(data.missing_count).closest('li').find('button').closest('div').show();
                }else{
                    missing.text(0).closest('li').find('button').closest('div').hide();
                }

            if(expired.length)
                if(data.expired > 0){
                    expired.text(data.expired).next('.number-label').text($.translate('DOMAINS.RESPONSIVE_TABLES_PREVIEW.EXPIRED', data.expired)).closest('li').find('button').closest('div').show();
                }else{
                    expired.text(0).next('.number-label').text($.translate('DOMAINS.RESPONSIVE_TABLES_PREVIEW.EXPIRED', 2)).closest('li').find('button').closest('div').hide();
                }

            if(expires.length)
                if(data.expires > 0){
                    expires.text(data.expires).next('.number-label').text($.translate('DOMAINS.RESPONSIVE_TABLES_PREVIEW.EXPIRES', data.expires)).closest('li').find('button').closest('div').show();
                }else{
                    expires.text(0).next('.number-label').text($.translate('DOMAINS.RESPONSIVE_TABLES_PREVIEW.EXPIRES', 2)).closest('li').find('button').closest('div').hide();
                }
        }
    /*Inform result info END*/
});

$(window).on('load', function () {

});