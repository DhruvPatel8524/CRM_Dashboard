import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CrudTable from "@/components/tables/CrudTable";

export default function CommonTable() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Table Stucture" />
            <div className="space-y-6">
                <ComponentCard title="Dummy Table (Title goes here)" desc="(Description goes here (optional))">
                    <CrudTable />
                </ComponentCard>
            </div>
        </div>
    );
}
