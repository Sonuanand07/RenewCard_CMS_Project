'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function BlockRenderer({ blocks = [] }) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const renderBlock = (block) => {
    switch (block.type) {
      case 'header':
        return (
          <h2 key={block._id} className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
            {block.data.text}
          </h2>
        );

      case 'paragraph':
        return (
          <p key={block._id} className="text-base leading-7 text-gray-700 mb-6">
            {block.data.text}
          </p>
        );

      case 'richtext':
        return (
          <div
            key={block._id}
            className="prose prose-lg max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: block.data.html }}
          />
        );

      case 'list':
        return (
          <ul key={block._id} className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            {block.data.items?.map((item, index) => (
              <li key={index} className="text-base">{item}</li>
            ))}
          </ul>
        );

      case 'equation':
        const { equation, displayMode } = block.data;
        return (
          <div key={block._id} className="my-6 p-6 bg-gray-50 rounded-lg overflow-x-auto">
            {displayMode ? (
              <div className="flex justify-center">
                <BlockMath math={equation} />
              </div>
            ) : (
              <p className="text-sm text-gray-600 font-mono">
                <span className="font-semibold">Formula:</span> <InlineMath math={equation} />
              </p>
            )}
          </div>
        );

      case 'table':
        const { headers, rows } = block.data;
        return (
          <div key={block._id} className="overflow-x-auto my-6 border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers?.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700 bg-gray-50"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows?.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'image':
        return (
          <div key={block._id} className="my-6">
            <img
              src={block.data.url}
              alt={block.data.alt || 'Image'}
              className="w-full rounded-lg shadow-lg"
            />
            {block.data.alt && (
              <p className="text-sm text-gray-600 text-center mt-2">{block.data.alt}</p>
            )}
          </div>
        );

      case 'cta':
        return (
          <div key={block._id} className="my-8 p-8 bg-primary rounded-lg text-center">
            <a
              href={block.data.link}
              className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {block.data.text}
            </a>
          </div>
        );

      default:
        return (
          <div key={block._id} className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200 mb-6">
            <strong>Unknown block type:</strong> {block.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {sortedBlocks.length > 0 ? (
        sortedBlocks.map((block) => renderBlock(block))
      ) : (
        <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600">
          No content available
        </div>
      )}
    </div>
  );
}
