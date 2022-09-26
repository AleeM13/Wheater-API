const key = '98d9567f78a7934d8b23985ac316f192';

const requestCity = async(city) => {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    const query = `?q=${city}&appid=${key}`

    try {
        const response = await fetch(baseUrl + query);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}