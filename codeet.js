'use strict';

// Codeet Library
var codeet = (function () {

    var listenerAdded = false,
        instances = [],
        messageListener = function (evt) {

            var instance, doc;

            if (evt.origin !== self.config.coddetOrigin) {
                return;
            }

            instance = findInstance(evt.source);

            if (instance) {

                if (evt.data.message === 'codeet-loaded') {
                    doc = {
                        message: 'codeet-document',
                        name: instance.options.name,
                        body: instance.options.body,
                        language: instance.options.language
                    };
                    instance.target.postMessage(doc, self.config.codeetUrl);
                }
                else if (evt.data.message === 'codeet-save') {
                    if (instance.options.callback) {

                        evt.data.onSaved = function () {
                            instance.target.postMessage({message: 'codeet-saved'}, self.config.codeetUrl);
                        }

                        return instance.options.callback.call(instance, evt.data);
                    }
                }
                else if (evt.data.message === 'codeet-closed') {

                    instances.splice(instances.indexOf(instance), 1);

                }

            }


        },
        findInstance = function (winObj) {

            var x, l = instances.length;
            for (x = 0; x < l; x += 1) {
                if (instances[x].target === winObj) {
                    return instances[x];
                }
            }

        },
        self = {
            config: {
                origin: window.location.origin,
                coddetOrigin: 'http://juanpujol.github.io',
                codeetUrl: 'http://juanpujol.github.io/codeet/#!/'
            },
            open: function(opt) {
                var options = opt || {}, target, instance;

                !listenerAdded  && window.addEventListener('message', messageListener, false) && (listenerAdded = true);

                target = window.open(self.config.codeetUrl + '?origin=' + self.config.origin, '_blank');

                if (target) {

                    instance = {
                        target: target,
                        options: options,
                        isOpened: function () {
                            return !!target.window;
                        },
                        notification: self.notification
                    };

                    instances.push(instance);

                    return instance;

                } else {

                    console && console.error('Not able to open a new window. Check if it wasn\'t blocked my the popup blocker.');
                    return false;

                }

            },
            notification: function () {

                var instance, config;

                instance = (this === self && arguments[0]) || (this.target && this);
                config = arguments[(this === self && 1) || (this.target && 0)];

                if (!instance || !instance.target) {
                    console.warn('codeet.notification requires a valid codeet instance');
                    return;
                }

                if (!config) {
                    console.warn('codeet.notification requires a config');
                    return;
                }

                config = {
                    message: 'codeet-notification',
                    data: config
                };

                instance.target.postMessage(config, self.config.codeetUrl);

            }
        };

    return self;

})();