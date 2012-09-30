Lightning.namespace('time');

/**
 * The system clock.
 */
Lightning.time.clock = function () {

    var that = {};

    /**
     * Returns the current point in time.
     *
     * @return {Date} current point in time
     */
    that.get_now = function () {
        return new Date();
    };

    return that;
};