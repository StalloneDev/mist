export const safeInt = (val: any): number | null => {
    if (val === null || val === undefined || val === "") return null;
    const p = parseInt(val);
    return isNaN(p) ? null : p;
};

export const safeFloat = (val: any): number | null => {
    if (val === null || val === undefined || val === "") return null;
    const p = parseFloat(val);
    return isNaN(p) ? null : p;
};
