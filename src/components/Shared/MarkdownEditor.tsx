import React, { useState } from "react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdInsertLink,
} from "react-icons/md";
import MarkdownDisplay from "./MarkdownDisplay";
import type { MarkdownEditorProps } from "../../types/sharedComponents";
import "./MarkdownEditor.scss";

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content here... (Markdown supported)",
  disabled = false,
  showPreview = true,
}) => {
  const [showPreviewPane, setShowPreviewPane] = useState(showPreview);

  const applyFormatting = (
    before: string,
    after: string,
    selectedText?: string,
  ) => {
    const textarea = document.querySelector(
      ".markdown-editor-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || selectedText || "text";

    const newText =
      text.substring(0, start) +
      before +
      selected +
      after +
      text.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + before.length + selected.length;
    }, 0);
  };

  const insertBlock = (block: string) => {
    const textarea = document.querySelector(
      ".markdown-editor-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;
    const newText = text.substring(0, start) + block + text.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + block.length;
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: MdFormatBold,
      tooltip: "Bold (Ctrl+B)",
      onClick: () => applyFormatting("**", "**", "bold text"),
      shortcut: "b",
    },
    {
      icon: MdFormatItalic,
      tooltip: "Italic (Ctrl+I)",
      onClick: () => applyFormatting("*", "*", "italic text"),
      shortcut: "i",
    },
    {
      icon: MdCode,
      tooltip: "Code (Ctrl+`)",
      onClick: () => applyFormatting("`", "`", "code"),
      shortcut: "`",
    },
    {
      icon: MdFormatListBulleted,
      tooltip: "Bullet List",
      onClick: () => insertBlock("\n- "),
    },
    {
      icon: MdFormatListNumbered,
      tooltip: "Numbered List",
      onClick: () => insertBlock("\n1. "),
    },
    {
      icon: MdInsertLink,
      tooltip: "Link",
      onClick: () => applyFormatting("[", "](url)", "link text"),
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          applyFormatting("**", "**", "bold text");
          break;
        case "i":
          e.preventDefault();
          applyFormatting("*", "*", "italic text");
          break;
        case "`":
          e.preventDefault();
          applyFormatting("`", "`", "code");
          break;
        default:
          break;
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + "  " + text.substring(end);
      onChange(newText);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="markdown-editor">
      <div className="editor-toolbar">
        {toolbarButtons.map((btn, idx) => {
          const Icon = btn.icon;
          return (
            <button
              key={idx}
              className="toolbar-button"
              onClick={btn.onClick}
              disabled={disabled}
              title={btn.tooltip}
              type="button"
              aria-label={btn.tooltip}
            >
              <Icon size={20} />
            </button>
          );
        })}
        {showPreview && <div className="toolbar-divider" />}
        {showPreview && (
          <button
            className={`toolbar-button preview-toggle ${showPreviewPane ? "active" : ""}`}
            onClick={() => setShowPreviewPane(!showPreviewPane)}
            type="button"
            title="Toggle Preview"
            aria-label="Toggle Preview"
          >
            {showPreviewPane ? "Hide" : "Show"} Preview
          </button>
        )}
      </div>

      <div className={`editor-container ${showPreviewPane ? "split" : "full"}`}>
        <div className="editor-area">
          <textarea
            className="markdown-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>

        {showPreviewPane && (
          <div className="preview-area">
            <div className="preview-header">Preview</div>
            <div className="preview-content">
              <MarkdownDisplay content={value} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
