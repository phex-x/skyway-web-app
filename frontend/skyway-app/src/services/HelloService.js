export const getGreetingByTime = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return "Доброе утро";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Добрый день";
    } else if (currentHour >= 18 && currentHour < 23) {
        return "Добрый вечер";
    } else {
        return "Доброй ночи";
    }
};