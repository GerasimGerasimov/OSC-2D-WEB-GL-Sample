
import { TDevicesInfoStore, devicesInfoStore } from "./devices/devicesinfo";

export class mainStore {
    public token: string = '';
    public devicesInfoStore: TDevicesInfoStore;

    constructor (){
        this.devicesInfoStore = devicesInfoStore;
    }
}

export default new mainStore();