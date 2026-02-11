import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import PracticeTable from "@/components/tables/practice/PracticeTable";

export default function Practice() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Leads" />
            <div className="space-y-6">
                <ComponentCard title="Lead Details" desc="Manage all the leads and their details.">
                    <PracticeTable />
                </ComponentCard>
            </div>
        </div>
    );
}
