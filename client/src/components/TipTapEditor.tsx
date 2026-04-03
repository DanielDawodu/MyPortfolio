import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Heading1, Heading2, 
  Quote, Undo, Redo, Link as LinkIcon, 
  Image as ImageIcon, Youtube as VideoIcon, Loader2
} from "lucide-react";
import { useState, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addVideo = () => {
    const url = window.prompt("YouTube URL");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiRequest("POST", "/api/upload", formData);

      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
      toast({ title: "Media Uploaded", description: "Image inserted into article." });
    } catch (err) {
      toast({ 
        title: "Upload Failed", 
        description: "Please ensure you are logged in and Cloudinary keys are correct.",
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50 rounded-t-md">
      {/* ... prev buttons ... */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
        accept="image/*"
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-muted" : ""}
      >
        <Bold className="w-4 h-4" />
      </Button>
      {/* ... other formatting buttons ... */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-muted" : ""}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-muted" : ""}
      >
        <UnderlineIcon className="w-4 h-4" />
      </Button>
      <div className="w-[1px] h-6 bg-border mx-1" />
      
      {/* Heading / List buttons (keeping existing structure) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <div className="w-[1px] h-6 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <div className="w-[1px] h-6 bg-border mx-1" />
      
      {/* Media Buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addVideo}
      >
        <VideoIcon className="w-4 h-4" />
      </Button>
      
      <div className="w-[1px] h-6 bg-border mx-1" />
      <Button variant="ghost" size="sm" onClick={addLink} className={editor.isActive("link") ? "bg-muted" : ""}>
        <LinkIcon className="w-4 h-4" />
      </Button>
      <div className="flex-1" />
      {/* Undo/Redo */}
      <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}>
        <Undo className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function TipTapEditor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Youtube.configure({
        width: 480,
        height: 320,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px]",
      },
    },
  });

  return (
    <div className="border border-border rounded-md bg-card overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
