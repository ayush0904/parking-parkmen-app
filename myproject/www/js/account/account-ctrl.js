angular.module('ParkingMensConsole')
  .controller('MyAccountController', ['$scope', '$state', '$rootScope', '$cordovaNetwork', '$localStorage','UtilityService','$ionicPlatform',
    function ($scope, $state, $rootScope, $cordovaNetwork, $localStorage,UtilityService,$ionicPlatform) {

      $ionicPlatform.onHardwareBackButton(function (event) {
        if ($state.current.name == "main.myAccount") {
          // navigator.app.exitApp();
          ionic.Platform.exitApp();
        }
        else {
          // navigator.app.backHistory();
        }
      }, 100);

      $scope.accountMenus = [
        {name: 'Parking history', iconName: 'ion-ios-copy', link: 'bookingHistory', section: 1},
        {name: 'Earnings', iconName: 'ion-social-usd', link: 'bookingPayment', section: 1},
        {name: 'Make Passes', iconName: 'ion-clipboard', link: 'createPasses', section: 1},
        {name: 'View All Passes', iconName: 'ion-ios-list', link: 'viewPasses', section: 1},
        {name: 'Add QR Code', iconName: 'ion-qr-scanner', link: 'addQrCode', section: 1},
        {name: 'View QR Codes', iconName: 'ion-qr-scanner', link: 'viewQrCode', section: 1},
        {name: 'Change Password', iconName: 'ion-locked', link: 'changePassword', section: 2}
      ];

      $scope.goToPage = function (link) {
        $state.go(link, {}, {reload: true});
      };

      $scope.goToProfilePage = function () {
        $state.go('userProfile', {}, {reload: true});
      };

      $scope.openLoginPage = function () {
        $state.go('login', {}, {reload: true});
      };

      $scope.userLogout = function () {
        $localStorage.$reset();
        if (!$localStorage.userData)
          $state.go('login', {}, {reload: true});
        else
          UtilityService.alertBox("","Unable to logout","OK",false);
      };

      var init = function () {
        if (!$localStorage.userData) {
          $scope.isUserLoggedIn = false;
          $state.go('login', {}, {reload: true});
        }
        else {
          $scope.isUserLoggedIn = true;
          $scope.loggedInUser = {
            name: $localStorage.userData[0].name
          };
        }
      };
      init();

    }]);
