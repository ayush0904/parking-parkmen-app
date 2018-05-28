angular.module('ParkingMensConsole')
  .controller('BookingDashboardController', ['$scope', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$ionicModal', 'ConnectivityMonitor', '$ionicPlatform', '$cordovaBarcodeScanner',
    function ($scope, Config, $state, HTTPService, $localStorage, UtilityService, $ionicModal, ConnectivityMonitor, $ionicPlatform, $cordovaBarcodeScanner) {

      $ionicPlatform.onHardwareBackButton(function (event) {
        if ($state.current.name == "main.dashboard") {
          // navigator.app.exitApp();
          ionic.Platform.exitApp();
        }
        else {
          // navigator.app.backHistory();
        }
      }, 100);

      $scope.parkingGate = {};
      $scope.user = {
        parkingID: "",
        userID: ""
      };

      $scope.checkOutObj = {discountAmount: 0};
      $scope.vehicalSearchResultArray = [];
      $scope.showCheckOutDataScreen = false;

      $scope.changeGateNo = function () {
        $localStorage.currentGateId = $scope.parkingGate.gateId;
      };

      $scope.registerUser = function () {
        if ($localStorage.userData[0]) {
          var addedBy = $localStorage.userData[0].userId;
          var cityId = $localStorage.userData[0].city;
        }
        UtilityService.showLoader("Finding vehicles..");
        var data = {
          phoneNo: $scope.user.mobileNo,
          city: cityId,
          addedBy: addedBy
        };
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "register-parking-user", data).then(function (result) {
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.vehicalSearchResultArray = [];
            $scope.user.userID = data.responseData.userId;
            if (!data.responseData.isNewUser)
              $scope.getUserVehicles(data.responseData.userId);
            else {
              UtilityService.hideLoader();
              $scope.noVehicalMsg = "No vehical Found";
            }
          }
          else {
            UtilityService.hideLoader();
            $scope.vehicalSearchResultArray = [];
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      document.addEventListener("deviceready", function () {
        $scope.scanQrCode = function () {
          $cordovaBarcodeScanner
            .scan()
            .then(function (qrData) {
              if (!qrData.cancelled)
                $scope.getUserVehiclesUsingQrCode(qrData.text);
            }, function (error) {
              // alert(error);
              // An error occurred
            });

        };
        $scope.scanQrCodeForCheckOut = function () {
          $cordovaBarcodeScanner
            .scan()
            .then(function (qrData) {
              if (!qrData.cancelled)
                $scope.scanQrCodeForCheckOutAndFetchUserData(qrData.text);
            }, function (error) {
              // alert(error);
              // An error occurred
            });

        };
      }, false);

      // TODO MOVE FROM HERE
      $scope.scanQrCodeForCheckOutAndFetchUserData = function (qrCode) {
        if ($localStorage.centerInfo)
          var centerId = $localStorage.centerInfo[0].centerId;

        UtilityService.showLoader("Searching..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-checkedin-user-using-qr/' + qrCode + '/' + centerId).then(function (response) {
          UtilityService.hideLoader();
          if (response.data.success) {
            $scope.showCheckOutDataScreen = true;
            $scope.showDiscountMenu = true;
            $scope.checkOutObj.discountAmount = 0;
            $scope.userCheckInData = response.data.responseData[0];
            $scope.checkOutObj.searchCode = $scope.userCheckInData.vehicalNumber;
            $localStorage.checkedInUser = $scope.userCheckInData;
            $scope.parkingTotalFare = Math.round($scope.userCheckInData.pricing);
            $scope.roundOffPriceAmount = ($scope.parkingTotalFare - $scope.userCheckInData.pricing).toFixed(2);

            if ($scope.userCheckInData.passes.length > 0) {
              $scope.isAmountByCash = 0;
              $scope.passId = $scope.userCheckInData.passes[0].passId;
              $scope.showDiscountMenu = false;
              $scope.passStatus = "Active";
              $scope.checkOutObj.finalPaymentCash = 0;
            }
            else {
              $scope.passId = 0;
              $scope.isAmountByCash = 1;
              $scope.passStatus = "No pass";
              $scope.checkOutObj.finalPaymentCash = $scope.parkingTotalFare;
            }
          } else {
            $scope.showCheckOutDataScreen = false;
            $scope.showDiscountMenu = false;
            $scope.checkOutObj.searchCode = "";
            UtilityService.alertBox("", response.data.message[0].msg, "OK", false);
          }
        });
      };

      $scope.getUserVehicles = function (userID) {
        var selectedVehicalId = $scope.booking.vehicalId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-user-vehicles/' + userID + '/' + selectedVehicalId).then(function (response) {
          UtilityService.hideLoader();
          if (response.data.success) {
            $scope.noVehicalMsg = "";
            var userVehicalObj = response.data.responseData;
            $scope.vehicalSearchResultArray = [];
            angular.forEach(userVehicalObj, function (value, key) {
              $scope.vehicalSearchResultArray.push(
                {
                  vehicalNo: value.vehicalNumber
                }
              );
            });
          } else {
            $scope.noVehicalMsg = response.data.message[0].msg;
          }
        });
      };

      $scope.getUserVehiclesUsingQrCode = function (qrCode) {
        UtilityService.showLoader("Fetching data..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-user-vehicles-using-qr/' + qrCode).then(function (response) {
          UtilityService.hideLoader();
          if (response.data.success) {
            $scope.noVehicalMsg = "";
            var userVehicalObj = response.data.responseData;
            $scope.vehicalSearchResultArray = [];
            $scope.booking.vehicalId = userVehicalObj[0].vehicalType;
            $scope.user.mobileNo = parseInt(userVehicalObj[0].phoneNo);
            $scope.user.userID = parseInt(userVehicalObj[0].userId);
            angular.forEach(userVehicalObj, function (value, key) {
              $scope.vehicalSearchResultArray.push({vehicalNo: value.vehicalNumber});
            });
            $scope.getVehicalTypeName($scope.booking.vehicalId);
            if ($scope.booking.vehicalType.length == 0)
              $scope.searchButtonEnable = true;
            else
              $scope.searchButtonEnable = false;
          } else if (!response.data.success && response.data.message[0].errorCode == 404) {
            $scope.noVehicalMsg = response.data.message[0].msg;
            var userVehicalObj = response.data.responseData;
            $scope.booking.vehicalId = userVehicalObj[0].vehicalType;
            $scope.user.mobileNo = parseInt(userVehicalObj[0].phoneNo);
            $scope.user.userID = parseInt(userVehicalObj[0].userId);
            $scope.getVehicalTypeName($scope.booking.vehicalId);
            if ($scope.booking.vehicalType.length == 0)
              $scope.searchButtonEnable = true;
            else
              $scope.searchButtonEnable = false;
          } else {
            $scope.vehicalSearchResultArray = [];
            $scope.booking = {};
            $scope.user = {};
            $scope.noVehicalMsg = response.data.message[0].msg;
          }
        });
      };

      $scope.loadCenterGatesFromApi = function () {
        if ($localStorage.gatesArray)
          return;
        if ($localStorage.centerInfo)
          var centerId = $localStorage.centerInfo[0].centerId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-parking-gates/' + centerId).then(function (response) {
          if (response.data.success) {
            var gatesObj = response.data.responseData;
            $scope.centerGateArray = [];
            angular.forEach(gatesObj, function (value, key) {
              $scope.centerGateArray.push(
                {
                  gateID: value.gateId,
                  gateName: value.gateName,
                  gateNo: value.gateNo
                }
              )
            });
            $localStorage.gatesArray = $scope.centerGateArray;
          } else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });
      };

      $scope.registerBooking = function () {
        if (!$localStorage.currentGateId) {
          UtilityService.alertBox("", "You have not selected any Gate", "OK", false);
          return;
        }
        if (!$localStorage.centerInfo) {
          UtilityService.alertBox("", "Some error occured", "OK", false);
          return;
        }

        var centerId = $localStorage.centerInfo[0].centerId;

        if ($localStorage.centerInfo)
          var centerWorkerId = $localStorage.centerInfo[0].parkingWorkerId;

        var data = {
          vehicalType: $scope.booking.vehicalId,
          checkInBy: centerWorkerId,
          checkInGate: $localStorage.currentGateId,
          userBooked: $scope.user.userID,
          centerID: centerId,
          vehicalNumber: $scope.booking.vehicalNo || $scope.user.parkingID
        };
        UtilityService.showLoader("Saving Check In");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "save-checkin", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
            $scope.vehicalSearchResultArray = [];
            $scope.noVehicalMsg = "";
            $scope.booking.vehicalNo = "";
            $scope.user.parkingID = "";
            $scope.user.mobileNo = "";
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.generateCycleParkingID = function () {
        if ($localStorage.centerInfo[0])
          var centerName = $localStorage.centerInfo[0].centerName[0];
        var centerId = $localStorage.centerInfo[0].centerId;
        $scope.user.parkingID = UtilityService.generateRandomCode("1234567890", 4);
        $scope.user.parkingID = centerName + centerId + $scope.user.parkingID;
      };

      $scope.loadVehicalTypes = function () {
        if ($localStorage.vehicalTypes)
          $scope.vehicalTypeArray = $localStorage.vehicalTypes;
      };

      $scope.setCenterGate = function () {
        if ($localStorage.currentGateId)
          $scope.parkingGate.gateId = $localStorage.currentGateId;
        $scope.parkingGatesArray = $localStorage.gatesArray || null;
      };

      $scope.booking = {
        vehicalId: "",
        vehicalType: ""
      };

      // make user search button disable if no vehical type is selected
      $scope.searchButtonEnable = true;

      $scope.buttonClickable = function () {
        $scope.vehicalSearchResultArray = [];
        $scope.noVehicalMsg = "";
        $scope.booking.vehicalNo = "";
        $scope.user.parkingID = "";
        $scope.getVehicalTypeName($scope.booking.vehicalId);
        if ($scope.booking.vehicalType.length == 0)
          $scope.searchButtonEnable = true;
        else
          $scope.searchButtonEnable = false;
      };

      $scope.uncheckVehicals = function () {
        $scope.booking.vehicalNo = false;
      };

      $scope.getCenterInfo = function () {
        UtilityService.customAlertBoxWithTemplate();
      };

      $scope.getVehicalTypeName = function (vehicalId) {
        angular.forEach($scope.vehicalTypeArray, function (val, key) {
          if (vehicalId == val.vehicalTypeId)
            $scope.booking.vehicalType = val.vehicalTypeName;
        })
      };

      $scope.openChangeParkingMode = function () {
        UtilityService.customAlertBoxWithTemplate();
      };

      //CHECKOUT STUFF
      $scope.searchChekedInUser = function () {
        if ($localStorage.centerInfo)
          var centerId = $localStorage.centerInfo[0].centerId;
        var searchCode = $scope.checkOutObj.searchCode;
        UtilityService.showLoader("Searching..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-checkedin-user/' + searchCode + '/' + centerId).then(function (response) {
          UtilityService.hideLoader();
          if (response.data.success) {
            $scope.showCheckOutDataScreen = true;
            $scope.showDiscountMenu = true;
            $scope.checkOutObj.discountAmount = 0;
            $scope.userCheckInData = response.data.responseData[0];
            $localStorage.checkedInUser = $scope.userCheckInData;
            $scope.parkingTotalFare = Math.round($scope.userCheckInData.pricing);
            $scope.roundOffPriceAmount = ($scope.parkingTotalFare - $scope.userCheckInData.pricing).toFixed(2);

            if ($scope.userCheckInData.passes.length > 0) {
              $scope.isAmountByCash = 0;
              $scope.passId = $scope.userCheckInData.passes[0].passId;
              $scope.showDiscountMenu = false;
              $scope.passStatus = "Active";
              $scope.checkOutObj.finalPaymentCash = 0;
            }
            else {
              $scope.passId = 0;
              $scope.isAmountByCash = 1;
              $scope.passStatus = "No pass";
              $scope.checkOutObj.finalPaymentCash = $scope.parkingTotalFare;
            }
          } else {
            $scope.showCheckOutDataScreen = false;
            $scope.showDiscountMenu = false;
            UtilityService.alertBox("", response.data.message[0].msg, "OK", false);
          }
        });
      };

      $scope.checkOutVehical = function () {
        if (!$localStorage.currentGateId) {
          UtilityService.alertBox("", "Please select checkout gate.", "OK", false);
          return;
        }
        if ($localStorage.centerInfo) {
          var centerWorkerId = $localStorage.centerInfo[0].parkingWorkerId;
          var centerId = $localStorage.centerInfo[0].centerId;
        }
        if ($localStorage.checkedInUser)
          var userBooked = $localStorage.checkedInUser.userId;
        var data = {
          bookingID: $scope.userCheckInData.bookingId,
          userBooked: userBooked,
          checkOutDateTime: $scope.userCheckInData.currentDateTime,
          checkOutBy: centerWorkerId,
          checkOutGate: $localStorage.currentGateId,
          discount: parseInt($scope.checkOutObj.discountAmount),
          parkingAmount: $scope.checkOutObj.finalPaymentCash,
          centerId: centerId,
          paidBy: {
            isAmountByCash: $scope.isAmountByCash,
            passId: $scope.passId
          }
        };
        UtilityService.showLoader("Saving Check Out..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "save-booking", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.showCheckOutDataScreen = false;
            $scope.showDiscountMenu = false;
            $scope.userCheckInData = {};
            $scope.checkOutObj.searchCode = "";
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })


      };

      $scope.getCurrentGateName = function () {
        var gateNo = "";
        if ($localStorage.gatesArray && $localStorage.currentGateId)
          angular.forEach($localStorage.gatesArray, function (value, key) {
            if (value.gateID == $localStorage.currentGateId)
              gateNo = value.gateNo;
          });
        return gateNo;
      };

      $scope.applyDiscount = function () {
        if ($scope.checkOutObj.discountAmount < 0) {
          $scope.checkOutObj.discountAmount = 0;
          $scope.isDiscountValueNegative = true;
          return;
        }
        else if ($scope.checkOutObj.discountAmount > $scope.checkOutObj.finalPaymentCash) {
          $scope.showDiscountError = true;
          $scope.checkOutObj.discountAmount = 0;
          return;
        } else if ($scope.checkOutObj.discountAmount == 0) {
          $scope.hideDiscountModal();
          return;
        }
        else {
          $scope.showDiscountError = false;
        }
        $scope.finalPaymentBeforeApplyingDiscount = $scope.checkOutObj.finalPaymentCash;
        $scope.checkOutObj.finalPaymentCash = $scope.checkOutObj.finalPaymentCash - $scope.checkOutObj.discountAmount;
        $scope.hideDiscountModal();
        $scope.isDiscountApplied = true;
      };

      $scope.removeDiscount = function () {
        $scope.checkOutObj.finalPaymentCash = $scope.finalPaymentBeforeApplyingDiscount;
        $scope.checkOutObj.discountAmount = 0;
        $scope.isDiscountApplied = false;
      };

      //ionic modal configuration
      $ionicModal.fromTemplateUrl('views/modals/discount.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.showDiscountModal = function () {
        $scope.modal.show();
      };
      $scope.hideDiscountModal = function () {
        $scope.modal.hide();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      var init = function () {
        ConnectivityMonitor.startWatching();
        checkLoginState();
        $scope.isCheckIn = true;
        if ($localStorage.parkingMode) {
          $scope.barTitle = $localStorage.parkingMode.typeName;
          if ($localStorage.parkingMode.typeID == Config.PARKING_MODES.CHECK_IN)
            $scope.isCheckIn = true;
          else
            $scope.isCheckIn = false;
        }
        $scope.loadCenterGatesFromApi();
        $scope.setCenterGate();
        $scope.loadVehicalTypes();
        UtilityService.hideLoader();

      };
      init();

    }]);
