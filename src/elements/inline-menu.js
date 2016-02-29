/**
 * Created by jacek on 29.02.16.
 */
angular
    .module('netgenes.ng-angular-menu')
    .directive('inlineMenu', function (menuBuilder, $injector, $compile) {
        return {
            restrict: 'E'
        }
    });