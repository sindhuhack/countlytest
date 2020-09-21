
window.HooksDrawer = function(self) {
   return {
       prepareDrawer: function() {
            self.DrawerComponent.drawer = CountlyHelpers.createDrawer({
                id: "hooks-widget-drawer",
                form: $('#hooks-widget-drawer'),
                title: jQuery.i18n.map["hooks.drawer-create-title"],
                applyChangeTriggers: true,
                onUpdate: function(e){
                    console.log(e,self.DrawerComponent.getWidgetSettings(true), "change!!"); 
                    self.DrawerComponent.checkDisabled();
                },
                resetForm: function() {
                    $("#current_hook_id").text('');
                    $("#hook-name-input").val('');
                    $("#hook-description").val("");
                    $("#multi-app-dropdown").clyMultiSelectClearSelection({});
                    $("#single-hook-trigger-dropdown").clySelectSetSelection("", "");
                    $(".hook-effects-list").html("");
                    $("#create-widget").show();


                    $(self.DrawerComponent.drawer).find('.title span').first().html(jQuery.i18n.map["hooks.drawer-create-title"]);
                    $("#hooks-widget-drawer").find("#widget-types .opt").removeClass("disabled");
                    $("#create-widget").removeClass("disabled");
                },
                onClosed: function() {
                }
            });
            var self1 = self;
            $("#create-hook").off("click").on("click", function() {
                self1.DrawerComponent.init();
                self1.DrawerComponent.drawer.resetForm();
                self1.DrawerComponent.drawer.open();
            });
        },
        init: function() {
            var self = this;
            var apps = [];
            //description
            $("#use-description-checkbox").off("click").on("click", function(e) {
                var checked = e.target.checked; 
                if (checked) {
                    $("#hook-description").attr("disabled", false);
                } else {
                    $("#hook-description").val("");
                    $("#hook-description").attr("disabled", true);
                }
            });

            //select apps
            for (var appId in countlyGlobal.apps) {
                apps.push({ value: appId, name: countlyGlobal.apps[appId].name });
            }
            $("#multi-app-dropdown").clyMultiSelectSetItems(apps);

            // clear app  selected value
            // $("#multi-app-dropdown").clyMultiSelectClearSelection({});

            //trigger selector
            var triggers = hooksPlugin.getHookTriggers();
            var triggerSelectorItems = [];
            for (var trigger in triggers) {
                triggerSelectorItems.push({value: trigger, name: triggers[trigger].name});
            }

            $("#single-hook-trigger-dropdown").off("cly-select-change").on("cly-select-change", function(e, selected) {
                selected = selected.value || selected;
                $(".hook-trigger-view").html($("#template-hook-trigger-"+selected).html());
                if(triggers[selected] && (triggers[selected]).init) {
                    (triggers[selected]).init();
                } else{
                    $(".hook-trigger-view").html("");
                }
            });

            $("#single-hook-trigger-dropdown").clySelectSetItems(triggerSelectorItems);

            // effects
            var effects = hooksPlugin.getHookEffects();
            var effectsSelectorItems = [];
            for (var effect in effects) {
                effectsSelectorItems.push({value: effect, name: effects[effect].name});
            }

            $(".add-effect-button").off("click").on("click", function() {
                $(".hook-effects-list").append($("#template-hook-effect-selector").html()); 
                $(".single-hook-effect-dropdown").clySelectSetItems(effectsSelectorItems);
                app.localize();
                $(".single-hook-effect-dropdown").off("cly-select-change").on("cly-select-change", function(e, selected) {
                    $(e.currentTarget.parentElement.nextElementSibling).html($("#template-hook-effect-"+selected).html());
                    (effects[selected]).init();
                    self.drawer._applyChangeTrigger(self.draw);
                    app.localize();
                });
                $(".delete-effect-button").off("click").on("click", function(e) {
                    var effectDom = e.currentTarget.parentElement.parentElement;
                    $(effectDom).remove();
                });
                self.drawer._applyChangeTrigger(self.drawer);
            });
            $(".add-effect-button").trigger("click");

            self.drawer._applyChangeTrigger();
            $("#save-widget").hide();

            $("#create-widget").off().on("click", function() {
                var hooksConfig = self.getWidgetSettings(true);
                for (var key in hooksConfig) {
                    if (!hooksConfig[key]) {
                        return;
                    }
                }
                self.drawer.close();

                hooksPlugin.saveHook(hooksConfig, function callback() {
                    hooksPlugin.requestHookList(function() {
                        app.hooksView.renderTable();
                    });
                });
            });

            $("#save-widget").off("click").on("click", function() {
                var hooksConfig = self.getWidgetSettings();
                for (var key in hooksConfig) {
                    if (!hooksConfig[key]) {
                        return;
                    }
                }
                self.drawer.close();
                hooksPlugin.saveHook(hooksConfig, function callback() {
                    hooksPlugin.requestHookList(function() {
                        app.hooksView.renderTable();
                    });
                });
            });

        },
        getWidgetSettings: function(enabled) {
            var hookInstance = {
                name: $("#hook-name-input").val(),
                has_description: $("#use-description-checkbox").val() === 'on', 
                apps: $("#multi-app-dropdown").clyMultiSelectGetSelection(),
            }
            if ($("#current_hook_id").text().length > 0) {
                hookInstance._id = $("#current_hook_id").text();
            }

            if (hookInstance.has_description) {
                hookInstance.description = $("#hook-description").val();
            }
            if (hookInstance.apps.length === 0) {
                hookInstance.apps = null;
            }
            if (enabled) {
                hookInstance.enabled = true;
            }
            
            // trigger
            hookInstance.trigger = self.DrawerComponent.getValidTriggerConfig();

            // effects
            hookInstance.effects = self.DrawerComponent.getValidEffectsConfig(); 
            return hookInstance;
        },
        checkDisabled: function() {
            var hookConfig = this.getWidgetSettings();
            $("#create-widget").removeClass("disabled");
            $("#save-widget").removeClass("disabled");
            for (var key in hookConfig) {
                if (!hookConfig[key]) {
                    $("#create-widget").addClass("disabled");
                    $("#save-widget").addClass("disabled");
                }
            }
        },
        loadWidgetData: function(data) {
            this.drawer.resetForm();
            console.log(data,"!!");
            var self = this;
            $("#current_hook_id").text(data._id);
            $("#hook-name-input").val(data.name);
            if (data.has_description) {
                $("#use-description-checkbox").prop('checked', true);
                $("#hook-description").attr("disabled", false);
                $("#hook-description").val(data.description);
            } else {
                $("#use-description-checkbox").prop('checked', false);
            }
            var selectedApps = [];
            for (var index in data.apps) {
                var appId = data.apps[index];
                selectedApps.push({ value: appId, name: countlyGlobal.apps[appId].name });
            }
            $("#multi-app-dropdown").clyMultiSelectSetSelection(selectedApps);

            // load trigger
            var triggerModels = hooksPlugin.getHookTriggers();
            var trigger = triggerModels[data.trigger.type];
            $("#single-hook-trigger-dropdown").clySelectSetSelection(data.trigger.type, trigger.name);
            trigger.renderConfig(data.trigger);

            // load Effects
            var effectModels = hooksPlugin.getHookEffects();
            for (var i = 0; i < data.effects.length; i++) {
                var effect = data.effects[i];
                $(".add-effect-button").trigger("click");
                var effectDom = $(".hook-effect-item").last();
                $(effectDom).find(".single-hook-effect-dropdown").clySelectSetSelection(effect.type, effectModels[effect.type].name); 
                effectModels[effect.type].renderConfig(effect, effectDom);
            }

            $("#create-widget").hide();
            $("#save-widget").show();
            return;
        },

        getValidTriggerConfig: function() {
            var triggerType = $("#single-hook-trigger-dropdown").clySelectGetSelection(); 
            if (!triggerType) {
                return null;
            }
            triggerType = triggerType.value || triggerType;
            var triggerModels = hooksPlugin.getHookTriggers();
            var triggerConfig = triggerModels[triggerType].getValidConfig();
            
            if (!triggerConfig) {
               return null 
            }

            var config = {};
            config.type = triggerType;
            config.configuration = triggerConfig; 
            console.log(config,"triggerType");
            return config; 
        },

        getValidEffectsConfig: function() {
            var effectDoms = $(".hook-effect-item");
            var configs = [];
            var effectModels = hooksPlugin.getHookEffects();
            for(var i = 0; i < effectDoms.length; i++) {
                var effectType = $(effectDoms[i]).find(".single-hook-effect-dropdown").clySelectGetSelection();
                if(!effectType) {
                    return null;
                }
                var configuration = effectModels[effectType].getValidConfig && effectModels[effectType].getValidConfig(effectDoms[i]);
                if(!configuration) {
                    return null;
                }
                configs.push({type: effectType, configuration: configuration});
            }
            return configs;
       }
    }
}
