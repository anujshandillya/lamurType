import { useState } from "react";
import useProfile from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { UserStats } from "./UserStats";
import { LeaderboardStats } from "./LeaderboardStats";
import Iconify from "@/components/Iconify";
import useLeaderboard from "@/hooks/use-leaderboard";

const Profile = () => {
    const { user, profileStats, isLoading } = useProfile();
    const { allTime, daily } = useLeaderboard();
    const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'leaderboard'>('overview');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user?.isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Iconify icon="mdi:account-off" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
                    <p className="text-muted-foreground">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    const calculateAverageWPM = (stats: any[]) => {
        if (!stats || stats.length === 0) return 0;
        const totalWPM = stats.reduce((sum, stat) => sum + stat.wpm, 0);
        return Math.round(totalWPM / stats.length);
    };

    const getBestWPM = (stats: any[]) => {
        if (!stats || stats.length === 0) return 0;
        return Math.max(...stats.map(stat => stat.wpm));
    };

    const getTotalTests = (stats: any[]) => {
        return stats?.length || 0;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            {user.first_name} {user.last_name}
                        </h1>
                        <p className="text-muted-foreground text-lg mb-4">{user.email}</p>

                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex gap-1">
                        <p className="text-sm text-muted-foreground">Average WPM:</p>
                        <p className="text-sm font-bold">
                            {calculateAverageWPM(profileStats?.allTime || [])}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <p className="text-sm text-muted-foreground">Best WPM:</p>
                        <p className="text-sm font-bold">
                            {getBestWPM(profileStats?.best || [])}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <p className="text-sm text-muted-foreground">Tests Taken:</p>
                        <p className="text-sm font-bold">
                            {getTotalTests(profileStats?.allTime || [])}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="md:col-span-2 bg-card rounded-xl border shadow-sm">
                <div className="border-b">
                    <div className="flex">
                        {[
                            { id: 'overview', label: 'Overview', icon: 'mdi:view-dashboard' },
                            { id: 'stats', label: 'Statistics', icon: 'mdi:chart-line' },
                            { id: 'leaderboard', label: 'Leaderboard', icon: 'material-symbols-light:social-leaderboard-rounded' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'border-b-2 border-primary text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Iconify icon={tab.icon} className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Recent Performance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Last 5 Tests</h4>
                                        <div className="space-y-2">
                                            {profileStats?.allTime?.slice(0, 5).map((test, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="text-sm">{test.name}</span>
                                                    <span className="font-medium">{test.wpm} WPM</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Best Performances</h4>
                                        <div className="space-y-2">
                                            {profileStats?.best?.slice(0, 5).map((test, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="text-sm">{test.name}</span>
                                                    <span className="font-medium text-green-600">{test.wpm} WPM</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <UserStats profileStats={profileStats} />
                    )}

                    {activeTab === 'leaderboard' && (
                        <LeaderboardStats profileStats={allTime} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;