import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DummyTable from "@/components/tables/dummy/DummyTable";

export default function DummyTableMain() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Table Stucture" />
            <div className="space-y-6">
                <ComponentCard title="Dummy Table (Title goes here)" desc="(Description goes here)">
                    <DummyTable />
                </ComponentCard>
            </div>
        </div>
    );
}
