"use strict";
var xmlParser_1 = require('./xmlParser');
var IpGeoBase = (function () {
    function IpGeoBase(ip, inetnum, country, city, region, district, lat, lng) {
        var _this = this;
        this.ip = ip;
        this.inetnum = inetnum;
        this.country = country;
        this.city = city;
        this.region = region;
        this.district = district;
        this.lat = lat;
        this.lng = lng;
        if (!IpGeoBase.regExpIpValidation.test(ip)) {
            throw new TypeError("Invalid IP provided");
        }
        if (typeof (localStorage) !== "undefined") {
            var savedInformation_1 = localStorage.getItem(IpGeoBase.localStoragePrefix + this.ip);
            if (savedInformation_1) {
                savedInformation_1 = JSON.parse(savedInformation_1);
                if (Date.now() - +savedInformation_1.dateRetrieved < IpGeoBase.expireTimeForFetched) {
                    IpGeoBase.ipInfoProperties.forEach(function (item) { return _this[item] = savedInformation_1[item]; }, this);
                }
            }
        }
        if (!this.country) {
            fetch("http://ipgeobase.ru:7020/geo?ip=" + ip)
                .then(function (response) { return response.text(); })
                .catch(function (e) { throw new Error("Something went wrong during fetching from http://ipgeobase.ru:7020/" + e); })
                .then(function (text) {
                var parsedXml = xmlParser_1["default"].parse(text);
                IpGeoBase.ipInfoProperties.forEach(function (item) { return _this[item] = xmlParser_1["default"].getXmlValue(parsedXml, item); }, _this);
                if (typeof (localStorage) !== "undefined") {
                    var data_1 = {
                        "dateRetrieved": Date.now()
                    };
                    IpGeoBase.ipInfoProperties.forEach(function (item) { return data_1[item] = _this[item]; }, _this);
                    localStorage.setItem(IpGeoBase.localStoragePrefix + _this.ip, JSON.stringify(data_1));
                }
                return parsedXml;
            });
        }
    }
    IpGeoBase.regExpIpValidation = /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/;
    IpGeoBase.localStoragePrefix = "ipg_";
    IpGeoBase.expireTimeForFetched = 1000 * 60 * 60 * 24 * 7; // a week
    IpGeoBase.ipInfoProperties = ["inetnum", "country", "city", "region", "district", "lat", "lng"];
    return IpGeoBase;
}());
exports.__esModule = true;
exports["default"] = IpGeoBase;
//# sourceMappingURL=ipgeobase.js.map