'use strict';
angular.module('mchefAdmin', ['ngResource', 'ui']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/general', {templateUrl: '/admin/general', controller: GeneralCtrl, name:'general'}).
		when('/users', {templateUrl: '/admin/users', controller: UsersCtrl, name: 'users'}).
		when('/stats', {templateUrl: '/admin/stats', controller: StatsCtrl, name:'statistics'}).
		when('/recipes', {templateUrl: '/admin/recipes', controller: RecipesCtrl, name:'recipes'}).
		when('/ticker', {templateUrl: '/admin/ticker', controller: TickerCtrl, name:'ticker'}).
		when('/tips', {templateUrl: '/admin/tips', controller: TipsCtrl, name:'tips'}).
		otherwise({redirectTo: '/general'});
	//$locationProvider.html5Mode(true);
}]);