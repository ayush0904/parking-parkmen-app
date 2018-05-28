angular.module("APP_CONSTANTS", [])
  .constant("Config", {

    // "BASE_URL": "http://192.168.1.33:3000/",
    "BASE_URL": "http://192.169.197.217:3000/",

    "USER_ROLES": {
      "SUPERADMIN": 4,
      "ADMIN": 1,
      "PARKMAN": 3,
      "USER": 2
    },

    "PARKING_MODES": {
      "CHECK_IN": 1,
      "CHECK_OUT": 2
    },

    "templateUrls": {

      "authentication": {
        "login": "views/authentication/login/login.html",
        "changePassword": "views/authentication/changePassword/change-password.html",
        "forgetPassword": "views/authentication/forgetPassword/forget-password.html",
        "verifyOtp": "views/authentication/verifyOtp/verify-otp.html"
      },

      "common": {
        "footerTabMenu": "views/common/footer-tab-menu.html"
      },

      "tabs": {
        "booking": "views/booking/booking.html",
        "account": "views/account/account.html",
        "settings": "views/settings/settings.html"
      },

      "userProfile": "views/account/profile/profile.html",
      "contactUs": "views/settings/contactUs/contact-us.html",
      "bookings": {
        "bookingPayment": "views/payment/booking-payment.html",
        "createPasses": "views/booking/passes/createPasses/create-pass.html",
        "viewPasses": "views/booking/passes/viewPasses/view-passes.html",
        "bookingHistory": "views/booking/bookingHistory/booking-history.html",
        "addQrCode": "views/booking/addQrCode/add-qr-code.html",
        "viewQrCode": "views/booking/viewQrCode/view-qr-codes.html"
      }
    }

  });
