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
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 5;

/* TEMP DATA (will be replaced by DB later) */
const dataFromDB = [
    {
        id: 1,
        name: "Demo",
        price: "999",
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 2,
        name: "Demo",
        price: "999",
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 3,
        name: "Demo",
        price: "999",
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 4,
        name: "Demo",
        price: "999",
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 5,
        name: "Demo",
        price: "999",
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 6,
        name: "Demo",
        price: "999",
        createdBy: "User",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
];

export default function CrudTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    /* SIMPLE FILTER */
    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return dataFromDB.filter(
            (item) =>
                item.name.toLowerCase().includes(term) ||
                item.price.toLowerCase().includes(term) ||
                item.createdBy.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

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
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors text-sm"
                    />
                </div>

                {/* Add Button (NOT WORKING) */}
                <button
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
                                        <TableCell className="px-4 py-3">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
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
                                            <Badge size="sm" color="success">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 px-4 py-3">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
