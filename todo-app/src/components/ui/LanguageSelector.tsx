// components/common/LanguageSelector.tsx
import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const language = event.target.value;
        i18n.changeLanguage(language);
    };

    return (
        <div className="flex items-center">
            <Globe size={18} className="mr-2 text-gray-500" />
            <select
                value={i18n.language}
                onChange={changeLanguage}
                className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
            </select>
        </div>
    );
};

export default LanguageSelector;