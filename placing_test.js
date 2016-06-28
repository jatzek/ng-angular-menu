/**
 * Created by jacek on 28.06.16.
 */

angular
    .module('test',['netgenes.ng-angular-menu'])
    .config( function( menuBuilderProvider ) {

        menuBuilderProvider.addItems({

            'i1' : {
                text: 'Item 1'
            },
            'i2' : {
                text: 'Item 2',
                menu: 'sub_menu'
            },
            'i3' : {
                text: 'Item 3'
            },
            'i4' : {
                text: 'Item 4'
            },
            'i5' : {
                text: 'Item 5',
                menu: 'sub_menu'
            },
            'i6' : {
                text: 'Item 6',
                menu: 'sub_menu'
            },
            's1' : {
                text: 'Item 1'
            },
            's2' : {
                text: 'Item 2'
            },
            's3' : {
                text: 'Item 3'
            },
            's4' : {
                text: 'Item 4'
            },
            's5' : {
                text: 'Item 5'
            },
            's6' : {
                text: 'Item 6'
            },
            's7' : {
                text: 'Item 7'
            },
            's8' : {
                text: 'Item 8'
            },
            's9' : {
                text: 'Item 9'
            },
            's10' : {
                text: 'Item 10'
            },
            's11' : {
                text: 'Item 11'
            },
            's12' : {
                text: 'Item 12'
            },
            's13' : {
                text: 'Item 13'
            },

        });

        menuBuilderProvider.registerMenuDefinition('test_menu', {

            items : [
                'i1',
                'i2',
                'i3',
                'i4',
                'i5',
                'i6',
            ]
        });

        menuBuilderProvider.registerMenuDefinition('sub_menu', {
            items : [
                's1',
                's2',
                's3',
                's4',
                's5',
                's6',
                's7',
                's8',
                's9',
                's10',
                's11',
                's12',
                's13',
                's14'
            ]
        })
    })