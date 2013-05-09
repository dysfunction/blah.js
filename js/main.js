require(['disjoint'], function (DisjointSet) {
	function createCanvas(w, h) {
		var canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		return ctx = canvas.getContext('2d');
	}

	function getBitmap(image) {
		var result = [], data, j, n, ctx;
		ctx = createCanvas(image.width, image.height);
		ctx.drawImage(image, 0, 0);
		data = ctx.getImageData(0, 0, image.width, image.height);
		n = image.width * image.height;

		for (j = 0; j < n; j += 1) {
			result[j] = 0;
			if (data.data[j * 4 + 3] !== 0) {
				result[j] = 1;
			}
		}

		return result;
	}

	function createArray(len, val) {
		var j, result = [];
		for (j = 0; j < len; j += 1) {
			result[j] = val;
		}

		return result;
	}

	function twopass(data) {
		var regions = createArray(data.length, 0);
		var region = 1;
		var regionMap = {};
		var j, pass, row, col, value, neighbors, r1, r2, num;

		for (row = 1; row < image.height; row += 1) {
			for (col = 1; col < image.width - 1; col += 1) {
				j = row * image.width + col;
				value = data[j];
				if (value === 0) {
					// this is the background.. ignore
					continue;
				}

				neighbors = [
					(row - 1) * image.width + col - 1, // northwest
					(row - 1) * image.width + col, // north
					(row - 1) * image.width + col + 1, // northeast
					row * image.width + col - 1 // west
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

	function countRegions(regions) {
		var count = 0, uniq = {}, j, n = regions.length;
		for (j = 0; j < n; j += 1) {
			if (regions[j] !== 0) {
				uniq[regions[j]] = 1;
			}
		}

		console.log(uniq);
		return Object.keys(uniq).length;
	}

	function init() {
		var cells = getBitmap(image);
		var ctx = createCanvas(400, 400);
		var x, y;
		var cellSize = 20;
		var regions = twopass(cells);

		console.log('Number of blobs: ' + countRegions(regions));

		ctx.fillStyle = '#000';

		for (y = 0; y < image.height; y += 1) {
			for (x = 0; x < image.width; x += 1) {
				if (cells[y * image.width + x] === 1) {
					ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
		}

		ctx.fillStyle = '#f00';
		for (y = 0; y < image.height; y += 1) {
			for (x = 0; x < image.width; x += 1) {
				if (cells[y * image.width + x] === 1) {
					ctx.fillText(regions[y * image.width + x], x * cellSize, y * cellSize);
				}
			}
		}

		document.body.appendChild(ctx.canvas);
	}

	var image = new Image();
	image.onload = init;
	image.src = 'sample2.png';
});
