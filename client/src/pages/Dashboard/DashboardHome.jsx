import React from 'react';
import { NavLink } from 'react-router-dom';

const DashboardHome = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <nav className="w-64 bg-white shadow-lg">
                <div className="flex items-center justify-center mt-8">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                </div>
                <ul className="mt-6">
                    <li>
                        <NavLink
                            to="/dashboard/dashboard-approve"
                            className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100"
                            activeClassName="bg-blue-500 text-white"
                        >
                            Approve Pending Listings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/user-analytics"
                            className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100"
                            activeClassName="bg-blue-500 text-white"
                        >
                            Check User Analytics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/view-listings"
                            className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100"
                            activeClassName="bg-blue-500 text-white"
                        >
                            View Listings
                        </NavLink>
                    </li>
                </ul>
            </nav>
            {/* Main Content */}
            <main className="flex-1 p-10">
                {children}
            </main>
        </div>
    );
};

export default DashboardHome;
