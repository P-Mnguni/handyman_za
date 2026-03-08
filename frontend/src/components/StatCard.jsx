const StatCard = ({ title, value, change, icon }) => {
    const isPositive = change?.startsWith('+');

    return (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{icon}</div>
                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-gray-600'}`}>
                    {change}
                </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

export default StatCard;