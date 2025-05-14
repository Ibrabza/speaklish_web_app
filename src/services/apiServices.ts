import axios, { AxiosError, AxiosResponse } from 'axios';
import { IAnswer } from "@/Features/Quiz/quizSlice.ts";
import { saveAuthTokens } from "@/services/authService";

// Base URLs
const BASE_URL = 'https://dashboard.speaklish.uz/api/v1';


// API endpoints
const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login/`,
    register: `${BASE_URL}/auth/register/`,
  },
  user: {
    profile: `${BASE_URL}/user-profile/`,
    history: `${BASE_URL}/speaking-session/results?last=10`
  },
  courses: {
    lessons: `${BASE_URL}/courses/user-lessons/`,
    lesson: (id: number) => `${BASE_URL}/courses/lesson/${id}`,
    quizzes: (lessonId: number) => `${BASE_URL}/courses/lesson/${lessonId}/quizzes`,
    quizSubmit: (lessonId: number) => `${BASE_URL}/courses/lesson/${lessonId}/quizzes/submit`,
    quizResults: (lessonId: number) => `${BASE_URL}/courses/lesson/${lessonId}/quizzes/results/`,
    calendar: `${BASE_URL}/courses/calendar/`,
    pronunciationStart: (lessonId: number) => `${BASE_URL}/courses/lesson/${lessonId}/pronunciation/start/`,
  },
  pronunciation: {
    process: `${BASE_URL}/pronunciation/process/`,
    results: (uuid: string) => `${BASE_URL}/pronunciation/results/${uuid}/`,
  },
  news: `${BASE_URL}/news/`
};

// Create axios instances
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // const originalRequest = error.config;

    // Handle specific error cases here if needed
    // For example, token refresh logic could go here

    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleResponse = async <T>(
  promise: Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);

      // Extract error message from response if available
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'An unknown error occurred';

      throw new Error(errorMessage);
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};

// API functions
export const getUserProfile = () => {
  return handleResponse(api.get(endpoints.user.profile));
};

export const getHistory = () => {
  return handleResponse(api.get(endpoints.user.history))
}

export const getQuizResult = (lessonId: number) => {
  return handleResponse(api.get(endpoints.courses.quizResults(lessonId)));
};

export const startPronunciation = (lessonId: number) => {
  return handleResponse(api.get(endpoints.courses.pronunciationStart(lessonId)));
};

export const processPronunciation = async (audioBlob: Blob, topic: string) => {
  try {
    // Log the input parameters
    console.log('processPronunciation called with:', {
      blobSize: audioBlob.size,
      blobType: audioBlob.type,
      topic
    });

    // Create form data with the required fields
    const formData = new FormData();

    // Determine file extension based on blob type
    let fileExtension = 'webm'; // Default extension
    if (audioBlob.type) {
      if (audioBlob.type.includes('mp4')) fileExtension = 'mp4';
      else if (audioBlob.type.includes('webm')) fileExtension = 'webm';
      else if (audioBlob.type.includes('ogg')) fileExtension = 'ogg';
      else if (audioBlob.type.includes('mp3')) fileExtension = 'mp3';
      else if (audioBlob.type.includes('wav')) fileExtension = 'wav';
    }

    console.log(`Using file extension: ${fileExtension} for blob type: ${audioBlob.type}`);

    // Append the audio file with appropriate filename
    const filename = `recording.${fileExtension}`;
    formData.append('voice_file', audioBlob, filename);
    formData.append('topic', topic);

    // Log FormData contents (for debugging)
    console.log('FormData created with:');
    for (const pair of formData.entries()) {
      if (pair[0] === 'voice_file') {
        console.log('voice_file:', {
          filename: (pair[1] as File).name,
          size: (pair[1] as File).size,
          type: (pair[1] as File).type
        });
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const response = await api.post(endpoints.pronunciation.process, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error in processPronunciation:', error);
    throw error;
  }
};

export const getPronunciationResult = async (uuid: string) => {
  try {
    console.log(`Checking pronunciation result for session ID: ${uuid}`);
    return await handleResponse(api.get(endpoints.pronunciation.results(uuid)));
  } catch (error) {
    console.error('Error in getPronunciationResult:', error);
    // Don't throw the error here to allow polling to continue
    return {
      status: 'Error',
      error_message: error instanceof Error ? error.message : String(error)
    };
  }
};

export const submitQuiz = (answers: IAnswer[], lessonId: number) => {
  console.log('Submitting answers:', answers);
  return handleResponse(
    api.post(`${endpoints.courses.quizSubmit(lessonId)}/`, { answers })
  );
};

export const getQuizzes = (lessonId: number) => {
  return handleResponse(api.get(`${endpoints.courses.quizzes(lessonId)}/`));
};

export const handleRegister = async ({
  password,
  phone,
  telegram_id,
  tma
}: {
  password: string;
  phone: string;
  telegram_id: number;
  tma?: string;
}) => {
  try {
    // Prepare payload
    const payload: Record<string, any> = {
      phone,
      password,
      telegram_id
    };

    // Include tma (Telegram Mini App data) if provided
    if (tma) {
      payload.tma = tma;
      console.log('Including tma in registration payload');
    }

    console.log('Registration payload:', payload);

    // Make request without auth token
    const response = await axios.post(endpoints.auth.register, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Registration failed';

      throw new Error(errorMessage);
    }

    throw error;
  }
};

export const handleLogin = async (initData: string, password: string, username?: string) => {
  try {
    console.log("Logging in with initData:", initData ? "present" : "not provided");

    const payload = {
      username,
      password,
      tma: initData
    };

    // Make request without auth token
    const response = await axios.post(endpoints.auth.login, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const data = response.data;

    // Store tokens using the auth service
    if (data.access) {
      saveAuthTokens(data.access, data.refresh || null);
      console.log("Authentication tokens saved after login");
    } else {
      console.error("Login response did not contain access token");
    }


    return {...data, initData};
  } catch (error) {
    console.error('handleLogin error:', error);

    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data;

      if (typeof errorResponse === 'object') {
        if (errorResponse.detail && errorResponse.detail.toLowerCase().includes('user not found')) {
          throw new Error('User not found');
        } else if (errorResponse.message) {
          throw new Error(errorResponse.message);
        } else if (errorResponse.detail) {
          throw new Error(errorResponse.detail);
        }
      } else if (typeof errorResponse === 'string') {
        if (errorResponse.toLowerCase().includes('not found')) {
          throw new Error('User not found, please register');
        }
      }

      throw new Error(`Login failed: ${error.message}`);
    }

    throw error;
  }
};

export const getLessons = () => {
  return handleResponse(api.get(endpoints.courses.lessons));
};

export const getLesson = (lessonId: number) => {
  return handleResponse(api.get(endpoints.courses.lesson(lessonId)));
};

export const handleGetDataCalendar = () => {
  return handleResponse(api.get(endpoints.courses.calendar));
};

export const getNews = () => {
  return handleResponse(api.get(endpoints.news));
};

// Re-export the apiURL for backward compatibility
export const apiURL = endpoints;
