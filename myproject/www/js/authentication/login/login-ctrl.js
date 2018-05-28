angular.module('ParkingMensConsole')
  .controller('LoginController', ['$scope', '$state', 'HTTPService', 'Config', '$localStorage', 'UtilityService', 'ConnectivityMonitor',
    function ($scope, $state, HTTPService, Config, $localStorage, UtilityService, ConnectivityMonitor) {

      if ($localStorage.userData)
        $state.go('main.dashboard');

      $scope.user = {};

      $scope.loadVehicalTypes = function () {
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-vehicals-types').then(function (response) {
          if (response.data.success) {
            var vehicalTypeObj = response.data.responseData;
            var vehicalTypeArray = [];
            angular.forEach(vehicalTypeObj, function (value, key) {
              vehicalTypeArray.push(
                {
                  vehicalTypeId: value.vehicalTypeId,
                  vehicalTypeName: value.vehicalTypeName,
                  vehicalTypeCode: value.vehicalTypeCode
                }
              )
            });
            $localStorage.vehicalTypes = vehicalTypeArray;
          } else {
            //relogin
          }
        });
      };

      $scope.login = function () {
        var data = {
          username: $scope.user.userName,
          password: $scope.user.password,
          roleId: Config.USER_ROLES.PARKMAN
        };
        UtilityService.showLoader("Logging in..");
        HTTPService.executeHttpPostRequestForLogin(Config.BASE_URL + "login", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (!data.success)
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          else {
            $scope.getCenterInfo();
            $scope.loadVehicalTypes();
          }
        })
      };

      $scope.getCenterInfo = function () {
        if ($localStorage.userData[0].userId)
          var userID = $localStorage.userData[0].userId;
        else {
          UtilityService.alertBox("", "Some error occured,Relogin to continue", "OK", false);
          $localStorage.$reset();
        }
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-center-id/' + userID).then(function (response) {
          if (response.data.success) {
            var centerobj = response.data.responseData;
            $localStorage.centerInfo = centerobj;
            $state.go('main.dashboard');
            UtilityService.customAlertBoxWithTemplate();
          } else {
            $localStorage.$reset();
            UtilityService.alertBox("", response.data.message.msg, "OK", false);
          }
        });


      };

      $scope.openForgetPasswordPage = function () {
        $state.go('forgetPassword');
      }

    }]);
