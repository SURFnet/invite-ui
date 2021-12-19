export const futureDate = daysAhead => {
    const today = new Date();
    today.setDate(today.getDate + daysAhead);
    return today;
}

export const formatDate = epoch => {
    const date = new Date(epoch * 1000);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-EN", options);

}