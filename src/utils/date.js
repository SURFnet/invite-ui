export const futureDate = daysAhead => {
    const today = new Date();
    const time = today.getTime() + (1000 * 60 * 60 * 24 * daysAhead);
    return new Date(time);
}

export const formatDate = epoch => {
    const date = new Date(epoch * 1000);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-EN", options);
}

export const isExpired = epoch => {
    const now = new Date().getTime() / 1000;
    return now > epoch;
}