(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  var renderer, scene, camera, controls;
  var stats = new Stats();
  var wireframeMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: new THREE.Color('black'),
    opacity: .5,
    transparent: true
  });
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
    init: function init() {
      var self = this;
      self.loadFont();
      self.setUpButtons();
    },
    begin: function begin() {
      var self = this;
      self.setUpScene();
      self.addFloor();
      self.enableControls();
      self.resizeRendererOnWindowResize();
      self.setUpLights();
      self.addGeometries();
      self.addColorPickers();
      camera.position.x = 0;
      camera.position.y = 60;
      camera.position.z = 60;

      if (self.settings.activateStatsFPS) {
        self.enableStats();
      }

      var animate = function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
        stats.update();
      };

      animate();
    },
    setColor1: function setColor1(color) {
      var color1Element = document.querySelector('#color1');
      color1Element.style.backgroundColor = color;
    },
    setColor2: function setColor2(color) {
      var color2Element = document.querySelector('#color2');
      color2Element.style.backgroundColor = color;
    },
    setColor3: function setColor3(color) {
      var color3Element = document.querySelector('#color3');
      color3Element.style.backgroundColor = color;
    },
    setColors: function setColors(color1, color2, color3) {
      this.setColor1(color1);
      this.setColor2(color2);
      this.setColor3(color3);
    },
    addColorPickers: function addColorPickers() {
      var self = this;

      if (self.settings.activateColorPickers) {
        var params = {
          ColorInput1: '#FFFFFF',
          ColorInput2: '#FFFFFF'
        };
        var gui = new dat.GUI();
        gui.domElement.parentElement.classList.add('color-1-picker');
        gui.addColor(params, 'ColorInput1').onChange(function (event) {
          if (params.ColorInput1) {
            var colorObj = new THREE.Color(params.ColorInput1);
            var hex = colorObj.getHexString();
            self.setColor1(params.ColorInput1);
          }
        });
        gui.addColor(params, 'ColorInput2').onChange(function (event) {
          if (params.ColorInput2) {
            var colorObj = new THREE.Color(params.ColorInput2);
            var hex = colorObj.getHexString();
            self.setColor2(params.ColorInput2);
          }
        });
      }
    },
    addGeometries: function addGeometries() {
      var self = this;
      var circleRadius = 15;
      var majorScaleGeometry = new THREE.CircleGeometry(circleRadius, 12);
      var mesh = new THREE.Mesh(majorScaleGeometry, shadeMaterial);
      majorScaleGeometry.rotateZ(3 * Math.PI / 6);
      majorScaleGeometry.translate(0, circleRadius, 0);
      scene.add(mesh);
      mesh.position.z -= 1;
      majorScaleGeometry = self.reorderCircleVertices(majorScaleGeometry);
      var majorScale = [2, 4, 5, 7, 9, 11, 12];
      var majorChord = [4, 7, 12];
      var minorChord = [4, 9, 12];
      var diminishedChord = [2, 5, 11];
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
      var minorScale = [2, 3, 5, 7, 9, 11, 12];
      var augmentedChord = [3, 7, 11];
      minorChord = [3, 7, 12];
      diminishedChord = [2, 5, 11];
      var minorScaleGeometry = new THREE.CircleGeometry(circleRadius, 12);
      minorScaleGeometry = self.reorderCircleVertices(minorScaleGeometry);
      mesh = new THREE.Mesh(minorScaleGeometry, shadeMaterial);
      minorScaleGeometry.rotateZ(3 * Math.PI / 6);
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
    reorderCircleVertices: function reorderCircleVertices(geometry) {
      // Re-order vertex counting to match the clock
      var result = geometry.clone();

      for (var i = 1; i < geometry.vertices.length; i++) {
        result.vertices[i] = geometry.vertices[geometry.vertices.length - i];
      }

      return result;
    },
    renderScaleTitle: function renderScaleTitle(geometry, label) {
      var self = this;
      self.labelPoint({
        x: geometry.vertices[0].x - 5,
        y: geometry.vertices[0].y + 10,
        z: geometry.vertices[0].z
      }, label, black);
    },
    labelInterval: function labelInterval(geometry) {
      var self = this;

      for (var i = 1; i < geometry.vertices.length; i++) {
        self.labelPoint(geometry.vertices[i], i.toString(), black);
      }
    },
    labelScaleNotes: function labelScaleNotes(scaleGeometry, notes) {
      var self = this;

      for (var i = 0; i < notes.length; i++) {
        self.showPoint(scaleGeometry.vertices[notes[i]]);
      }
    },
    drawTriad: function drawTriad(scaleGeometry, notes, label, color) {
      var self = this;

      for (var i = 0; i < notes.length; i++) {
        if (i !== notes.length - 1) {
          self.drawLine(scaleGeometry.vertices[notes[i]], scaleGeometry.vertices[notes[i + 1]], color);
        } else {
          self.drawLine(scaleGeometry.vertices[notes[0]], scaleGeometry.vertices[notes[notes.length - 1]], color);
        }
      }

      var triangle = new THREE.Geometry();

      for (var _i = 0; _i < scaleGeometry.vertices.length; _i++) {
        triangle.vertices.push(new THREE.Vector3(scaleGeometry.vertices[_i].x, scaleGeometry.vertices[_i].y, scaleGeometry.vertices[_i].z));
      }

      var center = self.getCentroid(triangle);
      self.labelPoint(center, label, color);
    },
    getCentroid: function getCentroid(geometry) {
      // needs to be fixed
      var result = {};
      var x = 0,
          y = 0,
          z = 0;

      for (var i = 0; i < geometry.vertices.length; i++) {
        x += geometry.vertices[i].x;
        y += geometry.vertices[i].y;
        z += geometry.vertices[i].z;
      }

      x = x / geometry.vertices.length;
      y = y / geometry.vertices.length;
      z = z / geometry.vertices.length;
      result = {
        x: x,
        y: y,
        z: z
      };
      return result;
    },
    enableControls: function enableControls() {
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
    enableStats: function enableStats() {
      document.body.appendChild(stats.dom);
    },
    setUpLights: function setUpLights() {
      var self = this;
      var lights = [];
      var color = 0xFFFFFF;
      var intensity = 1;
      var light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
      lights.push(light);
      var light2 = new THREE.DirectionalLight(color, intensity);
      light2.position.set(0, 2, -8);
      scene.add(light2);
      lights.push(light2);

      if (self.settings.activateLightHelpers) {
        self.activateLightHelpers(lights);
      }
    },
    activateLightHelpers: function activateLightHelpers(lights) {
      for (var i = 0; i < lights.length; i++) {
        var helper = new THREE.DirectionalLightHelper(lights[i], 5, 0x00000);
        scene.add(helper);
      }
    },
    addFloor: function addFloor() {
      var planeGeometry = new THREE.PlaneBufferGeometry(100, 100);
      planeGeometry.rotateX(-Math.PI / 2);
      var planeMaterial = new THREE.ShadowMaterial({
        opacity: 0.2
      });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.y = -1;
      plane.receiveShadow = true;
      scene.add(plane);
      var helper = new THREE.GridHelper(1000, 100);
      helper.material.opacity = .25;
      helper.material.transparent = true;
      scene.add(helper);
    },
    setUpScene: function setUpScene() {
      var self = this;
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
    showPoints: function showPoints(geometry, color, opacity) {
      var self = this;

      for (var i = 0; i < geometry.vertices.length; i++) {
        if (Array.isArray(color)) {
          self.showPoint(geometry.vertices[i], color[i], opacity);
        } else {
          self.showPoint(geometry.vertices[i], color, opacity);
        }
      }
    },
    showPoint: function showPoint(pt, color, opacity) {
      color = color || 0xff0000;
      opacity = opacity || 1;
      var dotGeometry = new THREE.Geometry();
      dotGeometry.vertices.push(new THREE.Vector3(pt.x, pt.y, pt.z));
      var dotMaterial = new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: true,
        color: color,
        opacity: opacity,
        transparent: true
      });
      var dot = new THREE.Points(dotGeometry, dotMaterial);
      scene.add(dot);
    },
    showVector: function showVector(vector, origin, color) {
      color = color || 0xff0000;
      var arrowHelper = new THREE.ArrowHelper(vector, origin, vector.length(), color);
      scene.add(arrowHelper);
    },
    drawLine: function drawLine(pt1, pt2, color) {
      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(pt1.x, pt1.y, pt1.z));
      geometry.vertices.push(new THREE.Vector3(pt2.x, pt2.y, pt2.z));
      var line = new THREE.Line(geometry, material);
      scene.add(line);
    },
    getDistance: function getDistance(pt1, pt2) {
      // create point class?
      var squirt = Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2) + Math.pow(pt2.z - pt1.z, 2);
      return Math.sqrt(squirt);
    },
    createVector: function createVector(pt1, pt2) {
      return new THREE.Vector3(pt2.x - pt1.x, pt2.y - pt2.y, pt2.z - pt1.z);
    },
    getMidpoint: function getMidpoint(pt1, pt2) {
      var midpoint = {};
      midpoint.x = (pt1.x + pt2.x) / 2;
      midpoint.y = (pt1.y + pt2.y) / 2;
      midpoint.z = (pt1.z + pt2.z) / 2;
      return midpoint;
    },
    createTriangle: function createTriangle(pt1, pt2, pt3) {
      // return geometry
      var triangleGeometry = new THREE.Geometry();
      triangleGeometry.vertices.push(new THREE.Vector3(pt1.x, pt1.y, pt1.z));
      triangleGeometry.vertices.push(new THREE.Vector3(pt2.x, pt2.y, pt2.z));
      triangleGeometry.vertices.push(new THREE.Vector3(pt3.x, pt3.y, pt3.z));
      triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
      triangleGeometry.computeFaceNormals();
      return triangleGeometry;
    },
    activateAxesHelper: function activateAxesHelper() {
      var self = this;
      var axesHelper = new THREE.AxesHelper(self.settings.axesHelper.axisLength);
      scene.add(axesHelper);
    },
    labelAxes: function labelAxes() {
      var self = this;

      if (self.settings.font.enable) {
        var textGeometry = new THREE.TextGeometry('Y', self.settings.font.fontStyle);
        var textMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00
        });
        var mesh = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.translate(0, self.settings.axesHelper.axisLength, 0);
        scene.add(mesh);
        textGeometry = new THREE.TextGeometry('X', self.settings.font.fontStyle);
        textMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000
        });
        mesh = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.translate(self.settings.axesHelper.axisLength, 0, 0);
        scene.add(mesh);
        textGeometry = new THREE.TextGeometry('Z', self.settings.font.fontStyle);
        textMaterial = new THREE.MeshBasicMaterial({
          color: 0x0000ff
        });
        mesh = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.translate(0, 0, self.settings.axesHelper.axisLength);
        scene.add(mesh);
      }
    },
    loadFont: function loadFont() {
      var self = this;
      var loader = new THREE.FontLoader();
      var fontPath = '';
      fontPath = 'assets/vendors/js/three.js/examples/fonts/helvetiker_regular.typeface.json';
      loader.load(fontPath, function (font) {
        // success event
        console.log('Fonts loaded successfully.');
        self.settings.font.fontStyle.font = font;
        self.begin();
        if (self.settings.axesHelper.activateAxesHelper) self.labelAxes();
      }, function (event) {
        // in progress event.
        console.log('Attempting to load fonts.');
      }, function (event) {
        // error event
        console.log('Error loading fonts. Webserver required due to CORS policy.');
        self.settings.font.enable = false;
        self.begin();
      });
    },

    /* 	Inputs: pt - point in space to label, in the form of object with x, y, and z properties; label - text content for label; color - optional */
    labelPoint: function labelPoint(pt, label, color) {
      var self = this;

      if (self.settings.font.enable) {
        color = color || 0xff0000;
        var textGeometry = new THREE.TextGeometry(label, self.settings.font.fontStyle);
        var textMaterial = new THREE.MeshBasicMaterial({
          color: color
        });
        var mesh = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.translate(pt.x, pt.y, pt.z);
        scene.add(mesh);
      }
    },
    setUpButtons: function setUpButtons() {
      var self = this;
      var message = document.getElementById('message');
      document.addEventListener('keyup', function (event) {
        var L = 76;

        if (event.keyCode === L) {// do stuff when pressing key
        }
      });
    },
    resizeRendererOnWindowResize: function resizeRendererOnWindowResize() {
      window.addEventListener('resize', utils.debounce(function () {
        if (renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      }, 250));
    }
  };
};

},{}],2:[function(require,module,exports){
"use strict";

var Scene = require('./components/scene.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    Scene().init();
  });
})();

},{"./components/scene.js":1,"./utils.js":3}],3:[function(require,module,exports){
"use strict";

(function () {
  var appSettings;

  window.utils = function () {
    return {
      appSettings: {
        breakpoints: {
          mobileMax: 767,
          tabletMin: 768,
          tabletMax: 991,
          desktopMin: 992,
          desktopLargeMin: 1200
        }
      },
      mobile: function mobile() {
        return window.innerWidth < this.appSettings.breakpoints.tabletMin;
      },
      tablet: function tablet() {
        return window.innerWidth > this.appSettings.breakpoints.mobileMax && window.innerWidth < this.appSettings.breakpoints.desktopMin;
      },
      desktop: function desktop() {
        return window.innerWidth > this.appSettings.breakpoints.desktopMin;
      },
      getBreakpoint: function getBreakpoint() {
        if (window.innerWidth < this.appSettings.breakpoints.tabletMin) return 'mobile';else if (window.innerWidth < this.appSettings.breakpoints.desktopMin) return 'tablet';else return 'desktop';
      },
      debounce: function debounce(func, wait, immediate) {
        var timeout;
        return function () {
          var context = this,
              args = arguments;

          var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };

          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      },

      /* Purpose: Detect if any of the element is currently within the viewport */
      anyOnScreen: function anyOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
      },

      /* Purpose: Detect if an element is vertically on screen; if the top and bottom of the element are both within the viewport. */
      allOnScreen: function allOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.bottom < bounds.top && viewport.top > bounds.bottom);
      },
      secondsToMilliseconds: function secondsToMilliseconds(seconds) {
        return seconds * 1000;
      },

      /*
      * Purpose: This method allows you to temporarily disable an an element's transition so you can modify its proprties without having it animate those changing properties.
      * Params:
      * 	-element: The element you would like to modify.
      * 	-cssTransformation: The css transformation you would like to make, i.e. {'width': 0, 'height': 0} or 'border', '1px solid black'
      */
      getTransitionDuration: function getTransitionDuration(element) {
        var $element = $(element);
        return utils.secondsToMilliseconds(parseFloat(getComputedStyle($element[0])['transitionDuration']));
      },
      isInteger: function isInteger(number) {
        return number % 1 === 0;
      },
      rotate: function rotate(array) {
        array.push(array.shift());
        return array;
      }
    };
  }();

  module.exports = window.utils;
})();

},{}]},{},[2]);
