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

export const handleRegister = async ({password,phone, telegram_id} : {password: string, phone: string, telegram_id: number}) => {
    try {
        const response = await fetch(apiURL.register,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                password: password,
                telegram_id: telegram_id,
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.message || 'Login failed');
            } catch {
                throw new Error(`Server Error: ${errorText}`);
            }
        }
    }catch (error) {
        console.log(error);
        return Promise.reject(error);
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
                // "tma": initData,
                "tma": "#tgWebAppData=user%3D%257B%2522id%2522%253A606299917%252C%2522first_name%2522%253A%2522Abzal%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522ibrabza%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FPm-eMQY1b4e0lD0r_7hAJDHXhx-2dA5UaY1estneYKk.svg%2522%257D%26chat_instance%3D-2236416619848632369%26chat_type%3Dprivate%26auth_date%3D1741523541%26signature%3DwVbi70ykSEwGLK7A9WHmRedGvxuwAd1FI_1KgGjtH2sJJGY_g-SkVN3ol-xszYUQnZs8IUr8JkMMa_zJoElnDw%26hash%3Dee3e5748334b865ecc720d4a9f6f22628f2be08f8ca9c8d46ed02adf8ff04136&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22header_bg_color%22%3A%22%23efeff3%22%2C%22accent_text_color%22%3A%22%23008d94%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23008d94%22%2C%22section_separator_color%22%3A%22%23eaeaea%22%2C%22hint_color%22%3A%22%23999999%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22subtitle_text_color%22%3A%22%23999999%22%2C%22bottom_bar_bg_color%22%3A%22%23e4e4e4%22%2C%22bg_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%23008d94%22%2C%22section_header_text_color%22%3A%22%236d6d71%22%2C%22secondary_bg_color%22%3A%22%23efeff3%22%2C%22destructive_text_color%22%3A%22%23ff3b30%22%2C%22text_color%22%3A%22%23000000%22%7D",
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.message || 'Login failed');
            } catch {
                throw new Error(`Server Error: ${errorText}`);
            }
        }

        return await response.json();
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
