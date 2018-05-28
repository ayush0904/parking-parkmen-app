angular.module('ParkingMensConsole')
  .controller('ContactUsController', ['$scope', 'UtilityService',
    function ($scope, UtilityService) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

    }]);
