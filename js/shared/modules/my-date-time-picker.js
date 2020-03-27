$(document).ready(function () {
    (function () {
        var calendar_template           = '<div class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" data-target="##target##" style="z-index: 100">\n' +
            '            <div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all"><a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click" title="Prev"><span class="ui-icon ui-icon-circle-triangle-w"></span></a><a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="Next"><span class="ui-icon ui-icon-circle-triangle-e"></span></a>\n' +
            '                <div class="ui-datepicker-title"><select class="ui-datepicker-month">##months##</select><select class="ui-datepicker-year">##years##</select></div>' +
            '            </div>\n' +
            '            <table class="ui-datepicker-calendar" ##tableStyle##><thead><tr>##dates##</tr></thead><tbody>##weeks##</tbody></table>' +
            '##timePanel####bottomFuncs##' +
            '        </div>',
            dates_template              = '<th scope="col"><span title="##dateTitle##">##date##</span></th>',
            week_template               = '<tr>##days##</tr>',
            day_template                = '<td class="##day_classes##" data-handler="selectDay" data-event="click" data-day="##day##" data-month="##month##" data-year="##year##"><a class="ui-state-default ##day_link_classes##" href="#">##day##</a></td>',
            bottom_functions_template   = '<div class="ui-datepicker-buttonpane ui-widget-content">##functions##</div>',
            button_template             = '<button type="button" class="left ui-state-default ui-priority-secondary ##classes##">##text##</button>',
            times_template              = '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all">\n' +
                '<div class="ui-datepicker-title" style="margin:0;"><select class="ui-datepicker-hours width-33">##hours##</select><select class="ui-datepicker-minutes width-33">##minutes##</select><select class="ui-datepicker-seconds width-33">##seconds##</select></div></div>',
            months                      = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            dates                       = {
                'Sunday'    : 'Su',
                'Monday'    : 'Mo',
                'Tuesday'   : 'Tu',
                'Wednesday' : 'We',
                'Thursday'  : 'Th',
                'Friday'    : 'Fr',
                'Saturday'  : 'Sa'
            },
            month                       = function () {
                return [1,28]
            },
            selections_enabled          = false,
            shortcuts_lexicon           = {
                timeFrames : ['today','tomorrow','week','quarter'],
                specificTimes : ['same_hour','midnight','midday'],
                multipliers : ['two'],
                orders : ['first','second','third','forth']
            },
            format_lexicon              = [
                'dd', //Digit days with leading zero,
                'mm', //Digit month with leading zero,
                'yyyy', //Four digit year,
                'hh', //24 hours with leading zero,
                'ii', //Minutes with leading zero,
                'ss', //Seconds with leading zero,
            ];

        datePairs = {};

        $.fn.extend({
            my_dateTimePicker : function (action, properties) {
                return my_dateTimePicker($(this), action, properties);
            }
        });

        $.extend({
            my_dateTimePicker : function (target, action, properties) {
                return my_dateTimePicker(target, action, properties);
            }
        });

        $(document)
            .on('mouseenter', '.ui-datepicker td a', function (e) {
                $(this).addClass('ui-state-hover')
            })
            .on('mouseleave', '.ui-datepicker td a', function (e) {
                $(this).removeClass('ui-state-hover')
            })
            .on('click', '.ui-datepicker td a', function (e) {
                e.preventDefault();

                getDate($(this));
            })
            .on('click', '.ui-datepicker-prev, .ui-datepicker-next', function (e) {
                e.preventDefault();

                var obj = $(this),
                    picker = obj.closest('.ui-datepicker'),
                    month_select = picker.find('.ui-datepicker-month:first'),
                    month = month_select.val(),
                    year_select = picker.find('.ui-datepicker-year:first'),
                    year = year_select.val(),
                    pair = datePairs[picker.attr('data-target')],
                    date = new Date();

                if (obj.hasClass('ui-datepicker-prev'))
                    --month;
                else
                    ++month;

                if (month < 0) {
                    month = 11;
                    --year;
                } else if (month > 11) {
                    month = 0;
                    ++year;
                }

                year_select.val(year);

                fixMonthsOnYearChange(year_select, pair, picker);

                picker.attr('data-previous-year', year);

                month_select.val(month);

                date.setMonth(month);
                date.setFullYear(year);
                
                picker.find('tbody').html(generateWeeks(date, pair));
                previousNextButtonVisibilityHandler(picker);

                if (obj.hasClass('ui-datepicker-next')) {
                    if (month_select.find('option:selected').is(':last') && year_select.find('option:selected').is(':last')) {
                        var nextYear = year_select.val() + 1;
                        year_select.append('<option value="' + nextYear +'">' + nextYear + '</option>');
                    }
                } else {
                    if (month_select.find('option:selected').is(':first') && year_select.find('option:selected').is(':first')) {
                        var previousYear = year_select.val() - 1;
                        year_select.prepend('<option value="' + previousYear +'">' + previousYear + '</option>');
                    }
                }
            })
            .on('click', '.today-button', function (e) {
                e.preventDefault();
                var obj = $(this),
                    picker = obj.closest('.ui-datepicker'),
                    pair = datePairs[picker.attr('data-target')],
                    date = new Date();

                picker.find('.ui-datepicker-month:first').val(date.getMonth());
                picker.find('.ui-datepicker-year:first').val(date.getFullYear());

                pair.date = date;

                picker.find('tbody').html(generateWeeks(date, pair));
                previousNextButtonVisibilityHandler(picker);

                setDateToInput(picker);
            })
            .on('click', '.now-button', function (e) {
                e.preventDefault();
                var obj = $(this),
                    picker = obj.closest('.ui-datepicker'),
                    pair = datePairs[picker.attr('data-target')],
                    date = new Date();

                picker.find('.ui-datepicker-month:first').val(date.getMonth());
                picker.find('.ui-datepicker-year:first').val(date.getFullYear());
                picker.find('.ui-datepicker-hours').val(date.getHours());
                picker.find('.ui-datepicker-minutes').val(date.getMinutes());
                picker.find('.ui-datepicker-seconds').val(date.getSeconds());

                pair.date = date;

                picker.find('tbody').html(generateWeeks(date, pair));
                previousNextButtonVisibilityHandler(picker);

                setDateToInput(picker);
            })
            .on('change', '.ui-datepicker-month, .ui-datepicker-year', function () {
                var obj = $(this),
                    picker = obj.closest('.ui-datepicker'),
                    date = new Date();

                date.setMonth(picker.find('.ui-datepicker-month').val());
                date.setFullYear(picker.find('.ui-datepicker-year').val());

                picker.find('tbody').html(generateWeeks(date, datePairs[picker.attr('data-target')]));
                previousNextButtonVisibilityHandler(picker);

                if (obj.hasClass('ui-datepicker-year')) {
                    var pair = datePairs[picker.attr('data-target')];

                    fixMonthsOnYearChange(obj, pair, picker);
                }
            })
            .on('change', '.shortcuts', function () {
                handleShortcutSelection($(this));
            });

        function my_dateTimePicker (target, action, properties) {
            if (typeof action == 'string') {
                switch (action) {
                    case 'has-mirror':
                        return hasMirror(target);
                        break;
                    case 'mirror':
                        if (typeof properties != 'object')
                            throw 'Undefined properties for action mirror';

                        if (! ('to' in properties))
                            throw 'Undefined property "to" for action mirror';

                        handleMirrors(target, properties);

                        break;
                }
            } else {
                if (typeof action != 'object')
                    throw 'Invalid properties given';

                if (! ('date' in action) || action.date.__proto__.constructor != Date)
                    action.date = new Date();

                createDateTime(target, action);
            }

            return target;
        }

        function createDateTime (target, properties) {
            if (typeof target == 'undefined')
                throw 'Could not find form element';

            if (typeof target.attr('name') == 'undefined')
                throw 'Please name your input';

            target.after(
                calendar_template
                    .replace(/##target##/, target.attr('name').trim())
                    .replace(/##months##/, function () {
                        return generateMonthsOptions(properties.date)
                    })
                    .replace(/##years##/, function () {
                        return generateYearsOptions(properties.date)
                    })
                    .replace(/##tableStyle##/g, function () {
                        return getTableStyle(properties);
                    })
                    .replace(/##dates##/, generateDateHeaders)
                    .replace(/##weeks##/, function () {
                        return generateWeeks(properties.date)
                    })
                    .replace(/##timePanel##/, function () {
                        return generateTimePanel(properties);
                    })
                    .replace(/##bottomFuncs##/, function () {
                        return createBottomFunctionsContainer(properties);
                    })
            );

            var currentPicker = $('.ui-datepicker:last'),
                data = {
                    picker: currentPicker,
                    date: null,
                    withTime: ('with_time' in properties),
                    format:null
                };

            if ('mirror' in properties) {
                if (typeof properties.mirror == 'object' && 'to' in properties.mirror) {
                    $(window).ready(function () {
                        handleMirrors(target, properties['mirror']);
                    })
                }
            }

            if ('before' in properties)
                data.before = $(properties.before);

            if ('after' in properties)
                data.after = $(properties.after);

            if (! ('format' in properties))
                data.format = 'dd/mm/yyyy hh:ii:ss';

            datePairs[target.attr('name')] = data;

            target
                .on('click', function () {
                    openPicker (target)
                })
                .on('change', function () {
                    var pair = datePairs[target.attr('name')],
                        value = target.val().trim();

                    if (value) {
                        var formatStructure = decomposeFormat(pair.format);

                        value = value.split(' ');

                        if (value.length < formatStructure.length) {
                            for (var i = value.length; i < formatStructure.length; i++) {
                                var tmp = [];

                                for (var j in formatStructure[i].structure) {
                                    if (formatStructure[i].structure.hasOwnProperty(j)) {
                                        switch (formatStructure[i].structure[j]) {
                                            case "hh":
                                            case "ii":
                                            case "ss":
                                                tmp.push('00');
                                        }
                                    }
                                }

                                value.push(tmp.join(formatStructure[i].separator));
                            }
                        }

                        if (value.length == formatStructure.length) {
                            analyzeDateInput(pair, value, formatStructure);
                            restructureDate(pair, formatStructure);
                            setDateToSibling(pair);
                        }
                    } else {
                        pair.date = null;
                    }

                    $(this).trigger('date:updated');
                })
                .on('focusin', function () {
                    $('.ui-datepicker').hide();
                    openPicker(target);
                });

            $(document).on('click', function (e) {
                if (datePairs[target.attr('name')].picker.css('display') != 'none') {
                    if (! (target.is(e.target) || datePairs[target.attr('name')].picker.is(e.target) || datePairs[target.attr('name')].picker.has(e.target).length > 0))
                        datePairs[target.attr('name')].picker.hide();
                }
            });
        }

        function generateMonthsOptions (currentDate) {
            var tmp = '';

            for (var i in months) {
                if (months.hasOwnProperty(i))
                    tmp += '<option value="' + i + '" ' + (currentDate.getMonth() == i ? 'selected' : '') + '>' + months[i] + '</option>';
            }

            return tmp;
        }

        function generateYearsOptions (currentDate) {
            var tmp = '';

            for (var i = (currentDate.getFullYear() - 10); i <= (currentDate.getFullYear() + 10); i++) {
                tmp += '<option value="' + i + '" ' + (currentDate.getFullYear() == i ? 'selected' : '') + '>' + i + '</option>';
            }

            return tmp;
        }

        function getTableStyle (properties) {
            var tmp = {};

            if ('with_time' in properties)
                tmp.margin = 0;

            if ($.isEmptyObject(tmp))
                return '';
            else
                return 'style="' + JSON.stringify(tmp).replace(/,"/g,';').replace(/":/g,':').replace(/{"|}/g,'') + '"';
        }

        function generateDateHeaders () {
            var tmp = '';

            for (var i in dates) {
                if (dates.hasOwnProperty(i)) {
                    tmp += dates_template.replace('##dateTitle##', i).replace('##date##', dates[i]);
                }
            }

            return tmp;
        }

        function generateWeeks (currentDate, target) {
            var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
                currentMonth = new month,
                index = 0,
                tmp = [];

            var selected = false,
                targetDate = null;

            var disabledDirection = [];

            if (typeof target != 'undefined') {
                if (target.date != null) {
                    selected = currentDate.getFullYear() == target.date.getFullYear() && currentDate.getMonth() == target.date.getMonth();
                    targetDate = target.date.getDate();
                }

                if ('before_date' in target && typeof target.before_date.getTime == 'function')
                    disabledDirection.push('before_date');

                if ('after_date' in target && typeof target.after_date.getTime == 'function')
                    disabledDirection.push('after_date');
            }

            currentMonth[1] = lastDay.getDate();

            if (firstDay.getDay() > 0) {
                var lastMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

                currentMonth[0] = - firstDay.getDay() + 1;
            }

            var currentMonthNum = currentDate.getMonth();

            for (var i = currentMonth[0]; i <= (currentMonth[1] + (6*7 - currentMonth[1])); i++) {
                if (i < 1 && lastMonthLastDay) {
                    tmp[index] = {
                        month: 'last',
                        month_num: currentMonthNum - 1,
                        year: ((currentMonthNum == 0) ? 'last' : 'current'),
                        selected: false,
                        today: false,
                        disabled: false,
                        date : lastMonthLastDay.getDate() + i
                    };
                } else if (i <= currentMonth[1]) {
                    tmp[index] = {
                        month: 'current',
                        month_num: currentMonthNum,
                        year: 'current',
                        selected: (selected && targetDate == i),
                        today: ((currentDate.getDate() == i && (typeof target == 'undefined' || target.date == null)) || (typeof target != 'undefined' && selected == false && targetDate == i)),
                        disabled: false,
                        date : i
                    };
                } else {
                    tmp[index] = {
                        month: 'next',
                        month_num: currentMonthNum + 1,
                        year: ((currentMonthNum == 11) ? 'next' : 'current'),
                        selected: false,
                        today: false,
                        disabled: false,
                        date : i - currentMonth[1]
                    };
                }

                for (var direction in disabledDirection) {
                    if (disabledDirection.hasOwnProperty(direction) && tmp[index].disabled === false) {
                        var testDate = new Date(target[disabledDirection[direction]]),
                            monthToChange = tmp[index].month_num,
                            yearToChange = currentDate.getFullYear();

                        if (monthToChange < 0) {
                            monthToChange = 11;
                            yearToChange--;
                        } else if (monthToChange > 11) {
                            monthToChange = 0;
                            yearToChange++;
                        }

                        testDate.setDate(tmp[index].date);
                        testDate.setMonth(monthToChange);
                        testDate.setFullYear(yearToChange);

                        if (disabledDirection[direction] == 'before_date') {
                            if (testDate.getTime() < target[disabledDirection[direction]].getTime())
                                tmp[index].disabled = true;
                        } else {
                            if (testDate.getTime() > target[disabledDirection[direction]].getTime())
                                tmp[index].disabled = true;
                        }
                    }
                }

                index++;
            }

            currentMonth = tmp;

            tmp = '';

            for (var i = 0; i < 6; i++) {
                tmp += week_template
                    .replace(/##days##/, function () {
                        var index, tmp = '';

                        for (var j = 0; j < 7; j++) {
                            index = (i+j+ ((i) ? i*6 : 0));

                            var day_classes = '',
                                day_link_classes = '';

                            if (currentMonth[index].month != 'current') {
                                day_classes += ' ui-datepicker-other-month';
                                day_link_classes += ' ui-priority-secondary';
                            }

                            if (currentMonth[index].disabled)
                                day_classes += ' ui-datepicker-unselectable ui-state-disabled';

                            if (currentMonth[index].today && currentMonth[index].disabled === false)
                                day_link_classes += ' ui-state-highlight';

                            if (currentMonth[index].selected)
                                day_link_classes += ' ui-state-active';

                            tmp += day_template
                                .replace(/##day##/g,currentMonth[index].date)
                                .replace(/##day_classes##/, day_classes.trim())
                                .replace(/##day_link_classes##/, day_link_classes.trim())
                                .replace(/##month##/, function () {
                                    var month = currentDate.getMonth();

                                    switch (currentMonth[index].month) {
                                        case 'last':
                                            month -= 1;
                                            break;
                                        case 'next':
                                            month += 1;
                                            break;
                                    }

                                    if (month < 0)
                                        month = 11;
                                    else if (month > 11)
                                        month  = 0;

                                    return month;
                                })
                                .replace(/##year##/, function () {
                                    var year = parseInt(currentDate.getFullYear());

                                    switch (currentMonth[index].year) {
                                        case 'last':
                                            year -= 1;
                                            break;
                                        case 'next':
                                            year += 1;
                                            break;
                                    }

                                    return year;
                                });
                        }

                        return tmp
                    });
            }

            return tmp;
        }

        function generateTimePanel (properties) {
            if (! ('with_time' in properties))
                return '';

            return times_template
                .replace(/##hours##/, function () {
                    return generateHoursOptions(properties.date);
                })
                .replace(/##minutes##/, function () {
                    return generateMinutesOptions(properties.date);
                })
                .replace(/##seconds##/, function () {
                    return generateSecondsOptions(properties.date);
                });
        }

        function generateHoursOptions (currentDate) {
            var current = currentDate.getHours(),
                tmp = '';

            for (var i = 0; i < 24; i++) {
                tmp += '<option value="' + i + '" ' + ((i == current) ? 'selected' : '') + '>' + ((i < 10) ? 0 : '') + i + '</option>';
            }

            return tmp;
        }
        function generateMinutesOptions (currentDate) {
            var current = currentDate.getMinutes(),
                tmp = '';

            for (var i = 0; i < 60; i++) {
                tmp += '<option value="' + i + '" ' + ((i == current) ? 'selected' : '') + '>' + ((i < 10) ? 0 : '') + i + '</option>';
            }

            return tmp;
        }
        function generateSecondsOptions (currentDate) {
            var current = currentDate.getSeconds(),
                tmp = '';

            for (var i = 0; i < 60; i++) {
                tmp += '<option value="' + i + '" ' + ((i == current) ? 'selected' : '') + '>' + ((i < 10) ? 0 : '') + i + '</option>';
            }

            return tmp;
        }

        function createBottomFunctionsContainer (properties) {
            if (! ('buttons' in properties)) {
                if ('selections' in properties)
                    return createSelections(properties);
                else
                    return '';
            }

            return bottom_functions_template.replace(/##functions##/g, function () {
                var tmp = '';

                for (var i in properties.buttons) {
                    if (properties.buttons.hasOwnProperty(i))
                        tmp += createButton(properties.buttons[i]);
                }

                if ('selections' in properties)
                    tmp += createSelections(properties);

                return tmp;
            })
        }

        function createButton (properties) {
            if (! ('classes' in properties)) {
                console.error('Property classes is missing');
                return '';
            }

            if (! ('text' in properties)) {
                console.error('Property text is missing');
                return '';
            }

            if (! ('callback' in properties)) {
                console.error('Property callback is missing');
                return '';
            }

            return button_template.replace(/##classes##/g, properties.classes).replace(/##text##/g, properties.text);
        }

        function createSelections (properties) {
            if (selections_enabled === false)
                return '';

            var selections = '<select class="shortcuts"><option value="" disabled selected>Time presets</option>';

            for (var i in properties.selections) {
                if (properties.selections.hasOwnProperty(i)) {
                    selections += '<option value="' + properties.selections[i].toLowerCase().replace(/\s+/g,' ').replace(/\s/g,'_') + '">' + properties.selections[i] + '</option>';
                }
            }

            selections += '</select>';

            return selections;
        }

        function getDate (obj) {
            var container = obj.closest('td'),
                picker = container.closest('.ui-datepicker'),
                pair = datePairs[picker.attr('data-target')],
                date;

            picker.find('.ui-state-highlight').removeClass('ui-state-highlight');
            picker.find('.ui-state-active').removeClass('ui-state-active');
            obj.addClass('ui-state-active');


            if (pair.withTime)
                date = new Date(container.attr('data-year'), container.attr('data-month'), container.attr('data-day'), picker.find('.ui-datepicker-hours').val(), picker.find('.ui-datepicker-minutes').val(), picker.find('.ui-datepicker-seconds').val());
            else
                date = new Date(container.attr('data-year'),container.attr('data-month'),container.attr('data-day'),0,0,0);

            pair['date'] = date;

            setDateToInput(picker);
        }

        function setDateToInput (picker) {
            var target = picker.attr('data-target'),
                pair = datePairs[target],
                date = pair.date;

            if (('before_date' in pair && typeof pair.before_date.getTime == 'function') || ('after_date' in pair && typeof pair.after_date.getTime == 'function')) {
                var currentIndex = (('before_date' in pair && typeof pair.before_date.getTime == 'function') ? 'before_date' : 'after_date'),
                    constraintDate = pair[currentIndex];
                
                if ((currentIndex == 'before_date' && date < constraintDate) || (currentIndex == 'after_date' && date > constraintDate))
                    date = constraintDate;

                pair.date = date;
            }

            target = $('[name="' + target + '"]');

            restructureDate(pair);

            target.trigger('date:updated');

            setDateToSibling(pair);

            picker.hide();
        }

        function setDateToSibling (pair) {
            var dateTargets = [];

            if ('before' in pair && typeof pair.before.selector == 'string')
                dateTargets.push('before');

            if ('after' in pair && typeof pair.after.selector == 'string')
                dateTargets.push('after');

            for (var i in dateTargets) {
                if (dateTargets.hasOwnProperty(i)) {
                    var currentIndex = dateTargets[i];

                    pair[currentIndex].each(function () {
                        var trigger = $(this),
                            currentMonth = pair.date.getMonth(),
                            currentYear = pair.date.getFullYear(),
                            currentPair = datePairs[trigger.attr('name')],
                            picker = currentPair.picker;

                        currentPair[currentIndex + '_date'] = pair.date;

                        expandYearsBasedOnDate(currentPair, pair.date);
                        clearDisabledMonthsAndYears(picker, currentIndex + '_date', currentMonth, currentYear);
                    });
                }
            }
        }

        function clearDisabledMonthsAndYears (picker, currentIndex, currentMonth, currentYear) {
            var pair = datePairs[picker.attr('data-target')];

            currentMonth = parseInt(currentMonth);
            currentYear = parseInt(currentYear);

            var monthPicker = picker.find('.ui-datepicker-month:first');

            if (currentIndex == 'before_date') {
                if (currentYear == picker.find('.ui-datepicker-year').val()) {
                    if (pair.date)
                        monthPicker.html(generateMonthsOptions(pair.date));

                    picker.find('.ui-datepicker-month:first option').each(function () {
                        var obj = $(this);

                        if (obj.val() < currentMonth)
                            obj.remove();
                    });
                }

                picker.find('.ui-datepicker-year:first option').each(function () {
                    var obj = $(this);

                    if (obj.val() < currentYear)
                        obj.remove();
                });
            } else if (currentIndex == 'after_date') {
                if (currentYear == picker.find('.ui-datepicker-year').val()) {
                    if (pair.date)
                        monthPicker.html(generateMonthsOptions(pair.date));

                    picker.find('.ui-datepicker-month:first option').each(function () {
                        var obj = $(this);

                        if (obj.val() > currentMonth)
                            obj.remove();
                    });
                }

                picker.find('.ui-datepicker-year:first option').each(function () {
                    var obj = $(this);

                    if (obj.val() > currentYear)
                        obj.remove();
                });
            }
        }

        function fixMonthsOnYearChange (obj, pair, picker) {
            if (('before_date' in pair && typeof pair.before_date.getTime == 'function') || ('after_date' in pair && typeof pair.after_date.getTime == 'function')) {
                var currentIndex = (('before_date' in pair && typeof pair.before_date.getTime == 'function') ? 'before_date' : 'after_date'),
                    date = pair[currentIndex],
                    months = picker.find('.ui-datepicker-month:first'),
                    selected = months.val(),
                    currentYear = obj.val();

                if (date.getFullYear() != currentYear) {
                    months.html(generateMonthsOptions(getPickerDateOrNew(pair))).val(selected);
                } else {
                    clearDisabledMonthsAndYears(picker, currentIndex, date.getMonth(), currentYear);
                }
            }
        }

        function openPicker (target) {
            var pair = datePairs[target.attr('name')];

            if (pair.picker.css('display') == 'none') {
                var restoreDate = getPickerDateOrNew(pair, true);

                pair.picker.find('.ui-datepicker-month').val(restoreDate.getMonth());
                pair.picker.find('.ui-datepicker-year').val(restoreDate.getFullYear());

                if (pair.withTime) {
                    pair.picker.find('.ui-datepicker-hours').val(restoreDate.getHours());
                    pair.picker.find('.ui-datepicker-minutes').val(restoreDate.getMinutes());
                    pair.picker.find('.ui-datepicker-seconds').val(restoreDate.getSeconds());
                }

                if (target.closest('div').css('position') == 'relative') {
                    pair.picker.find('tbody').html(generateWeeks(restoreDate, pair));
                    previousNextButtonVisibilityHandler(pair.picker);

                    var width = parseFloat(target.outerWidth() + 1) / parseFloat($('body').css('font-size'));

                    if (width < 17)
                        width = 17;

                    pair.picker.show().css({
                        'position'  : 'absolute',
                        'top'       : target.outerHeight(),
                        'left'      : target.offset().left - target.closest('div').offset().left,
                        'width'     : width + 'rem'
                    });
                } else {

                }
            }
        }

        function previousNextButtonVisibilityHandler (picker) {
            var pair = datePairs[picker.attr('data-target')];

            if (('before_date' in pair && typeof pair.before_date.getTime == 'function') || ('after_date' in pair && typeof pair.after_date.getTime == 'function')) {
                var dateTargets = [],
                    showButtons = true;

                if ('before_date' in pair && typeof pair.before_date.getTime == 'function')
                    dateTargets.push('before_date');

                if ('after_date' in pair && typeof pair.after_date.getTime == 'function')
                    dateTargets.push('after_date');

                for (var i in dateTargets) {
                    if (dateTargets.hasOwnProperty(i)) {
                        var disabledDirection = dateTargets[i];

                        if (typeof pair[disabledDirection] != 'undefined' && typeof pair[disabledDirection].getTime == 'function' && pair[disabledDirection].getMonth() == picker.find('.ui-datepicker-month').val() && pair[disabledDirection].getFullYear() == picker.find('.ui-datepicker-year').val()) {
                            showButtons = false;

                            if (disabledDirection == 'after_date')
                                picker.find('.ui-datepicker-next').hide();
                            else
                                picker.find('.ui-datepicker-prev').hide();
                        }
                    }
                }

                if (showButtons)
                    picker.find('.ui-datepicker-prev, .ui-datepicker-next').show();
            } else {
                picker.find('.ui-datepicker-prev, .ui-datepicker-next').show();
            }
        }

        function handleShortcutSelection (obj) {
            var shortcut = obj.val(),
                picker = obj.closest('.ui-datepicker'),
                pair = datePairs[picker.attr('data-target')],
                date = getPickerDateOrNew(pair);

            var timeFrame = shortcut.match(shortcuts_lexicon.timeFrames.join('|'));

            if (timeFrame == null)
                throw 'Time frame not in current lexicon';

            var timeSpecified = shortcut.match(shortcuts_lexicon.specificTimes.join('|')),
                multipliers = shortcut.match(shortcuts_lexicon.multipliers.join('|')),
                orders = shortcut.match(shortcuts_lexicon.orders.join('|'));

            if (timeSpecified == null) {
                handleShortcutsTimeFrame(timeFrame, multipliers, orders, date, picker);
            } else {
                var hours = picker.find('.ui-datepicker-hours'),
                    minutes = picker.find('.ui-datepicker-minutes'),
                    seconds = picker.find('.ui-datepicker-seconds');

                switch (timeSpecified[0]) {
                    case 'same_hour':
                        hours.val(date.getHours());
                        minutes.val(date.getMinutes());
                        seconds.val(date.getSeconds());
                        break;
                    case 'midnight':
                        hours.val(0);
                        minutes.val(0);
                        seconds.val(0);
                        break;
                    case 'midday':
                        hours.val(12);
                        minutes.val(0);
                        seconds.val(0);
                        break;
                }

                handleShortcutsTimeFrame(timeFrame, multipliers, orders, date, picker);
            }

            obj.val('');
        }

        function handleShortcutsTimeFrame (timeFrame, multipliers, orders, date, picker) {
            var pair = datePairs[picker.attr('data-target')],
                oldDate = pair.date,
                current = new Date(date.getTime());

            switch (timeFrame[0]) {
                case 'today':
                    break;
                case 'tomorrow':
                    current.setDate(current.getDate() + 1);
                    break;
                case 'week':
                    if (multipliers != null) {
                        switch (multipliers[0]) {
                            case 'two':
                                multipliers = 2;
                                break;
                            default:
                                multipliers = 1;
                                break;
                        }
                    } else {
                        multipliers = 1;
                    }

                    current.setDate(current.getDate() + 7 * multipliers);
                    break;
                case 'quarter':
                    break;
            }

            pair.date = current;
            picker.find('tbody').html(generateWeeks(current, pair));
            pair.date = oldDate;
        }

        function getPickerDateOrNew (pair, checkRestrictions) {
            var tmpDate = (pair.date ? pair.date : new Date());

            if (checkRestrictions === true) {
                if ('before_date' in pair && tmpDate < pair.before_date) {
                    tmpDate = pair.before_date;
                } else if ('after_date' in pair && tmpDate > pair.after_date) {
                    tmpDate = pair.after_date;
                }
            }

            return tmpDate;
        }

        function decomposeFormat (format) {
            var decomposed = [];

            format = format.replace(/\s+/g,' ');

            if ((new RegExp('\s')).test(format))
                format = format.split(' ');
            else
                format = [format];

            for (var i in format) {
                if (format.hasOwnProperty(i)) {
                    var currentFormat = format[i],
                        tmp = {
                            'structure' : [],
                            'separator' : ''
                        };

                    for (var j in format_lexicon) {
                        if  (format_lexicon.hasOwnProperty(j)) {
                            var index = currentFormat.indexOf(format_lexicon[j]);

                            if (index > -1) {
                                currentFormat = currentFormat.replace(format_lexicon[j],'');
                                tmp.structure[index] = format_lexicon[j];
                            }
                        }
                    }

                    tmp.structure = tmp.structure.filter(function (key) {
                        if (key)
                            return key;
                    });

                    var tmpSeparator = '';

                    for (var j in currentFormat) {
                        if (currentFormat.hasOwnProperty(j)) {
                            if (tmpSeparator == '' || tmpSeparator == currentFormat[j])
                                tmpSeparator = currentFormat[j];
                            else
                                throw 'Invalid separator "' + currentFormat[j] + '"';
                        }
                    }

                    tmp.separator = tmpSeparator;

                    decomposed.push(tmp);
                }
            }

            return decomposed;
        }

        function analyzeDateInput (pair, input, format) {
            var date, month, year, hours, minutes, seconds;

            for (var i in format) {
                if (format.hasOwnProperty(i)) {
                    var tmp = input[i].trim().split(new RegExp(format[i].separator));

                    if (tmp.length < format[i].structure.length) {
                        for (var j in format[i].structure) {
                            switch (format[i].structure[j]) {
                                case 'dd':
                                case 'mm':
                                case 'yyyy':
                                case 'hh':
                                case 'ii':
                                case 'ss':
                                    tmp.push(0);
                                    break
                            }
                        }
                    }

                    for (var j in format[i].structure) {
                        if (format[i].structure.hasOwnProperty(j)) {
                            switch (format[i].structure[j]) {
                                case 'dd':
                                    date = tmp[j];
                                    break;
                                case 'mm':
                                    month = tmp[j] - 1;
                                    break;
                                case 'yyyy':
                                    year = tmp[j];
                                    break;
                                case 'hh':
                                    hours = tmp[j];
                                    break;
                                case 'ii':
                                    minutes = tmp[j];
                                    break;
                                case 'ss':
                                    seconds = tmp[j];
                                    break;
                            }
                        }
                    }
                }
            }

            pair.date = new Date(year, month, date, hours, minutes, seconds);

            expandYearsBasedOnDate(pair);
        }

        function restructureDate (pair, format) {
            var display = '';

            if (typeof format == 'undefined')
                format = decomposeFormat(pair.format);

            for (var i in format) {
                if (format.hasOwnProperty(i)) {
                    var tmp = [];

                    for (var j in format[i].structure) {
                        if (format[i].structure.hasOwnProperty(j)) {
                            switch (format[i].structure[j]) {
                                case 'dd':
                                    var date = pair.date.getDate();

                                    if (date < 10)
                                        date = '0' + date;

                                    tmp.push(date);
                                    break;
                                case 'mm':
                                    var month = pair.date.getMonth() + 1;

                                    if (month < 10)
                                        month = '0' + month;

                                    tmp.push(month);
                                    break;
                                case 'yyyy':
                                    tmp.push(pair.date.getFullYear());
                                    break;
                                case 'hh':
                                    var hours = pair.date.getHours();

                                    if (hours < 10)
                                        hours = '0' + hours;

                                    tmp.push(hours);
                                    break;
                                case 'ii':
                                    var minutes = pair.date.getMinutes();

                                    if (minutes < 10)
                                        minutes = '0' + minutes;

                                    tmp.push(minutes);
                                    break;
                                case 'ss':
                                    var seconds = pair.date.getSeconds();

                                    if (seconds < 10)
                                        seconds = '0' + seconds;

                                    tmp.push(seconds);
                                    break;
                            }
                        }
                    }

                    display += tmp.join(format[i].separator) + ' ';
                }
            }

            $('[name="' + pair.picker.attr('data-target') + '"]').val(display.trim());
        }

        function expandYearsBasedOnDate (pair, date) {
            var yearPicker = pair.picker.find('.ui-datepicker-year'),
                selectedYear = (typeof date != 'undefined' ? date.getFullYear() : pair.date.getFullYear()),
                firstYearOption = yearPicker.find('option:not(:disabled):first'),
                firstYear = parseInt(firstYearOption.val()),
                lastYearOption = yearPicker.find('option:not(:disabled):last'),
                lastYear = parseInt(lastYearOption.val()),
                tmp = '';

            if (selectedYear < firstYear) {
                for (var i = selectedYear; i < firstYear; i++) {
                    tmp += '<option value="' + i + '">' + i + '</option>';
                }

                firstYearOption.before(tmp);
            } else if (selectedYear > lastYear) {
                for (var i = lastYear; i <= selectedYear; i++) {
                    tmp += '<option value="' + i + '">' + i + '</option>';
                }

                lastYearOption.after(tmp);
            }
        }

        function handleMirrors (target, properties) {
            var mirrorToSelector = '#' + target.attr('id'),
                mirrorToTarget = $(properties.to),
                mirrorToFound;

            try {
                mirrorToFound = $.grep($._data($(document)[0],"events")['date:updated'], function (n) {
                    return n.handler.name == 'mirrorTo' && n.selector == mirrorToSelector;
                });
            } catch (er) {
                mirrorToFound = [];
            }

            if (mirrorToFound.length) {
                mirrorToTarget.disabled(false);

                $(document).off('date:updated', mirrorToSelector, mirrorTo);
            } else {
                mirrorToTarget.val(target.val()).change();
                mirrorToTarget.disabled(true);

                $(document).on('date:updated', mirrorToSelector,properties,  mirrorTo);
            }
        }

        function hasMirror (target) {
            var mirrorToSelector = '#' + target.attr('id'),
                mirrorToFound;

            try {
                mirrorToFound = $.grep($._data($(document)[0],"events")['date:updated'], function (n) {
                    return n.handler.name == 'mirrorTo' && n.selector == mirrorToSelector;
                });
            } catch (er) {
                mirrorToFound = [];
            }

            return mirrorToFound.length > 0;
        }

        function mirrorTo (e) {
            var pair = datePairs[$(e.data.to).attr('name')];

            pair.date = datePairs[this.name].date;
            setDateToInput(pair.picker);
        }
    })();
});