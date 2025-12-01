"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { UserPlan } from "@/types/type";



export default function AdminPlansClient() {
    const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUserPlans();
    }, []);

    const fetchUserPlans = async () => {
        try {
            const res = await fetch("/api/admin/user-plans");
            const data = await res.json();

            if (data.success) {
                setUserPlans(data.userPlans);
            }
        } catch (error) {
            console.error("Error fetching user plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlans = userPlans.filter(plan =>
        plan.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.plan.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">User Subscriptions</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users or plans..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-[300px]"
                        />
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Subscriptions ({filteredPlans.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Days Remaining</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlans.map((plan) => {
                                const daysRemaining = Math.ceil(
                                    (new Date(plan.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                                );

                                return (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-mono text-xs">{plan.user_id}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {plan.plan.display_name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={plan.status === 'active' ? 'default' : 'destructive'}
                                                className="capitalize"
                                            >
                                                {plan.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(plan.start_date), 'MMM d, yyyy')}</TableCell>
                                        <TableCell>{format(new Date(plan.end_date), 'MMM d, yyyy')}</TableCell>
                                        <TableCell>
                                            <span className={daysRemaining < 5 ? "text-red-500 font-bold" : ""}>
                                                {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredPlans.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No subscriptions found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
