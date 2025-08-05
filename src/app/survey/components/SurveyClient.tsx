"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Survey.module.css';
import { Question, QuizResponse } from '@/app/lib/questions';
import { analyzeQuizResponses } from '@/app/lib/scoring';
import Image from 'next/image';

interface SurveyClientProps {
  questions: Question[];
}

const SurveyClient: React.FC<SurveyClientProps> = ({ questions }) => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizResponse>({});
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Handle radio button changes
  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers((prev: QuizResponse) => ({ ...prev, [questionId]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (questionId: string, values: string[]) => {
    setAnswers((prev: QuizResponse) => ({ ...prev, [questionId]: values }));
  };

  // Handle text input changes
  const handleTextChange = (questionId: string, value: string) => {
    setAnswers((prev: QuizResponse) => ({ ...prev, [questionId]: value }));
  };

  // Check if a conditional question should be shown
  const shouldShowQuestion = (question: Question) => {
    if (!question.conditional) return true;
    
    // Check if the conditional value exists in any previous answers
    const conditionalValue = question.conditional;
    for (const [key, value] of Object.entries(answers)) {
      if (Array.isArray(value) && value.includes(conditionalValue)) {
        return true;
      }
    }
    return false;
  };

  // Get visible questions based on conditionals
  const visibleQuestions = questions.filter(shouldShowQuestion);
  const currentVisibleIndex = visibleQuestions.findIndex(q => q.id === questions[currentQuestion].id);
  const actualProgress = ((currentVisibleIndex + 1) / visibleQuestions.length) * 100;

  // Handle next question
  const handleNext = () => {
    if (currentVisibleIndex < visibleQuestions.length - 1) {
      const nextQuestion = questions[currentQuestion + 1];
      if (shouldShowQuestion(nextQuestion)) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Skip conditional questions that don't apply
        setCurrentQuestion(currentQuestion + 2);
      }
    } else {
      // Show email modal on last question instead of submitting directly
      setShowEmailModal(true);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle email modal submission
  const handleEmailSubmit = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setShowEmailModal(false);
    await handleSubmit(email);
  };

  // Handle form submission
  const handleSubmit = async (userEmail?: string) => {
    setLoading(true);
    try {
      console.log('Starting analysis with answers:', answers);
      
      // Analyze the responses
      const analysis = analyzeQuizResponses(answers);
      console.log('Analysis result:', analysis);
      
      // Create results summary
      const results = {
        analysis: {
          primaryImbalance: analysis.primaryImbalance,
          secondaryImbalances: analysis.secondaryImbalances,
          confidenceLevel: analysis.confidenceLevel,
          explanations: analysis.explanations,
          scores: analysis.scores,
          totalScore: analysis.totalScore,
          cyclePhase: 'unknown' // We can add cycle tracking later
        },
        recommendations: [],
        cyclePhase: 'unknown',
        confidenceLevel: analysis.confidenceLevel,
        disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice.'
      };

      console.log('Submitting survey with data:', { answers, results });

      // Try to save the response, but if it fails, show results anyway
      try {
        const response = await fetch('/api/save-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surveyData: answers,
            results,
            email: userEmail || null,
            timestamp: new Date().toISOString()
          })
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const responseData = await response.json();
          console.log('Response data:', responseData);
          router.push(`/results?responseId=${responseData.responseId}`);
          return;
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Server error:', errorData);
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
      }

      // If we get here, either the save failed or Redis is not available
      // Show results without saving
      console.log('Showing results without saving to database');
      const encodedData = encodeURIComponent(JSON.stringify(results));
      router.push(`/results?responseId=temp_${Date.now()}&temp=true&data=${encodedData}`);
      
    } catch (error) {
      console.error('Error in analysis:', error);
      alert(`There was an error analyzing your responses: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];

  // Render the current question
  const renderQuestion = () => {
    if (!currentQ) return null;

    switch (currentQ.type) {
      case 'radio':
        return (
          <div className={styles.optionsContainer}>
            {currentQ.options?.map((option) => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option.value}
                  checked={answers[currentQ.id] === option.value}
                  onChange={(e) => handleRadioChange(currentQ.id, e.target.value)}
                />
                <span className={styles.optionText}>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={styles.optionsContainer}>
            {currentQ.options?.map((option) => (
              <label key={option.value} className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(answers[currentQ.id]) && 
                    (answers[currentQ.id] as string[]).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(answers[currentQ.id]) 
                      ? (answers[currentQ.id] as string[]) 
                      : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleCheckboxChange(currentQ.id, newValues);
                  }}
                />
                <span className={styles.optionText}>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className={styles.textContainer}>
            <textarea
              className={styles.textInput}
              placeholder="Share your thoughts here..."
              value={answers[currentQ.id] as string || ''}
              onChange={(e) => handleTextChange(currentQ.id, e.target.value)}
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQ.id];
    if (!answer) return false;
    
    if (currentQ.type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    if (currentQ.type === 'text') {
      return currentQ.optional || (typeof answer === 'string' && answer.trim().length > 0);
    }
    
    return true;
  };

  if (!currentQ) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/Logo.png"
            alt="Hormone Health Platform Logo"
            width={100}
            height={50}
            style={{
              width: 'auto',
              height: '50px'
            }}
            priority
          />
        </div>
        <h1 className={styles.title}>Hormone Health Assessment</h1>
        <div style={{ width: '100px' }}></div> {/* Spacer for centering */}
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${((currentVisibleIndex + 1) / visibleQuestions.length) * 100}%` }}
          ></div>
        </div>
        <span className={styles.progressText}>
          Question {currentVisibleIndex + 1} of {visibleQuestions.length}
        </span>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.questionContainer}>
          <h2 className={styles.question}>{currentQ.question}</h2>
          {renderQuestion()}
        </div>
      </div>

      <div className={styles.navigation}>
        {currentQuestion > 0 ? (
          <>
            <button
              onClick={handlePrevious}
              className={styles.previousButton}
              disabled={loading}
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              className={styles.nextButton}
              disabled={!isCurrentQuestionAnswered() || loading}
            >
              {currentVisibleIndex === visibleQuestions.length - 1 ? 
                (loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Analyzing</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', animation: 'bounce 1s infinite' }}></div>
                      <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></div>
                      <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></div>
                    </div>
                  </div>
                ) : 'Get Results') : 
                'Next →'
              }
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className={styles.nextButton}
            disabled={!isCurrentQuestionAnswered() || loading}
          >
            Next →
          </button>
        )}
      </div>

      <div className={styles.disclaimer}>
        This assessment is for informational purposes only and should not replace professional medical advice.
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.emailModal}>
            <h3 className={styles.modalTitle}>Please enter your email to view your results.</h3>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleEmailSubmit();
                }
              }}
              className={styles.emailInput}
            />
            {emailError && <p className={styles.emailError}>{emailError}</p>}
            <button
              onClick={handleEmailSubmit}
              className={styles.emailSubmitButton}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit & View Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyClient; 