angular.module('Cunard.revealSection', [])
.directive('revealSection', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var windowHeight = window.screen.availHeight;

      if (attrs.last === "false") {
        element.css({'margin-bottom': '-' + windowHeight + 'px'});
      }
    }
  }
});