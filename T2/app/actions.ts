"use server";

import { summarizeFiles } from "@/ai/flows/summarize-files";
import { driveApi } from "@/lib/drive-api";
import type { CommandResponse } from "@/lib/types";

export async function handleCommand(
  input: string
): Promise<CommandResponse> {
  const [command, ...args] = input.trim().split(/\s+/);
  const upperCaseCommand = command.toUpperCase();

  try {
    switch (upperCaseCommand) {
      case "LIST": {
        const [folderPath] = args;
        if (!folderPath)
          return { success: false, message: "Usage: LIST /FolderName" };
        const message = driveApi.listFiles(folderPath);
        return { success: !message.startsWith("Error"), message };
      }

      case "DELETE": {
        const [filePath] = args;
        if (!filePath)
          return { success: false, message: "Usage: DELETE /FolderName/file.pdf" };
        const message = driveApi.deleteFile(filePath);
        return { success: !message.startsWith("Error"), message };
      }

      case "MOVE": {
        const [sourcePath, destPath] = args;
        if (!sourcePath || !destPath)
          return { success: false, message: "Usage: MOVE /SourceFolder/file.pdf /DestFolder" };
        const message = driveApi.moveFile(sourcePath, destPath);
        return { success: !message.startsWith("Error"), message };
      }

      case "RENAME": {
        const [oldPath, newName] = args;
        if (!oldPath || !newName)
          return { success: false, message: "Usage: RENAME /FolderName/file.pdf new_name.pdf" };
        const message = driveApi.renameFile(oldPath, newName);
        return { success: !message.startsWith("Error"), message };
      }

      case "UPLOAD": {
        const [folderPath, fileName, ...contentParts] = args;
        const content = contentParts.join(' ').replace(/"/g, '');
        if (!folderPath || !fileName) {
          return { success: false, message: 'Usage: UPLOAD /FolderName file.txt "file content"' };
        }
        const message = driveApi.uploadFile(folderPath, fileName, content);
        return { success: !message.startsWith("Error"), message };
      }

      case "SUMMARY": {
        const [folderPath] = args;
        if (!folderPath)
          return { success: false, message: "Usage: SUMMARY /FolderName" };
        
        const result = driveApi.getFilesContent(folderPath);

        if ('error' in result) {
            return { success: false, message: result.error };
        }

        if(result.contents.length === 0) {
            return { success: true, message: `No summarizable files (PDF, DOC, TXT) found in ${folderPath}.`};
        }

        const aiResponse = await summarizeFiles({
          folderPath: result.path,
          fileContents: result.contents,
        });

        return { success: true, message: `AI Summary for ${folderPath}:\n${aiResponse.summary}` };
      }

      default:
        return {
          success: false,
          message: `Unknown command: "${command}". Try one of the available commands.`,
        };
    }
  } catch (error) {
    console.error("Command failed:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
