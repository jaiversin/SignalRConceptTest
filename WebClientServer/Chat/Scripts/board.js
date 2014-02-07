'use strict';

var Board = function () {
    //private members
    // Pencil Points
    var ppts = [];

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    var _sketch, _canvas, _context, tmp_canvas, tmp_ctx, _offset;
    var _color, _width, _tool;
    var _isDrawing = false;
    var _onStrokeDone;

    var init = function (sketch, canvas, tool, color, width, onStrokeDone) {
        _context = canvas.getContext('2d');
        _canvas = canvas;
        _color = color;
        _width = width;
        _tool = tool;
        _sketch = sketch;
        _onStrokeDone = onStrokeDone;
        _canvas.style.cursor = 'crosshair';
        // Creating a tmp canvas
        tmp_canvas = document.createElement('canvas');
        tmp_ctx = tmp_canvas.getContext('2d');
        tmp_canvas.id = 'tmp_canvas';
        sketch.appendChild(tmp_canvas);

        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function (e) {
            mouse.x = getX(e);
            mouse.y = getY(e);
        }, false);

        canvas.addEventListener('mousemove', function (e) {
            mouse.x = getX(e);
            mouse.y = getY(e);
        }, false);


        /* Drawing on Paint App */
        tmp_ctx.lineWidth = width;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = color;
        tmp_ctx.fillStyle = color;

        tmp_canvas.addEventListener('mousedown', function (e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);

            mouse.x = getX(e);
            mouse.y = getY(e);

            ppts.push({ x: mouse.x, y: mouse.y });

            onPaint();
        }, false);

        tmp_canvas.addEventListener('mouseup', function () {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);

            _context.globalCompositeOperation = 'source-over';

            // Writing down to real canvas now
            _context.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            if (typeof _onStrokeDone === 'function') {
                _onStrokeDone(ppts);
            }
            // Emptying up Pencil Points
            ppts = [];
        }, false);

        canvas.addEventListener('mousedown', function (e) {
            canvas.addEventListener('mousemove', onErase, false);

            mouse.x = getX(e);
            mouse.y = getY(e);

            ppts.push({ x: mouse.x, y: mouse.y });

            onErase();
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', onErase, false);
            if (typeof _onStrokeDone === 'function') {
                _onStrokeDone(ppts);
            }
            // Emptying up Pencil Points
            ppts = [];
        }, false);
    }

    var getX = function (event) {
        var offset = $('#boardElementContainer').offset();
        if (event.type.indexOf("touch") != -1) {
            return event.targetTouches[0].pageX - offset.left;
        }
        else {
            return typeof event.offsetX !== 'undefined' ? event.offsetX : event.layerX;
        }
    }

    var getY = function (event) {
        var offset = $('#boardElementContainer').offset();
        if (event.type.indexOf("touch") != -1) {
            return event.targetTouches[0].pageY - offset.top;
        }
        else {
            return typeof event.offsetY !== 'undefined' ? event.offsetY : event.layerY;
        }
    }

    var onPaint = function () {
        // Saving all the points in an array
        ppts.push({ x: mouse.x, y: mouse.y });

        if (ppts.length < 3) {
            var b = ppts[0];
            tmp_ctx.beginPath();
            tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();

            return;
        }

        // Tmp canvas is always cleared up before drawing.
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        tmp_ctx.beginPath();
        tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

        for (var i = 1; i < ppts.length - 2; i++) {
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;

            tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
        }

        // For the last 2 points
        tmp_ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
        tmp_ctx.stroke();

    };

    var onErase = function () {

        // Saving all the points in an array
        ppts.push({ x: mouse.x, y: mouse.y });

        _context.globalCompositeOperation = 'destination-out';
        _context.fillStyle = 'rgba(0,0,0,1)';
        _context.strokeStyle = 'rgba(0,0,0,1)';
        _context.lineWidth = _width * 2;

        if (ppts.length < 3) {
            var b = ppts[0];
            _context.beginPath();
            //ctx.moveTo(b.x, b.y);
            //ctx.lineTo(b.x+50, b.y+50);
            _context.arc(b.x, b.y, _context.lineWidth / 2, 0, Math.PI * 2, !0);
            _context.fill();
            _context.closePath();

            return;
        }

        _context.beginPath();
        _context.moveTo(ppts[0].x, ppts[0].y);

        for (var i = 1; i < ppts.length - 2; i++) {
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;

            _context.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
        }

        // For the last 2 points
        _context.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
        _context.stroke();

    };

    var drawStroke = function (serverppts, color) {
        var tmpColor = tmp_ctx.strokeStyle;
        tmp_ctx.strokeStyle = color;
        tmp_ctx.fillStyle = color;

        if (serverppts.length < 3) {
            var b = serverppts[0];
            tmp_ctx.beginPath();
            tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();

            return;
        }

        // Tmp canvas is always cleared up before drawing.
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        tmp_ctx.beginPath();
        tmp_ctx.moveTo(serverppts[0].x, serverppts[0].y);

        for (var i = 1; i < serverppts.length - 2; i++) {
            var c = (serverppts[i].x + serverppts[i + 1].x) / 2;
            var d = (serverppts[i].y + serverppts[i + 1].y) / 2;

            tmp_ctx.quadraticCurveTo(serverppts[i].x, serverppts[i].y, c, d);
        }

        // For the last 2 points
        tmp_ctx.quadraticCurveTo(
                serverppts[i].x,
                serverppts[i].y,
                serverppts[i + 1].x,
                serverppts[i + 1].y
            );
        tmp_ctx.stroke();


        _context.globalCompositeOperation = 'source-over';

        // Writing down to real canvas now
        _context.drawImage(tmp_canvas, 0, 0);
        // Clearing tmp canvas
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        // Emptying up Pencil Points
        serverppts = [];

        tmp_ctx.strokeStyle = tmpColor;
    };

    var eraseStroke = function (serverppts) {
        _context.globalCompositeOperation = 'destination-out';
        _context.fillStyle = 'rgba(0,0,0,1)';
        _context.strokeStyle = 'rgba(0,0,0,1)';
        _context.lineWidth = _width * 2;

        if (serverppts.length < 3) {
            var b = serverppts[0];
            _context.beginPath();
            //ctx.moveTo(b.x, b.y);
            //ctx.lineTo(b.x+50, b.y+50);
            _context.arc(b.x, b.y, _context.lineWidth / 2, 0, Math.PI * 2, !0);
            _context.fill();
            _context.closePath();

            return;
        }

        _context.beginPath();
        _context.moveTo(serverppts[0].x, serverppts[0].y);

        for (var i = 1; i < serverppts.length - 2; i++) {
            var c = (serverppts[i].x + serverppts[i + 1].x) / 2;
            var d = (serverppts[i].y + serverppts[i + 1].y) / 2;

            _context.quadraticCurveTo(serverppts[i].x, serverppts[i].y, c, d);
        }

        // For the last 2 points
        _context.quadraticCurveTo(
			serverppts[i].x,
			serverppts[i].y,
			serverppts[i + 1].x,
			serverppts[i + 1].y
		);
        _context.stroke();
    };

    var setTool = function (tool) {
        _tool = tool;
        // retorna el canvas.
        if (document.getElementById('img_canvas')) {
            restoreCanvas();
        }

        if (tool === 'pencil') {
            tmp_canvas.style.display = 'block';
        } else if (tool === 'eraser') {
            tmp_canvas.style.display = 'none';
        } else if (tool === 'glass') {
            // convierte el canvas en una imagen para poder aplicar la lupa.
            magnify();
        }

    };

    var setColor = function (color) {
        _color = color;
        tmp_ctx.strokeStyle = color;
        tmp_ctx.fillStyle = color;
    };

    var clear = function () {
        // Clearing tmp canvas
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        // Clearing tmp canvas
        _context.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    };

    //public members
    return {
        init: init,
        drawStroke: drawStroke,
        eraseStroke: eraseStroke,
        setTool: setTool,
        setColor: setColor,
        clear: clear
    }

};
