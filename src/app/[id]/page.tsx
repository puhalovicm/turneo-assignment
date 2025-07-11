import { fetchExperienceById, TurneoExperience } from '@/lib/turneo-api';
import ExperienceDetailsClient from "./ExperienceDetailsClient";
import { Metadata } from 'next';

interface ExperienceDetailsPageProps {
  params: Promise<{ id: string }>;
}

function isTurneoExperience(obj: unknown): obj is TurneoExperience {
  return obj !== null && typeof obj === 'object' && 'id' in obj && 'name' in obj;
}

export async function generateMetadata({ params }: ExperienceDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const experience = await fetchExperienceById(id);
  
  if (!isTurneoExperience(experience)) {
    return {
      title: 'Experience Not Found - Turneo Experiences',
    };
  }
  
  return {
    title: `${experience.name} - Turneo Experiences`,
    description: experience.description || `Book ${experience.name} with Turneo`,
  };
}

export default async function ExperienceDetailsPage({ params }: ExperienceDetailsPageProps) {
  const { id } = await params;
  const partnerId = process.env.NEXT_PUBLIC_PARTNER_ID!;
  const experience = await fetchExperienceById(id);
  
  if (!isTurneoExperience(experience)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Failed to load experience details
        </div>
      </div>
    );
  }

  return <ExperienceDetailsClient experience={experience} partnerId={partnerId} />;
} 