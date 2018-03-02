"use strict";

angular.module('app',['ui.router','ngCookies' , 'validation']);
'use strict';
angular.module('app').controller('companyCtrl', ['$http', '$state', '$scope', function($http, $state, $scope){
  $http.get('data/company.json?id='+$state.params.id).success(function(resp){
    $scope.company = resp;
//  $scope.$broadcast("abc",{id:1});//向下进行广播
    
  });
//$scope.$on("cba",function(event,data){//接收广播
//		console.log(event,data);
//	})
}]);

'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('data/myFavorite.json').success(function(resp) {
    $scope.list = resp;
  });
}]);

'use strict';
angular.module('app').controller('loginCtrl', ['cache', '$state', '$http', '$scope', function(cache, $state, $http, $scope){
  $scope.submit = function() {
    $http.post('data/login.json', $scope.user).success(function(resp){
      cache.put('id',resp.id);
      cache.put('name',resp.name);
      cache.put('image',resp.image);
      $state.go('main');
    });
  }
}]);

'use strict';
angular.module('app').controller('mainCtrl', ['$http','$scope', function($http,$scope){
	$http.get('/data/positionList.json').success(function(resp){
		$scope.list = resp;
	});
}]);

'use strict';
angular.module('app').controller('meCtrl', ['$state', 'cache', '$http', '$scope', function($state, cache, $http, $scope){
  if(cache.get('name')) {
    $scope.name = cache.get('name');
    $scope.image = cache.get('image');
  }
  $scope.logout = function() {
    cache.remove('id');
    cache.remove('name');
    cache.remove('image');
    $state.go('main');
  };
}]);

'use strict';
angular.module('app').controller('positionCtrl', ['$q','$http','$state','$scope','cache', function($q,$http,$state,$scope,cache){
//	cache.put('to','day');//写cookie
//	cache.remove('to','day');//读cookie
	$scope.isLogin = false;
	
	//先得到职位信息再得到公司信息
	function getPosition(){
		var def = $q.defer();
		//请求职位信息
		//$state.params.id获取路由传过来的参数
		$http.get('data/position.json?id='+$state.params.id).success(function(resp){
			$scope.position = resp;
			def.resolve(resp);
		}).error(function(err){
			def.reject(err);
		});
		return def.promise;
	}
	
	function getCompany(id) {
	  //通过id请求公司的信息
	  $http.get('data/company.json?id='+id).success(function(resp){
	    $scope.company = resp;
	  })
	}
	getPosition().then(function(obj){ //obj就是上面resolve的参数resp
    	getCompany(obj.companyId);//获取公司id
  	});
	
}]);

'use strict';
angular.module('app').controller('postCtrl', ['$http', '$scope', function($http, $scope){
  $scope.tabList = [{
    id: 'all',
    name: '全部'
  }, {
    id: 'pass',
    name: '面试邀请'
  }, {
    id: 'fail',
    name: '不合适'
  }];
  $http.get('data/myPost.json').success(function(res){
    $scope.positionList = res;
  });
  $scope.filterObj = {};
  $scope.tClick = function(id, name) {
    switch (id) {
      case 'all':
        delete $scope.filterObj.state;
        break;
      case 'pass':
        $scope.filterObj.state = '1';
        break;
      case 'fail':
        $scope.filterObj.state = '-1';         
        break;
      default:

    }
  }
}]);

'use strict';
angular.module('app').controller('registerCtrl', ['$interval', '$http', '$scope', '$state', function($interval, $http, $scope, $state){
  $scope.submit = function() {
    $http.post('data/regist.json',$scope.user).success(function(resp){
    	//注册成功之后跳转登录页面
    	console.log(resp);
        $state.go('login');
    });
  };
  var count = 60;
  $scope.send = function() {
    $http.get('data/code.json').success(function(resp){
      if(1===resp.state) {
        count = 60;
        $scope.time = '60s';
        var interval = $interval(function() {
          if(count<=0) {
            $interval.cancel(interval);
            $scope.time = '';
          } else {
            count--;
            $scope.time = count + 's';
          }
        }, 1000);
      }
    });
  }
}]);

'use strict';
angular.module('app').controller('searchCtrl', ['$http','$scope', function($http,$scope){
	$scope.name = '';
	$scope.search = function(){
		$http.get('data/positionList.json').success(function(resp){
			$scope.positionList = resp;
		})
	}
	$scope.search();
	$scope.sheet = {};
	$scope.tabList = [{
		id : 'city',
		name : '城市'
	},{
		id : 'salary',
		name : '薪水'
	},{
		id : 'scale',
		name : '公司规模'
	}];
	$scope.filterObj = {};
	var tabId = "";//记录点击了哪个页卡
	//点击城市/薪水/公司规模三个页卡中的其中一个
	$scope.tClick = function(id,name) {
	  tabId = id;
	  var dict = {};
	  $http.get('data/city.json').success(function(resp){
	    dict.city = resp;
	    if("city" == id) {
	    	$scope.sheet.list = dict[id];
	    }
	  });
	  $http.get('data/salary.json').success(function(resp){
	    dict.salary = resp;
	    if("salary" == id) {
	    	$scope.sheet.list = dict[id];
	    }
	  });
	  $http.get('data/scale.json').success(function(resp){
	    dict.scale = resp;
	    if("scale" == id) {
	    	$scope.sheet.list = dict[id];
	    }
	  });
//		console.log(id,name);
//		$scope.sheet.list = dict[id];
		$scope.sheet.visible = true;
	};
	
	//点击sheet中的某一项
	$scope.sClick = function(id,name) {
//		console.log(id,name)
		if(id) {
			angular.forEach($scope.tabList,function(item) {
				if(item.id === tabId) {
					item.name = name;//把选项卡的名字换掉
				}
			});
			$scope.filterObj[tabId+'Id'] = id;
		}
		else {//点击"全国"，"不限"的时候 没有id   --  还原选项卡名字
			delete $scope.filterObj[tabId+'Id'];
			angular.forEach($scope.tabList,function(item) {
				if(item.id === tabId) {
					switch(item.id) {
						case 'city':
							item.name = "城市";
							break;
						case 'salary':
							item.name = "薪水";
							break;
						case 'scale':
							item.name = "公司规模";
							break;
						default:
					}
				}
			})
		}
	}
}]);

'use strict';
//定义dict全局变量
angular.module('app').value('dict', {}).run(['dict', '$http', function(dict, $http){
  $http.get('data/city.json').success(function(resp){
    dict.city = resp;
  });
  $http.get('data/salary.json').success(function(resp){
    dict.salary = resp;
  });
  $http.get('data/scale.json').success(function(resp){
    dict.scale = resp;
  });
}]);

'use strict';
angular.module('app').config(['$provide', function($provide){
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
  	//把angular的post请求改为get请求在发送
    $delegate.post = function(url, data, config) {
      var def = $q.defer();
      $delegate.get(url).success(function(resp) {
        def.resolve(resp);
      }).error(function(err) {
        def.reject(err);
      });
      return {
        success: function(cb){
          def.promise.then(cb);
        },
        error: function(cb) {
          def.promise.then(null, cb);
        }
      }
    }
    return $delegate;
  }]);
}]);

'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'view/main.html',
    controller: 'mainCtrl'
  }).state('position',{
  	url : '/position/:id',
  	templateUrl : 'view/position.html',
  	controller : 'positionCtrl'
  }).state('company',{
  	url : '/company/:id',
  	templateUrl : 'view/company.html',
  	controller : 'companyCtrl'
  }).state('search', {
    url: '/search',
    templateUrl: 'view/search.html',
    controller: 'searchCtrl'
  }).state('login', {
    url: '/login',
    templateUrl: 'view/login.html',
    controller: 'loginCtrl'
  }).state('register', {
    url: '/register',
    templateUrl: 'view/register.html',
    controller: 'registerCtrl'
  }).state('me', {
    url: '/me',
    templateUrl: 'view/me.html',
    controller: 'meCtrl'
  }).state('post', {
    url: '/post',
    templateUrl: 'view/post.html',
    controller: 'postCtrl'
  }).state('favorite', {
    url: '/favorite',
    templateUrl: 'view/favorite.html',
    controller: 'favoriteCtrl'
  });
  $urlRouterProvider.otherwise('main');
}])

'use strict';
angular.module('app').config(['$validationProvider', function($validationProvider) {
  var expression = {
    phone: /^1[\d]{10}$/,
    password: function(value) {
      var str = value + ''
      return str.length > 5;
    },
    required: function(value) {
      return !!value;
    }
  };
  var defaultMsg = {
    phone: {
      success: '',
      error: '必须是11位手机号'
    },
    password: {
      success: '',
      error: '长度至少6位'
    },
    required: {
      success: '',
      error: '不能为空'
    }
  };
  $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);

'use strict';
angular.module('app').directive('appCompany', [function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/company.html',
    scope : {
    	com : '='
    }
  };
}]);

'use strict';
angular.module('app').directive('appFoot', [function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/foot.html'
  }
}]);

'use strict';
angular.module('app').directive('appHead',[function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/head.html'
  };
}]);

'use strict';
angular.module('app').directive('appHeadBar', [function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/headBar.html',
    scope : {
    	text : '@'
    },
    link : function($scope) {
    	$scope.back = function(){//点击返回按钮
    		window.history.back();
    	};
//  	$scope.$on("abc",function(event,data){//接收广播
//  		console.log(event,data);
//  	});
//  	$scope.$emit("cba",{name:2});//向上发送广播
    }
  };
}]);

'use strict';
angular.module('app').directive('appPositionClass', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope : {
    	com : '='
    },
    templateUrl: 'view/template/positionClass.html',
    link : function($scope){
    	$scope.showPositionList = function(index){
    		$scope.positionList = $scope.com.positionClass[index].positionList;
    		$scope.isActive = index;
    	}
    	//尽量少用watch 影响性能
    	//监控$scope中com的变化（因为有可能执行$scope.showPositionList(0);语句的时候，控制器还在发送ajax请求，com还没有初始化）
    	$scope.$watch('com', function(newVal){
        if(newVal) $scope.showPositionList(0);
      });
    }
  };
}]);

'use strict';
angular.module("app").directive('appPositionInfo', ['$http', function($http){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionInfo.html',
    scope : {
    	isActive : '=',
    	isLogin : '=',
    	pos : '='
    },
    link : function($scope) {
    	$scope.imagePath = $scope.isActive ? 'image/star-active.png' : 'image/star.png';
    }
  }
}]);

'use strict';
angular.module('app').directive('appPositionList', ['cache', '$http', function(cache,$http){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionList.html',
    scope: {
      data: '=',
      filterObj: '='
    },
    link: function($scope) {
    	$scope.name = cache.get('name') || '';
      $scope.select = function(item) {
        $http.post('data/favorite.json', {
          id: item.id,
          select: !item.select
        }).success(function(resp){
          item.select = !item.select;
        })
      };
    }
  };
}]);

'use strict';
angular.module('app').directive('appSheet', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope : {
    	list : "=",
    	visible : '=',
    	select : '&'
    },
    templateUrl: 'view/template/sheet.html'
  };
}]);

"use strict"
angular.module('app').directive('appTab',[function(){
	return {
		restrict : 'A',
		replace : true,
		scope : {
			list : '=',
			tabClick : '&'
		},
		templateUrl : 'view/template/tab.html',
		link : function($scope) {
			$scope.click = function(tab) {
				$scope.selectId = tab.id;
//				console.log(tab)
				$scope.tabClick(tab);
			}
		}
	}
}])

"use strict"
angular.module('app').filter('filterByObj',[function(){
	return function(list,obj) {
		var result = [];
		angular.forEach(list,function(item) {
			var isEqual = true;
			for(var e in obj) {
				if(item[e]!==obj[e]) {
					isEqual = false;
				}
			}
			if(isEqual) {
				result.push(item);
			}
		});
		return result;
	};
}]);

'use strict';
//自定义服务
angular.module('app').service('cache', ['$cookies', function($cookies){
    this.put = function(key, value){
      $cookies.put(key, value);
    };
    this.get = function(key) {
      return $cookies.get(key);
    };
    this.remove = function(key) {
      $cookies.remove(key);
    };
}]);
