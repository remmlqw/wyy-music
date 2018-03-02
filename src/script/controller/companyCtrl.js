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
