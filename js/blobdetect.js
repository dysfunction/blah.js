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

	function getRegionRects(regions) {
		var rects = {}, x, y, region, rect, w = regions.width, h = regions.height;
		for (y = 0; y < h; y += 1) {
			for (x = 0; x < w; x += 1) {
				region = regions[y * h + x];
				if (region === 0) {
					continue;
				}
				rect = rects[region] || {};
				rect.id = region;
				if (isNaN(rect.x) || x < rect.x) {
					rect.x = x;
				}

				if (isNaN(rect.right) || x > rect.right) {
					rect.right = x;
				}

				if (isNaN(rect.y) || y < rect.y) {
					rect.y = y;
				}

				if (isNaN(rect.bottom) || y > rect.bottom) {
					rect.bottom = y;
				}

				rect.width = rect.right - rect.x + 1;
				rect.height = rect.bottom - rect.y + 1;
				rects[region] = rect;
			}
		}

		return Object.keys(rects).map(function (key) {
			return rects[key];
		});
	}

	function detect(data, width, height) {
		var regions = createArray(data.length, 0);
		var region = 1;
		var regionMap = {};
		var j, pass, row, col, value, neighbors, r1, r2, num;

		for (row = 0; row < height; row += 1) {
			for (col = 0; col < width; col += 1) {
				j = row * width + col;
				value = data[j];
				if (value === 0) {
					// this is the background.. ignore
					continue;
				}

				neighbors = [
					{ x: col - 1, y: row - 1, index: (row - 1) * width + col - 1 }, // northwest
					{ x: col, y: row - 1, index: (row - 1) * width + col }, // north
					{ x: col + 1, y: row - 1, index: (row - 1) * width + col + 1 }, // northeast
					{ x: col - 1, y: row, index: row * width + col - 1 } // west
				];

				num = 0;
				neighbors.forEach(function (neighbor) {
					num += regions[neighbor.index];
				});

				if (num === 0) {
					regions[j] = region;
					region += 1;
				} else {
					num = Math.min.apply(window, neighbors.filter(function (neighbor) {
						return (
							neighbor.x >= 0 &&
							neighbor.x < width &&
							neighbor.y >= 0 &&
							neighbor.y < height &&
							regions[neighbor.index] !== 0
						);
					}).map(function (neighbor) {
						return regions[neighbor.index];
					}));

					regions[j] = num;
					neighbors.forEach(function (neighbor) {
						if (data[neighbor.index] === value) {
							if (regions[neighbor.index] !== num) {
								regionMap[regions[neighbor.index]] = num;
							}
							regions[neighbor.index] = num;
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

		regions.width = width;
		regions.height = height;
		return regions;
	}

	return {
		countRegions: countRegions,
		detect: detect,
		getRegionRects: getRegionRects
	}
});
