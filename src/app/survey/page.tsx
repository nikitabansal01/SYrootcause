import SurveyClient from './components/SurveyClient';
import { quizQuestions } from '@/app/lib/questions';

export default function SurveyPage() {
  return <SurveyClient questions={quizQuestions} />;
} 