import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import LeadTable from "@/components/tables/leads/LeadTable";

export default function DummyTableMain() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Leads" />
            <div className="space-y-6">
                <ComponentCard title="Lead Records" desc="All the captured leads and their details.">
                    <LeadTable />
                </ComponentCard>
            </div>
        </div>
    );
}
