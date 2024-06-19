import React, {Component} from 'react'
import './Trands.css'
import OutCanvas from './TOutCanvas';
import TViewBoxModel from './TViewBoxModel';

export enum ELegendViewMode {
  EndIndex,
  SelectedIndex
}

export interface ISelected {
  Index: number;
  Left: number;
}

export interface IDrawCanvasProps {
  viewBoxModel: TViewBoxModel;
  width: number;
  Selected: ISelected;
  ViewMode: ELegendViewMode;
  isMeasure: boolean;
}

// https://webglfundamentals.org/webgl/lessons/ru/webgl-fundamentals.html

const vertex_shader_2d: string = `
  // атрибут, который будет получать данные из буфера
  attribute vec4 a_position;
 
  // все шейдеры имеют функцию main
  void main() {
 
    // gl_Position - специальная переменная вершинного шейдера,
    // которая отвечает за установку положения
    gl_Position = a_position;
  }
`;

const fragment_shader_2d: string =`
  // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
  // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
  precision lowp float;
 
  void main() {
    // gl_FragColor - специальная переменная фрагментного шейдера.
    // Она отвечает за установку цвета.
    gl_FragColor = vec4(1, 0, 0.5, 1); // вернёт красновато-фиолетовый
  }
`;

function createShader(gl: WebGL2RenderingContext, type:number, source: string):WebGLShader | null {
  var shader:WebGLShader | null = gl.createShader(type);   // создание шейдера
  if (shader) {
    gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
    gl.compileShader(shader);             // компилируем шейдер
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
      return shader;
    }
  }
  console.log(shader? gl.getShaderInfoLog(shader) : "WebGL шейдер не создался");
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl:WebGL2RenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader): WebGLProgram | null {
  var program: WebGLProgram | null = gl.createProgram();
  if (program) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  }
  console.log(program? gl.getProgramInfoLog(program) : "WebGL программа не создалась");
  gl.deleteProgram(program);
  return null;
}

function clearScreen(gl: WebGL2RenderingContext) {
  gl.clearColor(0.8, 0.8, 0.8, 1.0); // установить в качестве цвета очистки буфера цвета СЕРЫЙ, полная непрозрачность
  gl.enable(gl.DEPTH_TEST); // включает использование буфера глубины
  gl.depthFunc(gl.LEQUAL); // определяет работу буфера глубины: более ближние объекты перекрывают дальние
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // очистить буфер цвета и буфер глубины.
}

export default class Canvas extends Component <IDrawCanvasProps, {}>{
  private ctx: any;
  private backbitmap: any = undefined;
  private gl:WebGL2RenderingContext | undefined = undefined;
  private positions: Array<number> = [
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
    0, 0,      //0я-точка
    0.25, 0.65,//1я-точка
    0.25, -0.25,//2я-точка
    0.75, -0.5,  //3я-точка
  ];

  private positionAttributeLocation = 0;
  private positionBuffer: WebGLBuffer | null = null;

  constructor(props: IDrawCanvasProps) {
    super(props);
  }

  saveContext(element: any) {
    this.ctx = element.getContext('webgl', {preserveDrawingBuffer: true});
    var gl: WebGL2RenderingContext =  this.gl = this.ctx;
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_2d);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_2d);
    if (vertexShader && fragmentShader) {
      var program: WebGLProgram | null = createProgram(gl, vertexShader, fragmentShader);
      if (program) {
        this.positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        this.positionBuffer = gl.createBuffer();
        if (this.positionBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
          // четыре, расположенных одна за другой двумерных точки, режим gl.LINE_STRIP
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.DYNAMIC_DRAW);
          gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
          clearScreen(gl);
          gl.useProgram(program);// говорим использовать нашу программу (пару шейдеров)
          gl.enableVertexAttribArray(this.positionAttributeLocation);
          // Привязываем буфер положений
          gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
          // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
          var size = 2;          // 2 компоненты на итерацию
          var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
                                // а могут быть:
                                //BYTE, UNSIGNED_BYTE, SHORT, UNSIGNED_SHORT, INT, UNSIGNED_INT
          var normalize = false; // не нормализовать данные
          var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
          var offset = 0;        // начинать с начала буфера
          gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);
        }
      }
    }
    const width: number = element.clientWidth;
    const height: number = element.clientHeight;
    this.props.viewBoxModel.resize(width, height);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    setTimeout(()=>{
      this.draw();
    },0)//TODO тут надо задавать как часто обновляется график тредов
  }
  
  private drawSelectingPointer(left: number) {
    /*
    const canvas = this.props.viewBoxModel.Context; 
    canvas.strokeStyle = "gray";
    canvas.moveTo(left, 0);
    canvas.lineTo(left, canvas.canvas.height);
    canvas.stroke();
    */
  }

  /*РИСОВАНИЕ НАЧИНАЕТСЯ ТУТ*/
  private draw() {
    const start = performance.now();
    //gl.lineWidth(0.1); это не работает!
    var gl: WebGL2RenderingContext | undefined=  this.gl;
    if (gl) {
      clearScreen(gl);
      this.positions.forEach((e,i,a)=>{ a[i] = Math.random()});
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.DYNAMIC_DRAW);
      var primitiveType: number = gl.LINE_STRIP;
      var offset: number = 0;
      var count: number = this.positions.length >> 1;
      gl.drawArrays(primitiveType, offset, count);
    }
    //this.props.viewBoxModel.draw();
    //if (this.props.isMeasure)
    //  {this.drawSelectingPointer(this.props.Selected.Left)}
    //this.backbitmap = this.props.viewBoxModel.Canvas.transferToImageBitmap();
    /*TODO отрисовка */
    //this.ctx.transferFromImageBitmap(this.backbitmap);
    const end = performance.now();
    const time = end - start;
    console.log(time);
  }

  render() {
    return (
      <>
        <OutCanvas width={this.props.width} contextRef={this.saveContext.bind(this)} />
      </>
    )
  }
}