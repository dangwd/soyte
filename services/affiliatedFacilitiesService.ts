import { api } from "../api";

export type AffiliatedFacility = {
  id: number | string;
  name: string;
  logo: string;
};

const normalizeFacilities = (response: any): AffiliatedFacility[] => {
  const rawItems = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

  return rawItems
    .map((item: any) => ({
      ...item,
      id: item.id,
      name: item.name || item.title || "",
      logo: item.logo || item.logo_url || item.image_url || "",
    }))
    .filter((item: AffiliatedFacility) => item.id && item.name);
};

export const affiliatedFacilitiesService = {
  getAll: async () => {
    const response = await api.get("/affiliated-facilities");
    return normalizeFacilities(response);
  },

  create: async (data: Pick<AffiliatedFacility, "name" | "logo">) => {
    const response = await api.post("/affiliated-facilities", data);
    return response.data;
  },

  update: async (
    id: number | string,
    data: Pick<AffiliatedFacility, "name" | "logo">,
  ) => {
    const response = await api.put(`/affiliated-facilities/${id}`, data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(`/affiliated-facilities/${id}`);
    return response.data;
  },
};
