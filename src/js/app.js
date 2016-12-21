angular.module('Cunard', [
	'Cunard.services'
])
.controller('CunardCtrl', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
	$scope.data = null;

	$q.all([
        dataService.getData('/section-1.json'),
        dataService.getData('/section-2.json')
    ]).then(function (response) {
        var data = [];

        response.map(function(arr, index) {
            var length = arr.data.pages.length;
            var background = index % 2 === 0 ? false : true;

            arr.data.pages.map(function(page, index) {
                if (index === 0) {
                    page.isFirst = true;
                } else if (index === length - 1) {
                    page.isLast = true;
                }

                if (background) {
                    page.isBackground = true;
                } 

                data.push(page);
            });
        });

        $scope.data = data;
		$scope.$broadcast('DATA_LOADED');
	}, function (error) {

	});
		
}])
.directive('initData', ['$timeout', function ($timeout) {
	return {
		restrict: "A",
		link: function ($scope) {
			$scope.$on('DATA_LOADED', function () {
				$timeout(function(){
					$('.fullpage').fullpage({
						scrollingSpeed: 1000,
                        scrollBar: true,
                        onLeave: function (index, nextIndex) {
                            if (index < nextIndex) {
                                $($('.fp-section')[index - 1]).addClass('on-leave');
                            }

                            if ($($('.fp-section')[nextIndex - 1]).hasClass('first')) {
                                $($('.fp-section')[nextIndex - 1]).siblings()
                                                                  .find('.header, .side-panel')
                                                                  .removeClass('show-block')
                                                                  .css('position', 'absolute');
                                //debugger;
                                $($('.fp-section')[nextIndex - 1]).nextAll('.last')
                                                                  .first()
                                                                  .find('.header, .side-panel')
                                                                  .css('position', 'fixed')
                                                                  .fadeIn(1000);
                            } else if ($($('.fp-section')[nextIndex - 1]).hasClass('last')) {

                            }
                        },
                        afterLoad: function (anchorLink, index) {
                            $('.fp-section').removeClass('on-leave');
                        }
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


