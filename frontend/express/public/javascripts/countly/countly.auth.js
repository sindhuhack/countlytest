/*global countlyGlobal, countlyCommon */
(function(countlyAuth) {
    countlyAuth.odd = true;
    /**
     * validate write requests for specific feature on specific app
     * @param {string} accessType - write process type [c, u, d]
     * @param {string} feature - feature name that required access right
     * @param {object} member - countly member object
     * @param {string} app_id - countly application id
     * @return {boolean} result of permission check
     */
    function validateWrite(accessType, feature, member, app_id) {
        member = member || countlyGlobal.member;
        app_id = app_id || countlyCommon.ACTIVE_APP_ID;
        if (member.locked) {
            return false;
        }

        if (!member.global_admin) {
            if (feature.substr(0, 7) === 'global_') {
                feature = feature.split('_')[1];
                if (!((member.permission && typeof member.permission[accessType] === "object" && typeof member.permission[accessType].global === "object") && (member.permission[accessType].global.all || member.permission[accessType].global.allowed[feature]))) {
                    return false;
                }
            }
            else if (!((member.permission && typeof member.permission[accessType] === "object" && typeof member.permission[accessType][app_id] === "object") && (member.permission[accessType][app_id].all || member.permission[accessType][app_id].allowed[feature]))) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }

    /**
     * validate create requests for specific feature on specific app
     * @param {string} feature - feature name that required access right
     * @param {object} member - countly member object
     * @param {string} app_id - countly application id
     * @return {boolean} result of permission check
     */
    countlyAuth.validateCreate = function(feature, member, app_id) {
        return validateWrite('c', feature, member, app_id);
    };

    /**
     * validate read requests for specific feature on specific app
     * @param {string} feature - feature name that required access right
     * @param {object} member - countly member object
     * @param {string} app_id - countly application id
     * @return {boolean} result of permission check
     */
    countlyAuth.validateRead = function(feature, member, app_id) {
        member = member || countlyGlobal.member;
        app_id = app_id || countlyCommon.ACTIVE_APP_ID;
        if (member.locked) {
            return false;
        }

        if (!member.global_admin) {
            if (feature.substr(0, 7) === 'global_') {
                feature = feature.split('_')[1];
                if (!((member.permission && typeof member.permission.r === "object" && typeof member.permission.r.global === "object") && (member.permission.r.global.all || member.permission.r.global.allowed[feature]))) {
                    return false;
                }
            }
            else if (!((member.permission && typeof member.permission.r === "object" && typeof member.permission.r[app_id] === "object") && (member.permission.r[app_id].all || member.permission.r[app_id].allowed[feature]))) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    };

    /**
     * validate update requests for specific feature on specific app
     * @param {string} feature - feature name that required access right
     * @param {object} member - countly member object
     * @param {string} app_id - countly application id
     * @return {boolean} result of permission check
     */
    countlyAuth.validateUpdate = function(feature, member, app_id) {
        return validateWrite('u', feature, member, app_id);
    };

    /**
     * validate delete requests for specific feature on specific app
     * @param {string} feature - feature name that required access right
     * @param {object} member - countly member object
     * @param {string} app_id - countly application id
     * @return {boolean} result of permission check
     */
    countlyAuth.validateDelete = function(feature, member, app_id) {
        return validateWrite('d', feature, member, app_id);
    };

    countlyAuth.renderFeatureTemplate = function(featureName, index) {
        var odd = countlyAuth.odd;
        countlyAuth.odd = !countlyAuth.odd;

        var featureTemplate = '<div class="permission-item ' + (odd ? 'gray' : '') + '">';
        featureTemplate += '    <div class="permission-column first-column">' + featureName + '</div>';
        featureTemplate += '    <div class="permission-column">';
        featureTemplate += '        <div class="checkbox-container">';
        featureTemplate += '            <input class="permission-checkbox" id="c-' + featureName + '-' + index + '" data-state="0" type="checkbox">';
        featureTemplate += '            <div class="c-' + featureName + '-' + index + ' fa fa-square-o check-green"></div>';
        featureTemplate += '            <div style="clear:both;"></div>';
        featureTemplate += '        </div>';
        featureTemplate += '    </div>';
        featureTemplate += '    <div class="permission-column">';
        featureTemplate += '        <div class="checkbox-container">';
        featureTemplate += '            <input class="permission-checkbox" id="r-' + featureName + '-' + index + '" data-state="0" type="checkbox">';
        featureTemplate += '            <div class="r-' + featureName + '-' + index + ' fa fa-square-o check-green"></div>';
        featureTemplate += '            <div style="clear:both;"></div>';
        featureTemplate += '        </div>';
        featureTemplate += '    </div>';
        featureTemplate += '    <div class="permission-column">';
        featureTemplate += '        <div class="checkbox-container">';
        featureTemplate += '            <input class="permission-checkbox" id="u-' + featureName + '-' + index + '" data-state="0" type="checkbox">';
        featureTemplate += '            <div class="u-' + featureName + '-' + index + ' fa fa-square-o check-green"></div>';
        featureTemplate += '            <div style="clear:both;"></div>';
        featureTemplate += '        </div>';
        featureTemplate += '    </div>';
        featureTemplate += '    <div class="permission-column">';
        featureTemplate += '        <div class="checkbox-container">';
        featureTemplate += '            <input class="permission-checkbox" id="d-' + featureName + '-' + index + '" data-state="0" type="checkbox">';
        featureTemplate += '            <div class="d-' + featureName + '-' + index + ' fa fa-square-o check-green"></div>';
        featureTemplate += '            <div style="clear:both;"></div>';
        featureTemplate += '        </div>';
        featureTemplate += '    </div>';
        featureTemplate += '    <div style="clear:both"></div>';
        featureTemplate += '</div>';
        return featureTemplate;
    };

    countlyAuth.initializePermissions = function(memberPermission, permissionSets) {
        memberPermission = {
            c: {},
            r: {},
            u: {},
            d: {}
        };

        for (var countlyApp in countlyGlobal.apps) {
            for (var accessType in memberPermission) {
                memberPermission[accessType][countlyApp] = {};
                memberPermission[accessType][countlyApp].all = false;
                memberPermission[accessType][countlyApp].allowed = {};
                memberPermission[accessType].global = {};
                memberPermission[accessType].global.all = false;
                memberPermission[accessType].global.allowed = {};
            }
        }
        
        if (permissionSets.length === 0) {
            permissionSets.push({c: {all: false, allowed: {}}, r: {all: false, allowed: {}}, u: {all: false, allowed: {}}, d: {all: false, allowed: {}}});
        }

        return {
            permissionObject: memberPermission,
            permissionSets: permissionSets
        }
    };

})(window.countlyAuth = window.countlyAuth || {});