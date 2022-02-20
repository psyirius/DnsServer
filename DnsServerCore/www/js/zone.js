﻿/*
Technitium DNS Server
Copyright (C) 2022  Shreyas Zare (shreyas@technitium.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

$(function () {
    $("input[type=radio][name=rdAddZoneType]").change(function () {
        $("#divAddZonePrimaryNameServerAddresses").hide();
        $("#divAddZoneZoneTransferProtocol").hide();
        $("#divAddZoneTsigKeyName").hide();
        $("#divAddZoneForwarderProtocol").hide();
        $("#divAddZoneForwarder").hide();
        $("#divAddZoneForwarderDnssecValidation").hide();
        $("#divAddZoneForwarderProxy").hide();

        var zoneType = $('input[name=rdAddZoneType]:checked').val();
        switch (zoneType) {
            case "Primary":
                break;

            case "Secondary":
                $("#divAddZonePrimaryNameServerAddresses").show();
                $("#divAddZoneZoneTransferProtocol").show();
                $("#divAddZoneTsigKeyName").show();
                break;

            case "Stub":
                $("#divAddZonePrimaryNameServerAddresses").show();
                break;

            case "Forwarder":
                $("#divAddZoneForwarderProtocol").show();
                $("#divAddZoneForwarder").show();
                $("#divAddZoneForwarderDnssecValidation").show();
                $("#divAddZoneForwarderProxy").show();
                break;
        }
    });

    $("input[type=radio][name=rdAddZoneForwarderProtocol]").change(function () {
        var protocol = $('input[name=rdAddZoneForwarderProtocol]:checked').val();
        switch (protocol) {
            case "Udp":
            case "Tcp":
                $("#txtAddZoneForwarder").attr("placeholder", "8.8.8.8 or [2620:fe::10]")
                break;

            case "Tls":
                $("#txtAddZoneForwarder").attr("placeholder", "dns.quad9.net (9.9.9.9:853)")
                break;

            case "Https":
            case "HttpsJson":
                $("#txtAddZoneForwarder").attr("placeholder", "https://cloudflare-dns.com/dns-query (1.1.1.1)")
                break;
        }
    });

    $("input[type=radio][name=rdAddZoneForwarderProxyType]").change(function () {
        var proxyType = $('input[name=rdAddZoneForwarderProxyType]:checked').val();

        $("#txtAddZoneForwarderProxyAddress").prop("disabled", (proxyType === "None"));
        $("#txtAddZoneForwarderProxyPort").prop("disabled", (proxyType === "None"));
        $("#txtAddZoneForwarderProxyUsername").prop("disabled", (proxyType === "None"));
        $("#txtAddZoneForwarderProxyPassword").prop("disabled", (proxyType === "None"));
    });

    $("input[type=radio][name=rdZoneTransfer]").change(function () {
        var zoneTransfer = $('input[name=rdZoneTransfer]:checked').val();
        if (zoneTransfer === "AllowOnlySpecifiedNameServers") {
            $("#txtZoneTransferNameServers").prop("disabled", false);
        }
        else {
            $("#txtZoneTransferNameServers").prop("disabled", true);
        }
    });

    $("input[type=radio][name=rdZoneNotify]").change(function () {
        var zoneTransfer = $('input[name=rdZoneNotify]:checked').val();
        if (zoneTransfer === "SpecifiedNameServers") {
            $("#txtZoneNotifyNameServers").prop("disabled", false);
        }
        else {
            $("#txtZoneNotifyNameServers").prop("disabled", true);
        }
    });

    $("input[type=radio][name=rdDnssecSignZoneAlgorithm]").change(function () {
        var algorithm = $("input[name=rdDnssecSignZoneAlgorithm]:checked").val();
        switch (algorithm) {
            case "RSA":
                $("#divDnssecSignZoneRsaParameters").show();
                $("#divDnssecSignZoneEcdsaParameters").hide();
                break;

            case "ECDSA":
                $("#divDnssecSignZoneRsaParameters").hide();
                $("#divDnssecSignZoneEcdsaParameters").show();
                break;
        }
    });

    $("input[type=radio][name=rdDnssecSignZoneNxProof]").change(function () {
        var nxProof = $("input[name=rdDnssecSignZoneNxProof]:checked").val();
        switch (nxProof) {
            case "NSEC":
                $("#divDnssecSignZoneNSEC3Parameters").hide();
                break;

            case "NSEC3":
                $("#divDnssecSignZoneNSEC3Parameters").show();
                break;
        }
    });

    $("#optDnssecPropertiedGenerateKeyAlgorithm").change(function () {
        var algorithm = $("#optDnssecPropertiedGenerateKeyAlgorithm").val();
        switch (algorithm) {
            case "RSA":
                $("#divDnssecPropertiesGenerateKeyRsaParameters").show();
                $("#divDnssecPropertiesGenerateKeyEcdsaParameters").hide();
                break;

            case "ECDSA":
                $("#divDnssecPropertiesGenerateKeyRsaParameters").hide();
                $("#divDnssecPropertiesGenerateKeyEcdsaParameters").show();
                break;
        }
    });

    $("input[type=radio][name=rdDnssecPropertiesNxProof]").change(function () {
        var nxProof = $("input[name=rdDnssecPropertiesNxProof]:checked").val();
        switch (nxProof) {
            case "NSEC":
                $("#divDnssecPropertiesNSEC3Parameters").hide();
                break;

            case "NSEC3":
                $("#divDnssecPropertiesNSEC3Parameters").show();
                break;
        }
    });

    $("#chkAddEditRecordDataPtr").click(function () {
        var addPtrRecord = $("#chkAddEditRecordDataPtr").prop('checked');
        $("#chkAddEditRecordDataCreatePtrZone").prop('disabled', !addPtrRecord);
    });

    $("input[type=radio][name=rdAddEditRecordDataForwarderProtocol]").change(updateAddEditFormForwarderPlaceholder);

    $("input[type=radio][name=rdAddEditRecordDataForwarderProxyType]").change(updateAddEditFormForwarderProxyType);

    $("#optAddEditRecordDataAppName").change(function () {
        if (appsList == null)
            return;

        var appName = $("#optAddEditRecordDataAppName").val();
        var optClassPaths = "<option></option>";

        for (var i = 0; i < appsList.length; i++) {
            if (appsList[i].name == appName) {
                for (var j = 0; j < appsList[i].dnsApps.length; j++) {
                    if (appsList[i].dnsApps[j].isAppRecordRequestHandler)
                        optClassPaths += "<option>" + appsList[i].dnsApps[j].classPath + "</option>";
                }

                break;
            }
        }

        $("#optAddEditRecordDataClassPath").html(optClassPaths);
        $("#txtAddEditRecordDataData").val("");
    });

    $("#optAddEditRecordDataClassPath").change(function () {
        if (appsList == null)
            return;

        var appName = $("#optAddEditRecordDataAppName").val();
        var classPath = $("#optAddEditRecordDataClassPath").val();

        for (var i = 0; i < appsList.length; i++) {
            if (appsList[i].name == appName) {
                for (var j = 0; j < appsList[i].dnsApps.length; j++) {
                    if (appsList[i].dnsApps[j].classPath == classPath) {
                        $("#txtAddEditRecordDataData").val(appsList[i].dnsApps[j].recordDataTemplate);
                        return;
                    }
                }
            }
        }

        $("#txtAddEditRecordDataData").val("");
    });

    $("#optZoneOptionsQuickTsigKeyNames").change(function () {

        var selectedOption = $("#optZoneOptionsQuickTsigKeyNames").val();

        switch (selectedOption) {
            case "blank":
                break;

            case "none":
                $("#txtZoneOptionsZoneTransferTsigKeyNames").val("");
                break;

            default:
                var existingList = $("#txtZoneOptionsZoneTransferTsigKeyNames").val();

                if (existingList.indexOf(selectedOption) < 0) {
                    existingList += selectedOption + "\n";
                    $("#txtZoneOptionsZoneTransferTsigKeyNames").val(existingList);
                }

                break;
        }
    });
});

function refreshZones(checkDisplay) {
    if (checkDisplay == null)
        checkDisplay = false;

    var divViewZones = $("#divViewZones");

    if (checkDisplay && (divViewZones.css('display') === "none"))
        return;

    var divViewZonesLoader = $("#divViewZonesLoader");
    var divEditZone = $("#divEditZone");

    divViewZones.hide();
    divEditZone.hide();
    divViewZonesLoader.show();

    HTTPRequest({
        url: "/api/zone/list?token=" + token,
        success: function (responseJSON) {
            var zones = responseJSON.response.zones;
            var tableHtmlRows = "";

            for (var i = 0; i < zones.length; i++) {
                var id = Math.floor(Math.random() * 10000);
                var name = zones[i].name;

                if (name === "")
                    name = ".";

                var type;
                if (zones[i].internal)
                    type = "<span class=\"label label-default\">Internal</span>";
                else
                    type = "<span class=\"label label-primary\">" + zones[i].type + "</span>";

                var dnssecStatus = "";

                switch (zones[i].dnssecStatus) {
                    case "SignedWithNSEC":
                    case "SignedWithNSEC3":
                        dnssecStatus = "<span class=\"label label-default\">DNSSEC</span>";
                        break;
                }

                var status = "";

                if (zones[i].disabled)
                    status = "<span id=\"tdStatus" + id + "\" class=\"label label-warning\">Disabled</span>";
                else if (zones[i].isExpired)
                    status = "<span id=\"tdStatus" + id + "\" class=\"label label-danger\">Expired</span>";
                else
                    status = "<span id=\"tdStatus" + id + "\" class=\"label label-success\">Enabled</span>";

                var expiry = zones[i].expiry;
                if (expiry == null)
                    expiry = "&nbsp;";
                else
                    expiry = moment(expiry).local().format("YYYY-MM-DD HH:mm");

                var isReadOnlyZone = zones[i].internal;

                var disableOptions;

                switch (zones[i].type) {
                    case "Primary":
                    case "Secondary":
                        disableOptions = zones[i].internal;
                        break;

                    default:
                        disableOptions = true;
                        break;
                }

                tableHtmlRows += "<tr id=\"trZone" + id + "\"><td>" + htmlEncode(name) + "</td>";
                tableHtmlRows += "<td>" + type + "</td>";
                tableHtmlRows += "<td>" + dnssecStatus + "</td>";
                tableHtmlRows += "<td>" + status + "</td>";
                tableHtmlRows += "<td>" + expiry + "</td>";
                tableHtmlRows += "<td align=\"right\" style=\"width: 290px;\"><button type=\"button\" class=\"btn btn-primary\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" onclick=\"showEditZone('" + name + "');\">" + (isReadOnlyZone ? "View" : "Edit") + "</button>";
                tableHtmlRows += "<button type=\"button\" data-id=\"" + id + "\" id=\"btnEnableZone" + id + "\" class=\"btn btn-default\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;" + (zones[i].disabled ? "" : " display: none;") + "\" onclick=\"enableZone(this, '" + name + "');\" data-loading-text=\"Enabling...\"" + (zones[i].internal ? " disabled" : "") + ">Enable</button>";
                tableHtmlRows += "<button type=\"button\" data-id=\"" + id + "\" id=\"btnDisableZone" + id + "\" class=\"btn btn-warning\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;" + (!zones[i].disabled ? "" : " display: none;") + "\" onclick=\"disableZone(this, '" + name + "');\" data-loading-text=\"Disabling...\"" + (zones[i].internal ? " disabled" : "") + ">Disable</button>";
                tableHtmlRows += "<button type=\"button\" data-id=\"" + id + "\" class=\"btn btn-danger\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" onclick=\"deleteZone(this, '" + name + "');\" data-loading-text=\"Deleting...\"" + (zones[i].internal ? " disabled" : "") + ">Delete</button>";
                tableHtmlRows += "<button type=\"button\" class=\"btn btn-primary\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" onclick=\"showZoneOptionsModal('" + name + "');\"" + (disableOptions ? " disabled" : "") + ">Options</button></td></tr>";
            }

            $("#tableZonesBody").html(tableHtmlRows);

            if (zones.length > 0)
                $("#tableZonesFooter").html("<tr><td colspan=\"6\"><b>Total Zones: " + zones.length + "</b></td></tr>");
            else
                $("#tableZonesFooter").html("<tr><td colspan=\"6\" align=\"center\">No Zones Found</td></tr>");

            divViewZonesLoader.hide();
            divViewZones.show();
        },
        error: function () {
            divViewZonesLoader.hide();
            divViewZones.show();
        },
        invalidToken: function () {
            showPageLogin();
        },
        objLoaderPlaceholder: divViewZonesLoader
    });
}

function enableZone(objBtn, zone) {
    var btn = $(objBtn);
    var id = btn.attr("data-id");

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/enable?token=" + token + "&zone=" + zone,
        success: function (responseJSON) {
            btn.button('reset');

            $("#btnEnableZone" + id).hide();
            $("#btnDisableZone" + id).show();
            $("#tdStatus" + id).attr("class", "label label-success");
            $("#tdStatus" + id).html("Enabled");

            showAlert("success", "Zone Enabled!", "Zone '" + zone + "' was enabled successfully.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        }
    });
}

function disableZone(objBtn, zone) {
    if (!confirm("Are you sure you want to disable the zone '" + zone + "'?"))
        return;

    var btn = $(objBtn);
    var id = btn.attr("data-id");

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/disable?token=" + token + "&zone=" + zone,
        success: function (responseJSON) {
            btn.button('reset');

            $("#btnEnableZone" + id).show();
            $("#btnDisableZone" + id).hide();
            $("#tdStatus" + id).attr("class", "label label-warning");
            $("#tdStatus" + id).html("Disabled");

            showAlert("success", "Zone Disabled!", "Zone '" + zone + "' was disabled successfully.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        }
    });
}

function deleteZone(objBtn, zone, editZone) {
    if (!confirm("Are you sure you want to permanently delete the zone '" + zone + "' and all its records?"))
        return;

    if (editZone == null)
        editZone = false;

    var btn = $(objBtn);
    var id = btn.attr("data-id");

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/delete?token=" + token + "&zone=" + zone,
        success: function (responseJSON) {
            if (editZone) {
                btn.button('reset');
                refreshZones();
            }
            else {
                $("#trZone" + id).remove();

                var totalZones = $('#tableZones >tbody >tr').length;

                if (totalZones > 0)
                    $("#tableZonesFooter").html("<tr><td colspan=\"6\"><b>Total Zones: " + totalZones + "</b></td></tr>");
                else
                    $("#tableZonesFooter").html("<tr><td colspan=\"6\" align=\"center\">No Zones Found</td></tr>");
            }

            showAlert("success", "Zone Deleted!", "Zone '" + zone + "' was deleted successfully.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        }
    });
}

function showZoneOptionsModal(zone) {
    var divZoneOptionsAlert = $("#divZoneOptionsAlert");
    var divZoneOptionsLoader = $("#divZoneOptionsLoader");
    var divZoneOptions = $("#divZoneOptions");

    $("#lblZoneOptionsZoneName").text(zone);
    divZoneOptionsLoader.show();
    divZoneOptions.hide();

    $("#modalZoneOptions").modal("show");

    HTTPRequest({
        url: "/api/zone/options/get?token=" + token + "&zone=" + zone,
        success: function (responseJSON) {
            $("#txtZoneTransferNameServers").prop("disabled", true);
            $("#txtZoneNotifyNameServers").prop("disabled", true);

            switch (responseJSON.response.zoneTransfer) {
                case "Allow":
                    $("#rdZoneTransferAllow").prop("checked", true);
                    break;

                case "AllowOnlyZoneNameServers":
                    $("#rdZoneTransferAllowOnlyZoneNameServers").prop("checked", true);
                    break;

                case "AllowOnlySpecifiedNameServers":
                    $("#rdZoneTransferAllowOnlySpecifiedNameServers").prop("checked", true);
                    $("#txtZoneTransferNameServers").prop("disabled", false);
                    break;

                case "Deny":
                default:
                    $("#rdZoneTransferDeny").prop("checked", true);
                    break;
            }

            {
                var value = "";

                for (var i = 0; i < responseJSON.response.zoneTransferNameServers.length; i++)
                    value += responseJSON.response.zoneTransferNameServers[i] + "\r\n";

                $("#txtZoneTransferNameServers").val(value);
            }

            switch (responseJSON.response.notify) {
                case "ZoneNameServers":
                    $("#rdZoneNotifyZoneNameServers").prop("checked", true);
                    break;

                case "SpecifiedNameServers":
                    $("#rdZoneNotifySpecifiedNameServers").prop("checked", true);
                    $("#txtZoneNotifyNameServers").prop("disabled", false);
                    break;

                case "None":
                default:
                    $("#rdZoneNotifyNone").prop("checked", true);
                    break;
            }

            {
                var value = "";

                for (var i = 0; i < responseJSON.response.notifyNameServers.length; i++)
                    value += responseJSON.response.notifyNameServers[i] + "\r\n";

                $("#txtZoneNotifyNameServers").val(value);
            }

            {
                var value = "";

                if (responseJSON.response.zoneTransferTsigKeyNames != null) {
                    for (var i = 0; i < responseJSON.response.zoneTransferTsigKeyNames.length; i++) {
                        value += responseJSON.response.zoneTransferTsigKeyNames[i] + "\r\n";
                    }
                }

                $("#txtZoneOptionsZoneTransferTsigKeyNames").val(value);
            }

            {
                var options = "<option value=\"blank\" selected></option><option value=\"none\">None</option>";

                if (responseJSON.response.availableTsigKeyNames != null) {
                    for (var i = 0; i < responseJSON.response.availableTsigKeyNames.length; i++) {
                        options += "<option>" + htmlEncode(responseJSON.response.availableTsigKeyNames[i]) + "</option>";
                    }
                }

                $("#optZoneOptionsQuickTsigKeyNames").html(options);
            }

            divZoneOptionsLoader.hide();
            divZoneOptions.show();
        },
        error: function () {
            divZoneOptionsLoader.hide();
        },
        invalidToken: function () {
            $("#modalZoneOptions").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divZoneOptionsAlert,
        objLoaderPlaceholder: divZoneOptionsLoader
    });
}

function saveZoneOptions() {
    var divZoneOptionsAlert = $("#divZoneOptionsAlert");
    var divZoneOptionsLoader = $("#divZoneOptionsLoader");
    var zone = $("#lblZoneOptionsZoneName").text();

    var zoneTransfer = $("input[name=rdZoneTransfer]:checked").val();

    var zoneTransferNameServers = cleanTextList($("#txtZoneTransferNameServers").val());

    if ((zoneTransferNameServers.length === 0) || (zoneTransferNameServers === ","))
        zoneTransferNameServers = false;
    else
        $("#txtZoneTransferNameServers").val(zoneTransferNameServers.replace(/,/g, "\n"));

    var notify = $("input[name=rdZoneNotify]:checked").val();

    var notifyNameServers = cleanTextList($("#txtZoneNotifyNameServers").val());

    if ((notifyNameServers.length === 0) || (notifyNameServers === ","))
        notifyNameServers = false;
    else
        $("#txtZoneNotifyNameServers").val(notifyNameServers.replace(/,/g, "\n"));

    var zoneTransferTsigKeyNames = cleanTextList($("#txtZoneOptionsZoneTransferTsigKeyNames").val());

    if ((zoneTransferTsigKeyNames.length === 0) || (zoneTransferTsigKeyNames === ","))
        zoneTransferTsigKeyNames = false;
    else
        $("#txtZoneOptionsZoneTransferTsigKeyNames").val(zoneTransferTsigKeyNames.replace(/,/g, "\n"));

    var btn = $("#btnSaveZoneOptions");
    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/options/set?token=" + token + "&zone=" + zone
            + "&zoneTransfer=" + zoneTransfer + "&zoneTransferNameServers=" + encodeURIComponent(zoneTransferNameServers)
            + "&notify=" + notify + "&notifyNameServers=" + encodeURIComponent(notifyNameServers)
            + "&zoneTransferTsigKeyNames=" + encodeURIComponent(zoneTransferTsigKeyNames),
        success: function (responseJSON) {
            btn.button('reset');
            $("#modalZoneOptions").modal("hide");

            showAlert("success", "Options Saved!", "Zone options were saved successfully.");
        },
        error: function () {
            btn.button('reset');
            divZoneOptionsLoader.hide();
        },
        invalidToken: function () {
            btn.button('reset');
            $("#modalZoneOptions").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divZoneOptionsAlert,
        objLoaderPlaceholder: divZoneOptionsLoader
    });
}

function resyncZone(objBtn, domain) {
    if ($("#titleEditZoneType").text() == "Secondary") {
        if (!confirm("The resync action will perform a full zone transfer (AXFR). You will need to check the logs to confirm if the resync action was successful.\r\n\r\nAre you sure you want to resync the '" + domain + "' zone?"))
            return;
    }
    else {
        if (!confirm("The resync action will perform a full zone refresh. You will need to check the logs to confirm if the resync action was successful.\r\n\r\nAre you sure you want to resync the '" + domain + "' zone?"))
            return;
    }

    var btn = $(objBtn);
    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/resync?token=" + token + "&domain=" + domain,
        success: function (responseJSON) {
            btn.button('reset');
            showAlert("success", "Resync Triggered!", "Zone '" + domain + "' resync was triggered successfully. Please check the Logs for confirmation.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            btn.button('reset');
            showPageLogin();
        }
    });
}

function showAddZoneModal() {
    $("#divAddZoneAlert").html("");

    $("#txtAddZone").val("");
    $("#rdAddZoneTypePrimary").prop("checked", true);
    $("#txtAddZonePrimaryNameServerAddresses").val("");
    $("#rdAddZoneZoneTransferProtocolTcp").prop("checked", true);
    $("#optAddZoneTsigKeyName").val("");
    $("input[name=rdAddZoneForwarderProtocol]:radio").attr("disabled", false);
    $("#rdAddZoneForwarderProtocolUdp").prop("checked", true);
    $("#chkAddZoneForwarderThisServer").prop("checked", false);
    $("#txtAddZoneForwarder").prop("disabled", false);
    $("#txtAddZoneForwarder").attr("placeholder", "8.8.8.8 or [2620:fe::10]")
    $("#txtAddZoneForwarder").val("");
    $("#chkAddZoneForwarderDnssecValidation").prop("checked", false);
    $("#rdAddZoneForwarderProxyTypeNone").prop("checked", true);
    $("#txtAddZoneForwarderProxyAddress").prop("disabled", true);
    $("#txtAddZoneForwarderProxyPort").prop("disabled", true);
    $("#txtAddZoneForwarderProxyUsername").prop("disabled", true);
    $("#txtAddZoneForwarderProxyPassword").prop("disabled", true);
    $("#txtAddZoneForwarderProxyAddress").val("");
    $("#txtAddZoneForwarderProxyPort").val("");
    $("#txtAddZoneForwarderProxyUsername").val("");
    $("#txtAddZoneForwarderProxyPassword").val("");

    $("#divAddZonePrimaryNameServerAddresses").hide();
    $("#divAddZoneZoneTransferProtocol").hide();
    $("#divAddZoneTsigKeyName").hide();
    $("#divAddZoneForwarderProtocol").hide();
    $("#divAddZoneForwarder").hide();
    $("#divAddZoneForwarderDnssecValidation").hide();
    $("#divAddZoneForwarderProxy").hide();

    $("#btnAddZone").button('reset');

    $("#modalAddZone").modal("show");

    setTimeout(function () {
        $("#txtAddZone").focus();
    }, 1000);
}

function updateAddZoneFormForwarderThisServer() {
    var useThisServer = $("#chkAddZoneForwarderThisServer").prop('checked');

    if (useThisServer) {
        $("input[name=rdAddZoneForwarderProtocol]:radio").attr("disabled", true);
        $("#rdAddZoneForwarderProtocolUdp").prop("checked", true);
        $("#txtAddZoneForwarder").attr("placeholder", "8.8.8.8 or [2620:fe::10]")

        $("#txtAddZoneForwarder").prop("disabled", true);
        $("#txtAddZoneForwarder").val("this-server");
    }
    else {
        $("input[name=rdAddZoneForwarderProtocol]:radio").attr("disabled", false);

        $("#txtAddZoneForwarder").prop("disabled", false);
        $("#txtAddZoneForwarder").val("");
    }
}

function addZone() {
    var divAddZoneAlert = $("#divAddZoneAlert");
    var zone = $("#txtAddZone").val();

    if ((zone == null) || (zone === "")) {
        showAlert("warning", "Missing!", "Please enter a domain name to add zone.", divAddZoneAlert);
        $("#txtAddZone").focus();
        return;
    }

    var type = $('input[name=rdAddZoneType]:checked').val();

    var parameters;

    switch (type) {
        case "Secondary":
            var tsigKeyName = $("#optAddZoneTsigKeyName").val();

            parameters = "&primaryNameServerAddresses=" + encodeURIComponent(cleanTextList($("#txtAddZonePrimaryNameServerAddresses").val()));
            parameters += "&zoneTransferProtocol=" + $("input[name=rdAddZoneZoneTransferProtocol]:checked").val();
            parameters += "&tsigKeyName=" + encodeURIComponent(tsigKeyName);
            break;

        case "Stub":
            parameters = "&primaryNameServerAddresses=" + encodeURIComponent(cleanTextList($("#txtAddZonePrimaryNameServerAddresses").val()));
            break;

        case "Forwarder":
            var forwarder = $("#txtAddZoneForwarder").val();
            if ((forwarder == null) || (forwarder === "")) {
                showAlert("warning", "Missing!", "Please enter a forwarder server name to add zone.", divAddZoneAlert);
                $("#txtAddZoneForwarder").focus();
                return;
            }

            var dnssecValidation = $("#chkAddZoneForwarderDnssecValidation").prop("checked");
            var proxyType = $("input[name=rdAddZoneForwarderProxyType]:checked").val();

            parameters = "&protocol=" + $("input[name=rdAddZoneForwarderProtocol]:checked").val() + "&forwarder=" + encodeURIComponent(forwarder);
            parameters += "&dnssecValidation=" + dnssecValidation + "&proxyType=" + proxyType;

            if (proxyType != "None") {
                var proxyAddress = $("#txtAddZoneForwarderProxyAddress").val();
                var proxyPort = $("#txtAddZoneForwarderProxyPort").val();
                var proxyUsername = $("#txtAddZoneForwarderProxyUsername").val();
                var proxyPassword = $("#txtAddZoneForwarderProxyPassword").val();

                if ((proxyAddress == null) || (proxyAddress === "")) {
                    showAlert("warning", "Missing!", "Please enter a domain name or IP address for Proxy Server Address to add zone.", divAddZoneAlert);
                    $("#txtAddZoneForwarderProxyAddress").focus();
                    return;
                }

                if ((proxyPort == null) || (proxyPort === "")) {
                    showAlert("warning", "Missing!", "Please enter a port number for Proxy Server Port to add zone.", divAddZoneAlert);
                    $("#txtAddZoneForwarderProxyPort").focus();
                    return;
                }

                parameters += "&proxyAddress=" + encodeURIComponent(proxyAddress) + "&proxyPort=" + proxyPort + "&proxyUsername=" + encodeURIComponent(proxyUsername) + "&proxyPassword=" + encodeURIComponent(proxyPassword);
            }
            break;

        default:
            parameters = "";
            break;
    }

    var btn = $("#btnAddZone").button('loading');

    HTTPRequest({
        url: "/api/zone/create?token=" + token + "&zone=" + zone + "&type=" + type + parameters,
        success: function (responseJSON) {
            $("#modalAddZone").modal("hide");
            showEditZone(responseJSON.response.domain);

            showAlert("success", "Zone Added!", "Zone was added successfully.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        },
        objAlertPlaceholder: divAddZoneAlert
    });
}

function showEditZone(domain) {
    var divViewZonesLoader = $("#divViewZonesLoader");
    var divViewZones = $("#divViewZones");
    var divEditZone = $("#divEditZone");

    divViewZones.hide();
    divEditZone.hide();
    divViewZonesLoader.show();

    HTTPRequest({
        url: "/api/zone/getRecords?token=" + token + "&domain=" + domain,
        success: function (responseJSON) {
            var type;
            if (responseJSON.response.zone.internal)
                type = "Internal";
            else
                type = responseJSON.response.zone.type;

            switch (responseJSON.response.zone.dnssecStatus) {
                case "SignedWithNSEC":
                case "SignedWithNSEC3":
                    $("#tdDnssecStatusEditZone").show();
                    break;

                default:
                    $("#tdDnssecStatusEditZone").hide();
                    break;
            }

            var status;
            if (responseJSON.response.zone.disabled)
                status = "Disabled";
            else if (responseJSON.response.zone.isExpired)
                status = "Expired";
            else
                status = "Enabled";

            var expiry = responseJSON.response.zone.expiry;
            if (expiry == null)
                expiry = "&nbsp;";
            else
                expiry = "Expiry: " + moment(expiry).local().format("YYYY-MM-DD HH:mm:ss");

            $("#titleEditZoneType").html(type);
            $("#tdStatusEditZone").html(status);
            $("#titleEditZoneExpiry").html(expiry);

            if (responseJSON.response.zone.internal)
                $("#titleEditZoneType").attr("class", "label label-default");
            else
                $("#titleEditZoneType").attr("class", "label label-primary");

            switch (status) {
                case "Disabled":
                    $("#tdStatusEditZone").attr("class", "label label-warning");
                    break;

                case "Expired":
                    $("#tdStatusEditZone").attr("class", "label label-danger");
                    break;

                case "Enabled":
                    $("#tdStatusEditZone").attr("class", "label label-success");
                    break;
            }

            switch (type) {
                case "Internal":
                case "Secondary":
                case "Stub":
                    $("#btnEditZoneAddRecord").hide();
                    break;

                case "Forwarder":
                    $("#btnEditZoneAddRecord").show();
                    $("#optEditRecordTypeFwd").show();
                    $("#optEditRecordTypeApp").hide();
                    break;

                default:
                    $("#btnEditZoneAddRecord").show();
                    $("#optEditRecordTypeFwd").hide();
                    $("#optEditRecordTypeApp").show();
                    break;
            }

            if (responseJSON.response.zone.internal) {
                $("#btnEnableZoneEditZone").hide();
                $("#btnDisableZoneEditZone").hide();
                $("#btnEditZoneDeleteZone").hide();
            }
            else if (responseJSON.response.zone.disabled) {
                $("#btnEnableZoneEditZone").show();
                $("#btnDisableZoneEditZone").hide();
                $("#btnEditZoneDeleteZone").show();
            }
            else {
                $("#btnEnableZoneEditZone").hide();
                $("#btnDisableZoneEditZone").show();
                $("#btnEditZoneDeleteZone").show();
            }

            switch (type) {
                case "Secondary":
                case "Stub":
                    $("#btnZoneResync").show();
                    break;

                default:
                    $("#btnZoneResync").hide();
                    break;
            }

            switch (type) {
                case "Primary":
                case "Secondary":
                    $("#btnZoneOptions").show();
                    break;

                default:
                    $("#btnZoneOptions").hide();
                    break;
            }

            switch (type) {
                case "Primary":
                    $("#divZoneDnssecOptions").show();

                    switch (responseJSON.response.zone.dnssecStatus) {
                        case "SignedWithNSEC":
                        case "SignedWithNSEC3":
                            $("#lnkZoneDnssecSignZone").hide();
                            $("#lnkZoneDnssecProperties").show();
                            $("#lnkZoneDnssecUnsignZone").show();
                            break;

                        default:
                            $("#lnkZoneDnssecSignZone").show();
                            $("#lnkZoneDnssecProperties").hide();
                            $("#lnkZoneDnssecUnsignZone").hide();
                            break;
                    }
                    break;

                default:
                    $("#divZoneDnssecOptions").hide();
                    break;
            }

            var records = responseJSON.response.records;
            var tableHtmlRows = "";

            for (var i = 0; i < records.length; i++) {
                var id = Math.floor(Math.random() * 10000);

                var name = records[i].name.toLowerCase();
                if (name === "")
                    name = ".";

                if (name === domain)
                    name = "@";
                else
                    name = name.replace("." + domain, "");

                tableHtmlRows += "<tr id=\"tr" + id + "\"><td>" + htmlEncode(name) + "</td>";
                tableHtmlRows += "<td>" + records[i].type + "</td>";
                tableHtmlRows += "<td>" + records[i].ttl + "</td>";

                var additionalDataAttributes = "";

                switch (records[i].type.toUpperCase()) {
                    case "A":
                    case "CNAME":
                    case "DNAME":
                    case "PTR":
                    case "TXT":
                    case "AAAA":
                    case "ANAME":
                        tableHtmlRows += "<td style=\"word-break: break-all;\">" + htmlEncode(records[i].rData.value);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";
                        break;

                    case "NS":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Name Server:</b> " + htmlEncode(records[i].rData.value);

                        if (records[i].glueRecords != null) {
                            tableHtmlRows += "<br /><b>Glue Addresses:</b> " + records[i].glueRecords;

                            additionalDataAttributes = "data-record-glue=\"" + htmlEncode(records[i].glueRecords) + "\" ";
                        } else {
                            additionalDataAttributes = "data-record-glue=\"\" ";
                        }

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";
                        break;

                    case "SOA":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Primary Name Server:</b> " + htmlEncode(records[i].rData.primaryNameServer) +
                            "<br /><b>Responsible Person:</b> " + htmlEncode(records[i].rData.responsiblePerson) +
                            "<br /><b>Serial:</b> " + htmlEncode(records[i].rData.serial) +
                            "<br /><b>Refresh:</b> " + htmlEncode(records[i].rData.refresh) +
                            "<br /><b>Retry:</b> " + htmlEncode(records[i].rData.retry) +
                            "<br /><b>Expire:</b> " + htmlEncode(records[i].rData.expire) +
                            "<br /><b>Minimum:</b> " + htmlEncode(records[i].rData.minimum);

                        if (records[i].rData.primaryAddresses != null) {
                            tableHtmlRows += "<br /><b>Primary Name Server Addresses:</b> " + records[i].rData.primaryAddresses;

                            additionalDataAttributes = "data-record-paddresses=\"" + htmlEncode(records[i].rData.primaryAddresses) + "\" ";
                        } else {
                            additionalDataAttributes = "data-record-paddresses=\"\" ";
                        }

                        if (records[i].rData.zoneTransferProtocol != null) {
                            tableHtmlRows += "<br /><b>Zone Transfer Protocol:</b> XFR-over-" + records[i].rData.zoneTransferProtocol.toUpperCase();

                            additionalDataAttributes += "data-record-zonetransferprotocol=\"" + htmlEncode(records[i].rData.zoneTransferProtocol) + "\" ";
                        } else {
                            additionalDataAttributes += "data-record-zonetransferprotocol=\"\" ";
                        }

                        if (records[i].rData.tsigKeyName != null) {
                            tableHtmlRows += "<br /><b>TSIG Key Name:</b> " + records[i].rData.tsigKeyName;

                            additionalDataAttributes += "data-record-tsigkeyname=\"" + htmlEncode(records[i].rData.tsigKeyName) + "\" ";
                        } else {
                            additionalDataAttributes += "data-record-tsigkeyname=\"\" ";
                        }

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes += "data-record-pname=\"" + htmlEncode(records[i].rData.primaryNameServer) + "\" " +
                            "data-record-rperson=\"" + htmlEncode(records[i].rData.responsiblePerson) + "\" " +
                            "data-record-serial=\"" + htmlEncode(records[i].rData.serial) + "\" " +
                            "data-record-refresh=\"" + htmlEncode(records[i].rData.refresh) + "\" " +
                            "data-record-retry=\"" + htmlEncode(records[i].rData.retry) + "\" " +
                            "data-record-expire=\"" + htmlEncode(records[i].rData.expire) + "\" " +
                            "data-record-minimum=\"" + htmlEncode(records[i].rData.minimum) + "\" ";
                        break;

                    case "MX":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Preference: </b> " + htmlEncode(records[i].rData.preference) +
                            "<br /><b>Exchange:</b> " + htmlEncode(records[i].rData.value);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-preference=\"" + htmlEncode(records[i].rData.preference) + "\" ";
                        break;

                    case "SRV":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Priority: </b> " + htmlEncode(records[i].rData.priority) +
                            "<br /><b>Weight:</b> " + htmlEncode(records[i].rData.weight) +
                            "<br /><b>Port:</b> " + htmlEncode(records[i].rData.port) +
                            "<br /><b>Target:</b> " + htmlEncode(records[i].rData.value);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-priority=\"" + htmlEncode(records[i].rData.priority) + "\" " +
                            "data-record-weight=\"" + htmlEncode(records[i].rData.weight) + "\" " +
                            "data-record-port=\"" + htmlEncode(records[i].rData.port) + "\" ";
                        break;

                    case "DS":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Key Tag: </b> " + htmlEncode(records[i].rData.keyTag) +
                            "<br /><b>Algorithm:</b> " + htmlEncode(records[i].rData.algorithm) +
                            "<br /><b>Digest Type:</b> " + htmlEncode(records[i].rData.digestType) +
                            "<br /><b>Digest:</b> " + htmlEncode(records[i].rData.digest);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-key-tag=\"" + htmlEncode(records[i].rData.keyTag) + "\" " +
                            "data-record-algorithm=\"" + htmlEncode(records[i].rData.algorithm) + "\" " +
                            "data-record-digest-type=\"" + htmlEncode(records[i].rData.digestType) + "\" " +
                            "data-record-digest=\"" + htmlEncode(records[i].rData.digest) + "\" ";
                        break;

                    case "RRSIG":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Type Covered: </b> " + htmlEncode(records[i].rData.typeCovered) +
                            "<br /><b>Algorithm:</b> " + htmlEncode(records[i].rData.algorithm) +
                            "<br /><b>Labels:</b> " + htmlEncode(records[i].rData.labels) +
                            "<br /><b>Original TTL:</b> " + htmlEncode(records[i].rData.originalTtl) +
                            "<br /><b>Signature Expiration:</b> " + htmlEncode(records[i].rData.signatureExpiration) +
                            "<br /><b>Signature Inception:</b> " + htmlEncode(records[i].rData.signatureInception) +
                            "<br /><b>Key Tag:</b> " + htmlEncode(records[i].rData.keyTag) +
                            "<br /><b>Signer's Name:</b> " + htmlEncode(records[i].rData.signersName) +
                            "<br /><b>Signature:</b> " + htmlEncode(records[i].rData.signature);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-type-covered=\"" + htmlEncode(records[i].rData.typeCovered) + "\" " +
                            "data-record-algorithm=\"" + htmlEncode(records[i].rData.algorithm) + "\" " +
                            "data-record-labels=\"" + htmlEncode(records[i].rData.labels) + "\" " +
                            "data-record-original-ttl=\"" + htmlEncode(records[i].rData.originalTtl) + "\" " +
                            "data-record-signature-expiration=\"" + htmlEncode(records[i].rData.signatureExpiration) + "\" " +
                            "data-record-signature-inception=\"" + htmlEncode(records[i].rData.signatureInception) + "\" " +
                            "data-record-key-tag=\"" + htmlEncode(records[i].rData.keyTag) + "\" " +
                            "data-record-signers-name=\"" + htmlEncode(records[i].rData.signersName) + "\" " +
                            "data-record-signature=\"" + htmlEncode(records[i].rData.signature) + "\" ";
                        break;

                    case "NSEC":
                        var nsecTypes = null;

                        for (var j = 0; j < records[i].rData.types.length; j++) {
                            if (nsecTypes == null)
                                nsecTypes = records[i].rData.types[j];
                            else
                                nsecTypes += ", " + records[i].rData.types[j];
                        }

                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Next Domain Name: </b> " + htmlEncode(records[i].rData.nextDomainName) +
                            "<br /><b>Types:</b> " + htmlEncode(nsecTypes);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-next-domain-name=\"" + htmlEncode(records[i].rData.nextDomainName) + "\" " +
                            "data-record-types=\"" + htmlEncode(nsecTypes) + "\" ";
                        break;

                    case "DNSKEY":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Flags: </b> " + htmlEncode(records[i].rData.flags) +
                            "<br /><b>Protocol:</b> " + htmlEncode(records[i].rData.protocol) +
                            "<br /><b>Algorithm:</b> " + htmlEncode(records[i].rData.algorithm) +
                            "<br /><b>Public Key:</b> " + htmlEncode(records[i].rData.publicKey) +
                            "<br /><br /><b>Computed Key Tag:</b> " + htmlEncode(records[i].rData.computedKeyTag);

                        if (records[i].rData.digests != null) {
                            tableHtmlRows += "<br /><br /><b>Computed DS Digests:</b> ";

                            for (var j = 0; j < records[i].rData.digests.length; j++) {
                                tableHtmlRows += "<br />" + htmlEncode(records[i].rData.digests[j].digestType) + ": " + htmlEncode(records[i].rData.digests[j].digest)
                            }
                        }

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-flags=\"" + htmlEncode(records[i].rData.flags) + "\" " +
                            "data-record-protocol=\"" + htmlEncode(records[i].rData.protocol) + "\" " +
                            "data-record-algorithm=\"" + htmlEncode(records[i].rData.algorithm) + "\" " +
                            "data-record-public-key=\"" + htmlEncode(records[i].rData.publicKey) + "\" ";
                        break;

                    case "NSEC3":
                        var nsec3Types = null;

                        for (var j = 0; j < records[i].rData.types.length; j++) {
                            if (nsec3Types == null)
                                nsec3Types = records[i].rData.types[j];
                            else
                                nsec3Types += ", " + records[i].rData.types[j];
                        }

                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Hash Algorithm: </b> " + htmlEncode(records[i].rData.hashAlgorithm) +
                            "<br /><b>Flags: </b> " + htmlEncode(records[i].rData.flags) +
                            "<br /><b>Iterations: </b> " + htmlEncode(records[i].rData.iterations) +
                            "<br /><b>Salt: </b>" + htmlEncode(records[i].rData.salt) +
                            "<br /><b>Next Hashed Owner Name: </b> " + htmlEncode(records[i].rData.nextHashedOwnerName) +
                            "<br /><b>Types:</b> " + htmlEncode(nsec3Types);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-hash-algorithm=\"" + htmlEncode(records[i].rData.hashAlgorithm) + "\" " +
                            "data-record-flags=\"" + htmlEncode(records[i].rData.flags) + "\" " +
                            "data-record-iterations=\"" + htmlEncode(records[i].rData.iterations) + "\" " +
                            "data-record-salt=\"" + htmlEncode(records[i].rData.salt) + "\" " +
                            "data-record-next-hashed-owner-name=\"" + htmlEncode(records[i].rData.nextHashedOwnerName) + "\" " +
                            "data-record-types=\"" + htmlEncode(nsec3Types) + "\" ";
                        break;

                    case "NSEC3PARAM":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Hash Algorithm: </b> " + htmlEncode(records[i].rData.hashAlgorithm) +
                            "<br /><b>Flags: </b> " + htmlEncode(records[i].rData.flags) +
                            "<br /><b>Iterations: </b> " + htmlEncode(records[i].rData.iterations) +
                            "<br /><b>Salt: </b>" + htmlEncode(records[i].rData.salt);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-hash-algorithm=\"" + htmlEncode(records[i].rData.hashAlgorithm) + "\" " +
                            "data-record-flags=\"" + htmlEncode(records[i].rData.flags) + "\" " +
                            "data-record-iterations=\"" + htmlEncode(records[i].rData.iterations) + "\" " +
                            "data-record-salt=\"" + htmlEncode(records[i].rData.salt) + "\" ";
                        break;

                    case "CAA":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Flags: </b> " + htmlEncode(records[i].rData.flags) +
                            "<br /><b>Tag:</b> " + htmlEncode(records[i].rData.tag) +
                            "<br /><b>Authority:</b> " + htmlEncode(records[i].rData.value);

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-flags=\"" + htmlEncode(records[i].rData.flags) + "\" " +
                            "data-record-tag=\"" + htmlEncode(records[i].rData.tag) + "\" ";
                        break;

                    case "FWD":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>Protocol: </b> " + htmlEncode(records[i].rData.protocol) +
                            "<br /><b>Forwarder:</b> " + htmlEncode(records[i].rData.value) +
                            "<br /><b>Enable DNSSEC Validation:</b> " + htmlEncode(records[i].rData.dnssecValidation) +
                            "<br /><b>Proxy Type:</b> " + htmlEncode(records[i].rData.proxyType);

                        if (records[i].rData.proxyType !== "None") {
                            tableHtmlRows += "<br /><b>Proxy Address:</b> " + htmlEncode(records[i].rData.proxyAddress) +
                                "<br /><b>Proxy Port:</b> " + htmlEncode(records[i].rData.proxyPort) +
                                "<br /><b>Proxy Username:</b> " + htmlEncode(records[i].rData.proxyUsername) +
                                "<br /><b>Proxy Password:</b> ************";
                        }

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-protocol=\"" + htmlEncode(records[i].rData.protocol) + "\" " +
                            "data-record-dnssec-validation=\"" + htmlEncode(records[i].rData.dnssecValidation) + "\" " +
                            "data-record-proxy-type=\"" + htmlEncode(records[i].rData.proxyType) + "\" ";

                        if (records[i].rData.proxyType != "None") {
                            additionalDataAttributes += "data-record-proxy-address=\"" + htmlEncode(records[i].rData.proxyAddress) + "\" " +
                                "data-record-proxy-port=\"" + htmlEncode(records[i].rData.proxyPort) + "\" " +
                                "data-record-proxy-username=\"" + htmlEncode(records[i].rData.proxyUsername) + "\" " +
                                "data-record-proxy-password=\"" + htmlEncode(records[i].rData.proxyPassword) + "\" ";
                        }
                        break;

                    case "APP":
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>App Name: </b> " + htmlEncode(records[i].rData.value) +
                            "<br /><b>Class Path:</b> " + htmlEncode(records[i].rData.classPath) +
                            "<br /><b>Record Data:</b> " + (records[i].rData.data == "" ? "" : "<pre>" + htmlEncode(records[i].rData.data) + "</pre>");

                        if ((records[i].comments != null) && (records[i].comments.length > 0))
                            tableHtmlRows += "<br /><br /><b>Comments:</b> <pre>" + htmlEncode(records[i].comments) + "</pre>";

                        tableHtmlRows += "</td>";

                        additionalDataAttributes = "data-record-classpath=\"" + htmlEncode(records[i].rData.classPath) + "\" " +
                            "data-record-data=\"" + htmlEncode(records[i].rData.data) + "\"";
                        break;

                    default:
                        tableHtmlRows += "<td style=\"word-break: break-all;\"><b>RDATA:</b> " + htmlEncode(records[i].rData.value) + "</td>";
                        break;
                }

                var hideActionButtons = false;
                var disableEnableDisableDeleteButtons = false;

                switch (type) {
                    case "Internal":
                        hideActionButtons = true;
                        break;

                    case "Secondary":
                        switch (records[i].type) {
                            case "SOA":
                                disableEnableDisableDeleteButtons = true;
                                break;

                            default:
                                hideActionButtons = true;
                                break;
                        }
                        break;

                    case "Stub":
                        switch (records[i].type) {
                            case "SOA":
                                disableEnableDisableDeleteButtons = true;
                                break;

                            case "NS":
                                if (name == "@")
                                    hideActionButtons = true;

                                break;
                        }
                        break;

                    default:
                        switch (records[i].type) {
                            case "SOA":
                                disableEnableDisableDeleteButtons = true;
                                break;

                            case "DNSKEY":
                            case "RRSIG":
                            case "NSEC":
                            case "NSEC3":
                            case "NSEC3PARAM":
                                hideActionButtons = true;
                                break;
                        }
                        break;
                }

                if (hideActionButtons) {
                    tableHtmlRows += "<td align=\"right\">&nbsp;</td>";
                }
                else {
                    tableHtmlRows += "<td align=\"right\" style=\"min-width: 220px;\">";
                    tableHtmlRows += "<div id=\"data" + id + "\" data-record-name=\"" + htmlEncode(records[i].name) + "\" data-record-type=\"" + records[i].type + "\" data-record-ttl=\"" + records[i].ttl + "\" data-record-value=\"" + htmlEncode(records[i].rData.value) + "\" " + additionalDataAttributes + " data-record-disabled=\"" + records[i].disabled + "\" data-record-comments=\"" + htmlEncode(records[i].comments) + "\" style=\"display: none;\"></div>";
                    tableHtmlRows += "<button type=\"button\" class=\"btn btn-primary\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" data-id=\"" + id + "\" onclick=\"showEditRecordModal(this);\">Edit</button>";
                    tableHtmlRows += "<button type=\"button\" class=\"btn btn-default\" id=\"btnEnableRecord" + id + "\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;" + (records[i].disabled ? "" : " display: none;") + "\" data-id=\"" + id + "\" onclick=\"updateRecordState(this, false);\"" + (disableEnableDisableDeleteButtons ? " disabled" : "") + " data-loading-text=\"Enabling...\">Enable</button>";
                    tableHtmlRows += "<button type=\"button\" class=\"btn btn-warning\" id=\"btnDisableRecord" + id + "\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;" + (!records[i].disabled ? "" : " display: none;") + "\" data-id=\"" + id + "\" onclick=\"updateRecordState(this, true);\"" + (disableEnableDisableDeleteButtons ? " disabled" : "") + " data-loading-text=\"Disabling...\">Disable</button>";
                    tableHtmlRows += "<button type=\"button\" class=\"btn btn-danger\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" data-loading-text=\"Deleting...\" data-id=\"" + id + "\" onclick=\"deleteRecord(this);\"" + (disableEnableDisableDeleteButtons ? " disabled" : "") + ">Delete</button></td>";
                }

                tableHtmlRows += "</tr>";
            }

            $("#titleEditZone").text(domain);
            $("#tableEditZoneBody").html(tableHtmlRows);

            if (records.length > 0)
                $("#tableEditZoneFooter").html("<tr><td colspan=\"5\"><b>Total Records: " + records.length + "</b></td></tr>");
            else
                $("#tableEditZoneFooter").html("<tr><td colspan=\"5\" align=\"center\">No Records Found</td></tr>");

            divViewZonesLoader.hide();
            divEditZone.show();
        },
        error: function () {
            divViewZonesLoader.hide();
            divViewZones.show();
        },
        invalidToken: function () {
            showPageLogin();
        },
        objLoaderPlaceholder: divViewZonesLoader
    });
}

function clearAddEditForm() {
    $("#divAddEditRecordAlert").html("");

    $("#txtAddEditRecordName").prop("placeholder", "@");
    $("#txtAddEditRecordName").prop("disabled", false);
    $("#optAddEditRecordType").prop("disabled", false);
    $("#txtAddEditRecordTtl").prop("disabled", false);
    $("#divAddEditRecordTtl").show();

    $("#txtAddEditRecordName").val("");
    $("#optAddEditRecordType").val("A");
    $("#txtAddEditRecordTtl").val("");

    $("#divAddEditRecordData").show();
    $("#lblAddEditRecordDataValue").text("IPv4 Address");
    $("#txtAddEditRecordDataValue").val("");
    $("#divAddEditRecordDataPtr").show();
    $("#chkAddEditRecordDataPtr").prop("checked", false);
    $("#chkAddEditRecordDataCreatePtrZone").prop('disabled', true);
    $("#chkAddEditRecordDataCreatePtrZone").prop("checked", false);
    $("#chkAddEditRecordDataPtrLabel").text("Add reverse (PTR) record");

    $("#divAddEditRecordDataNs").hide();
    $("#txtAddEditRecordDataNsNameServer").prop("disabled", false);
    $("#txtAddEditRecordDataNsNameServer").val("");
    $("#txtAddEditRecordDataNsGlue").val("");

    $("#divEditRecordDataSoa").hide();
    $("#txtEditRecordDataSoaPrimaryNameServer").prop("disabled", false);
    $("#txtEditRecordDataSoaResponsiblePerson").prop("disabled", false);
    $("#txtEditRecordDataSoaSerial").prop("disabled", false);
    $("#txtEditRecordDataSoaRefresh").prop("disabled", false);
    $("#txtEditRecordDataSoaRetry").prop("disabled", false);
    $("#txtEditRecordDataSoaExpire").prop("disabled", false);
    $("#txtEditRecordDataSoaMinimum").prop("disabled", false);
    $("#txtEditRecordDataSoaPrimaryNameServer").val("");
    $("#txtEditRecordDataSoaResponsiblePerson").val("");
    $("#txtEditRecordDataSoaSerial").val("");
    $("#txtEditRecordDataSoaRefresh").val("");
    $("#txtEditRecordDataSoaRetry").val("");
    $("#txtEditRecordDataSoaExpire").val("");
    $("#txtEditRecordDataSoaMinimum").val("");

    $("#divAddEditRecordDataMx").hide();
    $("#txtAddEditRecordDataMxPreference").val("");
    $("#txtAddEditRecordDataMxExchange").val("");

    $("#divAddEditRecordDataSrv").hide();
    $("#txtAddEditRecordDataSrvPriority").val("");
    $("#txtAddEditRecordDataSrvWeight").val("");
    $("#txtAddEditRecordDataSrvPort").val("");
    $("#txtAddEditRecordDataSrvTarget").val("");

    $("#divAddEditRecordDataCaa").hide();
    $("#txtAddEditRecordDataCaaFlags").val("");
    $("#txtAddEditRecordDataCaaTag").val("");
    $("#txtAddEditRecordDataCaaValue").val("");

    $("#divAddEditRecordDataForwarder").hide();
    $("#rdAddEditRecordDataForwarderProtocolUdp").prop("checked", true);
    $("input[name=rdAddEditRecordDataForwarderProtocol]:radio").attr('disabled', false);
    $("#chkAddEditRecordDataForwarderThisServer").prop("disabled", false);
    $("#chkAddEditRecordDataForwarderThisServer").prop("checked", false);
    $('#txtAddEditRecordDataForwarder').prop('disabled', false);
    $("#txtAddEditRecordDataForwarder").attr("placeholder", "8.8.8.8 or [2620:fe::10]")
    $("#txtAddEditRecordDataForwarder").val("");
    $("#chkAddEditRecordDataForwarderDnssecValidation").prop("checked", false);
    $("#rdAddEditRecordDataForwarderProxyTypeNone").prop("checked", true);
    $("#txtAddEditRecordDataForwarderProxyAddress").prop("disabled", true);
    $("#txtAddEditRecordDataForwarderProxyPort").prop("disabled", true);
    $("#txtAddEditRecordDataForwarderProxyUsername").prop("disabled", true);
    $("#txtAddEditRecordDataForwarderProxyPassword").prop("disabled", true);
    $("#txtAddEditRecordDataForwarderProxyAddress").val("");
    $("#txtAddEditRecordDataForwarderProxyPort").val("");
    $("#txtAddEditRecordDataForwarderProxyUsername").val("");
    $("#txtAddEditRecordDataForwarderProxyPassword").val("");

    $("#divAddEditRecordDataApplication").hide();
    $("#optAddEditRecordDataAppName").html("");
    $("#optAddEditRecordDataAppName").attr('disabled', false);
    $("#optAddEditRecordDataClassPath").html("");
    $("#optAddEditRecordDataClassPath").attr('disabled', false);
    $("#txtAddEditRecordDataData").val("");

    $("#divAddEditRecordOverwrite").show();
    $("#chkAddEditRecordOverwrite").prop("checked", false);

    $("#txtAddEditRecordComments").val("");

    $("#btnAddEditRecord").button("reset");
}

function showAddRecordModal(objBtn) {
    var zoneType = $("#titleEditZoneType").text();
    if (zoneType === "Primary") {
        var btn = $(objBtn);

        btn.button('loading');

        HTTPRequest({
            url: "/api/apps/list?token=" + token,
            success: function (responseJSON) {
                btn.button('reset');

                showAddRecordModalNow(responseJSON.response.apps);
            },
            error: function () {
                btn.button('reset');
            },
            invalidToken: function () {
                showPageLogin();
            }
        });
    }
    else {
        showAddRecordModalNow(null);
    }
}

var appsList;

function showAddRecordModalNow(apps) {
    var zone = $("#titleEditZone").text();

    clearAddEditForm();

    $("#titleAddEditRecord").text("Add Record");
    $("#lblAddEditRecordZoneName").text(zone === "." ? "" : zone);
    $("#optEditRecordTypeSoa").hide();
    $("#btnAddEditRecord").attr("onclick", "addRecord(); return false;");

    appsList = apps;
    if (apps != null) {
        var optApps = "<option></option>";
        var optClassPaths = "<option></option>";

        for (var i = 0; i < apps.length; i++) {
            for (var j = 0; j < apps[i].dnsApps.length; j++) {
                if (apps[i].dnsApps[j].isAppRecordRequestHandler) {
                    optApps += "<option>" + apps[i].name + "</option>";
                    break;
                }
            }
        }

        $("#optAddEditRecordDataAppName").html(optApps);
        $("#optAddEditRecordDataClassPath").html(optClassPaths);
        $("#txtAddEditRecordDataData").val("");
    }

    $("#modalAddEditRecord").modal("show");

    setTimeout(function () {
        $("#txtAddEditRecordName").focus();
    }, 1000);
}

function modifyAddRecordFormByType() {
    $("#divAddEditRecordAlert").html("");

    $("#txtAddEditRecordName").prop("placeholder", "@");
    $("#divAddEditRecordTtl").show();

    var type = $("#optAddEditRecordType").val();

    $("#divAddEditRecordData").hide();
    $("#divAddEditRecordDataPtr").hide();
    $("#divAddEditRecordDataNs").hide();
    $("#divEditRecordDataSoa").hide();
    $("#divAddEditRecordDataMx").hide();
    $("#divAddEditRecordDataSrv").hide();
    $("#divAddEditRecordDataCaa").hide();
    $("#divAddEditRecordDataForwarder").hide();
    $("#divAddEditRecordDataApplication").hide();

    switch (type) {
        case "A":
            $("#lblAddEditRecordDataValue").text("IPv4 Address");
            $("#txtAddEditRecordDataValue").val("");
            $("#chkAddEditRecordDataPtr").prop("checked", false);
            $("#chkAddEditRecordDataCreatePtrZone").prop('disabled', true);
            $("#chkAddEditRecordDataCreatePtrZone").prop("checked", false);
            $("#chkAddEditRecordDataPtrLabel").text("Add reverse (PTR) record");
            $("#divAddEditRecordData").show();
            $("#divAddEditRecordDataPtr").show();
            break;

        case "AAAA":
            $("#lblAddEditRecordDataValue").text("IPv6 Address");
            $("#txtAddEditRecordDataValue").val("");
            $("#chkAddEditRecordDataPtr").prop("checked", false);
            $("#chkAddEditRecordDataCreatePtrZone").prop('disabled', true);
            $("#chkAddEditRecordDataCreatePtrZone").prop("checked", false);
            $("#chkAddEditRecordDataPtrLabel").text("Add reverse (PTR) record");
            $("#divAddEditRecordData").show();
            $("#divAddEditRecordDataPtr").show();
            break;

        case "NS":
            $("#txtAddEditRecordDataNsNameServer").val("");
            $("#txtAddEditRecordDataNsGlue").val("");
            $("#divAddEditRecordDataNs").show();
            break;

        case "SOA":
            $("#txtEditRecordDataSoaPrimaryNameServer").val("");
            $("#txtEditRecordDataSoaResponsiblePerson").val("");
            $("#txtEditRecordDataSoaSerial").val("");
            $("#txtEditRecordDataSoaRefresh").val("");
            $("#txtEditRecordDataSoaRetry").val("");
            $("#txtEditRecordDataSoaExpire").val("");
            $("#txtEditRecordDataSoaMinimum").val("");
            $("#txtEditRecordDataSoaPrimaryAddresses").val("");
            $("#rdEditRecordDataSoaZoneTransferProtocolTcp").prop("checked", true);
            $("#optEditRecordDataSoaTsigKeyName").val("");
            $("#divEditRecordDataSoa").show();
            break;

        case "PTR":
        case "CNAME":
        case "DNAME":
        case "ANAME":
            $("#lblAddEditRecordDataValue").text("Domain Name");
            $("#txtAddEditRecordDataValue").val("");
            $("#divAddEditRecordData").show();
            break;

        case "MX":
            $("#txtAddEditRecordDataMxPreference").val("");
            $("#txtAddEditRecordDataMxExchange").val("");
            $("#divAddEditRecordDataMx").show();
            break;

        case "TXT":
            $("#lblAddEditRecordDataValue").text("Text Data");
            $("#txtAddEditRecordDataValue").val("");
            $("#divAddEditRecordData").show();
            break;

        case "SRV":
            $("#txtAddEditRecordName").prop("placeholder", "_service._protocol.name");
            $("#txtAddEditRecordDataSrvPriority").val("");
            $("#txtAddEditRecordDataSrvWeight").val("");
            $("#txtAddEditRecordDataSrvPort").val("");
            $("#txtAddEditRecordDataSrvTarget").val("");
            $("#divAddEditRecordDataSrv").show();
            break;

        case "CAA":
            $("#txtAddEditRecordDataCaaFlags").val("");
            $("#txtAddEditRecordDataCaaTag").val("");
            $("#txtAddEditRecordDataCaaValue").val("");
            $("#divAddEditRecordDataCaa").show();
            break;

        case "FWD":
            $("#divAddEditRecordTtl").hide();
            $("input[name=rdAddEditRecordDataForwarderProtocol]:radio").attr("disabled", false);
            $("#rdAddEditRecordDataForwarderProtocolUdp").prop("checked", true);
            $("#chkAddEditRecordDataForwarderThisServer").prop("disabled", false);
            $("#chkAddEditRecordDataForwarderThisServer").prop("checked", false);
            $('#txtAddEditRecordDataForwarder').prop('disabled', false);
            $("#txtAddEditRecordDataForwarder").val("");
            $("#chkAddEditRecordDataForwarderDnssecValidation").prop("checked", false);
            $("#rdAddEditRecordDataForwarderProxyTypeNone").prop("checked", true);
            $("#txtAddEditRecordDataForwarderProxyAddress").prop("disabled", true);
            $("#txtAddEditRecordDataForwarderProxyPort").prop("disabled", true);
            $("#txtAddEditRecordDataForwarderProxyUsername").prop("disabled", true);
            $("#txtAddEditRecordDataForwarderProxyPassword").prop("disabled", true);
            $("#txtAddEditRecordDataForwarderProxyAddress").val("");
            $("#txtAddEditRecordDataForwarderProxyPort").val("");
            $("#txtAddEditRecordDataForwarderProxyUsername").val("");
            $("#txtAddEditRecordDataForwarderProxyPassword").val("");
            $("#divAddEditRecordDataForwarder").show();
            break;

        case "APP":
            $("#optAddEditRecordDataAppName").val("");
            $("#optAddEditRecordDataClassPath").val("");
            $("#txtAddEditRecordDataData").val("");
            $("#divAddEditRecordDataApplication").show();
            break;
    }
}

function addRecord() {
    var btn = $("#btnAddEditRecord");
    var divAddEditRecordAlert = $("#divAddEditRecordAlert");

    var zone = $("#titleEditZone").text();

    var domain;
    {
        var subDomain = $("#txtAddEditRecordName").val();
        if (subDomain === "")
            subDomain = "@";

        if (subDomain === "@")
            domain = zone;
        else if (zone === ".")
            domain = subDomain + ".";
        else
            domain = subDomain + "." + zone;
    }

    var type = $("#optAddEditRecordType").val();

    var ttl = $("#txtAddEditRecordTtl").val();
    var overwrite = $("#chkAddEditRecordOverwrite").prop("checked");
    var comments = $("#txtAddEditRecordComments").val();

    var apiUrl = "/api/zone/addRecord?token=" + token + "&zone=" + encodeURIComponent(zone) + "&domain=" + encodeURIComponent(domain) + "&type=" + type + "&ttl=" + ttl + "&overwrite=" + overwrite + "&comments=" + encodeURIComponent(comments);

    switch (type) {
        case "A":
        case "AAAA":
            var value = $("#txtAddEditRecordDataValue").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter an IP address to add the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&value=" + encodeURIComponent(value) + "&ptr=" + $("#chkAddEditRecordDataPtr").prop('checked') + "&createPtrZone=" + $("#chkAddEditRecordDataCreatePtrZone").prop('checked');
            break;

        case "PTR":
        case "TXT":
        case "ANAME":
            var value = $("#txtAddEditRecordDataValue").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a suitable value to add the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&value=" + encodeURIComponent(value);
            break;

        case "CNAME":
            var subDomainName = $("#txtAddEditRecordName").val();
            if ((subDomainName === "") || (subDomainName === "@")) {
                showAlert("warning", "Missing!", "Please enter a name for the CNAME record.", divAddEditRecordAlert);
                $("#txtAddEditRecordName").focus();
                return;
            }

            var value = $("#txtAddEditRecordDataValue").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a domain name to add the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&value=" + encodeURIComponent(value);
            break;

        case "NS":
            var value = $("#txtAddEditRecordDataNsNameServer").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a name server to add the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataNsNameServer").focus();
                return;
            }

            var glue = cleanTextList($("#txtAddEditRecordDataNsGlue").val());

            apiUrl += "&value=" + encodeURIComponent(value) + "&glue=" + encodeURIComponent(glue);
            break;

        case "MX":
            var preference = $("#txtAddEditRecordDataMxPreference").val();
            if (preference === "")
                preference = 1;

            var value = $("#txtAddEditRecordDataMxExchange").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a mail exchange domain name to add the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataMxExchange").focus();
                return;
            }

            apiUrl += "&preference=" + preference + "&value=" + encodeURIComponent(value);
            break;

        case "SRV":
            if ($("#txtAddEditRecordName").val() === "") {
                showAlert("warning", "Missing!", "Please enter a name that includes service and protocol labels.", divAddEditRecordAlert);
                $("#txtAddEditRecordName").focus();
                return;
            }

            var priority = $("#txtAddEditRecordDataSrvPriority").val();
            if (priority === "") {
                showAlert("warning", "Missing!", "Please enter a suitable priority.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvPriority").focus();
                return;
            }

            var weight = $("#txtAddEditRecordDataSrvWeight").val();
            if (weight === "") {
                showAlert("warning", "Missing!", "Please enter a suitable weight.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvWeight").focus();
                return;
            }

            var port = $("#txtAddEditRecordDataSrvPort").val();
            if (port === "") {
                showAlert("warning", "Missing!", "Please enter a suitable port number.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvPort").focus();
                return;
            }

            var value = $("#txtAddEditRecordDataSrvTarget").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a suitable value into the target field.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvTarget").focus();
                return;
            }

            apiUrl += "&priority=" + priority + "&weight=" + weight + "&port=" + port + "&value=" + encodeURIComponent(value);
            break;

        case "DNAME":
            var value = $("#txtAddEditRecordDataValue").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a domain name to add the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&value=" + encodeURIComponent(value);
            break;

        case "CAA":
            var flags = $("#txtAddEditRecordDataCaaFlags").val();
            if (flags === "")
                flags = 0;

            var tag = $("#txtAddEditRecordDataCaaTag").val();
            if (tag === "")
                tag = "issue";

            var value = $("#txtAddEditRecordDataCaaValue").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a suitable value into the authority field.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataCaaValue").focus();
                return;
            }

            apiUrl += "&flags=" + flags + "&tag=" + encodeURIComponent(tag) + "&value=" + encodeURIComponent(value);
            break;

        case "FWD":
            var value = $("#txtAddEditRecordDataForwarder").val();
            if (value === "") {
                showAlert("warning", "Missing!", "Please enter a domain name or IP address or URL as a forwarder to add the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataForwarder").focus();
                return;
            }

            var dnssecValidation = $("#chkAddEditRecordDataForwarderDnssecValidation").prop("checked");
            var proxyType = $("input[name=rdAddEditRecordDataForwarderProxyType]:checked").val();

            apiUrl += "&protocol=" + $('input[name=rdAddEditRecordDataForwarderProtocol]:checked').val() + "&value=" + value;
            apiUrl += "&dnssecValidation=" + dnssecValidation + "&proxyType=" + proxyType;

            if (proxyType != "None") {
                var proxyAddress = $("#txtAddEditRecordDataForwarderProxyAddress").val();
                var proxyPort = $("#txtAddEditRecordDataForwarderProxyPort").val();
                var proxyUsername = $("#txtAddEditRecordDataForwarderProxyUsername").val();
                var proxyPassword = $("#txtAddEditRecordDataForwarderProxyPassword").val();

                if ((proxyAddress == null) || (proxyAddress === "")) {
                    showAlert("warning", "Missing!", "Please enter a domain name or IP address for Proxy Server Address to add the record.", divAddEditRecordAlert);
                    $("#txtAddEditRecordDataForwarderProxyAddress").focus();
                    return;
                }

                if ((proxyPort == null) || (proxyPort === "")) {
                    showAlert("warning", "Missing!", "Please enter a port number for Proxy Server Port to add the record.", divAddEditRecordAlert);
                    $("#txtAddEditRecordDataForwarderProxyPort").focus();
                    return;
                }

                apiUrl += "&proxyAddress=" + encodeURIComponent(proxyAddress) + "&proxyPort=" + proxyPort + "&proxyUsername=" + encodeURIComponent(proxyUsername) + "&proxyPassword=" + encodeURIComponent(proxyPassword);
            }
            break;

        case "APP":
            var appName = $("#optAddEditRecordDataAppName").val();

            if ((appName === null) || (appName === "")) {
                showAlert("warning", "Missing!", "Please select an application name to add record.", divAddEditRecordAlert);
                $("#optAddEditRecordDataAppName").focus();
                return;
            }

            var classPath = $("#optAddEditRecordDataClassPath").val();

            if ((classPath === null) || (classPath === "")) {
                showAlert("warning", "Missing!", "Please select a class path to add record.", divAddEditRecordAlert);
                $("#optAddEditRecordDataClassPath").focus();
                return;
            }

            var recordData = $("#txtAddEditRecordDataData").val();

            apiUrl += "&value=" + encodeURIComponent(appName) + "&classPath=" + encodeURIComponent(classPath) + "&recordData=" + encodeURIComponent(recordData);
            break;
    }

    btn.button("loading");

    HTTPRequest({
        url: apiUrl,
        success: function (responseJSON) {
            $("#modalAddEditRecord").modal("hide");
            showEditZone(zone);
            showAlert("success", "Record Added!", "Resource record was added successfully.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        },
        objAlertPlaceholder: divAddEditRecordAlert
    });
}

function updateAddEditFormForwarderPlaceholder() {
    var protocol = $('input[name=rdAddEditRecordDataForwarderProtocol]:checked').val();
    switch (protocol) {
        case "Udp":
        case "Tcp":
            $("#txtAddEditRecordDataForwarder").attr("placeholder", "8.8.8.8 or [2620:fe::10]")
            break;

        case "Tls":
            $("#txtAddEditRecordDataForwarder").attr("placeholder", "dns.quad9.net (9.9.9.9:853)")
            break;

        case "Https":
        case "HttpsJson":
            $("#txtAddEditRecordDataForwarder").attr("placeholder", "https://cloudflare-dns.com/dns-query (1.1.1.1)")
            break;
    }
}

function updateAddEditFormForwarderProxyType() {
    var proxyType = $('input[name=rdAddEditRecordDataForwarderProxyType]:checked').val();

    $("#txtAddEditRecordDataForwarderProxyAddress").prop("disabled", (proxyType === "None"));
    $("#txtAddEditRecordDataForwarderProxyPort").prop("disabled", (proxyType === "None"));
    $("#txtAddEditRecordDataForwarderProxyUsername").prop("disabled", (proxyType === "None"));
    $("#txtAddEditRecordDataForwarderProxyPassword").prop("disabled", (proxyType === "None"));
}

function updateAddEditFormForwarderThisServer() {
    var useThisServer = $("#chkAddEditRecordDataForwarderThisServer").prop('checked');
    var isEditMode = $("#optAddEditRecordType").prop("disabled");

    if (useThisServer) {
        if (!isEditMode) {
            $("input[name=rdAddEditRecordDataForwarderProtocol]:radio").attr("disabled", true);
            $("#rdAddEditRecordDataForwarderProtocolUdp").prop("checked", true);
            $("#txtAddEditRecordDataForwarder").attr("placeholder", "8.8.8.8 or [2620:fe::10]")
        }

        $("#txtAddEditRecordDataForwarder").prop("disabled", true);
        $("#txtAddEditRecordDataForwarder").val("this-server");
    }
    else {
        if (!isEditMode)
            $("input[name=rdAddEditRecordDataForwarderProtocol]:radio").attr("disabled", false);

        $("#txtAddEditRecordDataForwarder").prop("disabled", false);
        $("#txtAddEditRecordDataForwarder").val("");
    }
}

function showEditRecordModal(objBtn) {
    var btn = $(objBtn);
    var id = btn.attr("data-id");
    var divData = $("#data" + id);

    var zone = $("#titleEditZone").text();
    var name = divData.attr("data-record-name");
    var type = divData.attr("data-record-type");
    var ttl = divData.attr("data-record-ttl");
    var comments = divData.attr("data-record-comments");

    if (name === zone)
        name = "@";
    else
        name = name.replace("." + zone, "");

    clearAddEditForm();
    $("#titleAddEditRecord").text("Edit Record");
    $("#lblAddEditRecordZoneName").text(zone === "." ? "" : zone);
    $("#optEditRecordTypeSoa").show();
    $("#optAddEditRecordType").val(type);
    $("#divAddEditRecordOverwrite").hide();
    modifyAddRecordFormByType();

    $("#txtAddEditRecordName").val(name);
    $("#txtAddEditRecordTtl").val(ttl)
    $("#txtAddEditRecordComments").val(comments);

    var disableSoaRecordModalFields = false;
    var hideSoaRecordPrimaryAddressesField = false;
    var hideSoaRecordXfrAndTsigFields = false;

    var zoneType = $("#titleEditZoneType").text();
    switch (zoneType) {
        case "Primary":
            switch (type) {
                case "SOA":
                    hideSoaRecordPrimaryAddressesField = true;
                    hideSoaRecordXfrAndTsigFields = true;
                    break;
            }
            break;

        case "Secondary":
            switch (type) {
                case "SOA":
                    disableSoaRecordModalFields = true;
                    break;
            }
            break;

        case "Stub":
            switch (type) {
                case "SOA":
                    disableSoaRecordModalFields = true;
                    hideSoaRecordXfrAndTsigFields = true;
                    break;
            }
            break;
    }

    switch (type) {
        case "A":
        case "AAAA":
            $("#txtAddEditRecordDataValue").val(divData.attr("data-record-value"));
            $("#chkAddEditRecordDataPtr").prop("checked", false);
            $("#chkAddEditRecordDataCreatePtrZone").prop('disabled', true);
            $("#chkAddEditRecordDataCreatePtrZone").prop("checked", false);
            $("#chkAddEditRecordDataPtrLabel").text("Update reverse (PTR) record");
            break;

        case "CNAME":
        case "DNAME":
        case "PTR":
        case "TXT":
        case "ANAME":
            $("#txtAddEditRecordDataValue").val(divData.attr("data-record-value"));
            break;

        case "NS":
            $("#txtAddEditRecordDataNsNameServer").val(divData.attr("data-record-value"));
            $("#txtAddEditRecordDataNsGlue").val(divData.attr("data-record-glue").replace(/, /g, "\n"));
            break;

        case "SOA":
            $("#txtEditRecordDataSoaPrimaryNameServer").val(divData.attr("data-record-pname"));
            $("#txtEditRecordDataSoaResponsiblePerson").val(divData.attr("data-record-rperson"));
            $("#txtEditRecordDataSoaSerial").val(divData.attr("data-record-serial"));
            $("#txtEditRecordDataSoaRefresh").val(divData.attr("data-record-refresh"));
            $("#txtEditRecordDataSoaRetry").val(divData.attr("data-record-retry"));
            $("#txtEditRecordDataSoaExpire").val(divData.attr("data-record-expire"));
            $("#txtEditRecordDataSoaMinimum").val(divData.attr("data-record-minimum"));
            $("#txtEditRecordDataSoaPrimaryAddresses").val(divData.attr("data-record-paddresses").replace(/, /g, "\n"));

            switch (divData.attr("data-record-zonetransferprotocol").toLowerCase()) {
                case "tls":
                    $("#rdEditRecordDataSoaZoneTransferProtocolTls").prop("checked", true);
                    break;

                case "tcp":
                default:
                    $("#rdEditRecordDataSoaZoneTransferProtocolTcp").prop("checked", true);
                    break;
            }

            $("#optEditRecordDataSoaTsigKeyName").val(divData.attr("data-record-tsigkeyname"));

            $("#txtAddEditRecordName").prop("disabled", true);

            if (disableSoaRecordModalFields) {
                $("#txtAddEditRecordTtl").prop("disabled", true);

                $("#txtEditRecordDataSoaPrimaryNameServer").prop("disabled", true);
                $("#txtEditRecordDataSoaResponsiblePerson").prop("disabled", true);
                $("#txtEditRecordDataSoaSerial").prop("disabled", true);
                $("#txtEditRecordDataSoaRefresh").prop("disabled", true);
                $("#txtEditRecordDataSoaRetry").prop("disabled", true);
                $("#txtEditRecordDataSoaExpire").prop("disabled", true);
                $("#txtEditRecordDataSoaMinimum").prop("disabled", true);
            }

            if (hideSoaRecordPrimaryAddressesField) {
                $("#divEditRecordDataSoaPrimaryAddresses").hide();
            } else {
                $("#divEditRecordDataSoaPrimaryAddresses").show();
            }

            if (hideSoaRecordXfrAndTsigFields) {
                $("#divEditRecordDataSoaZoneTransferProtocol").hide();
                $("#divEditRecordDataSoaTsigKeyName").hide();
            } else {
                $("#divEditRecordDataSoaZoneTransferProtocol").show();
                $("#divEditRecordDataSoaTsigKeyName").show();
            }

            break;

        case "MX":
            $("#txtAddEditRecordDataMxPreference").val(divData.attr("data-record-preference"));
            $("#txtAddEditRecordDataMxExchange").val(divData.attr("data-record-value"));
            break;

        case "SRV":
            $("#txtAddEditRecordDataSrvPriority").val(divData.attr("data-record-priority"));
            $("#txtAddEditRecordDataSrvWeight").val(divData.attr("data-record-weight"));
            $("#txtAddEditRecordDataSrvPort").val(divData.attr("data-record-port"));
            $("#txtAddEditRecordDataSrvTarget").val(divData.attr("data-record-value"));
            break;

        case "CAA":
            $("#txtAddEditRecordDataCaaFlags").val(divData.attr("data-record-flags"));
            $("#txtAddEditRecordDataCaaTag").val(divData.attr("data-record-tag"));
            $("#txtAddEditRecordDataCaaValue").val(divData.attr("data-record-value"));
            break;

        case "FWD":
            $("#divAddEditRecordTtl").hide();
            $("input[name=rdAddEditRecordDataForwarderProtocol]:radio").attr('disabled', true);
            $("#rdAddEditRecordDataForwarderProtocol" + divData.attr("data-record-protocol")).prop("checked", true);

            var forwarder = divData.attr("data-record-value");

            $("#chkAddEditRecordDataForwarderThisServer").prop("disabled", !$("#rdAddEditRecordDataForwarderProtocolUdp").prop("checked"));
            $("#chkAddEditRecordDataForwarderThisServer").prop("checked", (forwarder == "this-server"));
            $("#txtAddEditRecordDataForwarder").prop("disabled", (forwarder == "this-server"));
            $("#txtAddEditRecordDataForwarder").val(forwarder);

            $("#chkAddEditRecordDataForwarderDnssecValidation").prop("checked", divData.attr("data-record-dnssec-validation") === "true");

            var proxyType = divData.attr("data-record-proxy-type");
            $("#rdAddEditRecordDataForwarderProxyType" + proxyType).prop("checked", true);

            if (proxyType !== "None") {
                $("#txtAddEditRecordDataForwarderProxyAddress").val(divData.attr("data-record-proxy-address"));
                $("#txtAddEditRecordDataForwarderProxyPort").val(divData.attr("data-record-proxy-port"));
                $("#txtAddEditRecordDataForwarderProxyUsername").val(divData.attr("data-record-proxy-username"));
                $("#txtAddEditRecordDataForwarderProxyPassword").val(divData.attr("data-record-proxy-password"));
            }

            updateAddEditFormForwarderPlaceholder();
            updateAddEditFormForwarderProxyType();
            break;

        case "APP":
            $("#optAddEditRecordDataAppName").attr("disabled", true);
            $("#optAddEditRecordDataClassPath").attr("disabled", true);

            $("#optAddEditRecordDataAppName").html("<option>" + divData.attr("data-record-value") + "</option>")
            $("#optAddEditRecordDataAppName").val(divData.attr("data-record-value"))

            $("#optAddEditRecordDataClassPath").html("<option>" + divData.attr("data-record-classpath") + "</option>")
            $("#optAddEditRecordDataClassPath").val(divData.attr("data-record-classpath"))

            $("#txtAddEditRecordDataData").val(divData.attr("data-record-data"))
            break;

        default:
            showAlert("warning", "Not Supported!", "Record type not supported for edit.");
            return;
    }

    $("#optAddEditRecordType").prop("disabled", true);

    $("#btnAddEditRecord").attr("data-id", id);
    $("#btnAddEditRecord").attr("onclick", "updateRecord(); return false;");

    $("#modalAddEditRecord").modal("show");

    setTimeout(function () {
        $("#txtAddEditRecordName").focus();
    }, 1000);
}

function updateRecord() {
    var btn = $("#btnAddEditRecord");
    var divAddEditRecordAlert = $("#divAddEditRecordAlert");

    var id = btn.attr("data-id");
    var divData = $("#data" + id);

    var zone = $("#titleEditZone").text();
    var type = divData.attr("data-record-type");
    var domain = divData.attr("data-record-name");

    if (domain === "")
        domain = ".";

    var newDomain;
    {
        var newSubDomain = $("#txtAddEditRecordName").val();
        if (newSubDomain === "")
            newSubDomain = "@";

        if (newSubDomain === "@")
            newDomain = zone;
        else if (zone === ".")
            newDomain = newSubDomain + ".";
        else
            newDomain = newSubDomain + "." + zone;
    }

    var ttl = $("#txtAddEditRecordTtl").val();
    var value = divData.attr("data-record-value");
    var disable = (divData.attr("data-record-disabled") === "true");
    var comments = $("#txtAddEditRecordComments").val();

    var apiUrl = "/api/zone/updateRecord?token=" + token + "&zone=" + encodeURIComponent(zone) + "&type=" + type + "&domain=" + encodeURIComponent(domain) + "&newDomain=" + encodeURIComponent(newDomain) + "&ttl=" + ttl + "&value=" + encodeURIComponent(value) + "&disable=" + disable + "&comments=" + encodeURIComponent(comments);

    switch (type) {
        case "A":
        case "AAAA":
            var newValue = $("#txtAddEditRecordDataValue").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter an IP address to update the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&newValue=" + encodeURIComponent(newValue) + "&ptr=" + $("#chkAddEditRecordDataPtr").prop('checked') + "&createPtrZone=" + $("#chkAddEditRecordDataCreatePtrZone").prop('checked');
            break;

        case "PTR":
        case "TXT":
        case "ANAME":
            var newValue = $("#txtAddEditRecordDataValue").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a suitable value to update the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&newValue=" + encodeURIComponent(newValue);
            break;

        case "CNAME":
            var subDomainName = $("#txtAddEditRecordName").val();
            if ((subDomainName === "") || (subDomainName === "@")) {
                showAlert("warning", "Missing!", "Please enter a name for the CNAME record.", divAddEditRecordAlert);
                $("#txtAddEditRecordName").focus();
                return;
            }

            var newValue = $("#txtAddEditRecordDataValue").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a domain name to update the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&newValue=" + encodeURIComponent(newValue);
            break;

        case "NS":
            var newValue = $("#txtAddEditRecordDataNsNameServer").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a name server to update the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataNsNameServer").focus();
                return;
            }

            var glue = cleanTextList($("#txtAddEditRecordDataNsGlue").val());

            apiUrl += "&newValue=" + encodeURIComponent(newValue) + "&glue=" + encodeURIComponent(glue);
            break;

        case "SOA":
            var primaryNameServer = $("#txtEditRecordDataSoaPrimaryNameServer").val();
            if (primaryNameServer === "") {
                showAlert("warning", "Missing!", "Please enter a value for primary name server.", divAddEditRecordAlert);
                $("#txtEditRecordDataSoaPrimaryNameServer").focus();
                return;
            }

            var responsiblePerson = $("#txtEditRecordDataSoaResponsiblePerson").val();
            if (responsiblePerson === "") {
                showAlert("warning", "Missing!", "Please enter a value for responsible person.", divAddEditRecordAlert);
                $("#txtEditRecordDataSoaResponsiblePerson").focus();
                return;
            }

            var serial = $("#txtEditRecordDataSoaSerial").val();
            if (serial === "") {
                showAlert("warning", "Missing!", "Please enter a value for serial.", divAddEditRecordAlert);
                $("#txtEditRecordDataSoaSerial").focus();
                return;
            }

            var refresh = $("#txtEditRecordDataSoaRefresh").val();
            if (refresh === "") {
                showAlert("warning", "Missing!", "Please enter a value for refresh.", divAddEditRecordAlert);
                $("#txtEditRecordDataSoaRefresh").focus();
                return;
            }

            var retry = $("#txtEditRecordDataSoaRetry").val();
            if (retry === "") {
                showAlert("warning", "Missing!", "Please enter a value for retry.", divAddEditRecordAlert);
                $("#txtEditRecordDataSoaRetry").focus();
                return;
            }

            var expire = $("#txtEditRecordDataSoaExpire").val();
            if (expire === "") {
                showAlert("warning", "Missing!", "Please enter a value for expire.", divAddEditRecordAlert);
                $("#txtEditRecordDataSoaExpire").focus();
                return;
            }

            var minimum = $("#txtEditRecordDataSoaMinimum").val();
            if (minimum === "") {
                showAlert("warning", "Missing!", "Please enter a value for minimum.", divAddEditRecordAlert);
                $("#txtEditRecordDataSoaMinimum").focus();
                return;
            }

            var primaryAddresses = cleanTextList($("#txtEditRecordDataSoaPrimaryAddresses").val());
            var zoneTransferProtocol = $('input[name=rdEditRecordDataSoaZoneTransferProtocol]:checked').val();
            var tsigKeyName = $("#optEditRecordDataSoaTsigKeyName").val();

            apiUrl += "&primaryNameServer=" + encodeURIComponent(primaryNameServer) +
                "&responsiblePerson=" + encodeURIComponent(responsiblePerson) +
                "&serial=" + encodeURIComponent(serial) +
                "&refresh=" + encodeURIComponent(refresh) +
                "&retry=" + encodeURIComponent(retry) +
                "&expire=" + encodeURIComponent(expire) +
                "&minimum=" + encodeURIComponent(minimum) +
                "&primaryAddresses=" + encodeURIComponent(primaryAddresses) +
                "&zoneTransferProtocol=" + encodeURIComponent(zoneTransferProtocol) +
                "&tsigKeyName=" + encodeURIComponent(tsigKeyName);

            break;

        case "MX":
            var preference = $("#txtAddEditRecordDataMxPreference").val();
            if (preference === "")
                preference = 1;

            var newValue = $("#txtAddEditRecordDataMxExchange").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a mail exchange domain name to update the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataMxExchange").focus();
                return;
            }

            apiUrl += "&preference=" + preference + "&newValue=" + encodeURIComponent(newValue);
            break;

        case "SRV":
            if ($("#txtAddEditRecordName").val() === "") {
                showAlert("warning", "Missing!", "Please enter a name that includes service and protocol labels.", divAddEditRecordAlert);
                $("#txtAddEditRecordName").focus();
                return;
            }

            var port = divData.attr("data-record-port");

            var priority = $("#txtAddEditRecordDataSrvPriority").val();
            if (priority === "") {
                showAlert("warning", "Missing!", "Please enter a suitable priority.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvPriority").focus();
                return;
            }

            var weight = $("#txtAddEditRecordDataSrvWeight").val();
            if (weight === "") {
                showAlert("warning", "Missing!", "Please enter a suitable weight.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvWeight").focus();
                return;
            }

            var newPort = $("#txtAddEditRecordDataSrvPort").val();
            if (newPort === "") {
                showAlert("warning", "Missing!", "Please enter a suitable port number.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvPort").focus();
                return;
            }

            var newValue = $("#txtAddEditRecordDataSrvTarget").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a suitable value into the target field.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataSrvTarget").focus();
                return;
            }

            apiUrl += "&port=" + port + "&priority=" + priority + "&weight=" + weight + "&newPort=" + newPort + "&newValue=" + encodeURIComponent(newValue);
            break;

        case "DNAME":
            var newValue = $("#txtAddEditRecordDataValue").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a domain name to update the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataValue").focus();
                return;
            }

            apiUrl += "&newValue=" + encodeURIComponent(newValue);
            break;

        case "CAA":
            var flags = divData.attr("data-record-flags");
            var tag = divData.attr("data-record-tag");

            var newFlags = $("#txtAddEditRecordDataCaaFlags").val();
            if (newFlags === "")
                newFlags = 0;

            var newTag = $("#txtAddEditRecordDataCaaTag").val();
            if (newTag === "")
                newTag = "issue";

            var newValue = $("#txtAddEditRecordDataCaaValue").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a suitable value into the authority field.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataCaaValue").focus();
                return;
            }

            apiUrl += "&flags=" + flags + "&tag=" + encodeURIComponent(tag) + "&newFlags=" + newFlags + "&newTag=" + encodeURIComponent(newTag) + "&newValue=" + encodeURIComponent(newValue);
            break;

        case "FWD":
            var newValue = $("#txtAddEditRecordDataForwarder").val();
            if (newValue === "") {
                showAlert("warning", "Missing!", "Please enter a domain name or IP address or URL as a forwarder to update the record.", divAddEditRecordAlert);
                $("#txtAddEditRecordDataForwarder").focus();
                return;
            }

            var dnssecValidation = $("#chkAddEditRecordDataForwarderDnssecValidation").prop("checked");
            var proxyType = $("input[name=rdAddEditRecordDataForwarderProxyType]:checked").val();

            apiUrl += "&protocol=" + $('input[name=rdAddEditRecordDataForwarderProtocol]:checked').val() + "&newValue=" + newValue;
            apiUrl += "&dnssecValidation=" + dnssecValidation + "&proxyType=" + proxyType;

            if (proxyType != "None") {
                var proxyAddress = $("#txtAddEditRecordDataForwarderProxyAddress").val();
                var proxyPort = $("#txtAddEditRecordDataForwarderProxyPort").val();
                var proxyUsername = $("#txtAddEditRecordDataForwarderProxyUsername").val();
                var proxyPassword = $("#txtAddEditRecordDataForwarderProxyPassword").val();

                if ((proxyAddress == null) || (proxyAddress === "")) {
                    showAlert("warning", "Missing!", "Please enter a domain name or IP address for Proxy Server Address to update the record.", divAddEditRecordAlert);
                    $("#txtAddEditRecordDataForwarderProxyAddress").focus();
                    return;
                }

                if ((proxyPort == null) || (proxyPort === "")) {
                    showAlert("warning", "Missing!", "Please enter a port number for Proxy Server Port to update the record.", divAddEditRecordAlert);
                    $("#txtAddEditRecordDataForwarderProxyPort").focus();
                    return;
                }

                apiUrl += "&proxyAddress=" + encodeURIComponent(proxyAddress) + "&proxyPort=" + proxyPort + "&proxyUsername=" + encodeURIComponent(proxyUsername) + "&proxyPassword=" + encodeURIComponent(proxyPassword);
            }
            break;

        case "APP":
            apiUrl += "&classPath=" + encodeURIComponent($("#optAddEditRecordDataClassPath").val()) + "&recordData=" + encodeURIComponent($("#txtAddEditRecordDataData").val());
            break;
    }

    btn.button('loading');

    HTTPRequest({
        url: apiUrl,
        success: function (responseJSON) {
            $("#modalAddEditRecord").modal("hide");
            showEditZone(zone);
            showAlert("success", "Record Updated!", "Resource record was updated successfully.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        },
        objAlertPlaceholder: divAddEditRecordAlert
    });
}

function updateRecordState(objBtn, disable) {
    var btn = $(objBtn);
    var id = btn.attr("data-id");
    var divData = $("#data" + id);

    var type = divData.attr("data-record-type");
    var domain = divData.attr("data-record-name");
    var ttl = divData.attr("data-record-ttl");
    var value = divData.attr("data-record-value");
    var comments = divData.attr("data-record-comments");

    if (domain === "")
        domain = ".";

    if (disable && !confirm("Are you sure to disable the " + type + " record '" + domain + "' with value '" + value + "'?"))
        return;

    var apiUrl = "/api/zone/updateRecord?token=" + token + "&type=" + type + "&domain=" + encodeURIComponent(domain) + "&ttl=" + ttl + "&value=" + encodeURIComponent(value) + "&disable=" + disable + "&comments=" + encodeURIComponent(comments);

    switch (type) {
        case "NS":
            apiUrl += "&glue=" + encodeURIComponent(divData.attr("data-record-glue"));
            break;

        case "MX":
            apiUrl += "&preference=" + divData.attr("data-record-preference");
            break;

        case "SRV":
            apiUrl += "&port=" + divData.attr("data-record-port") + "&priority=" + divData.attr("data-record-priority") + "&weight=" + divData.attr("data-record-weight");
            break;

        case "CAA":
            apiUrl += "&flags=" + divData.attr("data-record-flags") + "&tag=" + encodeURIComponent(divData.attr("data-record-tag"));
            break;

        case "FWD":
            apiUrl += "&protocol=" + divData.attr("data-record-protocol");
            break;

        case "APP":
            apiUrl += "&classPath=" + encodeURIComponent(divData.attr("data-record-classpath")) + "&recordData=" + encodeURIComponent(divData.attr("data-record-data"));
            break;
    }

    btn.button('loading');

    HTTPRequest({
        url: apiUrl,
        success: function (responseJSON) {
            btn.button('reset');

            //set new state
            divData.attr("data-record-disabled", disable);

            if (disable) {
                $("#btnEnableRecord" + id).show();
                $("#btnDisableRecord" + id).hide();

                showAlert("success", "Record Disabled!", "Resource record was disabled successfully.");
            }
            else {
                $("#btnEnableRecord" + id).hide();
                $("#btnDisableRecord" + id).show();

                showAlert("success", "Record Enabled!", "Resource record was enabled successfully.");
            }
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        }
    });
}

function deleteRecord(objBtn) {
    var btn = $(objBtn);
    var id = btn.attr("data-id");
    var divData = $("#data" + id);

    var zone = $("#titleEditZone").text();
    var domain = divData.attr("data-record-name");
    var type = divData.attr("data-record-type");
    var value = divData.attr("data-record-value");

    if (domain === "")
        domain = ".";

    if (!confirm("Are you sure to permanently delete the " + type + " record '" + domain + "' with value '" + value + "'?"))
        return;

    var apiUrl = "/api/zone/deleteRecord?token=" + token + "&zone=" + encodeURIComponent(zone) + "&domain=" + domain + "&type=" + type + "&value=" + encodeURIComponent(value);

    switch (type) {
        case "SRV":
            apiUrl += "&port=" + divData.attr("data-record-port");
            break;

        case "CAA":
            apiUrl += "&flags=" + divData.attr("data-record-flags") + "&tag=" + encodeURIComponent(divData.attr("data-record-tag"));
            break;

        case "FWD":
            apiUrl += "&protocol=" + divData.attr("data-record-protocol");
            break;
    }

    btn.button('loading');

    HTTPRequest({
        url: apiUrl,
        success: function (responseJSON) {
            $("#tr" + id).remove();
            $("#tableEditZoneFooter").html("<tr><td colspan=\"5\"><b>Total Records: " + $('#tableEditZone >tbody >tr').length + "</b></td></tr>");

            showAlert("success", "Record Deleted!", "Resource record was deleted successfully.");
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            showPageLogin();
        }
    });
}

function showSignZoneModal(zoneName) {
    $("#lblDnssecSignZoneZoneName").text(zoneName);
    $("#rdDnssecSignZoneAlgorithmEcdsa").prop("checked", true);

    $("#divDnssecSignZoneRsaParameters").hide();
    $("#optDnssecSignZoneRsaHashAlgorithm").val("SHA256");
    $("#optDnssecSignZoneRsaKSKKeySize").val("2048");
    $("#optDnssecSignZoneRsaZSKKeySize").val("1024");

    $("#divDnssecSignZoneEcdsaParameters").show();
    $("#optDnssecSignZoneEcdsaCurve").val("P256");

    $("#rdDnssecSignZoneNxProofNSEC").prop("checked", true);

    $("#divDnssecSignZoneNSEC3Parameters").hide();
    $("#txtDnssecSignZoneNSEC3Iterations").val("0");
    $("#txtDnssecSignZoneNSEC3SaltLength").val("0");

    $("#txtDnssecSignZoneDnsKeyTtl").val("86400");

    $("#modalDnssecSignZone").modal("show");
}

function signPrimaryZone() {
    var divDnssecSignZoneAlert = $("#divDnssecSignZoneAlert");
    var zone = $("#lblDnssecSignZoneZoneName").text();
    var algorithm = $("input[name=rdDnssecSignZoneAlgorithm]:checked").val();
    var dnsKeyTtl = $("#txtDnssecSignZoneDnsKeyTtl").val();
    var nxProof = $("input[name=rdDnssecSignZoneNxProof]:checked").val();

    var additionalParameters = "";

    if (nxProof === "NSEC3") {
        var iterations = $("#txtDnssecSignZoneNSEC3Iterations").val();
        var saltLength = $("#txtDnssecSignZoneNSEC3SaltLength").val();

        additionalParameters += "&iterations=" + iterations + "&saltLength=" + saltLength;
    }

    switch (algorithm) {
        case "RSA":
            var hashAlgorithm = $("#optDnssecSignZoneRsaHashAlgorithm").val();
            var kskKeySize = $("#optDnssecSignZoneRsaKSKKeySize").val();
            var zskKeySize = $("#optDnssecSignZoneRsaZSKKeySize").val();

            additionalParameters += "&hashAlgorithm=" + hashAlgorithm + "&kskKeySize=" + kskKeySize + "&zskKeySize=" + zskKeySize;
            break;

        case "ECDSA":
            var curve = $("#optDnssecSignZoneEcdsaCurve").val();

            additionalParameters += "&curve=" + curve;
            break;
    }

    var btn = $("#btnDnssecSignZone");
    btn.button("loading");

    HTTPRequest({
        url: "/api/zone/dnssec/sign?token=" + token + "&zone=" + encodeURIComponent(zone) + "&algorithm=" + algorithm + "&dnsKeyTtl=" + dnsKeyTtl + "&nxProof=" + nxProof + additionalParameters,
        success: function (responseJSON) {
            btn.button('reset');
            $("#modalDnssecSignZone").modal("hide");

            showEditZone(zone);
            showAlert("success", "Zone Signed!", "The primary zone was signed successfully.");
        },
        error: function () {
            btn.button("reset");
        },
        invalidToken: function () {
            btn.button("reset");
            $("#modalDnssecSignZone").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecSignZoneAlert
    });
}

function showUnsignZoneModal(zoneName) {
    $("#lblDnssecUnsignZoneZoneName").text(zoneName);

    $("#modalDnssecUnsignZone").modal("show");
}

function unsignPrimaryZone() {
    var divDnssecUnsignZoneAlert = $("#divDnssecUnsignZoneAlert");
    var zone = $("#lblDnssecUnsignZoneZoneName").text();

    var btn = $("#btnDnssecUnsignZone");
    btn.button("loading");

    HTTPRequest({
        url: "/api/zone/dnssec/unsign?token=" + token + "&zone=" + encodeURIComponent(zone),
        success: function (responseJSON) {
            btn.button('reset');
            $("#modalDnssecUnsignZone").modal("hide");

            showEditZone(zone);
            showAlert("success", "Zone Unsigned!", "The primary zone was unsigned successfully.");
        },
        error: function () {
            btn.button("reset");
        },
        invalidToken: function () {
            btn.button("reset");
            $("#modalDnssecUnsignZone").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecUnsignZoneAlert
    });
}

function showDnssecPropertiesModal(zoneName) {
    var divDnssecPropertiesLoader = $("#divDnssecPropertiesLoader");
    var divDnssecProperties = $("#divDnssecProperties");

    $("#lblDnssecPropertiesZoneName").text(zoneName);

    $("#divDnssecPropertiesGenerateKey").collapse("hide");
    $("#optDnssecPropertiedGenerateKeyKeyType").val("KeySigningKey");
    $("#divDnssecPropertiesGenerateKeyRsaParameters").hide();
    $("#optDnssecPropertiesGenerateKeyRsaHashAlgorithm").val("SHA256");
    $("#optDnssecPropertiesGenerateKeyRsaKeySize").val("1024");
    $("#divDnssecPropertiesGenerateKeyEcdsaParameters").show();
    $("#optDnssecPropertiedGenerateKeyAlgorithm").val("ECDSA");

    divDnssecPropertiesLoader.show();
    divDnssecProperties.hide();

    $("#modalDnssecProperties").modal("show");

    refreshDnssecProperties(divDnssecPropertiesLoader);
}

function refreshDnssecProperties(divDnssecPropertiesLoader) {
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");
    var zone = $("#lblDnssecPropertiesZoneName").text();

    HTTPRequest({
        url: "/api/zone/dnssec/getProperties?token=" + token + "&zone=" + zone,
        success: function (responseJSON) {
            var tableHtmlRows = "";

            for (var i = 0; i < responseJSON.response.dnssecPrivateKeys.length; i++) {
                var id = Math.floor(Math.random() * 10000);

                tableHtmlRows += "<tr id=\"trDnssecPropertiesPrivateKey" + id + "\">"
                    + "<td>" + responseJSON.response.dnssecPrivateKeys[i].keyTag + "</td>"
                    + "<td>" + responseJSON.response.dnssecPrivateKeys[i].keyType + "</td>"
                    + "<td>" + responseJSON.response.dnssecPrivateKeys[i].algorithm + "</td>"
                    + "<td>" + responseJSON.response.dnssecPrivateKeys[i].state + "</td>"
                    + "<td>" + moment(responseJSON.response.dnssecPrivateKeys[i].stateChangedOn).local().format("YYYY-MM-DD HH:mm") + "</td>"
                    + "<td align=\"right\">";

                switch (responseJSON.response.dnssecPrivateKeys[i].state) {
                    case "Generated":
                        tableHtmlRows += "<button type=\"button\" class=\"btn btn-danger\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" data-id=\"" + id + "\" data-loading-text=\"Deleting...\" onclick=\"deleteDnssecPrivateKey(" + responseJSON.response.dnssecPrivateKeys[i].keyTag + ", this);\">Delete</button>";
                        break;

                    case "Ready":
                    case "Active":
                        if (!responseJSON.response.dnssecPrivateKeys[i].isRetiring) {
                            tableHtmlRows += "<button type=\"button\" class=\"btn btn-warning\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" data-loading-text=\"Rolling...\" onclick=\"rolloverDnssecDnsKey(" + responseJSON.response.dnssecPrivateKeys[i].keyTag + ", this);\">Rollover</button>";
                            tableHtmlRows += "<button type=\"button\" class=\"btn btn-warning\" style=\"font-size: 12px; padding: 2px 0px; width: 60px; margin: 0 6px 0 0;\" data-loading-text=\"Retiring...\" onclick=\"retireDnssecDnsKey(" + responseJSON.response.dnssecPrivateKeys[i].keyTag + ", this);\">Retire</button>";
                        }
                        break;
                }

                tableHtmlRows += "</td></tr>";
            }

            $("#tableDnssecPropertiesPrivateKeysBody").html(tableHtmlRows);

            switch (responseJSON.response.dnssecStatus) {
                case "SignedWithNSEC":
                    $("#rdDnssecPropertiesNxProofNSEC").prop("checked", true);

                    $("#divDnssecPropertiesNSEC3Parameters").hide();
                    $("#txtDnssecPropertiesNSEC3Iterations").val(0);
                    $("#txtDnssecPropertiesNSEC3SaltLength").val(0);

                    $("#btnDnssecPropertiesChangeNxProof").attr("data-nx-proof", "NSEC");
                    break;

                case "SignedWithNSEC3":
                    $("#rdDnssecPropertiesNxProofNSEC3").prop("checked", true);

                    $("#divDnssecPropertiesNSEC3Parameters").show();
                    $("#txtDnssecPropertiesNSEC3Iterations").val(responseJSON.response.nsec3Iterations);
                    $("#txtDnssecPropertiesNSEC3SaltLength").val(responseJSON.response.nsec3SaltLength);

                    $("#btnDnssecPropertiesChangeNxProof").attr("data-nx-proof", "NSEC3");
                    $("#btnDnssecPropertiesChangeNxProof").attr("data-nsec3-iterations", responseJSON.response.nsec3Iterations);
                    $("#btnDnssecPropertiesChangeNxProof").attr("data-nsec3-salt-length", responseJSON.response.nsec3SaltLength);
                    break;
            }

            $("#txtDnssecPropertiesDnsKeyTtl").val(responseJSON.response.dnsKeyTtl);

            if (divDnssecPropertiesLoader != null)
                divDnssecPropertiesLoader.hide();

            $("#divDnssecProperties").show();
        },
        error: function () {
            if (divDnssecPropertiesLoader != null)
                divDnssecPropertiesLoader.hide();
        },
        invalidToken: function () {
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert,
        objLoaderPlaceholder: divDnssecPropertiesLoader
    });
}

function deleteDnssecPrivateKey(keyTag, objBtn) {
    if (!confirm("Are you sure to permanently delete the private key?"))
        return;

    var btn = $(objBtn);
    var id = btn.attr("data-id");
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");
    var zone = $("#lblDnssecPropertiesZoneName").text();

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/dnssec/deletePrivateKey?token=" + token + "&zone=" + zone + "&keyTag=" + keyTag,
        success: function (responseJSON) {
            $("#trDnssecPropertiesPrivateKey" + id).remove();
            showAlert("success", "Private Key Deleted!", "The DNSSEC private key was deleted successfully.", divDnssecPropertiesAlert);
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert
    });
}

function rolloverDnssecDnsKey(keyTag, objBtn) {
    if (!confirm("Are you sure you want to rollover the DNS Key?"))
        return;

    var btn = $(objBtn);
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");
    var zone = $("#lblDnssecPropertiesZoneName").text();

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/dnssec/rolloverDnsKey?token=" + token + "&zone=" + zone + "&keyTag=" + keyTag,
        success: function (responseJSON) {
            refreshDnssecProperties();
            showAlert("success", "Rollover Done!", "The DNS Key was rolled over successfully.", divDnssecPropertiesAlert);
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert
    });
}

function retireDnssecDnsKey(keyTag, objBtn) {
    if (!confirm("Are you sure you want to retire the DNS Key?"))
        return;

    var btn = $(objBtn);
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");
    var zone = $("#lblDnssecPropertiesZoneName").text();

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/dnssec/retireDnsKey?token=" + token + "&zone=" + zone + "&keyTag=" + keyTag,
        success: function (responseJSON) {
            refreshDnssecProperties();
            showAlert("success", "DNS Key Retired!", "The DNS Key was retired successfully.", divDnssecPropertiesAlert);
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert
    });
}

function publishAllDnssecPrivateKeys(objBtn) {
    if (!confirm("Are you sure you want to publish all generated DNSSEC private keys?"))
        return;

    var btn = $(objBtn);
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");
    var zone = $("#lblDnssecPropertiesZoneName").text();

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/dnssec/publishAllPrivateKeys?token=" + token + "&zone=" + zone,
        success: function (responseJSON) {
            refreshDnssecProperties();
            btn.button('reset');
            showAlert("success", "Keys Published!", "All the generated DNSSEC private keys were published successfully.", divDnssecPropertiesAlert);
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            btn.button('reset');
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert
    });
}

function generateAndAddDnssecPrivateKey(objBtn) {
    var btn = $(objBtn);
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");
    var zone = $("#lblDnssecPropertiesZoneName").text();
    var keyType = $("#optDnssecPropertiedGenerateKeyKeyType").val();
    var algorithm = $("#optDnssecPropertiedGenerateKeyAlgorithm").val();

    var additionalParameters = "";

    switch (algorithm) {
        case "RSA":
            var hashAlgorithm = $("#optDnssecPropertiesGenerateKeyRsaHashAlgorithm").val();
            var keySize = $("#optDnssecPropertiesGenerateKeyRsaKeySize").val();

            additionalParameters = "&hashAlgorithm=" + hashAlgorithm + "&keySize=" + keySize;
            break;

        case "ECDSA":
            var curve = $("#optDnssecPropertiesGenerateKeyEcdsaCurve").val();

            additionalParameters = "&curve=" + curve;
            break;
    }

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/dnssec/generatePrivateKey?token=" + token + "&zone=" + zone + "&keyType=" + keyType + "&algorithm=" + algorithm + additionalParameters,
        success: function (responseJSON) {
            $("#divDnssecPropertiesGenerateKey").collapse("hide");
            refreshDnssecProperties();
            btn.button('reset');
            showAlert("success", "Key Generated!", "The DNSSEC private key was generated successfully.", divDnssecPropertiesAlert);
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            btn.button('reset');
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert
    });
}

function changeDnssecNxProof(objBtn) {
    var btn = $(objBtn);
    var currentNxProof = btn.attr("data-nx-proof");
    var nxProof = $("input[name=rdDnssecPropertiesNxProof]:checked").val();
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");

    var zone = $("#lblDnssecPropertiesZoneName").text();
    var apiUrl;

    switch (currentNxProof) {
        case "NSEC":
            if (nxProof === "NSEC") {
                showAlert("success", "Proof Changed!", "The proof of non-existence was changed successfully.", divDnssecPropertiesAlert)
                return;
            }
            else {
                var iterations = $("#txtDnssecPropertiesNSEC3Iterations").val();
                var saltLength = $("#txtDnssecPropertiesNSEC3SaltLength").val();

                apiUrl = "/api/zone/dnssec/convertToNSEC3?token=" + token + "&zone=" + zone + "&iterations=" + iterations + "&saltLength=" + saltLength;
            }
            break;

        case "NSEC3":
            if (nxProof === "NSEC3") {
                var currentIterations = btn.attr("data-nsec3-iterations");
                var currentSaltLength = btn.attr("data-nsec3-salt-length");

                var iterations = $("#txtDnssecPropertiesNSEC3Iterations").val();
                var saltLength = $("#txtDnssecPropertiesNSEC3SaltLength").val();

                if ((currentIterations == iterations) && (currentSaltLength == saltLength)) {
                    showAlert("success", "Proof Changed!", "The proof of non-existence was changed successfully.", divDnssecPropertiesAlert)
                    return;
                }
                else {
                    apiUrl = "/api/zone/dnssec/updateNSEC3Params?token=" + token + "&zone=" + zone + "&iterations=" + iterations + "&saltLength=" + saltLength;
                }
            } else {
                apiUrl = "/api/zone/dnssec/convertToNSEC?token=" + token + "&zone=" + zone;
            }
            break;

        default:
            return;
    }

    if (!confirm("Are you sure you want to change the proof of non-existence options for the zone?"))
        return;

    btn.button('loading');

    HTTPRequest({
        url: apiUrl,
        success: function (responseJSON) {
            btn.button('reset');
            showAlert("success", "Proof Changed!", "The proof of non-existence was changed successfully.", divDnssecPropertiesAlert);
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            btn.button('reset');
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert
    });
}

function updateDnssecDnsKeyTtl(objBtn) {
    var btn = $(objBtn);
    var divDnssecPropertiesAlert = $("#divDnssecPropertiesAlert");
    var zone = $("#lblDnssecPropertiesZoneName").text();
    var ttl = $("#txtDnssecPropertiesDnsKeyTtl").val();

    btn.button('loading');

    HTTPRequest({
        url: "/api/zone/dnssec/updateDnsKeyTtl?token=" + token + "&zone=" + zone + "&ttl=" + ttl,
        success: function (responseJSON) {
            btn.button('reset');
            showAlert("success", "TTL Updated!", "The DNSKEY TTL was updated successfully.", divDnssecPropertiesAlert);
        },
        error: function () {
            btn.button('reset');
        },
        invalidToken: function () {
            btn.button('reset');
            $("#modalDnssecProperties").modal("hide");
            showPageLogin();
        },
        objAlertPlaceholder: divDnssecPropertiesAlert
    });
}
