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
					surge: 0
				},
				{
					def: 2,
					surge: 0
				},
				{
					def: 3,
					surge: 0
				},
				{
					def: 1,
					surge: 0
				},
				{
					def: 1,
					surge: 0
				},
				{
					def: 0,
					surge: 1
				}
			]
		};

		var white = {
			name: "white",
			faces: [
				{
					def: 1,
					surge: 1
				},
				{
					def: 1,
					surge: 0
				},
				{
					def: 0,
					surge: 0,
					miss: 1
				},
				{
					def: 0,
					surge: 1
				},
				{
					def: 1,
					surge: 1
				},
				{
					def: 0,
					surge: 0
				}
			]
		};

		$scope.computeAtkDiceReport = function (d1, d2, d3) {
			var faceCombinations = [];
			var dices = [d1, d2];
			if (d3) {
				_.each(d1.faces, function (face1) {
					_.each(d2.faces, function (face2) {
						_.each(d3.faces, function (face3) {
							faceCombinations.push([face1, face2, face3]);
						});
					});
				});
				dices.push(d3);
			} else{
				_.each(d1.faces, function (face1) {
					_.each(d2.faces, function (face2) {
						faceCombinations.push([face1, face2]);
					});
				});
			}

			function accum(combinations, attr) {
				return _.map(faceCombinations, function (faces) {
					var value = 0;
					_.each(faces, function (face) {
						value += face[attr];
					});
					return value;
				});
			}

			function createReport(results) {
				results.sort(function (a, b) { return a-b; })
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

		$scope.prettyfyReport = function (reports) {
			function prettyfyAttr(reports, attr) {
				var max = _.max(reports, function (report) {
					return report[attr].entropy.length;
				})[attr].entropy.length;

				// Pad values so we always have the same number of entries for each category
				_.each(reports, function (report) {
					var i = report[attr].entropy.length
					if (i > 0) {
						for (; i < max; ++i) {
							report[attr].entropy.push({rate: 0, value: 'dummy'});
						}
					}
				});
			}

			prettyfyAttr(reports, 'dmg');
			prettyfyAttr(reports, 'surge');
			prettyfyAttr(reports, 'accuracy');
		};

		$scope.computeFullReport = function () {
			var dices = [red, blue, yellow, green];

			var combinations2Dices = [];
			var reports = [];
			var combinations3Dices = [];

			for (var i = 0; i < dices.length; ++i) {
				for (var j = i; j < dices.length; ++j) {
					combinations2Dices.push([dices[i], dices[j]]);
				}
			}

			for (var i = 0; i < dices.length; ++i) {
				for (var j = i; j < dices.length; ++j) {
					for (var k = j + 1; k < dices.length; ++k) {
						combinations3Dices.push([dices[i], dices[j], dices[k]]);
					}
				}
			}

			_.each(combinations2Dices, function (combo) {
				reports.push($scope.computeAtkDiceReport(combo[0], combo[1]));
			});

			$scope.prettyfyReport(reports);

			return reports;
		};

		$scope.printFullReport = function () {
			/*
			 _.each(combinations3Dices, function (combo) {
			 reports.push($scope.computeAtkDiceReport(combo[0], combo[1], combo[2]));
			 });
			 */
			var reports = $scope.computeFullReport();
			_.each(reports, function (report) {
				$scope.printReport(report);
			});
		};
		// $scope.printFullReport();

		$scope.reports = $scope.computeFullReport();

	}]);
});
