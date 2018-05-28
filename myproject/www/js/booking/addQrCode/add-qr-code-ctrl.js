angular.module('ParkingMensConsole')
  .controller('AddQrCodeController', ['$scope', '$state', '$rootScope', '$cordovaBarcodeScanner', '$localStorage', 'UtilityService', 'HTTPService', 'Config', '$cordovaInAppBrowser',
    function ($scope, $state, $rootScope, $cordovaBarcodeScanner, $localStorage, UtilityService, HTTPService, Config, $cordovaInAppBrowser) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      $scope.qrCodeModel = {vehicalId : 0,qrCodeValue : ""};

      $scope.addUserQrCode = function () {
        if ($localStorage.userData[0]) {
          var addedBy = $localStorage.userData[0].userId;
          var cityId = $localStorage.userData[0].city;
        }

        var data = {
          vehicalType: $scope.qrCodeModel.vehicalId,
          mobileNo: $scope.qrCodeModel.mobileNo,
          cityId: cityId,
          qrCode: $scope.qrCodeModel.qrCodeValue,
          addedBy: addedBy
        };
        UtilityService.showLoader("Saving Pass..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "save-qr-code", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.qrCodeModel = {};
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.getVehicalTypeName = function (vehicalId) {
        angular.forEach($scope.vehicalTypeArray, function (val, key) {
          if (vehicalId == val.vehicalTypeId)
            $scope.qrCodeModel.vehicalType = val.vehicalTypeName;
        })
      };

      $scope.vehicalTypeArray = $localStorage.vehicalTypes;

      document.addEventListener("deviceready", function () {
        $scope.scanUserQrCode = function () {
          $cordovaBarcodeScanner
            .scan()
            .then(function (qrData) {
              if(!qrData.cancelled)
              $scope.qrCodeModel.qrCodeValue = qrData.text;
            }, function (error) {
            });
        };
      }, false);

      $scope.buttonClickable = function () {
        $scope.getVehicalTypeName($scope.qrCodeModel.vehicalId);
      };

      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };

      // download pdf files
      document.addEventListener("deviceready", function () {
        $scope.openBrowser = function () {
          $cordovaInAppBrowser.open('http://192.168.1.35:3000/pdf', '_system', options)
            .then(function (event) {
              // success
            })
            .catch(function (event) {
              // error
            });
        }
      }, false);
    }]);
