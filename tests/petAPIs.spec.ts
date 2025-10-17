import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { z } from "zod";
import { getAPI, postAPI, putAPI, deleteAPI } from "../utils/apiCallHelper";


const addPetSchema = z.object({
  id: z.number().int().positive(),
  category: z.object({
    id: z.number().int().positive(),
    name: z.string().min(1),
  }),
  name: z.string().min(1),
  photoUrls: z.array(z.string().url().or(z.string().min(1))),
  tags: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z.string().min(1),
    })
  ),
  status: z.enum(["available", "pending", "sold"]),
}).strict();


const addPetBody = {
  id: faker.number.int({ min: 1, max: 10_000_000 }),
  category: {
    id: faker.number.int({ min: 1, max: 10_000_000 }),
    name: faker.commerce.department(),
  },
  name: faker.animal.dog(),
  photoUrls: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
    faker.image.urlPicsumPhotos()
  ),
  tags: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
    id: faker.number.int({ min: 1, max: 10_000_000 }),
    name: faker.word.noun(),
  })),
  status: faker.helpers.arrayElement(["available", "pending", "sold"]),
};

test.describe.serial("Pet API Tests (structure only)", () => {
  const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

  test("Add a new pet", async ({ request }) => {
    const res = await postAPI(request, `${BASE_URL}/pet`, addPetBody, 200, addPetSchema);
    addPetSchema.parse(await res.json()); 
  });

  test("Find pet by ID", async ({ request }) => {
    const res = await getAPI(request, `${BASE_URL}/pet/${addPetBody.id}`, 200, addPetSchema);
    addPetSchema.parse(await res.json());
  });

  test("Update pet details", async ({ request }) => {
    const updatedPetBody = {
      ...addPetBody,
      name: faker.animal.cat(),
      status: faker.helpers.arrayElement(["available", "pending", "sold"]),
    };

    const res = await putAPI(request, `${BASE_URL}/pet`, updatedPetBody, 200, addPetSchema);
    addPetSchema.parse(await res.json());
  });

  test("Delete pet by ID", async ({ request }) => {
    const deleteSchema = z.object({
      code: z.number(),
      type: z.string(),
      message: z.string(), 
    });

    const res = await deleteAPI(request, `${BASE_URL}/pet/${addPetBody.id}`, 200, deleteSchema);
    deleteSchema.parse(await res.json());
  });
});
