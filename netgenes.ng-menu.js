/**
 * Created by jacek on 26.02.16.
 */

(function (angular) {

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
                active: true
            };

            var defaultMenuDefinition = {
                path : null,
                items : []
            };

            function MenuBuilder( $injector, $rootScope ) {

                function Item( $scope, def, menu ) {

                    if ( angular.isString( def ) ) {

                        def = items[def];
                    }
                    var self = this;
                    var actionHandler = menu.getActionsHandler();
                    var path = def.path || menu.path;
                    var source = path ? $scope.$eval( path ) : $scope;
                    var locals = {

                        $scope : $scope,
                        $source : source
                    };

                    this.text = angular.isFunction( def.text ) ? $injector.invoke(def.text,self,locals) : def.text;

                    this.onClick = function( $event ) {

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
                        self.items = def.items.map(function( def ) {

                            return new Item($scope,def,self);
                        });
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
                    '<ul>' +
                    '   <li ng-repeat="item in $menu.items track by $index" ng-click="item.onClick($event)">{{ item.text }}</li>' +
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
        .directive('popupMenu', function( menuBuilder, $injector, $compile ) {

            return {
                restrict: 'A',
                link : function( $scope, $element, $attributes ) {

                    $element.on('click', function( $event ) {

                        $event.preventDefault();

                        var menuName = $scope.$eval($attributes.popupMenu);
                        var menuObject = menuBuilder.build( menuName, $scope );

                        var menuElement = angular.element('<ng-menu></ng-menu>');
                        var nScope = $scope.$root.$new();
                        nScope.menu = menuObject;
                        $compile(menuElement)(nScope);

                        angular.element(document.body).append(menuElement);
                    });
                }
            }
        });

})(angular);