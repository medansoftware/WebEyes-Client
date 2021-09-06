var App_ = require('./App');
var Array_ = require('./Array');
var CryptoJS = require('crypto-js');

exports.is_canvas_supported = () => {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

exports.get_device_id = callback => {
	let identify = {
		platform : navigator.platform,
		canvas : CryptoJS.SHA1(get_canvas_fingerprint({dontUseFakeFontInCanvas:true}).toString()).toString(),
		webgl : CryptoJS.SHA1(get_webgl_fingerprint().toString()).toString()
	};

	App_.callback(callback, CryptoJS.SHA1(JSON.stringify(identify)).toString());
}

function get_webgl_canvas() {
	var canvas = document.createElement('canvas');
	var gl = null;

	try {
		gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	} catch (e) {

	}

	if (!gl) {
		gl = null;
	}

	return gl;
}

function get_canvas_fingerprint(options) {
	if (exports.is_canvas_supported()) {
		var result = [];
		var canvas = document.createElement('canvas');
		
		canvas.width = 2000;
		canvas.height = 200;
		canvas.style.display = 'inline';
		
		var ctx = canvas.getContext('2d');
		ctx.rect(0, 0, 10, 10);
		ctx.rect(2, 2, 6, 6);

		result.push('canvas_winding:'+((ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no'));

		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = '#f60';
		ctx.fillRect(125, 1, 62, 20);
		ctx.fillStyle = '#069';
		if (options.dontUseFakeFontInCanvas) {
			ctx.font = '11pt Arial';
		} else {
			ctx.font = '11pt no-real-font-123';
		}

		ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15);
		ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
		ctx.font = '18pt Arial';
		ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45);
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = 'rgb(255,0,255)';
		ctx.beginPath();
		ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'rgb(0,255,255)';
		ctx.beginPath();
		ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'rgb(255,255,0)';
		ctx.beginPath();
		ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'rgb(255,0,255)';
		ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
		ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
		ctx.fill('evenodd');

		if (canvas.toDataURL) {
			result.push('canvas_fp:'+canvas.toDataURL());
		}

		return result;
	}
}

function get_webgl_fingerprint() {
	var gl;
	var fa2s = function (fa) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		return '[' + fa[0] + ', ' + fa[1] + ']';
	}

	var maxAnisotropy = function (gl) {
		var ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
		if (ext) {
			var anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
			
			if (anisotropy === 0) {
				anisotropy = 2
			}

			return anisotropy;
		} else {
			return null;
		}
	}

	gl = get_webgl_canvas();

	if (!gl) {
		return null;
	}

	var result = [];
	var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
	var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
	var vertexPosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);

	var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);

	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	vertexPosBuffer.itemSize = 3;
	vertexPosBuffer.numItems = 3;

	var program = gl.createProgram();
	var vshader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(vshader, vShaderTemplate)
	gl.compileShader(vshader)

	var fshader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(fshader, fShaderTemplate);
	gl.compileShader(fshader);
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);
	gl.useProgram(program);
	program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
	program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
	gl.enableVertexAttribArray(program.vertexPosArray);
	gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
	gl.uniform2f(program.offsetUniform, 1, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);

	try {
		result.push(gl.canvas.toDataURL());
	} catch (e) {
		/* .toDataURL may be absent or broken (blocked by extension) */
	}

	result.push('extensions:' + (gl.getSupportedExtensions() || []).join(';'));
	result.push('webgl aliased line width range:' + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
	result.push('webgl aliased point size range:' + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
	result.push('webgl alpha bits:' + gl.getParameter(gl.ALPHA_BITS));
	result.push('webgl antialiasing:' + (gl.getContextAttributes().antialias ? 'yes' : 'no'));
	result.push('webgl blue bits:' + gl.getParameter(gl.BLUE_BITS));
	result.push('webgl depth bits:' + gl.getParameter(gl.DEPTH_BITS));
	result.push('webgl green bits:' + gl.getParameter(gl.GREEN_BITS));
	result.push('webgl max anisotropy:' + maxAnisotropy(gl));
	result.push('webgl max combined texture image units:' + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
	result.push('webgl max cube map texture size:' + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
	result.push('webgl max fragment uniform vectors:' + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
	result.push('webgl max render buffer size:' + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
	result.push('webgl max texture image units:' + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
	result.push('webgl max texture size:' + gl.getParameter(gl.MAX_TEXTURE_SIZE));
	result.push('webgl max varying vectors:' + gl.getParameter(gl.MAX_VARYING_VECTORS));
	result.push('webgl max vertex attribs:' + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
	result.push('webgl max vertex texture image units:' + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
	result.push('webgl max vertex uniform vectors:' + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
	result.push('webgl max viewport dims:' + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
	result.push('webgl red bits:' + gl.getParameter(gl.RED_BITS));
	result.push('webgl renderer:' + gl.getParameter(gl.RENDERER));
	result.push('webgl shading language version:' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	result.push('webgl stencil bits:' + gl.getParameter(gl.STENCIL_BITS));
	result.push('webgl vendor:' + gl.getParameter(gl.VENDOR));
	result.push('webgl version:' + gl.getParameter(gl.VERSION));

	try {
		var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
		if (extensionDebugRendererInfo) {
			result.push('webgl unmasked vendor:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL));
			result.push('webgl unmasked renderer:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL));
		}
	} catch (e) {

	}

	if (!gl.getShaderPrecisionFormat) {
		return result;
	}

	Array_.foreach(['FLOAT', 'INT'], function (numType) {
		Array_.foreach(['VERTEX', 'FRAGMENT'], function (shader) {
			Array_.foreach(['HIGH', 'MEDIUM', 'LOW'], function (numSize) {
				Array_.foreach(['precision', 'rangeMin', 'rangeMax'], function (key) {
					var format = gl.getShaderPrecisionFormat(gl[shader + '_SHADER'], gl[numSize + '_' + numType])[key];
					
					if (key !== 'precision') {
						key = 'precision ' + key;
					}

					var line = ['webgl ', shader.toLowerCase(), ' shader ', numSize.toLowerCase(), ' ', numType.toLowerCase(), ' ', key, ':', format].join('');
					result.push(line);
				});
			});
		});
	});

	return result;
}