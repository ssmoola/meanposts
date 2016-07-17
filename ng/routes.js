///<reference path="../typings/angularjs/angular.d.ts" />
///<reference path="../typings/angularjs/angular-route.d.ts" />

angular.module('PostApp').config(function ($routeProvider)
{
    $routeProvider
    .when('/', {controller:'PostCtrl', templateUrl:posts.html})
    .when('/register', {controller:'RegisterCtrl', templateUrl:register.html})
    .when('/login', {controller:'LoginCtrl', templateUrl:login.html})
})