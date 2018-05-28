angular
  .module("ParkingMensConsole")
  .factory("UtilityService", ["$mdDialog", '$localStorage', '$ionicLoading', '$ionicHistory', function ($mdDialog, $localStorage, $ionicLoading, $ionicHistory) {

    return {
      alertBox: function (title, contentText, okButton, outsideClose, ev) {
        $mdDialog.show(
          $mdDialog.alert()
          // .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(outsideClose)
            .title(title)
            .textContent(contentText)
            .ok(okButton)
            .targetEvent(ev)
        );
      },

      customAlertBoxWithTemplate: function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'views/modals/welcome-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: false
        })
          .then(function (answer) {
          }, function () {
          });
      },

      getCurrentGateNo: function () {
        var gateNo = "";
        if ($localStorage.gatesArray && $localStorage.currentGateId)
          angular.forEach($localStorage.gatesArray, function (value, key) {
            if (value.gateID == $localStorage.currentGateId)
              gateNo = value.gateNo;
          });
        return gateNo;
      },

      showLoader: function (text) {
        $ionicLoading.show({
          template: "<ion-spinner icon='circles'></ion-spinner><br><span class='f-s-10'>" + text + "</span>",
          animation: 'fade-in',
          showDelay: 0
        }).then(function () {
          // console.log("The loading indicator is now displayed");
        });
      },

      hideLoader: function () {
        $ionicLoading.hide().then(function () {
          // console.log("The loading indicator is now hidden");
        });
      },

      goBack: function () {
        $ionicHistory.goBack();
      },

      generateRandomCode: function (chars, length) {
        let result = '';
        for (var i = length; i > 0; --i)
          result += chars[Math.floor(Math.random() * chars.length)];
        return result;
      }
    };


    function DialogController($scope, $mdDialog, $localStorage, Config, $state) {
      if ($localStorage.centerInfo)
        $scope.centerInfo = $localStorage.centerInfo;

      $scope.showRequiredError = true;

      $scope.parkingView = {typeId: ""};

      $scope.parkingType = [
        {
          typeName: "CHECK IN",
          typeID: Config.PARKING_MODES.CHECK_IN
        },
        {
          typeName: "CHECK OUT",
          typeID: Config.PARKING_MODES.CHECK_OUT
        }
      ];
      $scope.checkViewValue = function () {
        if ($scope.parkingView.typeId == "")
          $scope.showRequiredError = true;
        else {
          $scope.showRequiredError = false;
        }
      };

      $scope.setParkingView = function () {
        if ($scope.parkingView.typeId == "")
          $scope.showRequiredError = true;
        else {
          $scope.showRequiredError = false;
          $localStorage.parkingMode = $scope.parkingView;
          $mdDialog.hide();
          $state.reload();
        }
      };
    }

  }]);
