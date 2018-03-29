/*!
  jQuery timebar plugin
  @name jquery.timebar.js
  @author pulkitchadha (pulkitchadha27@gmail.com]
  @version 1.0
  @date 28/03/2018
  @category jQuery Plugin
  @copyright (c) 2018 pulkitchadha (pulkitchadha)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function ($) {

    var timebar, defaultOptions, __bind;

    __bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    // Plugin default options.
    defaultOptions = {
        //properties
        element: null,
        totalTimeInSecond: 0,
        cuepoints: [],
        width: 0,
        globalPageX: 0,
        selectedTime: 0,
        multiSelect: false,
        showCuepoints: true,
        stepBars: 100,
        timeIntervals: 10,
        // events
        barClicked: null,
        cuepointClicked: null,

        //Currently, Not supported

        // life cycle methods
        beforeCreate: null,
        created: null,
        beforeMount: null,
        mounted: null,
        beforeUpdate: null,
        updated: null,
        // hooks
        beforeAddCuepoint: null,
        afterAddCuepoint: null,
        beforeUpdateCuepoint: null,
        afterUpdateCuepoint: null,
        beforeDeleteCuepoint: null,
        afterDeleteCuepoint: null,
    };

    timebar = (function (options) {

        function timebar(element, options) {

            // Extend default options.
            $.extend(true, this, defaultOptions, options);

            this.element = element;

            // Bind methods.
            this.init = __bind(this.init, this);
            this.update = __bind(this.update, this);
            this.getSelectedTime = __bind(this.getSelectedTime, this);
            this.setSelectedTime = __bind(this.setSelectedTime, this);
            this.getTotalTime = __bind(this.getTotalTime, this);
            this.setTotalTime = __bind(this.setTotalTime, this);
            this.getWidth = __bind(this.getWidth, this);
            this.setWidth = __bind(this.setWidth, this);
            this.getActualWidth = __bind(this.getActualWidth, this);
            this.formatTime = __bind(this.formatTime, this);
            this.addCuepoints = __bind(this.addCuepoints, this);
            this.deleteSelectedCuepoints = __bind(this.deleteSelectedCuepoints, this);
            this.updateSelectedCuepoint = __bind(this.updateSelectedCuepoint, this);
            this.showHideCuepoints = __bind(this.showHideCuepoints, this);

            // Listen to events
            $(this).on('click', '.steps-bar', this._barClicked);
            $(this).on("click", '.pointer', this._cuepointClicked);
        };

        // Method for updating the plugins options.
        timebar.prototype.update = function (options) {
            $.extend(true, this, options);
        };

        // methods
        timebar.prototype.getSelectedTime = function () {
            return this.selectedTime;
        };
        timebar.prototype.setSelectedTime = function (time) {
            if (!time && time !== 0) throw new Error('please pass the valid time');

            this.selectedTime = parseInt(time);
            return this;
        };
        timebar.prototype.getTotalTime = function () {
            return this.totalTimeInSecond;
        };
        timebar.prototype.setTotalTime = function (time) {
            if (!time) throw new Error('please pass the valid time');

            this.totalTimeInSecond = parseInt(time);
            return this;
        };
        timebar.prototype.getWidth = function () {
            return this.width;
        };
        timebar.prototype.setWidth = function (width) {
            if (!width) throw new Error('please pass the valid width');

            this.width = width;
            width = this.getActualWidth() + 57;
            $(".timeline-cover").css('width', width + 'px');
            return this;
        };
        timebar.prototype.getActualWidth = function () {
            let width = this.width;
            width = parseInt(width.replace(/px|%/g, ''));
            return width;
        }
        timebar.prototype.getCuepoints = function () {
            return this.cuepoints;
        }
        timebar.prototype.formatTime = function (sec_num) {
            return toDuration(sec_num);
        }
        timebar.prototype.addCuepoints = function (cuepoint) {
            if (!cuepoint) throw new Error('please pass the valid time');

            cuepoint = parseInt(cuepoint);

            if (!this.cuepoints.includes(cuepoint)) {
                this.cuepoints.push(cuepoint);
                markCuepoints(cuepoint);
            } else {
                throw new Error('Cuepoint already exists');
            }

            return this;
        }
        timebar.prototype.deleteSelectedCuepoints = function () {
            const cuepoints = this.cuepoints;
            const selectedCuepoints = [];

            $(".pointerSelected").each(function () {
                const id = $(this).attr("id");
                selectedCuepoints.push(parseInt(id));
            });

            if (selectedCuepoints.length) {
                this.cuepoints = cuepoints.filter((val) => !selectedCuepoints.includes(val));
                $(".pointerSelected").remove();
            } else {
                throw new Error('No Cuepoint is selected');
            }

            return this;
        }
        timebar.prototype.updateSelectedCuepoint = function (cuepoint) {
            const selectedCuepoints = [];

            $(".pointerSelected").each(function () {
                const id = $(this).attr("id");
                selectedCuepoints.push(parseInt(id));
            });

            if (selectedCuepoints.length > 1) throw new Error('Please select only one cuepoint to update');

            this.deleteSelectedCuepoints();

            this.addCuepoints(cuepoint);

            return this;
        }
        timebar.prototype.showHideCuepoints = function (show) {
            if (!show) throw new Error('please pass a valid value');

            parseBoolean(show) ? $(".pointer").show() : $(".pointer").hide();

            return this;
        }

        // Main method.
        timebar.prototype.init = function () {
            let data = `<div class='timeline-cover'>
                            <div id='draggable'></div>
                            <div class='timeline-bar'>
                                <div class='steps-bar clearfix'></div>
                            </div>
                        </div>`;

            $(this.element).append(data);

            this.setWidth(this.width);

            let timeDivison = this.totalTimeInSecond / this.stepBars;
            let time = 0;

            // mark bars
            for (let i = 0; i <= this.stepBars; i++) {
                $(".steps-bar").append(`<div class="step" data-time=${time}><span class="step-border"></span></div>`);
                time = time + timeDivison;
            }

            let markTimeDivison = this.totalTimeInSecond / this.timeIntervals;

            // mark time intervals
            for (let i = 0; i <= this.timeIntervals; i++) {
                const time = this.toDuration(Math.round(markTimeDivison * i));
                const pos = i * 10 + 1;
                $(`.step:nth-child(${pos})`).append(`<span class="time-instant">${time}</span>`);
            }

            this.markCuepoints(this.cuepoints);

            if (!this.showCuepoints) {
                $(".pointer").hide();
            }
        };

        timebar.prototype.toDuration = function (sec_num) {
            let hours = Math.floor(sec_num / 3600);
            let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            let seconds = sec_num - (hours * 3600) - (minutes * 60);
            if (hours < 10) {
                hours = "0" + Math.round(hours);
            }
            if (minutes < 10) {
                minutes = "0" + Math.round(minutes);
            }
            if (seconds < 10) {
                seconds = "0" + Math.round(seconds);
            }
            const time = (hours == 00) ? minutes + ':' + seconds : hours + ':' + minutes + ':' + seconds;
            return time;
        }

        timebar.prototype.markCuepoints = function (cuepoints = []) {
            const options = this;
            const cuepointArr = Array.isArray(cuepoints) ? cuepoints : [cuepoints];

            $.each(cuepointArr, function (i, time) {
                const animateLeft = (time * 100) / options.totalTimeInSecond;
                $(".timeline-bar").append(`<div class="pointer" style="left:${animateLeft}%" data-time="${time}"></div>`);
            });
        }

        timebar.prototype._barClicked = function (event) {
            const offset = $(this).offset();
            const offsetLeft = (event.pageX - offset.left);

            $('.pointer').removeClass("pointerSelected");

            $("#draggable").css({
                left: `${offsetLeft}px`
            });
        };
        timebar.prototype._cuepointClicked = function () {

            $(this).hasClass("pointerSelected") ? $(this).removeClass("pointerSelected") : $(this).addClass("pointerSelected");

            this.setSelectedTime($(this).data("time"));

            if (typeof this.cuepointClicked === 'function') {
                this.cuepointClicked.call(this, this.getSelectedTime());
            }
        }

        timebar.prototype.parseBoolean = function (val) {
            return (val.toLowerCase() === 'true');
        }

        return timebar;
    })();

    $.fn.timebar = function (options) {
        // Create a timebar instance if not available.
        if (!this.timebarInstance) {
            this.timebarInstance = new timebar(this, options || {});
        } else {
            this.timebarInstance.update(options || {});
        }

        $.extend(true, this, this.timebarInstance);

        // Init plugin.
        this.init();

        // return jQuery object to maintain chainability.
        return this;
    };
})(jQuery);