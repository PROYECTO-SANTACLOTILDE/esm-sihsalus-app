import React, { useState } from 'react';
import useFuaRequests from '../hooks/useFuaRequests';
// Import Carbon UI components
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  Dropdown,
  DatePicker,
  DatePickerInput,
  TextInput,
  Button,
} from '@carbon/react';
// Import Carbon icons for buttons (Search and Download)
import { Search as SearchIcon, Download as DownloadIcon } from '@carbon/react/icons';

const documentTypeOptions = ['DNI', 'CE', 'ARCHIVO CLÍNICO', 'CNV', 'NO SE CONOCE', 'OTROS'];
const professionalOptions = ['Todos', 'Dr. Alice', 'Dr. Bob', 'Dr. Charlie'];

/**
 * React component that displays a list of FUA requests in a table with filters, search, and pagination.
 */
const FuaRequestsTable: React.FC = () => {
  // Default filter values
  const today = new Date();
  const [localDocType, setLocalDocType] = useState<string>('DNI');
  const [localDocNumber, setLocalDocNumber] = useState<string>('');
  const [localDateRange, setLocalDateRange] = useState<[Date | null, Date | null]>([today, today]);
  const [localProfessional, setLocalProfessional] = useState<string>('Todos');

  // Filter object that will be passed to the hook (updated when user clicks Search)
  const [filters, setFilters] = useState({
    documentType: 'DNI',
    documentNumber: '',
    startDate: today,
    endDate: today,
    professional: undefined as string | undefined, // undefined means "Todos"
  });

  // Get data (and loading state) from the custom hook
  const { data: fuaRequests, isLoading } = useFuaRequests(filters);

  // State for global search query (to filter within the fetched results)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination state: current page and page size
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Handle filter search button click
  const handleApplyFilters = () => {
    setFilters({
      documentType: localDocType,
      documentNumber: localDocNumber,
      startDate: localDateRange[0] || undefined,
      endDate: localDateRange[1] || undefined,
      professional: localProfessional === 'Todos' ? undefined : localProfessional,
    });
    setSearchQuery(''); // reset the quick search when applying new filters
    setCurrentPage(1); // reset to first page on new search
  };

  // Handle clear button click - reset all filters to default values
  const handleClearFilters = () => {
    const today = new Date();
    setLocalDocType('DNI');
    setLocalDocNumber('');
    setLocalDateRange([today, today]);
    setLocalProfessional('Todos');
    setFilters({
      documentType: 'DNI',
      documentNumber: '',
      startDate: today,
      endDate: today,
      professional: undefined,
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Handle global search input (for quick filtering displayed results by name or document)
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination changes (page number or page size)
  const onPaginationChange = (pagination: { page: number; pageSize: number }) => {
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      // When page size changes, reset to page 1 (optional)
      setCurrentPage(1);
    } else {
      setCurrentPage(pagination.page);
    }
  };

  // Apply global search query filtering on the fetched data
  const filteredData = fuaRequests.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    // Filter by patient name or document (type and number)
    const docId = `${item.documentType} ${item.documentNumber}`.toLowerCase();
    return item.patientName.toLowerCase().includes(query) || docId.includes(query);
  });

  // Calculate pagination indices
  const totalItems = filteredData.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const pageData = filteredData.slice(startIndex, startIndex + pageSize);

  // Define table headers for Carbon DataTable
  const headers = [
    { key: 'docId', header: 'Tipo y Nro de Documento' },
    { key: 'status', header: 'Estado' },
    { key: 'patientName', header: 'Apellidos y Nombres' },
    { key: 'appointmentDate', header: 'Fecha de Cita' },
    { key: 'action', header: 'Acción' },
  ];

  // Prepare rows in the format required by Carbon DataTable (each row must have a unique "id" and values for each header key)
  const rows = pageData.map((item) => ({
    id: item.id, // unique id for the row
    docId: `${item.documentType} ${item.documentNumber}`,
    status: item.status,
    patientName: item.patientName,
    appointmentDate: item.appointmentDate,
    action: 'download', // placeholder value (we will render a custom element for this cell)
  }));

  // Handler for download action (e.g., downloading the FUA file for a given request)
  const handleDownload = (requestId: string) => {
    // In a real app, this would trigger a download (e.g., call an API or open a link).
    // TODO: implement actual download logic (e.g., window.open(fileUrl) or fetch blob)
  };

  return (
    <TableContainer title="Solicitudes FUA">
      {/* Filter Inputs Toolbar */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Document Type Dropdown */}
        <Dropdown
          id="docTypeDropdown"
          label="Tipo de documento"
          titleText="Tipo de documento"
          items={documentTypeOptions}
          selectedItem={localDocType}
          onChange={({ selectedItem }) => setLocalDocType(selectedItem as string)}
        />
        {/* Document Number Text Input */}
        <TextInput
          id="docNumberInput"
          labelText="Número de documento"
          value={localDocNumber}
          onChange={(e) => setLocalDocNumber(e.target.value)}
        />
        {/* Date Range Picker for start and end dates */}
        <DatePicker
          id="dateRangePicker"
          datePickerType="range"
          dateFormat="d/m/Y"
          value={localDateRange}
          onChange={(dates: (Date | undefined)[]) => {
            // 'dates' is an array: [startDate, endDate]
            const [start, end] = dates;
            setLocalDateRange([start || null, end || null]);
          }}
        >
          <DatePickerInput id="start-date" labelText="Fecha inicio" placeholder="dd/mm/yyyy" />
          <DatePickerInput id="end-date" labelText="Fecha fin" placeholder="dd/mm/yyyy" />
        </DatePicker>
        {/* Professional Dropdown */}
        <Dropdown
          id="professionalDropdown"
          label="Profesional"
          titleText="Profesional"
          items={professionalOptions}
          selectedItem={localProfessional}
          onChange={({ selectedItem }) => setLocalProfessional(selectedItem as string)}
        />
        {/* Search and Clear buttons */}
        <Button kind="primary" onClick={handleApplyFilters} renderIcon={SearchIcon}>
          Buscar
        </Button>
        <Button kind="secondary" onClick={handleClearFilters}>
          Limpiar
        </Button>
      </div>

      {/* Data Table with Carbon components */}
      <DataTable rows={rows} headers={headers} isSortable>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <>
            {/* Table toolbar with a global search bar (filters table content) */}
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  persistent
                  id="table-search"
                  placeholder="Buscar en resultados..."
                  value={searchQuery}
                  onChange={onSearchChange}
                />
              </TableToolbarContent>
            </TableToolbar>

            <Table size="md">
              {/* Table Header */}
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => {
                      // Render custom cell for the "Acción" column (download button)
                      if (cell.info.header === 'action') {
                        // Find the original data item to determine if download should be enabled
                        const originalItem = pageData.find((item) => item.id === row.id);
                        const disabled = originalItem?.status !== 'Confirmada';
                        return (
                          <TableCell key={cell.id}>
                            <Button
                              size="sm"
                              kind="tertiary"
                              renderIcon={DownloadIcon}
                              disabled={disabled}
                              onClick={() => handleDownload(row.id)}
                            >
                              FUA
                            </Button>
                          </TableCell>
                        );
                      }
                      // Default rendering for other cells
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
                {/* Show a message when no data is available */}
                {rows.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={headers.length} style={{ textAlign: 'center' }}>
                      No matching records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <Pagination
              totalItems={totalItems}
              page={currentPageSafe}
              pageSize={pageSize}
              pageSizes={[5, 10, 20, 50]}
              onChange={onPaginationChange}
              backwardText="Previous page"
              forwardText="Next page"
              itemsPerPageText="Items per page"
            />
          </>
        )}
      </DataTable>
    </TableContainer>
  );
};

export default FuaRequestsTable;
