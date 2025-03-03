'use client';
//app\admin\dashboard\blog\page.tsx
import { useState, FormEvent } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function BlogForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Tags handling
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const handleAddTag = () => {
        if (tagInput.trim()) {
            // Split by commas and handle multiple tags at once
            const newTags = tagInput
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '' && !tags.includes(tag));

            if (newTags.length > 0) {
                setTags([...tags, ...newTags]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let imageUrl = '';
            if (image) {
                // Create a reference with timestamp for uniqueness
                const safeFileName = image.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const imagePath = `blog-images/${Date.now()}-${safeFileName}`;
                const imageRef = ref(storage, imagePath);

                try {
                    console.log('Starting image upload...');
                    const uploadResult = await uploadBytes(imageRef, image);
                    console.log('Image uploaded, getting URL...');
                    imageUrl = await getDownloadURL(uploadResult.ref);
                    console.log('Got image URL:', imageUrl);
                } catch (uploadError: any) {
                    console.error('Upload error:', uploadError);
                    throw new Error(`Image upload failed: ${uploadError.message}`);
                }
            }

            // Create the post document with tags
            const postData = {
                title,
                content,
                imageUrl,
                tags: tags.length > 0 ? tags : ['General'], // Default to General if no tags
                createdAt: Timestamp.now()
            };

            console.log('Creating post with data:', postData);
            const docRef = await addDoc(collection(db, 'posts'), postData);
            console.log('Post created with ID:', docRef.id);

            // Reset form
            setTitle('');
            setContent('');
            setImage(null);
            setTags([]);
            setTagInput('');
            router.refresh();

        } catch (err: any) {
            console.error('Error creating post:', err);
            setError(err.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded h-40"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tags</label>
                    <div className="flex">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add tags (comma separated)"
                            className="w-full p-2 border rounded-l"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag, index) => (
                                <div key={index} className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 text-gray-600 hover:text-gray-900"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                        First tag will be used as the post category
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}