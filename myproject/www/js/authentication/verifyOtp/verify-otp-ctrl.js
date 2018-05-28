angular.module('ParkingMensConsole')
  .controller('VerifyOtpController', ['$scope', '$state', 'UtilityService', 'HTTPService', '$localStorage', 'Config','$mdDialog',
    function ($scope, $state, UtilityService, HTTPService, $localStorage, Config,$mdDialog) {

      $scope.goBack = function (ev) {
        var confirm = $mdDialog.confirm()
          .textContent('Would you like to cancel this verification?')
          .targetEvent(ev)
          .ok('YES')
          .cancel('NO');
        $mdDialog.show(confirm).then(function () {
          UtilityService.goBack();
        }, function () {
        });
      };

      $scope.verifyOtpObj = {};

      $scope.verifyPasswordResetOtp = function () {
        if ($localStorage.passwordResetObj.phoneNo)
          var phoneNo = $localStorage.passwordResetObj.phoneNo;
        var data = {
          phoneNo: phoneNo,
          otp: $scope.verifyOtpObj.otp
        };
        UtilityService.showLoader("Sending Otp..");
        HTTPService.executeHttpPostWithOutToken(Config.BASE_URL + "verify-otp", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $localStorage.passwordChangeUserId = data.responseData;
            $state.go('resetNewPassword');
          }
          else
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
        })
      }


    }]);
