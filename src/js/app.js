angular.module('Cunard', [
	'Cunard.services'
])
.controller('CunardCtrl', ['$scope', 'dataService', function ($scope, dataService) {
	$scope.data = null;

	dataService.getData('/data.json').
		then(function (response) {
			$scope.data = response.data;
			$scope.$broadcast('DATA_LOADED');
		},
		function (error) {

		});
}])
.directive('initData', ['$timeout', function ($timeout) {
	return {
		restrict: "A",
		link: function ($scope) {
			$scope.$on('DATA_LOADED', function () {
				$timeout(function(){
					$('.fullpage').fullpage({
						fixedElements: '.header, .side-panel',
						scrollingSpeed: 1000
					});
				}, 0);
			});
		}

	};
}])
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);


