angular.module('appRoutes', ['ngRoute'])



.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.meineEinkaufsliste', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/meineEinkaufsliste.html',
        controller: 'ListController'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true,
    controller: 'ListController'
  })

  .state('login', {
    url: '/page4',
    templateUrl: 'templates/login.html',
    controller: 'MainController'
  })

  .state('signup', {
    url: '/page5',
    templateUrl: 'templates/signup.html',
    controller: ''
  })

$urlRouterProvider.otherwise('/page4')

  

})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});