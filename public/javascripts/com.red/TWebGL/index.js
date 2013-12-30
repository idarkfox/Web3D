"use strict";


/**
 * @static
 * @const
 * @typedef {string} WEBGL_CONTEXT */

/**
 * @static
 * @const
 * @typedef {string} WEBGL_FRAGMENT_SHADER */

/**
 * @static
 * @const
 * @typedef {string} WEBGL_VERTEX_SHADER */

/**
 * @static
 * @const
 * @typedef {string} WEBGL_TRIANGLE_ROW_COUNT */

/**
 * @static
 * @const
 * @typedef {string} WEBGL_TRIANGLE_COLUMN_COUNT */

/**
 * @static
 * @const
 * @typedef {string} WEBGL_COLORS_ROW_COUNT */

/**
 * @static
 * @const
 * @typedef {string} WEBGL_COLORS_COLUMN_COUNT */







$def({WEBGL_CONTEXT: "experimental-webgl"   });
$def({WEBGL_FRAGMENT_SHADER: 'x-shader/x-fragment'  });
$def({WEBGL_VERTEX_SHADER: 'x-shader/x-vertex'    });

$def({WEBGL_TRIANGLE_ROW_COUNT: 3                      });
$def({WEBGL_TRIANGLE_COLUMN_COUNT: 3                      });
$def({WEBGL_COLORS_ROW_COUNT: 3                      });
$def({WEBGL_COLORS_COLUMN_COUNT: 4                      });


//----------------------------------------------------------------------------------------------------------------------
/**
 * @name WebGL
 * @class
 * @constructor
 * @member {WebGLShader} shader -----------------着色器对象
 * @member {WebGLShaderManage} shaderManage -----着色器管理对象
 * @member {WebGLObjectProxy} object ------------物体，绘图目标
 * @member {WebGLSceneProxy} scene --------------场景，绘图场景及物体管理
 * @member {CanvasRenderingContext2D} gl --------html5 WebGL 上下文
 * @param {HTMLCanvasElement} canvas
 * @method use
 * */
function TWebGL(canvas) {
    var self = this;
    /**
     * @name use
     * @member use
     * @param  config
     * @param {class} config.shader -----------着色器对象
     * @param {class} config.shaderManage -----着色器管理对象
     * @param {class} config.object -----------物体，绘图目标
     * @param {class} config.scene ------------场景，绘图场景及物体管理
     * */
    this.use = function (config) {
        for (var name in config)
            if (name == "shader") {
                self.shader = new config[name](self);
            } else if (name == "shaderManage") {
                self.shaderManage = new config[name](self);
            } else if (name == "object") {
                self.object = new config[name](self);
            } else if (name == "scene") {
                self.scene = new config[name](self);
            }
    }

    this.gl = (function () {
        try {
            var _gl;
            _gl = canvas.getContext(WEBGL_CONTEXT);
            _gl.viewportWidth = canvas.width;
            _gl.viewportHeight = canvas.height;
            return _gl;
        } catch (e) {
            alert("Could not initialise WebGL, sorry :-(");
            return null;
        }
    })();
    /*
     *   默认装载的类，需另实现的同样调用use方法进行覆盖
     *
     */
    this.use({
        shader: WebGLShader, shaderManage: WebGLShaderManage, object: WebGLObjectProxy, scene: WebGLSceneProxy
    });
}
//----------------------------------------------------------------------------------------------------------------------

/**
 * @name WebGLShader
 * @class 着色器类
 * @constructor
 * @param {WebGL} wgl
 *
 * */
function WebGLShader(wgl) {
    var gl = wgl.gl;
    this.getShaderByScript = function (oScript) {     //通过<script>标签获取源码
        if ("undefined" == typeof oScript || !oScript) {
            return null;
        }
        var str = "";
        var k = oScript.firstChild;
        while (k) {
            if (3 == k.nodeType) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        return this.buildShader(oScript.type, str)

    }

    this.buildShader = function (type, source) {
        var shader;
        if (WEBGL_FRAGMENT_SHADER == type) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == WEBGL_VERTEX_SHADER) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, source);//着色器源码
        gl.compileShader(shader);       //编译着色器

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}
//----------------------------------------------------------------------------------------------------------------------
/*
 *   Class
 *   着色器管理类
 * */
/** @param {WebGL} wgl*/
function WebGLShaderManage(wgl) {
//private:
    var self = this;
    var gl = wgl.gl;
    var programs = {};
    var current = null; //当前使用中的程序（program）

    function useProgram(program) {
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert("程序错误！不能初始化着色器!");
            return false;
        }
        gl.useProgram(program);
        return true;
    }

//public:
    this.gl = gl;
    //this.current = null;   //当前使用中的程序（program）

    this.attachProgram = function (program, nameId) {
        program.id = nameId;
        programs[nameId] = program;
    }

    this.delete = function (nameId) {
        return delete programes[nameId];
    }

    this.createProgram = function (nameId) {
        var nameId = nameId || "temp";
        var program = gl.createProgram();
        program.attachShader = function (shader) {
            gl.attachShader(this, shader);
        }
        if (typeof (programs[nameId]) == "undefined") {
            self.attachProgram(program, nameId);
        }
        return program;
    }

    this.getProgramByName = function (nameId) {
        return programs[nameId];
    }

    this.getCurrentPrograme = function () {
        return current;
    }

    this.setVertexPositionAttribute = function (parames) {
        var program = programs[parames.program.id];
        try {
            program.vertexPositionAttribute //顶点属性指针
                = gl.getAttribLocation(program, parames.vertexPositionAttribute);
            gl.enableVertexAttribArray(program.vertexPositionAttribute);
        } catch (err) {
            alert("程序错误！不能从着色器中获取:[vertexPositionAttribute]！");
            throw err;
        }
    }

    this.getVertexPositionAttribute = function (programId) {
        return programs[programId].vertexPositionAttribute;
    }

    this.setVertexColorAttribute = function (parames) {
        var program = programs[parames.program.id];
        try {
            program.vertexColorAttribute    //色彩属性指针
                = gl.getAttribLocation(program, parames.vertexColorAttribute);
            gl.enableVertexAttribArray(program.vertexColorAttribute);
        } catch (err) {
            alert("程序错误！不能从着色器中获取:[vertexColorAttribute]！");
            throw err;
        }

    }

    this.getVertexColorAttribute = function (programId) {
        return programs[programId].vertexColorAttribute;
    }

    this.setUniformPMatrix = function (parames) {
        try {
            programs[parames.program.id].uniformPMatrix
                = gl.getUniformLocation(programs[parames.program.id], parames.uniformPMatrix);
        } catch (err) {
            alert("程序错误！不能从着色器中获取:[uniformPMatrix]！");
            throw err;
        }
    }

    this.getUniformPMatrix = function (programId) {
        return programs[programId].uniformPMatrix;
    }

    this.setUniformMVMatrix = function (parames) {
        try {
            programs[parames.program.id].uniformMVMatrix
                = gl.getUniformLocation(programs[parames.program.id], parames.uniformMVMatrix);
        } catch (err) {
            alert("程序错误！不能从着色器中获取:[uniformMVMatrix]！");
            throw err;
        }
    }

    this.getUniformMVMatrix = function (programId) {
        return programs[programId].uniformMVMatrix;
    }

    this.use = function (parames) {
        var program;
        var valType = typeof parames.program;
        var useSucc = false;
        if (valType == "undefined" || valType == "string") {
            program = this.getProgramByName(parames.program || name);
        } else {
            program = parames.program;
        }
        if (useSucc = useProgram(program)) {
            current = program;
        }
        if (useSucc) {
            parames.program = current;
            typeof(parames.vertexPositionAttribute) == "string"
                ? this.setVertexPositionAttribute(parames)
                : void(0);
            typeof(parames.vertexColorAttribute) == "string"
                ? this.setVertexColorAttribute(parames)
                : void(0);
            typeof(parames.uniformPMatrix) == "string"
                ? this.setUniformPMatrix(parames)
                : void(0);
            typeof(parames.uniformMVMatrix) == "string"
                ? this.setUniformMVMatrix(parames)
                : void(0);
        }
        return this;
    }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * @name TBuffer
 * @abstract
 * @constructor
 */
function TBuffer() {
    var wgl = null;
    var buffer = null;
    var rowCount = 0;
    var colCount = 0;

    this.getBuffer = function () {
        return buffer;
    }
    /** @abstract
     * @param {Array} val */
    this.setBuffer = function (val) {
        throw new Error("must be implemented by subclass!");
    };
    /**
     * @protected
     * @param {Array} val */
    this.putBuffer = function (val) {
        buffer = val;
    }
    /** @return {number} */
    this.getRowCount = function () {
        return rowCount;
    };
    /** @param {number} val */
    this.setRowCount = function (val) {
        rowCount = val;
    };
    /** @return {number} */
    this.getColCount = function () {
        return colCount;
    };
    /** @param {number} val */
    this.setColCount = function (val) {
        colCount = val;
    };
    /** @return {TWebGL} */
    this.getTWebGL = function () {
        return this.wgl;
    };
    /** @param {TWebGL} val */
    this.setTWebGL = function (val) {
        wgl = val;
    };
    /** @return {boolean} */
    this.checkTWebGL = function () {
        if (!(this.TWebGL || false)) {
            throw new Error("TWebGL:null!");
        }
        return true;
    };

    /**
     * @protected
     @param {Number} target
     @param {ArrayBuffer} data
     @param {Number} usage
     */
    this.createBuffer = function (target, data, usage) {
        this.checkTWebGL();
        var gl = this.TWebGL.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, new Uint16Array(data), usage);
        //********************
        this.putBuffer(buffer);
        return buffer;
    }
}

TBuffer.prototype = {
    /** @private */
    nop: function () {
        return this;
    }, get buffer() {
        return this.getBuffer();
    }
    /** @param {Array} val */, set buffer(val) {
        this.setBuffer(val);
    }, get rowCount() {
        return this.getRowCount();
    }
    /** @param {number} val */, set rowCount(val) {
        this.setRowCount(val);
    }, get colCount() {
        return this.getColCount();
    }
    /** @param {number} val */, set colCount(val) {
        this.setColCount(val);
    }, get TWebGL() {
        return this.getTWebGL();
    }
    /** @param {TWebGL} val */, set TWebGL(val) {
        this.setTWebGL(val);
    }

    /** @param {Object} param */, set attributes(param) {
        var ibo = param.IBO || null;
        this.buffer = ibo.buffer || [];
        this.rowCount = ibo.rowCount || 0;
        this.colCount = ibo.colCount || 0;
    }
}
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
/**
 * @name IBO
 * Index buffer object
 * @constructor
 * @extends TBuffer
 */
function IBO() {
    TBuffer.apply(this);
    /** @override
     * @param {Array} indices */
    this.setBuffer = function (indices) {


        this.checkTWebGL();
        var gl = this.TWebGL.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        //********************
        this.putBuffer(buffer);
    }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * @name VBO
 * Vertex buffer object
 * @constructor
 */
function VBO() {
    TBuffer.apply(this);
    /** @override
     * @param {Array} vertices */
    this.setBuffer = function (vertices) {
        this.checkTWebGL();
        var gl = this.TWebGL.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        //********************
        this.putBuffer(buffer);
    }
}
//----------------------------------------------------------------------------------------------------------------------

/*
 *   Class
 *   物体(单个）
 * */
/** @param {WebGL} wgl*/
function WebGLObject(wgl) {
    var id = "";
    var self = this;
    var gl = wgl.gl;
    var mvMatrix = typeof mat4 != "undefined" ? mat4.create() : null;
    var vertices = [];       //<---*
    var colors = [];       //<---*

    //默认使用三角形的行列数
    var pRowCount = WEBGL_TRIANGLE_ROW_COUNT;
    var pColCount = WEBGL_TRIANGLE_COLUMN_COUNT;

    var cRowCount = WEBGL_COLORS_ROW_COUNT;
    var cColCount = WEBGL_COLORS_COLUMN_COUNT;

    var vPBuffer = [];  //VertexPositionBuffer
    var vCBuffer = [];  //VertexColorBuffer
    var IBO = [];  //index buffer object

    var shaderProgramId = "";   //本单位使用的着色器id

    this.x = 0;
    this.y = 0;
    this.z = -10.0;
    //this.getMatrix = function(){ return mvMatrix; }
    //this.setMatrix = function( val ){mvMatrix = val;}

    this.getVertices = function () {
        return vertices;
    }
    this.setVertices = function (val) {
        vertices = val || [];
        if (!vertices.length) return;
        vPBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vPBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    this.getIBO = function () {
        return IBO;
    }
    this.setIBO = function (val) {

    }

    this.isUseColor = 1;
    this.getColors = function () {
        return colors;
    }
    this.setColors = function (val) {
        colors = val || [];
        if (!colors.length) return;
        vCBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vCBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, vCBuffer);
        gl.vertexAttribPointer(wgl.shaderManage.getVertexColorAttribute(shaderProgramId), this.colorsColCount, gl.FLOAT, false, 0, 0);
    }

    this.getId = function () {
        return id;
    }

    this.setId = function (nameId) {
        id = nameId || new Date().getTime();
    }

    this.getShaderProgramId = function () {
        return shaderProgramId;
    }
    this.setShaderProgramId = function (nameId) {
        shaderProgramId = nameId || wgl.shaderManage.getCurrentPrograme().id;
    }

    this.getPositionRowCount = function () {
        return pRowCount;
    }
    this.setPositionRowCount = function (num) {
        pRowCount = num || pRowCount;
    }
    this.getPositionColCount = function () {
        return pColCount;
    }
    this.setPositionColCount = function (num) {
        pColCount = num || pColCount;
    }

    this.getColorsRowCount = function () {
        return cRowCount;
    }
    this.setColorsRowCount = function (num) {
        cRowCount = num || cRowCount;
    }
    this.getColorsColCount = function () {
        return cColCount;
    }
    this.setColorsColCount = function (num) {
        cColCount = num || cColCount;
    }

    this.flagX = 0;
    this.flagY = 0;

    //模型视图矩阵变更
    this.alter = function (parames) {
        var parames = parames || {};
        if (this.isUseColor)
            this.colors = parames.colors || null;
        ;
        this.move(parames);
        return this;
    }

    this.move = function (parames) {
        var parames = parames || {};
        //        if( this.x < 1 && this.flagX )
        //            this.x += parames.movX||0;
        //        else if (this.x > -1 && !this.flagX)
        //            this.x -= parames.movX||0;
        //        else
        //            this.flagX = !this.flagX;
        //
        //        if( this.y < 1 && this.flagY )
        //            this.y += parames.movY||0;
        //        else if (this.y > -1 && !this.flagY)
        //            this.y -= parames.movY||0;
        //        else
        //            this.flagY = !this.flagY;

        this.z += parames.movZ || 0;
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [this.x, this.y, this.z]);

        mat4.rotate(mvMatrix, degToRad(rCube), [1, 1, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, vPBuffer);
        gl.vertexAttribPointer(webgl.shaderManage.getVertexPositionAttribute(shaderProgramId), this.positionColCount, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(webgl.shaderManage.getUniformMVMatrix(shaderProgramId), false, mvMatrix);
    }

    //绘制模型
    this.draw = function (parames) {
        if (typeof(parames) != "undefined") {
            this.alter(parames);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, pRowCount);
        return this;
    }
}
//定义在外部是为了避免每次生成实例都执行绑定动作
WebGLObject.prototype = {
    nop: function () {
        return this;
    }, get matrix() {
        return this.getMatrix();
    }, set matrix(val) {
        this.setMatrix(val);
    }, get vertices() {
        return this.getVertices();
    }, set vertices(val) {
        this.setVertices(val);
    }, get colors() {
        return this.getColors();
    }, set colors(val) {
        this.setColors(val);
    }, get id() {
        return this.getId();
    }, set id(val) {
        this.setId(val);
    }, get shaderProgramId() {
        return this.getShaderProgramId();
    }, set shaderProgramId(val) {
        this.setShaderProgramId(val);
    }, get positionRowCount() {
        return this.getPositionRowCount();
    }, set positionRowCount(val) {
        this.setPositionRowCount(val);
    }, get positionColCount() {
        return this.getPositionColCount();
    }, set positionColCount(val) {
        this.setPositionColCount(val);
    }, get colorsRowCount() {
        return this.getColorsRowCount();
    }, set colorsRowCount(val) {
        this.setColorsRowCount(val);
    }, get colorsColCount() {
        return this.getColorsColCount();
    }, set colorsColCount(val) {
        this.setColorsColCount(val);
    }, set attributes(parames) {

        this.id = parames.id || null;
        this.shaderProgramId = parames.shaderProgramId || null;

        this.vertices = parames.vertices;
        this.positionRowCount = parames.positionRowCount || null;
        this.positionColCount = parames.positionColCount || null;

        this.IBO = parames.IBO || null;
        this.IBOColCount = parames.IBOColCount || null;
        this.IBORowCount = parames.IBORowCount || null;

        this.colors = parames.colors || null;
        this.colorsRowCount = parames.colorsRowCount || null;
        this.colorsColCount = parames.colorsColCount || null;


    }
}

/**
 * @name WebGLObjectProxy
 * @class
 * @param {WebGL} webGL
 * @constructor
 * @augment WebGLObject
 */
function WebGLObjectProxy(webGL) {
    var self = this;
    this.create = function () {
        return new WebGLObject(webGL);
    }
}
//----------------------------------------------------------------------------------------------------------------------
/*
 *   Class
 *   场景
 * */
function WebGLScene(webgl) {
    var self = this;
    var gl = webgl.gl;
    var objects = [];
    var map = [];
    var pMatrix = typeof mat4 != "undefined" ? mat4.create() : null;

    var shaderProgramId = "";   //本场景使用的着色器id

    this.addObject = function (parames) {
        var obj = webgl.object.create();
        obj.attributes = parames;
        var findObj = this.getObjectById(parames.id || null);
        if (findObj) {
            objects[findObj.index] = obj;
        } else {
            obj.id = parames.id || null;
            objects.push(obj);
        }
        obj.alter(null);
        return obj;
    }

    this.getObjectById = function (id) {
        for (var i in objects) {
            if (objects[i].id == id) {
                return {object: obj, index: i};
            }
        }
        return null;
    }

    this.getShaderProgramId = function () {
        return shaderProgramId;
    }

    this.setShaderProgramId = function (nameId) {
        shaderProgramId = nameId || webgl.shaderManage.getCurrentPrograme().id;
    }
    //视口、投影矩阵变更
    this.alter = function (Configure) {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);//resize
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
        gl.uniformMatrix4fv(webgl.shaderManage.getUniformPMatrix(shaderProgramId), false, pMatrix);
        return this;
    }
    //绘制
    this.draw = function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //绘制所有对象
        for (var i in objects) {
            objects[i].draw({movX: 0.05, movY: 0.05});
        }
        return this;
    }

    if (!this.getShaderProgramId()) {
        this.setShaderProgramId(null);
    }
}

WebGLScene.prototype = {
    nop: null, get shaderProgramId() {
        return this.getShaderProgramId();
    }, set shaderProgramId(val) {
        this.setShaderProgramId(val);
    }
}

/**
 * @name WebGLSceneProxy
 * @class
 * @param {WebGL} webGL
 * @constructor
 * @augment WebGLScene
 */
function WebGLSceneProxy(webGL) {
    var self = this;
    this.create = function () {
        return new WebGLScene(webGL);
    }
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function WebGLConfig() {
    return {};
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
