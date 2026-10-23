
import React from 'react'

const UserCard = ({ user }) => {
    return (

        <div className="card bg-base-300 w-96 shadow-sm">
            <figure>
                <img
                    src={user?.profileUrl}
                    alt="photo" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{user?.firstName} {user?.lastName}</h2>
                <p>{user?.about}</p>
                <div className="card-actions justify-center my-4">
                    <button className="btn btn-primary">Ignore</button>
                    <button className="btn btn-secondary">Send Request</button>
                </div>
            </div>
        </div>

    );
}

export default UserCard