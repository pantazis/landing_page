$(document).ready(function () {
    $('#pbas_link_form').prepare_form_advanced({
        onSuccess           : function () {
            if(typeof link_cont_ong != 'object')
                link_cont_ong = new $.ajax_prototype({
                    type        : 'POST',
                    url         : '',
                    success     : function (data) {
                        if(data.success){
                            if('route' in data.data){
                                redirect = data.data.route;
                            }else if('pending_sync' in data.data){
                                $('#pendingSync').modal_open();
                            }
                        }else
                            globalApplicationErrors(data, 'pbas_link_form')
                    },
                    complete    : function () {
                        if(typeof redirect != 'undefined'){
                            window.location.href = redirect;
                        }else{
                            $.enable_form_controls('pbas_link_form');
                            $('.submitText').show();
                            $('.loading').hide();
                        }
                    }
                }, 'pbas_link_form');

            link_cont_ong.data = {
                '_token'    : $('[name="_token"]').val()
            };

            var myCPPass = $('[name="password"]');

            if(myCPPass.length){
                link_cont_ong.data.password = myCPPass.val()
            }else{
                link_cont_ong.data.acct_id  = $('[name="acct_id"]').val()
            }

            if ($('[name="agree_terms"]:checked').length) {
                link_cont_ong.data.data_validity = $('[name="data_validity"]').val();
                link_cont_ong.data.processing_approval = $('[name="processing_approval"]').val();
            }

            $.ajax(link_cont_ong);
        },
        handlers     		: '#linkSubmit',
        disable     		: '#linkSubmit',
        version_exception   : true
    })
});
