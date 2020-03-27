$(document).ready(function () {
    $.extend({
        TextCounter : function (parameters) {
            return new TextCounter(parameters);
        }
    });

    function TextCounter (parameters) {
        var initiated = false;

        if (typeof parameters != 'object')
            throw 'Parameters undefined or invalid';

        if (! ('selector' in parameters))
            throw 'No selector whas given';

        if (! ('duration' in parameters))
            parameters.duration = 1000;

        if (! ('easing' in parameters))
            parameters.easing = 'swing';

        if (! ('init' in parameters))
            parameters.init = 0;

        function countUp () {
            initiated = true;

            $(parameters.selector).each(function () {
                $(this).prop('Counter',parameters.init).animate({
                    Counter: $(this).text()
                }, {
                    duration: parameters.duration,
                    easing: parameters.easing,
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });
        }

        if ('offsetTop' in parameters) {

            window.addEventListener('scroll', function () {
                initCounters();
            });

            initCounters ();
            function initCounters () {
                if (!initiated && parameters.offsetTop <= window.pageYOffset) {
                    countUp();

                    initiated = true;
                }
            }
        }
    }
});