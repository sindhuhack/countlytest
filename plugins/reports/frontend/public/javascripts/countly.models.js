/*global
    countlyCommon,
    countlyGlobal,
    jQuery
 */
(function(countlyReporting, $) {
    //Private Properties
    var _data = {};
    var _metrics = [
        {name: jQuery.i18n.map["reports.analytics"], value: "analytics"},
        {name: jQuery.i18n.map["reports.events"], value: "events"},
        {name: jQuery.i18n.map["reports.revenue"], value: "revenue"},
        {name: jQuery.i18n.map["reports.crash"], value: "crash"},
    ];

    //Public Methods
    countlyReporting.initialize = function() {
        return $.ajax({
            type: "GET",
            url: countlyCommon.API_PARTS.data.r + "/reports/all",
            data: {
                "app_id": countlyCommon.ACTIVE_APP_ID
            },
            success: function(json) {
                if (json.length > 0) {
                    for (var i = 0; i < json.length; i++) {
                        json[i].title = json[i].title ? json[i].title : '';
                        json[i].report_type = json[i].report_type || "core";
                        json[i].enabled = json[i].enabled + '' === 'false' ? false : true;
                        json[i].pluginEnabled = json[i].report_type === "core" ? true : countlyGlobal.plugins.indexOf(json[i].report_type) > -1;

                    }
                }
                _data = json;
            }
        });
    };

    countlyReporting.getData = function() {
        return _data;
    };

    countlyReporting.create = function(args) {
        return $.ajax({
            type: "GET",
            url: countlyCommon.API_PARTS.data.w + "/reports/create",
            data: {
                args: JSON.stringify(args),
                app_id: args.apps[0]
            }
        });
    };

    countlyReporting.update = function(args) {
        return $.ajax({
            type: "GET",
            url: countlyCommon.API_PARTS.data.w + "/reports/update",
            data: {
                args: JSON.stringify(args),
                app_id: args.apps[0]
            }
        });
    };

    countlyReporting.del = function(id) {
        return $.ajax({
            type: "GET",
            url: countlyCommon.API_PARTS.data.w + "/reports/delete",
            data: {
                args: JSON.stringify({
                    "_id": id
                }),
                "app_id": countlyCommon.ACTIVE_APP_ID
            }
        });
    };

    countlyReporting.send = function(id) {
        return $.ajax({
            type: "GET",
            url: countlyCommon.API_PARTS.data.w + "/reports/send",
            data: {
                args: JSON.stringify({
                    "_id": id
                }),
                "app_id": countlyCommon.ACTIVE_APP_ID
            }
        });
    };

    countlyReporting.updateStatus = function(args) {
        return $.ajax({
            type: "GET",
            url: countlyCommon.API_PARTS.data.w + "/reports/status",
            data: {
                args: JSON.stringify(args),
                app_id: countlyCommon.ACTIVE_APP_ID
            }
        });
    };

    countlyReporting.getReport = function(id) {
        for (var i = 0; i < _data.length; i++) {
            if (_data[i]._id === id) {
                return _data[i];
            }
        }
        return null;
    };

    countlyReporting.addMetric = function(m) {
        var existed = _metrics.filter(function(item) {
            return item.value === m.value;
        });
        if (existed.length === 0) {
            _metrics.push(m);
        }
    };

    countlyReporting.getMetrics = function() {
        return _metrics;
    };



    countlyReporting.getDayName = function (day){
        switch (day) {
        case 1:
            return jQuery.i18n.map["reports.monday"];
        case 2:
            return jQuery.i18n.map["reports.tuesday"];
        case 3:
            return jQuery.i18n.map["reports.wednesday"];
        case 4:
            return jQuery.i18n.map["reports.thursday"];
        case 5:
            return jQuery.i18n.map["reports.friday"];
        case 6:
            return jQuery.i18n.map["reports.saturday"];
        case 7:
            return jQuery.i18n.map["reports.sunday"];
        default:
            return "";
        }
    }

    countlyReporting.getVuexModule = function() {
        var getEmptyState = function() {
            return {
                tableData: [],
            };
        };

        var getters = {
            tableData(state) {
                return state.tableData;
                //return [{"_id":"123", "name":"3213"}];
            }
        };

        var mutations = {
            setTableData: function (state, list) {
                state.tableData = list;
                console.log(state,"???");
            }
        };

        var actions = {
            initialize: function(context) {
                context.dispatch("refresh");
            },
            refresh: function(context) {
                context.dispatch("countlyReports/table/fetchAll", null, {root: true});
            },
          
            saveReport: function (context, args) {
                /*
                countlyReporting.del = function(id) {
                    return $.ajax({
                        type: "GET",
                        url: countlyCommon.API_PARTS.data.w + "/reports/delete",
                        data: {
                            args: JSON.stringify({
                                "_id": id
                            }),
                            "app_id": countlyCommon.ACTIVE_APP_ID
                        }
                    });
                };
            
                countlyReporting.send = function(id) {
                    return $.ajax({
                        type: "GET",
                        url: countlyCommon.API_PARTS.data.w + "/reports/send",
                        data: {
                            args: JSON.stringify({
                                "_id": id
                            }),
                            "app_id": countlyCommon.ACTIVE_APP_ID
                        }
                    });
                };
            
                countlyReporting.updateStatus = function(args) {
                    return $.ajax({
                        type: "GET",
                        url: countlyCommon.API_PARTS.data.w + "/reports/" + (args._id ? "update" : "create"),
                        data: {
                            args: JSON.stringify(args),
                            app_id: countlyCommon.ACTIVE_APP_ID
                        }
                    });
                };*/
                console.log("@@@@")
                return CV.$.ajax({
                    type: "GET",
                    url: countlyCommon.API_PARTS.data.w + "/reports/" + (args._id ? "update" : "create"),
                    data: {
                        args: JSON.stringify(args),
                        app_id: countlyCommon.ACTIVE_APP_ID
                    },
                    dataType: "json",
                });
            },
        }

        var tableResource = countlyVue.vuex.Module("table", {
            state: function() {
                return {
                    all: []
                };
            },
            getters: {
                all: function(state) {
                    return state.all;
                }
            },
            mutations: {
                setAll: function(state, val) {
                    state.all = val;
                }
            },
            actions: {
                updateStatus: function(context, status) {
                    return CV.$.ajax({
                        type: "post",
                        url: countlyCommon.API_PARTS.data.w + "/hook/status",
                        data: {
                            "status": JSON.stringify(status)
                        },
                        dataType: "json",
                    })
                },
                fetchAll: function(context) {
                    console.log("fetch!!!")
                    return CV.$.ajax({
                        type: "GET",
                        url: countlyCommon.API_PARTS.data.r + "/reports/all",
                        data: {
                            preventGlobalAbort: true,
                            "app_id": countlyCommon.ACTIVE_APP_ID
                        },
                    },).then(function(data) {
                        if (data.length > 0) {
                            var cnts = app.manageAppsView.getTimeZones();
                            ReportingView.zones = {};
                            var zNames = {};
                            var zoneNames = [];
                            for (var i in cnts) {
                                for (var j = 0; j < cnts[i].z.length; j++) {
                                    for (var k in cnts[i].z[j]) {
                                        zoneNames.push(k);
                                        ReportingView.zones[k] = cnts[i].z[j][k];
                                        zNames[cnts[i].z[j][k]] = k;
                                    }
                                }
                            }
                        
                            for (var i = 0; i < data.length; i++) {
                                data[i].title = data[i].title ? data[i].title : '';
                                data[i].report_type = data[i].report_type || "core";
                                data[i].enabled = data[i].enabled + '' === 'false' ? false : true;
                                data[i].pluginEnabled = data[i].report_type === "core" ? true : countlyGlobal.plugins.indexOf(data[i].report_type) > -1;
                                data[i].appNames = CountlyHelpers.appIdsToNames(data[i].apps || []).split(", ");
                                data[i].dayname = countlyReporting.getDayName(data[i].day);
                                data[i].zoneName = zNames[data[i].timezone] || "(GMT+00:00) GMT (no daylight saving)";
                        
                                zoneNames.sort(function(a, b) {
                                    a = parseFloat(a.split(")")[0].replace(":", ".").substring(4));
                                    b = parseFloat(b.split(")")[0].replace(":", ".").substring(4));
                                    if (a < b) {
                                        return -1;
                                    }
                                    if (a > b) {
                                        return 1;
                                    }
                                    return 0;
                                });

                                var ret = "";
                                if (data[i].report_type === "core") {
                                    for (var rowProp in data[i].metrics) {
                                        ret += jQuery.i18n.map["reports." + rowProp] + ", ";
                                    }
                    
                                    ret = ret.substring(0, ret.length - 2);
                    
                                    ret += " for " + data[i].appNames.join(", ");
                                }
                                else if (!data[i].pluginEnabled) {
                                    ret = jQuery.i18n.prop("reports.enable-plugin", data[i].report_type);
                                }
                                else if (!data[i].isValid) {
                                    ret = jQuery.i18n.prop("reports.not-valid");
                                }
                                else {
                                    var report = app.getReportsCallbacks()[data[i].report_type];
                                    if (report && report.tableData) {
                                        ret = report.tableData(data[i]);
                                    }
                                }
                                data[i].dataColumn = ret;
                    
                                var timeColumn = jQuery.i18n.map["reports.at"] + " " 
                                     + (data[i].hour < 10 ? "0" + data[i].hour : data[i].hour)
                                     + ":" + (data[i].minute < 10 ? "0" + data[i].minute : data[i].minute)
                                     + ", " + data[i].zoneName;
                                     
                                if (data[i].frequency === "weekly") {
                                    timeColumn += ", " + jQuery.i18n.map["reports.on"] + " " + data[i].dayname;
                                }
                                if (data[i].frequency === "monthly") {
                                    timeColumn += ", " + jQuery.i18n.map["reports.every-month"];
                                }
                                data[i].timeColumn = timeColumn;

                                data[i].createdByMe = true;
                                if (countlyGlobal.member.global_admin === true || row.user === countlyGlobal.member._id) {
                                    data[i].createdByMe = false;
                                }
                            }
                        }
                        context.commit("setAll", data);
                    });
                },
            }
        });
        return countlyVue.vuex.Module("countlyReports", {
            resetFn: getEmptyState,
            getters: getters,
            actions: actions,
            mutations: mutations,
            submodules: [tableResource]
        });
    }
    countlyReporting.defaultDrawerConfigValue = function () {
        return {
            _id: null,
            title: '',
            report_type: 'core',
            apps: [],
            metrics: {},
            metricsArray:[],
            frequency: null,
            timezone: null,
            day: null,
            hour: null,
            minute: 0,
            dashboards: null,
            date_range: null,
             
        }
    }
}(window.countlyReporting = window.countlyReporting || {}, jQuery));
