var HFDM_SDK = require('@adsk/forge-hfdm');
// import your data models
var Point2DTemplate = require('./point2d-1.0.0.json');
// import the property factory
var PropertyFactory = HFDM_SDK.PropertyFactory;
// register your data models
PropertyFactory.register(Point2DTemplate);

module.exports = PropertyFactory;