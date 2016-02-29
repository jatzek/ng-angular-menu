/**
 * Created by jacek on 29.02.16.
 */


angular.module('netgenes.ng-angular-menu')
.constant('triggeredMenuLinker',function triggeredMenuLink ( attributeName, eventToCatch, positionBuilder ) {

    return function ( menuBuilder, $injector, $compile ) {

        return function( $scope, $element, $attributes ) {

            function addBackdrop( ) {

                var backdropElement = angular.element('<menu-backdrop></menu-backdrop>');

                $compile(backdropElement)($scope);
                angular.element(document.body).append(backdropElement);
                return backdropElement;
            }

            $element.on(eventToCatch, function( $event ) {

                var menuName, menuObject, menuElement, nScope, backdrop, anchor;
                $event.preventDefault();

                anchor = $attributes.anchor || 'left:top';

                menuName = $scope.$eval($attributes[attributeName]);
                menuObject = menuBuilder.build( menuName, $scope );
                menuElement = angular.element('<ng-menu></ng-menu>');

                nScope = $scope.$root.$new();
                nScope.menu = menuObject;

                $compile(menuElement)(nScope);

                backdrop = addBackdrop();
                backdrop.append( menuElement );

                angular.element(document.body).append(backdrop);

                menuElement.css( positionBuilder( $event, menuElement, anchor ));
            });
        }
    }
});