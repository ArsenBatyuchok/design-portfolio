angular.module('Cunard.fullPage', [])
.directive('fullPage', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var windowHeight = window.innerHeight;

      element.height(windowHeight);
    }
  }
});