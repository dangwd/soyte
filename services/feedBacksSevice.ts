import { api } from "../api";

export const feedBacksSevice = {
    async fetchFeedBacks(page: number = 1, limit: number = 10, type?: string) {
        return api.get('/feedbacks', { page, limit, type });
    },

    async fetchFeedBackById(id: string) {
        return api.get(`/feedbacks/${id}`);
    },

    async fetchStats(payload: { startDate: string, endDate: string, type?: string }) {
        return api.get('/feedbacks/stats', payload);
    },

    async fetchFeedBacksByType(type: string) {
        return api.get(`/feedbacks?type=${type}`);
    },
};