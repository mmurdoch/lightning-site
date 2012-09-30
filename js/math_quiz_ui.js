Lightning.namespace("math");

/**
 * Creates a mental math quiz.
 *
 * @param {Array} questions the questions in the quiz as an array of two element arrays. 
 * Each two element array consists of a multiplicand and a multiplier.
 */
Lightning.math.math_quiz_ui = function (questions) {

    var that = {};

    var math_quiz;

    var answer_checker_id;

    that.reset = function () {
        hide_questions();
        answer().hide();
        results().hide();
        start().click(function () {
            question().show();
            question_marker().show();
            multiplicand().show();
            multiplication_symbol().show();
            multiplier().show();
            equals_symbol().show();
            answer().show();
            start().hide();
            math_quiz = Lightning.math.math_quiz(questions);
            setup_question();
            setup_answer_checker();
        });
    };

    var hide_questions = function () {
        question().hide();
        question_marker().hide();
        multiplicand().hide();
        multiplication_symbol().hide();
        multiplier().hide();
        equals_symbol().hide();
        answer().hide();
    };

    var setup_question = function () {
        clear_mark();
        multiplicand().text(math_quiz.get_multiplicand());
        multiplier().text(math_quiz.get_multiplier());
        setup_answer();
    };

    var setup_answer = function () {
        answer().val("");
        answer()[0].focus();
    };

    var setup_answer_checker = function () {
        answer_checker_id = setInterval(check_answer, 100);
    };

    var question = function () {
        return $("#question");
    };

    var question_marker = function() {
        return $("#question-marker");
    };

    var multiplicand = function () {
        return $("#multiplicand");
    };

    var multiplication_symbol = function () {
        return $("#multiplication-symbol");
    };

    var multiplier = function () {
        return $("#multiplier");
    };

    var equals_symbol = function () {
        return $("#equals-symbol");
    };

    var start = function () {
        return $("#start");
    };

    var answer = function () {
        return $("#answer");
    };

    var results = function () {
        return $("#results");
    };

    var results_chart = function () {
        return $("#results-chart");
    };

    var correct_count = function () {
        return $("#correct-count");
    };

    var incorrect_count = function () {
        return $("#incorrect-count");
    };

    var total_count = function () {
        return $("#total-count");
    };

    var check_answer = function () {
        if (math_quiz.is_finished()) {
            return;
        }

        var outcome = math_quiz.check_answer(answer().val() * 1);
        if (outcome.is_correct()) {
            mark_answer_correct();
        } else if (outcome.is_timed_out()) {
            mark_answer_incorrect();
        }
        // Otherwise, current answer is incorrect: wait for next call to
        // this function to determine whether the answer becomes correct 
        // or the question times out

        if (!outcome.is_incorrect()) {
            var next = setup_question;
            if (math_quiz.is_finished()) {
                next = display_results;
            }

            window.setTimeout(next, 1000);
        }
    };

    var display_results = function () {
        window.clearInterval(answer_checker_id);
        hide_questions();
        clear_mark();
        var quiz_results = math_quiz.get_results();

        results().show();
    };

    var get_result_axis_labels = function (quiz_results) {
        var labels = "";
        for (var i = 0; i <= quiz_results.get_total_count(); i++) {
            labels += "|";
            if (quiz_results.get_correct_count() === i || quiz_results.get_incorrect_count() === i) {
                labels += i;
            }
        }

        return labels;
    };

    var mark_answer_correct = function () {
        mark_answer("#afa");
    };

    var mark_answer_incorrect = function () {
        mark_answer("#f99");
    };

    var clear_mark = function () {
        mark_answer("#eee");
    };

    var mark_answer = function (color) {
        $(".question").css("background-color", color);
    };

    return that;
};