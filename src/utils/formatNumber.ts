export default function formatNumber(num: number) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 10000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}