"use client";

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
import { error } from "console";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

type Lead = {
    id: number;
    leadName: string;
    companyName: string;
    email: string;
    phone: string;
    status: string;
    source: string;
    assignedTo: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
};

type ColumnDef<T> = {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

const columns: ColumnDef<Lead>[] = [
    { key: "id", label: "#" },
    { key: "leadName", label: "Name" },
    { key: "companyName", label: "Company" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "source", label: "Source" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "createdAt", label: "Created" },
    { key: "updatedAt", label: "Updated" },
    { key: "isActive", label: "Active", render: (value) => value ? "Active" : "Inactive" },
];

export default function PracticeTable() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
    const [formData, setFormData] = useState<Partial<Lead>>({
        leadName: "",
        companyName: "",
        email: "",
        phone: "",
        status: "",
        source: "",
        assignedTo: "",
    });
    const [selectedRowId, setSelectedRowId] = useState<Lead | null>(null);

    const fetchLeads = () => {
        fetch("https://localhost:44302/api/Lead/GetAll", {
            method: "POST",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch leads");
                }
                return response.json();
            })
            .then((data) => {
                setLeads(data);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const opneModal = (type: "add" | "edit" | "delete", lead?: Lead) => {
        setModalType(type);
        setSelectedRowId(lead ?? null);

        if (type === "add") {
            setFormData({
                leadName: "",
                companyName: "",
                email: "",
                phone: "",
                status: "",
                source: "",
                assignedTo: "",
            });
        }

        if (type === "edit" && lead) {
            setFormData(lead);
        }

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAdd = () => {
        fetch("https://localhost:44302/api/Lead/Add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add lead");
                }
                return response.json();
            })
            .then(() => {
                fetchLeads();
                closeModal();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleUpdate = () => {
        if (!selectedRowId) return;

        fetch("https://localhost:44302/api/Lead/Update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, id: selectedRowId.id })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update lead");
                }
                return response.json();
            })
            .then(() => {
                fetchLeads();
                closeModal();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDelete = () => {
        if (!selectedRowId) return;

        fetch("https://localhost:44302/api/Lead/UpdateByColumn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedRowId)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete lead");
                }
                return response.json();
            })
            .then(() => {
                fetchLeads();
                closeModal();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="space-y-4">
            {/* Search bar and Add button */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 justify-between">
                <button
                    onClick={() => opneModal("add")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 active:bg-brand-700 transition-colors shadow-theme-xs whitespace-nowrap">
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Add Lead</span>
                </button>
            </div>

            {/* Table */}
            <div className="table-card overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    isHeader
                                    key={column.key}
                                    className="table-header-cell">
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                isHeader
                                className="table-header-cell table-sticky-col border-l border-gray-100 dark:border-gray-800 text-center w-[100px]">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {leads.map((lead) => (
                            <TableRow
                                key={lead.id}
                                className="table-row-hover group">
                                {columns.map((column) => (
                                    <TableCell
                                        key={String(column.key)}
                                        className="table-body-cell">
                                        {column.render ? column.render(lead[column.key], lead) : lead[column.key] == null ? "-" : lead[column.key]}
                                    </TableCell>
                                ))}
                                <TableCell className="table-body-cell table-sticky-col border-l border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => opneModal("edit", lead)}
                                            className="rounded-lg p-2 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                                            title="Edit lead">
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => opneModal("delete", lead)}
                                            className="rounded-lg p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                                            title="Delete lead">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-[600px] m-4">
                <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900 lg:p-8">
                    <div>
                        <h4 className="text-lg font-semibold text-heading">
                            {modalType === "add" && "Add New Lead"}
                            {modalType === "edit" && "Edit Lead"}
                            {modalType === "delete" && "Delete Lead"}
                        </h4>
                    </div>

                    <div className="mt-10">
                        {modalType !== "delete" && (
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        name="leadName"
                                        value={formData.leadName || ""}
                                        onChange={handleChange}
                                        placeholder="Enter lead name"
                                    />
                                </div>
                                <div>
                                    <Label>Company</Label>
                                    <Input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName || ""}
                                        onChange={handleChange}
                                        placeholder="Enter company"
                                    />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleChange}
                                        placeholder="Enter phone"
                                    />
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status || ""}
                                            onChange={handleChange}
                                            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
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
                                        name="source"
                                        value={formData.source || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. Website, Referral"
                                    />
                                </div>
                                <div>
                                    <Label>Assigned To</Label>
                                    <Input
                                        type="text"
                                        name="assignedTo"
                                        value={formData.assignedTo || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. Admin, User"
                                    />
                                </div>
                            </div>
                        )}

                        {modalType === "delete" && (
                            <div className="rounded-lg border border-error-100 bg-error-50 p-4 dark:border-error-500/20 dark:bg-error-500/5">
                                <p className="text-sm text-error-700 dark:text-error-400">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">{selectedRowId?.leadName || "this lead"}</span>?
                                    All associated data will be permanently removed.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 justify-end">
                        <Button type="button" size="sm" variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={modalType === "add" ? handleAdd : modalType === "edit" ? handleUpdate : handleDelete}
                            className={modalType === "delete" ? "!bg-error-500 hover:!bg-error-600" : ""}>
                            {modalType === "add" && "Add"}
                            {modalType === "edit" && "Save"}
                            {modalType === "delete" && "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
