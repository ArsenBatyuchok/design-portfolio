angular.module('Cunard.fullPage', [])
.directive('fullPage', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var slideHeight = window.screen.availHeight;

      element.height(slideHeight);
    }
  }
});