
$(document).ready(function(){

		var base64_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		var base64_map = base64_chars.split( '' );
		var reversed_base64_map = { };

		var params;
		var base64;
		var byte_array;
		var jpg_header_length;
		var img;
		var new_image_data;

		var i;
		var len;

		base64_map.forEach( function ( val, key ) { reversed_base64_map[val] = key; } );

		var global_c;
		var global_canvas;
		function glitchImageData ( c, canvas, image_data, parameters, callback )
		{
			if (
				isValidImageData( image_data ) &&
				checkType( parameters, 'parameters', 'object' ) &&
				checkType( callback, 'callback', 'function' )
			)
			{

				global_c = c;
				global_canvas = canvas;

				// normalize parameters
				params = getNormalizedParameters( parameters );
				
				// resize temp canvases to size of imagedata object
				resizeCanvas( c, image_data );

				// convert imageData to byte array and get jpg header size
				base64 = getBase64FromImageData( image_data, params.quality );
				byte_array = base64ToByteArray( base64 );
				jpg_header_length = getJpegHeaderSize( byte_array );

				// change bytes in the bytearray
				for ( i = 0, len = params.iterations; i < len; i++ )
				{
					glitchJpegBytes(
						byte_array,
						jpg_header_length,
						params.seed,
						params.amount,
						i,
						params.iterations
					);
				}

				img = new Image();
				img.onload = function ()
				{
					c.drawImage( img, 0, 0 );
					new_image_data = c.getImageData( 0, 0, image_data.width, image_data.height );
					callback( new_image_data );
				};

				img.src = byteArrayToBase64( byte_array );
			}
		}

		function resizeCanvas( canvas, size )
		{
			if ( canvas.width !== size.width )
			{
				canvas.width = size.width;
			}

			if ( canvas.height !== size.height )
			{
				canvas.height = size.height;
			}
		}

		function glitchJpegBytes( byte_array, jpg_header_length, seed, amount, i, len )
		{
			var max_index = byte_array.length - jpg_header_length - 4;
			var px_min = parseInt( max_index / len * i, 10 );
			var px_max = parseInt( max_index / len * ( i + 1 ), 10 );

			var delta = px_max - px_min;
			var px_i = parseInt( px_min + delta * seed, 10 );

			if ( px_i > max_index )
			{
				px_i = max_index;
			}

			var index = Math.floor( jpg_header_length + px_i );

			byte_array[index] = Math.floor( amount * 256 );
		}

		function getBase64FromImageData( image_data, quality )
		{
			var q = typeof quality === 'number' && quality < 1 && quality > 0 ? quality : 0.1;
			global_c.putImageData( image_data, 0, 0 );
			return global_canvas.toDataURL( 'image/jpeg', q );
		}

		function getJpegHeaderSize( data )
		{
			var result = 417;

			for ( i = 0, len = data.length; i < len; i++ )
			{
				if (
					data[i] === 0xFF &&
					data[i + 1] === 0xDA
				)
				{
					result = i + 2;
					break;
				}
			}

			return result;
		}

		// https://github.com/mutaphysis/smackmyglitchupjs/blob/master/glitch.html
		// base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes
		function base64ToByteArray( str )
		{
			var result = [ ];
			var digit_num;
			var cur;
			var prev;

			for ( i = 23, len = str.length; i < len; i++ )
			{
				cur = reversed_base64_map[ str.charAt( i ) ];
				digit_num = ( i - 23 ) % 4;

				switch ( digit_num )
				{
					// case 0: first digit - do nothing, not enough info to work with
					case 1: // second digit
						result.push( prev << 2 | cur >> 4 );
						break;
					
					case 2: // third digit
						result.push( ( prev & 0x0f ) << 4 | cur >> 2 );
						break;
					
					case 3: // fourth digit
						result.push( ( prev & 3 ) << 6 | cur );
						break;
				}

				prev = cur;
			}

			return result;
		}

		function byteArrayToBase64( arr )
		{
			var result = [ 'data:image/jpeg;base64,' ];
			var byte_num;
			var cur;
			var prev;

			for ( i = 0, len = arr.length; i < len; i++ )
			{
				cur = arr[i];
				byte_num = i % 3;

				switch ( byte_num )
				{
					case 0: // first byte
						result.push( base64_map[ cur >> 2 ] );
						break;
					case 1: // second byte
						result.push( base64_map[( prev & 3 ) << 4 | ( cur >> 4 )] );
						break;
					case 2: // third byte
						result.push( base64_map[( prev & 0x0f ) << 2 | ( cur >> 6 )] );
						result.push( base64_map[cur & 0x3f] );
						break;
				}

				prev = cur;
			}

			if ( byte_num === 0 )
			{
				result.push( base64_map[( prev & 3 ) << 4] );
				result.push( '==' );
			}

			else if ( byte_num === 1 )
			{
				result.push( base64_map[( prev & 0x0f ) << 2] );
				result.push( '=' );
			}

			return result.join( '' );
		}

		function getImageDataCopy( image_data )
		{
			var copy = global_c.createImageData( image_data.width, image_data.height );
			copy.data.set( image_data.data );
			return copy;
		}

		function getNormalizedParameters ( parameters )
		{
			return {
				seed:       ( parameters.seed       || 0 ) / 100,
				quality:    ( parameters.quality    || 0 ) / 100,
				amount:     ( parameters.amount     || 0 ) / 100,
				iterations: ( parameters.iterations || 0 )
			};
		}

		function isValidImageData( image_data )
		{
			if (
				checkType( image_data, 'image_data', 'object' ) &&
				checkType( image_data.width, 'image_data.width', 'number' ) &&
				checkType( image_data.height, 'image_data.height', 'number' ) &&
				checkType( image_data.data, 'image_data.data', 'object' ) &&
				checkType( image_data.data.length, 'image_data.data.length', 'number' ) &&
				checkNumber( image_data.data.length, 'image_data.data.length', isPositive, '> 0' )
			)
			{
				return true;
			}

			else
			{
				return false;
			}
		}

		function checkType( it, name, expected_type )
		{
			if ( typeof it === expected_type )
			{
				return true;
			}

			else
			{
				error( it, 'typeof ' + name, '"' + expected_type + '"', '"' + typeof it + '"' );
				return false;
			}
		}

		function checkNumber( it, name, condition, condition_name )
		{
			if ( condition( it ) === true )
			{
				return true;
			}

			else
			{
				error( it, name, condition_name, 'not' );
			}
		}

		function isPositive( nr )
		{
			return ( nr > 0 );
		}

		function error( it, name, expected, result )
		{
			throw new Error ( 'glitch(): Expected ' + name + ' to be ' + expected + ', but it was ' + result + '.' );
		}

		//get our canvas
		var canvas1 = document.getElementById("canvas-hover-1");
		var canvas2 = document.getElementById("canvas-hover-2");
		var canvas3 = document.getElementById("canvas-hover-3");

		//get our context
		var c1 = document.getElementById("canvas-hover-1").getContext("2d");
		var c2 = document.getElementById("canvas-hover-2").getContext("2d");
		var c3 = document.getElementById("canvas-hover-3").getContext("2d");

		//load initial images, draw them, set canvas width and height
		//img 1
		var imgObj1 = new Image();
		imgObj1.src = 'img/eb.jpg';
		imgObj1.onload = function(){
			$("#canvas-hover-1").attr('width',this.width);
			$("#canvas-hover-1").attr('height',this.height);
			$("#container1").css('width',this.width);
			$("#container1").css('height',this.height);
			c1.drawImage(imgObj1, 0, 0);
		}
		var imgObj2 = new Image();
		imgObj2.src = 'img/pin2.jpg';
		imgObj2.onload = function(){
			$("#canvas-hover-2").attr('width',this.width);
			$("#canvas-hover-2").attr('height',this.height);
			$("#container2").css('width',this.width);
			$("#container2").css('height',this.height);
			c2.drawImage(imgObj2, 0, 0);
		}
		var imgObj3 = new Image();
		imgObj3.src = 'img/bbb.jpg';
		imgObj3.onload = function(){
			$("#canvas-hover-3").attr('width',this.width);
			$("#canvas-hover-3").attr('height',this.height);
			$("#container3").css('width',this.width);
			$("#container3").css('height',this.height);
			c3.drawImage(imgObj3, 0, 0);
		}

		//glitch thresholds - increase maximum if you want things really fukd
		var maximum_of_parameter = 20; //max=100
		var minimum_of_parameter = 5; //min=0

		//glitch it function
		function glitchIt(canvas_to_glitch,imgObj){

			var canvas = document.getElementById(canvas_to_glitch);
			var c = document.getElementById(canvas_to_glitch).getContext("2d");
			var image_data_new = c.getImageData(0, 0, imgObj.width, imgObj.height);

			var amount_random = Math.floor((Math.random() * maximum_of_parameter) + minimum_of_parameter);
			var speed_random = Math.floor((Math.random() * maximum_of_parameter) + minimum_of_parameter);
			var iterations_random = Math.floor((Math.random() * maximum_of_parameter) + minimum_of_parameter);
			var quality_random = Math.floor((Math.random() * 60) + minimum_of_parameter);
			var parameters = { amount: amount_random, seed: speed_random, iterations: iterations_random, quality: quality_random };
			
			glitchImageData(c, canvas, image_data_new, parameters, drawImageData);
			function drawImageData(glitched_image_data){
				c.putImageData(glitched_image_data, 0, 0);
			}	
		}

		//hover effect for images 1,2,3
		$("#canvas-hover-1").hover(function(){
		  glitchIt("canvas-hover-1",imgObj1);
		},function(){
		  c1.drawImage(imgObj1, 0, 0);
		});
		$("#canvas-hover-2").hover(function(){
		  glitchIt("canvas-hover-2",imgObj2);
		},function(){
		  c2.drawImage(imgObj2, 0, 0);
		});
		$("#canvas-hover-3").hover(function(){
		  glitchIt("canvas-hover-3",imgObj3);
		},function(){
		  c3.drawImage(imgObj3, 0, 0);
		});

});




