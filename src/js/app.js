angular.module('Cunard', [
	'Cunard.services',
    'Cunard.fullPage',
    'Cunard.revealSection',
    'Cunard.toTrustedFilter'
])
.controller('CunardCtrl', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    var timer;
    var didScroll = false;

	$scope.data = null;
    $scope.windowHeight = window.screen.availHeight;

    $q.all([
        dataService.getData('/section-1.json'),
        dataService.getData('/section-2.json')
    ]).then(function (response) {
        $scope.data = response;
    }, function (error) {
        // Error
    });

    window.setTimeout(function() {
        $('.side-panel').css({height: window.innerHeight + 'px'});
    }, 100);
    

    // navigation
    $('.nav-item').on('click', function () {
        $('.navigation').toggleClass('visible');
    });
    $('.slider').on('click', '.menu-btn', function () {
        $('.navigation').toggleClass('visible');
    });

    $('.close-btn, .nav-item').on('touchstart', function (e) { touchNavToggle(e); });
    $('.slider').on('touchstart', '.menu-btn', function (e) { touchNavToggle(e); });

    $(document).on('touchmove', function(e) {
        e.preventDefault();
    });

    // Swipe event
    $(document).swipe( {
        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            if($('.prevent-sliding').length === 0) {
                slidePages(direction);
            }
        }
    });

    // Scroll event
    $(window).on('mousewheel', function(e) {
        clearTimeout(timer);
        timer = setTimeout(function() {
            didScroll = false;
        }, 50);

        if (!didScroll) {
            var direction = e.originalEvent.wheelDelta /120 > 0 ? 'down' : 'up';
            didScroll = true;

            if ($('.prevent-sliding').length === 0) {
                slidePages(direction);
            }
        }
    });

    function defineBodyBackground(el) {
        if (el.hasClass('black')) {
            $('body').css('background-color', '#000');
        } else {
            $('body').css('background-color', '#fff');
        }
    };

    //Slide to section
    $scope.slideTo = function(sectionPosition) {
        var slideIndex = 1;
        var sections = 1;

        $scope.data.map(function(section, index) {
            if (section.data.position < sectionPosition) {
                sections += 1;
                slideIndex += section.data.pages.length;
            }
        });

        $('.slider').css({'transform': 'translate3d(0,' + (-($scope.windowHeight*slideIndex)) + 'px , 0)'});

        $('.slide-active').removeClass('slide-active');
        $($('.slide')[slideIndex]).addClass('slide-active');

        defineBodyBackground($($('.slide')[slideIndex]).parent('.section'));

        if ($('.navigation').hasClass('visible')) {
            $('.navigation').removeClass('visible');
        }
    };

    // Slide event
    function slidePages(direction) {
        var length = $('.slide').length;
        var el = $('.slide-active');
        var index = el.data('id');

        function slide(nextIndex, direction) {
            var nextEl = $('.slide[data-id="' + nextIndex + '"]');

            if (nextIndex < 0 || nextIndex >= length) {
                return;
            }

            // Header animation
            animateHeader(el, index, nextEl, direction, $scope.windowHeight);

            defineBodyBackground(nextEl.parent('.section'));

            if (nextEl.hasClass('reveal') && direction === 'up') {
                $('.slider').css({'transform': 'translate3d(0,' + (-($scope.windowHeight*nextIndex)) + 'px , 0)',
                                  'transition': 'none'});

                el.parent('.section').css({'transform': 'translateY(' + $scope.windowHeight + 'px)'});
                window.setTimeout(function () {
                    el.parent('.section').css({'transform': 'translateY(0px)',
                                               'transition': 'transform 1s ease'});
                }, 0);

            } else if (el.hasClass('reveal') && direction === 'down') {

                nextEl.parent('.section').css({'transform': 'translateY(' + $scope.windowHeight + 'px)',
                                               'transition': 'transform 1s ease'});
                
                window.setTimeout(function () {
                    $('.slider').css({'transform': 'translate3d(0,' + (-($scope.windowHeight*nextIndex)) + 'px , 0)',
                                      'transition': 'none'});
                    nextEl.parent('.section').css({'transform': 'translateY(0px)',
                                               'transition': 'none'});
                }, 1000);
            } else {
                $('.slider').css({'transform': 'translate3d(0,' + (-($scope.windowHeight*nextIndex)) + 'px , 0)',
                                  'transition': 'transform 1s ease'});
            }

            addAnimationClasses(el, nextEl);
            window.setTimeout(function () {
                nextEl.removeClass('prevent-sliding');
            }, 1000);
            nextEl.addClass('prevent-sliding');

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

    function touchNavToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.navigation').toggleClass('visible');
    }

    function animateHeader(el, index, next, direction, windowHeight) {
        var sectionIndex = el.closest('.section').find('.slide').index(el);

        // if there's no header in section (i.e. first)
        if (!(el.parent('.section').find('.header').length > 0)) {
            return;
        }

        // if scrolling up to the next section
        if (el.hasClass('reveal') && direction === 'down') {
            return;
        }

        // if scrolling down to the next section
        if (next.hasClass('reveal') && direction === 'up') {
            return;
        }
        
        if (direction === 'up') {
            el.parent('.section').find('.header, .side-panel').css({'transform': 'translate3d(0, ' + (windowHeight * (sectionIndex + 1)) + 'px, 0)'});
        } else if (direction === 'down') {
            next.parent('.section').find('.header, .side-panel').css({'transform': 'translate3d(0, ' + (windowHeight * (sectionIndex - 1)) + 'px, 0)'});
        }
    }

    function addAnimationClasses(el, nextEl, direction) {
        el.removeClass('slide-active');
        nextEl.addClass('sliding');
        if (direction === 'down') {
            nextEl.addClass('sliding-up');
        } else if (direction === 'up') {
            nextEl.addClass('sliding-down');
        }

        window.setTimeout(function () {
            nextEl.addClass('slide-active');
            nextEl.removeClass('sliding sliding-up sliding-down');
        }, 300);
       
    }

}]);


