interface IParseXml {
    parse(xmlStr: string): XMLDocument;
    getXmlValue(xml: XMLDocument, parameterName: string): string;
}

// by Tim Down, edited by Alex Mattrick http://stackoverflow.com/users/2444246/alex-mattrick http://stackoverflow.com/users/96100/tim-down
// from http://stackoverflow.com/a/7951947
let parse;
if (typeof window.DOMParser != "undefined") {
    parse = function (xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
    new window.ActiveXObject("Microsoft.XMLDOM")) {
    parse = function (xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}

const parseXml: IParseXml = {
    parse: parse,
    // getting certain values from xml
    getXmlValue: function (xml, parameterName) {
        return xml.getElementsByTagName(parameterName)[0].childNodes[0].nodeValue;
    }
};

export default parseXml;
