
export const encodeBasicAuth = (username:string, password:string) => {
    return window.btoa(`${username}:${password}`);
};