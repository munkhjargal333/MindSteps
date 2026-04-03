import { useState, useEffect, useCallback } from 'react'
import { Tier } from '@/types'

const DAILY_LIMITS: Record<Tier, number> = {
  demo: 3,
  free: 5,
  pro: Infinity,
}

interface RateLimitData {
  date: string   // 'YYYY-MM-DD'
  count: number
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getStorageKey(userId: string): string {
  return `mindsteps_rate_${userId}`
}

function loadData(userId: string): RateLimitData {
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    if (!raw) return { date: getTodayKey(), count: 0 }

    const data: RateLimitData = JSON.parse(raw)

    // Өдөр өөрчлөгдсөн бол тоолуурыг reset хийнэ
    if (data.date !== getTodayKey()) {
      return { date: getTodayKey(), count: 0 }
    }

    return data
  } catch {
    return { date: getTodayKey(), count: 0 }
  }
}

function saveData(userId: string, data: RateLimitData): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(data))
  } catch {
    // localStorage дүүрсэн тохиолдолд дуугүй алдаа
  }
}

interface UseRateLimitReturn {
  usageCount: number          // Өнөөдөр хэдэн удаа ашигласан
  limit: number               // Өдрийн хязгаар
  remaining: number           // Үлдсэн хүсэлт
  isLimited: boolean          // Хязгаарт хүрсэн эсэх
  increment: () => boolean    // Нэмэх — амжилттай бол true, хязгаарт хүрсэн бол false
  reset: () => void           // Dev зориулалттай reset
}

export function useRateLimit(userId: string, tier: Tier): UseRateLimitReturn {
  const [data, setData] = useState<RateLimitData>(() => loadData(userId))

  const limit = DAILY_LIMITS[tier]

  // userId өөрчлөгдвөл дахин уншина
  useEffect(() => {
    setData(loadData(userId))
  }, [userId])

  const increment = useCallback((): boolean => {
    // Pro tier — хязгаар байхгүй, үргэлж true
    if (tier === 'pro') return true

    const current = loadData(userId)

    if (current.count >= DAILY_LIMITS[tier]) {
      return false
    }

    const updated: RateLimitData = {
      date: getTodayKey(),
      count: current.count + 1,
    }

    saveData(userId, updated)
    setData(updated)
    return true
  }, [userId, tier])

  const reset = useCallback((): void => {
    const fresh: RateLimitData = { date: getTodayKey(), count: 0 }
    saveData(userId, fresh)
    setData(fresh)
  }, [userId])

  return {
    usageCount: data.count,
    limit: limit === Infinity ? 999 : limit,
    remaining: limit === Infinity ? 999 : Math.max(0, limit - data.count),
    isLimited: tier !== 'pro' && data.count >= limit,
    increment,
    reset,
  }
}