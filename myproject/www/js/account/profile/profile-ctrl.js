angular.module('ParkingMensConsole')
  .controller('UserProfileController', ['$scope', '$state', '$localStorage','UtilityService','ConnectivityMonitor',
    function ($scope, $state, $localStorage,UtilityService,ConnectivityMonitor) {

      $scope.goBack = function() {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.openAccountPage = function () {
        $state.go('main.myAccount', {}, {reload: true});
      };


      $scope.getCheckInUserBookings = function () {
        if (!$localStorage.userData)
          $state.go('login', {}, {reload: true});
        else
          $scope.user = {
            userIcon: "",
            userName: $localStorage.userData[0].name,
            emailID: $localStorage.userData[0].emailID,
            phoneNo: $localStorage.userData[0].phoneNo,
            dateOfRegistration: $localStorage.userData[0].addedOn,
            centerName : $localStorage.centerInfo[0].centerName ,
            centerId : $localStorage.centerInfo[0].centerId ,
            parkingMode : $localStorage.parkingMode.typeName ,
            gateNo :UtilityService.getCurrentGateNo()
          };
      };


      var init = function () {
        checkLoginState();
        $scope.getCheckInUserBookings();
      };
      init();
    }]);
