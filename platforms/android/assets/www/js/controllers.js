angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, $ionicNavBarDelegate, LoginService, $ionicLoading) {
  checkLoginStatus($state, $ionicNavBarDelegate);

  getNeedDeal(LoginService, $scope, $ionicLoading);

  $scope.doRefresh = function() {
    LoginService.getNeedDeal().success(function(retData) {
      $scope.items = retData.data;
      $scope.$broadcast('scroll.refreshComplete');
    }).error(function(data){
      $scope.$broadcast('scroll.refreshComplete');
      var alertPopup = $ionicPopup.alert({
        title: '数据获取失败!',
        template: data
      });
    });

    getNeedDeal(LoginService, $scope, $ionicLoading);
  };

  $scope.goplan = function(taskname, taskid) {
    $state.go("plan", {taskname:taskname, taskid:taskid});
  }
})

.controller('PlanCtrl', function($scope, $state, $log, $stateParams, $ionicNavBarDelegate, $ionicHistory) {
  $log.debug('Plan ctrl', $stateParams);

  checkLoginStatus($state, $ionicNavBarDelegate);

  $ionicNavBarDelegate.showBar(true);
  $scope.data = { noticeName:$stateParams.noticeName, taskname:$stateParams.taskname, taskid:$stateParams.taskid,};

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }
})

.controller('ChatsCtrl', function($scope, Chats, $state, $ionicNavBarDelegate) {
  checkLoginStatus($state, $ionicNavBarDelegate);

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $state, $ionicNavBarDelegate) {
  checkLoginStatus($state, $ionicNavBarDelegate);

  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $state, $ionicNavBarDelegate) {
  checkLoginStatus($state, $ionicNavBarDelegate);

  $scope.clearUrl = function() {
    excuteClearUrl($state, $ionicNavBarDelegate);
  }

  $scope.logOut = function() {
    localStorage.account = '';
    localStorage.token = '';
    localStorage.userid = '';
    localStorage.role = '';
    localStorage.haslogin = 0;

    $ionicNavBarDelegate.showBar(false);
    $state.go("login");
  }
})

.controller('LoginCtrl', function($scope, $ionicPopup, $state, LoginService, $ionicLoading, $ionicNavBarDelegate) {
  if (localStorage.hassettedurl != 1) {
    $state.go("seturl");
  }

  if (localStorage.haslogin == 1) {
    $state.go("tab.dash");
  }

  $ionicNavBarDelegate.showBar(false);

  var account = localStorage.account;
  $scope.data = {account:account};

  $scope.login = function (data) {
    var account = data.account;
    var pwd = data.password;
    var message = '';

    if (account == ''){
      message = "账号不能为空！";
    }

    if (pwd == ''){
      message = "密码不能为空！";
    }

    if(message == ''){
      $ionicLoading.show();
      LoginService.login(account, pwd).success(function() {
        $ionicLoading.hide();
        $state.go("tab.dash");
      }).error(function(data){
        $ionicLoading.hide();
        message = data;

        var alertPopup = $ionicPopup.alert({
          title: '登录失败!',
          template: message
        });
      });

    }
    else {
      var alertPopup = $ionicPopup.alert({
        title: '登录失败!',
        template: message
      });
    }
  };

  $scope.clearUrl = function() {
    excuteClearUrl($state, $ionicNavBarDelegate);
  }
})

.controller('SetUrlCtrl', function($scope, $ionicPopup, LoginService, $state, $ionicLoading, $ionicNavBarDelegate) {
  if (localStorage.hassettedurl == 1) {
    $state.go("login");
  }

  $scope.data = {
    //url:"http://192.168.31.222"
    //url:"10.20.72.140"
    url:"http://10.20.115.89"
  };

  $ionicNavBarDelegate.showBar(false);

  $scope.setting = function (data) {
    if (data.url == null || data.url == undefined || data.url == ''){
      var alertPopup = $ionicPopup.alert({
        title: '设置失败!',
        template: '无效的服务器地址！'
      });
    }
    else {
      $ionicLoading.show();
      LoginService.seturl(data.url).success(function() {
        localStorage.hassettedurl = 1;
        localStorage.serverurl = data.url;
        $ionicLoading.hide();
        $state.go("login");
      }).error(function(){
        $ionicLoading.hide();
        localStorage.hassettedurl = 0
        localStorage.serverurl = '';
        var alertPopup = $ionicPopup.alert({
          title: '设置失败!',
          template: '无效的服务器地址！'
        });
      });
    }
  };
});

function excuteClearUrl($state, $ionicNavBarDelegate) {
  localStorage.hassettedurl = 0
  localStorage.serverurl = '';
  localStorage.haslogin = 0;

  $ionicNavBarDelegate.showBar(false);
  $state.go("seturl");
}

function checkLoginStatus($state, $ionicNavBarDelegate) {
  if (localStorage.hassettedurl != 1) {
    $ionicNavBarDelegate.showBar(false);
    $state.go("seturl");
  }

  if (localStorage.haslogin != 1) {
    $ionicNavBarDelegate.showBar(false);
    $state.go("login");
  }
}

function getNeedDeal(LoginService, $scope, $ionicLoading) {
  $ionicLoading.show();

  LoginService.getNeedDeal().success(function(retData) {
    $ionicLoading.hide();
    $scope.items = retData.data;
    $scope.$broadcast('scroll.refreshComplete');
  }).error(function(data){
    $ionicLoading.hide();
    $scope.$broadcast('scroll.refreshComplete');
    var alertPopup = $ionicPopup.alert({
      title: '登录失败!',
      template: data
    });
  });
}
