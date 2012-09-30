Lightning.test.test_test = function () {

    var that = Lightning.test.test({name: "test_test"});

    that.test_assert_true_non_boolean_throws = function () {
        var test = create_test();
        test.test_function = function () {
            try {
                test.assert_true({});
                that.fail();
            } catch (e) {
                // Success
            }
        };
        test.run();
    };

    that.test_assert_false_non_boolean_throws = function () {
        var test = create_test();
        test.test_function = function () {
            try {
                test.assert_false({});
                that.fail();
            } catch (e) {
                // Success
            }
        };
        test.run();
    };

    that.test_assert_unequal_integers_fails = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_equals(1, 2);
        };
        test.run();

        that.assert_false(test.was_successful());
        that.assert_equals("In 'test_function': Assertion failed: expected <1> but was <2>", 
               test.get_logger().get_log());
        };

        that.test_assert_equal_integers_successful = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_equals(1, 1);
        };
        test.run();

        that.assert_true(test.was_successful());
    };

    that.test_assert_false_true_fails = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_false(true);
        };
        test.run();

        that.assert_false(test.was_successful());
        that.assert_equals("In 'test_function': Assertion failed", 
            test.get_logger().get_log());
    };

    that.test_assert_false_false_successful = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_false(false);
        };
        test.run();

        that.assert_true(test.was_successful());
    };

    that.test_assert_true_false_fails = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_true(false);
        };
        test.run();

        that.assert_false(test.was_successful());
        that.assert_equals("In 'test_function': Assertion failed", 
            test.get_logger().get_log());
    };

    that.test_assert_true_true_successful = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_true(true);
        };
        test.run();

        that.assert_true(test.was_successful());
    };

    that.test_fail_with_no_message = function () {
        var test = create_test();
        test.test_function = function () {
            test.fail();
        };
        test.run();

        that.assert_equals("In 'test_function': Failure", 
           test.get_logger().get_log());
    };

    that.test_failure_outputs_function_name = function () {
        var test = create_test();
        test.test_test_name = function () {
            test.assert_true(false);
        };
        test.run();

        that.assert_equals("In 'test_test_name': Assertion failed", 
           test.get_logger().get_log());
    };

    that.test_exceptions_caught = function () {
        var test = create_test();
        test.test_function = function () {
            throw {name: "E", message: "M"};
        };

        try {
            test.run();
        } catch (e) {
            that.fail();
        }

        that.assert_equals("In 'test_function': Exception thrown (name: E, message: M)", test.get_logger().get_log());
    };

    that.test_no_tests_no_failures = function () {
        var test = create_test();
        
        var result = test.run();
        
        that.assert_equals(0, result.get_failure_count());
    };
    
    that.test_one_failing_test_one_failure = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_true(false);
        };
    
        var result = test.run();
    
        that.assert_equals(1, result.get_failure_count());
    };

    that.test_two_failing_tests_two_failures = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_true(false);
        };
        test.test_function_2 = function () {
            test.assert_true(false);
        };
    
        var result = test.run();
    
        that.assert_equals(2, result.get_failure_count());
    };

    that.test_no_tests_no_successes = function () {
        var test = create_test();
        
        var result = test.run();
        
        that.assert_equals(0, result.get_success_count());
    };

    that.test_one_successful_test_one_success = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_true(true);
        };
    
        var result = test.run();

        that.assert_equals(1, result.get_success_count());
    };

    that.test_two_sucessful_tests_two_successes = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_true(true);
        };
        test.test_function_2 = function () {
            test.assert_true(true);
        };
    
        var result = test.run();

        that.assert_equals(2, result.get_success_count());
    };

    that.test_no_tests_no_exceptions = function () {
        var test = create_test();
        
        var result = test.run();
        
        that.assert_equals(0, result.get_exception_count());
    };
    
    that.test_one_throwing_test_one_exception = function () {
        var test = create_test();
        test.test_function = function () {
            throw {name: "E", message: "M"};
        };

        var result = test.run();
    
        that.assert_equals(1, result.get_exception_count());
    };

    that.test_two_throwing_tests_two_exceptions = function () {
        var test = create_test();
        test.test_function = function () {
            throw {name: "E", message: "M"};
        };
        test.test_function_2 = function () {
            throw {name: "E", message: "M"};
        };

        var result = test.run();
    
        that.assert_equals(2, result.get_exception_count());
    };

    that.test_failing_assertion_fails_test = function () {
        var test = create_test();
        test.test_function = function () {
            test.assert_true(false);
            test.assert_true(true);
        };

        var result = test.run();
    
        that.assert_equals(1, result.get_failure_count());
        that.assert_equals(0, result.get_success_count());
    };

    that.test_failing_assertion_stops_test = function () {
        var unreachable_code = true;
        var test = create_test();
        test.test_function = function () {
            test.assert_true(false);
            unreachable_code = false;
        };

        var result = test.run();
    
        that.assert_true(unreachable_code);
    };

    var create_test = function () {
        return Lightning.test.test({logger : string_logger()});
    };

    var string_logger = function () {

        var that = {};

        var log = "";
    
        that.log = function (message) {
            log += message;
        };

        that.get_log = function () {
            return log;
        };

        return that;
    };

    return that;
};
