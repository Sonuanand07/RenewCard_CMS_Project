import AdminLayout from '../../components/AdminLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import BlockEditor from '../../components/BlockEditor';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getPage, updatePage, publishPage, unpublishPage } from '../../store/slices/pagesSlice';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { slugify } from '../../utils/helpers';

export default function EditPagePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { currentPage, isLoading } = useSelector((state) => state.pages);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    blocks: [],
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
  });

  const [blockType, setBlockType] = useState('header');

  useEffect(() => {
    if (id) {
      dispatch(getPage(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPage) {
      setFormData({
        title: currentPage.title || '',
        slug: currentPage.slug || '',
        description: currentPage.description || '',
        blocks: currentPage.blocks || [],
        status: currentPage.status || 'draft',
        seoTitle: currentPage.seoTitle || '',
        seoDescription: currentPage.seoDescription || '',
        seoKeywords: currentPage.seoKeywords || [],
      });
    }
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddBlock = () => {
    const newBlock = {
      type: blockType,
      data: {},
      order: formData.blocks.length,
    };

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

    const result = await dispatch(updatePage({ id, data: formData }));
    if (result.payload) {
      toast.success('Page updated successfully');
    } else {
      toast.error('Failed to update page');
    }
  };

  const handlePublish = () => {
    dispatch(publishPage(id)).then((result) => {
      if (result.payload) {
        toast.success('Page published successfully');
      } else {
        toast.error('Failed to publish page');
      }
    });
  };

  const handleUnpublish = () => {
    dispatch(unpublishPage(id)).then((result) => {
      if (result.payload) {
        toast.success('Page unpublished successfully');
      } else {
        toast.error('Failed to unpublish page');
      }
    });
  };

  if (!currentPage) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Loading...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="section-title">Edit Page: {formData.title}</h1>
            <div className="flex gap-2">
              {formData.status === 'published' ? (
                <button
                  onClick={handleUnpublish}
                  className="btn-secondary"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  className="btn-primary"
                >
                  Publish
                </button>
              )}
            </div>
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
                  placeholder="page-slug"
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
                {isLoading ? 'Saving...' : 'Save Changes'}
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
