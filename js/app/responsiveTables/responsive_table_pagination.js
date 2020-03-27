$(document).ready(function () {
    var extendable = {
        pagination    : {
            createPaginationLinks   : createPaginationLinks,
            setPaginationToPage     : setPaginationToPage,
            fixArrows               : fixArrows,
            managePaginationView    : managePaginationView,
            handleArrowClick        : handleArrowClick
        }
    };

    if ('responsiveTables' in $)
        $.extend($.responsiveTables, extendable);
    else
        $.extend({'responsiveTables' : extendable});

    $(document)
        .on('click', '.pageEnum:not(.current .pageEnum):not(.configured_table .pageEnum)',function(e){
            e.preventDefault();
            $.responsiveTables.db.initiatePageRequest($(this));
        })
        .on('click', '.paginationArrow:not(.configured_table .paginationArrow)', function (e) {
            e.preventDefault();
            handleArrowClick($(this), parseInt($('.current .pageEnum').attr('data-page')));
        });

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

        createPagesInBetween($.responsiveTables.pagination_config.view[$.getSizeClassification($.windowSize())], moreRight);

        var last_enum = table.find('.endPage');

        if(last_enum.length)
            last_enum.attr('data-page',last_page).text(last_page).closest('li').show();
        else
            moreRight.after('<li><a href="#" class="pageEnum endPage" data-page="' + last_page + '">' + last_page + '</a></li>');
    }

    /**
     * Miscellaneous function to set the current page. No argument defaults to first page.
     */
    function setPaginationToPage(page, table){
        if(typeof table === 'undefined')
            table = $('.resp-table');

        table = table.closest('.my-table');

        if(typeof page === 'undefined' || page == null)
            page = 1;

        table.find(".pagination li.current").removeClass("current");
        table.find('.pageEnum[data-page="' + page + '"]').closest('li').addClass("current");
    }

    /**
     * Creates the pages between start and end.
     * @param last_page
     * @param moreRight
     */
    function createPagesInBetween(last_page, moreRight){
        var container = moreRight.closest('.pagination');

        for(var i = 2; i <= last_page; i++){
            if(container.find('[data-page="' + i + '"]').length < 1)
                moreRight.before(returnPageItem(i));
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
            visible_for_width = $.responsiveTables.pagination_config.view[size_classification];

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

        var show_for_width = $.responsiveTables.pagination_config.show[size_classification],
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
});

$(window).on('load', function () {

});