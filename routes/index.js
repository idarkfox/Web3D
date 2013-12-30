/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};

exports.edit = function (req, res) {
    res.render('edit');
}

exports.test = function (req, res) {
    res.render('test', {title: "代码测试"});
}

exports.test2 = function (req, res) {
    res.render('test2', {title: "代码测试"});
}

exports.examples = function (req, res) {
    res.redirect("/examples/index.html");
}