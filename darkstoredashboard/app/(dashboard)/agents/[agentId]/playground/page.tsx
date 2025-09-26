export default function PlaygroundPage({ params }: { params: { agentId: string } }) {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-white text-3xl font-bold">Playground</h1>
                <p className="text-gray-400">Experiment with agent {params.agentId}.</p>
            </div>
        </div>
    )
}
