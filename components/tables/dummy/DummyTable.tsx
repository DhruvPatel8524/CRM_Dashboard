"use client";

import React, { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import Pagination from "../Pagination";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

const ITEMS_PER_PAGE = 5;

/* ✅ TYPE DEFINITIONS */
type TableItem = {
    id: number;
    name: string;
    price: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    isActive: boolean;
};

/* TEMP DATA (will be replaced by DB later) */
const dataFromDB: TableItem[] = [
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
        createdBy: "User",
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
        createdBy: "Admin",
        updatedAt: "05-02-2025",
        updatedBy: "Admin",
        isActive: true,
    },
    {
        id: 5,
        name: "Demo",
        price: "999",
        createdBy: "Admin",
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

export default function DummyTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    /* ✅ TYPED CRUD MODAL STATE */
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: "add" | "edit" | "delete" | null;
        row: TableItem | null;
    }>({
        isOpen: false,
        type: null,
        row: null,
    });

    /* FORM STATE */
    const [formData, setFormData] = useState({
        name: "",
        price: "",
    });

    /* FILTER */
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

    /* OPEN MODALS */
    const openAddModal = () => {
        setFormData({ name: "", price: "" });
        setModal({ isOpen: true, type: "add", row: null });
    };

    const openEditModal = (row: TableItem) => {
        setFormData({ name: row.name, price: row.price });
        setModal({ isOpen: true, type: "edit", row });
    };

    const openDeleteModal = (row: TableItem) => {
        setModal({ isOpen: true, type: "delete", row });
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: null, row: null });
    };

    /* HANDLERS */
    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (modal.type === "add") {
            console.log("CALL CREATE API", formData);
        }

        if (modal.type === "edit" && modal.row) {
            console.log("CALL UPDATE API", modal.row.id, formData);
        }

        closeModal();
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (modal.row) {
            console.log("CALL DELETE API", modal.row.id);
        }

        closeModal();
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
                        placeholder="Search..."
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
                    onClick={openAddModal}
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
                                {["Id", "Name", "Price", "Created By", "Status", "Action"].map(
                                    (header) => (
                                        <TableCell
                                            key={header}
                                            isHeader
                                            className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 whitespace-nowrap"
                                        >
                                            {header}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                            {paginatedData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors text-center"
                                >
                                    <TableCell className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        {item.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">{item.name}</TableCell>
                                    <TableCell className="px-4 py-3">{item.price}</TableCell>
                                    <TableCell className="px-4 py-3">{item.createdBy}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Badge size="sm" color="success">
                                            Active
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(item)}
                                                className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

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

            {/* Modal */}
            <Modal isOpen={modal.isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold">
                            {modal.type === "add" && "Add Item"}
                            {modal.type === "edit" && "Edit Item"}
                            {modal.type === "delete" && "Delete Item"}
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            {modal.type === "delete"
                                ? "This action cannot be undone"
                                : "Fill the details below"}
                        </p>
                    </div>

                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-full overflow-y-auto px-2">
                            {modal.type !== "delete" && (
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label>Price</Label>
                                        <Input
                                            type="text"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {modal.type === "delete" && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-red-600">
                                        {modal.row?.name}
                                    </span>
                                    ?
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button type="button" size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>

                            {modal.type === "delete" ? (
                                <Button type="button" size="sm" onClick={handleDelete}>
                                    Delete
                                </Button>
                            ) : (
                                <Button type="button" size="sm" onClick={handleSave}>
                                    {modal.type === "add" ? "Add" : "Update"}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
