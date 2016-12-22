angular.module('Cunard', [
	'Cunard.services',
    'Cunard.fullPage',
    'Cunard.revealSection'
])
.controller('CunardCtrl', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    var indexReveal = 0;
	$scope.data = null;
    $scope.windowHeight = window.screen.availHeight;

    $q.all([
        dataService.getData('/section-1.json'),
        dataService.getData('/section-2.json')
    ]).then(function (response) {
        $scope.data = response;
    }, function (error) {

    });

    $(document).on('touchmove', function(e) {
        e.preventDefault();
    });

    // navigation
    $('.close-btn').on('click', function () {
        $('.navigation').toggleClass('visible');
    });
    $('.slider').on('click', '.menu-btn', function () {
        $('.navigation').toggleClass('visible');
    });

    $('.close-btn').on('touchstart', function (e) { touchNavToggle(e); });
    $('.slider').on('touchstart', '.menu-btn', function (e) { touchNavToggle(e); });

    $(document).on('touchmove', function(e) {
        e.preventDefault();
    });

    $(document).swipe( {
        //Generic swipe handler for all directions
        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            var length = $('.slide').length;
            var el = $('.slide-active');
            var index = el.data('id');

            function slide(nextIndex, direction) {
                var nextEl = $('.slide[data-id="' + nextIndex + '"]');

                if (nextIndex < 0 || nextIndex >= length) {
                    return;
                }

                if (nextEl.parent('.section').hasClass('black')) {
                    $('body').css('background-color', '#000');
                } else {
                    $('body').css('background-color', '#fff');
                }

                if (nextEl.hasClass('reveal') && direction === 'up') {
                    el.parent('.section').css({transform: 'translateY(-' + $scope.windowHeight + 'px)'});
                } else if (el.hasClass('reveal') && direction === 'down') {
                    nextEl.parent('.section').css({transform: 'translateY(0px)'});
                } else {
                    if (direction === 'down') {
                        indexReveal -= 1;
                    } else if (direction === 'up') {
                        indexReveal += 1;
                    }

                    $('.slider').css({'transform': 'translate3d(0,' + (-($scope.windowHeight*indexReveal)) + 'px , 0)'});
                }

                el.removeClass('slide-active');
                nextEl.addClass('sliding')

                window.setTimeout(function () {
                    nextEl.addClass('slide-active');
                    nextEl.removeClass('sliding');
                }, 300);

                if ($('.navigation').hasClass('visible')) {
                    $('.navigation').removeClass('visible');
                }
            }

            if (direction === 'up') {
                slide(index + 1, direction);
            } else if (direction === 'down') {
                slide(index - 1, direction);
            }
        }
    });

    function touchNavToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.navigation').toggleClass('visible');
    }

}])
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);


