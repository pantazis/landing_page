/*
 <script>
     $(document).ready(function () {
         countDowns = {!! json_encode($counters, JSON_UNESCAPED_UNICODE) !!};
         major_counter = {!! $major_counter !!};


         if (Object.keys(countDowns).length) {
             countDownShowHandler = function (name, date) {
                 $.promotions.countDown.setRenew(name, $('#promoCounter'), date);
             };

             countDownHideHandler = function () {
                $('#promoCounter').empty();
             };

             $.promotions.countDown.init($('#promoCounter'), countDowns[major_counter]);
         }
     });
 </script>
*/

$(document).ready(function () {
    FlipClock.Lang.Greek = {years:"Χρόνια",months:"Μήνες",days:"Μέρες",hours:"Ώρες",minutes:"Λεπτά",seconds:"Δευτερόλεπτα"};

    $.extend({
        promotions : {
            countDown : {
                init        : function (target, promotion) {
                    var counter_date_split = promotion.soft_end.match(/[0-9]+/g),
                        counter_date = new Date(Date.UTC(counter_date_split[0],counter_date_split[1],counter_date_split[2],counter_date_split[3],counter_date_split[4],counter_date_split[5])),
                        counter_dif = counter_date.getTime() - new Date().getTime();

                    if (counter_dif < 1) {
                        counter_date.setSeconds(counter_date.getSeconds() + promotion.interval);
                    }

                    setNewPromotionCountDown (target, counter_date, promotion.interval);
                },
                recreate    : function (target, duration) {
                    setNewPromotionCountDown (target, duration);
                },
                setRenew    : function (promotion, target, new_date) {
                    var counter_date_split = (countDowns[promotion].soft_end).toString().match(/[0-9]+/g),
                        counter_date = new Date(Date.UTC(counter_date_split[0],counter_date_split[1] - 1,counter_date_split[2],counter_date_split[3],counter_date_split[4],counter_date_split[5])),
                        counter_dif = counter_date.getTime() - new Date().getTime();

                    countDowns[promotion].soft_end = new_date;

                    if (counter_dif > 0) {
                        setTimeout(function () {
                            var counter_date_split = (countDowns[promotion].soft_end).toString().match(/[0-9]+/g),
                                counter_date = new Date(Date.UTC(counter_date_split[0],counter_date_split[1],counter_date_split[2],counter_date_split[3],counter_date_split[4],counter_date_split[5]));
                                counter_date.setSeconds(counter_date.getSeconds() - 1);

                            setNewPromotionCountDown (target, counter_date);
                        }, counter_dif - counter_dif % 1000 - 1000)
                    } else {
                        counter_date_split = (countDowns[promotion].soft_end).toString().match(/[0-9]+/g);
                        counter_date = new Date(Date.UTC(counter_date_split[0],counter_date_split[1],counter_date_split[2],counter_date_split[3],counter_date_split[4],counter_date_split[5]));
                        counter_date.setSeconds(counter_date.getSeconds() - 1);

                        setNewPromotionCountDown (target, counter_date);
                    }
                }
            }
        }
    });

    function setNewPromotionCountDown (target, duration, interval) {
        duration.setMonth(duration.getMonth() - 1);

        var now = new Date(),
            counter_dif = duration.getTime() - now.getTime();

        if (counter_dif > 1) {
            var parameters =  {
                countdown: true
            };

            var counter_temp_dif = (counter_dif - counter_dif % 1000) / 1000;

            if (counter_temp_dif == 0) {
                duration.setSeconds(duration.getSeconds() + interval);

                counter_dif = duration.getTime() - new Date().getTime();
            }

            if ((duration.getDate() - now.getDate()) > 0) {
                parameters.clockFace = 'DailyCounter';
            }
            parameters.clockFace = 'DailyCounter';

            target.empty().FlipClock((counter_dif - counter_dif % 1000) / 1000, parameters);
        }
    }
});