/*!
  jQuery <%= projectName %> plugin
  @name jquery.<%= projectName %>.js
  @author <%= author %> (<%= email %>)
  @version 1.0
  @date <%= new Date().toLocaleDateString() %>
  @category jQuery Plugin
  @copyright (c) <%= new Date().getFullYear()%> [<%= company %>] (<%= website %>)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function ($) {

  var myPlugin, defaultOptions, __bind;

  __bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };

  // Plugin default options.
  defaultOptions = {
    myvar1: 1,
    myvar2: 2,
    myvar3: 3,
    resizeDelay: 50
    //etc...
  };

  myPlugin = (function (options) {

    function myPlugin(handler, options) {
      this.handler = handler;

      // Extend default options.
      $.extend(true, this, defaultOptions, options);

      // Bind methods.
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);

      // Listen to resize event if requested.
      if (this.autoResize) {
        $(window).bind('resize.myPlugin', this.onResize);
      };
    };

    // Method for updating the plugins options.
    myPlugin.prototype.update = function (options) {
      $.extend(true, this, options);
    };

    // Example API function.
    myPlugin.prototype.resizeFunc = function () {
      //...do something when window is resized
    };

    // Main method.
    myPlugin.prototype.init = function () {
      //...do something to initialise plugin
    };

    return myPlugin;
  })();

  $.fn.myPlugin = function (options) {
    // Create a myPlugin instance if not available.
    if (!this.myPluginInstance) {
      this.myPluginInstance = new myPlugin(this, options || {});
    } else {
      this.myPluginInstance.update(options || {});
    }

    $.extend(true, this, this.myPluginInstance);

    // Init plugin.
    this.init();

    // return jQuery object to maintain chainability.
    return this;
  };
})(jQuery);
