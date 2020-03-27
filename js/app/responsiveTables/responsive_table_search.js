$(document).ready(function () {
    var extendable = {
        search  : {
            getFilters                  : getFilters,
            clearFilters                : clearFilters,
            activateSortable            : activateSortable,
            setPredefinedFilters        : setPredefinedFilters,
            toggleResponsiveTableSearch : toggle_responsive_table_search
        }
    };

    if ('responsiveTables' in $)
        $.extend($.responsiveTables, extendable);
    else
        $.extend({'responsiveTables' : extendable});

    $.responsiveTables.filters = {};

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

    $('#toggle-responsive-table-search:not(.configured_table #toggle-responsive-table-search)').on('click',function(e){
        e.preventDefault();
        toggle_responsive_table_search ($(this), $('.form-search .form_cont'))
    });

    /*$('#expires_show').on('click', function () {
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
    });*/

    var dateAfter = $('#dateAfterRespTable:not(.configured_table #dateAfterRespTable),#exDateAfterRespTable:not(.configured_table #exDateAfterRespTable)'),
        dateBefore = $('#dateBeforeRespTable:not(.configured_table #dateBeforeRespTable),#exDateBeforeRespTable:not(.configured_table #exDateBeforeRespTable)');

    if(dateAfter.length && dateBefore.length){

        setupDateHandlers (dateAfter, dateBefore);

        var updateAfter     = $('#updatedAfterRespTable'),
            updateBefore    = $('#updatedBeforeRespTable');

        if(updateAfter.length && updateBefore.length){
            setupDateHandlers (updateAfter, updateBefore);
        }
    }

    $(document)
        .on('click', '.responsive_table_search #search:not(.configured_table #search)', function (e) {
            e.preventDefault();
            performFilterSearch();
        })
        .on('click', '.sortTable:not(.active):not(.configured_table .sortTable)', function(e){
            e.preventDefault();
            $.responsiveTables.db.onClickSortingArrows($(this));
        })
        .on('click', '.clear-filters:not(.configured_table .clear-filters)', function(e){
            e.preventDefault();

            clearFilters($(this).closest('form'), true);
        })
        .on('click', '.shortcut_btn:not(.active)', function () {
            var obj = $(this);

            $.responsiveTables.db.sendShortcutRequest(obj)
        });

    function getFilters(){
        var filters = {};

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

        if(typeof persistentFilters != 'undefined')
            $.extend(filters, persistentFilters);

        $.responsiveTables.filters = filters;

        return filters;
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

    /*Table search module START*/
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
            }else if(typeof $.responsiveTables.filterDisplay != 'undefined' && $.responsiveTables.filterDisplay == true){
                $.responsiveTables.filterDisplay = false;

                $.ajax({
                    'timeout'  : 30000,
                    'url'   : '/sorttable/filters',
                    'type'  : 'POST',
                    'data'  : {
                        'name'      : $.responsiveTables.defaultConfiguration.urlPrefix.split('.')[1].replace('/',''),
                        '_token'    : $('[name="_token"]').val()
                    }
                })
            }
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

                if (clearFilters) {
                    form.find('#search,.applyFilters').click();
                }
            }
        }

        function performFilterSearch () {
            $previousActiveShortcut = false;

            if($('.shortcut_btn.active').length) {
                $('.shortcut_btn:not(.inactive)').closest('div').show();
                $('.shortcut_btn:first').addClass('active').closest('div').hide();

                $('.shortcut_btn').removeClass('active');

                $previousActiveShortcut = true;
            }

            old_filters = $.responsiveTables.filters;
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


            $.responsiveTables.db.searchRequest(new_filters);
        }
    /*Table search module END*/

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

    /**
     * Stringifies the predefined filters to use for the initial request.
     * @param activeFilters
     * @returns {string}
     */
    function setPredefinedFilters(activeFilters){
        $.each(activeFilters, function(key,filterCell){
            var target = $(filterCell['selector']);
            if(target.is('input[type="radio"]')){
                if(filterCell['set_ui'][0] == 'checked' && filterCell['set_ui'][1] == true)
                    target.prop({'checked' : true});
            }else{
                if(filterCell['set_ui'][0] == 'val')
                    target.val(filterCell['set_ui'][1]);

                if(target.is('select'))
                    target.trigger("chosen:updated");
            }
        });
    }
});

$(window).on('load', function () {

});