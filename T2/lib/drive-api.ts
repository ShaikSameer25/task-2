import type { FileSystem, DriveFile, DriveFolder } from "./types";

// In-memory file system to mock Google Drive
let fileSystem: FileSystem = {
  "/": {
    id: "root",
    name: "/",
    files: [],
  },
  "/Reports": {
    id: "folder-1",
    name: "/Reports",
    files: [
      { id: "file-1", name: "Q1_report.pdf", type: "PDF", content: "This is the Q1 financial report. Profits are up 20%." },
      { id: "file-2", name: "meeting_notes.txt", type: "TXT", content: "Project Phoenix kickoff meeting notes. Key takeaway: align on marketing strategy." },
    ],
  },
  "/Archive": {
    id: "folder-2",
    name: "/Archive",
    files: [],
  },
  "/Shared": {
    id: "folder-3",
    name: "/Shared",
    files: [
      { id: "file-3", name: "presentation.doc", type: "DOC", content: "Draft slides for the upcoming all-hands meeting." },
    ],
  },
};

const findFile = (filePath: string): { folder: DriveFolder | null; file: DriveFile | null; fileIndex: number, folderPath: string } => {
  const parts = filePath.split('/').filter(p => p);
  if (parts.length < 2) return { folder: null, file: null, fileIndex: -1, folderPath: '' };
  
  const fileName = parts.pop()!;
  const folderPath = `/${parts.join('/')}`;
  const folder = fileSystem[folderPath];
  
  if (!folder) return { folder: null, file: null, fileIndex: -1, folderPath };

  const fileIndex = folder.files.findIndex(f => f.name === fileName);
  if (fileIndex === -1) return { folder: folder, file: null, fileIndex: -1, folderPath };

  return { folder, file: folder.files[fileIndex], fileIndex, folderPath };
};


export const driveApi = {
  listFiles: (folderPath: string): string => {
    const folder = fileSystem[folderPath];
    if (!folder) return `Error: Folder "${folderPath}" not found.`;
    if (folder.files.length === 0) return `Folder "${folderPath}" is empty.`;
    return `Files in ${folderPath}:\n- ${folder.files.map(f => f.name).join("\n- ")}`;
  },

  deleteFile: (filePath: string): string => {
    const { folder, file, fileIndex } = findFile(filePath);
    if (!folder) return `Error: Folder for path "${filePath}" not found.`;
    if (!file) return `Error: File "${filePath}" not found.`;
    
    folder.files.splice(fileIndex, 1);
    return `Successfully deleted "${filePath}".`;
  },

  renameFile: (oldFilePath: string, newFileName: string): string => {
    const { folder, file } = findFile(oldFilePath);
    if (!folder) return `Error: Folder for path "${oldFilePath}" not found.`;
    if (!file) return `Error: File "${oldFilePath}" not found.`;

    const oldName = file.name;
    file.name = newFileName;
    return `Successfully renamed "${oldName}" to "${newFileName}".`;
  },

  moveFile: (sourcePath: string, destFolderPath: string): string => {
    const { folder: sourceFolder, file, fileIndex } = findFile(sourcePath);
    if (!sourceFolder) return `Error: Source folder for path "${sourcePath}" not found.`;
    if (!file) return `Error: File "${sourcePath}" not found.`;
    
    const destFolder = fileSystem[destFolderPath];
    if (!destFolder) return `Error: Destination folder "${destFolderPath}" not found.`;
    if(sourceFolder.id === destFolder.id) return `Error: Source and destination folders are the same.`;

    destFolder.files.push(file);
    sourceFolder.files.splice(fileIndex, 1);
    return `Successfully moved "${file.name}" from "${sourceFolder.name}" to "${destFolderPath}".`;
  },

  uploadFile: (folderPath: string, fileName: string, content: string): string => {
    const folder = fileSystem[folderPath];
    if (!folder) return `Error: Folder "${folderPath}" not found.`;
    
    const extension = fileName.split('.').pop()?.toUpperCase() as DriveFile['type'] | undefined;
    const type = ['PDF', 'DOC', 'TXT'].includes(extension || '') ? extension! : 'TXT';

    const newFile: DriveFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      type,
      content,
    };
    folder.files.push(newFile);
    return `Successfully uploaded "${fileName}" to "${folderPath}".`;
  },
  
  getFilesContent: (folderPath: string): { path: string; contents: string[] } | { error: string } => {
    const folder = fileSystem[folderPath];
    if (!folder) return { error: `Folder "${folderPath}" not found.` };
    if (folder.files.length === 0) return { error: `Folder "${folderPath}" is empty.` };

    const contents = folder.files
      .filter(file => ['PDF', 'DOC', 'TXT'].includes(file.type))
      .map(file => `File: ${file.name}\nContent: ${file.content}`);
      
    return { path: folderPath, contents };
  },
};
