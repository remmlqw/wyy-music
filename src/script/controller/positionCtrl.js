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
