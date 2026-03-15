import React from "react";

const LoadingSpinner = ({
    size = 'medium',
    color = 'blue',
    fullPage = false,
    text = 'Loading...'
}) => {
    // Size configuration
    const sizeConfig = {
        small: {
            container: 'h-16',
            spinner: 'h-6 w-6',
            text: 'text-sm'
        },
        medium: {
            container: 'h32',
            spinner: 'h-10 w-10',
            text: 'text-base'
        },
        large: {
            container: 'h-48',
            spinner: 'h-16 w-16',
            text: 'text-lg'
        }
    };

    // Color configurations
    const colorConfig = {
        blue: 'border-blue-600',
        gray: 'border-gray-600',
        red: 'border-red-600',
        green: 'border-green-600',
        purple: 'border-purple-600',
        white: 'border-white'
    };

    const selectedSize = sizeConfig[size] || sizeConfig.medium;
    const selectedColor = colorConfig[color] || colorConfig.blue;

    const spinnerClasses = `
        ${selectedSize.spinner}
        border-4
        border-t-transparent
        ${selectedColor}
        rounded-full
        animate-spin
    `;

    // If fullPage, center in the viewport
    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white opacity-75 -z-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className={spinnerClasses} role="status">
                            <span className="sr-only">{text}</span>
                        </div>
                    </div>
                    {text && (
                        <p className={`mt-4 text-gray-600 ${selectedSize.text}`}>
                            {text}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Default: centered in container
    return (
        <div className={`flex flex-col items-center justify-center ${selectedSize.container}`}>
            <div className={spinnerClasses} role="status">
                <span className="sr-only">{text}</span>
            </div>
            {text && (
                <p className={`mt-3 text-gray-600 ${selectedSize.text}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

// Size presets as static properties
LoadingSpinner.sizes = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
};

// Color presets as static properties
LoadingSpinner.color = {
    BLUE: 'blue',
    GRAY: 'gray',
    RED: 'red',
    GREEN: 'green',
    PURPLE: 'purple',
    WHITE: 'white'
};

export default LoadingSpinner;