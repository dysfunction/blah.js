require(['blobdetect'], function (blobdetect) {
	function createCanvas(w, h) {
		var canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		return ctx = canvas.getContext('2d');
	}

	function getAlphaBitmap(image) {
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

	function init() {
		var time = Date.now();
		var cells = getAlphaBitmap(image);
		var ctx = createCanvas(400, 400);
		var x, y;
		var cellSize = 20;
		var regions = blobdetect.detect(cells, image.width, image.height);

		console.log('Number of blobs: ' + blobdetect.countRegions(regions));

		for (y = 0; y < image.height; y += 1) {
			for (x = 0; x < image.width; x += 1) {
				if (cells[y * image.width + x] === 1) {
					ctx.fillStyle = '#000';
					ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
					ctx.fillStyle = '#f00';
					ctx.fillText(regions[y * image.width + x], x * cellSize + cellSize * 0.25, y * cellSize + cellSize * 0.5);
				}
			}
		}

		var rects = blobdetect.getRegionRects(regions);
		ctx.strokeStyle = '#00f';
		for (x = 0; x < rects.length; x += 1) {
			ctx.strokeRect(rects[x].x * cellSize, rects[x].y * cellSize, rects[x].width * cellSize, rects[x].height * cellSize);
		}

		console.log('Time: ' + (Date.now() - time) + 'ms');

		document.body.appendChild(ctx.canvas);
	}

	var image = new Image();
	image.onload = init;
	image.src = 'sample2.png';
});
