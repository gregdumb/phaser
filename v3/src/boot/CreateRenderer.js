var CONST = require('../const');
var CanvasPool = require('../dom/CanvasPool');
var Features = require('../device/Features');
var CanvasInterpolation = require('../dom/CanvasInterpolation');

var CreateRenderer = function (game)
{
    var config = game.config;

    //  Game either requested Canvas,
    //  or requested AUTO or WEBGL but the browser doesn't support it, so fall back to Canvas
    if (config.renderType === CONST.CANVAS || (config.renderType !== CONST.CANVAS && !Features.webGL))
    {
        if (Features.canvas)
        {
            //  They requested Canvas and their browser supports it
            config.renderType = CONST.CANVAS;
        }
        else
        {
            throw new Error('Cannot create Canvas or WebGL context, aborting.');
        }
    }
    else
    {
        //  Game requested WebGL and browser says it supports it
        config.renderType = CONST.WEBGL;
    }

    //  Pixel Art mode?
    if (config.pixelArt)
    {
        CanvasPool.disableSmoothing();
    }

    //  Does the game config provide its own canvas element to use?
    if (config.canvas)
    {
        game.canvas = config.canvas;
    }
    else
    {
        game.canvas = CanvasPool.create(game, config.width, config.height, config.renderType);
    }

    //  Does the game config provide some canvas css styles to use?
    if (config.canvasStyle)
    {
        game.canvas.style = config.canvasStyle;
    }

    //  Pixel Art mode?
    if (config.pixelArt)
    {
        CanvasInterpolation.setCrisp(game.canvas);
    }

    //  Zoomed?
    if (config.zoom !== 1)
    {
        game.canvas.style.width = (config.width * config.zoom).toString() + 'px';
        game.canvas.style.height = (config.height * config.zoom).toString() + 'px';
    }

    var CanvasRenderer;
    var WebGLRenderer;

    if (WEBGL_RENDERER && CANVAS_RENDERER)
    {
        CanvasRenderer = require('../renderer/canvas/CanvasRenderer');
        WebGLRenderer = require('../renderer/webgl/WebGLRenderer');

        //  Let the config pick the renderer type, both are included
        if (config.renderType === CONST.WEBGL)
        {
            game.renderer = new WebGLRenderer(game);
            game.context = null;
        }
        else
        {
            game.renderer = new CanvasRenderer(game);
            game.context = game.renderer.gameContext;
        }
    }

    if (WEBGL_RENDERER && !CANVAS_RENDERER)
    {
        WebGLRenderer = require('../renderer/webgl/WebGLRenderer');

        //  Force the type to WebGL, regardless what was requested
        config.renderType = CONST.WEBGL;
        game.renderer = new WebGLRenderer(game);
        game.context = null;
    }

    if (!WEBGL_RENDERER && CANVAS_RENDERER)
    {
        CanvasRenderer = require('../renderer/canvas/CanvasRenderer');

        //  Force the type to Canvas, regardless what was requested
        config.renderType = CONST.CANVAS;
        game.renderer = new CanvasRenderer(game);
        game.context = game.renderer.gameContext;
    }
};

module.exports = CreateRenderer;
