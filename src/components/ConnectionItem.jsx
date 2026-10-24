import React from 'react';

const ConnectionItem = ({
    user,
    actions,
}) => {
    const {
        _id,
        firstName,
        lastName,
        profileUrl,
        about,
    } = user;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-base-200 transition-colors duration-200">

            {/* Profile Picture */}
            <div className="avatar shrink-0">
                <div className="w-16 h-16 rounded-full">
                    <img
                        src={profileUrl}
                        alt={`${firstName} ${lastName}`}
                    />
                </div>
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base-content truncate">
                    {firstName} {lastName}
                </h2>

                <p className="text-sm text-base-content/60 line-clamp-2 mt-1">
                    {about || 'No bio available'}
                </p>
            </div>

            {/* Dynamic Actions */}
            <div className="flex flex-wrap gap-2 sm:shrink-0">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => action.onClick(user)}
                        disabled={action.disabled}
                        className={`btn btn-sm ${action.className ?? ''}`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default ConnectionItem;