/**
 * Created by jacek on 29.02.16.
 */
angular
    .module('netgenes.ng-angular-menu')
    .directive('contextMenu', function (menuBuilder, $injector, $compile,$timeout, triggeredMenuLinker) {
        return {
            restrict: 'A',
            link: triggeredMenuLinker('contextMenu', 'contextmenu', function positionBuilder($event) {
                var top, left;
                top = $event.clientY - 24;
                left = $event.clientX - 24;

                return {

                    position: 'fixed',
                    top: top,
                    left: left
                };
            })( menuBuilder, $injector, $compile, $timeout )
        }
    });