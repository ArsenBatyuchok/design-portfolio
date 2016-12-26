angular.module('Cunard', [
	'Cunard.services',
    'Cunard.fullPage',
    'Cunard.revealSection',
    'Cunard.toTrustedFilter',
    'ngAnimate'
])
.controller('CunardCtrl', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    var self = this;
    var timer;
    var didScroll = false;

    this.activeSlide = 0;
    this.revealIndex = 0;
    this.menuOpened = false;
	this.data = null;
    this.windowHeight = window.innerHeight;
    this.activePageName;
    this.subsectionName;

    $q.all([
        dataService.getData('/section-1.json'),
        dataService.getData('/section-2.json'),
        dataService.getData('/section-3.json'),
        dataService.getData('/section-4.json'),
        dataService.getData('/section-5.json'),
        dataService.getData('/section-6.json'),
        dataService.getData('/section-7.json')
    ]).then(function (response) {
        self.data = response;
    }, function (error) {
        // Error
    });

    //Fix because of avalHeight 
    window.setTimeout(function() {
        $('.side-panel').css({height: window.innerHeight + 'px'});
    }, 100);

    //Prevent scroll on Ipad
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

    //Slide to section
    this.slideTo = function(sectionIndex) {
        var slideIndex = 1;
        var sections = 1;

        self.data.map(function(section, index) {
            if (section.data.position < sectionIndex) {
                var sectionLength = section.data.pages.length;

                sections += 1;
                slideIndex += sectionLength;
            }
        });

        self.revealIndex = sections;
        self.activeSlide = slideIndex;
        self.menuOpened = false;

        defineHeaderContent(slideIndex, 0);
    };

    // Slide event
    function slidePages(direction) {
        var el = $('.slide-active');
        var index = el.data('id');

        $scope.$apply(function() {
            self.menuOpened = false;
        });

        function slide(nextIndex, direction) {
            var nextEl = $('.slide[data-id="' + nextIndex + '"]');

            if (nextIndex < 0 || nextIndex >= 72) {
                 return;
            }

            $scope.$apply(function() {
                self.activeSlide = nextIndex;
            });

            if (nextEl.hasClass('reveal')) {
                if (direction === 'up') {
                    $scope.$apply(function() {
                        self.revealIndex += 1;
                    });
                }
            }

            if (el.hasClass('reveal')) {
                if (direction === 'down') {
                    $scope.$apply(function() {
                        self.revealIndex -= 1;
                    });
                }
            }

            addAnimationClasses(el, nextEl, direction);

            window.setTimeout(function () {
                nextEl.removeClass('prevent-sliding');
            }, 1000);

            nextEl.addClass('prevent-sliding');

            defineHeaderContent(nextIndex, 500);
        }

        if (direction === 'up') {
            slide(index + 1, direction);
        } else if (direction === 'down') {
            slide(index - 1, direction);
        }
    }

    //Define subsection/page name
    function defineHeaderContent(nextIndex, animationTime) {
        self.data.map(function(section) {
            section.data.pages.map(function(page) {
                if (page.id === nextIndex) {

                    //Subsection
                    if (self.subsectionName !== page.subsection) {
                        $('.subsection-name').fadeOut(animationTime).fadeIn(animationTime);

                        window.setTimeout(function () {
                            $scope.$apply(function() {
                                self.subsectionName = page.subsection;
                            });
                        }, animationTime);
                    }

                    //Page
                    if (self.activePageName !== page.content.name) {
                        $('.page-name').fadeOut(animationTime).fadeIn(animationTime);

                        window.setTimeout(function () {
                            $scope.$apply(function() {
                                self.activePageName = page.content.name;
                            });
                        }, animationTime);
                    }
                }
            });
        });
    }

    function addAnimationClasses(el, nextEl, direction) {
        nextEl.addClass('sliding');

        if (direction === 'down') {
            nextEl.addClass('sliding-up');
        } else if (direction === 'up') {
            nextEl.addClass('sliding-down');
        }

        window.setTimeout(function () {
            nextEl.removeClass('sliding sliding-up sliding-down');
        }, 300);
       
    }

}]);


