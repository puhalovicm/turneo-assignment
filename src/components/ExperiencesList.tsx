'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TurneoPaginatedResponse, TurneoApiError } from '@/lib/turneo-api';
import { useExperiences } from '@/lib/hooks/use-experiences';
import { APP_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ExperiencesListProps {
  initialData: TurneoPaginatedResponse | TurneoApiError;
}

export default function ExperiencesList({ initialData }: ExperiencesListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: result, isLoading, refetch } = useExperiences({
    page: currentPage
  });

  const displayData = result || initialData;
  const isError = 'success' in displayData && !displayData.success;

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (displayData && 'count' in displayData && displayData.count) {
      const totalPages = Math.ceil(displayData.count / APP_CONFIG.PAGINATION.DEFAULT_EXPERIENCES_LIMIT);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    refetch();
  };

  const totalPages = displayData && 'count' in displayData && displayData.count 
    ? Math.ceil(displayData.count / APP_CONFIG.PAGINATION.DEFAULT_EXPERIENCES_LIMIT) 
    : 0;
  const startPage = Math.max(1, currentPage - Math.floor(APP_CONFIG.PAGINATION.MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + APP_CONFIG.PAGINATION.MAX_VISIBLE_PAGES - 1);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <>
      {isError && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">
              <strong>Error:</strong> {isError ? (displayData as TurneoApiError).message : 'Unknown error'}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex items-center gap-2">
        <Button
          onClick={handlePrev}
          disabled={isLoading || currentPage <= 1}
          variant="outline"
        >
          Previous
        </Button>

        {visiblePages.map((page) => (
          <Button
            key={page}
            onClick={() => handlePageClick(page)}
            disabled={isLoading}
            variant={page === currentPage ? "default" : "outline"}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={handleNext}
          disabled={isLoading || !displayData || currentPage >= totalPages}
          variant="outline"
        >
          Next
        </Button>

        {displayData && 'count' in displayData && (
          <span className="ml-4 text-gray-600 text-sm">
            Page {currentPage} of {totalPages} ({displayData.count} total items)
          </span>
        )}
      </div>

      <div className="mb-6">
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayData && 'results' in displayData && Array.isArray(displayData.results) && displayData.results.length > 0 ? (
        <div className="space-y-4">
          {displayData.results.map((experience) => (
            <Link
              key={experience.id}
              href={`/${experience.id}`}
              className="block"
            >
              <Card className="hover:bg-blue-50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-blue-700 hover:underline">
                    {experience.name}
                  </CardTitle>
                  {experience.description && (
                    <CardDescription className="line-clamp-2">
                      {experience.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 space-x-4">
                    <span>ID: {experience.id}</span>
                    {experience.minPrice && (
                      <span>
                        Price: {experience.minPrice.amount} {experience.minPrice.currency}
                      </span>
                    )}
                    {experience.location && (
                      <span>
                        Location: {typeof experience.location === 'object'
                          ? ('city' in experience.location && 'country' in experience.location)
                            ? `${(experience.location as { city?: string; country?: string }).city ?? ''}, ${(experience.location as { city?: string; country?: string }).country ?? ''}`
                            : JSON.stringify(experience.location)
                          : experience.location}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center">No experiences found.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
} 