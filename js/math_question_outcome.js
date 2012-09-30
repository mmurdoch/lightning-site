Lightning.namespace('math');

/**
 * The outcome of a mental math question.
 */
Lightning.math.math_question_outcome = function () {

    var that = {};

    /**
     * Creates a correct outcome.
     *
     * @return {outcome} created correct outcome
     */
    that.correct = function () {
        return outcome(true, false);
    };

    /**
     * Creates an incorrect outcome.
     *
     * @return {outcome} created incorrect outcome
     */
    that.incorrect = function () {
        return outcome(false, false);
    };

    /**
     * Creates a timed out outcome.
     *
     * @return {outcome} created timed out outcome
     */
    that.timed_out = function () {
        return outcome(false, true);
    };

    var outcome = function (correct, timed_out) {
        return {
            is_correct: function () {
                return correct;
            },
            is_timed_out: function () {
                return timed_out;
            },
            is_incorrect: function () {
                return !correct && !timed_out;
            }
        }
    };

    return that;
};