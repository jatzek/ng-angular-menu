/**
 * Created by jacek on 26.02.16.
 */

(function (angular) {


    function triggeredMenuLink ( attributeName, eventToCatch, positionBuilder ) {

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
    }

    angular
        .module('netgenes.ng-angular-menu', ['ng'])
        .provider('menuBuilder', function () {

            var items = {};
            var menus = {};
            var defaultActionHandlerFactory = function() { return angular.noop; };
            var defaultActionHandler;

            var defaultItemDefinition = {

                text : 'menu item',
                action : null,
                menu: null,
                path : null,
                active: true,
                disable: false
            };

            var defaultMenuDefinition = {
                path : null,
                items : [],
                itemSrc : null,
                itemDef : null
            };

            function MenuBuilder( $injector ) {

                function Item( $scope, def, menu, itemSrc ) {

                    if ( angular.isString( def ) ) {

                        def = items[def];
                    }

                    def = Object.assign({},defaultActionHandler,def);

                    var self = this;
                    var actionHandler = menu.getActionsHandler();
                    var path = def.path || menu.path;
                    var itemSource = itemSrc || null;
                    var source = path ? $scope.$eval( path ) : $scope;
                    var locals = {

                        $scope : $scope,
                        $source : source,
                        $itemSource : itemSource
                    };

                    this.text = angular.isFunction( def.text ) ? $injector.invoke(def.text,self,locals) : def.text;
                    this.disable = angular.isFunction( def.disable) ? $injector.invoke(def.disable,self,locals) : def.disable;

                    this.onClick = function( $event ) {

                        if (self.disable) {
                            return;
                        }
                        if (angular.isString(def.action)) {

                            $injector.invoke(actionHandler, self,  Object.assign({$action:def.action},locals));
                        }
                        else if ( angular.isFunction( def.action )) {

                            $injector.invoke( def.action, self, locals);
                        }

                        $scope.$applyAsync(function() {
                            menu.active = false;
                        });

                    }
                }

                function Menu( $scope, def ) {

                    var self = this;

                    this.getActionsHandler = function() {

                        return def.actionHandler || defaultActionHandler;
                    };

                    function _construct() {

                        Object.assign( self, defaultMenuDefinition, def );

                        if (def.items && def.items.length) {

                            self.items = def.items.map(function( def ) {

                                return new Item($scope, def ,self);
                            });
                        }
                        else if (def.itemSrc && def.itemDef) {

                            var itemSrc = $injector.get(def.itemSrc);
                            self.items = itemSrc.map(function( src ) {

                                return new Item($scope, def.itemDef, self, src);
                            });
                        }

                    }
                    _construct();
                }

                function getMenuDefinition( menuDefinition ) {

                    if ( angular.isObject(menuDefinition)) {

                        return menuDefinition;
                    }
                    else if ( angular.isString( menuDefinition ) && menus[ menuDefinition ]) {

                        return menus[ menuDefinition ];
                    }
                    else if (angular.isString( menuDefinition ) && ! menus[ menuDefinition ]) {
                        new Error('MenuBuilder Error! Menu `'+name+'` had not registered',
                            'menu_builder_error:menu_does_not_exists');
                    }
                }

                this.build = function( menuDefinition, $scope ) {

                    return new Menu( $scope, getMenuDefinition( menuDefinition ) );
                }
            }

            this.registerMenuDefinition = function ( name, definition ) {

                if ( menus[ name ] ) {

                    throw new Error('MenuBuilderProvider Error! Menu `'+name+'` already exists.',
                        'menu_builder_provider_error:menu_already_exists');
                }

                menus[ name ] = definition;
                return this;
            };

            this.registerItemDefinition = function ( name, definition ) {

                if ( items[ name ] ) {

                    throw new Error('MenuBuilderProvider Error! Menu Item `'+name+'` already exists.',
                        'menu_builder_provider_error:item_already_exists');
                }

                items[ name ] = definition;
                return this;
            };

            this.setDefaultActionHandlerFactory = function( actionHandlerFactory ) {

                defaultActionHandlerFactory = actionHandlerFactory;
                return this;
            };

            this.$get = function menuBuilderFactory( $injector ) {

                defaultActionHandler = $injector.invoke( defaultActionHandlerFactory );
                return new MenuBuilder( $injector );
            };
        })
        .directive('ngMenu', function() {

            return {
                replace : true,
                restrict : 'E',
                template :
                    '<ul class="ng-menu">' +
                    '   <li ng-class="{ disable : item.disable }" ng-repeat="item in $menu.items track by $index" ng-click="item.onClick($event)">{{ item.text }}</li>' +
                    '</ul>',
                link : function($scope, $element) {

                    $scope.$applyAsync(function () {

                        $scope.$menu = $scope.menu;
                        $scope.$watch('$menu.active', function( n ) {

                            if (n === false) {
                                $element.remove();
                            }
                        })
                    });
                }
            }
        })
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
        })
        .directive('popupMenu', function( menuBuilder, $injector, $compile ) {

            return {
                restrict: 'A',
                link : triggeredMenuLink('popupMenu','click',function  positionBuilder($event, menuEl, anchor ) {
                    var target, x,y, style, h, v, r, m;

                    r = /^(left|right):(top|bottom)$/;
                    if (!r.test(anchor)) {
                        return Error('anchor value must match '+ r.toString());
                    }
                    m = r.exec(anchor);
                    h = m[1];
                    v = m[2];

                    target = $event.target;
                    y = target.offsetTop;
                    x = target.offsetLeft;

                    style =  {
                        position : 'absolute',
                    };
                    style[h] = x + 'px';
                    style[v] = y + 'px';

                    return style;

                })(menuBuilder,$injector,$compile)
            }
        })
        .directive('contextMenu', function( menuBuilder, $injector, $compile ) {
            return {
                restrict : 'A',
                link : triggeredMenuLink('contextMenu','contextmenu',function  positionBuilder($event) {
                    var  top, left;
                    top = $event.y - 16;
                    left = $event.x - 16;

                    return {

                        position : 'absolute',
                        top : top + 'px',
                        left : left + 'px'
                    };
                })(menuBuilder,$injector,$compile)
            }
        })
        .directive('inlineMenu', function( menuBuilder, $injector, $compile ) {
            return {
                restrict : 'E'
            }
        });

})(angular);