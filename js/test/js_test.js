var load_javascript = function (filepath_base) {
    load(filepath_base + '.js');
};

var load_production_code = function (filename_base) {
    load_javascript('../../public/' + filename_base);
};

var run_test = function (namespace, to_test) {
    print('Running: ' + to_test + '_test');
    Lightning[namespace][to_test + '_test']().run();
};

load_production_code('Lightning');
load_production_code('clock');
load_production_code('math_question_outcome');

load_javascript('test');
load_javascript('test_test');

load_javascript('test_clock');

run_test('test', 'test');

var all_to_test = ['math_quiz'];

var i;
var to_test;
for (i = 0; i < all_to_test.length; i++) {
    to_test = all_to_test[i];
    load_production_code(to_test);
    load_javascript(to_test + '_test');
    run_test('math', to_test);
}
