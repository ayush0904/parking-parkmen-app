angular.module('ParkingMensConsole')
  .config(['$stateProvider', '$urlRouterProvider', 'Config', '$ionicConfigProvider', '$cordovaAppRateProvider','$cordovaInAppBrowserProvider',
    function ($stateProvider, $urlRouteProvider, Config, $ionicConfigProvider, $cordovaAppRateProvider,$cordovaInAppBrowserProvider) {

      $stateProvider.state('main', {
        url: '',
        templateUrl: Config.templateUrls.common.footerTabMenu,
        controller: 'FooterTabMenuController',
        abstract: true
      })
        .state('main.dashboard', {
          url: '/dashboard',
          views: {
            "bookingDashboardContent": {
              templateUrl: Config.templateUrls.tabs.booking,
              controller: 'BookingDashboardController'
            }
          }
        })
        .state('main.myAccount', {
          url: '/account',
          views: {
            "accountContent": {
              templateUrl: Config.templateUrls.tabs.account,
              controller: 'MyAccountController'
            }
          }
        })
        .state('main.settings', {
          url: '/settings',
          views: {
            "settingsContent": {
              templateUrl: Config.templateUrls.tabs.settings,
              controller: 'AppSettingsController'
            }
          }
        })
        .state('login', {
          url: '/login',
          templateUrl: Config.templateUrls.authentication.login,
          controller: 'LoginController'
        })
        .state('bookingHistory', {
          url: '/booking-history',
          templateUrl: Config.templateUrls.bookings.bookingHistory,
          controller: 'BookingHistoryController'
        })
        .state('forgetPassword', {
          url: '/forget-password',
          templateUrl: Config.templateUrls.authentication.forgetPassword,
          controller: 'ForgetPasswordController'
        })
        .state('verifyOtp', {
          url: '/verify-otp',
          templateUrl: Config.templateUrls.authentication.verifyOtp,
          controller: 'VerifyOtpController'
        })
        .state('resetNewPassword', {
          url: '/reset-password',
          templateUrl: Config.templateUrls.authentication.changePassword,
          controller: 'ResetPasswordController'
        })
        .state('changePassword', {
          url: '/change-password',
          templateUrl: Config.templateUrls.authentication.changePassword,
          controller: 'ChangePasswordController'
        })
        .state('bookingPayment', {
          url: '/booking-payment',
          templateUrl: Config.templateUrls.bookings.bookingPayment,
          controller: 'BookingPaymentController'
        })

        .state('userProfile', {
          url: '/profile',
          templateUrl: Config.templateUrls.userProfile,
          controller: 'UserProfileController'
        })

        //contact us page
        .state('contactUs', {
          url: '/contact-us',
          templateUrl: Config.templateUrls.contactUs,
          controller: 'ContactUsController'
        })

        .state('createPasses', {
          url: '/create-pass',
          templateUrl: Config.templateUrls.bookings.createPasses,
          controller: 'CreatePassController'
        })
        .state('addQrCode', {
          url: '/add-qr-code',
          templateUrl: Config.templateUrls.bookings.addQrCode,
          controller: 'AddQrCodeController'
        })
        .state('viewQrCode', {
          url: '/view-qr-code',
          templateUrl: Config.templateUrls.bookings.viewQrCode,
          controller: 'ViewQrCodeController'
        })
        .state('viewPasses', {
          url: '/view-pass',
          templateUrl: Config.templateUrls.bookings.viewPasses,
          controller: 'ViewPassController'
        });

      $urlRouteProvider.otherwise('/login');

      // To set the position of tabs to bottom which default to top for android
      $ionicConfigProvider.tabs.position('bottom');

      // To remove the strip from selected tab on android
      $ionicConfigProvider.tabs.style('standard');

      $ionicConfigProvider.views.maxCache(0);

      // transitions
      // $ionicConfigProvider.views.transition('android');

      var defaultOptions = {
        location: 'no',
        clearcache: 'no',
        toolbar: 'no'
      };

      document.addEventListener("deviceready", function () {

        $cordovaInAppBrowserProvider.setDefaultOptions(options)

      }, false);


      //configure default prefrence for app rating
      document.addEventListener("deviceready", function () {
        var prefs = {
          language: 'en',
          appName: 'Parking Mens App',
          androidURL: 'market://details?id=com.kas.group.voilabazar'
        };
        $cordovaAppRateProvider.setPreferences(prefs);
      }, false);
    }]);
