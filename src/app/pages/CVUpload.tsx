import { useState, useCallback, useEffect, useRef } from "react";
import {
    Upload,
    FileText,
    ClipboardPaste,
    CheckCircle2,
    XCircle,
    Loader2,
    Clock,
    ArrowRight,
    RotateCcw,
    File,
    X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../../lib/auth-context";
import { discCvAPI, type CvStatusResponse, type CvParseStatus, type LatestCvResponse } from "../../lib/disc-api";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const POLL_INTERVAL = 3000;

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_CONFIG: Record<
    CvParseStatus,
    { label: string; color: string; icon: React.ReactNode; progress: number }
> = {
    queued: {
        label: "Queued",
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4" />,
        progress: 15,
    },
    processing: {
        label: "Processing",
        color: "bg-blue-100 text-blue-800",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        progress: 55,
    },
    completed: {
        label: "Completed",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle2 className="w-4 h-4" />,
        progress: 100,
    },
    failed: {
        label: "Failed",
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4" />,
        progress: 100,
    },
};

// ─── Status Tracker ─────────────────────────────────────────────────

function StatusTracker({
    jobId,
    onReset,
}: {
    jobId: string;
    onReset: () => void;
}) {
    const [status, setStatus] = useState<CvStatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function poll() {
            try {
                const res = await discCvAPI.getStatus(jobId);
                if (cancelled) return;
                setStatus(res);
                setError(null);

                if (res.status === "completed" || res.status === "failed") {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to check status");
            }
        }

        // Initial poll
        poll();
        intervalRef.current = setInterval(poll, POLL_INTERVAL);

        return () => {
            cancelled = true;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [jobId]);

    const config = status ? STATUS_CONFIG[status.status] : null;
    const progressValue = status?.progress ?? config?.progress ?? 10;

    return (
        <div className="space-y-6">
            {/* Job Info */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Job ID: <span className="font-mono text-gray-700">{jobId}</span>
                </div>
                {config && (
                    <Badge
                        variant="outline"
                        className={config.color}
                    >
                        <span className="flex items-center gap-1.5">
                            {config.icon}
                            {config.label}
                        </span>
                    </Badge>
                )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-3" />
            </div>

            {/* Status Steps */}
            <div className="flex items-center gap-2 text-sm">
                {(["queued", "processing", "completed"] as const).map((step, i) => {
                    const isActive = status?.status === step;
                    const isPast =
                        status &&
                        ["queued", "processing", "completed"].indexOf(status.status) >
                            ["queued", "processing", "completed"].indexOf(step);
                    return (
                        <div key={step} className="flex items-center gap-2">
                            {i > 0 && (
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                            )}
                            <span
                                className={
                                    isActive
                                        ? "font-semibold text-[#0A2463]"
                                        : isPast
                                          ? "text-green-600"
                                          : "text-gray-400"
                                }
                            >
                                {step.charAt(0).toUpperCase() + step.slice(1)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Error State */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Completed State */}
            {status?.status === "completed" && status.result && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-800 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        CV parsed successfully
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-3 border border-green-100">
                            <div className="text-gray-500">Sections Parsed</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status.result.sections_parsed}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-100">
                            <div className="text-gray-500">Word Count</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status.result.word_count.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <a
                        href="/career-analytics"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#0A2463] hover:underline"
                    >
                        View Career Analytics
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            )}

            {/* Failed State */}
            {status?.status === "failed" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 space-y-4">
                    <div className="flex items-center gap-2 text-red-800 font-semibold">
                        <XCircle className="w-5 h-5" />
                        Processing failed
                    </div>
                    {status.error && (
                        <p className="text-sm text-red-700">{status.error}</p>
                    )}
                    <Button variant="outline" onClick={onReset}>
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </Button>
                </div>
            )}
        </div>
    );
}

// ─── CV Upload Page ─────────────────────────────────────────────────

export function CVUpload() {
    const { isAuthenticated } = useAuth();

    // Upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Text paste state
    const [pasteText, setPasteText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pasteError, setPasteError] = useState<string | null>(null);

    // Tracking state
    const [jobId, setJobId] = useState<string | null>(null);

    // Latest CV state
    const [latestCv, setLatestCv] = useState<LatestCvResponse | null>(null);
    const [latestCvLoading, setLatestCvLoading] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch latest CV on mount
    useEffect(() => {
        discCvAPI.getLatest()
            .then(setLatestCv)
            .catch(() => setLatestCv(null))
            .finally(() => setLatestCvLoading(false));
    }, []);

    // ─── File Validation ──────────────────────────────────────────

    const validateFile = useCallback((file: File): string | null => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
            return "Only PDF and DOCX files are accepted.";
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File is too large (${formatFileSize(file.size)}). Maximum size is 10 MB.`;
        }
        return null;
    }, []);

    const handleFileSelect = useCallback(
        (file: File) => {
            const error = validateFile(file);
            if (error) {
                setFileError(error);
                setSelectedFile(null);
            } else {
                setFileError(null);
                setSelectedFile(file);
                setUploadError(null);
            }
        },
        [validateFile],
    );

    // ─── Drag & Drop ─────────────────────────────────────────────

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileSelect(file);
        },
        [handleFileSelect],
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
        },
        [handleFileSelect],
    );

    // ─── Upload Handlers ─────────────────────────────────────────

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setUploadError(null);
        try {
            const res = await discCvAPI.upload(selectedFile);
            setJobId(res.job_id);
            handleUploadComplete();
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleTextSubmit = async () => {
        if (!pasteText.trim()) return;
        setIsSubmitting(true);
        setPasteError(null);
        try {
            const res = await discCvAPI.pasteText(pasteText.trim());
            setJobId(res.job_id);
            handleUploadComplete();
        } catch (err) {
            setPasteError(err instanceof Error ? err.message : "Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setJobId(null);
        setSelectedFile(null);
        setFileError(null);
        setUploadError(null);
        setPasteText("");
        setPasteError(null);
    };

    // ─── Render ──────────────────────────────────────────────────

    if (!isAuthenticated) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <Card>
                    <CardContent className="py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Sign in required
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Please sign in to upload your CV for analysis.
                        </p>
                        <Button asChild>
                            <a href="/login">Sign In</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleDownloadCv = () => {
        if (!latestCv) return;
        const blob = new Blob([latestCv.raw_text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cv_${latestCv.source}_${latestCv.created_at?.slice(0, 10) ?? "unknown"}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Refresh latest CV after successful upload
    const handleUploadComplete = () => {
        discCvAPI.getLatest()
            .then(setLatestCv)
            .catch(() => {});
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload CV</h1>
                <p className="text-gray-500 mt-1">
                    Upload your CV to generate behavioral insights and career analytics.
                </p>
            </div>

            {/* Latest Upload Card */}
            {!latestCvLoading && latestCv && (
                <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-emerald-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Latest Upload</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-4">
                                            <span className="capitalize">{latestCv.source}</span>
                                            <span>{latestCv.word_count.toLocaleString()} words</span>
                                            <span>{latestCv.char_count.toLocaleString()} characters</span>
                                        </div>
                                        {latestCv.parsed_at && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                <span>
                                                    Parsed {new Date(latestCv.parsed_at).toLocaleDateString("en-US", {
                                                        month: "short", day: "numeric", year: "numeric",
                                                        hour: "numeric", minute: "2-digit",
                                                    })}
                                                </span>
                                                {latestCv.parser_version && (
                                                    <span className="text-gray-400">v{latestCv.parser_version}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadCv}
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                            >
                                <FileText className="w-4 h-4 mr-1.5" />
                                Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        {jobId ? "Processing Status" : "Submit Your CV"}
                    </CardTitle>
                    <CardDescription>
                        {jobId
                            ? "Your CV is being analyzed. This usually takes less than a minute."
                            : "Upload a PDF/DOCX file or paste your CV text directly."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {jobId ? (
                        <StatusTracker jobId={jobId} onReset={handleReset} />
                    ) : (
                        <Tabs defaultValue="file">
                            <TabsList className="w-full">
                                <TabsTrigger value="file" className="flex-1">
                                    <Upload className="w-4 h-4" />
                                    File Upload
                                </TabsTrigger>
                                <TabsTrigger value="text" className="flex-1">
                                    <ClipboardPaste className="w-4 h-4" />
                                    Paste Text
                                </TabsTrigger>
                            </TabsList>

                            {/* ── File Upload Tab ────────────────── */}
                            <TabsContent value="file" className="mt-4 space-y-4">
                                {/* Drop Zone */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                                        relative cursor-pointer rounded-lg border-2 border-dashed p-8
                                        text-center transition-colors
                                        ${
                                            isDragOver
                                                ? "border-[#0A2463] bg-blue-50"
                                                : selectedFile
                                                  ? "border-green-300 bg-green-50"
                                                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />

                                    {selectedFile ? (
                                        <div className="space-y-2">
                                            <File className="w-10 h-10 text-green-600 mx-auto" />
                                            <div className="font-medium text-gray-900">
                                                {selectedFile.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatFileSize(selectedFile.size)}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                    setFileError(null);
                                                    if (fileInputRef.current)
                                                        fileInputRef.current.value = "";
                                                }}
                                                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                                            <div className="text-gray-700 font-medium">
                                                {isDragOver
                                                    ? "Drop your file here"
                                                    : "Drag & drop your CV here"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                or click to browse &middot; PDF, DOCX up to 10 MB
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* File Error */}
                                {fileError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        {fileError}
                                    </div>
                                )}

                                {/* Upload Error */}
                                {uploadError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        {uploadError}
                                    </div>
                                )}

                                {/* Upload Button */}
                                <Button
                                    onClick={handleFileUpload}
                                    disabled={!selectedFile || isUploading}
                                    className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Upload CV
                                        </>
                                    )}
                                </Button>
                            </TabsContent>

                            {/* ── Text Paste Tab ─────────────────── */}
                            <TabsContent value="text" className="mt-4 space-y-4">
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Paste your CV text here..."
                                        value={pasteText}
                                        onChange={(e) => setPasteText(e.target.value)}
                                        rows={12}
                                        className="resize-y font-mono text-sm"
                                    />
                                    <div className="flex justify-end text-xs text-gray-400">
                                        {pasteText.length.toLocaleString()} characters
                                    </div>
                                </div>

                                {/* Paste Error */}
                                {pasteError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        {pasteError}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    onClick={handleTextSubmit}
                                    disabled={!pasteText.trim() || isSubmitting}
                                    className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="w-4 h-4" />
                                            Submit CV Text
                                        </>
                                    )}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
