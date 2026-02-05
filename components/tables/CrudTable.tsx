"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table"; import Badge from "../ui/badge/Badge";
import { Pencil, Trash2, Eye, Plus, Search } from "lucide-react";
import CrudModal from "./CrudModal";
import { TableItem, ModalData, FormData, ActionType } from "./types";
import Pagination from "./Pagination";

// Sample initial data
const initialData: TableItem[] = [
    {
        id: 1,
        name: "Demo",
        price: "999",
        createdAt: "05-02-2025",
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 2,
        name: "Demo",
        price: "999",
        createdAt: "05-02-2025",
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 3,
        name: "Demo",
        price: "999",
        createdAt: "05-02-2025",
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 4,
        name: "Demo",
        price: "999",
        createdAt: "05-02-2025",
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 5,
        name: "Demo",
        price: "800",
        createdAt: "05-02-2025",
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 6,
        name: "Test",
        price: "999",
        createdAt: "05-02-2025",
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
];

export default function CrudTable() {
    const [data, setData] = useState<TableItem[]>(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalData, setModalData] = useState<ModalData>({
        isOpen: false,
        action: null,
        item: null,
    });

    // Filter data based on search term
    const filteredData = useMemo(() => {
        return data.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const openModal = (action: ActionType, item: TableItem | null = null) => {
        setModalData({ isOpen: true, action, item });
    };

    const closeModal = () => {
        setModalData({ isOpen: false, action: null, item: null });
    };

    const handleSave = (formData: FormData) => {
        if (modalData.action === "add") {
            const newItem: TableItem = {
                id: Math.max(...data.map((item) => item.id), 0) + 1,
                name: formData.name,
                price: formData.price,
                createdAt: new Date().toISOString().split("T")[0],
                createdBy: "Current User",
                updatedAt: new Date().toISOString().split("T")[0],
                updatedBy: "Current User",
                isActive: formData.isActive,
            };
            setData([...data, newItem]);
        } else if (modalData.action === "edit" && modalData.item) {
            setData(
                data.map((item) =>
                    item.id === modalData.item!.id
                        ? {
                            ...item,
                            name: formData.name,
                            price: formData.price,
                            isActive: formData.isActive,
                            updatedAt: new Date().toISOString().split("T")[0],
                            updatedBy: "Current User",
                        }
                        : item
                )
            );
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setData(data.filter((item) => item.id !== id));
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    }, [totalPages, currentPage]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    }, [filteredData, currentPage]);

    return (
        <div className="space-y-4">
            {/* Header with Search and Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name, price, or creator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:focus:border-brand-500 transition-colors text-sm"
                    />
                </div>

                {/* Add Button */}
                <button
                    onClick={() => openModal("add")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors shadow-theme-sm whitespace-nowrap"
                >
                    <Plus size={18} />
                    <span>Add New</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                {/* Desktop Table View */}
                <div className="block max-w-full overflow-x-auto">
                    <div className="min-w-full">
                        <Table className="text-sm font-normal text-gray-700 dark:text-gray-300">
                            {/* Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {[
                                        "Id",
                                        "Name",
                                        "Price",
                                        // "Created At",
                                        "Created By",
                                        "Updated At",
                                        "Updated By",
                                        "Status",
                                        "Action",
                                    ].map((header) => (
                                        <TableCell
                                            key={header}
                                            isHeader
                                            className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 whitespace-nowrap"
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            {/* Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors text-center"
                                        >
                                            <TableCell className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                                {item.id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm max-w-[180px] truncate">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {item.price}
                                            </TableCell>
                                            {/* <TableCell className="px-4 py-3 text-sm">
                                                {item.createdAt}
                                            </TableCell> */}
                                            <TableCell className="px-4 py-3 text-sm">
                                                {item.createdBy}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm">
                                                {item.updatedAt}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm">
                                                {item.updatedBy}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm">
                                                <Badge
                                                    size="sm"
                                                    color={item.isActive ? "success" : "error"}
                                                >
                                                    {item.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => openModal("view", item)}
                                                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-white transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openModal("edit", item)}
                                                        className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                                            colSpan={9}
                                        >
                                            No items found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredData.length > itemsPerPage && (
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.05] px-4 py-3">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    if (page >= 1 && page <= totalPages) {
                                        setCurrentPage(page);
                                    }
                                }}
                            />

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <CrudModal
                modalData={modalData}
                onClose={closeModal}
                onSave={handleSave}
            />
        </div>
    );
}
