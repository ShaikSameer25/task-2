import {
  List,
  Trash2,
  Move,
  Sparkles,
  FileEdit,
  UploadCloud,
} from "lucide-react";

const commands = [
  {
    icon: List,
    name: "LIST",
    usage: "/FolderName",
    desc: "Lists files in a folder.",
  },
  {
    icon: Sparkles,
    name: "SUMMARY",
    usage: "/FolderName",
    desc: "Summarises files in a folder.",
  },
  {
    icon: UploadCloud,
    name: "UPLOAD",
    usage: '/Folder file.txt "content"',
    desc: "Uploads a new file.",
  },
  {
    icon: Move,
    name: "MOVE",
    usage: "/From/file.pdf /To",
    desc: "Moves a file to another folder.",
  },
  {
    icon: FileEdit,
    name: "RENAME",
    usage: "/Folder/file.pdf new.pdf",
    desc: "Renames a file.",
  },
  {
    icon: Trash2,
    name: "DELETE",
    usage: "/Folder/file.pdf",
    desc: "Deletes a file.",
  },
];

export function CommandHelp() {
  return (
    <div className="mt-4 pt-4 border-t border-muted-foreground/20">
      <p className="text-sm font-medium mb-2">Available commands:</p>
      <ul className="space-y-2 text-sm">
        {commands.map((cmd) => (
          <li key={cmd.name} className="flex items-start gap-3">
            <cmd.icon className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">
                {cmd.name} <span className="font-normal text-muted-foreground">{cmd.usage}</span>
              </p>
              <p className="text-muted-foreground/80">{cmd.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
