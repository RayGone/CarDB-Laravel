/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.APP_URL, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axiosInstance;
