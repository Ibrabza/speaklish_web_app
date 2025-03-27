

export const makeBlob = async (url:string) => {
    const response = await fetch(url);
    return await response.blob();
}

export function getTelegramUserData(tma:string) {
    // Extract the `tgWebAppData` part
    const params = new URLSearchParams(tma);
    const tgWebAppData = params.get("tgWebAppData");

    if (!tgWebAppData) return null;

    // Decode URL encoding
    const decodedData = decodeURIComponent(tgWebAppData);

    // Extract user data
    const userDataMatch = decodedData.match(/user%3D(.*?)%26/);
    if (!userDataMatch) return null;

    // Decode JSON encoding
    const userJson = decodeURIComponent(userDataMatch[1]);
    const user = JSON.parse(userJson);

    return {
        firstName: user.first_name as string,
        // lastName: user.last_name || "",
        photoUrl: user.photo_url as string
    };
}