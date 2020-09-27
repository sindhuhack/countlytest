/*global
    jQuery
 */
(function(hooksPlugin, jQuery) {
    var _hookEffects = {
        "EmailEffect": {
            name: jQuery.i18n.map["hooks.EmailEffect"],
            init: function() {
            },
            renderConfig: function(data, dom) {
                var configuration =  data.configuration;
                $(dom).find(".emaileffect-email-address").val(configuration.address);
            },
            getValidConfig: function(dom) {
                var email = $(dom).find(".emaileffect-email-address").val();
                if (!email) {
                    return null;
                }
                return {address: email}
            }
        },
        "HTTPEffect": {
            name: jQuery.i18n.map["hooks.HTTPEffect"],
            init: function() {
                var methods = [
                    {value:"get", name:"GET"},
                    {value:"post", name:" POST"}, 
                ]
                $(".http-effect-method-dropdown").clySelectSetItems(methods);
                $(".http-effect-method-dropdown").clySelectSetSelection(methods[0].value, methods[0].name);
            },
        },
        "SDKEventEffect": {
            name: jQuery.i18n.map["hooks.SDKEventEffect"],
            init: function() {
            },
        }
    }

    /**
     * get default hook effects dictionary
     * @return {objecT} hook effects dictionary
     */
    hooksPlugin.getHookEffects = function () {
        return _hookEffects;
    }

}(window.hooksPlugin = window.hooksPlugin || {}, jQuery));
