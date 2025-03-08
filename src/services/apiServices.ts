import {IAnswer} from "@/Features/Quiz/quizSlice.ts";
// https://dashboard.speaklish.uz/api/v1/auth/login/

export const apiURL = {
    login: "https://dashboard.speaklish.uz/api/v1/auth/login/",
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

export const handleLogin = async (initData: string,password: string, username? : string) => {
    try {
        console.log("Logging")
        const data = await fetch(apiURL.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
                "tma": initData,
            })
        }).then((response) => {
            return response.json();
        })
        console.log(data)
        localStorage.setItem("token", data.access);
        console.log(localStorage.getItem("token"));
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

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