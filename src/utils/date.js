export const futureDate = daysAhead => {
    const today = new Date();
    today.setDate(today.getDate + daysAhead);
    return today;
}