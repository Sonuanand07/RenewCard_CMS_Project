import AdminLayout from '../../components/AdminLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import BlockEditor from '../../components/BlockEditor';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { createPage } from '../../store/slices/pagesSlice';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { slugify } from '../../utils/helpers';

export default function CreatePagePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((state) => state.pages);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    blocks: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
  });

  const [blockType, setBlockType] = useState('header');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'title' && !formData.slug && { slug: slugify(value) }),
    });
  };

  const handleAddBlock = () => {
    const newBlock = {
      type: blockType,
      data: {},
      order: formData.blocks.length,
    };

    // Initialize data based on block type
    switch (blockType) {
      case 'header':
      case 'paragraph':
        newBlock.data = { text: '' };
        break;
      case 'richtext':
        newBlock.data = { html: '' };
        break;
      case 'list':
        newBlock.data = { items: [] };
        break;
      case 'equation':
        newBlock.data = { equation: '', displayMode: false };
        break;
      case 'table':
        newBlock.data = { headers: [], rows: [] };
        break;
      case 'image':
        newBlock.data = { url: '', alt: '' };
        break;
      case 'cta':
        newBlock.data = { text: '', link: '' };
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      blocks: [...formData.blocks, newBlock],
    });
  };

  const handleUpdateBlock = (index, updatedBlock) => {
    const newBlocks = [...formData.blocks];
    newBlocks[index] = updatedBlock;
    setFormData({
      ...formData,
      blocks: newBlocks,
    });
  };

  const handleRemoveBlock = (index) => {
    setFormData({
      ...formData,
      blocks: formData.blocks.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error('Please fill in title and slug');
      return;
    }

    if (formData.blocks.length === 0) {
      toast.error('Please add at least one block');
      return;
    }

    const result = await dispatch(createPage(formData));
    if (result.payload) {
      toast.success('Page created successfully');
      router.push('/pages');
    } else {
      toast.error('Failed to create page');
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="section-title">Create New Page</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="auto-generated from title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field"
                  placeholder="Enter page description"
                />
              </div>
            </div>

            {/* SEO Information */}
            <div className="card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Page title for search engines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field"
                  placeholder="Meta description for search engines"
                />
              </div>
            </div>

            {/* Content Blocks */}
            <div className="card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Blocks</h2>

              <div className="flex gap-2 mb-4">
                <select
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="header">Header</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="richtext">Rich Text</option>
                  <option value="list">List</option>
                  <option value="equation">Equation (LaTeX)</option>
                  <option value="table">Table</option>
                  <option value="image">Image</option>
                  <option value="cta">Call to Action</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddBlock}
                  className="btn-primary"
                >
                  Add Block
                </button>
              </div>

              {formData.blocks.length > 0 && (
                <div className="space-y-4">
                  {formData.blocks.map((block, index) => (
                    <BlockEditor
                      key={index}
                      block={block}
                      onChange={(updatedBlock) => handleUpdateBlock(index, updatedBlock)}
                      onRemove={() => handleRemoveBlock(index)}
                    />
                  ))}
                </div>
              )}

              {formData.blocks.length === 0 && (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  No blocks added yet. Add your first block to get started.
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Page'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
