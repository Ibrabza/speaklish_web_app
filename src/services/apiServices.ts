

export const apiURL = {
    login: "https://dashboard.speaklish.uz/api/v1/login/",


}





export const handleLogin = async (initData: string,password: string, username? : string,  phoneNumber?:string) => {
    try {
        const data = await fetch(apiURL.login, {
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                phoneNumber: phoneNumber,
                tma : initData
            })
        }).then((response) => {
            return response.json();
        })
        console.log(data)

        return data;
    }
    catch (error) {
        console.log(error);
    }
}