angular.module('Cunard', [
	'Cunard.services',
    'Cunard.fullPage'
])
.controller('CunardCtrl', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
	$scope.data = null;

	$q.all([
        dataService.getData('/section-1.json'),
        dataService.getData('/section-2.json')
    ]).then(function (response) {
        $scope.data = response;
	}, function (error) {

	});

    $(document).swipe( {
        //Generic swipe handler for all directions
        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            var length = $('.slide').length;
            var el = $('.slide-active');
            var index = el.data('id');

            function slide(nextIndex) {
                var nextEl = $('.slide[data-id="' + nextIndex + '"]');

                if (nextIndex < 0 || nextIndex >= length) {
                    return;
                }

                $('body').css({'transform': 'translate3d(0,' + (-(window.screen.availHeight * nextIndex)) + 'px , 0)'});
                el.removeClass('slide-active');

                window.setTimeout(function () {
                    nextEl.addClass('slide-active');    
                }, 1000);
            }


            if (direction === 'up') {
                slide(index + 1);
            } else if (direction === 'down') {
                slide(index - 1);
            }
        }
    });
		
}])
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);


