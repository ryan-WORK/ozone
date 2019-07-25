import { BehaviorSubject } from "rxjs";
import { Intent } from "@blueprintjs/core";

import { asBehavior } from "../observables";
import { showToast } from "../components/toaster/Toaster";
import { isNil, values } from "../utility";

import { DashboardCreateOpts, userDashboardApi, UserDashboardAPI } from "../api/clients/UserDashboardAPI";
import { dashboardApi, DashboardAPI } from "../api/clients/DashboardAPI";
import { stackApi } from "../api/clients/StackAPI";

import { Dashboard, EMPTY_DASHBOARD } from "../models/Dashboard";
import { UserWidget } from "../models/UserWidget";
import { StackCreateRequest, StackUpdateRequest } from "../api/models/StackDTO";
import { UserDashboardStackDTO } from "../api/models/UserDashboardDTO";

import { dashboardToUpdateRequest, deserializeUserState, UserState } from "../codecs/Dashboard.codec";

import { CreateDashboardOptions } from "../components/create-dashboard-screen/CreateDashboardForm";
import { createPresetLayout } from "./default-layouts";
import _ from "lodash";

const EMPTY_USER_DASHBOARDS_STATE: UserState = {
    dashboards: {},
    stacks: {},
    widgets: {}
};

export class DashboardStore {
    private readonly userDashboardApi: UserDashboardAPI;
    private readonly dashboardApi: DashboardAPI;

    private readonly userDashboards$ = new BehaviorSubject<UserState>(EMPTY_USER_DASHBOARDS_STATE);
    private readonly currentDashboard$ = new BehaviorSubject<Dashboard>(EMPTY_DASHBOARD);

    private readonly isLoading$ = new BehaviorSubject(true);

    constructor(userDashboards?: UserDashboardAPI, dashboards?: DashboardAPI) {
        this.userDashboardApi = userDashboards || userDashboardApi;
        this.dashboardApi = dashboards || dashboardApi;
    }

    userDashboards = () => asBehavior(this.userDashboards$);

    currentDashboard = () => asBehavior(this.currentDashboard$);

    isLoading = () => asBehavior(this.isLoading$);

    findUserWidgetById(id: number): UserWidget | undefined {
        const userState = this.userDashboards$.value;
        const userWidgets = values(userState.widgets);
        return userWidgets.find((w: UserWidget) => w.id === id);
    }

    findUserWidgetByUniversalName(universalName: string): UserWidget | undefined {
        const userState = this.userDashboards$.value;
        const userWidgets = values(userState.widgets);
        return userWidgets.find((w: UserWidget) => w.widget.universalName === universalName);
    }

    fetchUserDashboards = async (newCurrentDashGuid?: string | any) => {
        this.isLoading$.next(true);

        let response = await this.userDashboardApi.getOwnDashboards();
        if (response.status !== 200) {
            throw new Error("Failed to fetch user dashboards");
        }

        if (response.data.dashboards.length === 0) {
            response = await this.createDefaultDashboard();
        }

        const defaultDashboard = response.data.dashboards.find((dashboard) => dashboard.isdefault === true);

        const newState = deserializeUserState(response.data.dashboards, response.data.widgets);
        this.userDashboards$.next(newState);
        newCurrentDashGuid = newCurrentDashGuid ? newCurrentDashGuid : defaultDashboard ? defaultDashboard.guid : null;
        this.setCurrentDashboard(newState, newCurrentDashGuid);

        this.isLoading$.next(false);
    };

    createDefaultDashboard = async () => {
        const defStack: StackCreateRequest = {
            name: "Untitled",
            imageUrl: "",
            approved: false,
            stackContext: "",
            description: "Automatically-generated stack"
        };
        this.createNewStack(defStack);

        const refetchResponse = await this.userDashboardApi.getOwnDashboards();
        if (refetchResponse.status !== 200) {
            throw new Error("Failed to fetch user dashboards");
        }

        return refetchResponse;
    };

    createDashboard = async (dashboard: CreateDashboardOptions) => {
        const { tree, panels } = await createPresetLayout(dashboard.presetLayoutName, dashboard.copyGuid);
        const opts: DashboardCreateOpts = {
            backgroundWidgets: [],
            name: dashboard.name,
            tree,
            panels,
            stackId: dashboard.stackId
        };
        const createResponse = await this.userDashboardApi.createDashboard(opts);
        if (createResponse.status !== 200) {
            throw new Error("Failed to create new dashboard");
        }
        const createdDashboard = createResponse.data;
        await this.fetchUserDashboards(createdDashboard.guid);
        return createdDashboard;
    };

    async createNewStack(
        stackRequest: StackCreateRequest,
        defaultDashLayoutOptions?: { presetLayoutName: string | null; copyGuid: string | null }
    ): Promise<Boolean> {
        const defaultDashOptions: CreateDashboardOptions = {
            name: stackRequest.name + " (default)",
            description: "Default dashboard for stack `" + stackRequest.name + "`",
            presetLayoutName: defaultDashLayoutOptions ? defaultDashLayoutOptions.presetLayoutName : null,
            copyGuid: defaultDashLayoutOptions ? defaultDashLayoutOptions.copyGuid : null
        };

        const newDash = await this.createDashboard(defaultDashOptions);
        const userDashboardsResponse = await userDashboardApi.getOwnDashboards();
        if (userDashboardsResponse.status !== 200 || !userDashboardsResponse.data.dashboards) {
            console.log("Could not create stack.");
            showToast({
                message: "Stack `" + stackRequest.name + "` could not be created.",
                intent: Intent.DANGER
            });
            return false;
        }

        let newStack: UserDashboardStackDTO | undefined;

        for (const dash of userDashboardsResponse.data.dashboards) {
            if (dash.guid === newDash.guid) {
                newStack = dash.stack;
            }
        }
        if (!newStack) {
            return false;
        }
        const stackUpdateRequest: StackUpdateRequest = {
            ...stackRequest,
            id: newStack.id,
            stackContext: newStack.stackContext
        };
        console.log(stackUpdateRequest);

        const stackResponse = await stackApi.updateStack(stackUpdateRequest);

        if (stackResponse.status !== 200 || !stackResponse.data.data || !(stackResponse.data.data.length > 0)) {
            return false;
        }
        return true;
    }

    saveCurrentDashboard = async () => {
        if (this.isLoading$.value) return;

        const currentDashboard = this.currentDashboard$.value;

        const request = dashboardToUpdateRequest(currentDashboard);

        const response = await this.dashboardApi.updateDashboard(request);

        if (response.status !== 200) {
            throw new Error("Failed to save user dashboard");
        }
    };

    saveCurrentDashboardIfChanged = async () => {
        if (this.isLoading$.value) return;

        const currentDashboard = this.currentDashboard$.value;

        const response = await this.userDashboardApi.getOwnDashboards();
        if (response.status !== 200) {
            throw new Error("Failed to fetch user dashboards");
        }

        const usersSavedState = deserializeUserState(response.data.dashboards, response.data.widgets);
        const savedDashboard = values(usersSavedState.dashboards).find(
            (dashboard) => dashboard.guid === currentDashboard.guid
        );

        const dashboardsAreEqual =
            savedDashboard && _.isEqual(currentDashboard.state().value, savedDashboard.state().value);

        if (dashboardsAreEqual) {
            return;
        } else {
            this.saveCurrentDashboard();
        }
    };

    private setCurrentDashboard = async (newState: UserState, newCurrentGuid: string) => {
        const dashboards = values(newState.dashboards);

        const currentDashboard = this.currentDashboard$.value;
        if (dashboards.length <= 0) {
            this.currentDashboard$.next(EMPTY_DASHBOARD);
            return;
        }

        if (currentDashboard === null) {
            this.currentDashboard$.next(dashboards[0]);
            return;
        }

        if (currentDashboard.guid) {
            currentDashboard.setAsDefault(false);
            const currentDashboardUpdate = dashboardToUpdateRequest(currentDashboard);
            await this.dashboardApi.updateDashboard(currentDashboardUpdate);
        }

        const currentGuid = !isNil(newCurrentGuid) ? newCurrentGuid : currentDashboard.guid;
        let newCurrentDashboard = dashboards.find((dashboard) => dashboard.guid === currentGuid);
        newCurrentDashboard = newCurrentDashboard === undefined ? dashboards[0] : newCurrentDashboard;
        newCurrentDashboard.setAsDefault(true);

        const newCurrentDashboardUpdate = dashboardToUpdateRequest(newCurrentDashboard);
        this.dashboardApi.updateDashboard(newCurrentDashboardUpdate);

        this.currentDashboard$.next(newCurrentDashboard);
    };
}

export const dashboardStore = new DashboardStore();
