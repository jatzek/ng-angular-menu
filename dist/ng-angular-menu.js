angular
    .module('netgenes.ng-angular-menu', ['ng']);
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

                    ls.push( ctx.measureText(item.text).width );
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

                    if ( menuRect.right > documentWidth ) {

                        initialPosition.left = initialPosition.left - menuRect.width;
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
            })(menuBuilder, $injector, $compile, $timeout)
        }
    });
angular
    .module('netgenes.ng-angular-menu')
    .directive('popupMenu', function (menuBuilder, $injector, $compile, $timeout, triggeredMenuLinker) {

        return {
            restrict: 'A',
            link: triggeredMenuLinker('popupMenu', 'click', function positionBuilder($event, menuEl, anchor) {
                var target, style, h, v, r, m, rect;

                r = /^(left|right):(top|bottom)$/;
                if (!r.test(anchor)) {
                    return Error('anchor value must match ' + r.toString());
                }
                m = r.exec(anchor);
                h = m[1];
                v = m[2];

                target = $event.target;
                rect = target.getBoundingClientRect();

                style = {
                    position: 'fixed'
                };
                style[h] = rect.left;
                style[v] = rect.top;

                return style;

            })( menuBuilder, $injector, $compile, $timeout )
        }
    });
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
angular
    .module('netgenes.ng-angular-menu')
    .directive('inlineMenu', function (menuBuilder, $injector, $compile) {
        return {
            restrict: 'E'
        }
    });
angular
    .module('netgenes.ng-angular-menu')
    .directive('ngMenu', function($timeout) {
        return {
            replace : true,
            restrict : 'E',
            template :
            '<ul class="ng-menu">' +
            '   <li class="ng-menu-item" ng-class="{ disable : item.disable, submenu: item.menu }" ng-repeat="item in $menu.items track by $index" ng-click="item.onClick($event)">' +
            '       <div class="icon"></div>' +
            '       <div class="text">{{ item.text }}</div>' +
            '       <div class="submenu-mark"><span ng-if="item.menu"></span></div>' +
            '       <ng-menu ng-if="item.menu" src="item.menu" />' +
            '   </li>' +
            '</ul>',
            scope : {
            },
            link : function($scope, $element, $attributes) {

                $scope.$applyAsync(function () {

                    if ($attributes.src) {

                        $scope.$menu = $scope.$eval('$parent.'+$attributes.src);

                    } else {

                        $scope.$menu = $scope.$parent.menu;
                    }
                });

                $scope.$watch('$menu.active', function( n ) {

                    if (n === false) {

                        $element.remove();
                    }
                });
            }
        }
    });
angular
    .module('netgenes.ng-angular-menu')
    .provider('menuBuilder', function MenuBuilderProvider() {


        var self = this;
        var items = {};
        var menus = {};
        var defaultActionHandlerFactory = function () {
            return angular.noop;
        };
        var defaultActionHandler;
        var defaultItemsProvider;

        var defaultItemDefinition = {

            text: 'menu item',
            action: null,
            menu: null,
            path: null,
            active: true,
            disable: false
        };

        var defaultMenuDefinition = {
            path: null,
            items: [],
            itemSrc: null,
            itemDef: null
        };

        function MenuBuilder($injector) {

            function Item($scope, def, menu, itemSrc) {

                if (angular.isString(def)) {

                    def = items[def];
                }

                def = Object.assign({}, defaultActionHandler, def);

                var self = this;
                var actionHandler = menu.getActionsHandler();
                var path = def.path || menu.path;
                var itemSource = itemSrc || null;
                var source = path ? $scope.$eval(path) : $scope;
                var locals = {

                    $scope: $scope,
                    $source: source,
                    $itemSource: itemSource
                };

                this.text = angular.isFunction(def.text) ? $injector.invoke(def.text, self, locals) : def.text;
                this.disable = angular.isFunction(def.disable) ? $injector.invoke(def.disable, self, locals) : def.disable;

                if (def.menu) {

                    this.menu = new Menu( $scope, getMenuDefinition(def.menu));
                }


                this.onClick = function ($event) {

                    $event.preventDefault();

                    if (self.disable) {
                        return;
                    }
                    if (angular.isString(def.action)) {

                        $injector.invoke(actionHandler, self, Object.assign({$action: def.action}, locals));
                    }
                    else if (angular.isFunction(def.action)) {

                        $injector.invoke(def.action, self, locals);
                    }

                    $scope.$applyAsync(function () {
                        menu.active = false;
                    });
                }
            }

            function Menu($scope, def) {

                var self = this;

                this.getActionsHandler = function () {

                    return def.actionHandler || defaultActionHandler;
                };

                function _construct() {

                    Object.assign(self, defaultMenuDefinition, def);

                    if (def.items && def.items.length) {

                        self.items = def.items.map(function (def) {

                            return new Item($scope, def, self);
                        });
                    }
                    else if (def.itemSrc && def.itemDef) {

                        var itemSrc = defaultItemsProvider.get( def.itemSrc );
                        self.items = itemSrc.map(function (src) {

                            return new Item($scope, def.itemDef, self, src);
                        });
                    }

                }

                _construct();
            }

            function getMenuDefinition(menuDefinition) {

                if (angular.isObject(menuDefinition)) {

                    return menuDefinition;
                }
                else if (angular.isString(menuDefinition) && menus[menuDefinition]) {

                    return menus[menuDefinition];
                }
                else if (angular.isString(menuDefinition) && !menus[menuDefinition]) {
                    new Error('MenuBuilder Error! Menu `' + name + '` had not registered',
                        'menu_builder_error:menu_does_not_exists');
                }
            }

            this.build = function (menuDefinition, $scope) {

                return new Menu($scope, getMenuDefinition(menuDefinition));
            }
        }

        this.registerMenuDefinition = function (name, definition) {

            if (menus[name]) {

                throw new Error('MenuBuilderProvider Error! Menu `' + name + '` already exists.',
                    'menu_builder_provider_error:menu_already_exists');
            }

            menus[name] = definition;
            return this;
        };

        this.registerItemDefinition = function (name, definition) {

            if (items[name]) {

                throw new Error('MenuBuilderProvider Error! Menu Item `' + name + '` already exists.',
                    'menu_builder_provider_error:item_already_exists');
            }

            items[name] = definition;
            return this;
        };

        this.addItems = function (items) {

            angular.forEach( items, function( item, id ) {

                self.registerItemDefinition( id, item );
            });
            return this;
        };

        this.setDefaultActionHandlerFactory = function (actionHandlerFactory) {

            defaultActionHandlerFactory = actionHandlerFactory;
            return this;
        };

        this.setDefaultItemsProvider = function( itemsProviderName ) {

            defaultItemsProvider = itemsProviderName;
            return this;
        };

        this.$get = function menuBuilderFactory($injector) {

            defaultActionHandler = $injector.invoke(defaultActionHandlerFactory);

            if (typeof defaultItemsProvider === 'undefined') {
                defaultItemsProvider = $injector;
            } else {
                defaultItemsProvider = $injector.get(defaultItemsProvider);
            }

            return new MenuBuilder($injector);
        };
    })