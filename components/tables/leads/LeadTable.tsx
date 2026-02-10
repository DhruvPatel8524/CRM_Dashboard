"use client";

/**
 * ============================================================
 * GENERIC DATA TABLE TEMPLATE (SEARCH + PAGINATION + MODALS)
 * ============================================================
 *
 * This component is intentionally structured so it can be reused
 * for other tables with minimal changes.
 *
 * To reuse:
 * 1. Replace the `Lead` type with your new entity
 * 2. Update the API endpoint
 * 3. Update `columns`
 * 4. Update `renderCellContent`
 *
 * Everything else (search, pagination, loading, empty state,
 * modal handling) is generic and reusable.
 * ============================================================
 */

import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    AlertCircle,
    ChevronDown,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Pagination from "../Pagination";

/* ============================================================
   1. TYPES & CONSTANTS
   ============================================================ */

type Lead = {
    id: number;
    leadName: string;
    companyName: string;
    email: string;
    phone: string;
    status: string;
    source: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

const PAGE_SIZE = 10;

/* ============================================================
   2. PURE UTILITY FUNCTIONS (NO REACT STATE)
   ============================================================ */

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusBadge(status: string) {
    const normalized = status?.toLowerCase() ?? "";

    if (normalized === "new" || normalized === "open")
        return <Badge size="sm" color="info">{status}</Badge>;

    if (normalized === "contacted" || normalized === "in progress")
        return <Badge size="sm" color="primary">{status}</Badge>;

    if (normalized === "qualified" || normalized === "converted")
        return <Badge size="sm" color="success">{status}</Badge>;

    if (normalized === "lost" || normalized === "closed")
        return <Badge size="sm" color="error">{status}</Badge>;

    if (normalized === "follow up" || normalized === "pending")
        return <Badge size="sm" color="warning">{status}</Badge>;

    return <Badge size="sm" color="light">{status || "—"}</Badge>;
}

function getSourceBadge(source: string) {
    if (!source) return <span className="text-muted">—</span>;

    return (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400">
            {source}
        </span>
    );
}

/* ============================================================
   3. TABLE STATE UI (LOADING / EMPTY)
   ============================================================ */

function TableSkeleton() {
    return (
        <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 hidden md:block" />
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 hidden md:block" />
                    <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="ml-auto h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                <AlertCircle size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="text-sm font-medium text-heading mb-1">
                No leads found
            </h4>
            <p className="text-xs text-muted text-center max-w-[260px]">
                There are no leads to display. Add a new lead to get started.
            </p>
        </div>
    );
}

/* ============================================================
   4. TABLE COLUMN CONFIGURATION
   ============================================================ */

type ColumnDef = {
    key: string;
    label: string;
    hiddenBelow?: "sm" | "md" | "lg";
};

const columns: ColumnDef[] = [
    { key: "id", label: "#" },
    { key: "leadName", label: "Name" },
    { key: "companyName", label: "Company" },
    { key: "email", label: "Email", hiddenBelow: "lg" },
    { key: "phone", label: "Phone", hiddenBelow: "lg" },
    { key: "status", label: "Status" },
    { key: "source", label: "Source", hiddenBelow: "md" },
    { key: "isActive", label: "Active" },
    { key: "createdAt", label: "Created", hiddenBelow: "md" },
    { key: "updatedAt", label: "Updated", hiddenBelow: "md" },
];

function getResponsiveClass(hiddenBelow?: "sm" | "md" | "lg") {
    if (!hiddenBelow) return "";
    return {
        sm: "hidden sm:table-cell",
        md: "hidden md:table-cell",
        lg: "hidden lg:table-cell",
    }[hiddenBelow];
}

/* ============================================================
   5. MAIN COMPONENT
   ============================================================ */

export default function LeadTable() {

    /* -------------------------
       STATE MANAGEMENT
       ------------------------- */

    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] =
        useState<"add" | "edit" | "delete">("add");
    const [selectedLead, setSelectedLead] =
        useState<Lead | null>(null);

    /* -------------------------
       DATA FETCHING
       ------------------------- */

    useEffect(() => {
        setIsLoading(true);

        fetch("https://localhost:44302/api/Lead/GetAll")
            .then((res) => res.json())
            .then((data) => {
                setLeads(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    /* -------------------------
       DERIVED DATA
       ------------------------- */

    const filteredLeads = useMemo(() => {
        if (!searchTerm.trim()) return leads;

        const term = searchTerm.toLowerCase();
        return leads.filter(
            (lead) =>
                lead.leadName?.toLowerCase().includes(term) ||
                lead.companyName?.toLowerCase().includes(term) ||
                lead.email?.toLowerCase().includes(term) ||
                lead.phone?.toLowerCase().includes(term) ||
                lead.status?.toLowerCase().includes(term) ||
                lead.source?.toLowerCase().includes(term)
        );
    }, [leads, searchTerm]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredLeads.length / PAGE_SIZE)
    );

    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    /* -------------------------
       MODAL HANDLERS
       ------------------------- */

    const openModal = (
        type: "add" | "edit" | "delete",
        lead?: Lead
    ) => {
        setModalType(type);
        setSelectedLead(lead ?? null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLead(null);
    };

    /* -------------------------
       CELL RENDERER
       ------------------------- */

    const renderCellContent = (lead: Lead, key: string) => {
        switch (key) {
            case "id":
                return <span className="font-medium">{lead.id}</span>;

            case "leadName":
                return (
                    <div>
                        <span className="font-medium">{lead.leadName}</span>
                        <span className="block text-xs text-muted lg:hidden">
                            {lead.email}
                        </span>
                    </div>
                );

            case "companyName":
                return lead.companyName || "—";

            case "email":
                return lead.email || "—";

            case "phone":
                return lead.phone || "—";

            case "status":
                return getStatusBadge(lead.status);

            case "source":
                return getSourceBadge(lead.source);

            case "isActive":
                return (
                    <Badge
                        size="sm"
                        color={lead.isActive ? "success" : "warning"}
                    >
                        {lead.isActive ? "Active" : "Inactive"}
                    </Badge>
                );

            case "createdAt":
                return formatDate(lead.createdAt);

            case "updatedAt":
                return formatDate(lead.updatedAt);

            default:
                return "—";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Search size={16} className="text-gray-400 dark:text-gray-500" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800 xl:w-[320px]"
                    />
                </div>

                <button
                    onClick={() => openModal("add")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 active:bg-brand-700 transition-colors shadow-theme-xs whitespace-nowrap"
                >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Add Lead</span>
                </button>
            </div>

            <div className="table-card">
                {isLoading ? (
                    <TableSkeleton />
                ) : paginatedLeads.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <Table className="text-sm">
                            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            isHeader
                                            className={`table-header-cell ${getResponsiveClass(col.hiddenBelow)}`}
                                        >
                                            {col.label}
                                        </TableCell>
                                    ))}
                                    <TableCell
                                        isHeader
                                        className="table-header-cell table-sticky-col border-l border-gray-100 dark:border-gray-800 text-center w-[100px]"
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {paginatedLeads.map((lead) => (
                                    <TableRow
                                        key={lead.id}
                                        className="table-row-hover group"
                                    >
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                className={`table-body-cell ${getResponsiveClass(col.hiddenBelow)}`}
                                            >
                                                {renderCellContent(lead, col.key)}
                                            </TableCell>
                                        ))}
                                        <TableCell className="table-body-cell table-sticky-col border-l border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => openModal("edit", lead)}
                                                    className="rounded-lg p-2 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                                                    title="Edit lead"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => openModal("delete", lead)}
                                                    className="rounded-lg p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                                                    title="Delete lead"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {!isLoading && filteredLeads.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 px-4 py-3.5">
                        <p className="text-xs text-muted tabular-nums">
                            Showing{" "}
                            <span className="font-medium text-body">
                                {(currentPage - 1) * PAGE_SIZE + 1}
                            </span>
                            {" "}to{" "}
                            <span className="font-medium text-body">
                                {Math.min(currentPage * PAGE_SIZE, filteredLeads.length)}
                            </span>
                            {" "}of{" "}
                            <span className="font-medium text-body">
                                {filteredLeads.length}
                            </span>
                            {" "}results
                        </p>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[600px] m-4">
                <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900 lg:p-8">
                    <div className="pr-10">
                        <h4 className="text-lg font-semibold text-heading">
                            {modalType === "add" && "Add New Lead"}
                            {modalType === "edit" && "Edit Lead"}
                            {modalType === "delete" && "Delete Lead"}
                        </h4>
                        <p className="mt-1 text-sm text-muted">
                            {modalType === "delete"
                                ? "This action cannot be undone. The lead will be permanently removed."
                                : "Fill in the details below to save the lead."}
                        </p>
                    </div>

                    <form className="flex flex-col mt-6">
                        <div className="custom-scrollbar overflow-y-auto">
                            {modalType !== "delete" && (
                                <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                                    <div>
                                        <Label>Lead Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter name"
                                            defaultValue={selectedLead?.leadName}
                                        />
                                    </div>
                                    <div>
                                        <Label>Company</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter company"
                                            defaultValue={selectedLead?.companyName}
                                        />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="Enter email"
                                            defaultValue={selectedLead?.email}
                                        />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter phone"
                                            defaultValue={selectedLead?.phone}
                                        />
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <div className="relative">
                                            <select
                                                defaultValue={selectedLead?.status ?? ""}
                                                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                                            >
                                                <option value="">Select status</option>
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Qualified">Qualified</option>
                                                <option value="Lost">Lost</option>
                                                <option value="Converted">Converted</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Source</Label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. Website, Referral"
                                            defaultValue={selectedLead?.source}
                                        />
                                    </div>
                                </div>
                            )}

                            {modalType === "delete" && (
                                <div className="rounded-lg border border-error-100 bg-error-50 p-4 dark:border-error-500/20 dark:bg-error-500/5">
                                    <p className="text-sm text-error-700 dark:text-error-400">
                                        Are you sure you want to delete{" "}
                                        <span className="font-semibold">{selectedLead?.leadName || "this lead"}</span>?
                                        All associated data will be permanently removed.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 justify-end">
                            <Button type="button" size="sm" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={closeModal}
                                className={modalType === "delete" ? "!bg-error-500 hover:!bg-error-600" : ""}
                            >
                                {modalType === "delete" ? "Delete" : "Save Lead"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
