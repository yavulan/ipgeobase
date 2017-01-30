import parseXml from './xmlParser';
declare const fetch: Function;

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
    public inetnum: string;
    public country: string;
    public city: string;
    public region: string;
    public district: string;
    public lat: string;
    public lng: string;

    private cached: boolean = false;
    private static regExpIpValidation: RegExp = /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/;
    private static localStoragePrefix: string = "ipg_";
    private static expireTimeForFetched: number = 1000*60*60*24*7;// a week
    private static ipInfoProperties: string[] = ["inetnum", "country", "city", "region", "district", "lat", "lng"];
    private static isStorageSupported: boolean = typeof(localStorage) !== "undefined";

    constructor(public ip: string){
        if (!IpGeoBase.regExpIpValidation.test(ip)) {
            throw new TypeError("Invalid IP provided");
        }

        if(IpGeoBase.isStorageSupported){
            let savedInformation = localStorage.getItem(IpGeoBase.localStoragePrefix + this.ip);
            if(savedInformation) {
                savedInformation = JSON.parse(savedInformation);
                if(Date.now() - +savedInformation.dateRetrieved < IpGeoBase.expireTimeForFetched){
                    IpGeoBase.ipInfoProperties.forEach((item) => this[item] = savedInformation[item], this);
                    this.cached = true;
                }
            }
        }

        if(!this.cached){
            fetch(`http://ipgeobase.ru:7020/geo?ip=${ip}`)
                .then(response => response.text())
                .catch(e => {throw new Error("Something went wrong during fetching from http://ipgeobase.ru:7020/ " + e)})
                .then(text => {
                    let parsedXml = parseXml.parse(text);
                    IpGeoBase.ipInfoProperties.forEach((item) => this[item] = parseXml.getXmlValue(parsedXml, item), this);

                    if(IpGeoBase.isStorageSupported){
                        let data = {
                            "dateRetrieved": Date.now()
                        };
                        IpGeoBase.ipInfoProperties.forEach((item) => data[item] = this[item], this);
                        localStorage.setItem(IpGeoBase.localStoragePrefix + this.ip, JSON.stringify(data));
                    }
                });
        }
    }
}
