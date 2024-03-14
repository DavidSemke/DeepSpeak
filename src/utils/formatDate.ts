export function timeUntil(date: Date, expiryDate: Date): string {
    const diff = expiryDate.getTime() - date.getTime();
    const diffInDays = Math.round(diff / (1000 * 60 * 60 * 24));

    if (diffInDays >= 1) {
        return Math.floor(diffInDays) + 'd'
    }

    const diffInHours = Math.round(diffInDays * 24);

    if (diffInHours >= 1) {
        return Math.floor(diffInHours) + 'h'
    }

    const diffInMinutes = Math.round(diffInHours * 60);

    if (diffInMinutes >= 1) {
        return Math.floor(diffInMinutes) + 'm'
    }

    return '< 1m'
}