export type Episode = {
  id: number;
  slug: string;
  title: string;
  place: string;
  when: string;
  minutes: number;
  image: string;
  paragraphs: string[];
};

export type AfterSection = {
  title: string;
  paragraphs: string[];
};
