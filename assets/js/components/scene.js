module.exports = function() {
	
	var renderer, scene, camera, controls;
	var stats = new Stats();
	var wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: new THREE.Color('black'), opacity: .5, transparent: true });
	var shadeMaterial = new THREE.MeshPhongMaterial({
		color: 0xFFFFFF,
		side: THREE.DoubleSide,
		opacity: .25,
		transparent: true
	});
	var distinctColors = [new THREE.Color('#e6194b'), new THREE.Color('#3cb44b'), new THREE.Color('#ffe119'), new THREE.Color('#4363d8'), new THREE.Color('#f58231'), new THREE.Color('#911eb4'), new THREE.Color('#46f0f0'), new THREE.Color('#f032e6'), new THREE.Color('#bcf60c'), new THREE.Color('#fabebe'), new THREE.Color('#008080'), new THREE.Color('#e6beff'), new THREE.Color('#9a6324'), new THREE.Color('#fffac8'), new THREE.Color('#800000'), new THREE.Color('#aaffc3'), new THREE.Color('#808000'), new THREE.Color('#ffd8b1'), new THREE.Color('#000075'), new THREE.Color('#808080'), new THREE.Color('#ffffff'), new THREE.Color('#000000')];
	var black = new THREE.Color('black');
	
	return {
		
		settings: {
			activateLightHelpers: false,
			axesHelper: {
				activateAxesHelper: false,
				axisLength: 10
			},
			activateColorPickers: false,
			activateStatsFPS: false,
			font: {
				enable: true,
				fontStyle: {
					font: null,
					size: 1,
					height: 0,
					curveSegments: 1
				}
			},
			messageDuration: 2000
		},
		
		init: function() {

			let self = this;
			self.loadFont();
			self.setUpButtons();
		},
		
		begin: function() {
			
			let self = this;
			
			self.setUpScene();
			self.addFloor();
			self.enableControls();
			self.resizeRendererOnWindowResize();
			self.setUpLights();
			self.addGeometries();
			self.addColorPickers();
			
			camera.position.x = 0    ;
			camera.position.y = 60;
			camera.position.z = 60;
			
			if (self.settings.activateStatsFPS) {
				self.enableStats();
			}
			
			var animate = function() {

				requestAnimationFrame(animate);
				renderer.render(scene, camera);
				controls.update();
				stats.update();
			};
			
			animate();
		},
		
		setColor1: function(color) {
			
			let color1Element = document.querySelector('#color1');
			color1Element.style.backgroundColor = color;
		},
		
		setColor2: function(color) {
			
			let color2Element = document.querySelector('#color2');
			color2Element.style.backgroundColor = color;
		},
		
		setColor3: function(color) {
			
			let color3Element = document.querySelector('#color3');
			color3Element.style.backgroundColor = color;
		},
		
		setColors: function(color1, color2, color3) {
			
			this.setColor1(color1);
			this.setColor2(color2);
			this.setColor3(color3);
		},
		
		addColorPickers: function() {
			
			let self = this;
			
			if (self.settings.activateColorPickers) {
				
				let params = {
					ColorInput1: '#FFFFFF',
					ColorInput2: '#FFFFFF'
				};
				let gui = new dat.GUI();
				
				gui.domElement.parentElement.classList.add('color-1-picker');
	
				gui.addColor(params, 'ColorInput1').onChange(function(event) {
					
					if (params.ColorInput1) {
						
						let colorObj = new THREE.Color(params.ColorInput1);
						let hex = colorObj.getHexString();
						self.setColor1(params.ColorInput1);
					}
				});
				
				gui.addColor(params, 'ColorInput2').onChange(function(event) {
					
					if (params.ColorInput2) {
						
						let colorObj = new THREE.Color(params.ColorInput2);
						let hex = colorObj.getHexString();
						self.setColor2(params.ColorInput2);
					}
				});
			}
		},
		
		addGeometries: function() {
			
			let self = this;
			
			let circleRadius = 15;
			let majorScaleGeometry = new THREE.CircleGeometry(circleRadius, 12);
			let mesh = new THREE.Mesh(majorScaleGeometry, shadeMaterial);
			majorScaleGeometry.rotateZ(3*Math.PI/6);
			majorScaleGeometry.translate(0, circleRadius, 0);
			scene.add(mesh);
			mesh.position.z -= 1;
			
			majorScaleGeometry = self.reorderCircleVertices(majorScaleGeometry);
			let majorScale = [2, 4, 5, 7, 9, 11, 12];
			let majorChord = [4, 7, 12];
			let minorChord = [4, 9, 12];
			let diminishedChord = [2, 5, 11];
			self.labelInterval(majorScaleGeometry);
			self.labelScaleNotes(majorScaleGeometry, majorScale);
			self.renderScaleTitle(majorScaleGeometry, 'MAJOR SCALE');
			self.drawTriad(majorScaleGeometry, majorChord, 'major chord', new THREE.Color(distinctColors[0]));
			
			majorScaleGeometry = majorScaleGeometry.clone();
			majorScaleGeometry.translate(0, 0, -50);
			mesh = new THREE.Mesh(majorScaleGeometry, shadeMaterial);
			scene.add(mesh);
			mesh.position.z -= 1;
			self.labelInterval(majorScaleGeometry);
			self.labelScaleNotes(majorScaleGeometry, majorScale);
			self.renderScaleTitle(majorScaleGeometry, 'MAJOR SCALE');
			self.drawTriad(majorScaleGeometry, diminishedChord, 'diminished chord', new THREE.Color(distinctColors[1]));
			
			majorScaleGeometry = majorScaleGeometry.clone();
			majorScaleGeometry.translate(0, 0, -50);
			mesh = new THREE.Mesh(majorScaleGeometry, shadeMaterial);
			scene.add(mesh);
			mesh.position.z -= 1;
			self.labelInterval(majorScaleGeometry);
			self.labelScaleNotes(majorScaleGeometry, majorScale);
			self.renderScaleTitle(majorScaleGeometry, 'MAJOR SCALE');
			self.drawTriad(majorScaleGeometry, minorChord, 'minor chord', new THREE.Color(distinctColors[3]));
			
			
			let minorScale = [2, 3, 5, 7, 9, 11, 12];
			let augmentedChord = [3, 7, 11];
			minorChord = [3, 7, 12];
			diminishedChord = [2, 5, 11];
			let minorScaleGeometry = new THREE.CircleGeometry(circleRadius, 12);
			minorScaleGeometry = self.reorderCircleVertices(minorScaleGeometry);
			mesh = new THREE.Mesh(minorScaleGeometry, shadeMaterial);
			minorScaleGeometry.rotateZ(3*Math.PI/6);
			minorScaleGeometry.translate(50, circleRadius, 0);
			scene.add(mesh);
			mesh.position.z -= 1;
			self.labelInterval(minorScaleGeometry);
			self.labelScaleNotes(minorScaleGeometry, minorScale);
			self.renderScaleTitle(minorScaleGeometry, 'MINOR SCALE');
			self.drawTriad(minorScaleGeometry, minorChord, 'minor chord', new THREE.Color(distinctColors[4]));
			
			minorScaleGeometry = minorScaleGeometry.clone();
			minorScaleGeometry.translate(0, 0, -50);
			mesh = new THREE.Mesh(minorScaleGeometry, shadeMaterial);
			scene.add(mesh);
			mesh.position.z -= 1;
			self.labelInterval(minorScaleGeometry);
			self.labelScaleNotes(minorScaleGeometry, minorScale);
			self.renderScaleTitle(minorScaleGeometry, 'MINOR SCALE');
			self.drawTriad(minorScaleGeometry, augmentedChord, 'augmented chord', new THREE.Color(distinctColors[5]));
			
			minorScaleGeometry = minorScaleGeometry.clone();
			minorScaleGeometry.translate(0, 0, -50);
			mesh = new THREE.Mesh(minorScaleGeometry, shadeMaterial);
			scene.add(mesh);
			mesh.position.z -= 1;
			self.labelInterval(minorScaleGeometry);
			self.labelScaleNotes(minorScaleGeometry, minorScale);
			self.renderScaleTitle(minorScaleGeometry, 'MINOR SCALE');
			self.drawTriad(minorScaleGeometry, diminishedChord, 'diminished chord', new THREE.Color(distinctColors[10]));
		},
		
		reorderCircleVertices: function(geometry) { // Re-order vertex counting to match the clock
			
			let result = geometry.clone();
			for (let i = 1; i < geometry.vertices.length; i++) {
				
				result.vertices[i] = geometry.vertices[geometry.vertices.length - i];
			}
			
			return result;
		},
		
		renderScaleTitle: function(geometry, label) {
			let self = this;
			self.labelPoint({x: geometry.vertices[0].x - 5, y: geometry.vertices[0].y + 10, z: geometry.vertices[0].z}, label, black);
		},
		
		labelInterval: function(geometry) {
			
			let self = this;
			for (let i = 1; i < geometry.vertices.length; i++) {
				self.labelPoint(geometry.vertices[i], i.toString(), black);
			}
		},
		
		labelScaleNotes: function(scaleGeometry, notes) {
			
			let self = this;
			
			for (let i = 0; i < notes.length; i++) {
				self.showPoint(scaleGeometry.vertices[notes[i]]);
			}
		},
		
		drawTriad: function(scaleGeometry, notes, label, color) {
			
			let self = this;
			
			for (let i = 0; i < notes.length; i++) {
				
				if (i !== notes.length - 1) {
					self.drawLine(scaleGeometry.vertices[notes[i]], scaleGeometry.vertices[notes[i + 1]], color);
				}
				else {
					self.drawLine(scaleGeometry.vertices[notes[0]], scaleGeometry.vertices[notes[notes.length - 1]], color);
				}
			}
			
			let triangle = new THREE.Geometry();
			for (let i = 0; i < scaleGeometry.vertices.length; i++) {
				
				triangle.vertices.push(new THREE.Vector3(scaleGeometry.vertices[i].x,  scaleGeometry.vertices[i].y, scaleGeometry.vertices[i].z));
			}
			let center = self.getCentroid(triangle);
			self.labelPoint(center, label, color);

		},
		
		getCentroid: function(geometry) { // needs to be fixed
			
			let result = {};
			let x = 0, y = 0, z = 0;
			
			for (let i = 0; i < geometry.vertices.length; i++) {
				
				x += geometry.vertices[i].x;
				y += geometry.vertices[i].y;
				z += geometry.vertices[i].z;
			}
			
			x = x / geometry.vertices.length;
			y = y / geometry.vertices.length;
			z = z / geometry.vertices.length;
			result = { x: x, y: y, z: z};
			return result;
		},

		enableControls: function() {
			controls = new THREE.OrbitControls(camera, renderer.domElement);
			controls.target.set(0, 0, 0);
			controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			controls.dampingFactor = 0.05;
			controls.zoomSpeed = 6;
			controls.enablePan = !utils.mobile();
			controls.minDistance = 0;
			controls.maxDistance = 200;
			controls.maxPolarAngle = Math.PI / 2;
		},

		enableStats: function() {
			document.body.appendChild(stats.dom);
		},

		setUpLights: function() {

			let self = this;
			let lights = [];
			const color = 0xFFFFFF;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(-1, 2, 4);
			scene.add(light);
			lights.push(light);

			const light2 = new THREE.DirectionalLight(color, intensity);
			light2.position.set(0, 2, -8);
			scene.add(light2);
			lights.push(light2)
			
			if (self.settings.activateLightHelpers) {
				self.activateLightHelpers(lights);
			}
		},

		activateLightHelpers: function(lights) {

			for (let i = 0; i < lights.length; i++) {
				let helper = new THREE.DirectionalLightHelper(lights[i], 5, 0x00000);
				scene.add(helper);
			}
		},

		addFloor: function() {
			var planeGeometry = new THREE.PlaneBufferGeometry(100, 100);
			planeGeometry.rotateX(-Math.PI / 2);
			var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

			var plane = new THREE.Mesh(planeGeometry, planeMaterial);
			plane.position.y = -1;
			plane.receiveShadow = true;
			scene.add(plane);

			var helper = new THREE.GridHelper(1000, 100);
			helper.material.opacity = .25;
			helper.material.transparent = true;
			scene.add(helper);
		},

		setUpScene: function() {

			let self = this;
			scene = new THREE.Scene();
			scene.background = new THREE.Color(0xf0f0f0);
			camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			if (self.settings.axesHelper.activateAxesHelper) {

				self.activateAxesHelper();
			}
		},
		
		showPoints: function(geometry, color, opacity) {
			
			let self = this;
			
			for (let i = 0; i < geometry.vertices.length; i++) {
				if (Array.isArray(color)) {
					self.showPoint(geometry.vertices[i], color[i], opacity);
				}
				else {
					self.showPoint(geometry.vertices[i], color, opacity);
				}
			}
		},
		
		showPoint: function(pt, color, opacity) {
			color = color || 0xff0000;
			opacity = opacity || 1;
			let dotGeometry = new THREE.Geometry();
			dotGeometry.vertices.push(new THREE.Vector3(pt.x, pt.y, pt.z));
			let dotMaterial = new THREE.PointsMaterial({ 
				size: 1,
				sizeAttenuation: true,
				color: color,
				opacity: opacity,
				transparent: true
			});
			let dot = new THREE.Points(dotGeometry, dotMaterial);
			scene.add(dot);
		},
		
		showVector: function(vector, origin, color) {
			
			color = color || 0xff0000;
			let arrowHelper = new THREE.ArrowHelper(vector, origin, vector.length(), color);
			scene.add(arrowHelper);
		},
		
		drawLine: function(pt1, pt2, color) {
			
			let material = new THREE.LineBasicMaterial({ color: color });
			let geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(pt1.x, pt1.y, pt1.z));
			geometry.vertices.push(new THREE.Vector3(pt2.x, pt2.y, pt2.z));
			
			let line = new THREE.Line(geometry, material);
			scene.add(line);
		},
		
		getDistance: function(pt1, pt2) { // create point class?
			
			let squirt = Math.pow((pt2.x - pt1.x), 2) + Math.pow((pt2.y - pt1.y), 2) + Math.pow((pt2.z - pt1.z), 2);
			return Math.sqrt(squirt);
		},
		
		createVector: function(pt1, pt2) {
			return new THREE.Vector3(pt2.x - pt1.x, pt2.y - pt2.y, pt2.z - pt1.z);
		},
		
		getMidpoint: function(pt1, pt2) {
			
			let midpoint = {};
			
			midpoint.x = (pt1.x + pt2.x) / 2;
			midpoint.y = (pt1.y + pt2.y) / 2;
			midpoint.z = (pt1.z + pt2.z) / 2;
			
			return midpoint;
		},
		
		createTriangle: function(pt1, pt2, pt3) { // return geometry
			let triangleGeometry = new THREE.Geometry();
			triangleGeometry.vertices.push(new THREE.Vector3(pt1.x, pt1.y, pt1.z));
			triangleGeometry.vertices.push(new THREE.Vector3(pt2.x, pt2.y, pt2.z));
			triangleGeometry.vertices.push(new THREE.Vector3(pt3.x, pt3.y, pt3.z));
			triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
			triangleGeometry.computeFaceNormals();
			return triangleGeometry;
		},
		
		activateAxesHelper: function() {
			
			let self = this;
			let axesHelper = new THREE.AxesHelper(self.settings.axesHelper.axisLength);
			scene.add(axesHelper);
		},
		
		labelAxes: function() {
			
			let self = this;
			if (self.settings.font.enable) {
				let textGeometry = new THREE.TextGeometry('Y', self.settings.font.fontStyle);
				let textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
				let mesh = new THREE.Mesh(textGeometry, textMaterial);
				textGeometry.translate(0, self.settings.axesHelper.axisLength, 0);
				scene.add(mesh);
				
				textGeometry = new THREE.TextGeometry('X', self.settings.font.fontStyle);
				textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
				mesh = new THREE.Mesh(textGeometry, textMaterial);
				textGeometry.translate(self.settings.axesHelper.axisLength, 0, 0);
				scene.add(mesh);
				
				textGeometry = new THREE.TextGeometry('Z', self.settings.font.fontStyle);
				textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
				mesh = new THREE.Mesh(textGeometry, textMaterial);
				textGeometry.translate(0, 0, self.settings.axesHelper.axisLength);
				scene.add(mesh);
			}
		},
		
		loadFont: function() {
			
			let self = this;
			let loader = new THREE.FontLoader();
			let fontPath = '';
			fontPath = 'assets/vendors/js/three.js/examples/fonts/helvetiker_regular.typeface.json';

			loader.load(fontPath, function(font) { // success event
				
				console.log('Fonts loaded successfully.');
				self.settings.font.fontStyle.font = font;
				
				self.begin();
				if (self.settings.axesHelper.activateAxesHelper) self.labelAxes();
			}, function(event) { // in progress event.
				console.log('Attempting to load fonts.')
			}, function(event) { // error event
				
				console.log('Error loading fonts. Webserver required due to CORS policy.');
				self.settings.font.enable = false;
				self.begin();
			});
		},
		
		/* 	Inputs: pt - point in space to label, in the form of object with x, y, and z properties; label - text content for label; color - optional */
		labelPoint: function(pt, label, color) {
			
			let self = this;
			
			if (self.settings.font.enable) {
				color = color || 0xff0000;
				let textGeometry = new THREE.TextGeometry(label, self.settings.font.fontStyle);
				let textMaterial = new THREE.MeshBasicMaterial({ color: color });
				let mesh = new THREE.Mesh(textGeometry, textMaterial);
				textGeometry.translate(pt.x, pt.y, pt.z);
				scene.add(mesh);
			}
		},
		
		setUpButtons: function() {
			
			let self = this;
			let message = document.getElementById('message');
			
			document.addEventListener('keyup', function(event) {
				
				let L = 76;
				
				if (event.keyCode === L) {
					
					// do stuff when pressing key
				}
			});
		},
		
		resizeRendererOnWindowResize: function() {

			window.addEventListener('resize', utils.debounce(function() {
				
				if (renderer) {
	
					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();
					renderer.setSize(window.innerWidth, window.innerHeight);
				}
			}, 250));
		}
	}
}