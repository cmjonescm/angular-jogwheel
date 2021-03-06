// Karma configuration
// Generated on Wed Oct 02 2013 20:44:25 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'client_modules/angular/angular.js',
        'test/libs/angular/angular-mocks.js',
        'test/libs/sinon/sinon.js',

        // application code to test
        'app/**/*.js',

        // unit tests
        'test/unit/*.js'
    ],


    // list of files to exclude
    exclude: [
        'app/app.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters:  ['coverage', 'progress'],


    preprocessors:  {
        // configure which files should be tested for coverage
        'app/**/*.js': ['coverage']
    },


    coverageReporter: {
        type : 'html',
        dir : 'test/coverage/'
    }

  });
};
