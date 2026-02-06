"use client";

import React, { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Pencil, Trash2, Eye, Plus, Search } from "lucide-react";
import CrudModal from "./tableComponent/CrudModal";
import Pagination from "./tableComponent/Pagination";
import { TableItem, ModalData, FormData, ActionType } from "./tableComponent/types";

const ITEMS_PER_PAGE = 5;

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
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 5,
        name: "Demo",
        price: "999",
        createdAt: "05-02-2025",
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 6,
        name: "Demo",
        price: "999",
        createdAt: "05-02-2025",
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
];

export default function ProductTable() {
    const [data, setData] = useState<TableItem[]>(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [modalData, setModalData] = useState<ModalData>({
        isOpen: false,
        action: null,
        item: null,
    });

    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();

        return data.filter(
            (item) =>
                item.name.toLowerCase().includes(term) ||
                item.price.toLowerCase().includes(term) ||
                item.createdBy.toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    const openModal = (action: ActionType, item: TableItem | null = null) => {
        setModalData({ isOpen: true, action, item });
    };

    const closeModal = () => {
        setModalData({ isOpen: false, action: null, item: null });
    };

    const handleSave = (formData: FormData) => {
        if (modalData.action === "add") {
            setData((prev) => [
                ...prev,
                {
                    id: Math.max(0, ...prev.map((i) => i.id)) + 1,
                    name: formData.name,
                    price: formData.price,
                    createdAt: new Date().toISOString().split("T")[0],
                    createdBy: "Current User",
                    updatedAt: new Date().toISOString().split("T")[0],
                    updatedBy: "Current User",
                    isActive: formData.isActive,
                },
            ]);
        }

        if (modalData.action === "edit" && modalData.item) {
            setData((prev) =>
                prev.map((item) =>
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
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        setData((prev) => prev.filter((item) => item.id !== id));
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
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
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors text-sm"
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
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                <div className="block max-w-full overflow-x-auto">
                    <Table className="text-sm font-normal text-gray-700 dark:text-gray-300">
                        <TableHeader className="border-b border-gray-100 dark:border-white/5">
                            <TableRow>
                                {[
                                    "Id",
                                    "Name",
                                    "Price",
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

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                            {paginatedData.length ? (
                                paginatedData.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors text-center"
                                    >
                                        <TableCell className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                            {item.id}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 max-w-45 truncate">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 font-medium">
                                            {item.price}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            {item.createdBy}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            {item.updatedAt}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            {item.updatedBy}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Badge
                                                size="sm"
                                                color={item.isActive ? "success" : "error"}
                                            >
                                                {item.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openModal("view", item)}
                                                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openModal("edit", item)}
                                                    className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
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
                                        colSpan={8}
                                        className="px-4 py-12 text-center text-gray-500"
                                    >
                                        No items found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 px-4 py-3">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}
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
