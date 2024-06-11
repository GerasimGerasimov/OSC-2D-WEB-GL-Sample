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

export default class Canvas extends Component <IDrawCanvasProps, {}>{
  private ctx: any;
  private backbitmap: any = undefined;
  constructor(props: IDrawCanvasProps) {
    super(props);
  }

  private clearScreen(gl: any) {
    gl.clearColor(0.8, 0.8, 0.8, 1.0); // установить в качестве цвета очистки буфера цвета СЕРЫЙ, полная непрозрачность
    gl.enable(gl.DEPTH_TEST); // включает использование буфера глубины
    gl.depthFunc(gl.LEQUAL); // определяет работу буфера глубины: более ближние объекты перекрывают дальние
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // очистить буфер цвета и буфер глубины.
  }

  saveContext(element: any) {
    this.ctx = element.getContext('webgl', {preserveDrawingBuffer: true});
    this.clearScreen(this.ctx);
    
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
    this.props.viewBoxModel.draw();
    if (this.props.isMeasure)
      {this.drawSelectingPointer(this.props.Selected.Left)}
    this.backbitmap = this.props.viewBoxModel.Canvas.transferToImageBitmap();
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