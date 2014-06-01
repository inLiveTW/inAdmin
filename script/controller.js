angular.module('inlive.controller', [])

.controller('LoginCtrl', function($scope, $state) {
  
  $scope.login = function(user) {
    var btn = $("#login");
    btn.button('loading');
    $state.go('menu.channel');
  }

});