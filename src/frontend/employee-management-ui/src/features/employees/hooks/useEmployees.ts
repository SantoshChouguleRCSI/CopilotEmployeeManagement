import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteEmployee, getEmployees } from '../../../api/employeeApi';
import type { Employee } from '../../../models/employee';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const requestIdRef = useRef(0);

  const load = useCallback(async (searchTerm: string) => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const result = await getEmployees(searchTerm);
      if (requestId === requestIdRef.current) setEmployees(result);
    } catch (e) {
      if (requestId === requestIdRef.current) {
        setError(e instanceof Error ? e.message : 'Failed to load employees');
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => { load(search); }, [load, search]);

  const remove = useCallback(async (id: string) => {
    await deleteEmployee(id);
    await load(search);
  }, [load, search]);

  return { employees, loading, error, search, setSearch, refresh: () => load(search), remove };
}
