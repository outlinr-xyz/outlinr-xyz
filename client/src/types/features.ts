export interface Feature {
  name: string;
  imageSrc: string;
  gifSrc?: string;
  description?: string;
}

export interface FeatureButtonProps {
  feature: Feature;
  onClick: (feature: Feature) => void;
}

export interface FeatureDialogContentProps {
  selectedFeature: Feature | null;
}
