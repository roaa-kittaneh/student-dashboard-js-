import { useCallback, useEffect, useRef, useState } from 'react';
import { studentsApi } from '../api/students';
import { extractError } from '../api/client';

/**
 * useStudents — encapsulates listing with debounced query/filter/pagination
 * and exposes CRUD mutations. Server-paginated.
 */
export function useStudents({ q = '', department = '', status = '', page = 1, pageSize = 10 } = {}) {
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1, page, pageSize });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reqIdRef = useRef(0);

  const fetchList = useCallback(async () => {
    const myReq = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await studentsApi.list({ q, department, status, page, pageSize });
      if (reqIdRef.current === myReq) setData(res);
    } catch (e) {
      if (reqIdRef.current === myReq) setError(extractError(e, 'Failed to load students'));
    } finally {
      if (reqIdRef.current === myReq) setLoading(false);
    }
  }, [q, department, status, page, pageSize]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const create = useCallback(async (payload) => {
    const created = await studentsApi.create(payload);
    await fetchList();
    return created;
  }, [fetchList]);

  const update = useCallback(async (id, payload) => {
    const updated = await studentsApi.update(id, payload);
    await fetchList();
    return updated;
  }, [fetchList]);

  const remove = useCallback(async (id) => {
    await studentsApi.remove(id);
    await fetchList();
  }, [fetchList]);

  return { ...data, loading, error, refetch: fetchList, create, update, remove };
}
