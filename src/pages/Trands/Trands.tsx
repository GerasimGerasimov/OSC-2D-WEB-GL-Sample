import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox from './TViewBox'
import { ISelected } from './TDrawCanvas';

interface ITrandsPageState {
  scrollPosition: number;
  deep: number;
  widthScale: number;
  SelectedIndex: ISelected;
  isMeasure: boolean;
}

export default class TrandsPage extends Component<{}, ITrandsPageState> {
    constructor (props: any){
        super(props);
        this.state = {
          scrollPosition: 0,
          deep: Trands.Deep,
          widthScale: Trands.WidthScale,
          SelectedIndex: {
            Index: 0,
            Left: 0
          },
          isMeasure: false
        }
    }

    private changeScrollPosition(e: any) {
      this.setState({scrollPosition: e.target.value});
    }

    private onViewBoxClickHandler( position: ISelected): void {
      this.setState({SelectedIndex:{
        Index: position.Index,
        Left: position.Left
      }})
    }

    private getTrandsBoxes(): any{
      return Trands.getBoxes().map((box, index)=>{
        box.ScrollPosition = this.state.scrollPosition;
        box.WidthScale     = this.state.widthScale;
        return (
            <TViewBox
              key = {index}
              viewBox = {box}
              onSetSelectedIndex = {this.onViewBoxClickHandler.bind(this)}
              Selected = {this.state.SelectedIndex}
              isMeasure = {this.state.isMeasure}
            />
        )
      })
    }

    render() {
        return(
          <div className='Trands_flex'> 
            <p>Trands: {this.state.SelectedIndex.Left} {this.state.SelectedIndex.Index} </p>
            <div className='Trands wrapper box'>
              {this.getTrandsBoxes()}
            </div>
              <input type="range"
                className = 'Trands range'
                value={this.state.scrollPosition}
                min="0"
                max={this.state.deep}
                step="1"
                onChange={(e)=>this.changeScrollPosition(e)}/>
          </div>
        )
      }
}
