/**
 * Created by jacek on 29.02.16.
 */
angular
    .module('netgenes.ng-angular-menu')
    .directive('popupMenu', function (menuBuilder, $injector, $compile, triggeredMenuLinker) {

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
                style[h] = rect.left + 'px';
                style[v] = rect.top + 'px';

                return style;

            })(menuBuilder, $injector, $compile)
        }
    });