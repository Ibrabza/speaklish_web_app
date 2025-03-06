
import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';
import toast from "react-hot-toast";

export const QuestionService = {

    async createSession(id:string) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SESSION_CREATE(id));
            return response.data;
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        }
    },

    async getSessionFeedback(userId:string,sessionId:string) {
        try {
            const response = await apiClient.get(`${API_ENDPOINTS.SESSION_FEEDBACK(userId,sessionId)}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get session feedback:', error);
            throw error;
        }
    },

    async createPartOneResult({ question_id, session_id, voice_audio }:{ question_id:string, session_id:string, voice_audio: Blob }) {
        const formData = new FormData();
        formData.append('question_id', question_id);
        formData.append('session_id', session_id);
        formData.append('voice_audio', voice_audio, 'audio.ogg');
        try {
            const response = await apiClient.post('/school/part-1-create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create part 1 result:', error);
            throw error;
        }
    },

    async createPartTwoResult({ question_id, session_id, voice_audio } : { question_id:string, session_id:string, voice_audio: Blob }) {
        const formData = new FormData();
        formData.append('question_id', question_id);
        formData.append('session_id', session_id);
        formData.append('voice_audio', voice_audio, 'audio.ogg');

        try {
            const response = await apiClient.post('/school/part-2-create/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create part 2 result:', error);
            throw error;
        }
    },

    async createPartThreeResult({ question_id, session_id, voice_audio } : { question_id:string, session_id:string, voice_audio: Blob }) {
        const formData = new FormData();
        formData.append('question_id', question_id);
        formData.append('session_id', session_id);
        formData.append('voice_audio', voice_audio, 'audio.ogg');

        try {
            const response = await apiClient.post('/school/part-3-create/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create part 3 result:', error);
            throw error;
        }
    },
};

export const fetchExamResult = async (user_id:string,session_id:string) => {
    try {
        const result = await QuestionService.getSessionFeedback(user_id,session_id);
        console.log(result);

        console.log(result.results);
    } catch (err) {
        toast.error(`Failed to fetch exam result: ${err}`);
    }
};