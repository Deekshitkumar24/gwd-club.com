import { MetadataRoute } from 'next';
import { PROJECTS, UPCOMING_EVENTS, NINE_LEADERS, DISCIPLINES } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gwd-club.com';
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/work`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/events`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/team`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/explore`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/collaborations`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/collaborate`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/workflow`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/join`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/connect`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${baseUrl}/work/${project.id}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = UPCOMING_EVENTS.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const teamRoutes: MetadataRoute.Sitemap = NINE_LEADERS.map((leader) => ({
    url: `${baseUrl}/team/${leader.id}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const domainRoutes: MetadataRoute.Sitemap = DISCIPLINES.map((discipline) => ({
    url: `${baseUrl}/explore?domain=${discipline.index}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...eventRoutes, ...teamRoutes, ...domainRoutes];
}
