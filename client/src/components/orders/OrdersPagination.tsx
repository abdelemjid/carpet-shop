import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  setPage: (page: number) => void;
}

const OrdersPagination = ({ hasNext, hasPrev, page, setPage }: Props) => {
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

export default OrdersPagination;
