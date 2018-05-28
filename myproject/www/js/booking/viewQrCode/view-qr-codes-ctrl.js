angular.module('ParkingMensConsole')
  .controller('ViewQrCodeController', ['$scope', '$state', '$rootScope', '$localStorage', 'UtilityService', 'HTTPService', 'Config', '$mdBottomSheet',
    function ($scope, $state, $rootScope, $localStorage, UtilityService, HTTPService, Config, $mdBottomSheet) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      function fetchQrCodesOfUsersOfCenter() {
        UtilityService.showLoader("Fetching Qr Codes..");
        if ($localStorage.centerInfo)
          var centerId = $localStorage.centerInfo[0].centerId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-qr-codes/' + centerId).then(function (response) {
          UtilityService.hideLoader();
          $scope.usersQrCodesArray = [];
          if (response.data.success) {
            var userQrCode = response.data.responseData;
            $scope.noOfVehiclesWithQrCodes = userQrCode.length;
            angular.forEach(userQrCode, function (value, key) {
              $scope.usersQrCodesArray.push(
                {
                  "name": value.name,
                  "userId": value.userId,
                  "phoneNo": value.phoneNo,
                  "qrcode": value.qrcode,
                  "vehicalId": value.vehicalId
                }
              )
            });
          } else {
            $scope.isQrCodesFound = false;
          }
        });
      }

      var init = function () {
        $scope.isQrCodesFound = true;
        fetchQrCodesOfUsersOfCenter();
      };
      init();

      $scope.updateUser = function (userObjResponse) {
        var data = {
          name: userObjResponse.name,
          phoneNo: userObjResponse.phoneNo,
        };
        UtilityService.showLoader("Updating..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "update-user-details", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            delete $localStorage.editUserObj;
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
            fetchQrCodesOfUsersOfCenter();
          }
          else
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
        });
      };


      $scope.openUpdateSheet = function (userObj) {
        $localStorage.editUserObj = userObj;
        $mdBottomSheet.show({
          templateUrl: 'views/modals/update-user-details.html',
          controller: 'ListBottomSheetCtrl'
        }).then(function (userObjResponse) {
          $scope.updateUser(userObjResponse);
        }).catch(function (error) {
        });
      };

    }]).controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet, $localStorage) {

    $scope.updateUserInfo = function () {
      $mdBottomSheet.hide($scope.userObj);
    };

    $scope.userObj = {};

    $scope.fetchUserDetailsForEdit = function () {
      if ($localStorage.editUserObj) {
        $scope.userObj.name = $localStorage.editUserObj.name;
        $scope.userObj.phoneNo = $localStorage.editUserObj.phoneNo;
      }
    };

    var init = function () {
      $scope.fetchUserDetailsForEdit();
    };
    init();
  }
);
