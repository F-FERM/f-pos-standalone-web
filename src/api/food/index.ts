import axiosInstance from "@/src/service/axios";

export interface FoodRelation {
  _id: string;
  name?: string;
  type?: string;
}

export interface FoodRecord {
  _id: string;
  name: string;
  foodImage?: string;
  foodType: "VEG" | "NON_VEG";
  menuTypeId: FoodRelation;
  categoryId: FoodRelation;
  kitchenId: FoodRelation;
  isPortionEnabled: boolean;
  portions: { _id: string; name: string; basePrice: number }[];
  basePrice: number;
  customerTypes: {
    customerTypeId: FoodRelation;
    onlinePlatform?: string | null;
    price: number;
  }[];
  isOfferEnabled: boolean;
  offer?: {
    startDate: string;
    endDate: string;
    discount: number;
  } | null;
  choices: string[];
  preparationTime: number;
 createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
}
interface CreatedBy {
  _id: string;
  username: string;
}
// Kept for callers/types that still want a plain-object shape (e.g. building
// up form state) even though createFood/updateFood now take FormData.
export interface FoodPayload {
  name: string;
  foodImage?: string;
  foodType: "VEG" | "NON_VEG";
  menuTypeId: string;
  categoryId: string;
  kitchenId: string;
  isPortionEnabled: boolean;
  portions?: { name: string; basePrice: number }[];
  basePrice: number;
  customerTypes?: {
    customerTypeId: string;
    price: number;
  }[];
  isOfferEnabled: boolean;
  offer?: { startDate: string; endDate: string; discount: number };
  choices?: string[];
  preparationTime: number;
}

interface FoodResponse {
  success: boolean;
  data: FoodRecord;
  statusCode: number;
}

interface FoodListResponse {
  success: boolean;
  data: FoodRecord[];
  statusCode: number;
}

export const listFoods = async () => {
  const response = await axiosInstance.get<FoodListResponse>("food");
  return response.data;
};

// Builds the multipart FormData sent to the API. `imageFile` is the actual
// binary (File/Blob) picked in AddFoodModal — everything else is
// JSON.stringify'd into its own field since multipart fields are all
// strings/blobs, there's no nested-object support like a JSON body has.
export function buildFoodFormData(
  payload: FoodPayload,
  imageFile?: File | Blob,
): FormData {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("foodType", payload.foodType);
  formData.append("menuTypeId", payload.menuTypeId);
  formData.append("categoryId", payload.categoryId);
  formData.append("kitchenId", payload.kitchenId);
  formData.append("isPortionEnabled", String(payload.isPortionEnabled));
  formData.append("basePrice", String(payload.basePrice));
  formData.append("isOfferEnabled", String(payload.isOfferEnabled));
  formData.append("preparationTime", String(payload.preparationTime));

  formData.append("portions", JSON.stringify(payload.portions ?? []));
  formData.append(
    "customerTypes",
    JSON.stringify(payload.customerTypes ?? []),
  );
  formData.append("choices", JSON.stringify(payload.choices ?? []));

  if (payload.offer) {
    formData.append("offer", JSON.stringify(payload.offer));
  }

  // Binary part — only attached when the user actually picked a new image.
  // On edit, omitting this field means "keep the existing foodImage".
  if (imageFile) {
    formData.append("foodImage", imageFile);
  }

  return formData;
}

export const createFood = async (payload: FoodPayload, imageFile?: File) => {
  const formData = buildFoodFormData(payload, imageFile);

  const response = await axiosInstance.post<FoodResponse>("food", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateFood = async (
  id: string,
  payload: FoodPayload,
  imageFile?: File,
) => {
  const formData = buildFoodFormData(payload, imageFile);

  const response = await axiosInstance.patch<FoodResponse>(
    `food/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const deleteFood = async (id: string) => {
  const response = await axiosInstance.delete<FoodResponse>(`food/${id}`);
  return response.data;
};