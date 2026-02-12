import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DemoTable from "@/components/tables/demo/DemoTable";

export default function LeadTableMaiin() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Demo Table" />
            <div className="space-y-6">
                <ComponentCard title="Dummy Records" desc="This table is only for reference.">
                    <DemoTable />
                </ComponentCard>
            </div>
        </div>
    );
};