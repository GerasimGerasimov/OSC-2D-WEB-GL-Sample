import { getTextByURL } from "../../../lib/svg/lib/utils";

export default class DeviceController {

    public static async getDevicesInfo(): Promise<any> {
        try {

            const settingsURL = '/assets/fakeinfo.json'
            const text: string = await getTextByURL(settingsURL);
            const data = await JSON.parse(text);
            return data.payload.data;
/*
            const header: any = {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type':'application/json; charset=utf-8',
                }
            }
            return ({});
            /* 
            return await fetch(urlTaggerDevicesInfo, header)
                .then (this.validationJSON);
            */
        } catch(e: any) {
            //console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }


    private static validationJSON (data: any): any {
        try {
            const result = JSON.parse(data);
            return result.data;
        } catch (e) {
            throw new Error ('Invalid JSON');
        }
    }
}