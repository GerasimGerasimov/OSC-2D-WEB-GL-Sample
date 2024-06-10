//тренды вписанные в один блок графика
import { TTrand } from './trand';
import { ITrandProp } from './itrand';

interface ITrandsGroupProp {
  height: string,
  tags: Array<string>
}

const rad: number = Math.PI / 180.0;

export class TTrandsGroup {
  private deep: number; //глубина архива
  private height: string;
  private trands: Map<string, TTrand>;
  private count: number = 0;

  constructor (deep: number, props: ITrandsGroupProp) {
    this.deep = deep;
    this.height = props.height;
    this.trands = this.setTagsProps(props.tags);
  }

  public get Trands(): Map<string, TTrand> {
    return this.trands;
  }

  public getBoxHeight():string{
    return this.height;
  }

  private setTagsProps(props: Array<string>): Map<string, TTrand> {
    const tags: Map<string, TTrand> = new Map();
    for (const key in props) {
      const value: any = props[key];
      const trandProp: ITrandProp = {
        tag: key,
        deep: this.deep,
        ...value
      }
      const trand: TTrand = new TTrand(trandProp);
      tags.set(key, trand)
      console.log(value)
    }
    return tags;
  }

  public setTagsFakeValues(){
    this.trands.forEach((tag:TTrand) => {
      //const value = tag.getTagValue();
      //tag.setValueToModel(value);
      let w:number = (Math.sin(this.count*rad)+1)*100;
      //console.log(w);
      tag.setParameterValue(w);
      if (this.count++ > 360) this.count = 0;
    })
  }

  public setTagsValues() {
    this.trands.forEach((tag:TTrand) => {
      const value = tag.getTagValue();
      tag.setValueToModel(value);
    })
  }
}