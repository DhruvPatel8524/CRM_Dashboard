"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { ModalData, FormData } from "./types";

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
  const isView = modalData.action === "view";

  const [formData, setFormData] = useState<FormData>({
    name: modalData.item?.name || "",
    price: modalData.item?.price || "",
    isActive: modalData.item?.isActive ?? true,
  });

  if (!modalData.isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const title =
    modalData.action === "add"
      ? "Add Item"
      : modalData.action === "edit"
      ? "Edit Item"
      : "View Item";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isView}
              required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={isView}
              required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="₹0"
            />
          </div>

          {/* actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              {isView ? "Close" : "Cancel"}
            </button>

            {!isView && (
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                {modalData.action === "add" ? "Add" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
