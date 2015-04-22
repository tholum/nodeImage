QrCode=require('qrcode-reader');
fs = require('fs');
PNG = require( 'png-js' ) ;

    c=fs.readFileSync('/var/www/test.png');
    p=new PNG(c);
    p.decode(function(data){
      qr=new QrCode();
      qr.callback= function(result){
         expect(result).to.equal('Test');
         done();
      }
      qr.decode(p,data)
    });


