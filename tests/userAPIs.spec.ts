import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { getAPI, postAPI } from '../utils/apiCallHelper');

test.describe('User API Tests', () => {
  const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    const createUserRequestBody = {
        "id": faker.number.int({ min: 1, max: 100_000 }),
        "username": "TestUserName-test-automation-delete-me",
        "firstName": faker.person.firstName(),
        "lastName": faker.person.lastName(),
        "email": faker.internet.email(),
        "password": faker.internet.password(),
        "phone": faker.phone.number(),
        "userStatus": faker.number.int({ min: 0, max: 10 })
    }

    test('Create a new user', async ({ request }) => {
        const createUserResponse = await request.post(`${BASE_URL}/user`, {
            data: createUserRequestBody,
        });

        expect(createUserResponse.status()).toBe(200);

        const expectedCreateUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createUserRequestBody.id.toString()),
        })

        const actualResponseBody = await createUserResponse.json();
        expectedCreateUserResponseSchema.parse(actualResponseBody); // Validate response structure
    })

    test('Get user details', async ({ request }) => {

        const username = createUserRequestBody.username;

        let getUserResponse;
        for (let i = 0; i < 5; i++) {
            getUserResponse = await request.get(`${BASE_URL}/user/${username}`);
            if (getUserResponse.status() === 200) {
                break; // Exit loop if the request is successful
            }
            console.log(`Attempt ${i + 1} failed. Retrying...`);
        }
        expect(getUserResponse!.status()).toBe(200);
        const expectedGetUserResponseSchema = z.object({
            id: z.number(),
            username: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            password: z.string(),
            phone: z.string(),
            userStatus: z.number(),
        });

        const actualGetUserResponseBody = await getUserResponse!.json();
        expectedGetUserResponseSchema.parse(actualGetUserResponseBody); // Validate response structure
    })

    test('Delete user by username', async ({ request }) => {
        const username = createUserRequestBody.username;

        const deleteUserResponse = await request.delete(`${BASE_URL}/user/${username}`);
        expect(deleteUserResponse.status()).toBe(200);

        const expectedDeleteUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(username),
        });
        const actualDeleteUserResponseBody = await deleteUserResponse.json();
        expectedDeleteUserResponseSchema.parse(actualDeleteUserResponseBody); // Validate response structure
    })


    
})
