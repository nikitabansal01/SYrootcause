import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ResultsClient from './components/ResultsClient';
import { getResponseData } from '../lib/data';

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ responseId?: string; temp?: string; data?: string }>;
}) {
  const { responseId, temp, data } = await searchParams;
  
  if (!responseId) {
    notFound();
  }

  try {
    // If this is a temporary response (Redis not available), use data from URL
    if (temp === 'true' && data) {
      try {
        const resultsData = JSON.parse(decodeURIComponent(data));
        const mockData = {
          id: responseId,
          surveyData: {},
          results: resultsData,
          email: null,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <ResultsClient initialData={mockData} />
          </Suspense>
        );
      } catch (error) {
        console.error('Error parsing temporary data:', error);
        notFound();
      }
    }

    // 서버에서 초기 데이터 가져오기
    const initialData = await getResponseData(responseId);
    
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResultsClient initialData={initialData} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching response data:', error);
    notFound();
  }
} 