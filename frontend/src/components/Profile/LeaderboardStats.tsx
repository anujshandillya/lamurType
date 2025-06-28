import Iconify from "@/components/Iconify";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface LeaderboardStatsProps {
    profileStats: any;
}

export const LeaderboardStats = ({ profileStats }: LeaderboardStatsProps) => {
    const recentStats = profileStats || [];
    const bestStats = profileStats || [];

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTestTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'words':
                return 'mdi:format-text';
            case 'sentences':
                return 'mdi:format-paragraph';
            case 'numbers':
                return 'mdi:numeric';
            default:
                return 'mdi:keyboard';
        }
    };

    const getWPMColor = (wpm: number) => {
        if (wpm >= 80) return 'text-green-600';
        if (wpm >= 60) return 'text-blue-600';
        if (wpm >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Typing History</h3>
                <Button variant="outline" size="sm">
                    <Iconify icon="mdi:download" className="w-4 h-4" />
                    Export Data
                </Button>
            </div>

            <div className="overflow-x-auto">
                <div className="max-h-[200px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>WPM</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bestStats.length > 0 ? (
                                bestStats.map((test: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{index < 3 ? (
                                            <Iconify
                                                icon="mdi:medal"
                                                className={`w-4 h-4 ${index === 0 ? 'text-yellow-500' :
                                                    index === 1 ? 'text-gray-400' :
                                                        'text-amber-600'
                                                    }`}
                                            />
                                        ) : (
                                            <span className="w-4 h-4 text-xs font-medium text-muted-foreground">
                                                {index + 1}
                                            </span>
                                        )}</TableCell>
                                        <TableCell>{test.user_id}</TableCell>
                                        <TableCell>{test.name}</TableCell>
                                        <TableCell className={getWPMColor(test.wpm)}>{test.wpm}</TableCell>
                                        <TableCell><Iconify icon={getTestTypeIcon(test.type)} /></TableCell>
                                        <TableCell>{formatDate(test.created_at)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (<></>)}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
};
