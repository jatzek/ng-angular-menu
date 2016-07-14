/**
 * Created by jacek on 26.02.16.
 */

angular
    .module('app', ['netgenes.ng-angular-menu'])
    .config(function (menuBuilderProvider) {

        menuBuilderProvider
            .addItems(
                {
                    'demo_like': {
                        text: 'Like it',
                        action: 'demo:like'
                    },
                    demo_subscribe: {
                        text: function ($source) {

                            return 'Subscribe "' + $source.name + '"';
                        },
                        action: 'demo:subscribe'
                    },
                    demo_delete: {
                        text: 'Delete It',
                        action: function ($source, $scope) {

                            if (confirm('Are you sure want to delete `' + $source.name + '`')) {

                                $scope.cards.splice($scope.cards.indexOf($source), 1);
                            }
                        }
                    },
                    disable_fixed: {
                        text: 'Constantly disabled',
                        disable: true,
                        action: 'demo:should-not-execute'
                    },
                    disable_responsive: {
                        text: 'Use checkbox to toggle me',
                        action: 'demo:clicked-when-enable',
                        disable: function ($source) {

                            return !$source.isActiveItem;
                        }
                    },
                    item1: {
                        text: 'Standard item 1',
                        action: 'demo:standard-action-1'
                    },
                    item2: {
                        text: 'Standard item 2',
                        action: 'demo:standard-action-3'
                    },
                    item3 :  {
                        text: 'Standard item 3',
                        action: 'demo:standard-action-3'
                    },
                    itemForAdd : {
                        text: 'Item Added To Menu'
                    }
                }
            )
            .registerMenuDefinition('demo_menu1', {
                path: 'card',
                items: [
                    'demo_like',
                    'demo_subscribe',
                    'demo_delete'
                ]
            })
            .registerMenuDefinition('demo_menu2', {
                items: [
                    'disable_fixed',
                    'disable_responsive',
                    'item1',
                    'item2',
                    'item3'
                ]

            })
            .registerMenuDefinition('demo_menu4', {
                items: [
                    'item1',
                    'item2',
                    'item3',
                    {
                        text: 'Set type',
                        menu: 'demo_menu3'
                    }
                ]

            })
            .registerMenuDefinition('demo_menu3', {
                itemSrc: 'types',
                itemDef: {
                    action: 'demo:set-type',
                    text: function ($itemSource) {
                        return $itemSource.name
                    },
                    disable : function($itemSource) {
                        return $itemSource.id % 2;
                    }
                },
                actionHandler: function ($action, $source, $itemSource, $rootScope) {

                    $rootScope.$broadcast('menu-action', 'dynamic', $action, $itemSource);
                }
            })
            .setDefaultActionHandlerFactory(function ($rootScope) {

                return function ($action, $source) {

                    $rootScope.$broadcast('menu-action', 'static', $action, $source);
                }
            })
            .addItemToMenu('demo_menu4', 'itemForAdd');
        
    })
    .constant('types', [
        {id: 1, name: 'Type 1'},
        {id: 2, name: 'Type 2'},
        {id: 3, name: 'Type 3'},
        {id: 4, name: 'Type 4'},
        {id: 5, name: 'Type 5'}
    ])
    .controller('DemoController', function ($scope) {

        $scope.cards = [
            {
                name: 'jacek Placek',
                liked: false,
                subscribed: false
            },
            {
                name: 'Woczek O',
                liked: false,
                subscribed: false
            },
            {
                name: 'Very busy skram majster',
                liked: false,
                subscribed: false
            },
            {
                name: 'Cosmic Luc',
                liked: false,
                subscribed: false
            },
            {
                name: 'Meat Ball',
                liked: false,
                subscribed: false
            }
        ]
    })
    .controller('MonitorController', function ($scope) {

        $scope.monits = [];

        $scope.$on('menu-action', function ($event, type, $action, $source) {


            if (type === 'static') {

                $scope.monits.push({action: $action, source: $source.name});

            } else if (type === 'dynamic') {

                $scope.monits.push({action: $action, source: $source.name});
            }
        });
    });