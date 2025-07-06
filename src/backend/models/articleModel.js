import mongoose, { Schema } from "mongoose";

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String }, //Tóm tắt bài viết
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    thumbnail: { type: String },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isLike: { type: Array, default: [] },
    dislikes: { type: Number, default: 0 },
    isDisLike: { type: Array, default: [] },
    isAbout: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() }
})

const articleModel = mongoose.models.article || mongoose.model('article', articleSchema);

export default articleModel