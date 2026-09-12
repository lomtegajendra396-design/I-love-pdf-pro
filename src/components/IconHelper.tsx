import React from 'react';
import {
  Combine,
  Scissors,
  Minimize2,
  FileText,
  Table,
  Presentation,
  FileCheck,
  Sheet,
  Tv2,
  Image,
  Images,
  FileImage,
  RotateCw,
  Stamp,
  Hash,
  Unlock,
  Lock,
  Eye,
  Globe,
  Wrench,
  Info,
  LayoutGrid,
  FolderOutput,
  FileQuestion,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Combine,
  Scissors,
  Minimize2,
  FileText,
  Table,
  Presentation,
  FileCheck,
  Sheet,
  Tv2,
  Image,
  Images,
  FileImage,
  RotateCw,
  Stamp,
  Hash,
  Unlock,
  Lock,
  Eye,
  Globe,
  Wrench,
  Info,
  LayoutGrid,
  FolderOutput,
};

interface IconHelperProps extends LucideProps {
  name: string;
}

export const ToolIcon: React.FC<IconHelperProps> = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name] || FileQuestion;
  return <IconComponent {...props} />;
};
