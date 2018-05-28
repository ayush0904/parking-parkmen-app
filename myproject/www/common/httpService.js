angular
  .module("ParkingMensConsole")
  .factory("HTTPService", ["$http", "UtilityService", "$q", "$localStorage", "$state", function ($http, UtilityService, $q, $localStorage, $state) {

    return {
      executeHttpGetRequest: function (url, successCallback, errorCallback) {
        if (!$localStorage.userData)
          $state.go('login');
        var deferred = $q.defer();
        var req = {
          method: 'GET',
          url: url,
          headers: {
            'Authorization': 'Bearer ' + $localStorage.userData[0].token
          }
        };
        $http(req).then(function (response) {
          if (!response.data.success && response.data.message[0].errorCode == 403) {
            UtilityService.alertBox("", response.data.message[0].msg, "OK", false);
            $localStorage.$reset();
            $state.go('login');
          } else
            deferred.resolve(response);
        }, function (response) {
          if (JSON.parse(JSON.stringify(response)).status == -1) {
            UtilityService.hideLoader();
            UtilityService.alertBox("", "We are facing Some technical issue.Will be fixed soon.If still exist report us", "OK", false);
          }
          deferred.reject();
        });
        return deferred.promise;
      },

      executeHttpPostRequest: function (url, data) {
        if (!$localStorage.userData) {
          $state.go('login');
          return;
        }
        var deferred = $q.defer();
        $http.defaults.headers.post = {
          'Authorization': 'Bearer ' + $localStorage.userData[0].token
        };
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        var paramData = $.param(data);
        $http.post(url, paramData).success(function (response) {
          deferred.resolve(response);
        }).error(function (response) {
          if (response === null) {
            UtilityService.hideLoader();
            UtilityService.alertBox("", "We are facing Some technical issue.Will be fixed soon.If still exist report us", "OK", false);
          }
          deferred.reject();
        });
        return deferred.promise;
      },

      executeHttpPostRequestForLogin: function (url, data) {
        var deferred = $q.defer();
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        var paramData = $.param(data);
        $http.post(url, paramData).success(function (response) {
          if (response.success) {
            $localStorage.$reset();
            $localStorage.userData = response.responseData;
          }
          deferred.resolve(response);
        }).error(function (response) {
          if (response === null) {
            UtilityService.hideLoader();
            UtilityService.alertBox("", "We are facing Some technical issue.Will be fixed soon.If still exist report us", "OK", false);
          }
          deferred.reject();
        });
        return deferred.promise;
      },

      executeHttpPostWithOutToken: function (url, data) {
        var deferred = $q.defer();
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        var paramData = $.param(data);
        $http.post(url, paramData).success(function (response) {
          deferred.resolve(response);
        }).error(function (response) {
          if (response === null) {
            UtilityService.hideLoader();
            UtilityService.alertBox("", "We are facing Some technical issue.Will be fixed soon.If still exist report us", "OK", false);
          }
          deferred.reject();
        });
        return deferred.promise;
      },
    }
  }]);

