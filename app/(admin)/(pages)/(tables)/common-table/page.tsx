import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CrudTable from "@/components/tables/CrudTable";

export default function CommonTable() {
    return (
        <div>
            <PageBreadcrumb pageTitle="CRUD Operations" />
            <div className="space-y-6">
                <ComponentCard title="Product Management">
                    <CrudTable />
                </ComponentCard>
            </div>
        </div>
    );
}
