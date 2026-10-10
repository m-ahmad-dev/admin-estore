import { useState, useEffect } from 'react';
import { useCountries } from '../hooks/useCountries';
import CountriesTable from '../components/CountriesTable';
import CountriesPageHeader from '../components/CountriesPageHeader';
import CountriesToolbar from '../components/CountriesToolbar';
import PageLoader from '../../../components/ui/PageLoader';

const CountriesPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    is_active: undefined,
    order: 'asc',
  });

  // Debounce search to avoid too many requests
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const { data, isLoading, error } = useCountries(debouncedFilters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading countries: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <CountriesPageHeader />
      <CountriesToolbar filters={filters} onFilterChange={handleFilterChange} />
      <div className="mt-4">
        {isLoading ? (
          <PageLoader />
        ) : (
          <CountriesTable countries={data?.countries || []} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default CountriesPage;