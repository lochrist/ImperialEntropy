'use strict';
define(['app'], function (app) {
    app.directive('reportFloating', [function () {
        return {
            restrict: 'E',
            scope: {
                reports: '='
            },
            templateUrl: "js/directives/report-floating.html"
        };
    }]);
});
