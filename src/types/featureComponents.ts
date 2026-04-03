import type { User, Post, categoriesListResponse } from "./api";

type Category = categoriesListResponse["data"][number];

export interface PostItemProps {
  post: Post;
  postNumber: number;
  canModify?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export interface PostEditorProps {
  threadId: string;
  onPostCreated?: () => void;
}

export interface PostListProps {
  threadId: string;
}

export interface ThreadListProps {
  categorySlug: string;
}

export interface ThreadEditorProps {
  onThreadCreated?: () => void;
  onClose?: () => void;
  categorySlug?: string;
}

export interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export interface CategoryDeleteModalProps {
  category: Category | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  loading: boolean;
  title: string;
  submitLabel: string;
  initialName?: string;
  initialDescription?: string;
}

export interface ProfileInfoProps {
  user: User;
  loading: boolean;
  onUpdate: (data: { email: string }) => Promise<void>;
}

export interface ProfileDangerProps {
  loading: boolean;
  onDelete: () => void;
}

export interface UserStatusProps {
  // No props - component uses auth context
}
