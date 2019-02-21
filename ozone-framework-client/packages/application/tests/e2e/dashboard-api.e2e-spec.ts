import "reflect-metadata";

import { DashboardAPI } from "../../src/api";

import { NodeGateway } from "./node-gateway";
import { DashboardUpdateRequest } from "../../src/api/models/dashboard-dto";

describe("Dashboard API", () => {
    let gateway: NodeGateway;
    let dashboardApi: DashboardAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        dashboardApi = new DashboardAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    const createRequest: DashboardUpdateRequest = {
        guid: "12345678-1234-1234-1234-1234567890a0",
        name: "Dashboard 1"
    };

    test("getDashboards - GET /dashboard/ - no results", async () => {
        const response = await dashboardApi.getDashboards();

        expect(response.data).toEqual({
            success: true,
            results: 0,
            data: []
        });
    });

    test("createDashboard - POST /dashboard/", async () => {
        const createResponse = await dashboardApi.createDashboard(createRequest);

        expect(createResponse.status).toEqual(200);
        expect(createResponse.data).toEqual({
            success: true,
            data: [
                {
                    EDashboardLayoutList: "[accordion, desktop, portal, tabbed]",
                    alteredByAdmin: "false",
                    createdBy: {
                        userId: null,
                        userRealName: null
                    },
                    createdDate: expect.any(String),
                    dashboardPosition: 0,
                    description: null,
                    editedDate: expect.any(String),
                    groups: [],
                    guid: createRequest.guid,
                    iconImageUrl: null,
                    isGroupDashboard: false,
                    isdefault: false,
                    layoutConfig: "{}",
                    locked: false,
                    markedForDeletion: false,
                    name: createRequest.name,
                    prettyCreatedDate: expect.any(String),
                    prettyEditedDate: expect.any(String),
                    publishedToStore: false,
                    stack: null,
                    type: null,
                    user: {
                        userId: "testAdmin1"
                    }
                }
            ]
        });
    });

    test("getDashboards - GET /dashboard/ - one result after created", async () => {
        const response = await dashboardApi.getDashboards();

        expect(response.data).toEqual({
            success: true,
            results: 1,
            data: [
                {
                    EDashboardLayoutList: "[accordion, desktop, portal, tabbed]",
                    alteredByAdmin: "false",
                    createdBy: {
                        userId: null,
                        userRealName: null
                    },
                    createdDate: expect.any(String),
                    dashboardPosition: 0,
                    description: null,
                    editedDate: expect.any(String),
                    groups: [],
                    guid: createRequest.guid,
                    iconImageUrl: null,
                    isGroupDashboard: false,
                    isdefault: false,
                    layoutConfig: "{}",
                    locked: false,
                    markedForDeletion: false,
                    name: createRequest.name,
                    prettyCreatedDate: expect.any(String),
                    prettyEditedDate: expect.any(String),
                    publishedToStore: false,
                    stack: null,
                    type: null,
                    user: {
                        userId: "testAdmin1"
                    }
                }
            ]
        });
    });

    test("updateDashboard - PUT /dashboard/:guid/", async () => {
        const updateRequest = { ...createRequest, description: "Test Description" };

        const response = await dashboardApi.updateDashboard(updateRequest);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [
                {
                    EDashboardLayoutList: "[accordion, desktop, portal, tabbed]",
                    alteredByAdmin: "false",
                    createdBy: {
                        userId: null,
                        userRealName: null
                    },
                    createdDate: expect.any(String),
                    dashboardPosition: 0,
                    description: updateRequest.description,
                    editedDate: expect.any(String),
                    groups: [],
                    guid: updateRequest.guid,
                    iconImageUrl: null,
                    isGroupDashboard: false,
                    isdefault: true, // TODO: Why is this changed?
                    layoutConfig: "{}",
                    locked: false,
                    markedForDeletion: false,
                    name: updateRequest.name,
                    prettyCreatedDate: expect.any(String),
                    prettyEditedDate: expect.any(String),
                    publishedToStore: false,
                    stack: null,
                    type: null,
                    user: {
                        userId: "testAdmin1"
                    }
                }
            ]
        });
    });

    test("deleteDashboard - DELETE /dashboard/:guid/", async () => {
        const response = await dashboardApi.deleteDashboard(createRequest.guid);

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({ guid: createRequest.guid });
    });

    test("getDashboards - GET /dashboard/ - no results after deleted", async () => {
        const response = await dashboardApi.getDashboards();

        expect(response.data).toEqual({
            success: true,
            results: 0,
            data: []
        });
    });
});
