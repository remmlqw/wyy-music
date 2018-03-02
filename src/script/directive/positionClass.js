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
