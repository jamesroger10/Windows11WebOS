export type FileType = 'folder' | 'file';

export interface FSItem {
  id: string;
  name: string;
  type: FileType;
  extension?: string;
  size?: number; // bytes
  sizeFormatted?: string;
  modified: string;
  parentId: string | null;
  content?: string;
  icon?: string;
  isSystem?: boolean;
}

export interface ExplorerTab {
  id: string;
  currentFolderId: string;
  history: string[]; // folderIds
  historyIndex: number;
  searchQuery: string;
  viewMode: 'grid' | 'details' | 'list';
  sortBy: 'name' | 'modified' | 'type' | 'size';
  sortOrder: 'asc' | 'desc';
}
