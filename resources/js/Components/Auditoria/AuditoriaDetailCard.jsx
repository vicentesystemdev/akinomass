export default function AuditoriaDetailCard({ title, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-cafe-700">{title}</h3>
            </div>
            <div className="p-5">
                {children}
            </div>
        </div>
    );
}
