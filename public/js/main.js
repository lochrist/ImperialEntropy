/*global require*/
'use strict';

require.config({
	paths: {
		angular: '../libs/angular/angular',
		jsface: '../libs/jsface/jsface',
		lodash: '../libs/lodash/lodash'
	},
	shim: {
		angular: {
			exports: 'angular'
		}
	}
});

require(['angular', 'app', 'controllers/entropy'], function (angular) {
	angular.bootstrap(document, ['entropy']);
});
