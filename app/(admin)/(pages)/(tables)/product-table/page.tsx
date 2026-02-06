import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductTable from "@/components/tables/ProductTable";

export default function ProductTablePage(){
    return(
        <div>
            <PageBreadcrumb pageTitle="Product Table" />
            <div className="space-y-6">
                <ComponentCard title="Product Table">
                    <ProductTable />
                </ComponentCard>
            </div>
        </div>
    )
}