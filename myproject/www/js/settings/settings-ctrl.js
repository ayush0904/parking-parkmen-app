angular.module('ParkingMensConsole')
  .controller('AppSettingsController', ['$scope', '$state', '$cordovaAppRate', '$ionicPlatform',
    function ($scope, $state, $cordovaAppRate, $ionicPlatform) {

      $ionicPlatform.onHardwareBackButton(function (event) {
        if ($state.current.name == "main.settings") {
          // navigator.app.exitApp();
          ionic.Platform.exitApp();
        }
        else {
          // navigator.app.backHistory();
        }
      }, 100);

      $scope.settingsMenu = [
        {name: 'Rate Parking App', link: 'rateApp', icon_text: "ion-ios-star-half", section: 1},
        {name: 'Contact Us', link: 'contactUs', icon_text: "ion-iphone", section: 3},
      ];

      $ionicPlatform.ready(function () {
        $scope.rateApp = function () {
          $cordovaAppRate.promptForRating(true).then(function (result) {
            // success
          });
        }
      });

      $scope.openPage = function (link) {
        $state.go(link);
      }


    }]);
