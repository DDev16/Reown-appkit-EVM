'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BlogFormData, AlertState } from '@/types/blog';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

const ADMIN_ADDRESS = '0xd0cfD2e3Be2D49976D870898fcD6fE94Dbc98f37';

const AdminBlogForm = () => {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        content: '',
        image: null
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertState>({ type: '', message: '' });

    // Check if user is admin
    const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                image: e.target.files![0]
            }));
        }
    };

    const resetForm = (): void => {
        setFormData({
            title: '',
            content: '',
            image: null
        });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!isAdmin) {
            setAlert({
                type: 'error',
                message: 'Unauthorized: Only admin can create posts'
            });
            return;
        }

        if (!storage || !db) {
            setAlert({
                type: 'error',
                message: 'Storage is not initialized'
            });
            return;
        }

        setLoading(true);
        setAlert({ type: '', message: '' });

        try {
            let imageUrl: string | undefined;

            if (formData.image) {
                const safeFileName = formData.image.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const imagePath = `blog-images/${Date.now()}-${address}-${safeFileName}`;
                const imageRef = ref(storage, imagePath);
                const uploadResult = await uploadBytes(imageRef, formData.image);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            await addDoc(collection(db, 'posts'), {
                title: formData.title,
                content: formData.content,
                imageUrl,
                createdAt: new Date(),
                authorAddress: address
            });

            setAlert({
                type: 'success',
                message: 'Blog post created successfully!'
            });
            resetForm();
            router.refresh(); // Refresh the page to show new content
        } catch (error) {
            console.error('Error creating post:', error);
            setAlert({
                type: 'error',
                message: 'Failed to create blog post. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Alert>
                    <AlertDescription>
                        Please connect your wallet to access admin features
                    </AlertDescription>
                </Alert>
                <div className="mt-4 flex justify-center">
                    <appkit-button></appkit-button>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Alert variant="destructive">
                    <AlertDescription>
                        Unauthorized: Only admin wallet can access this area
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>

            {alert.message && (
                <Alert className={`mb-4 ${alert.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
                    <AlertDescription>
                        {alert.message}
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        rows={8}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image (Optional)
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
};

export default AdminBlogForm;