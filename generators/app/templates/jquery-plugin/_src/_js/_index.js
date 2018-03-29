/*!
  jQuery <%= name %> plugin
  @name jquery.<%= name %>.js
  @author <%= author %> (<%= email %>)
  @version 1.0
  @date <%= new Date().toLocaleDateString() %>
  @category jQuery Plugin
  @copyright (c) <%= new Date().getFullYear()%> [<%= company %>] (<%= website %>)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function ($) {

  var <%= name %>, defaultOptions, __bind;

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
    //etc...
  };

  <%= name %> = (function (options) {

    function <%= name %>(handler, options) {
      this.handler = handler;

      // Extend default options.
      $.extend(true, this, defaultOptions, options);

      // Bind methods.
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);

    };

    // Method for updating the plugins options.
    <%= name %>.prototype.update = function (options) {
      $.extend(true, this, options);
    };

    // Example API function.
    <%= name %>.prototype.resizeFunc = function () {
      //...do something when window is resized
    };

    // Main method.
    <%= name %>.prototype.init = function () {
      //...do something to initialise plugin
    };

    return <%= name %>;
  })();

  $.fn.<%= name %> = function (options) {
    // Create a <%= name %> instance if not available.
    if (!this.<%= name %>Instance) {
      this.<%= name %>Instance = new <%= name %>(this, options || {});
    } else {
      this.<%= name %>Instance.update(options || {});
    }

    $.extend(true, this, this.<%= name %>Instance);

    // Init plugin.
    this.init();

    // return jQuery object to maintain chainability.
    return this.<%= name %>Instance;
  };
})(jQuery);
