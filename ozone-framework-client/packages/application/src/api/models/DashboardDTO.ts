import { ProfileReference, UserReference } from "./UserDTO";
import { createValidator } from "./validate";
import {
    DASHBOARD_GET_RESPONSE_SCHEMA,
    DASHBOARD_SCHEMA,
    DASHBOARD_UPDATE_RESPONSE_SCHEMA
} from "./schemas/dashboard.schema";
import { StackDTO } from "./StackDTO";

export interface DashboardDTO {
    EDashboardLayoutList: string;
    alteredByAdmin: string;
    createdBy: ProfileReference;
    createdDate: string;
    dashboardPosition: number;
    description?: string;
    editedDate: string;
    groups: any[];
    guid: string;
    iconImageUrl?: string;
    isGroupDashboard: boolean;
    isdefault: boolean;
    layoutConfig: string;
    locked: boolean;
    markedForDeletion: boolean;
    name: string;
    prettyCreatedDate: string;
    prettyEditedDate: string;
    publishedToStore: boolean;
    stack?: StackDTO;
    type?: any;
    user: UserReference;
    data?: any;
}

export const validateDashboard = createValidator<DashboardDTO>(DASHBOARD_SCHEMA);

export interface DashboardGetResponse {
    success: boolean;
    results: number;
    data: DashboardDTO[];
}

export const validateDashboardGetResponse = createValidator<DashboardGetResponse>(DASHBOARD_GET_RESPONSE_SCHEMA);

// tslint:disable-next-line
export interface DashboardCreateRequest extends DashboardUpdateRequest {
    //
}

export interface DashboardUpdateRequest {
    dashboardPosition?: number;
    description?: string;
    guid: string;
    iconImageUrl?: string;
    isdefault?: boolean;
    layoutConfig?: string;
    locked?: boolean;
    stack?: StackDTO;
    name: string;
}

export interface DashboardUpdateParams {
    user_id?: number;
    isGroupDashboard?: boolean;
    adminEnabled?: boolean;
}

export interface DashboardUpdateResponse {
    success: boolean;
    data: DashboardDTO[];
}

export const validateDashboardUpdateResponse = createValidator<DashboardUpdateResponse>(
    DASHBOARD_UPDATE_RESPONSE_SCHEMA
);
