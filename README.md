blah.js
=======

Minimal, naive, amateur blob detection. Mostly based on http://en.wikipedia.org/wiki/Connected-component_labeling

See main.js for an example on how to use. The blob detector operates on an array of 0's and 1's. If you are processing an image, you need to convert the pixels to this format.
The `main.js` file has an example, the `getAlphaBitmap()` function converts bitmask transparency into an array for the blob detector.

Extracting blob regions
----------
The `blobdetect.detect(data, width, height)` function will return an array of regions. You must pass in the binary array and the width/height of the source iamge.

By itself, the resulting data isn't very helpful, but you can pass this to other functions for more useful data.

Region functions
----------
These functions accept a regions result from `detect()` as a parameter

`blobdetect.countRegions(regions)` will return the number of different regions/blobs detected.

`blobdetect.getRegionRects(regions)` will return an array of rectangular bounds for each region/blob


Example
-----
Open `index.html` in your browser to see a graphical example. Some browsers are not cross-origin friendly to local files, but you can view the example here in that case: https://github.com/dysfunction/blah.js/
