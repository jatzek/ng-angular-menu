/**
 * Created by jacek on 29.02.16.
 */
angular
    .module('netgenes.ng-angular-menu')
    .directive('ngMenu', function() {
        var i = 0;
        return {
            replace : true,
            restrict : 'E',
            template :
            '<ul class="ng-menu">' +
            '   <li ng-class="{ disable : item.disable, submenu: item.menu }" ng-repeat="item in $menu.items track by $index" ng-click="item.onClick($event)">' +
            '       <div class="icon"></div>' +
            '       <div class="text">{{ item.text }}</div>' +
            '       <div class="submenu-mark"><span ng-if="item.menu">&gt;</span></div>' +
            '       <ng-menu ng-if="item.menu" src="item.menu" />' +
            '   </li>' +
            '</ul>',
            scope : {
            },
            link : function($scope, $element, $attributes) {
                console.log('link',++i);

                console.log($scope);
                $scope.$applyAsync(function () {

                    if ($attributes.src) {

                        $scope.$menu = $scope.$eval('$parent.'+$attributes.src);

                    } else {

                        $scope.$menu = $scope.$parent.menu;
                    }

                    $scope.$watch('$menu.active', function( n ) {

                        if (n === false) {
                            $element.remove();
                        }
                    })
                });
            }
        }
    });