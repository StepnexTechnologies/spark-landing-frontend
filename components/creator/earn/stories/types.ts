export interface StoryConfig {
  id: number;
  duration: number; // in milliseconds
  component: React.ComponentType;
}

export interface StoriesContainerProps {
  onComplete: () => void;
  stories: StoryConfig[];
}

export interface StoryPanelProps {
  currentIndex: number;
  totalStories: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  children: React.ReactNode;
  isPaused: boolean;
  onPauseChange: (paused: boolean) => void;
}

export interface StoryProgressBarProps {
  currentIndex: number;
  totalStories: number;
  progress: number;
}
