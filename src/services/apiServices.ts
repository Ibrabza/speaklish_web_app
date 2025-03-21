import {IAnswer} from "@/Features/Quiz/quizSlice.ts";
// https://dashboard.speaklish.uz/api/v1/auth/login/

export const apiURL = {
    login: "https://dashboard.speaklish.uz/api/v1/auth/login/",
    register: "https://dashboard.speaklish.uz/api/v1/auth/register/",
    userProfile: "https://dashboard.speaklish.uz/api/v1/user-profile/",
    session: "https://api.speaklish.uz/",
    question_list:"https://dashboard.speaklish.uz/api/v1/courses/lessons/",
    lesson: "https://dashboard.speaklish.uz/api/v1/courses/lesson/",
    quizzes:(lesson_id:number) => `https://dashboard.speaklish.uz/api/v1/courses/lesson/${lesson_id}/quizzes`,
    question_submit:(lesson_id:number) => `https://dashboard.speaklish.uz/api/v1/courses/lesson/${lesson_id}/quizzes/submit`,
    quiz_result:(lesson_id:number) => `https://dashboard.speaklish.uz/api/v1/courses/lesson/${lesson_id}/quizzes/results/`,
    get_calendar: "https://dashboard.speaklish.uz/api/v1/courses/calendar/",
    news: `https://dashboard.speaklish.uz/api/v1/news/`,
    pronunciation_start: (lesson_id:number) => `https://dashboard.speaklish.uz/api/v1/courses/lesson/${lesson_id}/pronunciation/start/`,
    pronunciation_process: "https://dashboard.speaklish.uz/api/v1/pronunciation/process/",
    pronunciation_result: (uuid:string) => `https://dashboard.speaklish.uz/api/v1/pronunciation/results/${uuid}/`,
}

export const getQuizResult = async (lesson_id:number) => {
    try {
        const response = await fetch(`${apiURL.quiz_result(lesson_id)}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if(!response.ok) {
            console.log(response)
        }
        return await response.json()

    }catch (error) {
        console.log(error)
    }
}

export const getUserProfile = async () => {
    try {
        const response = await fetch(apiURL.userProfile,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if (!response.ok) {
            console.log(response)
        }
        return await response.json()
    }catch (error) {
        console.log(error)
    }
}

// Pronunciation API functions
export const startPronunciation = async (lesson_id: number) => {
    try {
        const response = await fetch(apiURL.pronunciation_start(lesson_id), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if (!response.ok) {
            console.log(response)
            throw new Error('Failed to start pronunciation test')
        }
        return await response.json()
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Process pronunciation with the new API endpoint
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
        
        console.log(`Sending request to: ${apiURL.pronunciation_process}`);
        
        const response = await fetch(apiURL.pronunciation_process, {
            method: 'POST',
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            let errorMessage = `Failed to process pronunciation recording: ${response.status} ${response.statusText}`;
            try {
                const errorText = await response.text();
                console.error('Pronunciation process error:', errorText);
                errorMessage += ` - ${errorText}`;
            } catch (e) {
                console.error('Could not read error response text', e);
            }
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log('Pronunciation process result:', result);
        return result;
    } catch (error) {
        console.error('Error in processPronunciation:', error);
        throw error;
    }
}

// Get pronunciation result by UUID
export const getPronunciationResult = async (uuid: string) => {
    try {
        console.log(`Checking pronunciation result for session ID: ${uuid}`)
        
        const response = await fetch(apiURL.pronunciation_result(uuid), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            }
        })
        
        if (!response.ok) {
            const errorText = await response.text()
            console.error('Pronunciation result error:', errorText)
            throw new Error(`Failed to get pronunciation result: ${response.status} ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('Pronunciation result status:', result.status)
        return result
    } catch (error) {
        console.error('Error in getPronunciationResult:', error)
        // Don't throw the error here to allow polling to continue
        return { status: 'Error', error_message: error instanceof Error ? error.message : String(error) }
    }
}


export const submitQuiz = async (answers: IAnswer[], lesson_id:number) => {
    try {
        console.log(answers)
        const dictionary = {
            answers : answers,
        }
        console.log(dictionary)
        const response = await fetch(`${apiURL.question_submit(lesson_id)}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({answers: answers}),
        })
        if(!response.ok) {
            console.log("Failed to post answers");
        }
        return await response.json();

    }catch (error) {
        console.log(error);
    }
}

export const getQuizzes = async (lessonID: number) => {
    try {
        const response = await fetch(`${apiURL.quizzes(lessonID)}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if(!response){
            console.log("Failed to get quizzes");
        }
        return await response.json();
    }catch (error) {
        console.log(error);
    }
}

export const handleRegister = async ({password, phone, telegram_id, tma} : {password: string, phone: string, telegram_id: number, tma?: string}) => {
    try {
        // Log the request payload for debugging
        const payload: Record<string, any> = {
            phone: phone,
            password: password,
            telegram_id: telegram_id
            // Note: name is not included in the API request as per the curl example
        };
        
        // Include tma (Telegram Mini App data) if provided
        if (tma) {
            payload.tma = tma;
            console.log('Including tma in registration payload');
        }
        
        console.log('Registration payload:', payload);
        
        const response = await fetch(apiURL.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // First, get the response text
        const responseText = await response.text();
        
        // Try to parse it as JSON
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch {
            // If it's not valid JSON, use the text as is
            responseData = { message: responseText };
        }
        
        // Check if the response was successful
        if (!response.ok) {
            // If we have a structured error message, use it
            if (responseData && responseData.message) {
                throw new Error(responseData.message);
            } else {
                throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
            }
        }
        
        // Return the parsed response data
        return responseData;
    } catch (error) {
        console.error('Registration error:', error);
        // Re-throw the error so it can be handled by the caller
        throw error;
    }
}

export const handleLogin = async (initData: string, password: string, username?: string) => {
    try {
        console.log(initData)
        const response = await fetch(apiURL.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "username": username,
                "password": password,
                "tma": initData,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Login API error response:', errorText);
            
            try {
                // Try to parse as JSON
                const errorJson = JSON.parse(errorText);
                
                // Check for specific error messages
                if (errorJson.detail && errorJson.detail.toLowerCase().includes('user not found')) {
                    throw new Error('User not found');
                } else if (errorJson.message) {
                    throw new Error(errorJson.message);
                } else if (errorJson.detail) {
                    throw new Error(errorJson.detail);
                } else {
                    throw new Error(JSON.stringify(errorJson));
                }
            } catch (parseError) {
                // If parsing fails, use the raw text
                console.log('Error parsing JSON response:', parseError);
                
                // Check for common error messages in the raw text
                if (errorText.toLowerCase().includes('not found')) {
                    throw new Error('User not found, please register');
                } else {
                    throw new Error(`Something went wrong, please try later: ${errorText}`);
                }
            }
        }
        const data = await response.json();
        localStorage.setItem("token", data.access);
        console.log(localStorage.getItem("token"));
        return data;
    } catch (error) {
        console.error('handleLogin error:', error);
        throw error;
    }
};


export const getLessons = async () => {
    try {
        const data = await fetch(apiURL.question_list, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }

        }).then(
            (response) => {
                return response.json();
            }
        )
        // console.log(data)
        return await data;
    }catch (error) {
        console.log(error);
    }
}

export const getLesson = async (lesson_id:number) => {
    try {
        return await fetch(`${apiURL.lesson}${lesson_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => response.json());
    }
    catch (error) {
        console.log(error);
    }
}




// export const handleLogin = async (initData: string,password: string, username? : string) => {
//     try {
//         console.log("Logging", initData)
//         const data = await fetch(apiURL.login, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 "username": username,
//                 "password": password,
//                 // "tma": initData,
//                 "tma": "#tgWebAppData=user%3D%257B%2522id%2522%253A606299917%252C%2522first_name%2522%253A%2522Abzal%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522ibrabza%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FPm-eMQY1b4e0lD0r_7hAJDHXhx-2dA5UaY1estneYKk.svg%2522%257D%26chat_instance%3D-2236416619848632369%26chat_type%3Dprivate%26auth_date%3D1741523541%26signature%3DwVbi70ykSEwGLK7A9WHmRedGvxuwAd1FI_1KgGjtH2sJJGY_g-SkVN3ol-xszYUQnZs8IUr8JkMMa_zJoElnDw%26hash%3Dee3e5748334b865ecc720d4a9f6f22628f2be08f8ca9c8d46ed02adf8ff04136&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22header_bg_color%22%3A%22%23efeff3%22%2C%22accent_text_color%22%3A%22%23008d94%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23008d94%22%2C%22section_separator_color%22%3A%22%23eaeaea%22%2C%22hint_color%22%3A%22%23999999%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22subtitle_text_color%22%3A%22%23999999%22%2C%22bottom_bar_bg_color%22%3A%22%23e4e4e4%22%2C%22bg_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%23008d94%22%2C%22section_header_text_color%22%3A%22%236d6d71%22%2C%22secondary_bg_color%22%3A%22%23efeff3%22%2C%22destructive_text_color%22%3A%22%23ff3b30%22%2C%22text_color%22%3A%22%23000000%22%7D",
//             })
//         }).then((response) => {
//             return response.json();
//         })
//         console.log(data)
//         localStorage.setItem("token", data.access);
//         console.log(localStorage.getItem("token"));
//         return data;
//     }
//     catch (error) {
//         console.log(error);
//         return error;
//     }
// }


/******************** CALENDAR **********************/

export const handleGetDataCalendar = async () => {
    try {
        const response = await fetch(apiURL.get_calendar,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if(!response.ok) {
            throw new Error(`Server Error: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        return data;
    }catch (error) {
        console.log(error);
        return error;
    }
}

/***************************************************/

/******************** news brotha **********************/

export const getNews = async () => {
    try {
        const response = await fetch(apiURL.news, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if (!response.ok) {
            console.log(response.statusText)
        }
        return await response.json();
    }catch (error) {
        console.log(error);
        return error;
    }
}
