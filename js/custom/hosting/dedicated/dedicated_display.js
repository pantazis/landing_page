var filterSliders = document.getElementsByClassName('filterSlider');

for (var i in filterSliders) {
    if (filterSliders.hasOwnProperty(i)) {
        var min = parseFloat(filterSliders[i].dataset['start']),
            max = parseFloat(filterSliders[i].dataset['end']);

        noUiSlider.create(filterSliders[i], new sliderConfig(min, max, filterSliders[i]));
    }
}

function sliderConfig (min, max, filter) {
    var postfix = '',
        id = filter.id;

    if (id.indexOf('price') > -1)
        postfix = ' €';
    else if (id.indexOf('ram') > -1 || id.indexOf('hdd') > -1)
        postfix = ' GB';

    var properties =  {
        start : [min, max],
        connect: true,
        range : {
            'min' : min,
            'max' : max,
        },
        format : {
            to : function (value) {
                if (id.indexOf('price') > -1)
                    return value;
                else
                    return parseInt(value);
            },
            from  : function (value) {
                if (id.indexOf('price') > -1)
                    return value;
                else
                    return parseInt(value);
            },
        },
        tooltips : [
            {
                to : function (value) {
                    return parseInt(value) + postfix;
                },
                from : function (value) {
                    return value;
                }
            },
            {
                to : function (value) {
                    return parseInt(value) + postfix;
                },
                from : function (value) {
                    return value;
                }
            },
        ]
    };

    if (id.indexOf('ram') > -1 || id.indexOf('core') > -1) {
        var tmp = [],
            i;

        if (id.indexOf('ram') > -1) {
            for (i = min * 2; i < max; i = i *2) {
                tmp.push(i)
            }
        } else if (id.indexOf('core') > -1) {
            for (i = min + 2; i < max; i = i + 2) {
                tmp.push(i)
            }
        }

        var step = 100 / (tmp.length + 1);
        for (i in tmp) {
            if (tmp.hasOwnProperty(i)) {
                properties.range[(step * (parseInt(i)+1)).toFixed(2).toString() + '%'] = tmp[i];
            }
        }

        properties.snap = true;
    }

    if (id.indexOf('hdd') > -1) {
        postfix = ' GB';

        properties.tooltips = [
            {
                to : function (value) {
                    if (value >= 1024)
                        return (value / 1024).toFixed(1) + ' TB';
                    return parseInt(value) + ' GB';
                },
                from : function (value) {
                    return value;
                }
            },
            {
                to : function (value) {
                    if (value >= 1024)
                        return (value / 1024).toFixed(1) + ' TB';
                    return parseInt(value) + ' GB';
                },
                from : function (value) {
                    return value;
                }
            },
        ];

        var steps       = [],
            start       = 128,
            end         = max,
            i           = start,
            minFoundAt = null;

        steps.push(i);

        while (i < end) {
            if (i < 1024)
                i *= 2;
            else
                i += 512;

            steps.push(i);
        }

        for (i in steps) {
            if (steps.hasOwnProperty(i)) {
                if (steps[i] >= min) {
                    minFoundAt = i;
                    break;
                }
            }
        }

        start = parseInt(minFoundAt);

        if (steps[minFoundAt] > min)
            start  -= 1;

        var tmpSteps = [];

        for (var j = start; j < steps.length; j++) {
            tmpSteps.push(steps[j]);
        }

        steps = {
            min : tmpSteps[0],
            max : tmpSteps[tmpSteps.length - 1],
        };


        tmpSteps = tmpSteps.splice(1,tmpSteps.length - 2);

        for (i = 0; i < tmpSteps.length; i++) {
            steps[((i + 1) * (100 / (tmpSteps.length + 1)).toFixed(2))] = tmpSteps[i];
        }

        properties.range = steps;
        properties.snap = true;
        properties.start[0] = properties.range['min'];

        filter.dataset.start = properties.range['min'];
        document.getElementById('hdd_capacity').value = JSON.stringify(properties.start);
    }

    return properties;
}

$(document).ready(function () {
    var dediFilterForm = $('#dediFilterForm');

    $('select').each(function () {
        var obj = $(this);

        obj.apply_chosen(obj.val());
    });

    $('.apply-filters').on('click', function (e) {
        e.preventDefault();

        dediFilterForm.find('[type="radio"]').disabled(false).prop('checked', false).closest('li').removeClass('disabled');
        dediFilterForm.find('.filterSlider').each(function () {
            var obj = $(this);

            obj.noUiSlider().set([obj.attr('data-start'), obj.attr('data-end')]);
        });

        $('.mobileFilters').each(function () {
            var targetId = this.dataset.key,
                target = $('#' + targetId);

            if (this.type == 'checkbox') {
                $('#' + targetId + '-trigger').prop('checked', this.checked);
            } else if (this.type == 'select-one') {
                if (target.hasClass('range_readout')) {
                    var slider = $('.filterSlider[data-target="' + target.attr('id') + '"]');

                    slider.noUiSlider().set([this.value, slider.attr('data-end')]);
                } else if (target.length < 1) {
                    var inputs = $('input[id^="' +targetId + '"]');

                    console.log(inputs);

                    if (inputs.length) {
                        var source = this;

                        inputs.checked(false);
                        inputs.filter(function () {
                            return $(this).val() == source.value
                        }).checked(true);
                    }
                } else
                    target.chosen_update(this.value);
            } else if (this.type == 'select-multiple') {
                if (target.length)
                    target.chosen_update($(this).val());
                else {
                    var inputs = $('input[id^="' +targetId + '"]');

                    if (inputs.length) {
                        var values = $(this).val();

                        inputs.checked(false);

                        for (var i in values) {
                            if (values.hasOwnProperty(i)) {
                                inputs.filter(function () {
                                    return $(this).val() == values[i];
                                }).checked(true);
                            }
                        }

                    }
                }
            } else {
                target.val(this.value);
            }
        });

        $('.filters-panel .filterSlider').each(function () {
            var obj = $(this),
                target = dediFilterForm.find('.filterSlider[data-target="' + obj.attr('data-target') + '"]');

            target.noUiSlider().set(obj.noUiSlider().get());
        });

        dediFilterForm.change();
        $(this).closest('.cd-panel').removeClass('is-visible');
    });

    dediFilterForm.on('change', function (e) {
        handleFilterFormChanges();
    });

    dediFilterForm.find('select').on('change', function () {
        var obj = $(this);

        if (obj.val() == 'none')
            obj.chosen_update('').change();
    });

    dediFilterForm.find('input[type="radio"], input[type="checkbox"]:not(.switch-controller)').on('change', function () {
        $(this).closest('.filter_container').find('.clear_filter').show();
    });

    $('.configurableProductForm .execute_order, .configurableProductForm .order_dedi').on('click', function (e) {
        e.preventDefault();

        $(this).closest('form').submit();
    });

    $('#advancedTrigger').on('click', function (e) {
        e.preventDefault();

        $(this).hide();
        $('#dediFilterForm .advanced').show();
    });

    $('#dediFilterForm .filterSlider').each(function () {
        var obj = $(this);

        try {
            this.noUiSlider.on('update', function () {
            rangeUpdated(obj);
        });
        } catch (e) {
            
        }
    });

    $('.clear_filter').on('click', function (e) {
        e.preventDefault();

        var obj = $(this),
            filter_container = obj.closest('.filter_container');

        if (filter_container.find('[type="radio"],[type="checkbox"]').length) {
            filter_container.find('[type="radio"],[type="checkbox"]').prop('checked', false).change();
        } else if (filter_container.find('.filterSlider').length) {
            var filterSlider = filter_container.find('.filterSlider');

            filterSlider.noUiSlider().set([filterSlider.attr('data-start'), filterSlider.attr('data-end')]);
        }

        obj.hide();
    });

    $('#clearAll').on('click', function (e) {
        e.preventDefault();

        var obj = $(this),
            form = obj.closest('form');

        obj.hide();
        $('.clear_filter').hide();

        form.find('[type="radio"]').disabled(false).prop('checked', false).closest('li').removeClass('disabled');
        form.find('.filterSlider').each(function () {
            var obj = $(this);

            obj.noUiSlider().set([obj.attr('data-start'), obj.attr('data-end')]);
        });

        form.trigger('change');
    });

    $('#sortServers').on('change', function () {
        var obj = $(this),
            items = $('.item.product_info'),
            list = $('.dedicated-list');

        switch (obj.val()) {
            case 'price_asc':
                [].sort.call(items, function (a,b){
                    return $(a).find('.price .s-price .vat').get_price() - $(b).find('.price .s-price .vat').get_price()
                });
                break;
            case 'added_desc':
                [].sort.call(items, function (a,b){
                    return parseInt($(b).attr('data-added')) - parseInt($(a).attr('data-added'))
                });
                break;
        }

        items.each(function () {
            list.append(this);
        })
    });

    $(document)
        .on('click', '#mobileFilters', function (e) {
            e.preventDefault();

            $(this).closest('div').find('.cd-panel').addClass('is-visible');
        })
        .on('click', '.cd-panel-close', function (e) {
            e.preventDefault();

            $(this).closest('.cd-panel').removeClass('is-visible');
        })
        .on('vat:changed', function () {
            var priceSlider = $('#minimum_price_slider'),
                start = parseFloat(priceSlider.attr('data-original-start')) * (vat.show ? vat.quote : 1),
                end = parseFloat(priceSlider.attr('data-original-end')) * (vat.show ? vat.quote : 1);

            priceSlider.attr('data-start', start);
            priceSlider.attr('data-end', end);

            $('#minimum_price').val(start + ',' + end);

            for (var i in $products) {
                if ($products.hasOwnProperty(i))
                    $products[i]['minimum_price'] = parseFloat($products[i]['original_price'] * (vat.show ? vat.quote : 1));
            }

            priceSlider[0].noUiSlider.updateOptions({
                range: {
                    'min': start,
                    'max': end
                },
                'start': [start, end],
            });

            rangeUpdated(priceSlider);
        });

    $('.filter_container .name').each(function () {
        var obj = $(this),
            objName = obj.text().toLowerCase();

        if (typeof obj.attr('data-name') != 'undefined')
            objName = obj.attr('data-name').toLowerCase();

        obj.after('<span class="counter"></span>');

        var counter = obj.next('.counter');

        if (objName in $filterCounters) {
            counter.text('(' + $filterCounters[objName] + ')');
        } else {
            counter.text('(0)');
            var cont = counter.closest('li').addClass('disabled');

            cont.find('input').disabled(true);
        }
    });

    setTimeout(function () {
        $('#dedicated-server').show();
        $('#loaderContainer').remove();

        $.recalculateSections();
        $('.clear_filter').hide();

        $('#flags').chosen_update('');
    }, 250);

    function rangeUpdated (slider) {
        var input = $('#' + slider.attr('data-target')),
            value = slider.noUiSlider().get().join(','),
            mirrorSlider = $('.filterSlider[data-target="' + slider.attr('data-target') + '"]').filter(function () {return ! $(this).is(slider)});

        if (mirrorSlider.length)
            mirrorSlider.noUiSlider().set(slider.noUiSlider().get());

        if (input.val() != value) {
            input.val(value).change();

            value = slider.noUiSlider().get();

            var clear_filter = slider.closest('.filter_container').find('.clear_filter');

            if (value[0] != slider.attr('data-start') || value[1] != slider.attr('data-end'))
                clear_filter.show();
            else
                clear_filter.hide();
        }
    }

    function handleFilterFormChanges () {
        var productContainers = $('.item.product_info'),
            noResults = $('#noResults');

        noResults.hide();

        productContainers.hide();

        var pairedValues = {};

        dediFilterForm.find('input:not(.chosen-container input), select').each(function () {
            if (this.name && ! (this.name in $filters))
                return true;

            if (this.type == 'checkbox' && this.checked) {
                if (this.className.indexOf('switch-controller') > -1)
                    productContainers = filterProducts(productContainers, this.name);
                else {
                    if (! (this.name in pairedValues))
                        pairedValues[this.name] = [];

                    pairedValues[this.name].push(this.value);
                }
            } else if (this.type == 'radio' && this.checked) {
                productContainers = filterProducts(productContainers, this.name, this.value);
            } else if (this.type == 'select-multiple' && !!this.value) {
                var options = this.options;

                for (var i in options) {
                    if (options.hasOwnProperty(i) && options[i].selected) {
                        productContainers = filterProducts(productContainers, this.name, options[i].value);
                    }
                }
            } else if (this.type != 'radio' && this.type != 'checkbox' && !!this.value) {
                productContainers = filterProducts(productContainers, this.name, this.value);
            }
        });

        for (var i in pairedValues) {
            if (pairedValues.hasOwnProperty(i)) {
                productContainers = filterProducts(productContainers, i, pairedValues[i]);
            }
        }

        var currentPos = (document.documentElement.scrollTop || document.body.scrollTop);

        productContainers.show();

        $.smoothScroll({}, currentPos);

        if (productContainers.length < 1)
            noResults.show();

        try {
            clearTimeout(filterRecountTimmer);
        } catch (e) {}

        $('#visibleCount').text(productContainers.length);

        filterRecountTimmer = setTimeout(function () {
            recountFilters();
        }, 100);

        var clearAll = $('#clearAll');

        if ($('.clear_filter:visible').length > 1)
            clearAll.show();
        else
            clearAll.hide();

        $.recalculateSections();
    }

    function filterProducts (targets, property, value) {
        var matching = $.map($products, function (i, k) {
            if (decompileFilterActivationMethod (i, property, value))
                return k;
        });

        return targets.filter(function () {return matching.indexOf(this.dataset.productId) > -1});
    }

    function decompileFilterActivationMethod (item, property, value) {
        var itemProperty = $filters[property].activation.field.split('.'),
            notFound = false;

        for (var i in itemProperty) {
            if  (itemProperty.hasOwnProperty(i)) {
                try {
                    item = item[itemProperty[i]];
                } catch (e) {
                    notFound = true;
                }
            }
        }

        if (notFound)
            return false;

        if ($filters[property].activation.action == 'compare') {
            if ($filters[property].activation.type.indexOf('string') > -1) {
                if (typeof value == 'string')
                    return item.toLowerCase() == value.toLowerCase();

                value = value.join('#').toLowerCase().split('#');

                return value.indexOf(item.toLowerCase()) > -1;
            } else if ($filters[property].activation.type.indexOf('number') > -1) {
                if ($filters[property].activation.type.indexOf('equal') > -1)
                    return parseFloat(item) == parseFloat(value);

                if ($filters[property].activation.type.indexOf('greater_equal') > -1)
                    return parseFloat(item) >= parseFloat(value);

                if ($filters[property].activation.type.indexOf('in_range') > -1) {
                    value = value.split(',');

                    if (value[0] != value[1])
                        return checkIsInRange(item, value);
                    else
                        return parseFloat(item)== parseFloat(value[0]);
                }
            }
        } else if ($filters[property].activation.action == 'has_key') {
            return $filters[property].activation.key in item;
        } else if ($filters[property].activation.action == 'has_value') {
            /**
             * This applies for dedicated flags.
             * If flags not set for product return false.
             */
            if (item.length < 1)
                return false;

            return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
        } else if ($filters[property].activation.action == 'is_true') {
            return item;
        }

        return false;
    }

    function checkIsInRange (item, value) {
        return (parseFloat(value[0]) <= parseFloat(item) && parseFloat(item) <= parseFloat(value[1]));
    }

    function recountFilters () {
        var products = $('.item'),
            range_readout = $('.range_readout'),
            filterLists = $('.f-wrapper:has([type="radio"]), .f-wrapper:has([type="checkbox"]:not(.switch-controller))');

        range_readout.each(function () {
            products = filterProducts(products, this.name, this.value);
        });


        if (products.length) {
            filterLists.each(function () {
                var currentList = $(this),
                    filteredLists;

                filteredLists = filterLists.filter(function () {
                    var obj = $(this);
                    return ! (obj.is(currentList)) && obj.find('input:checked');
                });

                var toCount = products;

                filteredLists.find('input:checked').each(function () {
                    toCount = filterProducts(toCount, this.name, this.value);
                });

                currentList.find('input').each(function () {
                    var obj = $(this),
                        count = filterProducts(toCount, this.name, this.value);

                    obj.next('label').find('.counter').text('(' + count.length + ')');

                    if (count.length < 1) {
                        obj.disabled(true).closest('li').addClass('disabled');
                    } else {
                        obj.disabled(false).closest('li').removeClass('disabled');
                    }
                });
            })
        } else {
            $('.filter_container .counter').each(function () {
                var obj = $(this);

                obj.text('(0)').closest('li').addClass('disabled').find('input').prop('checked', false).disabled(true);
            });

            $('.f-wrapper:has([type="radio"]):not(:has([type="radio"]:checked))').closest('.filter_container').find('.clear_filter').hide();

            if ($('.clear_filter:visible').length < 2)
                $('#clearAll').hide();
        }
    }
});