#Angular Menu 0.2.1#

Build your menus through configuration
## Usage ##
```js

angular.module('app',['netgenes.ng-angular-menu'])

    .config( function ( menuBuilderProvider ) {  
        
        menuBuilderProvider
            .addItems({
                //static item
                item1 : {
                    text : 'Static Text',
                    action : 'predefined:action',
                },
                //dynamic item
                item2 : {
                    /* @return string title*/
                    text: function( $source, anyRegisteredService1, anyRegisteredServiceN) {
                        //some logic
                        return $source.name
                    },
                    disabled : function($source) {
                        //some logic
                        return source.someFlag
                    },
                    action : function specialAction( $source, $scope, anyRegisteredService1) {
                        //some logic 
                    }
                }
            })
            .registerMenuDefinition('menu1', {
                // config based on regular definitions
                path: 'row' // means 'path.in.scope.to.the.source',
                items : [
                    'item1',
                    'item2',
                    {
                        text : 'Extra inline Item',
                        action : 'action:name'
                    }
                ]
            })
            .registerMenuDefinition('menu2', {
                //menu based on external service,
                itemSrc : 'serviceName',
                itemDef : {
                    text : function($source,$itemSource) {
                        return 'Do ' + $itemSource.name + ' on ' + $source.name;
                    },
                    action : 'action:name'
                }
            })
            .registerMenuDefinition('menu3', {
                //nested menu example
                items : [
                    'item1',
                    'item2',
                    {
                        text : 'Do something ',
                        menu : 'menu2' // you can use static or dynamic menus
                    }
                ]
            });
    });

```

when you have definitions you can use these in templates

```html

<li ng-repeat="item in items" context-menu="'menu1'">{{ item.name }}</li>

<button popup-menu="'menu2'"> Show menu 2 </button>

<button ng-init"menuName = 'menu3'" popup-menu="menuName"> Show menu 3</button>

```
### Item options
- text : string or function():string.
- action : string or function():string.
- disable: bool or function():bool
- menu : string menuName

### Menu Options
- path : string // path to logical source relative to $scope where menu directive is placed
- items : array of strings(itemNames) on objects(item definitions)
- itemSrc : string : name od items list in default case is serviceName
- itemDef : object : item configuration passed to each item

### item's properties factory arguments
 - $source any value indicated by 'path'
 - $itemSource single item from item source
 - anyRegisteredServiceN

## Todo
- universal icons support
- dynamic positioning
- theme
- extra parameters