

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

export const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone) return false;

    // First clean the phone number
    const cleaned = phone.replace(/\s+/g, '');

    // Check for Uzbekistan phone numbers
    // Accepts formats like: +998901234567, 998901234567, 901234567
    const uzPhoneRegex = /^(\+?998|0)?[1-9]\d{8}$/;
    if (uzPhoneRegex.test(cleaned)) {
        return true;
    }

    // For other international numbers, just make sure it starts with + and has at least 10 digits
    const internationalRegex = /^\+[1-9]\d{9,14}$/;
    return internationalRegex.test(cleaned);
};

export const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';

    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // If it's already in international format, return as is
    if (cleaned.startsWith('+')) {
        return cleaned;
    }

    // For Uzbekistan numbers
    if (cleaned.startsWith('998') && cleaned.length >= 12) {
        return '+' + cleaned;
    } else if (cleaned.length === 9) { // Just the number without country code
        return '+998' + cleaned;
    }

    // If we can't determine the format, add + if missing
    return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
};


export const formatDateString = (timestamp: string) => {
    if(timestamp) {
        const datePart = timestamp.slice(0, 10);
        const [year, month, day] = datePart.split("-");
        return `${day}-${month}-${year}`;
    }
}



