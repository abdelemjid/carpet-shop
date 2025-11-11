import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchAndFilter } from "@/contexts/SearchAndFiltersContext";

interface Props {
  hasNext: boolean;
  hasPrev: boolean;
}

const ProductsPagination = ({ hasNext, hasPrev }: Props) => {
  const { page, setPage } = useSearchAndFilter();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem aria-disabled={!hasPrev}>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => {
              hasPrev && page > 1 && setPage(page - 1);
            }}
          />
        </PaginationItem>
        {/* Current Page */}
        <PaginationItem className="px-8">{page}</PaginationItem>
        {/* Next */}
        <PaginationItem aria-disabled={!hasNext}>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              hasNext && setPage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductsPagination;
