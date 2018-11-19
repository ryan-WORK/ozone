import "reflect-metadata";

import { StackAPI } from "./stack-api";

import { NodeGateway } from "../__test__/node-gateway";
import { STACKS } from "../__test__/data";


describe("Stack API", () => {

    let gateway: NodeGateway;
    let stackApi: StackAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        stackApi = new StackAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getStacks - GET /stack/", async () => {
        const response = await stackApi.getStacks();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "results": 3,
            "data": STACKS
        });
    });

    test("getStackById - GET /stack/:id/", async () => {
        const response = await stackApi.getStackById(1);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "results": 1,
            "data": [STACKS[0]]
        });
    });

});

