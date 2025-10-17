import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { z } from "zod";
import { getAPI, postAPI, putAPI, deleteAPI } from "../utils/apiCallHelper";


const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(3).max(50),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  phone: z.string().min(5).max(20),
  userStatus: z.number().int(),
}).strict();

const apiMessageSchema = z.object({
  code: z.number(),
  type: z.string(),
  message: z.string(),
}).strict();

let userBody: any;

test.beforeEach(async ({ request }) => {
  userBody = {
    id: faker.number.int({ min: 1, max: 10_000_000 }),
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12, prefix: "Password" }),
    phone: faker.phone.number(),
    userStatus: faker.number.int({ min: 1, max: 10 }),
  };

 

  const response = await postAPI(
    request,
    `${BASE_URL}/user`,
    userBody,
    200,
    apiMessageSchema
  );
 
});

test("Logs user into system", async ({ request }) => {
  const response = await getAPI(
    request,
    `${BASE_URL}/user/login?username=${userBody.username}&password=${userBody.password}`,
    200,
    apiMessageSchema
  );
  
});

test("Logs out current logged in user", async ({ request }) => {
  const response = await getAPI(
    request,
    `${BASE_URL}/user/logout`,
    200,
    apiMessageSchema
  );
  
});

test.afterEach(async ({ request }) => {
  const response = await deleteAPI(
    request,
    `${BASE_URL}/user/${userBody.username}`,
    200,
    apiMessageSchema
  );
  
});