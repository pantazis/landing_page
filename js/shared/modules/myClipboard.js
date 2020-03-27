$(document).ready(function () {
    (function () {
        var copyTimer,
            input = document.createElement('input');

        input.type = 'text';
        input.id = 'copyInput';
        input.style.opacity = 0;
        input.style.position = 'absolute';
        input.style.top = '-1000000px';
        input.style.left = '-1000000px';

        document.body.appendChild(input);

        input = document.getElementById('copyInput');

        addClipboardInputs('.toClipBoard');

        $.extend({
            addClipboardInputs : addClipboardInputs
        });

        $(document)
            .on('mouseenter', '.myClipBoardContainer .toClipBoard, [class*="toClipBoard-slice"]', function () {
                this.style.cursor = 'pointer';
            })
            .on('click', '.myClipBoardContainer .toClipBoard', function () {
                clickHandler(this);
            })
            .on('click', '[class*="toClipBoard-slice"]', function () {
                slicedClickHandler(this);
            });

        function addClipboardInputs (selector) {
            $(selector).css('cursor', 'pointer').each(function () {
                this.addEventListener('click', function () {
                    clickHandler(this);
                });
            });
        }

        function clickHandler (obj) {
            try {
                clearTimeout(copyTimer);
            } catch (er) {}

            copyTimer = setTimeout(function () {
                copy(obj);
            }, 250);
        }

        function slicedClickHandler (obj) {
            try {
                clearTimeout(copyTimer);
            } catch (er) {}

            copyTimer = setTimeout(function () {
                copySliced(obj);
            }, 250);
        }

        function copy (obj) {
            var text;

            text = obj.innerText;

            if (obj.className.match(/toClipBoard-clearSpecial/) != null)
                text = text.replace(/\W/g,'');

            if (obj.className.match(/toClipBoard-SplitOn/) != null)
                text = text.split(obj.attr('data-split'))[obj.attr('data-get')];

            if (obj.className.match(/toClipBoard-email:/) != null) {
                if (text.match(/@/) == null) {
                    var domainName = obj.className.match(/toClipBoard-email:\w+\s?/)[0].trim().split(':')[1];
                    text = text.replace(domainName,(domainName + '@'));
                }

                text = text.replace(/@+/,'@');
            }

            input.value = text;

            input.select();

            document.execCommand("Copy");

            $.alertHandler('', $.translate('misc.clipboard_copied', 0, {'text' : input.value}), alert_box_success);
        }

        function copySliced (obj) {
            var text;

            try {
                text = obj.innerText.slice(obj.className.match(/toClipBoard-slice[0-9]+/)[0].match(/[0-9]+/));
            } catch (er) {
                text = obj.innerText;
            }

            if (obj.className.match(/toClipBoard-clearSpecial/) != null)
                text = text.replace(/\W/g,'');

            if (obj.className.match(/toClipBoard-SplitOn/) != null)
                text = text.split(obj.dataset.split)[obj.dataset.get];

            if (obj.className.match(/toClipBoard-email:/) != null) {
                if (text.match(/@/) == null) {
                    var domainName = obj.className.match(/toClipBoard-email:\w+\s?/)[0].trim().split(':')[1];
                    text = text.replace(domainName,(domainName + '@'));
                }

                text = text.replace(/@+/,'@');
            }

            input.value = text;

            input.select();

            document.execCommand("Copy");

            $.alertHandler('', $.translate('misc.clipboard_copied', 0, {'text' : input.value}), alert_box_success);
        }
    })()
});