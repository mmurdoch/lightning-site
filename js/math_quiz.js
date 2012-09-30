Lightning.namespace('math');

/**
 * Creates a mental math quiz.
 *
 * @param {Array} spec.questions the questions in the quiz as an array of 
 * two element arrays. Each two element array consists of a multiplicand 
 * and a multiplier.
 * @param {clock} spec.clock optional clock providing a get_now() function
 * which returns a Date object denoting the current time
 */
Lightning.math.math_quiz = function (spec) {

    var that = {};

    var current_question = 0;

    var timeout_milliseconds = 10000;

    spec.clock = spec.clock || Lightning.time.clock();

    var start_time = spec.clock.get_now();

    var correct_count = 0;

    /**
     * Returns the multiplicand of the current question.
     *
     * @return {Number} integer multiplicand
     */
    that.get_multiplicand = function () {
        check_quiz_not_finished();

        return spec.questions[current_question][0];
    };
    
    /**
     * Returns the multiplier of the current question.
     *
     * @return {Number} integer multiplier
     */
    that.get_multiplier = function () {
        check_quiz_not_finished();

        return spec.questions[current_question][1];
    };

    var check_quiz_not_finished = function () {
        if (spec.questions[current_question] === undefined) {
            throw {
                name : "NoMoreQuestionsError", 
                message : "Math quiz completed, no more questions to answer"
            };
        }
    };

    /**
     * Checks the answer of the current question. If the answer is correct
     * or if the time allowed for answering the question has expired, the 
     * quiz moves to the next question.
     *
     * @param {Number} answer the answer to check
     * @return {Boolean} true if the answer is correct, false otherwise
     */
    that.check_answer = function (answer) {
        if (spec.clock.get_now() - start_time > timeout_milliseconds) {
            move_to_next_question();
            return timed_out();
        }

        if (answer === (that.get_multiplicand() * that.get_multiplier())) {
            move_to_next_question();
            correct_count++;
            return correct();
        }

        return incorrect();
    };

    /**
     * Returns whether or not all the questions in this math quiz have
     * been answered correctly or timed out.
     *
     * @return {Boolean} true if all the questions have been answered 
     * correctly or timed out, false otherwise
     */
    that.is_finished = function () {
        return current_question === spec.questions.length;
    };

    var move_to_next_question = function () {
        current_question++;
        start_time = spec.clock.get_now();
    };

    var correct = function () {
        return Lightning.math.math_question_outcome().correct();
    };

    var incorrect = function () {
        return Lightning.math.math_question_outcome().incorrect();
    };
    
    var timed_out = function () {
        return Lightning.math.math_question_outcome().timed_out();
    };

    /**
     * Returns the amount of time in milliseconds in which a question 
     * can be answered.
     *
     * @return {Number} timeout in milliseconds
     */
    that.get_timeout_milliseconds = function () {
        return timeout_milliseconds;
    };

    /**
     * Returns the results of the math quiz.
     *
     * @return {Object} results of the math quiz
     */
    that.get_results = function () {
        var that = {};

        that.get_correct_count = function () {
            return correct_count;
        };

        that.get_incorrect_count = function () {
            return that.get_total_count() - that.get_correct_count();
        };

        that.get_total_count = function () {
            return spec.questions.length;
        };

        return that;
    };

    return that;
};
