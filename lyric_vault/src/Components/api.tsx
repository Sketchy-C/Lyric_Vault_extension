
import axios from 'axios';

const fetchTranscript = async (videoId: string) => {
  try {
    const response = await axios.get(`https://lyric-vault.onrender.com/api/transcript/?videoId=${videoId}`);
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch transcript '+ err);
  }
};

export { fetchTranscript };
