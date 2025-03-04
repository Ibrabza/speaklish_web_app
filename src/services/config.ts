
import { encodeBasicAuth } from "./auth";

export const API_CONFIG = {
    BASE_URL: 'https://api.speaklish.uz',
    BASIC_AUTH_TOKEN: encodeBasicAuth("ibrabza", "ismoilchoyopke"),
    TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
    PART1_QUESTIONS: '/part-1-questions/',
    PART2_QUESTIONS: '/part-2-questions/',
    PART3_QUESTIONS: '/part-3-questions/',
    GENERATE_AUDIO: '/questions/generate_audio/',
    SESSION_CREATE: (userId:string) =>  `/school/session-create/?user_id=${userId}&is_test=true`,
    SESSION_FEEDBACK: (userId:string,sessionId:string) =>  `/school/session-feedback/${sessionId}?student_id=${userId}`,
    Part_One_Result: () =>  `/school/part-1-create/`,
    WRITING_TASK1_CREATE: '/writing/task1-create/',
    WRITING_TASK2_CREATE: '/writing/task2-create/',
    WRITING_TASK1_GET: '/writing/task1-get/',
    WRITING_TASK2_GET: '/writing/task2-get/',
};