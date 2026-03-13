import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CasesContext = createContext(null)

// Cache key for localStorage
const CASES_CACHE_KEY = 'sentira_cases_cache'
const CASES_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get cached cases from localStorage
const getCachedCases = () => {
  try {
    const cached = localStorage.getItem(CASES_CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CASES_CACHE_DURATION) {
        return data
      }
    }
  } catch (e) {
    console.log('Cases cache read error:', e.message)
  }
  return null
}

// Save cases to localStorage cache
const saveCasesToCache = (cases) => {
  try {
    localStorage.setItem(CASES_CACHE_KEY, JSON.stringify({
      data: cases,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.log('Cases cache save error:', e.message)
  }
}

// Preload cases from API - called on app load
export const preloadCases = async () => {
  // Check cache first
  const cachedCases = getCachedCases()
  if (cachedCases) {
    return cachedCases
  }

  try {
    const response = await fetch('http://10.30.2.64:3001/api/cases')
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.cases) {
        const apiCases = data.cases.map(c => ({
          caseId: c.case_id,
          fullName: c.full_name,
          phone: c.phone,
          email: c.email,
          address: c.address,
          issueType: c.issue_type,
          description: c.description,
          idProof: c.id_proof,
          documents: c.documents,
          submittedAt: c.created_at,
          status: c.status || 'Pending'
        }))
        apiCases.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        saveCasesToCache(apiCases)
        return apiCases
      }
    }
  } catch (error) {
    console.log('Preload cases failed:', error.message)
  }
  
  // Fallback to localStorage
  try {
    const storedCases = localStorage.getItem('cases')
    if (storedCases) {
      return JSON.parse(storedCases)
    }
  } catch (e) {
    console.log('LocalStorage read error:', e.message)
  }
  
  return []
}

export function CasesProvider({ children }) {
  const [cases, setCases] = useState(() => getCachedCases() || [])
  const [isLoading, setIsLoading] = useState(() => getCachedCases() === null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch cases from API
  const fetchCases = useCallback(async (forceRefresh = false) => {
    // Return cached data immediately if available and not forcing refresh
    const cachedCases = getCachedCases()
    if (!forceRefresh && cachedCases) {
      setCases(cachedCases)
      setIsLoading(false)
      return cachedCases
    }

    // If already loading, don't fetch again
    if (isRefreshing) {
      return cases
    }

    setIsRefreshing(true)
    
    try {
      const response = await fetch('http://10.30.2.64:3001/api/cases')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.cases) {
          const apiCases = data.cases.map(c => ({
            caseId: c.case_id,
            fullName: c.full_name,
            phone: c.phone,
            email: c.email,
            address: c.address,
            issueType: c.issue_type,
            description: c.description,
            idProof: c.id_proof,
            documents: c.documents,
            submittedAt: c.created_at,
            status: c.status || 'Pending'
          }))
          apiCases.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          setCases(apiCases)
          saveCasesToCache(apiCases)
          localStorage.setItem('cases', JSON.stringify(apiCases))
          setIsLoading(false)
          return apiCases
        }
      }
    } catch (error) {
      console.log('Fetch cases error:', error.message)
    }

    // Fallback to localStorage
    try {
      const storedCases = localStorage.getItem('cases')
      if (storedCases) {
        const parsed = JSON.parse(storedCases)
        parsed.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        setCases(parsed)
      }
    } catch (e) {
      console.error('Error loading stored cases:', e)
    }
    
    setIsLoading(false)
    setIsRefreshing(false)
    return cases
  }, [cases, isRefreshing])

  // Add a new case
  const addCase = useCallback((newCase) => {
    const caseWithDate = {
      ...newCase,
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    }
    setCases(prevCases => {
      const updated = [caseWithDate, ...prevCases]
      saveCasesToCache(updated)
      return updated
    })
  }, [])

  // Refresh cases
  const refreshCases = useCallback(() => {
    return fetchCases(true)
  }, [fetchCases])

  // Initialize: load cached data immediately, then refresh in background
  useEffect(() => {
    const cached = getCachedCases()
    if (cached) {
      setCases(cached)
      setIsLoading(false)
      // Refresh in background
      fetchCases(true)
    } else {
      fetchCases()
    }
  }, [])

  const value = {
    cases,
    isLoading,
    fetchCases,
    addCase,
    refreshCases
  }

  return (
    <CasesContext.Provider value={value}>
      {children}
    </CasesContext.Provider>
  )
}

// Custom hook to use cases context
export const useCases = () => {
  const context = useContext(CasesContext)
  if (!context) {
    throw new Error('useCases must be used within a CasesProvider')
  }
  return context
}

export default CasesContext
