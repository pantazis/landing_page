$(document).ready(function () {
    var searchBar = $('#searchbar'),
        initPanel = $('#initPanel'),
        resultsPanel = $('#resultsPanel'),
        whyNoPadlockForm = $('#why_no_padlock_form'),
        recaptcha = whyNoPadlockForm.find('.captcha-wrapper');

    whyNoPadlockForm.prepare_form_advanced({
        handlers            : '#padlockTrigger',
        disable_exception   : true,
        version_exception   : true,
        onSuccess           : function (form) {
            if (recaptcha.length && parseInt($('#padlockCaptcha').css('height')) < 1) {
                searchBar.focus();
                return;
            }

            $.ajax(
                new $.ajax_prototype({
                    'url'       : form.attr('action'),
                    'timeout'   : 180000,
                    'type'      : 'POST',
                    'data'      : form.serialize(),
                    'success'   : function (data) {
                        if (data.success) {
                            printResults(data.data);
                        } else {
                            globalApplicationErrors(data, form.attr('id'));
                        }

                        if (recaptcha.length && data.code != error_codes.validation_error) {
                            recaptcha.slideUp();
                            grecaptcha.reset(activeCaptcha[recaptcha.find('.g-recaptcha').attr('id')]);
                        }
                    }
                }, form.attr('id'))
            )
        }
    });

    if (recaptcha.length)
        searchBar.on('focus', function () {
            recaptcha.slideDown();
        });

    function printResults (results) {
        initPanel.remove();
        resultsPanel.empty();

        printDomainInfo(results);

        if (results.InsecureLinks.length || ! $.isEmptyObject(results.ExternalInsecureLinks)) {
            var table = '<table><tbody><tr><td colspan="2"></td></tr><tr><td width="25%"><strong>' + $.translate('ssl.whynopadlock.linenumbers') + '</strong></td><td><strong>' + $.translate('ssl.whynopadlock.insecurelink', 1) + '</strong></td></tr>',
                count = 0,
                tmp;

            tmp = printInternalLinks(results, table);
            count += tmp[1];

            tmp = printExternalLinks(results, tmp[0]);
            table = tmp[0];
            count += tmp[1];

            table += '<tr><td colspan="2"></td></tr></tbody></table>';

            resultsPanel.append('<p class="smaller-margin"><strong>' + $.translate('ssl.whynopadlock.issues', 0, {'count' : count}) + '</strong>:</p>');
            resultsPanel.append(table);
        } else {
            resultsPanel.append('<div class="alert-box info"><p class="no-margin-bottom smaller">' + $.translate('ssl.whynopadlock.noerrors') + '</p></div>');
        }
    }

    function printDomainInfo (results) {
        // resultsPanel.append('<ul id="domainInfo" class="no-bullet"><li><strong>' + $.translate('ssl.whynopadlock.domainname') + '</strong> ' + results.Domain + '</li><li><strong>' + $.translate('ssl.whynopadlock.ipaddress') + '</strong> ' + results.ServerIP + '</li><li><strong>' + $.translate('ssl.whynopadlock.urltested') + '</strong> ' + results.URLTested + '</li></ul>');
        resultsPanel.append('<ul id="domainInfo" class="no-bullet"><li><strong>' + $.translate('ssl.whynopadlock.domainname') + '</strong> ' + results.Domain + '</li><li><strong>' + $.translate('ssl.whynopadlock.urltested') + '</strong> ' + results.URLTested + '</li></ul>');
    }

    function printInternalLinks (results, table) {
        if (results.InsecureLinks.length) {
            var rows = '';

            for (var i in results.InsecureLinks) {
                if (results.InsecureLinks.hasOwnProperty(i)) {
                    rows += '<tr><td>' + results.InsecureLinks[i].Line + '</td><td>' + results.InsecureLinks[i].Link.replace(/>.+/g,'').replace(/\/$/g,'').replace(/"/g,'').replace(/\/$/g,'') + '</td></tr>';
                }
            }

            table += rows;

            return [table, results.InsecureLinks.length];
        }

        return [table, 0];
    }

    function printExternalLinks (results, table) {
        if (! $.isEmptyObject(results.ExternalInsecureLinks)) {
            var rows = '',
                count = 0;

            for (var i in results.ExternalInsecureLinks) {
                if (results.ExternalInsecureLinks.hasOwnProperty(i)) {
                    rows += '<tr><td colspan="2"><hr></td></tr>';
                    rows += '<tr><td colspan="2"><strong>' + $.translate('ssl.whynopadlock.FOUNDIN') + ': ' + i + '</strong></td></tr>';

                    count += results.ExternalInsecureLinks[i].length;

                    for (var j in results.ExternalInsecureLinks[i]) {
                        if (results.ExternalInsecureLinks[i].hasOwnProperty(j)) {
                            rows += '<tr><td>' + $.translate('ssl.whynopadlock.insecurelink', 1) + ':</td><td>' + results.ExternalInsecureLinks[i][j] + '</td></tr>';
                        }
                    }
                }
            }

            table += rows;

            return [table, count];
        }

        return [table, 0];
    }
});