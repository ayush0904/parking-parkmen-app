angular.module('ParkingMensConsole')
  .controller('CreatePassController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService',
    function ($scope, $ionicLoading, Config, $state, HTTPService, $localStorage, UtilityService) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      $scope.userPass = {startDate: new Date()};

      $scope.fetchCenterMonthlyPasses = function () {
        if ($localStorage.centerInfo)
          var centerId = $localStorage.centerInfo[0].centerId;
        UtilityService.showLoader("Fetching Passes..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-parking-pass/' + centerId + "/" + $scope.userPass.vehicalId).then(function (response) {
          UtilityService.hideLoader();
          $scope.monthlyPassesArray = [];
          if (response.data.success) {
            var monthlyPassesObj = response.data.responseData;
            angular.forEach(monthlyPassesObj, function (value, key) {
              $scope.monthlyPassesArray.push(
                {
                  "priceId": value.priceId,
                  "centerId": value.centerId,
                  "vehicalId": value.vehicalId,
                  "time": value.time,
                  "time_notation": value.time_notation,
                  "price": value.price,
                  "priceText": value.priceText
                }
              )
            });
          } else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });
      };

      var getPassDaysFromPriceId = function (priceId) {
        var days = '';
        angular.forEach($scope.monthlyPassesArray, function (value, key) {
          if (parseInt(priceId) == parseInt(value.priceId))
            days = value.time;
        });
        return days;
      };

      $scope.addUserPass = function () {
        var days = getPassDaysFromPriceId($scope.userPass.priceId);
        var startDateInEpoch = changeDateFormatToEpoch($scope.userPass.startDate);
        var endDateInEpoch = getEndDateInEpoch(days, $scope.userPass.startDate);
        if ($localStorage.centerInfo) {
          var centerId = $localStorage.centerInfo[0].centerId;
          var workerId = $localStorage.centerInfo[0].parkingWorkerId;
        }
        if ($localStorage.userData[0]) {
          var addedBy = $localStorage.userData[0].userId;
          var cityId = $localStorage.userData[0].city;
        }

        var data = {
          vehicalType: $scope.userPass.vehicalId,
          centerId: centerId,
          createdBy: workerId,
          startDate: startDateInEpoch,
          pricingId: $scope.userPass.priceId,
          mobileNo: $scope.userPass.mobileNo,
          cityId: cityId,
          endDate: endDateInEpoch,
          addedBy: addedBy
        };
        UtilityService.showLoader("Saving Pass..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "save-pass", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.userPass = [];
            $scope.monthlyPassesArray = [];
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      var changeDateFormatToEpoch = function (date) {
        var newDate = new Date(date);
        return (new Date(newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate()).getTime())
      };

      var getEndDateInEpoch = function (days, date) {
        var newDate = new Date(date);
        return newDate.setDate(newDate.getDate() + parseInt(days));
      };

      $scope.getVehicalTypeName = function (vehicalId) {
        angular.forEach($scope.vehicalTypeArray, function (val, key) {
          if (vehicalId == val.vehicalTypeId)
            $scope.userPass.vehicalType = val.vehicalTypeName;
        })
      };

      $scope.vehicalTypeArray = $localStorage.vehicalTypes;

      $scope.buttonClickable = function () {
        $scope.getVehicalTypeName($scope.userPass.vehicalId);
        $scope.fetchCenterMonthlyPasses();
      };

    }]);
