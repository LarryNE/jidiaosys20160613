angular.module('starter.services', [])

.service('LoginService', function($q, $http) {
  return {
    seturl:function(url) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      var setResult = new Object();
      url = url + "/api/account/index?"+ "callback=JSON_CALLBACK";
      $http.jsonp(url)
        .success(function(response) {
          setResult = response;
          if (setResult.success == true) {
            deferred.resolve('Welcome ' + name + '!');
          }else {
            deferred.reject('Wrong credentials.');
          }
        })
        .error(function(){
          deferred.reject('Wrong credentials.');
        });

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },
    login:function(account, pwd) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      var loginRet = new Object();
      var url = localStorage.serverurl + "/api/account/Login?account=" +account+ "&pwd="+pwd+"&callback=JSON_CALLBACK";
      $http.jsonp(url)
        .success(function(response) {
          loginRet = response;
          if (loginRet.success == true) {
            localStorage.account = account;
            localStorage.token = loginRet.data.Token;
            localStorage.userid = loginRet.data.UserId;
            localStorage.role = loginRet.data.Role;
            localStorage.haslogin = 1;

            deferred.resolve('Welcome ' + name + '!');
          } else {
            deferred.reject(loginRet.message);
          }
        })
        .error(function() {
          deferred.reject('server error!');
        });

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },
    getNeedDeal:function() {
      var deferred = $q.defer();
      var promise = deferred.promise;

      var uid = localStorage.userid;
      var ret = new Object();
      var url = localStorage.serverurl + "/api/account/GetNeedDeal?uid=" +uid +"&callback=JSON_CALLBACK";
      $http.jsonp(url)
          .success(function(response) {
            ret = response;
            if (ret.success == true) {
              deferred.resolve(ret);
            } else {
              deferred.reject(ret.message);
            }
          })
          .error(function() {
            deferred.reject('server error!');
          });

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },
  }
});
