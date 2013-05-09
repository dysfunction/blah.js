define(function () {
	function createArray(len, val) {
		var j, result = [];
		for (j = 0; j < len; j += 1) {
			result[j] = val;
		}

		return result;
	}

	function countRegions(regions) {
		var count = 0, uniq = {}, j, n = regions.length;
		for (j = 0; j < n; j += 1) {
			if (regions[j] !== 0) {
				uniq[regions[j]] = 1;
			}
		}

		return Object.keys(uniq).length;
	}

	function detect(data, width, height) {
		var regions = createArray(data.length, 0);
		var region = 1;
		var regionMap = {};
		var j, pass, row, col, value, neighbors, r1, r2, num;

		for (row = 1; row < height; row += 1) {
			for (col = 1; col < width - 1; col += 1) {
				j = row * width + col;
				value = data[j];
				if (value === 0) {
					// this is the background.. ignore
					continue;
				}

				neighbors = [
					(row - 1) * width + col - 1, // northwest
					(row - 1) * width + col, // north
					(row - 1) * width + col + 1, // northeast
					row * width + col - 1 // west
				];

				num = 0;
				neighbors.forEach(function (neighbor) {
					num += regions[neighbor];
				});

				if (num === 0) {
					regions[j] = region;
					region += 1;
				} else {
					num = Math.min.apply(window, neighbors.filter(function (neighbor) {
						return regions[neighbor] !== 0;
					}).map(function (neighbor) {
						return regions[neighbor];
					}));

					regions[j] = num;
					neighbors.forEach(function (neighbor) {
						if (data[neighbor] === value) {
							if (regions[neighbor] !== num) {
								regionMap[regions[neighbor]] = num;
							}
							regions[neighbor] = num;
						}
					});
				}
			}
		}

		Object.keys(regionMap).sort(function (a, b) {
			return b > a;
		}).forEach(function (key) {
			regions = regions.map(function (region) {
				if (region === +key) {
					return regionMap[key];
				}

				return region;
			});
		});

		return regions;
	}

	return {
		countRegions: countRegions,
		detect: detect
	}
});
