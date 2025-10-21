import { APIRequestContext, APIResponse } from "@playwright/test";
import { ZodTypeAny } from "zod";
import { faker } from "@faker-js/faker";

/**
 * Explanation: Reusable GET method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param expectedStatusCode  -> expected status code of the API response
 * @param expectedSchema  -> expected schema of the API response
 * @param parameters  -> query parameters (Optional, default is empty object)
 * @param headers  -> headers (Optional, default is empty object)
 * @param retryCount  -> number of times to retry the API call in case of failure (Optional, default is 5)
 * @returns  -> the API response
 */
export async function getAPI(
  request: APIRequestContext,
  url: string,
  expectedStatusCode: number,
  expectedSchema: ZodTypeAny,
  parameters: Record<string, any> = {}, // query parameters (optional, default is empty object)
  headers: Record<string, any> = {}, // headers (optional, default is empty object)
  retryCount: number = 5 // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {
  // retry logic because API is not working properly, it will retry 5 times before failing the test
  for (let i = 0; i < retryCount; i++) {
    // make the API call
    const response = await request.get(url, {
      params: parameters,
      headers: headers,
    });

    // validate status code and schema if status code is expected, otherwise retry
    if (response.status() === expectedStatusCode) {
      const responseBodyJson = await response.json();
      expectedSchema.parse(responseBodyJson);
      return response;
    }
    console.log(`Attempt ${i + 1} failed. Retrying for ${url}...`);
  }

  // if all retries was unsuccessful, throw an error
  throw new Error("Max retries reached. API call failed.");
}

/**
 * Explanation: Reusable POST method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param requestBody -> the request body to be sent in the API call
 * @param expectedStatusCode -> expected status code of the API response
 * @param expectedSchema -> expected schema of the API response
 * @param retryCount -> number of times to retry the API call in case of failure (Optional, default is 5)
 * @returns -> the API response
 */
export async function postAPI(
  request: APIRequestContext,
  url: string,
  requestBody: any,
  expectedStatusCode: number,
  expectedSchema: ZodTypeAny,
  retryCount: number = 5 // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {
  // retry logic because API is not working properly, it will retry 5 times before failing the test
  for (let i = 0; i < retryCount; i++) {
    // make the API call
    const response = await request.post(url, { data: requestBody });

    // validate status code and schema if status code is expected, otherwise retry
    if (response.status() === expectedStatusCode) {
      const responseBodyJson = await response.json();
      expectedSchema.parse(responseBodyJson);
      return response;
    }
    console.log(`Attempt ${i + 1} failed. Retrying for ${url}...`);
  }

  // if all retries was unsuccessful, throw an error
  throw new Error("Max retries reached. API call failed.");
}

/**
 * Explanation: Reusable PUT method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param requestBody -> the request body to be sent in the API call
 * @param expectedStatusCode -> expected status code of the API response
 * @param expectedSchema -> expected schema of the API response
 * @param retryCount -> number of times to retry the API call in case of failure (Optional, default is 5)
 * @returns -> the API response
 */
export async function putAPI(
  request: APIRequestContext,
  url: string,
  requestBody: any,
  expectedStatusCode: number,
  expectedSchema: ZodTypeAny,
  retryCount: number = 5 // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {
  // retry logic because API is not working properly, it will retry 5 times before failing the test
  for (let i = 0; i < retryCount; i++) {
    // make the API call
    const response = await request.put(url, { data: requestBody });

    // validate status code and schema if status code is expected, otherwise retry
    if (response.status() === expectedStatusCode) {
      const responseBodyJson = await response.json();
      expectedSchema.parse(responseBodyJson);
      return response;
    }
    console.log(`Attempt ${i + 1} failed. Retrying for ${url}...`);
  }

  // if all retries was unsuccessful, throw an error
  throw new Error("Max retries reached. API call failed.");
}

/**
 * Explanation: Reusable DELETE method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param expectedStatusCode -> expected status code of the API response
 * @param expectedSchema -> expected schema of the API response
 * @param retryCount -> number of times to retry the API call in case of failure (Optional, default is 5)
 * @returns -> the API response
 */
export async function deleteAPI(
  request: APIRequestContext,
  url: string,
  expectedStatusCode: number,
  expectedSchema: ZodTypeAny,
  retryCount: number = 5 // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {
  // retry logic because API is not working properly, it will retry 5 times before failing the test
  for (let i = 0; i < retryCount; i++) {
    // make the API call
    const response = await request.delete(url);

    // validate status code and schema if status code is expected, otherwise retry
    if (response.status() === expectedStatusCode) {
      const responseBodyJson = await response.json();
      expectedSchema.parse(responseBodyJson);
      return response;
    }
    console.log(`Attempt ${i + 1} failed. Retrying for ${url}...`);
  }

  // if all retries was unsuccessful, throw an error
  throw new Error("Max retries reached. API call failed.");
}

export function createRandomUsersRequestBody(amountOfUsers: number) {
  const usersArray = [];
  for (let i = 0; i < amountOfUsers; i++) {
    const userRequestBody = {
      id: faker.number.int({ min: 1, max: 100_000 }),
      username: `TestUserName-test-automation-delete-me-${faker.string.uuid()}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      userStatus: faker.number.int({ min: 0, max: 10 }),
    };
    usersArray.push(userRequestBody);
  }
  return usersArray;
}