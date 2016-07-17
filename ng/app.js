///<reference path="../typings/angularjs/angular.d.ts" />
///<reference path="../typings/angularjs/angular-route.d.ts" />
var app = angular.module('PostsApp',['ngRoute'])

// Routes
app.config(function ($routeProvider, $locationProvider)
{
    $routeProvider
    .when('/', {controller:'PostsCtrl', templateUrl:'posts.html'})
    .when('/register', {controller:'LoginCtrl', templateUrl:'register.html'})
    .when('/login', {controller:'LoginCtrl', templateUrl:'login.html'})
    .when('/posts/:username', {controller:'UserPostsCtrl', templateUrl:'posts.html'})
    $locationProvider.html5Mode({
                 enabled: true,
                 requireBase: false});
})

// web sockets

app.run(function ($rootScope, $location)
{
    var url = "ws://" + location.host;
    console.log("connect to WS:" + url);
    var conn = new WebSocket(url);
    conn.onopen = function ()
    {
            console.log("Server connected")
    }
    conn.onmessage = function (e)
    {
        var payload = JSON.parse(e.data)

        $rootScope.$broadcast("ws:" + payload.topic, payload.data);
        console.log(e)
    }
 }
)
// MainCtrl
app.controller('MainCtrl', function($scope,$location, $http)
{
    $scope.currentUser = null;
    $scope.$on('login', function(_,user)
    {
        $scope.currentUser = user;
    })

    $scope.logout = function()
    {
        $scope.currentUser = null;
        delete $http.defaults.headers.common['x-auth'];
        $location.path("/")

    }
})
// user posts

app.controller('UserPostsCtrl', function($scope, PostSvc,$routeParams)
{
    $scope.userPost = {
        body: ""
    };
    PostSvc.fetchByUser($routeParams.username).success(function(posts)
    {
        $scope.posts = posts
    })

    $scope.AddPost = function () {
        var newPost = { body: $scope.userPost.body }
        PostSvc.create(newPost).success(function (post) {
            //$scope.posts.unshift(post)
            $scope.userPost = {};
        })
    }
    $scope.$on('ws:new_post', function (_, post) {
        $scope.$apply(function () { 
            $scope.posts.unshift(post)
        }
        )
    })
})
// postsCtrl
app.controller('PostsCtrl', function($scope, PostSvc)
{
    $scope.userPost = {
        body:""
    };
    PostSvc.fetch().success(function(posts)
    {
        $scope.posts = posts
    })


    $scope.AddPost = function()
    {
        var newPost = {body:$scope.userPost.body}
        PostSvc.create(newPost).success(function(post)                        
        {
            //$scope.posts.unshift(post)
            $scope.userPost = {};
        })
    }
    $scope.$on('ws:new_post', function (_, post) {
        $scope.posts.unshift(post)
    })
})
// Post Service
app.service('PostSvc', function($http)
{
    this.fetch = function()
    {
        return $http.get('/api/posts')
    }

    this.fetchByUser = function(username)
    {
        return $http.get('/api/posts/' + username)
    }

    this.create = function(post)
    {
        return $http.post('/api/post', post)
    }


})

// login ctrl

app.controller('LoginCtrl', function($scope,UserSvc, $location)
{
    $scope.loginfailed = null;
    $scope.username = UserSvc.username;
    $scope.password = UserSvc.password;
    $scope.login = function(username, password)
    {
        UserSvc.login(username, password)
        .then(function(response)
        {
            $scope.username = UserSvc.username;
            $scope.password = UserSvc.password;
            $scope.$emit('login', response.data);
            $location.path("/posts/" + response.data.username)
        }, 
        function(err)
        {
            $scope.loginfailed = 1;
        })
    }
    $scope.register = function (username, password) {
        UserSvc.register(username, password)
        .then(function (response) {
            $scope.username = UserSvc.username;
            $scope.password = UserSvc.password;
            $scope.$emit('login', response.data);
            $location.path("/posts/" + response.data.username)
        }, 
        function (err) {
            $scope.loginfailed = 1;
        })
    }


})

app.service('UserSvc', function($http)
{
    var thisObj = this;
    this.token = null;
    this.username = null;
    this.password = null;
    thisObj.login = function(username, password)
    {    
        this.username = username;
        this.password = password;
        return $http.post('/api/user/session',{username:username, password:password})
        .then(function(val)
        {
            thisObj.token = val.data;
            $http.defaults.headers.common['x-auth'] = val.data
            return thisObj.GetUser()
        })
    }
    
    thisObj.register = function (username, password) {
        this.username = username;
        this.password = password;
        return $http.post('/api/user/add', { username: username, password: password })
        .then(function (val) {
            return thisObj.login(username, password)
        })
    }

    thisObj.GetUser = function()
    {
        if(thisObj.token !=null)
        {
            return $http.get('/api/user/info',{headers:{'x-auth':thisObj.token}});
        }
    }
})
