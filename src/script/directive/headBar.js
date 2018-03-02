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
