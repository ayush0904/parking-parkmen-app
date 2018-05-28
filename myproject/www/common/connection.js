angular
  .module("ParkingMensConsole")
  .factory('ConnectivityMonitor', function ($rootScope, $cordovaNetwork, UtilityService, $mdDialog) {


    var isOnline = function () {
      if (ionic.Platform.isWebView()) {
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }
    };

    var isOffline = function () {
      if (ionic.Platform.isWebView()) {
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    };

    var showNoInternetConnection = function (e) {
      var confirm = $mdDialog.confirm()
        .title('No Internet Connection')
        .textContent("Your device doesn't have any active Internet connection.What would you like?")
        .ariaLabel('no internet')
        // .targetEvent(e)
        .ok('RETRY')
        .cancel('EXIT');

      $mdDialog.show(confirm).then(function () {
        if (isOffline())
          showNoInternetConnection(e);
      }, function () {
        ionic.Platform.exitApp();
      });
    };

    var startWatching = function () {
      if (ionic.Platform.isWebView()) {
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
          console.log("went online");
        });
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
          showNoInternetConnection(event);
        });
      }
      else {
        window.addEventListener("online", function (e) {
          console.log("went online");
        }, false);
        window.addEventListener("offline", function (e) {
          showNoInternetConnection(e);
        }, false);
      }
    };

    return {
      isOnline: isOnline,
      isOffline: isOffline,
      startWatching: startWatching
    }
  })
