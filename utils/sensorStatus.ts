export function getGasStatus(value: number) {
    if (value >= 4000) return "danger";
    // if (value >= 400) return "warning";
    return "normal";
}

export function getTemperatureStatus(value: number) {
    if (value >= 50) return "danger";
    if (value >= 40) return "warning";
    return "normal";
}

export function getFireStatus(value: number) {
    return value > 0 ? "danger" : "normal";
} 