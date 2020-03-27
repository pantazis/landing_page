$(document).ready(function () {
    for (i = new Date().getFullYear(); i > 1949; i--){
        $('[class*="years"]').append($('<option />').val(i).html(i));
    }

    for (i = 1; i < 13; i++){
        $('[class*="months"]').append($('<option />').val(i).html(i));
    }

    $('[class*="days"]').each(function () {
        container = $(this).closest('.date-container');
        updateNumberOfDays(container);
    });

    $('.years, .months').on("change", function(){
        container = $(this).closest('.date-container');
        updateNumberOfDays(container);
    });

    setTimeout(function () {
        if (typeof birthday != 'undefined') {
            $('[class*="years"]').each(function () {
                $(this).apply_chosen({'value':birthday[0],'par':{search_contains:true}});
            });
            $('[class*="months"]').each(function () {
              $(this).apply_chosen(parseInt(birthday[1]));
            });
            $('[class*="days"]').each(function () {
                $(this).apply_chosen(parseInt(birthday[2]));
            });
        } else {
            $('[class*="years"]').each(function () {
                $(this).apply_chosen({'value':'','par':{search_contains:true}});
            });
            $('[class*="months"]').each(function () {
                $(this).apply_chosen('');
            });
            $('[class*="days"]').each(function () {
                $(this).apply_chosen('');
            });
        }
    },400);

    function updateNumberOfDays(container){
        dayCont = container.find('.days')
        day = dayCont.val();
        dayCont.html('');
        month = container.find('.months').val();
        year = container.find('.years').val();
        days = daysInMonth(month, year);

        for(i=1; i < days+1 ; i++){
            dayCont.append($('<option />').val(i).html(i));
        }
        if(day <= dayCont.find('option:last').val()) {
            dayCont.chosen_update(day);
        }else{
            dayCont.chosen_update(1);
        }
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
});