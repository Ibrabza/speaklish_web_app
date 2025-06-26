
export const apiSpeaking = {
    session_create: "https://dashboard.speaklish.uz/api/v1/speaking-session/create",
    part1: `https://dashboard.speaklish.uz/api/v1/speaking-session/part1`,
    part2: `https://dashboard.speaklish.uz/api/v1/speaking-session/part2`,
    part3: `https://dashboard.speaklish.uz/api/v1/speaking-session/part3`,
    result: `https://dashboard.speaklish.uz/api/v1/speaking-session/results`,
}

export const speakingService = {
    async createSession(){
        try {
            const response = await fetch(`${apiSpeaking.session_create}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                }
            })
            if(!response.ok) {
                console.log(response)
            }
            return await response.json()
        }catch (error) {
            console.log(error)
            return error;
        }
    },

    async question_submit({part,question_id, session_id, audio} : {part:number, question_id:number, session_id:number, audio: Blob}){
        const formData = new FormData();
        formData.append('question_id', question_id.toString());
        formData.append('session_id', session_id.toString());
        formData.append('voice_audio', audio, 'audio.ogg');
        const partKey = `part${part}` as keyof typeof apiSpeaking

        try {
            const response = await fetch(`${apiSpeaking[partKey]}`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            })
            if(!response.ok) {
                console.log(response)
            }
            return await response.json();
        }catch (error) {
            console.error('Failed to create part 1 result:', error);
            return error;
        }
    },

    async getResult(id:number){
        try {
            const response = await fetch(`${apiSpeaking.result}?id=${id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                }
            })
            if(!response.ok) {
                console.log(response)
            }
            return await response.json()
        }catch (error) {
            console.log(error)
            return error;
        }
    }
}