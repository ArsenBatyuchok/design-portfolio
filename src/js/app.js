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
                        onLeave: function (index, nextIndex, direction) {
                            var currentSlide = $($('.section')[index - 1]);
                            var nextSlide = $($('.section')[nextIndex - 1]);

                            if (direction === 'down') {
                                currentSlide.addClass('on-leave-down');
                                nextSlide.addClass('on-enter-down');

                                if (nextSlide.hasClass('first')) {
                                    nextSlide.siblings()
                                             .find('.header, .side-panel')
                                             .fadeOut();

                                    nextSlide.find('.header, .side-panel')
                                             .delay(625)
                                             .fadeIn(500);
                                }
                            } else if (direction === 'up') {
                                currentSlide.addClass('on-leave-up');
                                nextSlide.addClass('on-enter-up');

                                if (nextSlide.hasClass('last')) {
                                    nextSlide.siblings()
                                             .find('.header, .side-panel')
                                             .fadeOut(200);

                                    nextSlide.prevAll('.first')
                                             .first()
                                             .find('.header, .side-panel')
                                             .delay(200)
                                             .fadeIn(1000);


                                }
                            }
                        },
                        afterLoad: function (anchorLink, index) {
                            $('.fp-section').removeClass('on-leave-up on-leave-down on-enter-up on-enter-down');
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


