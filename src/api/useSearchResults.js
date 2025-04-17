import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/kcisa';
const SERVICE_KEY = '356b0d91-82e9-43e0-b690-b78a982ec774';

function useSearchResults(keyword) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!keyword) {
      setData([]);
      setHasSearched(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const response = await axios.get(API_BASE_URL, {
          params: {
            serviceKey: SERVICE_KEY,
            numOfRows: 100,
            pageNo: 1,
            keyword,
          },
          headers: {
            Accept: 'application/json',
          },
        });

        const items = response.data?.response?.body?.items?.item || [];

        const filteredItems = items.filter(item =>
          item.TITLE?.toLowerCase().includes(keyword.toLowerCase())
        );
        
        console.log("🔍 필터된 원본 item:", filteredItems);

        const processedItems = filteredItems.map(item => ({
          title: item.TITLE || '제목 없음',
          image: item.IMAGE_OBJECT || null,
          genre: item.GENRE || '장르 없음',
          audience: item.AUDIENCE || '연령 정보 없음',
          period: item.PERIOD || '기간 정보 없음',
          eventPeriod: item.EVENT_PERIOD || '정보 없음',
          charge: item.CHARGE || '요금 정보 없음', 
          description: item.DESCRIPTION || '설명 없음',
          url: item.URL || '', 
        }));
        

        setData(processedItems);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);


  return { data, loading, hasSearched };
}

export default useSearchResults;
