import styles from "./Register.module.css";
import { FC, FormEvent, useState, useEffect } from "react";
import toast, {Toaster} from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {handleAuth, handleReg} from "@/Features/User/userSlice.ts";
import {useNavigate} from "react-router-dom";
import { requestContact } from '@telegram-apps/sdk';

// Define Telegram WebApp interface
declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initDataUnsafe: {
                    user: {
                        id: number;
                        first_name?: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                        photo_url?: string;
                    };
                };
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isActive: boolean;
                    isProgressVisible: boolean;
                    show: () => void;
                    hide: () => void;
                    enable: () => void;
                    disable: () => void;
                    showProgress: (leaveActive: boolean) => void;
                    hideProgress: () => void;
                    setText: (text: string) => void;
                    onClick: (callback: () => void) => void;
                    offClick: (callback: () => void) => void;
                };
                onEvent: (eventType: string, callback: (event: any) => void) => void;
                offEvent: (eventType: string, callback: (event: any) => void) => void;
                sendData: (data: string) => void;
                openLink: (url: string) => void;
                close: () => void;
                expand: () => void;
                web_app_request_phone: () => void;
                requestContact: () => void;
            };
        };
    }
}

const Register: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.user);
    
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [telegramId, setTelegramId] = useState<number | null>(null);
    const [phoneRequested, setPhoneRequested] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    
    // Request contact from Telegram using SDK
    const requestPhoneNumber = async () => {
        console.log('Requesting contact from Telegram SDK');
        
        try {
            // Check if requestContact is available
            if (requestContact.isAvailable()) {
                // Request the contact
                const contactResponse = await requestContact();
                console.log('Contact received:', contactResponse);
                
                if (contactResponse && contactResponse.contact) {
                    // Extract the phone number from the response
                    let phoneNumber = contactResponse.contact.phone_number; // Use phone_number instead of phoneNumber
                    console.log('Phone number received:', phoneNumber);
                    
                    // Add '+' if it doesn't start with one
                    if (phoneNumber && !phoneNumber.startsWith('+')) {
                        phoneNumber = '+' + phoneNumber;
                    }
                    
                    // Extract user's name if available
                    if (contactResponse.contact.first_name || contactResponse.contact.last_name) {
                        const firstName = contactResponse.contact.first_name || '';
                        const lastName = contactResponse.contact.last_name || '';
                        const fullName = `${firstName} ${lastName}`.trim();
                        setUserName(fullName);
                        console.log('User name received:', fullName);
                    }
                    
                    // Extract user's Telegram ID if available
                    if (contactResponse.contact.user_id) {
                        console.log('Telegram user ID received from contact:', contactResponse.contact.user_id);
                        setTelegramId(contactResponse.contact.user_id);
                    }
                    
                    // Set the phone number and mark as requested
                    setPhoneNumber(phoneNumber);
                    setPhoneRequested(true);
                    toast.success("Contact received");
                    return;
                }
            } else {
                console.log('requestContact is not available');
                toast.error("Contact sharing not available in this environment");
                
                // For development, set a test phone number
                if (process.env.NODE_ENV === 'development') {
                    setPhoneNumber("+998901234567");
                    setPhoneRequested(true);
                }
            }
        } catch (error) {
            console.error('Error requesting contact:', error);
            toast.error("Failed to get contact information");
            
            // For development, set a test phone number
            if (process.env.NODE_ENV === 'development') {
                setPhoneNumber("+998901234567");
                setPhoneRequested(true);
            }
        }
    };
    




    // Store the initData from URL for later use
    const [storedInitData, setStoredInitData] = useState<string>('');
    
    useEffect(() => {
        // Log Telegram WebApp initialization
        console.log('Initializing Telegram WebApp integration');
        console.log('Telegram SDK available:', requestContact.isAvailable());
        
        // Check for tgWebAppData in the URL
        const searchParams = new URLSearchParams(window.location.search);
        const tgWebAppData = searchParams.get('tgWebAppData');
        
        if (tgWebAppData) {
            console.log('Found tgWebAppData in URL:', tgWebAppData);
            // Store the raw tgWebAppData for later use in login
            setStoredInitData(tgWebAppData);
            
            // Try to parse the user data from the tgWebAppData
            try {
                // The data is URL encoded and needs to be decoded
                const decodedData = decodeURIComponent(tgWebAppData);
                console.log('Decoded tgWebAppData:', decodedData);
                
                // Extract the user ID from the decoded data
                // This is a simple approach - in a real app you might want to use a more robust parser
                const userMatch = decodedData.match(/"id":(\d+)/);
                if (userMatch && userMatch[1]) {
                    const id = parseInt(userMatch[1], 10);
                    console.log('Extracted Telegram ID from URL data:', id);
                    setTelegramId(id);
                    return;
                }
            } catch (error) {
                console.error('Error parsing tgWebAppData:', error);
            }
        }
        
        // Try to get Telegram ID from the SDK
        const getTelegramId = async () => {
            try {
                // First try to get the ID from the WebApp object
                if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
                    const id = window.Telegram.WebApp.initDataUnsafe.user.id;
                    console.log('Telegram user ID found from WebApp:', id);
                    setTelegramId(id);
                    return;
                }
                
                // If we're in development mode and can't get the ID from WebApp
                if (process.env.NODE_ENV === 'development') {
                    console.log('Using fallback Telegram ID for development');
                    setTelegramId(123456789);
                    return;
                }
                
                // If we can't get the ID, show an error
                console.error('Could not retrieve Telegram ID');
                toast.error('Could not retrieve your Telegram ID. Please try again.');
            } catch (err) {
                console.error('Error getting Telegram ID:', err);
                if (process.env.NODE_ENV === 'development') {
                    // Fallback for development
                    console.log('Using fallback Telegram ID for development');
                    setTelegramId(123456789);
                } else {
                    toast.error('Error retrieving your Telegram ID. Please try again.');
                }
            }
        };
        
        // Call the function to get the Telegram ID
        getTelegramId();
    }, []);


    // Validate phone number format
    const isValidPhoneNumber = (phone: string): boolean => {
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
    
    // Format phone number to standard format
    const formatPhoneNumber = (phone: string): string => {
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
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        console.log('Submitting registration form with Telegram ID:', telegramId);
        console.log('User name:', userName);
        
        // Validate required fields
        if (!telegramId) {
            toast.error("Telegram ID not found. Please try again.");
            return;
        }
        
        if (!phoneNumber) {
            toast.error("Please provide your phone number.");
            return;
        }
        
        if (!userName || userName.trim() === '') {
            toast.error("Please enter your name.");
            return;
        }
        
        // Validate and format phone number
        const formattedPhone = formatPhoneNumber(phoneNumber);
        if (!isValidPhoneNumber(formattedPhone)) {
            toast.error("Please enter a valid Uzbekistan phone number.");
            return;
        }
        
        try {
            // Generate a random password since we don't need user input
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4);
            
            // Format the initData properly for the registration API
            const formattedInitData = storedInitData ? 
                (storedInitData.startsWith('#') ? storedInitData : `#tgWebAppData=${storedInitData}`) : 
                (window.Telegram?.WebApp?.initData || '');
            
            console.log('Registering with initData:', formattedInitData ? 'present' : 'not available');
            
            await dispatch(handleReg({ 
                password: generatedPassword, 
                phone: formattedPhone, 
                telegram_id: telegramId,
                name: userName,
                tma: formattedInitData || undefined
            }));
            toast.success("Registration successful!");
            
            // After successful registration, log in the user automatically
            try {
                console.log('Registration successful, attempting automatic login');
                
                // Determine which initData to use
                let initData = '';
                
                // First try to use the stored initData from URL
                if (storedInitData) {
                    initData = storedInitData;
                    console.log('Using stored initData from URL for login');
                }
                // Then try to get it from Telegram WebApp
                else if (window.Telegram?.WebApp?.initData) {
                    initData = window.Telegram.WebApp.initData;
                    console.log('Using initData from WebApp for login');
                }
                
                if (initData) {
                    // Format the initData properly for the login API
                    const formattedInitData = initData.startsWith('#') ? initData : `#tgWebAppData=${initData}`;
                    
                    // Call the login API directly
                    console.log('Calling login API with initData and generated password');
                    await dispatch(handleAuth({
                        initData: formattedInitData,
                        password: generatedPassword,
                        username: userName
                    }));
                    
                    // Navigate to the main page after successful login
                    console.log('Login successful, redirecting to main page');
                    navigate('/app');
                } else {
                    console.warn('No initData available for login, redirecting to auth page');
                    navigate('/auth');
                }
            } catch (error) {
                console.error('Error during automatic login:', error);
                // If automatic login fails, redirect to auth page
                toast.error('Registration successful but automatic login failed. Please log in manually.');
                navigate('/auth');
            }
        } catch (err) {
            toast.error("Registration failed. Please try again.");
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img src={"/speaklish.svg"} alt={"Speaklish"}/>
                </div>
                
                <div className={styles.register_header}>
                    <h2>Create Account</h2>
                    <p>Please register to continue using Speaklish</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.register_inputs}>
                        <div className={styles.input_field}>
                            <label htmlFor="phone">Phone number</label>
                            {phoneRequested || phoneNumber ? (
                                <input
                                    name="phone"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(event) => setPhoneNumber(event.target.value)}
                                    placeholder="+998 90 123 45 67"
                                    required
                                    autoFocus
                                    readOnly={phoneNumber !== ""}
                                    className={phoneNumber !== "" ? styles.readonly_input : ""}
                                />
                            ) : (
                                <button 
                                    type="button"
                                    className={styles.phone_request_button}
                                    onClick={requestPhoneNumber}
                                    aria-label="Request phone number from Telegram"
                                >
                                    <svg 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={styles.telegram_icon}
                                    >
                                        <path 
                                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4476 14.0069 10.4043 14 10.362C13.9828 10.3208 13.9558 10.2848 13.922 10.257C13.886 10.2325 13.8447 10.2174 13.802 10.213C13.75 10.21 13.7 10.22 13.64 10.25C13.58 10.28 12.2 11.1 9.5 12.69C9.06 12.97 8.67 13.11 8.33 13.1C7.95 13.09 7.23 12.89 6.69 12.71C6.03 12.5 5.51 12.39 5.56 12.02C5.58 11.83 5.84 11.64 6.35 11.44C9.25 10.11 11.1 9.24 11.9 8.83C14.03 7.7 14.57 7.5 14.93 7.5C15.01 7.5 15.21 7.52 15.34 7.63C15.45 7.72 15.49 7.85 15.5 7.94C15.5 8.02 15.51 8.2 15.49 8.36L16.64 8.8Z" 
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Share your contact
                                </button>
                            )}
                        </div>
                        <div className={styles.input_field}>
                            <label htmlFor="name">Name</label>
                            <input
                                name="name"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className={styles.input_field}>
                            <label htmlFor="tg_id">Telegram ID</label>
                            <input 
                                type="text" 
                                value={telegramId || 'Loading...'} 
                                readOnly
                                disabled
                                className={styles.readonly_input}
                            />
                        </div>
                    </div>
                    
                    {error && typeof error === 'string' && (
                        <div className={styles.error_message}>
                            {(() => {
                                try {
                                    // Try to parse the error as JSON
                                    const errorObj = JSON.parse(error);
                                    // Just return the message property if it exists
                                    return errorObj.message || error;
                                } catch (e) {
                                    console.log(e)
                                    // If it's not valid JSON, just return the original error
                                    return error;
                                }
                            })()}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className={styles.register_button}
                        disabled={loading || !telegramId}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    
                    <div className={styles.back_link}>
                        <a href="#" onClick={() => navigate('/app')}>Back to Login</a>
                    </div>
                </form>
            </div>
            <Toaster position={"top-center"}/>
        </>
    );
};

export default Register;
