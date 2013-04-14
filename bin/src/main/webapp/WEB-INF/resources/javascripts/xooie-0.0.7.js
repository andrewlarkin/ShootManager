
/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

var $X, Xooie;

$X = Xooie = (function(static_config) {
    var config = {
            modules: {},
            addons: {}
        },
        obj = function() {
            return false;
        };

    function copyObj(dst, src) {
        var name;

        for (name in src) {
            if (src.hasOwnProperty(name)) {
                dst[name] = src[name];
            }
        }
    }

    obj.config = function(cfg) {
        var name;

        for (name in cfg) {
            if (cfg.hasOwnProperty(name)) {
                if (name === 'modules' || name == 'addons') {
                    copyObj(config[name], cfg[name]);
                } else {
                    config[name] = cfg[name];
                }
            }
        }
    };

    obj.mapName = function(name, type, root) {
        if (typeof config[type][name] === 'undefined') {
            return root + name;
        } else {
            return config[type][name];
        }
    };

    if (static_config) {
        obj.config(static_config);
    }

    return obj;
}(Xooie));

define('xooie', ['jquery'], function($){
    var config = Xooie.config,
        mapName = Xooie.mapName,
        
        instantiateWidget = function(Widget){
            new Widget(this);
        };

    $X = Xooie = function(element){
        element = $(element);

        var widgetElements = element.find('[data-widget-type]');

        if (element.is('[data-widget-type]')){
            widgetElements = widgetElements.add(element);
        }

        widgetElements.each(function(){
            var node = $(this),
                module_name,
                types = node.data('widgetType').split(/\s+/);

            for (var i = 0; i < types.length; i++) {
                module_name = $X.mapName(types[i], 'modules', 'xooie/');

                require([module_name], instantiateWidget.bind(node));
            }
        });
    };

    Xooie.config = config;
    Xooie.mapName = mapName;

    Xooie.registeredClasses = [];
    Xooie.garbageCollect = function() {
        for (var i = 0; i < this.registeredClasses.length; i++) {
            this.registeredClasses[i].garbageCollect();
        }
    };

    return Xooie;
});

require(['jquery', 'xooie'], function($, $X){
    $(document).ready(function() {
        $X($(this));
    });
});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/stylesheet', ['jquery'], function($) {
    var Stylesheet = function(name){
        var i, title;

        //check to see if a stylesheet already exists with this name
        this.element = $('style[id=' + name + ']');

        if (this.element.length <= 0) {
            //if it does, use it, else create a new one
            this.element = $(['<style id="' + name + '">',
                                '/* This is a dynamically generated stylesheet: ' + name + ' */',
                            '</style>'].join(''));

            this.element.appendTo($('head'));
        }

        if (document.styleSheets) {
            for (i = 0; i < document.styleSheets.length; i += 1){
                if (document.styleSheets[i].ownerNode.getAttribute('id') === name) {
                    this._index = i;
                }
            }
        }
    };

    Stylesheet.prototype.get = function(){
        return document.styleSheets[this._index];
    };

    Stylesheet.prototype.getRule = function(ruleName){
        ruleName = ruleName.toLowerCase();

        var i, rules;

        //Check if this uses the IE format (styleSheet.rules) or the Mozilla/Webkit format
        rules = this.get().cssRules || this.get().rules;

        for (i = 0; i < rules.length; i += 1){
            if (rules[i].selectorText.toLowerCase() === ruleName) {
                return rules[i];
            }
        }

        return false;
    };

    Stylesheet.prototype.addRule = function(ruleName, properties){
        var rule = this.getRule(ruleName), index, prop, propString = '';

        if (!rule){
            for (prop in properties) {
                propString += prop + ': ' + properties[prop] + ';';
            }

            if (this.get().insertRule) {
                //This is the W3C-preferred method
                index = this.get().cssRules.length;
                this.get().insertRule(ruleName + ' {' + propString + '}', index);
                rule = this.get().cssRules[index];
            } else {
                //support for IE < 9
                index = this.get().rules.length;
                this.get().addRule(ruleName, propString, index);
                rule = this.get().rules[index];
            }
        }

        return rule;
    };

    Stylesheet.prototype.deleteRule = function(ruleName){
        ruleName = ruleName.toLowerCase();

        var i, rules;

        //Check if this uses the IE format (styleSheet.rules) or the Mozilla/Webkit format
        rules = this.get().cssRules || this.get().rules;

        for (i = 0; i < rules.length; i += 1){
            if (rules[i].selectorText.toLowerCase() === ruleName) {
                if (this.get().deleteRule) {
                    //this is the W3C-preferred method
                    this.get().deleteRule(i);
                } else {
                    //support for IE < 9
                    this.get().removeRule(i);
                }

                return true;
            }
        }

        return false;
    };

    return Stylesheet;

});
/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/base', ['jquery', 'xooie', 'xooie/stylesheet'], function($, $X, Stylesheet) {
    var Base = function(name, constructor) {
        var instances, defaultOptions, instanceCounter, initEvent, instanceName, cssRules, stylesInstance, className, Xooie;

        instances = [];

        defaultOptions = {};

        name = name.toLowerCase();
        initEvent = name + 'Init';
        instanceName = name + '-instance';
        instanceCounter = 0;
        className = 'is-' + name + '-instantiated';

        cssRules = {};
        stylesInstance = new Stylesheet('Xooie');

        Xooie = function(root) {
            this.root = $(root);

            if (this.root.data(instanceName)) {
                return instances[this.root.data(instanceName)];
            }
            instanceCounter++;
            instances[instanceCounter] = this;
            this.root.data(instanceName, instanceCounter);

            this.instanceClass = name + '-' + instanceCounter;
            this.root.addClass(this.instanceClass);

            this.options = $.extend({}, Xooie.getDefaultOptions(), this.root.data());

            //expose the stylesheet for this widget to each instance
            this.stylesheet = stylesInstance;

            //expose the common css rules
            this.cssRules = $.extend({}, cssRules);

            var addons, i, self = this;

            constructor.apply(this, arguments);

            this.root.addClass(className);

            if(this.options.addons) {
                addons = this.options.addons.split(' ');

                for (i = 0; i < addons.length; i += 1) {
                    this.loadAddon(addons[i]);
                }
            }

            this.root.trigger(initEvent);
        };

        Xooie.prototype = {
            loadAddon: function(addon){
                var self = this,
                    addon_name = $X.mapName(addon, 'addons', 'xooie/addons/');

                if (typeof this.addons === 'undefined') {
                    this.addons = {};
                }

                try {
                    require([addon_name], function(Addon){
                        new Addon(self);
                    });
                } catch (e) {
                    //need to determine how to handle missing addons
                }
            },

            render: function(template, view) {
                var language = template.data('templateLanguage') || Base.default_template_language,
                    result = Base.render[language](template, view);

                if (result === false) {
                    return $('<span>Error rendering template</span>');
                } else {
                    return result;
                }
            },

            cleanup: function() {
                var name;

                for (name in this.addons) {
                    if (this.addons.hasOwnProperty(name)) {
                        this.addons[name].cleanup();
                    }
                }

                this.root.removeClass(className);
                this.root.removeClass(this.instanceClass);
                this.root.data(instanceName, false);
            }

        };

        $.event.special[initEvent] = {
            add: function(handleObj) {
                var control = $(this).data(instanceName);
                if (control) {
                    var event = $.Event(initEvent);
                    event.data = handleObj.data;

                    handleObj.handler.call(this, event);
                }
            }
        };

        Xooie.setCSSRules = function(rules){
            var rule;

            if(typeof stylesInstance.addRule === 'undefined'){
                return;
            }

            for (rule in rules){
                cssRules[rule] = stylesInstance.addRule(rule, rules[rule]);
            }
        };

        Xooie.getDefaultOptions = function(){
            return defaultOptions || {};
        };

        Xooie.setDefaultOptions = function(options) {
            if (typeof options !== 'undefined') {
                $.extend(defaultOptions, options);
            }
        };

        Xooie.garbageCollect = function() {
            var id, instance;

            for (id in instances) {
                if (instances.hasOwnProperty(id)) {
                    instance = instances[id];

                    if (instance.root.parents('body').length === 0) {
                        instance.cleanup();
                        delete instances[id];
                    }
                }
            }
        };

        $X.registeredClasses.push(Xooie);

        return Xooie;
    };

    Base.default_template_language = 'micro_template';

    Base.render = {
        'micro_template': function(template, view) {
            if (typeof template.micro_render !== 'undefined') {
                return $(template.micro_render(view));
            } else {
                return false;
            }
        },

        'mustache': function(template, view) {
            if (typeof Mustache !== 'undefined' && typeof Mustache.render !== 'undefined') {
                return $(Mustache.render(template.html(), view));
            } else {
                return false;
            }
        },

        'jsrender': function(template, view) {
            if (typeof template.render !== 'undefined') {
                return $(template.render(view));
            } else {
                return false;
            }
        },

        'underscore': function(template, view) {
            if (typeof _ !== 'undefined' && typeof _.template !== 'undefined') {
                return $(_.template(template.html())(view).trim());
            } else {
                return false;
            }
        }
    };

    return Base;
});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/carousel', ['jquery', 'xooie/base'], function($, Base) {

    var resizeTimer = null,
        carouselElements = $(),
        clickQueue = [],
        cssRules = {},
        cache;

    $(window).on('resize', function() {
        if (resizeTimer) {
            clearTimeout(resizeTimer);
            resizeTimer = null;
        }
        if (carouselElements) {
            resizeTimer = setTimeout(function() {
                carouselElements.trigger('carouselResize');
            }, 100);
        }
    });

    var Carousel = Base('carousel', function() {
        var self = this,
            scrollTimer,
            onClick, onScroll, onScrollComplete;

        this.isScrolling = false;

        //Define the dispatch tables for various functionality:
        this.positionUpdaters = {

            "item": function(quantity, direction) {
                var items = self.content.children(),
                    bias, offset,
                    position = self.wrapper.scrollLeft(),
                    i;

                if (typeof direction === 'undefined') {
                    if (quantity > 0 && quantity <= items.length) {
                        offset = Math.round(items.eq(quantity - 1).position().left);
                    }
                } else {
                    direction = direction === -1 ? -1 : 1;

                    bias = -direction;

                    if (!quantity || typeof quantity !== 'number') {
                        quantity = 1;
                    }

                    i = self.currentItem(bias) + direction * quantity;
                    i = Math.max(0, Math.min(items.length - 1, i));
                    offset = Math.round(items.eq(i).position().left);
                }

                return position + offset;
            },

            "px": function(quantity, direction) {
                var position;

                if (typeof direction === 'undefined') {
                    position = 0;
                    direction = 1;
                } else {
                    position = self.wrapper.scrollLeft();
                }
                return position + direction * quantity;
            }

        };

        this.snapMethods = {

            "item": function(){
                var items = self.content.children(),
                    offset, p1, p2,
                    i = self.currentItem();

                p1 = items.eq(i).position().left;
                if (Math.abs(p1) < 1) {
                    p1 = p1 < 0 ? Math.ceil(p1) : Math.floor(p1);
                } else {
                    p1 = Math.round(p1);
                }

                if (p1 !== 0 && i > 0) {
                    p2 = items.eq(i - 1).position().left;
                    if (Math.abs(p2) < 1) {
                        p2 = p2 < 0 ? Math.ceil(p2) : Math.floor(p2);
                    } else {
                        p2 = Math.round(p2);
                    }

                    if (Math.abs(p1) < Math.abs(p2)) {
                        offset = p1 + self.wrapper.scrollLeft();
                    } else {
                        offset = p2 + self.wrapper.scrollLeft();
                    }

                    self.wrapper.animate({ scrollLeft: offset });
                }

            }

        };

        this.displayMethods = {
            "item": function(container, template){
                var element, item, items, lastVisible, rightPosition, i;

                items = self.content.children();
                currentItem = self.currentItem();
                rightPosition = items.eq(currentItem).position().left + self.wrapper.innerWidth();
                lastVisible = items.length;

                for (i = currentItem; i < items.length; i += 1) {
                    item = items.eq(i);
                    if (Math.floor(item.position().left) + item.outerWidth() * self.options.visibleThreshold >= rightPosition) {
                        lastVisible = i;
                        break;
                    }
                }

                element = self.render(template, {
                    current_item: currentItem + 1,
                    last_visible_item: lastVisible,
                    total_items: items.length
                });

                container.append(element);
            }
        };

        //select the content area and wrap it in a container
        this.content = this.root.find(this.options.contentSelector);
        this.content.wrap('<div/>');

        this.wrapper = this.content.parent();
        this.wrapper.addClass('xooie-carousel-wrapper');

        //setting the wrapper's parent to overflow-y=hidden allows us to hide the horizontal scrollbar
        this.wrapper.parent().addClass('xooie-carousel-crop');

        this.cssRules.heightAdjust = this.stylesheet.addRule('.carousel-' + this.root.data('carousel-instance') + ' .xooie-carousel-crop');

        this.content.addClass('xooie-carousel-content');

        this.content.children().addClass('xooie-carousel-item');

        this.root.find(this.options.controlSelector)
                 .on('click', function(event){
                    event.preventDefault();

                    self.updatePosition($(this).data('scroll'));
                 });

        onScrollComplete = function() {
            self.snap();
            self.root.trigger('carouselScrollComplete');
        };

        onScroll = function(){
            if (scrollTimer) {
                scrollTimer = clearTimeout(scrollTimer);
            } else {
                self.root.removeClass('is-carousel-leftmost is-carousel-rightmost');
            }

            scrollTimer = setTimeout(onScrollComplete, 250);
        };

        this.wrapper.on('scroll', onScroll);

        this.root.on({
            carouselScrollComplete: function(){
                self.updateDisplay();
                self.updateLimits();
            },
            carouselInit: this.updateDimensions.bind(this),
            carouselResize: this.updateDimensions.bind(this)
        });

        //It is possible that images may load after the carousel has instantiated/
        //Also, this can be used for lazy-loading images
        //TODO: This can be problematic, since it is triggering update dimensions for each image load
        this.content.find('img').on('load', this.updateDimensions.bind(this));

        carouselElements = carouselElements.add(this.root);
    });

    Carousel.setDefaultOptions({
        contentSelector: '[data-role="carousel-content"]',
        controlSelector: '[data-role="carousel-control"]',

        displayMode: 'none',
        displaySelector: '[data-role="carousel-display"]',
        displayTemplateSelector: '[data-role="carousel-display-template"]',

        snapMode: 'none',
        visibleThreshold: 0.50
    });

    //Set css rules for all carousels
    Carousel.setCSSRules({
        '.xooie-carousel-wrapper': {
            'overflow-x': 'scroll',
            'overflow-y': 'hidden'
        },
        '.xooie-carousel-crop': {
            'overflow-y': 'hidden'
        },
        '.xooie-carousel-content': {
            display: 'table-cell',
            'white-space': 'nowrap',
            'font-size': '0px'
        },
        '.xooie-carousel-item': {
            display: 'inline-block',
            zoom: '1',
            '*display': 'inline',
            'font-size': '1em'
        }
    });

    cache = {
        currentItem: 0,
        lastItem: 0
    };

    Carousel.prototype.currentItem = function(bias) {
        var i, items = this.content.children(),
            position, itemWidth;

        if (typeof bias === 'undefined') {
            bias = 1;
        }

        if (bias === 1) {
            position = this.content.position().left;

            for (i = 0; i < items.length - 1; i++) {
                itemWidth = items.eq(i).outerWidth(true);

                if (position + this.options.visibleThreshold * itemWidth >= 0){
                    return i;
                } else {
                    position += itemWidth;
                }
            }
            return items.length - 1;
        } else {
            position = this.content.outerWidth(true) + this.content.position().left;

            for (i = items.length - 1; i > 0; i -= 1) {
                itemWidth = items.eq(i).outerWidth(true);
                position -= itemWidth;

                if (i > 0 && position <= this.options.visibleThreshold * itemWidth) {
                    return i;
                }
            }
            return 0;
        }
    };

    Carousel.prototype.getRightLimit = function(){
        try {
            var lastItem = this.content.children(':last'),
                position = lastItem.position();

            if (position && typeof position.left !== 'undefined') {
                return Math.floor(position.left) + lastItem.outerWidth(true);
            }
        } catch (e) {
            return;
        }
    };

    Carousel.prototype.updateDimensions = function() {
        var items = this.content.children(),
            height = 0;

        items.each(function() {
            var node = $(this);
            height = Math.max(height, node.outerHeight(true));
        });

        //set the height of the wrapper's parent (or cropping element) to ensure we hide the scrollbar
        this.cssRules.heightAdjust.style.height = height + 'px';

        this.updateLimits();
        this.updateDisplay();
        this.snap();

        this.root.trigger('carouselUpdated');
    };

    Carousel.prototype.updateLimits = function() {
        this.root.toggleClass('is-carousel-leftmost', this.wrapper.scrollLeft() === 0);
        this.root.toggleClass('is-carousel-rightmost', this.getRightLimit() <= this.wrapper.innerWidth());
    };

    Carousel.prototype.updatePosition = function(amount) {
        var match = (amount + '').match(/^([+\-]?)(\d+)(.*)$/),
            callback,
            self = this;

        if (!match) {
            return;
        }

        callback = function(){
            var direction, quantity, units, offset;

            if (match[1] !== '') {
                direction = (match[1] === '-') ? -1 : 1;
            }

            quantity = parseInt(match[2], 10);
            units = match[3];

            if (units === '') {
                units = 'px';
            }

            if (typeof self.positionUpdaters[units] === 'function') {
                offset = self.positionUpdaters[units](quantity, direction);
            } else {
                offset = 0;
            }

            self.isScrolling = true;

            self.root.trigger('carouselMove', offset);

            self.wrapper.animate({ scrollLeft: offset },
                function(){
                    self.isScrolling = false;
                    if (clickQueue.length > 0) {
                        clickQueue.shift()();
                    }
                }
            );
        };

        if (this.isScrolling) {
            clickQueue.push(callback);
        } else {
            callback();
        }

    };

    Carousel.prototype.updateDisplay = function(){
        if (this.options.displayMode === 'none') {
            return;
        }

        var container = this.root.find(this.options.displaySelector),
            template = this.root.find(this.options.displayTemplateSelector);

        if (container.length === 0 || template.length === 0) {
            return;
        }

        container.html('');

        if (typeof this.displayMethods[this.options.displayMode] === 'function') {
            this.displayMethods[this.options.displayMode](container, template);
        }
    };

    Carousel.prototype.snap = function(){
        if (this.getRightLimit() > this.wrapper.innerWidth() && typeof this.snapMethods[this.options.snapMode] === 'function') {
            this.snapMethods[this.options.snapMode]();
        }
    };

    return Carousel;
});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/dropdown', ['jquery', 'xooie/base'], function($, Base) {
    
   var parseWhich = function(which) {
        if (typeof which === 'string') {
            which = which.split(',');
            return which.map(function(string){ return parseInt(string, 10); });
        } else if (typeof which === 'number') {
            return [which];
        }

        return which;
     };

    var Dropdown = Base('dropdown', function() {
        var self = this,
            handles = self.getHandle(),
            expanders = self.getExpander();

        this.handlers = {
            off: function(event){
                if ((typeof event.data.not !== 'undefined' && ($(event.data.not).is($(this)) || $(event.target).parents(event.data.not).length > 0)) || (typeof event.data.which !== 'undefined' && event.data.which.indexOf(event.which) === -1) || ($(event.target).is(self.getExpander(event.data.index)) || $(event.target).parents(self.options.dropdownExpanderSelector).length > 0) && !$(event.target).is($(this))) {
                    return true;
                }

                event.preventDefault();

                self.collapse(event.data.index, event.data);
            },

            on: function(event){
                var index = event.data.index || parseInt($(this).attr('data-dropdown-index'), 10),
                    delay = event.data.delay,
                    handle = $(this);

                if ((typeof event.data.not !== 'undefined' && ($(event.data.not).is($(this)) || $(event.target).parents(event.data.not).length > 0)) || typeof event.data.which !== 'undefined' && event.data.which.indexOf(event.which) === -1) {
                    return true;
                }

                event.preventDefault();

                self.expand(index, event.data);
            }
        };

        this.timers = {
            expand: [],
            collapse: [],
            throttle: []
        };

        this.addHandlers('on');

        this.root.on({
            dropdownExpand: function(event, index){
                self.removeHandlers('on', index);

                self.addHandlers('off', index);

                $(this).attr('aria-selected', true);
                self.getExpander(index).attr('aria-hidden', false);
            },

            dropdownCollapse: function(event, index){
                self.removeHandlers('off', index);

                self.addHandlers('on', index);

                $(this).attr('aria-selected', false);
                self.getExpander(index).attr('aria-hidden', true);
            }
        }, this.options.dropdownHandleSelector);

        handles.each(function(index){
            var handle = $(this),
                expander = expanders.eq(index);


            handle.attr({
                'data-dropdown-index': index,
                'aria-selected': false
            });
            expander.attr({
                'data-dropdown-index': index,
                'aria-hidden': true
            });
        });

        expanders.on('mouseover focus', function(){
            var index = parseInt($(this).attr('data-dropdown-index'), 10);

            if (self.timers.collapse[index]){
                self.timers.collapse[index] = clearTimeout(self.timers.collapse[index]);

                $(this).on('mouseleave blur', {index: index}, function(event){
                    self.collapse(event.data.index, 0);
                    $(this).unbind(event);
                });
            }
        });

    });

    Dropdown.setDefaultOptions({
        dropdownHandleSelector: '[data-role="dropdown-handle"]',
        dropdownExpanderSelector: '[data-role="dropdown-content"]',

        activeDropdownClass: 'is-dropdown-active',

        throttleDelay: 300,
        triggers: {
            on: {
                focus: {
                    delay: 0
                }
            },
            off: {
                blur: {
                    delay: 0
                }
            }
        }

    });

    Dropdown.prototype.getTriggerHandle = function(triggerData, index){
        var handles = this.getHandle(index);

        if (triggerData.selector) {
            return triggerData.selector === 'document' ? $(document) : $(triggerData.selector);
        } else {
            return handles;
        }
    };

    Dropdown.prototype.addHandlers = function(state, index){
        var trigger, handle, triggerData, countName;

        triggerData = this.options.triggers[state];

        for (trigger in triggerData) {
            if (typeof triggerData[trigger].which !== 'undefined') {
                triggerData[trigger].which = parseWhich(triggerData[trigger].which);
            }

            countName = [trigger,state,'count'].join('-');

            handle = this.getTriggerHandle(triggerData[trigger], index);

            handle.data(countName, handle.data(countName) + 1 || 1);

            handle.on(trigger, $.extend({delay: 0, index: index}, triggerData[trigger]), this.handlers[state]);
        }
    };

    Dropdown.prototype.removeHandlers = function(state, index){
        var trigger, handle, triggerData, countName, eventCount;

        triggerData = this.options.triggers[state];

        for (trigger in triggerData) {
            handle = this.getTriggerHandle(triggerData[trigger], index);

            countName = [trigger,state,'count'].join('-');

            eventCount = handle.data(countName) - 1;

            if (eventCount <= 0) {
                handle.unbind(trigger, this.handlers[state]);

                handle.data(countName, 0);
            } else {
                handle.data(countName, eventCount);
            }
        }
    };

    Dropdown.prototype.getHandle = function(index){
        var handles = this.root.find(this.options.dropdownHandleSelector);

        return (typeof index !== 'undefined' && index >= 0) ? handles.eq(index) : handles;
    };

    Dropdown.prototype.getExpander = function(index){
        var expanders = this.root.find(this.options.dropdownExpanderSelector);

        return (typeof index !== 'undefined' && index >= 0) ? expanders.eq(index) : expanders;
    };

    Dropdown.prototype.setState = function(index, data, active){
        if (typeof index === 'undefined' || isNaN(index)) {
            return;
        }

        var state = active ? 'expand' : 'collapse',
            counterState = active ? 'collapse' : 'expand',
            delay = data.delay;

        this.timers[counterState][index] = clearTimeout(this.timers[counterState][index]);

        if (this.timers.throttle[index] || this.timers[state][index]) {
            return;
        }

        this.timers[state][index] = setTimeout(function(i, _state, _active, _data) {
            var expander = this.getExpander(i),
                handle = this.getHandle(i),
                self = this;

            this.timers[_state][i] = clearTimeout(this.timers[_state][i]);

            expander.toggleClass(this.options.activeDropdownClass, _active);
            this.getHandle(i).toggleClass(this.options.activeDropdownClass, _active);

            if (_active){
                handle.trigger('dropdownExpand', [i, _data]);
                this.setFocus(expander);
            } else {
                handle.trigger('dropdownCollapse', [i, _data]);
            }

            if (this.options.throttleDelay > 0){
                this.timers.throttle[i] = setTimeout(function(){
                    self.timers.throttle[i] = clearTimeout(self.timers.throttle[i]);
                }, this.options.throttleDelay);
            }

        }.bind(this, index, state, active, data), delay);
    };

    Dropdown.prototype.expand = function(index, data) {
        if (!this.getHandle(index).hasClass(this.options.activeDropdownClass)) {
            this.setState(index, data, true);
        }
    };

    Dropdown.prototype.collapse = function(index, data) {
        if (this.getHandle(index).hasClass(this.options.activeDropdownClass)) {
            this.setState(index, data, false);
        }
    };

    Dropdown.prototype.setFocus = function(element){
        element.find('a,input,textarea,button,select,iframe,[tabindex][tabindex!=-1]')
               .first()
               .focus();
    };

    return Dropdown;
});
/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/tab', ['jquery', 'xooie/base'], function($, Base) {

    var Tab = Base('tab', function() {
        var self = this;

        this.createTabs();
    });

    Tab.setDefaultOptions({
        panelSelector: '[data-role="tab-panel"]',
        stripSelector: '[data-role="tab-strip"]',
        controlSelector: '[data-role="tab-selector"]',
        controlButtonSelector: '[data-tab-control]',
        tabTemplateSelector: '[data-role="tab-template"]',

        activeTabClass: 'is-tab-active'
    });

    $.extend(Tab.prototype, {
        switchToTab: function(index, key) {
            if (index !== this._currentTab && index >= 0 && index < this.getPanel().length) {
                var e = $.Event('tabChange');
                e.fromTab = this._currentTab;
                e.toTab = index;
                e.which = key;

                this.getPanel(this._currentTab).removeClass(this.options.activeTabClass);
                this.getTab(this._currentTab).removeClass(this.options.activeTabClass);

                this.getPanel(index).addClass(this.options.activeTabClass);
                this.getTab(index).addClass(this.options.activeTabClass);

                this._currentTab = index;

                this.root.trigger(e);
            }
        },

        getPanel: function(index) {
            var panels = this.root.find(this.options.panelSelector);

            if (typeof index === 'undefined') {
                return panels;
            } else {
                return panels.eq(index);
            }
        },

        getTab: function(index) {
            var tabs = this.root.find(this.options.controlSelector);
            if (typeof index === 'undefined') {
                return tabs;
            } else {
                return tabs.eq(index);
            }
        },

        createTabs: function() {
            var tabStrip = this.root.find(this.options.stripSelector),
                template = this.root.find(this.options.tabTemplateSelector),
                panels = this.getPanel(),
                i, element, control,
                activeTab = 0, handler, self = this;

            if (template.length === 0){
                return;
            }

            this.getTab().remove();

            handler = function(event) {
                var keys = [13,32];

                if ([1,13,32].indexOf(event.which) !== -1){
                    self.switchToTab($(this).data('tab-index'), event.which);
                }
            };

            for (i = 0; i < panels.length; i++) {
                if(tabStrip.length > 0 && template.length > 0) {
                    element = this.render(template, {
                        panel_label: panels.eq(i).attr('data-tab-label'),
                        panel_index: i,
                        panel_has_next: (i < panels.length - 1)
                    });

                    if (element.is(this.options.controlButtonSelector)) {
                        control = element;
                    } else {
                        control = element.find(this.options.controlButtonSelector);
                    }

                    control.data('tab-index', i)
                           .on('mouseup keydown', handler);

                    tabStrip.append(element);
                }

                if (panels.eq(i).hasClass(this.options.activeTabClass)) {
                    activeTab = i;
                }
            }

            this.switchToTab(activeTab);
        }
    });

    return Tab;
});
/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/dialog', ['jquery', 'xooie/base'], function($, Base) {

    var Dialog = Base('dialog', function(){
        var self = this;

        this.id = Dialog._counter++;

        Dialog._instances[this.id] = this;

        this.root.attr('data-dialog-id', this.id);

        //add accessibility attributes
        this.root.find(this.options.containerSelector).attr('role', 'dialog');

        this.root.addClass('xooie-dialog');

        this.handlers = {
            mouseup: function(event){
                Dialog.close(self.id);
            },

            keyup: function(event){
                if([13,32].indexOf(event.which) !== -1){
                    Dialog.close(self.id);
                }
            }
        };
    });

    Dialog.setDefaultOptions({
        closeButtonSelector: '[data-role="closeButton"]',
        containerSelector: '[data-role="container"]',

        dialogActiveClass: 'is-dialog-active'
    });

    Dialog.setCSSRules({
        '.xooie-dialog': {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    });

    Dialog.prototype.activate = function(){
        this.root.addClass(this.options.dialogActiveClass);

        if(Dialog._active === this) {
            return;
        }

        if(Dialog._active){
            Dialog._active.deactivate();
        }

        this.root.find(this.options.closeButtonSelector)
                 .on(this.handlers);

        Dialog._active = this;

        this.root.trigger('dialogActive');
    };

    Dialog.prototype.deactivate = function(){
        this.root.removeClass(this.options.dialogActiveClass);

        if (Dialog._active !== this) {
            return;
        }

        this.root.find(this.options.closeButtonSelector)
                 .off(this.handlers);

        Dialog._active = null;

        this.root.trigger('dialogInactive');
    };

    Dialog._instances = [];
    Dialog._counter = 0;
    Dialog._active = null;
    Dialog._queue = [];

    Dialog.open = function(id){
        //get dialog instance
        var dialog = this._instances[id];

        if (typeof dialog === 'undefined' || this._active === dialog){
            return;
        }

        if (this._active) {
            this._queue.push(dialog);
        } else {
            dialog.activate();
        }

    };

    Dialog.close = function(){
        //get dialog instance
        if(!this._active) {
            return;
        }

        this._active.deactivate();

        if (this._queue.length > 0) {
            this._queue.pop().activate();
        }
    };

    return Dialog;
});
/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/addons/base', ['jquery'], function($) {
    var Base = function(name, constructor){
        var defaultOptions = {},
            initEvent = name.toLowerCase() + 'AddonInit',
            className = 'has-' + name.toLowerCase() + '-addon',

            wrapper = function(module) {
                //Let's check to see if module is defined...
                //TODO: intelligently check if module is an instance of the base ui class
                if (typeof module === 'undefined') {
                    return false;
                }

                //if we've already instantiated an instance of this addon for this module, return it
                if (module.addons && typeof module.addons[name] !== 'undefined') {
                    return module.addons[name];
                }

                //module is the module we are extending.
                this.module = module;

                //track this addon on the parent module
                this.module.addons[name] = this;

                //We'll need to extend the module's base properties
                this.options = $.extend({}, wrapper.getDefaultOptions(), this.module.options);

                this.module.root.addClass(className);

                constructor.apply(this, arguments);

                this.module.root.trigger(initEvent);
            };

        wrapper.prototype.cleanup = function() {
            this.module.root.removeClass(className);
        };

        wrapper.getDefaultOptions = function(){
            return defaultOptions;
        };

        wrapper.setDefaultOptions = function(options){
            if (typeof options !== 'undefined') {
                $.extend(defaultOptions, options);
            }
        };

        return wrapper;
    };

    return Base;
});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/addons/carousel_lentils', ['jquery', 'xooie/addons/base'], function($, Base) {

    var Lentils = Base('lentils', function(){
        var self = this;

        this.lentilBuilders = {
            "item": function(container, template){
                var items = self.module.content.children(),
                    element, i;

                for (i = 0; i < items.length; i += 1) {

                    element = self.module.render(template, {
                        number: i + 1,
                        scroll_mode: "item",
                        lentil_is_last: (i === items.length - 1)
                    });
                    container.append(element);
                }
            },

            "page": function(container, template){
                if (typeof self.module.addons.pagination === 'undefined') {
                    return;
                }

                var element, i;

                for (i = 0; i < self.module.addons.pagination._breaks.length; i += 1) {
                    element = self.module.render(template, {
                        number: i + 1,
                        scroll_mode: "page",
                        lentil_is_last: (i === self.module.addons.pagination._breaks.length - 1)
                    });

                    container.append(element);
                }

            }

        };

        this.module.root.addClass('is-carousel-lentiled');

        this.module.root.on('carouselUpdated', function(){
            self.updateLentils();
        });

        this.module.root.on('carouselScrollComplete', function(){
            self.currentLentil();
        });

        this.updateLentils();

        this.currentLentil();

    });

    Lentils.setDefaultOptions({
        lentilMode: 'item',
        lentilSelector: '[data-role="carousel-lentils"]',
        lentilTemplateSelector: '[data-role="carousel-lentils-template"]',

        activeLentilClass: 'is-active-lentil'
    });

    Lentils.prototype.currentLentil = function(){
        var container = this.module.root.find(this.options.lentilSelector),
            lentils = container.children(),
            index;

        if (this.options.lentilMode === 'page' && typeof this.module.addons.pagination !== 'undefined') {
            index = this.module.addons.pagination.currentPage();
        } else {
            index = this.module.currentItem();
        }

        lentils.filter('.' + this.options.activeLentilClass).removeClass(this.options.activeLentilClass);

        lentils.eq(index).addClass(this.options.activeLentilClass);
    };

    Lentils.prototype.updateLentils = function() {
        var container = this.module.root.find(this.options.lentilSelector),
            template = this.module.root.find(this.options.lentilTemplateSelector),
            self = this;

        if (container.length > 0 && template.length > 0) {
            container.html('');

            if (typeof this.lentilBuilders[this.options.lentilMode] === 'function') {
                this.lentilBuilders[this.options.lentilMode](container, template);

                container.children().on('click', function(event) {
                    event.preventDefault();
                    self.module.updatePosition($(this).data('scroll'));
                });

                this.currentLentil();

            }
        }
    };

    return Lentils;
});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/addons/carousel_pagination', ['jquery', 'xooie/addons/base'], function($, Base){

    var Pagination = Base('pagination', function() {
        var self = this;

        this._breaks = [];

        this.module.positionUpdaters = $.extend({}, this.module.positionUpdaters, {
            "page": function(quantity, direction) {
                var items = self.module.content.children(),
                    bias = 1,
                    offset = 0,
                    position = self.module.wrapper.scrollLeft(),
                    i;

                if (typeof direction === 'undefined') {
                    if (quantity > 0 && quantity <= self._breaks.length) {
                        offset = Math.round(items.eq(self._breaks[quantity - 1]).position().left);
                    }
                } else {
                    direction = direction === -1 ? -1 : 1;

                    bias = -direction;

                    if (!quantity || typeof quantity !== 'number') {
                        quantity = 1;
                    }

                    i = self.currentPage(bias) + direction * quantity;
                    i = Math.max(0, Math.min(self._breaks.length - 1, i));
                    offset = Math.round(items.eq(self._breaks[i]).position().left);
                }

                return position + offset;
            }
        });

        this.module.snapMethods = $.extend({}, this.module.snapMethods, {
            "page": function() {
                var items = self.module.content.children(),
                    offset, p1, p2,
                    i = self.currentPage();

                p1 = items.eq(self._breaks[i]).position().left;
                if (Math.abs(p1) < 1) {
                    p1 = p1 < 0 ? Math.ceil(p1) : Math.floor(p1);
                } else {
                    p1 = Math.round(p1);
                }

                if (p1 !== 0 && i > 0) {
                    p2 = items.eq(self._breaks[i - 1]).position().left;

                    if (Math.abs(p2) < 1) {
                        p2 = p2 < 0 ? Math.ceil(p2) : Math.floor(p2);
                    } else {
                        p2 = Math.round(p2);
                    }

                    if (Math.abs(p1) < Math.abs(p2)) {
                        offset = p1 + self.module.wrapper.scrollLeft();
                    } else {
                        offset = p2 + self.module.wrapper.scrollLeft();
                    }

                    self.module.wrapper.animate({ scrollLeft: offset });
                }
            }
        });

        this.module.displayMethods = $.extend({}, this.module.displayMethods, {
            "page": function(container, template){

                var element = self.module.render(template, {
                    current_page: self.currentPage() + 1,
                    total_pages: self._breaks.length
                });

                container.append(element);
            }
        });

        this.module.root.on('carouselUpdated', function(){
            self.updateBreaks();
        });

        this.updateBreaks();
    });

    Pagination.prototype.currentPage = function(bias) {
        var i, k, items = this.module.content.children(),
            position, itemWidth, lastItem;

        if (typeof bias === 'undefined') {
            bias = 1;
        }

        if (bias === 1) {
            position = this.module.content.position().left;

            for (i = 0; i < this._breaks.length; i += 1) {
                itemWidth = 0;
                lastItem = (i === this._breaks.length - 1) ? items.length : this._breaks[i + 1];

                for (k = this._breaks[i]; k < lastItem; k += 1) {
                    itemWidth += items.eq(k).outerWidth(true);
                }

                if (position + (this.module.options.visibleThreshold * itemWidth) >= 0){
                    return i;
                } else {
                    position += itemWidth;
                }
            }
            return items.length - 1;
        } else {
            position = this.module.content.outerWidth(true) + this.module.content.position().left;

            for (i = this._breaks.length - 1; i >= 0; i--) {
                itemWidth = 0;
                lastItem = (i === this._breaks.length - 1) ? items.length : this._breaks[i + 1]; 

                for (k = this._breaks[i]; k < lastItem; k += 1) {
                    itemWidth += items.eq(k).outerWidth(true);
                }
                position -= itemWidth;

                if (position <= this.module.options.visibleThreshold * itemWidth) {
                    return i;
                }
            }
            return 0;
        }
    };

    Pagination.prototype.updateBreaks = function() {
        var items = this.module.content.children(),
            width = 0,
            breakPoint = this.module.wrapper.innerWidth(),
            breaks = [0];

        items.each(function(i) {
            var node = $(this),
                w = node.outerWidth(true);

            width += w;

            if (width > breakPoint) {
                if (width - (w - node.innerWidth()) > breakPoint) {
                    width = w;
                    breaks.push(i);
                }
            }
        });

        this.module.root.toggleClass('is-carousel-paginated', breaks.length > 1);

        this._breaks = breaks;

        this.module.updateDisplay();
    };

    return Pagination;
});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/addons/dropdown_accordion', ['jquery', 'xooie/addons/base'], function($, Base){

    var Accordion = Base('accordion', function() {
        var self = this;

        this.module.getHandle().on('dropdownExpand', function(event){
            var activeHandles = self.module.getHandle().not($(this)).filter('.' + self.module.options.activeDropdownClass),
                i = 0,
                index;

            for (; i < activeHandles.length; i += 1) {
                index = parseInt($(activeHandles[i]).attr('data-dropdown-index'), 10);

                self.module.collapse(index, 0);
            }

        });
    });

    return Accordion;

});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/addons/tab_automation', ['jquery', 'xooie/addons/base'], function($, Base) {
    var outOfRange = function(lower, upper, point, normalize) {
        var n = ( Math.min(lower, point) - lower ) || ( Math.max(upper, point) - upper );
        var denominator = (normalize) ? Math.max(Math.abs(n),1) : 1;
        return n/denominator;
    };


    var Automation = Base('automation', function(){
        var self = this,
            focusTable = {},
            setFocus;

        this._tabChangeTimer = 0;

        this._canRotate = true;

        //automationInstances.push(this);

        setFocus = function(method, state) {
            var prop;

            focusTable[method] = state;

            if (state) {
                for (prop in focusTable) {
                    state = state && focusTable[prop];
                }
            }

            self._canRotate = state;
        };

        this.module.root.on({
            'mouseenter': function(){
                setFocus('mouse', false);
                self.stop();
            },
            'focus': function(){
                setFocus('keyboard', false);
                self.stop();
            },
            'mouseleave': function(){
                setFocus('mouse', true);
                self.start();
            },
            'blur': function(){
                setFocus('mouse', true);
                self.start();
            },
            'tabChange': function(){
                self.start();
            }
        });

        this.module.root.find('*').on({
           'focus': function(){
                setFocus('keyboard', false);
                self.stop();
            },
            'blur': function(){
                setFocus('keyboard', true);
                self.start();
            }
        });

        this.start();
    });

    Automation.setDefaultOptions({
        direction: 1,
        delay: 10000
    });

    $.extend(Automation.prototype, {
        start: function(){
            var self = this;

            if (this._tabChangeTimer) {
                this.stop();
            }

            this._tabChangeTimer = setTimeout(function(){
                self.stop();

                if (!self._canRotate){
                    return;
                }

                if (self.outOfRange()) {
                    $(window).on('scroll', function(event){
                        if (!self.outOfRange()) {
                            self.start();
                            $(window).off(event);
                        }
                        //TODO: add logic to remove scroll event if the elementis no longer in the DOM
                    });
                    return;
                }

                var newTab;

                if (self.module._currentTab + self.options.direction >= self.module.getPanel().length) {
                    newTab = 0;
                } else if (self.module._currentTab + self.options.direction < 0) {
                    newTab = self.module.getPanel().length - 1;
                } else {
                    newTab = self.module._currentTab + self.options.direction;
                }

                self.module.switchToTab(newTab);
            }, this.options.delay);

        },

        stop: function() {
            this._tabChangeTimer = clearTimeout(this._tabChangeTimer);
        },

        //Will return true if the tab module is out of range (ie, both the top and bottom are out of range)
        outOfRange: function(){
            var lower, upper, top, bottom;

            lower = $(window).scrollTop();
            upper = lower + $(window).height();
            top = this.module.root.offset().top;
            bottom = top + this.module.root.outerHeight(true);

            return !!(outOfRange(lower, upper, top, true) && outOfRange(lower, upper, bottom, true));
        }
    });

    return Automation;
});

/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/addons/tab_animation', ['jquery', 'xooie/addons/base', 'async'], function($, Base, async) {

    var Animation = Base('animation', function(){
        var self = this,
            isAnimating = false,
            animationQueue = [],
            callback = function(){
                if (animationQueue.length > 0) {
                    animationQueue.shift()();
                } else {
                    isAnimating = false;
                }
            };

        this.module.root.on('tabChange', function(event){
            animationQueue.push(function(){
                var direction;

                if (self.options.wrap) {
                    if (event.toTab === 0 && event.fromTab === self.module.getPanel().length - 1) {
                        direction = 1;
                    } else if (event.toTab === self.module.getPanel().length - 1 && event.fromTab === 0) {
                        direction = -1;
                    } else {
                        direction = event.toTab > event.fromTab ? 1 : -1;
                    }
                } else {
                    direction = event.toTab > event.fromTab ? 1 : -1;
                }

                self.animateToTab(event.toTab, event.fromTab , direction, callback);
            });

            if (!isAnimating) {
                isAnimating = true;
                callback();
            }
        });

        var getAnimation = function(el, properties) {
            return function(cb) {
                el.animate(properties, {
                    duration: self.options.duration,
                    easing: self.options.easing,
                    complete: function() {
                        $(this).attr('style', '');
                        cb();
                    }
                });
            };
        };

        this.animationMethods = {

            "horizontal": function(to, from, container, direction){
                var calls = [];

                container.css({
                    overflow: 'hidden',
                    height: from.outerHeight(),
                    width: container.width()
                });

                from.css({
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: from.width(),
                    height: from.height()
                });

                to.css({
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: (direction === -1) ? -container.innerWidth() : container.innerWidth(),
                    width: to.width(),
                    height: to.height()
                });

                calls.push(
                    getAnimation(from, {
                        left: (direction === -1) ? container.innerWidth() : -container.innerWidth()
                    }),

                    getAnimation(to, {
                        left: 0
                    }),

                    getAnimation(container, {
                        height: to.outerHeight()
                    })
                );

                return calls;
            },

            "vertical": function(to, from, container, direction){
                var calls = [];

                container.css({
                    overflow: 'hidden',
                    height: from.outerHeight(),
                    width: container.width()
                });

                from.css({
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: from.width(),
                    height: from.height()
                });

                to.css({
                    display: 'block',
                    position: 'absolute',
                    top: (direction === -1) ? -container.innerHeight() : container.innerHeight(),
                    left: 0,
                    width: to.width(),
                    height: to.height()
                });

                calls.push(
                    getAnimation(from, {
                        top: (direction === -1) ? container.innerHeight() : -container.innerHeight()
                    }),

                    getAnimation(to, {
                        top: 0
                    }),

                    getAnimation(container, {
                        height: to.outerHeight()
                    })
                );

                return calls;

            },

            "fade": function(to, from, container, direction) {
                var calls = [];

                container.css({
                    overflow: 'hidden',
                    height: from.outerHeight(),
                    width: container.width()
                });

                from.css({
                    display: 'block',
                    position: 'absolute',
                    opacity: 1.0,
                    top: 0,
                    left: 0,
                    width: from.width(),
                    height: from.height()
                });

                to.css({
                    display: 'block',
                    position: 'absolute',
                    opacity: 0,
                    top: 0,
                    left: 0,
                    width: to.width(),
                    height: to.height()
                });

                calls.push(
                    getAnimation(from, {
                        opacity: 0
                    }),

                    getAnimation(to, {
                        opacity: 1.0
                    }),

                    getAnimation(container, {
                        height: to.outerHeight()
                    })
                );

                return calls;

            }
        };
    });

    Animation.setDefaultOptions({
        panelContainerSelector: '[data-role="panel-container"]',
        animationMode: 'horizontal', //Can be horizontal, vertical or fade
        easing: 'linear', //TODO: load other easings if necessary
        duration: 500,
        wrap: false
    });

    $.extend(Animation.prototype, {
        animateToTab: function(index, currentIndex, direction, callback) {
            if (index === currentIndex || index < 0 || index >= this.module.getPanel().length) {
                return;
            }

            var from = this.module.getPanel(currentIndex),
                to = this.module.getPanel(index),
                container = from.parents(this.options.panelContainerSelector),
                calls;

            if (typeof this.animationMethods[this.options.animationMode] === 'function') {
                calls = this.animationMethods[this.options.animationMode](to, from, container, direction);

                async.parallel(calls, callback || function() {});
            }
        }
    });

    return Animation;

});

