export const artistBio = "Matt Silliman is an Atlanta house music DJ and producer who has been behind the decks since 1996. His sets move from deep, soulful grooves to high-energy tech house, connected by warmth, vocals, and a feel for the people on the dance floor.\n\nRaised in Decatur, Matt came up through Atlanta's house music scene, with residencies at Karma and Eleven50 and performances across the city and beyond. That history shapes how he plays today: with room for discovery, familiar faces, and people finding house music for the first time.\n\nThrough Feelgood House and events including Captains of Revelry and Beats on the Lake, he brings people together around music with soul. The idea is simple: a welcoming dance floor, a shared groove, and a night that feels good to be part of.\n\nAway from the booth, Matt produces original music, with releases including Hot Mess, Hurt, and Afterglow. He is also a production leader in advertising, bringing the same attention to collaboration and audience connection to both sides of his work.";

// Replace the retired promotional bio while preserving future CMS edits.
export function resolveArtistBio(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  return !text || /fastest[- ]rising/i.test(text) ? artistBio : text;
}
