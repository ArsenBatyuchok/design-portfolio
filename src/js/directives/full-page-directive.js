angular.module('Cunard.fullPage', [])
.directive('fullPage', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.height(window.innerHeight);

      $(window).on("resize", function() {
        element.height(window.innerHeight);
      });
    }
  }
});