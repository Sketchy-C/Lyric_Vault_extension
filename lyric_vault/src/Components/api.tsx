
import axios from 'axios';

const fetchTranscript = async (videoId: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/transcript//?videoId=${videoId}`);
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch transcript '+ err);
  }
};

export { fetchTranscript };
