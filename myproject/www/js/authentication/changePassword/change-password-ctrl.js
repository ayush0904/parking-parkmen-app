angular.module('ParkingMensConsole')
  .controller('ChangePasswordController', ['$scope', 'UtilityService', '$state', 'HTTPService', '$localStorage', 'Config', 'ConnectivityMonitor',
    function ($scope, UtilityService, $state, HTTPService, $localStorage, Config, ConnectivityMonitor) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      $scope.user = {};
      $scope.changeUserPassword = function () {
        var data = {
          userId: $localStorage.userData[0].userId,
          password: $scope.user.userPassword,
          currentPassword: $scope.user.currentPassword
        };
        UtilityService.showLoader("Changing password..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "change-password", data).then(function (result) {
          UtilityService.hideLoader();
          $scope.user.userPassword = "";
          $scope.user.password = "";
          $scope.user.currentPassword = "";
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
            $state.go('main.myAccount');
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });
      };

      $scope.goToAccountPage = function () {
        $state.go('main.myAccount');
      };


    }]);
