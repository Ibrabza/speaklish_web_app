import {FC} from "react";

interface IModalWindow {
    text:string,
    buttons: [string?,string?],
    handleClose: () => void,
    handler: () => void,
}

const CustomModalWindow : FC<IModalWindow> = ({text, buttons, handleClose, handler}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {text}
                </h2>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                        {buttons?.[0]}
                    </button>
                    <button
                        onClick={handler}
                        className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-600 transition"
                    >
                        {buttons?.[1]}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CustomModalWindow;