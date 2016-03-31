/**
 * Created by jacek on 29.02.16.
 */


angular.module('netgenes.ng-angular-menu')
.constant('triggeredMenuLinker',function triggeredMenuLink ( attributeName, eventToCatch, positionBuilder ) {

    return function ( menuBuilder, $injector, $compile, $timeout ) {

        return function( $scope, $element, $attributes ) {

            function addBackdrop( ) {

                var backdropElement = angular.element('<menu-backdrop></menu-backdrop>');

                $compile( backdropElement )( $scope );
                angular.element(document.body).append(backdropElement);
                return backdropElement;
            }

            function measureItems( menu, element ) {

                var fontFamily = document.defaultView.getComputedStyle(element[0])['fontFamily'];
                var fontSize = document.defaultView.getComputedStyle(element[0])['fontSize'];

                var ls = [];

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                ctx.font = fontSize+' '+fontFamily;


                angular.forEach( menu.items, function(item) {

                    ls.push(ctx.measureText(item.text).width);
                });

                return Math.ceil( Math.max.apply(Math,ls) );
            }

            function measureAdd( $element ) {

                //todo
                return 96;
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

                angular.element( document.body ).append( backdrop );

                var initialPosition = positionBuilder( $event, menuElement, anchor );


                $timeout(function() {

                    var itemWidth = measureItems( menuObject, menuElement );
                    var additionWidth = measureAdd(menuElement);
                    var documentHeight = document.body.offsetHeight;
                    var documentWidth = document.body.offsetWidth;



                    angular.forEach( menuElement[0].querySelectorAll('.text'), function( item ) {

                        angular.element( item ).css({width: itemWidth + 'px'});
                    });


                    menuElement.css({visibility:'visible',width: (itemWidth+additionWidth)+'px'});
                    menuElement.css({left:initialPosition.left+'px',top:initialPosition.top+'px',position:initialPosition.position});


                    var menuRect = menuElement[0].getBoundingClientRect();

                    if ( menuRect.bottom > documentHeight ) {

                        initialPosition.top = initialPosition.top - menuRect.height;
                    }

                    var position = Object.assign({},initialPosition);
                    position.left += 'px';
                    position.top += 'px';
                    menuElement.css(position);
                });
            });
        }
    }
});