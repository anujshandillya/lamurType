import Iconify from "@/components/Iconify";
import type { ProfileStatsPayload } from "@/hooks/use-profile";

interface UserStatsProps {
    profileStats: ProfileStatsPayload | undefined;
}

export const UserStats = ({ profileStats }: UserStatsProps) => {
    const recentStats = profileStats?.daily || [];
    const allTimeStats = profileStats?.allTime || [];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>

            {/* WPM Distribution */}
            <div className="bg-card rounded-lg p-6 border">
                <h4 className="font-medium mb-4">WPM Distribution</h4>
                <div className="space-y-3">
                    {recentStats.length > 0 ? (
                        recentStats.slice(-10).map((stat: any, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min((stat.wpm / 100) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium min-w-[60px]">{stat.wpm} WPM</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">No recent tests to display</p>
                    )}
                </div>
            </div>
        </div>
    );
};
