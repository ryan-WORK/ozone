
import {
	Gateway,
	getGateway,
	Response
} from "../interfaces";
import {
	PreferenceCreateResponse,
	PreferenceDeleteResponse,
	PreferenceUpdateResponse,
	PreferenceCreateRequest,
	PreferenceUpdateRequest
} from "../models/PreferenceDTO";
import * as qs from "qs";

export class PreferenceAPI {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    async getPreferences(namespace?: string): Promise<Response<any>> {
        if (namespace !== undefined) {
            return this.gateway.get(`prefs/preference/${namespace}/`);
        }

        return this.gateway.get("prefs/preference/");
    }

    async getPreference(namespace: string, path: string): Promise<Response<any>> {
        return this.gateway.get(`prefs/preference/${namespace}/${path}/`);
    }

    async getServerResources(): Promise<Response<any>> {
        return this.gateway.get(`prefs/server/resources/`);
    }


    async createPreference(data: PreferenceCreateRequest): Promise<Response<PreferenceCreateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.post(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: PreferenceCreateResponse.validate
        });
    }

    async updatePreference(data: PreferenceUpdateRequest): Promise<Response<PreferenceUpdateResponse>> {
        const requestData = qs.stringify({
            data: JSON.stringify([data])
        });

        return this.gateway.put(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: PreferenceUpdateResponse.validate
        });
    }

    async deletePreference(data: PreferenceCreateRequest): Promise<Response<PreferenceDeleteResponse>> {
        const requestData = qs.stringify({
            _method: "DELETE"
        });

        return this.gateway.post(`prefs/preference/${data.namespace}/${data.path}/`, requestData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            validate: PreferenceDeleteResponse.validate
        });
    }
}

export const preferenceApi = new PreferenceAPI();
