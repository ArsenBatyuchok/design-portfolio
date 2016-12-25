angular.module('Cunard', [
	'Cunard.services',
    'Cunard.fullPage',
    'Cunard.revealSection',
    'Cunard.toTrustedFilter'
])
.controller('CunardCtrl', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    var self = this;
    var timer;
    var didScroll = false;

    this.menuOpened = false;
	this.data = null;
    this.windowHeight = window.screen.availHeight;
    this.activePageName;
    this.subsectionName;

    $q.all([
        dataService.getData('/section-1.json'),
        dataService.getData('/section-2.json')
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

    function defineBodyBackground(el) {
        if (el.hasClass('black')) {
            $('body').css('background-color', '#000');
        } else {
            $('body').css('background-color', '#fff');
        }
    };

    //Slide to section
    this.slideTo = function(sectionPosition) {
        var slideIndex = 1;
        var sections = 1;

        self.data.map(function(section, index) {
            if (section.data.position < sectionPosition) {
                sections += 1;
                slideIndex += section.data.pages.length;

                //Animate headers
                $($('.section')[section.data.position]).find('.header, .side-panel')
                                                       .css({'transform': 'translate3d(0, ' + (self.windowHeight * (slideIndex - 2)) + 'px, 0)',
                                                             'transition': 'none'});
            }
        });

        $('.slider').css({'transform': 'translate3d(0,' + (-(self.windowHeight*slideIndex)) + 'px , 0)',
                          'transition': 'none'});

        $($('.slide')[slideIndex]).parent('.section')
                                  .find('.header, .side-panel')
                                  .css({'transform': 'translate3d(0, 0, 0)',
                                        'transition': 'none'});

        $('.slide-active').removeClass('slide-active');
        $($('.slide')[slideIndex]).addClass('slide-active');

        defineBodyBackground($($('.slide')[slideIndex]).parent('.section'));

        defineHeaderContent(slideIndex, 0);

        self.menuOpened = false;
    };

    // Slide event
    function slidePages(direction) {
        var length = $('.slide').length;
        var el = $('.slide-active');
        var index = el.data('id');

        $scope.$apply(function() {
            self.menuOpened = false;
        });

        function slide(nextIndex, direction) {
            var nextEl = $('.slide[data-id="' + nextIndex + '"]');

            if (nextIndex < 0 || nextIndex >= length) {
                return;
            }

            // Header animation
            animateHeader(el, nextEl, direction, self.windowHeight);

            defineBodyBackground(nextEl.parent('.section'));

            if (nextEl.hasClass('reveal') && direction === 'up') {
                $('.slider').css({'transform': 'translate3d(0,' + (-(self.windowHeight*nextIndex)) + 'px , 0)',
                                  'transition': 'none'});

                el.parent('.section').css({'transform': 'translateY(' + self.windowHeight + 'px)'});
                window.setTimeout(function () {
                    el.parent('.section').css({'transform': 'translateY(0px)',
                                               'transition': 'transform 1s ease'});
                }, 0);

            } else if (el.hasClass('reveal') && direction === 'down') {

                nextEl.parent('.section').css({'transform': 'translateY(' + self.windowHeight + 'px)',
                                               'transition': 'transform 1s ease'});
                
                window.setTimeout(function () {
                    $('.slider').css({'transform': 'translate3d(0,' + (-(self.windowHeight*nextIndex)) + 'px , 0)',
                                      'transition': 'none'});
                    nextEl.parent('.section').css({'transform': 'translateY(0px)',
                                               'transition': 'none'});
                }, 1000);
            } else {
                $('.slider').css({'transform': 'translate3d(0,' + (-(self.windowHeight*nextIndex)) + 'px , 0)',
                                  'transition': 'transform 1s ease'});
            }

            addAnimationClasses(el, nextEl);
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

    function animateHeader(el, next, direction, windowHeight) {
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
            el.parent('.section').find('.header, .side-panel').css({'transform': 'translate3d(0, ' + (windowHeight * (sectionIndex + 1)) + 'px, 0)',
                                                                    'transition': 'transform 1s ease'});
        } else if (direction === 'down') {
            next.parent('.section').find('.header, .side-panel').css({'transform': 'translate3d(0, ' + (windowHeight * (sectionIndex - 1)) + 'px, 0)',
                                                                      'transition': 'transform 1s ease'});
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


