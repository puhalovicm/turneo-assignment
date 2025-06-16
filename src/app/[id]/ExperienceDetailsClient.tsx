'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TurneoExperience } from '@/lib/turneo-api';
import ExperienceBookingClient from './ExperienceBookingClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ExperienceDetailsClientProps {
  experience: TurneoExperience;
  partnerId: string;
}

export default function ExperienceDetailsClient({ experience, partnerId }: ExperienceDetailsClientProps) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Experiences
        </Link>
      </div>

      <Card className="overflow-hidden">
        {experience.images && experience.images.length > 0 && (
          <div className="relative h-64 bg-gray-200">
            <Image
              src={experience.images[0].urlHigh}
              alt={experience.images[0].altText || experience.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {experience.name}
          </CardTitle>
            {experience.description && (
            <CardDescription className="text-lg leading-relaxed">
                {experience.description}
            </CardDescription>
            )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experience.location && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-gray-600">
                  {typeof experience.location === 'object'
                    ? ('city' in experience.location && 'country' in experience.location)
                      ? `${(experience.location as { city?: string; country?: string }).city ?? ''}, ${(experience.location as { city?: string; country?: string }).country ?? ''}`
                      : JSON.stringify(experience.location)
                    : experience.location}
                </p>
                </CardContent>
              </Card>
            )}

            {experience.minPrice && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Starting Price</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {experience.minPrice.amount} {experience.minPrice.currency}
                </p>
                </CardContent>
              </Card>
            )}

            {experience.duration && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Duration</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-gray-600">{experience.duration}</p>
                </CardContent>
              </Card>
            )}

            {experience.categories && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{experience.categories.type}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {experience.highlight && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Highlight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{experience.highlight}</p>
              </CardContent>
            </Card>
          )}

          {experience.included && experience.included.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {experience.included.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {typeof item === 'object' && item !== null && 'name' in item 
                        ? (item as { name: string }).name 
                        : String(item)}
                    </li>
                ))}
              </ul>
              </CardContent>
            </Card>
          )}

          {experience.excluded && experience.excluded.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What&apos;s Not Included</CardTitle>
              </CardHeader>
              <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {experience.excluded.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {typeof item === 'object' && item !== null && 'name' in item 
                        ? (item as { name: string }).name 
                        : String(item)}
                    </li>
                ))}
              </ul>
              </CardContent>
            </Card>
          )}

          {experience.meetingPoints && experience.meetingPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meeting Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experience.meetingPoints.map((meetingPoint) => (
                    <div key={meetingPoint.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{meetingPoint.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{meetingPoint.description}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Address:</span> {meetingPoint.address}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">City:</span> {meetingPoint.city}, {meetingPoint.country}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Type:</span> {meetingPoint.type}
                            </p>
                            {meetingPoint.timeBeforeStart && (
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Arrive:</span> {meetingPoint.timeBeforeStart} minutes before start
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            meetingPoint.type === 'CENTRAL_MEETING_POINT' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {meetingPoint.type === 'CENTRAL_MEETING_POINT' ? 'Central' : 'Pickup'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setShowBooking(!showBooking)}
                size="lg"
              >
                {showBooking ? 'Hide Booking' : 'Book This Experience'}
              </Button>
            </div>

            {showBooking && (
              <div className="mt-6">
                <ExperienceBookingClient experienceId={experience.id} experience={experience} partnerId={partnerId} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 