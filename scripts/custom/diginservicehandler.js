'use strict';
(function(dsh) {
    function getHost() {
        var host = window.location.hostname;

        if (host.indexOf("localhost") != -1 || host.indexOf("127.0.0.1") != -1) host = "104.131.48.155";
        return host;
    }

    function getNamespace() {
        var authdata=JSON.parse(decodeURIComponent(getCookie('authData')));        
        var namespace = authdata.Email.replace('@', '_');
        var namespace = authdata.Email.replace(/[@.]/g, '_');
        return namespace;
    }
    dsh.factory('$servicehelpers', function($http, config) {
        return {
            httpSend: function(method, cb, reqUrl, obj) {
                if (method == "get") {
                    $http.get(reqUrl + '&SecurityToken=' + getCookie("securityToken") + '&Domain=' + config.Digin_Domain, {
                        headers: {}
                    }).
                    success(function(data, status, headers, config) {
                        (data.Is_Success) ? cb(data.Result, true, data.Custom_Message): cb(data.Custom_Message, false, "");
                    }).
                    error(function(data, status, headers, config) {
                        cb(data, false, "");
                    });
                }
            },
            sendWorker: function(wSrc, wData, cb) {
                var w = new Worker(wSrc);
                wData.rUrl = wData.rUrl + "&SecurityToken=" + getCookie("securityToken") + "&Domain=" + config.Digin_Domain;
                w.postMessage(JSON.stringify(wData));
                w.addEventListener('message', function(event) {
                    if (event.data.state) {
                        var res = JSON.parse(event.data.res);
                        res.Is_Success ? cb(res.Result, res.Is_Success, res.Custom_Message) : cb(res.Custom_Message, res.Is_Success, "");
                    } else {
                        if (typeof res != "undefined")
                            cb(res.Custom_Message, event.data.state, "");
                        else cb(null, event.data.state, "");
                    }
                });
            }
        }
    });
    dsh.factory('$restFb', function($diginurls, $servicehelpers, $rootScope) {
        function RestFbClient(_page, _tst) {
            var pg = _page;
            var timestamp = _tst;
            return {
                getPageOverview: function(cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + 'pageoverview?metric_names=[%27page_views%27,%27page_fans%27,%27page_stories%27]&since=' + timestamp.sinceStamp + '&until=' + timestamp.untilStamp + '&token=' + pg.accessToken);
                },
                getPostSummary: function(cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + 'fbpostswithsummary?since=' + timestamp.sinceStamp + '&until=' + timestamp.untilStamp + '&page=' + pg.id + '&token=' + pg.accessToken);
                },
                getSentimentAnalysis: function(cb, post_ids) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + 'sentimentanalysis?source=facebook&post_ids=' + post_ids + '&token=' + pg.accessToken);
                },
                getWordCloud: function(cb) {

                    if ($rootScope.fbPageAdmin) {
                        $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, $diginurls.diginengine + 'buildwordcloudFB?since=' + timestamp.sinceStamp + '&until=' + timestamp.untilStamp + '&source=facebook&token=' + pg.accessToken);
                    } else {
                        $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, $diginurls.diginengine + 'buildwordcloudFB?since=' + timestamp.sinceStamp + '&until=' + timestamp.untilStamp + '&source=facebook&token=' + pg.accessToken + '&page=' + pg.id);
                    }


                },
                getDemographicsinfo: function(cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + 'demographicsinfo?token=' + pg.accessToken);
                }
            }
        }
        return {
            getClient: function(page, timestamp) {
                return new RestFbClient(page, timestamp);
            }
        }
    });

    dsh.factory('$diginurls', function(config) {
        var host = getHost();
        return {
            //diginengine: "http://" + host + ":8080",

            diginengine: config.Digin_Engine_API,
            //diginengine: "http://192.168.2.33:8080",
            diginenginealt: "http://" + host + ":8081",
            getNamespace: function getNamespace() {
                var authdata = JSON.parse(decodeURIComponent(getCookie('authData')));
                var namespace = authdata.Email.replace('@', '_');
                namespace = namespace.replace(/\./g, '_');

                return namespace;
            }
        };
    });
})(angular.module('diginServiceHandler', []))