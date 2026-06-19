import type { Config } from '@/payload-types'

type ID = Config['db']['defaultIDType']

type MealGroup = {
  breakfast?: boolean | null
  lunch?: boolean | null
  dinner?: boolean | null
}

type ActivityGroup = {
  distanceKm?: number | null
  durationHoursMax?: number | null
  durationHoursMin?: number | null
  elevationGainM?: number | null
  elevationLossM?: number | null
  type?: string | null
}

export const formatDifficulty = (value?: string | null) => {
  if (!value) return null

  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' - ')
}

export const formatCurrency = (amount?: number | null, currency = 'NPR') => {
  if (typeof amount !== 'number') return null

  try {
    return new Intl.NumberFormat('en', {
      currency,
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

export const getRegionLabel = (
  region?: ID | { name?: string | null; province?: ID | { name?: string | null } | null } | null,
) => {
  if (!region || typeof region !== 'object') return null

  const province = region.province
  const provinceName = province && typeof province === 'object' ? province.name : null

  return [region.name, provinceName].filter(Boolean).join(', ')
}

export const getMealLabels = (meals?: MealGroup | null) => {
  if (!meals) return []

  return [
    meals.breakfast ? 'Breakfast' : null,
    meals.lunch ? 'Lunch' : null,
    meals.dinner ? 'Dinner' : null,
  ].filter(Boolean) as string[]
}

export const getActivityFacts = (activity?: ActivityGroup | null) => {
  if (!activity) return []

  const duration =
    activity.durationHoursMin && activity.durationHoursMax
      ? `${activity.durationHoursMin}-${activity.durationHoursMax} hrs`
      : activity.durationHoursMin
        ? `${activity.durationHoursMin}+ hrs`
        : null

  return [
    activity.type ? activity.type.charAt(0).toUpperCase() + activity.type.slice(1) : null,
    duration,
    activity.distanceKm ? `${activity.distanceKm} km` : null,
    activity.elevationGainM ? `${activity.elevationGainM.toLocaleString()} m gain` : null,
    activity.elevationLossM ? `${activity.elevationLossM.toLocaleString()} m loss` : null,
  ].filter(Boolean) as string[]
}

export const getWhatsAppHref = ({
  message,
  number,
  title,
}: {
  message?: string | null
  number?: string | null
  title?: string | null
}) => {
  if (!number) return null

  const normalizedNumber = number.replace(/[^\d]/g, '')
  const text = message || `Hi, I am interested in ${title || 'this tour package'}.`

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(text)}`
}
