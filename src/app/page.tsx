import React from 'react';
import { getExperiences } from '@/lib/actions/experiences';
import ExperiencesList from '@/components/ExperiencesList';

export default async function ExperiencesPage() {
  const initialData = await getExperiences();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Turneo Experiences</h1>
      <ExperiencesList initialData={initialData} />
    </div>
  );
} 