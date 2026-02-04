import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds
});

export default axiosInstance;
