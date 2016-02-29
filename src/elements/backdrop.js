/**
 * Created by jacek on 29.02.16.
 */
angular
    .module('netgenes.ng-angular-menu')
    .directive('menuBackdrop', function() {

        return {
            restrict : 'E',
            replace : true,
            template : '<div class="menu-backdrop" ng-click="backdropCtrl.close($event)"></div>',
            controllerAs : 'backdropCtrl',
            controller : function( $scope, $element ) {

                this.close = function( $event ) {
                    $event.preventDefault();
                    $element.remove();
                };
            }
        }
    });