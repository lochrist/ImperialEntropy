'use strict';
define(['app'], function (app) {
    app.directive('reportTable', [function () {
        return {
            restrict: 'E',
            scope: {
                reports: '=',
                reportDescs: '='
            },
            templateUrl: "js/directives/report-table.html"
        };
    }]);
});
