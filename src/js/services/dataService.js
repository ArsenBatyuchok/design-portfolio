angular.module('Cunard.services', [])
.factory('dataService', ['$http', function ($http) {
	var factory = this;
	factory.getData = getData;

	function getData(url) {
		return $http({
			method: 'GET',
			url: url
		});
	}

	return factory;
}]);