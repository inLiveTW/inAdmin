angular.module('inlive', ['inlive.controller', 'inlive.service', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'template/login.html',
    controller: 'LoginCtrl',
  })

  .state('menu', {
    url: '/menu',
    templateUrl: 'template/menu.html',
  })

  .state('menu.channel', {
    url: '/channel',
    views: {
      'main': {
        templateUrl: 'template/channel.html',
        controller: 'ChannelCtrl'
      }
    }
  })
  
  .state('event_review', {
    url: '/event_review',
    templateUrl: 'template/event_review.html',
    controller: function ($scope, fbevent, livevt) {
      $scope.events = fbevent.fetch();
      $scope.save = function (fbid) {
        livevt.save(fbid);
      }
    }
  });

  $urlRouterProvider.otherwise('/login');
})

.run( function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});