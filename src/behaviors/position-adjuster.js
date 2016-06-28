/**
 * Created by jacek on 28.06.16.
 */

angular.module('netgenes.ng-angular-menu')
    .directive('positionAdjuster', function () {

        return {

            restrict: 'A',
            link : function ( $scope, $element ) {

                var adjusted, adjust, vw, vh, sw, sh;

                vw = document.body.offsetWidth;
                vh = document.body.offsetHeight;


                if ( ! $scope.item.menu )
                    return;

                adjust = function () {

                    if ( adjusted )
                        return;


                    var subMenu = $element[0].querySelector('ul');
                    var subRect = subMenu.getBoundingClientRect();

                    if ( subRect.right > vw ) {

                         console.log('move to left');
                    }

                    if ( subRect.bottom > vh ) {

                        console.log('shift to top');
                    }

                };

                $element.bind('mouseenter', adjust );

            }
        };
    });