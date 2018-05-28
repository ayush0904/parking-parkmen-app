angular.module('ParkingMensConsole')
  .controller('ResetPasswordController', ['$scope', 'UtilityService', '$state', 'HTTPService', '$localStorage', 'Config', 'ConnectivityMonitor',
    function ($scope, UtilityService, $state, HTTPService, $localStorage, Config, ConnectivityMonitor) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      $scope.user = {};
      $scope.changeUserPassword = function () {
        if ($localStorage.passwordChangeUserId[0])
          var userId = $localStorage.passwordChangeUserId[0].userId;
        var data = {
          userId: userId,
          password: $scope.user.userPassword,
        };

        HTTPService.executeHttpPostWithOutToken(Config.BASE_URL + "change-password", data).then(function (result) {
          $scope.user.userPassword = "";
          $scope.user.password = "";
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
            $state.go('login');
          }
          else
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
        });
      };
    }]);
