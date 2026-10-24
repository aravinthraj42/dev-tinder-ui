import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { addRequests } from '../utils/requestSlice';
import ConnectionItem from './ConnectionItem';

const Request = () => {
    const requests = useSelector((state) => state.request);
    const dispatch = useDispatch();

    const fetchRequest = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/user/request/received`,
                { withCredentials: true }
            );

            dispatch(addRequests(response.data.data));
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        }
    };

    React.useEffect(() => {
        fetchRequest();
    }, []);

    const reviewRequest = async (status, requestId) => {
        try {
            await axios.post(
                `${API_BASE_URL}/request/receive/${status}/${requestId}`,
                {},
                { withCredentials: true }
            );

            // Remove the reviewed request from Redux.
            dispatch(
                addRequests(
                    requests.filter((request) => request._id !== requestId)
                )
            );
        } catch (error) {
            console.error(
                `Failed to ${status} request:`,
                error.response?.data || error.message
            );
        }
    };

    if (requests === null) {
        return (
            <p className="text-center mt-10">
                Loading requests...
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Connection Requests
                        </h1>
                        <p className="text-sm text-base-content/60 mt-1">
                            People who want to connect with you
                        </p>
                    </div>

                    <div className="badge badge-primary badge-lg">
                        {requests.length}
                    </div>
                </div>

                {/* Requests List */}
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 divide-y divide-base-300">
                    {requests.length === 0 ? (
                        <p className="p-10 text-center text-base-content/60">
                            No requests found.
                        </p>
                    ) : (
                        requests.map((request) => (
                            <ConnectionItem
                                key={request._id}
                                user={request.fromUserId}
                                actions={[
                                    {
                                        label: 'Accept',
                                        className: 'btn-success',
                                        onClick: () =>
                                            reviewRequest(
                                                'accepted',
                                                request._id
                                            ),
                                    },
                                    {
                                        label: 'Reject',
                                        className: 'btn-error btn-outline',
                                        onClick: () =>
                                            reviewRequest(
                                                'rejected',
                                                request._id
                                            ),
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

export default Request;