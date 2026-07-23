'use client';

import { useState } from 'react';

export default function BlockEditor({ block, onChange, onRemove }) {
  const [showOptions, setShowOptions] = useState(false);

  const handleDataChange = (key, value) => {
    onChange({
      ...block,
      data: { ...block.data, [key]: value },
    });
  };

  const renderBlockEditor = () => {
    switch (block.type) {
      case 'header':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Header Text
            </label>
            <input
              type="text"
              value={block.data.text || ''}
              onChange={(e) => handleDataChange('text', e.target.value)}
              className="input-field"
              placeholder="Enter header text"
            />
          </div>
        );

      case 'paragraph':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paragraph Text
            </label>
            <textarea
              value={block.data.text || ''}
              onChange={(e) => handleDataChange('text', e.target.value)}
              rows="4"
              className="input-field"
              placeholder="Enter paragraph text"
            />
          </div>
        );

      case 'richtext':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rich Text HTML
            </label>
            <textarea
              value={block.data.html || ''}
              onChange={(e) => handleDataChange('html', e.target.value)}
              rows="6"
              className="input-field font-mono text-sm"
              placeholder="Enter HTML content"
            />
          </div>
        );

      case 'list':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              List Items (one per line)
            </label>
            <textarea
              value={(block.data.items || []).join('\n')}
              onChange={(e) =>
                handleDataChange('items', e.target.value.split('\n').filter((item) => item.trim()))
              }
              rows="4"
              className="input-field"
              placeholder="Enter list items"
            />
          </div>
        );

      case 'equation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LaTeX Equation
              </label>
              <textarea
                value={block.data.equation || ''}
                onChange={(e) => handleDataChange('equation', e.target.value)}
                rows="3"
                className="input-field font-mono text-sm"
                placeholder="e.g., x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={block.data.displayMode || false}
                onChange={(e) => handleDataChange('displayMode', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Display Mode (Block)</label>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headers (comma-separated)
              </label>
              <input
                type="text"
                value={(block.data.headers || []).join(', ')}
                onChange={(e) =>
                  handleDataChange('headers', e.target.value.split(',').map((h) => h.trim()))
                }
                className="input-field"
                placeholder="Column 1, Column 2, Column 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rows (format: col1|col2|col3 for each row, one per line)
              </label>
              <textarea
                value={(block.data.rows || []).map((row) => row.join('|')).join('\n')}
                onChange={(e) =>
                  handleDataChange(
                    'rows',
                    e.target.value
                      .split('\n')
                      .map((row) => row.split('|').map((cell) => cell.trim()))
                      .filter((row) => row.some((cell) => cell))
                  )
                }
                rows="4"
                className="input-field"
                placeholder="Value 1|Value 2|Value 3"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={block.data.url || ''}
              onChange={(e) => handleDataChange('url', e.target.value)}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Alt Text
            </label>
            <input
              type="text"
              value={block.data.alt || ''}
              onChange={(e) => handleDataChange('alt', e.target.value)}
              className="input-field"
              placeholder="Image description"
            />
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={block.data.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                className="input-field"
                placeholder="Click here"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Link
              </label>
              <input
                type="url"
                value={block.data.link || ''}
                onChange={(e) => handleDataChange('link', e.target.value)}
                className="input-field"
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card mb-4 border-l-4 border-primary">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-gray-700 capitalize">{block.type}</span>
        <button
          onClick={() => onRemove()}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">{renderBlockEditor()}</div>
    </div>
  );
}
