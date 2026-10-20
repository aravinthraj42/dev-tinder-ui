import React from 'react';
import { useSelector } from 'react-redux';

const NavBar = () => {
  const user = useSelector((state) => state.user);

  console.log(user);

  return (
    <div className="navbar bg-base-200 shadow-sm px-4">
      {/* Left Side */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Dev Tinder</a>
      </div>

      {/* Right Side */}
      {user && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            {/* Profile Button */}
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-3 cursor-pointer"
            >
              {/* Welcome Text */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="font-semibold text-base-content">
                  {user.firstName}
                </p>
              </div>

              {/* Profile Image */}
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User profile"
                    src={user.profileUrl}
                  />
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;