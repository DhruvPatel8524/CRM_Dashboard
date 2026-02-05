"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { ModalData, TableItem, FormData } from "./types";

interface CrudModalProps {
    modalData: ModalData;
    onClose: () => void;
    onSave: (data: FormData) => void;
}

export default function CrudModal({
    modalData,
    onClose,
    onSave,
}: CrudModalProps) {
    const [formData, setFormData] = useState<FormData>({
        name: modalData.item?.name || "",
        price: modalData.item?.price || "",
        isActive: modalData.item?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    if (!modalData.isOpen) return null;

    const isViewMode = modalData.action === "view";
    const title =
        modalData.action === "add"
            ? "Add New Item"
            : modalData.action === "edit"
                ? "Edit Item"
                : "View Item";

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-theme-xl border border-gray-200 dark:border-white/5 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg p-1 hover:bg-gray-100 hover:dark:border-white/5"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isViewMode}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:focus:border-brand-500 transition-colors disabled:bg-gray-50 dark:disabled:bg-white/[0.02] disabled:cursor-not-allowed"
                                placeholder="Enter name"
                            />
                        </div>

                        {/* Price Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Price
                            </label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                disabled={isViewMode}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:focus:border-brand-500 transition-colors disabled:bg-gray-50 dark:disabled:bg-white/[0.02] disabled:cursor-not-allowed"
                                placeholder="₹0"
                            />
                        </div>

                        {/* Status Field */}
                        {/* <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 focus:ring-2 disabled:cursor-not-allowed"
                            />
                            <label
                                htmlFor="isActive"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Active
                            </label>
                        </div> */}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
                            >
                                {isViewMode ? "Close" : "Cancel"}
                            </button>
                            {!isViewMode && (
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors shadow-theme-sm"
                                >
                                    {modalData.action === "add" ? "Add" : "Save"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
