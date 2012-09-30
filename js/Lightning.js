/**
 * Core Lightning javascript functions.
 *
 * @author Matthew Murdoch
 */
var Lightning;
if (typeof Lightning === 'undefined') {
    Lightning = {};
};

/**
 * Creates a nested namespace within the Lightning namespace if it 
 * doesn't already exist.
 *
 * @param ns {String} the name of the namespace to create
 * @return {Object} the requested namespace
 */
Lightning.namespace = function (ns) {
    if (!this[ns]) {
        this[ns] = {};
    }

    return this[ns];
};

/**
 * Creates a new object which extends the specified object.
 *
 * @param {Object} obj the object to extend
 * @return {Object} the new object
 */
Lightning.create = function (obj) {
    var F = function () {};
    F.prototype = obj;
    return new F();
};
