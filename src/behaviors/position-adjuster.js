/**
 * Created by jacek on 28.06.16.
 */

angular.module('netgenes.ng-angular-menu')
    .directive('positionAdjuster', function () {

        return {

            restrict: 'A',
            link : function ( $scope, $element ) {

                var adjusted, adjust, vw, vh, sw, sh, styles;

                vw = document.body.offsetWidth;
                vh = document.body.offsetHeight;


                if ( ! $scope.item.menu )
                    return;

                adjust = function () {

                    if ( adjusted ) {

                        return;
                    }

                    var subMenu = $element[0].querySelector('ul');

                    styles = document.defaultView.getComputedStyle( subMenu );

                    var subRect = subMenu.getBoundingClientRect( );

                    if ( subRect.right > vw ) {

                        subMenu.style.left =  '-' + styles.left;
                    }

                    if ( subRect.bottom > vh ) {

                        sh = subRect.bottom - vh;
                        subMenu.style.top = '-' + sh +'px';
                    }
                };

                $element.bind('mouseenter', adjust );

            }
        };
    });