/*global define*/
'use strict';

define(['app', 'lodash'], function (app, _) {
	return app.controller('EntropyController', ['$scope', function EntropyController($scope) {
		var red = {
			name: "red",
			faces: [
				{
					dmg: 2,
					surge: 1,
					accuracy: 0
				},
				{
					dmg: 2,
					surge: 0,
					accuracy: 0
				},
				{
					dmg: 1,
					surge: 0,
					accuracy: 0
				},
				{
					dmg: 2,
					surge: 0,
					accuracy: 0
				},
				{
					dmg: 3,
					surge: 0,
					accuracy: 0
				},
				{
					dmg: 3,
					surge: 0,
					accuracy: 0
				}
			]
		};

		var green = {
			name: "green",
			faces:[
				{
					dmg: 2,
					surge: 0,
					accuracy: 1
				},
				{
					dmg: 2,
					surge: 0,
					accuracy: 2
				},
				{
					dmg: 2,
					surge: 0,
					accuracy: 3
				},
				{
					dmg: 0,
					surge: 1,
					accuracy: 1
				},
				{
					dmg: 1,
					surge: 1,
					accuracy: 2
				},
				{
					dmg: 1,
					surge: 1,
					accuracy: 1
				}]
		};

		var blue = {
			name: "blue",
			faces:[
				{
					dmg: 0,
					surge: 1,
					accuracy: 2
				},
				{
					dmg: 1,
					surge: 0,
					accuracy: 2
				},
				{
					dmg: 1,
					surge: 1,
					accuracy: 3
				},
				{
					dmg: 1,
					surge: 0,
					accuracy: 5
				},
				{
					dmg: 2,
					surge: 0,
					accuracy: 3
				},
				{
					dmg: 2,
					surge: 0,
					accuracy: 4
				}]
		};

		var yellow = {
			name: "yellow",
			faces: [
				{
					dmg: 2,
					surge: 0,
					accuracy: 2
				},
				{
					dmg: 2,
					surge: 0,
					accuracy: 1
				},
				{
					dmg: 1,
					surge: 2,
					accuracy: 0
				},
				{
					dmg: 1,
					surge: 1,
					accuracy: 1
				},
				{
					dmg: 0,
					surge: 1,
					accuracy: 2
				},
				{
					dmg: 0,
					surge: 1,
					accuracy: 0
				}
			]
		};

		var black = {
			name: "black",
			faces: [
				{
					def: 2,
					surge: 0,
					miss: 0
				},
				{
					def: 2,
					surge: 0,
					miss: 0
				},
				{
					def: 3,
					surge: 0,
					miss: 0
				},
				{
					def: 1,
					surge: 0,
					miss: 0
				},
				{
					def: 1,
					surge: 0,
					miss: 0
				},
				{
					def: 0,
					surge: 1,
					miss: 0
				}
			]
		};

		var white = {
			name: "white",
			faces: [
				{
					def: 1,
					surge: 1,
					miss: 0
				},
				{
					def: 1,
					surge: 0,
					miss: 0
				},
				{
					def: 0,
					surge: 0,
					miss: 1
				},
				{
					def: 0,
					surge: 1,
					miss: 0
				},
				{
					def: 1,
					surge: 1,
					miss: 0
				},
				{
					def: 0,
					surge: 0,
					miss: 0
				}
			]
		};

		function computeDiceCombinations(d1, d2, d3, dices, faceCombinations) {
			dices.push(d1);

			if (d3) {
				_.each(d1.faces, function (face1) {
					_.each(d2.faces, function (face2) {
						_.each(d3.faces, function (face3) {
							faceCombinations.push([face1, face2, face3]);
						});
					});
				});
				dices.push(d2);
				dices.push(d3);
			} else if (d2) {
				_.each(d1.faces, function (face1) {
					_.each(d2.faces, function (face2) {
						faceCombinations.push([face1, face2]);
					});
				});
				dices.push(d2);
			} else{
				_.each(d1.faces, function (face1) {
					faceCombinations.push([face1]);
				});
			}
		}

		function accum(combinations, attr) {
			return _.map(combinations, function (faces) {
				var value = 0;
				_.each(faces, function (face) {
					value += face[attr];
				});
				return value;
			});
		}

		function createReport(results) {
			results.sort(function (a, b) { return a-b; });
			var unique = _.uniq(results, true);
			var report = {
				results: results,
				entropy: []
			};
			_.each(unique, function (val) {
				var lastWithValStr = _.findLastKey(results, function (v) {
						return v < val;
					}) || "-1";

				var lastWithVal = results.length - parseInt(lastWithValStr) -1;

				if (val > 0) {
					var entry = {
						value: val,
						rate: Math.round(lastWithVal / results.length * 100)
					};
					report.entropy.push(entry);
				}
			});

			return report;
		}

		$scope.computeAtkDiceReport = function (d1, d2, d3) {
			var faceCombinations = [];
			var dices = [];
			computeDiceCombinations(d1, d2, d3, dices, faceCombinations);

			var dmgReport = createReport(accum(faceCombinations, 'dmg'));
			var surgeReport = createReport(accum(faceCombinations, 'surge'));
			var accuracyReport = createReport(accum(faceCombinations, 'accuracy'));

			var fullReport = {
				dices: dices,
				faceCombinations: faceCombinations,
				dmg: dmgReport,
				surge: surgeReport,
				accuracy: accuracyReport
			};

			return fullReport;
		};

		$scope.computeDefDiceReport = function (d1, d2, d3) {
			var faceCombinations = [];
			var dices = [];
			computeDiceCombinations(d1, d2, d3, dices, faceCombinations);

			var dmgReport = createReport(accum(faceCombinations, 'def'));
			var surgeReport = createReport(accum(faceCombinations, 'surge'));
			var accuracyReport = createReport(accum(faceCombinations, 'miss'));

			var fullReport = {
				dices: dices,
				faceCombinations: faceCombinations,
				def: dmgReport,
				surge: surgeReport,
				miss: accuracyReport
			};

			return fullReport;
		};

		// $scope.computeAtkDiceReport(blue, blue);

		$scope.printReport = function (report) {
			var msg = "======================\n";
			_.each(report.dices, function (dice, index) {
				msg += dice.name;
				if (index < report.dices.length -1) {
					msg += " + ";
				}
			});
			msg += '\n';

			function formatAttrReport(attrReport, title) {
				msg += title + '\n';
				_.each(attrReport.entropy, function (entry) {
					msg += entry.value + "+ : " + entry.rate + '\n';
				});
				msg += '\n';
			}

			formatAttrReport(report.dmg, "Dmg");
			formatAttrReport(report.surge, "Surge");
			formatAttrReport(report.accuracy, "Acc");

			console.log(msg);
		};

		function prettyfyAttr(reports, attr) {
			var max = _.max(reports, function (report) {
				return report[attr].entropy.length;
			})[attr].entropy.length;

			// Pad values so we always have the same number of entries for each category
			_.each(reports, function (report) {
				var i = report[attr].entropy.length;
				if (i > 0) {
					for (; i < max; ++i) {
						report[attr].entropy.push({rate: 0, value: 'dummy'});
					}
				}
			});
		}

		$scope.prettyfyAtkReport = function (reports) {
			prettyfyAttr(reports, 'dmg');
			prettyfyAttr(reports, 'surge');
			prettyfyAttr(reports, 'accuracy');
		};

		$scope.prettyfyDefReport = function (reports) {
			prettyfyAttr(reports, 'def');
			prettyfyAttr(reports, 'surge');
			prettyfyAttr(reports, 'miss');
		};

		$scope.computeDefDicesReports = function () {
			var reports = [];
			var combinationsDices = [
				[black],
				[white],
				[black, white],
				[black, black],
				[black, black, white]
			];

			_.each(combinationsDices, function (combo) {
				var report = $scope.computeDefDiceReport.apply(this, combo);
				reports.push(report);
			});

			return reports;
		};

		$scope.compute2AtkDicesReports = function () {
			var dices = [red, blue, yellow, green];

			var combinations2Dices = [];
			var reports = [];

			for (var i = 0; i < dices.length; ++i) {
				for (var j = i; j < dices.length; ++j) {
					combinations2Dices.push([dices[i], dices[j]]);
				}
			}

			_.each(combinations2Dices, function (combo) {
				reports.push($scope.computeAtkDiceReport(combo[0], combo[1]));
			});

			return reports;
		};

		$scope.compute3AtkDicesReports = function () {
			var combinations3Dices = [
				[red, red, green],
				[red, red, yellow],
				[red, red, blue],

				[green, green, red],
				[green, green, yellow],
				[green, green, blue],

				[yellow, yellow, red],
				[yellow, yellow, green],
				[yellow, yellow, blue],

				[blue, blue, red],
				[blue, blue, green],
				[blue, blue, yellow],

				[red, green, yellow],
				[red, green, blue],
				[red, blue, yellow],
				[blue, green, yellow]
			];
			var reports = [];

			_.each(combinations3Dices, function (combo) {
				reports.push($scope.computeAtkDiceReport(combo[0], combo[1], combo[2]));
			});

			return reports;
		};

		$scope.printFullReport = function () {
			var reports = $scope.computeFullReport();
			_.each(reports, function (report) {
				$scope.printReport(report);
			});
		};
		// $scope.printFullReport();

		$scope.computeFullReport = function () {
			$scope.atkReports = [];
			$scope.atkReports.push($scope.compute2AtkDicesReports());

			var threeDicesReports = $scope.compute3AtkDicesReports();
			var mid = threeDicesReports.length / 2;
			$scope.atkReports.push(threeDicesReports.slice(0, mid));
			$scope.atkReports.push(threeDicesReports.slice(mid, threeDicesReports.length));

			_.each($scope.atkReports, function (report) {
				$scope.prettyfyAtkReport(report);
			});

			$scope.defReports = $scope.computeDefDicesReports();
			$scope.prettyfyDefReport($scope.defReports);
		};

		$scope.atkReportDesc = [
			{
				name: 'Dmg',
				attr: 'dmg'
			},
			{
				name: 'Surge',
				attr: 'surge'
			},
			{
				name: 'Acc',
				attr: 'accuracy'
			}
		];

		$scope.defReportDesc = [
			{
				name: 'Def',
				attr: 'def'
			},
			{
				name: 'Surge',
				attr: 'surge'
			},
			{
				name: 'Miss',
				attr: 'miss'
			}
		];

		$scope.computeFullReport();

	}]);
});
