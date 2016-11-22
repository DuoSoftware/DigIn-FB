
'use strict';

var routerApp = angular.module('diginFbApp', ['ngAnimate',  'diginServiceHandler', 'ngMaterial', 'ui.router', 'ngSanitize', 'ngToast', 'highcharts-ng']);

//app common config details
routerApp.constant('config', {
    Digin_Engine_API: 'http://prod.digin.io:1929/',
    Digin_Domain: 'prod.digin.io'
});