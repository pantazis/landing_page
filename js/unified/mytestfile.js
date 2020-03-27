$(document).ready(function(){function open_cart_modal(target,modalScroll){target.activation(true,function(){if(typeof modalScroll=="undefined")disableBodyScroll();else disableBodyScrollModalScroll(target)})}function close_cart_modal(target){target.activation(false,function(){enableBodyScroll()})}function domainEditSettingOpen(obj){var content=obj.closest(".content");var item=obj.closest(".item");var form_cont=content.find(".attr-form");var attr_items=obj.closest(".attr-items");var form=form_cont.find("form");
item.find(".attr-items").show();item.find(".attr-form").hide();attr_items.hide();form_cont.show();if(!form.hasClass("under_validation"))prepareDomainSettingForm(obj,form,attr_items,form_cont)}function prepareDomainSettingForm(obj,form,attr_items,form_cont){var validation_config={onSuccess:function(){commonValidationCallback(obj)},disable_exception:true,cancel:{handler:".setting_cancel",callback:function(){getTheCorrespondingCancelForm(obj,form,attr_items)}},callback:{"after:prepare":function(){getTheCorrespondingPrepareCallbackMethod(obj)}}};
validation_config=getTheCorrespondingFormHandlers(obj,validation_config);validation_config=getTheCorrespondingFormTriggers(obj,validation_config,form);validation_config=getTheCorrespondingFormVControl(obj,validation_config);form.prepare_form_advanced(validation_config)}function getTheCorrespondingFormHandlers(obj,validation_config){if(obj.attr("data-edit")=="nameservers")validation_config.handlers=".submit-edit";else if(obj.attr("data-edit")=="contacts")validation_config.handlers=".submit-edit";return validation_config}
function getTheCorrespondingCancelForm(obj$jscomp$0,form,attr_cont){if(obj$jscomp$0.attr("data-edit")=="contacts")form.find("[data-last-val]").each(function(){var obj=$(this);var val=JSON.parse(obj.attr("data-last-val"))[0];if(obj.is("select"))obj.chosen_update(val);else obj.val(obj)});else if(obj$jscomp$0.attr("data-edit")=="nameservers")cancelNameServerGroup(obj$jscomp$0,form);form.closest(".attr-form").hide();attr_cont.show()}function cancelNameServerGroup(obj,form){var item=obj.closest(".item");
var ns_cont=item.find(".ns_container");var item_logs=logs[item.attr("data-cart-item-id")].name_servers;ns_cont.find(".noNS").remove();form.find(".submit-edit").removeClass("disabled");if("groupId"in item_logs){var item_logs_length=1;form.find(".ns_group").chosen_update(item_logs.groupId).change()}else if("values"in item_logs){var ns_group=form.find(".ns_group");form.find(".ns_container").empty();if(ns_group.length)ns_group.chosen_update("nons").change();item_logs_length=item_logs.values.length;$.each(item_logs.values,
function(key,value){var ns=form.find(".nameservers:eq("+key+")");if(ns.length<1)form.find(".addNameServers").click();ns=form.find(".nameservers:eq("+key+")");ns.val(value)})}else{ns_group=form.find(".ns_group");if(ns_group.length&&ns_group.val())ns_group.chosen_update("").change();form.find(".add_nameserver_cont").hide();ns_cont.empty()}for(var i=item_logs_length;i<ns_cont.find(".nameservers").length;i++)$(this).closest(".row").remove();if("values"in item_logs){controlDeleteButtons(form);controlAddNameServerCont(form)}}
function getTheCorrespondingFormTriggers(obj,validation_config,form){if(obj.attr("data-edit")=="contacts");return validation_config}function getTheCorrespondingFormVControl(obj,validation_config){if(obj.attr("data-edit")=="contacts")validation_config.version_exception=true;else if(obj.attr("data-edit")=="nameservers")validation_config.version_exception=true;return validation_config}function commonValidationCallback(obj){var item=obj.closest(".item");var form=item.find("."+obj.attr("data-edit")+"_cont form");
var formId=form.attr("id");var modal=$("#saveToGroup");if(!form_request_obj[formId])form_request_obj[formId]=domain_objects();form_request_obj[formId].url=edit_contacts.replace("##id##",item.attr("data-cart-item-id"));form_request_obj[formId].data={"_token":form.find('[name\x3d"_token"]').val(),"unique_id":unique_page_identifier};form_request_obj[formId].triggered_item='[data-cart-item-id\x3d"'+item.attr("data-cart-item-id")+'"]';form_request_obj=getProperCollectDataMethod(obj,form,form_request_obj);
var nsOption=form.find(".ns_group").val();if(obj.attr("data-edit")=="contacts"||modal.length<1||nsOption&&nsOption!="nons")$.ajax(form_request_obj[formId]);else{var toSave=$.makeArray(form.find(".nameservers").filter(function(){return $(this).closest(".row").css("display")!="none"}).map(function(a,b){return $(b).val()})).join().replace(/,{2,}/,",").trim().replace(/,$/g,"");if(form.find(".nameservers").length&&toSave)modal.modal_open().attr("data-about",formId);else{$.ajax(form_request_obj[formId]);
form.find("a.disabled").removeClass("disabled")}}}function getProperCollectDataMethod(obj,form,form_request_obj){if(obj.attr("data-edit")=="nameservers")return nameserversCollectData(obj,form,form_request_obj);else if(obj.attr("data-edit")=="contacts")return contactsCollectData(obj,form,form_request_obj)}function nameserversCollectData(obj,form,form_request_obj){form_request_obj[form.attr("id")].data.object="nameservers";var ns_group=form.find(".ns_group");if(ns_group.length&&ns_group.val()&&ns_group.val()!=
"nons")form_request_obj[form.attr("id")].data.nameservers_group_id=ns_group.val();else{var nameservers=$.makeArray(form.find("input:visible").map(function(a,b){return $(b).val()})).join().replace(/,{2,}/,",").trim().replace(/^,|,$/g,"");if(nameservers){nameservers=nameservers.split(",");form_request_obj[form.attr("id")].data.nameservers=nameservers}}return form_request_obj}function contactsCollectData(obj,form,form_request_obj){form_request_obj[form.attr("id")].data.object="contacts";form.find("select").each(function(){form_request_obj[form.attr("id")].data[$(this).attr("name")]=
$(this).find("option:selected").val()});return form_request_obj}function getTheCorrespondingPrepareCallbackMethod(obj){}function setGroupToNameServers(form,nameservers){var ns_container=form.find(".ns_container");ns_container.empty();form.find(".submit-edit").removeClass("disabled");$.each(nameservers,function(key,data){ns_container.append("\x3cspan\x3e"+data.name+"\x3c/span\x3e")});form.find(".add_nameserver_cont").hide()}function setEmptyGroup(form){form.find(".ns_container").empty().append('\x3cp class\x3d"noNS"\x3eThis nameserver group has no nameservers\x3c/p\x3e');
form.find(".submit-edit").addClass("disabled")}function removeGroupSelection(form){var ns_container=form.find(".ns_container");if(ns_container.find(".nameservers").length)return;ns_container.find("span").remove();ns_container.find(".noNS").remove();if(form.find(".ns_group").val()){form.find(".submit-edit").removeClass("disabled");ns_container.find(".nameservers:first").val("").disabled(false);ns_container.find(".nameservers:not(:first)").closest(".row").remove();if(form.find(".nameservers").length<
1)if(ns_container.attr("data-min")==0)form.find(".addNameServers").click();else for(var i=0;i<ns_container.attr("data-min");i++)form.find(".addNameServers").click();controlDeleteButtons(form);controlAddNameServerCont(form)}else{ns_container.empty();form.find(".add_nameserver_cont").hide()}}function controlDeleteButtons(form){var ns=form.find(".nameservers").filter(function(){return $(this).closest(".row").css("display")!="none"});if(ns.length<=form.find(".ns_container").attr("data-min"))form.find(".delete_server").hide();
else form.find(".delete_server").show()}function controlAddNameServerCont(form){if(form.find(".nameservers:visible").length<form.find(".ns_container").attr("data-max"))form.find(".add_nameserver_cont").show();else form.find(".add_nameserver_cont").hide()}function saveSSLInstallationSettings(item){var target_domains=item.find(".target_domains");var data$jscomp$0={"_token":$('[name\x3d"_token"]').val(),"domain":item.find(".target_domains").val(),"unique_id":unique_page_identifier,"object":"domain"};
var url=edit_ssl_settings.replace("##id##",target_domains.attr("name").match(/[0-9]+/g)[0]);var itemId=item.attr("data-cart-item-id");target_domains.element();if(target_domains.hasClass("error"))return;$.ajax(new $.ajax_prototype({"type":"POST","url":url,"data":data$jscomp$0,"beforeSend":function(){item.find(".help-block").remove();item.find(".save_target_domains .submitText").hide();item.find(".save_target_domains .loading").show();activateFormDim()},"success":function(data){deactivateFormDim();
if(data.success){data.data.instance=this;$.cart.view.reCreateCartSummary(data.data)}else{if(data.code==error_codes.validation_error&&"domain"in data.data){target_domains.addClass("error").after(helperBlock);item.find(".help-block").html(data.data.domain.join("\x3cbr\x3e"))}globalApplicationErrors(data)}},"preerrorcallback":function(){deactivateFormDim()},"triggered_item":'[data-cart-item-id\x3d"'+(itemId?item.attr("data-cart-item-id"):item.closest("[data-cart-item-id]").attr("data-cart-item-id"))+
'"]'}))}function saveStandAloneSSLInstallationSettings(item){var target_domains=item.find(".target_domains");var data$jscomp$0={"_token":$('[name\x3d"_token"]').val(),"domain":item.find(".target_domains").val(),"unique_id":unique_page_identifier,"object":"domain"};var url=edit_ssl_settings.replace("##id##",item.attr("data-cart-item-id"));var itemId=item.attr("data-cart-item-id");target_domains.element();if(target_domains.hasClass("error"))return;$.ajax(new $.ajax_prototype({"type":"POST","url":url,
"data":data$jscomp$0,"beforeSend":function(){item.find(".help-block").remove();item.find(".save_target_domains .submitText").hide();item.find(".save_target_domains .loading").show();activateFormDim()},"success":function(data){deactivateFormDim();if(data.success){data.data.instance=this;$.cart.view.reCreateCartSummary(data.data)}else{if(data.code==error_codes.validation_error&&"domain"in data.data){target_domains.after(helperBlock);item.find(".help-block").html(data.data.domain.join("\x3cbr\x3e"))}globalApplicationErrors(data)}},
"preerrorcallback":function(){deactivateFormDim()},"triggered_item":'[data-cart-item-id\x3d"'+(itemId?item.attr("data-cart-item-id"):item.closest("[data-cart-item-id]").attr("data-cart-item-id"))+'"]'}))}function convertSslDomainDisplayToEditable(obj){var domain=obj.find(".target_domain_display").text();var cartItemId=obj.find("[data-domain-for-cart-item]").attr("data-domain-for-cart-item");obj.after($("#ssl_installation_required_domain").html().replace(/##id##/g,cartItemId));var newInput=obj.next(".get-ssl-domain");
obj.remove();newInput.find("input").val(domain);newInput.show(0,function(){$('[name\x3d"target_domains_'+cartItemId+'"]').focus()}).focus()}function convertSslDomainDisplayToEditableForStandAlone(obj){var domain=obj.find(".target_domain_display").text();var cartItemId=obj.closest("[data-cart-item-id]").attr("data-cart-item-id");obj.closest(".row").after($("#ssl_installation_required_domain_for_stand_alone").html().replace(/##id##/g,cartItemId));var newInput=$('[name\x3d"target_domains_'+cartItemId+
'"]').closest(".get-ssl-domain");obj.closest(".row").remove();newInput.find("input").val(domain);newInput.show(0,function(){$('[name\x3d"target_domains_'+cartItemId+'"]').focus()}).focus()}function handle_order_forms(form){if(form.is_ready())form.validate();else{prepareOrderForm(form);form.validate()}}function prepareOrderForm(form$jscomp$0){var formConfiguration={onSuccess:function(){if(checkout_sent==false){checkout_sent=true;$("#submitOrder").addClass("requestTrigger");var formId=form$jscomp$0.attr("id");
if(!form_request_obj[formId])form_request_obj[formId]=new $.ajax_prototype({type:"POST",url:"/cart/checkout",success:function(data){if(data.success){if(data.data.payment_route)redirect=data.data.payment_route;else{$("#orderId").text(data.data.document.id);$("#orderLink").attr("href",order.replace("##id##",data.data.document.id));$(".cart_step").hide();$("#checkout-summary").show();$("#paymentStep").addClass("active")}var cacheName=cacheNames.domainSearch;if(app_env=="local")cacheName+="_beta";localStorage.setItem(cacheName,
JSON.stringify({cache:{},updater:unique_page_identifier,updatedFor:""}));if(app_env!="local"){var custom_variables=[{name:"__order_id",value:data.data.document.id},{name:"__order_price",value:data.data.document.total}];LC_API.trigger_sales_tracker("dPpPWjmvfBMvOUxSB6tMFGKY9WgBt3fZ",custom_variables)}}else if(data.code==error_codes.validation_error&&"pay_method"in data.data){var form=$("#credit_payment_form:visible,#no_credit_payment_form:visible");if(form.attr("id")=="no_credit_payment_form")var cont=
form.find(".payment_method_containers").closest(".row");else{var $method=$('[name\x3d"pay_method"]:first');cont=$method.closest("ul")}if(cont.length<1)cont=$method.closest(".payment_method_containers").closest(".columns");cont.displayIndividualErrors(data.data.pay_method)}else{if(data.data!=null&&"order_agreement"in data.data){$('[name\x3d"order_agreement"]').closest("div").find("a").displayIndividualErrors(data.data.order_agreement);delete data.data.order_agreement}globalApplicationErrors(data,formId)}},
complete:function(){checkout_sent=false;if(typeof redirect!="undefined")window.location.href=redirect;else{$.enable_form_controls(formId);$(".submitText").show();$(".loading").hide()}}},form$jscomp$0.attr("id"));var data$jscomp$0={"_token":$('[name\x3d"_token"]').val()};var payment_method=$('[name\x3d"pay_method"]:checked');var credit_payment=$("#credit_payment:checked");var credit_limit=$("#credit_limit:checked");if(payment_method.length){payment_method=payment_method.val();if(payment_method==3)data$jscomp$0.use_cr_adj=
1;else data$jscomp$0.pay_method=payment_method}if(credit_payment.length)data$jscomp$0.use_cr_adj=1;if(credit_limit.length)data$jscomp$0.use_cr_limit=1;var aggremment=$('[name\x3d"order_agreement"]:checked');if(aggremment.length)data$jscomp$0.order_agreement=1;if($("#order-agrmt:checked").length){data$jscomp$0["processing_approval"]=$('[name\x3d"cart_gdpr_processing_approval"]').val();data$jscomp$0["data_validity"]=$('[name\x3d"cart_gdpr_data_validity"]').val()}form_request_obj[formId]["data"]=data$jscomp$0;
$.ajax(form_request_obj[formId])}},version_exception:true};if(form$jscomp$0.attr("id")=="credit_payment_form")$.observers.observe("payment_methods",$("#payment_method_list"),payment_methods);formConfiguration=orderFormTriggers(form$jscomp$0,formConfiguration);form$jscomp$0.prepare_form_advanced(formConfiguration)}function orderFormTriggers(form,config){if(form.attr("id")=="credit_payment_form")config.trigger=[{"item":form,"event":"change","callback":function(){var credit_payment=form.find('[name\x3d"use_cr_adj"]');
var credit_limit=form.find('[name\x3d"use_cr_limit"]');var payment_total=$("#payment_total");var payment_method_list=$("#payment_method_list");var payment_required=true;if(credit_limit.prop("checked")){payment_total.text(payment_totals.credit_limit.display);payment_required=payment_totals.credit_limit.payment_required}else if(credit_payment.prop("checked")){payment_total.text(payment_totals.credit.display);payment_required=payment_totals.credit.payment_required}else{payment_total.text(payment_totals.none.display);
payment_required=payment_totals.none.payment_required}if(payment_required)payment_method_list.removeClass("disabled-options");else payment_method_list.addClass("disabled-options")}},{"item":"#credit_limit","event":"change","callback":function(){if($(this.item).prop("checked"))$("#credit_payment").prop("checked",true)}},{"item":"#credit_payment","event":"change","callback":function(){if(!$(this.item).prop("checked"))$("#credit_limit").prop("checked",false)}}];return config}function addNewNameServer(obj){var form=
obj.closest("form");var ns_container=form.find(".ns_container");var current_ns=form.is(":visible")?form.find(".nameservers:visible"):form.find(".nameservers");var next_index=++current_ns.length;var next_ns=ns_container.find('[data-name\x3d"nameserver_'+next_index+'"]');ns_container.find(".noNS").remove();form.find(".submit-edit").removeClass("disabled");if(next_ns.length)next_ns.show().val("");else ns_container.append($("#nameservers_input_temp").html().replace(/##index##/g,current_ns.length));if(next_index>
ns_container.attr("data-min"))ns_container.find(".delete_server").show();if(next_index>=ns_container.attr("data-max"))form.find(".add_nameserver_cont").hide()}function removeNameserver(obj){var cont=obj.closest(".ns_container");var form=obj.closest("form");var input=obj.closest("div").find("input");var values=$.makeArray(obj.closest(".ns_container").find("input:visible").map(function(a,b){return $(b).val()})).join(",").replace(input.val(),"").replace(/,{2,}/,",").replace(/^,|,$/,"");if(values){values=
values.split(",");$.each(values,function(key,value){var ns=form.find(".nameservers:eq("+key+")");if(ns.length<1)form.find(".addNameServers").trigger("click");ns=form.find(".nameservers:eq("+key+")");ns.val(value)})}cont.find(".row:visible:last").hide();controlDeleteButtons(form);controlAddNameServerCont(form)}function assignNSGroup(obj){var form=obj.closest("form");if(obj.val()&&obj.val()!="nons"){var nameservers=nsgroups[obj.val()].nameservers;if(nameservers&&nameservers.length)setGroupToNameServers(form,
nameservers);else setEmptyGroup(form)}else removeGroupSelection(form);obj.blur()}function logDomains(){$('[data-group\x3d"domains"]').each(function(){var obj=$(this);var ns_container=obj.find(".ns_container");var group_container=obj.find(".ns_group");if(group_container.length&&group_container.val()&&group_container.val()!="nons")logs[obj.attr("data-cart-item-id")]={name_servers:{groupId:group_container.val()}};else if(ns_container.length){var ns=ns_container.find(".nameservers");logs[obj.attr("data-cart-item-id")]=
{name_servers:{}};if(ns.length){logs[obj.attr("data-cart-item-id")].name_servers.values=[];ns.each(function(){logs[obj.attr("data-cart-item-id")].name_servers.values.push($(this).val())})}}})}function cartContactHandler(data){var modal=$("#createContact");var modal_form=modal.find("form");var form=$("#"+modal.attr("data-form"));$(".contactProfileManager").each(function(){var obj=$(this);var current=obj.val();obj.append('\x3coption value\x3d"'+data.data.contactId+'"\x3e'+data.data.name+"\x3c/option\x3e").chosen_update(current?
current:"")});form.find(".contactProfileManager").chosen_update(data.data.contactId);modal_form.find("input:visible").val("").trigger("input");modal.find("#person_type").chosen_update("");modal.find("#state_id").chosen_update("");modal.find('[id*\x3d"country"]').chosen_update("GR").change();modal.find('[class*\x3d"hide-for-"]').hide();modal.find(".button.disabled").removeClass("disabled");close_cart_modal(modal);$(".contactWRN").hide();$(".contactLabel").show();contacts.list.push({"id":data.data.contactId,
"name":data.data.name,"enom_ready":data.data.enom_ready,"eurid_ready":data.data.eurid_ready,"forth_ready":data.data.forth_ready})}function contactById(a){if(a.id==contactId)return a}function getNameServerById(a){if(a.id==nameServerId)return a}function controlUpSells(obj$jscomp$0){var data$jscomp$0={"_token":$('[name\x3d"_token"]').val(),"unique_id":unique_page_identifier};var upSaleObj={type:"POST",success:function(data){deactivateFormDim();var instance=this;data.data.instance=instance;unsetLoader(instance.triggered_item);
if(data.success){$.cart.view.reCreateCartSummary(data.data);if(app_env!="local"&&"remarketing_items"in data.data)if(obj$jscomp$0.prop("checked"))$.sendAddToCartRemarketingEvent(data.data.remarketing_items);else $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items)}else $.cart.errorHandler(data)},beforeSend:function(){activateFormDim();var instance=this;var obj=$(instance.triggered_item);var $upsell=$(instance.triggered_item).filter("input");if($upsell.length<1)$upsell=$(instance.triggered_item).find("input");
if($upsell.hasClass("item"))$upsell=$upsell.find('[type\x3d"checkbox"]');if($upsell.prop("checked")){addLayerLoader(instance.triggered_item,true,true);registerLoader(instance.triggered_item)}else{pending_delete.push(instance.triggered_item);var parentId='[data-cart-item-id\x3d"'+$upsell.closest('[data-group\x3d"ssl"]').attr("data-cart-item-id")+'"]';addLayerLoader(parentId,true,true);up_sell_delete.push(parentId);registerLoader(instance.triggered_item)}},error:function(){deactivateFormDim();unsetLoader(this.triggered_item)}};
if(obj$jscomp$0.prop("checked")){upSaleObj.url=up_sell_add;data$jscomp$0.sku=obj$jscomp$0.attr("data-product-sku");data$jscomp$0.parent=obj$jscomp$0.closest('[data-group\x3d"ssl"], .cross_sale').attr("data-cart-item-id")}else{upSaleObj.url=up_sell_remove;data$jscomp$0.cart_item_id=obj$jscomp$0.attr("data-cart-item-id")}var itemId=obj$jscomp$0.attr("data-cart-item-id");upSaleObj.triggered_item='[data-cart-item-id\x3d"'+(itemId?obj$jscomp$0.attr("data-cart-item-id"):obj$jscomp$0.closest("[data-cart-item-id]").attr("data-cart-item-id"))+
'"]';data$jscomp$0.unique_id=unique_page_identifier;upSaleObj.data=data$jscomp$0;if(upSaleObj.url)$.ajax(upSaleObj)}function addLayerLoader(item,$show_total_loader,$show_loader,$price_loader,$object_loader){var $item=$(item);var $loader='\x3cdiv class\x3d"item_loader" style\x3d"/*background-color: rgba(28, 29, 30, 0.7);*/ height: 100%; margin-left: -0.75rem; position: absolute; top: 0; width: 100%;"\x3e';if($show_loader)$loader+='\x3cdiv class\x3d"loading" style\x3d"left: 50%; margin-left: -1.5rem; margin-top: -1.5rem; position: absolute; top: 50%;"\x3e\x3cspan class\x3d"spinner bigger dark"\x3e\x3c/span\x3e\x3c/div\x3e';
$loader+="\x3c/div\x3e";if(typeof $object_loader=="undefined")if($item.hasClass("item"))$item.css("position","relative").append($loader);else $item.closest(".item").css("position","relative").append($loader);else{$object_loader.find(".submitText").hide();$object_loader.find(".loading").show()}if(typeof $price_loader!="undefined"&&$price_loader)$item.find(".price:first").css("position","relative").html('\x3cdiv class\x3d"loading" style\x3d"right: 1rem; top: 0.75rem;"\x3e\x3cspan class\x3d"spinner smaller dark"\x3e\x3c/span\x3e\x3c/div\x3e');
if($show_total_loader){var prices=$("#itemsWrapper").find(".prices-box");prices.find("ul").hide();prices.find(".loading").show()}}function registerLoader(item){var temp=$(item);if(!temp.hasClass("item"))item='[data-cart-item-id\x3d"'+temp.closest(".item").attr("data-cart-item-id")+'"]';active_loaders.push(item)}function unsetLoader(item){deactivateFormDim();if(typeof active_loaders=="undefined"||active_loaders.length<1)return;var $item=$(item);if(!$item.hasClass("item")||$item.length<1){$item=$item.closest(".item");
if($item.length<1){$item=$('[data-contains\x3d"'+item.match(/[0-9]+/)+'"]');$item.removeAttr("data-contains")}}if($item.length){$item.find(".item_loader").remove();var itemId='[data-cart-item-id\x3d"'+$item.attr("data-cart-item-id")+'"]'}else itemId=item;active_loaders=active_loaders.join(",").replace(itemId,"").replace(/^,|,$/g,"").replace(/,{2,}/g,",");if(active_loaders=="")active_loaders=[];else active_loaders=active_loaders.split(",");if(up_sell_delete.length){item='[data-cart-item-id\x3d"'+$(item).closest(".item").attr("data-cart-item-id")+
'"]';up_sell_delete=up_sell_delete.join(",").replace(item,"").replace(/^,|,$/g,"").replace(/,{2,}/g,",");if(up_sell_delete=="")up_sell_delete=[];else up_sell_delete=up_sell_delete.split(",")}}function handleEventsOnIdle(data){data=data.msg||data;if("unique_id"in data&&data.unique_id==unique_page_identifier)return;if("execution_time"in data&&new Date(data.execution_time*1E3)<new Date($loadTime))return;var idleModal=$("#idleCartNotice");if(idleModal.is(":hidden"))idleModal.modal_open()}function rebuildCheckoutForm(settings){if(typeof settings==
"undefined")return;if(settings.use_credit)if(settings.credit_adjustment_suffice){var $valueSelected=$('[name\x3d"pay_method"]:checked').val();$(".payment-options .no-credit").show();$(".payment-options .credit").hide();$("#creditsSuffice").closest(".columns").show().find(".credit_payment_usable").text(settings.credits.usable.formated);$(".transactions").attr("class","transactions medium-4 columns");$('[name\x3d"pay_method"][value\x3d"'+$valueSelected+'"]').prop("checked",true).closest(".payment_method_containers").addClass("active")}else if(settings.credits.use||
settings.credit_limit.use){$(".payment-options .no-credit").hide();$(".payment-options .credit").show();if(settings.credits.use)$("#credit_payment").closest(".credit-box").show().find(".credit_payment_usable").text(settings.credits.usable.formated);else $("#credit_payment").closest(".credit-box").hide();if(settings.credit_limit.use)$("#credit_limit").closest(".credit-box").show().find(".credit_limit_usable").text(settings.credit_limit.usable.formated);else $("#credit_limit").closest(".credit-box").hide()}else{$(".payment-options .no-credit").show();
$(".payment-options .credit").hide();$("#creditsSuffice").closest(".columns").hide();$(".transactions:first").attr("class","transactions medium-5 large-4 columns medium-push-1 large-push-2");$(".transactions:last").attr("class","transactions medium-5 large-4 columns medium-push-1 large-pull-2")}else{$(".payment-options .no-credit").show();$(".payment-options .credit").hide();$("#creditsSuffice").closest(".columns").hide();$(".transactions:first").attr("class","transactions medium-5 large-4 columns medium-push-1 large-push-2");
$(".transactions:last").attr("class","transactions medium-5 large-4 columns medium-push-1 large-pull-2")}var form=$("#credit_payment_form,#no_credit_payment_form").filter(function(){return $(this).css("display")!="none"});form.each(function(){var obj=$(this);if(!obj.is_ready())prepareOrderForm(obj)});payment_totals=settings.total;setOrderTotalBasedOnPaymentSelection()}function setOrderTotalBasedOnPaymentSelection(settings){if(typeof settings!="undefined"){rebuildCheckoutForm(settings);return}var $total=
$("#payment_total");var amount=payment_totals.none.node;var paymethod=$('[name\x3d"pay_method"]:checked');if(paymethod.val()==3)amount=payment_totals.credit.display;if($("#credit_payment:visible:checked").length)amount=payment_totals.credit.display;if($("#credit_limit:visible:checked").length)amount=payment_totals.credit_limit.display;$total.text(amount)}function fixPricesForMediumDown(obj){var length=obj.find(".length.active");var price=length.find(".price-per-length").text();var text=length.text().replace(price,
" - "+price);var btn=obj.find("button");var strikethrough=length.find(".strikethrough");if(strikethrough.length){text=text.replace(strikethrough.text(),strikethrough.getOuterHTML());btn.html(text)}else btn.text(text)}function fixPricesForLargeUp(obj){var length=obj.find(".length.active");var price=length.find(".price-per-length").text();var text=length.text().replace(price,"").trim();var btn=obj.find("button");btn.text(text)}function setCommonNameToSslInstallation(obj){var item_id=obj.closest(".up_sell").find("[data-cart-item-id]").attr("data-cart-item-id");
$.ajax(new $.ajax_prototype({type:"POST",url:up_sell_update,data:{"_token":$('[name\x3d"_token"]').val(),"cart_item_id":item_id,"user_attributes":{"domain_name":obj.val()}},success:function(data,instance){if(data.success){var $item=$('[data-cart-item-id\x3d"'+instance.cart_item_id+'"]').closest(".product");var input=$item.find(".ssl_domain_name");input.attr("data-last-val",input.val());$item.find(".domain_name_display_container").show();$item.find(".domain_name_form_container").hide();$item.find(".domain_name_display").text(input.val());
$item.find(".edit_domain_name_attribute").text(APP_LANG.RESP_TABLE_ACTIONS.edit)}else globalApplicationErrors(data,"ssl_domain_name_form_"+instance.cart_item_id,{"user_attributes.domain_name":function(){return $("#ssl_domain_name_form_"+instance.cart_item_id+" .ssl_domain_name")}})},cart_item_id:item_id},"ssl_domain_name_form_"+item_id))}function upSellCancelForm(obj){var cont=obj.closest(".domain_name_attribute_container");cont.find(".domain_name_display_container").show();cont.find(".domain_name_form_container").hide();
cont.find(".help-block").remove();cont.find(".error").removeClass("error invalid");var input=cont.find(".ssl_domain_name");input.val(input.attr("data-last-val"))}function checkForErrorBeforeGoingToBilling(){var domainErrors=$('[data-group\x3d"domains"] .icon.alert');var sslErrors=$(".target_domains");if(domainErrors.length==0&&sslErrors.length==0){var scroll_target=$(".steps");$("html,body").animate({"scrollTop":scroll_target.position().top},500);$("#product-summary").hide();$("#billing-summary").show();
$("#billingStep").addClass("active");$("#paymentStep").removeClass("active")}else if(domainErrors.length){$("html,body").animate({"scrollTop":domainErrors.filter(":eq(0)").offset().top-80},500);var alert=$("#errorDomains");alert.show();cartDomainAlert=setTimeout(function(){alert.hide()},11E3)}else{$("html,body").animate({"scrollTop":sslErrors.filter(":eq(0)").offset().top-80},500);alert=$("#errorSsls");alert.show();cartDomainAlert=setTimeout(function(){alert.hide()},11E3)}}function sendCheckoutProgress(){if(checkoutProgressSent===
false&&app_env!="local"){$.getCurrentCartForAnalytics();checkoutProgressSent=true}}var form_request_obj={};var payment_methods={attributes:true};var active_loaders=[];var pending_delete=[];var up_sell_delete=[];var protected_items={};var checkoutProgressSent=false;var gdpr_approval_modal=$("#gdpr_approval_modal");var checkout_sent=false;$.observers.register("payment_methods",function(mutations){mutations.forEach(function(mutation){var disabled=mutation.target.className.indexOf("disabled-options")>
-1;var target_inputs=mutation.target.getElementsByTagName("input");var containers=document.getElementsByClassName("payment_method_containers");for(var i=0;i<target_inputs.length;i++)target_inputs[i].disabled=disabled;for(i=0;i<containers.length;i++){containers[i].className=containers[i].className.replace("active","").trim();containers[i].getElementsByTagName("input")[0].checked=false}})});$.getAddToCartConfiguredCart();$.getUpdateConfiguredCart();logs={};$.extend({cart_modals:{close:function(target){close_cart_modal(target)},
handlers:{cartContactHandler:function(data){cartContactHandler(data)}}},cart_loaders:{unsetLoader:function(triggered_item){unsetLoader(triggered_item)},get_protected_item:function(item){if(Object.keys(protected_items).length&&item in protected_items)return protected_items[item];return false},get_pending_delete:function(){return pending_delete},remove_pending_delete:function(item){pending_delete=pending_delete.join(",").replace(item,"").replace(/,{2,}/,",").replace(/^,|,$/,"");if(pending_delete=="")pending_delete=
[];else pending_delete=pending_delete.split(",")},get_active_loaders:function(){return active_loaders},find_up_sell_delete:function(item){return $.inArray(item,up_sell_delete)>-1}},request_flavors:{cart_edit:{properties:{type:"POST",success:function(data){data.data.instance=this;if(data.success)$.cart.view.reCreateCartSummary(data.data);else $.cart.errorHandler(data);if(app_env!="local"&&"remarketing_items"in data.data)$.updateItemInAnalytics(data.data.remarketing_items)},complete:function(){}},parameters:{beforeSend:function(instance){activateFormDim();
addLayerLoader(instance.triggered_item,true,false,true);registerLoader(instance.triggered_item)}},expansion:{presuccesscallback:function(instance){unsetLoader(instance.triggered_item)},preerrorcallback:function(instance){unsetLoader(instance.triggered_item)}}},up_sell:{properties:{type:"POST",success:function(data){data.data.instance=this;if(data.success)$.cart.view.reCreateCartSummary(data.data);else $.cart.errorHandler(data)},complete:function(){}},parameters:{beforeSend:function(instance){activateFormDim();
var obj=$(instance.triggered_item);var $upsell=$(instance.triggered_item).filter("input");if($upsell.length<1)$upsell=$(instance.triggered_item).find("input");if($upsell.hasClass("item"))$upsell=$upsell.find('[type\x3d"checkbox"]');if($upsell.prop("checked")){addLayerLoader(instance.triggered_item,true,true);registerLoader(instance.triggered_item)}else{pending_delete.push(instance.triggered_item);var parentId='[data-cart-item-id\x3d"'+$upsell.closest('[data-group\x3d"ssl"]').attr("data-cart-item-id")+
'"]';addLayerLoader(parentId,true,true);up_sell_delete.push(parentId);registerLoader(instance.triggered_item)}}},expansion:{presuccesscallback:function(instance){unsetLoader(instance.triggered_item)},preerrorcallback:function(instance){unsetLoader(instance.triggered_item)}}},cart_delete:{parameters:{beforeSend:function(instance){activateFormDim();addLayerLoader(instance.triggered_item,true,false,true);registerLoader(instance.triggered_item);pending_delete.push(instance.triggered_item);var $item=$(instance.triggered_item);
if($item.hasClass("cross_sale")){$item.prev("hr").remove();$item.closest(".item").attr("data-contains",instance.triggered_item.match(/[0-9]+/))}$item.remove();if($(".cart_step  .item:visible").length<1){var cont=$("#product-summary");cont.find(".footer, .cart-chechout").hide();cont.find("#itemsWrapper").append('\x3cdiv class\x3d"item"\x3e\x3cdiv class\x3d"loading" style\x3d"height: 4rem; top: 1.5rem; right: 0.5rem; text-align: center;"\x3e\x3cspan class\x3d"spinner bigger dark"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e')}}},
expansion:{presuccesscallback:function(instance){unsetLoader(instance.triggered_item)},preerrorcallback:function(instance){unsetLoader(instance.triggered_item)}}},cross_sell:{parameters:{beforeSend:function(instance){activateFormDim();addLayerLoader(instance.triggered_item,true,true);registerLoader(instance.triggered_item)}},expansion:{presuccesscallback:function(instance){unsetLoader(instance.triggered_item)},preerrorcallback:function(instance){unsetLoader(instance.triggered_item)}}},domain_objects:{properties:{type:"POST",
success:function(data){var modal=$("#saveToGroup");if(modal.length){modal.attr("data-about","").modal_close();modal.find(".button.disabled").removeClass("disabled");$("#nsGNameInput").val("");modal.find(".error").removeClass("error");modal.find(".help-block").remove()}data.data.instance=this;if(data.success)$.cart.view.reCreateCartSummary(data.data);else $.cart.errorHandler(data)},complete:function(){var modal=$("#saveToGroup");var loader_conts=modal.find(".loader_cont");loader_conts.find(".submitText").show();
loader_conts.find(".loading").hide()}},parameters:{beforeSend:function(instance){activateFormDim();addLayerLoader(instance.triggered_item,false,true,false,$(instance.triggered_item).find(".submit-edit:visible"));registerLoader(instance.triggered_item)}},expansion:{presuccesscallback:function(instance){unsetLoader(instance.triggered_item)},preerrorcallback:function(instance){unsetLoader(instance.triggered_item)}}}},rebuildCheckoutForm:function(settings){rebuildCheckoutForm(settings)},durations:{fixPricesForMediumDown:function(durations){if(durations.length>
1)durations.each(function(){fixPricesForMediumDown($(this))});else fixPricesForMediumDown(durations);return this},fixPricesForLargeUp:function(durations){if(durations.length>1)durations.each(function(){fixPricesForLargeUp($(this))});else fixPricesForLargeUp(durations);return this}}});$.fn.extend({controlDeleteButtons:function(){var obj=$(this);if(!obj.is("form"))obj=obj.closest("form");controlDeleteButtons(obj)}});var edit_request=$.ajax_variable_prototype(null,"cart_edit");var up_sell=$.ajax_variable_prototype(null,
"up_sell");var domain_objects=$.ajax_variable_prototype(null,"domain_objects");$(".login").on("click",function(e){$("#register-forms").modal_open();$(".step_buttons").removeClass("active")});$("#cartStep").on("click",function(){$(".cart_step").hide();$("#product-summary").show();$(".step_buttons").removeClass("active")});$("#billingProfileHandler").on("change",function(){if(typeof billingProfileUpdate!="object")billingProfileUpdate=new $.ajax_prototype({type:"POST",url:billing_update,data:{"_token":$('[name\x3d"_token"]').val(),
"unique_id":unique_page_identifier},success:function(data){if(data.success){var billingProfile=data.data.billingProfile;var checkout=data.data.checkout;var profileData="";var address="";$("#billingType").translate("billing.type."+billingProfile.type);if(billingProfile.type=="rec")var name=$(".account-text small").text();else{if(billingProfile.vat)profileData=$.translate("billing.vat")+": "+billingProfile.vat.substring(2);if(billingProfile.address&&billingProfile.zip&&Object.keys(billingProfile.country_detail).length)address=
billingProfile.address+", "+billingProfile.zip+" - ";if(billingProfile.country_detail.iso_2=="GR"){name=billingProfile.name;if(billingProfile.doy){if(profileData)profileData+=" - ";profileData+=$.translate("billing.doy")+": "+billingProfile.doy}if(billingProfile.state_detail&&Object.keys(billingProfile.state_detail).length)address+=billingProfile.state_detail.name_el+" ("+billingProfile.country_detail.name+")";else address=""}else{name=billingProfile.name;if(billingProfile.state)address+=billingProfile.state+
" ("+billingProfile.country_detail.name+")";else address=""}}$("#billingProfileName").set_text(name);$("#billingProfileData").text(profileData);$("#billingProfileAddress").text(address);$("#billingProfileVatRate").text("("+checkout.totals.vat_percent+"%)");$(".checkout_order_price").text($.imperial_to_metric(checkout.totals.sub_total));$(".checkout_order_vat").text($.imperial_to_metric(checkout.totals.vat));$order_total=$(".checkout_order_total");if($order_total.hasClass("relative"))$(".checkout_order_total").update_vat(relative,
[checkout.totals.sub_total],0);else $(".checkout_order_total").text($.imperial_to_metric(checkout.totals.grand_total));payment_totals=checkout.settings.total;setOrderTotalBasedOnPaymentSelection(checkout.settings)}else $.cart.errorHandler(data)}});billingProfileUpdate.data.billing_profile_id=$(this).val();$.ajax(billingProfileUpdate)});$(".new-billing-profile").on("click",function(e){e.preventDefault();open_cart_modal($("#createBilling"),true)});$(".modal-cancel").on("click",function(e){e.preventDefault();
close_cart_modal($(this).closest(".custom-modal"))});$("#nsSave, #nsGNameCancel").on("click",function(e){e.preventDefault();$("#nsIntro, #nsGName").toggle()});$(".payment-methods").on("change",function(){var obj=$(this);$(".payment_method_containers").removeClass("active");if($(".payment-methods:disabled").length){obj.closest(".payment_method_containers").addClass("active");return}$('.payment-methods[value\x3d"'+obj.val()+'"]').prop("checked",true).closest(".payment_method_containers").addClass("active");
if(obj.val()==3)$("#payment_total").text(payment_totals.credit.display);else $("#payment_total").text(payment_totals.none.display)});$("#submitOrder").on("click",function(e){e.preventDefault();var form=$("#checkout_terms_conditions_form");if(!form.is_ready())form.prepare_form_advanced({onSuccess:function(){handle_order_forms($("#credit_payment_form:visible,#no_credit_payment_form:visible"))},version_exception:true});form.validate()});$("#reloadCart").on("click",function(e){e.preventDefault();location.reload(true)});
$.observers.register("gdpr_approval",function(mutations){try{clearTimeout(modalActivbationTimer)}catch(e){}modalActivbationTimer=setTimeout(function(){$(mutations[0].target).find('[name\x3d"agree_terms"]').prop("checked",false)},100)});$.observers.observe("gdpr_approval",$("#createContact"),{attributes:true,attributeFilter:["class"]});$.observers.observe("gdpr_approval",$("#createBilling"),{attributes:true,attributeFilter:["class"]});$.observers.register("gdpr_info_modal",function(mutations){var creationModal=
$(".custom-modal.active");if(creationModal.length)if(gdpr_approval_modal.hasClass("open")){gdpr_approval_modal.css("z-index",parseInt(creationModal.css("z-index"))+1);$(".reveal-modal-bg").css("z-index",parseInt(creationModal.css("z-index"))+1)}else disableBodyScrollModalScroll(creationModal)});$.observers.observe("gdpr_info_modal",$("#gdpr_approval_modal"),{attributes:true,attributeFilter:["class"]});var groupCreate=$("#ns_group_create_form");if(groupCreate.length){groupCreate.prepare_form_advanced({onSuccess:function(){var form=
$("#ns_group_create_form");var modal=form.closest(".reveal-modal");var name_input=$("#nsGNameInput:visible");if(name_input.length)form_request_obj[modal.attr("data-about")].data.nameserver_group_name=name_input.val();if($('[name\x3d"trigger_ns_group_save"]:checked').val()=="yes"&&name_input.length<1){$("#nsIntro").hide();$("#nsGName").show()}else $.ajax(form_request_obj[modal.attr("data-about")])},handlers:"#nsRadioSubmit, #nsGNameSave",disable:".setting_cancel,.submit-edit",disable_exception:true,
version_exception:true});$.observers.register("saveToGroup",function(mutations){$("#nsIntro").show().find('[type\x3d"radio"]').prop("checked",false);$("#nsGName").hide().find("#nsGNameInput").val("")});$.observers.observe("saveToGroup",$("#saveToGroup"),{attributes:true,attributeFilter:["class"]})}$(document).on("click",".item_length",function(e){e.preventDefault();var obj=$(this);var duration=obj.closest(".item_duration");var duration_head=duration.find("button");var item=obj.closest("[data-cart-item-id]");
var price=obj.attr("data-price");var $edit_item=edit_request();$edit_item.url=edit_url.replace("##id##",item.attr("data-cart-item-id"));$edit_item.data={_token:$('[name\x3d"_token"]').val(),length:obj.attr("data-length"),unique_id:unique_page_identifier,settings:{}};$edit_item.triggered_item='[data-cart-item-id\x3d"'+obj.closest("[data-cart-item-id]").attr("data-cart-item-id")+'"]';duration.find(".active").removeClass("active");obj.closest("li").addClass("active");durationSizeProcess(duration);$.ajax($edit_item)}).on("click",
".add_cross_sell",function(e){e.preventDefault();var obj=$(this);var parent_id=obj.closest(".item").attr("data-cart-item-id");var dropdown=obj.find(".f-dropdown.open");var sku=obj.attr("data-cross-product-sku");var data$jscomp$0={"_token":$('[name\x3d"_token"]').val(),"parent":parent_id,"unique_id":unique_page_identifier,"sku":sku};if(sku.indexOf("sha_lin")>-1)data$jscomp$0["length"]=$(".item_duration #item_"+parent_id+" .length.active .item_length").attr("data-length");if(!$.isTouch()||dropdown.length)$.ajax($.ajax_get_flavor({type:"POST",
url:cart_add,data:data$jscomp$0,success:function(data){data.data.instance=this;if(data.success){$.cart.view.reCreateCartSummary(data.data);if(app_env!="local"&&"remarketing_items"in data.data)$.sendAddToCartRemarketingEvent(data.data.remarketing_items)}else $.cart.errorHandler(data)},complete:function(){},triggered_item:'[data-cart-item-id\x3d"'+obj.closest(".item").attr("data-cart-item-id")+'"]'},"cross_sell"))}).on("change",'[data-group\x3d"ssl"] select',function(){var obj=$(this);var item=obj.closest(".item");
var $edit_item=edit_request();$edit_item.url=edit_url.replace("##id##",item.attr("data-cart-item-id"));$edit_item.data={"_token":$('[name\x3d"_token"]').val(),"length":parseInt(item.find(".active [data-length]").attr("data-length")),"unique_id":unique_page_identifier,"settings":{}};$edit_item.data.settings[obj.attr("name")]=parseInt(obj.val());$edit_item.triggered_item='[data-cart-item-id\x3d"'+item.attr("data-cart-item-id")+'"]';$.ajax($edit_item);obj.blur();obj.closest("div").find(".chosen-container").removeClass("chosen-container-active")}).on("click",
"#goToCheckOut:not(.disabled)",function(){checkForErrorBeforeGoingToBilling();sendCheckoutProgress()}).on("click","#billingStep:not(.login):not(.disabled)",function(){checkForErrorBeforeGoingToBilling();sendCheckoutProgress()}).on("click","#goToCheckOut.disabled",function(e){e.preventDefault()}).on("click",".domainEdit:not(.login)",function(e){e.preventDefault();domainEditSettingOpen($(this))}).on("click",".domainEdit.login",function(e){e.preventDefault();$("#register-forms").modal_open()}).on("click",
".addNameServers",function(e){e.preventDefault();addNewNameServer($(this))}).on("click",".delete_server",function(e){e.preventDefault();removeNameserver($(this))}).on("change",".ns_group",function(){assignNSGroup($(this))}).on("click",".new-contact-profile",function(e){e.preventDefault();open_cart_modal($("#createContact").attr("data-form",$(this).closest("form").attr("id")),true)}).on("change",".up_sell_manager",function(e){controlUpSells($(this))}).on("click",".edit_domain_name_attribute",function(e){e.preventDefault();
var obj$jscomp$0=$(this).closest(".domain_name_attribute_container");obj$jscomp$0.find(".domain_name_display_container").hide();obj$jscomp$0.find(".domain_name_form_container").show();var form=obj$jscomp$0.find(".ssl_domain_name_form");if(!form.is_ready())form.prepare_form_advanced({onSuccess:function(){setCommonNameToSslInstallation(form.find(".ssl_domain_name"))},version_exception:true,handlers:".submit-edit",disable:".submit-edit,.up_sell_cancel",cancel:{handler:".up_sell_cancel",callback:function(obj){upSellCancelForm(obj)}}})}).on("click",
".save_target_domains:not(.stand_alone)",function(e){e.preventDefault();saveSSLInstallationSettings($(this).closest(".up_sell"))}).on("click",".save_target_domains.stand_alone",function(e){e.preventDefault();saveStandAloneSSLInstallationSettings($(this).closest("[data-cart-item-id]"))}).on("keypress",".target_domains:not(.stand_alone)",function(e){if(e.which=="13"){e.preventDefault();saveSSLInstallationSettings($(this).closest(".up_sell"))}}).on("keypress",".target_domains.stand_alone",function(e){if(e.which==
"13"){e.preventDefault();saveStandAloneSSLInstallationSettings($(this).closest("[data-cart-item-id]"))}}).on("click",'[data-dropdown*\x3d"explanation-"]',function(e){e.preventDefault();e.stopPropagation()}).on("click",'[id*\x3d"explanation-"]',function(e){if(!$(e.target).is("a")){e.preventDefault();e.stopPropagation()}}).on("click",".edit_target_domains:not(.stand_alone)",function(e){e.preventDefault();convertSslDomainDisplayToEditable($(this).closest(".get-ssl-domain"))}).on("click",".edit_target_domains.stand_alone",
function(e){e.preventDefault();convertSslDomainDisplayToEditableForStandAlone($(this).closest(".get-ssl-domain"))});$(".get-ssl-domain").slideDown();var previousClassification="";var currentClassification;if($.getSizeClassification("medium_down"))var durationSizeProcess=fixPricesForMediumDown;else durationSizeProcess=fixPricesForLargeUp;setTimeout(function(){$.durations[durationSizeProcess.name]($("#product-summary .duration"))},350);$(window).on("resize",function(){if($.getSizeClassification("medium_down")){durationSizeProcess=
fixPricesForMediumDown;currentClassification="medium_down"}else{durationSizeProcess=fixPricesForLargeUp;currentClassification="large_up"}if(previousClassification!=currentClassification)$("#product-summary .duration").each(function(){durationSizeProcess($(this))});previousClassification=currentClassification});logDomains();prepareOrderForm($(".payment-options div:not(.hide) \x3e form:not(#checkout_terms_conditions_form)"));$.cookieHandler("cart_item",function($value){$("html,body").animate({scrollTop:$('[data-cart-item-id\x3d"'+
$value+'"]').offset().top},1E3)});setTimeout(function(){$("#billingProfileHandler_chosen").css("margin-bottom",0)},500);$('.cart_step select:not([name\x3d"additional_domains"]):not([name\x3d"servers"]), .custom-modal select:not([name\x3d"additional_domains"]):not([name\x3d"servers"])').each(function(){var select=$(this);select.apply_chosen({"value":select.val()?select.val():"","par":{search_contains:true}})});channel.cart.bind("App\\Events\\Cart\\CartItemWasCreated",function(data){handleEventsOnIdle(data)});
channel.cart.bind("App\\Events\\Cart\\CartItemsWereCreated",function(data){handleEventsOnIdle(data)});channel.cart.bind("App\\Events\\Cart\\CartItemWasDeleted",function(data){handleEventsOnIdle(data)});channel.cart.bind("App\\Events\\Cart\\CartItemWasUpdated",function(data){handleEventsOnIdle(data)});channel.cart.bind("App\\Events\\Cart\\ItemAlreadyInCart",function(data){handleEventsOnIdle(data)});channel.cart.bind("App\\Events\\Cart\\UpSellWasCreated",function(data){handleEventsOnIdle(data)});channel.cart.bind("App\\Events\\Cart\\UpSellWasDeleted",
function(data){handleEventsOnIdle(data)});channel.cart.bind("App\\Events\\Cart\\CartBillingProfileWasUpdated",function(data){handleEventsOnIdle(data)});channel.cart.bind("App\\Events\\Cart\\CartDomainObjectsUpdated",function(data){handleEventsOnIdle(data)});channel.billing.bind("App\\Events\\Billing\\DefaultProfileWasUpdated",function(data$jscomp$0){$.ajax(new $.ajax_prototype({"type":"POST","url":$reloadVatWidgetUrl,"success":function(data){},"complete":function(){handleEventsOnIdle(data$jscomp$0)}}))});
channel.billing.bind("App\\Events\\Billing\\BillingProfileWasAdded",function(data){handleEventsOnIdle(data)});channel.billing.bind("App\\Events\\Billing\\InvoiceProfileWasDeleted",function(data){handleEventsOnIdle(data)});channel.billing.bind("App\\Events\\Billing\\InvoiceProfileWasUpdated",function(data){handleEventsOnIdle(data)});channel.domain.bind("App\\Events\\Domains\\NameServerGroupWasCreated",function(data){handleEventsOnIdle(data)});channel.domain.bind("App\\Events\\Domains\\NameServerGroupWasUpdated",
function(data){handleEventsOnIdle(data)});channel.domain.bind("App\\Events\\Domains\\NameServerGroupWasDeleted",function(data){handleEventsOnIdle(data)});channel.domain.bind("App\\Events\\Domains\\NameServerWasUpdated",function(data){handleEventsOnIdle(data)});channel.domain.bind("App\\Events\\Domains\\NameServerWasDeleted",function(data){handleEventsOnIdle(data)});channel.contacts.bind("App\\Events\\Contacts\\ContactWasCreated",function(data){handleEventsOnIdle(data)});channel.contacts.bind("App\\Events\\Contacts\\ContactWasDeleted",
function(data){handleEventsOnIdle(data)})});

$(document).ready(function(){/*
 Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.1.0
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/
(function(){var _ref;var __hasProp={}.hasOwnProperty;var __extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)if(__hasProp.call(parent,key))child[key]=parent[key];ctor.prototype=parent.prototype;child.prototype=new ctor;child.__super__=parent.prototype;return child};var SelectParser=function(){function SelectParser(){this.options_index=0;this.parsed=[]}SelectParser.prototype.add_node=function(child){if(child.nodeName.toUpperCase()==="OPTGROUP")return this.add_group(child);
else return this.add_option(child)};SelectParser.prototype.add_group=function(group){var _i;var _len;var group_position=this.parsed.length;this.parsed.push({array_index:group_position,group:true,label:this.escapeExpression(group.label),children:0,disabled:group.disabled});var _ref=group.childNodes;var _results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){var option=_ref[_i];_results.push(this.add_option(option,group_position,group.disabled))}return _results};SelectParser.prototype.add_option=function(option,
group_position,group_disabled){if(option.nodeName.toUpperCase()==="OPTION"){if(option.text!==""){if(group_position!=null)this.parsed[group_position].children+=1;this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:option.value,text:option.text,html:option.innerHTML,selected:option.selected,disabled:group_disabled===true?group_disabled:option.disabled,group_array_index:group_position,classes:option.className,style:option.style.cssText})}else this.parsed.push({array_index:this.parsed.length,
options_index:this.options_index,empty:true});return this.options_index+=1}};SelectParser.prototype.escapeExpression=function(text){if(text==null||text===false)return"";if(!/[\&\<\>\"\'\`]/.test(text))return text;var map={"\x3c":"\x26lt;","\x3e":"\x26gt;",'"':"\x26quot;","'":"\x26#x27;","`":"\x26#x60;"};var unsafe_chars=/&(?!\w+;)|[\<\>\"\'\`]/g;return text.replace(unsafe_chars,function(chr){return map[chr]||"\x26amp;"})};return SelectParser}();SelectParser.select_to_array=function(select){var _i;
var _len;var parser=new SelectParser;var _ref=select.childNodes;for(_i=0,_len=_ref.length;_i<_len;_i++){var child=_ref[_i];parser.add_node(child)}return parser.parsed};var AbstractChosen=function(){function AbstractChosen(form_field,options){this.form_field=form_field;this.options=options!=null?options:{};if(!AbstractChosen.browser_is_supported())return;this.is_multiple=this.form_field.multiple;this.set_default_text();this.set_default_values();this.setup();this.set_up_html();this.register_observers()}
AbstractChosen.prototype.set_default_values=function(){var _this=this;this.click_test_action=function(evt){return _this.test_active_click(evt)};this.activate_action=function(evt){return _this.activate_field(evt)};this.active_field=false;this.mouse_on_container=false;this.results_showing=false;this.result_highlighted=null;this.allow_single_deselect=this.options.allow_single_deselect!=null&&this.form_field.options[0]!=null&&this.form_field.options[0].text===""?this.options.allow_single_deselect:false;
this.disable_search_threshold=this.options.disable_search_threshold||0;this.disable_search=this.options.disable_search||false;this.enable_split_word_search=this.options.enable_split_word_search!=null?this.options.enable_split_word_search:true;this.group_search=this.options.group_search!=null?this.options.group_search:true;this.search_contains=this.options.search_contains||false;this.single_backstroke_delete=this.options.single_backstroke_delete!=null?this.options.single_backstroke_delete:true;this.max_selected_options=
this.options.max_selected_options||Infinity;this.inherit_select_classes=this.options.inherit_select_classes||false;this.display_selected_options=this.options.display_selected_options!=null?this.options.display_selected_options:true;return this.display_disabled_options=this.options.display_disabled_options!=null?this.options.display_disabled_options:true};AbstractChosen.prototype.set_default_text=function(){if(this.form_field.getAttribute("data-placeholder"))this.default_text=this.form_field.getAttribute("data-placeholder");
else if(this.is_multiple)this.default_text=this.options.placeholder_text_multiple||this.options.placeholder_text||AbstractChosen.default_multiple_text;else this.default_text=this.options.placeholder_text_single||this.options.placeholder_text||AbstractChosen.default_single_text;return this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||AbstractChosen.default_no_result_text};AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=
true};AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=false};AbstractChosen.prototype.input_focus=function(evt){var _this=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return _this.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()};AbstractChosen.prototype.input_blur=function(evt){var _this=this;if(!this.mouse_on_container){this.active_field=false;return setTimeout(function(){return _this.blur_test()},100)}};
AbstractChosen.prototype.results_option_build=function(options){var _i;var _len;var content="";var _ref=this.results_data;for(_i=0,_len=_ref.length;_i<_len;_i++){var data=_ref[_i];if(data.group)content+=this.result_add_group(data);else content+=this.result_add_option(data);if(options!=null?options.first:void 0)if(data.selected&&this.is_multiple)this.choice_build(data);else if(data.selected&&!this.is_multiple)this.single_set_selected_text(data.text)}return content};AbstractChosen.prototype.result_add_option=
function(option){if(!option.search_match)return"";if(!this.include_option_in_results(option))return"";var classes=[];if(!option.disabled&&!(option.selected&&this.is_multiple))classes.push("active-result");if(option.disabled&&!(option.selected&&this.is_multiple))classes.push("disabled-result");if(option.selected)classes.push("result-selected");if(option.group_array_index!=null)classes.push("group-option");if(option.classes!=="")classes.push(option.classes);var option_el=document.createElement("li");
option_el.className=classes.join(" ");option_el.style.cssText=option.style;option_el.setAttribute("data-option-array-index",option.array_index);option_el.innerHTML=option.search_text;return this.outerHTML(option_el)};AbstractChosen.prototype.result_add_group=function(group){if(!(group.search_match||group.group_match))return"";if(!(group.active_options>0))return"";var group_el=document.createElement("li");group_el.className="group-result";group_el.innerHTML=group.search_text;return this.outerHTML(group_el)};
AbstractChosen.prototype.results_update_field=function(){this.set_default_text();if(!this.is_multiple)this.results_reset_cleanup();this.result_clear_highlight();this.results_build();if(this.results_showing)return this.winnow_results()};AbstractChosen.prototype.reset_single_select_options=function(){var _i;var _len;var _ref=this.results_data;var _results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){var result=_ref[_i];if(result.selected)_results.push(result.selected=false);else _results.push(void 0)}return _results};
AbstractChosen.prototype.results_toggle=function(){if(this.results_showing)return this.results_hide();else return this.results_show()};AbstractChosen.prototype.results_search=function(evt){if(this.results_showing)return this.winnow_results();else return this.results_show()};AbstractChosen.prototype.winnow_results=function(){var _i;var _len;this.no_results_clear();var results=0;var searchText=this.get_search_text();var escapedSearchText=searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$\x26");var regexAnchor=
this.search_contains?"":"^";var regex=new RegExp(regexAnchor+escapedSearchText,"i");var zregex=new RegExp(escapedSearchText,"i");var _ref=this.results_data;for(_i=0,_len=_ref.length;_i<_len;_i++){var option=_ref[_i];option.search_match=false;var results_group=null;if(this.include_option_in_results(option)){if(option.group){option.group_match=false;option.active_options=0}if(option.group_array_index!=null&&this.results_data[option.group_array_index]){results_group=this.results_data[option.group_array_index];
if(results_group.active_options===0&&results_group.search_match)results+=1;results_group.active_options+=1}if(!(option.group&&!this.group_search)){option.search_text=option.group?option.label:option.html;option.search_match=this.search_string_match(option.search_text,regex);if(option.search_match&&!option.group)results+=1;if(option.search_match){if(searchText.length){var startpos=option.search_text.search(zregex);var text=option.search_text.substr(0,startpos+searchText.length)+"\x3c/em\x3e"+option.search_text.substr(startpos+
searchText.length);option.search_text=text.substr(0,startpos)+"\x3cem\x3e"+text.substr(startpos)}if(results_group!=null)results_group.group_match=true}else if(option.group_array_index!=null&&this.results_data[option.group_array_index].search_match)option.search_match=true}}}this.result_clear_highlight();if(results<1&&searchText.length){this.update_results_content("");return this.no_results(searchText)}else{this.update_results_content(this.results_option_build());return this.winnow_results_set_highlight()}};
AbstractChosen.prototype.search_string_match=function(search_string,regex){var _i;var _len;if(regex.test(search_string))return true;else if(this.enable_split_word_search&&(search_string.indexOf(" ")>=0||search_string.indexOf("[")===0)){var parts=search_string.replace(/\[|\]/g,"").split(" ");if(parts.length)for(_i=0,_len=parts.length;_i<_len;_i++){var part=parts[_i];if(regex.test(part))return true}}};AbstractChosen.prototype.choices_count=function(){var _i;var _len;if(this.selected_option_count!=null)return this.selected_option_count;
this.selected_option_count=0;var _ref=this.form_field.options;for(_i=0,_len=_ref.length;_i<_len;_i++){var option=_ref[_i];if(option.selected)this.selected_option_count+=1}return this.selected_option_count};AbstractChosen.prototype.choices_click=function(evt){evt.preventDefault();if(!(this.results_showing||this.is_disabled))return this.results_show()};AbstractChosen.prototype.keyup_checker=function(evt){var _ref;var stroke=(_ref=evt.which)!=null?_ref:evt.keyCode;this.search_field_scale();switch(stroke){case 8:if(this.is_multiple&&
this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();else if(!this.pending_backstroke){this.result_clear_highlight();return this.results_search()}break;case 13:evt.preventDefault();if(this.results_showing)return this.result_select(evt);break;case 27:if(this.results_showing)this.results_hide();return true;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}};AbstractChosen.prototype.clipboard_event_checker=function(evt){var _this=this;
return setTimeout(function(){return _this.results_search()},50)};AbstractChosen.prototype.container_width=function(){if(this.options.width!=null)return this.options.width;else return""+this.form_field.offsetWidth+"px"};AbstractChosen.prototype.include_option_in_results=function(option){if(this.is_multiple&&(!this.display_selected_options&&option.selected))return false;if(!this.display_disabled_options&&option.disabled)return false;if(option.empty)return false;return true};AbstractChosen.prototype.search_results_touchstart=
function(evt){this.touch_started=true;return this.search_results_mouseover(evt)};AbstractChosen.prototype.search_results_touchmove=function(evt){this.touch_started=false;return this.search_results_mouseout(evt)};AbstractChosen.prototype.search_results_touchend=function(evt){if(this.touch_started)return this.search_results_mouseup(evt)};AbstractChosen.prototype.outerHTML=function(element){if(element.outerHTML)return element.outerHTML;var tmp=document.createElement("div");tmp.appendChild(element);return tmp.innerHTML};
AbstractChosen.browser_is_supported=function(){if(window.navigator.appName==="Microsoft Internet Explorer")return document.documentMode>=8;if(/iP(od|hone)/i.test(window.navigator.userAgent))return false;if(/Android/i.test(window.navigator.userAgent))if(/Mobile/i.test(window.navigator.userAgent))return false;return true};AbstractChosen.default_multiple_text="Select Some Options";AbstractChosen.default_single_text="Select an Option";AbstractChosen.default_no_result_text="No results match";return AbstractChosen}();
var $=jQuery;$.fn.extend({chosen:function(options){if(!AbstractChosen.browser_is_supported())return this;return this.each(function(input_field){var $this=$(this);var chosen=$this.data("chosen");if(options==="destroy"&&chosen)chosen.destroy();else if(!chosen)$this.data("chosen",new Chosen(this,options))})}});var Chosen=function(_super){function Chosen(){_ref=Chosen.__super__.constructor.apply(this,arguments);return _ref}__extends(Chosen,_super);Chosen.prototype.setup=function(){this.form_field_jq=
$(this.form_field);this.current_selectedIndex=this.form_field.selectedIndex;return this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")};Chosen.prototype.set_up_html=function(){var container_classes=["chosen-container"];container_classes.push("chosen-container-"+(this.is_multiple?"multi":"single"));if(this.inherit_select_classes&&this.form_field.className)container_classes.push(this.form_field.className);if(this.is_rtl)container_classes.push("chosen-rtl");var container_props={"class":container_classes.join(" "),
"style":"width: "+this.container_width()+";","title":this.form_field.title};if(this.form_field.id.length)container_props.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen";this.container=$("\x3cdiv /\x3e",container_props);if(this.is_multiple)this.container.html('\x3cul class\x3d"chosen-choices"\x3e\x3cli class\x3d"search-field"\x3e\x3cinput type\x3d"text" value\x3d"'+this.default_text+'" class\x3d"default" autocomplete\x3d"off" style\x3d"width:25px;" /\x3e\x3c/li\x3e\x3c/ul\x3e\x3cdiv class\x3d"chosen-drop"\x3e\x3cul class\x3d"chosen-results"\x3e\x3c/ul\x3e\x3c/div\x3e');
else this.container.html('\x3ca class\x3d"chosen-single chosen-default" tabindex\x3d"-1"\x3e\x3cspan\x3e'+this.default_text+'\x3c/span\x3e\x3cdiv\x3e\x3cb\x3e\x3c/b\x3e\x3c/div\x3e\x3c/a\x3e\x3cdiv class\x3d"chosen-drop"\x3e\x3cdiv class\x3d"chosen-search"\x3e\x3cinput type\x3d"text" autocomplete\x3d"off" /\x3e\x3c/div\x3e\x3cul class\x3d"chosen-results"\x3e\x3c/ul\x3e\x3c/div\x3e');this.form_field_jq.hide().after(this.container);this.dropdown=this.container.find("div.chosen-drop").first();this.search_field=
this.container.find("input").first();this.search_results=this.container.find("ul.chosen-results").first();this.search_field_scale();this.search_no_results=this.container.find("li.no-results").first();if(this.is_multiple){this.search_choices=this.container.find("ul.chosen-choices").first();this.search_container=this.container.find("li.search-field").first()}else{this.search_container=this.container.find("div.chosen-search").first();this.selected_item=this.container.find(".chosen-single").first()}this.results_build();
this.set_tab_index();this.set_label_behavior();return this.form_field_jq.trigger("chosen:ready",{chosen:this})};Chosen.prototype.register_observers=function(){var _this=this;this.container.bind("mousedown.chosen",function(evt){_this.container_mousedown(evt)});this.container.bind("mouseup.chosen",function(evt){_this.container_mouseup(evt)});this.container.bind("mouseenter.chosen",function(evt){_this.mouse_enter(evt)});this.container.bind("mouseleave.chosen",function(evt){_this.mouse_leave(evt)});this.search_results.bind("mouseup.chosen",
function(evt){_this.search_results_mouseup(evt)});this.search_results.bind("mouseover.chosen",function(evt){_this.search_results_mouseover(evt)});this.search_results.bind("mouseout.chosen",function(evt){_this.search_results_mouseout(evt)});this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(evt){_this.search_results_mousewheel(evt)});this.search_results.bind("touchstart.chosen",function(evt){_this.search_results_touchstart(evt)});this.search_results.bind("touchmove.chosen",
function(evt){_this.search_results_touchmove(evt)});this.search_results.bind("touchend.chosen",function(evt){_this.search_results_touchend(evt)});this.form_field_jq.bind("chosen:updated.chosen",function(evt){_this.results_update_field(evt)});this.form_field_jq.bind("chosen:activate.chosen",function(evt){_this.activate_field(evt)});this.form_field_jq.bind("chosen:open.chosen",function(evt){_this.container_mousedown(evt)});this.form_field_jq.bind("chosen:close.chosen",function(evt){_this.input_blur(evt)});
this.search_field.bind("blur.chosen",function(evt){_this.input_blur(evt)});this.search_field.bind("keyup.chosen",function(evt){_this.keyup_checker(evt)});this.search_field.bind("keydown.chosen",function(evt){_this.keydown_checker(evt)});this.search_field.bind("focus.chosen",function(evt){_this.input_focus(evt)});this.search_field.bind("cut.chosen",function(evt){_this.clipboard_event_checker(evt)});this.search_field.bind("paste.chosen",function(evt){_this.clipboard_event_checker(evt)});if(this.is_multiple)return this.search_choices.bind("click.chosen",
function(evt){_this.choices_click(evt)});else return this.container.bind("click.chosen",function(evt){evt.preventDefault()})};Chosen.prototype.destroy=function(){$(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action);if(this.search_field[0].tabIndex)this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex;this.container.remove();this.form_field_jq.removeData("chosen");return this.form_field_jq.show()};Chosen.prototype.search_field_disabled=function(){this.is_disabled=
this.form_field_jq[0].disabled;if(this.is_disabled){this.container.addClass("chosen-disabled");this.search_field[0].disabled=true;if(!this.is_multiple)this.selected_item.unbind("focus.chosen",this.activate_action);return this.close_field()}else{this.container.removeClass("chosen-disabled");this.search_field[0].disabled=false;if(!this.is_multiple)return this.selected_item.bind("focus.chosen",this.activate_action)}};Chosen.prototype.container_mousedown=function(evt){if(!this.is_disabled){if(evt&&evt.type===
"mousedown"&&!this.results_showing)evt.preventDefault();if(!(evt!=null&&$(evt.target).hasClass("search-choice-close"))){if(!this.active_field){if(this.is_multiple)this.search_field.val("");$(this.container[0].ownerDocument).bind("click.chosen",this.click_test_action);this.results_show()}else if(!this.is_multiple&&evt&&($(evt.target)[0]===this.selected_item[0]||$(evt.target).parents("a.chosen-single").length)){evt.preventDefault();this.results_toggle()}return this.activate_field()}}};Chosen.prototype.container_mouseup=
function(evt){if(evt.target.nodeName==="ABBR"&&!this.is_disabled)return this.results_reset(evt)};Chosen.prototype.search_results_mousewheel=function(evt){if(evt.originalEvent)var delta=-evt.originalEvent.wheelDelta||evt.originalEvent.detail;if(delta!=null){evt.preventDefault();if(evt.type==="DOMMouseScroll")delta*=40;return this.search_results.scrollTop(delta+this.search_results.scrollTop())}};Chosen.prototype.blur_test=function(evt){if(!this.active_field&&this.container.hasClass("chosen-container-active"))return this.close_field()};
Chosen.prototype.close_field=function(){$(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action);this.active_field=false;this.results_hide();this.container.removeClass("chosen-container-active");this.clear_backstroke();this.show_search_field_default();return this.search_field_scale()};Chosen.prototype.activate_field=function(){this.container.addClass("chosen-container-active");this.active_field=true;this.search_field.val(this.search_field.val());return this.search_field.focus()};
Chosen.prototype.test_active_click=function(evt){var active_container=$(evt.target).closest(".chosen-container");if(active_container.length&&this.container[0]===active_container[0])return this.active_field=true;else return this.close_field()};Chosen.prototype.results_build=function(){this.parsing=true;this.selected_option_count=null;this.results_data=SelectParser.select_to_array(this.form_field);if(this.is_multiple)this.search_choices.find("li.search-choice").remove();else if(!this.is_multiple){this.single_set_selected_text();
if(this.disable_search||this.form_field.options.length<=this.disable_search_threshold){this.search_field[0].readOnly=true;this.container.addClass("chosen-container-single-nosearch")}else{this.search_field[0].readOnly=false;this.container.removeClass("chosen-container-single-nosearch")}}this.update_results_content(this.results_option_build({first:true}));this.search_field_disabled();this.show_search_field_default();this.search_field_scale();return this.parsing=false};Chosen.prototype.result_do_highlight=
function(el){if(el.length){this.result_clear_highlight();this.result_highlight=el;this.result_highlight.addClass("highlighted");var maxHeight=parseInt(this.search_results.css("maxHeight"),10);var visible_top=this.search_results.scrollTop();var visible_bottom=maxHeight+visible_top;var high_top=this.result_highlight.position().top+this.search_results.scrollTop();var high_bottom=high_top+this.result_highlight.outerHeight();if(high_bottom>=visible_bottom)return this.search_results.scrollTop(high_bottom-
maxHeight>0?high_bottom-maxHeight:0);else if(high_top<visible_top)return this.search_results.scrollTop(high_top)}};Chosen.prototype.result_clear_highlight=function(){if(this.result_highlight)this.result_highlight.removeClass("highlighted");return this.result_highlight=null};Chosen.prototype.results_show=function(){if(this.is_multiple&&this.max_selected_options<=this.choices_count()){this.form_field_jq.trigger("chosen:maxselected",{chosen:this});return false}this.container.addClass("chosen-with-drop");
this.results_showing=true;this.search_field.focus();this.search_field.val(this.search_field.val());this.winnow_results();return this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this})};Chosen.prototype.update_results_content=function(content){return this.search_results.html(content)};Chosen.prototype.results_hide=function(){if(this.results_showing){this.result_clear_highlight();this.container.removeClass("chosen-with-drop");this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})}return this.results_showing=
false};Chosen.prototype.set_tab_index=function(el){if(this.form_field.tabIndex){var ti=this.form_field.tabIndex;this.form_field.tabIndex=-1;return this.search_field[0].tabIndex=ti}};Chosen.prototype.set_label_behavior=function(){var _this=this;this.form_field_label=this.form_field_jq.parents("label");if(!this.form_field_label.length&&this.form_field.id.length)this.form_field_label=$("label[for\x3d'"+this.form_field.id+"']");if(this.form_field_label.length>0)return this.form_field_label.bind("click.chosen",
function(evt){if(_this.is_multiple)return _this.container_mousedown(evt);else return _this.activate_field()})};Chosen.prototype.show_search_field_default=function(){if(this.is_multiple&&this.choices_count()<1&&!this.active_field){this.search_field.val(this.default_text);return this.search_field.addClass("default")}else{this.search_field.val("");return this.search_field.removeClass("default")}};Chosen.prototype.search_results_mouseup=function(evt){var target=$(evt.target).hasClass("active-result")?
$(evt.target):$(evt.target).parents(".active-result").first();if(target.length){this.result_highlight=target;this.result_select(evt);return this.search_field.focus()}};Chosen.prototype.search_results_mouseover=function(evt){var target=$(evt.target).hasClass("active-result")?$(evt.target):$(evt.target).parents(".active-result").first();if(target)return this.result_do_highlight(target)};Chosen.prototype.search_results_mouseout=function(evt){if($(evt.target).hasClass("active-result"||$(evt.target).parents(".active-result").first()))return this.result_clear_highlight()};
Chosen.prototype.choice_build=function(item){var _this=this;var choice=$("\x3cli /\x3e",{"class":"search-choice"}).html("\x3cspan\x3e"+item.html+"\x3c/span\x3e");if(item.disabled)choice.addClass("search-choice-disabled");else{var close_link=$("\x3ca /\x3e",{"class":"search-choice-close","data-option-array-index":item.array_index});close_link.bind("click.chosen",function(evt){return _this.choice_destroy_link_click(evt)});choice.append(close_link)}return this.search_container.before(choice)};Chosen.prototype.choice_destroy_link_click=
function(evt){evt.preventDefault();evt.stopPropagation();if(!this.is_disabled)return this.choice_destroy($(evt.target))};Chosen.prototype.choice_destroy=function(link){if(this.result_deselect(link[0].getAttribute("data-option-array-index"))){this.show_search_field_default();if(this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1)this.results_hide();link.parents("li").first().remove();return this.search_field_scale()}};Chosen.prototype.results_reset=function(){this.reset_single_select_options();
this.form_field.options[0].selected=true;this.single_set_selected_text();this.show_search_field_default();this.results_reset_cleanup();this.form_field_jq.trigger("change");if(this.active_field)return this.results_hide()};Chosen.prototype.results_reset_cleanup=function(){this.current_selectedIndex=this.form_field.selectedIndex;return this.selected_item.find("abbr").remove()};Chosen.prototype.result_select=function(evt){if(this.result_highlight){var high=this.result_highlight;this.result_clear_highlight();
if(this.is_multiple&&this.max_selected_options<=this.choices_count()){this.form_field_jq.trigger("chosen:maxselected",{chosen:this});return false}if(this.is_multiple)high.removeClass("active-result");else this.reset_single_select_options();var item=this.results_data[high[0].getAttribute("data-option-array-index")];item.selected=true;this.form_field.options[item.options_index].selected=true;this.selected_option_count=null;if(this.is_multiple)this.choice_build(item);else this.single_set_selected_text(item.text);
if(!((evt.metaKey||evt.ctrlKey)&&this.is_multiple))this.results_hide();this.search_field.val("");if(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)this.form_field_jq.trigger("change",{"selected":this.form_field.options[item.options_index].value});this.current_selectedIndex=this.form_field.selectedIndex;return this.search_field_scale()}};Chosen.prototype.single_set_selected_text=function(text){if(text==null)text=this.default_text;if(text===this.default_text)this.selected_item.addClass("chosen-default");
else{this.single_deselect_control_build();this.selected_item.removeClass("chosen-default")}return this.selected_item.find("span").text(text)};Chosen.prototype.result_deselect=function(pos){var result_data=this.results_data[pos];if(!this.form_field.options[result_data.options_index].disabled){result_data.selected=false;this.form_field.options[result_data.options_index].selected=false;this.selected_option_count=null;this.result_clear_highlight();if(this.results_showing)this.winnow_results();this.form_field_jq.trigger("change",
{deselected:this.form_field.options[result_data.options_index].value});this.search_field_scale();return true}else return false};Chosen.prototype.single_deselect_control_build=function(){if(!this.allow_single_deselect)return;if(!this.selected_item.find("abbr").length)this.selected_item.find("span").first().after('\x3cabbr class\x3d"search-choice-close"\x3e\x3c/abbr\x3e');return this.selected_item.addClass("chosen-single-with-deselect")};Chosen.prototype.get_search_text=function(){if(this.search_field.val()===
this.default_text)return"";else return $("\x3cdiv/\x3e").text($.trim(this.search_field.val())).html()};Chosen.prototype.winnow_results_set_highlight=function(){var selected_results=!this.is_multiple?this.search_results.find(".result-selected.active-result"):[];var do_high=selected_results.length?selected_results.first():this.search_results.find(".active-result").first();if(do_high!=null)return this.result_do_highlight(do_high)};Chosen.prototype.no_results=function(terms){var no_results_html=$('\x3cli class\x3d"no-results"\x3e'+
this.results_none_found+' "\x3cspan\x3e\x3c/span\x3e"\x3c/li\x3e');no_results_html.find("span").first().html(terms);this.search_results.append(no_results_html);return this.form_field_jq.trigger("chosen:no_results",{chosen:this})};Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()};Chosen.prototype.keydown_arrow=function(){if(this.results_showing&&this.result_highlight){var next_sib=this.result_highlight.nextAll("li.active-result").first();if(next_sib)return this.result_do_highlight(next_sib)}else return this.results_show()};
Chosen.prototype.keyup_arrow=function(){if(!this.results_showing&&!this.is_multiple)return this.results_show();else if(this.result_highlight){var prev_sibs=this.result_highlight.prevAll("li.active-result");if(prev_sibs.length)return this.result_do_highlight(prev_sibs.first());else{if(this.choices_count()>0)this.results_hide();return this.result_clear_highlight()}}};Chosen.prototype.keydown_backstroke=function(){if(this.pending_backstroke){this.choice_destroy(this.pending_backstroke.find("a").first());
return this.clear_backstroke()}else{var next_available_destroy=this.search_container.siblings("li.search-choice").last();if(next_available_destroy.length&&!next_available_destroy.hasClass("search-choice-disabled")){this.pending_backstroke=next_available_destroy;if(this.single_backstroke_delete)return this.keydown_backstroke();else return this.pending_backstroke.addClass("search-choice-focus")}}};Chosen.prototype.clear_backstroke=function(){if(this.pending_backstroke)this.pending_backstroke.removeClass("search-choice-focus");
return this.pending_backstroke=null};Chosen.prototype.keydown_checker=function(evt){var _ref1;var stroke=(_ref1=evt.which)!=null?_ref1:evt.keyCode;this.search_field_scale();if(stroke!==8&&this.pending_backstroke)this.clear_backstroke();switch(stroke){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:if(this.results_showing&&!this.is_multiple)this.result_select(evt);this.mouse_on_container=false;break;case 13:break;case 38:evt.preventDefault();this.keyup_arrow();break;case 40:evt.preventDefault();
this.keydown_arrow();break}};Chosen.prototype.search_field_scale=function(){var _i;var _len;if(this.is_multiple){var h=0;var w=0;var style_block="position:absolute; left: -1000px; top: -1000px; display:none;";var styles=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"];for(_i=0,_len=styles.length;_i<_len;_i++){var style=styles[_i];style_block+=style+":"+this.search_field.css(style)+";"}var div=$("\x3cdiv /\x3e",{"style":style_block});div.text(this.search_field.val());
$("body").append(div);w=div.width()+25;div.remove();var f_width=this.container.outerWidth();if(w>f_width-10)w=f_width-10;return this.search_field.css({"width":w+"px"})}};return Chosen}(AbstractChosen)}).call(this);
});
$(document).ready(function(){/*!
 Chosen, a Select Box Enhancer for jQuery and Prototype
 by Patrick Filler for Harvest, http://getharvest.com

 Version 1.5.1
 Full source at https://github.com/harvesthq/chosen
 Copyright (c) 2011-2016 Harvest http://getharvest.com

 MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
 This file is generated by `grunt build`, do not edit it by hand.
 */

(function() {
    var $, AbstractChosen, Chosen, SelectParser, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    SelectParser = (function() {
        function SelectParser() {
            this.options_index = 0;
            this.parsed = [];
        }

        SelectParser.prototype.add_node = function(child) {
            if (child.nodeName.toUpperCase() === "OPTGROUP") {
                return this.add_group(child);
            } else {
                return this.add_option(child);
            }
        };

        SelectParser.prototype.add_group = function(group) {
            var group_position, option, _i, _len, _ref, _results;
            group_position = this.parsed.length;
            this.parsed.push({
                array_index: group_position,
                group: true,
                label: this.escapeExpression(group.label),
                title: group.title ? group.title : void 0,
                children: 0,
                disabled: group.disabled,
                classes: group.className
            });
            _ref = group.childNodes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                _results.push(this.add_option(option, group_position, group.disabled));
            }
            return _results;
        };

        SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
            if (option.nodeName.toUpperCase() === "OPTION") {
                if (option.text !== "") {
                    if (group_position != null) {
                        this.parsed[group_position].children += 1;
                    }
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        value: option.value,
                        text: option.text,
                        html: option.innerHTML,
                        title: option.title ? option.title : void 0,
                        selected: option.selected,
                        disabled: group_disabled === true ? group_disabled : option.disabled,
                        group_array_index: group_position,
                        group_label: group_position != null ? this.parsed[group_position].label : null,
                        classes: option.className,
                        style: option.style.cssText
                    });
                } else {
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        empty: true
                    });
                }
                return this.options_index += 1;
            }
        };

        SelectParser.prototype.escapeExpression = function(text) {
            var map, unsafe_chars;
            if ((text == null) || text === false) {
                return "";
            }
            if (!/[\&\<\>\"\'\`]/.test(text)) {
                return text;
            }
            map = {
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            };
            unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
            return text.replace(unsafe_chars, function(chr) {
                return map[chr] || "&amp;";
            });
        };

        return SelectParser;

    })();

    SelectParser.select_to_array = function(select) {
        var child, parser, _i, _len, _ref;
        parser = new SelectParser();
        _ref = select.childNodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            parser.add_node(child);
        }
        return parser.parsed;
    };

    AbstractChosen = (function() {
        function AbstractChosen(form_field, options) {
            this.form_field = form_field;
            this.options = options != null ? options : {};
            if (!AbstractChosen.browser_is_supported()) {
                return;
            }
            this.is_multiple = this.form_field.multiple;
            this.set_default_text();
            this.set_default_values();
            this.setup();
            this.set_up_html();
            this.register_observers();
            this.on_ready();
        }

        AbstractChosen.prototype.set_default_values = function() {
            var _this = this;
            this.click_test_action = function(evt) {
                return _this.test_active_click(evt);
            };
            this.activate_action = function(evt) {
                return _this.activate_field(evt);
            };
            this.active_field = false;
            this.mouse_on_container = false;
            this.results_showing = false;
            this.result_highlighted = null;
            this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
            this.disable_search_threshold = this.options.disable_search_threshold || 0;
            this.disable_search = this.options.disable_search || false;
            this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
            this.group_search = this.options.group_search != null ? this.options.group_search : true;
            this.search_contains = this.options.search_contains || false;
            this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
            this.max_selected_options = this.options.max_selected_options || Infinity;
            this.inherit_select_classes = this.options.inherit_select_classes || false;
            this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
            this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
            this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
            return this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;
        };

        AbstractChosen.prototype.set_default_text = function() {
            if (this.form_field.getAttribute("data-placeholder")) {
                this.default_text = this.form_field.getAttribute("data-placeholder");
            } else if (this.is_multiple) {
                this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
            } else {
                this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
            }
            return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
        };

        AbstractChosen.prototype.choice_label = function(item) {
            if (this.include_group_label_in_selected && (item.group_label != null)) {
                return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
            } else {
                return item.html;
            }
        };

        AbstractChosen.prototype.mouse_enter = function() {
            return this.mouse_on_container = true;
        };

        AbstractChosen.prototype.mouse_leave = function() {
            return this.mouse_on_container = false;
        };

        AbstractChosen.prototype.input_focus = function(evt) {
            var _this = this;
            if (this.is_multiple) {
                if (!this.active_field) {
                    return setTimeout((function() {
                        return _this.container_mousedown();
                    }), 50);
                }
            } else {
                if (!this.active_field) {
                    return this.activate_field();
                }
            }
        };

        AbstractChosen.prototype.input_blur = function(evt) {
            var _this = this;
            if (!this.mouse_on_container) {
                this.active_field = false;
                return setTimeout((function() {
                    return _this.blur_test();
                }), 100);
            }
        };

        AbstractChosen.prototype.results_option_build = function(options) {
            var content, data, data_content, shown_results, _i, _len, _ref;
            content = '';
            shown_results = 0;
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                data = _ref[_i];
                data_content = '';
                if (data.group) {
                    data_content = this.result_add_group(data);
                } else {
                    data_content = this.result_add_option(data);
                }
                if (data_content !== '') {
                    shown_results++;
                    content += data_content;
                }
                if (options != null ? options.first : void 0) {
                    if (data.selected && this.is_multiple) {
                        this.choice_build(data);
                    } else if (data.selected && !this.is_multiple) {
                        this.single_set_selected_text(this.choice_label(data));
                    }
                }
                if (shown_results >= this.max_shown_results) {
                    break;
                }
            }
            return content;
        };

        AbstractChosen.prototype.result_add_option = function(option) {
            var classes, option_el;
            if (!option.search_match) {
                return '';
            }
            if (!this.include_option_in_results(option)) {
                return '';
            }
            classes = [];
            if (!option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("active-result");
            }
            if (option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("disabled-result");
            }
            if (option.selected) {
                classes.push("result-selected");
            }
            if (option.group_array_index != null) {
                classes.push("group-option");
            }
            if (option.classes !== "") {
                classes.push(option.classes);
            }
            option_el = document.createElement("li");
            option_el.className = classes.join(" ");
            option_el.style.cssText = option.style;
            option_el.setAttribute("data-option-array-index", option.array_index);
            option_el.innerHTML = option.search_text;
            if (option.title) {
                option_el.title = option.title;
            }
            return this.outerHTML(option_el);
        };

        AbstractChosen.prototype.result_add_group = function(group) {
            var classes, group_el;
            if (!(group.search_match || group.group_match)) {
                return '';
            }
            if (!(group.active_options > 0)) {
                return '';
            }
            classes = [];
            classes.push("group-result");
            if (group.classes) {
                classes.push(group.classes);
            }
            group_el = document.createElement("li");
            group_el.className = classes.join(" ");
            group_el.innerHTML = group.search_text;
            if (group.title) {
                group_el.title = group.title;
            }
            return this.outerHTML(group_el);
        };

        AbstractChosen.prototype.results_update_field = function() {
            this.set_default_text();
            if (!this.is_multiple) {
                this.results_reset_cleanup();
            }
            this.result_clear_highlight();
            this.results_build();
            if (this.results_showing) {
                return this.winnow_results();
            }
        };

        AbstractChosen.prototype.reset_single_select_options = function() {
            var result, _i, _len, _ref, _results;
            _ref = this.results_data;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                result = _ref[_i];
                if (result.selected) {
                    _results.push(result.selected = false);
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        };

        AbstractChosen.prototype.results_toggle = function() {
            if (this.results_showing) {
                return this.results_hide();
            } else {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.results_search = function(evt) {
            if (this.results_showing) {
                return this.winnow_results();
            } else {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.winnow_results = function() {
            var escapedSearchText, option, regex, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
            this.no_results_clear();
            results = 0;
            searchText = this.get_search_text();
            escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            zregex = new RegExp(escapedSearchText, 'i');
            regex = this.get_search_regex(escapedSearchText);
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                option.search_match = false;
                results_group = null;
                if (this.include_option_in_results(option)) {
                    if (option.group) {
                        option.group_match = false;
                        option.active_options = 0;
                    }
                    if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
                        results_group = this.results_data[option.group_array_index];
                        if (results_group.active_options === 0 && results_group.search_match) {
                            results += 1;
                        }
                        results_group.active_options += 1;
                    }
                    option.search_text = option.group ? option.label : option.html;
                    if (!(option.group && !this.group_search)) {
                        option.search_match = this.search_string_match(option.search_text, regex);
                        if (option.search_match && !option.group) {
                            results += 1;
                        }
                        if (option.search_match) {
                            if (searchText.length) {
                                startpos = option.search_text.search(zregex);
                                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
                            }
                            if (results_group != null) {
                                results_group.group_match = true;
                            }
                        } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
                            option.search_match = true;
                        }
                    }
                }
            }
            this.result_clear_highlight();
            if (results < 1 && searchText.length) {
                this.update_results_content("");
                return this.no_results(searchText);
            } else {
                this.update_results_content(this.results_option_build());
                return this.winnow_results_set_highlight();
            }
        };

        AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
            var regex_anchor;
            regex_anchor = this.search_contains ? "" : "^";
            return new RegExp(regex_anchor + escaped_search_string, 'i');
        };

        AbstractChosen.prototype.search_string_match = function(search_string, regex) {
            var part, parts, _i, _len;
            if (regex.test(search_string)) {
                return true;
            } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
                parts = search_string.replace(/\[|\]/g, "").split(" ");
                if (parts.length) {
                    for (_i = 0, _len = parts.length; _i < _len; _i++) {
                        part = parts[_i];
                        if (regex.test(part)) {
                            return true;
                        }
                    }
                }
            }
        };

        AbstractChosen.prototype.choices_count = function() {
            var option, _i, _len, _ref;
            if (this.selected_option_count != null) {
                return this.selected_option_count;
            }
            this.selected_option_count = 0;
            _ref = this.form_field.options;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                if (option.selected) {
                    this.selected_option_count += 1;
                }
            }
            return this.selected_option_count;
        };

        AbstractChosen.prototype.choices_click = function(evt) {
            evt.preventDefault();
            if (!(this.results_showing || this.is_disabled)) {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.keyup_checker = function(evt) {
            var stroke, _ref;
            stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
            this.search_field_scale();
            switch (stroke) {
                case 8:
                    if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
                        return this.keydown_backstroke();
                    } else if (!this.pending_backstroke) {
                        this.result_clear_highlight();
                        return this.results_search();
                    }
                    break;
                case 13:
                    evt.preventDefault();
                    if (this.results_showing) {
                        return this.result_select(evt);
                    }
                    break;
                case 27:
                    if (this.results_showing) {
                        this.results_hide();
                    }
                    return true;
                case 9:
                case 38:
                case 40:
                case 16:
                case 91:
                case 17:
                case 18:
                    break;
                default:
                    return this.results_search();
            }
        };

        AbstractChosen.prototype.clipboard_event_checker = function(evt) {
            var _this = this;
            return setTimeout((function() {
                return _this.results_search();
            }), 50);
        };

        AbstractChosen.prototype.container_width = function() {
            if (this.options.width != null) {
                return this.options.width;
            } else {
                return "" + this.form_field.offsetWidth + "px";
            }
        };

        AbstractChosen.prototype.include_option_in_results = function(option) {
            if (this.is_multiple && (!this.display_selected_options && option.selected)) {
                return false;
            }
            if (!this.display_disabled_options && option.disabled) {
                return false;
            }
            if (option.empty) {
                return false;
            }
            return true;
        };

        AbstractChosen.prototype.search_results_touchstart = function(evt) {
            this.touch_started = true;
            return this.search_results_mouseover(evt);
        };

        AbstractChosen.prototype.search_results_touchmove = function(evt) {
            this.touch_started = false;
            return this.search_results_mouseout(evt);
        };

        AbstractChosen.prototype.search_results_touchend = function(evt) {
            if (this.touch_started) {
                return this.search_results_mouseup(evt);
            }
        };

        AbstractChosen.prototype.outerHTML = function(element) {
            var tmp;
            if (element.outerHTML) {
                return element.outerHTML;
            }
            tmp = document.createElement("div");
            tmp.appendChild(element);
            return tmp.innerHTML;
        };

        AbstractChosen.browser_is_supported = function() {
            if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/Android/i.test(window.navigator.userAgent)) {
                if (/Mobile/i.test(window.navigator.userAgent)) {
                    return false;
                }
            }
            if (/IEMobile/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/Windows Phone/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/BlackBerry/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/BB10/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (window.navigator.appName === "Microsoft Internet Explorer") {
                return document.documentMode >= 8;
            }
            return true;
        };

        AbstractChosen.default_multiple_text = "Select Some Options";

        AbstractChosen.default_single_text = "Select an Option";

        AbstractChosen.default_no_result_text = "No results match";

        return AbstractChosen;

    })();

    $ = jQuery;

    $.fn.extend({
        chosen: function(options) {
            if (!AbstractChosen.browser_is_supported()) {
                return this;
            }
            return this.each(function(input_field) {
                var $this, chosen;
                $this = $(this);
                chosen = $this.data('chosen');
                if (options === 'destroy') {
                    if (chosen instanceof Chosen) {
                        chosen.destroy();
                    }
                    return;
                }
                if (!(chosen instanceof Chosen)) {
                    $this.data('chosen', new Chosen(this, options));
                }
            });
        }
    });

    Chosen = (function(_super) {
        __extends(Chosen, _super);

        function Chosen() {
            _ref = Chosen.__super__.constructor.apply(this, arguments);
            return _ref;
        }

        Chosen.prototype.setup = function() {
            this.form_field_jq = $(this.form_field);
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
        };

        Chosen.prototype.set_up_html = function() {
            var container_classes, container_props;
            container_classes = ["chosen-container"];
            container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
            if (this.inherit_select_classes && this.form_field.className) {
                container_classes.push(this.form_field.className);
            }
            if (this.is_rtl) {
                container_classes.push("chosen-rtl");
            }
            container_props = {
                'class': container_classes.join(' '),
                'style': "width: " + (this.container_width()) + ";",
                'title': this.form_field.title
            };
            if (this.form_field.id.length) {
                container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
            }
            this.container = $("<div />", container_props);
            if (this.is_multiple) {
                this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
            } else {
                this.container.html('<a class="chosen-single chosen-default"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
            }
            this.form_field_jq.hide().after(this.container);
            this.dropdown = this.container.find('div.chosen-drop').first();
            this.search_field = this.container.find('input').first();
            this.search_results = this.container.find('ul.chosen-results').first();
            this.search_field_scale();
            this.search_no_results = this.container.find('li.no-results').first();
            if (this.is_multiple) {
                this.search_choices = this.container.find('ul.chosen-choices').first();
                this.search_container = this.container.find('li.search-field').first();
            } else {
                this.search_container = this.container.find('div.chosen-search').first();
                this.selected_item = this.container.find('.chosen-single').first();
            }
            this.results_build();
            this.set_tab_index();
            return this.set_label_behavior();
        };

        Chosen.prototype.on_ready = function() {
            return this.form_field_jq.trigger("chosen:ready", {
                chosen: this
            });
        };

        Chosen.prototype.register_observers = function() {
            var _this = this;
            this.container.bind('touchstart.chosen', function(evt) {
                _this.container_mousedown(evt);
                return evt.preventDefault();
            });
            this.container.bind('touchend.chosen', function(evt) {
                _this.container_mouseup(evt);
                return evt.preventDefault();
            });
            this.container.bind('mousedown.chosen', function(evt) {
                _this.container_mousedown(evt);
            });
            this.container.bind('mouseup.chosen', function(evt) {
                _this.container_mouseup(evt);
            });
            this.container.bind('mouseenter.chosen', function(evt) {
                _this.mouse_enter(evt);
            });
            this.container.bind('mouseleave.chosen', function(evt) {
                _this.mouse_leave(evt);
            });
            this.search_results.bind('mouseup.chosen', function(evt) {
                _this.search_results_mouseup(evt);
            });
            this.search_results.bind('mouseover.chosen', function(evt) {
                _this.search_results_mouseover(evt);
            });
            this.search_results.bind('mouseout.chosen', function(evt) {
                _this.search_results_mouseout(evt);
            });
            this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
                _this.search_results_mousewheel(evt);
            });
            this.search_results.bind('touchstart.chosen', function(evt) {
                _this.search_results_touchstart(evt);
            });
            this.search_results.bind('touchmove.chosen', function(evt) {
                _this.search_results_touchmove(evt);
            });
            this.search_results.bind('touchend.chosen', function(evt) {
                _this.search_results_touchend(evt);
            });
            this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
                _this.results_update_field(evt);
            });
            this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
                _this.activate_field(evt);
            });
            this.form_field_jq.bind("chosen:open.chosen", function(evt) {
                _this.container_mousedown(evt);
            });
            this.form_field_jq.bind("chosen:close.chosen", function(evt) {
                _this.input_blur(evt);
            });
            this.search_field.bind('blur.chosen', function(evt) {
                _this.input_blur(evt);
            });
            this.search_field.bind('keyup.chosen', function(evt) {
                _this.keyup_checker(evt);
            });
            this.search_field.bind('keydown.chosen', function(evt) {
                _this.keydown_checker(evt);
            });
            this.search_field.bind('focus.chosen', function(evt) {
                _this.input_focus(evt);
            });
            this.search_field.bind('cut.chosen', function(evt) {
                _this.clipboard_event_checker(evt);
            });
            this.search_field.bind('paste.chosen', function(evt) {
                _this.clipboard_event_checker(evt);
            });
            if (this.is_multiple) {
                return this.search_choices.bind('click.chosen', function(evt) {
                    _this.choices_click(evt);
                });
            } else {
                return this.container.bind('click.chosen', function(evt) {
                    evt.preventDefault();
                });
            }
        };

        Chosen.prototype.destroy = function() {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            if (this.search_field[0].tabIndex) {
                this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
            }
            this.container.remove();
            this.form_field_jq.removeData('chosen');
            return this.form_field_jq.show();
        };

        Chosen.prototype.search_field_disabled = function() {
            this.is_disabled = this.form_field_jq[0].disabled;
            if (this.is_disabled) {
                this.container.addClass('chosen-disabled');
                this.search_field[0].disabled = true;
                if (!this.is_multiple) {
                    this.selected_item.unbind("focus.chosen", this.activate_action);
                }
                return this.close_field();
            } else {
                this.container.removeClass('chosen-disabled');
                this.search_field[0].disabled = false;
                if (!this.is_multiple) {
                    return this.selected_item.bind("focus.chosen", this.activate_action);
                }
            }
        };

        Chosen.prototype.container_mousedown = function(evt) {
            if (!this.is_disabled) {
                if (evt && evt.type === "mousedown" && !this.results_showing) {
                    evt.preventDefault();
                }
                if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
                    if (!this.active_field) {
                        if (this.is_multiple) {
                            this.search_field.val("");
                        }
                        $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
                        this.results_show();
                    } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
                        evt.preventDefault();
                        this.results_toggle();
                    }
                    return this.activate_field();
                }
            }
        };

        Chosen.prototype.container_mouseup = function(evt) {
            if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
                return this.results_reset(evt);
            }
        };

        Chosen.prototype.search_results_mousewheel = function(evt) {
            var delta;
            if (evt.originalEvent) {
                delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
            }
            if (delta != null) {
                evt.preventDefault();
                if (evt.type === 'DOMMouseScroll') {
                    delta = delta * 40;
                }
                return this.search_results.scrollTop(delta + this.search_results.scrollTop());
            }
        };

        Chosen.prototype.blur_test = function(evt) {
            if (!this.active_field && this.container.hasClass("chosen-container-active")) {
                return this.close_field();
            }
        };

        Chosen.prototype.close_field = function() {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            this.active_field = false;
            this.results_hide();
            this.container.removeClass("chosen-container-active");
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale();
        };

        Chosen.prototype.activate_field = function() {
            this.container.addClass("chosen-container-active");
            this.active_field = true;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus();
        };

        Chosen.prototype.test_active_click = function(evt) {
            var active_container;
            active_container = $(evt.target).closest('.chosen-container');
            if (active_container.length && this.container[0] === active_container[0]) {
                return this.active_field = true;
            } else {
                return this.close_field();
            }
        };

        Chosen.prototype.results_build = function() {
            this.parsing = true;
            this.selected_option_count = null;
            this.results_data = SelectParser.select_to_array(this.form_field);
            if (this.is_multiple) {
                this.search_choices.find("li.search-choice").remove();
            } else if (!this.is_multiple) {
                this.single_set_selected_text();
                if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
                    this.search_field[0].readOnly = true;
                    this.container.addClass("chosen-container-single-nosearch");
                } else {
                    this.search_field[0].readOnly = false;
                    this.container.removeClass("chosen-container-single-nosearch");
                }
            }
            this.update_results_content(this.results_option_build({
                first: true
            }));
            this.search_field_disabled();
            this.show_search_field_default();
            this.search_field_scale();
            return this.parsing = false;
        };

        Chosen.prototype.result_do_highlight = function(el) {
            var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
            if (el.length) {
                this.result_clear_highlight();
                this.result_highlight = el;
                this.result_highlight.addClass("highlighted");
                maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                visible_top = this.search_results.scrollTop();
                visible_bottom = maxHeight + visible_top;
                high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                high_bottom = high_top + this.result_highlight.outerHeight();
                if (high_bottom >= visible_bottom) {
                    return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                } else if (high_top < visible_top) {
                    return this.search_results.scrollTop(high_top);
                }
            }
        };

        Chosen.prototype.result_clear_highlight = function() {
            if (this.result_highlight) {
                this.result_highlight.removeClass("highlighted");
            }
            return this.result_highlight = null;
        };

        Chosen.prototype.results_show = function() {
            if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                this.form_field_jq.trigger("chosen:maxselected", {
                    chosen: this
                });
                return false;
            }
            this.container.addClass("chosen-with-drop");
            this.results_showing = true;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            this.winnow_results();
            return this.form_field_jq.trigger("chosen:showing_dropdown", {
                chosen: this
            });
        };

        Chosen.prototype.update_results_content = function(content) {
            return this.search_results.html(content);
        };

        Chosen.prototype.results_hide = function() {
            if (this.results_showing) {
                this.result_clear_highlight();
                this.container.removeClass("chosen-with-drop");
                this.form_field_jq.trigger("chosen:hiding_dropdown", {
                    chosen: this
                });
            }
            return this.results_showing = false;
        };

        Chosen.prototype.set_tab_index = function(el) {
            var ti;
            if (this.form_field.tabIndex) {
                ti = this.form_field.tabIndex;
                this.form_field.tabIndex = -1;
                return this.search_field[0].tabIndex = ti;
            }
        };

        Chosen.prototype.set_label_behavior = function() {
            var _this = this;
            this.form_field_label = this.form_field_jq.parents("label");
            if (!this.form_field_label.length && this.form_field.id.length) {
                this.form_field_label = $("label[for='" + this.form_field.id + "']");
            }
            if (this.form_field_label.length > 0) {
                return this.form_field_label.bind('click.chosen', function(evt) {
                    if (_this.is_multiple) {
                        return _this.container_mousedown(evt);
                    } else {
                        return _this.activate_field();
                    }
                });
            }
        };

        Chosen.prototype.show_search_field_default = function() {
            if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
                this.search_field.val(this.default_text);
                return this.search_field.addClass("default");
            } else {
                this.search_field.val("");
                return this.search_field.removeClass("default");
            }
        };

        Chosen.prototype.search_results_mouseup = function(evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target.length) {
                this.result_highlight = target;
                this.result_select(evt);
                return this.search_field.focus();
            }
        };

        Chosen.prototype.search_results_mouseover = function(evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target) {
                return this.result_do_highlight(target);
            }
        };

        Chosen.prototype.search_results_mouseout = function(evt) {
            if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
                return this.result_clear_highlight();
            }
        };

        Chosen.prototype.choice_build = function(item) {
            var choice, close_link,
                _this = this;
            choice = $('<li />', {
                "class": "search-choice"
            }).html("<span>" + (this.choice_label(item)) + "</span>");
            if (item.disabled) {
                choice.addClass('search-choice-disabled');
            } else {
                close_link = $('<a />', {
                    "class": 'search-choice-close',
                    'data-option-array-index': item.array_index
                });
                close_link.bind('click.chosen', function(evt) {
                    return _this.choice_destroy_link_click(evt);
                });
                choice.append(close_link);
            }
            return this.search_container.before(choice);
        };

        Chosen.prototype.choice_destroy_link_click = function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (!this.is_disabled) {
                return this.choice_destroy($(evt.target));
            }
        };

        Chosen.prototype.choice_destroy = function(link) {
            if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
                this.show_search_field_default();
                if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
                    this.results_hide();
                }
                link.parents('li').first().remove();
                return this.search_field_scale();
            }
        };

        Chosen.prototype.results_reset = function() {
            this.reset_single_select_options();
            this.form_field.options[0].selected = true;
            this.single_set_selected_text();
            this.show_search_field_default();
            this.results_reset_cleanup();
            this.form_field_jq.trigger("change");
            if (this.active_field) {
                return this.results_hide();
            }
        };

        Chosen.prototype.results_reset_cleanup = function() {
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.selected_item.find("abbr").remove();
        };

        Chosen.prototype.result_select = function(evt) {
            var high, item;
            if (this.result_highlight) {
                high = this.result_highlight;
                this.result_clear_highlight();
                if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                    this.form_field_jq.trigger("chosen:maxselected", {
                        chosen: this
                    });
                    return false;
                }
                if (this.is_multiple) {
                    high.removeClass("active-result");
                } else {
                    this.reset_single_select_options();
                }
                high.addClass("result-selected");
                item = this.results_data[high[0].getAttribute("data-option-array-index")];
                item.selected = true;
                this.form_field.options[item.options_index].selected = true;
                this.selected_option_count = null;
                if (this.is_multiple) {
                    this.choice_build(item);
                } else {
                    this.single_set_selected_text(this.choice_label(item));
                }
                if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
                    this.results_hide();
                }
                this.show_search_field_default();
                if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
                    this.form_field_jq.trigger("change", {
                        'selected': this.form_field.options[item.options_index].value
                    });
                }
                this.current_selectedIndex = this.form_field.selectedIndex;
                evt.preventDefault();
                return this.search_field_scale();
            }
        };

        Chosen.prototype.single_set_selected_text = function(text) {
            if (text == null) {
                text = this.default_text;
            }
            if (text === this.default_text) {
                this.selected_item.addClass("chosen-default");
            } else {
                this.single_deselect_control_build();
                this.selected_item.removeClass("chosen-default");
            }
            return this.selected_item.find("span").html(text);
        };

        Chosen.prototype.result_deselect = function(pos) {
            var result_data;
            result_data = this.results_data[pos];
            if (!this.form_field.options[result_data.options_index].disabled) {
                result_data.selected = false;
                this.form_field.options[result_data.options_index].selected = false;
                this.selected_option_count = null;
                this.result_clear_highlight();
                if (this.results_showing) {
                    this.winnow_results();
                }
                this.form_field_jq.trigger("change", {
                    deselected: this.form_field.options[result_data.options_index].value
                });
                this.search_field_scale();
                return true;
            } else {
                return false;
            }
        };

        Chosen.prototype.single_deselect_control_build = function() {
            if (!this.allow_single_deselect) {
                return;
            }
            if (!this.selected_item.find("abbr").length) {
                this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
            }
            return this.selected_item.addClass("chosen-single-with-deselect");
        };

        Chosen.prototype.get_search_text = function() {
            return $('<div/>').text($.trim(this.search_field.val())).html();
        };

        Chosen.prototype.winnow_results_set_highlight = function() {
            var do_high, selected_results;
            selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
            do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
            if (do_high != null) {
                return this.result_do_highlight(do_high);
            }
        };

        Chosen.prototype.no_results = function(terms) {
            var no_results_html;
            no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
            no_results_html.find("span").first().html(terms);
            this.search_results.append(no_results_html);
            return this.form_field_jq.trigger("chosen:no_results", {
                chosen: this
            });
        };

        Chosen.prototype.no_results_clear = function() {
            return this.search_results.find(".no-results").remove();
        };

        Chosen.prototype.keydown_arrow = function() {
            var next_sib;
            if (this.results_showing && this.result_highlight) {
                next_sib = this.result_highlight.nextAll("li.active-result").first();
                if (next_sib) {
                    return this.result_do_highlight(next_sib);
                }
            } else {
                return this.results_show();
            }
        };

        Chosen.prototype.keyup_arrow = function() {
            var prev_sibs;
            if (!this.results_showing && !this.is_multiple) {
                return this.results_show();
            } else if (this.result_highlight) {
                prev_sibs = this.result_highlight.prevAll("li.active-result");
                if (prev_sibs.length) {
                    return this.result_do_highlight(prev_sibs.first());
                } else {
                    if (this.choices_count() > 0) {
                        this.results_hide();
                    }
                    return this.result_clear_highlight();
                }
            }
        };

        Chosen.prototype.keydown_backstroke = function() {
            var next_available_destroy;
            if (this.pending_backstroke) {
                this.choice_destroy(this.pending_backstroke.find("a").first());
                return this.clear_backstroke();
            } else {
                next_available_destroy = this.search_container.siblings("li.search-choice").last();
                if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
                    this.pending_backstroke = next_available_destroy;
                    if (this.single_backstroke_delete) {
                        return this.keydown_backstroke();
                    } else {
                        return this.pending_backstroke.addClass("search-choice-focus");
                    }
                }
            }
        };

        Chosen.prototype.clear_backstroke = function() {
            if (this.pending_backstroke) {
                this.pending_backstroke.removeClass("search-choice-focus");
            }
            return this.pending_backstroke = null;
        };

        Chosen.prototype.keydown_checker = function(evt) {
            var stroke, _ref1;
            stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
            this.search_field_scale();
            if (stroke !== 8 && this.pending_backstroke) {
                this.clear_backstroke();
            }
            switch (stroke) {
                case 8:
                    this.backstroke_length = this.search_field.val().length;
                    break;
                case 9:
                    if (this.results_showing && !this.is_multiple) {
                        this.result_select(evt);
                    }
                    this.mouse_on_container = false;
                    break;
                case 13:
                    if (this.results_showing) {
                        evt.preventDefault();
                    }
                    break;
                case 32:
                    if (this.disable_search) {
                        evt.preventDefault();
                    }
                    break;
                case 38:
                    evt.preventDefault();
                    this.keyup_arrow();
                    break;
                case 40:
                    evt.preventDefault();
                    this.keydown_arrow();
                    break;
            }
        };

        Chosen.prototype.search_field_scale = function() {
            var div, f_width, h, style, style_block, styles, w, _i, _len;
            if (this.is_multiple) {
                h = 0;
                w = 0;
                style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
                styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
                for (_i = 0, _len = styles.length; _i < _len; _i++) {
                    style = styles[_i];
                    style_block += style + ":" + this.search_field.css(style) + ";";
                }
                div = $('<div />', {
                    'style': style_block
                });
                div.text(this.search_field.val());
                $('body').append(div);
                w = div.width() + 25;
                div.remove();
                f_width = this.container.outerWidth();
                if (w > f_width - 10) {
                    w = f_width - 10;
                }
                return this.search_field.css({
                    'width': w + 'px'
                });
            }
        };

        return Chosen;

    })(AbstractChosen);

}).call(this);
});$(document).ready(function(){$("#newComment, #cancel_comment").on("click",function(e){e.preventDefault();var form=$("#newCommentForm").toggleClass("active");form.find("textarea").val("");form.find('[type\x3d"checkbox"]').prop("checked",false)});$("#admin_comment_form").prepare_form_advanced({"handlers":"#submit_comment","disable":"#submit_comment",version_exception:true,"onSuccess":function(){if(typeof comment_obj!="object")comment_obj=new $.ajax_prototype({type:"POST",url:"/comments",success:function(data){if(data.success){var form=
$("#newCommentForm").removeClass("active");form.find("textarea").val("");form.find('[type\x3d"checkbox"]').prop("checked",false);$("#commentsCont").prepend($("#comment-temp").html().replace("##id##",data.data.id).replace("##initiated_by##",data.data.initiated_by).replace("##created_at##",data.data.created_at).replace("##comment##",data.data.comment.replace(/\n/g,"\x3cbr\x3e")));if(!$.isEmptyObject(data.data.attributes)){var attributes=data.data.attributes;var comment=$("#commentsCont").find(".item:first");
if("important"in attributes)comment.addClass("important")}}else globalApplicationErrors(data,"")}},"admin_comment_form");comment_obj.data=$("#admin_comment_form").serialize();$.ajax(comment_obj)}});$(document).on("click",".delete_btn",function(e){e.preventDefault();var comment=$(this).closest("[data-comment-id]");comment.hide();if(typeof delete_comment!="obj")delete_comment=new $.ajax_prototype({"type":"POST","data":{"_token":$('[name\x3d"_token"]').val()},success:function(data){if(data.success)comment.remove();
else{globalApplicationErrors(data,"");comment.show()}}});delete_comment.url="/comments/"+comment.attr("data-comment-id")+"/delete";$.ajax(delete_comment)})});
$(document).ready(function(){$("main").css("min-height",$("main").height()-parseInt($("#footer").css("padding-top"))+"px");$("#btnStatusSuspend,#btnStatusActivate").on("click",function(e){e.preventDefault();$("#suspendConfirm").attr({"data-action":$(this).attr("href")}).modal_open()});$("#suspendConfirm #gen_mod_submit").on("click",function(e){e.preventDefault();status_con.url=$("#suspendConfirm").attr("data-action");$.ajax(status_con)});$("#suspendConfirm .cancel").on("click",function(e){e.preventDefault();
$("#suspendConfirm").modal_close()});if($("#suspendConfirm").length)status_con=new $.ajax_prototype({"type":"post","success":function(data){adminSussUserReqCall(data)},"data":$("#suspendConfirm form").serialize()});if($(".content_form").length)$(document).on("keypress",function(e){if(e.keyCode==27){e.preventDefault();$(".button.cancel:visible").click()}});$("#country").on("change",function(){value=$(this).val();$(".required_country").each(function(){country=$(this);input=country.closest(".row").find(".columns:last input");
if(input.val()=="")country.chosen_update(value).change()})});$(".switch:not(.exception)").on("click",function(){closeLine($(".item.opened"))});$(document).on("click",".button.delete",function(e){e.preventDefault();modal=$("#deleteModal").attr({"data-action":$(this).attr("href")});modal.modal_open();if(typeof info_text!="undefined"){name=$(this).closest(".responsiveTableRow").attr("data-name");if(name!="null")name="\x3cstrong\x3e"+name+"\x3c/strong\x3e";else name="";id="\x3cstrong\x3e"+$(this).closest(".responsiveTableRow").attr("data-id")+
"\x3c/strong\x3e";modal.find("#target").html(info_text.replace("#namep#",name).replace("#idp#",id))}$(this).blur()});$("#errorDomains").find(".closeMessage").on("click",function(e){e.preventDefault();$("#errorDomains").slideUp("default")})});function makeHoverable(edit){$(".item:has("+edit+")").removeClass("non-hover")}
function adminSussUserReqCall(data){if(data.success==true){suspend=$("#btnStatusSuspend").closest("li");activate=$("#btnStatusActivate").closest("li");if(data.data=="active"){$(".username").addClass("success").removeClass("alert warning");$("#suspendConfirm #modal_notice").text(COMMON_LANG.CONFIRMS.USER_STATUS.ACTIVE.replace("%%USERNAME%%",$('.content_static [data-about\x3d"name"]').text()));suspend.show();activate.hide()}else{$(".username").addClass("alert").removeClass("success warning");$("#suspendConfirm #modal_notice").text(COMMON_LANG.CONFIRMS.USER_STATUS.SUSPEND.replace("%%USERNAME%%",
$('.content_static [data-about\x3d"name"]').text()));suspend.hide();activate.show()}}else if(data.code==error_codes.user_status_not_found)$.alertHandler("",data.msg,alert_box_failure);else globalApplicationErrors(data);$("#suspendConfirm").modal_close()};
$(document).ready(function(){use_global_handler=true;$.fn.extend({displayIndividualErrors:function(error){displayIndividualInputErrors($(this),error);return this}});$.extend({alertHandler:function(formid,mssg,alertType,data,error_code,outerShutter){var cartDomainAlertCont=$("#errorDomains");if(cartDomainAlertCont.length){cartDomainAlertCont.hide();if(typeof cartDomainAlert!="undefined")clearTimeout(cartDomainAlert)}alert["formid"]=formid;alert["mssg"]=mssg;alert["alert"]=alertType;alert["error_code"]=
error_code;alert["data"]=data;alert["outerShutter"]=outerShutter?outerShutter:false;killDisplays("",error_code);return false},displayErrors:function(formid,data){displayErrorInputMessages(formid,data)},closeDisplays:function(){killDisplays(true)}});$(function(){var inputs=$("input, textarea, text, button");var inputTo;inputs.on("keydown",function(e){var targets=$("input:visible:not(:disabled), textarea");if(e.keyCode==9||e.which==9){e.preventDefault();if(e.shiftKey)var inputTo=targets.get(targets.index(this)-
1);else inputTo=targets.get(targets.index(this)+1);if(inputTo)inputTo.focus();else targets[0].focus()}})});$(document).on("change",".gdpr_approvals",function(){if($(".gdpr_approvals:checked").length)$("#login_btn").removeClass("disabled");else $("#login_btn").addClass("disabled")})});var custom_selectors_apply={};var common_error_modal='\x3cdiv id\x3d"errorModal" class\x3d"reveal-modal tiny" data-reveal aria-labelledby\x3d"" role\x3d"" data-options\x3d"close_on_background_click:false; close_on_esc:false;" style\x3d"display: none"\x3e\x3cdiv class\x3d"row collapse"\x3e\x3cdiv class\x3d"small-12 columns"\x3e\x3cp id\x3d"errorModalTitle" class\x3d"lead red"\x3e\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"modal-content"\x3e\x3cdiv class\x3d"row"\x3e\x3cdiv class\x3d"small-12 columns"\x3e\x3cp id\x3d"errorModalContent"\x3e\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e';
var gdpr_built=false;alert_box_failure="alert";alert_box_warning="warning";alert_box_success="success";alert_visibility_duration=11E3;alert_help_box='\x3cdiv class\x3d"alert-box help-block alert"\x3e\x3c/div\x3e';function globalErrorsHandler(x,modalError){if(x.readyState==0)connectionErrors(x.statusText,modalError);else if(x.readyState==4)if(x.status!=200)httpErrors("http"+x.status)}
function connectionErrors(statusText,modalError){switch(statusText){case "timeout":{if(typeof modalError!="undefined"&&modalError===true)openModalError(function(modal){modal.find("#errorModalTitle").text(APP_LANG.MESSAGES.TIMEOUT_UNRECOVERABLE.TITLE);modal.find("#errorModalContent").html(APP_LANG.MESSAGES.TIMEOUT_UNRECOVERABLE.CONTENT)});else $.alertHandler("",APP_LANG.MESSAGES.TIMEOUT,alert_box_failure,"","timeout");break}default:{$.alertHandler("",APP_LANG.MESSAGES.ERROR,alert_box_failure,"","default")}}}
function httpErrors(error_code){$.alertHandler("",APP_LANG.MESSAGES.ERROR,alert_box_failure,"",error_code)}function openModalError(callback){if(typeof callback!="function")throw"Callback function is not defined";$("body").append(common_error_modal);var modal=$("#errorModal");try{modal.modal_open()}catch($err){}callback(modal)}
function globalApplicationErrors(response,formId,custom_selectors){if(typeof custom_selectors=="object")$.extend(custom_selectors_apply,custom_selectors);if(typeof response=="object"&&"success"in response&&!response.success)switch(response.code){case error_codes.validation_error:{$.displayErrors(formId,response.data);break}case error_codes.sql_error:case error_codes.update_db_error:case error_codes.delete_db_error:{$.alertHandler("",response.msg,alert_box_failure);break}case error_codes.unrecognized_action:{$.alertHandler("",
APP_LANG.MESSAGES.ERROR,alert_box_failure);break}case error_codes.action_not_allowed:case error_codes.insufficient_permissions:{$.alertHandler("",response.msg,alert_box_failure);break}case error_codes.session_error:{break}case error_codes.session_active:{document.location.reload(true);break}case error_codes.ip_blacklisted:{$.alertHandler("",response.msg,alert_box_failure);break}case error_codes.login_failed:{$.alertHandler(formId,response.msg,alert_box_failure);break}case error_codes.two_factor_auth:{$.alertHandler("",
response.msg,alert_box_warning);break}case error_codes.account_auto_suspended:case error_codes.account_suspended:{current_location=window.location.href;if(checkIfLocationIsBackend(current_location))if(/\//g.test(current_location))$.set_cookie("errorCode",[response.msg,response.success],"/");else $.alertHandler("",response.msg,alert_box_failure,response.data);else $.alertHandler("",response.msg,alert_box_failure,response.data);break}case error_codes.registry_maintenance:case error_codes.domain_is_not_valid:case error_codes.domain_check_failed:case error_codes.domain_info_failed:case error_codes.domain_does_not_exist:case error_codes.invalid_domain_cant_be_registered:case error_codes.domain_max_length_reached:case error_codes.domain_registrant_is_dnhost:case error_codes.invalid_epp_auth:case error_codes.domain_not_registered_cant_be_transferred_not_registered:case error_codes.can_not_get_premium_quote:case error_codes.domain_register_failed:case error_codes.domain_not_registered_cant_be_transferred_syntax_error:case error_codes.domain_not_registered_cant_be_transferred_tld_unsupported:case error_codes.domain_check_renew_with_auto_renew_failed:{$.alertHandler(formId,
response.msg,alert_box_failure);break}case error_codes.cart_item_not_found:{cartItemNotFound(response);break}case error_codes.cart_action_exception:case error_codes.item_already_in_cart:case error_codes.cart_option_error:case error_codes.cart_attribute_error:case error_codes.domain_already_in_cart:case error_codes.parent_child_does_not_exist:case error_codes.item_cant_be_child:case error_codes.item_associated_as_child:case error_codes.get_domain_info_failed:case error_codes.cart_not_associated_with_billing_profile:case error_codes.domain_check_failure:{$.alertHandler(formId,
response.msg,alert_box_failure);break}case error_codes.cart_item_attributes_missing:{$.alertHandler(formId,response.msg,alert_box_failure);break}case error_codes.cart_extension_error:{$.alertHandler(formId,response.msg,alert_box_failure);break}case error_codes.certificate_auto_reorder_failed:{$.alertHandler("",response.msg,alert_box_failure);break}case error_codes.certificate_out_of_renew_period:{$.alertHandler("",response.data,alert_box_failure);break}case error_codes.ssl_store_in_maintenance:{$.alertHandler("",
response.data,alert_box_failure);break}case error_codes.profile_required_gdpr_approval:{loginGdprApprovalRequired(response);break}case error_codes.token_error:{location.reload(true);break}case error_codes.network_connection_error:{$.alertHandler("",response.msg,alert_box_failure);break}case error_codes.access_denied:{document.location.href=response.data;break}default:{$.alertHandler("",response.msg?response.msg:APP_LANG.MESSAGES.ERROR,alert_box_failure)}}else $.alertHandler("",APP_LANG.MESSAGES.ERROR,
alert_box_failure);var gdprModal=$("#gdpr_approval_modal");if(gdprModal.length){$("#gdpr_approval_modal .disabled").removeClass("disabled");var modal_bg=$(".reveal-modal-bg");modal_bg.css("z-index",modal_bg.attr("data-init-index"));var loader_cont=gdprModal.find(".loader_cont");loader_cont.find(".submitText").show();loader_cont.find(".loading").hide()}}
function creditDocumentApplicationErrors(response,formId){switch(response.code){case error_codes.credit_action_not_found:case error_codes.credit_document_not_found:case error_codes.credit_status_not_permitted:case error_codes.credit_paying_not_allowed_by_status:{$.alertHandler("",response.msg,alert_box_failure)}default:{billingDocumentsApplicationErrors(response,formId);break}}}
function billingDocumentsApplicationErrors(response,formId){switch(response.code){case error_codes.user_credit_exhausted:case error_codes.sale_document_update_exception:case error_codes.sale_document_not_found:case error_codes.due_status_does_not_allow_payment:case error_codes.due_type_does_not_allow_payment:case error_codes.paying_document_status_does_not_allow_payment:case error_codes.paying_document_type_does_not_allow_payment:case error_codes.due_document_balance_already_paid:case error_codes.paying_document_balance_is_zero:case error_codes.document_action_not_permitted:case error_codes.requested_task_not_allowed:case error_codes.document_status_not_permitted:case error_codes.document_balance_total_difference:case error_codes.no_due_document_defined:case error_codes.no_paying_document_defined:case error_codes.balance_must_be_zero_or_equal:case error_codes.undefined_document_status:case error_codes.order_not_found:case error_codes.order_item_pending_process_after:case error_codes.order_item_expired:case error_codes.order_requested_status_not_executable:case error_codes.invoice_billing_profile_missing:case error_codes.invoice_must_be_requested_by_order:case error_codes.invoice_already_exists_for_this_document:case error_codes.credit_action_not_found:case error_codes.credit_document_not_found:case error_codes.credit_status_not_permitted:case error_codes.credit_paying_not_allowed_by_status:case error_codes.debit_status_does_not_allow_cancel:{$.alertHandler("",response.msg,
alert_box_failure);break}default:{globalApplicationErrors(response,formId);break}}}
function masterDocumentsApplicationErrorsHandler(response,formId){switch(response.code){case error_codes.sale_document_update_exception:case error_codes.sale_document_not_found:case error_codes.due_status_does_not_allow_payment:case error_codes.due_type_does_not_allow_payment:case error_codes.paying_document_status_does_not_allow_payment:case error_codes.paying_document_type_does_not_allow_payment:case error_codes.due_document_balance_already_paid:case error_codes.paying_document_balance_is_zero:case error_codes.document_action_not_permitted:case error_codes.document_status_not_permitted:case error_codes.document_balance_total_difference:case error_codes.credit_action_not_found:case error_codes.credit_document_not_found:case error_codes.credit_status_not_permitted:case error_codes.credit_paying_not_allowed_by_status:{$.alertHandler("",response.msg,
alert_box_failure);break}default:{globalApplicationErrors(response,formId);break}}}function enableGlobalHandler(){use_global_handler=true}function disableGlobalHandler(){use_global_handler=false}function userProfileVerificationCodeError(formId,msg){$.displayErrors(formId,{"verification_code":msg})}function verificationTargetErrors(formId,msg,success){if(success)$.alertHandler(formId,msg,alert_box_success);else $.alertHandler(formId,msg,alert_box_failure)}
function userProfileVerificationErrors(formId,msg){$.alertHandler(formId,msg,alert_box_failure)}function passResetUserNotFound(formId,msg,data){$.alertHandler(formId,msg,alert_box_failure,data)}function unauthorisedEmailError(formId,msg){$.alertHandler(formId,msg,alert_box_failure)}
function resetPassTwoFactorFailed(){$(".step:visible").hide();$("#reset-view3,#failed-auth").show();formId=$(".step:visible form").attr("id");$("#btn-method-skip").text(COMMON_LANG.BUTTONS.RESET_NO_ACCESS).addClass("button expand warning").removeClass("link").blur();initializeNextForm()}function passwordVerificationErrors(formId,msg){$.alertHandler(formId,msg,alert_box_failure)}function setMobileResetErrors(formId,msg){$.alertHandler(formId,msg,alert_box_failure)}
function invalidResetOption(msg){$.alertHandler("",msg,alert_box_warning)}function billingProfileNotFound(msg){$("#infoModal").modal_open().find(".modal-content p").text(msg)}function billingProfileSetDefaultProhibited(msg){$.alertHandler("",msg,alert_box_failure)}function contactProfileNotFound(msg){$("#infoModal").modal_open().find(".modal-content p").text(msg)}
function individualTypeNameMismatch(given_name){$('[name\x3d"first_name_int_ind"]').show_validation_error(given_name);$('[name\x3d"last_name_int_ind"]').show_validation_error(given_name)}
function cartItemNotFound(response){var not_found=response.data.not_found;var item=$('.item[data-cart-item-id\x3d"'+not_found+'"]');var prices_box=$(".prices-box");var domain=$('.tldResults[data-cart-item-id\x3d"'+not_found+'"], .singleResult[data-cart-item-id\x3d"'+not_found+'"]');$.cart.remove(not_found);if(item.length)item.remove();if(prices_box.length){$("#order").text($.imperial_to_metric(response.data.check_out.totals.sub_total));$("#order_vat").text($.imperial_to_metric(response.data.check_out.totals.vat));
$("#order_total").text($.imperial_to_metric(response.data.check_out.totals.grand_total))}if(domain.length)domain.find(".cart-button, .singleButtonTarget").removeClass("selected");if($(".panel.specs").length)$.alertHandler("",response.msg,alert_box_failure)}
function loginGdprApprovalRequired(){var form=$("#form-login-modal, #form-login");$("#inputs_cont, #newsletter_cont, #agreement_cont, #agreement_list_cont, #explanation_cont, #info_cont").remove();form.find("#email, #password").closest(".row").hide();form.prepend('\x3cdiv id\x3d"inputs_cont"\x3e \n'+'\x3cinput id\x3d"communication_agreement" name\x3d"communication_agreement" type\x3d"hidden" value\x3d"1"\x3e \n'+'\x3cinput id\x3d"data_validity" name\x3d"data_validity" type\x3d"hidden" value\x3d"1"\x3e \n'+
'\x3cinput id\x3d"processing_approval" name\x3d"processing_approval" type\x3d"hidden" value\x3d"1"\x3e \n'+'\x3cinput id\x3d"newsletter_hidden" name\x3d"newsletter" type\x3d"hidden" value\x3d"0"\x3e \n'+"\x3c/div\x3e");form.prepend('\x3cdiv id\x3d"newsletter_cont" class\x3d"row"\x3e\n'+'            \x3cdiv class\x3d"large-12 columns agree-terms"\x3e\n'+'                \x3cdiv class\x3d"checkbox"\x3e\n'+'                    \x3clabel class\x3d"text-left"\x3e\n'+'                        \x3cinput id\x3d"newsletter_dial" name\x3d"newsletter_dial" type\x3d"checkbox" value\x3d"1"\x3e\n'+
'                        \x3cspan class\x3d"checkbox__label"\x3e'+$.translate("gdpr.login.newsletter_label")+"\x3c/span\x3e\n"+"                    \x3c/label\x3e\n"+"                \x3c/div\x3e\n"+"            \x3c/div\x3e\n"+"        \x3c/div\x3e");form.prepend('\x3cdiv id\x3d"agreement_cont" class\x3d"row"\x3e\n'+'            \x3cdiv class\x3d"large-12 columns agree-terms"\x3e\n'+'                \x3cdiv class\x3d"checkbox"\x3e\n'+'                    \x3clabel class\x3d"text-left"\x3e\n'+'                        \x3cinput id\x3d"agreement" class\x3d"gdpr_approvals" data-validate\x3d"terms_and_conditions" data-validate-error-msg\x3d"'+
$.translate("gdpr.login.accept_all_above_label_error")+'" data-sibling-class\x3d"checkbox__label" name\x3d"agreement" type\x3d"checkbox" value\x3d"1"\x3e\n'+'                        \x3cspan class\x3d"checkbox__label"\x3e'+$.translate("gdpr.login.accept_all_above_label")+"\x3c/span\x3e\n"+"                    \x3c/label\x3e\n"+"                \x3c/div\x3e\n"+"            \x3c/div\x3e\n"+"        \x3c/div\x3e");form.prepend('\x3cdiv id\x3d"agreement_list_cont" class\x3d"row"\x3e\n'+'            \x3cdiv class\x3d"large-12 right columns"\x3e\n'+
'                \x3cul class\x3d"global-list"\x3e\n'+"                    \x3cli\x3e"+$.translate("gdpr.login.processing_approval_label")+"\x3c/li\x3e\n"+"                    \x3cli\x3e"+$.translate("gdpr.login.data_validity_label")+"\x3c/li\x3e\n"+"                    \x3cli\x3e"+$.translate("gdpr.login.communication_agreement_label")+"\x3c/li\x3e\n"+"                \x3c/ul\x3e\n"+"            \x3c/div\x3e\n"+"        \x3c/div\x3e");form.prepend('\x3cdiv id\x3d"explanation_cont"\x3e'+$.translate("gdpr.login.explanation")+
"\x3c/div\x3e");form.prepend('\x3cdiv id\x3d"info_cont" class\x3d"alert-box info"\x3e\x3cp class\x3d"no-margin-bottom smallest small-font"\x3e\x3cstrong\x3e'+$.translate("gdpr.login.explanation_title")+"\x3c/strong\x3e\x3c/p\x3e\x3c/div\x3e");if(window.location.href.match(/http(s)?:\/\/my/)==null){form.addClass("with-scroll");$("#explanation_cont li").css({"margin-bottom":"0.5rem","line-height":"1.3"})}else{$("#explanation_cont li").css("margin-bottom","0.5rem");$("#explanation_cont ul").css("font-size",
"")}$("#login_btn").translate("misc.acceptance");form.closest("div").find("hr:last").hide();$("#passResetLink").hide();if(gdpr_built==false){$.observers.register("register_forms",function(mutations){if(typeof $loginErrors=="undefined"||$loginErrors==null){$("#inputs_cont, #newsletter_cont, #agreement_cont, #agreement_list_cont, #explanation_cont, #info_cont").remove();form.find("#email, #password").val("").closest(".row").show();form.closest("div").find("hr:last").show();$("#passResetLink").show();
form.removeClass("with-scroll");$("#login_btn").translate("misc.login").removeClass("disabled");gdpr_built=false}});$.observers.observe("register_forms",$("#register-forms, #panel1"),{attributes:true,attributeFilter:["class"]})}gdpr_built=true;setTimeout(function(){$loginErrors=null},500)}
function killDisplays(no_trigger,error_code){message=$("#alertContainer");set_error_code=message.attr("data-error-code");if(set_error_code&&error_code&&set_error_code==error_code)return;if(message.is(":visible")){clearTimeout(timeOut);$("#alertContainer").slideUp("default",function(){if(!no_trigger)clearAlertNotice(error_code)})}else if(!no_trigger)clearAlertNotice(error_code);if(!no_trigger)$("#alertContainer").removeAttr("data-error-code")}
function shutter(adelay,aslide){if(aslide===undefined||aslide=="")aslide=400;else if(aslide=="slow")aslide=800;else if(aslide=="medium")aslide=400;else if(aslide=="fast")aslide=200;if(adelay===undefined||adelay=="")adelay=0;else if(adelay=="slow")adelay=800;else if(adelay=="medium")adelay=400;else if(adelay=="fast")adelay=200;timeOut=setTimeout(function(){$("#alertContainer").removeAttr("data-error-code","").slideUp(aslide)},adelay)}
function displayAlertMessages(formid,myMessage,messageType,data,error_code,outerShutter,element){if(alert["control"]){if(outerShutter===undefined||outerShutter=="")outerShutter=false;$("#message").remove();if(messageType==""||messageType===undefined)messageType=alert_box_warning;if(myMessage==""||myMessage===undefined)myMessage=APP_LANG.MESSAGES.ERROR;$("#alertMessage").addClass(messageType);$("#alertMessage .icon-announcement").after("\x3cspan id\x3d'message'\x3e"+myMessage+"\x3c/span\x3e");$("#alertContainer").slideDown(700);
if(error_code)$("#alertContainer").attr("data-error-code",error_code);if(outerShutter==false)shutter(alert_visibility_duration,700);$("button.disabled").removeClass("disabled",function(){if((element!==undefined||element!=="")&&alert==alert_box_success)$(element).remove();if(data===false||data===undefined||data==="")if(formid!==undefined||formid!=="")displayErrorInputMessages(formid,data)});if($.isTouch())$(window).scrollTop($(window).scrollTop()+30);displayErrorInputMessages(formid,data);alertType=
messageType}}
function displayErrorInputMessages(form,errorsInput){if(typeof errorsInput=="undefined")return;form=$("#"+form);$.each(errorsInput,function(i,value){if(Object.keys(custom_selectors_apply).length>0&&i in custom_selectors_apply)element=custom_selectors_apply[i]();else element=form.find('[name\x3d"'+i+'"]');target=false;if(element.length<1){var elements=form.find('[name^\x3d"'+i+'."]');if(elements.length){element=elements.filter(":last");var parent=element.closest(".row");parent.after(alert_help_box);$(parent.parents()[0]).find(".alert-box.help-block:last").text(errorsInput[i])}return}if(element.length>
1)element=element.filter(function(){var obj=$(this);if(obj.is("select"))return $("#"+obj.attr("id")+"_chosen").css("display")!="none";else return obj.css("display")!="none"});if(element.is("select")){element.addClass("error");chosen=form.find("#"+element.attr("id")+"_chosen");if(chosen.length)target=chosen;else element.parent("div").find(".form-error").css({"margin-top":0})}else target=element;if(target){if(typeof target=="object")target=target[0];target=$(target);if(target.hasClass("switch-controller"))target=
$('[for\x3d"'+target.attr("id")+'"]');if(typeof errorsInput[i]=="string")target.after(helperBlock.replace("errorMessage",errorsInput[i]));else $.each(errorsInput[i],function(key,value){target.after(helperBlock.replace("errorMessage",value))});parent=target.addClass("error").parent("div");parent.children("label").addClass("error");var block=parent.find(".help-block:not(:last)");if(block.length)block.css("margin-bottom",0)}form.find('[for\x3d"'+i+'"]').addClass("error")});$(".form-error").addClass("error")}
function displayIndividualInputErrors(element,error){element.addClass("error");var chosen=$("#"+element.attr("id")+"_chosen");if(chosen.length)var label=chosen.addClass("error").after(helperBlock.replace("errorMessage",error)).parent("div").children("label");else label=element.after(helperBlock.replace("errorMessage",error)).parent("div").children("label");if(label.length<1)label=$('label[for\x3d"'+element.attr("id")+'"]');label.addClass("error")}
function removeErrors(){$(".myErrorLabel").removeClass("myErrorLabel").removeClass("error");$("select.error").each(function(){$(this).closest("div").find('[id*\x3d"_chosen"]').addClass("error")})}function clearAlertNotice(error_code){$("#loaderContainer").hide();$("#alertMessage").removeClass(alertType);$("#alertContainer").removeAttr("data-error-code");displayAlertMessages(alert["formid"],alert["mssg"],alert["alert"],alert["data"],error_code,alert["outerShutter"])};
$(document).ready(function(){$.fn.extend({setFieldsVersionControl:function(){setFieldsVersionControl($(this));return this},update_version_control:function(new_value){obj=$(this);if(typeof new_value=="undefined")new_value=obj.val();if(obj.is("select"))if($("#"+obj.attr("id")+"_chosen").length)obj.chosen_update(new_value);else obj.apply_chosen(new_value);else obj.val(new_value);if(new_value===null)new_value="";if($.isArray(new_value))new_value=JSON.stringify(new_value);else new_value=JSON.stringify([new_value]);
obj.attr({"data-last-val":new_value});return obj},set_text:function(value,delimiter){if(!$.isArray(value)){value=value?value:"-";if($.htmlLookUp(value))$(this).html(value);else $(this).text(value)}else{var temp="";var texts=value.length;$.each(value,function(key,string){if(temp==""){if(string!=null)temp=string}else if(string!=null)if(typeof delimiter!="undefined"&&delimiter!="()")temp=temp+" "+delimiter+" "+string;else if(typeof delimiter!="undefined"&&texts)temp=temp+" ("+string+")";else temp=temp+
" "+string});if($.htmlLookUp(temp))$(this).html(temp);else $(this).text(temp)}return $(this)},text_app:function(val){var obj=$(this);if(val){var text=obj.text();if(!text)text="";obj.text(text+val)}return obj},text_pre:function(val){var obj=$(this);if(val){var text=obj.text();if(!text)text="";obj.text(val+text)}return obj}});$.extend({update_version_control:function(properties){if(typeof properties=="object")if("radio"in properties){title=properties["radio"].toLowerCase()+"_radio";$("#"+title).prop({"checked":true}).closest(".inline-list").attr({"data-last-checked":properties["radio"]})}}});
$(document).on("click",".add_btn, .edit_btn,.item .cancel:not(.disabled)",function(e){e.preventDefault();var obj=$(this);line=obj.closest(".item");open_line=$(".editable_line.opened");obj.hasClass("edit_btn")?closePreviousAndOpenCurrent(open_line,line):cancelCurrentLineForm(line);if(obj.hasClass("add_btn"))openLine(obj.closest(".item"))}).on("click",".item .cancel.disabled",function(e){e.preventDefault()}).on("click",".edit_block_btn.disabled",function(e){e.preventDefault()}).on("click",".edit_block_btn:not(.disabled), .cancel_block_btn",
function(e){e.preventDefault();previously_open=$(".is-open");if(previously_open.length){previously_open.find("[data-last-val]").each(function(){var obj=$(this);if(obj.is("select"))obj.chosen_update(obj.attr("data-last-val"));else obj.val(obj.attr("data-last-val"))});if($(this).hasClass("edit_block_btn")){$(".is-closed").toggleClass("is-closed");previously_open.toggleClass("is-open")}previously_open.find(".error").removeClass("error").filter(".help-block").remove();previously_open.find(".form-error").remove();
$(".item:not(.block_item)").removeClass("opened")}wrapper=$(this).closest(".wrapper");wrapper.find(".display_items").toggleClass("is-closed");wrapper.find(".display_form").toggleClass("is-open")});var gdpr_approval_modal=$("#gdpr_approval_modal");$.observers.register("gdpr_approval_modal",function(mutations){var src=gdpr_approval_modal.attr("data-form-src");if(!gdpr_approval_modal.hasClass("open")){var modal_bg=$(".reveal-modal-bg");modal_bg.css("z-index",modal_bg.attr("data-init-index"));gdpr_approval_modal.find('[type\x3d"checkbox"]').prop("checked",
false);gdpr_approval_modal.find(".disabled").removeClass("disabled");var form=$("#"+src);form.enable_form_controls();$("#gdprPassCont").hide().find("input").val("");if(src=="mobile_notification_form"){var input=form.find('[type\x3d"checkbox"].pending');input.removeClass("pending").prop("checked",!input.prop("checked"))}gdpr_approval_modal.find(".reveal-password:has(.icon-eye)").click()}else{src=gdpr_approval_modal.attr("data-form-src");if(src=="mobile_notification_form"||src=="icann_auto_approval_form")gdpr_approval_modal.find("#gdprPassCont").show()}});
$.observers.observe("gdpr_approval_modal",gdpr_approval_modal,{attributes:true,attributeFilter:["class"]})});var results_storage={};var config;
function commonEditableFormCallback(data,storage_key,form,errorHandler){if(data.success){if(!$.isPlainObject(data.data.result)||$.isEmptyObject(data.data.result)){closeLine(form.closest(".item"));return}if(data.data.action=="setFax"&&data.data.result.fax.data.cc==null)data.data.result.fax.data.cc=$("#fax_country").val();else if(data.data.action=="setPhone"&&data.data.result.phone.data.cc==null)data.data.result.phone.data.cc=$("#phone_country").val();commonSuccessfulRequest(data.data.result,storage_key);
closeLine(form.closest(".item"));$("#gdpr_approval_modal").modal_close()}else{if(typeof errorHandler!="function")throw"Error handler is not defined.";errorHandler(data,form.attr("id"))}}
function commonSuccessfulRequest(result,storage_key){results_storage[storage_key]=result;$.each(results_storage[storage_key],function(key,value){if(typeof config=="object"&&"skip"in config&&$.inArray(key,config.skip)>-1)return true;if(!$.isPlainObject(value)&&!$.isArray(value))commonHandleNoArrayField(key,value,storage_key);else commonHandleArrayField(key,value,storage_key)})}
function commonHandleNoArrayField(key,value,storage_key){if(key in config.combine){display=getCombinedDisplay(key,value,storage_key);combined_field=config.combine[key].field;var element=$('[name\x3d"'+combined_field+'"');element.update_version_control(results_storage[storage_key][combined_field]);triggerPostUpdateEvent(combined_field,element)}else display=value;$('.data_display[data-about\x3d"'+key+'"]').set_text(display);element=$('[name\x3d"'+key+'"');if(element.length){element.update_version_control(value);
triggerPostUpdateEvent(key,element)}}function commonHandleArrayField(key,value,storage_key){if("data"in value)commonHandleNoLangArrayField(key,value,storage_key);else commonHandleLangArrayField(key,value,storage_key)}
function commonHandleNoLangArrayField(key,value$jscomp$0,storage_key){var data=value$jscomp$0.data;if($.isArray(data));else if($.isPlainObject(data)){$('.data_display[data-about\x3d"'+key+'"]').set_text("display"in value$jscomp$0?value$jscomp$0.display:data);if("cc"in data&&"nr"in data){$('select[id*\x3d"'+key+'"]').update_version_control(data.cc);$('input[name\x3d"'+key+'"]').update_version_control(data.nr)}else $.each(data,function(name,value){var element=$('[name\x3d"'+name+'"]');if(element.is('[type\x3d"text"],select'))element.update_version_control(value);
else if(element.is('[type\x3d"radio"]'))$.update_version_control({"radio":value})})}else{if(key in config.combine)var display=getCombinedDisplay(key,"display"in value$jscomp$0?value$jscomp$0.display:data,storage_key);else display="display"in value$jscomp$0?value$jscomp$0.display:data;$('.data_display[data-about\x3d"'+key+'"]').set_text(display);if(key=="state")if("country"in results_storage[storage_key])if(results_storage[storage_key].country.data=="GR")var element$jscomp$0=$('select[name\x3d"'+key+
'"],select[name\x3d"state_id"]');else element$jscomp$0=$('input[name\x3d"'+key+'"]');else element$jscomp$0=$('[name\x3d"'+key+'"]');else element$jscomp$0=$('[name\x3d"'+key+'"]');element$jscomp$0.update_version_control(data);triggerPostUpdateEvent(key,element$jscomp$0)}}function commonHandleLangArrayField(key,value,storage_key){var loc=value.loc;var int=value.int;processLocalizedData(key,loc,"loc",storage_key);processLocalizedData(key,int,"int",storage_key)}
function processLocalizedData(key,lang,lang_str,storage_key){var data=lang.data;if($.isArray(data)){display_cont=$('[data-about\x3d"'+lang_str+'"] .data_display[data-about\x3d"'+key+'"]').empty();form_cont=$("."+key+"_"+lang_str);form_cont.find("input").val("");if(key in config.combine)$.each(data,function(index,value){display_cont.append("\x3cspan\x3e"+getCombinedDisplay(key,value,storage_key)+"\x3c/span\x3e");form_cont.find('[name*\x3d"'+index+'"]').update_version_control(value)});else $.each(data,
function(index,value){display_cont.append("\x3cspan\x3e"+value+"\x3c/span\x3e");element=form_cont.find('[name*\x3d"'+index+'"]');if(element.length)element.update_version_control(value)});form_cont.find("input:not(:first)").each(function(){if(!$(this).val())$(this).closest(".address-body").remove()})}else{if(key in config.combine){if($.isPlainObject(lang))var display=getCombinedDisplay(key,"display"in lang?lang.display:data,storage_key);else display=getCombinedDisplay(key,lang,storage_key);if(lang_str==
"loc"){combined_field=config.combine[key].field;var element=$("#"+combined_field);if(element.length){element.update_version_control(results_storage[storage_key][combined_field]);triggerPostUpdateEvent(key,element)}}}else if($.isPlainObject(lang))display="display"in lang?lang.display:data;else display=lang;$('[data-about\x3d"'+lang_str+'"] .data_display[data-about\x3d"'+key+'"]').set_text(display);name=lang_str=="int"?key+"_int":key;element=$('[name\x3d"'+name+'"]');if(element.length){element.update_version_control(data);
triggerPostUpdateEvent(key,element)}}}function getCombinedDisplay(key,prefix,storage_key){return prefix+config.combine[key].delimiter+results_storage[storage_key][config.combine[key].field]}function triggerPostUpdateEvent(key,element){if(key in config.event)element.trigger(config.event[key])}
function createHandlerConfig(properties){if(!$.isPlainObject(properties))properties={};if(!("skip"in properties))properties.skip=["zip"];if(!("combine"in properties))properties.combine={city:{field:"zip",delimiter:", "}};if(!("event"in properties))properties.event={};config=properties}
function closeLine(line){line.removeClass("opened");line.find(".content_static").removeClass("is-closed");line.find(".content_form").removeClass("is-open");var gdpr_modal=$("#gdpr_approval_modal");if(gdpr_modal.length);gdpr_modal.modal_close()}function closeBlock(wrapper){wrapper.find(".display_items").removeClass("is-closed");wrapper.find(".display_form").removeClass("is-open")}
function openLine(line){line.addClass("opened");line.find(".content_static").addClass("is-closed");line.find(".content_form").addClass("is-open")}
function closePreviousAndOpenCurrent(open_line,line){if(open_line.length){var form=open_line.find(".content_form form");removeUnsavedChanges(open_line);closeLine(open_line);removeAllFormErrorMessages(open_line.find("form").attr("id"));$(".strength-meter").remove();form.enable_form_controls();form.find(".reveal-password:has(.icon-eye)").click()}openLine(line)}
function cancelCurrentLineForm(line){var form=line.find(".content_form form");removeUnsavedChanges(line);removeAllFormErrorMessages(line.find("form").attr("id"));form.enable_form_controls();closeLine(line);$(".strength-meter").remove();form.find(".reveal-password:has(.icon-eye)").click()}
function removeUnsavedChanges(line){var inputs=line.find('textarea, [type\x3d"email"],[type\x3d"password"],[type\x3d"text"]:not(.chosen-container input):not(:disabled),select:not(#state):not(select[id*\x3d"state"])');inputs.each(function(){var element=$(this);if(element.is("select")){var last_val=element.attr("data-last-val");if(last_val)if(element.attr("data-last-val").indexOf("[")==0)element.chosen_update(typeof element.attr("multiple")=="undefined"?JSON.parse(last_val)[0]:JSON.parse(last_val));
else element.chosen_update(last_val);if(element.attr("id")=="pref_timezone_region"&&element.val())element.change()}else{last_val=element.attr("data-last-val");if(last_val)if(element.attr("data-last-val").indexOf("[")==0)element.val(JSON.parse(last_val)[0]);else element.val(last_val)}});element=line.find("#state, #state_id");if(element.length){val=line.find('[name\x3d"country"]').change().val();var last_val=line.find("#state, #state_id").attr("data-last-val");if(last_val)if(last_val.indexOf("[")==
0)var state=typeof element.attr("multiple")=="undefined"?JSON.parse(last_val)[0]:JSON.parse(last_val);else state=last_val;if(val=="GR"||val=="Greece")element.chosen_update(state);else element.val(state)}line_switch=line.find(".switch input");if(line_switch.length){question=line.find("#question");answer=line.find("#answer");if(question.length&&answer.length&&(question.val()==""||answer.val()=="")){line_switch.prop({"checked":false});line.find(".edit_btn").hide()}}radio_cont=line.find("[data-last-checked]");
if(radio_cont.length)radio_cont.each(function(){$(this).prop({"checked":false});radio_name=$(this).attr("data-last-checked").toLowerCase()+"_radio";$("#"+radio_name).prop({"checked":true})})}function cancelModalConnectedSwitch(modal){form=$("#"+modal.attr("data-src"));switchInput=form.find(".switch input");if(switchInput.length)switchInput.prop({"checked":!switchInput.prop("checked")})}
function statesManager(trigger){if(trigger.val()=="GR"){$("#stateSelect").show().find("select").chosen_update("");$("#stateInput").hide()}else{$("#stateSelect").hide();$("#stateInput").show().find("input").val("")}}function removeAllFormErrorMessages(formId){$("#"+formId+" .help-block").remove();$("#"+formId+" .has-error").removeClass("has-error");$("#"+formId+" .error").removeClass("error").removeAttr("style")}
function setFieldsVersionControl(forms){forms.find('input:not(.chosen-container input):not([type\x3d"radio"]):not([type\x3d"checkbox"]), select, textarea').each(function(){val=$(this).val();if(val==null)val="";if(!$.isArray(val))val=[val];val=JSON.stringify(val);$(this).attr({"data-last-val":val})})}
function nameFormValidationCallback(form,errorHandler){if(typeof name_obj!="object")name_obj=new $.ajax_prototype({"type":"POST","url":form.attr("action"),"success":function(data){commonEditableFormCallback(data,"name",form,errorHandler)}},form.attr("id"));name_obj.data=collectData(form);$.ajax(name_obj)}
function addressFormValidationCallback(form,errorHandler){if(typeof address_obj!="object")address_obj=new $.ajax_prototype({"type":"POST","url":form.attr("action"),"success":function(data){commonEditableFormCallback(data,"address",form,errorHandler);if($(".user_defined").length){$(".user_defined").show();$(".default_address").hide()}if(data.success&&typeof data.data.result.country!="undefined"&&typeof data.data.result.country.data=="string")$("[id*\x3d_country]").each(function(){if(!$("#"+$(this).attr("id").replace("_country",
"")).val())$(this).update_version_control(data.data.result.country.data)})}},form.attr("id"));address_obj.data=collectData(form);$.ajax(address_obj)}function phoneFormValidationCallback(form,form_name,errorHandler){phone_obj=new $.ajax_prototype({"type":"POST","url":form.attr("action"),"success":function(data){commonEditableFormCallback(data,form_name,form,errorHandler)},data:collectData(form)},form.attr("id"));$.ajax(phone_obj)}
function collectData(form){if(form.find('[id^\x3d"state"]').length){var data={};form.find("input:not(.chosen-container input):not(#state)").each(function(){data[$(this).attr("name")]=$(this).val()});data["country"]=form.find("#country").val();select_state=$('select[id^\x3d"state"]');if(form.find("#"+select_state.attr("id")+"_chosen:visible").length||select_state.length&&select_state.is(":visible")){data["state_id"]=select_state.find("option:selected").attr("data-lang");if(data["state_id"]<10)data["state_id"]=
"0"+data["state_id"]}else data["state"]=form.find("#state").val()}else data=form.serialize();var modal=$("#gdpr_approval_modal.open");if(modal.length)if(modal.find("#agree_terms:checked").length){var communication_agreement=modal.find('[name\x3d"communication_agreement"]');var data_validity=modal.find('[name\x3d"data_validity"]');var processing_approval=modal.find('[name\x3d"processing_approval"]');if(typeof data=="string")data+="\x26communication_agreement\x3d"+communication_agreement.val()+"\x26data_validity\x3d"+
data_validity.val()+"\x26processing_approval\x3d"+processing_approval.val();else if(typeof data=="object")$.extend(data,{"communication_agreement":communication_agreement.val(),"data_validity":data_validity.val(),"processing_approval":processing_approval.val()})}return data}
function openGDPRApprovalModal(form$jscomp$1){if($.is_user()){var modal$jscomp$0=$("#gdpr_approval_modal");var modal_form=modal$jscomp$0.find("form");modal$jscomp$0.modal_open(function(){modal$jscomp$0.attr("data-form-src",form$jscomp$1.attr("id"))});if(!modal_form.is_ready())modal_form.prepare_form_advanced({handlers:".request-verify",disable:".button, .close-reveal-mymodal",version_exception:true,onSuccess:function(){var modal_bg=$(".reveal-modal-bg");var form=$("#"+modal$jscomp$0.attr("data-form-src"));
modal_bg.attr("data-init-index",modal_bg.css("z-index")).css("z-index",parseInt(modal$jscomp$0.css("z-index"))+1);getGDPRCallback(form)}})}else(function(form$jscomp$0){if(form$jscomp$0.attr("id")=="mobile_notification_form"){var modal=$("#security-confirm").attr("data-src",form$jscomp$0.attr("id")).modal_open();var modal_form=modal.find("form");if(!modal_form.is_ready())modal_form.prepare_form_advanced({handlers:".request-verify",disable:".button, .close-reveal-mymodal",version_exception:true,onSuccess:function(){var modal_bg=
$(".reveal-modal-bg");var form=$("#"+modal.attr("data-src"));modal_bg.attr("data-init-index",modal_bg.css("z-index")).css("z-index",parseInt(modal.css("z-index"))+1);getGDPRCallback(form)}})}else getGDPRCallback(form$jscomp$0)})(form$jscomp$1)}
function getGDPRCallback(form){switch(form.attr("id")){case "identity_form":nameFormValidationCallback(form,function(data,formId){$.user_profile.handleErrors(data,formId)});break;case "birthday_form":$.user_profile.birthdayFormValidationCallback(form);break;case "company_form":$.user_profile.companyFormValidationCallback(form);break;case "address_form":addressFormValidationCallback(form,function(data,formId){if(window.location.pathname.indexOf("/account")>-1)$.user_profile.handleErrors(data,formId);
else $.edit_billing_profiee.handleErrors(data,formId)});break;case "email_form":$.user_profile.emailFormValidationCallback(form);break;case "mobile_form":$.user_profile.mobileFormValidationCallback(form);break;case "landline_form":case "fax_form":phoneFormValidationCallback(form,form.attr("id"),function(data,formId){$.user_profile.handleErrors(data,formId)});break;case "mobile_notification_form":$.user_profile.mobileNotificationValidationCallback(form);break;case "icann_auto_approval_form":$.user_profile.icannAutoApproveValidationCallback(form);
break;case "set_contact_name_form":nameFormValidationCallback(form,function(data,formId){$.edit_contact.handleErrors(data,formId)});break;case "set_address_form":addressFormValidationCallback(form,function(data,formId){$.edit_contact.handleErrors(data,formId)});var zip=form.find("#zip");zip.val(zip.val().replace(/\s/g,""));break;case "set_email_form":$.edit_contact.emailFormValidationCallback(form);break;case "set_phone_form":case "set_fax_form":phoneFormValidationCallback(form,form.attr("id"),function(data,
formId){$.edit_contact.handleErrors(data,formId)});break;case "set_name_form":nameFormValidationCallback(form,function(data,formId){$.edit_billing_profiee.handleErrors(data,formId)});break;case "set_title_form":$.edit_billing_profiee.titleFormValidationCallback(form);break;case "doy_form":$.edit_billing_profiee.doyFormValidationCallback(form);break;case "activity_form":$.edit_billing_profiee.activityFormValidationCallback(form);break;case "contacts_form":$.domain_view.contact_validation_callback(form);
break}};
$(document).ready(function(){var step=$("#constraints_step");var constraintsTemp=$("#constraints_step .product_form").getOuterHTML().replace(/_[0-9]+/g,"_##enum##").replace(/#[0-9]+/,"###enum##");$(document).on("click","#constraints_step .product_form .add",function(e){e.preventDefault();$(this).blur();$.coupon_create.copyProductForm(step,constraintsTemp)}).on("click","#constraints_step .product_form .remove",function(e){e.preventDefault();$.coupon_create.removeProductForm($(this).blur())})});
$(document).ready(function(){defaultButtonHandler=function(data){$.commonDefaultRequestHandler(data,[])};channel.contacts.bind("App\\Events\\Contacts\\ContactWasCreated",function(data){if(data.msg.unique_id==unique_page_identifier)return;$.responsive_tables.initiate({"disable_search":true})});channel.domain.bind("App\\Events\\Domains\\DomainWasTransferredIn",function(){$.responsive_tables.initiate({"disable_search":true})})});
$(document).ready(function(){function clearProductListing(product_form){var product_prompt=product_form.find(".product_prompt");var product_container=product_form.find(".product_container");product_prompt.hide().find('[type\x3d"radio"]').prop("checked",false);product_container.hide()}function loadActionListBasedOnCategory(obj){var product_form=obj.closest(".product_form");var select_category=product_form.find(".select_category");var category=select_category.find("option:selected").text().trim().toLowerCase().replace(/\s/g,
"_");var select_action=product_form.find(".select_action");if(category in category_actions){product_form.find(".action_prompt").show();select_action.find("option:not(.permanent)").remove();for(var i in category_actions[category])if(category_actions[category].hasOwnProperty(i))select_action.append('\x3coption value\x3d"'+triggers.product_actions[category_actions[category][i]]["id"]+'"\x3e'+triggers.product_actions[category_actions[category][i]]["name"]+"\x3c/option\x3e");select_action.chosen_update("")}}
function clearActionListing(product_form){var action_prompt=product_form.find(".action_prompt");var action_container=product_form.find(".action_container");action_prompt.hide().find('[type\x3d"radio"]').prop("checked",false);action_container.hide()}function copyProductForm(container,template){container.find(".product_form:last").after(template.replace(/##enum##/g,container.find(".product_form").length+1));container.find(".product_form .remove").show();container.find(".product_form:last select").apply_chosen("");
$("#triggerCombinationMethod").show()}function removeProductForm(obj){var container=obj.closest(".product_form");var fieldset=container.closest("fieldset");var next=container.next(".product_form");if(next.length)container=moveNextToPrevious(next);container.remove();var removes=fieldset.find(".product_form .remove");if(removes.length==1){removes.hide();$("#triggerCombinationMethod").hide()}}function moveNextToPrevious(current){var form=[];current.find('[name^\x3d"trigger_category_prompt"]:checked');
current.find('[name^\x3d"trigger_product_prompt"]:checked');current.find('[name^\x3d"trigger_action_prompt"]:checked');current.find("input:not(.chosen-container input), select").each(function(){var obj=$(this);var target=$("#"+obj.attr("id").replace(/[0-9]+$/,function(num){return parseInt(num)-1}));if(obj.is("input")){if(obj.prop("checked"))target.click()}else{var val=obj.val();if(val)target.chosen_update(val).change()}});var next=current.next(".product_form");if(next.length)return moveNextToPrevious(next);
return current}function activatePrevious(obj){if(obj.length<1)return;obj.addClass("active");activatePrevious(obj.prev())}function deActivateNext(obj){if(obj.length<1)return;obj.removeClass("active");deActivateNext(obj.next())}function scrollToStep(){$(window).scrollTop($(".step:visible").offset().top)}$(".step-button").on("click",function(e){e.preventDefault();var obj=$(this);$(".step").hide();$("#"+obj.attr("data-target")).show();obj.addClass("active");activatePrevious(obj.prev());deActivateNext(obj.next())});
$("#trigger_start").my_dateTimePicker({date:new Date,with_time:true,buttons:[{classes:"today-button",text:"Today",callback:"today"},{classes:"now-button",text:"Now",callback:"now"}],"before":"#trigger_end","mirror":{"to":"#constraints_start"}});$("#trigger_end").my_dateTimePicker({date:new Date,with_time:true,buttons:[{classes:"today-button",text:"Today",callback:"today"},{classes:"now-button",text:"Now",callback:"now"}],"after":"#trigger_start","mirror":{"to":"#constraints_end"}});$("#constraints_start").my_dateTimePicker({date:new Date,
with_time:true,buttons:[{classes:"today-button",text:"Today",callback:"today"},{classes:"now-button",text:"Now",callback:"now"}],"before":"#constraints_end"});$("#constraints_end").my_dateTimePicker({date:new Date,with_time:true,buttons:[{classes:"today-button",text:"Today",callback:"today"},{classes:"now-button",text:"Now",callback:"now"}],"after":"#constraints_start"});$("#registered_from").my_dateTimePicker({date:new Date,with_time:true,buttons:[{classes:"today-button",text:"Today",callback:"today"},
{classes:"now-button",text:"Now",callback:"now"}],"before":"#registered_to"});$("#registered_to").my_dateTimePicker({date:new Date,with_time:true,buttons:[{classes:"today-button",text:"Today",callback:"today"},{classes:"now-button",text:"Now",callback:"now"}],"after":"#registered_from"});$(".step-buttons .button:not(#couponSubmit):not(.secondary)").on("click",function(e){e.preventDefault();$(".step-button.active").next(".step-button").click();scrollToStep()});$(".step-buttons .button.secondary").on("click",
function(e){e.preventDefault();$(".step-button.active").prev(".step-button").click();scrollToStep()});$(document).on("change",'[name*\x3d"category_prompt"]',function(){var obj=$(this);var product_form=obj.closest(".product_form");var category_container=product_form.find(".category_container");var action_prompt=product_form.find(".action_prompt");product_form.find(".select_category").chosen_update("");clearProductListing(product_form);if(obj.val()=="specify")category_container.show();else category_container.hide();
action_prompt.hide().find('[type\x3d"radio"]').prop("checked",false);var action=product_form.find(".action_container").hide().find(".select_action");action.find("option:not(.permanent)").remove();action.chosen_update("")}).on("change",".select_category",function(){var obj=$(this);var product_form=obj.closest(".product_form");var product_prompt=product_form.find(".product_prompt");var product_container=product_form.find(".product_container");var select_product=product_container.find(".select_product");
var action_prompt=product_form.find(".action_prompt");if(obj.val()!="currently_active"){product_prompt.show().find('[type\x3d"radio"]').prop("checked",false);clearActionListing(product_form);select_product.find("option:not(.permanent)").remove();if(!!obj.val()){$.each(triggers.product_categories[obj.val()].products,function(key,value){select_product.append('\x3coption value\x3d"'+value.id+'"\x3e'+value.name+"\x3c/option\x3e")});select_product.chosen_update("")}}else{clearProductListing(product_form);
action_prompt.show().find('[type\x3d"radio"]').prop("checked",false)}product_container.hide()}).on("change",'[name*\x3d"product_prompt"]',function(){var obj=$(this);var product_form=obj.closest(".product_form");var product_container=product_form.find(".product_container");if(obj.val()=="specify"){product_container.show();product_form.find(".select_action, .action_prompt").hide()}else{loadActionListBasedOnCategory(obj);product_container.hide().find("select").chosen_update("")}}).on("change",".select_product",
function(){loadActionListBasedOnCategory($(this))}).on("change",'[name*\x3d"action_prompt"]',function(){var obj=$(this);var product_form=obj.closest(".product_form");var action_container=product_form.find(".action_container");if(obj.val()=="specify")action_container.show().find("select").chosen_update("");else action_container.hide()});$("#coupon_create_form").prepare_form_advanced({outer_handlers:"#couponSubmit",disable:"#couponSubmit",version_exception:true,onSuccess:function(form){$("#couponSubmit").removeClass("disabled");
return $.coupon_create.submit(form)}}).off("onError").on("onError",function(){var form=$(this);form.handle_errors();$('[data-target\x3d"'+form.find(".error:first").closest(".step").attr("id")+'"]').click();form.find_errors(1E3)});var merge={copyProductForm:copyProductForm,removeProductForm:removeProductForm};if("coupon_create"in $)$.extend($.coupon_create,merge);else $.extend({"coupon_create":merge})});
$(window).on("load",function(){$("#trigger_minimum_duration, #constraints_minimum_duration, .select_category, .select_product, .select_action, #users_filter").each(function(){var obj=$(this);obj.apply_chosen(obj.val())})});
$(document).ready(function(){function countryChanged(){form.find(".form-error").addClass("hide").removeClass("form-error");form.removeClass("has-error");form.find(".has-error").removeClass("has-error");form.find(".error").removeClass("error");form.find(".help-block").remove();country=form.find("#billing_country");containerNotGrVat=form.find(".notGRvat");containerNotEuVat=form.find(".notEUvat");if(country.find("option:selected").attr("data-eu")){$(containerNotEuVat).removeClass("hide");if(country.is("select"))$("#beforeVat").val(country.find("option:selected").attr("data-vat"));
if(country.find("option:selected").attr("data-vat")=="EL")$(containerNotGrVat).addClass("hide");else $(containerNotGrVat).removeClass("hide")}else{$(containerNotGrVat).removeClass("hide");$(containerNotEuVat).addClass("hide")}}function performAjaxRequest(){var getExtendedInfo=false;var data_cont={};data_cont.country=country.val();data_cont._token=form.find('input[name*\x3d"_token"]').val();data_cont.unique_id=unique_page_identifier;if(country.find("option:selected").attr("data-eu")){data_cont.vat=
form.find("#vat").val();if(country.find("option:selected").attr("data-vat")!="EL")getExtendedInfo=true}else getExtendedInfo=true;if(getExtendedInfo){data_cont.name=form.find("#name").val();data_cont.zip=form.find("#zip").val();data_cont.state=form.find("#state").val();data_cont.city=form.find("#city").val();data_cont.address=form.find("#address").val()}if($("#is_default").prop("checked")==true)data_cont.is_default="1";if(form.find('[name\x3d"agree_terms"]:checked').length){data_cont.data_validity=
"1";data_cont.processing_approval="1";data_cont.communication_agreement="1"}if(typeof editObj!="object")editObj=new $.ajax_prototype({"type":"post","url":form.attr("action"),"contentType":"application/json","success":function(data){if(data.success===false)if(data.code==error_codes.validation_error)$.displayErrors(formId,data.data);else if(data.code==error_codes.session_error)$.set_cookie("errorCode",[data.msg,data.success],"/");else if(data.code==error_codes.token_error)$.set_cookie("errorCode",[data.msg,
data.success],"/");else{$.alertHandler(formId,data.msg,alert_box_failure,data.data);return false}else if(data.success===true)if(!isCart)create=data.data.BillingProfileId;else{if(country.val()=="GR")var name=form.find("#beforeVat").val()+form.find("#vat").val();else name=form.find("#name").val();var handler=$("#billingProfileHandler");handler.append('\x3coption value\x3d"'+data.data.BillingProfileId+'"\x3e'+name+"\x3c/option\x3e");form.find("input:visible").val("");$("#is_default").prop("checked",
false);country.chosen_update(initial_country).change();$.cart_modals.close(form.closest(".custom-modal"));handler.chosen_update(data.data.BillingProfileId).change()}else{$.alertHandler(formId,data.msg,alert_box_warning);return false}},"complete":function(){if(typeof create!="undefined")location.replace(editLink.replace("#idp#",create));else{$.enable_form_controls(formId);$(".submitText").show();$(".loading").hide()}}},formId);editObj.data=JSON.stringify(data_cont);$.ajax(editObj);return false}var form=
$("#form-new-billing-profile");var formId=form.attr("id");var country=form.find("#billing_country");var initial_country=country.val();country.on("change",function(){countryChanged()});form.prepare_form_advanced({onSuccess:function(){performAjaxRequest()},handlers:"#btn-submit",disable:"#btn-submit",version_exception:true})});
$(document).ready(function(){function categoryTypeChanged(){var type=attributeType.find("option:selected").attr("data-target");cleanForm();$(".common_requirement_container").show();if(Object.keys(elementsConfig[type].elements).length){var specificInfoContainer=$("#specificInfoContainer");var warning='\x3ca href\x3d"#" class\x3d"warn normal-weight" data-dropdown\x3d"##name##_drop" data-options\x3d"is_hover:true" aria-expanded\x3d"false"\x3e(?)\x3c/a\x3e'+'\x3cdiv id\x3d"##name##_drop" class\x3d"f-dropdown content medium my-tooltip text-left" data-dropdown-content\x3d"" aria-hidden\x3d"true"\x3e##warning##\x3c/div\x3e';
specificInfoContainer.show();specificInfoContainer.find("h5").text(TRANS.ADMIN.DEDICATED.PRODUCTS.extras.specific_info[type]);for(var i in elementsConfig[type].elements)if(elementsConfig[type].elements.hasOwnProperty(i)){var label=TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][i].title;if("warning"in TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][i])label+=" "+warning.replace(/##name##/g,type+"_"+i).replace("##warning##",TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][i].warning);if(typesWithUnlimited.indexOf(type)>
-1&&elementsWithUnlimited.indexOf(i)>-1)var element=createOptionsForUnlimitedValue(type,i);else element=createElementFromConfig(type,i,elementsConfig[type].elements[i]);specificInfoContainer.append(elementContainer.replace("##id##","").replace("##hide##","").replace("##name##",i).replace("##label##",label).replace("##element##",element));if(typesWithUnlimited.indexOf(type)>-1&&elementsWithUnlimited.indexOf(i)>-1){element=createElementFromConfig(type,i,elementsConfig[type].elements[i],true);specificInfoContainer.append(elementContainer.replace("##id##",
"limitedValueContainer").replace("##hide##","hide").replace("##name##","").replace("##label##","").replace("##element##",element))}}specificInfoContainer.find("select").each(function(){var obj=$(this);obj.apply_chosen(obj.val()?obj.val():"")});$(document).foundation("dropdown","reflow")}}function createElementFromConfig(type,name,config,required){var element="";if(!("type"in config)||config.type=="list"){var placeholder=TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][name].placeholder;element='\x3cselect name\x3d"'+
name+'" id\x3d"'+name+'" data-placeholder\x3d"'+placeholder+'"';if("required"in config||typeof required!="undefined")element+=' data-validate\x3d"required"';element+="\x3e";element+='\x3coption value\x3d"" class\x3d"placeholder" disabled selected\x3e'+placeholder+"\x3c/option\x3e";if("values"in config)for(var i in config.values)if(config.values.hasOwnProperty(i)){var value=config.values[i];var text=config.values[i];if(type=="hdd"&&name=="type")text=$.translate("misc.storage_type."+text);element+=
'\x3coption value\x3d"'+value+'"\x3e'+text+"\x3c/option\x3e"}element+="\x3c/select\x3e"}else{element='\x3cinput type\x3d"'+config.type+'" name\x3d"'+name+'" id\x3d"'+name+'" placeholder\x3d"'+TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][name].placeholder+'"';if("required"in config&&config.type!="checkbox"||typeof required!="undefined")element+=' data-validate\x3d"required"';element+="\x3e"}return element}function createOptionsForUnlimitedValue(type,element_name){switch(element_name){case "domain_total":var idPrefix=
"domains";var namePrefix="cp_domain";break;case "bandwidth_total":idPrefix="bandwidth";namePrefix="bandwidth";break;case "traffic_total":idPrefix="traffic";namePrefix="traffic";break}var element='\x3cul class\x3d"inline-list check-margin-top" data-validate\x3d"required" data-validate-type\x3d"radio" data-override-visibility\x3d"true"\x3e'+'\x3cli\x3e\x3cdiv class\x3d"radio"\x3e\x3clabel for\x3d"'+idPrefix+'_num"\x3e\x3cinput id\x3d"'+idPrefix+'_num" class\x3d"unlimitedValueController" autocomplete\x3d"off" name\x3d"'+
namePrefix+'_num" type\x3d"radio" value\x3d"num"\x3e\x3cspan class\x3d"radio__label"\x3e'+TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][element_name].input_choice.specify_number+"\x3c/span\x3e\x3c/label\x3e\x3c/div\x3e\x3c/li\x3e"+'\x3cli\x3e\x3cdiv class\x3d"radio"\x3e\x3clabel for\x3d"'+idPrefix+'_unlimited"\x3e\x3cinput id\x3d"'+idPrefix+'_unlimited" class\x3d"unlimitedValueController" autocomplete\x3d"off" name\x3d"'+namePrefix+'_num" type\x3d"radio" value\x3d"Unlimited"\x3e\x3cspan class\x3d"radio__label"\x3e'+
TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][element_name].input_choice.unlimited+"\x3c/span\x3e\x3c/label\x3e\x3c/div\x3e\x3c/li\x3e"+"\x3c/ul\x3e";return element}function checkSkuAvailability(){$.activateOverlayLoader();$.ajax(new $.ajax_prototype({"type":"POST","url":urls["sku_availability"],"data":{"_token":$('[name\x3d"_token"]').val(),"sku":sku.val()},"success":function(data){if(data.data){if(data.data.availability)$.alertHandler("",$.translate("hosting.create.skuavailability"),alert_box_success);
else $.alertHandler("",$.translate("misc.unavailable_sku",0,{"sku":sku.val()}),alert_box_failure);availabilityChecked=true}else globalApplicationErrors(data,form.attr("id"))},postcompletecallback:function(){$.enable_form_controls(form.attr("id"));$.deactivateOverlayLoader()}}))}function handleSKUChanges(obj){var text=obj.val().toLowerCase();text=text.trim();text=text.replace(/-/g,"_").replace(/\s+/g," ");text=text.replace(/\s+/g,"_");obj.val(text);obj.trigger("change")}function checkAttributeNameAvailability(){$.activateOverlayLoader();
$.ajax(new $.ajax_prototype({"type":"POST","url":urls["attr_availability"],"data":{"_token":$('[name\x3d"_token"]').val(),"name":name.val()},"success":function(data){if(data.data){if(data.data.availability)$.alertHandler("",$.translate("hosting.create.attributes_name_availability"),alert_box_success);else $.alertHandler("",$.translate("misc.unavailable_attribute_name",0,{"name":name.val()}),alert_box_failure);availabilityChecked=true}else globalApplicationErrors(data,form.attr("id"))},postcompletecallback:function(){$.enable_form_controls(form.attr("id"));
$.deactivateOverlayLoader()}}))}function cleanForm(forceAll){var specificInfoContainer=$("#specificInfoContainer");specificInfoContainer.hide();specificInfoContainer.find(".row").remove();form.find("input:not(.chosen-container input)").val("");form.find("select:not(#detail_type)").each(function(){$(this).chosen_update("")});if(typeof forceAll!="undefined")$("#detail_type").chosen_update("");form.find('[type\x3d"checkbox"], [type\x3d"radio"]').checked(false);form.find("#overwrite_container").hide();
availabilityChecked=false;$("#getPricing").hide();$("#sellable, #upgradable, #renewable").checked(true)}var attributeType=$("#detail_type");var elementContainer='\x3cdiv id\x3d"##id##" class\x3d"row ##hide##"\x3e\x3cdiv class\x3d"large-4 columns"\x3e\x3clabel for\x3d"##name##" class\x3d"inline"\x3e##label##\x3c/label\x3e\x3c/div\x3e\x3cdiv class\x3d"large-7 columns end"\x3e##element##\x3c/div\x3e\x3c/div\x3e';var form=$("#createDedicatedExtraDetailsForm");var sku=$("#sku");var name=$("#name");var availabilityChecked=
false;var typesWithUnlimited=["cp_dedicated","bandwidth","traffic"];var elementsWithUnlimited=["domains_total","bandwidth_total","traffic_total"];$("select").each(function(){var obj=$(this);obj.apply_chosen(obj.val()?obj.val():"")}).on("change",function(){var obj=$(this);if(obj.val()=="none")obj.chosen_update("")});$("#option_id").on("change",function(){var obj=$(this);var value=obj.val();if(!!value&&value.indexOf("all")>-1){var newValue=[];var options=obj.find("option:selected");options.each(function(){if(this.value!=
"all"){if(newValue.indexOf(this.value)<0)newValue.push(this.value);return true}var relativeOptions=$(this).closest("optgroup").find('option:not([value\x3d"all"])');relativeOptions.each(function(){if(newValue.indexOf(this.value)<0)newValue.push(this.value)})});obj.chosen_update(newValue)}});if(sku.length){sku.on("change",function(e){if(typeof e.isTrigger=="undefined"&&this.value){checkSkuAvailability();handleSKUChanges($(this))}}).on("keypress",function(e){var obj=$(this);if(e.which==13){e.preventDefault();
obj.trigger("change");obj.blur()}}).on("input",function(e){if(typeof e.isTrigger!="undefined")return;var obj=$(this);try{clearTimeout(skuChangedTimer)}catch(e$0){}skuChangedTimer=setTimeout(function(){handleSKUChanges(obj)},250)});$("#price_in").on("change",function(e){if(typeof e.isTrigger=="undefined"&&this.value){var type=attributeType.find("option:selected").attr("data-target");if(!!type&&"profit"in elementsConfig[type]&&!!this.value&&this.value>0)$("#getPricing").show();else $("#getPricing").hide()}})}else name.on("change",
function(){if(this.value)checkAttributeNameAvailability()}).on("keypress",function(e){var obj=$(this);if(e.which==13){e.preventDefault();obj.trigger("change");obj.blur()}});$('[type\x3d"number"]').on("input",function(){if(this.value<0)$(this).val(0);else try{if(!this.value.length||isNaN(this.value))$(this).val(0)}catch(e){$(this).val(0)}});attributeType.on("change",function(){categoryTypeChanged()});$("#getPricing").on("click",function(e){e.preventDefault();$.activateOverlayLoader();var data$jscomp$0=
{"_token":$('[name\x3d"_token"]').val(),"detail_type":$("#detail_type option:selected").attr("data-target"),"price_in":$("#price_in").val()};var form=$(this).closest("form");form.find(".help-block.error").remove();form.find(".error").removeClass("error");$.ajax(new $.ajax_prototype({"type":"POST","url":urls["pricing"],"data":data$jscomp$0,"success":function(data){if(data.success){for(var i in data.data.monthly_fee)if(data.data.monthly_fee.hasOwnProperty(i))$("#monthly_fee_"+i).val(data.data.monthly_fee[i]);
for(i in data.data.setup_fee)if(data.data.setup_fee.hasOwnProperty(i))$("#setup_fee_"+i).val(data.data.setup_fee[i]);$("#getPricing").hide()}else{if(data.code==error_codes.sub_product_category_not_found||data.code==error_codes.sub_product_is_not_configured_for_auto_pricing||data.code==error_codes.sub_product_has_incorrect_auto_pricing_config)$("#getPricing").hide();globalApplicationErrors(data,form.attr("id"))}},postcompletecallback:function(){$.deactivateOverlayLoader()}}))});$(document).on("change",
".unlimitedValueController",function(){var obj=$(".unlimitedValueController:checked");var domains_num=$("#limitedValueContainer");if(obj.val()=="num")domains_num.show();else domains_num.hide();domains_num.find("input").val("")});form.prepare_form_advanced({handlers:"#submit",disable:"#submit",version_exception:true,disable_exception:true,onSuccess:function(){if(!availabilityChecked)return;var data$jscomp$0={"_token":$('[name\x3d"_token"]').val(),"price_out":{"total_per_interval":{},"setup_fee":{}}};
form.find('input:not(.chosen-container input):not([name\x3d"overwrite_previous"]):not([name\x3d"cp_domain_num"]):not([name^\x3d"monthly_fee_"]):not([name^\x3d"setup_fee_"]):visible, [type\x3d"hidden"], textarea, select').each(function(){if(this.type=="checkbox")data$jscomp$0[this.name]=this.checked?1:0;else if(this.type=="select-multiple")data$jscomp$0[this.name]=!!this.value?$(this).val():[];else data$jscomp$0[this.name]=!!this.value?this.value:""});var overwrite_previous=form.find('[name\x3d"overwrite_previous"]');
if(overwrite_previous.checked())data$jscomp$0.overwrite_previous=true;var monthly_fee=form.find('[name^\x3d"monthly_fee_"]');if(monthly_fee.length){monthly_fee.each(function(){data$jscomp$0.price_out.total_per_interval[this.name.replace("monthly_fee_","")]=this.value});form.find('[name^\x3d"setup_fee_"]').each(function(){data$jscomp$0.price_out.setup_fee[this.name.replace("setup_fee_","")]=this.value||0})}else delete data$jscomp$0.price_out;data$jscomp$0.detail_type_name=$("#detail_type option:selected").attr("data-target");
var unlimitedValueController=$(".unlimitedValueController:checked");if(unlimitedValueController.length)if(unlimitedValueController.val()=="num"){var limitedValueContainer=$('#limitedValueContainer [type\x3d"number"]');data$jscomp$0[limitedValueContainer.attr("name")]=limitedValueContainer.val()}else data$jscomp$0[unlimitedValueController.attr("id")]=1;var sellable=$("#sellable");var upgradable=$("#upgradable");var renewable=$("#renewable");if(sellable.length)data$jscomp$0["sellable"]=sellable.checked()?
1:0;if(upgradable.length)data$jscomp$0["upgradable"]=upgradable.checked()?1:0;if(renewable.length)data$jscomp$0["renewable"]=renewable.checked()?1:0;$.activateOverlayLoader();$.ajax(new $.ajax_prototype({"type":"POST","data":data$jscomp$0,"success":function(data){if(data.success){var modal=$("#detailCreatedSuccessfully");modal.find("#created_detail_name").text(form.find('[name\x3d"name"]').val());modal.modal_open();cleanForm(true)}else{if(data.code==error_codes.validation_error)if("price_out"in data.data){for(var i in data.data.price_out)if(data.data.price_out.hasOwnProperty(i))data.data[i]=
data.data.price_out[i];delete data.data.price_out}if(data.code==error_codes.dedicated_extra_detail_already_exists)$("#overwrite_container").show();globalApplicationErrors(data,form.attr("id"))}},postcompletecallback:function(){$.enable_form_controls(form.attr("id"));$.deactivateOverlayLoader()}}))}})});
$(document).ready(function(){var formId="form-new-contact";$("#"+formId+" select:not(#state_id)").each(function(){var obj=$(this);obj.apply_chosen(obj.val())});var state_id_drop_down=$("#"+formId+" #state_id");state_id_drop_down.apply_chosen({"value":state_id_drop_down.val(),"par":{"search_contains":true}});$("#contact_country").on("change",function(){statesManager($(this))}).change();$("#contact_country").assign_secondary_phone([$("#phone_country"),$("#fax_country")]);$(document).on("click","#cancel",
function(e){e.preventDefault();$("#fax_country").chosen_update("");$(this).closest(".columns").remove()}).on("change","#person_type",function(){type=$(this);type_value=type.val();$(".hide-for-"+type_value).hide();$(".show-for-"+type_value).show();$(".full-name, .full-name-int").val("").trigger("input");$("#organization, #organization_int").val("").trigger("input");$('#identity [type\x3d"radio"]').prop({"checked":false})}).on("input",'input[type\x3d"text"]:not(.int-exception)',function(){id=$(this).attr("id");
country=$("#contact_country").val();if($("#"+id+"_int").length>0){target=$("#"+id+"_int");value=$(this).val();if(!$.isEmptyObject(value.match(REG.ASCII.INVERSE.REGEX))){target.closest(".hide").show();target.closest("fieldset").show()}else{target.val("").closest(".hide").hide();hideIntFieldset(target.closest("fieldset"))}}}).on("input","input.addresses",function(){target=$(".addresses_int");value=$(this).val();country=$("#contact_country").val();if(!$.isEmptyObject(value.match(REG.ASCII.INVERSE.REGEX))){target.closest(".hide").show();
target.closest("fieldset").show()}else{target.closest(".hide").hide();hideIntFieldset(target.closest("fieldset"))}}).on("input","input.full-name",function(){int=0;cont=$(this).closest("fieldset");if(cont.attr("id")=="identity"){cont_int=$("#owner_int");cont.find(".full-name").each(function(){if(REG.ASCII.INVERSE.REGEX.test($(this).val()))++int});if(int>0){cont_int.find(".full-name-int").closest(".hide").show();cont_int.show()}else{cont_int.find(".full-name-int").closest(".hide").hide();hideIntFieldset(cont_int)}}}).on("input",
"input#organization",function(){if($(this).val().length>0)$("#org_default").show();else $("#org_default").hide();target=$("#organization_int");if($(this).val().match(REG.ASCII.INVERSE.REGEX)){target.closest(".hide").show();target.closest("fieldset").show()}else{target.closest(".hide").hide();hideIntFieldset(target.closest("fieldset"))}});$("#identity input,#owner_int input").on("input change",function(){org=$("#organization");orgInt=$("#organization_int");firstName=$("#first_name");lastName=$("#last_name");
firstNameP=$("#first_name_int");lastNameP=$("#last_name_int");latinPname=$("#latinPName");latinPCom=$("#latinPCompany");i=0;$('#identity [type\x3d"text"]:visible').each(function(){if($(this).val()!="")i+=1});if(i!=0){$("#previewRegistration").show();$(".previews").hide();setTimeout(function(){if($("#org_default").is(":visible")&&$("#organization_only").prop("checked")){if(org.val()!=""&&org.is(":visible")){$("#previewName").show();$("#namePrev").text(org.val())}else $("#previewName").hide();if(orgInt.val()!=
""&&orgInt.is(":visible")){latinPname.show();$("#nameLatPrev").text(orgInt.val())}else latinPname.hide()}else{if(firstName.is(":visible")&&firstName.val()!=""||lastName.val()!=""){$("#previewName").show();$("#namePrev").text(firstName.val()+" "+lastName.val())}else $("#previewName").hide();if(firstNameP.is(":visible")&&firstNameP.val()!=""||lastNameP.val()!=""){latinPname.show();$("#nameLatPrev").text(firstNameP.val()+" "+lastNameP.val())}else latinPname.hide();if(org.val()!=""){$("#previewCompany").show();
$("#companyPrev").text(org.val())}else $("#previewCompany").hide();if(orgInt.val()!=""&&orgInt.is(":visible")){latinPCom.show();$("#companyLatPre").text(orgInt.val())}else latinPCom.hide();if(latinPname.is(":hidden")&&latinPCom.is(":visible")){latinPname.show();$("#nameLatPrev").text($("#namePrev").text())}}},1)}else $("#previewRegistration").hide()});$("#form-new-contact").prepare_form_advanced({onSuccess:function(){$(".form-error").remove();var data_cont={};$("#"+formId+' input:not([type\x3d"checkbox"]):not([type\x3d"radio"])').each(function(){value=
$(this).val();if(value){var name=$(this).attr("name");if(!$(this).is('[type\x3d"radio"]'))if(name=="first_name_leg"||name=="last_name_leg")data_cont[name.replace("_leg","_int")]=value;else data_cont[name]=value;else if($(this).prop("checked"))data_cont[name]=$(this).val()}});data_cont["country"]=$("#contact_country").val();data_cont["phone_country"]=$("#phone_country").val();data_cont["type"]=$("#person_type").val();if(data_cont["type"]=="individual")data_cont["title"]=$('[name\x3d"title_ind"]:checked').val();
else data_cont["title"]=$('[name\x3d"title_leg"]:checked').val();if($("#fax_country").val()!=null&&$("#fax_country").val()!="NaN")data_cont["fax_country"]=$("#fax_country").val();if(data_cont["country"]=="GR"){data_cont["state_id"]=$("#state_id").find("option:selected").attr("data-lang");if(data_cont["state_id"]<10)data_cont["state_id"]="0"+data_cont["state_id"]}if(typeof contact_obj!="object")contact_obj=new $.ajax_prototype({"type":"post","url":$("#form-new-contact").attr("action"),"contentType":"application/json",
"success":function(data){if(data.success===false)if(data.code==error_codes.validation_error)$.displayErrors(formId,data.data);else if(data.code==error_codes.session_error)$.set_cookie("errorCode",[data.msg,data.success],"/");else if(data.code==error_codes.token_error)location.reload();else if(data.code==error_codes.validation_error)$.alertHandler(formId,data.msg,alert_box_failure,data.data);else $.alertHandler(formId,data.msg,alert_box_failure,data.data);else if(data.success===true)if(typeof isCart!=
"undefined"&&isCart)$.cart_modals.handlers.cartContactHandler(data);else created=domain.replace("#idp#",data.data.contactId);else $.alertHandler(formId,APP_LANG.MESSAGES.SOMETHING_GOES_WRONG,alert_box_warning)},"complete":function(){if(typeof created!="undefined")location.href=created;else{$.enable_form_controls("form-new-contact");$(".submitText").show();$(".loading").hide()}}},"form-new-contact");if(typeof isCart!="undefined"&&isCart)data_cont.unique_id=unique_page_identifier;if($("#"+formId+' [name\x3d"agree_terms"]:checked').length){data_cont.data_validity=
"1";data_cont.processing_approval="1";data_cont.communication_agreement="1"}contact_obj.data=JSON.stringify(data_cont);$.ajax(contact_obj);return false},handlers:"#btn-submit-new-contact",disable:"#btn-submit-new-contact",version_exception:true});var $customErrorRules={"first_name_int":function(){return $('#first_name_int:visible,[name\x3d"first_name_int"]:visible,#first_name_int_leg:visible,[name\x3d"first_name_int_leg"]:visible')},"last_name_int":function(){return $('#last_name_int:visible,[name\x3d"last_name_int"]:visible,#last_name_int_leg:visible,[name\x3d"last_name_int_leg"]:visible')}};
$.extend(custom_selectors_apply,$customErrorRules);console.log()});function hideIntFieldset(fieldset){if(fieldset.find("input:visible").length<1)fieldset.hide()};
