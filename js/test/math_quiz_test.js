Lightning.math.math_quiz_test = function () {

    var that = Lightning.test.test({name: "math_quiz_test"});

    that.test_get_multiplicand = function () {
        var math_quiz = create_math_quiz([[1,2]]);

        that.assert_equals(1, math_quiz.get_multiplicand());
    };

    that.test_check_incorrect_answer = function () {
        var math_quiz = create_math_quiz([[4,2],[5,3]]);
        var outcome = math_quiz.check_answer(incorrect_answer(math_quiz));

        that.assert_true(is_incorrect(outcome));
        that.assert_equals(4, math_quiz.get_multiplicand());
        that.assert_equals(2, math_quiz.get_multiplier());
    };

    that.test_check_correct_answer = function () {
        var math_quiz = create_math_quiz([[4,2],[5,3]]);

        var outcome = math_quiz.check_answer(correct_answer(math_quiz));

        that.assert_true(is_correct(outcome));
        that.assert_equals(5, math_quiz.get_multiplicand());
        that.assert_equals(3, math_quiz.get_multiplier());
    };

    var correct_answer = function (math_quiz) {
        return math_quiz.get_multiplicand() * math_quiz.get_multiplier();
    };

    var incorrect_answer = function (math_quiz) {
        return correct_answer(math_quiz) + 1;
    };

    that.test_finished_quiz = function () {
        var math_quiz = create_math_quiz([[4,1]]);

        that.assert_false(math_quiz.is_finished());

        math_quiz.check_answer(correct_answer(math_quiz));

        that.assert_true(math_quiz.is_finished());
    };

    that.test_check_answer_after_end_throws = function () {
        var math_quiz = create_math_quiz([[3,6]]);
        math_quiz.check_answer(correct_answer(math_quiz));

        that.assert_throws(function () {
        math_quiz.check_answer(correct_answer(math_quiz));
        }, {name: "NoMoreQuestionsError", message: "Math quiz completed, no more questions to answer"});
    };

    that.test_check_answer_just_before_timeout = function () {
        var math_quiz = create_math_quiz_and_wait_for_timeout_plus(0);

        var outcome = math_quiz.check_answer(correct_answer(math_quiz));

        that.assert_true(is_correct(outcome));
    };

    that.test_check_answer_after_timeout = function () {
        var math_quiz = create_math_quiz_and_wait_for_timeout_plus(1);

        var outcome = math_quiz.check_answer(correct_answer(math_quiz));

        that.assert_true(is_timed_out(outcome));
    };

    that.test_timeout_resets_for_next_question_after_success = function () {
        var clock = Lightning.test.clock();
        var math_quiz = create_math_quiz_with_clock(clock);
        clock.set_now(math_quiz.get_timeout_milliseconds());
        math_quiz.check_answer(correct_answer(math_quiz));
        clock.set_now(clock.get_now() + 1);

        var outcome = math_quiz.check_answer(correct_answer(math_quiz));

        that.assert_true(is_correct(outcome));
    };

    that.test_timeout_resets_for_next_question_after_timeout = function () {
        var math_quiz = create_math_quiz_and_wait_for_timeout_plus(1);
        math_quiz.check_answer(correct_answer(math_quiz));
    
        var outcome = math_quiz.check_answer(correct_answer(math_quiz));
    
        that.assert_true(is_correct(outcome));
    };

    that.test_correct_results = function () {
        var math_quiz = create_math_quiz(arbitrary_questions());
        math_quiz.check_answer(correct_answer(math_quiz));
        math_quiz.check_answer(correct_answer(math_quiz));

        var math_quiz_results = math_quiz.get_results();

        that.assert_equals(2, math_quiz_results.get_correct_count());
    };

    that.test_incorrect_results = function () {
        var math_quiz = create_math_quiz(arbitrary_questions());
        math_quiz.check_answer(correct_answer(math_quiz));
        math_quiz.check_answer(correct_answer(math_quiz));

        var math_quiz_results = math_quiz.get_results();

        that.assert_equals(0, math_quiz_results.get_incorrect_count());
    };

    that.test_total_results = function () {
        var math_quiz = create_math_quiz(arbitrary_questions());
        math_quiz.check_answer(correct_answer(math_quiz));
        math_quiz.check_answer(correct_answer(math_quiz));

        var math_quiz_results = math_quiz.get_results();

        that.assert_equals(2, math_quiz_results.get_total_count());
    };

    var is_correct = function (outcome) {
        return outcome.is_correct() && !outcome.is_timed_out();
    };

    var is_incorrect = function (outcome) {
        return !outcome.is_correct() && !outcome.is_timed_out();
    };

    var is_timed_out = function (outcome) {
        return !outcome.is_correct() && outcome.is_timed_out();
    };

    var create_math_quiz_and_wait_for_timeout_plus = function (milliseconds) {
        var clock = Lightning.test.clock();
        var math_quiz = create_math_quiz_with_clock(clock);
        clock.set_now(math_quiz.get_timeout_milliseconds() + milliseconds);
    
        return math_quiz;
    };

    var create_math_quiz = function (questions) {
        return Lightning.math.math_quiz({questions : questions});
    };

    var create_math_quiz_with_clock = function (clock) {
        return Lightning.math.math_quiz({
            questions : arbitrary_questions(), 
            clock : clock});
    };

    var arbitrary_questions = function () {
        return [[6,3],[3,8]];
    };

    return that;
};
