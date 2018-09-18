/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'add': '&#xe145;',
            'assessment': '&#xe801;',
            'insert_chart': '&#xe801;',
            'poll': '&#xe801;',
            'bug_report': '&#xe868;',
            'build': '&#xe869;',
            'cancel': '&#xe5c9;',
            'check_circle': '&#xe86c;',
            'delete': '&#xe872;',
            'description': '&#xe873;',
            'equalizer': '&#xe01d;',
            'file_download': '&#xe884;',
            'get_app': '&#xe884;',
            'file_upload': '&#xe2c6;',
            'folder': '&#xe2c7;',
            'gamepad': '&#xe021;',
            'games': '&#xe021;',
            'home': '&#xe88a;',
            'pan_tool': '&#xe925;',
            'pause': '&#xe034;',
            'play_arrow': '&#xe037;',
            'power_settings_new': '&#xe8ac;',
            'remove_red_eye': '&#xe8f4;',
            'visibility': '&#xe8f4;',
            'reply': '&#xe15e;',
            'report': '&#xe160;',
            'report_problem': '&#xe002;',
            'warning': '&#xe002;',
            'sd_card': '&#xe1c2;',
            'sd_storage': '&#xe1c2;',
            'send': '&#xe163;',
            'settings': '&#xe8b8;',
            'sim_card_alert': '&#xe624;',
            'timeline': '&#xe922;',
            'touch_app': '&#xe913;',
            'toys': '&#xe332;',
            'tune': '&#xe429;',
            'undo': '&#xe166;',
            'visibility_off': '&#xe8f5;',
            'wb_incandescent': '&#xe42e;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/icomoon-liga/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
