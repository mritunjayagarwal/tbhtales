const dependable = require('dependable');
const path = require('path');
const container = dependable.container();
const myModules = [
    ['_', 'lodash'],
    ['User', './models/user'],
    ['Tbh', './models/tbhs'],
    ['passport', 'passport'],
    ['moment', 'moment']
];

myModules.forEach(function(val){
    container.register(val[0], function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname, '/controllers'));

container.register(container, function(){
    return container;
});

module.exports = container;