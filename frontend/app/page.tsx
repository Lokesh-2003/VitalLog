import api from '@/lib/api';

export default async function Home() {
  try {
    const healthData = await api.get('/health');
    
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold">System Health</h1>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(healthData, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-xl font-bold">Error</h2>
        <p>Failed to load health data</p>
        <pre className="text-sm mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    );
  }
}