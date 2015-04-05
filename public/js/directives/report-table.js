'use strict';
define(['app'], function (app) {
    app.directive('reportTable', [function () {
        return {
            restrict: 'E',
            scope: {
                reports: '='
            },
            templateUrl: "js/directives/report-table.html"
        };
    }]);
});
