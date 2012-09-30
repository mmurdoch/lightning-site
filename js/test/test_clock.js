Lightning.namespace('test');

/**
 * A clock used for testing purposes.
 */
Lightning.test.clock = function () {

    var that = {};

    var now = new Date(0);

    /**
     * Returns the current point in time.
     *
     * @return {Date} current point in time
     */
    that.get_now = function () {
        return now;
    };

    /**
     * Sets the current point in time.
     *
     * @param {Date} new_now current point in time to set
     */
    that.set_now = function (new_now) {
        now = new_now;
    };

    return that;
};