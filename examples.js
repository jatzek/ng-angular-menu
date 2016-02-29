/**
 * Created by jacek on 26.02.16.
 */

angular
    .module('app',['netgenes.ng-angular-menu'])
    .config(function( menuBuilderProvider ) {

        menuBuilderProvider
            .registerItemDefinition('demo_like',{

                text : 'Like it',
                action : 'demo:like'
            })
            .registerItemDefinition('demo_subscribe', {

                text : function( $source ) {

                    return 'Subscribe ' + $source.name;
                },
                action : 'demo:subscribe'
            })
            .registerItemDefinition('demo_delete', {

                text : 'Delete It',
                action : function ( $source, $scope ) {

                    if ( confirm('Are you sure want to delete `' +  $source.name + '`') ) {

                        $scope.cards.splice( $scope.cards.indexOf( $source ),1);
                    }
                }
            })
            .registerMenuDefinition('demo_menu', {
                path : 'card',
                items : [
                    'demo_like',
                    'demo_subscribe',
                    'demo_delete'
                ]
            })
            .setDefaultActionHandlerFactory(function( $rootScope ) {

                return function ( $action, $source ) {

                    $rootScope.$broadcast('menu-action',$action,$source);
                }
            });
    })
    .controller('DemoController', function( $scope ) {

        $scope.cards = [
            {
                name : 'jacek Placek',
                liked : false,
                subscribed : false
            },
            {
                name : 'Woczek O',
                liked: false,
                subscribed : false
            },
            {
                name : 'Very busy skram majster',
                liked: false,
                subscribed : false
            },
            {
                name : 'Cosmic Luc',
                liked: false,
                subscribed : false
            },
            {
                name : 'Meat Ball',
                liked: false,
                subscribed : false
            }
        ]
    })
    .controller('MonitorController', function( $scope ) {

        $scope.monits = [];

        $scope.$on('menu-action', function($event,$action,$source) {

            $scope.monits.push({action:$action,source:$source.name});
        });
    });