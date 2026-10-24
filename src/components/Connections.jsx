import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '../utils/constants';
import { addConnections } from '../utils/connectionSlice';
import ConnectionItem from './ConnectionItem';

const Connections = () => {
    const connections = useSelector((state) => state.connection);
    const dispatch = useDispatch();

    const fetchConnections = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/user/connections`,
                { withCredentials: true }
            );

            dispatch(addConnections(response.data.data));
        } catch (error) {
            console.error('Failed to fetch connections:', error);
        }
    };

    React.useEffect(() => {
        fetchConnections();
    }, []);

    if (connections === null) {
        return <p className="text-center mt-10">Loading connections...</p>;
    }

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Connections
                        </h1>
                        <p className="text-sm text-base-content/60 mt-1">
                            People you're connected with
                        </p>
                    </div>

                    <div className="badge badge-primary badge-lg">
                        {connections.length}
                    </div>
                </div>

                {/* Connections List */}
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 divide-y divide-base-300">
                    {connections.length === 0 ? (
                        <p className="p-10 text-center text-base-content/60">
                            No connections found.
                        </p>
                    ) : (
                        connections.map((connection) => (
                            <ConnectionItem
                                key={connection._id}
                                user={connection}
                                actions={[
                                    {
                                        label: 'View Profile',
                                        className: 'btn-primary',
                                        onClick: (user) => {
                                            console.log('View profile:', user._id);
                                            // Add profile navigation here.
                                        },
                                    },
                                    {
                                        label: 'Message',
                                        className: 'btn-outline',
                                        onClick: (user) => {
                                            console.log('Message user:', user._id);
                                            // Add messaging functionality here.
                                        },
                                    },
                                ]}
                            />
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default Connections;