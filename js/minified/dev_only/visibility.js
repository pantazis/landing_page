$(document).ready(function(){if(typeof document.hidden!=="undefined"){var hidden="hidden";var visibilityChange="visibilitychange"}else if(typeof document.msHidden!=="undefined"){hidden="msHidden";visibilityChange="msvisibilitychange"}else if(typeof document.webkitHidden!=="undefined"){hidden="webkitHidden";visibilityChange="webkitvisibilitychange"}if(typeof document.addEventListener==="undefined"||typeof document.hidden==="undefined")$.extend({"visibility_api_config":{available:true}});else{var removeVisibilityHandler=
function(index){window.removeEventListener(visibilityChange,window[index]);return true};var createNewVisibility=function(properties){if(!"callback"in properties)throw"No callback is set";if(typeof properties.callback!="function")throw"Invalid callback was given";var handlerName=(new Date).getTime()+Math.random().toString().replace("0.","");handlerName=handlerName.toString();handlers.push(handlerName);window[handlerName]=properties.callback;window.addEventListener(visibilityChange,window[handlerName],
false);return handlerName};var handlers=[];$.extend({"visibility_api":function(index,action){if(typeof index=="object")return createNewVisibility(index);else{if(typeof index!="string")throw"Invalid visibility handler";if(handlers.indexOf(index)==-1)throw"Unknown visibility handler";if(typeof action!="string")throw"Invalid action";switch(action){case "remove":return removeVisibilityHandler(index);break;default:throw"Unknown action";break}}},"visibility_api_config":{hidden:hidden,available:true}})}});