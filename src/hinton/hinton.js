(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-color')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-color'], factory) :
    (global = global || self, factory(global.d3 = global.d3 || {}, global.d3));
  }(this, function (exports, d3Color) { 'use strict';
  
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
  
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
  
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
  
    var Annotation =
    /*#__PURE__*/
    function () {
      function Annotation(config) {
        _classCallCheck(this, Annotation);
  
        this.config = config;
      }
  
      _createClass(Annotation, [{
        key: "draw",
        value: function draw(element, diagramConfig) {
          this.element = element;
          this.diagramConfig = diagramConfig;
          this.shape = [1, -1];
  
          if (this.config.shape) {
            this.shape = this.config.shape;
          }
  
          if (this.shape[0] === -1) {
            this.shape[0] = this.diagramConfig.numColumns;
          }
  
          if (this.shape[1] === -1) {
            this.shape[1] = this.diagramConfig.numRows;
          }
  
          this.annotation = this.element.append('rect');
          this.annotation.attr('x', 0).attr('y', 0).attr('rx', 2).attr('ry', 2).attr('width', this.diagramConfig.cellSize * this.shape[0]).attr('height', this.diagramConfig.paddedCellSize * this.shape[1]).style('fill', d3Color.rgb(this.config['color'])).style('opacity', 0.5);
        }
      }, {
        key: "update",
        value: function update(x, y, width, height, duration) {
          if (width === -1) width = this.shape[0];
          if (height === -1) height = this.shape[1];
          var transition = this.annotation.transition();
          transition.attr('x', this.diagramConfig.paddedCellSize * x).attr('y', this.diagramConfig.paddedCellSize * y).attr('width', this.diagramConfig.paddedCellSize * width).attr('height', this.diagramConfig.paddedCellSize * height).duration(duration);
        }
      }]);
  
      return Annotation;
    }();
  
    var HintonDiagram =
    /*#__PURE__*/
    function () {
      function HintonDiagram(element, numRows, numColumns, config) {
        _classCallCheck(this, HintonDiagram);
  
        this.element = element;
        this.config = config;
        if (this.config == null) this.config = {};
        this.config.numColumns = numColumns;
        this.config.numRows = numRows;
        this.config.cellSize = 20;
        this.config.cellPadding = 1;
        this.config.paddedCellSize = this.config.cellSize + this.config.cellPadding * 2;
        this.config.width = this.config.numColumns * this.config.paddedCellSize;
        this.config.height = this.config.numRows * this.config.paddedCellSize;
        var svg = this.element.append('svg').attr('width', this.config.paddedCellSize * this.config.numColumns).attr('height', this.config.paddedCellSize * this.config.numRows).attr('class', 'd3-hinton');
        this.container = svg.append('g'); // Draw diagram background
  
        this.container.append('rect').attr('class', 'd3-hinton-background').attr('x', 0).attr('y', 0).attr('rx', 2).attr('ry', 2).attr('width', this.config.paddedCellSize * this.config.numColumns).attr('height', this.config.paddedCellSize * this.config.numRows); // Draw gridlines
  
        if ('show_grid' in this.config) {
          this.drawGridLines(this.container);
        }
  
        this.annotationContainer = this.container.append('g');
        this.cells = []; // TODO: replace this with enter() and exit() code
  
        for (var row = 0; row < this.config.numRows; row++) {
          this.cells[row] = [];
  
          for (var col = 0; col < this.config.numColumns; col++) {
            this.cells[row][col] = this.container.append('rect').attr('class', 'd3-hinton-cell').attr('x', col * this.config.paddedCellSize + this.config.cellPadding).attr('y', row * this.config.paddedCellSize + this.config.cellPadding).attr('width', this.config.cellSize * 0.5).attr('height', this.config.cellSize * 0.5);
          }
        }
      }
  
      _createClass(HintonDiagram, [{
        key: "drawGridLines",
        value: function drawGridLines(container) {
          var x1 = 0;
          var x2 = x1 + this.config.paddedCellSize * (this.config.numColumns - 0);
          var y1 = x1;
          var y2 = y1 + this.config.paddedCellSize * (this.config.numRows - 0);
  
          for (var i = 0; i < this.config.numColumns; i++) {
            var x = this.config.paddedCellSize / 2.0 + i * this.config.paddedCellSize - 0.5;
            container.append('line').attr('class', 'd3-hinton-gridline').attr('x1', x).attr('y1', y1).attr('x2', x).attr('y2', y2);
          }
  
          for (var j = 0; j < this.config.numRows; j++) {
            var y = this.config.paddedCellSize / 2.0 + j * this.config.paddedCellSize - 0.5;
            container.append('line').attr('class', 'd3-hinton-gridline').attr('x1', x1).attr('y1', y).attr('x2', x2).attr('y2', y);
          }
        }
      }, {
        key: "annotation",
        value: function annotation(config) {
          var annotation = new Annotation(config);
          annotation.draw(this.annotationContainer, this.config);
          return annotation;
        }
      }, {
        key: "eachCell",
        value: function eachCell(callback) {
          for (var x = 0; x < this.config.numColumns; x++) {
            var column = this.columns[x];
  
            for (var y = 0; y < this.config.numRows; y++) {
              callback(x, y, column[y]);
            }
          }
        }
      }, {
        key: "update",
        value: function update(data, duration) {
          for (var col = 0; col < this.config.numColumns; col++) {
            for (var row = 0; row < this.config.numRows; row++) {
              var cell = this.cells[row][col];
              var dv = data[row][col];
  
              if (this.config.transpose) {
                dv = data[col][row];
              }
  
              cell.classed('negative', dv < 0.0);
              var v = Math.min(1.0, Math.abs(dv));
              var s = this.config.cellSize * 0.8 * Math.sqrt(v);
              if (!s) s = 0.0;
              var o = (this.config.cellSize - s) / 2.0;
              var x = col * this.config.paddedCellSize + this.config.cellPadding;
              var y = row * this.config.paddedCellSize + this.config.cellPadding;
              var cellTransition = cell.transition();
              cellTransition.attr('x', x + o).attr('y', y + o).attr('width', s).attr('height', s).duration(duration);
            }
          }
        }
      }]);
  
      return HintonDiagram;
    }();
  
    function hinton (elementID, numRows, numColumns, config) {
      return new HintonDiagram(elementID, numRows, numColumns, config);
    }
  
    exports.hinton = hinton;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  }));