// Type definitions for CRUD table operations

export interface TableItem {
    id: number;
    name: string;
    price: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    isActive: boolean;
}

export type ActionType = "add" | "edit" | "view" | "delete";

export interface ModalData {
    isOpen: boolean;
    action: ActionType | null;
    item: TableItem | null;
}

export interface FormData {
    name: string;
    price: string;
    isActive: boolean;
}
