import parseXml from './xmlParser';

interface IIpGeoBase {
    ip: string;
    inetnum: string;
    country: string;
    city: string;
    region: string;
    district: string;
    lat: string;
    lng: string;
}

export default class IpGeoBase implements IIpGeoBase {
    private static regExpIpValidation = /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/;
    private static localStoragePrefix = "ipg_";
    private static expireTimeForFetched = 1000*60*60*24*7;// a week
    private static ipInfoProperties = ["inetnum", "country", "city", "region", "district", "lat", "lng"];
    constructor(
        public ip: string,
        public inetnum: string,
        public country: string,
        public city: string,
        public region: string,
        public district: string,
        public lat: string,
        public lng: string
    ){
        if (!IpGeoBase.regExpIpValidation.test(ip)) {
            throw new TypeError("Invalid IP provided");
        }

        if(typeof(localStorage) !== "undefined"){
            let savedInformation = localStorage.getItem(IpGeoBase.localStoragePrefix + this.ip);
            if(savedInformation) {
                savedInformation = JSON.parse(savedInformation);
                if(Date.now() - +savedInformation.dateRetrieved < IpGeoBase.expireTimeForFetched){
                    IpGeoBase.ipInfoProperties.forEach((item) => this[item] = savedInformation[item], this);
                }
            }
        }

        if(!this.country){
            fetch(`http://ipgeobase.ru:7020/geo?ip=${ip}`)
                .then(response => response.text())
                .catch(e => {throw new Error("Something went wrong during fetching from http://ipgeobase.ru:7020/" + e)})
                .then(text => {
                    let parsedXml = parseXml.parse(text);
                    IpGeoBase.ipInfoProperties.forEach((item) => this[item] = parseXml.getXmlValue(parsedXml, item), this);

                    if(typeof(localStorage) !== "undefined"){
                        let data = {
                            "dateRetrieved": Date.now()
                        };
                        IpGeoBase.ipInfoProperties.forEach((item) => data[item] = this[item], this);
                        localStorage.setItem(IpGeoBase.localStoragePrefix + this.ip, JSON.stringify(data));

                    }

                    return parsedXml;
                });
        }
    }
}
