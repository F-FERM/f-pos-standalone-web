
import { AddFoodPayload } from "@/src/interfaces/food/AddFoodPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const UpdateFood = async (
  id: string,
  Payload: AddFoodPayload,
  imageFile?: File
) => {
  try {
    const formData = new FormData();
    Object.entries(Payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (imageFile) {
      formData.append("foodImage", imageFile);
    }

    const response = await axiosInstance.patch(`food/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

