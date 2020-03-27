$(document).ready(function(){
    if (typeof disableAutoTableInit == 'undefined')
        disableAutoTableInit = $('#logTable').length > 0;

    var $pending_csv = null;

    if(typeof activeFilters == 'undefined' || activeFilters == null || activeFilters.length < 1)
        activeFilters = {};

    var controller = $('#table_controller'),
        table_inline_loader = '<div class="responsiveTableRow"><div class="loader-wrapper" style="position: relative; padding: 4rem 0; width: 100%; height: 100%;"><div class="loading" style="left: 50%; margin-left: -2.5rem; position: absolute;margin-top: -1rem;"><div class="spinner dark" style="width: 5rem;height: 5rem;border-width: 6px;"></div></div></div></div>',
        last_execution      = 0;

    $rowtemp = $('#rowTemp');

    if($rowtemp.length) {
        $rowtemp.html($rowtemp.html().replace(/ {2,}/g, ' '));

        var $rowPlaceholders    = $rowtemp.html().match(/##\w+##/g),
            $rowField           = $rowtemp.html().match(/data-field="\w+"/g);
    }

    var pagination_config       = {
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
        pageLengthValue         = controller.attr('data-page-length'),
        urlPrefix               = controller.attr('data-url-prefix'),
        external_filters        = controller.attr('data-external-filters');

    var transfer_clicked = false,
        elTitle = {
            'avail'         : 'Το <strong>##domain##</strong> είναι διαθέσιμο προς κατοχύρωση. Κατοχύρωσέ το έως τις 10 Οκτωβρίου μόνο με 9€ για 2 έτη!',
            'un_avail'      : 'Το ##domain## δεν είναι διαθέσιμο προς κατοχύρωση.',
            'conditionally' : 'Το <strong>##domain##</strong> είναι διαθέσιμο υπό συγκεκριμένους όρους.',
            'unknown'       : 'Δεν έχουμε λάβει απάντηση για το ##domain## από το ελληνικό μητρώο .ελ και .gr domains.'
        };

    defaultSortingField     = controller.attr('data-sorting-field');
    defaultSortingOrder     = controller.attr('data-sorting-order');

    if(typeof controller.attr('data-pending-url-prefix') != 'undefined'){
        pendingUrlPrefix = controller.attr('data-pending-url-prefix');
    }

    $('.responsive_table_search select').each(function () {
        var obj = $(this),
            param = {
                search_contains : true
            };

        if(obj.attr('id') == 'sale_document_type_id')
            param['events'] = [
                {
                    'name'  : 'chosen:showing_dropdown',
                    'event' : function () {
                        var chosen_cont = $('#sale_document_type_id_chosen');

                        chosen_cont.find('.group-result').addClass('group-separator');
                        chosen_cont.find('.group-option').addClass('group-option-alighned');
                    }
                }
            ];

        obj.apply_chosen({
            value   : obj.val(),
            par     : param
        });
    });

    if(typeof respoConf == 'undefined') {
        if (! disableAutoTableInit) {
            initiateTable({'disable_search': true});
        }
    }else{
        $.each(respoConf.init, function($table, $configuration){
            initThroughConfig($configuration)
        });
    }

    $('#pageLength').apply_chosen(pageLengthValue);

    $('#expires_show').on('click', function () {
        clearFilters($('.responsive_table_search'), false);

        if(!$('.responsive_table_search').hasClass('visible'))
            $('#toggle-responsive-table-search').click();

        var today = new Date();

        dateAfter.val(today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear());

        today.setMonth(today.getMonth() + 1);

        dateBefore.val(today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear());

        $('.responsive_table_search #search').click();
    });

    $('#expired_show').on('click', function () {
        clearFilters($('.responsive_table_search'), false);

        if(!$('.responsive_table_search').hasClass('visible'))
            $('#toggle-responsive-table-search').click();

        var today = new Date();

        today = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

        dateBefore.val(today).change();
        $('.responsive_table_search #search').click();
    });

    $('#missing_show').on('click', function () {
        clearFilters($('.responsive_table_search'), false);

        if(!$('.responsive_table_search').hasClass('visible'))
            $('#toggle-responsive-table-search').click();

        $('[name="ready_status"]').chosen_update('2');
        $('.responsive_table_search #search').click();
    });

    $('#toggle-responsive-table-search:not(.configured_table #toggle-responsive-table-search)').on('click',function(e){
        e.preventDefault();
        toggle_responsive_table_search ($(this), $('.form-search .form_cont'))
    });

    $(document)
        .on('click', '.responsive_table_search #search:not(.configured_table #search)', function (e) {
            e.preventDefault();
            performFilterSearch();
        })
        .on('keypress', '.responsive_table_search input:not(.configured_table input)', function(e){
            if(e.which == 13) {
                e.preventDefault();
                performFilterSearch();
            }
        })
        .on('click', '.sortTable:not(.active):not(.configured_table .sortTable)', function(e){
            e.preventDefault();
            onClickSortingArrows($(this));
        })
        .on('change','#pageLength:not(.configured_table #pageLength)',function(e){
            e.preventDefault();
            pageLengthValue = $(this).find('option:selected').val();

            page_len_obj = responsive_table_ajax_prototype_factory ({
                'type'      : 'POST',
                'success'   : function (data) {
                    handlePageLengthChange(data);
                },
                'complete'  : function(){
                    $('.pending_answer .global_loader').hide();
                }
            });

            page_len_obj.url = createRequestURL(pageLengthValue, 1, $.now());

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
                page_len_obj.data = getFilters();
            }

            page_len_obj.data['_token'] = $('[name="_token"]').val();

            $.ajax(page_len_obj);
        })
        .on('click', '.pageEnum:not(.current .pageEnum):not(.configured_table .pageEnum)',function(e){
            e.preventDefault();
            var obj = $(this);

            page_obj = responsive_table_ajax_prototype_factory ({
                'type'      : 'POST',
                'success'   : function (data) {
                    newPageRequest(data);
                },
                'complete'  : function(){
                    $('.pending_answer .global_loader').hide();
                }
            });

            page_obj.url = createRequestURL(pageLengthValue, obj.attr('data-page'), $.now());

            var shortcut = $('.shortcut_btn.active');

            if(shortcut.length){
                var shortcutName = shortcut.attr('data-shortcut');

                if(typeof shortcutName != 'undefined')
                    page_obj.data = {
                        shortcut : shortcutName
                    };
                else
                    page_obj.data = {};

                if(typeof persistentFilters != 'undefined')
                    $.extend(page_obj.data, persistentFilters);
            }else{
                page_obj.data = getFilters();
            }
            page_obj.data['_token'] = $('[name="_token"]').val();

            $.ajax(page_obj);

            $(".pagination li.current").removeClass("current");
            obj.closest('li').addClass('current');
            fixArrows(obj);
        })
        .on('click', '.partial_show .pageEnum:not(.configured_table .partial_show .pageEnum)',function(e){
            e.preventDefault();
            managePaginationView($(this));
        })
        .on('click', '.paginationArrow:not(.configured_table .paginationArrow)', function(e){
            e.preventDefault();
            handleArrowClick($(this), parseInt($('.current .pageEnum').attr('data-page')));
        })
        .on('click', '.button.default',function(e){
            e.preventDefault();
            $(this).blur();
        })
        .on('click', '.renew.ssl', function (e){
            e.preventDefault();

            var obj = $(this);

            $.ajax({
                timeout         : 30000,
                type            : 'POST',
                data            : {
                    '_token'        : $('[name="_token"]').val(),
                    'unique_id'     : unique_page_identifier,
                    'sku'           : obj.attr('data-product-sku'),
                    'action'        : 'renew',
                    'auto_enroll'   : false
                },
                url             : obj.attr('href'),
                beforeSend      : function () {
                    this.active_element.find('.submitText').hide();
                    this.active_element.find('.loading').show();
                },
                error           : function (e) {
                    globalErrorsHandler(e);
                },
                success         : function (data) {
                    if (data.success) {
                        var obj = this.active_element;

                        obj.addClass('in-cart').attr('data-cart-item-id', data.data.id).find('.submitText').text(COMMON_LANG.CART.IN_CART);

                        if ('cart_items' in data.data) {
                            $.each(data.data.cart_items, function (index, item) {
                                $.cart.insert(item.id, item.name, item.sub_name, item.total_price);

                                if (item.type == 'ssl') {
                                    obj.attr('data-cart-item-id', item.id);
                                }
                            });
                        } else {
                            $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);
                            obj.attr('data-cart-item-id', data.data.id);
                        }

                        if (app_env != 'local' && 'remarketing_items' in data.data) {
                            $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                        }
                    } else {
                        $.cart.errorHandler(data);
                    }
                },
                complete        : function () {
                    this.active_element.find('.submitText').show();
                    this.active_element.find('.loading').hide();
                },
                active_element  : obj
            });
        })
        .on('click', '.clear-filters:not(.configured_table .clear-filters)', function(e){
            e.preventDefault();

            clearFilters($(this).closest('form'), true);
        })
        .on('click', '.shortcut_btn:not(.active)', function () {
            var obj = $(this);

            sendShortcutRequest (obj)
        })
        .on('click', '[data-handler="today"]', function () {
            var obj     = $(this),
                cont    = obj.closest('.ui-datepicker'),
                date    = new Date(),
                year    = date.getFullYear(),
                month   = date.getMonth(),
                day     = date.getDate();

            cont.find('.ui-datepicker-year').val(year).change();
            cont.find('.ui-datepicker-month').val(month).change();

            var new_cont = $('.ui-datepicker-calendar:visible');

            new_cont.find('[data-month="' + month + '"]:eq(' + (--day) + ') a').click()
        })
        .on('click', '.hasDatepicker', function () {
            var obj         = $(this),
                local_date  = obj.val(),
                id          = obj.attr('id'),
                today_btn   = $('.ui-datepicker [data-handler="today"]'),
                relative;

            var continue_hiding = false;

            if (local_date) {
                local_date              = local_date.split('/');
                var local_date_obj      = new Date(local_date[2], local_date[1] - 1, local_date[0]);

                if (local_date_obj.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
                    today_btn.addClass('hide');
                } else {
                    today_btn.removeClass('hide');

                    continue_hiding = true;
                }
            }else{
                continue_hiding = true;
            }

            if(continue_hiding) {
                if (id.indexOf('After') > -1)
                    relative = $('#' + id.replace('After', 'Before'));
                else
                    relative = $('#' + id.replace('Before', 'After'));

                var relative_date = relative.val(),
                    relative_date_obj;

                if (relative_date) {
                    relative_date = relative_date.split('/');
                    relative_date_obj = new Date(relative_date[2], relative_date[1] - 1, relative_date[0]);

                    if (relative_date_obj.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
                        today_btn.addClass('hide');
                    } else {
                        today_btn.removeClass('hide');
                    }
                }
            }
        });

    $('body').on('cart-item:removed', function (e, params) {
        removeCartItemFromTable($('[data-cart-item-id="' + params.item+ '"]:not(.renew)'));
    });

    var dateAfter = $('#dateAfterRespTable:not(.configured_table #dateAfterRespTable),#exDateAfterRespTable:not(.configured_table #exDateAfterRespTable)'),
        dateBefore = $('#dateBeforeRespTable:not(.configured_table #dateBeforeRespTable),#exDateBeforeRespTable:not(.configured_table #exDateBeforeRespTable)');

    if(dateAfter.length && dateBefore.length){

        setupDateHandlers (dateAfter, dateBefore);

        var updateAfter     = $('#updatedAfterRespTable'),
            updateBefore    = $('#updatedBeforeRespTable');

        if (updateAfter.length && updateBefore.length) {
            setupDateHandlers (updateAfter, updateBefore);
        }
    }

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

    if($('.domains-all').length)
        $(document).on('click', '.button.renew', function (e) {
            e.preventDefault();
            var obj = $(this);

            obj.addClass('disabled requestTrigger');

            var closestRow = obj.closest('.responsiveTableRow');

            renewObject = new $.ajax_prototype({
                type        : 'POST',
                data        : {
                    '_token'        : $('[name="_token"]').val(),
                    'unique_id'     : unique_page_identifier
                },
                success     : function (data, instance) {
                    if(data.success){
                        $('[href="' + instance.url + '"]').addClass('in-cart').attr('data-cart-item-id', data.data.id).find('.submitText').text(COMMON_LANG.CART.IN_CART);
                        $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);

                        if (app_env != 'local' && 'remarketing_items' in data.data) {
                            $.sendAddToCartRemarketingEvent(data.data.remarketing_items);
                        }
                    }else{
                        globalApplicationErrors(data);
                    }
                },
                complete    : function () {
                    var activeElement = $(this.active_element);

                    activeElement.find('.submitText').show();
                    activeElement.find('.loading').hide();
                    activeElement.removeClass('disabled');
                },
            });

            renewObject.url             = $(this).attr('href');
            renewObject.active_element  = this;

            $.ajax(renewObject);
            obj.blur();
            obj.removeClass('requestTrigger');
        });

    $(window).resize(function () {
        managePaginationView($('.current a'));
        adjustColumnsHeights($('.resp-table'));
    });

    $.fn.extend({
        responsive_tables   : function ($action, $option) {
            switch ($action){
                case 'findTableInConfig':
                    return findTableInConfig($(this).attr('class').replace('resp-table ',''));
                    break;
                case 'clear_filtersForTable':
                    clearFilters($(this).find('form'), $option);
                    break;
            }
        },
        responsive_actions  : function($action) {
            switch ($action) {
            }
        }

    });
    $.extend({
        responsive_tables               : {
            initiate                : function (param) {
                getFilters();
                initiateTable(param);
            },
            clear_filters           : function () {
                performRespTableClearFiltersRequest();
            },
            row_delete              : function () {
                performRequestAfterRowDelete();
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

                return createRequestURL(5 , 1, $.now(), $table_conf);
            }
        },
        commonDefaultRequestHandler     : function (data, error_code_list) {
            commonDefaultRequestHandler(data, error_code_list);
        },
        fetch_pending_csv               : function () {
            return $pending_csv;
        }
    });

    /**
     * Perform a request START
     */

        /**
         * Performs a request on page load.
         * Activates defined sort option.
         * Collects active filters and performs the request.
         * @param parameters
         */
        function initiateTable(parameters) {
            disable = typeof parameters == 'object' && 'disable_search' in parameters;
            activateSortable($('.' + defaultSortingField + ' .' + defaultSortingOrder));

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

                getFilters();
            }


            if(typeof $shortcut == 'string'){
                var btn = $('[data-shortcut="' + $shortcut + '"]');

                if(btn.length){
                    sendShortcutRequest (btn);
                    $shortcut = null;

                    return ;
                }

            }

            if(typeof init_table_obj != 'object')
                init_table_obj = responsive_table_ajax_prototype_factory({
                    'type'      : 'POST',
                    'success'   : function (data) {
                        if($.isPlainObject(data) && !$.isEmptyObject(data)) {
                            handleInitialRequest(data, disable);
                        }
                    },
                    'complete'  : function(){}
                });

            init_table_obj.url = createRequestURL(pageLengthValue, 1, $.now());

            init_table_obj.data = getFilters();
            init_table_obj.data['_token'] = $('[name="_token"]').val();


            $.ajax(init_table_obj);
        }

        function initThroughConfig(parameters){
            var disable = typeof parameters == 'object' && 'disable_search' in parameters;
            activateSortable($('.' + defaultSortingField + ' .' + defaultSortingOrder));

            if(Object.keys(activeFilters).length){
                setPredefinedFilters(activeFilters);
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

                getFilters();
            }


            try {
                respoConf.init[parameters.source].table = $('.resp-table.' + parameters.name);
            } catch (e) {
                if (typeof respoConf.init[parameters.source] == 'undefined') {
                    respoConf.init[parameters.name].table = $('.resp-table.' + parameters.name);

                    parameters.source = parameters.name;
                    respoConf.init[parameters.name].source = parameters.name;
                } else
                    throw e;
            }

            var $tableContainer = respoConf.init[parameters.source].table.closest('.pending_answer').addClass('configured_table');

            if(typeof respoConf.init_connections[parameters.name] != 'object')
                respoConf.init_connections[parameters.name] = new $.ajax_prototype({
                    'type'      : 'POST',
                    'success'   : function (data) {
                        if($.isPlainObject(data) && !$.isEmptyObject(data)) {
                            handleInitialRequest(data, disable, respoConf.init[parameters.source].table);
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


            respoConf.init_connections[parameters.name].url = createRequestURL(parameters.pagelength , 1, $.now(), $table_conf);

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
                        respoConf.page_len_connections[parameters.name] = new preconfigured_table_ajax_prototype_factory({
                            'type'      : 'POST',
                            'success'   : function (data) {
                                handlePageLengthChange(data, respoConf.init[parameters.source].table);
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

                    respoConf.page_len_connections[parameters.name].url = createRequestURL(pageLengthValue, 1, $.now(), $table_conf);

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
                        respoConf.page_enum_connections[parameters.name] = preconfigured_table_ajax_prototype_factory({
                            'type'      : 'POST',
                            'success'   : function (data) {
                                newPageRequest(data, $table);
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

                    respoConf.page_enum_connections[parameters.name].url = createRequestURL(pageLengthValue, 1, $.now(), $table_conf);

                    respoConf.page_enum_connections[parameters.name].data = getFiltersForTable(parameters.source);
                    respoConf.page_enum_connections[parameters.name].data['_token'] = $('[name="_token"]').val();

                    $.ajax(respoConf.page_enum_connections[parameters.name]);

                    $table.closest('.my-table').find(".pagination li.current").removeClass("current");
                    obj.closest('li').addClass('current');
                    fixArrows(obj, $table);
                })
                .on('click', $pendingId + ' .partial_show .pageEnum',function(e){
                    e.preventDefault();

                    var obj = $(this),
                        tableName = findTableInConfig(obj.closest('.my-table').find('.resp-table').attr('class').replace('resp-table ','')),
                        parameters = respoConf.init[tableName],
                        $table = respoConf.init[parameters.source].table;

                    managePaginationView(obj, $table);
                })
                .on('click', $pendingId + ' .paginationArrow', function(e){
                    e.preventDefault();

                    var obj = $(this),
                        tableName = findTableInConfig(obj.closest('.my-table').find('.resp-table').attr('class').replace('resp-table ','')),
                        parameters = respoConf.init[tableName],
                        $table = respoConf.init[parameters.source].table;

                    handleArrowClick(obj, parseInt($table.closest('.my-table').find('.current .pageEnum').attr('data-page')));
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
                    toggle_responsive_table_search ($(this), $tableContainer.find('.form-search .form_cont'));
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

        /**
         * Performs a request when the filters are cleared.
         */
        function performRespTableClearFiltersRequest() {
            delete filters['_token'];

            if(Object.keys(filters).length == 0)
                return ;

            filters = {};

            if(typeof search_obj === 'object') {
                search_obj.url = createRequestURL(pageLengthValue, 1, $.now());

                search_obj.data = {'_token' : $('[name="_token"]').val()};

                if(typeof persistentFilters != 'undefined')
                    $.extend(search_obj.data, persistentFilters);

                $.ajax(search_obj);
            }
        }

        /**
         * Performs a request when a Responsive Table is deleted.
         */
        function performRequestAfterRowDelete() {
            if(typeof delete_row_obj != 'object'){
                delete_row_obj = new $.ajax_prototype({
                    type        : 'POST',
                    success     : function (data) {
                        afterDeleteRequestCallback(data);
                    },
                    complete    : function(){}
                });
            }

            var current_page = parseInt($('.current a').attr('data-page')),
                page;

            page =  (($('.delete').length == 1 && current_page > 1) ? current_page - 1 : current_page);

            delete_row_obj.url = createRequestURL(pageLengthValue, page, $.now());

            delete_row_obj.data = getFilters();
            delete_row_obj.data['_token'] = $('[name="_token"]').val();

            $.ajax(delete_row_obj);
        }

        /**
         * Performs a request to get the table sorted.
         * The clicked arrow is activated after the response received successfully.
         * @param myObject
         */
        function onClickSortingArrows(myObject){
            defaultSortingOrder = (myObject.hasClass('arrow-up')) ? 'asc' : 'desc';
            defaultSortingField = myObject.parent("div").attr('data-sorting');

            sort_obj = responsive_table_ajax_prototype_factory ({
                'type'      : 'POST',
                'success'   : function (data) {
                    sortRequestCallback(data);
                    informTableResults(data.total);
                },
                'complete'  : function(){}
            });

            sort_obj.complete = function(request,event_status){
                if(event_status == 'success'){
                    activateSortable(myObject);
                }
            };

            sort_obj.url = createRequestURL(pageLengthValue, 1, $.now());

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
                sort_obj.data = getFilters();
            }

            sort_obj.data['_token'] = $('[name="_token"]').val();

            $.ajax(sort_obj);
        }

        function onClickConfiguredTableSortingArrows(myObject, tableName){
            respoConf.init[tableName].sort.order = (myObject.hasClass('arrow-up')) ? 'asc' : 'desc';
            respoConf.init[tableName].sort.field = myObject.parent("div").attr('data-sorting');
            respoConf.init[tableName].page = 1;

            var parameters = respoConf.init[tableName];

            if(!('sort_connections' in respoConf))
                respoConf.sort_connections = {};

            if(typeof respoConf.sort_connections[tableName] != 'object')
                respoConf.sort_connections[tableName] = preconfigured_table_ajax_prototype_factory({
                    'type'      : 'POST',
                    'success'   : function (data) {
                        sortRequestCallback(data, respoConf.init[parameters.source].table);
                        informTableResults(data.total, respoConf.init[parameters.source].table);
                    },
                    'complete'  : function () {},
                    table_name  : parameters.name
                });

            respoConf.sort_connections[tableName].complete = function(request,event_status){
                if(event_status == 'success'){
                    activateSortable(myObject, respoConf.init[parameters.source].table);
                }
            };

            var $table_conf = {
                prefix      : parameters.urlPrefix,
                pagelength  : parameters.pagelength,
                sort        : parameters.sort,
                page        : parameters.page
            };

            respoConf.sort_connections[tableName].url = createRequestURL(pageLengthValue, 1, $.now(), $table_conf);

            respoConf.sort_connections[tableName].data = getFiltersForTable(parameters.source);
            respoConf.sort_connections[tableName].data['_token'] = $('[name="_token"]').val();

            $.ajax(respoConf.sort_connections[tableName]);
        }

        function performFilterSearch () {
            $previousActiveShortcut = false;

            if($('.shortcut_btn.active').length) {
                $('.shortcut_btn:not(.inactive)').closest('div').show();
                $('.shortcut_btn:first').addClass('active').closest('div').hide();

                $('.shortcut_btn').removeClass('active');

                $previousActiveShortcut = true;
            }

            old_filters = filters;
            new_filters = getFilters();


            delete old_filters["_token"];
            delete new_filters["_token"];

            var $performSearch = true;

            lengthOld = Object.keys(old_filters).length;
            lengthNew = Object.keys(new_filters).length;

            if($previousActiveShortcut == true){
                $previousActiveShortcut = false;
            }else {
                if(lengthOld == 0 && lengthNew == 0)
                    return ;

                if(lengthOld == lengthNew)
                    $.each(new_filters, function (key, value){
                        if(!(key in old_filters) || old_filters[key] != value){
                            $performSearch = true;
                            return false;
                        }

                        if(old_filters[key] == value)
                            $performSearch = false;
                    });

                if($performSearch === false)
                    return ;
            }


            search_obj = responsive_table_ajax_prototype_factory ({
                    'type'      : 'POST',
                    'success'   : function (data) {
                        commonSearchResultHandler(data);
                        $filterDisplay = true;
                    },
                    'complete'  : function() {
                        var search = $('#search');

                        search.find('.submitText').show();
                        search.find('.loading').hide();
                    }
                });

            search_obj.url = createRequestURL(pageLengthValue, 1, $.now());

            search_obj.data = new_filters;
            search_obj.data['_token'] = $('[name="_token"]').val();

            $.ajax(search_obj);
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
                $.each(new_filters, function (key, value){
                    if(!(key in old_filters) || old_filters[key] != value){
                        $performSearch = true;
                        return false;
                    }

                    if(old_filters[key] == value)
                        $performSearch = false;
                });

            if($performSearch === false)
                return ;

            if(!('search_connection' in respoConf))
                respoConf.search_connection = {};

            if(typeof respoConf.search_connection[parameters.name] != 'object')
                respoConf.search_connection[parameters.name] = preconfigured_table_ajax_prototype_factory({
                    'type'          : 'POST',
                    'success'       : function (data) {
                        commonSearchResultHandler(data, respoConf.init[parameters.source].table);
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

            respoConf.search_connection[parameters.name].url = createRequestURL(pageLengthValue, 1, $.now(), $table_conf);

            respoConf.search_connection[parameters.name].data = new_filters;
            respoConf.search_connection[parameters.name].data['_token'] = $('[name="_token"]').val();

            filters[tableName] = new_filters;

            $.ajax(respoConf.search_connection[parameters.name]);
        }

    /**
     *  Perform a request END
     */


    /**
     *  Create responsive table START
     */

        /**
         * Renders the Responsive Table.
         * Disabled required argument determines if the table should be removed if there are no results.
         * @param data
         * @param disable_required
         */
        function renderSortTableResult(data, disable_required, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            var myTable = table.closest('.pending_answer');

            myTable.find('.global_loader').hide();

            /*
             *    If results found reveal results` table and filters.
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
        function revealResponsiveTable(total,disable_required, myTable){
            if (total < 1) {
                if(disable_required  && typeof Cookies.get('responsive-filters') == 'undefined') {
                    myTable.find('.table_cont').remove();
                    myTable.find('.noEntries').show();
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
         * Parses the response and generates the table row.
         * @param jsonResult
         * @returns {string}
         */
        /*function createTableRows(jsonResult){
            var logRow = '';
            for (index in jsonResult['data']){

                doEdit = true;
                if('type' in jsonResult['data'][index] && jsonResult['data'][index]['type'] == 'rec'){
                    doEdit = false;
                }

                logRow += '<div class="responsiveTableRow"';

                if('id' in jsonResult['data'][index]){
                    logRow += ' data-id="' + jsonResult['data'][index]['id'] + '"';
                }
                if('name' in jsonResult['data'][index]){
                    logRow += ' data-name="' + jsonResult['data'][index]['name'] + '"';
                }
                if('user_id' in jsonResult['data'][index]){
                    logRow += ' data-user-id="' + jsonResult['data'][index]['user_id'] + '"';
                }

                logRow += '><div ';
                index % 2 === 0 ? logRow +=" class=\"odd" : logRow +=" class= \"even";

                //Change row start
                //Change row color start
                if (index == 0){
                    changeRowColorField = null;
                    $.each(jsonResult['data'][index], function(key){
                        if (typeof jsonResult['fields'][key] != 'undefined' && 'change_row_color' in jsonResult['fields'][key]){
                            changeRowColorField = key;
                        }
                    });
                }
                if (changeRowColorField != null && jsonResult['data'][index][changeRowColorField] == '1'){ logRow += " " + jsonResult['fields'][changeRowColorField]['css_class']; }
                //Change row color end
                //Change row end

                //Populate info in columns start
                logRow +='" ><div class="row">';
                for(column in jsonResult['view_columns']){
                    columLocale = jsonResult['view_columns'][column];
                    if(columLocale in jsonResult['fields'] && jsonResult['fields'][columLocale]['display'] === undefined){
                        logRow += '<div class="' + jsonResult['fields'][columLocale]['css_td'];
                        if(jsonResult['name'] != 'pagination.log_last_login'){
                            //logRow += ' controlled_height" style="visibility: hidden"';
                            logRow += ' controlled_height"';
                        }else{
                            logRow += '"';
                        }
                        logRow += '>';
                        if(jsonResult['fields'][columLocale]['hasForSmall']) {


                            //Create fields for small

                            logRow += '<div class="row"><div class="' + jsonResult['fields'][columLocale]['css_label'] + ' hide-for-large-up"><span class="' + columLocale + '-label">';

                            jsonResult['fields'][columLocale]['label'] !== undefined ? logRow += jsonResult['fields'][columLocale]['label'] : logRow += jsonResult['lang'][columLocale];
                            logRow += ':</span></div><div class="' + jsonResult['fields'][columLocale]['css_data'] + '"><span class="' + columLocale + '">';
                            if( (jsonResult['modifications'] !== null) && (jsonResult['modifications'][columLocale] !== undefined) && jsonResult['modifications'][columLocale]['href_path'] !== undefined)
                            {
                                if(jsonResult['modifications'][columLocale]['text'] !== undefined)
                                {
                                    myfields = jsonResult['modifications'][columLocale]['text_replace'] + "";
                                    myfields = myfields.split('.');
                                    newValue = jsonResult['data'][index];

                                    for (onefield in myfields)
                                    {

                                        newValue = newValue[myfields[onefield]];
                                    }
                                    jsonResult['data'][index][columLocale] = newValue;
                                }
                                //Create a link
                                myPath = jsonResult['modifications'][columLocale]['href_path'];

                                for(route in jsonResult['modifications'][columLocale]['href_path_replace']){
                                    myPath = myPath.replace('{{' + route + '}}', jsonResult['data'][index][jsonResult['modifications'][columLocale]['href_path_replace'][route]]);
                                }

                                //TODO dublicate function
                                if(jsonResult['modifications'][columLocale]['hasAlert'] !== undefined){
                                    if($.inArray(columLocale,jsonResult['data'][index]['alert']) !== -1)
                                    {

                                        tmpLink = jsonResult["alert"][columLocale]["changeLink"].split('.');
                                        setup = jsonResult[tmpLink[0]][tmpLink[1]];
                                        newPath = setup['href_path'];

                                        $.each(setup['href_path_replace'], function (key, value) {
                                            newPath = newPath.replace('{{' + key + '}}', jsonResult['data'][index][value]);
                                        });

                                        alert_column = jsonResult['modifications'][columLocale]['alertColumn'];

                                        iconClass = 'icon-warning';
                                        if(jsonResult['modifications'][columLocale]['iconClass'] !== undefined){
                                            tempClass = jsonResult['modifications'][columLocale]['iconClass'][jsonResult['data'][index][jsonResult['modifications'][columLocale]['classColumn']]];
                                            iconClass = (tempClass !== undefined) ? tempClass : jsonResult['modifications'][columLocale]['iconClass']['default'];
                                        }

                                        logRow += "<a class=\"warn\" data-dropdown=\"droping" + index + "\" data-options=\"is_hover:true\"><i class=\"" + iconClass + "\"></i></a>\
                                                    <div id=\"droping" + index + "\" data-dropdown-content class=\"f-dropdown content small my-tooltip\">" + jsonResult["alert"][columLocale]["text"];


                                        if(jsonResult['modifications'][columLocale]['alertColumn'] !== undefined){
                                            logRow += ' ' + jsonResult['data'][index][jsonResult['modifications'][columLocale]['alertColumn']];
                                        }
                                        logRow +=  "<a href=\"" + newPath + "\"> " + jsonResult["alert"][columLocale]["link"] + "</a></div>";
                                    }
                                }

                                logRow += '<a href="' + myPath + '"';
                                if(jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]] === undefined){
                                    if('object' in jsonResult['fields'][columLocale]) {
                                        objectValue = jsonResult['data'][index][columLocale][jsonResult['fields'][columLocale]['object']];
                                    }else{
                                        objectValue = jsonResult['data'][index][columLocale];

                                    }
                                    if(columLocale == 'email'){
                                        logRow += ' title="' + objectValue + '">';
                                        if(objectValue.length > 39){
                                            objectValue = objectValue.substring(0,36) + '...';
                                        }
                                    }else{
                                        logRow += '>';
                                    }


                                    if (objectValue === undefined || objectValue == null ){ logRow += '-' } else {logRow += objectValue }
                                }else{
                                    logRow += jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]]['text'];
                                }
                                logRow += '</a>';
                            }
                            else if( (jsonResult['modifications'] !== null) && (jsonResult['modifications'][columLocale] !== undefined) && (jsonResult['modifications'][columLocale]['text'] !== undefined))
                            {
                                myPath = jsonResult['modifications'][columLocale]['text'];

                                if(columLocale == 'contact_name'){

                                    myfields = jsonResult['modifications'][columLocale]['text_replace'] + "";
                                    myfields = myfields.split(',');

                                    for (onefield in myfields){
                                        field_splited = myfields[onefield].split('.');

                                        newValue = jsonResult['data'][index];

                                        if(newValue.length != 0) {
                                            for (field in field_splited) {

                                                if(newValue[field_splited[field]]){
                                                    newValue = newValue[field_splited[field]];
                                                }else {
                                                    newValue = '-';
                                                }

                                            }
                                        }

                                        myPath = myPath.replace('{{' + onefield + '}}', (newValue) ? newValue : '-');
                                    }


                                }else{
                                    myPath = jsonResult['modifications'][columLocale]['text'];
                                    for(route in jsonResult['modifications'][columLocale]['text_replace']){
                                        myPath = myPath.replace('{{' + route + '}}', (jsonResult['data'][index][jsonResult['modifications'][columLocale]['text_replace'][route]]) ? jsonResult['data'][index][jsonResult['modifications'][columLocale]['text_replace'][route]] : '-');
                                    }
                                }

                                if(jsonResult['modifications'][columLocale]['hasAlert'] !== undefined){
                                    if($.inArray(columLocale,jsonResult['data'][index]['alert']) !== -1)
                                    {

                                        tmpLink = jsonResult["alert"][columLocale]["changeLink"].split('.');
                                        setup = jsonResult[tmpLink[0]][tmpLink[1]];
                                        newPath = setup['href_path'];

                                        $.each(setup['href_path_replace'], function (key, value) {
                                            newPath = newPath.replace('{{' + key + '}}', jsonResult['data'][index][value]);
                                        });

                                        alert_column = jsonResult['modifications'][columLocale]['alertColumn'];

                                        iconClass = 'icon-warning';
                                        if(jsonResult['modifications'][columLocale]['iconClass'] !== undefined){
                                            tempClass = jsonResult['modifications'][columLocale]['iconClass'][jsonResult['data'][index][jsonResult['modifications'][columLocale]['classColumn']]];
                                            iconClass = (tempClass !== undefined) ? tempClass : jsonResult['modifications'][columLocale]['iconClass']['default'];
                                        }

                                        logRow += "<a class=\"warn\" data-dropdown=\"droping" + index + "\" data-options=\"is_hover:true\"><i class=\"" + iconClass + "\"></i></a>\
                                                    <div id=\"droping" + index + "\" data-dropdown-content class=\"f-dropdown content small my-tooltip\">" + jsonResult["alert"][columLocale]["text"];


                                        if(jsonResult['modifications'][columLocale]['alertColumn'] !== undefined){
                                            logRow += ' ' + jsonResult['data'][index][jsonResult['modifications'][columLocale]['alertColumn']];
                                        }
                                        logRow +=  "<a href=\"" + newPath + "\"> " + jsonResult["alert"][columLocale]["link"] + "</a></div>";
                                    }
                                }

                                logRow += myPath;
                            }
                            else{
                                //Set text in column
                                if((jsonResult['data'][index][columLocale] == null || jsonResult['data'][index][columLocale] == '') && columLocale != 'status'){
                                    logRow += '-';
                                }else{
                                    if (typeof jsonResult['fields'][columLocale]['hasAlert'] !== undefined)
                                    {
                                        if($.inArray(columLocale,jsonResult['data'][index]['alert']) !== -1)
                                        {
                                            tmpLink = jsonResult["alert"][columLocale]["changeLink"].split('.');
                                            setup = jsonResult[tmpLink[0]][tmpLink[1]];
                                            newPath = setup['href_path'];

                                            $.each(setup['href_path_replace'], function (key, value) {
                                                newPath = newPath.replace('{{' + key + '}}', jsonResult['data'][index][value]);
                                            });

                                            iconClass = 'icon-warning';
                                            if(jsonResult['fields'][columLocale]['iconClass'] !== undefined){
                                                iconClass = jsonResult['fields'][columLocale]['iconClass'];
                                            }

                                            logRow += "<a class=\"warn\" data-dropdown=\"droping" + index + "\" data-options=\"is_hover:true\"><i class=\"" + iconClass + "\"></i></a>\
                                                    <div id=\"droping" + index + "\" data-dropdown-content class=\"f-dropdown content small my-tooltip\">\
                                                    "+jsonResult["alert"][columLocale]["text"]+
                                                "<a href=\"" + newPath + "\"> "+jsonResult["alert"][columLocale]["link"]+"</a>\
                                                    </div>";
                                        }
                                    }

                                    jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]] === undefined ? logRow += jsonResult['data'][index][columLocale]:logRow +=jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]]['text'];


                                }
                            }
                            logRow += '</span></div></div>';
                        }else{
                            //Set fields on large
                            if(jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]]['class'] !== undefined){
                                logRow += '<span class="' + jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]]['class'] + '">';
                            }else if ( jsonResult['fields'][columLocale]['default']['class'] !== undefined){
                                logRow += '<span class="' + jsonResult['fields'][columLocale]['default']['class'] + '">';
                            }else{
                                logRow += '<span class="' + columLocale + '">';
                            }

                            jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]]['text'] === undefined ? logRow += jsonResult['data'][index][columLocale] : logRow +=jsonResult['fields'][columLocale][jsonResult['data'][index][columLocale]]['text'];
                            logRow += '</span>';
                        }
                        logRow += '</div>';
                    }
                }
                //Populate info in columns end

                //Actions start
                actions = jsonResult['actions'];
                if(actions !== undefined){
                    logRow += '<div class="large-1 columns">';
                    logRow += '<div class="row" >';
                    logRow += '<div class="small-4 hide-for-large columns hide-for-large-up">';
                    logRow += '<span class="actions-label">'+ APP_LANG.RESP_TABLE_ACTIONS['actions'] + ':</span>';
                    logRow += '</div>';
                    logRow += '<div class="small-8 large-12 columns">';
                    logRow += '<div class="action-btn-group">';
                    logRow += '<div class="button-bar">';
                    logRow += '<ul class="button-group" >';
                    $.each(actions,function(key,setup){
                        if(setup.display === true) {


                            action_name = key;
                            myPath = setup['href_path'];
                            modal = '';
                            if ('exception' in setup) {
                                exceptions = setup['exception']['where'];
                                restrictionTable = [];
                                $.each(exceptions, function (key, exception) {
                                    $.each(exception, function (key, restrictions) {
                                        restrictionTable.push(restrictions == jsonResult['data'][index][key]);
                                    });
                                });
                                if ('and' in setup['exception']) {
                                    if (restrictionTable.indexOf(false) < 0) {
                                        logRow = addAction(logRow, setup, jsonResult, myPath, modal, action_name);
                                    }
                                } else {
                                    if (restrictionTable.indexOf(true) < 0) {
                                        logRow = addAction(logRow, setup, jsonResult, myPath, modal, action_name);
                                    }
                                }
                            } else {
                                logRow = addAction(logRow, setup, jsonResult, myPath, modal, action_name);
                            }
                        }
                    });
                    logRow += '</ul>';
                    logRow += '</div>';
                    logRow += '</div>';
                    logRow += '</div>';
                    logRow += '</div>';
                    logRow += '</div>';
                }
                //Actions end

                logRow += '</div>';
                logRow += '</div>';
                logRow += '</div>';
            }

            return logRow;
        }*/

        /**
         * Creates the actions foreach row.
         * Foreach action assign the server given css and js handlers.
         * @param logRow
         * @param setup
         * @param jsonResult
         * @param myPath
         * @param modal
         * @param action_name
         * @returns {*}
         */
        function addAction(logRow,setup,jsonResult,myPath,modal,action_name){
            $.each(setup['href_path_replace'], function (key, value) {
                myPath = myPath.replace('{{' + key + '}}', jsonResult['data'][index][value]);
            });
            modal = '';
            if ('modal' in setup) {
                modal = ' data-reveal-id="' + setup.modal_id + '"';
            }
            if(doEdit || action_name != 'manage') {
                logRow += '<li><a title="' + setup['locale'] + '" class="button ';
                if(action_name != 'default'){
                    logRow += action_name;
                }else{
                    logRow += 'default';
                    if(jsonResult.data[index].is_default){
                        logRow += ' active'
                    }

                    if('status' in jsonResult.data[index] && jsonResult.data[index].status < 1){
                        logRow += ' inactive'
                    }
                }
                logRow += '"';
                logRow += ' href="' + myPath + '"' + modal + '></a></li>';
            }
            return logRow;
        }

        /**
         * Fixes the height foreach cell in order the border to enclose it completely.
         * Finds the max height in each row and assignees it to the included cells.
         */
        function adjustColumnsHeights(table){
            if($('#logTable').length < 1) {
                if ($.windowSize() > 1024) {
                    table.find('.responsiveTableRow').each(function () {
                        var height = 0,
                            obj = $(this);

                        obj.find('.row:first > .columns').each(function () {
                            thisHeight = $(this).actual('height');

                            if (height < thisHeight)
                                height = thisHeight;
                        });

                        obj.find('.row:first > .columns').height(height).css({'visibility':'visible'});
                    });
                } else {
                    table.find('.responsiveTableRow').each(function () {
                        obj = $(this);
                        obj.find('.row:first > .columns').removeAttr('style');
                    });
                }
            }
        }

    /**
     *  Create responsive table END
     */


    /**
     *  Create and manage pagination START
     */

        /**
         * Reads the page count and creates the appropriate pagination links.
         * @param last_page
         * @param current_page
         */
        function createPaginationLinks(last_page, current_page, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            var lastArrow = table.find('.lastPagArrows'),
                moreRight = table.find('#moreRight');

            table.find('.morePages').addClass('hide-important');
            table.find('.partial_show').removeClass('partial_show');
            table.find('.inner').remove();

            if(last_page == 1){
                onePageTable(lastArrow, table);
            }else if(last_page < 9){
                allVisiblePages(last_page, moreRight, lastArrow, table);
            }else{
                hiddenPagesPaginator(last_page, moreRight, table);
            }

            table.find('.linksForCustomViews').removeClass('hide-important');
            setPaginationToPage(current_page);
        }

        /**
         * The table contains a page only.
         * Arrows are disabled all other pages are removed.
         * @param lastArrow
         */
        function onePageTable(lastArrow, table){
            lastArrow.addClass('unavailable');
            table.find('li:has(.endPage)').hide();
        }

        /**
         * The table contains less than 9 pages, all pages are visible and arrows are conditionally active.
         * @param last_page
         * @param moreRight
         * @param lastArrow
         */
        function allVisiblePages(last_page, moreRight, lastArrow, table){
            table.find('li:has(.endPage)').hide();

            createPagesInBetween(last_page, moreRight);
            lastArrow.removeClass('unavailable');
        }

        /**
         * The table contains 9 or more pages, the default visible pages are defined to "pagination_config" and arrows are conditionally active.
         * @param moreRight
         * @param last_page
         */
        function hiddenPagesPaginator(last_page , moreRight, table){
            table.find('.pagination').addClass('partial_show');
            moreRight.removeClass('hide-important');

            createPagesInBetween(pagination_config.view[$.getSizeClassification($.windowSize())], moreRight);
            var last_enum = table.find('.endPage');

            if(last_enum.length){
                last_enum.attr('data-page',last_page).text(last_page).closest('li').show();
            }else{
                moreRight.after('<li><a href="#" class="pageEnum endPage" data-page="' + last_page + '">' + last_page + '</a></li>');
            }
        }

        /**
         * Creates the pages between start and end.
         * @param last_page
         * @param moreRight
         */
        function createPagesInBetween(last_page, moreRight){
            var container = moreRight.closest('.pagination');

            for(var i = 2; i <= last_page; i++){
                if(container.find('[data-page="' + i + '"]').length < 1){
                    moreRight.before(returnPageItem(i));
                }

            }
        }

        /**
         * Reforms the pagination view when a page is clicked.
         * @param obj
         */
        function managePaginationView(obj, table) {
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            if(table.find('.partial_show').length < 1)
                return false;

            var current_cont = obj.closest('.inner'),
                current_page = parseInt(obj.attr('data-page')),
                last_page = parseInt(table.find('.pageEnum:last').attr('data-page')),
                size_classification = $.getSizeClassification($.windowSize()),
                visible_for_width = pagination_config.view[size_classification];

            table.find('.inner, .morePages').addClass('hide-important');

            if(current_page < visible_for_width){
                showAllStartingPages(visible_for_width, table);
                return;
            }

            var lesser_right_page = last_page - visible_for_width + 1;

            if(current_page > lesser_right_page){
                showAllEndingPages(last_page, lesser_right_page, table);
                return;
            }

            var show_for_width = pagination_config.show[size_classification],
                lower_limit = current_page - show_for_width,
                upper_limit = current_page + show_for_width;

            createPagesSurroundingCurrent(current_page, lower_limit, upper_limit, current_cont, table);
        }

        /**
         * Returns the paginator to it's initial state when one of the default pages is clicked. The last default page is excluded.
         * @param visible_for_width
         */
        function showAllStartingPages(visible_for_width, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            for(var i = 2; i <= visible_for_width; i++){
                table.find('.inner:has([data-page="' + i + '"])').removeClass('hide-important');
            }

            if(table.find('.pageEnum').length > 1)
                table.find('#moreRight').removeClass('hide-important');
        }

        /**
         * Transforms the paginator to it's latest form when one of it's last pages is clicked.
         * Those pages are defined by the range (end - pagination_config.view[page.width]) to end.
         * @param last_page
         * @param lesser_right_page
         */
        function showAllEndingPages(last_page, lesser_right_page, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            table.find('#moreLeft').removeClass('hide-important');
            table.find('#moreRight').addClass('hide-important');

            var current_page = table.find('.current a'),
                current_page_enum = current_page.attr('data-page'),
                current_cont = current_page.closest('li');


            if(current_page.is('.pageEnum:last'))
                beforeMoreRight = true;
            else
                beforeMoreRight = false;

            for(var i = lesser_right_page; i <= last_page - 1; i++){
                target = table.find('.inner:has([data-page="' + i + '"])');

                if(target.length){
                    target.removeClass('hide-important');
                }else{
                    if(beforeMoreRight){
                        table.find('#moreRight').before(returnPageItem(i));
                    }else{
                        var prev_page = table.find('.inner:has([data-page="' + (i - 1) + '"])');


                        if(i < current_page_enum){
                            current_cont.before(returnPageItem(i));
                        }else{
                            if(prev_page.length)
                                prev_page.closest('li').after(returnPageItem(i));
                            else
                                current_cont.after(returnPageItem(i));

                            current_cont = table.find('[data-page="' + i + '"]').closest('li');
                        }
                    }
                }
            }
        }

        /**
         * Clicking a page not included in "showAllStartingPages()" & "showAllEndingPages()" will hide all pages marked as inner and reveal/create pages around the clicked page.
         * The pages to be revealed/created are determined by  "pagination_config.show[page.width]".
         * @param current_page
         * @param lower_limit
         * @param upper_limit
         * @param current_cont
         */
        function createPagesSurroundingCurrent(current_page, lower_limit, upper_limit, current_cont, table){
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            table.find('.morePages').removeClass('hide-important');

            for(var i = lower_limit; i <= upper_limit; i++){
                target = table.find('.inner:has([data-page="' + i + '"])');

                if(target.length){
                    target.removeClass('hide-important');
                }else{
                    if(i < current_page){
                        next_page = table.find('[data-page="' + (i + 1) + '"]');
                        if(next_page.length){
                            next_page.closest('.inner').before(returnPageItem(i));
                        }else{
                            current_cont.before(returnPageItem(i));
                        }
                    }else{
                        prev_page = table.find('[data-page="' + (i - 1) + '"]');
                        if(prev_page.length){
                            prev_page.closest('.inner').after(returnPageItem(i));
                        }else{
                            current_cont.after(returnPageItem(i));
                        }
                    }
                }
            }
        }

        /**
         * Miscellaneous function to set the current page. No argument defaults to first page.
         */
        function setPaginationToPage(page, table){
            if(typeof table === 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            if(typeof page === 'undefined' || page == null){
                page = 1;
            }

            table.find(".pagination li.current").removeClass("current");
            table.find('.pageEnum[data-page="' + page + '"]').closest('li').addClass("current");
        }

        /**
         * Determines if the arrows should be active or inactive.
         * @param page
         */
        function fixArrows(page, table) {
            if(typeof table == 'undefined')
                table = $('.resp-table');

            table = table.closest('.my-table');

            var pages       = table.find('.pageEnum'),
                firstPage   = pages.filter(':eq(0)'),
                lastPage    = pages.filter(':eq(' + (pages.length - 1) + ')');

            page = table.find('.current a');

            if (page.is(lastPage) && page.is(firstPage)) {
                table.find('.firstPagArrows').addClass('unavailable');
                table.find('.lastPagArrows').addClass('unavailable');
            } else if (page.is(lastPage)) {
                table.find('.firstPagArrows').removeClass('unavailable');
                table.find('.lastPagArrows').addClass('unavailable');
            } else if (page.is(firstPage)) {
                table.find('.firstPagArrows').addClass('unavailable');
                table.find('.lastPagArrows').removeClass('unavailable');
            } else {
                table.find('.firstPagArrows').removeClass('unavailable');
                table.find('.lastPagArrows').removeClass('unavailable');
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

        /**
         * The arrow click is translated to a page click.
         * @param obj
         * @param pageTarget
         */
        function handleArrowClick(obj, pageTarget){
            var table = obj.closest('.my-table');

            if(obj.hasClass('firstGo')){
                table.find('.pageEnum[data-page="' + --pageTarget + '"]').click();
            }else{
                table.find('.pageEnum[data-page="' + ++pageTarget + '"]').click();
            }
            obj.blur();
        }

    /**
     *  Create and manage pagination END
     */


    /**
     *  AJAX Callback functions START
     */

        /**
         * Initiates tha responsive table.
         * Informs the paginator results label.
         * Creates the paginator link.
         * executes a function after the table creation, wherever the function is defined.
         * @param data
         * @param disable
         */
        function handleInitialRequest(data, disable, table){

            renderSortTableResult(data, disable, table);
            informShowingLabel(data, table);
            createPaginationLinks(data.last_page);
            informTableResults(data.total, table);
            setResponsiveTablesPreview(data, table);

            if (typeof onLoadRequestCallBack == 'function') {
                onLoadRequestCallBack(data);
            }

            if($('.responsiveTableRow').length)
                $('.noEntries').css('margin-top',0);
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
            createPaginationLinks(data.last_page, table);
            setPaginationToPage(null, table);
            informShowingLabel(data, table);
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
                fixArrows(tableCont.find('.current a'), table);
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
            fixArrows($myTable.find('.pageEnum:first'), table);
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
                    createPaginationLinks(data.last_page, 1, table);
                    fixArrows($myTable.find('.pageEnum:first'), table);
                    informShowingLabel(data, table);
                    $myTable.removeClass("hide-important");
                }
            }else{
                $.alertHandler('', APP_LANG.SOMETHING_GOES_WRONG, alert_box_warning);
            }

            informTableResults(data.total);
        }

        /**
         * Handle the set default request response
         * @param data
         * @param success_msg
         * @param error_code_list
         */
        function commonDefaultRequestHandler(data, error_code_list){
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
        function afterDeleteRequestCallback(data){
            renderSortTableResult(data, filters == '');
            createPaginationLinks(data.last_page, data.current_page);
            informShowingLabel(data);
            informTableResults(data.total);
        }

    /**
     *  AJAX Callback functions END
     */




    /**
     * Collect filters from search form and combine them to a string.
     */
    function getFilters(){
        filters = {};
        $('.search-fields input[type="text"]:not([name="_token"]):not(.chosen-container input)').each(function(){
            var value = $(this).val();
            if(value != ''){
                filters[$(this).attr('id')] = value;
            }
        });

        $('.search-fields select').each(function(){
            var value = $(this).val();
            if(typeof value == 'string' && $(this).val() != 'all'){
                filters[$(this).attr('name')] = value.trim();
            }
        });
        if($('#allRespTableAndOr [type="radio"]:checked').attr('id') == "oroperator"){
            filters['operator'] = 1;
        }

        $('.search-fields [type="checkbox"]:checked').each(function () {
            var obj = $(this);

            filters[obj.attr('name')] = true;
        });

        if(typeof persistentFilters != 'undefined' && persistentFilters.constructor == Object)
            $.extend(filters, persistentFilters);

        return filters;
    }

    function getFiltersForTable(tableName){
        if(typeof filters == 'undefined')
            var filters = {};

        filters[tableName] = {};

        var table = respoConf.init[tableName].table.closest('.pending_answer');
        
        table.find('.search-fields input[type="text"]:not([name="_token"]):not(.chosen-container input)').each(function(){
            var value = $(this).val();
            if(value != ''){
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
            if(typeof value == 'string' && $(this).val() != 'all'){
                filters[tableName][$(this).attr('name')] = value.trim();
            }
        });

        table.find('.search-fields [type="checkbox"]:checked').each(function(){
            var obj = $(this);

            filters[tableName][obj.attr('name')] = true;
        });

        if(table.find('#allRespTableAndOr [type="radio"]:checked').attr('class') == "oroperator"){
            filters[tableName]['operator'] = 1;
        }

        if('permanent_filter' in respoConf.init[tableName])
            $.extend(filters[tableName], respoConf.init[tableName].permanent_filter);

        return filters[tableName];
    }

    /**
     * Miscellaneous function to create the request url.
     * @param pageLengthValue
     * @param page
     * @param version
     * @param filters
     * @returns {string}
     */
    function createRequestURL(pageLengthValue, page, version, config){
        var url = '';

        if(typeof config != 'object')
            return urlPrefix + pageLengthValue + '/' + defaultSortingOrder + '/' + defaultSortingField + "?page=" + page + '&v=' + version;

        url += ('prefix' in config) ? config.prefix : urlPrefix;

        url += '/' + (('pagelength' in config) ? config.pagelength : pageLengthValue);

        if('sort' in config)
            url += '/' + config.sort.order + '/' + config.sort.field;
        else
            url += '/' + defaultSortingOrder + '/' + defaultSortingField;

        if('page' in config)
            url += '?page=' + config.page + '&v=' + version;
        else
            url += '?page=' + page + '&v=' + version;


        url = url.replace(/\/{2}/g, '/');

        return url;
    }

    /**
     * Activates the given sortable.
     * @param sortable
     */
    function activateSortable(sortable, table){
        if(typeof table == 'undefined')
            table = $('.resp-table');

        table = table.closest('.my-table');

        table.find('.sortTable.active').removeClass('active');
        sortable.addClass('active');
    }

    /**
     * Stringifies the predefined filters to use for the initial request.
     * @param activeFilters
     * @returns {string}
     */
    function setPredefinedFilters(activeFilters){
        $.each(activeFilters, function(key,filterCell){
            var target = $(filterCell['selector']);

            if (target.length) {
                if (target.is('input[type="radio"]')) {
                    if (filterCell['set_ui'][0] == 'checked' && filterCell['set_ui'][1] == true) {
                        target.prop({'checked': true});
                    }
                } else {
                    if (filterCell['set_ui'][0] == 'val') {
                        target.val(filterCell['set_ui'][1]);
                    }
                    if (target.is('select')) {
                        target.trigger("chosen:updated");
                    }
                }
            }
        });
    }

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
     * Gets the page's number and returns a page in html.
     * @param pagEnum
     * @returns {string}
     */
    function returnPageItem(pagEnum){
        return '<li class="inner"><a href="#" class="pageEnum" data-page="' + pagEnum + '">' + pagEnum + '</a></li>';
    }

    function clearFilters (form, clearFilters, clearShortCuts){
        form.find('input:not([type="hidden"])').val('');
        form.find('select').chosen_update('');
        form.find('[type="checkbox"]').prop('checked', false);

        if(typeof clearShortCuts == 'undefined' || clearShortCuts) {
            $('.shortcut_btn').removeClass('active');
            $('.shortcut_btn:first').addClass('active');
        }

        if(form.hasClass('responsive_table_search')){
            // Checks if there is a type selected for billing types in this table. If there is it sets it to the predefined option.

            if($('#billingProfilesForm').length) {
                type = $('#typeRespTable');
                if (type.length)
                    type.chosen_update(type.find('option:eq(1)').val());
            }

            form.find('#andoperator,.andoperator').click();

            var dateAfter = $('[name="dateAfterRespTable"]'),
                dateBefore = $('[name="dateBeforeRespTable"]');

            if(dateAfter.length && dateBefore.length){
                dateAfter.val('').change();
                dateBefore.val('').change();
            }

            if(typeof clearDates == 'function')
                clearDates();

            if(clearFilters){
                form.find('#search,.applyFilters').click();
            }
        }
    }

    /**
     * Open/Close responsive table`s search form.
     * @param obj
     * @param form_cont
     */
    function toggle_responsive_table_search (obj, form_cont) {
        var icon = obj.find('i');
        form_cont
            .css({'overflow':'hidden'})
            .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(e) {
                if(form_cont.hasClass('visible')) {
                    form_cont.css({'overflow': 'visible'});
                }

                if(icon.hasClass('icon-arrow-down22'))
                    obj.closest('div').removeClass('active');
            }).toggleClass('visible');

        icon.toggleClass('icon-arrow-down22 icon-arrow-up22');

        if(icon.hasClass('icon-arrow-up22')){
            obj.closest('div').addClass('active');
        }else if(typeof $filterDisplay != 'undefined' && $filterDisplay == true){
            $filterDisplay = false;

            $.ajax({
                'timeout'  : 30000,
                'url'   : '/sorttable/filters',
                'type'  : 'POST',
                'data'  : {
                    'name'      : urlPrefix.split('.')[1].replace('/',''),
                    '_token'    : $('[name="_token"]').val()
                }
            })
        }
    }

    function responsive_table_ajax_prototype_factory (properties) {
        properties.timeout              = 1800000;
        properties.presuccesscallback   = function (instance, data) {
            if(last_execution > instance.execution)
                throw 'old Request';

            $pending_csv = data;

            if(data.constructor == Object && 'total' in data) {
                if (data.total > 0) {
                    $('.headersRow, .my-table .footer').show();
                    $('.my-table').removeAttr('style');
                } else {
                    $('.noEntries').show();
                }
            }else{
                tablesErrorHandler();
            }
        };
        properties.error                = function () {
            tablesErrorHandler();
        };

        properties.execution = $.now();

        return new $.ajax_prototype(properties, null, {
            'beforeSend'    : function (instance) {
                last_execution = instance.execution;

                $('.resp-table').find('.responsiveTableRow').remove();
                $('.headersRow').after(table_inline_loader).hide();
                $('.my-table').css('border', 'none').find('.footer').hide();
                $('.noEntries').hide();
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
        properties.timeout              = 1800000;
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
                    current_table.closest('.content').find('.noEntries').show();
                }
            }else{
                preconfiguredTablesErrorHandler($('.resp-table.' + instance.table_name));
            }
        };
        properties.preerrorcallback     = function (instance) {
            if(last_execution > instance.execution)
                throw 'old Request';

            preconfiguredTablesErrorHandler($('.resp-table.' + instance.table_name));
        };
        properties.error                = function () {
            return ;
        };

        return new $.ajax_prototype(properties, null, {
            'beforeSend'    : function (instance) {
                var current_table   = $('.resp-table.' + instance.table_name),
                    table_cont      = current_table.closest('.content'),
                    pending_answer  = current_table.closest('.pending_answer');

                current_table.find('.responsiveTableRow').remove();
                current_table.find('.headersRow').after(table_inline_loader).hide();

                pending_answer.find('.noEntries').hide();
                pending_answer.find('.my-table').css('border', 'none').find('.footer').hide();
                pending_answer.find('.head').hide();
            },
            'complete'      : function (instance) {
                var working_table = $('.resp-table.' + instance.table_name);

                working_table.find('.responsiveTableRow:has(.loader-wrapper)').remove();
            }
        });
    }

    //This function handles the responses synchronously
    function newRowsAppend(data, table){
        var classRmv = 'even';

        if(typeof table == 'undefined')
            table = $('.resp-table');

        table.find('.responsiveTableRow').remove();

        var tableClass = table.attr('class').replace('resp-table ','');

        if(tableClass.length > 0 && typeof respoConf != 'undefined')
            var tableName = respoConf.init[findTableInConfig(tableClass)].name;

        if($rowtemp.length) {
            var to_append       = $rowtemp.html(),
                placeholders    = $rowPlaceholders,
                fields          = $rowField;
        }else{
            to_append       = respoConf.templates[tableName].rowTemp.html();
            placeholders    = respoConf.templates[tableName].rowPlaceholders;
            fields          = respoConf.templates[tableName].rowField;
        }

        var newAppending    = '';

        actionsDo       = new tableCallback('actionsDo');
        alerts          = new tableCallback('alerts');
        modificationsDo = new tableCallback('modificationsDo');

        $.each(data.data, function (key, value) {
            newAppending += to_append.replace(classRmv, '');
            classRmv = ((classRmv == 'even') ? 'odd' : 'even');
            for (i in placeholders) {
                if (placeholders.hasOwnProperty(i)) {
                    var property = placeholders[i],
                        txt = value[property.replace(/#/g, '')];

                    if((property.indexOf('date') > -1 || property.indexOf('created_at') > -1) && txt != null){

                        var fullDisplay = false,
                            fullDateDisplayGlobal = false,
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
                            if ('full-date' in txt) {
                                tmptxt = txt.display.split(' ');
                                fullDateDisplayGlobal = true;
                            }
                        }

                        if(fullDisplay){
                            if (window.location.host.indexOf('admin') == 0) {
                                newExecuteActionHandler({
                                    'target'    : ('.' + property.replace(/#/g,'')),
                                    'condition' : [
                                        'id=' + value['id']
                                    ],
                                    'perform'   : 'addClass',
                                    'class'     : 'admin-timezone'
                                });
                            }
                            tmptxt = tmptxt[0] + '<small>' + tmptxt[1].replace(/:[0-9]+$/,'') + '</small>';
                        }
                        else if(fullDateDisplayGlobal){
                            tmptxt = tmptxt[0] +' '+ tmptxt[1];
                        }
                        else{
                            tmptxt = tmptxt[0];
                        }

                        txt = tmptxt;
                    }


                    if(txt != null) {
                        if (property.indexOf('mail') > -1) {
                            newExecuteActionHandler({
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
                    newExecuteActionHandler($actions, value);
                }else{
                    newExecuteActionHandler($actions, value);
                }
            }

            if('actions' in value){
                var $actions = value.actions;

                if($actions.constructor == Object){
                    newExecuteActionHandler($actions, value);
                }else{
                    newExecuteActionHandler($actions, value);
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
                                                addClassModification(data.row, data.config);
                                            },{
                                                row     : obj,
                                                config  : $config
                                            });
                                            break;
                                        case 'linkToText':
                                            modificationsDo.add(function (data) {
                                                linkToText(data.row,alertName);
                                            },{
                                                row         : obj,
                                                alertName   : alertName
                                            });
                                            break;
                                        case 'protectFieldWarning':
                                            var protect = protectFieldWarning($config, div, foundDivs, foundAnchors);

                                            foundDivs       = protect[0];
                                            foundAnchors    = protect[1];
                                            break;
                                    }
                                });
                            }
                        }

                    });

                    obj.find('.f-dropdown:not(.id_dropdown):not(.date_dropdown)' + foundDivs + ':not(.el-promo .f-dropdown)').remove();
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

    function newExecuteActionHandler ($actions, data, lastRow) {
        if($actions.constructor == Array){
            $.each($actions, function (key, action) {
                newExecuteActionHandler (action, data, lastRow);
            });

            return ;
        }

        var $conditionsMet  = true,
            selector        = '';

        $.each($actions.condition, function (key, condition){
            var conditionSplit  = condition.split('='),
                conditionField  = conditionSplit[0],
                conditionValue  = conditionSplit[1];

            switch(conditionField){
                case 'id':
                    conditionField = 'data-id';
                    break;
            }

            selector += '[' + conditionField + '="' + conditionValue + '"] ';
        });

        selector = selector.trim();

        if($conditionsMet){
            switch($actions.perform){
                case 'remove'           : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.closest('li').remove();
                    },{
                        selector    : selector,
                        target      : $actions.target
                    });
                    break;
                }
                case 'addClass'         : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.addClass(data.class);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        'class'     : $actions.class
                    });
                    break;
                }
                case 'removeClass'      : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.removeClass(data.class);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        'class'     : $actions.class
                    });
                    break;
                }
                case 'setText'          : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length){
                            var submitText = target.find('.submitText');

                            if($.htmlLookUp($actions.text)){
                                if(submitText.length)
                                    submitText.html($actions.text);
                                else
                                    target.html($actions.text);
                            }else{
                                if(submitText.length)
                                    submitText.text($actions.text);
                                else
                                    target.text($actions.text);
                            }
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        text        : $actions.text
                    });
                    break;
                }
                case 'setHtml'          : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length){
                            var submitText = target.find('.submitText');

                            if(submitText.length)
                                submitText.html($actions.text);
                            else
                                target.html($actions.text);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        text        : $actions.text
                    });
                    break;
                }
                case 'appendText'       : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target),
                            text    = target.text() + data.text;

                        if (target.length) {
                            if ($.htmlLookUp(text))
                                target.html(text);
                            else
                                target.text(text);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        text        : $actions.text
                    });
                    break;
                }
                case 'addAttr'          : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.attr(data.attrName, data.attrValue);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        attrName    : $actions.attrName,
                        attrValue   : $actions.attrValue
                    });
                    break;
                }
                case 'changeHref'       : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.attr('href', data.attrValue);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        attrValue   : $actions.href
                    });
                    break;
                }
                case 'addIdProtect'     : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target),
                            template    = $(data.template).html();

                        if(target.length){
                            var idprotect = 'id_protect_' + obj.attr('data-id');

                            target.append(template);
                            target.find('.id_protect .id_icon').attr('data-dropdown', idprotect);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        template    : $actions.template
                    });
                    break;
                }
                case 'addElIcon'        : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target),
                            template    = $(data.template).html();

                        if(target.length){
                            target.append(template);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        template    : $actions.template
                    });
                    break;
                }
                case 'addContent'       : {
                    var parameters = {
                        selector    : selector,
                        target      : $actions.target,
                        template    : $actions.template
                    };

                    if('position' in $actions){
                        parameters.position = $actions.position;
                    }

                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target),
                            template    = $(data.template).html();

                        if(target.length){
                            if('position' in data){
                                if(data.position == 'before')
                                    target.prepend(template);
                                else
                                    target.append(template);
                            }else {
                                target.append(template);
                            }
                        }
                    },parameters);
                    break;
                }
                case 'removeElement'    : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target);

                        if(target.length)
                            target.remove();
                    },{
                        selector    : selector,
                        target      : $actions.target
                    });
                    break;
                }
                case 'fixDropDown'      : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target),
                            dropDown    = data.dropDown;


                        if(target.length){
                            target.find('[data-dropdown]').attr('data-dropdown', dropDown);
                            target.find('.f-dropdown').attr('id', dropDown);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        dropDown    : $actions.dropDown
                    });
                    break;
                }
                case 'createLink'       : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target);

                        if(target.length){
                            target.each(function () {
                                var obj = $(this);

                                obj.html('<a href="' + data.link + '">' + obj.text() + '</a>');
                            });
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        link        : $actions.link
                    });
                    break;
                }
                case 'linkToText'       : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target);

                        if(target.length){
                            target.each(function () {
                                var obj = $(this);

                                obj.text(obj.text().trim());
                            });
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target
                    });
                    break;
                }
            }
        }
    }

    function addClassModification(row, config){
        row.find(config.selector).addClass(config.class);
    }

    function linkToText(row, field){
        var $field = row.find('[data-attr="' + field + '"]');
        
        $field.text($field.find('a').text());
    }

    function findTableInConfig(name) {
        return $.grep(Object.keys(respoConf.init), function (a,b){
            return (respoConf.init[a].name == name);
        })
    }

    function protectFieldWarning ($config, div, foundDivs, foundAnchors) {
        var found = [foundDivs, foundAnchors];
        $.each(found, function (key, value) {
            var elements = value;

            elements = elements.replace(/^:/,'').split(':');
            elements.pop();

            if(elements.length)
                elements = ':' + elements.join(':');
            else
                elements = '';

            found[key] = elements;
        });

        if($config.length == 1 && div.length == 1){
            var divId = div.attr('id');

            found[0] += ':not([id="' + divId + '"])';
            found[1] += ':not([data-dropdown="' + divId + '"])';
        }else{
            $.each($config, function (key, value){
                var $protect    = value.replace('protect_', ''),
                    target      = div.filter('[id*="' + $protect + '"]');

                if(target.length){
                    divId = target.attr('id');
                    
                    found[0] += ':not([id="' + divId + '"])';
                    found[1] += ':not([data-dropdown="' + divId + '"])';
                }
            });
        }
        // $.each($config, function (key, value) {
        //
        // });

        // foundDivs += ':not([id="' + divId + '"])';
        // foundAnchors += ':not([data-dropdown="' + divId + '"])';

        return found;
    }


    function autoRenewSSL(domObj, disableLoaders){
        var jObj            = $(domObj),
            url             = jObj.attr('href').split('/'),
            id              = url[url.length - 2],
            activeElement   = $('#oldInfoYes');

        if(typeof disableLoaders == 'undefined')
            disableLoaders = false;

        activeElement.find('.submitText').hide();
        activeElement.find('.loading').show();

        sslRenew = new $.ajax_prototype({
            type        : 'POST',
            data        : {
                '_token'            : $('[name="_token"]').val(),
                'unique_id'         : unique_page_identifier,
                'sku'               : jObj.attr('data-product-sku'),
                'action'            : 'renew',
                'auto_enroll'       : true
            },
            beforeSend  : function () {
                defaultBeforeSendAjaxAction(null, disableLoaders);
            },
            success     : function (data) {
                if(data.success){
                    $('#renew_ssl').modal_close();

                    jObj.addClass('in-cart').attr('data-cart-item-id', data.data.id).find('.submitText').text(COMMON_LANG.CART.IN_CART);

                    $.cart.insert(data.data.id, data.data.name, data.data.sub_name, data.data.total_price);
                }else{
                    $.cart.errorHandler(data);
                }
            },
            complete    : function () {
                activeElement.find('.submitText').show();
                activeElement.find('.loading').hide();
                jObj.find('.submitText').show();
                jObj.find('.loading').hide();
                activeElement.blur();
            }
        });

        sslRenew.url            = '/ssl-certificates/' + id + '/extend';
        // sslRenew.active_element = id;

        $.ajax(sslRenew);
    }

    function tableFunction (callback,properties) {
        return {
            'callback'     : callback,
            'properties'   : properties
        };
    }

    function tableCallback (callbackName) {
        var list = [],
            name = callbackName;

        this.add = function (callback,properties) {
            if(typeof callback == 'object'){
                if((callback.__proto__.constructor.toString()).indexOf(tableCallback) > -1){
                    list.push(new tableFunction(callback,'tableCallback'));

                    return;
                }
            }

            if(typeof callback == 'function')
                list.push(new tableFunction(callback,properties));
        };

        this.fire = function () {
            for(i in list){
                if(list[i].properties == 'tableCallback'){
                    list[i].callback.fire();
                }else if(list.hasOwnProperty(i) && 'callback' in list[i] && typeof list[i].callback == 'function' && typeof list[i].properties == 'object'){
                    list[i].callback(list[i].properties);
                }
            }
        };

        this.pending = function () {
            return list.length > 0;
        };

        this.getList = function () {
            return list;
        };
    }

    function sendShortcutRequest (obj) {
        $('.shortcut_btn').removeClass('active');
        $('.shortcut_btn:not(.inactive)').closest('div').removeClass('hide-important').show();

        obj.addClass('active').closest('div').hide();

        clearFilters($('.responsive_table_search'), false, false);

        shortcut = responsive_table_ajax_prototype_factory ({
            type        : 'POST',
            success     : function (data) {
                commonSearchResultHandler(data)
            }
        });

        shortcut.url = createRequestURL(pageLengthValue, 1, $.now());
        shortcut.data = {'_token': $('[name="_token"]').val()};

        shortcutName = obj.attr('data-shortcut');

        if(typeof shortcutName != 'undefined')
            shortcut.data.shortcut = shortcutName;

        if(typeof persistentFilters != 'undefined')
            $.extend(shortcut.data, persistentFilters);

        $.ajax(shortcut);

        old_filters = getFilters();
    }

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

    function removeCartItemFromTable (obj) {
        obj.removeClass('in-cart').removeAttr('data-cart-item-id').text(COMMON_LANG.CART.BUY_SERVICE);
    }
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

function setupDateHandlers (dateAfter, dateBefore) {
    var yearRange = '1940:' + (new Date().getFullYear() + 10);

    dateAfter.datepicker({
        dateFormat          : 'dd/mm/yy',
        showOtherMonths     : true,
        selectOtherMonths   : true,
        showButtonPanel     : true,
        showAnim            : 'slideDown',
        changeMonth         : true,
        changeYear          : true,
        yearRange           : yearRange,
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

    dateBefore.datepicker({
        dateFormat          : 'dd/mm/yy',
        showOtherMonths     : true,
        selectOtherMonths   : true,
        showButtonPanel     : true,
        showAnim            : 'slideDown',
        changeMonth         : true,
        changeYear          : true,
        yearRange           : yearRange,
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

    dateAfter.on('change', function () {
        var $date = $(this).val().split('/');

        dateBefore.datepicker('option', 'minDate', new Date($date[2] + '/' + $date[1] + '/' + $date[0]));
    });

    dateBefore.on('change', function () {
        var $date = $(this).val().split('/');

        dateAfter.datepicker('option', 'maxDate', new Date($date[2] + '/' + $date[1] + '/' + $date[0]));
    });
}