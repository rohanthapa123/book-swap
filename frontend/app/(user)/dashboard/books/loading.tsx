export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-64" />
                    </div>
                    <div className="flex space-x-2">
                        <div className="h-10 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-200 rounded w-32" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="h-10 bg-gray-200 rounded flex-1" />
                    <div className="h-10 bg-gray-200 rounded w-32" />
                    <div className="h-10 bg-gray-200 rounded w-32" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="aspect-[2/3] bg-gray-200" />
                            <div className="p-4 space-y-2">
                                <div className="h-6 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="flex space-x-2">
                                    <div className="h-5 bg-gray-200 rounded-full w-16" />
                                    <div className="h-5 bg-gray-200 rounded w-12" />
                                </div>
                                <div className="h-3 bg-gray-200 rounded" />
                                <div className="h-3 bg-gray-200 rounded w-4/5" />
                                <div className="h-3 bg-gray-200 rounded w-24" />
                                <div className="flex space-x-2 pt-2">
                                    <div className="h-8 bg-gray-200 rounded flex-1" />
                                    <div className="h-8 bg-gray-200 rounded w-10" />
                                    <div className="h-8 bg-gray-200 rounded w-10" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
