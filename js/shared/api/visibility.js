$(document).ready(function () {
    var hidden, visibilityChange;

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    if (typeof document.addEventListener === "undefined" || typeof document.hidden === "undefined") {
        $.extend({
            'visibility_api_config' : {
                available   : true
            }
        });
    } else {
        var handlers = [];

        $.extend({
            'visibility_api' : function (index, action) {
                if (typeof index == 'object') {
                    return createNewVisibility(index);
                } else {
                    if (typeof index != 'string')
                        throw 'Invalid visibility handler';

                    if (handlers.indexOf(index) == -1)
                        throw 'Unknown visibility handler';

                    if (typeof action != 'string')
                        throw 'Invalid action';

                    switch (action) {
                        case 'remove':
                            return removeVisibilityHandler(index);
                            break
                        default:
                            throw 'Unknown action';
                            break;
                    }
                }
            },
            'visibility_api_config' : {
                hidden      : hidden,
                available   : true
            }
        });

        function createNewVisibility (properties) {
            if (! 'callback' in properties)
                throw "No callback is set";

            if (typeof properties.callback != 'function')
                throw "Invalid callback was given";

            var handlerName = new Date().getTime() + Math.random().toString().replace('0.','');

            handlerName = handlerName.toString();

            handlers.push(handlerName);

            window[handlerName] = properties.callback;

            window.addEventListener(visibilityChange, window[handlerName], false);

            return handlerName;
        }

        function removeVisibilityHandler (index) {
            window.removeEventListener(visibilityChange, window[index]);

            return true;
        }
    }
});