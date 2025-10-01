export type Message = {
  id: string;
  role: "user" | "system" | "loading";
  content: React.ReactNode;
  type?: "command-help";
};

export type DriveFile = {
  id: string;
  name: string;
  content: string;
  type: "PDF" | "DOC" | "TXT";
};

export type DriveFolder = {
  id:string;
  name: string;
  files: DriveFile[];
};

export type FileSystem = { [key: string]: DriveFolder };

export type CommandResponse = {
  success: boolean;
  message: string;
};
