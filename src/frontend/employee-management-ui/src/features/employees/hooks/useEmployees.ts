import { useCallback, useEffect, useState } from 'react';
import { deleteEmployee, getEmployees } from '../../../api/employeeApi';
import type { Employee } from '../../../models/employee';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setEmployees(await getEmployees());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (id: string) => {
    await deleteEmployee(id);
    await load();
  }, [load]);

  return { employees, loading, error, refresh: load, remove };
}
