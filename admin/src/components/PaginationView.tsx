import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface Props {
  page?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  setPage: (page: number) => void;
}

const PaginationView = ({ page, setPage, hasNext, hasPrev }: Props) => {
  return (
    <div className="mx-auto px-3 py-1 rounded-md bg-gray-900/20 backdrop-blur-md">
      <Pagination>
        <PaginationContent className="gap-5">
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!hasPrev}
              onClick={() => hasPrev && page && setPage(page - 1)}
              className="cursor-pointer"
            />
          </PaginationItem>

          {hasPrev && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>

          {hasNext && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              aria-disabled={!hasNext}
              onClick={() => hasNext && page && setPage(page + 1)}
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationView;
