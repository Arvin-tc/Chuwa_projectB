import React, { useState } from "react";

const EditableField = ({ label, value, onChange, type = 'text', isEditable = false, options = [] }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
        onChange(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {!isEditing ? (
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-gray-800">{value || 'Not provided'}</p>
                    {isEditable && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:underline"
                        >
                            Edit
                        </button>
                    )}
                </div>
            ) : (
                <div className="mt-1 flex items-center space-x-2">
                    {type === 'select' ? (
                        <select
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Select an option</option>
                            {options.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={type}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditableField;
