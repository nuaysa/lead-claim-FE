import Button from "@/components/Common/Button/Button";
import { Lead, Sales } from "@/types/Lead";

interface PaginationProps {
    currentPage: number;
    totalPage: number;
    data : Lead[] | Sales[];
    NextPage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPage, data, NextPage }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-3 mt-4">
      <Button text="Prev" variant="SECONDARY" disabled={currentPage === 1} onClick={() => NextPage(currentPage - 1)} />

      <span className="text-sm font-bold text-primary-hover">
        Page {data.length === 0 ? 0 : currentPage} / {totalPage}
      </span>

      <Button text="Next" variant="SECONDARY" disabled={currentPage >= totalPage} onClick={() => NextPage(currentPage + 1)} />
    </div>
  );
}
