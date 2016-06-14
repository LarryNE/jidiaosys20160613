// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'w5c.validator', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //判断网络状态
    document.addEventListener("deviceready", function() {
      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        var onlineState = networkState;
        console.log("device online...");
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        var offlineState = networkState;
        //提醒用户的网络异常
        $ionicLoading.show({
          template: '网络异常，不能连接到服务器！'
        });
      })

    }, false);
  });
})

.config([
    "w5cValidatorProvider",function(w5cValidatorProvider){

    //全局配置
      w5cValidatorProvider.config({
        blurTrig:true,
        showError:true,
        removeError:true

      });

      w5cValidatorProvider.setRules({
        email:{
          required:"输入的邮箱地址不能为空",
          email:"输入邮箱地址格式不正确"
        },
        username:{
          required:"输入的域账号不能为空",
          pattern:"域账号必须输入字母、数字、下划线,以字母开头",
          w5cuniquecheck:"输入域账号已经存在，请重新输入"
        },
        password:{
          required:"密码不能为空",
          minlength:"密码长度不能小于{minlength}",
          maxlength:"密码长度不能大于{maxlength}"
        },
        repeatPassword:{
          required:"重复密码不能为空",
          repeat:"两次密码输入不一致"
        },
        number:{
          required:"数字不能为空"
        },
        customizer:{
          customizer:"自定义验证数字必须大于上面的数字"
        }
      });
    }
])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  //解决andorid tab 在顶部的问题
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('seturl', {
    url: '/seturl',
    templateUrl: 'templates/seturl.html',
    controller: 'SetUrlCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('plan', {
    url: '/plan/:taskname/:taskid',
    //cache:false,
    templateUrl: 'templates/plan.html',
    controller: 'PlanCtrl'
  })

  .state('task', {
    url: '/task',
    templateUrl: 'templates/task.html',
    controller: 'TaskCtrl'
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  if (localStorage.hassettedurl != 1) {
    $urlRouterProvider.otherwise('/seturl');
    return;
  }

  if (localStorage.hassettedurl == 1) {
    $urlRouterProvider.otherwise('/login');
    return;
  }
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})
