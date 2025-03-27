

export const makeBlob = async (url:string) => {
    const response = await fetch(url);
    return await response.blob();
}

export function getTelegramUserData(tma: string) {
    const tgWebAppDataMatch = tma.match(/#tgWebAppData=([^&]*)/);

    if (!tgWebAppDataMatch) return null;

    const decodedData = decodeURIComponent(tgWebAppDataMatch[1]);
    const userDataMatch = decodedData.match(/user=([^&]*)/);

    if (!userDataMatch) return null;

    const userJson = decodeURIComponent(userDataMatch[1]);
    const user = JSON.parse(userJson);

    return {
        firstName: user.first_name as string,
        photoUrl: user.photo_url as string,
    };
}