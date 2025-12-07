import { AdminStats } from "../../../../src/lib/types";

interface StatsDashboardProps {
  stats: AdminStats | undefined;
  isLoading: boolean;
}

export function StatsDashboard({ stats, isLoading }: StatsDashboardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Statistics
        </h2>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats?.totalEvents || 0}
          </div>
          <div className="text-gray-600">Total Events</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats?.totalParticipants || 0}
          </div>
          <div className="text-gray-600">Total Participants</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {stats?.totalLoginTokens || 0}
          </div>
          <div className="text-gray-600">Total Login Tokens</div>
        </div>
      </div>
    </div>
  );
}
