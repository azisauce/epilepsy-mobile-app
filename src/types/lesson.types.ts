export interface Theme {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  themeId: string;
  title: string;
  description: string;
  content: LessonContent;
  coverImage?: string;
  order: number;
  tags?: string[];
}

export interface LessonContent {
  data: string | VideoContent;
}

export interface VideoContent {
  url: string;
  thumbnail?: string;
  duration: number;
}

export interface UserLessonHistory {
  userId: string;
  lastLesson?: Lesson
}