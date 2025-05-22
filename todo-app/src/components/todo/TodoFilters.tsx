// components/todo/TodoFilters.tsx
import React from 'react';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import { useTodoContext } from '../../contexts/TodoContext';

export const TodoFilters: React.FC = () => {
    const {
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        sortDirection,
        setSortDirection
    } = useTodoContext();

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="bg-white p-4 rounded-t-lg border border-gray-200 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md border border-gray-300 overflow-hidden">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-2 text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-3 py-2 text-sm ${filter === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-3 py-2 text-sm ${filter === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        Completed
                    </button>
                </div>

                <button
                    onClick={toggleSortDirection}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-500"
                    title={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
                >
                    {sortDirection === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </button>
            </div>
        </div>
    );
};