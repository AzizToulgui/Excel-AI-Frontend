"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SpreadsheetRow } from "@/lib/spreadsheet";
import { api } from "@/lib/api";

type ApiResponse = {
  data: SpreadsheetRow[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export default function FlexiFilterTable() {
  const [search, setSearch] = useState("");
  const [ermis, setErmis] = useState("All");
  const [city, setCity] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["users", page],
    queryFn: () => api.getUsers(page, pageSize),
  });

  const rows = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1 };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (ermis !== "All" && row.onERMIS !== ermis) return false;
      if (city !== "All" && row.city !== city) return false;

      if (search) {
        const searchableText = [
          row.name,
          row.email,
          row.phone,
          row.city,
          row.companyPosition,
          row.onERMIS,
          row.contactPerson,
          ...row.previousCourses,
          ...row.notifications,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(search.toLowerCase());
      }
      return true;
    });
  }, [rows, search, ermis, city]);

  const totalPages = meta.totalPages || 1;
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = filteredRows;

  const startRow = meta.total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, meta.total);

  const goToPreviousPage = () => setPage((current) => Math.max(1, current - 1));
  const goToNextPage = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  const handleFilterChange = (
    newValue: string,
    setter: (value: string) => void,
  ) => {
    setter(newValue);
    setPage(1);
  };

  const handleDeleteAllUsers = async () => {
    try {
      await api.deleteAllUsers();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  };
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-background/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.14)] backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-border/70 p-5 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          placeholder="Search by any field..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="sm:w-80"
        />

        <Select
          value={ermis}
          onValueChange={(value) => handleFilterChange(value, setErmis)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="On ERMIS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All ERMIS</SelectItem>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={city}
          onValueChange={(value) => handleFilterChange(value, setCity)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Cities</SelectItem>
            {Array.from(new Set(rows.map((r) => r.city).filter(Boolean))).map(
              (cityName) => (
                <SelectItem key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            onClick={handleDeleteAllUsers}
            type="button"
            variant="outline"
            className="text-primary"
            size="sm"
          >
            Delete All Users
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="max-h-145 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Company / Position</TableHead>
              <TableHead>On ERMIS</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Previous Courses</TableHead>
              <TableHead>Notifications</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-44 text-center text-sm text-muted-foreground"
                >
                  Loading users from database...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-44 text-center text-sm text-red-600"
                >
                  Failed to load users. Please try again later.
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-44 text-center text-sm text-muted-foreground"
                >
                  No users found. Upload a spreadsheet to get started.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, index) => (
                <TableRow
                  key={`${row.email}-${startRow + index}`}
                  className="hover:bg-muted/35"
                >
                  <TableCell className="font-medium">
                    {row.name || "-"}
                  </TableCell>
                  <TableCell>{row.email || "-"}</TableCell>
                  <TableCell>{row.phone || "-"}</TableCell>
                  <TableCell>{row.city || "-"}</TableCell>
                  <TableCell>{row.companyPosition || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        row.onERMIS === "Yes"
                          ? "bg-success text-white border-transparent"
                          : "bg-destructive text-white border-transparent"
                      }
                    >
                      {row.onERMIS}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.contactPerson || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {row.previousCourses?.length > 0 ? (
                        row.previousCourses.map((course) => (
                          <Badge
                            key={course}
                            variant="outline"
                            className="bg-accent-foreground"
                          >
                            {course}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {row.notifications?.length > 0 ? (
                        row.notifications.map((notification) => (
                          <Badge
                            key={notification}
                            variant="outline"
                            className="bg-accent-foreground"
                          >
                            {notification}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur">
            <TableRow>
              <TableCell colSpan={9} className="p-0">
                <div className="flex items-center justify-between px-4 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {startRow}-{endRow} of {meta.total} • Page {currentPage} /{" "}
                    {totalPages}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
