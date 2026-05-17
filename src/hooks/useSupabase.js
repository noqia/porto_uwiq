import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useSupabaseQuery = (table, options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select(options.select || '*')
        
        if (options.filter) {
          query = query.eq(options.filter.column, options.filter.value)
        }
        
        if (options.order) {
          query = query.order(options.order.column, { ascending: options.order.ascending })
        }

        const { data: result, error: err } = await query
        if (err) throw err
        setData(result || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table, JSON.stringify(options)])

  return { data, loading, error }
}