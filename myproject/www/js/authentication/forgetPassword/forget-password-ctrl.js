angular.module('ParkingMensConsole')
  .controller('ForgetPasswordController', ['$scope', '$state', 'UtilityService', 'HTTPService', 'Config','$localStorage',
    function ($scope, $state, UtilityService, HTTPService, Config,$localStorage) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };
      $scope.forgetPasswordObj = {};

      $scope.getOtp = function () {
        var data = {
          phoneNo: $scope.forgetPasswordObj.phoneNo
        };
        UtilityService.showLoader("Sending Otp..");
        HTTPService.executeHttpPostWithOutToken(Config.BASE_URL + "forget-password", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $localStorage.passwordResetObj = $scope.forgetPasswordObj;
            $state.go('verifyOtp');
          }
          else
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
        })
      }

    }]);
