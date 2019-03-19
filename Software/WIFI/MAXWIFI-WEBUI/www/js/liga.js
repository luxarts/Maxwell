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
            'access_time': '&#xe8b5;',
            'query_builder': '&#xe8b5;',
            'schedule': '&#xe8b5;',
            'add': '&#xe145;',
            'assessment': '&#xe801;',
            'insert_chart': '&#xe801;',
            'poll': '&#xe801;',
            'attach_money': '&#xe227;',
            'bug_report': '&#xe868;',
            'check_circle': '&#xe86c;',
            'create': '&#xe254;',
            'edit': '&#xe254;',
            'mode_edit': '&#xe254;',
            'create_new_folder': '&#xe2cc;',
            'delete': '&#xe872;',
            'description': '&#xe873;',
            'file_download': '&#xe884;',
            'get_app': '&#xe884;',
            'file_upload': '&#xe2c6;',
            'folder': '&#xe2c7;',
            'gamepad': '&#xe021;',
            'games': '&#xe021;',
            'hdr_strong': '&#xe3f1;',
            'hdr_weak': '&#xe3f2;',
            'help': '&#xe887;',
            'home': '&#xe88a;',
            'info': '&#xe88e;',
            'menu': '&#xe5d2;',
            'note_add': '&#xe89c;',
            'open_with': '&#xe89f;',
            'pause': '&#xe034;',
            'play_arrow': '&#xe037;',
            'power_settings_new': '&#xe8ac;',
            'remove_red_eye': '&#xe8f4;',
            'visibility': '&#xe8f4;',
            'report': '&#xe160;',
            'sd_card': '&#xe1c2;',
            'sd_storage': '&#xe1c2;',
            'send': '&#xe163;',
            'settings': '&#xe8b8;',
            'stop': '&#xe047;',
            'straighten': '&#xe41c;',
            'toys': '&#xe332;',
            'tune': '&#xe429;',
            'update': '&#xe923;',
            'visibility_off': '&#xe8f5;',
            'wb_incandescent': '&#xe42e;',
            'wifi': '&#xe63e;',
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
