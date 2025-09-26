export default function ApiPage({ params }: { params: { agentId: string } }) {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-white text-3xl font-bold">API</h1>
                <p className="text-gray-400">API details for agent {params.agentId}.</p>
            </div>
        </div>
    )
}
