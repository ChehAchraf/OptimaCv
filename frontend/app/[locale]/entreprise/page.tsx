"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  FileBarChart,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CVUploadZone, CVTable } from "@/components/enterprise";
import {
  getEnterpriseCVs,
  deleteMultipleEnterpriseCVs,
  getEnterpriseAnalyses
} from "@/app/actions/enterpriseActions";
import { EnterpriseCV, EnterpriseAnalysis } from "@/types/enterprise";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 10;

export default function EnterpriseDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("EnterpriseDashboard");

  const [cvs, setCVs] = useState<EnterpriseCV[]>([]);
  const [analyses, setAnalyses] = useState<EnterpriseAnalysis[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [totalCVs, setTotalCVs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchCVs = useCallback(async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const filters = {
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter as any : undefined,
      };

      const { data, total } = await getEnterpriseCVs(filters, ITEMS_PER_PAGE, offset);
      setCVs(data);
      setTotalCVs(total);
    } catch (error) {
      toast({ title: "Failed to fetch CVs", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, toast]);

  const fetchAnalyses = useCallback(async () => {
    try {
      const { data } = await getEnterpriseAnalyses(5, 0);
      setAnalyses(data);
    } catch (error) {
      console.error("Failed to fetch analyses:", error);
    }
  }, []);

  useEffect(() => {
    fetchCVs();
    fetchAnalyses();
  }, [fetchCVs, fetchAnalyses]);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await deleteMultipleEnterpriseCVs(selectedIds);
      toast({ title: `${selectedIds.length} CV(s) deleted` });
      setSelectedIds([]);
      fetchCVs();
    } catch (error) {
      toast({ title: "Failed to delete CVs", variant: "destructive" });
    }
  };

  const handleAnalyze = () => {
    if (selectedIds.length === 0) {
      toast({ title: "Please select at least one CV", variant: "destructive" });
      return;
    }
    const idsString = selectedIds.join(",");
    router.push(`/entreprise/analyze?ids=${idsString}`);
  };

  const totalPages = Math.ceil(totalCVs / ITEMS_PER_PAGE);
  const pendingCount = cvs.filter(cv => cv.status === "pending").length;
  const analyzedCount = cvs.filter(cv => cv.status === "analyzed").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Enterprise Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your CV pool and run bulk analyses
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={handleAnalyze}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileBarChart className="w-5 h-5" />
              Analyze CVs
            </Button>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Upload CVs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Upload CVs</DialogTitle>
                </DialogHeader>
                <CVUploadZone
                  onUploadComplete={() => {
                    setIsUploadOpen(false);
                    fetchCVs();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalCVs}
                  </p>
                  <p className="text-sm text-gray-500">Total CVs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingCount}
                  </p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyzedCount}
                  </p>
                  <p className="text-sm text-gray-500">Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <FileBarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyses.length}
                  </p>
                  <p className="text-sm text-gray-500">Analyses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>CV Pool</CardTitle>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search CVs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="analyzed">Analyzed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchCVs}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {selectedIds.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedIds.length} CV(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAnalyze}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileBarChart className="w-4 h-4 mr-2" />
                    Analyze Selected
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <CVTable
                cvs={cvs}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onRefresh={fetchCVs}
              />
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCVs)} of {totalCVs}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {analyses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => router.push(`/entreprise/analysis/${analysis.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <FileBarChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {analysis.job_title || "Job Analysis"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {analysis.total_cvs} CVs analyzed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${analysis.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : analysis.status === "processing"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
                        {analysis.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}