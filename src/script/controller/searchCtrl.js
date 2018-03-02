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
