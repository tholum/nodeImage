cv = require('opencv');
var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var minArea = 2000;

var BLUE  = [0, 255, 0]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R
var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R

var MomentPoint = function( moments ){
   var self = this;
   self.x = Math.round(moments.m10 / moments.m00);
   self.y = Math.round(moments.m01 / moments.m00);
   self.distanceTo = function( point ){
	console.log( point.x + ' : ' + point.y );
	console.log( self.x + ' : ' + self.y );

      return Math.abs( Math.sqrt( Math.pow( point.x - self.x , 2 ) + Math.pow( point.y - self.y , 2 )  ) );	
   }
}

cv.readImage('image.jpg', function(err, im) {
  if (err) throw err;

  width = im.width()
  height = im.height()
  if (width < 1 || height < 1) throw new Error('Image has no size');

  var out = new cv.Matrix(height, width);
  im.convertGrayscale();
  im_canny = im.copy();
  im_canny.canny(lowThresh, highThresh);
  im_canny.dilate(nIters);

  contours = im_canny.findContours();
  var pts = []; 
  for (i = 0; i < contours.size(); i++) {

    if (contours.area(i) < minArea) continue;

    var arcLength = contours.arcLength(i, true);
    contours.approxPolyDP(i, 0.01 * arcLength, true);

    switch(contours.cornerCount(i)) {
      case 3:
        out.drawContour(contours, i, GREEN);
        break;
      case 4:
        out.drawContour(contours, i, RED);
	var moments = contours.moments(i);
	 Math.round(moments.m10 / moments.m00)
	 Math.round(moments.m01 / moments.m00) 
	pts.push( new MomentPoint( moments ) );
        break;
      default:
        out.drawContour(contours, i, WHITE);
    }
  }
  if( pts.length >= 2 ){
	console.log( 'distance' );
	console.log( pts[0].distanceTo(pts[1]) );
   }

 console.log( pts );
  out.save('conture.png');
});
