Lightning.test = {};

Lightning.test.logger = {};

/**
 * Test outcome logger for use in a web browser environment.
 */
Lightning.test.logger.browser = function () {

    var that = {};

    that.log = function (message) {
        var text = document.createTextNode(message);
        document.body.appendChild(text);
        var line_break = document.createElement('br');
        document.body.appendChild(line_break);
    };

    return that;
};

/**
 * Test outcome logger for use in a spidermonkey environment.
 */
Lightning.test.logger.spidermonkey = function () {

    var that = {};

    that.log = function (message) {
        print(message);
    };

    return that;
};

Lightning.test.includer = {};

/**
 * JavaScript file includer for use in a web browser environment.
 */
Lightning.test.includer.browser = function () {

    var that = {};
    
    that.include = function (filename) {
        var script_element = document.createElement('script');
        script_element.setAttribute("src", filename);
        document.getElementsByTagName("head")[0].appendChild(script_element);
    }
    
    return that;
};

Lightning.test.test_runner = function () {
  
    var that = {};
    
    var tests = [];
    
    /**
     * Adds a test to this test runner.
     *
     * @param {Lightning.test.test} the test to add
     */
    that.add_test = function (test) {
        tests.push(test);
    }
    
    that.run = function () {
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
        
            test.get_logger().log("Running: " + test.get_name());
            var result = test.run();
            test.get_logger().log(
                "Sucesses: " + result.get_success_count() +
                " Failures: " + result.get_failure_count() +
                " Exceptions: " + result.get_exception_count());
        }
    }
    
    return that;
};

/**
 * Creates a test.
 *
 * @param {Object} spec.logger optional logger, if ommitted by default checks
 * whether being run within a browser or from the command line and logs messages
 * appropriately.
 * @param {String} spec.name the name of the test
 * @return {Object} the created test
 */
Lightning.test.test = function (spec) {

    var that = {};

    var success = true;
    
    var failures = 0;
    var successes = 0;
    var exceptions = 0;

    var current_test_function_name;

    var logger = function () {
        if (spec && spec.logger) {
            return spec.logger;
        } else if (typeof document !== 'undefined') {
           return Lightning.test.logger.browser();
        } else if (typeof print !== 'undefined') {
           return Lightning.test.logger.spidermonkey();
        } else {
           throw {name: "UnknownEnvironmentError", message: "Cannot determine the test execution environment"};
        }
    }();

    /**
     * Returns the name of the test or '<Unknown>' if not specified.
     *
     * @return {String} test name
     */
    that.get_name = function () {
        if (spec && spec.name) {
            return spec.name;
        } else {
            return "Unknown";
        }
    };

    /**
     * Returns the test outcome logger.
     *
     * @return {Object} test outcome logger
     */
    that.get_logger = function () {
        return logger;
    };

    /**
     * Returns whether or not the test was successful.
     *
     * @return true if the test was successful, false otherwise
     */
    that.was_successful = function () {
        return success;
    };

    /**
     * Executes all test functions (identified by starting with 
     * 'test_') in this object.
     *
     * @return {Object} result of execution
     */
    that.run = function () {
        var test_functions = find_test_functions();

        for (var i = 0; i < test_functions.length; i++) {
            run_test_function(test_functions[i]);
        }
        
        return {
            /**
             * Returns the number of failing test functions.
             *
             * @return the number of test failures
             */
            get_failure_count: function () {
                return failures;
            },

            /**
             * Returns the number of succeeding test functions.
             *
             * @return the number of test successes
             */
            get_success_count: function () {
                return successes;
            },

            /**
             * Returns the number of test functions throwing exceptions.
             *
             * @return the number of exception-throwing tests
             */
            get_exception_count: function () {
                return exceptions;
            }
        };
    };

    /**
     * Finds all test functions (identified by starting with 
     * 'test_' in this object.
     *
     * @return {Array} located test function names
     */
    var find_test_functions = function () {
        var test_functions = [];
        for (var key in that) {
            if (key.substring(0, 5).toLowerCase() == "test_") {
                test_functions.push(key);
            }
        }

        return test_functions;
    };

    /**
     * Executes a test function.
     *
     * @param {String} function_name name of test function to execute
     */
    var run_test_function = function (function_name) {
        var current_failures = failures;
        current_test_function_name = function_name;
        try {
            that[function_name]();
            if (failures <= current_failures) {
                successes++;
            }
        } catch (e) {
            if (e.name !== 'TestFailedError') {
                log_failure("Exception thrown (name: " + e.name + ", message: " + e.message + ")");
                exceptions++;
            }
        }
    };

    /**
     * Asserts that a condition is true.
     *
     * @param {Boolean} condition condition to check
     */
    that.assert_true = function (condition) {
        if (typeof condition !== 'boolean') {
            throw {
                name : "IllegalArgumentError", 
                message : "condition must be a boolean"
            };
        }

        if (!condition) {
            that.fail("Assertion failed");
        }
    };

    /**
     * Asserts that a condition is false.
     *
     * @param {Boolean} condition condition to check
     */
    that.assert_false = function (condition) {
        if (typeof condition !== 'boolean') {
            throw {
                name : "IllegalArgumentError", 
                message : "condition must be a boolean"
            };
        }

        this.assert_true(!condition);
    };

    /**
     * Asserts that two values are identical.
     *
     * @param expected expected value
     * @param actual actual value
     */
    that.assert_equals = function (expected, actual) {
        if (expected !== actual) {
            that.fail("Assertion failed: expected <" + expected + 
                      "> but was <" + actual + ">");
        }
    };

    /**
     * Asserts that the specified function throws an exception.
     *
     * @param {Function} f the function which is expected to throw
     * @param {Object} expected the expected exception object containing
     * a name and a message property
     */
    that.assert_throws = function (f, expected) {
        try {
            f();
            that.fail();
        } catch (e) {
            that.assert_equals(expected.name, e.name);
            that.assert_equals(expected.message, e.message);
        }
    };

    /**
     * Fails a test, logging a message.
     *
     * @param message failure message to log
     */
    that.fail = function (message) {
        success = false;
        failures++;

        message = message || "Failure";

        log_failure(message);
        throw {name: "TestFailedError", message: "In '" + current_test_function_name + "': " + message};
    };

    var log_failure = function (message) {
        logger.log("In '" + current_test_function_name + "': " + message);
    };

    return that;
};
