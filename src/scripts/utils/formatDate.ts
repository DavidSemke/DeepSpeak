export function timeUntil(date: Date, expiryDate: Date): string {
    const newDate = new Date(date)
    const newExpiryDate = new Date(expiryDate)
    const diff = newExpiryDate.getTime() - newDate.getTime()
    const diffInDays = Math.round(diff / (1000 * 60 * 60 * 24))

    if (diffInDays >= 1) {
        return Math.floor(diffInDays) + 'd'
    }

    const diffInHours = Math.round(diffInDays * 24)

    if (diffInHours >= 1) {
        return Math.floor(diffInHours) + 'h'
    }

    const diffInMinutes = Math.round(diffInHours * 60)

    if (diffInMinutes >= 1) {
        return Math.floor(diffInMinutes) + 'm'
    }

    return '< 1m'
}

export function wordTimestamp(date: Date) {
    return new Date(date).toLocaleDateString(
        'default', 
        { 
            weekday: 'short', 
            month: 'short',
            day: 'numeric'
        }
    )
}