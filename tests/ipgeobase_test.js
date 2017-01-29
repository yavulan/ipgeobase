"use strict";

describe("General tests", function () {
    it("should have a class", function () {
        expect(IpGeoBase).toEqual(jasmine.any(Function));
    });

    it("should accept and store valid ip", function () {
        let my = new IpGeoBase("255.0.0.0");
        expect(my.ip).toEqual("255.0.0.0");
    });
    it("should throw an error if passed invalid ip", function () {
        let reForErrorReceived = /invalid|ip/i,
            errorType = TypeError;

        expect(function() { return new IpGeoBase("192.168..1")}).toThrowError(errorType, reForErrorReceived);
        expect(function() { return new IpGeoBase("192.168.1")}).toThrowError(errorType, reForErrorReceived);
        expect(function() { return new IpGeoBase("192.168.0.0/24")}).toThrowError(errorType, reForErrorReceived);
        expect(function() { return new IpGeoBase("192.168.0.0/24")}).toThrowError(errorType, reForErrorReceived);
    });
    
    it("should check localStorage for previously saved responses", function () {
        var testObject = { 'URL': 1, 'TITLE': 2 };
        localStorage.setItem('testObject', JSON.stringify(testObject));
        var retrievedObject = localStorage.getItem('testObject');
        console.log('retrievedObject: ', JSON.parse(retrievedObject));
    })
});

// describe("Request sending tests", function () {
//     let my;
//     beforeEach(function(done) {
//         setTimeout(function() {
//             my = new IpGeoBase("144.206.192.6");
//             done();
//         }, 4000);
//     });
//
//     it("should receive respond status 200", function () {
//         expect(my.status).toEqual(200);
//     });
//
//     it("should store received variables", function () {
//         expect(my.country).toEqual("RU");
//         expect(my.inetnum).toEqual("144.206.132.0 - 144.206.255.255");
//
//         let reForLatAndLng = /(\d{2}\.\d{6})/;
//         expect(reForLatAndLng.test(my.lat)).toEqual(true);
//         expect(reForLatAndLng.test(my.lng)).toEqual(true);
//     });
// });

