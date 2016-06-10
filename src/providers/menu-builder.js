/**
 * Created by jacek on 29.02.16.
 */

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